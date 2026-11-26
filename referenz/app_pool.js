"use strict";
/* =================== Fragenpool + Selbsttest =================== */
var POOL = [], POOL_FEHLER = [], POOL_INDEX = Object.create(null);   // #94: id -> Frage für O(1)-frageById
(function selbsttest() {
  var roh = (typeof FRAGEN !== "undefined") ? FRAGEN : [];
  var v = L.validateFragen(roh);
  POOL = v.gueltig; POOL_FEHLER = v.fehler;
  POOL_INDEX = Object.create(null);
  POOL.forEach(function(f){ POOL_INDEX[f.id] = f; });
})();
var MODULE = [
  ["M01","Projektmanagement"],["M02","Kundenberatung & Marketing"],["M03","IT-Systeme & Hardware"],
  ["M04","IT-Lösungen & Programmierung"],["M05","Qualitätssicherung"],["M06","IT-Sicherheit & Datenschutz"],
  ["M07","Leistungserbringung & Verträge"],["M08","WiSo"]
];
var MODUL_DATEI = {
  M01:"01_Projektmanagement_und_Arbeitsorganisation.md",
  M02:"02_Kundenberatung_Kommunikation_Marketing.md",
  M03:"03_IT-Systeme_Hardware_Wirtschaftlichkeit.md",
  M04:"04_IT-Loesungen_Software_Programmierung.md",
  M05:"05_Qualitaetssicherung.md",
  M06:"06_IT-Sicherheit_und_Datenschutz.md",
  M07:"07_Leistungserbringung_und_Auftragsabschluss.md"
};
/* M09 „Klausurvorbereitung" (2026-07-20): klassen-/klausurspezifischer Stoff (FISI0126, Klausur
   31.07.2026). Steht BEWUSST NICHT in MODULE – dadurch ignorieren alle MODULE-Schleifen
   (Start-Statistik, Üben-Checkboxen, Serie, Statistik-Seite, Glossar) das Modul automatisch.
   Zugriff NUR über die eigene Seite sUnterricht. */
var UNTERRICHT_MODUL = ["M09", "Klausurvorbereitung"];
function istUnterricht(f){ return !!f && f.modul === UNTERRICHT_MODUL[0]; }
function modulName(m){ if (m === UNTERRICHT_MODUL[0]) return UNTERRICHT_MODUL[1]; var e = MODULE.find(function(x){return x[0]===m;}); return e ? e[1] : m; }
function frageById(id){ return POOL_INDEX[id]; }   // #94: O(1) statt POOL.find
/* AP-Filter: nur AP1-Prüfungsstoff, außer der Nutzer schaltet AP2-Zusatz zu.
   Schließt seit 2026-07-20 auch M09 aus – der Unterrichts-Pool darf NIE in die allgemeine
   Zufallsauswahl (Üben, Due-Injection, Serie, Markiert-Zählung). Die Deck-SEITE filtert bewusst
   nicht hierüber, damit falsch beantwortete M09-Fragen dort wiederkommen (gemeinsames Deck). */
function passtAP(f){ return (S.inklAP2 || f.pruefungsteil !== "AP2") && !istUnterricht(f); }
function poolAP(){ return POOL.filter(passtAP); }
/* FB-R3 Punkt 6: Prüfungsteil-Filter der ÜBEN-Themenauswahl. Bewusst getrennt von passtAP():
   passtAP steuert die globalen Ansichten (Startseiten-Statistik, Statistik-Seite, Relevanz,
   Simulation) und bleibt AP1-zentriert (S.inklAP2). Die Üben-Auswahl dagegen kennt seit Punkt 6
   den Dreiklang AP1 / AP2 / beide (S.uebenAP, Default „beide"). M09 (Unterricht) ist hier wie
   überall ausgeschlossen. */
function uebenPasst(f){
  if (!f || istUnterricht(f)) return false;
  if (S.uebenAP === "ap1") return f.pruefungsteil !== "AP2";
  if (S.uebenAP === "ap2") return f.pruefungsteil === "AP2";
  return true;                                       // „beide"
}
/* AP2-Prüfungsbereiche laut Prüfungskatalog FIS 2024 (2. Auflage, Okt. 2024),
   Fachrichtung Systemintegration: „Konzeption und Administration von IT-Systemen" (B1),
   „Analyse und Entwicklung von Netzwerken" (B2) und „Wirtschafts- und Sozialkunde" (B3 = M08).
   B1 und B2 haben inzwischen Fragen (ER-Modell 10, IP-Adressierung/Subnetting 12); ihre übrigen
   Katalog-Fragenkomplexe sind noch leer und stehen deshalb weiter als „bald"-Hinweis unter den
   echten Feinthemen (AP2_PLATZHALTER, gerendert in app_seiten.js).
   ⚠️ HIER STANDEN BIS 2026-07-26 `AP2_FACHTHEMEN` UND `ap2ThemaAnzahl()` – beide ENTFERNT, weil
   sie NIRGENDS gelesen wurden (weder App noch HTML noch Tests). Sie stammen aus dem Entwurf mit
   eigenen AP2-Kacheln; den hat FB-R3 Etappe 2 durch die gebiets-basierte Themenauswahl ersetzt.
   Alle 76 AP2-Fragen tragen ein Gebiet (B1 10 · B2 12 · B3 54) und sind darüber erreichbar –
   nachgemessen am 26.07. Wer AP2 künftig thema-genau anzeigen will, baut es gegen L.GEBIETE. */
var AP2_PLATZHALTER = [
  { titel: "Konzeption und Administration von IT-Systemen",
    fk: [
      "Konzipieren und Realisieren von IT-Systemen – Systemkomponenten, Server, Virtualisierung, Migration, Tests, Lifecycle",
      "Administrieren von IT-Systemen – Lizenz-, Berechtigungs- und Authentifizierungsmanagement, Updates, Datensicherung, Backup/Restore, Monitoring"
    ] },
  { titel: "Analyse und Entwicklung von Netzwerken",
    fk: [
      "Installieren und Konfigurieren von Netzwerken – Protokolle, Topologien, Netzwerkkomponenten, Dienste (DNS/DHCP/VLAN/Routing), Analyse & Optimierung, IT-Sicherheit im Netz"
    ] }
];
/* ══ Schwerpunkt „Wirtschaft" (FB-R3, Nutzerbefund 2026-07-22) ══════════════════════════════
   ANLASS: Der Nutzer suchte WiSo-Fragen in der AP1 und fand keine. Grund: „WiSo" (M08) ist laut
   Prüfungskatalog EIGENER Prüfungsbereich der AP2 – im AP1-Modus ist das Modul zwangsläufig leer.
   Der wirtschaftliche AP1-Stoff EXISTIERT, verteilt sich aber über M01/M02/M03/M07 und war
   deshalb nicht als solcher auffindbar.
   LÖSUNG: kuratierte Themenliste statt eines neuen Moduls. Ein Modul „WiSo" für AP1 wäre fachlich
   falsch; ein zusätzliches Feld an ~190 Fragen wäre ein pool-weiter Eingriff (Risiko siehe
   v1.4.0). Diese Liste kostet keine Pool-Änderung und ist an einer Stelle pflegbar.
   ⚠️ Die Paare müssen EXAKT den kanonischen Themen entsprechen (Keys von L.THEMA_RELEVANZ).
   Ein Tippfehler würde still weniger Fragen liefern statt zu scheitern – test_wirtschaft prüft
   deshalb jedes Paar gegen den echten Pool. */
var WIRTSCHAFT_THEMEN = [
  ["M01", "Machbarkeit & Kalkulation"],          /* Katalog 1.2 Machbarkeit/Wirtschaftlichkeit  */
  ["M02", "Marktformen & Marktsituation"],       /* Katalog 2.1 Marktsituationen bewerten       */
  ["M02", "Bezugskalkulation & Skonto"],         /* Katalog 2.1 quantitative Angebotsbewertung  */
  ["M02", "Nutzwertanalyse"],                    /* Katalog 2.1/2.5 qualitative Bewertung       */
  ["M02", "Bedarfsanalyse & Marktforschung"],    /* Katalog 2.2 Bedarfsanalyse                  */
  ["M02", "Vertriebsformen"],                    /* Katalog 2.5 Vertriebsformen                 */
  ["M03", "Wirtschaftlichkeit & TCO"],           /* Katalog 3.4 Wirtschaftlichkeit IT-Systeme   */
  ["M07", "Vertragsarten"],                      /* Katalog 7.1 Vertragsarten                   */
  ["M07", "Vertragsstörungen & Mängel"],         /* Katalog 7.1 Vertragsstörungen               */
  ["M07", "SLA & Servicevertrag"],               /* Katalog 7.1 Servicevertrag/SLA              */
  ["M07", "Unternehmensziele & Leitbild"],       /* Katalog 7.2 Zielsetzungen/Leitbild          */
  ["M07", "Aufbauorganisation & Vollmachten"],   /* Katalog 7.4 Aufbauorganisation, Vollmachten */
  ["M07", "Soll-Ist & Nachkalkulation"]          /* Katalog 7.7 Soll-Ist, Nachkalkulation       */
];
function istWirtschaft(f){
  if (!f) return false;
  for (var i = 0; i < WIRTSCHAFT_THEMEN.length; i++) {
    if (WIRTSCHAFT_THEMEN[i][0] === f.modul && WIRTSCHAFT_THEMEN[i][1] === f.thema) return true;
  }
  return false;
}
/* Zahl der aktuell erreichbaren Wirtschafts-Fragen – haengt an S.inklAP2, deshalb dynamisch.
   Steht am Haekchen, damit man VOR dem Anhaken sieht, wie viel dahinter liegt (der Nutzer hat
   genau diese Information vermisst). */
function wirtschaftAnzahl(){
  var n = POOL.filter(function(f){ return passtAP(f) && istWirtschaft(f); }).length;
  return n + (n === 1 ? " Frage" : " Fragen");
}
/* R5 State-Hygiene: tote fehlerDeck-/markiert-IDs entfernen (z. B. Fall-Teilaufgaben „<fallId>-t<i>"
   aus simAbgeben oder gelöschte Pool-Fragen). SICHERHEITSNETZ: nur wenn der Pool nachweislich
   vollständig geladen ist (POOL nicht leer UND keine Validierungsfehler) – sonst NICHTS löschen. */
(function stateHygiene() {
  if (!POOL.length || POOL_FEHLER.length) return;
  var sauber = sanitizeState(POOL_INDEX, S);
  var geaendert = Object.keys(sauber.fehlerDeck).length !== Object.keys(S.fehlerDeck || {}).length ||
                  Object.keys(sauber.markiert).length !== Object.keys(S.markiert || {}).length;
  if (geaendert) mutS(function(s){ s.fehlerDeck = sauber.fehlerDeck; s.markiert = sauber.markiert; });
})();

