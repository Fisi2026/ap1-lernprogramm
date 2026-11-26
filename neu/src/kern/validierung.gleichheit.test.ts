/* ============================================================================
   N34 T6a (E50, E56, 26.09.2026): GLEICHHEITSBEWEIS FUER `validierung.ts`
   Gegen `L.validateFragen` aus `referenz/logik.js` (eingefroren).
   ⛔ Die Pruefung soll FEHLER finden – gleich sein muss sie deshalb vor allem an KAPUTTEN Fragen:
      je Pool-Frage jedes Feld entfernt / falsch getypt, jedes Array auf 1-4 gekuerzt, um eins
      verlaengert und sein erstes Element
      verdorben (eine Ebene tief), der Typ auf jeden anderen Typ gesetzt. Verglichen wird das ganze
      Ergebnis (gueltig + fehler mit Meldungstext).
   ⛔ Die Zufallsstichprobe der Rechenaufgaben wuerfelt mit Math.random – je Aufruf gleich geseedet.
   ⛔ Exportmenge fest (LEHREN B151); Node laedt die Datei nativ (E49).
   ============================================================================ */
import { describe, it, expect, vi } from "vitest";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { altQuelle } from "../testhilfe/altquelle";
import { FRAGEN } from "@/daten/laden";
import { varianten } from "../testhilfe/verderben";
import * as validierung from "./validierung.ts";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const req = createRequire(import.meta.url);
type Fn = (...a: unknown[]) => unknown;
const QUELLEN: Array<[string, Record<string, Fn>]> = [
  ["referenz/logik.js", req(altQuelle(WURZEL, "logik.js")) as Record<string, Fn>],
];
type Q = Record<string, unknown>;
function seed(s: number): () => number {
  let a = s >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const klon = <T,>(x: T): T => (x === undefined ? x : JSON.parse(JSON.stringify(x)) as T);
/** Ergebnis ODER Fehlermeldung – wirft die eine Seite (z. B. `frage: 0` -> `.match` fehlt), muss die
    andere mit DERSELBEN Meldung werfen. */
/* N43 M3 (16.10.2026): unter Strykers Instrumentierung baut V8 den Text nativer TypeErrors aus dem umgebauten Ausdruck
   ("(intermediate value)….forEach is not a function" statt "(f.schritte || []).forEach …", gemessen an G1). Nur dort wird
   der Text auf den Methodennamen gekuerzt; ohne Stryker bleibt der Vergleich wortgleich. */
const meldung = (m: string): string =>
  "__stryker__" in globalThis ? m.replace(/^.*?([\w$]+ is not (?:a function|iterable))$/, "… $1") : m;
function geseedet(s: number, fn: () => unknown): unknown {
  const spion = vi.spyOn(Math, "random").mockImplementation(seed(s));
  try { return klon(fn()); } catch (e) { return { wirft: meldung((e as Error).message) }; } finally { spion.mockRestore(); }
}
/** Eine Frage-Gruppe: erst als Ganzes; wirft das, jede Fassung einzeln (sonst verdeckt EIN Wurf alle anderen). */
function jeGruppe(s: number, fn: Fn, vs: Q[]): unknown {
  const ganz = geseedet(s, () => fn(vs)) as { wirft?: string };
  return ganz.wirft === undefined ? ganz : vs.map((v, j) => geseedet(s * 1000 + j, () => fn([v])));
}
/* Gebaute Rechenaufgaben fuer die Wege, die der Bestand nicht nimmt (Sabotage 26.09.): Variablenname
   `s12`, Probewert 0,5 (x=0 nur bei 0,4), mehr als 32 Extremkombinationen, Entartung NUR im Innern. */
const RA = { pruefungsteil: "AP1", modul: "M03", thema: "T", typ: "rechenassistent", schwierigkeit: 2, frage: "Rechne {x}", erklaerungKurz: "k" };
const GEBAUT: Q[] = [
  { ...RA, id: "G1", variablen: { s12: { min: 1, max: 2 } }, schritte: [{ text: "a", formel: "s12 + 1" }, { text: "b", formel: "s1 * 2" }] },
  { ...RA, id: "G2", variablen: { x: { min: 0, max: 1, schritt: 1 } }, schritte: [{ text: "a", formel: "10 / x" }, { text: "b", formel: "s1 + 1" }] },
  { ...RA, id: "G3", variablen: { a: { min: 1, max: 2 }, b: { min: 1, max: 2 }, c: { min: 1, max: 2 }, d: { min: 1, max: 2 }, e: { min: 1, max: 2 }, x: { min: 0, max: 2, schritt: 1 } },   // Probe 0,5 -> x=1; entartet erst bei x=max (Kombination 32)
    schritte: [{ text: "a", formel: "1 / (2 - x) + a + b + c + d + e" }, { text: "b", formel: "s1 + 1" }] },
  ...[17, 23, 31, 5].map((z, i) => Object.assign({}, RA, { id: "G4" + i, variablen: { x: { min: 0, max: 40, schritt: 1 } },
    schritte: [{ text: "a", formel: "1 / (x - " + z + ")" }, { text: "b", formel: "s1 + 1" }] })),
];

it("die Exportmenge ist genau die gepruefte Liste", () => {
  expect(Object.keys(validierung)).toEqual(["validateFragen"]);
  expect(FRAGEN.length).toBeGreaterThan(1000);
});

/* Verdorben wird eine FESTE Auswahl: je Typ (bei `bild` je unterTyp) die ersten 12 Fragen nach Kennung –
   jeder Typ-Zweig ist damit mehrfach belegt (alle 1131 ×~150 Fassungen dauerten ueber eine Minute).
   ⛔ Keine Zufallsauswahl: eine Pruefung, die wuerfelt, ist keine.
   ⚠️ 28.09.2026 (BUILD_LOG 89, Wiederholung von 86): als EIN Test riss er unter Last die 20-s-Grenze
      (28,2 s im vollen Lauf, allein 3,6 s). Deshalb in HAELFTEN geteilt, nicht die Grenze gehoben
      (vitest.config.ts-Regel). Saat je Frage unveraendert `i + 2` (Index in der GANZEN Auswahl).
   ⚠️ 30.09.2026 (BUILD_LOG 91): eine Haelfte riss unter check.sh-Last wieder (20,5 s, allein ~2 s)
      -> VIERTEL. */
function auswahlAus(pool: Q[]): { auswahl: Q[]; zweige: number } {
  const jeTyp = new Map<string, number>();
  const auswahl = [...pool].sort((x, y) => String(x.id).localeCompare(String(y.id))).filter((q) => {
    const t = String(q.typ) + "/" + String(q.unterTyp ?? "");
    jeTyp.set(t, (jeTyp.get(t) ?? 0) + 1);
    return jeTyp.get(t)! <= 12;
  });
  return { auswahl, zweige: jeTyp.size };
}

describe.each(QUELLEN)("gleich %s", (_n, L) => {
  const K = validierung.validateFragen as unknown as Fn;
  it("der ganze Pool gueltig, gebaute Rechenaufgaben, Sonderwerte", () => {
    const pool = FRAGEN as unknown as Q[];
    expect(geseedet(1, () => K(pool))).toEqual(geseedet(1, () => L.validateFragen!(pool)));
    expect(auswahlAus(pool).zweige, "Typ-Zweige im Bestand").toBeGreaterThan(15);
    for (const [j, g] of GEBAUT.entries()) {
      const vs = [g, ...varianten(g)];
      expect(jeGruppe(900000 + j, K, vs), String(g.id)).toEqual(jeGruppe(900000 + j, L.validateFragen!, vs));
    }
    for (const x of [null, undefined, "x", {}, [1, null, "a"], [{ id: "a" }, { id: "a" }]])
      expect(geseedet(0, () => K(x)), JSON.stringify(x)).toEqual(geseedet(0, () => L.validateFragen!(x)));
  });
  it.each([0, 1, 2, 3])("verdorben, Viertel %i der festen Auswahl", (h) => {
    const { auswahl } = auswahlAus(FRAGEN as unknown as Q[]);
    let fehlerSumme = 0;
    auswahl.forEach((q, i) => {
      if (Math.floor((i * 4) / auswahl.length) !== h) return;
      const vs = varianten(q);
      const k = jeGruppe(i + 2, K, vs);
      expect(k, String(q.id)).toEqual(jeGruppe(i + 2, L.validateFragen!, vs));
      fehlerSumme += JSON.stringify(k).split('"meldung"').length - 1;
    });
    /* Vorher >5000 fuer die ganze Auswahl; je Viertel gemessen 7764..7928 (BUILD_LOG 91), Grenze darunter. */
    expect(fehlerSumme, "die Verderbnis muss Fehler erzeugen").toBeGreaterThan(5000);
  });
});

it("Node laedt die Datei nativ per require (E49)", () => {
  const skript = "console.log(Object.keys(require(process.argv[1])).sort().join(','))";
  const r = spawnSync(process.execPath, ["-e", skript, path.join(hier, "validierung.ts")], { encoding: "utf8" });
  expect(r.status, r.stderr).toBe(0);
  expect(r.stdout.trim()).toBe("validateFragen");
});
