/* N37 U5 (E60): der Ablauf der Pruefungssimulation, DOM-frei. Gerechnet (Ziehen, Bewerten, Note) wird
   in `simulation.ts` und ist dort gegen die alte App getestet – hier nur, WIE der Ablauf sie verbindet. */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Frage } from "@/daten/typen";
import type { Lernstand } from "./stand";

const pruefung = { fragen: [] as Frage[], benutzt: ["X"] };
vi.mock("./simulation", () => ({
  bauePruefung: vi.fn(() => pruefung),
  vorschlagMinuten: vi.fn(() => 90),
  bewerte: vi.fn((fragen: Frage[]) => fragen.map((_, i) => i % 2 === 0)),
  ergebnis: vi.fn(() => ({ punkte: 50, gesamt: 100, prozent: 50, note: { note: 4 } })),
}));

import { bauePruefung } from "./simulation";
import {
  simSchritt, simStart, bereiteLauf, restZeit, startAnzahl, werteAus, type Lauf, type SimAktion,
} from "./simablauf";

const stand = (x: Record<string, unknown> = {}) => x as unknown as Lernstand;
const fragen = (n: number) => Array.from({ length: n }, (_, i) => ({ id: "F" + i }) as unknown as Frage);
const LAUF: Lauf = { fragen: fragen(3), antworten: {}, markiert: {}, idx: 0, dauerMin: 2, startTs: 1_000_000, punkte: [25, 25, 25, 25] };
const fahre = (...a: SimAktion[]) => a.reduce(simSchritt, simStart(stand()));

beforeEach(() => { pruefung.fragen = fragen(12); vi.mocked(bauePruefung).mockClear(); });

describe("simSchritt", () => {
  it("Start: Anzahl aus dem Lernstand, sonst 40", () => {
    expect(simStart(stand({ simAnzahl: 24 })).anzahl).toBe(24);
    expect(simStart(stand()).anzahl).toBe(40);
  });

  it("gestartet: Lauf da, Auswertung weg, Restzeit = Dauer", () => {
    const z = fahre({ art: "gestartet", lauf: LAUF });
    expect(z.lauf).toBe(LAUF);
    expect(z.fertig).toBeNull();
    expect(z.restSek).toBe(120);
  });

  it("antwort, sprung und marke wirken nur im Lauf – die Marke kippt an der gezeigten Frage", () => {
    const ohne = fahre({ art: "antwort", i: 0, antwort: 1 }, { art: "marke" }, { art: "sprung", i: 2 });
    expect(ohne).toEqual(simStart(stand()));
    const z = fahre({ art: "gestartet", lauf: LAUF }, { art: "antwort", i: 1, antwort: "b" },
      { art: "sprung", i: 2 }, { art: "marke" }, { art: "marke" }, { art: "sprung", i: 1 }, { art: "marke" });
    expect(z.lauf?.antworten).toEqual({ 1: "b" });
    expect(z.lauf?.markiert).toEqual({ 2: false, 1: true });
    expect(z.lauf?.idx).toBe(1);
  });

  it("⚠️ die Uhr laeuft nach der WANDUHR: ein verschluckter Tick holt sich die Zeit trotzdem", () => {
    const z = fahre({ art: "gestartet", lauf: LAUF }, { art: "tick", jetzt: LAUF.startTs + 61_500 });
    expect(z.restSek).toBe(59);
    expect(restZeit(LAUF, LAUF.startTs + 120_000)).toBe(0);
  });

  it("abgegeben: Auswertung da, Lauf weg; neu: zurueck zum Start", () => {
    const a = werteAus(LAUF, 30);
    const z = fahre({ art: "gestartet", lauf: LAUF }, { art: "abgegeben", auswertung: a });
    expect(z.lauf).toBeNull();
    expect(z.fertig).toBe(a);
    expect(simSchritt(z, { art: "neu" }).fertig).toBeNull();
  });

  it("veraendert den alten Zustand nicht (React darf den Reducer zweimal rufen)", () => {
    const z = fahre({ art: "gestartet", lauf: LAUF });
    const kopie = structuredClone(z);
    simSchritt(z, { art: "antwort", i: 0, antwort: 1 });
    simSchritt(z, { art: "marke" });
    expect(z).toEqual(kopie);
  });
});

describe("Helfer", () => {
  it("startAnzahl: 12..80, leer → 40", () => {
    expect([0, 5, 12, 44, 80, 99, NaN].map(startAnzahl)).toEqual([40, 12, 12, 44, 80, 80, 40]);
  });

  it("bereiteLauf: begrenzt die Anzahl, Dauer aus simDauerMin, sonst aus den Richtwerten", () => {
    const b = bereiteLauf(stand({ simDauerMin: 30 }), 200, [20, 30, 25, 25], [], [], 5);
    expect(vi.mocked(bauePruefung).mock.calls[0]?.[1]).toBe(80);
    expect(b).toMatchObject({ n: 80, benutzt: ["X"], lauf: { dauerMin: 30, startTs: 5, idx: 0, punkte: [20, 30, 25, 25] } });
    expect(bereiteLauf(stand(), 40, [], [], [], 0)?.lauf.dauerMin).toBe(90);
  });

  it("bereiteLauf: unter 8 Fragen gibt es keine Pruefung", () => {
    pruefung.fragen = fragen(7);
    expect(bereiteLauf(stand(), 40, [], [], [], 0)).toBeNull();
  });

  it("werteAus: benoetigte Zeit = Dauer minus Restzeit, nie negativ", () => {
    expect(werteAus(LAUF, 30).zeitSek).toBe(90);
    expect(werteAus(LAUF, -5).zeitSek).toBe(120);
    expect(werteAus(LAUF, 30).korrekt).toEqual([true, false, true]);
  });
});
