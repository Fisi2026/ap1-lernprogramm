/* „Kann ich schon“ (Nutzer-Wunsch 25.11.2026, kern/gekonnt.ts): gebucht wie richtig, ausgeblendet aus
   Üben, Themen-Serie, Tagesserie und Fehler-Deck, zurückholbar; der alte Stand wandert ohne Reparatur. */
import { describe, it, expect } from "vitest";
import { FRAGEN, frageMitId } from "@/daten/laden";
import { leererStand, lade, LS_SCHLUESSEL, STAND_VERSION } from "./stand";
import type { Lernstand } from "./stand";
import { kandidaten } from "./auswahl";
import { faelligeAusDeck, type Ziehkontext } from "./ziehen";
import { baueTagesserie, schwaechstesGebiet } from "./tagesserie";
import { serienKandidaten } from "./serie";
import {
  istGekonnt, setzeGekonnt, ueberspringe, holeZurueck, holeAlleZurueck, gekonnteIds, verwaisteGekonnte,
  gekonnteArten, genSchluessel, istArtGekonnt,
} from "./gekonnt";
import { arten, aufgabeDerArt, ueberspringeZufall, zufallsaufgabe } from "./generator";

const JETZT = Date.UTC(2026, 10, 25, 10, 0, 0);
const nachId = (id: string) => frageMitId(id);

describe("Buchen und Ausblenden", () => {
  it("ueberspringe bucht wie eine richtige Antwort und blendet die Pool-Kennung aus", () => {
    const f = FRAGEN.find((x) => x.modul === "M04" && x.thema)!;
    const s = ueberspringe(leererStand(), f, f.id, JETZT);
    expect(s.statistik[f.modul]).toEqual({ richtig: 1, gesamt: 1 });
    expect(s.statistik["T:" + f.modul + ":" + f.thema]).toEqual({ richtig: 1, gesamt: 1 });
    expect(s.antworten).toEqual([{ richtig: true }]);
    expect(Object.values(s.dailyCounts)).toEqual([1]);
    expect(s.fehlerDeck[f.id]).toBeUndefined();
    expect(s.gekonnt).toEqual({ [f.id]: JETZT });
    expect(istGekonnt(s, f.id)).toBe(true);
  });
  it("setzeGekonnt (nach der Antwort) bucht nichts", () => {
    const s = setzeGekonnt(leererStand(), "M01-001", JETZT);
    expect(s.statistik).toEqual({});
    expect(s.antworten).toEqual([]);
    expect(s.gekonnt).toEqual({ "M01-001": JETZT });
  });
  it("zurueckholen je Frage und alle; verwaiste werden gezeigt, nicht still verworfen", () => {
    const [a, b] = FRAGEN;
    let s = setzeGekonnt(setzeGekonnt(setzeGekonnt(leererStand(), a!.id, 1), b!.id, 2), "WEG-1", 3);
    expect(gekonnteIds(s, nachId)).toEqual([b!.id, a!.id]);   // zuletzt uebersprungen zuerst
    expect(verwaisteGekonnte(s, nachId)).toEqual(["WEG-1"]);
    s = holeZurueck(s, b!.id);
    expect(gekonnteIds(s, nachId)).toEqual([a!.id]);
    expect(holeAlleZurueck(s).gekonnt).toEqual({});
  });
});

describe("Die Ziehungen lassen gekonnte Fragen aus", () => {
  it("kandidaten (Üben): die gekonnte faellt raus, alle anderen bleiben", () => {
    const vorher = kandidaten(leererStand(), FRAGEN);
    const id = vorher[0]!;
    const nachher = kandidaten(setzeGekonnt(leererStand(), id, JETZT), FRAGEN);
    expect(nachher).not.toContain(id);
    /* ⚠️ Gemessen 25.11.: nachher kann MEHR enthalten – faellt ein Thema unter
       `CONFIG.stufeMinKandidaten`, rueckt die Nachbarstufe nach (Entscheid 09.09.2026). Gewollt. */
    for (const x of vorher) if (x !== id) expect(nachher).toContain(x);
  });
  it("Themen-Serie: keine gekonnte Frage in den Kandidaten", () => {
    const f = nachId(kandidaten(leererStand(), FRAGEN)[0]!)!;
    const vorher = serienKandidaten(leererStand(), FRAGEN, nachId, f);
    expect(vorher.length).toBeGreaterThan(0);
    const s = setzeGekonnt(leererStand(), vorher[0]!, JETZT);
    expect(serienKandidaten(s, FRAGEN, nachId, f)).not.toContain(vorher[0]);
  });
  it("Fehler-Deck: eine faellige, aber gekonnte Frage wird nicht gezogen", () => {
    const id = FRAGEN.find((x) => x.modul !== "M09")!.id;
    const s: Lernstand = { ...leererStand(), fehlerDeck: { [id]: { streak: 0, due: JETZT - 1 } } as Lernstand["fehlerDeck"] };
    const k = (st: Lernstand): Ziehkontext => ({ stand: st, alle: FRAGEN, nachId, letzteThemen: [], serie: [], heute: JETZT });
    expect(faelligeAusDeck(k(s), () => true)).toEqual([id]);
    expect(faelligeAusDeck(k(setzeGekonnt(s, id, JETZT)), () => true)).toEqual([]);
  });
  it("Tagesserie: sind alle Fragen des Gebiets gekonnt, ist die Serie leer", () => {
    const st = leererStand();
    const gebiet = schwaechstesGebiet(st, FRAGEN);
    const imGebiet = FRAGEN.filter((f) => f.gebiet === gebiet).map((f) => f.id);
    expect(baueTagesserie(st, FRAGEN, () => 0.5).ids.length).toBe(5);
    const alle = { ...st, gekonnt: Object.fromEntries(imGebiet.map((id) => [id, JETZT])) };
    expect(baueTagesserie(alle, FRAGEN, () => 0.5).ids).toEqual([]);
    const eine = setzeGekonnt(st, imGebiet[0]!, JETZT);
    for (let i = 0; i < 20; i++) expect(baueTagesserie(eine, FRAGEN).ids).not.toContain(imGebiet[0]);
  });
});

describe("Wanderung v1 -> v2", () => {
  function ablage(t: string): Storage {
    const m = new Map([[LS_SCHLUESSEL, t]]);
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); },
             removeItem: (k: string) => { m.delete(k); } } as unknown as Storage;
  }
  it("ein Stand der Fassung 1 (ohne gekonnt) laedt OHNE Reparatur und ohne Sicherung", () => {
    const alt: Record<string, unknown> = { ...leererStand(), version: 1, level: 3 };
    delete alt.gekonnt;
    const r = lade(ablage(JSON.stringify(alt)), JETZT);
    expect(r.reparaturen).toEqual([]);
    expect(r.gesichert).toBe(false);
    expect(r.gewandert).toEqual([1]);
    expect(r.stand.gekonnt).toEqual({});
    expect(r.stand.level).toBe(3);
    expect(r.stand.version).toBe(STAND_VERSION);
  });
  it("ein kaputter Eintrag in gekonnt faellt einzeln, die guten bleiben", () => {
    const t = JSON.stringify({ ...leererStand(), gekonnt: { a: 5, b: "x" } });
    const r = lade(ablage(t), JETZT);
    expect(r.stand.gekonnt).toEqual({ a: 5 });
    expect(r.reparaturen).toEqual(["Feld „gekonnt“: 1 Eintrag in unbekannter Form – verworfen"]);
  });
});

/* Rechenaufgaben mit Zufallswerten (Nutzer-Entscheid 25.11.2026, BUILD_LOG 278): die ART wird ausgeblendet. */
describe("Kann ich schon – Rechenaufgaben-Arten (GEN:<art>)", () => {
  const ALLE_ARTEN = arten(leererStand());
  it("Pool-Kennungen tragen kein ':' – kein Zusammenstoss mit GEN:-Schluesseln", () => {
    expect(FRAGEN.filter((f) => f.id.includes(":"))).toEqual([]);
    expect(ALLE_ARTEN.length).toBeGreaterThan(2);
  });
  it("ueberspringeZufall bucht wie die Karte richtig (GEN:-Zeile und Modul, kein Fehler-Deck) und blendet die Art aus", () => {
    const a = aufgabeDerArt(leererStand(), ALLE_ARTEN[0]!)!;
    const s = ueberspringeZufall(leererStand(), a, JETZT);
    expect(s.statistik["GEN:" + a.generator]).toEqual({ richtig: 1, gesamt: 1 });
    expect(s.statistik[a.modul]).toEqual({ richtig: 1, gesamt: 1 });
    expect(s.fehlerDeck).toEqual({});
    expect(s.gekonnt).toEqual({ [genSchluessel(a.generatorArt)]: JETZT });
    expect(istArtGekonnt(s, a.generatorArt)).toBe(true);
  });
  it("bekannte Art: gelistet, nicht verwaist; unbekannte Art: verwaist (Lehre N10)", () => {
    const s = setzeGekonnt(setzeGekonnt(leererStand(), genSchluessel(ALLE_ARTEN[0]!), 1), "GEN:gibtsnicht", 2);
    expect(gekonnteArten(s)).toEqual([ALLE_ARTEN[0]]);
    expect(verwaisteGekonnte(s, nachId)).toEqual(["GEN:gibtsnicht"]);
    expect(gekonnteIds(s, nachId)).toEqual([]);
    const m = new Map([[LS_SCHLUESSEL, JSON.stringify(s)]]);
    const r = lade({ getItem: (k: string) => m.get(k) ?? null, setItem: () => {}, removeItem: () => {} } as unknown as Storage, JETZT);
    expect(r.stand.gekonnt).toEqual(s.gekonnt);   // ohne Migration, ohne Reparatur
    expect(r.reparaturen).toEqual([]);
  });
  it("Üben streut eine ausgeblendete Art nie mehr ein; alle aus -> keine Zufallsaufgabe; Rechen-Generator zeigt alle", () => {
    const bleibt = ALLE_ARTEN[ALLE_ARTEN.length - 1]!;
    let s = leererStand();
    for (const a of ALLE_ARTEN) if (a !== bleibt) s = setzeGekonnt(s, genSchluessel(a), 1);
    for (let i = 0; i < 40; i++) expect(zufallsaufgabe(s, () => i / 40)!.generatorArt).toBe(bleibt);
    s = setzeGekonnt(s, genSchluessel(bleibt), 2);
    expect(zufallsaufgabe(s)).toBeNull();
    expect(arten(s)).toEqual(ALLE_ARTEN);
    expect(arten(holeZurueck(s, genSchluessel(bleibt)))).toEqual(ALLE_ARTEN);
    expect(zufallsaufgabe(holeZurueck(s, genSchluessel(bleibt)))!.generatorArt).toBe(bleibt);
  });
});
