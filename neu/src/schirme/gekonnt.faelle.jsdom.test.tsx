// @vitest-environment jsdom
/* „Kann ich schon“ an der Karteikarte (25.11.2026): vor der Antwort bucht es richtig, blendet aus und geht
   weiter; nach der Antwort nur ausblenden/zurückholen; ohne `ueberspringen` oder aus dem Verlauf kein Knopf. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAGEN } from "@/daten/laden";
import { leererStand, type Lernstand } from "@/kern/stand";
import type { MerkHaken } from "./Melden";
import { Karteikarte } from "./Karteikarte";
import { Markiert } from "./Markiert";
import type { StandHaken } from "@/huelle/useLernstand";
import { UebenKarte } from "./Ueben";
import { uebenSchritt, UEBEN_START } from "@/kern/uebenablauf";
import { arten, aufgabeDerArt, artName } from "@/kern/generator";

afterEach(cleanup);
const MC = FRAGEN.find((f) => f.typ === "mc" && typeof f.loesungIndex === "number")!;
const nutzer = () => userEvent.setup({ delay: null });
function merk(teil: Partial<Lernstand> = {}) {
  const aendere = vi.fn();
  return { m: { stand: { ...leererStand(), abrufAn: false, ...teil }, aendere } as MerkHaken, aendere };
}

describe("Kann ich schon – vor der Antwort", () => {
  it("bucht wie richtig, blendet die Pool-Kennung aus, meldet richtig und geht weiter", async () => {
    const { m, aendere } = merk();
    const buche = vi.fn(), weiter = vi.fn(), ergebnis = vi.fn();
    render(<Karteikarte frage={MC} nummer={1} merk={m} buche={buche} ueberspringen={weiter} aufErgebnis={ergebnis} />);
    await nutzer().click(screen.getByRole("button", { name: "Kann ich schon" }));
    expect(aendere).toHaveBeenCalledTimes(1);
    const s = aendere.mock.calls[0]![0](m.stand) as Lernstand;
    expect(Object.keys(s.gekonnt)).toEqual([MC.id]);
    expect(s.statistik[MC.modul]).toEqual({ richtig: 1, gesamt: 1 });
    expect(buche).not.toHaveBeenCalled();   // ein Schreiben, nicht zwei
    expect(ergebnis).toHaveBeenCalledWith(expect.objectContaining({ id: MC.id }), true);
    expect(weiter).toHaveBeenCalledTimes(1);
  });
  it("steht auch neben der Abruf-Übung", () => {
    const { m } = merk({ abrufAn: true });
    render(<Karteikarte frage={MC} nummer={1} merk={m} buche={vi.fn()} ueberspringen={vi.fn()} abruf />);
    expect(screen.getByRole("button", { name: /Optionen zeigen/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Kann ich schon" })).toBeTruthy();
  });
  it("ohne `ueberspringen` (Einzelfrage, Klausurvorbereitung) und aus dem Verlauf gibt es keinen Knopf", () => {
    const { m } = merk();
    render(<Karteikarte frage={MC} nummer={1} merk={m} buche={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Kann ich schon" })).toBeNull();
    cleanup();
    /* ⚠️ MIT `buche`: sonst sperrte schon das fehlende Buchen, nicht der Verlauf (Sabotage 25.11. blieb gruen). */
    render(<Karteikarte frage={MC} nummer={1} merk={m} herkunft="verlauf" buche={vi.fn()} ueberspringen={vi.fn()} antwortAusVerlauf={0} />);
    expect(screen.queryByRole("button", { name: "Kann ich schon" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Nicht mehr zeigen" })).toBeNull();
  });
});

describe("Nicht mehr zeigen – nach der Antwort", () => {
  it("blendet nur aus (bucht nichts dazu) und zeigt dann Zurückholen", async () => {
    const { m, aendere } = merk();
    const buche = vi.fn(), weiter = vi.fn();
    const { rerender } = render(<Karteikarte frage={MC} nummer={1} merk={m} buche={buche} ueberspringen={weiter} />);
    expect(screen.queryByRole("button", { name: "Nicht mehr zeigen" })).toBeNull();
    await nutzer().click(screen.getByRole("button", { name: "Aufgeben" }));
    expect(buche).toHaveBeenCalledTimes(1);   // das Aufgeben selbst
    expect(screen.queryByRole("button", { name: "Kann ich schon" })).toBeNull();
    const knopf = screen.getByRole("button", { name: "Nicht mehr zeigen" });
    expect(knopf.getAttribute("aria-pressed")).toBe("false");
    await nutzer().click(knopf);
    const s = aendere.mock.calls.at(-1)![0](m.stand) as Lernstand;
    expect(Object.keys(s.gekonnt)).toEqual([MC.id]);
    expect(s.statistik).toEqual({});
    expect(weiter).not.toHaveBeenCalled();
    rerender(<Karteikarte frage={MC} nummer={1} merk={{ ...m, stand: s }} buche={buche} ueberspringen={weiter} />);
    const zurueck = screen.getByRole("button", { name: "Wird nicht mehr gezeigt – zurückholen" });
    expect(zurueck.getAttribute("aria-pressed")).toBe("true");
    await nutzer().click(zurueck);
    expect((aendere.mock.calls.at(-1)![0](s) as Lernstand).gekonnt).toEqual({});
  });
});

describe("Übersprungen in „Markierte Fragen“", () => {
  const [A, B] = [FRAGEN[0]!, FRAGEN[1]!];
  function haken(gekonnt: Record<string, unknown>) {
    const aendere = vi.fn();
    const stand = { ...leererStand(), abrufAn: false, gekonnt } as Lernstand;
    return { h: { stand, aendere, buche: vi.fn() } as unknown as StandHaken, aendere, stand };
  }
  it("leer: Zahl 0, kein Zurückholen", () => {
    render(<Markiert lernstand={haken({}).h} />);
    expect(screen.getByRole("heading", { name: "Übersprungen (0)" })).toBeTruthy();
    expect(screen.getByText("Noch nichts übersprungen.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /zurückholen/i })).toBeNull();
  });
  it("je Frage zurückholen, alle zurückholen; verwaiste Kennung wird genannt und mitgezählt", async () => {
    const { h, aendere, stand } = haken({ [A.id]: 1, [B.id]: 2, "WEG-1": 3 });
    render(<Markiert lernstand={h} />);
    expect(screen.getByRole("heading", { name: "Übersprungen (3)" })).toBeTruthy();
    const liste = document.querySelector('[data-teil="uebersprungen-liste"]') as HTMLElement;
    expect(within(liste).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("WEG-1")).toBeTruthy();
    await nutzer().click(screen.getByRole("button", { name: `${A.id} zurückholen` }));
    expect((aendere.mock.calls[0]![0](stand) as Lernstand).gekonnt).toEqual({ [B.id]: 2, "WEG-1": 3 });
    await nutzer().click(screen.getByRole("button", { name: "Alle 3 zurückholen" }));
    expect((aendere.mock.calls[1]![0](stand) as Lernstand).gekonnt).toEqual({});
  });
});

/* Rechenaufgaben mit Zufallswerten (Nutzer-Entscheid 25.11.2026, BUILD_LOG 278): „Diese Art ausblenden“.
   UebenKarte zeichnet die Karte fuer Üben UND Klausurvorbereitung – beide reichen `naechste` durch. */
describe("Kann ich schon – Zufallskarte", () => {
  const ART = arten(leererStand())[0]!;
  const AUFGABE = aufgabeDerArt(leererStand(), ART)!;
  const ablauf = uebenSchritt(UEBEN_START, { art: "gezogen", ergebnis: { art: "zufall", aufgabe: AUFGABE }, serieVerbraucht: false });
  function haken() {
    const aendere = vi.fn(), buche = vi.fn();
    const stand = { ...leererStand(), abrufAn: false } as Lernstand;
    return { h: { stand, aendere, buche } as unknown as StandHaken, aendere, buche, stand };
  }
  it("zählt als richtig, blendet die Art aus und zieht weiter – ein Schreiben", async () => {
    const { h, aendere, buche, stand } = haken();
    const weiter = vi.fn();
    render(<UebenKarte ablauf={ablauf} schritt={vi.fn()} lernstand={h} aufErgebnis={vi.fn()} naechste={weiter} />);
    await nutzer().click(screen.getByRole("button", { name: "Kann ich schon" }));
    expect(aendere).toHaveBeenCalledTimes(1);
    expect(buche).not.toHaveBeenCalled();
    const s = aendere.mock.calls[0]![0](stand) as Lernstand;
    expect(s.gekonnt).toEqual({ ["GEN:" + ART]: expect.any(Number) });
    expect(s.statistik["GEN:" + AUFGABE.generator]).toEqual({ richtig: 1, gesamt: 1 });
    expect(s.statistik[AUFGABE.modul]).toEqual({ richtig: 1, gesamt: 1 });
    expect(weiter).toHaveBeenCalledTimes(1);
  });
  it("ohne `naechste` kein Knopf", () => {
    render(<UebenKarte ablauf={ablauf} schritt={vi.fn()} lernstand={haken().h} aufErgebnis={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Kann ich schon" })).toBeNull();
  });
  it("„Übersprungen“ zeigt die Art als eigene Zeile, nicht als verwaist; Zurückholen entfernt nur sie", async () => {
    const aendere = vi.fn();
    const stand = { ...leererStand(), abrufAn: false, gekonnt: { ["GEN:" + ART]: 2, [FRAGEN[0]!.id]: 1 } } as Lernstand;
    render(<Markiert lernstand={{ stand, aendere, buche: vi.fn() } as unknown as StandHaken} />);
    expect(screen.getByRole("heading", { name: "Übersprungen (2)" })).toBeTruthy();
    expect(screen.getByText(`Rechenaufgabe: ${artName(ART)}`)).toBeTruthy();
    expect(screen.queryByText(/Ohne Frage im Bestand/)).toBeNull();
    await nutzer().click(screen.getByRole("button", { name: `Rechenaufgabe ${artName(ART)} zurückholen` }));
    expect((aendere.mock.calls[0]![0](stand) as Lernstand).gekonnt).toEqual({ [FRAGEN[0]!.id]: 1 });
  });
});
