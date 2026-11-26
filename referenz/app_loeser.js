"use strict";
/* =================== Split-Löser (Üben & Fehler-Deck) ===================
   Links: Aufgabenstellung. Rechts: interaktive Löse-Elemente.
   Prüfen erfolgt über den globalen Aktions-Footer (setAktion).            */
function metaTags(f){
  return "<div class='meta'><span class='tag'>" + esc(modulName(f.modul)) + "</span><span class='tag'>" + esc(f.thema) + "</span><span class='tag'>" + LEVEL_NAMEN[f.schwierigkeit] + "</span>" +
    (f.pruefungsteil === "AP2" ? "<span class='tag ap2' title='" + TEXTE.meta.ap2TitelKurz + "'>" + TEXTE.meta.ap2Zusatz + "</span>" : "") +
    (f.hinweisFD ? "<span class='tag' title='" + TEXTE.meta.wiedervorlageTitel + "'>" + TEXTE.meta.wiedervorlage + "</span>" : "") +
    (f.hinweisSerie ? "<span class='tag' title='" + TEXTE.meta.themenSerieTitel + "'>" + TEXTE.meta.themenSerie + "</span>" : "") + "</div>";
}
/* FB-R1.3: „Zurücksetzen" fuer die vier Zuordnungs-Typen (zuordnung, matrix, beschriftung,
   baukasten). Wer sich einmal verlegt hat, musste bisher jede Zuweisung einzeln wieder anklicken.
   Der Knopf verwirft NUR den Zwischenstand; nach dem Pruefen verschwindet er, weil ein Reset dann
   nichts mehr bewirken koennte und nur verwirren wuerde. */
function resetKnopf(host, fn){
  var b = el("<button type='button' class='b leise reset-btn u-margin-top-8px' >" + TEXTE.aktion.zuruecksetzen + "</button>");
  b.onclick = fn;
  host.appendChild(b);
  return b;
}
/* FB-R2b.1: Taschenrechner + Notizfeld. Nutzer-Entscheid 2026-07-21: NUR bei den drei
   Rechen-Typen (generator, rechenassistent, kalkulation) – nicht global und ausdruecklich
   NICHT in der Pruefungssimulation, weil dort die Pruefungsbedingungen gelten sollen.
   Das Panel startet zugeklappt (statPanel-Default) und haengt UNTER den Eingabefeldern. */
function rechnerAnhaengen(host, opts){
  if (opts && (opts.simulation || opts.klausur)) return null;
  if (typeof rechnerPanel !== "function") return null;
  var p = rechnerPanel();
  host.appendChild(p);
  return p;
}
var R_TYP = {};
R_TYP.generator = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.rechenaufgabeZufall + "</div>"));
    var akzListen = f.antwort2 || [f.antwort], inputsG = [];
    akzListen.forEach(function(_, i){
      var reihe = el("<div class='u-margin-top-8px' >Antwort " + (akzListen.length > 1 ? (i+1) + " " : "") + (f.einheit && akzListen.length === 1 ? "(" + esc(f.einheit) + ") " : "") + ": </div>");
      var inp = el("<input class='luecke' style='width:190px'  autocomplete='off'>");
      inputsG.push(inp); reihe.appendChild(inp); R.appendChild(reihe);
    });
    rechnerAnhaengen(R, opts);                        // FB-R2b.1
    var doneG = false;
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneG) return; doneG = true;
      var alleOk = true;
      inputsG.forEach(function(inp, i){
        var ok = L.gradeLuecke(akzListen[i].map(String), inp.value);
        inp.style.borderBottomColor = ok ? "var(--gruen)" : "var(--rot)"; inp.disabled = true;
        if (!ok) alleOk = false;
      });
      if (!alleOk && !opts.klausur) R.appendChild(el("<div class='hinweis'>Richtig: " + akzListen.map(function(a){ return esc(String(a[0])); }).join(" · ") + "</div>"));
      var fbG = el("<div class='fb " + (alleOk ? "ok" : "nein") + "'><b>" + (alleOk ? "Richtig." : "Leider falsch.") + "</b></div>");
      fbHost.appendChild(fbG);
      fbHost.appendChild(el("<details class='lang' open><summary>Lösungsweg Schritt für Schritt</summary><div class='u-margin-top-8px' >" + f.weg.map(esc).join("<br>") + "</div></details>"));
      mutS(function(s){
        var stG = s.statistik["GEN:" + f.generator] = s.statistik["GEN:" + f.generator] || { richtig:0, gesamt:0 };
        stG.gesamt++; if (alleOk) stG.richtig++;
      }, false);   // transient: Persistenz folgt via verbucheAntwort() in fertig()
      fertig(alleOk, { keinFehlerDeck: true });          // Zufallswerte -> keine Wiedervorlage möglich
    }, {});
};
R_TYP.mc = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    var reihenfolge = L.shuffle([0,1,2,3]), gewaehlt = null, done = false;
    var btns = reihenfolge.map(function(oi){
      var b = el("<button class='opt'>" + esc(f.optionen[oi]) + "</button>");
      b.onclick = function(){ if (done) return; gewaehlt = oi; btns.forEach(function(x){x.classList.remove("gewaehlt");}); b.classList.add("gewaehlt"); aktionAn(); };
      R.appendChild(b); return b;
    });
    setAktion(TEXTE.aktion.pruefen, function(){
      if (done || gewaehlt == null) return; done = true;
      var korrekt = L.gradeMC(f, gewaehlt);
      btns.forEach(function(x,k){ if (reihenfolge[k] === f.loesungIndex) x.classList.add("richtig"); else if (reihenfolge[k] === gewaehlt) x.classList.add("falsch"); x.disabled = true; });
      zeigeFeedback(fbHost, f, korrekt, gewaehlt); if (!korrekt && !opts.simulation) zeigeDiagnose(fbHost, f, "mc", { gewaehlt: gewaehlt }); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.waehleAntwort });
};
R_TYP.lueckentext = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    var teile = f.frage.split("___"), inputs = [], p = el("<div class='frage-text'></div>");
    /* aria-label: sonst meldet ein Screenreader nur „Eingabefeld" ohne Position im Satz.
       Gleiche Benennung wie im Dropdown-/Lückenketten-Renderer (G1.5 #46), damit der Lerner
       typübergreifend dieselbe Ansage hört. */
    teile.forEach(function(t,i){ p.appendChild(document.createTextNode(t)); if (i < teile.length-1){ var inp = el("<input class='luecke' autocomplete='off'>"); inp.setAttribute("aria-label", TEXTE.aria.lueckePrefix + (i+1)); inputs.push(inp); p.appendChild(inp); } });
    R.appendChild(p);
    var doneL = false;
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneL) return; doneL = true;
      var korrekt = L.gradeLueckentext(f, inputs.map(function(x){return x.value;}));
      inputs.forEach(function(x,i){ x.style.borderBottomColor = L.gradeLuecke(f.luecken[i], x.value) ? "var(--gruen)" : "var(--rot)"; x.disabled = true; });
      if (!korrekt && !opts.klausur) R.appendChild(el("<div class='hinweis'>Richtige Lösung: " + esc(f.luecken.map(function(l){return l[0];}).join(" · ")) + "</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, {});
};
R_TYP.zuordnung = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    var links = f.paare.map(function(p,i){return {t:p[0], i:i};});
    var rechts = L.shuffle(f.paare.map(function(p,i){return {t:p[1], i:i};}));
    var zu = {}, wahlLinks = null, doneZ = false;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.zuordnungDragDropLoeser + "</div>"));
    /* FB-R2b (2026-07-21): LINKS/RECHTS-LAYOUT. Bis hierher standen beide Listen UNTEREINANDER –
       man sah nicht, was Quelle und was Ziel ist, und musste bei langen Listen scrollen, um ein
       Paar zu bilden. Jetzt zwei Spalten mit Überschrift.
       WIEDERVERWENDUNG statt Neubau: `.split` gibt es in styles.css bereits (grid 1fr 1fr) und
       bringt die Handy-Regel gleich mit – `@media (max-width:860px)` klappt auf EINE Spalte um.
       Damit ist der Punkt „Links/Rechts-Layout, am Handy einspaltig" ohne neues CSS erfüllt.
       Die Überschriften sitzen bewusst in eigenen Wrappern: `zeichne()` setzt lBox/rBox per
       innerHTML neu – lägen sie im selben Element, würde jede Neuzeichnung sie mitlöschen
       (dieselbe Falle wie bei den <details>-Panels in R1.6). */
    var lBox = el("<div></div>"), rBox = el("<div></div>"), pBox = el("<div class='u-margin-top-8px' ></div>");
    var lWrap = el("<div><div class='kicker'>" + TEXTE.hinweis.zuordnungLinks + "</div></div>");
    var rWrap = el("<div><div class='kicker'>" + TEXTE.hinweis.zuordnungRechts + "</div></div>");
    lWrap.appendChild(lBox); rWrap.appendChild(rBox);
    var zuGrid = el("<div class='split zu-split'></div>");
    zuGrid.appendChild(lWrap); zuGrid.appendChild(rWrap);
    R.appendChild(zuGrid); R.appendChild(pBox);
    function zeichne(){
      lBox.innerHTML=""; rBox.innerHTML=""; pBox.innerHTML="";
      links.forEach(function(o){ if (zu[o.i]!=null) return; var b = el("<span class='zu-item" + (wahlLinks===o.i?" gewaehlt":"") + "'>" + esc(o.t) + "</span>");
        b.onclick=function(){ if(doneZ)return; wahlLinks=(wahlLinks===o.i)?null:o.i; zeichne(); };
        if(!doneZ){ b.draggable=true; b.style.cursor="grab"; b.ondragstart=function(ev){ ev.dataTransfer.setData("text/plain","L"+o.i); ev.dataTransfer.effectAllowed="move"; wahlLinks=o.i; }; chipTastatur(b); }
        lBox.appendChild(b); });
      rechts.forEach(function(o){ if (Object.keys(zu).some(function(k){return zu[k]===o.i;})) return; var b = el("<span class='zu-item'>" + esc(o.t) + "</span>");
        b.onclick=function(){ if(doneZ||wahlLinks==null)return; zu[wahlLinks]=o.i; wahlLinks=null; zeichne(); };
        if(!doneZ){ b.ondragover=function(ev){ ev.preventDefault(); b.classList.add("gewaehlt"); }; b.ondragleave=function(){ b.classList.remove("gewaehlt"); }; b.ondrop=function(ev){ ev.preventDefault(); var d=ev.dataTransfer.getData("text/plain"); if(d.charAt(0)==="L"){ zu[+d.slice(1)]=o.i; wahlLinks=null; zeichne(); } }; chipTastatur(b); }
        rBox.appendChild(b); });
      Object.keys(zu).forEach(function(k){ var b = el("<div class='zu-paar'>" + esc(f.paare[k][0]) + " → " + esc(f.paare[zu[k]][1]) + "</div>"); b.onclick=function(){ if(doneZ)return; delete zu[k]; zeichne(); }; if(!doneZ) chipTastatur(b); pBox.appendChild(b); });
      if (!doneZ) document.getElementById("btnAktion").disabled = Object.keys(zu).length !== f.paare.length;
    }
    var rbZ = resetKnopf(R, function(){ if (doneZ) return; zu = {}; wahlLinks = null; zeichne(); });   // FB-R1.3
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneZ || Object.keys(zu).length !== f.paare.length) return; doneZ = true;
      rbZ.style.display = "none";
      var korrekt = L.gradeZuordnung(f, zu);
      pBox.querySelectorAll(".zu-paar").forEach(function(x,i){ var k = Object.keys(zu)[i]; x.style.borderColor = (f.paare[zu[k]] && f.paare[zu[k]][1] === f.paare[+k][1]) ? "var(--gruen)" : "var(--rot)"; });
      if (!korrekt) R.appendChild(el("<div class='hinweis'>Richtig wäre: " + f.paare.map(function(p){return esc(p[0]) + " → " + esc(p[1]);}).join(" · ") + "</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.ordneAllePaare });
    zeichne();
};
R_TYP.mehrfach = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.mehrfachauswahl + "</div>"));
    var reihenfolgeM = L.shuffle(f.optionen.map(function(_,i){return i;}));
    var gewaehltM = {}, doneM = false;
    var boxesM = reihenfolgeM.map(function(oi){
      var b = el("<label class='check' style='display:flex;align-items:flex-start;gap:8px;margin:7px 0' ><input type='checkbox'><span>" + esc(f.optionen[oi]) + "</span></label>");
      var cb = b.querySelector("input");
      cb.onchange = function(){ if (doneM){ cb.checked = !cb.checked; return; } if (cb.checked) gewaehltM[oi]=1; else delete gewaehltM[oi]; document.getElementById("btnAktion").disabled = Object.keys(gewaehltM).length===0; };
      R.appendChild(b); return { b:b, oi:oi, cb:cb };
    });
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneM) return; var sel = Object.keys(gewaehltM).map(Number); if (!sel.length) return; doneM = true;
      var korrekt = L.gradeMehrfach(f, sel);
      boxesM.forEach(function(x){ var soll = f.loesungIndizes.indexOf(x.oi)>=0; x.cb.disabled = true; var span = x.b.querySelector("span");
        if (soll){ x.b.style.color="var(--gruen)"; span.innerHTML += " <b>(richtig)</b>"; }
        else if (x.cb.checked){ x.b.style.color="var(--rot)"; span.innerHTML += " <b>(falsch gewählt)</b>"; } });
      zeigeFeedback(fbHost, f, korrekt); if (!korrekt && !opts.simulation) zeigeDiagnose(fbHost, f, "mehrfach", { gewaehlt: sel }); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.waehleAlleRichtigen });
};
R_TYP.mtf = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.mtfAuswahl + "</div>"));
    var antwortMtf = new Array(f.aussagen.length).fill(null), doneMtf = false, rowsMtf = [];
    var allBeantwortet = function(){ return antwortMtf.length === f.aussagen.length && !antwortMtf.some(function(v){ return typeof v !== "boolean"; }); };
    f.aussagen.forEach(function(a, i){
      var row = el("<div class='mtf-zeile' ></div>");
      var wahl = el("<div class='mtf-wahl' ></div>");
      var mkBtn = function(istWahr, label){
        var b = el("<button type='button' class='b leise mtf-btn' >" + esc(label) + "</button>");
        b.onclick = function(){
          if (doneMtf) return;
          antwortMtf[i] = istWahr;
          Array.prototype.forEach.call(wahl.querySelectorAll("button"), function(x){ x.classList.remove("aktiv"); });
          b.classList.add("aktiv");
          document.getElementById("btnAktion").disabled = !allBeantwortet();
        };
        chipTastatur(b); return b;
      };
      var bw = mkBtn(true, TEXTE.hinweis.mtfWahr), bf = mkBtn(false, TEXTE.hinweis.mtfFalsch);
      wahl.appendChild(bw); wahl.appendChild(bf);
      var txt = el("<div class='mtf-text' >" + esc(a.text) + "</div>");
      row.appendChild(wahl); row.appendChild(txt);
      R.appendChild(row); rowsMtf.push({ bw:bw, bf:bf, i:i, txt:txt });
    });
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneMtf || !allBeantwortet()) return; doneMtf = true;
      var korrekt = L.grade(f, antwortMtf), treffer = L.mtfTreffer(f, antwortMtf), n = f.aussagen.length;
      rowsMtf.forEach(function(x){
        x.bw.disabled = true; x.bf.disabled = true;
        var sollWahr = !!f.aussagen[x.i].wahr, ok = (antwortMtf[x.i] === sollWahr);
        (sollWahr ? x.bw : x.bf).classList.add("mtf-soll");
        x.txt.innerHTML += ok ? " <b class='mtf-ok'>✓</b>"
          : " <b class='mtf-fehl'>✗ (richtig: " + esc(sollWahr ? TEXTE.hinweis.mtfWahr : TEXTE.hinweis.mtfFalsch) + ")</b>";
      });
      fbHost.appendChild(el("<div class='hinweis u-margin-top-6px' >" + treffer + "/" + n + " Aussagen korrekt (" + Math.round(treffer / n * 100) + " %)</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.mtfAlleMarkieren });
};
R_TYP.kreuztabelle = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.kreuztabelleAnkreuzen + "</div>"));
    // Antwort-Matrix voll initialisiert (jede Zelle definierter Bool – kein sparse-Loch, vgl. C1-Bug-Lehre).
    var antwortKt = f.zeilen.map(function(){ return f.spalten.map(function(){ return false; }); });
    var doneKt = false, boxesKt = [];
    var mindEins = function(){ return antwortKt.some(function(row){ return row.some(Boolean); }); };
    var tbl = el("<table class='kt-tabelle'></table>");
    var kopf = document.createElement("tr");
    /* Die Eckzelle ist absichtlich leer – sie steht nur über der Zeilenbeschriftung und ist Kopf
       von gar nichts. role="presentation" nimmt ihr die Kopfzellen-Rolle; damit ist sie für den
       Screenreader kein namenloser Spaltenkopf mehr und axe (empty-table-header, Selektor
       `th:not([role])`) greift nicht mehr.
       ⚠️ Bewusst KEIN aria-label: ein Name würde eine Überschrift VORTÄUSCHEN, die es nicht gibt.
       ⚠️ Bewusst weiter ein <th>, nicht <td> – die Gestaltung hängt an `.kt-tabelle th.kt-ecke`
       (styles.css:358); ein Elementwechsel wäre eine Optik-Änderung ohne Gegenwert. */
    var ecke = document.createElement("th"); ecke.className = "kt-ecke"; ecke.setAttribute("role", "presentation"); kopf.appendChild(ecke);
    f.spalten.forEach(function(s){ var th = document.createElement("th"); th.className = "kt-spalte"; th.textContent = s; kopf.appendChild(th); });
    tbl.appendChild(kopf);
    f.zeilen.forEach(function(zl, r){
      var tr = document.createElement("tr");
      var zh = document.createElement("th"); zh.className = "kt-zeile"; zh.textContent = zl; tr.appendChild(zh);
      var reihe = [];
      f.spalten.forEach(function(sp, c){
        var td = document.createElement("td"); td.className = "kt-zelle";
        var b = el("<button type='button' class='b leise kt-box' aria-pressed='false' ></button>");
        b.setAttribute("aria-label", zl + " / " + sp);
        b.onclick = function(){
          if (doneKt) return;
          antwortKt[r][c] = !antwortKt[r][c];
          b.classList.toggle("kt-an", antwortKt[r][c]);
          b.setAttribute("aria-pressed", antwortKt[r][c] ? "true" : "false");
          b.textContent = antwortKt[r][c] ? "✓" : "";
          document.getElementById("btnAktion").disabled = !mindEins();
        };
        chipTastatur(b);
        td.appendChild(b); tr.appendChild(td); reihe.push({ b:b, r:r, c:c });
      });
      tbl.appendChild(tr); boxesKt.push(reihe);
    });
    /* 2026-07-30: Scroll-Wrapper, s. .tabelle-scroll in styles.css */
    var wrapKt = el("<div class='tabelle-scroll'></div>"); wrapKt.appendChild(tbl); R.appendChild(wrapKt);
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneKt || !mindEins()) return; doneKt = true;
      var korrekt = L.grade(f, antwortKt), treffer = L.kreuztabelleTreffer(f, antwortKt);
      var gesamt = f.zeilen.length * f.spalten.length;
      boxesKt.forEach(function(reihe){
        reihe.forEach(function(x){
          x.b.disabled = true;
          var soll = !!f.loesung[x.r][x.c], ist = antwortKt[x.r][x.c];
          if (soll) x.b.classList.add("kt-soll");
          if (ist !== soll) x.b.classList.add(soll ? "kt-fehlt" : "kt-zuviel");
        });
      });
      fbHost.appendChild(el("<div class='hinweis u-margin-top-6px' >" + treffer + "/" + gesamt + " Zellen korrekt (" + Math.round(treffer / gesamt * 100) + " %)</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.kreuztabelleMinEins });
};
R_TYP.szenario2 = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, fertig = ctx.fertig;
    var s1 = f.schritt1, s2 = f.schritt2;
    // Antwort voll definiert initialisiert (kein sparse-Loch, vgl. C1-Bug-Lehre).
    var antwortSz = { s1: null, s2: null }, doneSz = false;
    var beide = function(){ return antwortSz.s1 != null && antwortSz.s2 != null; };
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.szenario2Ablauf + "</div>"));
    // --- Schritt 1 ---
    R.appendChild(el("<div class='sz-schritt'>" + TEXTE.hinweis.szenario2Schritt1 + "</div>"));
    R.appendChild(el("<div class='frage-text sz-frage'>" + esc(s1.frage) + "</div>"));
    var konsequenz = el("<div class='sz-konsequenz' style='display:none'></div>");
    var box2 = el("<div class='sz-box2' style='display:none'></div>");
    var btns1 = s1.optionen.map(function(txt, oi){
      var b = el("<button class='opt sz-opt'>" + esc(txt) + "</button>");
      b.onclick = function(){
        if (doneSz) return;
        antwortSz.s1 = oi;
        btns1.forEach(function(x){ x.classList.remove("gewaehlt"); });
        b.classList.add("gewaehlt");
        konsequenz.innerHTML = "<b>" + TEXTE.hinweis.szenario2Konsequenz + "</b> " + esc(f.feedback1[oi] || "");
        konsequenz.style.display = ""; box2.style.display = "";
        document.getElementById("btnAktion").disabled = !beide();
      };
      chipTastatur(b); R.appendChild(b); return b;
    });
    R.appendChild(konsequenz);
    // --- Schritt 2 (erst nach Schritt-1-Wahl sichtbar) ---
    box2.appendChild(el("<div class='sz-schritt'>" + TEXTE.hinweis.szenario2Schritt2 + "</div>"));
    box2.appendChild(el("<div class='frage-text sz-frage'>" + esc(s2.frage) + "</div>"));
    var btns2 = s2.optionen.map(function(txt, oi){
      var b = el("<button class='opt sz-opt'>" + esc(txt) + "</button>");
      b.onclick = function(){
        if (doneSz) return;
        antwortSz.s2 = oi;
        btns2.forEach(function(x){ x.classList.remove("gewaehlt"); });
        b.classList.add("gewaehlt");
        document.getElementById("btnAktion").disabled = !beide();
      };
      chipTastatur(b); box2.appendChild(b); return b;
    });
    R.appendChild(box2);
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneSz || !beide()) return; doneSz = true;
      var korrekt = L.grade(f, antwortSz), treffer = L.szenario2Treffer(f, antwortSz);
      btns1.forEach(function(x, oi){ x.disabled = true; if (oi === s1.loesungIndex) x.classList.add("richtig"); else if (oi === antwortSz.s1) x.classList.add("falsch"); });
      btns2.forEach(function(x, oi){ x.disabled = true; if (oi === s2.loesungIndex) x.classList.add("richtig"); else if (oi === antwortSz.s2) x.classList.add("falsch"); });
      fbHost.appendChild(el("<div class='hinweis u-margin-top-6px' >" + treffer + "/2 Schritte richtig (" + Math.round(treffer / 2 * 100) + " %)</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.szenario2BeideWaehlen });
};
R_TYP.reihenfolge = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.reihenfolgeDragDrop + "</div>"));
    var ordR = L.shuffle(f.schritte.map(function(_,i){return i;})); var doneR = false;
    var listR = el("<div></div>"); R.appendChild(listR);
    function zeichneR(){
      listR.innerHTML = "";
      ordR.forEach(function(oi,pos){
        var row = el("<div class='opt' style='display:flex;align-items:center;gap:8px;cursor:default' ><span style='font-family:var(--f-mono);color:var(--text2);min-width:22px' >" + (pos+1) + ".</span><span class='u-flex-1' >" + esc(f.schritte[oi]) + "</span></div>");
        if (doneR){ row.style.borderColor = (oi===pos) ? "var(--gruen)" : "var(--rot)"; }
        else {
          row.draggable = true; row.style.cursor = "grab";
          row.ondragstart = function(ev){ ev.dataTransfer.setData("text/plain", String(pos)); ev.dataTransfer.effectAllowed = "move"; row.style.opacity = ".45"; };
          row.ondragend = function(){ row.style.opacity = ""; };
          row.ondragover = function(ev){ ev.preventDefault(); row.style.borderColor = "var(--gelb)"; };
          row.ondragleave = function(){ row.style.borderColor = ""; };
          row.ondrop = function(ev){ ev.preventDefault(); var from = +ev.dataTransfer.getData("text/plain"); var to = pos; if (isNaN(from) || from===to) { zeichneR(); return; } var it = ordR.splice(from,1)[0]; ordR.splice(to,0,it); zeichneR(); };
          var up = el("<button class='b leise' style='padding:2px 8px' >" + TEXTE.aktion.hoch + "</button>");
          var dn = el("<button class='b leise' style='padding:2px 8px' >" + TEXTE.aktion.runter + "</button>");
          up.disabled = pos===0; dn.disabled = pos===ordR.length-1;
          up.onclick = function(){ var t=ordR[pos]; ordR[pos]=ordR[pos-1]; ordR[pos-1]=t; zeichneR(); };
          dn.onclick = function(){ var t=ordR[pos]; ordR[pos]=ordR[pos+1]; ordR[pos+1]=t; zeichneR(); };
          row.appendChild(up); row.appendChild(dn);
        }
        listR.appendChild(row);
      });
    }
    zeichneR();
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneR) return; doneR = true;
      var korrekt = L.gradeReihenfolge(f, ordR); zeichneR();
      if (!korrekt) R.appendChild(el("<div class='hinweis'>Richtige Reihenfolge: " + f.schritte.map(function(s,i){ return (i+1)+". "+esc(s); }).join(" · ") + "</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, {});
};
R_TYP.dropdown = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    var teileD = f.frage.split("___");
    var textModusD = !!f.freitext;     // #102 Startmodus je Aufgabe (Nutzer-Entscheid: Standard Freitext bei lueckenkette)
    var doneD = false, felderD = [], toggleD = null;
    var wrapD = el("<div></div>"); R.appendChild(wrapD);
    var offenD = function(){ return textModusD ? felderD.some(function(x){ return !x.value.trim(); }) : felderD.some(function(s){ return s.value==="-1"; }); };
    var sperreD = function(){ var b=document.getElementById("btnAktion"); if(b) b.disabled = offenD(); };
    function zeichneD(){
      wrapD.innerHTML = ""; felderD = [];
      toggleD = el("<button type='button' class='b leise u-margin-bottom-6px' >" + (textModusD ? TEXTE.aktion.alsAuswahl : TEXTE.aktion.alsFreitext) + "</button>");
      toggleD.onclick = function(){ if (doneD) return; textModusD = !textModusD; zeichneD(); };
      wrapD.appendChild(toggleD);
      wrapD.appendChild(el("<div class='hinweis'>" + (textModusD ? TEXTE.hinweis.lueckenketteFreitext : TEXTE.hinweis.waehleDropdownFeld) + "</div>"));
      var pD = el("<div class='frage-text'></div>");
      teileD.forEach(function(txt,i){
        pD.appendChild(document.createTextNode(txt));
        if (i < teileD.length-1){
          if (textModusD){
            var inp = el("<input class='luecke' autocomplete='off'>");
            inp.setAttribute("aria-label", TEXTE.aria.lueckePrefix + (i+1));   // G1.5 #46
            inp.oninput = sperreD; felderD.push(inp); pD.appendChild(inp);
          } else {
            var sel = el("<select class='u-margin-0-4px' ><option value='-1'>— wählen —</option></select>");
            sel.setAttribute("aria-label", TEXTE.aria.lueckePrefix + (i+1));   // G1.5 #46
            f.luecken[i].optionen.forEach(function(opt,oi){ var o=document.createElement("option"); o.value=oi; o.textContent=opt; sel.appendChild(o); });
            sel.onchange = sperreD; felderD.push(sel); pD.appendChild(sel);
          }
        }
      });
      wrapD.appendChild(pD); sperreD();
    }
    zeichneD();
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneD || offenD()) return; doneD = true;
      if (toggleD) toggleD.disabled = true;
      var korrekt;
      if (textModusD){
        var eing = felderD.map(function(x){ return x.value; });
        korrekt = L.gradeDropdownText(f, eing);
        felderD.forEach(function(x,i){ x.disabled = true; x.style.borderBottomColor = L.gradeLuecke(L.dropdownAkzeptiert(f.luecken[i]), x.value) ? "var(--gruen)" : "var(--rot)"; });
      } else {
        var auswahl = felderD.map(function(s){ return +s.value; });
        korrekt = L.gradeDropdown(f, auswahl);
        felderD.forEach(function(s,i){ s.disabled = true; s.style.borderColor = (auswahl[i]===f.luecken[i].loesung) ? "var(--gruen)" : "var(--rot)"; });
        if (!korrekt && !opts.simulation) zeigeDiagnose(fbHost, f, "dropdown", { auswahl: auswahl });
      }
      if (!korrekt && !opts.klausur) wrapD.appendChild(el("<div class='hinweis'>Richtig: " + f.luecken.map(function(l){ return esc(l.optionen[l.loesung]); }).join(" · ") + "</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.fuerJedeLuecke });
};
R_TYP.hotspot = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.hotspotBild + "</div>"));
    var svgH = f.svg.replace(/<\/svg>/i, f.zonen.map(function(z,i){
      /* ⚠️ aria-label IST PFLICHT, NICHT SCHMUCK (2026-07-27). chipTastatur() setzt unten
         role="button" auf dieses <rect>. Ein <rect> hat aber KEINEN Textinhalt, aus dem ein
         zugaenglicher Name entstehen koennte – ohne aria-label sind das fuer Screenreader
         namenlose Schalter ("Schaltflaeche, Schaltflaeche, Schaltflaeche"). axe meldet das als
         aria-command-name (serious). Bei der Kreuztabelle ist derselbe Griff seit jeher da
         (siehe b.setAttribute("aria-label", zl + " / " + sp) weiter oben) – hier fehlte er.
         Jede Zone im Pool hat ein `label`; der Fallback greift nur bei kuenftigen Fragen. */
      var name = z.label ? String(z.label) : ("Zone " + (i + 1));
      return "<rect class='u-cursor-pointer' x='" + z.x + "' y='" + z.y + "' width='" + z.w + "' height='" + z.h + "' rx='3' fill='rgba(244,194,13,0.07)' stroke='var(--gelb-hover)' stroke-width='1.5' stroke-dasharray='4 3' pointer-events='all' data-hz='" + i + "' aria-label='" + esc(name) + "' ></rect>";
    }).join("") + "</svg>");
    /* FB-R1.4: kein Tap-Zoom – das SVG ist hier die Antwortflaeche (Zonen anklicken). Lupe bleibt. */
    var boxH = svgBox(svgH, TEXTE.aufgabe.netzplanDiagrammAlt, { keinTapZoom:true }); R.appendChild(boxH);
    var doneH = false;
    Array.prototype.forEach.call(boxH.querySelectorAll("[data-hz]"), function(rect){
      chipTastatur(rect);   // R10 (a): SVG-Zone fokussier-/tastaturbedienbar
      rect.onclick = function(){
        if (doneH) return; doneH = true;
        var idx = +rect.getAttribute("data-hz");
        var korrekt = L.gradeHotspot(f, idx);
        Array.prototype.forEach.call(boxH.querySelectorAll("[data-hz]"), function(r){
          var zi = +r.getAttribute("data-hz"); r.style.cursor = "default";
          if (f.zonen[zi].richtig){ r.setAttribute("stroke","var(--gruen)"); r.setAttribute("fill","rgba(46,125,85,0.18)"); }
          else if (zi===idx){ r.setAttribute("stroke","var(--rot)"); r.setAttribute("fill","rgba(190,65,59,0.18)"); }
        });
        if (f.zonen[idx] && f.zonen[idx].label) R.appendChild(el("<div class='hinweis'>Gewählt: " + esc(f.zonen[idx].label) + "</div>"));
        zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
      };
    });
    setAktion(TEXTE.aktion.insBildKlicken, function(){}, { disabled:true, hinweis:TEXTE.hinweis.klickeStelleBildKurz });
};
R_TYP.fehlersuche = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.fehlersucheZeile + "</div>"));
    var codeBox = el("<div style='font-family:var(--f-mono);font-size:.85rem;background:var(--g100);border:1px solid var(--rand);border-radius:8px;overflow:auto' ></div>");
    var doneF = false;
    var zeilenEls = f.zeilen.map(function(z,i){
      var row = el("<div class='u-display-flex u-gap-10px u-padding-5px-10px u-cursor-pointer u-border-left-3px-solid-transparent' ><span style='color:var(--text2);min-width:22px;text-align:right' >" + (i+1) + "</span><span class='u-white-space-pre' >" + esc(z) + "</span></div>");
      row.onmouseover = function(){ if(!doneF) row.style.background = "var(--gelb-wash)"; };
      row.onmouseout = function(){ if(!doneF) row.style.background = ""; };
      row.onclick = function(){
        if (doneF) return; doneF = true;
        var korrekt = L.gradeFehlersuche(f, i);
        zeilenEls.forEach(function(r,ri){ r.onmouseover=null; r.onmouseout=null; r.style.cursor="default";
          if (ri===f.fehlerZeile){ r.style.background="rgba(46,125,85,0.18)"; r.style.borderLeftColor="var(--gruen)"; }
          else if (ri===i){ r.style.background="rgba(190,65,59,0.18)"; r.style.borderLeftColor="var(--rot)"; } });
        zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
      };
      chipTastatur(row);   // R10 (a)
      codeBox.appendChild(row); return row;
    });
    R.appendChild(codeBox);
    setAktion(TEXTE.aktion.fehlerhafteZeile, function(){}, { disabled:true, hinweis:TEXTE.hinweis.klickeFehlerhafteZeileKurz });
};
R_TYP.rechenassistent = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.rechenassistentSchritt + "</div>"));
    var inputsRA = f.schritte.map(function(s,i){
      var row = el("<div class='u-margin-9px-0' ><div class='u-font-size-92rem u-margin-bottom-3px' >" + (i+1) + ". " + esc(s.text) + (s.einheit ? " (" + esc(s.einheit) + ")" : "") + "</div></div>");
      var inp = el("<input class='luecke' style='width:210px'  autocomplete='off'>");
      /* Der Schritt-Text steht als sichtbare Zeile darüber, ist aber NICHT mit dem Feld verbunden.
         Name = derselbe Text, damit die Ansage den Rechenschritt nennt statt „Eingabefeld". */
      inp.setAttribute("aria-label", TEXTE.aria.schrittPrefix + (i+1) + ": " + s.text + (s.einheit ? " (" + s.einheit + ")" : ""));
      row.appendChild(inp); R.appendChild(row); return inp;
    });
    rechnerAnhaengen(R, opts);                        // FB-R2b.1
    var doneRA = false;
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneRA) return; doneRA = true;
      var eing = inputsRA.map(function(x){ return x.value; });
      var korrekt = L.gradeRechenassistent(f, eing);
      inputsRA.forEach(function(x,i){ x.disabled = true; x.style.borderBottomColor = L.gradeLuecke(f.schritte[i].loesung, x.value) ? "var(--gruen)" : "var(--rot)"; });
      if (!korrekt) R.appendChild(el("<div class='hinweis'>Richtige Zwischenergebnisse: " + f.schritte.map(function(s){ return esc(s.loesung[0]); }).join(" · ") + "</div>"));
      zeigeFeedback(fbHost, f, korrekt); if (!korrekt && !opts.simulation) zeigeDiagnose(fbHost, f, "rechenassistent", { eingaben: eing, felder: inputsRA }); fertig(korrekt);
    }, {});
};
R_TYP.matrix = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.matrixZiehen + "</div>"));
    var zuMx = {}, doneMx = false, wahlMx = null;
    var poolMx = el("<div class='u-display-flex u-flex-wrap-wrap u-gap-6px u-margin-bottom-12px' ></div>"); R.appendChild(poolMx);
    if (f.xAchse) R.appendChild(el("<div class='kicker u-text-align-center u-margin-bottom-2px' >" + esc(f.xAchse) + "</div>"));
    var reihe = el("<div class='u-display-flex u-gap-6px u-align-items-stretch' ></div>");
    if (f.yAchse) reihe.appendChild(el("<div class='kicker u-writing-mode-vertical-rl u-transform-rotate-180deg u-align-self-center' >" + esc(f.yAchse) + "</div>"));
    var mgrid = el("<div class='u-flex-1 u-display-grid u-grid-template-columns-1fr-1fr u-grid-template-rows-1fr-1fr u-gap-6px' ></div>");
    var zonenMx = [0,1,2,3].map(function(qi){
      var z = el("<div style='min-height:78px;border:2px dashed var(--g300);border-radius:8px;padding:7px' ><div class='kicker'>" + esc(f.quadranten[qi]) + "</div><div class='qc u-display-flex u-flex-wrap-wrap u-gap-5px u-margin-top-6px' ></div></div>");
      z.ondragover = function(ev){ ev.preventDefault(); if(!doneMx) z.style.borderColor="var(--gelb)"; };
      z.ondragleave = function(){ z.style.borderColor=""; };
      z.ondrop = function(ev){ ev.preventDefault(); if(doneMx)return; var ei=+ev.dataTransfer.getData("text/plain"); if(!isNaN(ei)){ zuMx[ei]=qi; wahlMx=null; zeichneMx(); } };
      z.onclick = function(){ if(doneMx||wahlMx==null)return; zuMx[wahlMx]=qi; wahlMx=null; zeichneMx(); };
      chipTastatur(z);   // R10 (a)
      mgrid.appendChild(z); return z;
    });
    reihe.appendChild(mgrid); R.appendChild(reihe);
    function zeichneMx(){
      poolMx.innerHTML=""; zonenMx.forEach(function(z){ z.querySelector(".qc").innerHTML=""; });
      f.elemente.forEach(function(e,ei){
        var chip = el("<span class='zu-item" + (wahlMx===ei?" gewaehlt":"") + "'>" + esc(e.text) + "</span>");
        if(!doneMx){ chip.style.cursor="grab"; chip.draggable=true;
          chip.ondragstart=function(ev){ ev.dataTransfer.setData("text/plain",String(ei)); wahlMx=ei; };
          chip.onclick=function(){ if(zuMx[ei]!=null){ delete zuMx[ei]; wahlMx=null; } else { wahlMx=(wahlMx===ei)?null:ei; } zeichneMx(); };
          chipTastatur(chip);
        } else { var ri=zuMx[ei]===e.quadrant; chip.style.borderColor=ri?"var(--gruen)":"var(--rot)"; chip.style.background=ri?"rgba(46,125,85,0.12)":"rgba(190,65,59,0.12)"; }
        if(zuMx[ei]==null) poolMx.appendChild(chip); else zonenMx[zuMx[ei]].querySelector(".qc").appendChild(chip);
      });
      if(!doneMx) document.getElementById("btnAktion").disabled = f.elemente.some(function(_,ei){return zuMx[ei]==null;});
    }
    zeichneMx();
    var rbMx = resetKnopf(R, function(){ if (doneMx) return; zuMx = {}; wahlMx = null; zeichneMx(); });   // FB-R1.3
    setAktion(TEXTE.aktion.pruefen, function(){
      if(doneMx || f.elemente.some(function(_,ei){return zuMx[ei]==null;}))return; doneMx=true;
      rbMx.style.display = "none";
      var korrekt=L.gradeMatrix(f,zuMx); zeichneMx();
      if(!korrekt && !opts.klausur) R.appendChild(el("<div class='hinweis'>Richtig: " + f.elemente.map(function(e){return esc(e.text)+" → "+esc(f.quadranten[e.quadrant]);}).join(" · ") + "</div>"));
      zeigeFeedback(fbHost,f,korrekt); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.ordneElementeMatrix });
};
R_TYP.beschriftung = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.beschriftungZiehenLoeser + "</div>"));
    var zuBs = {}, doneBs = false, wahlBs = null, labelsShuffled = L.shuffle(f.labels);
    var poolBs = el("<div class='u-display-flex u-flex-wrap-wrap u-gap-6px u-margin-8px-0' ></div>"); R.appendChild(poolBs);
    var slotsBox = el("<div></div>"); R.appendChild(slotsBox);
    var slotEls = f.ziele.map(function(z,i){
      var row = el("<div class='u-display-flex u-align-items-center u-gap-8px u-margin-5px-0' ><span style='font-family:var(--f-mono);color:var(--text2);min-width:26px' >" + (z.nr!=null?z.nr:(i+1)) + ".</span></div>");
      var slot = el("<div style='flex:1;min-height:34px;border:2px dashed var(--g300);border-radius:8px;padding:5px 8px' ></div>");
      slot.ondragover=function(ev){ ev.preventDefault(); if(!doneBs) slot.style.borderColor="var(--gelb)"; };
      slot.ondragleave=function(){ slot.style.borderColor=""; };
      slot.ondrop=function(ev){ ev.preventDefault(); if(doneBs)return; var lab=ev.dataTransfer.getData("text/plain"); if(lab){ zuBs[i]=lab; wahlBs=null; zeichneBs(); } };
      slot.onclick=function(){ if(doneBs||wahlBs==null)return; zuBs[i]=wahlBs; wahlBs=null; zeichneBs(); };
      chipTastatur(slot);   // R10 (a)
      /* chipTastatur setzt role="button". Der Slot ist bis zur ersten Ablage LEER – also ohne Namen.
         Die sichtbare Nummer steht im <span> DANEBEN, nicht im Slot. Gleiche Wurzel wie hotspot. */
      slot.setAttribute("aria-label", TEXTE.aria.ablagePrefix + (z.nr!=null?z.nr:(i+1)));
      row.appendChild(slot); slotsBox.appendChild(row); return slot;
    });
    function zeichneBs(){
      poolBs.innerHTML=""; slotEls.forEach(function(s){ s.innerHTML=""; if(!doneBs) s.style.borderColor=""; });
      var benutzt={}; Object.keys(zuBs).forEach(function(k){ benutzt[zuBs[k]]=true; });
      labelsShuffled.forEach(function(lab){
        if(benutzt[lab]) return;
        var chip = el("<span class='zu-item" + (wahlBs===lab?" gewaehlt":"") + "'>" + esc(lab) + "</span>");
        if(!doneBs){ chip.style.cursor="grab"; chip.draggable=true; chip.ondragstart=function(ev){ ev.dataTransfer.setData("text/plain",lab); wahlBs=lab; }; chip.onclick=function(){ wahlBs=(wahlBs===lab)?null:lab; zeichneBs(); }; chipTastatur(chip); }
        poolBs.appendChild(chip);
      });
      slotEls.forEach(function(s,i){
        if(zuBs[i]==null) return;
        var chip = el("<span class='zu-item'>" + esc(zuBs[i]) + "</span>");
        if(doneBs){ var ri=zuBs[i]===f.ziele[i].loesung; chip.style.borderColor=ri?"var(--gruen)":"var(--rot)"; chip.style.background=ri?"rgba(46,125,85,0.12)":"rgba(190,65,59,0.12)"; }
        else { chip.style.cursor="pointer"; chip.onclick=function(){ delete zuBs[i]; zeichneBs(); }; chipTastatur(chip); }
        s.appendChild(chip);
      });
      if(!doneBs) document.getElementById("btnAktion").disabled = f.ziele.some(function(_,i){return zuBs[i]==null;});
    }
    zeichneBs();
    /* FB-R1.5: die Grafik steht jetzt UNTER der Antwortflaeche. Vorher schob sie auf dem Handy
       Chips und Slots aus dem Bild – man sah beim Zuordnen entweder die Auswahl oder die Grafik,
       nie beides. Der Tap-Zoom aus R1.4 macht die Grafik an dieser Stelle weiterhin gross lesbar. */
    if (f.svg) R.appendChild(svgBox(f.svg, svgAltFuer(f)));
    var rbBs = resetKnopf(R, function(){ if (doneBs) return; zuBs = {}; wahlBs = null; zeichneBs(); });   // FB-R1.3
    setAktion(TEXTE.aktion.pruefen, function(){
      if(doneBs || f.ziele.some(function(_,i){return zuBs[i]==null;}))return; doneBs=true;
      rbBs.style.display = "none";
      var korrekt=L.gradeBeschriftung(f,zuBs); zeichneBs();
      if(!korrekt && !opts.klausur) R.appendChild(el("<div class='hinweis'>Richtig: " + f.ziele.map(function(z,i){return (z.nr!=null?z.nr:(i+1))+". "+esc(z.loesung);}).join(" · ") + "</div>"));
      zeigeFeedback(fbHost,f,korrekt); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.ordneStellenZu });
};
R_TYP.trace = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.traceSchreibtisch + "</div>"));
    R.appendChild(el("<div style='font-family:var(--f-mono);font-size:.85rem;background:var(--g100);border:1px solid var(--rand);border-radius:8px;padding:8px 10px;white-space:pre;overflow:auto;margin-bottom:10px' >" + f.code.map(esc).join("\n") + "</div>"));
    var tblT = el("<table class='spick-table'></table>");
    var thT = document.createElement("tr"); f.spalten.forEach(function(s){ var th=document.createElement("th"); th.textContent=s; thT.appendChild(th); }); tblT.appendChild(thT);
    /* ⚠️ Der schlimmste der acht Befunde vom 27.07.: hier stehen bis zu ZWÖLF namenlose Felder in
       einer Tabelle. Ohne Namen sagt der Screenreader zwölfmal „Eingabefeld" – der Schreibtischtest
       ist damit fuer blinde Lerner unloesbar, obwohl er inhaltlich der solideste Teil des Pools ist.
       Name = Spaltenkopf + Zeilennummer, also genau die zwei Angaben, die ein Sehender ablesen kann. */
    var cellsT = f.zeilen.map(function(row, r){ var tr = document.createElement("tr"); var inps = row.map(function(_, c){ var td = document.createElement("td"); td.style.padding="3px 5px"; var inp = document.createElement("input"); inp.className="luecke"; inp.style.width="74px"; inp.autocomplete="off"; inp.setAttribute("aria-label", String(f.spalten[c]) + ", " + TEXTE.aria.zellePrefix + (r+1)); td.appendChild(inp); tr.appendChild(td); return inp; }); tblT.appendChild(tr); return inps; });
    /* 2026-07-30: Scroll-Wrapper - vier Spalten mit Eingabefeldern sprengten schmale Displays. */
    var wrapT = el("<div class='tabelle-scroll'></div>"); wrapT.appendChild(tblT); R.appendChild(wrapT);
    var doneT = false;
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneT) return; doneT = true;
      var eing = cellsT.map(function(inps){ return inps.map(function(x){ return x.value; }); });
      var korrekt = L.gradeTrace(f, eing);
      cellsT.forEach(function(inps,r){ inps.forEach(function(x,c){ x.disabled = true; x.style.borderBottomColor = L.gradeLuecke([String(f.zeilen[r][c])], x.value) ? "var(--gruen)" : "var(--rot)"; }); });
      if (!korrekt) R.appendChild(el("<div class='hinweis'>Richtige Werte (zeilenweise): " + f.zeilen.map(function(row){ return row.map(esc).join(" | "); }).join("   ·   ") + "</div>"));
      zeigeFeedback(fbHost, f, korrekt); if (!korrekt && !opts.simulation) zeigeDiagnose(fbHost, f, "trace", { eingaben: eing, felder: cellsT }); fertig(korrekt);
    }, {});
};
R_TYP.konsole = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.konsoleBefehl + "</div>"));
    var inpsK = f.aufgaben.map(function(a,i){
      var row = el("<div class='u-margin-9px-0' ><div class='u-font-size-9rem u-margin-bottom-3px' >" + (i+1) + ". " + esc(a.prompt) + "</div></div>");
      var wrap = el("<div style='font-family:var(--f-mono);background:#15171C;border-radius:6px;padding:7px 9px;display:flex;align-items:center;gap:7px' ><span style='color:#7a8290' >&gt;</span></div>");
      var inp = el("<input style='flex:1;background:transparent;border:none;color:#d6f5d6;font-family:var(--f-mono);outline:none;font-size:.9rem' autocomplete='off' spellcheck='false' >");
      /* Das „>"-Zeichen davor ist reine Optik und trägt keinen Namen. Name = die Aufgabenstellung. */
      inp.setAttribute("aria-label", TEXTE.aria.befehlPrefix + (i+1) + ": " + a.prompt);
      wrap.appendChild(inp); row.appendChild(wrap); R.appendChild(row); return inp;
    });
    var doneK = false;
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneK) return; doneK = true;
      var korrekt = L.gradeKonsole(f, inpsK.map(function(x){ return x.value; }));
      inpsK.forEach(function(x,i){ x.disabled = true; var ok = f.aufgaben[i].akzeptiert.some(function(o){ return L.normBefehl(o) === L.normBefehl(x.value); }); x.style.color = ok ? "#8effa0" : "#ff9a9a"; });
      if (!korrekt && !opts.klausur) R.appendChild(el("<div class='hinweis'>Beispiel-Lösung: " + f.aufgaben.map(function(a){ return esc(a.akzeptiert[0]); }).join("  ·  ") + "</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, {});
};
R_TYP.kalkulation = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.kalkulationZellen + "</div>"));
    var tblK = el("<table class='spick-table'></table>");
    var khK = document.createElement("tr"); f.kopf.forEach(function(h){ var th=document.createElement("th"); th.textContent=h; khK.appendChild(th); }); tblK.appendChild(khK);
    var fillK = {};
    f.zeilen.forEach(function(row,r){
      var tr = document.createElement("tr");
      row.forEach(function(cell,c){ var td = document.createElement("td"); td.style.padding="4px 6px";
        /* Name = Spaltenkopf + Zeilennummer (wie bei `trace`). In einer Kalkulationstabelle ist
           gerade die Spalte die Information – „Skonto" gegen „Zwischensumme" gegen „Barpreis". */
        if (Array.isArray(cell.loesung)){ var inp = document.createElement("input"); inp.className="luecke"; inp.style.width="96px"; inp.autocomplete="off"; inp.setAttribute("aria-label", String(f.kopf[c]) + ", " + TEXTE.aria.zellePrefix + (r+1)); fillK[r + "," + c] = inp; td.appendChild(inp); }
        else { td.textContent = cell.v; }
        tr.appendChild(td);
      });
      tblK.appendChild(tr);
    });
    /* 2026-07-30: Scroll-Wrapper, s. .tabelle-scroll in styles.css */
    var wrapK = el("<div class='tabelle-scroll'></div>"); wrapK.appendChild(tblK); R.appendChild(wrapK);
    rechnerAnhaengen(R, opts);                        // FB-R2b.1
    var doneKa = false;
    setAktion(TEXTE.aktion.pruefen, function(){
      if (doneKa) return; doneKa = true;
      var eing = {}; Object.keys(fillK).forEach(function(k){ eing[k] = fillK[k].value; });
      var korrekt = L.gradeKalkulation(f, eing);
      f.zeilen.forEach(function(row,r){ row.forEach(function(cell,c){ if (Array.isArray(cell.loesung)){ var inp = fillK[r + "," + c]; inp.disabled = true; inp.style.borderBottomColor = L.gradeLuecke(cell.loesung.map(String), inp.value) ? "var(--gruen)" : "var(--rot)"; } }); });
      if (!korrekt){ var loesK = []; f.zeilen.forEach(function(row){ row.forEach(function(cell){ if (Array.isArray(cell.loesung)) loesK.push(esc(String(cell.loesung[0]))); }); }); R.appendChild(el("<div class='hinweis'>Richtige Werte: " + loesK.join("  ·  ") + "</div>")); }
      zeigeFeedback(fbHost, f, korrekt); if (!korrekt && !opts.simulation) zeigeDiagnose(fbHost, f, "kalkulation", { eingaben: eing, felder: fillK }); fertig(korrekt);
    }, {});
};
R_TYP.baukasten = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig;
    R.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.baukastenZiehen + "</div>"));
    R.appendChild(el("<div style='font-family:var(--f-mono);font-size:.85rem;background:var(--g100);border:1px solid var(--rand);border-radius:8px;padding:8px 10px;white-space:pre;overflow:auto;margin-bottom:10px' >" + f.geruest.map(esc).join("\n") + "</div>"));
    var zuBa = {}, doneBa = false, wahlBa = null, bausteineShuffled = L.shuffle(f.bausteine);
    var poolBa = el("<div class='u-display-flex u-flex-wrap-wrap u-gap-6px u-margin-8px-0' ></div>"); R.appendChild(poolBa);
    var slotsBa = el("<div></div>"); R.appendChild(slotsBa);
    var slotElsBa = f.ziele.map(function(z,i){
      var row = el("<div class='u-display-flex u-align-items-center u-gap-8px u-margin-5px-0' ><span style='font-family:var(--f-mono);color:var(--text2);min-width:26px' >" + (z.nr!=null?z.nr:(i+1)) + ".</span></div>");
      var slot = el("<div style='flex:1;min-height:34px;border:2px dashed var(--g300);border-radius:8px;padding:5px 8px' ></div>");
      slot.ondragover = function(ev){ ev.preventDefault(); if(!doneBa) slot.style.borderColor="var(--gelb)"; };
      slot.ondragleave = function(){ slot.style.borderColor=""; };
      slot.ondrop = function(ev){ ev.preventDefault(); if(doneBa)return; var b=ev.dataTransfer.getData("text/plain"); if(b){ zuBa[i]=b; wahlBa=null; zeichneBa(); } };
      slot.onclick = function(){ if(doneBa||wahlBa==null)return; zuBa[i]=wahlBa; wahlBa=null; zeichneBa(); };
      chipTastatur(slot);   // R10 (a)
      slot.setAttribute("aria-label", TEXTE.aria.ablagePrefix + (z.nr!=null?z.nr:(i+1)));   // s. beschriftung
      row.appendChild(slot); slotsBa.appendChild(row); return slot;
    });
    function zeichneBa(){
      poolBa.innerHTML=""; slotElsBa.forEach(function(s){ s.innerHTML=""; if(!doneBa) s.style.borderColor=""; });
      var used={}; Object.keys(zuBa).forEach(function(k){ used[zuBa[k]]=true; });
      bausteineShuffled.forEach(function(b){ if(used[b])return; var chip=el("<span class='zu-item" + (wahlBa===b?" gewaehlt":"") + "'>" + esc(b) + "</span>");
        if(!doneBa){ chip.style.cursor="grab"; chip.draggable=true; chip.ondragstart=function(ev){ ev.dataTransfer.setData("text/plain",b); wahlBa=b; }; chip.onclick=function(){ wahlBa=(wahlBa===b)?null:b; zeichneBa(); }; chipTastatur(chip); }
        poolBa.appendChild(chip);
      });
      slotElsBa.forEach(function(s,i){ if(zuBa[i]==null)return; var chip=el("<span class='zu-item'>" + esc(zuBa[i]) + "</span>");
        if(doneBa){ var ri=zuBa[i]===f.ziele[i].loesung; chip.style.borderColor=ri?"var(--gruen)":"var(--rot)"; chip.style.background=ri?"rgba(46,125,85,0.12)":"rgba(190,65,59,0.12)"; }
        else { chip.style.cursor="pointer"; chip.onclick=function(){ delete zuBa[i]; zeichneBa(); }; chipTastatur(chip); }
        s.appendChild(chip);
      });
      if(!doneBa) document.getElementById("btnAktion").disabled = f.ziele.some(function(_,i){return zuBa[i]==null;});
    }
    zeichneBa();
    var rbBa = resetKnopf(R, function(){ if (doneBa) return; zuBa = {}; wahlBa = null; zeichneBa(); });   // FB-R1.3
    setAktion(TEXTE.aktion.pruefen, function(){
      if(doneBa || f.ziele.some(function(_,i){return zuBa[i]==null;}))return; doneBa=true;
      rbBa.style.display = "none";
      var korrekt=L.gradeBaukasten(f,zuBa); zeichneBa();
      if(!korrekt && !opts.klausur) R.appendChild(el("<div class='hinweis'>Richtig: " + f.ziele.map(function(z,i){return (z.nr!=null?z.nr:(i+1))+". "+esc(z.loesung);}).join(" · ") + "</div>"));
      zeigeFeedback(fbHost, f, korrekt); fertig(korrekt);
    }, { disabled:true, hinweis:TEXTE.hinweis.fuelleGeruest });
};
R_TYP.freitext = function(f, ctx){
  var R = ctx.R, fbHost = ctx.fbHost, opts = ctx.opts, fertig = ctx.fertig, iTyp = ctx.iTyp;
    R.appendChild(el("<div class='hinweis'>" + (iTyp==="erklaeren" ? TEXTE.hinweis.freitextErklaerenLoeser : TEXTE.hinweis.freitextAntwortLoeser) + "</div>"));
    var ta = el("<textarea placeholder='" + TEXTE.placeholder.deineAntwort + "'></textarea>"); R.appendChild(ta);
    setAktion(TEXTE.aktion.antwortPruefen, function(){
      var teilp = !!f.schluesselbegriffe;
      var auto = teilp ? gradeTeilpunkte(ta.value, f) : autoCheckText(ta.value, f.musterloesung);
      var stufeText = {richtig:TEXTE.einschaetzung.wahrscheinlichRichtig, teilweise:TEXTE.einschaetzung.teilweiseRichtig, "unvollständig":TEXTE.einschaetzung.eherUnvollstaendig, unklar:TEXTE.einschaetzung.nichtSicherBewertbar, leer:TEXTE.einschaetzung.keineAntwortErkannt}[auto.stufe];
      var stufeFarbe = {richtig:"gruen", teilweise:"orange", "unvollständig":"rot", unklar:"orange", leer:"rot"}[auto.stufe];
      var ab = el("<div class='fb' style='border:1px solid var(--" + stufeFarbe + ")'></div>");
      var kernText = teilp
        ? auto.pflichtTreffer + " von " + auto.pflichtGesamt + " Kernpunkten getroffen" + (auto.kuerGesamt ? " (+ " + auto.kuerTreffer + " von " + auto.kuerGesamt + " Zusatzpunkten)" : "") + " (" + auto.prozent + " %)"
        : auto.treffer + " von " + auto.anzahl + " Kernpunkten erkannt (" + auto.prozent + " %)";
      ab.appendChild(el("<div><b>" + TEXTE.label.automatischeEinschaetzung + "</b> " + kernText + " &rarr; <b style='color:var(--" + stufeFarbe + ")'>" + stufeText + "</b></div>"));
      ab.appendChild(el("<div class='hinweis u-margin-top-6px' >" + TEXTE.label.naeherungBegriffsAbgleich + "</div>"));
      R.appendChild(ab);
      R.appendChild(el("<div class='fb ok' style='margin-top:10px' ><b>" + TEXTE.label.musterloesung + "</b><br>" + esc(f.musterloesung).replace(/\n/g,"<br>") + "</div>"));
      var vorschlag = auto.stufe==="richtig" ? 0 : auto.stufe==="teilweise" ? 1 : (auto.stufe==="leer"||auto.stufe==="unvollständig") ? 2 : -1;
      var sb = el("<div class='u-margin-top-10px' ><span class='hinweis'>" + TEXTE.label.deineSelbsteinschaetzungStat + "</span><div class='zeile u-margin-top-6px' ></div></div>");
      var row = sb.querySelector(".zeile");
      [[TEXTE.einschaetzung.wusste,"gruen",true],[TEXTE.einschaetzung.teilweiseWort,"orange",null],[TEXTE.einschaetzung.wussteNicht,"rot",false]].forEach(function(o,idx){
        var b = el("<button class='b leise'>" + o[0] + (idx===vorschlag ? TEXTE.einschaetzung.vorschlagSuffix : "") + "</button>");
        if (idx===vorschlag) b.style.borderColor = "var(--" + o[1] + ")";
        b.onclick = function(){ row.querySelectorAll("button").forEach(function(x){x.disabled=true;}); b.style.borderColor = "var(--" + o[1] + ")"; b.style.fontWeight = "700"; fertig(o[2]===true, {keinFehlerDeck:o[2]===null}); };
        row.appendChild(b);
      });
      R.appendChild(sb); zeigeErklaerung(fbHost, f);
      setAktion(TEXTE.aktion.weiter, opts.onNext, { disabled:true, hinweis:TEXTE.hinweis.bitteSelbsteinschaetzung });
    }, {});
};
R_TYP.erklaeren = R_TYP.freitext;
function loeseFrage(f, host, opts){
  host.innerHTML = "";
  opts = opts || {};
  // M09-Klausur (2026-07-21): eigener Modus ohne sichtbares Feedback und ohne globale "Weiter"-
  // Aktion (die Klausur steuert ihre Navigation selbst). Impliziert opts.simulation, damit Stern/
  // Melden/Glossar/Typ-Hilfe/Diagnose (bereits ueberall an !opts.simulation gekoppelt) ebenfalls
  // aus bleiben - ohne die einzelnen R_TYP-Handler anfassen zu muessen.
  if (opts.klausur) opts.simulation = true;
  // #91 Guard: fehlende/kaputte Frage (z. B. veraltete ID aus Fehler-Deck/Markiert) nicht abstürzen lassen
  if (!f || !(f.typ === "bild" ? f.unterTyp : f.typ)) {
    host.appendChild(el("<div class='panel hinweis'>" + TEXTE.hinweis.frageNichtGeladen + "</div>"));
    if (opts.onNext) setAktion(TEXTE.aktion.weiterKurz, opts.onNext, {}); else clearAktion();
    return;
  }
  // #35 (G2.6) Guard: randomisierte Rechenaufgaben tragen im Pool nur "variablen"+Formeln.
  // Normalerweise instanziiert naechsteFrage() vorher; wer die Rohfrage direkt hereinreicht
  // (Tests, kuenftige Aufrufer), bekommt hier trotzdem eine fertig gerechnete Fassung.
  if (f.variablen && typeof L !== "undefined" && typeof L.instanziiere === "function") f = L.instanziiere(f);
  setFrageOffen(true);   // G1.6 #11: ab hier ist eine interaktive Frage sichtbar → kein PWA-Auto-Reload
  var wrap = el("<div class='split" + (opts.klausur ? " klausur" : "") + "'></div>");
  var A = el("<div class='aufgabe panel'></div>"), R = el("<div class='loeser panel'></div>");
  wrap.appendChild(A); wrap.appendChild(R); host.appendChild(wrap);
  A.appendChild(el("<div class='kicker'>" + TEXTE.aufgabe.kicker + "</div>"));
  A.appendChild(el(metaTags(f)));
  if (!opts.simulation) renderStern(A, f);
  if (!opts.simulation) renderMelden(A, f);
  var iTyp = f.typ === "bild" ? f.unterTyp : f.typ;
  if (f.typ === "bild" && f.svg) A.appendChild(svgBox(f.svg, svgAltFuer(f)));
  var linkeAufgabe = (iTyp === "lueckentext") ? TEXTE.hinweis.vervollstaendigeLueckentext : (iTyp === "dropdown") ? TEXTE.hinweis.waehleDropdownFeld : (opts.simulation ? esc(f.frage) : glossarWrap(f));
  var ftEl = el("<div class='frage-text'>" + linkeAufgabe + "</div>");
  A.appendChild(ftEl);
  if (!opts.simulation) glossarAttach(ftEl);
  var fbHost = el("<div aria-live='polite'></div>"); if (!opts.klausur) A.appendChild(fbHost);   // R10 (b): Feedback wird angesagt (Klausur: fbHost bleibt befuellt, aber nicht im sichtbaren DOM)
  /* FB-R1.10: Notiz-Feld ausgeblendet (Nutzer-Entscheid 2026-07-21). renderNotiz bleibt stehen. */
  R.appendChild(el("<div class='kicker'>" + TEXTE.aufgabe.kickerLoesung + "</div>"));
  if (!opts.simulation) renderTypHilfe(R, iTyp);   // #67 Kontext-Hilfe je Aufgabentyp
  function fertig(korrekt, extra){ opts.onGraded(korrekt, extra); if (!opts.klausur) setAktion(TEXTE.aktion.weiter, opts.onNext, {}); }

  var ctx = { R: R, fbHost: fbHost, opts: opts, fertig: fertig, iTyp: iTyp };
  (R_TYP[iTyp] || R_TYP.freitext)(f, ctx);
  // #98 Abruf-Übung: Auswahl-Optionen zunächst verdecken (nur mc/dropdown/mehrfach). NICHT in der
  // AP1-Simulation und NICHT in der M09-Klausur – letztere setzt oben opts.simulation=true, ist
  // über !opts.simulation also bereits ausgeschlossen (prüfungsnah: Optionen sofort sichtbar).
  // FB-R3 Punkt 7: Zustand jetzt persistiert in S.abrufAn (Default an, Umschalter in Einstellungen).
  if (S.abrufAn && !opts.simulation && (iTyp === "mc" || iTyp === "mehrfach" || iTyp === "dropdown")) abrufVerdecken(R);
}
/* #98: verschiebt die bereits erzeugten Optionen (alles nach dem "Deine Lösung"-Kicker) in einen verdeckten
   Container und blendet einen Aufdeck-Button ein. Event-Handler der Optionen bleiben beim Verschieben erhalten. */
function abrufVerdecken(R){
  var kicker = R.firstChild;
  var wrap = el("<div class='abruf-verdeckt' style='display:none'></div>");
  var nodes = [], n = kicker ? kicker.nextSibling : null;
  while (n){ nodes.push(n); n = n.nextSibling; }
  nodes.forEach(function(x){
    if (x.classList && x.classList.contains("typ-hilfe")) return;   // R6: Typ-Bedienhilfe (#67) sichtbar lassen (verrät keine Lösung)
    wrap.appendChild(x);
  });
  var info = el("<div class='hinweis u-margin-top-6px' >" + TEXTE.hinweis.abrufUeberlegen + "</div>");
  var btn = el("<button class='b gelb u-margin-top-8px' >" + TEXTE.aktion.ichHabsUeberlegt + "</button>");
  btn.onclick = function(){ wrap.style.display = ""; if (info.parentNode) info.parentNode.removeChild(info); if (btn.parentNode) btn.parentNode.removeChild(btn); };
  R.appendChild(info); R.appendChild(btn); R.appendChild(wrap);
}
/* #98 / FB-R3 Punkt 7: Umschalter für die Abruf-Übung. Sitzt jetzt NUR noch in den Einstellungen
   (Abruf ist Voreinstellung, S.abrufAn persistiert). Wirkt ab der nächsten Frage. */
function abrufToggle(){
  var z = el("<label class='check' style='display:inline-flex;align-items:center;gap:6px;margin-top:6px'  title='" + TEXTE.hinweis.abrufToggleTitle + "'><input type='checkbox'" + (S.abrufAn ? " checked" : "") + "> <span>" + TEXTE.hinweis.abrufToggleLabel + "</span></label>");
  z.querySelector("input").onchange = function(e){ setS('abrufAn', e.target.checked); };
  return z;
}

