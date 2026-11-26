// @vitest-environment jsdom
/* Der Statistik-Schirm allein, mit gebauten Staenden: jede Kachel und jede Gebietszeile.
   (Die Verdrahtung in der App und die Kopfzeile pruefen statistik.jsdom.test.tsx; die Rechnung
   selbst kern/kennzahlen.) Erwartet wird hier, was auf dem Schirm steht, nicht wie es entsteht. */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { Statistik } from "./Statistik";
import { leererStand, type Lernstand } from "@/kern/stand";
import { bereitschaft, kennzahlen } from "@/kern/kennzahlen";

afterEach(cleanup);

const heute = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const stand = (extra: Partial<Lernstand> = {}): Lernstand => ({ ...leererStand(), ...extra } as Lernstand);
const kachel = (titel: string) => screen.getByText(titel).closest('[data-slot="card"]') as HTMLElement;
const wertVon = (titel: string) => kachel(titel).querySelector("b") as HTMLElement;
const fussVon = (titel: string) => [...kachel(titel).querySelectorAll("span")].at(-1)!.textContent;

/** Antworten in einem Feinthema von M01: der Anteil richtig steuert die Ampel. */
const mitQuote = (richtig: number, gesamt: number) => stand({
  statistik: { M01: { richtig, gesamt }, "T:M01:Netzplan & Puffer": { richtig, gesamt } },
});

describe("Kachel 'Bereitschaft gesamt'", () => {
  it("ohne Antwort: Strich, keine Farbe, 'noch keine Antwort'", () => {
    render(<Statistik stand={stand()} />);
    expect(wertVon("Bereitschaft gesamt").textContent).toBe("—");
    expect(wertVon("Bereitschaft gesamt").className).not.toMatch(/text-(chart|destructive)/);
    expect(fussVon("Bereitschaft gesamt")).toBe("noch keine Antwort");
  });

  it.each([
    [10, 10, "gruen", "text-chart-1"],
    [7, 10, "gelb", "text-chart-4"],
    [1, 10, "rot", "text-destructive"],
  ])("%i von %i richtig: Ampel %s faerbt die Zahl (%s)", (r, g, ampel, klasse) => {
    const s = mitQuote(r, g);
    const b = bereitschaft(s);
    expect(b.gesamt.ampel, "Ausgangslage des Falls").toBe(ampel);
    render(<Statistik stand={s} />);
    expect(wertVon("Bereitschaft gesamt").textContent).toBe(`${b.gesamt.score} %`);
    expect(wertVon("Bereitschaft gesamt").className).toContain(klasse);
    expect(fussVon("Bereitschaft gesamt")).toBe(`${b.gesamt.antworten} Antworten in ${b.gesamt.themen} Themen`);
  });
});

describe("Kachel 'Heute'", () => {
  it.each([
    [3, 5, "3 / 5", "Tagesziel"],
    [5, 5, "5 / 5", "Tagesziel erreicht"],
    [7, 5, "7 / 5", "Tagesziel erreicht"],
    [0, 5, "0 / 5", "Tagesziel"],
    [0, 0, "0 / 0", "Tagesziel"],
    [4, 0, "4 / 0", "Tagesziel"],
  ])("%i von Ziel %i: '%s', Fuss '%s'", (n, ziel, wert, fuss) => {
    render(<Statistik stand={stand({ dailyCounts: { [heute()]: n }, tagesziel: ziel })} />);
    expect(wertVon("Heute").textContent).toBe(wert);
    expect(fussVon("Heute")).toBe(fuss);
  });
});

describe("Kachel 'Fehler-Deck'", () => {
  it("nichts im Deck: 0, 'nichts fällig', keine Warnfarbe", () => {
    render(<Statistik stand={stand()} />);
    expect(wertVon("Fehler-Deck").textContent).toBe("0");
    expect(fussVon("Fehler-Deck")).toBe("nichts fällig");
    expect(wertVon("Fehler-Deck").className).not.toContain("text-destructive");
  });

  it("zwei im Deck, eine davon faellig: '2', '1 jetzt fällig', Warnfarbe", () => {
    const s = stand({ fehlerDeck: {
      "M01-001": { streak: 0, due: Date.now() - 86400000 },
      "M01-002": { streak: 0, due: Date.now() + 5 * 86400000 },
    } });
    expect(kennzahlen(s).faellig, "Ausgangslage").toBe(1);
    render(<Statistik stand={s} />);
    expect(wertVon("Fehler-Deck").textContent).toBe("2");
    expect(fussVon("Fehler-Deck")).toBe("1 jetzt fällig");
    expect(wertVon("Fehler-Deck").className).toContain("text-destructive");
  });

  it("im Deck, aber noch nichts faellig: keine Warnfarbe", () => {
    render(<Statistik stand={stand({ fehlerDeck: { "M01-002": { streak: 0, due: Date.now() + 5 * 86400000 } } })} />);
    expect(wertVon("Fehler-Deck").textContent).toBe("1");
    expect(fussVon("Fehler-Deck")).toBe("nichts fällig");
    expect(wertVon("Fehler-Deck").className).not.toContain("text-destructive");
  });
});

describe("Kachel 'Beantwortet'", () => {
  it("ohne Antwort: 0 und 'noch keine Quote'", () => {
    render(<Statistik stand={stand()} />);
    expect(wertVon("Beantwortet").textContent).toBe("0");
    expect(fussVon("Beantwortet")).toBe("noch keine Quote");
  });

  it("mit Antworten: Anzahl und Quote in Prozent", () => {
    render(<Statistik stand={stand({ statistik: { M01: { richtig: 7, gesamt: 10 } } })} />);
    expect(wertVon("Beantwortet").textContent).toBe("10");
    expect(fussVon("Beantwortet")).toBe("70 % richtig");
  });
});

describe("Gebietstabelle", () => {
  it("ein Gebiet mit Antworten zeigt Balken und 'Quote % · Antworten' in Ampelfarbe, die anderen 'noch nichts geübt' und einen Strich", () => {
    const s = mitQuote(9, 10);
    const g = bereitschaft(s).gebiete[0]!;
    render(<Statistik stand={s} />);
    const zeile = screen.getAllByRole("row").find((r) => within(r).queryByText(g.code))!;
    const zellen = within(zeile).getAllByRole("cell");
    expect(zellen[3]!.textContent).toBe(`${g.score} % · ${g.antworten}`);
    expect(zellen[3]!.className).toContain("text-chart-1");
    expect(zellen[3]!.className).not.toContain("text-muted-foreground");
    const balken = zellen[2]!.querySelector('[data-slot="progress-indicator"]') as HTMLElement;
    expect(balken.style.transform).toBe(`translateX(-${100 - g.score!}%)`);
    expect(within(zeile).queryByText("noch nichts geübt")).toBeNull();

    const leer = screen.getAllByRole("row").filter((r) => within(r).queryByText("noch nichts geübt"));
    expect(leer).toHaveLength(7);
    for (const r of leer) {
      const z = within(r).getAllByRole("cell");
      expect(z[3]!.textContent).toBe("—");
      expect(z[3]!.className).toContain("text-muted-foreground");
      expect(z[2]!.querySelector('[data-slot="progress-indicator"]')).toBeNull();
    }
  });

  it("ein Gebiet mit Wert 0 bekommt einen Balken auf 0 (anders als 'ohne Antwort')", () => {
    const s = mitQuote(0, 10);
    const g = bereitschaft(s).gebiete[0]!;
    expect(g.score).toBe(0);
    render(<Statistik stand={s} />);
    const zeile = screen.getAllByRole("row").find((r) => within(r).queryByText(g.code))!;
    const balken = within(zeile).getAllByRole("cell")[2]!.querySelector('[data-slot="progress-indicator"]') as HTMLElement;
    expect(balken.style.transform).toBe("translateX(-100%)");
    expect(within(zeile).getAllByRole("cell")[3]!.className).toContain("text-destructive");
  });
});
