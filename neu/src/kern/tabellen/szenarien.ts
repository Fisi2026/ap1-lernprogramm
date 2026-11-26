/* ============================================================================
   N34 T1 (E49, E50, 25.09.2026): Szenarien und Zahlensysteme der Generatoren
   Uebernommen aus `referenz/logik.js` (Z. 1488-1499, 1580-1613, 1622-1625) - Werte UND Kommentare wortgleich,
   per Skript ausgeschnitten. Gehalten von `tabellen.gleichheit.test.ts` gegen die
   eingefrorene `referenz/logik.js`.
   ⚠️ Bis T2-T5 rechnen die Funktionen in logik.js noch mit IHRER Abschrift dieser Werte;
      der Test haelt beide gleich. Ein Wert aendert sich hier nicht still.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49: sonst laedt Node sie nicht).
   ⛔ Diese Datei importiert nichts - Werkzeuge laden sie direkt (T6).
   ============================================================================ */

/* Projekt-Szenarien für Netzplan-Aufgaben (Rhaus-Metall-GmbH-Kontext).
   Jedes Szenario benennt die Vorgänge A..F fachlich sinnvoll.            */
export const NETZPLAN_SZENARIEN = [
  { titel: "Serverraum-Umbau", text: "Die Rhaus-Metall-GmbH baut ihren Serverraum am Standort Wuppertal um. Die Projektleitung hat folgende Vorgänge mit Dauer (in Arbeitstagen) und Abhängigkeiten geplant.",
    namen: { A: "Ist-Analyse & Messung", B: "Angebotseinholung Klimatechnik", C: "Demontage Alt-Racks", D: "Bestellung & Lieferung", E: "Montage & Verkabelung", F: "Abnahme & Dokumentation" } },
  { titel: "Rollout Client-Arbeitsplätze", text: "In der Fertigungshalle der Rhaus-Metall-GmbH werden 40 neue IT-Arbeitsplätze eingerichtet. Der Projektplan enthält folgende Vorgänge (Dauer in Arbeitstagen).",
    namen: { A: "Anforderungsaufnahme", B: "Netzwerkdosen prüfen", C: "Master-Image erstellen", D: "Patchfeld erweitern", E: "Geräte installieren & anschließen", F: "Einweisung & Übergabe" } },
  { titel: "Einführung Ticketsystem", text: "Die IT-Abteilung der Rhaus-Metall-GmbH führt ein neues Ticketsystem ein. Folgende Vorgänge sind geplant (Dauer in Arbeitstagen).",
    namen: { A: "Auswahl & Beschaffung", B: "Prozesse dokumentieren", C: "Server aufsetzen", D: "Kategorien & Workflows definieren", E: "Testbetrieb mit Pilotgruppe", F: "Go-Live & Schulung" } },
  { titel: "Standortvernetzung", text: "Die Rhaus-Metall-GmbH bindet einen neuen Vertriebsstandort per VPN an die Zentrale an. Der Projektplan umfasst folgende Vorgänge (Dauer in Arbeitstagen).",
    namen: { A: "Bandbreitenbedarf ermitteln", B: "Provider-Angebote vergleichen", C: "Router konfigurieren", D: "Leitung beauftragen", E: "VPN einrichten & testen", F: "Monitoring aufschalten" } }
];

export const GANTT_SZENARIEN = [
  { titel: "Website-Relaunch", text: "Die Rhaus-Metall-GmbH überarbeitet ihre Firmen-Website. Plane die Vorgänge so früh wie möglich (Ende-Start-Beziehung).",
    vorgaenge: [
      { id: "A", name: "Konzept & Struktur", dauer: 2, vorgaenger: [] },
      { id: "B", name: "Design erstellen", dauer: 3, vorgaenger: ["A"] },
      { id: "C", name: "Texte schreiben", dauer: 2, vorgaenger: ["A"] },
      { id: "D", name: "Umsetzung/Programmierung", dauer: 4, vorgaenger: ["B", "C"] },
      { id: "E", name: "Test & Livegang", dauer: 2, vorgaenger: ["D"] }
    ] },
  { titel: "Serverraum-Umbau", text: "Der Serverraum am Standort Wuppertal wird umgebaut. Trage für jeden Vorgang den frühesten Start- und End-Tag ein.",
    vorgaenge: [
      { id: "A", name: "Ist-Analyse", dauer: 2, vorgaenger: [] },
      { id: "B", name: "Klimatechnik bestellen & liefern", dauer: 4, vorgaenger: ["A"] },
      { id: "C", name: "Alt-Racks demontieren", dauer: 2, vorgaenger: ["A"] },
      { id: "D", name: "Montage & Verkabelung", dauer: 3, vorgaenger: ["B", "C"] },
      { id: "E", name: "Abnahme & Doku", dauer: 1, vorgaenger: ["D"] }
    ] },
  { titel: "Ticketsystem einführen", text: "Die IT-Abteilung führt ein neues Ticketsystem ein. Ermittle die früheste Terminlage aller Vorgänge.",
    vorgaenge: [
      { id: "A", name: "Auswahl & Beschaffung", dauer: 3, vorgaenger: [] },
      { id: "B", name: "Server aufsetzen", dauer: 2, vorgaenger: ["A"] },
      { id: "C", name: "Workflows definieren", dauer: 4, vorgaenger: ["A"] },
      { id: "D", name: "Testbetrieb", dauer: 2, vorgaenger: ["B", "C"] },
      { id: "E", name: "Go-Live & Schulung", dauer: 1, vorgaenger: ["D"] }
    ] },
  { titel: "Standort per VPN anbinden", text: "Ein neuer Vertriebsstandort wird per VPN angebunden. Plane die Vorgänge frühestmöglich.",
    vorgaenge: [
      { id: "A", name: "Bedarf ermitteln", dauer: 2, vorgaenger: [] },
      { id: "B", name: "Leitung beauftragen", dauer: 5, vorgaenger: ["A"] },
      { id: "C", name: "Router konfigurieren", dauer: 3, vorgaenger: ["A"] },
      { id: "D", name: "VPN einrichten & testen", dauer: 2, vorgaenger: ["B", "C"] },
      { id: "E", name: "Monitoring aufschalten", dauer: 1, vorgaenger: ["D"] }
    ] }
];

export const ZAHLENSYSTEME = [
  { name: "Dezimal", basis: 10 }, { name: "Binär", basis: 2 },
  { name: "Oktal", basis: 8 }, { name: "Hexadezimal", basis: 16 }
];
