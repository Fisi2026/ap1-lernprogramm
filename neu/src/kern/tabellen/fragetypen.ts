/* ============================================================================
   N34 T1 (E49, E50, 25.09.2026): Die Fragetyp-Registry ohne Bewerter
   Uebernommen aus `referenz/logik.js` (Z. 1096-1125, 407-407) - Werte UND Kommentare wortgleich,
   per Skript ausgeschnitten. Gehalten von `tabellen.gleichheit.test.ts` gegen die
   eingefrorene `referenz/logik.js`.
   ⚠️ Bis T2-T5 rechnen die Funktionen in logik.js noch mit IHRER Abschrift dieser Werte;
      der Test haelt beide gleich. Ein Wert aendert sich hier nicht still.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49: sonst laedt Node sie nicht).
   ⛔ Diese Datei importiert nichts - Werkzeuge laden sie direkt (T6).
   ============================================================================ */

/** Die Daten der Fragetyp-Registry `L.TYP` OHNE die Bewerter (`grade` zieht mit T2 um). */
export interface TypDaten { simAuto: boolean; sek: number; punkte: number }

export const TYP_DATEN: Record<string, TypDaten> = {
  mc:             { simAuto: true,  sek: 60,  punkte: 1 },
  freitext:       { simAuto: false, sek: 120, punkte: 2 },
  lueckentext:    { simAuto: true,  sek: 75,  punkte: 1 },
  zuordnung:      { simAuto: true,  sek: 90,  punkte: 2 },
  bild:           { simAuto: true,  sek: 60,  punkte: 1 },
  erklaeren:      { simAuto: false, sek: 150, punkte: 3 },
  mehrfach:       { simAuto: true,  sek: 90,  punkte: 2 },
  /* ⚠️ simAuto 2026-08-27 von false auf true. ANLASS: Die urspruengliche Begruendung lautete
     "simAuto:false (wie uebrige interaktive Typen; Sim-Renderer aus Scope - bewusst, dokumentiert)".
     Gemessen an diesem Tag: renderSimFrage() in app_sim.js ruft renderFrage() auf - DENSELBEN
     Renderer wie der Uebungsmodus. Einen eigenen Sim-Renderer gibt es nicht und gab es nie.
     ►► Die Grenze war eine Behauptung ueber das Werkzeug, und die ist abgelaufen. Folge des
     alten Zustands: 6 der 45 Fall-Teilaufgaben waren fuer keinen Lerner erreichbar, weil die
     Faelle NUR in der Simulation vorkommen und dort weggefiltert wurden. */
  mtf:            { simAuto: true,  sek: 120, punkte: 2 },
  kreuztabelle:   { simAuto: false, sek: 120, punkte: 2 },
  szenario2:      { simAuto: false, sek: 120, punkte: 2 },
  reihenfolge:    { simAuto: true,  sek: 75,  punkte: 2 },
  dropdown:       { simAuto: true,  sek: 75,  punkte: 1 },
  hotspot:        { simAuto: false, sek: 60,  punkte: 1 },
  fehlersuche:    { simAuto: false, sek: 120, punkte: 2 },
  rechenassistent:{ simAuto: false, sek: 150, punkte: 3 },
  matrix:         { simAuto: false, sek: 90,  punkte: 2 },
  beschriftung:   { simAuto: false, sek: 90,  punkte: 2 },
  trace:          { simAuto: false, sek: 120, punkte: 2 },
  konsole:        { simAuto: false, sek: 90,  punkte: 2 },
  kalkulation:    { simAuto: false, sek: 150, punkte: 3 },
  baukasten:      { simAuto: false, sek: 120, punkte: 2 }
};

export const TYP_META_DEFAULT = { sek: 90, punkte: 1 };

/* Abgeleitete Sichten - wie in logik.js aus der Registry gebildet, nicht abgeschrieben. */
export const TYPEN: string[] = Object.keys(TYP_DATEN);
export const SIM_TYPEN: string[] = TYPEN.filter((t) => TYP_DATEN[t]?.simAuto === true);
export const TYP_META: Record<string, { sek: number; punkte: number }> = {};
for (const [t, d] of Object.entries(TYP_DATEN)) TYP_META[t] = { sek: d.sek, punkte: d.punkte };
