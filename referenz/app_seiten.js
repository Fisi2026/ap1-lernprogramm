"use strict";
/* =================== Seiten ===================
   ORIENTIERUNG (30.07.2026). Diese Datei fasst FÜNF unabhängige Belange in über tausend Zeilen –
   bis heute stand hier nur die Zeile darüber. Um den M09-Flow zu verstehen, mussten am 30.07.
   rund 600 Zeilen in drei Anläufen gelesen werden; die Blöcke liegen nicht beieinander.
   ⚠️ Auch die Größenangabe bleibt bewusst ungenau – eine Zahl hier veraltet beim ersten Einfügen.
   Gemessen wird mit `wc -l app_seiten.js` und `grep -c "^function " app_seiten.js`.

   ⚠️ ANKER SIND FUNKTIONSNAMEN, KEINE ZEILENNUMMERN. Eine Zeilennummer im Kommentar ist ein
   Messwert von damals und veraltet beim ersten Einfügen (dieselbe Lehre wie „keinen Commit-Hash
   in START_PROMPT"). Zum Springen: `grep -n "^function " app_seiten.js`.

   1) ROUTER UND RAHMEN ......... render() ist der Einstieg für ALLES: leert #main und ruft die
      s*-Funktion der Route. Dazu zeigeFehlerPanel, lsFehlerBanner, sEinzelfrage (#frage=ID).
   2) AP1-ÜBEN .................. sUeben() baut die Seite · naechsteFrage() zieht · uebenRender()
      zeigt an (Verlauf uebenVerlauf/uebenIdx). Auswahl: kandidaten, kandidatenMitTypWechsel,
      themaGewaehlt, aufStufeFiltern, stufeFuer, genAlsFrage.
   3) M09-KLAUSURVORBEREITUNG ... sUnterricht() baut die Seite · unterrichtZiehe() zieht und
      schreibt die sechs Sperren fort · unterrichtRender() zeigt NUR an. Auswahl:
      kandidatenUnterricht, dueUnterricht.
      ⚠️ DIESER BLOCK IST ZWEIGETEILT – zwischen unterrichtSpickView und dueUnterricht liegen
      rund 200 Zeilen Klausursimulation (4). Wer den Flow liest, muss darüber hinwegspringen.
   4) M09-KLAUSURSIMULATION ..... alle klausur*-Funktionen, Einstieg klausurStarte(). Eigenständig
      vom AP1-sim in app_sim.js: eigene Variablen, eigener Timer, eigene Auswertung.
   5) WEITERE SEITEN ............ hier stehen GENAU sieben: sEinzelfrage, sStart, sUeben,
      sUnterricht, sFehlerdeck, sMarkiert, sGenerator.
      ⚠️ ALLE ÜBRIGEN SEITEN LIEGEN WOANDERS – app_pages2.js führt sNetzplan, sGantt, sGlossar,
      sSpickzettel, sSerie, sStatistik UND sEinstellungen; die AP1-Simulation steht in app_sim.js.
      Das Rendern einer einzelnen Frage: loeseFrage (app_loeser.js) bzw. renderFrage (app_frage.js).
      ►► Die Zuordnung ist NICHT thematisch gewachsen, sondern historisch. **Wer eine Seite sucht,
      rät nicht, sondern greppt:** `grep -n "^function s[A-Z]" app_*.js`.

   GEMEINSAM GENUTZT, hier definiert: macheWischLeiste() (Touch-Blättern) und macheVerlaufNav()
   (← Zurück / Weiter → / „Frage n / m") – beide werden von 2) UND 3) benutzt. Wer eine davon
   ändert, ändert beide Übungsflüsse. */
/* #90 Fehlerfänger: fängt einen Absturz beim Rendern einer Seite ab und zeigt statt eines Weißbildes ein
   erholbares Panel (Kurzmeldung + aufklappbare technische Details + „Zur Startseite"/„Neu laden"). */
function zeigeFehlerPanel(m, e, kontext) {
  m.innerHTML = "";
  var p = el("<div class='panel u-border-1px-solid-var-rot' ></div>");
  p.appendChild(el("<h2 class='u-border-none u-margin-2px-0-6px' >" + TEXTE.fehler.schiefgelaufen + "</h2>"));
  p.appendChild(el("<div class='hinweis'>Die Seite „" + esc(String(kontext || "")) + "\" konnte nicht angezeigt werden. Dein Fortschritt ist gespeichert.</div>"));
  var det = el("<details class='u-margin-top-8px' ><summary class='hinweis'>" + TEXTE.fehler.technischeDetails + "</summary></details>");
  det.appendChild(el("<pre class='u-white-space-pre-wrap u-font-size-8rem u-margin-top-6px' >" + esc((e && (e.stack || e.message)) || String(e)) + "</pre>"));
  p.appendChild(det);
  var zeile = el("<div class='zeile' style='margin-top:10px;gap:8px' ></div>");
  var bStart = el("<button class='b gelb'>" + TEXTE.aktion.zurStartseite + "</button>");
  bStart.onclick = function(){ gotoSeite("start"); };
  var bReload = el("<button class='b leise'>" + TEXTE.aktion.neuLaden + "</button>");
  bReload.onclick = function(){ try { location.reload(); } catch(_){ gotoSeite("start"); } };
  zeile.appendChild(bStart); zeile.appendChild(bReload);
  p.appendChild(zeile); m.appendChild(p);
}
/* R2: LocalStorage-Fehler sichtbar machen – fixierter Banner am oberen Rand, auf jeder Seite sichtbar,
   solange der Fehler besteht (Nutzer-Entscheid 2026-07-16: signalisiert permanent den Notbetrieb). */
function lsFehlerBanner() {
  var alt = document.getElementById("lsbanner");
  if (alt && alt.parentNode) alt.parentNode.removeChild(alt);
  if (!LS_LADE_FEHLER && !LS_SPEICHER_FEHLER) return;
  var teile = [];
  if (LS_SPEICHER_FEHLER) teile.push(TEXTE.fehler.lsSpeicherFehler);
  if (LS_LADE_FEHLER) teile.push(TEXTE.fehler.lsLadeFehler);
  document.body.appendChild(el("<div id='lsbanner' class='fehlerbanner lsbanner' role='alert'><b>" +
    teile.join("</b><br><b>") + "</b></div>"));
}
function render() {
  if (simLaeuft && seite !== "sim") simAbbrechen();   // #45: Timer-Leak vermeiden – laufende Sim bei Seitenwechsel abbrechen
  if (klausur && seite !== "unterricht") klausurAbbrechen();   // M09 (2026-07-21): analog, eigene Variable - Klausur laeuft eingebettet in "unterricht"
  /* #30: aktuelle Route am <html>-Element kenntlich machen, damit das Print-CSS gezielt nur
     Spickzettel und Statistik fuer Papier aufbereiten kann (Nutzer-Entscheid: nicht generisch). */
  try { document.documentElement.setAttribute("data-seite", seite); } catch (e) {}
  renderNav(); renderKopf(); clearAktion();
  lsFehlerBanner();                                    // R2: Speicher-/Lade-Fehler-Banner (fixiert oben)
  var m = document.getElementById("main"); m.innerHTML = "";
  if (POOL_FEHLER.length) {
    m.appendChild(el("<div class='fehlerbanner' role='alert'><b>Selbsttest: " + POOL_FEHLER.length + " fehlerhafte Frage(n) übersprungen.</b><br>" +
      POOL_FEHLER.map(function(e){ return esc(e.id) + ": " + esc(e.meldung); }).join("<br>") + "</div>"));
  }
  var routen = {start:sStart, ueben:sUeben, unterricht:sUnterricht, fd:sFehlerdeck, markiert:sMarkiert, gen:sGenerator, netzplan:sNetzplan, gantt:sGantt, sim:sSimulation, glossar:sGlossar, spickzettel:sSpickzettel, serie:sSerie, stat:sStatistik, einst:sEinstellungen, frage:sEinzelfrage};
  var fn = routen[seite] || sStart;
  try {
    fn(m);
  } catch (e) {
    try { if (window.console && console.error) console.error("Render-Fehler (" + seite + "):", e); } catch(_){}
    zeigeFehlerPanel(m, e, seite);
  }
  pwaVersuchReload();   // G1.6 #11: wartendes Update erst im sicheren Moment übernehmen
}

/* ---- G4.2 (#29): Einzelfrage per Deep-Link (#frage=ID) ----
   Zeigt genau eine Frage – gedacht zum Nachschlagen und Teilen einer konkreten Aufgabe.
   Bewusst OHNE Statistik-/Fehler-Deck-Buchung: Ein direkt aufgerufener Link soll den
   Lernstand nicht verändern (sonst würde mehrfaches Öffnen die Auswertung verfälschen). */
function sEinzelfrage(m) {
  var id = (typeof frageDirekt !== "undefined") ? frageDirekt : null;
  var f = id ? frageById(id) : null;
  if (!f) {
    m.appendChild(el("<div class='panel'><h2>" + TEXTE.einzelfrage.h2 + "</h2><div class='hinweis'>" +
      TEXTE.einzelfrage.nichtGefunden + (id ? " (" + esc(id) + ")" : "") + "</div></div>"));
    var zb = el("<button class='b'>" + TEXTE.einzelfrage.zurStartseite + "</button>");
    zb.onclick = function(){ gotoSeite("start"); };
    m.appendChild(zb);
    return;
  }
  var p = el("<div class='panel'><h2>" + TEXTE.einzelfrage.h2 + "</h2><div class='hinweis'>" +
    esc(modulName(f.modul)) + " · " + esc(f.thema || "") + " · " + esc(f.id) + "</div></div>");
  m.appendChild(p);
  var host = el("<div id='qa'></div>");
  m.appendChild(host);
  loeseFrage(L.instanziiere(f), host, { onGraded: function(){}, onNext: function(){ gotoSeite("ueben"); } });
  var nav = el("<div class='zeile u-margin-top-8px' style='gap:8px'></div>");
  var b1 = el("<button class='b leise'>" + TEXTE.einzelfrage.zurStartseite + "</button>");
  b1.onclick = function(){ gotoSeite("start"); };
  var b2 = el("<button class='b'>" + TEXTE.einzelfrage.normalWeiterueben + "</button>");
  b2.onclick = function(){ gotoSeite("ueben"); };
  nav.appendChild(b1); nav.appendChild(b2);
  m.appendChild(nav);
  m.appendChild(el("<div class='hinweis u-margin-top-8px'>" + TEXTE.einzelfrage.zaehltNicht + "</div>"));
}

/* ---- Start: Kachelmenü + dezente Statistik ---- */
function sStart(m) {
  var heuteAnz = S.dailyCounts[L.dayKey(heute())] || 0;
  var faellig = L.fdDue(S.fehlerDeck, heute()).length;
  var letzteSim = S.simHistorie.length ? S.simHistorie[S.simHistorie.length-1] : null;
  var schwach = schwaechstesGebiet();
  var serieHeute = S.serieDone === L.dayKey(heute());
  m.appendChild(el("<div class='kicker u-margin-bottom-8px' >" + TEXTE.start.frage + "</div>"));
  var grid = el("<div class='menu-grid'></div>");
  var kacheln = [
    { z:"ueben",  hero:true, titel:TEXTE.nav.ueben, sub:TEXTE.start.uebenSub },
    { z:"unterricht", titel:TEXTE.nav.unterricht, sub:TEXTE.start.unterrichtSub, badge:TEXTE.start.neuBadge },
    { z:"serie",  titel:TEXTE.start.serieTitel, sub: (schwach ? esc(L.gebietName(schwach)) + " – 5 Fragen gegen deine größte Schwäche." : TEXTE.start.serieSubFallback) + (serieHeute ? TEXTE.start.serieHeuteSuffix : ""), badge: serieHeute ? "" : TEXTE.start.neuBadge },
    { z:"fd",     titel:TEXTE.nav.fehlerdeck, sub:TEXTE.start.fdSub, badge: faellig ? String(faellig) : "" },
    { z:"sim",    titel:TEXTE.nav.simulation, sub:TEXTE.start.simSub },
    { z:"gen",    titel:TEXTE.nav.generator, sub:TEXTE.start.genSub },
    { z:"netzplan", titel:TEXTE.hinweis.netzplanTitel, sub:TEXTE.start.netzplanSub },
    { z:"gantt", titel:TEXTE.start.ganttTitel, sub:TEXTE.start.ganttSub, badge:TEXTE.start.neuBadge },
    { z:"glossar", titel:TEXTE.nav.glossar, sub:TEXTE.start.glossarSubBase + (anzahlBeantwortet() > L.CONFIG.gate ? TEXTE.start.glossarSubSuffix : "") },
    { z:"spickzettel", titel:TEXTE.nav.spickzettel, sub:TEXTE.start.spickzettelSub },
    { z:"stat",   titel:TEXTE.nav.statistik, sub:TEXTE.start.statSub },
    { z:"einst",  titel:TEXTE.nav.einstellungen, sub:TEXTE.start.einstSub }
  ];
  var markiertAnz = markierteIds().length;
  if (markiertAnz) kacheln.splice(3, 0, { z:"markiert", titel:TEXTE.start.markiertTitel, sub:TEXTE.start.markiertSub, badge:String(markiertAnz) });
  kacheln.forEach(function(k){
    var t = el("<button class='tile" + (k.hero?" hero":"") + "'>" + (k.badge ? "<span class='zbadge'>" + k.badge + "</span>" : "") + "<div class='t-titel'>" + k.titel + "</div><div class='t-sub'>" + k.sub + "</div></button>");
    t.onclick = function(){ gotoSeite(k.z); };
    grid.appendChild(t);
  });
  m.appendChild(grid);
  // Dezente Statistik-Zeile + Details auf Wunsch
  var rr = 0, gg = 0; MODULE.forEach(function(mm){ var e = S.statistik[mm[0]]; if (e){ rr += e.richtig; gg += e.gesamt; } });
  var quote = gg ? Math.round(rr / gg * 100) : 0;
  /* FB-R1.11 (Nutzer-Entscheid 2026-07-21): der Streifen ist jetzt zuklappbar, startet aber OFFEN.
     Das loest den Widerspruch zwischen R1.6 („Panels starten zu") und dem aelteren L1-Entscheid
     („Bereitschafts-Zeile immer sichtbar") auf: beim ersten Start ist die Zeile da (L1 erfuellt),
     wer sie nicht braucht, klappt sie weg – der Zustand wird in S.panelOffen gemerkt. */
  var statP = statPanel("stat-start", TEXTE.start.standTitel, true);
  // L1 Bereitschafts-Zeile (Nutzer-Entscheid) – nur über geübte Themen gewertet
  var br = L.bereitschaft(S.statistik);
  if (br.gesamt.score == null) {
    statP.appendChild(el("<div class='stat-mini'><span>" + TEXTE.bereitschaft.startKeine + "</span></div>"));
  } else {
    var bFarbe = br.gesamt.ampel==="rot"?"var(--rot)":br.gesamt.ampel==="gelb"?"var(--gelb)":br.gesamt.ampel==="gruen"?"var(--gruen)":"var(--g300)";
    statP.appendChild(el("<div class='stat-mini'><span>" + TEXTE.bereitschaft.startPrefix +
      " <span style='display:inline-block;width:11px;height:11px;border-radius:50%;background:" + bFarbe + ";vertical-align:middle;margin:0 5px'></span>" +
      "<b>" + br.gesamt.score + " %</b></span></div>"));
  }
  statP.appendChild(el("<div class='stat-mini'>" +
    "<span>Heute <b>" + heuteAnz + "/" + S.tagesziel + "</b> Fragen</span>" +
    "<span>Trefferquote <b>" + quote + " %</b></span>" +
    "<span>Fehler-Deck fällig <b>" + faellig + "</b></span>" +
    "<span>Letzte Simulation <b>" + (letzteSim ? letzteSim.prozent + " %" : "–") + "</b></span></div>"));
  var det = el("<details class='u-margin-top-10px' ><summary class='hinweis' style='cursor:pointer' >" + TEXTE.start.mehrStatistik + "</summary></details>");
  var tage = [], maxC = 1;
  for (var di = 13; di >= 0; di--){ var dk = L.dayKey(heute() - di*L.TAG_MS); var dc = S.dailyCounts[dk] || 0; tage.push({ k:dk, c:dc }); if (dc > maxC) maxC = dc; }
  var akt = el("<div class='u-margin-top-10px' ><div class='kicker'>" + TEXTE.start.aktivitaet14 + "</div><div class='trend' style='height:60px' ></div></div>");
  var tr = akt.querySelector(".trend");
  tage.forEach(function(t){ var hh = Math.max(3, Math.round(t.c / maxC * 54)); tr.appendChild(el("<div style='width:15px;height:" + hh + "px' title='" + datumDE(t.k) + ": " + t.c + " Fragen'></div>")); });
  det.appendChild(akt);
  var spg = L.statProGebiet(S.statistik);
  var proM = ""; L.GEBIETE.forEach(function(gg){ if (gg[0] === "M9") return; var e = spg[gg[0]]; var q = (e && e.gesamt) ? Math.round(e.richtig / e.gesamt * 100) : 0; proM += "<div class='u-margin-6px-0 u-font-size-86rem' >" + esc(gg[1]) + " <span class='hinweis'>" + (e ? e.richtig + "/" + e.gesamt : TEXTE.start.nochOffen) + "</span><div class='balken'><div style='width:" + q + "%'></div></div></div>"; });
  det.appendChild(el("<div class='u-margin-top-12px' ><div class='kicker'>" + TEXTE.start.trefferquoteModul + "</div>" + proM + "</div>"));
  var nAP1 = POOL.filter(function(f){return f.pruefungsteil!=="AP2";}).length, nAP2 = POOL.length - nAP1;
  det.appendChild(el("<div class='hinweis u-margin-top-10px' >Pool: " + POOL.length + " Fragen (" + nAP1 + " AP1 · " + nAP2 + " AP2-Zusatz)</div>"));
  statP.appendChild(det);
  m.appendChild(statP);
}
/* Statistisch schwächstes GEBIET (FB-R3 2026-07-23; vorher Modul). Min. 5 gespeicherte Antworten,
   sonst das am wenigsten geübte. Nur Gebiete mit AP-verfügbaren Fragen (poolAP respektiert inklAP2). */
function schwaechstesGebiet() {
  var spg = L.statProGebiet(S.statistik);
  var vorhanden = {}; poolAP().forEach(function(f){ vorhanden[L.gebietFuer(f)] = 1; });
  var best = null, least = null;
  L.GEBIETE.forEach(function(gg){
    if (gg[0] === "M9" || !vorhanden[gg[0]]) return;
    var e = spg[gg[0]];
    if (e && e.gesamt >= 5) { var q = e.richtig / e.gesamt; if (best == null || q < best.q) best = { gebiet: gg[0], q: q }; }
    var g = (e && e.gesamt) || 0; if (least == null || g < least.g) least = { gebiet: gg[0], g: g };
  });
  return best ? best.gebiet : (least ? least.gebiet : "A1");
}

/* ---- Üben ---- */
var aktFrage = null;
/* A3: Session-State der Gewichtungs-Engine (nicht persistiert) */
var letzteThemen = [];   // Themen der letzten 2 Fragen (Interleaving-Malus)
var themenSerie = [];    // Warteschlange "Mehr zu diesem Thema" (#60)
/* #52 Zurück-Navigation: Session-Verlauf gezeigter (instanziierter) Frage-Objekte + Cursor.
   Nur Session, kein persistenter State. Wiederholung aus dem Verlauf bucht NICHT erneut ins Fehler-Deck. */
var uebenVerlauf = [];
var uebenIdx = -1;
/* FB-R3 Etappe 2: welche Gebiet-Blöcke in der Üben-Themenauswahl aufgeklappt sind (Code -> bool).
   Nur Session, NICHT persistiert. Der Aufklapp-Knopf schaltet rein im DOM (kein render()), damit
   ein Häkchen-Klick (der render() auslöst) den Aufklapp-Zustand wiederherstellen kann. */
var gebietOffen = {};
/* #98 Abruf-Übung: seit FB-R3 Punkt 7 Voreinstellung und persistiert in S.abrufAn (kein Session-var
   mehr). Umschalter nur noch in den Einstellungen. loeseFrage liest S.abrufAn direkt. */
/* #54 Swipe-Gesten: dedizierte Wisch-Leiste (kein Handler am #main -> kein Konflikt mit Drag&Drop-Typen).
   Horizontaler Swipe ab ~60px, der horizontal dominieren muss (vertikales Scrollen bleibt unberührt: touch-action:pan-y).
   zurueckFn/weiterFn dürfen null sein (dann passiert in der Richtung nichts). Handler als .ontouch* (gut testbar). */
function macheWischLeiste(zurueckFn, weiterFn) {
  /* FB-R1.7: Die Leiste ist eine reine Touch-Bedienung – am Desktop war sie ein Hinweis auf eine
     Geste, die es dort nicht gibt. Die Sichtbarkeit steuert jetzt CSS (@media pointer:coarse in
     styles.css), NICHT JavaScript: dadurch bleibt die Leiste im DOM (Handler und test_swipe
     unveraendert) und ein Geraetewechsel wirkt sofort, ohne Neuaufbau der Seite. Deshalb steht
     hier auch kein inline `display` mehr – ein Inline-Wert wuerde die Media-Query aushebeln. */
  var bar = el("<div class='wischleiste' ></div>");
  bar.appendChild(el("<span>" + (zurueckFn ? TEXTE.ueben.wischenZurueck : "‹") + "</span>"));
  bar.appendChild(el("<span>" + TEXTE.ueben.frageBlaettern + "</span>"));
  bar.appendChild(el("<span>" + (weiterFn ? TEXTE.ueben.wischenVor : "›") + "</span>"));
  var x0 = null, y0 = null;
  bar.ontouchstart = function(e){ var t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; };
  bar.ontouchend = function(e){
    /* 2026-08-25 (Nutzer-Entscheid, BUILD_LOG 25.08. (7)): NUR DIE LEBENDE LEISTE DARF FEUERN.
       Die Handler haengen als EIGENSCHAFTEN am Element. `loeseFrage` beginnt mit
       `host.innerHTML = ""` - das nimmt das Element aus dem DOM, NICHT den Handler. Wer den
       Weiter-Knopf drueckt und den Finger noch auf der Leiste hat, feuerte bisher eine Leiste,
       die es nicht mehr gibt, mit dem ALTEN `f` (`_beantwortet === true`) - und zog ein ZWEITES
       Mal. Gemessen: Ziehungen=2, Verlauf 2->4, eine Frage nie angezeigt
       (`tools/probe_doppelziehung.js`). Umgekehrte Reihenfolge war harmlos, weil `setAktion`
       `_aktionFn` beim Neuaufbau laengst neu bindet. Diese eine Zeile schliesst die Luecke fuer
       BEIDE Fluesse (Ueben und Klausurvorbereitung) auf einmal. */
    if (!document.contains(bar)) return;
    if (x0 == null) return;
    var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    x0 = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) <= Math.abs(dy)) return;   // zu kurz oder vertikal dominiert
    if (dx < 0) { if (weiterFn) weiterFn(); } else { if (zurueckFn) zurueckFn(); }
  };
  return bar;
}
/* 2026-07-30: EINE Verlaufsleiste für BEIDE Übungsflüsse (AP1 „Üben" und M09 „Klausurvorbereitung").
   Bis heute stand sie ausschliesslich in uebenRender(); M09 hatte gar keine. Sie dort nachzubauen
   hätte zwei wortgleiche Kopien ergeben – genau die Falle, wegen der am 26.07. schon
   aufStufeFiltern() aus zwei Kopien zusammengeführt wurde (kandidaten/kandidatenUnterricht).
   `host` ist das Zielelement (wird geleert), `gehe(zielIdx)` bekommt den ZIELINDEX – die Flüsse
   führen ihren Index selbst und rendern selbst. `live` = neueste, noch unbeantwortete Frage;
   nur die bucht Statistik und Fehler-Deck. */
function macheVerlaufNav(host, idx, laenge, live, gehe) {
  if (!host) return null;
  host.innerHTML = "";
  var zur = el("<button class='b leise'>" + TEXTE.aktion.zurueckPfeil + "</button>");
  zur.disabled = idx <= 0;
  zur.onclick = function(){ if (idx > 0) gehe(idx - 1); };
  host.appendChild(zur);
  if (idx < laenge - 1) {
    var vor = el("<button class='b leise'>" + TEXTE.aktion.weiterPfeil + "</button>");
    vor.onclick = function(){ gehe(idx + 1); };
    host.appendChild(vor);
  }
  host.appendChild(el("<span class='hinweis'>" +
    TEXTE.ueben.verlaufZaehler.replace("{n}", idx + 1).replace("{m}", laenge) +
    (live ? "" : TEXTE.ueben.verlaufWiederholung) + "</span>"));
  return host;
}

function anzahlBeantwortet() {
  var g = 0; MODULE.forEach(function(mm){ var e = S.statistik[mm[0]]; if (e) g += e.gesamt; });
  return g;
}
function gewichtsKontext() {
  return {
    relevanzAn: !!S.relevanzGewichtung,
    adaptivAktiv: anzahlBeantwortet() > L.CONFIG.gate,
    themaStat: function(fx){ return S.statistik["T:" + fx.modul + ":" + fx.thema] || null; },
    letzteThemen: letzteThemen
  };
}
/* #60/#27: Nach FALSCHER Antwort eine kleine Serie aus demselben Thema anbieten.
   Fallback auf das Modul, wenn das Thema zu wenige weitere Fragen hat. Seit G3.4 ohne Gate. */
function zeigeThemenSerieAngebot(f, qa) {
  if (themenSerie.length || !f.thema || f.generatorArt) return;
  /* FB-R3 Punkt 8 (Bestandsabgleich 2026-07-25): Das Feature existierte bereits. Gehaertet wurde
     nur der Filter: Er verglich NUR den Themen-Namen. Poolweit ist ein Feinthema aber ueberall
     sonst als "modul|thema" definiert (S.themen, gebietThemen, L.THEMA_GEBIET) – und die
     START_PROMPT-Lehre aus R3.2 lautet ausdruecklich: beim Zaehlen ueber `thema` nach Modul
     trennen ("Gantt 13 Fragen" waren M01 6 + M09 7). Aktuell gibt es KEINE Namenskollision im
     Pool (nachgemessen: 0 von 73 Themennamen in mehr als einem Modul), die Serie zog also nie
     modulfremde Fragen. Der Modul-Vergleich haelt das so, wenn spaeter ein gleichnamiges Thema
     in einem anderen Modul entsteht. test_themenauswahl bewacht die Kollisionsfreiheit zusaetzlich. */
  var ids = kandidaten().filter(function(id){ var x = frageById(id); return x && id !== f.id && x.thema === f.thema && x.modul === f.modul; });
  if (ids.length < 2) ids = kandidaten().filter(function(id){ var x = frageById(id); return x && id !== f.id && x.modul === f.modul; });
  if (!ids.length) return;
  var wrap = el("<div class='hinweis u-margin-top-8px' ></div>");
  var b = el("<button class='b leise'>📚 Mehr zu diesem Thema üben (" + esc(f.thema) + ")</button>");
  b.onclick = function(){ themenSerie = L.shuffle(ids).slice(0, L.CONFIG.serie); b.disabled = true; b.textContent = "Serie gestartet – läuft ab der nächsten Frage (" + themenSerie.length + " Fragen)"; };
  wrap.appendChild(b); qa.appendChild(wrap);
}
function sUeben(m) {
  var conf = el("<div class='panel'><h2>" + TEXTE.nav.ueben + "</h2></div>");
  /* FB-R3 Etappe 2 (2026-07-23): Themenauswahl nach PRÜFUNGSORDNUNG statt nach Modul. Die frühere
     Modul-/Lernfeld-Kachelliste (S.module/S.ap2Themen) ist ersetzt durch die 5 AP1-Gebiete
     (L.GEBIETE, gg[2]=="AP1") und die 3 AP2-Prüfungsbereiche (gg[2]=="AP2"), jedes Gebiet
     aufklappbar mit einem „ganzes Gebiet"-Häkchen (S.gebiete) und den Feinthemen darunter
     (S.themen = "modul|thema"), poolweit aus f.gebiet abgeleitet. Das „ganzes Gebiet"-Häkchen
     ist mit seinen Feinthemen GESPIEGELT (Nutzer-Entscheid). Prüfungsteil-Umschalter (AP1/AP2/
     Beide, Default beide) und Wirtschafts-Schwerpunkt bleiben. Reichweite weiter NUR die Üben-
     Auswahl – Startseiten-Statistik und Simulation bleiben über passtAP()/S.inklAP2 unverändert. */
  var apName = { ap1:"AP1", ap2:"AP2", beide:"AP1+AP2" }[S.uebenAP] || "AP1+AP2";
  var gewaehlt = (S.gebiete || []).length + (S.themen || []).length;
  var fokusLabel = apName + " · "
    + (gewaehlt === 0 ? TEXTE.ueben.alleThemen : gewaehlt + (gewaehlt === 1 ? " Bereich" : " Bereiche"))
    + (S.wirtschaftNur ? " · Wirtschaft" : "");
  var mods = el("<details class='u-margin-bottom-10px'" + (S.fokusZu ? "" : " open") + " ><summary style='cursor:pointer' ><b>" + TEXTE.ueben.themenFokus + "</b> <span class='hinweis'>(" + esc(fokusLabel) + ")</span></summary><div class='fokus-inhalt u-margin-top-8px' ></div></details>");
  mods.ontoggle = function(){ setS('fokusZu', !mods.open); };
  var modsInhalt = mods.querySelector(".fokus-inhalt");
  // 1) Prüfungsteil-Umschalter AP1 / AP2 / Beide
  var seg = el("<div class='ap-seg' role='group' aria-label='" + esc(TEXTE.ueben.apModusLabel) + "'></div>");
  [["ap1", TEXTE.ueben.apSegAp1, TEXTE.ueben.apSegAp1Title],
   ["ap2", TEXTE.ueben.apSegAp2, TEXTE.ueben.apSegAp2Title],
   ["beide", TEXTE.ueben.apSegBeide, TEXTE.ueben.apSegBeideTitle]].forEach(function(o){
    var aktiv = S.uebenAP === o[0];
    var b = el("<button type='button' class='ap-seg-btn" + (aktiv ? " aktiv" : "") + "' title='" + esc(o[2]) + "'>" + esc(o[1]) + "</button>");
    b.setAttribute("aria-pressed", aktiv ? "true" : "false");
    b.onclick = function(){ mutS(function(s){ s.uebenAP = o[0]; if (o[0] === "ap2") s.wirtschaftNur = false; }); aktFrage = null; render(); };
    seg.appendChild(b);
  });
  modsInhalt.appendChild(seg);

  // Feinthemen je Gebiet aus dem Pool ableiten (poolweit f.gebiet -> [key, thema, modul, anzahl]).
  var themenVon = gebietThemen();
  function keysOf(code){ return (themenVon[code] || []).map(function(x){ return x[0]; }); }
  function gebietChecked(code){
    var ks = keysOf(code);
    return (S.gebiete || []).indexOf(code) >= 0 ||
           (ks.length > 0 && ks.every(function(k){ return (S.themen || []).indexOf(k) >= 0; }));
  }
  function feinChecked(code, key){
    return (S.gebiete || []).indexOf(code) >= 0 || (S.themen || []).indexOf(key) >= 0;
  }
  function toggleGebiet(code, checked){
    mutS(function(s){
      var ks = keysOf(code);
      s.gebiete = (s.gebiete || []).slice(); s.themen = (s.themen || []).slice();
      s.themen = s.themen.filter(function(k){ return ks.indexOf(k) < 0; });   // Einzelthemen dieses Gebiets aufheben (vom Gebiet abgedeckt)
      if (checked) { if (s.gebiete.indexOf(code) < 0) s.gebiete.push(code); }
      else s.gebiete = s.gebiete.filter(function(x){ return x !== code; });
    });
    aktFrage = null; render();
  }
  function toggleThema(code, key, checked){
    mutS(function(s){
      var ks = keysOf(code);
      s.gebiete = (s.gebiete || []).slice(); s.themen = (s.themen || []).slice();
      var ganz = s.gebiete.indexOf(code) >= 0;
      if (checked) {
        if (ganz) return;                                       // schon über das ganze Gebiet erfasst
        if (s.themen.indexOf(key) < 0) s.themen.push(key);
        if (ks.length && ks.every(function(k){ return s.themen.indexOf(k) >= 0; })) {   // alle Feinthemen -> zum Gebiet verdichten
          s.themen = s.themen.filter(function(k){ return ks.indexOf(k) < 0; });
          if (s.gebiete.indexOf(code) < 0) s.gebiete.push(code);
        }
      } else {
        if (ganz) {                                             // „ganzes Gebiet" in Einzelthemen auflösen, dieses eine abwählen
          s.gebiete = s.gebiete.filter(function(x){ return x !== code; });
          ks.forEach(function(k){ if (k !== key && s.themen.indexOf(k) < 0) s.themen.push(k); });
        } else s.themen = s.themen.filter(function(k){ return k !== key; });
      }
    });
    aktFrage = null; render();
  }

  // Baut ein Gebiet als aufklappbaren Block (Kopfzeile mit „ganzes Gebiet"-Häkchen + Feinthemen).
  function baueGebiet(gg, aus){
    var code = gg[0], name = gg[1];
    var themen = themenVon[code] || [];
    var anzahl = themen.reduce(function(a, t){ return a + t[3]; }, 0);
    var block = el("<div class='gebiet-block" + (gebietChecked(code) ? " aktiv" : "") + "'></div>");
    var kopf = el("<div class='gebiet-kopf'></div>");
    var alle = el("<label class='themen-kachel geb-alle" + (gebietChecked(code) ? " aktiv" : "") + "'><input type='checkbox'" + (gebietChecked(code) ? " checked" : "") + (aus ? " disabled" : "") + "> <span><b>" + esc(code) + "</b> · " + esc(name) + " <span class='hinweis'>· " + anzahl + " Fragen</span></span></label>");
    alle.querySelector("input").onchange = function(ev){ toggleGebiet(code, ev.target.checked); };
    kopf.appendChild(alle);
    var offen = !!gebietOffen[code];
    var tgl = el("<button type='button' class='b leise geb-toggle'" + (aus ? " disabled" : "") + " aria-expanded='" + (offen ? "true" : "false") + "'>" + esc(TEXTE.ueben.feinthemen) + (offen ? " ▾" : " ▸") + "</button>");
    kopf.appendChild(tgl);
    block.appendChild(kopf);
    var fein = el("<div class='geb-feinthemen'" + (offen ? "" : " hidden") + "></div>");
    var grid = el("<div class='themen-grid'></div>");
    themen.forEach(function(t){
      var key = t[0], thema = t[1], n = t[3];
      var an = feinChecked(code, key);
      var lab = el("<label class='themen-kachel fein" + (an ? " aktiv" : "") + "'><input type='checkbox'" + (an ? " checked" : "") + (aus ? " disabled" : "") + "> <span>" + esc(thema) + " <span class='hinweis'>· " + n + "</span></span></label>");
      lab.querySelector("input").onchange = function(ev){ toggleThema(code, key, ev.target.checked); };
      grid.appendChild(lab);
    });
    fein.appendChild(grid);
    // AP2-Bereiche: die noch fragenlosen Katalog-Fragenkomplexe als „bald"-Info behalten (Punkt 6).
    var pl = (typeof AP2_PLATZHALTER !== "undefined") && AP2_PLATZHALTER.filter(function(b){ return b.titel === name; })[0];
    if (pl) {
      var info = el("<div class='platzhalter-info'><div class='pi-kopf'><span class='bald' title='" + esc(TEXTE.ueben.ap2BaldTitle) + "'>" + esc(TEXTE.ueben.ap2Bald) + "</span> <span class='hinweis'>" + esc(TEXTE.ueben.ap2WeitereFk) + "</span></div></div>");
      var ul = el("<ul></ul>");
      pl.fk.forEach(function(fk){ ul.appendChild(el("<li>" + esc(fk) + "</li>")); });
      info.appendChild(ul);
      fein.appendChild(info);
    }
    block.appendChild(fein);
    tgl.onclick = function(){
      var o = !gebietOffen[code];
      gebietOffen[code] = o;
      fein.hidden = !o;
      tgl.setAttribute("aria-expanded", o ? "true" : "false");
      tgl.textContent = TEXTE.ueben.feinthemen + (o ? " ▾" : " ▸");
    };
    return block;
  }

  // 2) AP1-Sektion: Wirtschafts-Chip (eingebettet, Querschnitt) + die 5 AP1-Gebiete
  var ap1Aus = S.uebenAP === "ap2";
  var ap1Sec = el("<div class='ap-sektion" + (ap1Aus ? " aus" : "") + "'><div class='ap-kopf'>" + esc(TEXTE.ueben.ap1Kopf) + "</div></div>");
  var wiChip = el("<label class='themen-kachel wi-chip" + (S.wirtschaftNur ? " aktiv" : "") + "' title='" + esc(TEXTE.hinweis.wirtschaftFilterTitle) + "'><input type='checkbox'" + (S.wirtschaftNur ? " checked" : "") + (ap1Aus ? " disabled" : "") + "> <span><b>Schwerpunkt Wirtschaft</b> <span class='hinweis'>gebietsübergreifend · " + esc(wirtschaftAnzahl()) + "</span></span></label>");
  wiChip.querySelector("input").onchange = function(ev){ setS('wirtschaftNur', ev.target.checked); aktFrage = null; render(); };
  ap1Sec.appendChild(wiChip);
  L.GEBIETE.forEach(function(gg){ if (gg[2] === "AP1") ap1Sec.appendChild(baueGebiet(gg, ap1Aus)); });
  modsInhalt.appendChild(ap1Sec);
  // 3) AP2-Sektion: die 3 AP2-Prüfungsbereiche (B1/B2 mit „bald"-Fragenkomplexen, B3 = WiSo)
  var ap2Aus = S.uebenAP === "ap1";
  var ap2Sec = el("<div class='ap-sektion" + (ap2Aus ? " aus" : "") + "'><div class='ap-kopf'>" + esc(TEXTE.ueben.ap2Kopf) + " <span class='tag ap2'>AP2</span></div></div>");
  L.GEBIETE.forEach(function(gg){ if (gg[2] === "AP2") ap2Sec.appendChild(baueGebiet(gg, ap2Aus)); });
  modsInhalt.appendChild(ap2Sec);
  // 4) Auswahl zurücksetzen (Gebiete + Feinthemen + Schwerpunkt + Prüfungsteil auf „beide")
  var reset = el("<button type='button' class='b leise u-margin-top-8px'>" + esc(TEXTE.ueben.auswahlZuruecksetzen) + "</button>");
  reset.onclick = function(){ mutS(function(s){ s.gebiete = []; s.themen = []; s.wirtschaftNur = false; s.uebenAP = "beide"; }); aktFrage = null; render(); };
  modsInhalt.appendChild(reset);
  conf.appendChild(mods);
  /* G3.2 #6: Im Automatik-Modus gibt es keine einzelne globale Stufe mehr – jedes Thema hat eine
     eigene. Statt eines irrefuehrenden Festwerts steht dort jetzt ein erklaerender Hinweis. */
  var lvAnzeige = (S.levelModus === "auto")
    ? "<span class='hinweis' title='" + esc(TEXTE.ueben.schwierigkeitAutoTitle) + "'>" + TEXTE.ueben.schwierigkeitAuto + "</span>"
    : bananen(S.level) + "<span>" + LEVEL_NAMEN[S.level] + "</span>";
  var lv = el("<div class='zeile'><b>" + TEXTE.ueben.schwierigkeitLabel + "</b>" + lvAnzeige + "</div>");
  var sel = el("<select><option value='auto'>Automatisch (empfohlen)</option><option value='1'>Manuell: Anfänger</option><option value='2'>Manuell: Leicht</option><option value='3'>Manuell: Mittel</option><option value='4'>Manuell: Schwer</option></select>");
  sel.setAttribute("aria-label", TEXTE.ueben.schwierigkeitLabel);   // G1.5 #46
  sel.value = S.levelModus === "auto" ? "auto" : String(S.level);
  sel.onchange = function(){
    mutS(function(s){ if (sel.value === "auto") s.levelModus = "auto"; else { s.levelModus = "manuell"; s.level = +sel.value; } });
    render();
  };
  lv.appendChild(sel); conf.appendChild(lv);
  m.appendChild(conf);
  m.appendChild(el("<div class='zeile u-margin-bottom-8px' id='uebennav' ></div>"));
  var qa = el("<div id='qa'></div>");
  m.appendChild(qa);
  uebenVerlauf = []; uebenIdx = -1;   // #52: frischer Verlauf beim Betreten/Filterwechsel
  naechsteFrage(qa);
}
/* G3.2 #6: Zielstufe EINER Frage. Im manuellen Modus gilt weiterhin die global gewaehlte
   Stufe (S.level) als Uebersteuerung; im Automatik-Modus die je Thema gelernte Stufe,
   deren Startwert S.level ist. */
function stufeFuer(f) {
  if (S.levelModus !== "auto") return S.level;
  return L.themaStufe(S.themaLevel, L.themaKey(f.modul, f.thema), S.level);
}
/* FB-R3 Etappe 2: Feinthemen je Gebiet aus dem Pool ableiten (poolweit f.gebiet -> Feinthemen).
   Liefert { gebietCode: [ ["modul|thema", thema, modul, anzahl], ... ] }.
   M09 (Unterricht) und Fragen ohne Gebiet werden ausgelassen.

   FB-R3 PUNKT 9 (Nutzer-Entscheid 2026-07-25 "Beispiel A"): Die Liste wird SORTIERT ausgegeben –
   erst nach Modul (M01 … M08), innerhalb eines Moduls alphabetisch nach Feinthema. Vorher stand
   sie in Pool-Reihenfolge, also in der zufaelligen Reihenfolge des ersten Auftretens; genau das
   war der Nutzer-Befund "verschachtelt, ohne klare Reihenfolge". Beispiele vorher: in A2 stand
   "Netzwerkkomponenten" vor "Hardware-Komponenten", in A5 "Netzplan" vor "Gantt".
   WICHTIG: sortiert wird mit localeCompare("de"), NICHT mit < / >. Ein naiver Stringvergleich
   sortiert nach Code-Punkten und stellt Grossbuchstaben vor Kleinbuchstaben. Im Pool betrifft das
   genau drei Paare – alle wegen Gross-/Kleinschreibung, KEINES wegen Umlauten:
   "Scrum & Wasserfall"/"SMART-Ziele", "Wirtschaftlichkeit & TCO"/"WLAN & Uebertragungsstandards",
   "Backup & Verfuegbarkeit"/"BSI-Grundschutz & Schutzbedarf". Die Sortierung ist reine
   ANZEIGE-Ordnung: die Schluessel
   ("modul|thema"), die Zaehlwerte und die Auswahl-Logik in S.gebiete/S.themen bleiben unberuehrt. */
function gebietThemen() {
  var out = {}, idx = {};
  POOL.forEach(function(f){
    if (istUnterricht(f)) return;
    var code = f.gebiet || (typeof L !== "undefined" && L.gebietFuer ? L.gebietFuer(f) : undefined);
    if (!code || code === "M9") return;
    var key = f.modul + "|" + f.thema, sk = code + " " + key;
    if (!out[code]) out[code] = [];
    if (idx[sk] === undefined) { idx[sk] = out[code].length; out[code].push([key, f.thema, f.modul, 0]); }
    out[code][idx[sk]][3]++;
  });
  Object.keys(out).forEach(function(code){
    out[code].sort(function(a, b){
      if (a[2] !== b[2]) return a[2] < b[2] ? -1 : 1;          // 1. Modul (M01 ... M08)
      return String(a[1]).localeCompare(String(b[1]), "de");   // 2. Feinthema alphabetisch
    });
  });
  return out;
}
/* FB-R3 Etappe 2: Thema-Auswahl der Üben-Seite = ganz gewählte Gebiete (S.gebiete, über f.gebiet)
   ODER einzeln gewählte Feinthemen (S.themen, „modul|thema"). Nichts gewählt = alles. */
function themaGewaehlt(f) {
  var g = S.gebiete || [], th = S.themen || [];
  if (!g.length && !th.length) return true;
  var gb = f.gebiet || (typeof L !== "undefined" && L.gebietFuer ? L.gebietFuer(f) : undefined);
  if (gb && g.indexOf(gb) >= 0) return true;
  return th.indexOf(f.modul + "|" + f.thema) >= 0;
}
/* G3.2 #6: harter Filter auf die Stufe des jeweiligen Themas, mit Rückfall auf die übergebene
   Menge, falls zur Stufe nichts übrig bleibt.
   ⚠️ ZUSAMMENGEFÜHRT 2026-07-26: Diese zwei Zeilen standen wortgleich in kandidaten() UND in
   kandidatenUnterricht(). Wer den Rückfall ändert, hätte ihn sonst an einer Stelle ändern und an
   der anderen vergessen können – im Üben-Bereich und im Unterrichtsmodus wäre das Verhalten dann
   still auseinandergelaufen. REINER UMBAU, Verhalten unverändert.
   ⚠️ ZUM VERHALTEN SELBST: Der Rückfall geht auf die GANZE Menge, NICHT auf die nächstniedrigere
   Stufe. Bei einem Thema ohne Stufe-1-Fragen landet ein Anfänger deshalb sofort auf Stufe 2/3.
   Das betrifft 26 von 73 Feinthemen (gemessen 26.07.) und ist als eigener Task vorgemerkt –
   siehe PLAENE.md „STUFE-1-LÜCKEN". Nicht nebenbei ändern. */
/* ⚠️⚠️ NUTZER-ENTSCHEID 09.09.2026 - "NACHBARSTUFE BEI KNAPPHEIT".
   BIS DAHIN: exakte Stufengleichheit, mit einem Fallback, der erst bei NULL Fragen greift.
   GEMESSEN (tools/probe_lernfluss.js, 60 Sitzungen a 50, echte naechsteFrage(), geseedet):
     Stufe 4  97 Fragen =  8,6 % des Pools  ->  24,5 % der Ziehungen  (2,8-fach)
     Stufe 3 475 Fragen = 42,2 % des Pools  ->  21,6 % der Ziehungen  (0,5-fach)
   Ein Fortgeschrittener sah rechnerisch jede Stufe-4-Frage ~7,6-mal und jede Stufe-3-Frage
   ~1,4-mal. URSACHE: wer in einem Thema auf Stufe 4 steht, sieht NUR dessen Stufe-4-Fragen -
   und viele Feinthemen haben davon eine oder zwei.
   ►►► DIE KNAPPHEIT IST JE THEMA ZU MESSEN, NICHT UEBER DIE GANZE MENGE. Die Kandidatenmenge
   umfasst rund 240 Fragen aus ~35 Themen; global ist sie nie knapp, waehrend einzelne Themen
   auf ihrer Stufe leerlaufen. Ein globaler Test haette hier NICHTS gefunden - dieselbe Klasse
   wie "ein Pool-Scan ueber json.dumps zaehlt Felder, nicht Fragen".
   ⚠️ Ergaenzt wird NUR NACH UNTEN und nur bis L.CONFIG.stufeMinKandidaten erreicht ist: die
   Stufenlogik fuehrt weiter von leicht nach schwer, sie laeuft nur nicht mehr leer.
   ⛔ Der Wert ist GEMESSEN (Messreihe: BEFUNDE_LERNFLUSS.md), nicht gesetzt. */
function aufStufeFiltern(menge) {
  var minN = (typeof L !== "undefined" && L.CONFIG && L.CONFIG.stufeMinKandidaten) || 3;
  var proThema = {};
  menge.forEach(function(f){
    var k = f.modul + "|" + f.thema;
    (proThema[k] || (proThema[k] = [])).push(f);
  });
  var out = [];
  Object.keys(proThema).forEach(function(k){
    var gruppe = proThema[k];
    var stufe = stufeFuer(gruppe[0]);          // haengt am Thema, in der Gruppe also gleich
    var genommen = gruppe.filter(function(f){ return f.schwierigkeit === stufe; });
    for (var s = stufe - 1; s >= 1 && genommen.length < minN; s--) {
      genommen = genommen.concat(gruppe.filter(function(f){ return f.schwierigkeit === s; }));
    }
    /* ⛔ KEIN FALLBACK JE THEMA. Hat ein Thema auf seiner Stufe nichts, bleibt es draussen -
       genau wie vorher, als der globale Fallback nie griff, weil andere Themen lieferten.
       Ein Fallback je Gruppe haette im Grundzustand Themen OHNE Stufe-1-Frage mit ihren
       hoeheren Stufen hereingeholt; test_adaptiv hat das sofort gemeldet. */
    out = out.concat(genommen);
  });
  return out.length ? out : menge;
}
function kandidaten() {
  var pool = POOL.filter(function(f){
    /* FB-R3 Punkt 6: Prüfungsteil über uebenPasst() (AP1/AP2/beide), nicht mehr über passtAP().
       FB-R3: der Schwerpunkt „Wirtschaft" wirkt ZUSÄTZLICH zur Thema-Auswahl (UND-Verknüpfung),
       damit „Lernfeld 07 + Schwerpunkt Wirtschaft" die Vertragsthemen liefert und nicht alles. */
    return uebenPasst(f) && themaGewaehlt(f)
      && (!S.wirtschaftNur || istWirtschaft(f));
  });
  return aufStufeFiltern(pool).map(function(f){ return f.id; });
}
/* Rechen-Generator-Aufgabe als Pseudo-Frage für den Übungspool */
function genAlsFrage() {
  /* FB-R3 Punkt 6: Generator-Einstreuung folgt dem Üben-Prüfungsteil (uebenAP): im AP1-Modus keine
     AP2-Generatoren, im AP2-Modus nur AP2-Generatoren, bei „beide" alle. netzplan bleibt ausgenommen. */
  var arten = Object.keys(L.GENERATOREN).filter(function(a){
    if (a === "netzplan") return false;
    var ap2 = !!L.GENERATOREN[a].ap2;
    if (S.uebenAP === "ap1") return !ap2;
    if (S.uebenAP === "ap2") return ap2;
    return true;
  });
  /* FB-R3 Etappe 2: Generator-Themen über L.gebietFuer der Gebiet-/Feinthemen-Auswahl folgen
     lassen (Generatoren tragen KEIN gebiet-Feld). Bei aktiver Auswahl bleibt ein Generator nur,
     wenn sein abgeleitetes Gebiet in S.gebiete ODER sein „modul|thema" in S.themen steht. */
  if ((S.gebiete || []).length || (S.themen || []).length) {
    arten = arten.filter(function(a){
      var meta = L.GENERATOREN[a];
      var g = L.gebietFuer({ modul: meta.modul, thema: meta.thema });
      return (g && S.gebiete.indexOf(g) >= 0) || S.themen.indexOf(meta.modul + "|" + meta.thema) >= 0;
    });
  }
  if (!arten.length) return null;
  var art = L.pick(arten), meta = L.GENERATOREN[art];
  var g = meta.fn();
  /* ⚠️ NUTZER-ENTSCHEID 09.09.2026: die feste Stufe der Generator-Art statt S.level. S.level ist
     im Automatik-Modus dauerhaft 1 – jede vierte Aufgabe trug damit das Tag „Anfaenger", und die
     Lernfluss-Probe rechnete an einem falschen Nenner. Herleitung der Werte: L.GENERATOREN. */
  return Object.assign(g, { id: "GEN-" + art, modul: meta.modul, thema: meta.thema,
    pruefungsteil: meta.ap2 ? "AP2" : "AP1", schwierigkeit: meta.stufe || S.level, generatorArt: art });
}
function naechsteFrage(qa) {
  var f = null;
  mutS(function(s){ s.uebenZaehler++; }, false);   // transient: gemeinsame Persistenz via speichere() am Ende
  if (themenSerie.length) {                              // #60: laufende Themen-Serie hat Vorrang
    f = Object.assign({}, L.instanziiere(frageById(themenSerie.shift())), { hinweisSerie: true });
  }
  var due = L.fdDue(S.fehlerDeck, heute()).filter(function(id){ var fq = frageById(id); return fq && uebenPasst(fq) && S.lastShown.slice(-10).indexOf(id) === -1; });
  if (!f && S.uebenZaehler % APP_CONFIG.fdEinstreuung === 0 && due.length) {    // dezente Einstreuung: max. 1 von 5
    f = Object.assign({}, L.instanziiere(frageById(L.pick(due))), { hinweisFD: true });
  } else if (!f && S.uebenZaehler % APP_CONFIG.generatorEinstreuung === 2 && S.lastTyp !== "generator") {
    f = genAlsFrage();                                   // Rechenaufgaben mit frischen Zufallswerten einstreuen
  }
  if (!f) {
    var ctx = gewichtsKontext();                         // A3: Relevanz x Schwäche x Interleaving
    var r = L.deckPick(kandidatenMitTypWechsel(), S.seen, S.lastShown, null, null,
      function(id){ var fx = frageById(id); return fx ? L.gewichteFrage(fx, ctx) : 1; });
    /* FB-R3: Der Leerzustand muss sagen, WAS zu tun ist. Beim Schwerpunkt Wirtschaft ist die
       haeufigste Ursache eine Lernfeld-Auswahl ohne Wirtschaftsthemen – dann hilft der generische
       Satz nicht weiter. */
    if (!r.id) { qa.innerHTML = "<div class='panel'><i>" + (S.wirtschaftNur ? TEXTE.hinweis.wirtschaftLeer : TEXTE.hinweis.keineFragenGewaehlterFilter) + "</i></div>"; clearAktion(); return; }
    mutS(function(s){ s.seen = r.seen; s.seen[r.id] = true; }, false);
    f = L.instanziiere(frageById(r.id));                 // Zahlenvarianz: ggf. zufällige Werte-Variante
  }
  mutS(function(s){ s.lastShown.push(f.id); if (s.lastShown.length > 50) s.lastShown.shift(); }, false);
  setS('lastTyp', (f.typ === "generator") ? "generator" : typVon(f), false);
  if (f.thema) { letzteThemen.push(f.thema); if (letzteThemen.length > 2) letzteThemen.shift(); }
  speichere();
  uebenVerlauf.push(f); uebenIdx = uebenVerlauf.length - 1;   // #52: neue Frage ans Verlaufsende
  uebenRender(qa);
}
/* #52: rendert die Frage an uebenIdx samt Zurück/Weiter-Leiste. „Live" = neueste, noch unbeantwortete
   Frage (bucht Statistik/Fehler-Deck). Aus dem Verlauf wiederholte Fragen sind Review (keine Buchung). */
function uebenRender(qa) {
  var f = uebenVerlauf[uebenIdx];
  aktFrage = f;
  var live = (uebenIdx === uebenVerlauf.length - 1) && !f._beantwortet;
  /* 2026-07-30: Leiste jetzt über macheVerlaufNav() – identisch mit der in M09. Verhalten
     unverändert (Zurück deaktiviert bei idx 0, Weiter nur wenn es ein „danach" gibt). */
  macheVerlaufNav(document.getElementById("uebennav"), uebenIdx, uebenVerlauf.length, live,
    function(ziel){ uebenIdx = ziel; uebenRender(qa); });
  loeseFrage(f, qa, {
    onGraded: function(korrekt, extra){
      if (!live) return;                                   // Review: keine erneute Fehler-Deck-/Statistik-Buchung
      f._beantwortet = true;
      verbucheAntwort(f, korrekt, extra);
      // G3.4 (#27, 2026-07-19): kein Gate mehr. Die Themen-Serie braucht keine belastbare
      // Statistik – sie zieht nur Fragen desselben Themas. Gerade beim Einstieg ist gezieltes
      // Nachüben am wertvollsten. Das Adaptiv-Gate (L.CONFIG.gate) bleibt davon unberührt.
      if (!korrekt) zeigeThemenSerieAngebot(f, qa);
    },
    onNext: function(){
      if (uebenIdx < uebenVerlauf.length - 1) { uebenIdx++; uebenRender(qa); }  // erst vorwärts durch den Verlauf
      else naechsteFrage(qa);                                                    // am Ende: neue Frage ziehen
    }
  });
  qa.appendChild(macheWischLeiste(                                              // #54 Wisch-Leiste unter der Frage
    uebenIdx > 0 ? function(){ uebenIdx--; uebenRender(qa); } : null,
    function(){ if (uebenIdx < uebenVerlauf.length - 1) { uebenIdx++; uebenRender(qa); } else if (f._beantwortet) naechsteFrage(qa); }
  ));
}
/* Kandidaten, aber ohne direkten Wiederholungs-Typ (wenn vermeidbar) */
function kandidatenMitTypWechsel() {
  var ids = kandidaten();
  if (!S.lastTyp) return ids;
  var anders = ids.filter(function(id){ var f = frageById(id); return f && typVon(f) !== S.lastTyp; });
  return anders.length ? anders : ids;
}

/* ---- „Klausurvorbereitung" (M09, 2026-07-20) ----
   Eigener Uebungs-Flow NUR ueber den Unterrichts-Pool (istUnterricht). Bewusst schlanker als
   sUeben: keine Generator-Einstreuung, keine Themen-Serie – aber seit dem 30.07. mit demselben
   Verlauf (← Zurück, s. unterrichtZiehe/unterrichtRender), derselben adaptiven Stufe je Thema, derselben
   Bewertung/Verbuchung (verbucheAntwort schreibt S.statistik.M09 + T:M09:* und befuellt das
   GEMEINSAME Fehler-Deck, Nutzer-Entscheid E-U7). Eigene Statistik hier auf der Seite;
   L.bereitschaft ueberspringt M09, damit der AP1-Score sauber bleibt. */
var unterrichtThema = "";                                  // Seiten-lokaler Themenfilter (nicht persistiert)
var unterrichtZuletzt = [];                                // vermeidet direkte Wiederholung (letzte 10)
var unterrichtLetzterTyp = null;                           // 2026-07-30: Typwechsel-Sperre, s. kandidatenUnterricht
var unterrichtLetztesThema = null;                         // 2026-07-30: Themenwechsel-Sperre (nur ohne Themenfilter)
/* ⚠️ 2026-07-30 NUTZER-WUNSCH: "ueberpruefe das alle themenbereiche gleichmaessig abgefragt
   werden ... sowas wie eine grenze die bei allen erreicht sein muss bevor sie wieder vorkommen".
   Gemessen war die Verteilung 3,6-fach schief: Netzplantechnik 9,1 Ziehungen je 60 Aufgaben,
   Aufgabenanalyse 2,5 - gleichmaessig waeren 4,6. Ursache ist die Fragenzahl je Thema (16 zu 4).
   THEMEN-RUNDE: Jedes Thema kommt einmal dran, bevor eines ein zweites Mal kommt. Ist die Runde
   voll, beginnt sie neu. Session-lokal wie unterrichtZuletzt - nicht persistiert. */
var unterrichtThemenRunde = [];                            // Themen, die in dieser Runde dran waren
var unterrichtLetzteId = null;                              // 2026-07-30: Sperre gegen direkte Wiederholung
var unterrichtZaehler = 0;                                 // Ausbaustufe 2: Takt der Deck-Einstreuung
var unterrichtTab = "ueben";                               // "ueben" | "klausur" (nicht persistiert)
/* ⚠️ 2026-07-30 NUTZER-BEFUND: „ein zurueck knopf zur vorherigen frage" fehlte hier.
   Der AP1-Flow kann das seit #52 (uebenVerlauf/uebenIdx/uebenRender). Die Klausurvorbereitung
   hatte nur naechste(), und diese eine Funktion ZOG und ZEIGTE in einem Zug. Genau diese
   Vermischung war der Grund, warum es keinen Zurueck-Knopf geben KONNTE: Anzeigen hiess ziehen.
   ►► Deshalb jetzt zwei Funktionen: unterrichtZiehe() zieht und schreibt die Sperren fort,
   unterrichtRender() zeigt nur an und fasst nichts an.
   ⚠️⚠️ BEIM ZURUECKBLAETTERN DARF KEINE SPERRE FORTGESCHRIEBEN WERDEN, sonst verschiebt sich das
   Deck durch blosses Blaettern. Betroffen sind SECHS Zustaende, alle heute erst gebaut:
     unterrichtZaehler ....... Takt der Wiedervorlage (jede fdEinstreuung-te Frage)
     S.seenUnterricht ........ das Deck selbst (jede Frage einmal, bevor eine wiederkehrt)
     unterrichtZuletzt ....... Sperre der letzten 10
     unterrichtLetzteId ...... Sperre gegen die direkte Wiederholung
     unterrichtThemenRunde ... Gleichverteilung ueber die 13 Themen
     unterrichtLetzterTyp / unterrichtLetztesThema ... Typ- und Themenwechsel
   Alle sechs stehen AUSSCHLIESSLICH in unterrichtZiehe(). `tests/test_zurueck_m09.js` prueft
   jeden einzeln gegen das Blaettern. */
var unterrichtVerlauf = [];                                // Session-Verlauf fuer ← Zurück
var unterrichtIdx = -1;
var unterrichtQa = null;                                   // Renderziel der laufenden Seite
var unterrichtStatZeichnen = null;                         // Statistik-Neuzeichnung der laufenden Seite
/* ⚠️ 2026-08-04, Etappe B der M09-Aufloesung: HIER STAND unterrichtSpickView().
   Die Kategorie hat ihren Inhalt an M01/M02/M03/M07/M08 abgegeben und ist leer; die acht
   Abschnitte des eigenen Spickzettels sind in 99_Spickzettel.md aufgegangen, wo sie
   inhaltlich hingehoeren (Gantt und Eisenhower zu Modul 01, Wertschoepfung zu Modul 03,
   Aufbau-/Ablauforganisation, Vollmachten und Anfrage/Angebot zu Modul 07).
   ►► EINE QUELLE STATT ZWEI – Nutzer-Entscheid 04.08.2026. spickzettel_m09.js,
   tools/build_spick_m09.py und der Tab sind mit entfernt. Der AP1-Spickzettel wird jetzt
   von tools/build_spick.py aus der Markdown-Datei gebaut, damit sich .md und .js nicht
   wieder auseinanderentwickeln koennen. */
/* ---- M09-Klausursimulation (2026-07-21) ----
   EIGENSTAENDIG vom AP1-sim/simLaeuft-Objekt (app_sim.js) - eigene Modul-Variablen, eigener Timer,
   eigene Auswertung. Kern-Idee (verifiziert): alle 25 Fragen werden EINMAL ueber loeseFrage()
   gerendert (jede in einen eigenen Container), nur der Container der aktuellen Frage ist sichtbar
   (display), der Rest display:none - beim Umschalten wird NUR die Sichtbarkeit + die Navigation
   neu gezeichnet, nie die Fragen selbst (das WAERE der Verlust des Antwortzustands: loeseFrage hat
   - anders als renderFrage/app_frage.js mit seinem antwortVor-Parameter fuer die AP1-Simulation -
   keinen Wiederherstellungsmechanismus; Zustand ueberlebt nur, weil der DOM-Knoten am Leben bleibt).
   Die Container pro Frage UND das Navigations-Panel werden beim Start EINMAL gebaut und als
   DOM-Referenzen in klausur.fragenWrap / klausur.navHost gehalten. sUnterricht()/klausurRender()
   haengen sie bei jedem Aufruf nur wieder ein (z. B. nach einem render(), der #main geleert hat) -
   ohne sie neu zu erzeugen. */
var klausur = null, klausurTimer = null;
/* setAktion/aktionAn/clearAktion sind app-weite Singletons (ein globaler #btnAktion-Button, siehe
   app_ui.js). Da waehrend der Klausur ALLE 25 Fragen gleichzeitig im DOM leben (nur per display
   ausgeblendet) und jeder R_TYP-Handler (app_loeser.js) beim Rendern selbst setAktion(...) fuer
   seinen eigenen „Prüfen"-Button aufruft, wuerde ohne Gegenmassnahme am Ende IMMER die zuletzt
   gebaute Frage (#25) die Aktionsleiste "besitzen" - unabhaengig davon, welche Frage gerade
   sichtbar ist. klausurWrapAktion() faengt jeden setAktion/clearAktion-Aufruf waehrend der Klausur
   ab und merkt sich pro Fragenindex den letzten Stand; klausurZeigeAktion(i) spielt ihn beim
   Wechsel zurueck ab. (Bekannte Einschraenkung, siehe Abschlussbericht: rein interaktive
   Disabled-Umschaltungen, die manche R_TYP-Handler per direktem
   document.getElementById("btnAktion").disabled=... setzen statt ueber aktionAn(), werden dabei
   NICHT mitgeschnitten - betrifft nur den Aktivierungszustand des Pruefen-Buttons, nicht die
   Antwort selbst.) */
var _klausurAktionOrig = null;
function klausurWrapAktion(){
  if (_klausurAktionOrig) return;
  _klausurAktionOrig = { setAktion: setAktion, aktionAn: aktionAn };
  // Bewusst NICHT clearAktion() wrappen/mitschneiden: render() ruft clearAktion() als generische
  // Vorstufe VOR jedem Seiten-Rendering auf (auch fuer die aktuelle Klausur-Frage) - wuerde das
  // mitgeschnitten, ueberschriebe dieser rein technische Zwischen-Aufruf sofort wieder den
  // korrekten, waehrend des Aufbaus je Frage erfassten setAktion-Schnappschuss (klausurZeigeAktion
  // liest ihn ja unmittelbar danach wieder aus). Ohne clearAktion-Tracking bleibt der beim Aufbau
  // erfasste "set"-Schnappschuss pro Frage stabil; ein echtes clearAktion() (z. B. Guard fuer eine
  // kaputte Frage in loeseFrage) wirkt weiterhin normal, nur eben nicht dauerhaft mitgemerkt.
  setAktion = function(label, fn, opts){
    if (klausur) klausur.aktionSnap[klausur.idx] = { label: label, fn: fn, opts: opts };
    _klausurAktionOrig.setAktion(label, fn, opts);
  };
  aktionAn = function(){
    if (klausur) {
      var snap = klausur.aktionSnap[klausur.idx];
      if (snap) snap.opts = Object.assign({}, snap.opts, { disabled:false });
    }
    _klausurAktionOrig.aktionAn();
  };
}
function klausurUnwrapAktion(){
  if (!_klausurAktionOrig) return;
  setAktion = _klausurAktionOrig.setAktion;
  aktionAn = _klausurAktionOrig.aktionAn;
  _klausurAktionOrig = null;
}
function klausurZeigeAktion(i){
  var snap = klausur.aktionSnap[i];
  if (snap) setAktion(snap.label, snap.fn, snap.opts);
  else clearAktion();
}
/* Wanduhr ueber startTs (wie sSimulation in app_sim.js), kein Tick-Zaehlen. */
function klausurTick(){
  klausur.restSek = klausur.dauerMin*60 - Math.floor((Date.now()-klausur.startTs)/1000);
  var t = document.getElementById("klausurTimer");
  if (t) { t.textContent = Math.floor(klausur.restSek/60) + ":" + String(klausur.restSek%60).padStart(2,"0"); t.classList.toggle("warn", klausur.restSek < 300); }
  if (klausur.restSek <= 0) klausurAbgeben();
}
/* Nur die Navigation neu zeichnen (Timer, "Frage n/25", Nummern-Raster, Zurueck/Weiter/Spaeter/
   Abgeben) - NIE die Fragen selbst (siehe Kopf-Kommentar oben). */
function klausurZeichneNav(){
  var f = klausur.fragen[klausur.idx];
  klausur.navHost.innerHTML = "";
  var kopf = el("<div class='panel'><div class='zeile u-justify-content-space-between' ><span class='timer' id='klausurTimer'>" +
    Math.floor(klausur.restSek/60) + ":" + String(klausur.restSek%60).padStart(2,"0") + "</span>" +
    "<span class='hinweis'>" + TEXTE.unterricht.klausurFrageVon.replace("{n}", klausur.idx+1).replace("{gesamt}", klausur.fragen.length) + "</span></div>" +
    "<div class='kicker u-margin-top-8px' >" + TEXTE.unterricht.klausurKopf.replace("{thema}", esc(f.thema)) + "</div></div>");
  klausur.navHost.appendChild(kopf);
  var navP = el("<div class='panel'></div>");
  var grid = el("<div class='simgrid'></div>");
  klausur.fragen.forEach(function(ff, i){
    var b = el("<button></button>"); b.textContent = i+1;
    if (klausur.beantwortet[i]) b.classList.add("beantwortet");
    if (klausur.markiert[i]) b.classList.add("markiert");
    if (i === klausur.idx) b.classList.add("aktuell");
    b.onclick = function(){ klausurGotoFrage(i); };
    grid.appendChild(b);
  });
  navP.appendChild(grid);
  klausur.navHost.appendChild(navP);
  var fuss = el("<div class='panel zeile'></div>");
  var zurueck = el("<button class='b leise'>" + TEXTE.aktion.zurueckKurz + "</button>");
  zurueck.disabled = klausur.idx === 0;
  zurueck.onclick = function(){ klausurGotoFrage(klausur.idx - 1); };
  var mark = el("<button class='b leise'>" + (klausur.markiert[klausur.idx] ? TEXTE.aktion.markierungEntfernen : TEXTE.aktion.spaeterPruefen) + "</button>");
  mark.onclick = function(){ klausur.markiert[klausur.idx] = !klausur.markiert[klausur.idx]; klausurZeichneNav(); };
  var weiter = el("<button class='b'>" + TEXTE.aktion.weiterKurz + "</button>");
  weiter.disabled = klausur.idx === klausur.fragen.length - 1;
  weiter.onclick = function(){ klausurGotoFrage(klausur.idx + 1); };
  var abgabe = el("<button class='b gelb u-margin-left-auto' >" + TEXTE.aktion.abgeben + "</button>");
  abgabe.onclick = function(){ if (confirm(TEXTE.unterricht.klausurWirklichAbgeben)) klausurAbgeben(); };
  [zurueck, mark, weiter, abgabe].forEach(function(b){ fuss.appendChild(b); });
  klausur.navHost.appendChild(fuss);
}
/* Frage wechseln: NUR display umschalten + Navigation neu zeichnen + Aktionsleiste fuer die neue
   Frage wiederherstellen. Ruft ausdruecklich NICHT render() auf (siehe Kopf-Kommentar oben - das
   wuerde ueber m.innerHTML="" alle 25 Container aus dem DOM entfernen). */
function klausurGotoFrage(i){
  if (!klausur || i < 0 || i >= klausur.hosts.length) return;
  klausur.hosts[klausur.idx].style.display = "none";
  klausur.idx = i;
  klausur.hosts[i].style.display = "";
  klausurZeigeAktion(i);
  klausurZeichneNav();
}
/* Haengt die (einmal gebauten) DOM-Knoten wieder ein, z. B. nach einem render(), der #main
   zwischenzeitlich geleert hat (erneuter Aufruf derselben Route) - baut NICHTS neu. */
function klausurRender(m){
  m.appendChild(klausur.navHost);
  m.appendChild(klausur.fragenWrap);
  klausurZeigeAktion(klausur.idx);
}
function klausurStarte(){
  var fragen = buildM09Klausur(25);
  if (fragen.length < 8) { alert(TEXTE.hinweis.zuWenigeFragen); return; }
  speichere();
  klausur = { fragen: fragen, korrekt: {}, beantwortet: {}, markiert: {}, aktionSnap: {}, idx: 0,
              dauerMin: 60, startTs: Date.now(), restSek: 60*60, hosts: [], fragenWrap: null, navHost: null };
  klausurWrapAktion();
  klausur.fragenWrap = el("<div></div>");
  klausur.navHost = el("<div></div>");
  klausur.fragen.forEach(function(f, i){
    var host = el("<div></div>");
    host.style.display = "none";
    klausur.hosts.push(host);
    klausur.fragenWrap.appendChild(host);
    klausur.idx = i;   // waehrend des Aufbaus: setAktion-Aufrufe (klausurWrapAktion) dem richtigen Index zuordnen
    loeseFrage(f, host, {
      klausur: true,
      onGraded: function(korrekt){ klausur.korrekt[i] = korrekt === true; klausur.beantwortet[i] = true; klausurZeichneNav(); }
    });
  });
  klausur.idx = 0;
  klausur.hosts[0].style.display = "";
  klausurZeichneNav();
  klausurTimer = setInterval(klausurTick, 1000);
  render();
}
/* Beim Verlassen der Klausur (Seitenwechsel weg von "unterricht", siehe render() weiter oben in
   dieser Datei) den Interval raeumen und die Aktionsleiste entkoppeln - der Durchlauf wird NICHT
   fortgesetzt (analog simAbbrechen() in app_sim.js fuer die AP1-Simulation, aber eigenstaendig). */
function klausurAbbrechen(){
  if (klausurTimer) clearInterval(klausurTimer); klausurTimer = null;
  klausurUnwrapAktion();
  klausur = null;
}
function klausurAbgeben(){
  if (klausurTimer) clearInterval(klausurTimer); klausurTimer = null;
  var dauerMin = klausur.dauerMin;
  var zeitSek = Math.max(0, dauerMin*60 - Math.max(0, klausur.restSek));   // #45-analog: benoetigte Zeit
  var fragenK = klausur.fragen;
  var korrekt = fragenK.map(function(f, i){ return klausur.korrekt[i] === true; });   // unbeantwortet zaehlt als falsch
  var erg = L.simErgebnis(fragenK, korrekt);
  mutS(function(s){
    fragenK.forEach(function(f, i){ if (!korrekt[i]) L.fdOnWrong(s.fehlerDeck, f.id, heute()); });
    s.m09Historie.push({ datum: L.dayKey(heute()), prozent: erg.prozent, note: erg.note.note, punkte: erg.punkte, gesamt: erg.gesamt, zeitSek: zeitSek });
  });
  klausurUnwrapAktion();
  klausur = null;
  var m = document.getElementById("main"); m.innerHTML = "";
  var p = el("<div class='panel'><h2>" + TEXTE.simulation.auswertungH2 + "</h2></div>");
  p.appendChild(el("<div class='karten'>" +
    "<div class='karte'><div class='gross'>" + erg.punkte + " / " + erg.gesamt + "</div>" + TEXTE.simulation.punkte + "</div>" +
    "<div class='karte'><div class='gross'>" + erg.prozent + " %</div>" + TEXTE.simulation.ergebnis + "</div>" +
    "<div class='karte'><div class='gross'>Note " + erg.note.note + "</div>" + erg.note.text + "</div>" +
    "<div class='karte'><div class='gross' style='color:var(--" + (erg.note.bestanden ? "gruen" : "rot") + ")'>" + (erg.note.bestanden ? TEXTE.simulation.bestanden : TEXTE.simulation.nicht) + "</div>" + (erg.note.bestanden ? TEXTE.simulation.bestanden : TEXTE.simulation.nichtBestanden) + TEXTE.simulation.abFuenfzig + "</div></div>"));
  p.appendChild(el("<div class='hinweis u-margin-top-8px' >" + TEXTE.hinweis.ihkNotenschluessel + "</div>"));
  p.appendChild(el("<div class='hinweis'>Benötigte Zeit: <b>" + Math.floor(zeitSek/60) + ":" + String(zeitSek%60).padStart(2,"0") + "</b> von " + dauerMin + ":00 Min.</div>"));
  var proA = "<h3>" + TEXTE.unterricht.klausurErgebnisProThema + "</h3>";
  var themenReihenfolge = [];
  fragenK.forEach(function(f){ if (themenReihenfolge.indexOf(f.thema) < 0) themenReihenfolge.push(f.thema); });
  themenReihenfolge.forEach(function(th){
    var rc = 0, ge = 0;
    fragenK.forEach(function(f, i){ if (f.thema === th) { ge++; if (korrekt[i]) rc++; } });
    if (!ge) return;
    var q = Math.round(rc / ge * 100);
    proA += "<div class='u-margin-8px-0' ><b>" + esc(th) + "</b><br><span class='hinweis'>" + rc + "/" + ge + " richtig (" + q + " %)</span><div class='balken'><div style='width:" + q + "%'></div></div></div>";
  });
  p.appendChild(el("<div>" + proA + "</div>"));
  m.appendChild(p);
  var wb = el("<div class='panel'><button class='b gelb'>" + TEXTE.unterricht.klausurZurueckZurUebersicht + "</button></div>");
  wb.querySelector("button").onclick = function(){ render(); };
  m.appendChild(wb);
  renderNav(); renderKopf();
}
/* Klausur-Startkarte: Erklaerung, Start-Button, darunter Verlauf aus S.m09Historie. Laeuft die
   Klausur bereits, zeigt sUnterricht() selbst (ganz oben in der Funktion) klausurRender(m) und
   diese Funktion wird gar nicht erst aufgerufen. */
function unterrichtKlausurView(m) {
  var p = el("<div class='panel'><h2>" + TEXTE.unterricht.klausurH2 + "</h2><div class='hinweis'>" + TEXTE.unterricht.klausurErklaerung + "</div></div>");
  var start = el("<button class='b gelb u-margin-top-10px' >" + TEXTE.unterricht.klausurStarten + "</button>");
  start.onclick = klausurStarte;
  p.appendChild(start);
  m.appendChild(p);
  if (S.m09Historie.length) {
    var h = el("<div class='panel'><h2>" + TEXTE.unterricht.klausurHistorieH2 + "</h2></div>");
    var tr = el("<div class='trend'></div>");
    S.m09Historie.slice(-12).forEach(function(e){
      tr.appendChild(el("<div style='height:" + Math.max(4, e.prozent*0.8) + "px' title='" + datumDE(e.datum) + ": " + e.prozent + " %'><span>" + Math.round(e.prozent) + "</span></div>"));
    });
    h.appendChild(tr);
    h.appendChild(el("<div class='hinweis'>" + S.m09Historie.slice(-5).reverse().map(function(e){ return datumDE(e.datum) + ": " + e.prozent + " % (Note " + e.note + ")"; }).join(" · ") + "</div>"));
    m.appendChild(h);
  }
}
/* Ausbaustufe 2 (2026-07-20): faellige M09-Karten aus dem GEMEINSAMEN Fehler-Deck.
   Notwendig, weil die Einstreuung in naechsteFrage() ueber passtAP() filtert und M09 damit
   ausschliesst – falsch beantwortete Unterrichtsfragen tauchten dadurch von selbst NIE wieder auf,
   obwohl sie laut E-U7 im Deck liegen. Die AP1-Sperre bleibt unangetastet: hier wird
   ausschliesslich ueber istUnterricht gefiltert, also genau andersherum.
   Der Themenfilter gilt bewusst auch fuer Wiedervorlagen – wer gezielt ein Thema uebt, soll nicht
   von einer Karte aus einem anderen Thema unterbrochen werden. */
function dueUnterricht() {
  return L.fdDue(S.fehlerDeck, heute()).filter(function(id){
    var fq = frageById(id);
    if (!fq || !istUnterricht(fq)) return false;
    if (unterrichtThema && fq.thema !== unterrichtThema) return false;
    return unterrichtZuletzt.indexOf(id) === -1;
  });
}
/* ⚠️ 2026-07-30: TYP- UND THEMENWECHSEL NACHGERUESTET.
   Der AP1-Uebungsflow verbietet ueber kandidatenMitTypWechsel() den zuletzt gezeigten Fragetyp –
   die Klausurvorbereitung hatte das NICHT und zog mit L.pick() rein zufaellig. Gemessen ueber
   4000 simulierte Ziehungen: gleicher Typ direkt hintereinander 4,3 %, gleiches Thema 7,9 % –
   also praktisch die Zufallserwartung (5,3 % / 8,7 %). Einziger Schutz war die Sperre der
   letzten 10 Fragen.
   Beide Filter greifen NACHEINANDER und jeweils nur, wenn danach noch etwas uebrig bleibt –
   sonst wuerde ein enger Themenfilter (nur ein Thema gewaehlt, wenige Typen) den Pool leeren.
   ⚠️ Der Themenfilter wird UEBERSPRUNGEN, wenn der Nutzer selbst ein Thema gewaehlt hat: dann
   ist die Wiederholung desselben Themas ausdruecklich gewollt. */
function kandidatenUnterricht() {
  var pool = POOL.filter(istUnterricht);
  if (unterrichtThema) pool = pool.filter(function(f){ return f.thema === unterrichtThema; });
  var basis = aufStufeFiltern(pool);              // 2026-07-26: gemeinsame Hilfsfunktion, s. o.
  var frisch = basis.filter(function(f){ return unterrichtZuletzt.indexOf(f.id) === -1; });
  var menge = frisch.length ? frisch : basis;
  /* THEMEN-RUNDE zuerst: Sie ist die groebste Einschraenkung und darf nicht von der
     Typsperre ueberstimmt werden. Bei gewaehltem Themenfilter ausgeschaltet - dann ist
     nur EIN Thema verfuegbar und eine Runde waere sinnlos. */
  if (!unterrichtThema && unterrichtThemenRunde.length) {
    var offeneThemen = menge.filter(function(f){ return unterrichtThemenRunde.indexOf(f.thema) === -1; });
    if (offeneThemen.length) menge = offeneThemen;
    else unterrichtThemenRunde.length = 0;      // Runde voll -> neu beginnen
  }
  if (unterrichtLetzterTyp) {
    var andererTyp = menge.filter(function(f){ return typVon(f) !== unterrichtLetzterTyp; });
    if (andererTyp.length) menge = andererTyp;
  }
  if (unterrichtLetztesThema && !unterrichtThema) {
    var anderesThema = menge.filter(function(f){ return f.thema !== unterrichtLetztesThema; });
    if (anderesThema.length) menge = anderesThema;
  }
  return menge.map(function(f){ return f.id; });
}
function sUnterricht(m) {
  // M09-Klausur laeuft eingebettet in dieser Seite (2026-07-21): eigene Variablen (klausur /
  // klausurTimer, oben deklariert) - NICHT das globale sim/simLaeuft der AP1-Simulation. Waehrend
  // sie laeuft, uebernimmt sie die GESAMTE Seite (kein Kopf/Tabs/Statistik).
  if (klausur) { klausurRender(m); return; }
  var pool = POOL.filter(istUnterricht);
  /* Kopf: Erklaerung + optionaler Klausur-Countdown. Eigener Name (klausurTermin statt klausur!),
     weil `klausur` ab jetzt die laufende M09-Klausursimulation meint (Modul-Variable oben).
     ⚠️ 2026-08-04: Der Termin stand als `new Date(2026, 6, 31)` HART hier und als Datum im Text
     `TEXTE.unterricht.countdownPrefix`. Nach der Klausur zeigte der Kopf dauerhaft
     „Klausur am 31.07.2026 (liegt zurück)". Jetzt steht der Termin an EINER Stelle
     (KLAUSUR_TERMIN in app_state.js) und ist `null`, solange keiner bekannt ist – dann faellt die
     Zeile ganz weg und der Kicker traegt den Kopf allein (Nutzer-Entscheid 04.08.).
     ►► FUER DIE NAECHSTE KLAUSUR genuegt dort ein Datum, z. B. `new Date(2027, 0, 15)`. */
  var cd = "";
  if (KLAUSUR_TERMIN) {
    var tage = Math.ceil((KLAUSUR_TERMIN.getTime() - heute()) / L.TAG_MS);
    cd = TEXTE.unterricht.countdownPrefix.replace("{datum}",
      KLAUSUR_TERMIN.toLocaleDateString("de-DE")) +
      (tage > 0 ? TEXTE.unterricht.countdownTage.replace("{n}", tage)
        : tage === 0 ? TEXTE.unterricht.countdownHeute : TEXTE.unterricht.countdownVorbei);
  }
  /* ⚠️ 2026-07-30: Der lange Erklaerungsabsatz stand fest im Kopf und stoerte bei jeder Frage.
     Jetzt: Kicker und Countdown bleiben (eine Zeile, Seitenidentitaet), der Absatz wandert in
     ein statPanel. Standard OFFEN, solange in diesem Bereich noch keine Frage beantwortet
     wurde - danach eingeklappt. Ein manueller Klick uebersteuert das dauerhaft. */
  var kopf = el("<div class='panel'><div class='kicker'>" + TEXTE.unterricht.kicker + "</div>" +
    (cd ? "<h2 class='u-border-none u-margin-4px-0-4px' >" + esc(cd) + "</h2>" : "") + "</div>");
  /* FB-R1.9: eigener Zurueck-Knopf. Am Handy ist die Seitenleiste eingeklappt, und der Bereich hat
     mit Üben/Spickzettel/Klausur drei Unteransichten – ohne diesen Knopf war der Weg zurueck zur
     Startseite nicht sichtbar. Fuehrt bewusst auf "start", nicht per history.back(). */
  var zurueck = el("<button class='b leise unterricht-zurueck u-margin-bottom-8px' >" + TEXTE.unterricht.zurueckStart + "</button>");
  zurueck.onclick = function(){ gotoSeite("start"); };
  m.appendChild(zurueck);
  m.appendChild(kopf);
  var schonGeuebt = !!(S.statistik && S.statistik.M09 && S.statistik.M09.gesamt);
  var infoP = statPanel("unterricht-info", TEXTE.unterricht.infoTitel, !schonGeuebt);
  infoP.appendChild(el("<div class='hinweis'>" + esc(TEXTE.unterricht.erklaerung) + "</div>"));
  m.appendChild(infoP);
  if (!pool.length) { m.appendChild(el("<div class='panel'><i>" + TEXTE.unterricht.keineFragen + "</i></div>")); return; }
  /* Zwei Ansichten: Üben und Spickzettel (Ausbaustufe 2, 2026-07-20). Der Spickzettel liegt in
     einer EIGENEN Datei (spickzettel_m09.js) und einer eigenen Ansicht – der AP1-Spickzettel unter
     „Spickzettel“ bleibt unberührt, weil er ausdrücklich AP1-Stoff abgrenzt. */
  var tabBeschriftung = { ueben: TEXTE.unterricht.tabUeben, spick: TEXTE.unterricht.tabSpick, klausur: TEXTE.unterricht.tabKlausur };
  var tabs = el("<div class='zeile u-margin-2px-0-8px' style='gap:8px'></div>");
  ["ueben", "klausur"].forEach(function(t){
    var b = el("<button class='b" + (unterrichtTab === t ? " gelb" : " leise") + "'>" + tabBeschriftung[t] + "</button>");
    b.onclick = function(){ unterrichtTab = t; render(); };
    tabs.appendChild(b);
  });
  m.appendChild(tabs);
  // clearAktion: sonst bliebe die Aktionsleiste („Prüfen“/„Weiter“) der zuletzt gezeigten Frage
  // über der Spickzettel-/Klausur-Ansicht stehen.
  if (unterrichtTab === "klausur") { clearAktion(); unterrichtKlausurView(m); return; }
  // Eigene Statistik (E-U3): Gesamt + je Thema, aus S.statistik.M09 / T:M09:*.
  // Als eigene Zeichenfunktion, damit sie NACH JEDER ANTWORT aktualisiert werden kann
  // (UX-Feinschliff 2026-07-20) – nicht erst beim erneuten Betreten der Seite.
  /* FB-R1.6: aufklappbar, startet zugeklappt. Der Inhalt liegt in einem eigenen Rumpf-Element –
     frueher setzte zeichneStatistik() statP.innerHTML, das wuerde die <summary>-Zeile mitloeschen. */
  var statP = statPanel("stat-m09", TEXTE.unterricht.statTitel);
  var statBody = el("<div></div>"); statP.appendChild(statBody);
  function zeichneStatistik() {
    statBody.innerHTML = "";
    var st = S.statistik.M09;
    if (!st || !st.gesamt) { statBody.appendChild(el("<div class='hinweis'>" + TEXTE.unterricht.nochKeineAntworten + "</div>")); return; }
    statBody.appendChild(el("<div class='stat-mini'><span>Beantwortet <b>" + st.gesamt + "</b></span><span>Trefferquote <b>" + Math.round(st.richtig / st.gesamt * 100) + " %</b></span></div>"));
    var themen = {}; pool.forEach(function(f){ themen[f.thema] = 1; });
    Object.keys(themen).sort().forEach(function(th){
      var e = S.statistik["T:M09:" + th];
      if (!e || !e.gesamt) return;
      var q = Math.round(e.richtig / e.gesamt * 100);
      statBody.appendChild(el("<div class='u-margin-6px-0 u-font-size-86rem' >" + esc(th) + " <span class='hinweis'>" + e.richtig + "/" + e.gesamt + "</span><div class='balken'><div style='width:" + q + "%'></div></div></div>"));
    });
  }
  zeichneStatistik();
  m.appendChild(statP);
  // Themenfilter – zieht SOFORT eine passende Frage (UX-Feinschliff 2026-07-20), nicht erst die naechste
  var themenListe = {}; pool.forEach(function(f){ themenListe[f.thema] = 1; });
  var sel = el("<select class='b leise'><option value=''>" + TEXTE.unterricht.alleThemen + "</option>" +
    Object.keys(themenListe).sort().map(function(th){ return "<option" + (unterrichtThema === th ? " selected" : "") + ">" + esc(th) + "</option>"; }).join("") + "</select>");
  /* Themenwechsel leert den Verlauf (Nutzer-Entscheid 30.07., wie sUeben bei Filterwechsel):
     sonst blaettert man zurueck in Fragen eines Themas, das gerade abgewaehlt wurde. */
  sel.onchange = function(){ unterrichtThema = sel.value; unterrichtVerlauf = []; unterrichtIdx = -1; unterrichtZiehe(); };
  var zf = el("<div class='zeile u-margin-2px-0-8px' ></div>"); zf.appendChild(sel);
  m.appendChild(zf);
  // Verlaufsleiste (← Zurück / Weiter → / „Frage n / m") ueber der Frage – wie #uebennav im AP1-Flow
  m.appendChild(el("<div class='zeile u-margin-bottom-8px' id='unterrichtnav' ></div>"));
  // Frage-Bereich
  var qa = el("<div></div>"); m.appendChild(qa);
  /* 2026-07-30: qa und die Statistik-Neuzeichnung sind seiten-lokal, unterrichtZiehe/-Render
     stehen auf Modulebene (sonst waeren sie weder vom Zurueck-Knopf noch von einem Test
     erreichbar). Deshalb die beiden Referenzen hier hinterlegen. */
  unterrichtQa = qa; unterrichtStatZeichnen = zeichneStatistik;
  unterrichtVerlauf = []; unterrichtIdx = -1;   // frischer Verlauf beim Betreten (wie sUeben)
  unterrichtZiehe();
}
/* Zieht die naechste Frage, schreibt ALLE Sperren fort und haengt sie ans Verlaufsende.
   Der einzige Weg, auf dem sich der Zustand der Klausurvorbereitung veraendert. */
function unterrichtZiehe() {
  var qa = unterrichtQa;
  if (!qa) return;
  unterrichtZaehler++;
  var f = null;
  // Dezente Wiedervorlage: jede fdEinstreuung-te Frage kommt aus dem Fehler-Deck (gleicher Takt
  // wie im AP1-Ueben). hinweisFD blendet die vorhandene „Wiedervorlage"-Markierung ein.
  var due = dueUnterricht();
  if (unterrichtZaehler % APP_CONFIG.fdEinstreuung === 0 && due.length) {
    f = Object.assign({}, L.instanziiere(frageById(L.pick(due))), { hinweisFD: true });
  }
  if (!f) {
    var ids = kandidatenUnterricht();
    // Kein frischer Kandidat, aber eine faellige Karte? Dann die zeigen, statt nichts.
    if (!ids.length && due.length) {
      f = Object.assign({}, L.instanziiere(frageById(L.pick(due))), { hinweisFD: true });
    } else if (!ids.length) {
      qa.innerHTML = "<div class='panel'><i>" + TEXTE.hinweis.keineFragenGewaehlterFilter + "</i></div>"; clearAktion();
      var navLeer = document.getElementById("unterrichtnav");
      if (navLeer) navLeer.innerHTML = "";   // sonst bliebe „Frage n / m" ueber dem Leerzustand stehen
      return;
    } else {
      /* ⚠️ 2026-07-30: Statt L.pick() jetzt L.deckPick mit EIGENEM Deck (S.seenUnterricht).
         L.pick zog rein zufaellig; die Sperre der letzten 10 verhinderte nur die direkte
         Wiederholung. Gemessen (30 Simulationen, 60 Aufgaben): 7 Wiederholungen, erste nach
         Aufgabe 34, nur 53 von 121 Fragen gesehen. deckPick zieht ausschliesslich aus noch
         NICHT gesehenen Fragen und mischt erst neu, wenn das Deck leer ist - dieselbe Mechanik,
         die der AP1-Flow ueber S.seen seit jeher nutzt. */
      var rU = L.deckPick(ids, S.seenUnterricht, unterrichtZuletzt, null, null);
      if (!rU.id) { f = L.instanziiere(frageById(L.pick(ids))); }   // Sicherheitsnetz
      else {
        mutS(function(s){ s.seenUnterricht = rU.seen; s.seenUnterricht[rU.id] = true; }, false);
        f = L.instanziiere(frageById(rU.id));
      }
    }
  }
  /* ⚠️⚠️ 2026-07-30 NUTZER-BEFUND: "ich hatte gerade 2mal die gleiche frage hintereinander".
     ⚠️ DIE URSACHE IST NICHT BELEGT. Alle drei Wege wurden geprueft: kandidatenUnterricht filtert
     die letzten 10 heraus, dueUnterricht ebenso, und 4000 simulierte Ziehungen ergaben 0 direkte
     Wiederholungen. Auch Textdubletten im Pool wurden ausgeschlossen (0 identische, 0 mit
     Jaccard >= 0,70). Verbleibende Verdachtsmomente, die eine Simulation NICHT abdeckt: ein
     Neu-Rendern der Seite mit zweitem naechste()-Aufruf, oder Wischleiste und Weiter-Knopf, die
     beide feuern.
     ►► DESHALB EINE SPERRE AM ENDE DER KETTE STATT EINER VERMUTUNG: Wenn die gezogene Frage die
     unmittelbar vorige ist, wird EINMAL neu gezogen. Das schliesst den Fall unabhaengig davon,
     welcher Weg ihn verursacht - und kostet nichts, weil die Bedingung normal nie zutrifft.
     Der Nachziehversuch ist bewusst auf EINEN begrenzt: eine Schleife koennte bei einem Pool mit
     nur einer passenden Frage haengen. */
  /* ⚠️⚠️ 2026-08-24 REPARIERT (Nutzer-Entscheid): Die Sperre zog den Ersatz IMMER aus
     kandidatenUnterricht() – also aus den NORMALEN Fragen. Traf die Wiedervorlage zufaellig
     genau die zuletzt gezeigte Karte, wurde sie damit DEGRADIERT: der Einstreu-Takt war
     verbraucht, `hinweisFD` weg, die faellige Karte kam erst fuenf Fragen spaeter wieder.
     Gefunden ueber `test_unterricht`, das dadurch in 3 von 32 Laeufen rot war.
     ►► JETZT: War die Frage eine Wiedervorlage, wird zuerst eine ANDERE FAELLIGE Karte
     versucht. Erst wenn das Deck keine zweite hergibt, geht es auf normale Kandidaten.
     Der Nachziehversuch bleibt bewusst auf EINEN begrenzt (s. Kommentar oben). */
  if (unterrichtLetzteId && f.id === unterrichtLetzteId) {
    var ersatz = null;
    if (f.hinweisFD) {
      var andereFaellig = due.filter(function(id){ return id !== unterrichtLetzteId; });
      if (andereFaellig.length) {
        ersatz = Object.assign({}, L.instanziiere(frageById(L.pick(andereFaellig))), { hinweisFD: true });
      }
    }
    if (!ersatz) {
      var zweit = kandidatenUnterricht().filter(function(id){ return id !== unterrichtLetzteId; });
      if (zweit.length) ersatz = L.instanziiere(frageById(L.pick(zweit)));
    }
    if (ersatz) f = ersatz;
  }
  unterrichtLetzteId = f.id;
  unterrichtZuletzt.push(f.id); if (unterrichtZuletzt.length > 10) unterrichtZuletzt.shift();
  unterrichtLetzterTyp = typVon(f); unterrichtLetztesThema = f.thema;   // 2026-07-30, s. kandidatenUnterricht
  /* Auch eine Wiedervorlage aus dem Fehler-Deck belegt ihren Rundenplatz - sie gibt dem
     Thema ja Sendezeit. indexOf verhindert Doppeleintraege. */
  if (f.thema && unterrichtThemenRunde.indexOf(f.thema) === -1) unterrichtThemenRunde.push(f.thema);
  unterrichtVerlauf.push(f); unterrichtIdx = unterrichtVerlauf.length - 1;
  unterrichtRender();
}
/* Zeigt die Frage an unterrichtIdx samt Verlaufsleiste. Fasst KEINE Sperre an – wer hier eine
   Zuweisung an unterrichtZaehler/seenUnterricht/unterrichtZuletzt/LetzteId/ThemenRunde/LetzterTyp/
   LetztesThema ergaenzt, macht aus dem Blaettern wieder ein Ziehen. Siehe Kopf oben.
   „Live" = neueste, noch unbeantwortete Frage: nur die bucht Statistik und Fehler-Deck. */
function unterrichtRender() {
  var qa = unterrichtQa;
  if (!qa) return;
  var f = unterrichtVerlauf[unterrichtIdx];
  if (!f) return;
  var live = (unterrichtIdx === unterrichtVerlauf.length - 1) && !f._beantwortet;
  macheVerlaufNav(document.getElementById("unterrichtnav"), unterrichtIdx, unterrichtVerlauf.length, live,
    function(ziel){ unterrichtIdx = ziel; unterrichtRender(); });
  loeseFrage(f, qa, {
    onGraded: function(korrekt, extra){
      if (!live) return;                       // Wiederholung aus dem Verlauf: keine erneute Buchung
      f._beantwortet = true;
      verbucheAntwort(f, korrekt, extra);
      if (unterrichtStatZeichnen) unterrichtStatZeichnen();
    },
    onNext: function(){
      if (unterrichtIdx < unterrichtVerlauf.length - 1) { unterrichtIdx++; unterrichtRender(); }  // erst vorwaerts durch den Verlauf
      else unterrichtZiehe();                                                                     // am Ende: neue Frage ziehen
    }
  });
  qa.appendChild(macheWischLeiste(
    unterrichtIdx > 0 ? function(){ unterrichtIdx--; unterrichtRender(); } : null,
    function(){ if (unterrichtIdx < unterrichtVerlauf.length - 1) { unterrichtIdx++; unterrichtRender(); } else if (f._beantwortet) unterrichtZiehe(); }
  ));
}

/* ---- Fehler-Deck ---- */
function sFehlerdeck(m) {
  var due = L.fdDue(S.fehlerDeck, heute()).filter(frageById);
  var gesamt = Object.keys(S.fehlerDeck).filter(frageById).length;
  var p = el("<div class='panel'><h2>" + TEXTE.fehlerdeck.h2 + "</h2><div class='hinweis'>" + TEXTE.fehlerdeck.hinweis + "</div><div class='u-margin-8px-0' >Im Deck: <b>" + gesamt + "</b> · davon fällig: <b>" + due.length + "</b></div></div>");
  m.appendChild(p);
  if (!due.length) { p.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.nichtsFaelligDeck + "</div>")); return; }
  var qa = el("<div></div>"); m.appendChild(qa);
  var rest = L.shuffle(due);
  (function zeige() {
    if (!rest.length) { qa.innerHTML = "<div class='panel'><b>" + TEXTE.hinweis.fertigFaelligeFragen + "</b></div>"; renderNav(); clearAktion(); return; }
    var f = L.instanziiere(frageById(rest.pop()));
    var beantwortet = false;
    loeseFrage(f, qa, {
      onGraded: function(korrekt, extra){ beantwortet = true; verbucheAntwort(f, korrekt, extra); },
      onNext: zeige
    });
    qa.appendChild(macheWischLeiste(null, function(){ if (beantwortet) zeige(); }));  // #54: nur vor, nach Antwort
  })();
}

/* ---- #46 Markierte Fragen (Lesezeichen) ---- */
function markierteIds() {
  /* istUnterricht-Ausnahme (2026-07-20): passtAP schliesst M09 aus der Zufallsauswahl aus,
     aber selbst MARKIERTE Unterrichts-Fragen sollen hier sichtbar bleiben. */
  return Object.keys(S.markiert).filter(function(id){ var f = frageById(id); return f && (passtAP(f) || istUnterricht(f)); });
}
function sMarkiert(m) {
  var ids = markierteIds();
  var p = el("<div class='panel'><h2>" + TEXTE.markiert.h2 + "</h2><div class='hinweis'>" + TEXTE.markiert.hinweis + "</div><div class='u-margin-8px-0' >Markiert (im aktuellen Prüfungsteil-Filter): <b>" + ids.length + "</b></div></div>");
  m.appendChild(p);
  if (!ids.length) { p.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.nochNichtsMarkiert + "</div>")); return; }
  var qa = el("<div></div>");
  var ueb = el("<button class='b gelb u-margin-top-6px' >Markierte üben (" + ids.length + ")</button>");
  ueb.onclick = function(){
    var rest = L.shuffle(ids.slice());
    (function zeige(){
      if (!rest.length) { qa.innerHTML = "<div class='panel'><b>" + TEXTE.hinweis.fertigMarkierteFragen + "</b></div>"; renderNav(); clearAktion(); return; }
      var f = L.instanziiere(frageById(rest.pop()));
      var beantwortet = false;
      loeseFrage(f, qa, { onGraded: function(korrekt, extra){ beantwortet = true; verbucheAntwort(f, korrekt, extra); }, onNext: zeige });
      qa.appendChild(macheWischLeiste(null, function(){ if (beantwortet) zeige(); }));  // #54: nur vor, nach Antwort
    })();
  };
  p.appendChild(ueb);
  m.appendChild(qa);
  var liste = el("<div class='panel'><div class='kicker'>" + TEXTE.markiert.uebersicht + "</div></div>");
  ids.forEach(function(id){
    var f = frageById(id);
    var zeile = el("<div class='u-display-flex u-gap-10px u-align-items-center u-justify-content-space-between u-margin-6px-0' ></div>");
    zeile.appendChild(el("<span style='font-size:.88rem' >" + esc(modulName(f.modul)) + " · " + esc(f.thema) + " – " + esc((f.frage || "").slice(0, 80)) + "</span>"));
    var rm = el("<button class='b leise'>" + TEXTE.aktion.entfernen + "</button>");
    rm.onclick = function(){ mutS(function(s){ delete s.markiert[id]; }); render(); };
    zeile.appendChild(rm); liste.appendChild(zeile);
  });
  m.appendChild(liste);
}

/* ---- Rechen-Generator ---- */
function sGenerator(m) {
  var p = el("<div class='panel'><h2>" + TEXTE.generator.h2 + "</h2><div class='hinweis'>" + TEXTE.generator.hinweis + "</div><div class='zeile u-margin-top-10px' ></div></div>");
  var z = p.querySelector(".zeile");
  var arten = Object.keys(L.GENERATOREN).filter(function(a){ return a !== "netzplan"; });
  arten.concat(["zufall"]).forEach(function(a){
    var name = a==="zufall" ? TEXTE.aktion.zufaellig : L.GENERATOREN[a].name;
    var b = el("<button class='b " + (a==="zufall"?"gelb":"leise") + "'>" + name + "</button>");
    b.onclick = function(){ zeigeGen(a==="zufall" ? L.pick(arten) : a); };
    z.appendChild(b);
  });
  var nb = el("<button class='b leise'>" + TEXTE.aktion.netzplanTrainingOeffnen + "</button>");
  nb.onclick = function(){ gotoSeite("netzplan"); };
  z.appendChild(nb);
  m.appendChild(p);
  var qa = el("<div class='panel' id='genqa'><i>" + TEXTE.generator.aufgabentypWaehlen + "</i></div>");
  m.appendChild(qa);
  function zeigeGen(art) {
    var g = L.GENERATOREN[art].fn();
    qa.innerHTML = "";
    qa.appendChild(el("<div class='meta'><span class='tag'>" + L.GENERATOREN[art].name + "</span>" + (g.hinweis ? "<span class='tag'>" + esc(g.hinweis) + "</span>" : "") + "</div>"));
    qa.appendChild(el("<div class='frage-text'>" + esc(g.frage) + "</div>"));
    var inputs = [];
    var akzListen = g.antwort2 || [g.antwort];
    akzListen.forEach(function(_, i){
      var reihe = el("<div class='u-margin-top-8px' >Antwort " + (akzListen.length>1 ? (i+1) : "") + ": </div>");
      var inp = el("<input class='luecke' style='width:190px'  autocomplete='off'>");
      inputs.push(inp); reihe.appendChild(inp); qa.appendChild(reihe);
    });
    var pb = el("<button class='b gelb u-margin-top-10px' >" + TEXTE.aktion.pruefenKurz + "</button>");
    pb.onclick = function(){
      pb.disabled = true;
      var alleOk = true;
      inputs.forEach(function(inp, i){
        var ok = L.gradeLuecke(akzListen[i].map(String), inp.value);
        inp.style.borderBottomColor = ok ? "var(--gruen)" : "var(--rot)"; inp.disabled = true;
        if (!ok) alleOk = false;
      });
      var fb = el("<div class='fb " + (alleOk?"ok":"nein") + "'><b>" + (alleOk ? TEXTE.feedback.richtig : "Nicht ganz – richtige Lösung: " + akzListen.map(function(a){return esc(a[0]);}).join(" · ")) + "</b></div>");
      qa.appendChild(fb);
      var d = el("<details class='lang' open><summary>" + TEXTE.hinweis.loesungswegSchritt + "</summary><div class='u-margin-top-8px' >" + g.weg.map(esc).join("<br>") + "</div></details>");
      qa.appendChild(d);
      mutS(function(s){
        var st = s.statistik["GEN:" + g.generator] = s.statistik["GEN:" + g.generator] || { richtig:0, gesamt:0 };
        st.gesamt++; if (alleOk) st.richtig++;
        var k = L.dayKey(heute()); s.dailyCounts[k] = (s.dailyCounts[k]||0) + 1;
      });
      renderKopf();
      var nb = el("<div class='u-margin-top-10px' ><button class='b'>" + TEXTE.aktion.neueAufgabe + "</button></div>");
      nb.querySelector("button").onclick = function(){ zeigeGen(art); };
      qa.appendChild(nb);
    };
    qa.appendChild(pb);
  }
}

/* ---- Prüfungssimulation (AP1-Format: 4 Aufgaben, 100 Punkte, 90 Min) ----
   Aufbau angelehnt an echte AP1-Klausuren (IHK): eine gemeinsame Ausgangs-
   situation, 4 feldübergreifende Aufgaben mit fester Punktzahl. WiSo (M08) ist
   nicht Teil von AP1 und wird ausgeschlossen. */
/* G3.6b (Recherche 2026-07-19): `punkte` ist NUR noch der Rückfallwert. Die echte AP1 vergibt je
   Aufgabe 20–30 Punkte (Summe 100) und zieht den Schwerpunkt zufällig; deshalb wird die Verteilung
   pro Simulationslauf gewürfelt (simPunkte in app_sim.js). Die thematische Zuordnung bleibt fest –
   Nutzer-Entscheid, damit jeder Durchlauf den gesamten Stoff abdeckt. */
/* ⛔ DIE VIER AUFGABEN UND DIE M04-NETZ-THEMEN WOHNEN SEIT 16.09.2026 IN logik.js
   (L.AP1_AUFGABEN, L.M04_NETZ). Sie standen hier - also in der Oberflaeche -, obwohl sie
   Pruefungsordnung sind und nicht Darstellung. Der Neubau liest dieselbe Quelle.
   Die beiden Namen bleiben als kurzer Weg stehen, damit kein Aufrufer sich aendern muss. */
var AP1_AUFGABEN = L.AP1_AUFGABEN;
var M04_NETZ = L.M04_NETZ;
