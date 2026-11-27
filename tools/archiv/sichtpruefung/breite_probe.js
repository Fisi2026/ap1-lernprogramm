/* N25b, GEGENPROBE zur Messung (22.09.2026): ist `1fr` wirklich die Ursache?
   Die Regel wird NUR IM BROWSER gesetzt, nichts im Quelltext geaendert. Erwartung, wenn die
   Diagnose stimmt: mit `minmax(0,1fr)` faellt die zweite Spalte auf Viewport minus Schiene,
   `main` passt in den Schirm, und die Zahl der Ueberlaeufer sinkt deutlich. */
const { chromium } = require("playwright-core");
const URL = "http://127.0.0.1:8765/v2/";
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  // ⛔⛔ JE BEREICH EINE FRISCHE SEITE. Beim ersten Versuch am 22.09. lief alles in EINER Seite:
  //    ein Hash-Wechsel laedt nicht neu (LIESMICH, Falle 1), also wirkte der bei `start`
  //    eingespritzte Stil bei allen folgenden Bereichen weiter - ihr "VOR" war schon das
  //    "NACH". Aufgefallen ist es nur, weil der VOR-Wert unplausibel gut war.
  /** @param {import("playwright-core").Page} p */
  const miss = (p) => p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const huelle = /** @type {Element} */ (document.querySelector("#root > div"));
    const main = document.querySelector("main");
    const raus = Array.from(document.querySelectorAll("body *"))
      .filter((n) => n.getBoundingClientRect().right > vw + 1).length;
    return { cols: getComputedStyle(huelle).gridTemplateColumns,
             main: Math.round(/** @type {Element} */ (main).getBoundingClientRect().width), ueber: raus };
  });
  for (const bereich of ["start", "ueben", "stat", "glossar"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(URL + "#" + bereich, { waitUntil: "networkidle" });
    await p.waitForTimeout(250);
    const vor = await miss(p);
    await p.addStyleTag({ content: "#root > div { grid-template-columns: 3.5rem minmax(0,1fr) !important; }" });
    await p.waitForTimeout(250);
    const nach = await miss(p);
    await ctx.close();
    console.log(bereich.padEnd(10),
      "VOR  main " + String(vor.main).padStart(5) + "  ueber " + String(vor.ueber).padStart(3) + "  cols " + vor.cols,
      "\n           NACH main " + String(nach.main).padStart(5) + "  ueber " + String(nach.ueber).padStart(3) + "  cols " + nach.cols);
  }
  await b.close();
})();
