/* ============================================================================
   N34 T3 (E50, E53, 26.09.2026): ZUFALL AUS `logik.js`
   Uebernommen aus `referenz/logik.js` (Z. 47-57, 98-107): `shuffle`, `pick`, `pickGewichtet` –
   Regeln UND Kommentare wortgleich, typisiert. Eigene Datei, weil Lernen (T3), Simulation (T4)
   und Generatoren (T5) sie teilen (E53, vom Chat entschieden).
   Gehalten von `lernen.gleichheit.test.ts` (geseedeter Zufall) gegen `referenz/logik.js`
   (die Wurzel-Fassung fiel mit T6c).
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49). Diese Datei importiert nichts.
   ============================================================================ */
export type Zufall = () => number;

/* ---------------- Zufall & Shuffle ---------------- */
export function shuffle<T>(arr: readonly T[], rng?: Zufall): T[] {
  const r = rng ?? Math.random;
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const t = a[i] as T; a[i] = a[j] as T; a[j] = t;
  }
  return a;
}
/* N37 Ratsche (E60, 27.09.2026): bei einer NICHT-LEEREN Liste (Literal/Tupel) liefert pick sicher ein Element –
   der Zufall liegt vertragsgemaess in [0, 1). Das spart am Aufrufer das `as number`/`as string`. */
export function pick<T>(arr: readonly [T, ...T[]], rng?: Zufall): T;
export function pick<T>(arr: readonly T[], rng?: Zufall): T | undefined;
export function pick<T>(arr: readonly T[], rng?: Zufall): T | undefined {
  const r = rng ?? Math.random;
  return arr[Math.floor(r() * arr.length)];
}

/* ---------------- Gewichtungs-Engine (A3 = #51+#62+#97) ----------------
   Kombiniert multiplikativ (Nutzer-Entscheid 2026-07-12):
   1. IHK-Relevanz je Thema (3 hoch / 2 mittel / 1 niedrig), Toggle S.relevanzGewichtung
   2. Themenschwäche (ab >30 beantworteten Fragen): Faktor 1.5 - geglättete Trefferquote
   3. Interleaving: Malus x0.3 für Themen der letzten 2 Fragen (immer aktiv)
   Untergrenze 0.15 – keine Frage fällt auf Gewicht 0.                    */
export function pickGewichtet<T>(ids: readonly T[] | null | undefined, gewichtFn: (id: T) => unknown, rng?: Zufall): T | undefined {
  const r = rng ?? Math.random;
  if (!ids || !ids.length) return undefined;
  let summe = 0;
  const gw = ids.map((id) => { const w = Math.max(0, Number(gewichtFn(id)) || 0); summe += w; return w; });
  if (summe <= 0) return pick(ids, r);
  let z = r() * summe;
  for (const [i, w] of gw.entries()) { z -= w; if (z < 0) return ids[i]; }
  return ids[ids.length - 1];
}
