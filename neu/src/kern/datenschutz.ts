/* Die Werte des Datenschutzhinweises (Audit AUD-A2) – eigene Datei, weil eine Komponentendatei nur
   Komponenten exportieren soll (oxlint only-export-components). Freigegeben vom Nutzer am 26.09.2026. */
export const VERANTWORTLICH = { name: "J. Winterberg", mail: "joergwinterberg@web.de" } as const;
/** ⛔ Muss `AUFBEWAHRUNG` in server/api.ts entsprechen – `datenschutz.jsdom.test.tsx` vergleicht. */
export const FRIST_TEXT = { erledigtTage: 365, fehlerTage: 90 } as const;
