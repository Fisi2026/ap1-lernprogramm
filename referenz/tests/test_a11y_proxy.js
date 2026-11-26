/* NOTBEHELF für test_axe, solange axe-core nicht installierbar ist (npm-Registry gibt seit
   2026-07-21 durchgehend 403). Prüft an den in FB-R2b NEU entstandenen Elementen genau die
   Regeln, die axe bei Formular- und Tabellen-Markup am häufigsten meldet:
   doppelte IDs, Eingabefelder ohne zugängliche Beschriftung, Buttons ohne zugänglichen Namen,
   Tabellen ohne Kopfzellen.

   ⚠️ DAS ERSETZT test_axe NICHT. axe prüft rund 90 Regeln, diese Datei vier – und nur an zwei
   Ansichten. Sobald `npm install axe-core` wieder durchgeht, gilt wieder `node test_axe.js`;
   diese Suite kann dann bleiben (sie ist billig) oder entfallen.

   ⚠️ BEWUSST NUR DIE NEUEN ELEMENTE. Ein Lauf über die ganze App meldet sechs Bestandsbefunde
   (Antwortfelder `input.luecke`, das Suchfeld, Auswahl und Notizfeld des Spickzettels haben
   keine Beschriftung). Die sind ALT und nicht Gegenstand dieser Runde – nimmt man sie mit auf,
   ist die Suite dauerhaft rot und niemand sieht mehr hin. Wer sie angehen will: eigener Task. */
const H = require("./_harness.js");

(async () => {
  const w = await H.boot();
  const doc = w.document;

  /* ---- Taschenrechner (FB-R2b.1) ---- */
  const f = w.POOL.filter(x => x.typ === "rechenassistent")[0];
  const host = doc.createElement("div");
  doc.getElementById("main").appendChild(host);
  w.loeseFrage(w.L.instanziiere(f), host, { simulation: false, onGraded() {}, onNext() {} });
  const wrap = host.querySelector(".rechner-wrap");
  H.t("Rechner-Panel ist gerendert", !!wrap);

  const ohneLabel = [];
  wrap.querySelectorAll("input, textarea, select").forEach(e => {
    const hat = e.getAttribute("aria-label") ||
      (e.id && doc.querySelector("label[for='" + e.id + "']")) || e.closest("label");
    if (!hat) ohneLabel.push(e.tagName + "." + e.className);
  });
  H.t("Rechner: alle Felder beschriftet" + (ohneLabel.length ? " [" + ohneLabel.join(", ") + "]" : ""),
    ohneLabel.length === 0);

  let ohneName = 0;
  wrap.querySelectorAll("button").forEach(e => {
    if (!(e.textContent || "").trim() && !e.getAttribute("aria-label")) ohneName++;
  });
  H.t("Rechner: alle Tasten haben einen zugänglichen Namen", ohneName === 0);
  H.t("Rechner: die Notizfeld-ID kommt genau einmal vor",
    doc.querySelectorAll("[id='" + wrap.querySelector("textarea").id + "']").length === 1);

  /* ---- Stufen-Vorschau (FB-R2b.2) ---- */
  w.gotoSeite("stat");
  await H.sleep(40);
  const tbl = doc.querySelector("#main table.stufen-tab");
  H.t("Stufen-Matrix ist gerendert", !!tbl);
  H.t("Stufen-Matrix: hat fünf Kopfzellen", tbl.querySelectorAll("th").length === 5);
  H.t("Stufen-Matrix: enthält keine Formularelemente", tbl.querySelectorAll("input, textarea, select").length === 0);
  let leereSummary = 0;
  tbl.querySelectorAll("summary").forEach(s => { if (!(s.textContent || "").trim()) leereSummary++; });
  H.t("Stufen-Matrix: jede Aufklapp-Zeile hat einen Text", leereSummary === 0);

  const ids = {};
  let doppelt = 0;
  doc.querySelectorAll("[id]").forEach(e => { ids[e.id] = (ids[e.id] || 0) + 1; });
  Object.keys(ids).forEach(k => { if (ids[k] > 1) { doppelt++; console.log("  DOPPELTE ID: " + k); } });
  H.t("Statistik-Seite mit Matrix: keine doppelten IDs", doppelt === 0);

  process.exit(H.report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
