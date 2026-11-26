"use strict";
/* =================== Fragetypen-Renderer ===================
   zeigt Frage f in Container c; cb(korrekt|null) nach Bewertung.
   opts: {simulation:bool, antwortRein:fn(a), antwortVor:a}          */
function renderFrage(f, c, cb, opts) {
  opts = opts || {};
  c.innerHTML = "";
  var meta = el("<div class='meta'><span class='tag'>" + esc(modulName(f.modul)) + "</span><span class='tag'>" + esc(f.thema) + "</span><span class='tag'>" + LEVEL_NAMEN[f.schwierigkeit] + "</span>" + (f.pruefungsteil === "AP2" ? "<span class='tag' title='" + TEXTE.meta.ap2TitelLang + "'>" + TEXTE.meta.ap2Zusatz + "</span>" : "") + (f.hinweisFD ? "<span class='tag' title='" + TEXTE.meta.wiedervorlageTitel + "'>" + TEXTE.meta.wiedervorlage + "</span>" : "") + "</div>");
  c.appendChild(meta);
  if (f.typ === "bild" && f.svg) c.appendChild(svgBox(f.svg, svgAltFuer(f)));
  c.appendChild(el("<div class='frage-text'>" + (f.typ==="lueckentext" || (f.typ==="bild"&&f.unterTyp==="lueckentext") ? "" : esc(f.frage)) + "</div>"));
  var iTyp = f.typ === "bild" ? f.unterTyp : f.typ;

  if (iTyp === "mc") {
    var reihenfolge = L.shuffle([0,1,2,3]);
    var fertig = false, gewaehlt = null;
    var btns = reihenfolge.map(function(oi){
      var b = el("<button class='opt'>" + esc(f.optionen[oi]) + "</button>");
      b.onclick = function(){
        if (opts.simulation) {
          gewaehlt = oi; btns.forEach(function(x){x.classList.remove("gewaehlt");}); b.classList.add("gewaehlt");
          opts.antwortRein(oi); return;
        }
        if (fertig) return; fertig = true;
        var korrekt = L.gradeMC(f, oi);
        btns.forEach(function(x, k){
          if (reihenfolge[k] === f.loesungIndex) x.classList.add("richtig");
          else if (reihenfolge[k] === oi) x.classList.add("falsch");
          x.disabled = true;
        });
        zeigeFeedback(c, f, korrekt, oi);
        cb(korrekt);
      };
      c.appendChild(b);
      if (opts.simulation && opts.antwortVor === oi) b.classList.add("gewaehlt");
      return b;
    });
  }
  else if (iTyp === "lueckentext") {
    var teile = f.frage.split("___"), inputs = [];
    var p = el("<div class='frage-text'></div>");
    teile.forEach(function(t, i){
      p.appendChild(document.createTextNode(t));
      if (i < teile.length - 1) {
        var inp = el("<input class='luecke' autocomplete='off'>");
        inp.setAttribute("aria-label", TEXTE.aria.lueckePrefix + (i+1));   // a11y 2026-07-27, s. app_util.js TEXTE.aria
        if (opts.simulation && opts.antwortVor && opts.antwortVor[i] != null) inp.value = opts.antwortVor[i];
        if (opts.simulation) inp.oninput = function(){ opts.antwortRein(inputs.map(function(x){return x.value;})); };
        inputs.push(inp); p.appendChild(inp);
      }
    });
    c.appendChild(p);
    if (!opts.simulation) {
      var pb = el("<button class='b gelb u-margin-top-10px' >" + TEXTE.aktion.pruefenKurz + "</button>");
      pb.onclick = function(){
        if (pb.disabled) return; pb.disabled = true;
        var eingaben = inputs.map(function(x){return x.value;});
        var korrekt = L.gradeLueckentext(f, eingaben);
        inputs.forEach(function(x, i){ x.style.borderBottomColor = L.gradeLuecke(f.luecken[i], x.value) ? "var(--gruen)" : "var(--rot)"; x.disabled = true; });
        if (!korrekt) c.appendChild(el("<div class='hinweis'>Richtige Lösung: " + esc(f.luecken.map(function(l){return l[0];}).join(" · ")) + "</div>"));
        zeigeFeedback(c, f, korrekt); cb(korrekt);
      };
      c.appendChild(pb);
    }
  }
  else if (iTyp === "zuordnung") {
    var links = f.paare.map(function(p,i){return {t:p[0], i:i};});
    var rechts = L.shuffle(f.paare.map(function(p,i){return {t:p[1], i:i};}));
    var zu = opts.antwortVor ? Object.assign({}, opts.antwortVor) : {};
    var wahlLinks = null;
    var box = el("<div></div>"), lBox = el("<div></div>"), rBox = el("<div></div>"), pBox = el("<div class='u-margin-top-8px' ></div>");
    box.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.zuordnungKlickenFrage + "</div>"));
    box.appendChild(lBox); box.appendChild(rBox); box.appendChild(pBox); c.appendChild(box);
    function zeichne() {
      lBox.innerHTML = ""; rBox.innerHTML = ""; pBox.innerHTML = "";
      links.forEach(function(o){
        if (zu[o.i] != null) return;
        var b = el("<span class='zu-item" + (wahlLinks===o.i?" gewaehlt":"") + "'>" + esc(o.t) + "</span>");
        b.onclick = function(){ wahlLinks = (wahlLinks===o.i) ? null : o.i; zeichne(); };
        lBox.appendChild(b);
      });
      rechts.forEach(function(o){
        if (Object.keys(zu).some(function(k){return zu[k]===o.i;})) return;
        var b = el("<span class='zu-item'>" + esc(o.t) + "</span>");
        b.onclick = function(){ if (wahlLinks==null) return; zu[wahlLinks] = o.i; wahlLinks = null; if (opts.simulation) opts.antwortRein(Object.assign({}, zu)); zeichne(); };
        rBox.appendChild(b);
      });
      Object.keys(zu).forEach(function(k){
        var b = el("<div class='zu-paar'>" + esc(f.paare[k][0]) + " → " + esc(f.paare[zu[k]][1]) + "</div>");
        b.onclick = function(){ delete zu[k]; if (opts.simulation) opts.antwortRein(Object.assign({}, zu)); zeichne(); };
        pBox.appendChild(b);
      });
      if (!opts.simulation && Object.keys(zu).length === f.paare.length) {
        var pb = el("<button class='b gelb u-margin-top-8px' >" + TEXTE.aktion.pruefenKurz + "</button>");
        pb.onclick = function(){
          var korrekt = L.gradeZuordnung(f, zu);
          pBox.querySelectorAll(".zu-paar").forEach(function(x, i){
            var k = Object.keys(zu)[i];
            x.style.borderColor = (zu[k]===+k) ? "var(--gruen)" : "var(--rot)";
            x.onclick = null;
          });
          if (!korrekt) c.appendChild(el("<div class='hinweis'>Richtig wäre: " + f.paare.map(function(p){return esc(p[0]) + " → " + esc(p[1]);}).join(" · ") + "</div>"));
          pb.remove(); zeigeFeedback(c, f, korrekt); cb(korrekt);
        };
        pBox.appendChild(pb);
      }
    }
    zeichne();
  }
  else if (iTyp === "dropdown") {
    var teileDd = f.frage.split("___"), selectsDd = [];
    var pDd = el("<div class='frage-text'></div>");
    teileDd.forEach(function(txt, i){
      pDd.appendChild(document.createTextNode(txt));
      if (i < teileDd.length - 1){
        var sel = el("<select class='u-margin-0-4px' ><option value='-1'>— wählen —</option></select>");
        sel.setAttribute("aria-label", TEXTE.aria.lueckePrefix + (i+1));   // G1.5 #46
        f.luecken[i].optionen.forEach(function(opt, oi){ var o = document.createElement("option"); o.value = oi; o.textContent = opt; sel.appendChild(o); });
        if (opts.simulation && Array.isArray(opts.antwortVor) && opts.antwortVor[i] != null) sel.value = String(opts.antwortVor[i]);
        sel.onchange = function(){ if (opts.simulation) opts.antwortRein(selectsDd.map(function(s){ return +s.value; })); };
        selectsDd.push(sel); pDd.appendChild(sel);
      }
    });
    c.appendChild(pDd);
    if (!opts.simulation) {
      var pbDd = el("<button class='b gelb u-margin-top-10px' >" + TEXTE.aktion.pruefenKurz + "</button>");
      pbDd.onclick = function(){
        if (pbDd.disabled || selectsDd.some(function(s){ return s.value === "-1"; })) return; pbDd.disabled = true;
        var auswahl = selectsDd.map(function(s){ return +s.value; });
        var korrekt = L.gradeDropdown(f, auswahl);
        selectsDd.forEach(function(s, i){ s.disabled = true; s.style.borderColor = (auswahl[i] === f.luecken[i].loesung) ? "var(--gruen)" : "var(--rot)"; });
        if (!korrekt) c.appendChild(el("<div class='hinweis'>Richtig: " + f.luecken.map(function(l){ return esc(l.optionen[l.loesung]); }).join(" · ") + "</div>"));
        zeigeFeedback(c, f, korrekt); cb(korrekt);
      };
      c.appendChild(pbDd);
    }
  }
  else if (iTyp === "mehrfach") {
    c.appendChild(el("<div class='hinweis'>" + TEXTE.hinweis.mehrfachauswahl + "</div>"));
    var reihMf = L.shuffle(f.optionen.map(function(_, i){ return i; }));
    var gewMf = {};
    if (opts.simulation && Array.isArray(opts.antwortVor)) opts.antwortVor.forEach(function(i){ gewMf[i] = 1; });
    var fertigMf = false;
    var boxesMf = reihMf.map(function(oi){
      var b = el("<label class='check' style='display:flex;align-items:flex-start;gap:8px;margin:7px 0' ><input type='checkbox'" + (gewMf[oi] ? " checked" : "") + "><span>" + esc(f.optionen[oi]) + "</span></label>");
      var cbx = b.querySelector("input");
      cbx.onchange = function(){
        if (fertigMf){ cbx.checked = !cbx.checked; return; }
        if (cbx.checked) gewMf[oi] = 1; else delete gewMf[oi];
        if (opts.simulation) opts.antwortRein(Object.keys(gewMf).map(Number));
      };
      c.appendChild(b); return { b: b, oi: oi, cb: cbx };
    });
    if (!opts.simulation) {
      var pbMf = el("<button class='b gelb u-margin-top-10px' >" + TEXTE.aktion.pruefenKurz + "</button>");
      pbMf.onclick = function(){
        var sel = Object.keys(gewMf).map(Number);
        if (fertigMf || !sel.length) return; fertigMf = true; pbMf.disabled = true;
        var korrekt = L.gradeMehrfach(f, sel);
        boxesMf.forEach(function(x){ var soll = f.loesungIndizes.indexOf(x.oi) >= 0; x.cb.disabled = true;
          if (soll) x.b.style.color = "var(--gruen)"; else if (x.cb.checked) x.b.style.color = "var(--rot)"; });
        zeigeFeedback(c, f, korrekt); cb(korrekt);
      };
      c.appendChild(pbMf);
    }
  }
  else if (iTyp === "freitext" || iTyp === "erklaeren") {
    var hinweisTxt = iTyp === "erklaeren" ? TEXTE.hinweis.freitextErklaerenFrage : TEXTE.hinweis.freitextAntwortFrage;
    c.appendChild(el("<div class='hinweis'>" + hinweisTxt + "</div>"));
    var ta = el("<textarea placeholder='" + TEXTE.placeholder.deineAntwort + "'></textarea>");
    c.appendChild(ta);
    var zb = el("<button class='b gelb u-margin-top-8px' >" + TEXTE.aktion.musterloesungAnzeigen + "</button>");
    zb.onclick = function(){
      zb.remove();
      c.appendChild(el("<div class='fb ok'><b>" + TEXTE.label.musterloesung + "</b><br>" + esc(f.musterloesung).replace(/\n/g,"<br>") + "</div>"));
      var sb = el("<div class='zeile u-margin-top-10px' ><span>" + TEXTE.label.selbsteinschaetzung + "</span></div>");
      [[TEXTE.einschaetzung.wusste,"gruen",true],[TEXTE.einschaetzung.teilweiseWort,"orange",null],[TEXTE.einschaetzung.wussteNicht,"rot",false]].forEach(function(o){
        var b = el("<button class='b leise'>" + o[0] + "</button>");
        b.onclick = function(){
          sb.querySelectorAll("button").forEach(function(x){x.disabled=true;});
          b.style.borderColor = "var(--" + o[1] + ")";
          var korrekt = o[2] === true;                       // "teilweise" zählt nicht als richtig, landet aber nicht im Fehler-Deck
          cb(korrekt, { keinFehlerDeck: o[2] === null });
        };
        sb.appendChild(b);
      });
      c.appendChild(sb);
      zeigeErklaerung(c, f);
    };
    c.appendChild(zb);
  }
  /* FB-R1.10: Notiz-Feld ausgeblendet (Nutzer-Entscheid 2026-07-21 – Funktion vorerst nicht
     benoetigt). renderNotiz und S.notizen bleiben unangetastet stehen, damit ein Wiedereinschalten
     eine Ein-Zeilen-Aenderung bleibt und die Notizen bestehender Nutzer nicht verloren gehen. */
}

function zeigeFeedback(c, f, korrekt, mcAntwort) {
  var lob = L.pick([TEXTE.feedback.richtig, TEXTE.feedback.lob2, TEXTE.feedback.lob3, TEXTE.feedback.lob4, TEXTE.feedback.lob5]);
  var fb = el("<div class='fb " + (korrekt?"ok":"nein") + "'></div>");
  fb.appendChild(el("<div><b>" + (korrekt ? lob : TEXTE.feedback.falsch) + "</b></div>"));
  if (!korrekt) fb.appendChild(el("<div class='u-margin-top-6px' >" + esc(f.erklaerungKurz) + "</div>"));
  c.appendChild(fb);
  /* FB-R1.2: nach einer FALSCHEN Antwort wird die ausfuehrliche Erklaerung sofort aufgeklappt –
     genau dann braucht man sie. Kein Simulations-Guard noetig: die AP1-Sim rendert ihr Feedback
     selbst (app_sim.js) und ruft zeigeFeedback gar nicht auf; in der M09-Klausur haengt fbHost
     nicht im DOM (opts.klausur). */
  zeigeErklaerung(c, f, mcAntwort, !korrekt);
}
function zeigeErklaerung(c, f, mcAntwort, aufklappen) {
  if (!f.erklaerungLang && f.typ !== "mc") return;
  var d = el("<details class='lang'" + (aufklappen ? " open" : "") + "><summary>" + TEXTE.label.ausfuehrlicheErklaerung + "</summary></details>");
  var inhalt = "<div class='u-margin-top-8px' >" + esc(f.erklaerungLang || f.erklaerungKurz).replace(/\n/g,"<br>") + "</div>";
  if (f.typ === "mc" && f.distraktorErklaerungen) {
    inhalt += "<div class='u-margin-top-8px' ><b>" + TEXTE.label.warumAndereFalsch + "</b><ul>";
    f.distraktorErklaerungen.forEach(function(t, i){
      if (i === f.loesungIndex || !t) return;
      inhalt += "<li><i>" + esc(f.optionen[i]) + ":</i> " + esc(t) + "</li>";
    });
    inhalt += "</ul></div>";
  }
  if (f.verweis) { var datei = MODUL_DATEI[f.modul]; inhalt += "<div class='hinweis'>Siehe " + esc(f.verweis) + (datei ? " · <a class='u-color-var-gelb-hover' href='" + datei + "' target='_blank' rel='noopener' >" + TEXTE.label.theorieNachlesen + "</a>" : "") + "</div>"; }
  d.appendChild(el("<div>" + inhalt + "</div>"));
  c.appendChild(d);
}
/* =================== #63 "Warum falsch?"-Diagnose ===================
   Dezente, standardmaessig zugeklappte Kurz-Diagnose direkt unter dem
   Feedback bei einer FALSCHEN Antwort. Rein additiv, kein Einfluss auf
   Wertung/Fehler-Deck. Wird bei fehlenden Infos einfach nicht gerendert. */
function zeigeDiagnose(c, f, typ, info) {
  info = info || {};
  var inhalt = "";
  if (typ === "mc") {
    if (info.gewaehlt == null || !f.optionen || f.loesungIndex == null) return;
    var erkMc = f.distraktorErklaerungen && f.distraktorErklaerungen[info.gewaehlt];
    inhalt = (erkMc && String(erkMc).trim())
      ? "<div>" + esc(erkMc) + "</div>"
      : "<div>Richtig wäre: <i>" + esc(f.optionen[f.loesungIndex]) + "</i></div>";
  }
  else if (typ === "mehrfach") {
    if (!Array.isArray(info.gewaehlt) || !f.optionen || !Array.isArray(f.loesungIndizes)) return;
    var falschGewaehlt = info.gewaehlt.filter(function(i){ return f.loesungIndizes.indexOf(i) < 0; });
    var falschFehlend = f.loesungIndizes.filter(function(i){ return info.gewaehlt.indexOf(i) < 0; });
    if (!falschGewaehlt.length && !falschFehlend.length) return;
    var liMf = "";
    falschGewaehlt.forEach(function(i){
      var erkMf = f.distraktorErklaerungen && f.distraktorErklaerungen[i];
      liMf += "<li><i>" + esc(f.optionen[i]) + ":</i> " + ((erkMf && String(erkMf).trim()) ? esc(erkMf) : "nicht korrekt.") + "</li>";
    });
    falschFehlend.forEach(function(i){
      liMf += "<li><i>" + esc(f.optionen[i]) + "</i> wäre richtig gewesen.</li>";
    });
    inhalt = "<ul>" + liMf + "</ul>";
  }
  else if (typ === "dropdown") {
    if (!Array.isArray(info.auswahl) || !Array.isArray(f.luecken)) return;
    var liDd = "";
    f.luecken.forEach(function(l, i){
      if (info.auswahl[i] === l.loesung) return;
      var gewDd = l.optionen[info.auswahl[i]];
      liDd += "<li>Lücke " + (i+1) + ": gewählt ‚" + esc(gewDd == null ? "—" : gewDd) + "', richtig ‚" + esc(l.optionen[l.loesung]) + "'</li>";
    });
    if (!liDd) return;
    inhalt = "<ul>" + liDd + "</ul>";
  }
  else if (typ === "rechenassistent") {
    if (!Array.isArray(info.eingaben) || !Array.isArray(f.schritte)) return;
    var idxRA = -1;
    for (var iRA = 0; iRA < f.schritte.length; iRA++) { if (!L.gradeLuecke(f.schritte[iRA].loesung, info.eingaben[iRA])) { idxRA = iRA; break; } }
    if (idxRA < 0) return;
    var sRA = f.schritte[idxRA];
    inhalt = "<div>Erster Fehler in Schritt " + (idxRA+1) + ": ‚" + esc(sRA.text) + "' – Sollwert: <b>" + esc(sRA.loesung[0]) + (sRA.einheit ? " " + esc(sRA.einheit) : "") + "</b></div>";
    if (info.felder && info.felder[idxRA]) info.felder[idxRA].style.outline = "2px solid var(--rot)";
  }
  else if (typ === "kalkulation") {
    if (!info.eingaben || !Array.isArray(f.zeilen)) return;
    var foundKa = null;
    f.zeilen.some(function(row, r){
      return row.some(function(cell, c){
        if (!Array.isArray(cell.loesung)) return false;
        if (!L.gradeLuecke(cell.loesung.map(String), info.eingaben[r + "," + c])) { foundKa = { r:r, c:c, cell:cell }; return true; }
        return false;
      });
    });
    if (!foundKa) return;
    var spalteKa = (f.kopf && f.kopf[foundKa.c]) ? f.kopf[foundKa.c] : ("Spalte " + (foundKa.c+1));
    var zeileKa = f.zeilen[foundKa.r][0] && f.zeilen[foundKa.r][0].v;
    inhalt = "<div>Erster Fehler bei ‚" + esc(spalteKa) + "'" + (zeileKa ? " (Zeile ‚" + esc(zeileKa) + "')" : "") + " – Sollwert: <b>" + esc(foundKa.cell.loesung[0]) + "</b></div>";
    if (info.felder && info.felder[foundKa.r + "," + foundKa.c]) info.felder[foundKa.r + "," + foundKa.c].style.outline = "2px solid var(--rot)";
  }
  else if (typ === "trace") {
    if (!Array.isArray(info.eingaben) || !Array.isArray(f.zeilen)) return;
    var foundTr = null;
    f.zeilen.some(function(row, r){
      return row.some(function(cell, c){
        if (!info.eingaben[r] || !L.gradeLuecke([String(cell)], info.eingaben[r][c])) { foundTr = { r:r, c:c, cell:cell }; return true; }
        return false;
      });
    });
    if (!foundTr) return;
    var spalteTr = (f.spalten && f.spalten[foundTr.c]) ? f.spalten[foundTr.c] : ("Spalte " + (foundTr.c+1));
    inhalt = "<div>Erster Fehler in Zeile " + (foundTr.r+1) + ", Spalte ‚" + esc(spalteTr) + "' – Sollwert: <b>" + esc(foundTr.cell) + "</b></div>";
    if (info.felder && info.felder[foundTr.r] && info.felder[foundTr.r][foundTr.c]) info.felder[foundTr.r][foundTr.c].style.outline = "2px solid var(--rot)";
  }
  else return;

  if (!inhalt) return;
  var dDiag = el("<details class='diagnose'><summary>" + TEXTE.label.warumFalsch + "</summary></details>");
  dDiag.appendChild(el("<div class='u-margin-top-6px' >" + inhalt + "</div>"));
  c.appendChild(dDiag);
}
function renderNotiz(c, f) {
  var d = el("<details class='u-margin-top-10px' ><summary class='hinweis'>" + TEXTE.label.eigeneNotiz + "</summary></details>");
  var ta = el("<textarea class='u-min-height-60px'  placeholder='" + TEXTE.placeholder.merkhilfe + "'></textarea>");
  ta.value = S.notizen[f.id] || "";
  ta.onchange = function(){ mutS(function(s){ if (ta.value.trim()) s.notizen[f.id] = ta.value.trim(); else delete s.notizen[f.id]; }); };
  d.appendChild(ta);
  if (S.notizen[f.id]) d.open = true;
  c.appendChild(d);
}
/* #46 Lesezeichen: Stern-Toggle (nur außerhalb der Simulation).
   FB-R1.8 / E3: der Button wird standardmaessig NICHT mehr gezeigt – er hat dem „Melden"-Knopf
   die markante Position weggenommen. Feature, State (S.markiert) und die Seite „Markiert" bleiben
   vollstaendig erhalten; einschaltbar unter Einstellungen (S.markierenAn). */
function renderStern(c, f) {
  if (!S.markierenAn) return;
  var an = !!S.markiert[f.id];
  var b = el("<button class='b leise stern-btn u-margin-top-8px'  title='" + TEXTE.stern.titel + "'></button>");
  function male(){ var v = !!S.markiert[f.id]; b.textContent = v ? TEXTE.stern.markiert : TEXTE.stern.markieren; b.setAttribute("aria-pressed", v ? "true" : "false"); }
  male();
  b.onclick = function(){ mutS(function(s){ if (s.markiert[f.id]) delete s.markiert[f.id]; else s.markiert[f.id] = 1; }); male(); };
  c.appendChild(b);
}
/* #57 „Frage melden": ⚑ neben Stern (nur außerhalb Simulation). Schnellgründe + optionaler Freitext →
   S.meldungen[id]={grund,text,datum}. Keinerlei Einfluss auf Wertung. */
var MELDE_GRUENDE = ["Falsche Lösung", "Unklar formuliert", "Tippfehler", "Veraltet", "Sonstiges"];
function renderMelden(c, f) {
  /* FB-R1.8 / E3: „Melden" bekommt die markante Position – die Zusammenfassung ist jetzt als
     Knopf gestaltet (.melden-btn) statt als graue Hinweiszeile. */
  var d = el("<details class='melden u-margin-top-8px' ><summary class='melden-btn'>" + TEXTE.melden.frageMeldenSummary + "</summary></details>");
  var box = el("<div class='u-margin-top-6px' ></div>");
  var status = el("<div class='hinweis u-margin-bottom-4px' ></div>");
  var gewaehlt = (S.meldungen[f.id] && S.meldungen[f.id].grund) || "";
  var chips = el("<div class='zeile' style='flex-wrap:wrap;gap:6px' ></div>");
  var btns = {};
  MELDE_GRUENDE.forEach(function(g){
    var b = el("<button class='b leise' style='padding:4px 10px' >" + esc(g) + "</button>");
    if (gewaehlt === g) b.style.borderColor = "var(--gelb)";
    b.onclick = function(){ gewaehlt = g; Object.keys(btns).forEach(function(k){ btns[k].style.borderColor = ""; }); b.style.borderColor = "var(--gelb)"; };
    btns[g] = b; chips.appendChild(b);
  });
  var ta = el("<textarea class='u-min-height-48px u-margin-top-6px'  placeholder='" + TEXTE.melden.detailsPlaceholder + "'></textarea>");
  ta.value = (S.meldungen[f.id] && S.meldungen[f.id].text) || "";
  var send = el("<button class='b gelb u-margin-top-6px' >" + TEXTE.aktion.melden + "</button>");
  send.onclick = function(){ mutS(function(s){ s.meldungen[f.id] = { grund: gewaehlt || "Sonstiges", text: ta.value.trim(), datum: Date.now() }; }); malen(); };
  var del = el("<button class='b leise u-margin-top-6px u-margin-left-8px' >" + TEXTE.melden.meldungEntfernen + "</button>");
  del.onclick = function(){ mutS(function(s){ delete s.meldungen[f.id]; }); malen(); };
  function malen(){
    var mm = S.meldungen[f.id];
    status.textContent = mm ? "Gemeldet am " + new Date(mm.datum).toLocaleDateString("de-DE") + " – " + (mm.grund || "?") + (mm.text ? ": " + mm.text : "") : "";
    del.style.display = mm ? "" : "none";
  }
  box.appendChild(status); box.appendChild(chips); box.appendChild(ta); box.appendChild(send); box.appendChild(del);
  d.appendChild(box); if (S.meldungen[f.id]) d.open = true; c.appendChild(d); malen();
}
/* #57 Export der Meldungen (in Einstellungen als Datei-Download). */
function meldungenJSON(){ return JSON.stringify(S.meldungen, null, 2); }
function meldungenText(){
  return Object.keys(S.meldungen).map(function(id){
    var mm = S.meldungen[id], f = frageById(id);
    return "[" + id + "] " + (f ? modulName(f.modul) + " · " + f.thema : TEXTE.melden.nichtImPool) +
      "\nGrund: " + (mm.grund || "-") + (mm.text ? "\nDetails: " + mm.text : "") +
      "\nDatum: " + new Date(mm.datum).toLocaleString("de-DE") +
      "\nFrage: " + (f ? (f.frage || "").replace(/\s+/g, " ").trim() : "") + "\n";
  }).join("\n");
}
function downloadDatei(name, text, mime){
  try {
    var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); }, 0);
  } catch(e){ alert("Download nicht möglich: " + e.message); }
}

