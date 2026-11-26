/* Test #47: SVG-Zoom (jsdom). Prüft: ⤢-Button an bild+hotspot-svgbox, Klick öffnet Overlay mit
   vergrößertem SVG, Doppel-Öffnen verhindert, Schließen per Esc / Hintergrund-Klick / ✕-Button,
   keydown-Listener wird entfernt (kein zweites Overlay bei Esc nach Schließen), Hotspot-Zonen bleiben klickbar. */
const { t: check, boot, report } = require("./_harness.js");

(async () => {
  const w = await boot();
  const D = w.document;
  const OV = () => D.querySelectorAll(".zoomoverlay");
  const host = D.createElement("div"); D.body.appendChild(host);
  const opts = { onGraded: function () {}, onNext: function () {}, simulation: false };

  // --- bild-Frage ---
  const bild = w.POOL.find(function (f) { return f.typ === "bild" && f.svg; });
  check("bild-Frage mit SVG im Pool vorhanden", !!bild);
  w.loeseFrage(bild, host, opts);
  const btn = host.querySelector(".svgbox .zoombtn");
  check("⤢-Button an bild-svgbox", !!btn);
  check("noch kein Overlay", OV().length === 0);

  btn.click();
  check("Klick öffnet genau 1 Overlay", OV().length === 1);
  check("Overlay enthält vergrößertes SVG", !!D.querySelector(".zoomoverlay .zoominner svg"));

  btn.click(); // Doppel-Öffnen-Guard
  check("Zweiter Klick öffnet kein zweites Overlay", OV().length === 1);

  // Esc schließt
  D.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape" }));
  check("Esc schließt Overlay", OV().length === 0);
  // Listener entfernt: erneutes Esc ohne Overlay ist harmlos (kein Crash, kein Overlay)
  D.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape" }));
  check("Esc nach Schließen harmlos", OV().length === 0);

  // Hintergrund-Klick schließt
  btn.click();
  check("erneut geöffnet", OV().length === 1);
  OV()[0].click(); // e.target === overlay
  check("Hintergrund-Klick schließt", OV().length === 0);

  // Klick AUF das SVG schließt NICHT
  btn.click();
  D.querySelector(".zoomoverlay .zoominner svg").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  check("Klick auf Grafik schließt nicht (nur ansehen)", OV().length === 1);

  // ✕-Button schließt
  D.querySelector(".zoomoverlay .zoomclose").click();
  check("✕-Button schließt", OV().length === 0);

  // --- hotspot-Frage: Button vorhanden UND Zonen klickbar ---
  const hs = w.POOL.find(function (f) { return f.typ === "hotspot" && f.svg && f.zonen; });
  check("hotspot-Frage im Pool vorhanden", !!hs);
  w.loeseFrage(hs, host, opts);
  const hsBtn = host.querySelector(".svgbox .zoombtn");
  check("⤢-Button an hotspot-svgbox", !!hsBtn);
  const zonen = host.querySelectorAll(".svgbox [data-hz]");
  check("Hotspot-Zonen vorhanden", zonen.length === hs.zonen.length);
  check("Hotspot-Zonen klickbar (onclick gesetzt)", typeof zonen[0].onclick === "function");
  // Zoom der Hotspot-Grafik öffnet Overlay
  hsBtn.click();
  check("Hotspot ⤢ öffnet Overlay", OV().length === 1);
  D.querySelector(".zoomoverlay .zoomclose").click();
  check("aufgeräumt", OV().length === 0);

  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
