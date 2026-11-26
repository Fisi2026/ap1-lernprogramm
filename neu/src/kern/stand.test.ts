/* N31: DER LERNSTAND DES NEUBAUS - Schluessel, Schema, Pruefung, Kette, Sicherung.
   Ersetzt `stand.gleichheit.test.ts` und `parallelbetrieb.jsdom.test.ts` (beide bewiesen
   das gemeinsame Format mit der alten App, das es seit E17 nicht mehr gibt). */
import { describe, it, expect } from "vitest";
import {
  LS_SCHLUESSEL, DEFEKT_SCHLUESSEL, ALT_SCHLUESSEL, STAND_VERSION, SCHEMA, MIGRATIONEN,
  leererStand, migriere, pruefe, lade, speichere, sicherungen, INHALT, siebe,
} from "./stand";
import type { Migration } from "./stand";

/** Ein Speicher zum Anfassen; `sperre` laesst setItem fuer einen Schluessel werfen. */
function ablage(start: Record<string, string> = {}, sperre?: string) {
  const m = new Map(Object.entries(start));
  return {
    m,
    get length() { return m.size; },
    clear: () => m.clear(),
    key: (i: number) => [...m.keys()][i] ?? null,
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    removeItem: (k: string) => { m.delete(k); },
    setItem: (k: string, v: string) => { if (k === sperre) throw new Error("voll"); m.set(k, v); },
  } as unknown as Storage & { m: Map<string, string> };
}
const JETZT = Date.UTC(2026, 8, 22, 20, 0, 0);
const roh = (s: unknown) => s as Record<string, unknown>;

describe("Schluessel und Fassung (E17)", () => {
  it("eigener Schluessel, Fassung 2 (seit 25.11.2026: Feld gekonnt)", () => {
    expect(LS_SCHLUESSEL).toBe("fisi_ap1_stand");
    expect(DEFEKT_SCHLUESSEL).toBe("fisi_ap1_stand_defekt");
    expect(STAND_VERSION).toBe(2);
  });
  it("liest ap1v2_state NICHT und laesst ihn unberuehrt", () => {
    const alt = JSON.stringify({ version: 5, seen: { "M01-001": 1 }, level: 3 });
    const sp = ablage({ [ALT_SCHLUESSEL]: alt });
    const r = lade(sp, JETZT);
    expect(r.befund).toBe("leer");
    expect(r.stand.seen).toEqual({});
    expect(speichere(r.stand, sp)).toBe(true);
    expect(sp.getItem(ALT_SCHLUESSEL)).toBe(alt);
  });
});

describe("Das Schema (E25)", () => {
  it("leererStand und SCHEMA kennen genau dieselben Felder", () => {
    expect(Object.keys(leererStand()).sort()).toEqual(Object.keys(SCHEMA).sort());
  });
  it("die acht ungelesenen Felder der alten App sind weg", () => {
    const weg = ["m09Historie", "m09UsedIds", "fokusZu", "ap2Themen", "fokus", "farbsymbole", "onboardingDone", "schriftStufe"];
    for (const f of weg) expect(Object.keys(SCHEMA)).not.toContain(f);
    expect(Object.keys(SCHEMA)).toHaveLength(40);   // 39 + gekonnt (25.11.2026)
  });
  it("der leere Stand besteht die eigene Pruefung ohne Reparatur", () => {
    const p = pruefe(roh(leererStand()));
    expect(p.reparaturen).toEqual([]);
    expect(p.stand).toEqual(leererStand());
  });
  it("liefert bei jedem Aufruf frische Behaelter", () => {
    const a = leererStand(); const b = leererStand();
    a.seen.x = 1;
    expect(b.seen).toEqual({});
  });
});

describe("Die Pruefung beim Laden (E25/E28)", () => {
  it("ein Feld der falschen Art wird zur Vorgabe - und genannt", () => {
    const p = pruefe(roh({ ...leererStand(), seen: "kaputt", tagesziel: null, markiert: { "M01-001": 1 } }));
    expect(p.stand.seen).toEqual({});
    expect(p.stand.tagesziel).toBe(20);
    expect(p.stand.markiert).toEqual({ "M01-001": 1 });
    expect(p.reparaturen).toHaveLength(2);
    expect(p.reparaturen.join()).toContain("„seen“");
    expect(p.reparaturen.join()).toContain("„tagesziel“");
  });
  it("jede Art weist Unsinn zurueck - an jedem Feld", () => {
    const UNSINN: Record<string, unknown> = {
      objekt: [1], liste: "x", zahl: "1", ganz: 1.5, text: 5, textOderNull: 7, janein: "ja",
    };
    const s: Record<string, unknown> = {};
    for (const [f, art] of Object.entries(SCHEMA)) s[f] = f === "version" ? 1 : UNSINN[art];
    const p = pruefe(s);
    expect(p.reparaturen).toHaveLength(39);
    expect(p.stand).toEqual(leererStand());
  });
  it("ein unbekanntes Feld wird verworfen und gemeldet, ein fehlendes gemeldet", () => {
    const s: Record<string, unknown> = { ...leererStand(), einFeldAusDerZukunft: 1 };
    delete s.statistik;
    const p = pruefe(s);
    expect(Object.keys(p.stand)).not.toContain("einFeldAusDerZukunft");
    expect(p.reparaturen).toEqual(["Feld „statistik“ fehlte – Vorgabe gesetzt", "Unbekanntes Feld „einFeldAusDerZukunft“ verworfen"]);
  });
  it("mehrere fehlende Felder ergeben EINE Meldung", () => {
    const p = pruefe({ version: 1, level: 2 });
    expect(p.reparaturen).toHaveLength(1);
    expect(p.reparaturen[0]).toMatch(/^38 Felder fehlten – Vorgabe gesetzt: seen, lastShown, /);
    expect(p.stand).toEqual({ ...leererStand(), level: 2 });
  });
  it("rev muss eine ganze Zahl ab 0 sein", () => {
    for (const rev of [-1, 1.5, "3"]) expect(pruefe(roh({ ...leererStand(), rev })).stand.rev).toBe(0);
    expect(pruefe(roh({ ...leererStand(), rev: 7 })).stand.rev).toBe(7);
  });
});

describe("Die Kette der Migrationen", () => {
  const KETTE: Record<number, Migration> = {
    1: (s) => ({ ...s, a: 1 }),
    2: (s) => ({ ...s, b: (s.a as number) + 1 }),
  };
  it("laeuft jeden Schritt in Reihenfolge und setzt die Fassung", () => {
    const w = migriere({ version: 1 }, KETTE, 3);
    expect(w.schritte).toEqual([1, 2]);
    expect(w.stand).toEqual({ version: 3, a: 1, b: 2 });
    expect(w.fehlt).toBeUndefined();
  });
  it("beginnt bei der gespeicherten Fassung, nicht bei 1", () => {
    expect(migriere({ version: 2, a: 5 }, KETTE, 3).stand).toEqual({ version: 3, a: 5, b: 6 });
  });
  it("bricht bei einem fehlenden Schritt ab und nennt ihn", () => {
    const w = migriere({ version: 1 }, { 1: KETTE[1]! }, 3);
    expect(w.fehlt).toBe(2);
    expect(w.schritte).toEqual([1]);
    expect(w.stand.b).toBeUndefined();
  });
  it("veraendert den gelesenen Stand nicht", () => {
    const s = { version: 1 };
    migriere(s, KETTE, 3);
    expect(s).toEqual({ version: 1 });
  });
  it("die echte Kette hat fuer JEDE Fassung unter STAND_VERSION einen Schritt", () => {
    for (let v = 1; v < STAND_VERSION; v++) expect(MIGRATIONEN[v], `Schritt ${v}`).toBeTypeOf("function");
    expect(migriere(roh(leererStand())).schritte).toEqual([]);
  });
});

describe("Laden und Schreiben", () => {
  it("ein Rundlauf verliert nichts und meldet nichts", () => {
    const s = { ...leererStand(), seen: { "M01-001": { n: 2 } }, level: 3, rev: 4, panelOffen: { rechner: true } };
    const sp = ablage();
    expect(speichere(s, sp)).toBe(true);
    const r = lade(sp, JETZT);
    expect(r).toMatchObject({ befund: "gelesen", reparaturen: [], gesichert: false, schreibenErlaubt: true });
    expect(r.stand).toEqual(s);
    expect(sp.getItem(DEFEKT_SCHLUESSEL)).toBeNull();
  });
  it("ein leerer Speicher ist leer, nicht kaputt", () => {
    expect(lade(ablage(), JETZT)).toMatchObject({ befund: "leer", schreibenErlaubt: true });
  });
  it("ein fehlender oder werfender Speicher: unlesbar und NICHT schreiben", () => {
    expect(lade(undefined, JETZT)).toMatchObject({ befund: "unlesbar", schreibenErlaubt: false });
    const wirft = { getItem: () => { throw new Error("blockiert"); } } as unknown as Storage;
    expect(lade(wirft, JETZT)).toMatchObject({ befund: "unlesbar", schreibenErlaubt: false });
  });
});

describe("Die Sicherung (E26)", () => {
  it("kaputtes JSON wird gesichert, bevor weitergearbeitet wird", () => {
    const sp = ablage({ [LS_SCHLUESSEL]: "{kaputt" });
    const r = lade(sp, JETZT);
    expect(r).toMatchObject({ befund: "unlesbar", gesichert: true, schreibenErlaubt: true });
    expect(r.stand).toEqual(leererStand());
    expect(sicherungen(sp)).toEqual([{ zeit: "2026-09-22T20:00:00.000Z", grund: "unlesbar", roh: "{kaputt" }]);
    expect(sp.getItem(LS_SCHLUESSEL)).toBe("{kaputt");
  });
  it("auch ein JSON, das kein Objekt ist (Liste, Zahl, null)", () => {
    for (const t of ["[1]", "3", "null"]) {
      const sp = ablage({ [LS_SCHLUESSEL]: t });
      expect(lade(sp, JETZT)).toMatchObject({ befund: "unlesbar", gesichert: true });
      expect(sicherungen(sp)[0]?.roh).toBe(t);
    }
  });
  it("haengt an und ueberschreibt nie; derselbe Text zweimal wird einmal abgelegt", () => {
    const sp = ablage({ [LS_SCHLUESSEL]: "{a" });
    lade(sp, JETZT); lade(sp, JETZT);
    sp.setItem(LS_SCHLUESSEL, "{b");
    lade(sp, JETZT + 1000);
    expect(sicherungen(sp).map((x) => x.roh)).toEqual(["{a", "{b"]);
  });
  it("klappt die Sicherung nicht, wird NICHT geschrieben", () => {
    const sp = ablage({ [LS_SCHLUESSEL]: "{kaputt" }, DEFEKT_SCHLUESSEL);
    expect(lade(sp, JETZT)).toMatchObject({ befund: "unlesbar", gesichert: false, schreibenErlaubt: false });
  });
  it("ein reparierter Stand wird ebenfalls gesichert - das kaputte Feld ist sonst weg", () => {
    const t = JSON.stringify({ ...leererStand(), seen: "kaputt" });
    const sp = ablage({ [LS_SCHLUESSEL]: t });
    const r = lade(sp, JETZT);
    expect(r).toMatchObject({ befund: "gelesen", gesichert: true, schreibenErlaubt: true });
    expect(r.reparaturen).toHaveLength(1);
    expect(sicherungen(sp)).toEqual([{ zeit: "2026-09-22T20:00:00.000Z", grund: "repariert", roh: t }]);
  });
  it("ein Stand aus einer NEUEREN Fassung: bekannte Felder lesen, Original sichern", () => {
    const t = JSON.stringify({ ...leererStand(), version: 9, level: 4, neuesFeld: [1] });
    const sp = ablage({ [LS_SCHLUESSEL]: t });
    const r = lade(sp, JETZT);
    expect(r.stand.level).toBe(4);
    expect(r.stand.version).toBe(STAND_VERSION);
    expect(r.reparaturen[0]).toContain("neueren Fassung (v9)");
    expect(r.gesichert).toBe(true);
  });
  it("ein fremder Inhalt unter dem Sicherungsschluessel geht nicht verloren", () => {
    const sp = ablage({ [LS_SCHLUESSEL]: "{x", [DEFEKT_SCHLUESSEL]: "irgendwas" });
    lade(sp, JETZT);
    expect(sicherungen(sp).map((x) => x.roh)).toEqual(["irgendwas", "{x"]);
  });
});

/* E62 (27.09.2026): `pruefe` prueft bei zwoelf Feldern auch den INHALT und verwirft einzelne Eintraege. */
describe("Der Inhalt der Felder (E62)", () => {
  /** Ein Stand in genau der Form, in der die App schreibt – an JEDEM geprueften Feld ein Eintrag. */
  const echt = () => ({
    ...leererStand(),
    lastShown: ["M01-001", "M02-003"], simUsedIds: ["M03-001"], gebiete: ["A2"], themen: ["M01|Projekt"],
    module: ["M01"],
    antworten: [{ richtig: true }, { richtig: false }],
    statistik: { M01: { richtig: 3, gesamt: 4 }, "T:M01:Projekt": { richtig: 1, gesamt: 1 }, "GEN:gantt": { richtig: 0, gesamt: 2 } },
    dailyCounts: { "2026-09-27": 12 },
    themaLevel: { "M01|Projekt": 2 },
    themaTrack: { "M01|Projekt": [true, false] },
    fehlerDeck: { "M01-001": { streak: 1, due: JETZT } },
    simHistorie: [{ datum: "2026-09-27", prozent: 62, note: 3, punkte: 62, gesamt: 100, zeitSek: 900 }],
  });

  it("ein Stand in der Form der App geht unveraendert durch und meldet nichts", () => {
    const s = echt();
    const p = pruefe(roh(s));
    expect(p.reparaturen).toEqual([]);
    expect(p.stand).toEqual(s);
  });

  it("die Regeln decken genau die dreizehn Felder, deren Inhalt die App liest (gekonnt seit 25.11.2026)", () => {
    expect(Object.keys(INHALT).sort()).toEqual([
      "antworten", "dailyCounts", "fehlerDeck", "gebiete", "gekonnt", "lastShown", "module", "simHistorie",
      "simUsedIds", "statistik", "themaLevel", "themaTrack", "themen",
    ]);
  });

  it("je Feld: NUR der kaputte Eintrag faellt, die guten bleiben – und es wird gemeldet", () => {
    const kaputt: Record<string, unknown> = {
      lastShown: 7, simUsedIds: null, gebiete: { a: 1 }, themen: 3, module: false,
      antworten: { richtig: "ja" },
      statistik: { richtig: "3", gesamt: 4 },
      dailyCounts: -1,
      themaLevel: "2",
      themaTrack: [true, 1],
      fehlerDeck: { streak: 1 },
      simHistorie: { datum: "2026-09-27" },
    };
    for (const [feld, schlecht] of Object.entries(kaputt)) {
      const s = echt() as unknown as Record<string, unknown>;
      const gut = s[feld];
      const mit = Array.isArray(gut) ? [...gut, schlecht] : { ...(gut as object), KAPUTT: schlecht };
      const p = pruefe({ ...s, [feld]: mit });
      expect((p.stand as unknown as Record<string, unknown>)[feld], feld).toEqual(gut);
      expect(p.reparaturen, feld).toEqual([`Feld „${feld}“: 1 Eintrag in unbekannter Form – verworfen`]);
    }
  });

  it("was nur angezeigt wird, verwirft keinen Durchgang (simHistorie: nur prozent zaehlt)", () => {
    const e = { prozent: 58, note: "3", datum: 20260927 };
    expect(pruefe(roh({ ...leererStand(), simHistorie: [e] })).stand.simHistorie).toEqual([e]);
  });

  it("siebe: Reihenfolge und Schluessel bleiben, Zaehlung stimmt", () => {
    expect(siebe([1, "a", 2, null, 3], (v) => typeof v === "number")).toEqual({ wert: [1, 2, 3], verworfen: 2 });
    expect(siebe({ b: 1, a: "x", c: 2 }, (v) => typeof v === "number")).toEqual({ wert: { b: 1, c: 2 }, verworfen: 1 });
  });

  it("⛔ beim LADEN wird vor der Verwerfung der Rohtext gesichert (E26)", () => {
    const text = JSON.stringify({ ...echt(), lastShown: ["M01-001", 5, 6] });
    const sp = ablage({ [LS_SCHLUESSEL]: text });
    const r = lade(sp, JETZT);
    expect(r.stand.lastShown).toEqual(["M01-001"]);
    expect(r.reparaturen).toEqual(["Feld „lastShown“: 2 Einträge in unbekannter Form – verworfen"]);
    expect(r).toMatchObject({ gesichert: true, schreibenErlaubt: true });
    expect(sicherungen(sp)).toEqual([{ zeit: "2026-09-22T20:00:00.000Z", grund: "repariert", roh: text }]);
  });
});
