// @vitest-environment jsdom
/* ============================================================================
   DAS GLOSSAR ÜBER DEN SCHIRM

   ⛔⛔ GEMESSEN WIRD IN DER APP, NICHT DANEBEN — über die Werkzeugschiene, weil
      genau dort der Bereich bisher "noch nicht gebaut" sagte.
   ⚠️ DAS TOR VOR DEN ABKUERZUNGEN wird in BEIDEN Lagen gefahren: zu und offen.
      Ein Tor, das man nur geschlossen sieht, ist nicht geprueft.
   ============================================================================ */
import { CONFIG } from "../kern/tabellen/konfig.ts";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { begriffe, abkuerzungen } from "@/kern/glossar";
import { FRAGEN } from "@/daten/laden";

const BEGRIFFE = begriffe(FRAGEN);
const ABK = abkuerzungen();
const TOR = CONFIG.gate;

/** Ein gespeicherter Stand mit genau n beantworteten Fragen. */
function mitAntworten(n: number) {
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
    version: 1, statistik: { M01: { richtig: n, gesamt: n } },
  }));
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

async function zumGlossar(nutzer: ReturnType<typeof userEvent.setup>) {
  await nutzer.click(screen.getByRole("button", { name: "Glossar" }));
}
const reiter = () => within(screen.getByRole("group", { name: "Glossar-Teile" }));
/* ⚠️ Seit P6 ein `Accordion` statt `<details>` (N25 P6a): der Zustand steht als
   `data-state` am Eintrag, und ein zugeklappter Eintrag haengt seine Definition
   AUS dem DOM - genau das prueft der zweite Fall unten. */
const eintraege = () => Array.from(document.querySelectorAll('[data-slot="accordion-item"]'));
const istOffen = (d: Element) => d.getAttribute("data-state") === "open";
const knopf = (d: Element) => d.querySelector('[data-slot="accordion-trigger"]') as HTMLElement;

describe("Das Begriffslexikon", () => {
  it("zeigt jeden Begriff des Bestands, zugeklappt", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);
    expect(screen.queryByText(/noch nicht gebaut/)).toBeNull();

    expect(BEGRIFFE.length).toBeGreaterThan(50);
    expect(eintraege().length).toBe(BEGRIFFE.length);
    expect(eintraege().filter(istOffen).length).toBe(0);
    expect(knopf(eintraege()[0]).textContent).toContain(BEGRIFFE[0].term);
  });

  it("zeigt die Definition erst beim Aufklappen — und dann die aus dem Bestand", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);
    const erste = eintraege()[0];
    expect(istOffen(erste)).toBe(false);
    /* zugeklappt steht die Definition NICHT im DOM - schaerfer als bei <details> */
    expect(erste.textContent).not.toContain(BEGRIFFE[0].def.slice(0, 30));
    await nutzer.click(knopf(erste));
    expect(istOffen(eintraege()[0])).toBe(true);
    expect(eintraege()[0].textContent).toContain(BEGRIFFE[0].def.slice(0, 30));
  });

  it("laesst bei der Suche nur Treffer stehen und klappt sie auf", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);
    const ziel = BEGRIFFE[0].term;
    await nutzer.type(screen.getByLabelText("Begriff suchen"), ziel);

    expect(eintraege().length).toBeLessThan(BEGRIFFE.length);
    expect(eintraege().length).toBeGreaterThan(0);
    expect(eintraege().every(istOffen)).toBe(true);
    expect(eintraege()[0].textContent).toContain(ziel);
  });

  it("laesst einen Treffer waehrend der Suche wieder zuklappen", async () => {
    /* ⛔ NEU MIT P6a, UND DER GRUND FUER DEN ZUSTAND IM SCHIRM: waeren die Treffer
       im Render erzwungen offen, bliebe jeder Klick wirkungslos. Mit `<details>`
       ging das Zuklappen, weil der Browser den Zustand hielt - das Accordion haelt
       ihn nicht von selbst. **Ohne diese Zusicherung faellt es niemandem auf.** */
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);
    await nutzer.type(screen.getByLabelText("Begriff suchen"), BEGRIFFE[0].term);
    expect(eintraege().every(istOffen)).toBe(true);
    const vorher = eintraege().length;
    await nutzer.click(knopf(eintraege()[0]));
    expect(eintraege().length, "die Liste bleibt stehen").toBe(vorher);
    expect(istOffen(eintraege()[0])).toBe(false);
  });

  it("sagt es, wenn nichts passt — statt eine leere Seite zu zeigen", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);
    await nutzer.type(screen.getByLabelText("Begriff suchen"), "qqxyzqq");
    expect(screen.getByText(/Dazu steht hier nichts/)).toBeTruthy();
    expect(eintraege().length).toBe(0);
  });
});

describe("Das Tor vor den Abkuerzungen", () => {
  it("bleibt zu und sagt, wie viele Fragen noch fehlen", async () => {
    mitAntworten(TOR - 5);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);

    expect(reiter().queryByRole("button", { name: /Abkürzungen/ })).toBeNull();
    expect(screen.getByText(/noch 6 Fragen bis zur Freischaltung/)).toBeTruthy();
  });

  it("geht auf, sobald genug beantwortet ist — und zeigt dann alle Abkuerzungen", async () => {
    mitAntworten(TOR + 1);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);

    await nutzer.click(reiter().getByRole("button", { name: /Abkürzungen/ }));
    expect(ABK.length).toBeGreaterThan(100);
    expect(screen.getByText(ABK[0].kurz)).toBeTruthy();
    expect(screen.getByText(ABK[0].lang)).toBeTruthy();
    /* Die Abkuerzungen stehen NICHT im Accordion — hier ist nichts zuzuklappen. */
    expect(eintraege().length).toBe(0);
  });

  it("sucht bei den Abkuerzungen auch ueber die Langform", async () => {
    mitAntworten(TOR + 1);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);
    await nutzer.click(reiter().getByRole("button", { name: /Abkürzungen/ }));

    const ziel = ABK.find((a) => a.lang.length > 8)!;
    await nutzer.type(screen.getByLabelText("Abkürzung suchen"), ziel.lang);
    expect(screen.getByText(ziel.kurz)).toBeTruthy();
    expect(screen.queryAllByText(ABK[0].lang).length).toBe(ziel.kurz === ABK[0].kurz ? 1 : 0);
  });

  it("raeumt die Suche beim Reiterwechsel weg — sonst sucht man im Leeren", async () => {
    mitAntworten(TOR + 1);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGlossar(nutzer);
    await nutzer.type(screen.getByLabelText("Begriff suchen"), "qqxyzqq");
    expect(screen.getByText(/Dazu steht hier nichts/)).toBeTruthy();

    await nutzer.click(reiter().getByRole("button", { name: /Abkürzungen/ }));
    expect((screen.getByLabelText("Abkürzung suchen") as HTMLInputElement).value).toBe("");
    expect(screen.getByText(ABK[0].kurz)).toBeTruthy();
  });
});
