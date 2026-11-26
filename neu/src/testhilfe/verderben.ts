/* ============================================================================
   Verdorbene Fassungen einer Frage – gemeinsame Testhilfe (N37 U3, 27.09.2026).
   Herausgeloest aus `kern/validierung.gleichheit.test.ts` (N34 T6a, wortgleich), weil der
   Deckungstest Schema ↔ `validateFragen` (`daten/schema.deckung.test.ts`) DIESELBEN Fassungen braucht.
   ============================================================================ */
import { TYPEN } from "@/kern/tabellen/fragetypen.ts";

export type Q = Record<string, unknown>;
const SCHLECHT: unknown[] = [null, "", 0, -1, [], {}, "x", true];

/** Sammelstelle fuer die Fassungen einer Frage: `neu` haengt an und vergibt die eigene Kennung. */
interface Sammler { q: Q; out: Q[]; n: number }
function neu(c: Sammler, x: Q, idBleibt = false): void { c.out.push(idBleibt ? x : { ...x, id: String(c.q.id) + "~" + (c.n++) }); }
const zahlVarianten = (w: unknown): unknown[] => (typeof w === "number" ? [w + 1, w - 1, 0, 4] : []);

/** Fassungen eines Array-Feldes `k`, dessen erstes Element ein Objekt ist. */
function verderbeObjektElement(c: Sammler, k: string, v: unknown[], e0: Q): void {
  const q = c.q;
  for (const ek of Object.keys(e0)) {
    for (const w of [undefined, null, "", -1, [], ...zahlVarianten(e0[ek])]) {
      const e = { ...e0 }; if (w === undefined) delete e[ek]; else e[ek] = w;
      neu(c, { ...q, [k]: [e, ...v.slice(1)] });
    }
    const ea = e0[ek];
    if (Array.isArray(ea)) for (const w of [ea.slice(0, 1), []]) neu(c, { ...q, [k]: [{ ...e0, [ek]: w }, ...v.slice(1)] });
  }
}

/** Fassungen eines nichtleeren Array-Feldes `k`. */
function verderbeArray(c: Sammler, k: string, v: unknown[]): void {
  const q = c.q;
  neu(c, { ...q, [k]: v.slice(1) }); neu(c, { ...q, [k]: [null, ...v.slice(1)] }); neu(c, { ...q, [k]: ["", ...v.slice(1)] });
  for (let m = 1; m <= 4; m++) if (m < v.length) neu(c, { ...q, [k]: v.slice(0, m) });   // Mindestlaengen
  neu(c, { ...q, [k]: [...v, v[0]] });                                                    // eins mehr
  const e0 = v[0];
  if (Array.isArray(e0)) { neu(c, { ...q, [k]: [[], ...v.slice(1)] }); neu(c, { ...q, [k]: [e0.slice(0, 1), ...v.slice(1)] }); }
  else if (e0 && typeof e0 === "object") verderbeObjektElement(c, k, v, e0 as Q);
}

/** Fassungen eines Objekt-Feldes `k`. */
function verderbeObjekt(c: Sammler, k: string, v: Q): void {
  const q = c.q;
  for (const ek of Object.keys(v)) {
    const e = { ...v }; delete e[ek]; neu(c, { ...q, [k]: e });
    neu(c, { ...q, [k]: { ...v, [ek]: null } });
    const ea = v[ek];
    if (Array.isArray(ea)) for (const w of [ea.slice(0, 1), [], [[ea[0]]], [[ea[0], ""]]]) neu(c, { ...q, [k]: { ...v, [ek]: w } });
    if (ea && typeof ea === "object" && !Array.isArray(ea)) {       // z. B. variablen.x = {min, max, schritt}
      const d = ea as Q;
      for (const w of [{ max: d.min }, { max: Number(d.min) - 1 }, { schritt: 0 }, { schritt: -1 }, { min: "1" }])
        neu(c, { ...q, [k]: { ...v, [ek]: { ...d, ...w } } });
    }
  }
}

/** Fassungen eines Feldes `k`: fehlend, schlecht belegt, dann je nach Form des Wertes. */
function verderbeFeld(c: Sammler, k: string): void {
  const q = c.q;
  const bleibt = k === "id";
  const ohne = { ...q }; delete ohne[k]; neu(c, ohne, bleibt);
  for (const w of SCHLECHT) neu(c, { ...q, [k]: w }, bleibt);
  const v = q[k];
  if (Array.isArray(v) && v.length) verderbeArray(c, k, v);
  else if (v && typeof v === "object") verderbeObjekt(c, k, v as Q);
}

/** Alle verdorbenen Fassungen einer Frage (eine Ebene tief, bei Objekten und Array-Elementen zwei).
    ⚠️ Jede Fassung bekommt eine EIGENE Kennung (ausser beim Verderben von `id` selbst): mit gleicher
       Kennung waere nur die erste gueltig, und die Pruefung der `varianten` liefe nie (Sabotage 26.09.). */
export function varianten(q: Q): Q[] {
  const c: Sammler = { q, out: [q], n: 0 };
  for (const k of Object.keys(q)) verderbeFeld(c, k);
  for (const t of TYPEN) if (t !== q.typ) neu(c, { ...q, typ: t });
  for (const m of ["M09", "M10", "M00", "M1"]) neu(c, { ...q, modul: m });
  return c.out;
}
