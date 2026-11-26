/* ============================================================================
   GLEICHHEITSBEWEIS FUER DIE ZUFALLSAUFGABEN

   Was hier verglichen werden KANN, wird verglichen: `app_seiten.js` laedt in
   einer node:vm, also laesst sich die echte `genAlsFrage()` aufrufen. Sie
   wuerfelt zwar die Werte — aber ihre FILTER (netzplan raus, Pruefungsteil,
   Gebiets-/Themenwahl) sind deterministisch, und genau die werden geprueft.

   ⛔ Die Rechnung selbst wird hier NICHT nachgeprueft: `check.sh` rechnet 27
      Aufgaben mit 17429 Faellen deterministisch durch. Sie hier noch einmal zu
      pruefen hiesse, dieselbe Quelle zweimal zu befragen.
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
import { arten, zufallsaufgabe, felder, alleRichtig, bewerteZufall, verbucheZufall } from "./generator";
import { altQuelle } from "../testhilfe/altquelle";
import { GENERATOREN as NEU_GEN } from "./generatoren.ts";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const requireCjs = createRequire(import.meta.url);
const Lroh = requireCjs(altQuelle(WURZEL, "logik.js"));

const POOL_INDEX: Record<string, unknown> = {};
for (const f of FRAGEN) POOL_INDEX[f.id] = f;

function alteApp() {
  const sandbox: Record<string, unknown> = {
    console, L: Lroh, POOL: FRAGEN, POOL_INDEX, S: leererStand(),
    document: {
      addEventListener: () => {}, getElementById: () => null,
      querySelector: () => null, querySelectorAll: () => [],
      createElement: () => ({ style: {}, setAttribute: () => {}, appendChild: () => {} }),
    },
    window: { addEventListener: () => {} },
    setTimeout, clearTimeout,
  };
  vm.createContext(sandbox);
  for (const datei of ["app_util.js", "app_pool.js", "app_seiten.js"]) {
    try {
      vm.runInContext(fs.readFileSync(altQuelle(WURZEL, datei), "utf8"), sandbox, { filename: datei });
    } catch { /* app_util.js bricht an einer Oberflaechen-Zeile ab; die Funktionen sind gehoben. */ }
  }
  sandbox.POOL = FRAGEN;
  sandbox.POOL_INDEX = POOL_INDEX;
  return sandbox;
}

const ALT = alteApp();
const setzeStand = (s: Lernstand) => { ALT.S = JSON.parse(JSON.stringify(s)); };

/** Welche Arten liefert die ALTE App? Sie zieht eine, also wird oft gezogen. */
function alteArten(runden = 400): string[] {
  const gesehen = new Set<string>();
  const fn = ALT.genAlsFrage as () => { generatorArt?: string } | null;
  for (let i = 0; i < runden; i++) {
    const g = fn();
    if (g?.generatorArt) gesehen.add(g.generatorArt);
  }
  return [...gesehen].sort();
}

describe("genAlsFrage ist ueberhaupt geladen", () => {
  it("ist eine Funktion", () => {
    expect(typeof ALT.genAlsFrage, "sonst beweist dieser Test nichts").toBe("function");
  });
  it("es gibt ueberhaupt Generator-Arten", () => {
    expect(Object.keys(Lroh.GENERATOREN).length).toBeGreaterThan(3);
  });
});

describe("Dieselben Arten kommen in Frage", () => {
  const gebietVon = (m: string, t: string) => Lroh.gebietFuer({ modul: m, thema: t }) as string;
  const G = Lroh.GENERATOREN as Record<string, { modul: string; thema: string; ap2?: boolean }>;

  /* ⛔⛔ GEMESSEN AM 14.09.2026, und es aendert, wie man die Auswahl liest:
     **VIER der sechs Generator-Arten haben gar kein Gebiet** — `L.gebietFuer`
     liefert fuer `uebertragung`, `zahlensysteme`, `raid` und `netzplan`
     `undefined`. Nur `datenmengen` (A2) und `subnetting` (B2) tragen eines.
     ►► Folge: sobald der Lerner IRGENDEIN Gebiet waehlt, fallen die vier heraus —
        sie kaemen nur ueber ihr Feinthema ("modul|thema") wieder herein. Das ist
        Verhalten der ALTEN App, kein Fehler; aber wer die Einstreuung vermisst,
        soll hier lesen koennen, warum. */
  const STAENDE: Array<[string, Lernstand, "leer" | "voll"]> = [
    ["Grundzustand", leererStand(), "voll"],
    ["nur AP1", { ...leererStand(), uebenAP: "ap1" } as Lernstand, "voll"],
    ["nur AP2", { ...leererStand(), uebenAP: "ap2" } as Lernstand, "voll"],
    ["Gebiet A2 — datenmengen traegt es", { ...leererStand(), gebiete: [gebietVon(G.datenmengen.modul, G.datenmengen.thema)] } as Lernstand, "voll"],
    ["Gebiet B2 — subnetting traegt es", { ...leererStand(), gebiete: [gebietVon(G.subnetting.modul, G.subnetting.thema)] } as Lernstand, "voll"],
    ["Feinthema von raid", { ...leererStand(), themen: [G.raid.modul + "|" + G.raid.thema] } as Lernstand, "voll"],
    ["Feinthema von uebertragung (ohne Gebiet!)", { ...leererStand(), themen: [G.uebertragung.modul + "|" + G.uebertragung.thema] } as Lernstand, "voll"],
    ["raid ist AP2 — mit AP1-Filter bleibt nichts", { ...leererStand(), uebenAP: "ap1", themen: [G.raid.modul + "|" + G.raid.thema] } as Lernstand, "leer"],
    ["Auswahl, die keine Art trifft", { ...leererStand(), themen: ["M99|gibt es nicht"] } as Lernstand, "leer"],
  ];

  it.each(STAENDE)("%s", (name, stand, erwartung) => {
    setzeStand(stand);
    const a = alteArten();
    const b = arten(stand).filter((x) => x in Lroh.GENERATOREN).sort();   /* K3-Arten gibt es in der alten App nicht */
    expect(b).toEqual(a);
    if (erwartung === "voll") {
      expect(a.length, `die alte App liefert nichts — dann misst "${name}" nichts`).toBeGreaterThan(0);
    } else {
      expect(a, `"${name}" soll leer sein`).toEqual([]);
      expect(b).toEqual([]);
    }
  });

  it("vier von sechs Arten haben KEIN Gebiet — festgehalten, damit es nicht ueberrascht", () => {
    const ohne = Object.keys(G).filter((a) => !gebietVon(G[a].modul, G[a].thema));
    expect(ohne.sort()).toEqual(["netzplan", "raid", "uebertragung", "zahlensysteme"]);
  });

  it("netzplan ist ueberall ausgenommen", () => {
    for (const [, stand] of STAENDE) {
      setzeStand(stand);
      expect(arten(stand)).not.toContain("netzplan");
      expect(alteArten(200)).not.toContain("netzplan");
    }
  });
});

describe("Eine gestellte Zufallsaufgabe ist vollstaendig", () => {
  it("traegt alles, was die Karte braucht — bei jeder Art, 200 Ziehungen", () => {
    const stand = leererStand();
    const fehlend: string[] = [];
    const gesehen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const a = zufallsaufgabe(stand);
      expect(a).not.toBeNull();
      gesehen.add(a!.generatorArt);
      if (typeof a!.frage !== "string" || !a!.frage) fehlend.push(`${a!.generatorArt}: keine Frage`);
      if (!Array.isArray(a!.weg) || !a!.weg.length) fehlend.push(`${a!.generatorArt}: kein Loesungsweg`);
      if (!felder(a!).length) fehlend.push(`${a!.generatorArt}: kein Antwortfeld`);
      if (felder(a!).some((f) => !f.length)) fehlend.push(`${a!.generatorArt}: leeres Antwortfeld`);
      if (a!.typ !== "generator") fehlend.push(`${a!.generatorArt}: typ ${String(a!.typ)}`);
    }
    expect([...fehlend].slice(0, 5)).toEqual([]);
    expect(gesehen.size, "ueber 200 Ziehungen muessen alle Arten drankommen").toBe(arten(stand).length);
  });

  it("traegt die feste Stufe ihrer Art, nicht die globale Stufe des Lerners", () => {
    /* ⚠️ NUTZER-ENTSCHEID 09.09.2026: sonst trug im Automatik-Modus jede vierte
       Aufgabe das Etikett "Anfaenger". */
    const stand = { ...leererStand(), level: 1 } as Lernstand;
    const G = { ...Lroh.GENERATOREN, ...NEU_GEN } as Record<string, { stufe?: number }>;   /* K3: neue Arten mit ihrer eigenen Stufe */
    for (let i = 0; i < 60; i++) {
      const a = zufallsaufgabe(stand)!;
      expect(a.schwierigkeit, a.generatorArt).toBe(G[a.generatorArt].stufe);
    }
    expect(Object.values(G).some((m) => (m.stufe ?? 1) > 1), "sonst prueft das nichts").toBe(true);
  });

  it("liefert null, wenn zur Auswahl keine Art passt", () => {
    expect(zufallsaufgabe({ ...leererStand(), themen: ["M99|nix"] } as Lernstand)).toBeNull();
  });
});

describe("Die Bewertung ist dieselbe wie in der alten App", () => {
  /* app_loeser.js R_TYP.generator: L.gradeLuecke(akzListen[i].map(String), wert) */
  it("nimmt jede akzeptierte Schreibweise an — ueber alle Arten, 200 Ziehungen", () => {
    const stand = leererStand();
    const daneben: string[] = [];
    for (let i = 0; i < 200; i++) {
      const a = zufallsaufgabe(stand)!;
      for (const [nr, akzeptiert] of felder(a).entries()) {
        for (const schreibweise of akzeptiert) {
          const eingaben = felder(a).map((_, k) => (k === nr ? schreibweise : felder(a)[k][0]));
          if (!alleRichtig(a, eingaben)) daneben.push(`${a.generatorArt} Feld ${nr + 1}: "${schreibweise}"`);
        }
      }
    }
    expect(daneben.slice(0, 5)).toEqual([]);
  });

  it("weist eine verbogene Antwort ab", () => {
    const stand = leererStand();
    let abgewiesen = 0;
    for (let i = 0; i < 100; i++) {
      const a = zufallsaufgabe(stand)!;
      const falsch = felder(a).map((f) => f[0] + "999");
      if (!alleRichtig(a, falsch)) abgewiesen++;
    }
    expect(abgewiesen).toBe(100);
  });

  it("verlangt, dass JEDES Feld stimmt", () => {
    const stand = leererStand();
    let geprueft = 0;
    for (let i = 0; i < 200 && geprueft < 5; i++) {
      const a = zufallsaufgabe(stand)!;
      if (felder(a).length < 2) continue;
      geprueft++;
      const halb = felder(a).map((f, k) => (k === 0 ? f[0] : "quatsch"));
      expect(bewerteZufall(a, halb)[0]).toBe(true);
      expect(alleRichtig(a, halb)).toBe(false);
    }
    expect(geprueft, "es muss Aufgaben mit zwei Feldern geben").toBeGreaterThan(0);
  });
});

describe("Die Buchung geht in eine eigene Zeile", () => {
  it("zaehlt unter GEN:<art> und ruehrt das Modul nicht an", () => {
    const a = zufallsaufgabe(leererStand())!;
    const s = verbucheZufall(leererStand(), a, true);
    const st = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    expect(st["GEN:" + a.generator]).toEqual({ richtig: 1, gesamt: 1 });
    expect(st[a.modul], "diese Funktion fuehrt NUR die GEN-Zeile; die Modul-Statistik macht verbuche(), wie in der alten App").toBeUndefined();

    const s2 = verbucheZufall(s, a, false);
    expect((s2.statistik as Record<string, unknown>)["GEN:" + a.generator]).toEqual({ richtig: 1, gesamt: 2 });
  });
});
