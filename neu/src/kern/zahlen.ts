/* ============================================================================
   N34 T2 (E50, E52, 26.09.2026): ZAHLEN-HILFEN AUS `logik.js`
   Uebernommen aus `referenz/logik.js` (Z. 717-751): `rundeAuf`, `runde2`, `toleranzFuer`,
   `zahlAusText` – Regeln UND Kommentare wortgleich, nur typisiert. Hier und nicht erst in T5,
   weil die Bewertung (`gradeRechenassistent`) sie braucht (Nutzer-Entscheid E52).
   Gehalten von `bewertung.gleichheit.test.ts` gegen `referenz/logik.js`.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49). Diese Datei importiert nichts.
   ============================================================================ */

/* Kaufmännisch auf 2 Dezimalen runden (Halbe aufwärts, vorzeichenrichtig).
   Der Epsilon-Zuschlag fängt Binärdarstellungsfehler ab (1.005 -> 1.01).      */
export function rundeAuf(x: unknown, dezimalen?: unknown): number {
  const v = Number(x);
  if (!isFinite(v)) return NaN;
  const d = (typeof dezimalen === "number" && dezimalen >= 0 && dezimalen <= 6) ? Math.floor(dezimalen) : 2;
  const p = Math.pow(10, d);
  const s = v < 0 ? -1 : 1;
  /* winziges ABSOLUTES Epsilon gegen Binärdarstellungsfehler (1.005 -> 1.01).
     Bewusst nicht relativ zum Betrag: das verfälschte große Werte (2e12 -> 2e12+2). */
  return s * Math.round((Math.abs(v) + 1e-9) * p) / p;
}
export function runde2(x: unknown): number { return rundeAuf(x, 2); }

/* Toleranz zur Rundungsvorgabe: Standard 1 Cent bei 2 Dezimalen (Nutzer-Entscheid G2.6);
   bei gröberer Vorgabe die halbe letzte Stelle, damit korrekt gerechnete, nur anders
   gerundete Eingaben nicht als falsch gelten. Ganzzahlige Schritte bleiben streng.   */
export function toleranzFuer(dezimalen?: unknown): number {
  const d = (typeof dezimalen === "number" && dezimalen >= 0) ? Math.floor(dezimalen) : 2;
  if (d >= 2) return 0.01;
  if (d === 1) return 0.05;
  return 0.01;
}

/* Deutsche Zahleingabe -> Number: "3.000,50" / "3000,5" / "3000.5" / "1 234" */
export function zahlAusText(s: unknown): number {
  if (typeof s === "number") return isFinite(s) ? s : NaN;
  let t = String(s ?? "").trim().replace(/\s| /g, "");
  if (t === "") return NaN;
  t = t.replace(/[€$]|EUR|eur/g, "");
  if (t.indexOf(",") >= 0) t = t.replace(/\./g, "").replace(",", ".");   /* Komma = Dezimaltrenner */
  else if ((t.match(/\./g) ?? []).length > 1) t = t.replace(/\./g, "");  /* nur Tausenderpunkte */
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");    /* 3.000 = dreitausend */
  const v = parseFloat(t);
  return isFinite(v) ? v : NaN;
}
