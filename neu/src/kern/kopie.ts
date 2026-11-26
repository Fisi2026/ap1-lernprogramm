/* ============================================================================
   N38 Q1 (30.09.2026): TIEFE KOPIE EINES REINEN JSON-WERTS.
   Ersetzt neunmal `JSON.parse(JSON.stringify(stand)) as Lernstand` durch EINE Stelle.
   Bewusst JSON statt `structuredClone`: gleiche Wirkung wie bisher (Felder mit `undefined`
   fallen weg – so wie beim Speichern), die Gleichheitstests gegen die Referenz bleiben wortgleich.
   ⚠️ Die EINE Umwandlung hier ist begruendet: `T` ist hier immer ein Wert, der aus JSON stammt
      und wieder als JSON gespeichert wird (Lernstand) – die Kopie hat dieselbe Gestalt.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49). Diese Datei importiert nichts.
   ============================================================================ */
export function jsonKopie<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}
