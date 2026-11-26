"use strict";
/* =================== Aktions-Footer (globaler Prüfen-Button) =================== */
var _aktionFn = null;
function setAktion(label, fn, opts){
  opts = opts || {};
  var bar = document.getElementById("actionbar"), b = document.getElementById("btnAktion"), h = document.getElementById("fussHinweis");
  bar.style.display = "flex";
  b.textContent = label; b.disabled = !!opts.disabled; _aktionFn = fn;
  b.onclick = function(){ if (_aktionFn) _aktionFn(); };
  h.textContent = opts.hinweis || "";
}
function aktionAn(){ document.getElementById("btnAktion").disabled = false; }
function clearAktion(){ document.getElementById("actionbar").style.display = "none"; _aktionFn = null; setFrageOffen(false); }

/* =================== G1.6 #11: PWA-Update („neue Version → Hinweis, dann Auto-Reload") ===================
   Der Inline-Guard in der HTML (nur http(s), file:// bleibt unberührt) meldet eine wartende neue Fassung
   über pwaUpdateBereit() und hinterlegt in _pwaAktiviere die Übernahme (postMessage SKIP_WAITING → der
   Service Worker aktiviert sich → controllerchange → location.reload()).
   NEU GELADEN WIRD NUR IM SICHEREN MOMENT (Nutzer-Entscheide 2026-07-18): niemals bei offener, noch nicht
   verbuchter Frage und niemals während einer laufenden Prüfungssimulation (ein Reload würde Timer und
   Durchlauf zerstören). Geprüft wird bei jedem render(), also beim nächsten Weiter-/Seitenwechsel. */
var PWA_UPDATE_BEREIT = false;      // eine neue Fassung wartet
var _pwaAktiviere = null;           // vom Inline-Guard gesetzt
var _frageOffen = false;            // interaktive, noch nicht verbuchte Frage sichtbar

function setFrageOffen(v){ _frageOffen = !!v; }
function frageOffen(){
  if (_frageOffen) return true;
  return typeof simLaeuft !== "undefined" && !!simLaeuft;   // laufende Simulation blockiert ebenfalls
}
function pwaBanner(){
  if (document.getElementById("pwabanner")) return;
  document.body.appendChild(el("<div id='pwabanner' class='pwabanner' role='status'>" + TEXTE.pwa.updateHinweis + "</div>"));
}
function pwaUpdateBereit(){
  PWA_UPDATE_BEREIT = true;
  pwaBanner();
  pwaVersuchReload();
}
function pwaVersuchReload(){
  if (!PWA_UPDATE_BEREIT) return false;
  if (frageOffen()) return false;
  if (typeof _pwaAktiviere !== "function") return false;
  _pwaAktiviere();
  return true;
}

/* =================== Kopfzeile =================== */
function renderKopf() {
  var cd = document.getElementById("chipCountdown");
  if (S.pruefungsdatum) {
    var diff = Math.ceil((new Date(S.pruefungsdatum + "T00:00:00") - new Date(L.dayKey(heute()) + "T00:00:00")) / L.TAG_MS);
    cd.style.display = ""; cd.innerHTML = diff >= 0 ? "AP1 in <b>" + diff + "</b> Tag" + (diff===1?"":"en") : TEXTE.fehler.apVorbei;
  } else cd.style.display = "none";
}
/* Theme */
var THEMES = [["hell",TEXTE.theme.hell],["dark",TEXTE.theme.dunkel],["sepia",TEXTE.theme.sepia],["kontrast",TEXTE.theme.kontrast]];
function themeName(t){ var e = THEMES.find(function(x){return x[0]===t;}); return e ? e[1] : TEXTE.theme.hell; }
function setTheme(t){ setS('theme', t); document.documentElement.setAttribute("data-theme", t); var b=document.getElementById("btnTheme"); if(b) b.textContent = "Ansicht: " + themeName(t); }
document.getElementById("btnTheme").onclick = function(){ var o = THEMES.map(function(x){return x[0];}); setTheme(o[(o.indexOf(S.theme)+1) % o.length]); };
setTheme(S.theme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "hell"));

/* #31 Schriftgroesse in drei Stufen. Umgesetzt ueber die Basis-Schriftgroesse des <html>-Elements:
   das gesamte Design rechnet in rem, dadurch skalieren Texte, Abstaende und Bedienflaechen
   gemeinsam mit – ein Eingriff statt Dutzender Einzelregeln. Attribut analog zu data-theme. */
var SCHRIFT_STUFEN = ["normal", "gross", "sehrgross"];
function setSchrift(stufe) {
  if (SCHRIFT_STUFEN.indexOf(stufe) < 0) stufe = "normal";
  setS('schriftStufe', stufe);
  document.documentElement.setAttribute("data-schrift", stufe);
}
setSchrift(S.schriftStufe || "normal");

/* #30 Druck-Vorbereitung: zugeklappte <details> vor dem Drucken oeffnen und danach exakt in den
   vorherigen Zustand zuruecksetzen. Rein per CSS ist das nicht verlaesslich – Browser verstecken
   den Inhalt eines geschlossenen <details> ueber einen internen Mechanismus, den eine
   display-Regel nicht sicher aufhebt. Gemerkt werden nur die Elemente, die WIR geoeffnet haben,
   damit vom Nutzer bewusst aufgeklappte Abschnitte offen bleiben. */
var druckGeoeffnet = [];
function druckVorbereiten() {
  druckGeoeffnet = [];
  var alle = document.querySelectorAll("details:not([open])");
  Array.prototype.forEach.call(alle, function (d) { d.open = true; druckGeoeffnet.push(d); });
}
function druckAufraeumen() {
  druckGeoeffnet.forEach(function (d) { d.open = false; });
  druckGeoeffnet = [];
}
if (window.addEventListener) {
  window.addEventListener("beforeprint", druckVorbereiten);
  window.addEventListener("afterprint", druckAufraeumen);
}

/* #55 Fokus-/Konzentrationsmodus: persistiert (S.fokus), Umschalter in der Seitenleiste + Verlassen-Button
   im Inhalt (bei aktivem Fokus, da die Leiste dann ausgeblendet ist). Reiner CSS-Klassen-Toggle, kein Re-Render. */
function setFokus(v){
  setS('fokus', !!v);
  document.body.classList.toggle("fokus", S.fokus);
  var bf = document.getElementById("btnFokus");
  if (bf){ bf.textContent = S.fokus ? TEXTE.fokus.an : TEXTE.fokus.aus; bf.setAttribute("aria-pressed", S.fokus ? "true" : "false"); }
}
(function initFokus(){
  var sb = document.querySelector(".sidebar");
  if (sb){
    var bf = el("<button class='side-theme' id='btnFokus' title='" + TEXTE.hinweis.fokusTitel + "'>" + TEXTE.fokus.aus + "</button>");
    bf.onclick = function(){ setFokus(!S.fokus); };
    sb.appendChild(bf);
  }
  var content = document.querySelector(".content");
  if (content){
    var ex = el("<button class='b gelb fokus-exit' id='btnFokusExit'>" + TEXTE.fokus.verlassen + "</button>");
    ex.onclick = function(){ setFokus(false); };
    content.appendChild(ex);
  }
  setFokus(S.fokus);
})();

/* #64 Farbenblind-freundlich: reiner Body-Klassen-Toggle (CSS ✓/✗ an .opt richtig/falsch + .fb ok/nein).
   Kein Re-Render nötig. Beim Laden aus S.farbsymbole anwenden. */
function setFarbsymbole(v){
  setS('farbsymbole', !!v);
  document.body.classList.toggle("farbsymbole", S.farbsymbole);
}
document.body.classList.toggle("farbsymbole", !!S.farbsymbole);

/* #66 Onboarding-Tour: Auto-Overlay beim ersten Start (S.onboardingDone false). Weiter/Zurück/Überspringen/
   Esc; letzter Schritt „Los geht's" → onboardingDone=true. Reaktivierbar in Einstellungen (starteOnboarding). */
var ONB_SCHRITTE = [
  { t:"Willkommen", d:"Dein AP1-Trainer für die Abschlussprüfung Teil 1. Kurze Tour – jederzeit überspringbar." },
  { t:"Üben", d:"Adaptives Training über alle Themen, mit automatischer Einstreuung aus deinem Fehler-Deck. Falsch beantwortete Fragen kommen zur Wiedervorlage zurück." },
  { t:"Vorbereitung nächste Klausur", d:"Eigener Bereich mit dem Stoff aus dem WiSo-Unterricht (FISI0126) für die Klausur am 31.07.2026 – nach Themenliste und Aufgabenblättern der Klasse. Komplett getrennt vom AP1-Fragenpool: Diese Fragen tauchen nie im normalen Üben oder in der Simulation auf und zählen nicht in die AP1-Bereitschaft. Nur falsch Beantwortetes kommt wie gewohnt ins gemeinsame Fehler-Deck." },
  { t:"Prüfungssimulation", d:"AP1-Format: 4 Aufgaben, 100 Punkte, 90 Minuten – inklusive Fallaufgaben. Übe unter echten Bedingungen." },
  { t:"Statistik & Fehler-Deck", d:"Sieh deine Stärken und Schwächen je Gebiet und arbeite mit der 5er-Serie gezielt an schwachen Themen." },
  { t:"Werkzeuge & Handy-App", d:"Zwei Helfer beim Üben: Der Fokus-Modus blendet alle Nebenelemente aus und zentriert die Aufgabe – gut zum konzentrierten Lernen. Und bei Auswahlfragen erscheint zuerst nur die Frage: Du überlegst die Antwort selbst und deckst die Optionen erst dann auf. Dieses aktive Erinnern festigt den Stoff stärker als bloßes Wiedererkennen (in den Einstellungen abschaltbar). Tipp: Du kannst die App über „Zum Startbildschirm hinzufügen“ aufs Handy installieren – sie läuft dann offline wie eine normale App." },
  { t:"Nachschlagen & Einstellungen", d:"Glossar, Abkürzungs-Lexikon und Spickzettel zum Nachschlagen; in den Einstellungen Tagesziel, Design und Barrierefreiheit anpassen." }
];
var onbIdx = 0;
function onboardingFertig(){
  setS('onboardingDone', true);
  document.removeEventListener("keydown", onboardingKey);
  var ov = document.querySelector(".onb-overlay");
  if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
}
function onboardingKey(e){ if (e.key === "Escape" || e.keyCode === 27) onboardingFertig(); }
function zeichneOnb(ov){
  var s = ONB_SCHRITTE[onbIdx];
  ov.innerHTML = "";
  var card = el("<div class='onb-card'></div>");
  card.appendChild(el("<div class='hinweis'>Schritt " + (onbIdx+1) + " / " + ONB_SCHRITTE.length + "</div>"));
  card.appendChild(el("<h2 class='u-margin-6px-0' >" + esc(s.t) + "</h2>"));
  card.appendChild(el("<div class='u-margin-bottom-12px' >" + esc(s.d) + "</div>"));
  var zeile = el("<div class='zeile' style='justify-content:space-between;gap:8px' ></div>");
  var sk = el("<button class='b leise'>" + TEXTE.aktion.ueberspringen + "</button>"); sk.onclick = onboardingFertig;
  var rechts = el("<div class='zeile' style='gap:8px' ></div>");
  if (onbIdx > 0){ var zu = el("<button class='b leise'>" + TEXTE.aktion.zurueckKurz + "</button>"); zu.onclick = function(){ onbIdx--; zeichneOnb(ov); }; rechts.appendChild(zu); }
  var vor = el("<button class='b gelb'>" + (onbIdx === ONB_SCHRITTE.length-1 ? TEXTE.aktion.losGehts : TEXTE.aktion.weiterKurz) + "</button>");
  vor.onclick = function(){ if (onbIdx === ONB_SCHRITTE.length-1) onboardingFertig(); else { onbIdx++; zeichneOnb(ov); } };
  rechts.appendChild(vor);
  zeile.appendChild(sk); zeile.appendChild(rechts); card.appendChild(zeile);
  ov.appendChild(card);
}
function starteOnboarding(){
  if (document.querySelector(".onb-overlay")) return;
  onbIdx = 0;
  // G1.5 #46: Dialog-Rolle + Name – sonst liegt der Overlay-Inhalt außerhalb jeder Landmark (axe: region)
  var ov = el("<div class='onb-overlay' role='dialog' aria-modal='true' aria-label='" + TEXTE.aria.onboardingDialog + "'></div>");
  document.body.appendChild(ov);
  document.addEventListener("keydown", onboardingKey);
  zeichneOnb(ov);
}
if (!S.onboardingDone) setTimeout(starteOnboarding, 0);

/* #67 Kontext-Hilfe pro Aufgabentyp: kurze Bedienhilfe beim Auftreten interaktiver Typen, mit
   „nicht mehr zeigen"-Häkchen (S.typHilfeAus[typ]). Nur außerhalb der Simulation. */
var TYP_HILFE = {
  zuordnung: "Klicke erst ein Element, dann sein Gegenstück – oder ziehe es hinüber. Eine Zuordnung durch erneutes Klicken lösen.",
  reihenfolge: "Bringe die Schritte in die richtige Reihenfolge – mit den Pfeilen verschieben oder ziehen.",
  matrix: "Ordne jedes Element der passenden Zelle zu: Element anklicken, dann Zielzelle.",
  beschriftung: "Ziehe jeden Begriff auf die passende nummerierte Stelle – oder Begriff anklicken, dann Stelle.",
  hotspot: "Klicke die richtige Stelle direkt in der Grafik an.",
  baukasten: "Setze die Lösung aus den Bausteinen zusammen – anklicken oder ziehen.",
  trace: "Trage die Werte Schritt für Schritt in die Tabelle ein (Schreibtischtest).",
  konsole: "Gib den passenden Befehl bzw. die fehlenden Teile ein.",
  rechenassistent: "Trage Zwischen- und Endergebnisse in die Felder ein. Kommazahlen mit Komma oder Punkt.",
  kalkulation: "Fülle die Kalkulations-Felder aus – Kommazahlen mit Komma oder Punkt."
};
function renderTypHilfe(container, typ){
  if (typeof S === "undefined" || !TYP_HILFE[typ] || (S.typHilfeAus && S.typHilfeAus[typ])) return;
  var box = el("<div class='typ-hilfe'></div>");
  box.appendChild(el("<div><b>So geht's:</b> " + esc(TYP_HILFE[typ]) + "</div>"));
  var lab = el("<label class='check' style='display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-size:.85rem' ><input type='checkbox'> <span>" + TEXTE.hinweis.bedienhilfeNichtMehr + "</span></label>");
  lab.querySelector("input").onchange = function(e){ if (e.target.checked){ mutS(function(s){ s.typHilfeAus[typ] = true; }); if (box.parentNode) box.parentNode.removeChild(box); } };
  box.appendChild(lab);
  container.appendChild(box);
}

/* =================== Navigation =================== */
var SEITEN = [["start",TEXTE.nav.start],["ueben",TEXTE.nav.ueben],["unterricht",TEXTE.nav.unterricht],["fd",TEXTE.nav.fehlerdeck],["gen",TEXTE.nav.generator],["netzplan",TEXTE.nav.netzplan],["gantt",TEXTE.nav.gantt],["sim",TEXTE.nav.simulation],["glossar",TEXTE.nav.glossar],["spickzettel",TEXTE.nav.spickzettel],["stat",TEXTE.nav.statistik],["einst",TEXTE.nav.einstellungen]];
var seite = "start";

/* ============ G4.2 (#29) Hash-Routing + echter Zurück-Button ============
   Bis hierher war `seite` eine reine Variable: Der Browser wusste nichts von der
   Navigation, „Zurück" verließ die App. Jetzt ist der Hash die Quelle der Wahrheit.

   BEWUSST location.hash statt history.pushState: Unter file:// (Doppelklick-Betrieb,
   Offline-Invariante) ist die History-API eingeschränkt bzw. wirft; der Hash funktioniert
   dort zuverlässig. Formate:  #ueben  ·  #stat  ·  #frage=M03-907
   Unbekannte Routen fallen still auf „start" zurück.                                  */
var ROUTEN_NAMEN = ["start","ueben","unterricht","fd","markiert","gen","netzplan","gantt","sim",
                    "glossar","spickzettel","serie","stat","einst","frage"];
var frageDirekt = null;        // bei #frage=ID die gewünschte Frage-ID

function hashLesen() {
  var h = "";
  try { h = String(location.hash || "").replace(/^#/, ""); } catch (e) { h = ""; }
  if (!h) return { seite: "start", frageId: null };
  var teile = h.split("=");
  var name = decodeURIComponent(teile[0] || "").trim();
  var wert = teile.length > 1 ? decodeURIComponent(teile.slice(1).join("=")).trim() : null;
  if (ROUTEN_NAMEN.indexOf(name) < 0) return { seite: "start", frageId: null };
  if (name === "frage") return wert ? { seite: "frage", frageId: wert } : { seite: "start", frageId: null };
  return { seite: name, frageId: null };
}

function hashSchreiben(name, frageId) {
  var neu = "#" + (name === "frage" && frageId ? "frage=" + encodeURIComponent(frageId) : name);
  var aktuell = "";
  try { aktuell = String(location.hash || ""); } catch (e) { aktuell = ""; }
  if (aktuell === neu) return;
  try { location.hash = neu; } catch (e) { /* file:// in exotischen Umgebungen – Navigation läuft trotzdem */ }
}

/* Zentraler Navigationseinstieg. Ersetzt die früher verstreuten `seite = "x"; render();`.
   opts.frageId  – nur für die Route „frage"
   opts.ersetzen – true: Hash tauschen, ohne einen History-Eintrag zu erzeugen (nicht genutzt,
                   bewusst vorgesehen für künftige Fälle wie Redirects) */
function gotoSeite(name, opts) {
  opts = opts || {};
  if (ROUTEN_NAMEN.indexOf(name) < 0) name = "start";
  seite = name;
  frageDirekt = (name === "frage") ? (opts.frageId || null) : null;
  hashSchreiben(name, frageDirekt);
  render();
}

/* Browser-Zurück/Vorwärts. Schleifenschutz ist BEWUSST nur der Zustandsvergleich unten und
   kein „wir-setzen-gerade"-Flag: Ein solches Flag bleibt hängen, wenn das erwartete
   hashchange-Event ausbleibt (in jsdom reproduziert), und blockiert dann die nächste echte
   Navigation. Der Vergleich ist zustandslos und deckt beide Fälle ab – nach eigenem
   Hash-Schreiben stimmt die Route bereits überein, beim Zurück-Button nicht. */
function hashGeaendert() {
  var z = hashLesen();
  if (z.seite === seite && z.frageId === frageDirekt) return;   // nichts zu tun
  /* Eine laufende Simulation darf nicht im Hintergrund weiterlaufen (Timer-Leak, #45).
     Ein Abbruch per confirm() ist bei hashchange nicht verlässlich abbrechbar – deshalb
     wird die Simulation hier still beendet, so wie render() es beim Seitenwechsel tut. */
  if (typeof simLaeuft !== "undefined" && simLaeuft && z.seite !== "sim") {
    try { simAbbrechen(); } catch (e) {}
  }
  seite = z.seite;
  frageDirekt = z.frageId;
  render();
}
try { window.addEventListener("hashchange", hashGeaendert); } catch (e) {}
function renderNav() {
  var n = document.getElementById("nav"); n.innerHTML = "";
  SEITEN.forEach(function(s){
    var faellig = s[0]==="fd" ? L.fdDue(S.fehlerDeck, heute()).length : 0;
    var b = el("<button class='nav-item" + (seite===s[0] ? " aktiv":"") + "'><span>" + s[1] + "</span>" + (faellig ? "<span class='zbadge'>" + faellig + "</span>" : "") + "</button>");
    b.onclick = function(){ if (simLaeuft && s[0]!=="sim" && !confirm(TEXTE.simulation.wirklichVerlassenNav)) return; if (s[0]!=="sim") simAbbrechen(); gotoSeite(s[0]); };
    n.appendChild(b);
  });
}

