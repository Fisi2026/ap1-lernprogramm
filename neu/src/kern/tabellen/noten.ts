/* ============================================================================
   N34 T1 (E49, E50, 25.09.2026): Notenschluessel und Bereitschafts-Ampel
   Uebernommen aus `referenz/logik.js` (Z. 380-390, 391-391, 245-245) - Werte UND Kommentare wortgleich,
   per Skript ausgeschnitten. Gehalten von `tabellen.gleichheit.test.ts` gegen die
   eingefrorene `referenz/logik.js`.
   ⚠️ Bis T2-T5 rechnen die Funktionen in logik.js noch mit IHRER Abschrift dieser Werte;
      der Test haelt beide gleich. Ein Wert aendert sich hier nicht still.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49: sonst laedt Node sie nicht).
   ⛔ Diese Datei importiert nichts - Werkzeuge laden sie direkt (T6).
   ============================================================================ */

/* IHK-Notenschlüssel (100-Punkte-Schlüssel, G3.6a #5): 92 / 81 / 67 / 50 / 30.
   Unterhalb von 50 % wird jetzt zwischen „mangelhaft" (Note 5) und „ungenügend" (Note 6)
   unterschieden – vorher fiel beides pauschal auf Note 5. Bestanden ab 50 %. */
export const NOTEN_SCHLUESSEL = [
  { ab: 92, note: 1, text: "sehr gut" },
  { ab: 81, note: 2, text: "gut" },
  { ab: 67, note: 3, text: "befriedigend" },
  { ab: 50, note: 4, text: "ausreichend" },
  { ab: 30, note: 5, text: "mangelhaft" },
  { ab: 0, note: 6, text: "ungenügend" }
];

export const NOTE_BESTANDEN_AB: number = 50;

export const BEREITSCHAFT_AMPEL = { rot: 60, gelb: 80 };   // score<rot=rot, rot..gelb=gelb, >gelb=grün
