/* ============================================================================
   N38 Q1 (30.09.2026): TYPWAECHTER FUER WERTE AUS DEM ZUSTAND (Antworten, gespeicherte Listen).
   Ersetzt `Array.isArray(x) ? (x as string[]) : …` – dort war nur die LISTE geprueft, der Inhalt
   behauptet. `listeVon` prueft jedes Element; passt eines nicht, gilt die Liste als nicht da
   (der Aufrufer nimmt dann seinen Grundzustand, wie bei „keine Liste").
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49). Diese Datei importiert nichts.
   ============================================================================ */
export type Waechter<T> = (x: unknown) => x is T;

export const istText: Waechter<string> = (x): x is string => typeof x === "string";
export const istZahl: Waechter<number> = (x): x is number => typeof x === "number";
/** Ein einfaches Objekt (kein `null`, keine Liste) – seine Felder sind noch ungeprueft. */
export const istObjekt: Waechter<Record<string, unknown>> = (x): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
export const istWahrheit: Waechter<boolean> = (x): x is boolean => typeof x === "boolean";

/** `x` oder `null` zulassen. */
export function oderNull<T>(w: Waechter<T>): Waechter<T | null> {
  return (x): x is T | null => x === null || w(x);
}
/** Eine Liste, deren Elemente ALLE `w` bestehen. */
export function listeAus<T>(w: Waechter<T>): Waechter<T[]> {
  return (x): x is T[] => Array.isArray(x) && x.every((e) => w(e));
}
/** `x` darf fehlen (`undefined`) oder muss `w` bestehen – fuer optionale Felder. */
export function optional<T>(w: Waechter<T>): Waechter<T | undefined> {
  return (x): x is T | undefined => x === undefined || w(x);
}
/** Ein Objekt als Nachschlagetabelle (Antwortstand „Stelle → Wert“): nur die Eintraege, deren Wert
    `w` besteht; kein Objekt → leere Tabelle. Die Eingaben schreiben nur passende Werte hinein. */
export function tabelleVon<T>(x: unknown, w: Waechter<T>): Record<string, T> {
  const aus: Record<string, T> = {};
  if (istObjekt(x)) for (const [k, v] of Object.entries(x)) if (w(v)) aus[k] = v;
  return aus;
}
/** Die Liste, wenn sie ganz passt – sonst `null`. */
export function listeVon<T>(x: unknown, w: Waechter<T>): T[] | null {
  return listeAus(w)(x) ? x : null;
}
