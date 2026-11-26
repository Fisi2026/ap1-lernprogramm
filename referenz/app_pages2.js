"use strict";
/* =================== Seiten, Teil 2 ===================
   ORIENTIERUNG (30.07.2026). Diese Datei hatte bis heute GAR KEINEN Kopf – sie begann direkt mit
   der ersten Funktion. Zusammen mit app_seiten.js ist sie der Grund, warum das Suchen einer Seite
   am 30.07. rund zehn Aufrufe gekostet hat.

   ⚠️⚠️ DER NAME „pages2" SAGT NICHTS ÜBER DEN INHALT. **Die Aufteilung zwischen app_seiten.js und
   dieser Datei ist HISTORISCH gewachsen, nicht thematisch.** Es gibt keine Regel, an der man
   ablesen könnte, welche Seite wo liegt – sEinstellungen steht hier, sStart drüben, und beim
   Schreiben des Kopfes von app_seiten.js war genau das die eine Fehlannahme, die auffiel.
   ►►► **WER EINE SEITE SUCHT, RÄT NICHT, SONDERN GREPPT:** `grep -n "^function s[A-Z]" app_*.js`

   HIER LIEGEN (Einstieg jeweils die s*-Funktion):
     sNetzplan ......... Netzplan-Generator · sGantt + zeichneGantt (Gantt-Diagramm)
     sGlossar .......... mit glossarBegriffeView und glossarAbkView
     sSpickzettel ...... AP1-Spickzettel (der M09-Spickzettel liegt in app_seiten.js,
                         unterrichtSpickView, gegen SPICKZETTEL_M09)
     sSerie ............ 5er-Serie
     sStatistik ........ mit stufenVorschauPanel
     sEinstellungen .... ⚠️ Diese Seite vermutet man in app_seiten.js. Sie ist hier.

   ⚠️ MARKDOWN-HELFER MIT WEITEM WIRKUNGSKREIS: mdToHtml (mit mdInline/mdTabelle) ist hier
   definiert, wird aber AUCH aus app_seiten.js benutzt (unterrichtSpickView). Wer daran etwas
   ändert, ändert die Darstellung BEIDER Spickzettel. Gemessen, nicht vermutet:
   `grep -l "\bmdToHtml(" app_*.js`. Alles andere hier (mdInline, mdTabelle, zeichneGantt,
   glossarBegriffeView, glossarAbkView, stufenVorschauPanel) wird nur in dieser Datei benutzt.

   ⚠️ LADEREIHENFOLGE: Diese Datei steht in lernprogramm_ap1.html ganz am Ende (nach app_sim.js).
   Das ist unkritisch, weil alle Aufrufe zur Laufzeit passieren – aber es heißt, dass ein hier
   definierter Helfer beim Parsen der früheren Dateien noch nicht existiert. **Nichts hier auf
   oberster Ebene ausführen, was eine der anderen Dateien braucht.**
   Gegenrichtung: benutzt render() (app_seiten.js), statPanel() (app_util.js), gotoSeite()
   (app_ui.js). */
function sNetzplan(m) {
  if (!npAufgabe) npAufgabe = L.genNetzplan();
  var g = npAufgabe, res = g.daten;
  var p = el("<div class='panel'><h2>" + TEXTE.hinweis.netzplanTitel + "</h2><div class='hinweis'>" + TEXTE.hinweis.netzplanHint + "</div></div>");
  p.appendChild(el("<div class='fb ok' style='margin-top:8px' ><b>" + esc(g.szenario.titel) + ":</b> " + esc(g.szenario.text) + "</div>"));
  var tab = "<div  class='hinweis u-margin-top-8px'>";
  res.vorgaenge.forEach(function(v){ tab += "<div><b>" + v.id + "</b> – " + esc(v.name) + " · Dauer " + v.dauer + " · Vorgänger: " + (v.vorgaenger.join(", ") || "–") + "</div>"; });
  tab += "</div>";
  p.appendChild(el(tab));
  m.appendChild(p);
  var POS = { A:[10,15], B:[10,175], C:[210,15], D:[210,175], E:[410,95], F:[600,95] };
  var box = el("<div class='panel np-scroll'></div>");
  var wrap = el("<div class='np-wrap'></div>");
  // Kanten als SVG-Hintergrund
  var kh = 66; // halbe Knotenhöhe (ca.)
  var svg = "<svg class='np-kanten' viewBox='0 0 760 330' xmlns='http://www.w3.org/2000/svg'>";
  res.vorgaenge.forEach(function(v){
    v.vorgaenger.forEach(function(pid){
      var a = POS[pid], b = POS[v.id];
      var x1 = a[0] + 158, y1 = a[1] + kh, x2 = b[0], y2 = b[1] + kh;
      svg += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' stroke='var(--info)' stroke-width='2'/>";
      svg += "<polygon points='" + x2 + "," + y2 + " " + (x2-9) + "," + (y2-4) + " " + (x2-9) + "," + (y2+4) + "' fill='var(--info)'/>";
    });
  });
  svg += "</svg>";
  wrap.appendChild(el(svg));
  /* FB-R3.3: EINE Darstellung fuer Uebungs-Pool und Menuepunkt. Der Knoten folgt jetzt dem
     Schema, das der Pool lehrt und M01-970 als Hotspot abfragt:
        oben   FAZ | Dauer | FEZ
               Vorgangsname
        unten  SAZ |  GP   | SEZ
     Die Dauer ist VORGEGEBEN (kein Eingabefeld), FP entfaellt (Nutzer-Entscheid 2026-07-22).
     Damit sind es 5 Eingabefelder je Vorgang statt 6 - siehe TEXTE.hinweis.netzplanAlle30. */
  var felder = ["faz","fez","saz","sez","gp"];
  var inputs = {}; // id -> {feld: input}
  res.vorgaenge.forEach(function(v){
    var k = el("<div class='np-knoten' style='left:" + POS[v.id][0] + "px;top:" + POS[v.id][1] + "px'>" +
      "<div class='np-titel'>" + v.id + "</div>" +
      "<div class='np-grid np-oben'></div>" +
      "<div class='np-name'>" + esc(v.name) + "</div>" +
      "<div class='np-grid np-unten'></div></div>");
    var oben = k.querySelector(".np-oben"), unten = k.querySelector(".np-unten");
    inputs[v.id] = {};
    function feld(host, fd){
      var inp = el("<input placeholder='" + fd.toUpperCase() + "' inputmode='numeric' autocomplete='off' aria-label='" + fd.toUpperCase() + " für Vorgang " + v.id + "'>");
      inputs[v.id][fd] = inp; host.appendChild(inp);
    }
    feld(oben, "faz");
    oben.appendChild(el("<div class='np-dauer' title='Dauer des Vorgangs (vorgegeben)'>" + v.dauer + "</div>"));
    feld(oben, "fez");
    feld(unten, "saz"); feld(unten, "gp"); feld(unten, "sez");
    wrap.appendChild(k);
  });
  box.appendChild(wrap);
  box.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.netzplanReihenfolge + "</div>"));
  m.appendChild(box);
  var fbHost = el("<div></div>"); m.appendChild(fbHost);
  var done = false;
  setAktion(TEXTE.aktion.netzplanPruefen, function(){
    if (done) return; done = true;
    var richtig = 0, gesamt = 0;
    res.vorgaenge.forEach(function(v){
      felder.forEach(function(fd){
        gesamt++;
        var inp = inputs[v.id][fd];
        var ok = String(v[fd]) === String(inp.value).trim().replace(",", ".").replace(/\.0+$/, "");
        inp.classList.add(ok ? "ok" : "nein");
        if (!ok) inp.title = "Richtig: " + v[fd]; else richtig++;
        inp.disabled = true;
      });
      // Kritische Vorgänge nach Auswertung markieren
      if (res.kritisch.indexOf(v.id) >= 0) { var kn = inputs[v.id].faz.closest(".np-knoten"); if (kn) kn.classList.add("kritisch-zeig"); }
    });
    var quote = Math.round(richtig / gesamt * 100);
    var alleOk = richtig === gesamt;
    var fb = el("<div class='panel'><div class='fb " + (alleOk ? "ok" : "nein") + "'><b>" + richtig + " von " + gesamt + " Feldern richtig (" + quote + " %).</b>" + (alleOk ? TEXTE.hinweis.netzplanPerfektGerechnet : TEXTE.hinweis.feldFalschRotMarkiert) + "</div></div>");
    fb.appendChild(el("<div class='u-margin-top-10px' ><b>Kritischer Pfad: " + res.kritisch.join(" → ") + "</b><div class='hinweis u-margin-top-4px' >Auf dem kritischen Pfad ist der Gesamtpuffer GP = 0: Jede Verzögerung dort verlängert das Projekt direkt. Die Projektdauer beträgt <b>" + res.projektdauer + " Tage</b> (größter FEZ). Vorgänge mit GP &gt; 0 dürfen sich um ihren Puffer verschieben, ohne das Projektende zu gefährden.</div></div>"));
    fb.appendChild(el("<details class='lang' open><summary>" + TEXTE.hinweis.kompletterLoesungsweg + "</summary><div  class='hinweis u-margin-top-8px'>" + g.weg.map(esc).join("<br>") + "</div></details>"));
    fbHost.appendChild(fb);
    // Statistik wie Generator-Aufgaben
    mutS(function(s){
      var st = s.statistik["GEN:netzplan"] = s.statistik["GEN:netzplan"] || { richtig:0, gesamt:0 };
      st.gesamt++; if (quote >= 80) st.richtig++;
      var k = L.dayKey(heute()); s.dailyCounts[k] = (s.dailyCounts[k]||0) + 1;
    });
    renderKopf();
    setAktion(TEXTE.aktion.neueNetzplanAufgabe, function(){ npAufgabe = L.genNetzplan(); render(); }, {});
  }, { hinweis: TEXTE.hinweis.netzplanAlle30 });
}

/* ---- Interaktives Gantt-/Balkenplan-Training ---- */
var ganttAufgabe = null;
function zeichneGantt(res) {
  var wrap = el("<div class='panel np-scroll'></div>");
  wrap.appendChild(el("<div class='kicker u-margin-bottom-6px' >" + TEXTE.hinweis.balkenplanKicker + "</div>"));
  var tbl = document.createElement("table"); tbl.className = "spick-table"; tbl.style.tableLayout = "fixed";
  var hr = document.createElement("tr");
  var th0 = document.createElement("th"); th0.textContent = TEXTE.tabelle.vorgangLabel; hr.appendChild(th0);
  for (var d = 1; d <= res.projektdauer; d++) { var th = document.createElement("th"); th.textContent = String(d); th.style.width = "26px"; th.style.textAlign = "center"; hr.appendChild(th); }
  tbl.appendChild(hr);
  res.vorgaenge.forEach(function (v) {
    var tr = document.createElement("tr");
    var td0 = document.createElement("td"); td0.textContent = v.id + " · " + v.name; tr.appendChild(td0);
    var krit = v.puffer === 0;
    for (var d = 1; d <= res.projektdauer; d++) {
      var td = document.createElement("td"); td.style.textAlign = "center"; td.style.padding = "2px";
      if (d >= v.start && d <= v.ende) td.style.background = krit ? "var(--rot)" : "var(--info)";
      else if (d > v.ende && d <= v.spEnde) td.style.background = "var(--g300)";
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  });
  wrap.appendChild(tbl);
  wrap.appendChild(el("<div class='hinweis u-margin-top-6px' >" + TEXTE.hinweis.netzplanRotBlauGrau + "</div>"));
  return wrap;
}
function sGantt(m) {
  if (!ganttAufgabe) ganttAufgabe = L.genGantt();
  var g = ganttAufgabe, res = g.daten;
  var p = el("<div class='panel'><h2>" + TEXTE.hinweis.ganttTitel + "</h2><div class='hinweis'>" + TEXTE.hinweis.ganttHint + "</div></div>");
  p.appendChild(el("<div class='fb ok' style='margin-top:8px' ><b>" + esc(g.szenario.titel) + ":</b> " + esc(g.szenario.text) + "</div>"));
  m.appendChild(p);
  var box = el("<div class='panel'></div>");
  var tbl = el("<table class='spick-table'></table>");
  var hr = document.createElement("tr");
  [TEXTE.tabelle.vorgangLabel, TEXTE.tabelle.dauerLabel, TEXTE.tabelle.vorgaengerLabel, TEXTE.tabelle.startTagLabel, TEXTE.tabelle.endTagLabel].forEach(function (h) { var th = document.createElement("th"); th.textContent = h; hr.appendChild(th); });
  tbl.appendChild(hr);
  var inputs = {};
  res.vorgaenge.forEach(function (v) {
    var tr = document.createElement("tr");
    function tdT(txt) { var d = document.createElement("td"); d.textContent = txt; return d; }
    tr.appendChild(tdT(v.id + " – " + v.name));
    tr.appendChild(tdT(String(v.dauer)));
    tr.appendChild(tdT(v.vorgaenger.join(", ") || "–"));
    var tdS = document.createElement("td"); var inS = document.createElement("input"); inS.className = "luecke"; inS.style.width = "64px"; inS.setAttribute("inputmode", "numeric"); inS.autocomplete = "off"; tdS.appendChild(inS); tr.appendChild(tdS);
    var tdE = document.createElement("td"); var inE = document.createElement("input"); inE.className = "luecke"; inE.style.width = "64px"; inE.setAttribute("inputmode", "numeric"); inE.autocomplete = "off"; tdE.appendChild(inE); tr.appendChild(tdE);
    inputs[v.id] = { start: inS, ende: inE };
    tbl.appendChild(tr);
  });
  box.appendChild(tbl);
  m.appendChild(box);
  var gHost = el("<div></div>"); m.appendChild(gHost);
  var fbHost = el("<div></div>"); m.appendChild(fbHost);
  function normNum(s) { return String(s == null ? "" : s).trim().replace(",", "."); }
  var done = false;
  setAktion(TEXTE.aktion.ganttPruefen, function () {
    if (done) return; done = true;
    var richtig = 0, gesamt = 0;
    res.vorgaenge.forEach(function (v) {
      [["start", v.start], ["ende", v.ende]].forEach(function (pair) {
        gesamt++; var inp = inputs[v.id][pair[0]];
        var ok = normNum(inp.value) === String(pair[1]);
        inp.classList.add(ok ? "ok" : "nein"); inp.disabled = true;
        if (ok) richtig++; else inp.title = "Richtig: " + pair[1];
      });
    });
    gHost.appendChild(zeichneGantt(res));
    var quote = Math.round(richtig / gesamt * 100), alleOk = richtig === gesamt;
    var fb = el("<div class='panel'><div class='fb " + (alleOk ? "ok" : "nein") + "'><b>" + richtig + " von " + gesamt + " Feldern richtig (" + quote + " %).</b>" + (alleOk ? TEXTE.hinweis.ganttPerfektGeplant : TEXTE.hinweis.feldFalschRotMarkiert) + "</div></div>");
    var puffer = res.vorgaenge.filter(function (v) { return v.puffer > 0; });
    fb.appendChild(el("<div class='u-margin-top-10px' ><b>Projektdauer: " + res.projektdauer + " Tage.</b> Kritischer Pfad (Puffer = 0): <b>" + res.kritisch.join(" → ") + "</b>.<div class='hinweis u-margin-top-4px' >" + (puffer.length ? "Vorgang " + puffer[0].id + " hat " + puffer[0].puffer + " Tag(e) Puffer (spätester Start Tag " + puffer[0].spStart + "), ohne das Projektende zu verschieben. " : "") + TEXTE.hinweis.ganttVorgaengeKritisch + "</div></div>"));
    var weg = res.vorgaenge.map(function (v) { return v.id + ": Start Tag " + v.start + ", Ende Tag " + v.ende + " (Dauer " + v.dauer + (v.vorgaenger.length ? ", frühestens nach " + v.vorgaenger.join("/") : ", ohne Vorgänger") + "), Puffer " + v.puffer; });
    fb.appendChild(el("<details class='lang'><summary>" + TEXTE.hinweis.kompletterLoesungsweg + "</summary><div  class='hinweis u-margin-top-8px'>" + weg.map(esc).join("<br>") + "</div></details>"));
    fbHost.appendChild(fb);
    mutS(function(s){
      var st = s.statistik["GEN:gantt"] = s.statistik["GEN:gantt"] || { richtig: 0, gesamt: 0 };
      st.gesamt++; if (quote >= 80) st.richtig++;
      var kk = L.dayKey(heute()); s.dailyCounts[kk] = (s.dailyCounts[kk] || 0) + 1;
    });
    renderKopf();
    setAktion(TEXTE.aktion.neueGanttAufgabe, function () { ganttAufgabe = L.genGantt(); render(); }, {});
  }, { hinweis: TEXTE.hinweis.ganttFuerJeden });
}

/* ---- Glossar (aus Erklär-Fragen) ---- */
/* #61: Glossar-Seite mit Tab-Umschalter Begriffe | Abkürzungen. Der Abkürzungs-Tab ist erst
   ab >30 beantworteten Fragen sichtbar (Gate anzahlBeantwortet). */
var glossarTab = "begriffe";
function sGlossar(m) {
  var abkFrei = anzahlBeantwortet() > L.CONFIG.gate;
  if (!abkFrei) glossarTab = "begriffe";
  var kopf = el("<div class='panel'><h2>" + TEXTE.glossarSeite.h2 + "</h2></div>");
  var tabs = el("<div class='zeile' style='gap:8px;margin-top:2px;flex-wrap:wrap' ></div>");
  var tB = el("<button class='b" + (glossarTab === "begriffe" ? " gelb" : " leise") + "'>" + TEXTE.glossarSeite.begriffeBtn + "</button>");
  tB.onclick = function(){ glossarTab = "begriffe"; render(); };
  tabs.appendChild(tB);
  if (abkFrei) {
    var tA = el("<button class='b" + (glossarTab === "abk" ? " gelb" : " leise") + "'>" + TEXTE.glossarSeite.abkBtn + "</button>");
    tA.onclick = function(){ glossarTab = "abk"; render(); };
    tabs.appendChild(tA);
  } else {
    tabs.appendChild(el("<span class='hinweis u-align-self-center' >" + TEXTE.hinweis.abkFreischaltHinweis + "</span>"));
  }
  kopf.appendChild(tabs); m.appendChild(kopf);
  if (glossarTab === "abk" && abkFrei) glossarAbkView(m);
  else glossarBegriffeView(m);
}
function glossarBegriffeView(m) {
  var seen = {}, liste = [];
  POOL.forEach(function(f){
    if (f.typ !== "erklaeren" || !f.musterloesung) return;
    var t = String(f.frage).replace(/^Erkläre\s+(den Begriff|das Modell|das Prinzip|die)?:?\s*/i, "").replace(/[.:]\s*$/, "").trim();
    if (!t || t.indexOf("?") >= 0 || t.length > 52) return;   // keine ganzen Satzfragen ins Glossar
    var k = t.toLowerCase();
    if (!seen[k]) { seen[k] = 1; liste.push({ term:t, def:f.musterloesung, modul:f.modul }); }
  });
  /* Begriffe aus „Klausurvorbereitung" (2026-07-20): kommen NICHT aus erklaeren-Fragen – die fünf
     M09-Erklärfragen sind Fallfragen und fallen durch den Kurzbegriff-Filter oben. Sie stehen
     deshalb in GLOSSAR_M09_BEGRIFFE, die Definition kommt aus GLOSSAR_TIPS (eine Quelle für
     Tooltip und Lexikon). Der Modul-Tag weist sie im Lexikon als Nicht-AP1-Stoff aus. */
  (typeof GLOSSAR_M09_BEGRIFFE !== "undefined" ? GLOSSAR_M09_BEGRIFFE : []).forEach(function(term){
    var def = GLOSSAR_TIPS[term];
    if (!def) return;                                   // fehlt eine Definition, lieber weglassen
    var k = term.toLowerCase();
    if (!seen[k]) { seen[k] = 1; liste.push({ term:term, def:def, modul:"M09" }); }
  });
  liste.sort(function(a,b){ return a.term.localeCompare(b.term, "de"); });
  var p = el("<div class='panel'><div class='kicker'>" + TEXTE.glossarSeite.begriffslexikon + "</div><div class='hinweis'>" + liste.length + TEXTE.glossarSeite.begriffeHinweisSuffix + "</div></div>");
  var such = el("<input style='width:100%;margin-top:10px;padding:9px;border:1px solid var(--rand);border-radius:8px;background:var(--panel);color:var(--text)' type='text' placeholder='" + TEXTE.glossarSeite.begriffSuchenPlaceholder + "' >");
  p.appendChild(such); m.appendChild(p);
  var host = el("<div></div>"); m.appendChild(host);
  function zeichne(filter){
    host.innerHTML = ""; var f = (filter||"").toLowerCase().trim(), c = 0;
    liste.forEach(function(b){
      if (f && b.term.toLowerCase().indexOf(f) < 0 && b.def.toLowerCase().indexOf(f) < 0) return;
      c++;
      var det = el("<details class='panel u-margin-bottom-8px' " + (f?" open":"") + "><summary style='cursor:pointer;font-weight:600;color:var(--ink900)' >" + esc(b.term) + " <span class='tag'>" + esc(modulName(b.modul)) + "</span></summary><div  class='frage-text u-margin-top-8px'>" + esc(b.def).replace(/\n/g,"<br>") + "</div></details>");
      host.appendChild(det);
    });
    if (!c) host.appendChild(el("<div class='panel hinweis'>" + TEXTE.glossarSeite.keinBegriffGefunden + "</div>"));
  }
  such.oninput = function(){ zeichne(such.value); };
  zeichne("");
}
function glossarAbkView(m) {
  var liste = (typeof ABKUERZUNGEN !== "undefined" ? ABKUERZUNGEN : []).slice()
    .sort(function(a,b){ return a.kurz.localeCompare(b.kurz, "de"); });
  var p = el("<div class='panel'><div class='kicker'>" + TEXTE.glossarSeite.itWisoAbk + "</div><div class='hinweis'>" + liste.length + TEXTE.glossarSeite.abkHinweisSuffix + "</div></div>");
  var such = el("<input style='width:100%;margin-top:10px;padding:9px;border:1px solid var(--rand);border-radius:8px;background:var(--panel);color:var(--text)' type='text' placeholder='" + TEXTE.glossarSeite.abkSuchenPlaceholder + "' >");
  p.appendChild(such); m.appendChild(p);
  var host = el("<div></div>"); m.appendChild(host);
  function zeichne(filter){
    host.innerHTML = ""; var f = (filter||"").toLowerCase().trim(), c = 0;
    liste.forEach(function(a){
      if (f && a.kurz.toLowerCase().indexOf(f) < 0 && a.lang.toLowerCase().indexOf(f) < 0 && a.def.toLowerCase().indexOf(f) < 0 && a.kat.toLowerCase().indexOf(f) < 0) return;
      c++;
      var row = el("<div class='panel u-margin-bottom-8px' ><div class='u-font-weight-600 u-color-var-ink900' >" + esc(a.kurz) + " <span class='tag'>" + esc(a.kat) + "</span></div><div class='u-margin-top-2px' >" + esc(a.lang) + "</div><div class='hinweis u-margin-top-2px' >" + esc(a.def) + "</div></div>");
      host.appendChild(row);
    });
    if (!c) host.appendChild(el("<div class='panel hinweis'>" + TEXTE.glossarSeite.keineAbkGefunden + "</div>"));
  }
  such.oninput = function(){ zeichne(such.value); };
  zeichne("");
}

/* ---- Mini-Markdown für Spickzettel ---- */
function mdInline(s){ return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\*(.+?)\*/g,"<i>$1</i>").replace(/`(.+?)`/g,"<code>$1</code>"); }
function mdTabelle(rows){
  var cells = rows.map(function(r){ return r.trim().replace(/^\|/,"").replace(/\|\s*$/,"").split("|").map(function(c){ return c.trim(); }); });
  var head = cells[0], body = cells.slice(2);
  return "<table class='spick-table'><tr>" + head.map(function(c){ return "<th>" + mdInline(c) + "</th>"; }).join("") + "</tr>" +
    body.map(function(r){ return "<tr>" + r.map(function(c){ return "<td>" + mdInline(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>";
}
function mdToHtml(md){
  var lines = String(md).split("\n"), out = [], i = 0;
  while (i < lines.length){
    var l = lines[i];
    if (/^\s*$/.test(l)){ i++; continue; }
    if (/^-{3,}\s*$/.test(l)){ i++; continue; }
    if (/^#{1,6}\s/.test(l)){ out.push("<h4>" + mdInline(l.replace(/^#+\s/,"")) + "</h4>"); i++; continue; }
    if (/^>\s/.test(l)){ out.push("<div class='fb ok u-margin-8px-0' >" + mdInline(l.replace(/^>\s/,"")) + "</div>"); i++; continue; }
    if (/^\s*[-*]\s/.test(l)){ var items = []; while (i < lines.length && /^\s*[-*]\s/.test(lines[i])){ items.push("<li>" + mdInline(lines[i].replace(/^\s*[-*]\s/,"")) + "</li>"); i++; } out.push("<ul>" + items.join("") + "</ul>"); continue; }
    if (/^\s*\d+\.\s/.test(l)){ var oi = []; while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])){ oi.push("<li>" + mdInline(lines[i].replace(/^\s*\d+\.\s/,"")) + "</li>"); i++; } out.push("<ol>" + oi.join("") + "</ol>"); continue; }
    if (/^\s*\|/.test(l)){ var rows = []; while (i < lines.length && /^\s*\|/.test(lines[i])){ rows.push(lines[i]); i++; } out.push(mdTabelle(rows)); continue; }
    out.push("<p>" + mdInline(l) + "</p>"); i++;
  }
  return out.join("");
}

/* ---- Interaktiver Spickzettel ---- */
function sSpickzettel(m) {
  var md = (typeof SPICKZETTEL === "string") ? SPICKZETTEL : "";
  var p = el("<div class='panel'><h2>" + TEXTE.spickzettelSeite.h2 + "</h2><div class='hinweis'>" + TEXTE.spickzettelSeite.hinweis + "</div></div>");
  var such = el("<input style='width:100%;margin-top:10px;padding:9px;border:1px solid var(--rand);border-radius:8px;background:var(--panel);color:var(--text)' type='text' placeholder='" + TEXTE.spickzettelSeite.suchenPlaceholder + "' >");
  p.appendChild(such); m.appendChild(p);
  var host = el("<div class='spick'></div>"); m.appendChild(host);
  var sektionen = md.split(/\n(?=#{1,2}\s)/).filter(function(s){ return s.trim(); });
  function zeichne(filter){
    host.innerHTML = ""; var f = (filter||"").toLowerCase().trim(), c = 0;
    sektionen.forEach(function(sek, idx){
      if (f && sek.toLowerCase().indexOf(f) < 0) return;
      c++;
      var titel = (sek.match(/^#{1,6}\s+(.+)/) || [])[1] || TEXTE.spickzettelSeite.abschnittFallback;
      var body = sek.replace(/^#{1,6}\s+.+\n?/, "");
      var offen = f || idx === 0;
      var det = el("<details class='panel u-margin-bottom-10px' " + (offen?" open":"") + "><summary style='cursor:pointer;font-family:var(--f-display);font-weight:600;color:var(--ink900)' >" + esc(titel) + "</summary><div class='u-margin-top-10px' >" + mdToHtml(body) + "</div></details>");
      host.appendChild(det);
    });
    if (!c) host.appendChild(el("<div class='panel hinweis'>" + TEXTE.spickzettelSeite.nichtsGefunden + "</div>"));
  }
  such.oninput = function(){ zeichne(such.value); };
  zeichne("");
}

/* ---- 5er-Serie aus dem statistisch schwächsten Lernfeld ---- */
var serieAktiv = null;
function sSerie(m) {
  var gebiet = schwaechstesGebiet();
  if (!serieAktiv || serieAktiv.gebiet !== gebiet || serieAktiv.idx >= serieAktiv.fragen.length) {
    // 5 Fragen dynamisch aus dem schwächsten Gebiet ziehen: bevorzugt Fragen,
    // die zuletzt falsch waren (Fehler-Deck) oder noch nie/lange nicht gesehen wurden.
    var pool = poolAP().filter(function(f){ return f.gebiet === gebiet; });
    var imFD = pool.filter(function(f){ return S.fehlerDeck[f.id]; });
    var frisch = pool.filter(function(f){ return !S.fehlerDeck[f.id] && S.lastShown.indexOf(f.id) === -1; });
    var rest = pool.filter(function(f){ return !S.fehlerDeck[f.id] && S.lastShown.indexOf(f.id) >= 0; });
    var auswahl = L.shuffle(imFD).slice(0, 2).concat(L.shuffle(frisch)).concat(L.shuffle(rest)).slice(0, 5);
    auswahl = mischeTypen(auswahl);
    if (!auswahl.length) { m.appendChild(el("<div class='panel'>" + TEXTE.hinweis.keineFragenLernfeld + "</div>")); return; }
    serieAktiv = { gebiet: gebiet, fragen: auswahl, idx: 0, richtig: 0 };
  }
  var st = serieAktiv;
  m.appendChild(el("<div class='panel'><div class='kicker'>" + TEXTE.serieSeite.kicker + "</div><h2 class='u-border-none u-margin-4px-0-4px' >" + esc(L.gebietName(st.gebiet)) + "</h2><div class='hinweis'>Die Serie wird dynamisch aus deinen gespeicherten Ergebnissen zusammengestellt. Frage " + Math.min(st.idx + 1, st.fragen.length) + " von " + st.fragen.length + " · bisher " + st.richtig + " richtig</div></div>"));
  m.appendChild(el("<div class='zeile u-margin-2px-0-8px' ></div>")).appendChild(abrufToggle());
  var qa = el("<div></div>"); m.appendChild(qa);
  var f = L.instanziiere(st.fragen[st.idx]);
  loeseFrage(f, qa, {
    onGraded: function(korrekt, extra){ if (korrekt) st.richtig++; verbucheAntwort(f, korrekt, extra); },
    onNext: function(){
      st.idx++;
      if (st.idx >= st.fragen.length) {
        setS('serieDone', L.dayKey(heute()));
        var erg = st.richtig; serieAktiv = null;
        var mm = document.getElementById("main"); mm.innerHTML = "";
        mm.appendChild(el("<div class='panel'><h2>" + TEXTE.serieSeite.abgeschlossenH2 + "</h2><div class='u-font-size-1-05rem u-margin-8px-0' ><b>" + erg + " von " + st.fragen.length + "</b> richtig im Gebiet " + esc(L.gebietName(st.gebiet)) + ".</div><div class='hinweis'>" + (erg >= 4 ? TEXTE.serieSeite.starkLernfeld : TEXTE.serieSeite.dranbleiben) + "</div></div>"));
        var b = el("<button class='b gelb'>" + TEXTE.aktion.zurStartseite + "</button>");
        b.onclick = function(){ gotoSeite("start"); };
        var b2 = el("<button class='b leise u-margin-left-10px' >" + TEXTE.aktion.nochEineSerie + "</button>");
        b2.onclick = function(){ gotoSeite("serie"); };
        var pz = el("<div class='panel'></div>"); pz.appendChild(b); pz.appendChild(b2); mm.appendChild(pz);
        clearAktion();
      } else render();
    }
  });
}

/* ---- Statistik ---- */
function sStatistik(m) {
  // L1 Bereitschafts-Panel (Ampel je Modul + gesamt; nur geübte Themen gewertet, ungeübte als "offen")
  var br = L.bereitschaft(S.statistik);
  var uni = {};                                  // gebiet -> {modul|thema:1} aus dem AP-gefilterten Pool
  poolAP().forEach(function(f){ var g = L.gebietFuer(f); (uni[g] || (uni[g] = {}))[f.modul + "|" + f.thema] = 1; });
  function ampFarbe(a){ return a==="rot"?"var(--rot)":a==="gelb"?"var(--gelb)":a==="gruen"?"var(--gruen)":"var(--g300)"; }
  function bZeile(name, d, total, fett){
    var farbe = ampFarbe(d.ampel);
    return el("<div class='u-margin-8px-0' >" +
      "<span style='display:inline-block;width:11px;height:11px;border-radius:50%;background:" + farbe + ";vertical-align:middle;margin-right:6px'></span>" +
      (fett ? "<b>" + esc(name) + "</b>" : esc(name)) + " – " + d.score + " % " +
      "<span class='hinweis'>(" + d.themen + "/" + total + " Themen geübt)</span>" +
      "<div class='balken'><div style='width:" + d.score + "%;background:" + farbe + "'></div></div></div>");
  }
  var pB = statPanel("stat-bereitschaft", TEXTE.bereitschaft.h2);   // FB-R1.6
  pB.appendChild(el("<div class='hinweis u-margin-6px-0' >" + TEXTE.bereitschaft.hint + "</div>"));
  if (br.gesamt.score == null) {
    pB.appendChild(el("<div class='hinweis' >" + TEXTE.bereitschaft.nochKeine + "</div>"));
  } else {
    var totalGes = 0; Object.keys(uni).forEach(function(mm){ totalGes += Object.keys(uni[mm]).length; });
    pB.appendChild(bZeile(TEXTE.bereitschaft.gesamt, br.gesamt, totalGes, true));
    L.GEBIETE.forEach(function(gg){
      if (gg[0] === "M9") return;
      var total = uni[gg[0]] ? Object.keys(uni[gg[0]]).length : 0;
      if (!total) return;                        // Gebiet ohne AP-relevante Pool-Themen (z. B. AP2 ohne inklAP2)
      var d = br.gebiete[gg[0]];
      if (!d) { pB.appendChild(el("<div class='u-margin-6px-0 hinweis' >" + esc(gg[1]) + " – 0/" + total + " Themen geübt</div>")); return; }
      pB.appendChild(bZeile(gg[1], d, total, false));
    });
  }
  m.appendChild(pB);
  var p = statPanel("stat-module", TEXTE.statistikSeite.h2);   // FB-R1.6
  var spg2 = L.statProGebiet(S.statistik);
  L.GEBIETE.forEach(function(gg){
    if (gg[0] === "M9") return;
    var e = spg2[gg[0]];
    if (!e || !e.gesamt) { p.appendChild(el("<div  class='hinweis u-margin-6px-0'>" + gg[1] + TEXTE.statistikSeite.keineDatenSuffix + "</div>")); return; }
    var q = Math.round(e.richtig / e.gesamt * 100);
    p.appendChild(el("<div class='u-margin-8px-0' >" + gg[1] + " – " + e.richtig + "/" + e.gesamt + " (" + q + " %)<div class='balken'><div style='width:" + q + "%'></div></div></div>"));
  });
  m.appendChild(p);
  var th = Object.keys(S.statistik).filter(function(k){ return k.indexOf("T:")===0 && S.statistik[k].gesamt >= 3; })
    .map(function(k){ var e = S.statistik[k]; return { name: k.split(":").slice(2).join(":"), q: Math.round(e.richtig/e.gesamt*100), n: e.gesamt }; })
    .sort(function(a,b){ return a.q - b.q; }).slice(0, 8);
  if (th.length) {
    var p2 = statPanel("stat-schwach", TEXTE.statistikSeite.schwaechsteThemenH2);   // FB-R1.6
    th.forEach(function(t){ p2.appendChild(el("<div class='u-margin-6px-0' >" + esc(t.name) + " – " + t.q + " % (" + t.n + " Antworten)<div class='balken'><div style='width:" + t.q + "%'></div></div></div>")); });
    m.appendChild(p2);
  }
  var gen = Object.keys(S.statistik).filter(function(k){ return k.indexOf("GEN:")===0; });
  if (gen.length) {
    var p3 = statPanel("stat-generator", TEXTE.nav.generator);   // FB-R1.6
    gen.forEach(function(k){ var e = S.statistik[k]; p3.appendChild(el("<div>" + esc(k.slice(4)) + ": " + e.richtig + "/" + e.gesamt + " richtig</div>")); });
    m.appendChild(p3);
  }
  m.appendChild(stufenVorschauPanel());   // FB-R2b.2 (fuenftes statPanel)
}

/* FB-R2b.2 – STUFEN-VORSCHAU (Nutzer-Entscheide 2026-07-21: als Panel auf der Statistik-Seite,
   VOLLE MATRIX Aufgabenart x Stufe, Beispiel AUFKLAPPBAR mit vollstaendiger Frage).
   Die Beispiele werden AUS DEM POOL gezogen und nicht geschrieben – so veraltet die Vorschau
   nicht, wenn Fragen dazukommen, und die Tabelle zeigt nebenbei, welche Kombinationen im Pool
   noch FEHLEN (Stand 21.07.: 25 von 76 Feldern leer, vor allem Stufe 1 und 4).
   Grundlage ist poolAP() wie im Rest der Statistik-Seite – M09 („Klausurvorbereitung") hat seine
   eigene Seite und bleibt hier bewusst aussen vor (Invariante AP1/M09-Trennung).
   ⚠️ tr/td/th IMMER ueber document.createElement erzeugen und NIEMALS als HTML-Zeichenkette an
   el() uebergeben – ein Tabellen-Fragment ohne Tabellen-Kontext wird vom Parser verworfen
   (Projekt-Falle, steht in feature_draft.md).
   HINWEIS: Die Falle hier bewusst NICHT woertlich zitieren – der Anti-Pattern-Guard in check.sh
   sucht per grep nach dem Muster und kann Warnung und Verstoss nicht unterscheiden. Genau daran
   ist der erste Anlauf von v1.3.0 in der CI gescheitert. */
function stufenVorschauPanel(){
  var p = statPanel("stat-stufen", TEXTE.statistikSeite.stufenH2);   // startet zugeklappt
  /* Eigene Klasse, damit die Druck-Regel in styles.css das Panel sicher trifft (Nutzer-
     Entscheid: die Vorschau kommt NICHT aufs Papier – sonst druckt der beforeprint-Hook
     alle 51 Beispielfragen mit). Kein :has()-Selektor, der muss auch in jsdom greifen. */
  p.classList.add("stufen-panel");
  p.appendChild(el("<div class='hinweis u-margin-6px-0' >" + esc(TEXTE.statistikSeite.stufenHint) + "</div>"));

  var beispiel = {}, anzahl = {}, typen = {};
  poolAP().forEach(function(f){
    var t = typVon(f), k = t + "|" + f.schwierigkeit;
    typen[t] = 1;
    anzahl[k] = (anzahl[k] || 0) + 1;
    if (!beispiel[k]) beispiel[k] = f;          // erstes Vorkommen, stabil ueber Neuladen
  });
  var reihen = Object.keys(typen).sort(function(a, b){
    return typName(a).localeCompare(typName(b), "de");
  });

  var scroll = el("<div class='stufen-scroll'></div>");
  var tbl = document.createElement("table");
  tbl.className = "spick-table stufen-tab";
  var kopf = document.createElement("tr");
  var thTyp = document.createElement("th");
  thTyp.textContent = TEXTE.statistikSeite.stufenSpalteTyp;
  kopf.appendChild(thTyp);
  [1, 2, 3, 4].forEach(function(n){
    var th = document.createElement("th");
    th.innerHTML = esc(LEVEL_NAMEN[n]) + "<div class='stufen-bananen'>" + bananen(n) + "</div>";
    kopf.appendChild(th);
  });
  tbl.appendChild(kopf);

  reihen.forEach(function(t){
    var tr = document.createElement("tr");
    var tdName = document.createElement("td");
    tdName.className = "stufen-typ";
    tdName.textContent = typName(t);
    tr.appendChild(tdName);
    [1, 2, 3, 4].forEach(function(n){
      var td = document.createElement("td");
      var f = beispiel[t + "|" + n];
      if (!f){
        td.className = "stufen-leer";
        td.textContent = TEXTE.statistikSeite.stufenLeer;
        td.setAttribute("title", TEXTE.statistikSeite.stufenLeerTitel);
      } else {
        /* Verschachteltes <details> im Panel-<details>: zulaessig, weil hier NICHTS per
           innerHTML nachgezeichnet wird (die Falle aus R1.6 greift nur beim Neuzeichnen). */
        var dt = el("<details class='stufen-bsp'><summary>" + esc(TEXTE.statistikSeite.stufenBeispiel) +
          " <span class='hinweis'>(" + esc(TEXTE.statistikSeite.stufenAnzahl(anzahl[t + "|" + n])) + ")</span></summary></details>");
        dt.appendChild(el("<div class='meta'><span class='tag'>" + esc(modulName(f.modul)) + "</span><span class='tag'>" + esc(f.thema) + "</span></div>"));
        dt.appendChild(el("<div class='stufen-frage'>" + esc(f.frage) + "</div>"));
        td.appendChild(dt);
      }
      tr.appendChild(td);
    });
    tbl.appendChild(tr);
  });
  scroll.appendChild(tbl);
  p.appendChild(scroll);
  return p;
}

/* ---- Einstellungen ---- */
function sEinstellungen(m) {
  var p = el("<div class='panel'><h2>" + TEXTE.nav.einstellungen + "</h2></div>");
  var z1 = el("<div class='zeile u-margin-bottom-10px' ><label>" + TEXTE.einstellungenSeite.tagesziel + "</label></div>");
  var i1 = el("<input style='width:90px' type='number' min='5' max='200' value='" + S.tagesziel + "' >");
  i1.setAttribute("aria-label", TEXTE.einstellungenSeite.tagesziel);   // G1.5 #46
  i1.onchange = function(){ setS('tagesziel', Math.max(5, +i1.value || 20)); renderKopf(); };
  z1.appendChild(i1); p.appendChild(z1);
  var z2 = el("<div class='zeile u-margin-bottom-10px' ><label>" + TEXTE.einstellungenSeite.pruefungsdatum + "</label></div>");
  var i2 = el("<input type='date' value='" + esc(S.pruefungsdatum) + "'>");
  i2.setAttribute("aria-label", TEXTE.einstellungenSeite.pruefungsdatum);   // G1.5 #46
  i2.onchange = function(){ setS('pruefungsdatum', i2.value); renderKopf(); };
  var i2x = el("<button class='b leise'>" + TEXTE.aktion.ausblenden + "</button>");
  i2x.onclick = function(){ setS('pruefungsdatum', ""); render(); };
  z2.appendChild(i2); z2.appendChild(i2x); p.appendChild(z2);
  var z3 = el("<div class='zeile u-margin-bottom-10px' ><label>" + TEXTE.einstellungenSeite.ansichtDesign + "</label></div>");
  var i3 = el("<select></select>");
  i3.setAttribute("aria-label", TEXTE.einstellungenSeite.ansichtDesign);   // G1.5 #46
  THEMES.forEach(function(th){ var o=document.createElement("option"); o.value=th[0]; o.textContent=th[1]; if(S.theme===th[0]) o.selected=true; i3.appendChild(o); });
  i3.onchange = function(){ setTheme(i3.value); render(); };
  z3.appendChild(i3); p.appendChild(z3);
  var z35 = el("<div class='zeile u-margin-bottom-10px' ><label>" + TEXTE.einstellungenSeite.uebenLabel + "</label></div>");
  var i35 = el("<label class='u-font-size-9rem u-cursor-pointer' ><input type='checkbox'" + (S.relevanzGewichtung ? " checked" : "") + "> " + TEXTE.einstellungenSeite.pruefungsnah + "</label>");
  i35.querySelector("input").onchange = function(e){ setS('relevanzGewichtung', e.target.checked); };
  z35.appendChild(i35); p.appendChild(z35);
  // FB-R3 Punkt 7 (#98): Abruf-Übung ist Voreinstellung; der (leise) Umschalter sitzt jetzt hier
  // in den Einstellungen unter „Üben" statt auf jeder Übungsseite.
  var z35a = el("<div class='zeile u-margin-bottom-10px' ></div>");
  z35a.appendChild(abrufToggle());
  p.appendChild(z35a);
  var z355 = el("<div class='zeile u-margin-bottom-10px' ><label>" + TEXTE.einstellungenSeite.begriffeLabel + "</label></div>");
  var i355 = el("<label class='u-font-size-9rem u-cursor-pointer' ><input type='checkbox'" + (S.glossarTip ? " checked" : "") + "> " + TEXTE.einstellungenSeite.begriffsTooltips + "</label>");
  i355.querySelector("input").onchange = function(e){ setS('glossarTip', e.target.checked); };
  z355.appendChild(i355); p.appendChild(z355);
  /* FB-R1.8 / E3: Der Markieren-Button („Später prüfen") ist ab v1.1.0 standardmaessig
     ausgeblendet, damit „Melden" die markante Position bekommt. Wer ihn nutzt, schaltet ihn hier
     wieder ein; die Seite „Markiert" und alle gesetzten Lesezeichen bleiben unabhaengig davon. */
  var zMark = el("<div class='zeile u-margin-bottom-10px' ><label>" + TEXTE.einstellungenSeite.markierenLabel + "</label></div>");
  var iMark = el("<label class='u-font-size-9rem u-cursor-pointer' ><input type='checkbox' class='markieren-schalter'" + (S.markierenAn ? " checked" : "") + "> " + TEXTE.einstellungenSeite.markierenAnLabel + "</label>");
  iMark.querySelector("input").onchange = function(e){ setS('markierenAn', e.target.checked); render(); };
  zMark.appendChild(iMark); p.appendChild(zMark);
  // #64/#65 Barrierefreiheit (gebündelt): Farbsymbole ✓/✗ + ARIA/Alt-Texte für SVG
  var z36a = el("<div class='zeile u-margin-bottom-6px' ><label>" + TEXTE.einstellungenSeite.barrierefreiheit + "</label></div>");
  p.appendChild(z36a);
  var ba1 = el("<label class='u-font-size-9rem u-cursor-pointer u-display-block u-margin-2px-0-6px' ><input type='checkbox'" + (S.farbsymbole ? " checked" : "") + "> " + TEXTE.einstellungenSeite.farbsymboleLabel + "</label>");
  ba1.querySelector("input").onchange = function(e){ setFarbsymbole(e.target.checked); };
  p.appendChild(ba1);
  var ba2 = el("<label class='u-font-size-9rem u-cursor-pointer u-display-block u-margin-2px-0-6px' ><input type='checkbox'" + (S.ariaAltTexte ? " checked" : "") + "> " + TEXTE.einstellungenSeite.ariaAltLabel + "</label>");
  ba2.querySelector("input").onchange = function(e){ setS('ariaAltTexte', e.target.checked); render(); };
  p.appendChild(ba2);
  /* #31 Schriftgroesse in drei Stufen. Gehoert bewusst unter „Barrierefreiheit": die Stufen
     skalieren ueber die Basisgroesse des Dokuments, also auch Abstaende und Bedienflaechen. */
  var zSchrift = el("<div class='zeile u-margin-bottom-6px' style='margin-top:8px;gap:8px;flex-wrap:wrap' ><label>" + TEXTE.einstellungenSeite.schriftgroesseLabel + "</label></div>");
  SCHRIFT_STUFEN.forEach(function(stufe){
    var b = el("<button class='b" + (S.schriftStufe === stufe ? " gelb" : " leise") + "'>" + TEXTE.einstellungenSeite.schriftStufen[stufe] + "</button>");
    b.setAttribute("aria-pressed", S.schriftStufe === stufe ? "true" : "false");
    b.onclick = function(){ setSchrift(stufe); render(); };
    zSchrift.appendChild(b);
  });
  p.appendChild(zSchrift);
  // #66/#67 Hilfe: Tour erneut starten + Bedienhilfen wieder einblenden
  var zHilfe = el("<div class='zeile' style='margin-bottom:6px;margin-top:4px;gap:8px;flex-wrap:wrap' ><label>" + TEXTE.einstellungenSeite.hilfeLabel + "</label></div>");
  var bTour = el("<button class='b leise'>" + TEXTE.aktion.einfuehrungstour + "</button>");
  bTour.onclick = function(){ starteOnboarding(); };
  var bHint = el("<button class='b leise'>" + TEXTE.aktion.bedienhilfenEinblenden + "</button>");
  bHint.onclick = function(){ setS('typHilfeAus', {}); render(); };
  zHilfe.appendChild(bTour); zHilfe.appendChild(bHint); p.appendChild(zHilfe);
  var z36 = el("<div class='zeile u-margin-bottom-10px' ><label>" + TEXTE.einstellungenSeite.simulationsdauer + "</label></div>");
  var i36 = el("<input style='width:90px' type='number' min='0' max='240' value='" + (S.simDauerMin || 0) + "' >");
  i36.setAttribute("aria-label", TEXTE.einstellungenSeite.simulationsdauer);   // G1.5 #46
  i36.onchange = function(){ setS('simDauerMin', Math.max(0, Math.min(240, +i36.value || 0))); };
  z36.appendChild(i36);
  z36.appendChild(el("<span class='hinweis u-margin-left-8px' >" + TEXTE.hinweis.simulationsdauerHint + "</span>"));
  p.appendChild(z36);
  var z4 = el("<div class='zeile'><label>" + TEXTE.einstellungenSeite.datenLabel + "</label></div>");
  var i4 = el("<button class='b leise' style='color:var(--rot)' >" + TEXTE.aktion.kompFortschrittLoeschen + "</button>");
  i4.onclick = function(){ if (confirm(TEXTE.einstellungenSeite.wirklichAlleLoeschen)) { localStorage.removeItem(LS_KEY); S = defaultState(); setTheme(S.theme||"hell"); render(); } };
  z4.appendChild(i4); p.appendChild(z4);
  m.appendChild(p);
  // #57 Gemeldete Fragen: Übersicht, einzeln entfernen, als Datei exportieren
  var mp = el("<div class='panel'><div class='kicker'>" + TEXTE.einstellungenSeite.gemeldeteFragen + "</div></div>");
  var mids = Object.keys(S.meldungen);
  if (!mids.length) mp.appendChild(el("<div class='hinweis'>" + TEXTE.einstellungenSeite.keineGemeldeten + "</div>"));
  else {
    mids.forEach(function(id){
      var mm = S.meldungen[id], f = frageById(id);
      var zeile = el("<div class='u-display-flex u-gap-10px u-align-items-center u-justify-content-space-between u-margin-6px-0' ></div>");
      zeile.appendChild(el("<span style='font-size:.86rem' ><b>" + esc(id) + "</b> · " + esc(mm.grund || "-") + (mm.text ? " – " + esc(mm.text) : "") + "<br><span class='hinweis'>" + esc(f ? modulName(f.modul) + " · " + f.thema : TEXTE.melden.nichtImPool) + "</span></span>"));
      var rm = el("<button class='b leise'>" + TEXTE.aktion.entfernen + "</button>");
      rm.onclick = function(){ mutS(function(s){ delete s.meldungen[id]; }); render(); };
      zeile.appendChild(rm); mp.appendChild(zeile);
    });
    var dz = el("<div class='zeile' style='margin-top:8px;gap:8px' ></div>");
    var bJson = el("<button class='b leise'>" + TEXTE.aktion.alsJsonHerunterladen + "</button>");
    bJson.onclick = function(){ downloadDatei("meldungen.json", meldungenJSON(), "application/json;charset=utf-8"); };
    var bTxt = el("<button class='b leise'>" + TEXTE.aktion.alsTextHerunterladen + "</button>");
    bTxt.onclick = function(){ downloadDatei("meldungen.txt", meldungenText(), "text/plain;charset=utf-8"); };
    dz.appendChild(bJson); dz.appendChild(bTxt); mp.appendChild(dz);
  }
  m.appendChild(mp);
  m.appendChild(el("<div class='panel hinweis'>" + TEXTE.einstellungenSeite.eigeneFragenErgaenzen + "</div>"));
  // T6 #96 Versionsanzeige (klein, unten) – Quelle: APP_VERSION (Single Source of Truth)
  m.appendChild(el("<div class='hinweis u-font-size-9rem' style='text-align:center;margin-top:6px'>" + TEXTE.einstellungenSeite.versionLabel + " " + esc(APP_VERSION) + "</div>"));
}

/* =================== Start ===================
   G4.2 (#29): Beim Laden zuerst den Hash auswerten – so landet ein Deep-Link
   (#stat, #frage=M03-907) direkt auf der richtigen Seite statt immer auf „start".
   Ohne Hash bleibt es beim bisherigen Verhalten. */
(function bootRoute(){
  try {
    var z = hashLesen();
    seite = z.seite;
    frageDirekt = z.frageId;
  } catch (e) { seite = "start"; frageDirekt = null; }
  render();
})();
