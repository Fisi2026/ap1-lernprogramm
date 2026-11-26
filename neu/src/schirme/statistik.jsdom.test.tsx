// @vitest-environment jsdom
/* Der Kopf und der Statistik-Schirm zeigen GEMESSENE Zahlen.

   ⛔ ANLASS 14.09.2026: Der Kopf zeigte vier erfundene Zahlen ("12/20", "71 %",
      "8", "412 Tage"). Dieser Test haelt fest, dass sie jetzt aus dem Lernstand
      kommen — und dass ohne Grundlage NICHTS steht statt einer erfundenen Null. */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";

beforeEach(() => {
  localStorage.clear();
  cleanup();
  history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */
});

function kopf() {
  return screen.getByRole("banner");
}

describe("Der Kopf erfindet nichts mehr", () => {
  it("zeigt ohne Lernstand KEINE Trefferquote und KEINE Tage bis zur Pruefung", () => {
    render(<App />);
    const h = kopf();
    expect(within(h).queryByText(/Trefferquote/)).toBeNull();
    expect(within(h).queryByText(/Tage bis zur Prüfung/)).toBeNull();
    /* ⛔ die frueheren Erfindungen duerfen nirgends mehr stehen */
    expect(within(h).queryByText("71 %")).toBeNull();
    expect(within(h).queryByText("412")).toBeNull();
  });

  it("zeigt heute 0 von 20 — der Wert kommt aus dem Stand, nicht aus dem Entwurf", () => {
    render(<App />);
    expect(within(kopf()).getByText("0/20")).toBeTruthy();
  });

  it("zeigt die echten Zahlen, sobald ein Stand da ist", () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1,
      statistik: { M01: { richtig: 7, gesamt: 10 } },
      dailyCounts: { [tagesSchluessel()]: 6 },
      tagesziel: 25,
      pruefungsdatum: morgen(),
      fehlerDeck: { "M01-001": { streak: 0, due: Date.now() - 86400000 } },
    }));
    render(<App />);
    const h = kopf();
    /* +1, weil der Schirm beim Betreten eine Frage zieht — gebucht wird dabei nichts. */
    expect(within(h).getByText("6/25")).toBeTruthy();
    expect(within(h).getByText(/Trefferquote \(10\)/)).toBeTruthy();
    expect(within(h).getByText("70 %")).toBeTruthy();
    /* ⚠️ "1" steht zweimal im Kopf: als Tage bis zur Pruefung UND als faellige
       Karte im Fehler-Deck. Gesucht wird deshalb ueber die Beschriftung. */
    expect(within(h).getByText("Tage bis zur Prüfung")).toBeTruthy();
    expect(within(h).getAllByText("1").length).toBe(2);
    expect(within(h).getByText(/Fehler-Deck/)).toBeTruthy();
  });
});

describe("Der Statistik-Schirm", () => {
  it("zeigt ohne Antworten kein Ergebnis, sondern sagt es", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Statistik" }));

    expect(screen.getByText("Bereitschaft gesamt")).toBeTruthy();
    expect(screen.getByText("noch keine Antwort")).toBeTruthy();
    /* ⛔ Jedes Gebiet sagt "noch nichts geübt" statt einen Balken auf 0 zu zeigen. */
    expect(screen.getAllByText("noch nichts geübt").length).toBeGreaterThan(4);
    /* N25 P6b: die Gebietsliste ist eine Tabelle mit Kopf – Kopfzeile plus 8 Gebiete (ohne M09). */
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent))
      .toEqual(["Code", "Gebiet", "Bereitschaft", "Quote · Antworten"]);
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(9);
    expect(screen.getByText("noch keine Quote")).toBeTruthy();
  });

  it("rechnet die Bereitschaft je Gebiet, sobald Themen beantwortet sind", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1,
      statistik: {
        M01: { richtig: 9, gesamt: 10 },
        "T:M01:Netzplan & Puffer": { richtig: 9, gesamt: 10 },
      },
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Statistik" }));

    /* Ein Gebiet hat jetzt einen Wert, die anderen nicht — und das steht auch so da. */
    expect(screen.getAllByText(/%\s·\s10/).length).toBeGreaterThan(0);
    expect(screen.getByText(/1 Themen/)).toBeTruthy();
    expect(screen.queryByText("noch keine Antwort")).toBeNull();
  });
});

function tagesSchluessel(): string {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function morgen(): string {
  const d = new Date(Date.now() + 86400000);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
