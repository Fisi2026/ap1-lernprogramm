const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, "ids.json"), "utf8"));
const STAENDE = { alt: "http://127.0.0.1:8766/v2/", neu: "http://127.0.0.1:8765/v2/" };
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  /** @type {Record<string, any>} */
  const erg = {};
  for (const w of [1280, 390]) {
    for (const [stand, url] of Object.entries(STAENDE)) {
      for (const [typ, id] of Object.entries(ids)) {
        const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
        const p = await ctx.newPage();
        /** @type {string[]} */
        const fehler = [];
        p.on("console", (m) => { if (m.type() === "error") fehler.push(m.text().slice(0, 140)); });
        p.on("pageerror", (e) => fehler.push("PAGEERROR " + String(e).slice(0, 140)));
        await p.goto(url + "#frage=" + id, { waitUntil: "networkidle" });
        await p.waitForTimeout(600);
        /** @type {Record<string, any>} */
        const m = await p.evaluate(() => {
          const main = document.querySelector("main"); const mr = main ? main.getBoundingClientRect() : null;
          const sel = "main [role=radio],main [role=checkbox],main select,main input,main textarea,main button,main table";
          const els = [...document.querySelectorAll(sel)];
          const raus = els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && mr && r.right > mr.right + 1; }).length;
          const tabelle = [...document.querySelectorAll("main table")].map((t) => Math.round(t.getBoundingClientRect().width));
          return { doc: document.documentElement.scrollWidth - innerWidth, main: mr ? Math.round(mr.width) : -1,
                   bedien: els.length, raus, tabelle: tabelle.join(",") };
        });
        m.fehler = fehler.length ? fehler : undefined;
        (erg[typ] ??= {})[stand + w] = m;
        await p.screenshot({ path: path.join(path.join(__dirname, "../../_to_delete/helfer/sicht4"), `${stand}-${typ}-${w}.png`), fullPage: true });
        await ctx.close();
      }
    }
  }
  await b.close();
  fs.writeFileSync(path.join(path.join(__dirname, "../../_to_delete/helfer/sicht4"), "mass.json"), JSON.stringify(erg, null, 1));
  for (const [typ, s] of Object.entries(erg)) for (const w of [1280, 390]) {
    const a = s["alt" + w], n = s["neu" + w];
    const diff = ["doc", "main", "bedien", "raus", "tabelle"].filter((k) => a[k] !== n[k]).map((k) => `${k} ${a[k]}->${n[k]}`);
    if (diff.length || n.fehler || a.fehler) console.log(typ, w, diff.join(" | "), n.fehler ? "NEU-FEHLER " + n.fehler.join(" / ") : "", a.fehler ? "ALT-FEHLER " + a.fehler.length : "");
  }
  console.log("FERTIG", Object.keys(erg).length, "Typen");
})().catch((e) => { console.log("ABBRUCH", e.message); process.exit(1); });
