/* Test: FEEDBACK-RUNDE 1 (FB-R1, 2026-07-21) – UI/UX-Quick-Wins.
   Deckt R1.1 Kontrast, R1.2 Erklaerung aufklappen, R1.3 Reset-Knopf, R1.4 Tap-Zoom,
   R1.5 Grafik unter der Antwortflaeche, R1.6 einklappbare Statistik-Panels,
   R1.7 Wisch-Leiste nur bei Touch, R1.10 ausgeblendetes Notiz-Feld und R1.11 (Nachtrag
   2026-07-21: Stand-Streifen der Startseite zuklappbar, aber Default OFFEN) ab.
   R1.8 (Markieren/Melden) und R1.9 (Umbenennung) liegen in test_markiert bzw. test_unterricht,
   weil sie dort zum vorhandenen Aufbau gehoeren.

   GRUNDSATZ (Lehre aus frueheren Sitzungen): jeder Test hat seine GEGENPROBE im selben Lauf –
   also einen Fall, der ohne die neue Logik anders ausgehen MUSS. Ein Test, der beide Richtungen
   nicht unterscheidet, kann still immer gruen bleiben. */
const H = require("./_harness.js");
const fs = require("fs");
const path = require("path");

/* --- WCAG-Kontrast aus zwei Hex-Farben. Bewusst hier ausgerechnet und nicht aus dem Browser
       gelesen: jsdom liefert fuer CSS-Variablen keine aufgeloesten Farbwerte. --- */
function lum(hex) {
  const h = hex.replace("#", "");
  const v = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
function kontrast(a, b) {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
/* Wert einer CSS-Variablen innerhalb eines Selektor-Blocks. Simpel, aber ausreichend:
   die Theme-Bloecke in styles.css sind flach und enthalten keine verschachtelten Regeln. */
function tokenIn(css, selektor, name) {
  const i = css.indexOf(selektor);
  if (i < 0) return null;
  const block = css.slice(i, css.indexOf("}", i));
  const m = block.match(new RegExp("--" + name + "\\s*:\\s*(#[0-9A-Fa-f]{6})"));
  return m ? m[1] : null;
}

(async () => {
  const css = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
  const w = await H.boot();
  const doc = w.document;
  const frageVom = (typ) => w.POOL.filter(f => f.typ === typ)[0];
  function rendere(f, opts) {
    const host = doc.createElement("div");
    doc.body.appendChild(host);
    w.loeseFrage(w.L.instanziiere(f), host,
      Object.assign({ simulation: false, onGraded: function () {}, onNext: function () {} }, opts || {}));
    return host;
  }

  /* ================= R1.1 Kontrast der gewaehlten Antwort ================= */
  const washDark = tokenIn(css, 'html[data-theme="dark"]', "gelb-wash");
  const washHell = tokenIn(css, ":root", "gelb-wash");
  H.t("Dark-Theme definiert ein eigenes --gelb-wash", !!washDark);
  H.t("Sepia/Kontrast-Themes haben weiterhin ein eigenes --gelb-wash",
    !!tokenIn(css, 'html[data-theme="sepia"]', "gelb-wash") && !!tokenIn(css, 'html[data-theme="kontrast"]', "gelb-wash"));
  const textDark = tokenIn(css, 'html[data-theme="dark"]', "text");
  H.t("Dark-Theme definiert --text", !!textDark);
  if (washDark && textDark) {
    H.t("Kontrast gewaehlte Antwort im Dark-Theme >= 4.5:1 (ist " + kontrast(washDark, textDark).toFixed(2) + ")",
      kontrast(washDark, textDark) >= 4.5);
    /* GEGENPROBE: mit dem alten (hellen) Wert waere derselbe Test durchgefallen – das belegt,
       dass die Messung ueberhaupt beisst und nicht jeden Wert akzeptiert. */
    H.t("Gegenprobe: alter heller Wert faellt durch (ist " + kontrast(washHell, textDark).toFixed(2) + ")",
      kontrast(washHell, textDark) < 4.5);
  }
  /* Das Akzentgelb der AP2-Tags steht ebenfalls auf --gelb-wash. */
  const gelbHover = tokenIn(css, ":root", "gelb-hover");
  if (washDark && gelbHover) {
    H.t("Kontrast AP2-Tag-Schrift auf --gelb-wash (dark) >= 4.5:1 (ist " + kontrast(washDark, gelbHover).toFixed(2) + ")",
      kontrast(washDark, gelbHover) >= 4.5);
  }

  /* ================= R1.2 Erklaerung nach falscher Antwort ================= */
  const mc = w.POOL.filter(f => f.typ === "mc" && f.erklaerungLang && f.optionen && f.optionen.length > 1)[0];
  H.t("mc-Frage mit ausfuehrlicher Erklaerung im Pool gefunden", !!mc);
  /* Achtung zwei Stolpersteine: R_TYP.mc MISCHT die Optionen (Auswahl also ueber den TEXT
     suchen, nicht ueber den Index) und bewertet erst beim globalen „Prüfen"-Knopf
     (#btnAktion) – ein blosser Klick auf die Option erzeugt noch kein Feedback. */
  function mcAntworten(f, richtig) {
    const host = rendere(f);
    const soll = f.optionen[f.loesungIndex];
    const treffer = Array.prototype.slice.call(host.querySelectorAll(".opt"))
      .filter(b => (b.textContent === soll) === richtig)[0];
    treffer.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    doc.getElementById("btnAktion").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    return host;
  }
  if (mc) {
    const hostF = mcAntworten(mc, false);
    const dF = hostF.querySelector("details.lang");
    H.t("Falsch: Erklaerung wird gerendert", !!dF);
    H.t("Falsch: Erklaerung ist AUFGEKLAPPT", !!dF && dF.open === true);
    // GEGENPROBE: richtig antworten -> dieselbe Erklaerung bleibt zugeklappt
    const dR = mcAntworten(mc, true).querySelector("details.lang");
    H.t("Gegenprobe richtig: Erklaerung bleibt zugeklappt", !!dR && dR.open === false);
  }

  /* ================= R1.3 Reset-Knopf der Zuordnungs-Typen ================= */
  ["zuordnung", "matrix", "beschriftung", "baukasten"].forEach(function (typ) {
    const f = frageVom(typ);
    H.t("Pool enthaelt Typ " + typ, !!f);
    if (!f) return;
    const host = rendere(f);
    H.t(typ + ": Reset-Knopf vorhanden", !!host.querySelector(".reset-btn"));
  });
  /* Wirkung statt blosser Existenz: eine Zuweisung setzen, zuruecksetzen, Zustand pruefen.
     Ueber die sichtbaren Chips gemessen – die interne Zuordnung ist eine Closure-Variable. */
  const fZu = frageVom("zuordnung");
  if (fZu) {
    const host = rendere(fZu);
    const chips = host.querySelectorAll(".zu-item");
    const vorher = host.querySelectorAll(".zu-item").length;
    chips[0].dispatchEvent(new w.MouseEvent("click", { bubbles: true }));                      // links waehlen
    const rechte = Array.prototype.slice.call(host.querySelectorAll(".zu-item")).slice(-1)[0];
    rechte.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));                        // rechts zuordnen
    H.t("zuordnung: nach Zuordnung existiert ein Paar", host.querySelectorAll(".zu-paar").length === 1);
    host.querySelector(".reset-btn").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    H.t("zuordnung: Reset entfernt das Paar", host.querySelectorAll(".zu-paar").length === 0);
    H.t("zuordnung: Reset stellt alle Chips wieder her", host.querySelectorAll(".zu-item").length === vorher);
  }

  /* ================= R1.4 Tap-Zoom (ausser hotspot) ================= */
  const fBs = frageVom("beschriftung"), fHs = frageVom("hotspot");
  if (fBs && fBs.svg) {
    const host = rendere(fBs);
    const box = host.querySelector(".svgbox");
    H.t("beschriftung: svgbox traegt .tapzoom", !!box && box.classList.contains("tapzoom"));
    box.querySelector("svg").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    H.t("beschriftung: Tap aufs Bild oeffnet den Zoom", !!doc.querySelector(".zoomoverlay"));
    const ov = doc.querySelector(".zoomoverlay"); if (ov) ov.remove();
  }
  if (fHs) {
    const host = rendere(fHs);
    const box = host.querySelector(".svgbox");
    H.t("hotspot: svgbox OHNE .tapzoom", !!box && !box.classList.contains("tapzoom"));
    // GEGENPROBE: ein Tap auf das SVG darf hier NICHT zoomen (das SVG ist die Antwortflaeche)
    box.querySelector("svg").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    H.t("hotspot: Tap aufs Bild oeffnet KEINEN Zoom", !doc.querySelector(".zoomoverlay"));
    // Der Lupen-Knopf muss trotzdem funktionieren
    box.querySelector(".zoombtn").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    H.t("hotspot: Lupen-Knopf oeffnet den Zoom weiterhin", !!doc.querySelector(".zoomoverlay"));
    const ov = doc.querySelector(".zoomoverlay"); if (ov) ov.remove();
  }

  /* ================= R1.5 Grafik unter der Antwortflaeche ================= */
  if (fBs && fBs.svg) {
    const host = rendere(fBs);
    const kinder = Array.prototype.slice.call(host.querySelector(".loeser").children);
    const boxIdx = kinder.findIndex(x => x.classList && x.classList.contains("svgbox"));
    const slotIdx = kinder.findIndex(x => x.querySelector && x.querySelector("[role='button']") && x.textContent.trim().startsWith("1"));
    H.t("beschriftung: Grafik ist im Loeser-Panel", boxIdx >= 0);
    H.t("beschriftung: Grafik steht NACH der Antwortflaeche", boxIdx > 0 && slotIdx >= 0 && boxIdx > slotIdx);
  }

  /* ================= R1.6 Statistik-Panels einklappbar, Default ZU ================= */
  w.gotoSeite("stat");
  await H.sleep(40);
  const panels = doc.querySelectorAll("#main details.stat-panel");
  H.t("Statistik-Seite nutzt aufklappbare Panels", panels.length >= 2);
  H.t("Alle Statistik-Panels starten zugeklappt",
    Array.prototype.every.call(panels, p => p.open === false));
  H.t("Jedes Panel hat eine Kopfzeile .panel-kopf",
    Array.prototype.every.call(panels, p => !!p.querySelector("summary.panel-kopf")));
  const p1 = panels[0];
  p1.open = true; if (typeof p1.ontoggle === "function") p1.ontoggle();
  H.t("Aufklappen wird in S.panelOffen gemerkt", Object.keys(w.S.panelOffen || {}).length === 1);
  w.gotoSeite("start"); await H.sleep(20); w.gotoSeite("stat"); await H.sleep(40);
  const panels2 = doc.querySelectorAll("#main details.stat-panel");
  H.t("Nach Seitenwechsel ist genau das gemerkte Panel offen",
    Array.prototype.filter.call(panels2, p => p.open).length === 1);
  // GEGENPROBE: wieder zuklappen -> Merker leer, danach wieder alles zu
  const q1 = panels2[0];
  q1.open = false; if (typeof q1.ontoggle === "function") q1.ontoggle();
  H.t("Zuklappen entfernt den Merker", Object.keys(w.S.panelOffen || {}).length === 0);
  w.gotoSeite("start"); await H.sleep(20); w.gotoSeite("stat"); await H.sleep(40);
  H.t("Gegenprobe: danach ist wieder alles zu",
    Array.prototype.every.call(doc.querySelectorAll("#main details.stat-panel"), p => p.open === false));

  /* ========= R1.11 Stand-Streifen der STARTSEITE: zuklappbar, aber Default OFFEN =========
     Nutzer-Entscheid 2026-07-21 (Aufloesung des Widerspruchs R1.6 vs. L1). Die Gegenprobe steckt
     im Ablauf selbst: derselbe Baustein muss auf der Startseite OFFEN und auf der Statistik-Seite
     ZU starten – ein Test, der nur „ist ein details" prueft, wuerde das nicht unterscheiden. */
  w.gotoSeite("start");
  await H.sleep(40);
  const sp = doc.querySelector("#main details.stat-panel");
  H.t("Startseite: Stand-Streifen ist ein aufklappbares Panel", !!sp);
  H.t("Startseite: Panel hat eine Kopfzeile .panel-kopf", !!(sp && sp.querySelector("summary.panel-kopf")));
  H.t("Startseite: Panel startet OFFEN (L1 bleibt erfuellt)", !!sp && sp.open === true);
  H.t("Startseite: die L1-Bereitschafts-Zeile steckt IM Panel", !!(sp && sp.querySelector(".stat-mini")));
  // Zuklappen: Abweichung vom Default muss als false gemerkt werden (nicht nur geloescht)
  sp.open = false; if (typeof sp.ontoggle === "function") sp.ontoggle();
  H.t("Startseite: Zuklappen wird als Abweichung gemerkt", w.S.panelOffen["stat-start"] === false);
  w.gotoSeite("stat"); await H.sleep(20); w.gotoSeite("start"); await H.sleep(40);
  H.t("Startseite: nach Seitenwechsel bleibt es zugeklappt",
    doc.querySelector("#main details.stat-panel").open === false);
  // Zurueck zum Default -> Merker wird geloescht (Map speichert nur Abweichungen)
  const sp2 = doc.querySelector("#main details.stat-panel");
  sp2.open = true; if (typeof sp2.ontoggle === "function") sp2.ontoggle();
  H.t("Startseite: Rueckkehr zum Default loescht den Merker",
    !Object.prototype.hasOwnProperty.call(w.S.panelOffen || {}, "stat-start"));
  w.gotoSeite("stat"); await H.sleep(20); w.gotoSeite("start"); await H.sleep(40);
  H.t("Startseite: danach wieder offen", doc.querySelector("#main details.stat-panel").open === true);
  // GEGENPROBE zur Default-Logik: derselbe Baustein startet auf der Statistik-Seite weiterhin ZU
  w.gotoSeite("stat"); await H.sleep(40);
  H.t("Gegenprobe: default-zu-Panels sind davon unberuehrt",
    Array.prototype.every.call(doc.querySelectorAll("#main details.stat-panel"), p => p.open === false));
  w.gotoSeite("start"); await H.sleep(20);

  /* ================= R1.7 Wisch-Leiste nur auf Touch-Geraeten ================= */
  H.t("styles.css blendet .wischleiste standardmaessig aus", /\.wischleiste\s*\{[^}]*display\s*:\s*none/.test(css));
  H.t("styles.css zeigt .wischleiste bei pointer:coarse",
    /@media\s*\(pointer:coarse\)\s*\{\s*\.wischleiste\s*\{\s*display\s*:\s*flex/.test(css));
  w.gotoSeite("ueben");
  await H.sleep(60);
  const bar = doc.querySelector("#main .wischleiste");
  H.t("Wisch-Leiste bleibt im DOM (Handler unveraendert)", !!bar);
  /* Entscheidend: KEIN inline display – ein Inline-Wert wuerde die Media-Query aushebeln und die
     Leiste am Desktop wieder sichtbar machen. Genau dieser Fehler soll nicht zurueckkehren. */
  H.t("Wisch-Leiste hat kein inline display (Media-Query greift)", !!bar && bar.style.display === "");

  /* ================= R1.10 Notiz-Feld ausgeblendet ================= */
  H.t("Üben: kein Notiz-Feld mehr sichtbar", !doc.querySelector("#main textarea.u-min-height-60px"));
  H.t("Üben: keine Notiz-Zusammenfassung mehr",
    doc.getElementById("main").textContent.indexOf("Eigene Notiz") === -1);
  H.t("renderNotiz und S.notizen bleiben erhalten (Wiedereinschalten bleibt trivial)",
    typeof w.renderNotiz === "function" && !!w.S.notizen);

  /* ================= R2b: Zuordnung im LINKS/RECHTS-Layout =================
     Vorher standen beide Listen untereinander – man sah nicht, was Quelle und was Ziel ist.
     Bewusst ueber die BESTEHENDE `.split`-Klasse geloest, die ihre Handy-Regel (eine Spalte ab
     max-width 860px) schon mitbringt; deshalb prueft der Test BEIDES: Markup und CSS-Regel. */
  {
    const fz = w.POOL.filter(f => f.typ === "zuordnung")[0];
    const host = doc.createElement("div");
    doc.body.appendChild(host);
    w.loeseFrage(w.L.instanziiere(fz), host, { keinVerbuchen: true });
    const grid = host.querySelector(".zu-split");
    H.t("zuordnung: es gibt einen zweispaltigen Block", !!grid);
    H.t("zuordnung: der Block nutzt die bestehende .split-Klasse",
      !!grid && grid.classList.contains("split"));
    H.t("zuordnung: zwei Spalten mit je einer Überschrift",
      !!grid && grid.children.length === 2 &&
      !!grid.children[0].querySelector(".kicker") && !!grid.children[1].querySelector(".kicker"));
    H.t("zuordnung: beide Spalten enthalten Chips", !!grid &&
      grid.children[0].querySelectorAll(".zu-item").length > 0 &&
      grid.children[1].querySelectorAll(".zu-item").length > 0);
    /* GEGENPROBE 1: die Überschriften duerfen das Neuzeichnen ueberleben. `zeichne()` setzt
       lBox/rBox per innerHTML – laegen die Kicker im selben Element, waeren sie nach dem
       ersten Klick weg (die Falle aus R1.6 mit den <details>-Panels). */
    const ersterChip = grid.children[0].querySelector(".zu-item");
    if (ersterChip) ersterChip.onclick();
    H.t("Gegenprobe: Überschriften überleben das Neuzeichnen",
      !!grid.children[0].querySelector(".kicker") && !!grid.children[1].querySelector(".kicker"));
    /* GEGENPROBE 2: die Einspaltig-Regel fuers Handy muss im CSS wirklich existieren – sonst
       waere der Test oben gruen und das Layout am Handy trotzdem zweispaltig gequetscht. */
    H.t("Gegenprobe: .split klappt am Handy auf eine Spalte um",
      /@media\s*\(max-width:\s*860px\)\s*\{\s*\.split\s*\{\s*grid-template-columns:\s*1fr/.test(css));
  }

  process.exit(H.report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
