// @vitest-environment jsdom
/* Ueben: die kleinen Teile einzeln (Warnungen, Serienzeile, Fussleiste) und der Schirm mit Fachreitern,
   gebautem Stand und leerer Auswahl. Ziehen, Buchen und Serie ueber die ganze App pruefen
   ueben.jsdom.test.tsx und die Dateien daneben. */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Ueben, Warnungen, Serienzeile, Fussleiste } from "./Ueben";
import { useLernstand, type StandHaken } from "@/huelle/useLernstand";
import { FRAGEN } from "@/daten/laden";
import { GEBIETE } from "@/daten/typen";
import { LS_SCHLUESSEL, leererStand, type Lernstand } from "@/kern/stand";
import { UEBEN_START, type UebenZustand } from "@/kern/uebenablauf";

afterEach(cleanup);
beforeEach(() => localStorage.clear());

const nutzer = () => userEvent.setup({ delay: null });
const haken = (extra: Partial<StandHaken>) => extra as StandHaken;
const zustand = (extra: Partial<UebenZustand>): UebenZustand => ({ ...UEBEN_START, ...extra });
const eintrag = (id: string) => ({ id, antwort: undefined });

describe("Warnungen", () => {
  it("ohne Fehler steht nichts da", () => {
    const { container } = render(<Warnungen lernstand={haken({ speicherFehler: false, befund: "ok" as never })} />);
    expect(container.textContent).toBe("");
  });
  it("Speicherfehler: sagt, dass nicht gespeichert wird", () => {
    render(<Warnungen lernstand={haken({ speicherFehler: true, befund: "ok" as never })} />);
    expect(screen.getByText(/nicht gespeichert/).parentElement!.textContent).toContain("Was du jetzt übst, geht beim Schließen verloren.");
    expect(screen.queryByText(/nicht lesbar/)).toBeNull();
  });
  it("unlesbarer Stand: sagt, dass mit leerem Stand weitergearbeitet wird", () => {
    render(<Warnungen lernstand={haken({ speicherFehler: false, befund: "unlesbar" })} />);
    expect(screen.getByText(/nicht lesbar/).parentElement!.textContent).toContain("es wird mit einem leeren Stand weitergearbeitet");
    expect(screen.queryByText(/nicht gespeichert/)).toBeNull();
  });
  it("beide Fehler: beide Hinweise", () => {
    render(<Warnungen lernstand={haken({ speicherFehler: true, befund: "unlesbar" })} />);
    expect(screen.getByText(/nicht gespeichert/)).toBeTruthy();
    expect(screen.getByText(/nicht lesbar/)).toBeTruthy();
  });
});

describe("Serienzeile", () => {
  it("laeuft eine Serie: Zahl der Restfragen, Einzahl bei einer", () => {
    const { rerender } = render(<Serienzeile ablauf={zustand({ serie: ["a", "b", "c"] })} schritt={() => {}} />);
    expect(screen.getByText("Themen-Serie läuft — noch 3 Fragen zu diesem Thema.")).toBeTruthy();
    rerender(<Serienzeile ablauf={zustand({ serie: ["a"] })} schritt={() => {}} />);
    expect(screen.getByText("Themen-Serie läuft — noch 1 Frage zu diesem Thema.")).toBeTruthy();
  });

  it("ein Angebot zeigt das Thema und startet auf Klick eine Serie aus den Kandidaten", async () => {
    const schritt = vi.fn();
    const frage = FRAGEN.find((f) => f.thema)!;
    const ids = FRAGEN.filter((f) => f.thema === frage.thema).slice(0, 4).map((f) => f.id);
    render(<Serienzeile ablauf={zustand({ angebot: { frage, ids } })} schritt={schritt} />);
    const knopf = screen.getByRole("button", { name: new RegExp(`Mehr zu diesem Thema üben \\(${frage.thema}\\)`) });
    await nutzer().click(knopf);
    expect(schritt).toHaveBeenCalledTimes(1);
    const aktion = schritt.mock.calls[0]![0] as { art: string; ids: string[] };
    expect(aktion.art).toBe("serieStarten");
    expect([...aktion.ids].sort()).toEqual([...ids].sort());
  });

  it("weder Serie noch Angebot: nichts zu sehen", () => {
    const { container } = render(<Serienzeile ablauf={zustand({})} schritt={() => {}} />);
    expect(container.textContent).toBe("");
  });
});

describe("Fussleiste", () => {
  const stand = (extra: Partial<Lernstand> = {}) => ({ ...leererStand(), ...extra }) as Lernstand;

  it("zaehlt Geuebtes; das Fehler-Deck nur, wenn es nicht leer ist", () => {
    const { rerender } = render(<Fussleiste ablauf={zustand({})} stand={stand({ uebenZaehler: 7 })} schritt={() => {}} naechste={() => {}} />);
    expect(screen.getByText("7 geübt")).toBeTruthy();
    expect(screen.queryByText(/im Fehler-Deck/)).toBeNull();
    rerender(<Fussleiste ablauf={zustand({})}
      stand={stand({ uebenZaehler: 7, fehlerDeck: { a: { streak: 0, due: 0 }, b: { streak: 0, due: 0 } } })}
      schritt={() => {}} naechste={() => {}} />);
    expect(screen.getByText(/7 geübt\s*·\s*2 im Fehler-Deck/)).toBeTruthy();
  });

  it("am Ende: 'Nächste Frage' ruft naechste; 'Zurück' nur, wenn es etwas davor gibt", async () => {
    const naechste = vi.fn();
    const schritt = vi.fn();
    const n = nutzer();
    const { rerender } = render(<Fussleiste ablauf={zustand({ verlauf: [eintrag("a")], idx: 0 })} stand={stand()} schritt={schritt} naechste={naechste} />);
    expect((screen.getByRole("button", { name: "← Zurück" }) as HTMLButtonElement).disabled).toBe(true);
    await n.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    expect(naechste).toHaveBeenCalledTimes(1);
    rerender(<Fussleiste ablauf={zustand({ verlauf: [eintrag("a"), eintrag("b")], idx: 1 })} stand={stand()} schritt={schritt} naechste={naechste} />);
    await n.click(screen.getByRole("button", { name: "← Zurück" }));
    expect(schritt).toHaveBeenCalledWith({ art: "zurueck" });
  });

  it("mitten im Verlauf: 'Zur aktuellen' statt 'Nächste Frage', und der Klick springt ans Ende", async () => {
    const naechste = vi.fn();
    const schritt = vi.fn();
    render(<Fussleiste ablauf={zustand({ verlauf: [eintrag("a"), eintrag("b"), eintrag("c")], idx: 1 })}
                       stand={stand()} schritt={schritt} naechste={naechste} />);
    expect(screen.queryByRole("button", { name: "Nächste Frage →" })).toBeNull();
    await nutzer().click(screen.getByRole("button", { name: "Zur aktuellen →" }));
    expect(schritt).toHaveBeenCalledWith({ art: "zurAktuellen" });
    expect(naechste).not.toHaveBeenCalled();
  });
});

describe("Der Schirm", () => {
  function Buehne() { return <Ueben lernstand={useLernstand()} />; }
  const legeStand = (extra: Record<string, unknown> = {}) =>
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), abrufAn: false, ...extra }));
  const gespeichert = () => JSON.parse(localStorage.getItem(LS_SCHLUESSEL) ?? "{}") as Record<string, unknown>;
  const reiter = () => screen.getAllByRole("tab");

  it("Fachreiter: 'Alles' plus ein Reiter je Gebiet des Pools (ohne Klausur), mit Kennung, Kurzname und Zahl", () => {
    legeStand();
    render(<Buehne />);
    const erwartet = GEBIETE.filter((g) => g.teil !== "M09");
    expect(reiter().map((r) => r.getAttribute("title") ?? r.textContent)).toEqual(["Alles", ...erwartet.map((g) => g.name)]);
    expect(screen.getByRole("tab", { name: "Alles" }).getAttribute("aria-selected")).toBe("true");
    const a1 = reiter().find((r) => r.getAttribute("title") === erwartet[0]!.name)!;
    expect(a1.textContent).toContain(erwartet[0]!.id);
    expect(a1.textContent).toContain(String(FRAGEN.filter((f) => f.gebiet === erwartet[0]!.id).length));
  });

  it("eine Luecke trennt AP1 von AP2 im Reiterband", () => {
    legeStand();
    render(<Buehne />);
    const faecher = GEBIETE.filter((g) => g.teil !== "M09");
    faecher.forEach((g, i) => {
      const r = reiter().find((x) => x.getAttribute("title") === g.name)!;
      const soll = i > 0 && faecher[i - 1]!.teil !== g.teil;
      expect(r.classList.contains("ml-3"), g.id).toBe(soll);
    });
  });

  it("ein Fach waehlen speichert es (ohne Themen), 'Alles' hebt es auf; der Reiter zeigt es", async () => {
    legeStand({ themen: ["irgendein Thema"] });
    const n = nutzer();
    render(<Buehne />);
    const b1 = reiter().find((r) => r.textContent!.includes("B1"))!;
    await n.click(b1);
    expect(gespeichert().gebiete).toEqual(["B1"]);
    expect(gespeichert().themen).toEqual([]);
    expect(b1.getAttribute("aria-selected")).toBe("true");
    await n.click(screen.getByRole("tab", { name: "Alles" }));
    expect(gespeichert().gebiete).toEqual([]);
    expect(screen.getByRole("tab", { name: "Alles" }).getAttribute("aria-selected")).toBe("true");
  });

  it("gibt es zur Auswahl keine Frage, sagt es das (und stuerzt nicht ab)", () => {
    legeStand({ themen: ["gibt es nicht"] });
    render(<Buehne />);
    expect(screen.getByText("Zu dieser Auswahl gibt es keine Frage. Wähle ein anderes Fach.")).toBeTruthy();
    expect(within(screen.getByRole("tabpanel")).queryByRole("button", { name: "Aufgeben" })).toBeNull();
  });
});
