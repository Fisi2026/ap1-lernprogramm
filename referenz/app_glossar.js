"use strict";
/* =================== #53 Tooltip-Glossar (kuratierte Kernbegriffe) ===================
   Kurzdefinitionen zu Kernbegriffen. Im Fragetext werden max. 2 exakte Treffer als .glossar-term
   markiert; Tooltip per Hover (Desktop) / Tap (Handy). Gilt nur außerhalb der Simulation und nur bei
   S.glossarTip. Leak-Schutz: kein Treffer, dessen Begriff in einer Antwortoption/Musterlösung vorkommt;
   nur der Fragetext wird gescannt (nie die Optionen). Deutsche Anführungszeichen „…" statt geradem ". */
var GLOSSAR_TIPS = {
  "OSI-Modell": "Referenzmodell mit 7 Schichten für Netzkommunikation (Bitübertragung bis Anwendung).",
  "OSI": "Schichten-Referenzmodell der Netzkommunikation (7 Schichten).",
  "SLA": "Service Level Agreement – vertraglich zugesicherte Dienstgüte (z. B. Verfügbarkeit, Reaktionszeit).",
  "DHCP": "Vergibt IP-Adresse und Netzparameter automatisch an Clients.",
  "DNS": "Domain Name System – löst Namen (z. B. web.de) in IP-Adressen auf.",
  "VLAN": "Virtuelles LAN – logische Trennung eines Switches in getrennte Netze.",
  "VPN": "Verschlüsselter Tunnel über ein öffentliches Netz.",
  "Firewall": "Filtert den Netzverkehr nach Regeln und trennt Netzbereiche.",
  "Subnetzmaske": "Trennt in einer IP-Adresse den Netz- vom Hostanteil.",
  "Subnetz": "Teilnetz eines IP-Netzes, festgelegt durch die Subnetzmaske.",
  "Gateway": "Übergang in andere Netze; typisch der Router als Standard-Gateway.",
  "IP-Adresse": "Eindeutige Adresse eines Geräts im IP-Netz (IPv4/IPv6).",
  "MAC-Adresse": "Weltweit eindeutige Hardware-Adresse einer Netzkarte.",
  "TCP": "Verbindungsorientiertes, zuverlässiges Transportprotokoll (mit Bestätigung).",
  "UDP": "Verbindungsloses, schnelles Transportprotokoll ohne Empfangsbestätigung.",
  "HTTPS": "HTTP über TLS – verschlüsselte Web-Kommunikation.",
  "Backup": "Datensicherung zur Wiederherstellung nach Verlust (voll/inkrementell/differenziell).",
  "Phishing": "Täuschung per Mail/Webseite zum Abgreifen von Zugangsdaten.",
  "Ransomware": "Schadsoftware, die Daten verschlüsselt und Lösegeld fordert.",
  "Malware": "Sammelbegriff für Schadsoftware (Viren, Würmer, Trojaner …).",
  "DSGVO": "EU-Datenschutz-Grundverordnung – Regeln für personenbezogene Daten.",
  "Skonto": "Preisnachlass bei Zahlung innerhalb der Skontofrist.",
  "Nutzwertanalyse": "Bewertung von Alternativen über gewichtete Kriterien × Punkte.",
  "Lastenheft": "Anforderungen des Auftraggebers (das Was) – vom Kunden formuliert.",
  "Pflichtenheft": "Umsetzungskonzept des Auftragnehmers (das Wie) – vom Anbieter erstellt.",
  "kritischer Pfad": "Längste Vorgangskette ohne Puffer – bestimmt die Projektdauer.",
  "Pufferzeit": "Zeitreserve eines Vorgangs, ohne das Projektende zu verzögern.",
  "Netzplan": "Ablaufplan mit Vorgängen, Dauern und Abhängigkeiten (FAZ/FEZ/Puffer).",
  "ROI": "Return on Investment – Verhältnis von Gewinn zu eingesetztem Kapital.",
  "TCO": "Total Cost of Ownership – Gesamtkosten über den Lebenszyklus.",
  "Amortisation": "Zeitraum, bis die Erträge die Investition gedeckt haben.",
  "UML": "Grafische Modellierungssprache für Software (z. B. Klassendiagramm).",
  "Scrum": "Agiles Rahmenwerk mit Sprints, Rollen und Artefakten.",
  "Verfügbarkeit": "Schutzziel: Anteil der Zeit, in der ein System nutzbar ist.",
  "Vertraulichkeit": "Schutzziel: nur Berechtigte haben Zugriff.",
  "Integrität": "Schutzziel: Daten sind unverändert und korrekt.",
  "Verschlüsselung": "Umwandlung von Klartext in Chiffrat mithilfe eines Schlüssels.",
  /* Begriffe aus „Klausurvorbereitung" (M09, 2026-07-20; Modul frueher „Unser Unterricht"). Sie stehen bewusst in DERSELBEN Tabelle:
     Tooltips sind eine reine Lesehilfe im Fragetext und haben mit der Modultrennung nichts zu tun –
     die betrifft die Fragen-ZIEHUNG. Mehrere dieser Begriffe kommen ohnehin auch in AP1-Fragen vor
     (Prokura und Handlungsvollmacht z. B. in Modul 07). Der Leak-Schutz greift unverändert. */
  "Prokura": "Weitreichende Handlungsvollmacht (§§ 48 ff. HGB) – auch außergewöhnliche Geschäfte, aber keine Grundstücksgeschäfte ohne Sondervollmacht.",
  "Handlungsvollmacht": "Vollmacht für die gewöhnlichen Geschäfte eines Handelsbetriebs (§ 54 HGB) – enger als die Prokura.",
  "Prokurist": "Person, der ein Kaufmann Prokura erteilt hat.",
  "Istkaufmann": "Kaufmann kraft Handelsgewerbes in kaufmännischer Weise (§ 1 HGB); Eintragung nur deklaratorisch.",
  "Kannkaufmann": "Kleingewerbetreibender, der sich freiwillig einträgt (§ 2 HGB) – erst die Eintragung macht ihn zum Kaufmann.",
  "Formkaufmann": "Kaufmann allein kraft Rechtsform (z. B. GmbH, AG), unabhängig von der Tätigkeit.",
  "Handelsregister": "Öffentliches Verzeichnis der Kaufleute. Abteilung A: e.K., OHG, KG. Abteilung B: Kapitalgesellschaften.",
  "Firma": "Der Handelsname eines Kaufmanns (§ 17 HGB) – nicht das Unternehmen selbst, sondern sein Name.",
  "Komplementär": "Persönlich und unbeschränkt haftender Gesellschafter einer KG.",
  "Kommanditist": "Gesellschafter einer KG, der nur bis zur Höhe seiner Einlage haftet.",
  "Stammkapital": "Mindestkapital einer GmbH: 25.000 Euro (AG: 50.000 Euro Grundkapital).",
  "Stabsstelle": "Beratende Stelle ohne Weisungsbefugnis; im Organigramm meist gestrichelt angebunden.",
  "Einliniensystem": "Jede Stelle hat genau einen Vorgesetzten – klare Wege, aber lange Dienstwege.",
  "Mehrliniensystem": "Eine Stelle erhält Weisungen von mehreren Fachvorgesetzten – schnell, aber konfliktanfällig.",
  "Stabliniensystem": "Einliniensystem, ergänzt um beratende Stäbe ohne Weisungsbefugnis.",
  "Matrixorganisation": "Zwei Leitungsdimensionen gleichzeitig, meist Funktion × Projekt – flexibel, aber komplex.",
  "Aufgabenanalyse": "Zerlegen der Gesamtaufgabe in Teil- und Elementaraufgaben (top-down).",
  "Aufgabensynthese": "Bündeln der Elementaraufgaben zu Stellen und Abteilungen (bottom-up).",
  "Elementaraufgabe": "Kleinste, nicht weiter sinnvoll teilbare Teilaufgabe der Aufgabenanalyse.",
  "Wertschöpfung": "Wert der erstellten Leistung abzüglich der von Dritten bezogenen Vorleistungen.",
  "Kernprozess": "Prozess, der unmittelbar zur Wertschöpfung beiträgt (Beschaffung, Produktion, Absatz).",
  "Unterstützungsprozess": "Prozess, der nur indirekt zur Wertschöpfung beiträgt (IT, Personal, Verwaltung).",
  "MbO": "Management by Objectives – Führung über gemeinsam vereinbarte Ziele.",
  "MbE": "Management by Exception – Eingriff nur bei Abweichungen vom Plan.",
  "MbD": "Management by Delegation – Übertragung von Aufgaben samt Verantwortung.",
  "Eisenhower-Matrix": "Priorisierung nach Wichtigkeit und Dringlichkeit: sofort, planen, delegieren, weglassen.",
  "Meilenstein": "Ereignis ohne eigene Dauer; im Gantt-Diagramm als Raute dargestellt.",
  "Gesamtpuffer": "Zeitreserve eines Vorgangs: GP = SAZ − FAZ. Vorgänge mit GP = 0 liegen auf dem kritischen Pfad.",
  "Bindefrist": "Zeitraum, in dem der Anbieter an sein Angebot gebunden ist.",
  "Freizeichnungsklausel": "Zusatz wie „freibleibend\", der ein Angebot unverbindlich macht.",
  "Bezugspreis": "Bareinkaufspreis zuzüglich Bezugskosten – das Ergebnis der Bezugskalkulation.",
  "Probezeit": "Beginn der Berufsausbildung, 1 bis 4 Monate (§ 20 BBiG); Kündigung jederzeit fristlos, aber schriftlich.",
  "JArbSchG": "Jugendarbeitsschutzgesetz – Arbeitszeit, Pausen und Urlaub für Beschäftigte unter 18.",
  "BBiG": "Berufsbildungsgesetz – Ausbildungsvertrag, Probezeit, Kündigung, Vergütung."
};
/* Begriffe der Kategorie „Klausurvorbereitung" fürs Begriffslexikon (Glossar-Seite, 2026-07-20).
   Das Lexikon speist sich sonst automatisch aus kurzen erklaeren-Fragen – die fünf M09-Erklärfragen
   sind aber Fallfragen (zu lang, mit Fragezeichen) und fallen durch diesen Filter. Deshalb hier eine
   ausdrückliche Liste. Sie enthält NUR Schlüssel, die Definition steht in GLOSSAR_TIPS: eine Quelle
   für Tooltip und Lexikon, damit beide nicht auseinanderlaufen (ein Test prüft das).
   Im Lexikon sind die Einträge durch den Modul-Tag „Klausurvorbereitung" als Nicht-AP1-Stoff erkennbar. */
var GLOSSAR_M09_BEGRIFFE = ["Prokura", "Handlungsvollmacht", "Prokurist", "Istkaufmann", "Kannkaufmann",
  "Formkaufmann", "Handelsregister", "Firma", "Komplementär", "Kommanditist", "Stammkapital",
  "Stabsstelle", "Einliniensystem", "Mehrliniensystem", "Stabliniensystem", "Matrixorganisation",
  "Aufgabenanalyse", "Aufgabensynthese", "Elementaraufgabe", "Wertschöpfung", "Kernprozess",
  "Unterstützungsprozess", "MbO", "MbE", "MbD", "Eisenhower-Matrix", "Meilenstein", "Gesamtpuffer",
  "Bindefrist", "Freizeichnungsklausel", "Bezugspreis", "Probezeit", "JArbSchG", "BBiG"];
var GLOSSAR_LISTE = null;
function glossarListe(){
  if (GLOSSAR_LISTE) return GLOSSAR_LISTE;
  GLOSSAR_LISTE = Object.keys(GLOSSAR_TIPS).map(function(term){
    var q = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return { term: term, def: GLOSSAR_TIPS[term],
      re: new RegExp("(^|[^0-9A-Za-zÄÖÜäöüß])(" + q + ")(?![0-9A-Za-zÄÖÜäöüß])", "i") };
  }).sort(function(a, b){ return b.term.length - a.term.length; });   // längster Begriff zuerst
  return GLOSSAR_LISTE;
}
/* Antwort-/Lösungstexte zusammenführen → Begriff überspringen, wenn er dort vorkommt (Leak-Schutz). */
function glossarLeakStr(f){
  var parts = [];
  if (Array.isArray(f.optionen)) parts = parts.concat(f.optionen);
  if (f.musterloesung) parts.push(f.musterloesung);
  if (f.antwort != null) parts.push(String(f.antwort));
  if (Array.isArray(f.antwort2)) parts = parts.concat(f.antwort2.map(String));
  if (Array.isArray(f.loesungen)) parts = parts.concat(f.loesungen.map(String));
  return parts.join("  ").toLowerCase();
}
/* Liefert den (bereits HTML-escapten) Fragetext mit max. 2 in <span class='glossar-term'> gewrappten Begriffen. */
function glossarWrap(f){
  var txt = esc(f && f.frage != null ? f.frage : "");
  if (typeof S === "undefined" || !S.glossarTip) return txt;
  var leak = glossarLeakStr(f);
  var chosen = [];
  glossarListe().forEach(function(it){
    if (chosen.length >= 2) return;
    if (leak.indexOf(it.term.toLowerCase()) >= 0) return;      // Begriff verrät die Lösung → überspringen
    var m = it.re.exec(txt);
    if (!m) return;
    var start = m.index + m[1].length, end = start + m[2].length;
    for (var i = 0; i < chosen.length; i++){ if (start < chosen[i].end && end > chosen[i].start) return; }  // Overlap
    chosen.push({ start: start, end: end, term: it.term, def: it.def });
  });
  if (!chosen.length) return txt;
  chosen.sort(function(a, b){ return b.start - a.start; });     // von hinten einsetzen → Indizes bleiben gültig
  chosen.forEach(function(h){
    var mt = txt.slice(h.start, h.end);
    var span = '<span class="glossar-term" tabindex="0" role="button" aria-label="Begriff: ' + esc(h.term) +
      '" data-term="' + esc(h.term) + '" data-def="' + esc(h.def) + '">' + mt + '</span>';
    txt = txt.slice(0, h.start) + span + txt.slice(h.end);
  });
  return txt;
}
/* Popover: einmalig erzeugt; document-Listener nur EINMAL registriert (kein Leak bei Neurendern). */
var glossarPop = null;
function glossarHide(){ if (glossarPop) glossarPop.style.display = "none"; }
function glossarPopEl(){
  if (glossarPop) return glossarPop;
  glossarPop = document.createElement("div");
  glossarPop.className = "glossar-pop";
  glossarPop.style.display = "none";
  document.body.appendChild(glossarPop);
  document.addEventListener("click", function(e){
    if (!glossarPop || glossarPop.style.display === "none") return;
    var t = e.target;
    if (t && t.closest && (t.closest(".glossar-term") || t.closest(".glossar-pop"))) return;
    glossarHide();
  });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") glossarHide(); });
  window.addEventListener("resize", glossarHide);
  return glossarPop;
}
function glossarShow(term, def, anchor){
  var p = glossarPopEl();
  p.innerHTML = "<b>" + esc(term) + "</b><br>" + esc(def);
  p.style.display = "block";
  var r = anchor.getBoundingClientRect(), doc = document.documentElement;
  var sx = window.scrollX || doc.scrollLeft || 0, sy = window.scrollY || doc.scrollTop || 0;
  var left = r.left + sx, top = r.bottom + sy + 6;
  var maxLeft = sx + doc.clientWidth - p.offsetWidth - 10;
  if (left > maxLeft) left = Math.max(sx + 8, maxLeft);
  p.style.left = left + "px";
  p.style.top = top + "px";
}
/* Nach dem Anhängen an den DOM aufrufen: Hover/Tap/Tastatur-Handler auf die Term-Spans legen. */
function glossarAttach(container){
  if (!container || typeof S === "undefined" || !S.glossarTip) return;
  var spans = container.querySelectorAll(".glossar-term");
  Array.prototype.forEach.call(spans, function(span){
    var term = span.getAttribute("data-term"), def = span.getAttribute("data-def");
    span.addEventListener("mouseenter", function(){ glossarShow(term, def, span); });
    span.addEventListener("mouseleave", glossarHide);
    span.addEventListener("click", function(e){
      e.stopPropagation();
      if (glossarPop && glossarPop.style.display !== "none") glossarHide();
      else glossarShow(term, def, span);
    });
    span.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " "){ e.preventDefault(); glossarShow(term, def, span); } });
  });
}

/* ══════════ UMD-AUSGANG (16.09.2026, Nutzer-Entscheid) ══════════
   Im Browser ist `module` undefiniert - diese Zeile tut dort NICHTS. Sie macht die
   beiden Datenstuecke fuer den Neubau (neu/) lesbar, der mit `import` arbeitet.
   ⛔ KEIN ZWEITER DATENBESTAND: das Glossar des Neubaus liest GENAU DIESE Objekte.
      Wer hier etwas ergaenzt, ergaenzt es fuer beide Programme zugleich.
   ⚠️ Dasselbe Muster tragen logik.js, spickzettel.js und abkuerzungen.js bereits.
      abkuerzungen.js ist der Beleg, dass eine reine DATEN-Datei das hier schon hat.
   ⚠️ check.sh prueft das Dateiende (Mount-Truncation) - der Marker dort wurde
      mitgezogen. Wer diese Zeilen verschiebt, zieht ihn wieder nach. */
if (typeof module !== "undefined" && module.exports) module.exports = { GLOSSAR_TIPS: GLOSSAR_TIPS, GLOSSAR_M09_BEGRIFFE: GLOSSAR_M09_BEGRIFFE };
