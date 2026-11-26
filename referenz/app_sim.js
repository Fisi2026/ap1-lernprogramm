"use strict";
/* G3.6b: Punkteverteilung der vier AP1-Aufgaben. Die echte Prüfung vergibt je Aufgabe 20–30 Punkte
   (Summe 100); die früher fest verdrahteten 25/25/26/24 waren nur eine mögliche Ausprägung.
   `simPunkte` gilt für den Startbildschirm und wird bei jedem Betreten neu gezogen. Beim Start
   wird die Verteilung in `sim.punkte` EINGEFROREN, damit Kopfzeile, Aufgaben-Navigation und
   Auswertung garantiert dieselben Werte zeigen wie die Vorschau. */
var simPunkte = AP1_AUFGABEN.map(function(a){ return a.punkte; });
function neuePunkteVerteilung(){
  simPunkte = L.wuerfelPunkte(AP1_AUFGABEN.length, L.CONFIG.ap1PunkteMin, L.CONFIG.ap1PunkteMax, L.CONFIG.ap1PunkteSumme);
  return simPunkte;
}
/* Punkte der Aufgabe bi – während eines Laufs aus dem eingefrorenen sim.punkte, sonst aus simPunkte. */
function punkteFuer(bi){
  var q = (sim && sim.punkte) ? sim.punkte : simPunkte;
  return q[bi] != null ? q[bi] : AP1_AUFGABEN[bi].punkte;
}
/* ⛔ DIE REGEL WOHNT SEIT 16.09.2026 IN logik.js (L.aufgabeVon). Sie stand hier, weil es lange
   nur eine Oberflaeche gab; der Neubau braucht dieselbe Zuordnung, und zwei Fassungen driften.
   Hier bleibt nur der kurze Weg dorthin - alle Aufrufer unten aendern sich dadurch nicht. */
function aufgabeVon(f){ return L.aufgabeVon(f); }
/* ⚠️⚠️ LIEST SEIT 2026-08-27 DIE REGISTRY, NICHT MEHR EINE EIGENE LISTE. Hier stand eine
   hartkodierte Aufzaehlung (mc/lueckentext/zuordnung/dropdown/mehrfach) - eine ZWEITE Liste neben
   L.TYP.simAuto in logik.js, das sich selbst "Eine Quelle der Wahrheit je Aufgabentyp" nennt.
   Die beiden waren auseinandergelaufen: `reihenfolge` steht auf simAuto:true, fehlte hier aber -
   23 AP1-Fragen waren dadurch aus der Pruefungssimulation ausgeschlossen, ohne dass es jemand
   entschieden haette. ►► Zwei Listen fuer dieselbe Sache driften immer, auch im Code.
   ⚠️ Die bild-Aufloesung bleibt: bei typ "bild" entscheidet der unterTyp ueber die Bewertbarkeit. */
function autoBewertbar(f){ return L.simBewertbar(f); }   /* Regel jetzt in logik.js */
/* Kriterium fuer die M09-Klausur (2026-07-21): BREITER als autoBewertbar() oben (das ist die
   AP1-Kaskade der 5 Simulations-Typen). Hier zaehlt jeder Typ mit einer echten grade-Funktion in
   der L.TYP-Registry als automatisch bewertbar - nur "freitext" und "erklaeren" (grade:null)
   fallen raus. Das entspricht den vermessenen 95 von 105 M09-Fragen. */
function m09Bewertbar(f){
  var t = f.typ === "bild" ? (f.unterTyp || "mc") : f.typ;
  var reg = L.TYP[t];
  return !!(reg && typeof reg.grade === "function");
}
/* ⛔ FALLAUFBEREITUNG UND PRUEFUNGSBAU WOHNEN SEIT 16.09.2026 IN logik.js
   (`L.fallFuerSim`, `L.baueAP1Pruefung`). Der Bauer dort ist REIN: Pool, Faelle und das
   Wiederholungs-Gedaechtnis gehen als Parameter hinein, heraus kommen die Fragen und das
   fortgeschriebene Gedaechtnis. **Hier bleibt genau das, was Oberflaeche ist:** woher der Pool
   kommt, wo das Gedaechtnis liegt (S.simUsedIds) und welche Punkteverteilung gerade gilt.
   ⚠️ Das Verhalten ist unveraendert - tests/test_sim.js faehrt weiterhin diesen Weg. */
function fallFuerSim(vermeide){
  var faelle = (typeof FAELLE !== "undefined" && Array.isArray(FAELLE)) ? FAELLE : [];
  return L.fallFuerSim(faelle, vermeide);
}
function buildAP1Exam(anzahl){
  var r = L.baueAP1Pruefung({
    pool: POOL,
    faelle: (typeof FAELLE !== "undefined" && Array.isArray(FAELLE)) ? FAELLE : [],
    benutzt: S.simUsedIds || [],
    anzahl: anzahl,
    punkte: AP1_AUFGABEN.map(function(_, bi){ return punkteFuer(bi); })
  });
  setS('simUsedIds', r.benutzt, false);   // transient: Aufrufer persistiert via speichere()
  return r.fragen;
}
/* M09-Klausursimulation (2026-07-21): eigene Ziehung fuer den Unterrichts-Pool, komplett getrennt
   von buildAP1Exam/simUsedIds. Verteilt `anzahl` Fragen moeglichst GLEICHMAESSIG ueber die
   vorkommenden Themen (Round-Robin ueber gemischte Themen-Toepfe), danach Gesamt-Shuffle.
   Wiederholungs-Gedaechtnis analog buildAP1Exam, aber in S.m09UsedIds. */
function buildM09Klausur(anzahl){
  var basis = POOL.filter(function(f){ return istUnterricht(f) && m09Bewertbar(f); });
  var proThema = {};
  basis.forEach(function(f){ (proThema[f.thema] = proThema[f.thema] || []).push(f); });
  var vermeide = {}; (S.m09UsedIds || []).forEach(function(id){ vermeide[id] = 1; });
  var themenGemischt = L.shuffle(Object.keys(proThema));
  var toepfe = themenGemischt.map(function(th){
    var pool = proThema[th];
    var frisch = L.shuffle(pool.filter(function(f){ return !vermeide[f.id]; }));
    var alt = L.shuffle(pool.filter(function(f){ return vermeide[f.id]; }));
    return frisch.concat(alt);
  });
  var fragen = [], weiter = true;
  while (fragen.length < anzahl && weiter) {
    weiter = false;
    for (var ti = 0; ti < toepfe.length && fragen.length < anzahl; ti++) {
      if (toepfe[ti].length) { fragen.push(toepfe[ti].shift()); weiter = true; }
    }
  }
  fragen = L.shuffle(fragen);
  var neu = fragen.map(function(f){ return f.id; });
  var used = (S.m09UsedIds || []).concat(neu);
  if (used.length > basis.length * 0.7) used = neu;
  setS('m09UsedIds', used, false);   // transient: Aufrufer (Klausur-Start-Button in unterrichtKlausurView, app_seiten.js) persistiert via speichere()
  return fragen.map(function(f){ return L.instanziiere(f); });
}
var sim = null, simLaeuft = false, simTimer = null;
function simAbbrechen(){ if (simTimer) clearInterval(simTimer); simTimer = null; simLaeuft = false; sim = null; }
function sSimulation(m) {
  if (simLaeuft && sim) { renderSimFrage(m); return; }
  neuePunkteVerteilung();   // G3.6b: frische Punkteverteilung für diesen Anlauf (Vorschau == Prüfung)
  var dauerInfo = (S.simDauerMin && S.simDauerMin > 0) ? ("<b>" + S.simDauerMin + " Minuten</b>") : TEXTE.hinweis.simDauerAutomatisch;
  var p = el("<div class='panel'><h2>" + TEXTE.simulation.h2 + "</h2>" +
    "<div class='hinweis'>" + TEXTE.hinweis.simIntroPrefix + dauerInfo + TEXTE.hinweis.simIntroSuffix + "</div></div>");
  p.appendChild(el("<div class='fb ok' style='margin-top:4px' >" + TEXTE.hinweis.simAusgangssituation + "</div>"));
  var uebersicht = "<div class='u-margin-top-10px' ><div class='kicker'>" + TEXTE.simulation.pruefungsaufbau + "</div>";
  AP1_AUFGABEN.forEach(function(a, bi){ uebersicht += "<div class='u-margin-6px-0' ><b>" + a.nr + ". Aufgabe</b> (" + punkteFuer(bi) + " Punkte) – " + esc(a.titel) + "</div>"; });
  uebersicht += "<div class='hinweis u-margin-top-6px' >" + TEXTE.hinweis.ap1PunkteVariieren + "</div>";
  uebersicht += "</div>";
  p.appendChild(el(uebersicht));
  var z = el("<div class='zeile u-margin-top-12px' >" + TEXTE.hinweis.simAufgabenGesamt + "</div>");
  var inp = el("<input style='width:80px' type='number' min='12' max='80' step='4' value='" + S.simAnzahl + "' >");
  inp.setAttribute("aria-label", TEXTE.hinweis.simAufgabenGesamt.replace(/:\s*$/, ""));   // G1.5 #46
  z.appendChild(inp);
  var start = el("<button class='b gelb'>" + TEXTE.aktion.pruefungStarten + "</button>");
  start.onclick = function(){
    setS('simAnzahl', Math.max(12, Math.min(80, +inp.value || 40)), false);   // persist folgt unten via speichere()
    var fragen = buildAP1Exam(S.simAnzahl);
    if (fragen.length < 8) { alert(TEXTE.hinweis.zuWenigeFragen); return; }
    speichere();
    var vorschlagSek = fragen.reduce(function(s, f){ return s + L.metaFuer(f).sek; }, 0);   // #45: Richtwert aus TYP_META
    var dauerMin = (S.simDauerMin && S.simDauerMin > 0) ? S.simDauerMin : Math.max(1, Math.round(vorschlagSek/60));
    sim = { fragen: fragen, antworten: {}, markiert: {}, idx: 0, dauerMin: dauerMin, startTs: Date.now(), restSek: dauerMin*60,
            punkte: simPunkte.slice() };   // G3.6b: Verteilung für diesen Lauf einfrieren
    simLaeuft = true;
    simTimer = setInterval(function(){
      // R3: Wanduhr statt Tick-Zaehlung – gedrosselte Intervalle im Hintergrund-Tab wuerden sonst die
      // Pruefungszeit verlaengern. Ticks koennen dadurch Sekunden ueberspringen (Anzeige folgt der
      // Wanduhr, kein Verhalten haengt an Einzelsekunden). sim.startTs wird beim Start gesetzt.
      sim.restSek = sim.dauerMin*60 - Math.floor((Date.now()-sim.startTs)/1000);
      var t = document.getElementById("simTimer");
      if (t) { t.textContent = Math.floor(sim.restSek/60) + ":" + String(sim.restSek%60).padStart(2,"0"); t.classList.toggle("warn", sim.restSek < 300); }
      if (sim.restSek <= 0) simAbgeben();
    }, 1000);
    render();
  };
  z.appendChild(start); p.appendChild(z);
  p.appendChild(el("<div class='hinweis u-margin-top-6px' >" + TEXTE.hinweis.fragenbasisHinweis + "</div>"));
  m.appendChild(p);
  if (S.simHistorie.length) {
    var h = el("<div class='panel'><h2>" + TEXTE.simulation.historieH2 + "</h2></div>");
    var tr = el("<div class='trend'></div>");
    S.simHistorie.slice(-12).forEach(function(e){
      tr.appendChild(el("<div style='height:" + Math.max(4, e.prozent*0.8) + "px' title='" + datumDE(e.datum) + ": " + e.prozent + " %'><span>" + Math.round(e.prozent) + "</span></div>"));
    });
    h.appendChild(tr);
    h.appendChild(el("<div class='hinweis'>" + S.simHistorie.slice(-5).reverse().map(function(e){ return datumDE(e.datum) + ": " + e.prozent + " % (Note " + e.note + ")"; }).join(" · ") + "</div>"));
    m.appendChild(h);
  }
}
function renderSimFrage(m) {
  m.innerHTML = "";
  var f = sim.fragen[sim.idx];
  var akt = AP1_AUFGABEN[aufgabeVon(f)];
  var kopf = el("<div class='panel'><div class='zeile u-justify-content-space-between' ><span class='timer' id='simTimer'>" + Math.floor(sim.restSek/60) + ":" + String(sim.restSek%60).padStart(2,"0") + "</span>" +
    "<span class='hinweis'>Frage " + (sim.idx+1) + " / " + sim.fragen.length + "</span></div>" +
    "<div class='kicker u-margin-top-8px' >" + akt.nr + ". Aufgabe · " + punkteFuer(aufgabeVon(f)) + " Punkte</div>" +
    "<div class='u-font-family-var-f-display u-font-weight-600 u-color-var-ink900' >" + esc(akt.titel) + "</div></div>");
  m.appendChild(kopf);
  var navP = el("<div class='panel'></div>");
  AP1_AUFGABEN.forEach(function(a, bi){
    var idxs = [];
    sim.fragen.forEach(function(ff, i){ if (aufgabeVon(ff) === bi) idxs.push(i); });
    if (!idxs.length) return;
    navP.appendChild(el("<div class='kicker u-margin-8px-0-4px' >" + a.nr + ". Aufgabe (" + punkteFuer(bi) + " P)</div>"));
    var grid = el("<div class='simgrid'></div>");
    idxs.forEach(function(i){
      var b = el("<button></button>"); b.textContent = i+1;
      if (sim.antworten[i] != null) b.classList.add("beantwortet");
      if (sim.markiert[i]) b.classList.add("markiert");
      if (i === sim.idx) b.classList.add("aktuell");
      b.onclick = function(){ sim.idx = i; render(); };
      grid.appendChild(b);
    });
    navP.appendChild(grid);
  });
  m.appendChild(navP);
  if (f.fallSzenario) m.appendChild(el("<div class='panel u-border-left-4px-solid-var-gelb' ><div class='kicker'>Fallaufgabe</div><div class='u-font-family-var-f-display u-font-weight-600 u-color-var-ink900 u-margin-2px-0-6px' >" + esc(f.fallTitel) + "</div><div class='hinweis'>" + esc(f.fallSzenario) + "</div></div>"));
  var qa = el("<div class='panel'></div>");
  renderFrage(f, qa, function(){}, {
    simulation: true,
    antwortVor: sim.antworten[sim.idx],
    antwortRein: function(a){ sim.antworten[sim.idx] = a; }
  });
  m.appendChild(qa);
  var fuss = el("<div class='panel zeile'></div>");
  var zurueck = el("<button class='b leise'>" + TEXTE.aktion.zurueckKurz + "</button>");
  zurueck.disabled = sim.idx === 0;
  zurueck.onclick = function(){ sim.idx--; render(); };
  var mark = el("<button class='b leise'>" + (sim.markiert[sim.idx] ? TEXTE.aktion.markierungEntfernen : TEXTE.aktion.spaeterPruefen) + "</button>");
  mark.onclick = function(){ sim.markiert[sim.idx] = !sim.markiert[sim.idx]; render(); };
  var weiter = el("<button class='b'>" + TEXTE.aktion.weiterKurz + "</button>");
  weiter.disabled = sim.idx === sim.fragen.length - 1;
  weiter.onclick = function(){ sim.idx++; render(); };
  var abgabe = el("<button class='b gelb u-margin-left-auto' >" + TEXTE.aktion.abgeben + "</button>");
  abgabe.onclick = function(){ if (confirm(TEXTE.simulation.wirklichAbgeben)) simAbgeben(); };
  [zurueck, mark, weiter, abgabe].forEach(function(b){ fuss.appendChild(b); });
  m.appendChild(fuss);
}
function simAbgeben() {
  clearInterval(simTimer); simTimer = null; simLaeuft = false;
  var zeitSek = Math.max(0, (sim.dauerMin ? sim.dauerMin*60 : 90*60) - Math.max(0, sim.restSek));   // #45: benötigte Zeit
  /* #79/2026-07-21: zentrale Bewertung ueber L.gradeSim (Registry-Dispatch) statt einer eigenen
     if-Kaskade fuer nur 5 Typen. Deckt dadurch automatisch auch die M09-Klausur ab, deren Pool
     weitere automatisch bewertbare Typen enthaelt (siehe m09Bewertbar). */
  var korrekt = sim.fragen.map(function(f, i){ return L.gradeSim(f, sim.antworten[i]); });
  var erg = L.simErgebnis(sim.fragen, korrekt);
  mutS(function(s){
    /* ⛔ Teilaufgaben einer Fallaufgabe NICHT ins Fehler-Deck (16.09.2026): ihre
       Kennungen stehen in keinem Pool, die Ziehung findet sie nie wieder, und sie
       blieben als unaufloesbare Eintraege liegen. Gefunden im Rauchtest des
       Neubaus, der solche Eintraege ausweist. */
    sim.fragen.forEach(function(f, i){ if (!korrekt[i] && !L.istFallTeil(f)) L.fdOnWrong(s.fehlerDeck, f.id, heute()); });
    s.simHistorie.push({ datum: L.dayKey(heute()), prozent: erg.prozent, note: erg.note.note, punkte: erg.punkte, gesamt: erg.gesamt, zeitSek: zeitSek });
  });
  var m = document.getElementById("main"); m.innerHTML = "";
  var p = el("<div class='panel'><h2>" + TEXTE.simulation.auswertungH2 + "</h2></div>");
  p.appendChild(el("<div class='karten'>" +
    "<div class='karte'><div class='gross'>" + erg.punkte + " / " + erg.gesamt + "</div>" + TEXTE.simulation.punkte + "</div>" +
    "<div class='karte'><div class='gross'>" + erg.prozent + " %</div>" + TEXTE.simulation.ergebnis + "</div>" +
    "<div class='karte'><div class='gross'>Note " + erg.note.note + "</div>" + erg.note.text + "</div>" +
    "<div class='karte'><div class='gross' style='color:var(--" + (erg.note.bestanden ? "gruen" : "rot") + ")'>" + (erg.note.bestanden ? TEXTE.simulation.bestanden : TEXTE.simulation.nicht) + "</div>" + (erg.note.bestanden ? TEXTE.simulation.bestanden : TEXTE.simulation.nichtBestanden) + TEXTE.simulation.abFuenfzig + "</div></div>"));
  p.appendChild(el("<div class='hinweis u-margin-top-8px' >" + TEXTE.hinweis.ihkNotenschluessel + "</div>"));
  p.appendChild(el("<div class='hinweis'>Benötigte Zeit: <b>" + Math.floor(zeitSek/60) + ":" + String(zeitSek%60).padStart(2,"0") + "</b> von " + (sim.dauerMin || 90) + ":00 Min.</div>"));
  var proA = "<h3>" + TEXTE.simulation.ergebnisProAufgabe + "</h3>";
  AP1_AUFGABEN.forEach(function(a, bi){
    var rc = 0, ge = 0;
    sim.fragen.forEach(function(f, i){ if (aufgabeVon(f) === bi) { ge++; if (korrekt[i]) rc++; } });
    if (!ge) return;
    var aPkt = punkteFuer(bi);
    var q = Math.round(rc / ge * 100), pkt = Math.round(aPkt * rc / ge);
    proA += "<div class='u-margin-8px-0' ><b>" + a.nr + ". Aufgabe</b> – " + esc(a.titel) + "<br><span class='hinweis'>" + rc + "/" + ge + " richtig · " + pkt + " / " + aPkt + " Punkte (" + q + " %)</span><div class='balken'><div style='width:" + q + "%'></div></div></div>";
  });
  p.appendChild(el("<div>" + proA + "</div>"));
  m.appendChild(p);
  var d = el("<div class='panel'><h2>" + TEXTE.simulation.alleFragenUeberblick + "</h2><div class='hinweis'>" + TEXTE.simulation.falscheFragenUebernommen + "</div></div>");
  sim.fragen.forEach(function(f, i){
    var box = el("<details class='u-margin-8px-0' ><summary>" + (korrekt[i] ? TEXTE.simulation.richtigTag : TEXTE.simulation.falschTag) + " Frage " + (i+1) + " – " + esc(f.thema) + "</summary></details>");
    var inhalt = el("<div class='u-margin-8px-0-4px' ></div>");
    inhalt.appendChild(el("<div class='frage-text'>" + esc(f.frage) + "</div>"));
    var a = sim.antworten[i];
    var iTyp = f.typ === "bild" ? f.unterTyp : f.typ;
    // #79/2026-07-21: FALLBACK fuer alle Typen jenseits der 5 AP1-Sim-Typen (z. B. M09-Klausur-
    // Fragen wie reihenfolge/mtf/kreuztabelle/...). Bekannt bleibt das Verhalten fuer die 5 Typen
    // IDENTISCH; fuer alles andere entfaellt nur die "Deine Antwort/Richtig"-Zeile (kein Zugriff auf
    // typ-spezifische Felder wie f.paare/f.optionen -> kein Fehler, kein "undefined" im Text).
    var bekannterTyp = (iTyp === "mc" || iTyp === "lueckentext" || iTyp === "zuordnung" || iTyp === "dropdown" || iTyp === "mehrfach");
    if (bekannterTyp) {
      var deine = "–";
      if (a != null) {
        if (iTyp === "mc") deine = f.optionen[a];
        else if (iTyp === "lueckentext") deine = a.join(" · ");
        else if (iTyp === "zuordnung") deine = Object.keys(a).map(function(k){ return f.paare[k][0] + "→" + f.paare[a[k]][1]; }).join("; ");
        else if (iTyp === "dropdown") deine = a.map(function(oi, ii){ return oi >= 0 && f.luecken[ii] ? f.luecken[ii].optionen[oi] : "–"; }).join(" · ");
        else if (iTyp === "mehrfach") deine = a.map(function(oi){ return f.optionen[oi]; }).join("; ");
      }
      var richtig = iTyp === "mc" ? f.optionen[f.loesungIndex] :
                    iTyp === "lueckentext" ? f.luecken.map(function(l){return l[0];}).join(" · ") :
                    iTyp === "dropdown" ? f.luecken.map(function(l){ return l.optionen[l.loesung]; }).join(" · ") :
                    iTyp === "mehrfach" ? f.loesungIndizes.map(function(oi){ return f.optionen[oi]; }).join("; ") :
                    f.paare.map(function(pp){ return pp[0] + "→" + pp[1]; }).join("; ");
      inhalt.appendChild(el("<div class='u-margin-top-6px' >" + TEXTE.simulation.deineAntwortLabel + esc(deine) + TEXTE.simulation.richtigLabel + esc(richtig) + "</div>"));
    }
    inhalt.appendChild(el("<div class='hinweis u-margin-top-4px' >" + esc(f.erklaerungKurz) + (f.verweis ? " (Siehe " + esc(f.verweis) + ")" : "") + "</div>"));
    box.appendChild(inhalt);
    d.appendChild(box);
  });
  m.appendChild(d);
  var wb = el("<div class='panel'><button class='b gelb'>" + TEXTE.aktion.zurStartseite + "</button></div>");
  wb.querySelector("button").onclick = function(){ sim = null; gotoSeite("start"); };
  m.appendChild(wb);
  sim = null;
  renderNav(); renderKopf();
}

/* ---- Interaktiver Netzplan (FAZ/FEZ/SAZ/SEZ/GP/FP direkt in den Knoten) ---- */
var npAufgabe = null;
