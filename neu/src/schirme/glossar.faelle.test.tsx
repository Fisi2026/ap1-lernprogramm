// @vitest-environment jsdom
/* Das Glossar allein (Prop `stand`): welcher Reiter gewaehlt aussieht, Tor-Satz in Einzahl und Mehrzahl,
   Suchfeld je Reiter, Aufklappen bei der Suche und Zuklappen beim Leeren, Reiterwechsel setzt zurueck.
   Das Tor und die Listen pruefen auch glossar.jsdom.test.tsx (ueber die App). */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Glossar } from "./Glossar";
import { FRAGEN } from "@/daten/laden";
import { leererStand, type Lernstand } from "@/kern/stand";
import { CONFIG } from "@/kern/tabellen/konfig";
import { begriffe, abkuerzungen, passendeBegriffe, passendeAbk } from "@/kern/glossar";

afterEach(cleanup);

const BEGRIFFE = begriffe(FRAGEN);
const ABK = abkuerzungen();
const mitAntworten = (n: number): Lernstand =>
  ({ ...leererStand(), statistik: { M01: { richtig: n, gesamt: n } } }) as Lernstand;
const FREI = mitAntworten(CONFIG.gate + 1);
const nutzer = () => userEvent.setup({ delay: null });
const reiter = () => within(screen.getByRole("group", { name: "Glossar-Teile" }));
const eintraege = () => [...document.querySelectorAll('[data-slot="accordion-item"]')];
const offene = () => eintraege().filter((e) => e.getAttribute("data-state") === "open");
const variante = (e: HTMLElement) => e.getAttribute("data-variant");

describe("Reiter", () => {
  it("'Begriffe' ist zuerst gewaehlt, 'Abkuerzungen' danach auf Klick - und wieder zurueck", async () => {
    const n = nutzer();
    render(<Glossar stand={FREI} />);
    const begriffeKnopf = reiter().getByRole("button", { name: `Begriffe (${BEGRIFFE.length})` });
    const abkKnopf = reiter().getByRole("button", { name: `Abkürzungen (${ABK.length})` });
    expect([variante(begriffeKnopf), variante(abkKnopf)]).toEqual(["default", "outline"]);
    await n.click(abkKnopf);
    expect([variante(begriffeKnopf), variante(abkKnopf)]).toEqual(["outline", "default"]);
    expect(eintraege()).toHaveLength(0);
    await n.click(begriffeKnopf);
    expect([variante(begriffeKnopf), variante(abkKnopf)]).toEqual(["default", "outline"]);
    expect(eintraege()).toHaveLength(BEGRIFFE.length);
  });

  it("das Suchfeld traegt je Reiter seinen Namen und Platzhalter", async () => {
    const n = nutzer();
    render(<Glossar stand={FREI} />);
    expect((screen.getByLabelText("Begriff suchen") as HTMLInputElement).placeholder).toBe("Begriff oder Definition durchsuchen …");
    await n.click(reiter().getByRole("button", { name: /Abkürzungen/ }));
    expect((screen.getByLabelText("Abkürzung suchen") as HTMLInputElement).placeholder)
      .toBe("Kürzel, Langform, Definition oder Kategorie durchsuchen …");
    expect(screen.queryByLabelText("Begriff suchen")).toBeNull();
  });

  it("Wechsel loescht die Suche und klappt alles zu", async () => {
    const n = nutzer();
    render(<Glossar stand={FREI} />);
    await n.type(screen.getByLabelText("Begriff suchen"), BEGRIFFE[0]!.term);
    expect(offene().length).toBeGreaterThan(0);
    await n.click(reiter().getByRole("button", { name: /Abkürzungen/ }));
    expect((screen.getByLabelText("Abkürzung suchen") as HTMLInputElement).value).toBe("");
    await n.click(reiter().getByRole("button", { name: /Begriffe/ }));
    expect((screen.getByLabelText("Begriff suchen") as HTMLInputElement).value).toBe("");
    expect(offene()).toHaveLength(0);
    expect(eintraege()).toHaveLength(BEGRIFFE.length);
  });
});

describe("Tor", () => {
  it("noch eine Frage: Einzahl; mehrere: Mehrzahl; kein Abkuerzungs-Reiter", () => {
    render(<Glossar stand={mitAntworten(CONFIG.gate)} />);
    expect(screen.getByText(/Abkürzungen: noch 1 Frage bis zur Freischaltung/)).toBeTruthy();
    expect(reiter().queryByRole("button", { name: /Abkürzungen/ })).toBeNull();
    cleanup();
    render(<Glossar stand={mitAntworten(CONFIG.gate - 1)} />);
    expect(screen.getByText(/Abkürzungen: noch 2 Fragen bis zur Freischaltung/)).toBeTruthy();
  });
});

describe("Suche", () => {
  it("Treffer klappen auf, ein Leerzeichen allein oder ein geleertes Feld klappt alles wieder zu", async () => {
    const n = nutzer();
    render(<Glossar stand={FREI} />);
    const feld = screen.getByLabelText("Begriff suchen");
    const ziel = BEGRIFFE[0]!.term;
    await n.type(feld, ziel);
    const erwartet = passendeBegriffe(BEGRIFFE, ziel);
    expect(eintraege()).toHaveLength(erwartet.length);
    expect(offene()).toHaveLength(erwartet.length);
    await n.clear(feld);
    expect(eintraege()).toHaveLength(BEGRIFFE.length);
    expect(offene()).toHaveLength(0);
    await n.type(feld, "   ");
    expect(offene()).toHaveLength(0);
  });

  it("jeder Eintrag nennt Begriff und Modul; aufgeklappt steht die Definition da", async () => {
    const n = nutzer();
    render(<Glossar stand={FREI} />);
    const erster = eintraege()[0] as HTMLElement;
    expect(erster.querySelector('[data-slot="badge"]')!.textContent).toBe(BEGRIFFE[0]!.modul);
    expect(erster.querySelector('[data-slot="accordion-trigger"]')!.textContent).toContain(BEGRIFFE[0]!.term);
    await n.click(erster.querySelector('[data-slot="accordion-trigger"]')!);
    expect(eintraege()[0]!.textContent).toContain(BEGRIFFE[0]!.def.slice(0, 30));
  });

  it("Abkuerzungen: Suche filtert ueber Kuerzel/Langform/Definition/Kategorie, ohne Treffer der Leer-Hinweis", async () => {
    const n = nutzer();
    render(<Glossar stand={FREI} />);
    await n.click(reiter().getByRole("button", { name: /Abkürzungen/ }));
    const karten = () => document.querySelectorAll(".font-mono.text-\\[0\\.9375rem\\]");
    expect(karten()).toHaveLength(ABK.length);
    const a = ABK[0]!;
    await n.type(screen.getByLabelText("Abkürzung suchen"), a.kurz);
    expect(karten()).toHaveLength(passendeAbk(ABK, a.kurz).length);
    expect(screen.getByText(a.lang)).toBeTruthy();
    await n.clear(screen.getByLabelText("Abkürzung suchen"));
    await n.type(screen.getByLabelText("Abkürzung suchen"), "qqxyzqq");
    expect(screen.getByText(/Dazu steht hier nichts/)).toBeTruthy();
    expect(karten()).toHaveLength(0);
  });
});
