/* ============================================================================
   GLEICHHEITSBEWEIS FUER DIE KANDIDATEN-AUSWAHL

   ⛔ `app_pool.js` UND `app_seiten.js` werden in einer node:vm WIRKLICH
      AUSGEFUEHRT — beide laden ohne Oberflaeche durch (gemessen 14.09.2026).
      Verglichen werden `uebenPasst`, `themaGewaehlt`, `istWirtschaft`,
      `aufStufeFiltern`, `kandidaten` und `kandidatenMitTypWechsel` ueber viele
      verschiedene Staende — nicht an einem Beispiel, sondern an der ganzen
      Kombinatorik aus Pruefungsteil, Gebietsauswahl, Schwerpunkt und Stufen.

   ⚠️ Gestubbt wird NUR, was Oberflaeche ist (ein `document` mit
      addEventListener). Die gesamte Entscheidungslogik kommt aus den echten
      Dateien — sonst beweist der Vergleich nichts.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import {
  uebenPasst, themaGewaehlt, istWirtschaft, aufStufeFiltern, stufeFuer,
  kandidaten, kandidatenMitTypWechsel, typVon, WIRTSCHAFT_THEMEN,
} from "./auswahl";
import type { Frage } from "@/daten/typen";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const requireCjs = createRequire(import.meta.url);
const Lroh = requireCjs(altQuelle(WURZEL, "logik.js"));

const POOL_INDEX: Record<string, Frage> = {};
for (const f of FRAGEN) POOL_INDEX[f.id] = f;

/** Laedt die alte Auswahl. `S` bleibt schreibbar, damit der Test Staende setzen kann. */
function alteAuswahl() {
  const sandbox: Record<string, unknown> = {
    console,
    L: Lroh,
    POOL: FRAGEN,
    POOL_INDEX,
    S: leererStand(),
    /* Nur Oberflaeche, keine Entscheidung. */
    document: {
      addEventListener: () => {},
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ style: {}, setAttribute: () => {}, appendChild: () => {} }),
    },
    window: { addEventListener: () => {} },
    setTimeout, clearTimeout,
  };
  vm.createContext(sandbox);
  for (const datei of ["app_util.js", "app_pool.js", "app_seiten.js"]) {
    try {
      vm.runInContext(fs.readFileSync(altQuelle(WURZEL, datei), "utf8"), sandbox, { filename: datei });
    } catch {
      /* app_util.js bricht am Ende an einer Oberflaechen-Zeile ab; die
         Funktions-Deklarationen sind zu dem Zeitpunkt bereits gehoben und
         vorhanden. Geprueft wird das unten ausdruecklich. */
    }
  }
  /* ⛔ ERST NACH DEM LADEN: `app_pool.js` beginnt mit `var POOL = [], ... POOL_INDEX = ...`
     und wuerde einen vorher gesetzten Bestand ueberschreiben. Genau das ist beim
     ersten Lauf passiert — `kandidaten()` lieferte eine leere Liste, und der
     Vergleich haette "beide leer" als Uebereinstimmung durchgehen lassen, wenn
     nicht die neue Fassung geliefert haette. */
  sandbox.POOL = FRAGEN;
  sandbox.POOL_INDEX = POOL_INDEX;
  return sandbox;
}

const ALT = alteAuswahl();

/** Setzt den Stand in der alten App. */
function setzeStand(s: Lernstand) {
  ALT.S = JSON.parse(JSON.stringify(s));
}

// oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- T ist die vom Aufrufer gesetzte Rueckgabetyp-Annahme (alt<X>(...))
function alt<T>(name: string, ...args: unknown[]): T {
  const fn = ALT[name] as (...a: unknown[]) => T;
  return fn(...args);
}

describe("die alte Auswahl ist ueberhaupt geladen", () => {
  it.each([
    "uebenPasst", "themaGewaehlt", "istWirtschaft", "aufStufeFiltern",
    "kandidaten", "kandidatenMitTypWechsel", "stufeFuer", "typVon",
  ])("%s ist eine Funktion", (n) => {
    expect(typeof ALT[n], `${n} fehlt — dann beweist dieser Test nichts`).toBe("function");
  });
});

describe("Der Wirtschafts-Querschnitt ist derselbe", () => {
  it("dieselbe Liste, Eintrag fuer Eintrag", () => {
    expect(WIRTSCHAFT_THEMEN.map((p) => p.join("|"))).toEqual(
      (ALT.WIRTSCHAFT_THEMEN as string[][]).map((p) => p.join("|")),
    );
  });
  it("trifft dieselben Fragen im ganzen Bestand", () => {
    setzeStand(leererStand());
    const a = FRAGEN.filter((f) => alt<boolean>("istWirtschaft", f)).map((f) => f.id);
    const b = FRAGEN.filter(istWirtschaft).map((f) => f.id);
    expect(b).toEqual(a);
    expect(a.length).toBeGreaterThan(0);
  });
});

/* Die Staende, ueber die verglichen wird. Absichtlich die Kombinatorik, nicht ein
   Beispiel: Pruefungsteil x Auswahl x Schwerpunkt x Stufen. */
function staende(): Array<[string, Lernstand]> {
  const gebieteAlle = [...new Set(FRAGEN.map((f) => f.gebiet).filter(Boolean))] as string[];
  const themenEinige = [...new Set(FRAGEN.map((f) => f.modul + "|" + f.thema))].slice(0, 7);

  /* Ein Stand mit gewuerfelten Themenstufen — nur so wird `aufStufeFiltern`
     ueberhaupt belastet. Auf Stufe 1 waere der Filter fast wirkungslos. */
  const mitStufen = leererStand();
  let s = 12345;
  for (const k of new Set(FRAGEN.map((f) => f.modul + "|" + f.thema))) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    (mitStufen.themaLevel as Record<string, number>)[k] = 1 + (s % 4);
  }

  const manuell = { ...leererStand(), levelModus: "manuell", level: 3 } as Lernstand;

  return [
    ["Grundzustand", leererStand()],
    ["nur AP1", { ...leererStand(), uebenAP: "ap1" } as Lernstand],
    ["nur AP2", { ...leererStand(), uebenAP: "ap2" } as Lernstand],
    ["ein Gebiet", { ...leererStand(), gebiete: [gebieteAlle[0]] } as Lernstand],
    ["drei Gebiete", { ...leererStand(), gebiete: gebieteAlle.slice(0, 3) } as Lernstand],
    ["alle Gebiete", { ...leererStand(), gebiete: gebieteAlle } as Lernstand],
    ["einzelne Feinthemen", { ...leererStand(), themen: themenEinige } as Lernstand],
    ["Gebiete UND Themen", { ...leererStand(), gebiete: [gebieteAlle[1]], themen: themenEinige } as Lernstand],
    ["Schwerpunkt Wirtschaft", { ...leererStand(), wirtschaftNur: true } as Lernstand],
    ["Wirtschaft + AP1", { ...leererStand(), wirtschaftNur: true, uebenAP: "ap1" } as Lernstand],
    ["Wirtschaft + fremdes Gebiet", { ...leererStand(), wirtschaftNur: true, gebiete: [gebieteAlle[0]] } as Lernstand],
    ["gewuerfelte Themenstufen", mitStufen],
    ["Stufen + AP2", { ...mitStufen, uebenAP: "ap2" } as Lernstand],
    ["Stufen + Wirtschaft", { ...mitStufen, wirtschaftNur: true } as Lernstand],
    ["manueller Modus, Stufe 3", manuell],
    ["Auswahl, die nichts trifft", { ...leererStand(), themen: ["M99|gibt es nicht"] } as Lernstand],
  ];
}

const STAENDE = staende();

describe("uebenPasst und themaGewaehlt sind zeichengleich", () => {
  it.each(STAENDE)("%s", (_name, stand) => {
    setzeStand(stand);
    const a = FRAGEN.filter((f) => alt<boolean>("uebenPasst", f)).map((f) => f.id);
    const b = FRAGEN.filter((f) => uebenPasst(stand, f)).map((f) => f.id);
    expect(b).toEqual(a);

    const ta = FRAGEN.filter((f) => alt<boolean>("themaGewaehlt", f)).map((f) => f.id);
    const tb = FRAGEN.filter((f) => themaGewaehlt(stand, f)).map((f) => f.id);
    expect(tb).toEqual(ta);
  });
});

describe("Die Stufe je Thema ist dieselbe", () => {
  it.each(STAENDE)("%s", (_name, stand) => {
    setzeStand(stand);
    const abweichung: string[] = [];
    for (const f of FRAGEN) {
      const a = alt<number>("stufeFuer", f);
      const b = stufeFuer(stand, f);
      if (a !== b) abweichung.push(`${f.id}: alt ${a}, neu ${b}`);
    }
    expect(abweichung.slice(0, 5)).toEqual([]);
  });
});

describe("aufStufeFiltern ist zeichengleich — auch in der Reihenfolge", () => {
  it.each(STAENDE)("%s", (_name, stand) => {
    setzeStand(stand);
    /* Dieselbe Vorfilterung wie in kandidaten(), damit wirklich nur die
       Stufenlogik verglichen wird. */
    const menge = FRAGEN.filter(
      (f) => uebenPasst(stand, f) && themaGewaehlt(stand, f) && (!stand.wirtschaftNur || istWirtschaft(f)),
    );
    const a = (alt<Frage[]>("aufStufeFiltern", menge) ?? []).map((f) => f.id);
    const b = aufStufeFiltern(stand, menge).map((f) => f.id);
    expect(b).toEqual(a);
  });
});

describe("kandidaten liefert dieselbe Liste in derselben Reihenfolge", () => {
  /* ⛔ GEMESSEN BEIM ERSTEN LAUF, UND ES WAR EIN BEINAHE-FEHLSCHLUSS:
     die alte `kandidaten()` lieferte [], weil `app_pool.js` beim Laden `POOL`
     ueberschreibt. Haette meine Fassung ebenfalls [] geliefert, waere der
     Vergleich gruen gewesen — **zwei leere Listen sind gleich, und das beweist
     nichts.** Deshalb verlangt jeder Fall ausser dem ausdruecklich leeren, dass
     die ALTE Seite ueberhaupt etwas liefert. */
  it.each(STAENDE)("%s", (name, stand) => {
    setzeStand(stand);
    const a = alt<string[]>("kandidaten");
    const b = kandidaten(stand, FRAGEN);
    if (name !== "Auswahl, die nichts trifft") {
      expect(a.length, `die alte Auswahl liefert nichts — dann misst "${name}" nichts`).toBeGreaterThan(0);
    }
    expect(b).toEqual(a);
  });

  it("der Grundzustand liefert eine grosse Menge, kein Rest", () => {
    setzeStand(leererStand());
    expect(alt<string[]>("kandidaten").length).toBeGreaterThan(100);
    expect(kandidaten(leererStand(), FRAGEN).length).toBeGreaterThan(100);
  });

  it("eine Auswahl, die nichts trifft, liefert auf BEIDEN Seiten nichts", () => {
    const leer = { ...leererStand(), themen: ["M99|gibt es nicht"] } as Lernstand;
    setzeStand(leer);
    expect(alt<string[]>("kandidaten")).toEqual([]);
    expect(kandidaten(leer, FRAGEN)).toEqual([]);
  });
});

describe("Die Typwechsel-Sperre ist dieselbe", () => {
  const TYPEN = ["", "mc", "freitext", "zuordnung", "trace", "gibtesnicht"];
  it.each(TYPEN)('lastTyp = "%s"', (lastTyp) => {
    for (const [, roh] of STAENDE) {
      const stand = { ...roh, lastTyp } as Lernstand;
      setzeStand(stand);
      const a = alt<string[]>("kandidatenMitTypWechsel");
      const b = kandidatenMitTypWechsel(stand, FRAGEN, (id) => POOL_INDEX[id]);
      expect(b).toEqual(a);
    }
  });

  it("typVon loest bild ueber den unterTyp auf, genau wie app_util.js", () => {
    const abweichung = FRAGEN.filter((f) => typVon(f) !== alt<string>("typVon", f)).map((f) => f.id);
    expect(abweichung).toEqual([]);
    /* und es gibt wirklich bild-Fragen, sonst prueft das nichts */
    expect(FRAGEN.some((f) => f.typ === "bild")).toBe(true);
  });
});
