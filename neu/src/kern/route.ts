/* ============================================================================
   ADRESSEN IM NEUBAU (Etappe N22)

   Vorbild: das Hash-Routing der alten App (app_ui.js, G4.2 #29) — `#ueben`,
   `#stat`, `#frage=M03-907`. Nutzer-Entscheid 17.09.2026: „sinnvoll neu bauen".
   Deshalb dasselbe Format, damit ein Link aus der alten App auch hier trägt,
   aber als reine Funktionen, die ohne Browser prüfbar sind.

   ⚠️ BEWUSST location.hash statt history.pushState: der Neubau liegt unter
      `/v2/` auf einem Server, der unbekannte Pfade nicht auf index.html umlenkt.
      Ein Hash erreicht den Server nie.
   ⛔ Unbekanntes fällt still auf die Startseite zurück, `#frage` ohne Kennung
      ebenso — wie in der alten App. Ob die Kennung existiert, entscheidet erst
      der Schirm, und er sagt es dann selbst.
   ============================================================================ */

export const BEREICHE = [
  "start", "ueben", "unterricht", "serie", "fd", "markiert", "sim",
  "gen", "netzplan", "gantt",
  "glossar", "spickzettel", "stat",
  "einst", "meldungen", "frage",
] as const;

export type Bereich = (typeof BEREICHE)[number];

export interface Route {
  bereich: Bereich;
  /** Nur bei `frage` gesetzt. */
  frageId: string | null;
}

export const START: Route = { bereich: "start", frageId: null };

function entschluessle(s: string): string {
  try { return decodeURIComponent(s); } catch { return s; }
}

/** Liest einen Hash (`#ueben`, `frage=M03-907`, "") in eine Route. */
export function lies(hash: string | null | undefined): Route {
  const h = (hash ?? "").replace(/^#/, "");
  if (!h) return START;
  const teile = h.split("=");
  const name = entschluessle(teile[0] ?? "").trim();
  const wert = teile.length > 1 ? entschluessle(teile.slice(1).join("=")).trim() : "";
  const bereich = BEREICHE.find((b) => b === name);   // N38 Q1: find statt includes + Umwandlung
  if (bereich === undefined) return START;
  if (bereich === "frage") return wert ? { bereich: "frage", frageId: wert } : START;
  return { bereich, frageId: null };
}

/** Schreibt eine Route als Hash, mit führendem `#`. */
export function schreibe(r: Route): string {
  if (r.bereich === "frage") return r.frageId ? "#frage=" + encodeURIComponent(r.frageId) : "#start";
  return "#" + r.bereich;
}

export function gleich(a: Route, b: Route): boolean {
  return a.bereich === b.bereich && (a.frageId ?? null) === (b.frageId ?? null);
}
