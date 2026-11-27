const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, "ids.json"), "utf8"));
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  for (const [stand, url] of [["alt","http://127.0.0.1:8766/v2/"],["neu","http://127.0.0.1:8765/v2/"]]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(url + "#frage=" + "M01-002", { waitUntil: "networkidle" });
    await p.waitForTimeout(500);
    await p.getByRole("button", { name: /vergrößern/ }).first().click();
    await p.waitForTimeout(500);
    const m = await p.evaluate(() => {
      const z = document.querySelector('[data-teil="bild-zoom"]');
      if (!z) return { zoom: "FEHLT" };
      const r = z.getBoundingClientRect();
      const svg = z.querySelector("svg");
      const sr = svg ? svg.getBoundingClientRect() : null;
      const kasten = z.querySelector("div");
      const kr = kasten ? kasten.getBoundingClientRect() : null;
      const cs = getComputedStyle(z);
      const kinder = [...z.children].map((c) => c.tagName + "#" + c.innerHTML.length);
      return { kinder, innen: z.innerHTML.length, zoom: [Math.round(r.width), Math.round(r.height)], display: cs.display, hinter: cs.backgroundColor,
               kasten: kr ? [Math.round(kr.width), Math.round(kr.height)] : null,
               svgGross: sr ? [Math.round(sr.width), Math.round(sr.height)] : "KEIN SVG" };
    });
    console.log(stand, JSON.stringify(m));
    await p.screenshot({ path: path.join(path.join(__dirname, "../../_to_delete/helfer/sicht4"), `z-${stand}-lupe.png`) });
    await ctx.close();
  }
  await b.close();
})().catch((e) => { console.log("ABBRUCH", e.message); process.exit(1); });
