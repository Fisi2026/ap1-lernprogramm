/* ============================================================================
   N34 T1 (E49, E50, 25.09.2026): Die vier AP1-Aufgaben
   Uebernommen aus `referenz/logik.js` (Z. 1207-1212, 1213-1214) - Werte UND Kommentare wortgleich,
   per Skript ausgeschnitten. Gehalten von `tabellen.gleichheit.test.ts` gegen die
   eingefrorene `referenz/logik.js`.
   ⚠️ Bis T2-T5 rechnen die Funktionen in logik.js noch mit IHRER Abschrift dieser Werte;
      der Test haelt beide gleich. Ein Wert aendert sich hier nicht still.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49: sonst laedt Node sie nicht).
   ⛔ Diese Datei importiert nichts - Werkzeuge laden sie direkt (T6).
   ============================================================================ */

export const AP1_AUFGABEN = [
  { nr: 1, titel: "Auftrag, Kundenberatung & kaufmännische Prozesse", punkte: 25, module: ["M01", "M02"] },
  { nr: 2, titel: "Softwarelösung: Lasten-/Pflichtenheft, UML, Datenmodell & Programmierung", punkte: 25, module: ["M04-sw"] },
  { nr: 3, titel: "IT-Systeme, Hardware & Netzwerk", punkte: 26, module: ["M03", "M04-netz"] },
  { nr: 4, titel: "Qualität, IT-Sicherheit, Datenschutz & Auftragsabschluss", punkte: 24, module: ["M05", "M06", "M07"] }
];

/* Welche M04-Feinthemen zur NETZ-Aufgabe zaehlen; alle uebrigen M04-Themen sind Software. */
export const M04_NETZ: string[] = ["IP-Adressierung", "Subnetting", "DHCP & Netzwerkdienste", "Konsolenbefehle & Fehlersuche", "WLAN & VPN"];
