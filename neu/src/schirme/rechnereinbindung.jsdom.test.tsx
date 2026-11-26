// @vitest-environment jsdom
/* ============================================================================
   DER TASCHENRECHNER IN DER APP (N26 T4)

   ⛔ Gemessen in der App, nicht daneben: Adresse `#frage=ID`, echte Karte,
      echter Lernstand im localStorage. Nutzer-Entscheide 22.09.2026: wie alt -
      Klappe, startet zu, `panelOffen.rechner` im Lernstand; nur rechenassistent,
      kalkulation und Zufallsaufgaben; nicht im Rechen-Generator-Schirm.
      (Die Simulation hat eine eigene Datei: sie braucht ein vi.mock.)
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { FRAGEN } from "@/daten/laden";
import { leererStand, LS_SCHLUESSEL } from "@/kern/stand";
import type { Lernstand } from "@/kern/stand";
import { arten, aufgabeDerArt } from "@/kern/generator";
import { Zufallskarte } from "./Zufallskarte";
import { rechnerOffen, setzeRechnerOffen, RECHNER_TEXTE, RECHNER_TYPEN } from "@/kern/rechnertasten";

const RA = FRAGEN.filter((f) => f.typ === "rechenassistent");
const KA = FRAGEN.find((f) => f.typ === "kalkulation")!;
const MC = FRAGEN.find((f) => f.typ === "mc")!;

const legeStand = (extra: Record<string, unknown>) =>
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), ...extra }));
const gespeichert = () => JSON.parse(localStorage.getItem(LS_SCHLUESSEL) || "{}") as Record<string, unknown>;
const klappe = () => screen.queryByRole("button", { name: RECHNER_TEXTE.titel });
const tasten = () => screen.queryByRole("group", { name: "Tasten" });

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", location.pathname); });

function oeffne(id: string) {
  history.replaceState(null, "", "#frage=" + id);
  const nutzer = userEvent.setup({ delay: null });
  render(<App />);
  return nutzer;
}

describe("Die Klappe steht bei den Rechen-Typen - und nur dort", () => {
  it("rechenassistent: Klappe da, startet ZU, die Tasten sind verborgen", () => {
    expect(RA.length).toBeGreaterThan(1);
    oeffne(RA[0]!.id);
    expect(klappe()!.getAttribute("aria-expanded")).toBe("false");
    expect(tasten()).toBeNull();
  });
  it("kalkulation: Klappe da", () => {
    oeffne(KA.id);
    expect(klappe()).toBeTruthy();
  });
  it("mc: keine Klappe", () => {
    oeffne(MC.id);
    expect(screen.getByText(MC.frage)).toBeTruthy();       // die Frage ist wirklich da
    expect(klappe()).toBeNull();
  });
  it("die Liste der Typen ist genau die der alten App (ohne generator, den haengt die Zufallskarte an)", () => {
    expect([...RECHNER_TYPEN].sort()).toEqual(["kalkulation", "rechenassistent"]);
  });
  it("Zufallsaufgabe beim Ueben: Klappe da", () => {
    const stand = leererStand() as Lernstand;
    const aufgabe = aufgabeDerArt(stand, arten(stand)[0]!)!;
    render(<Zufallskarte aufgabe={aufgabe} nummer={1} />);
    expect(klappe()).toBeTruthy();
  });
  it("Rechen-Generator-Schirm: KEINE Klappe (alt dort auch nicht)", async () => {
    history.replaceState(null, "", "#ueben");
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Rechen-Generator" }));
    const leiste = within(screen.getByRole("group", { name: "Aufgabenarten" }));
    await nutzer.click(leiste.getAllByRole("button")[0]!);
    expect(screen.getByRole("button", { name: "Lösung prüfen" })).toBeTruthy();   // eine Aufgabe steht da
    expect(klappe()).toBeNull();
  });
});

describe("Offen oder zu - gemerkt wie alt in panelOffen.rechner", () => {
  it("aufklappen schreibt true, bleibt nach neuem Laden offen, zuklappen entfernt den Schluessel", async () => {
    const nutzer = oeffne(RA[0]!.id);
    await nutzer.click(klappe()!);
    expect(klappe()!.getAttribute("aria-expanded")).toBe("true");
    expect(tasten()).toBeTruthy();
    expect((gespeichert().panelOffen as Record<string, unknown>).rechner).toBe(true);
    cleanup();
    render(<App />);
    expect(klappe()!.getAttribute("aria-expanded")).toBe("true");
    await nutzer.click(klappe()!);
    expect(tasten()).toBeNull();
    expect(Object.keys(gespeichert().panelOffen as object)).not.toContain("rechner");
  });
  it("ein Stand der alten App mit panelOffen.rechner = 1 oeffnet die Klappe", () => {
    legeStand({ panelOffen: { rechner: 1 } });
    oeffne(RA[0]!.id);
    expect(klappe()!.getAttribute("aria-expanded")).toBe("true");
  });
  it("die Regel einzeln: Standard zu, Wahrheitswert zaehlt, andere Klappen bleiben", () => {
    const s = leererStand() as Lernstand;
    expect(rechnerOffen(s)).toBe(false);
    expect(rechnerOffen({ ...s, panelOffen: { rechner: 0 } })).toBe(false);
    const auf = setzeRechnerOffen({ ...s, panelOffen: { tagesziel: true } }, true);
    expect(auf.panelOffen).toEqual({ tagesziel: true, rechner: true });
    expect(setzeRechnerOffen(auf, false).panelOffen).toEqual({ tagesziel: true });
  });
});

describe("Was der Rechner behaelt - und was nicht", () => {
  it("zuklappen behaelt Eingabe und Notiz (wie <details> alt)", async () => {
    const nutzer = oeffne(RA[0]!.id);
    await nutzer.click(klappe()!);
    await nutzer.click(within(tasten()!).getByRole("button", { name: "7" }));
    await nutzer.type(screen.getByRole("textbox", { name: RECHNER_TEXTE.notizen }), "Zwischenwert");
    await nutzer.click(klappe()!);
    await nutzer.click(klappe()!);
    expect((screen.getByRole("textbox", { name: RECHNER_TEXTE.anzeige }) as HTMLInputElement).value).toBe("7");
    expect((screen.getByRole("textbox", { name: RECHNER_TEXTE.notizen }) as HTMLTextAreaElement).value).toBe("Zwischenwert");
  });
  it("die Notiz verfaellt beim Fragenwechsel", async () => {
    const nutzer = oeffne(RA[0]!.id);
    await nutzer.click(klappe()!);
    await nutzer.type(screen.getByRole("textbox", { name: RECHNER_TEXTE.notizen }), "Zwischenwert");
    await act(async () => {
      history.replaceState(null, "", "#frage=" + RA[1]!.id);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(await screen.findByText(new RegExp(`· ${RA[1]!.id}$`))).toBeTruthy();   // die neue Frage steht da
    expect((screen.getByRole("textbox", { name: RECHNER_TEXTE.notizen }) as HTMLTextAreaElement).value).toBe("");
  });
});
