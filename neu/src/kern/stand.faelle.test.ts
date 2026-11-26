/* N43 M3 Rest (17.10.2026): gebaute Grenzfaelle fuer `stand.ts`, die `stand.test.ts` nicht trifft – exakte Vorgaben,
   je Art die Grenze, Inhaltsregeln, Startfassung der Wanderung, Sicherung und Laden/Speichern an den Raendern. */
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DEFEKT_SCHLUESSEL, LS_SCHLUESSEL, leererStand, lade, migriere, pruefe, sichere, sicherungen, siebe, speichere,
  type Migration,
} from "./stand";

function ablage(start: Record<string, string> = {}, sperre?: string, lesesperre?: string) {
  const m = new Map(Object.entries(start));
  return {
    m,
    getItem: (k: string) => { if (k === lesesperre) throw new Error("gesperrt"); return m.has(k) ? m.get(k)! : null; },
    setItem: (k: string, v: string) => { if (k === sperre) throw new Error("voll"); m.set(k, v); },
  } as unknown as Storage & { m: Map<string, string> };
}
const JETZT = Date.UTC(2026, 9, 17, 20, 0, 0);
const ISO = new Date(JETZT).toISOString();
const mit = (teil: Record<string, unknown>) => ({ ...leererStand(), ...teil }) as unknown as Record<string, unknown>;

afterEach(() => { vi.unstubAllGlobals(); });

describe("leererStand – die Vorgaben", () => {
  it("Listen leer, Texte leer, Schalter wie vorgegeben", () => {
    const s = leererStand();
    expect(s.lastShown).toEqual([]);
    expect(s.antworten).toEqual([]);
    expect(s.module).toEqual([]);
    expect(s.simUsedIds).toEqual([]);
    expect(s.pruefungsdatum).toBe("");
    expect(s.serieDone).toBe("");
    expect(s.lastTyp).toBe("");
    expect(s.glossarTip).toBe(true);
    expect(s.markierenAn).toBe(false);
  });
});

describe("pruefe – Grenzen je Art", () => {
  it("objekt: null und Liste werden zur Vorgabe, mit ihrer Art in der Meldung", () => {
    expect(pruefe(mit({ notizen: null })).reparaturen).toEqual(["Feld „notizen“ war null statt objekt – Vorgabe gesetzt"]);
    expect(pruefe(mit({ notizen: [] })).reparaturen).toEqual(["Feld „notizen“ war Liste statt objekt – Vorgabe gesetzt"]);
    expect(pruefe(mit({ notizen: 3 })).reparaturen).toEqual(["Feld „notizen“ war number statt objekt – Vorgabe gesetzt"]);
  });
  it("zahl: Kommazahl und negative Zahl gelten, Unendlich und Text nicht", () => {
    expect(pruefe(mit({ tagesziel: 2.5, level: -1 })).reparaturen).toEqual([]);
    expect(pruefe(mit({ level: Infinity })).reparaturen).toHaveLength(1);
    expect(pruefe(mit({ level: NaN })).reparaturen).toHaveLength(1);
    expect(pruefe(mit({ level: "3" })).reparaturen).toHaveLength(1);
  });
  it("ganz: nur ganze Zahlen ab 0", () => {
    expect(pruefe(mit({ rev: 0 })).reparaturen).toEqual([]);
    for (const rev of [-1, 1.5, "1", Infinity]) expect(pruefe(mit({ rev })).reparaturen, String(rev)).toHaveLength(1);
  });
  it("text nimmt kein null, textOderNull nimmt null und Text, aber keine Zahl", () => {
    expect(pruefe(mit({ pruefungsdatum: null })).reparaturen).toHaveLength(1);
    expect(pruefe(mit({ theme: null })).reparaturen).toEqual([]);
    expect(pruefe(mit({ theme: "dunkel" })).stand.theme).toBe("dunkel");
    expect(pruefe(mit({ theme: 5 })).reparaturen).toHaveLength(1);
  });
  it("die Fassung wird nie als fehlend oder falsch gemeldet", () => {
    const ohne = mit({});
    delete ohne.version;
    expect(pruefe(ohne).reparaturen).toEqual([]);
    expect(pruefe(mit({ version: "x" })).reparaturen).toEqual([]);
  });
});

describe("pruefe – Inhaltsregeln", () => {
  it("themaLevel: Unendlich und Text als Wert werden verworfen", () => {
    const p = pruefe(mit({ themaLevel: { a: 2, b: Infinity, c: "3" } }));
    expect(p.stand.themaLevel).toEqual({ a: 2 });
    expect(p.reparaturen).toEqual(["Feld „themaLevel“: 2 Einträge in unbekannter Form – verworfen"]);
  });
  it("fehlerDeck: streak UND due muessen Zahlen sein; null faellt", () => {
    const p = pruefe(mit({ fehlerDeck: { a: { streak: 1, due: 2 }, b: { streak: "x", due: 2 }, c: { streak: 1 }, d: null } }));
    expect(p.stand.fehlerDeck).toEqual({ a: { streak: 1, due: 2 } });
  });
  it("siebe laesst Werte, die weder Liste noch Objekt sind, unveraendert", () => {
    expect(siebe("x", () => false)).toEqual({ wert: "x", verworfen: 0 });
    expect(siebe(5, () => false)).toEqual({ wert: 5, verworfen: 0 });
  });
});

describe("migriere – Startfassung", () => {
  const kette: Record<number, Migration> = { 1: (s) => ({ ...s, eins: true }) };
  it("ohne gueltige Fassung (0, Kommazahl, Text) beginnt die Kette bei 1", () => {
    for (const version of [0, 1.5, "2", -3]) {
      const w = migriere({ version }, kette, 2);
      expect(w.schritte, String(version)).toEqual([1]);
      expect(w.fehlt, String(version)).toBeUndefined();
    }
  });
});

describe("Sicherung", () => {
  it("eine leere Ablage bekommt den ersten Eintrag", () => {
    const a = ablage();
    expect(sichere(a, "roh1", "unlesbar", JETZT)).toBe(true);
    expect(JSON.parse(a.m.get(DEFEKT_SCHLUESSEL)!)).toEqual([{ zeit: ISO, grund: "unlesbar", roh: "roh1" }]);
  });
  it("derselbe Text hintereinander: true, aber kein zweiter Eintrag", () => {
    const a = ablage();
    sichere(a, "r", "g", JETZT);
    expect(sichere(a, "r", "g", JETZT + 1)).toBe(true);
    expect(JSON.parse(a.m.get(DEFEKT_SCHLUESSEL)!)).toHaveLength(1);
  });
  it("fremder Inhalt unter dem Schluessel wird als Eintrag „unbekannt“ bewahrt", () => {
    const voll = { zeit: "z", grund: "g", roh: "r" };
    for (const fremd of ["kaputt{", "{}", JSON.stringify([{ zeit: "z", grund: "g" }]), JSON.stringify([voll, { zeit: "z" }])]) {
      const a = ablage({ [DEFEKT_SCHLUESSEL]: fremd });
      sichere(a, "neu", "repariert", JETZT);
      expect(JSON.parse(a.m.get(DEFEKT_SCHLUESSEL)!), fremd).toEqual([
        { zeit: "", grund: "unbekannt", roh: fremd }, { zeit: ISO, grund: "repariert", roh: "neu" },
      ]);
    }
  });
  it("sicherungen zeigt nur Eintraege in voller Form; Unlesbares ergibt eine leere Liste", () => {
    const gut = { zeit: "z", grund: "g", roh: "r" };
    const liste = [gut, { grund: "g", roh: "r" }, { zeit: "z", grund: 1, roh: "r" }, { zeit: "z", grund: "g", roh: 2 }, null, "x"];
    expect(sicherungen(ablage({ [DEFEKT_SCHLUESSEL]: JSON.stringify(liste) }))).toEqual([gut]);
    expect(sicherungen(ablage({ [DEFEKT_SCHLUESSEL]: "{}" }))).toEqual([]);
    expect(sicherungen(ablage({ [DEFEKT_SCHLUESSEL]: "kaputt{" }))).toEqual([]);
    expect(sicherungen(ablage())).toEqual([]);
  });
});

describe("lade und speichere an den Raendern", () => {
  it("ein leerer Text ist leer, nicht kaputt – ohne Reparaturen", () => {
    const e = lade(ablage({ [LS_SCHLUESSEL]: "" }), JETZT);
    expect(e.befund).toBe("leer");
    expect(e.reparaturen).toEqual([]);
    expect(e.gewandert).toEqual([]);
  });
  it("wirft nur das Lesen des Stands: unlesbar, nichts gesichert, nicht schreiben", () => {
    const a = ablage({}, undefined, LS_SCHLUESSEL);
    const e = lade(a, JETZT);
    expect(e).toMatchObject({ befund: "unlesbar", gesichert: false, schreibenErlaubt: false });
    expect(a.m.has(DEFEKT_SCHLUESSEL)).toBe(false);
  });
  it("ein Stand aus einer neueren Fassung wandert nicht", () => {
    const e = lade(ablage({ [LS_SCHLUESSEL]: JSON.stringify(mit({ version: 99 })) }), JETZT);
    expect(e.gewandert).toEqual([]);
  });
  it("speichere: true und geschrieben; wirft der Speicher, false", () => {
    const a = ablage();
    expect(speichere(leererStand(), a)).toBe(true);
    expect(JSON.parse(a.m.get(LS_SCHLUESSEL)!)).toEqual(leererStand());
    expect(speichere(leererStand(), ablage({}, LS_SCHLUESSEL))).toBe(false);
  });
  it("ohne localStorage: lade unlesbar, speichere false, keine Sicherungen", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(lade(undefined, JETZT)).toMatchObject({ befund: "unlesbar", schreibenErlaubt: false });
    expect(speichere(leererStand())).toBe(false);
    expect(sicherungen()).toEqual([]);
  });
});
