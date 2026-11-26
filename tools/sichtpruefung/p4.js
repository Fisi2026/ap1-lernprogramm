/* Sichtpruefung N25 P4: die ZUSTAENDE der Karte, alt gegen neu, 1280 und 390.
   Gemessen wird je Zustand: Bedienelemente in main, Elemente die rechts aus
   main herausragen, waagerechter Rollweg des Dokuments, Konsolenfehler. */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, "ids.json"), "utf8"));
const AUS = path.join(__dirname, "../../_to_delete/helfer/sicht4");
const STAENDE = { alt: "http://127.0.0.1:8766/v2/", neu: "http://127.0.0.1:8765/v2/" };
const STAND = { version: 5, abrufAn: false, markiert: { [ids.mc]: 1 },
  meldungen: { [ids.mc]: { grund: "Tippfehler", text: "Komma fehlt", datum: Date.now() } } };

/* Jeder Zustand: wohin, und was davor geklickt wird. */
/** @type {[string, string, (p: import("playwright-core").Page) => Promise<void>][]} */
const ZUSTAENDE = [
  ["urteil",  "#frage=" + ids.mc,        async (p) => { await p.getByRole("button", { name: "Aufgeben" }).click(); }],
  ["melden",  "#frage=" + ids.mc,        async () => {}],   /* mit gespeicherter Meldung ist er schon offen */
  ["hilfe",   "#frage=" + ids.hotspot,   async () => {}],
  ["lupe",    "#frage=" + ids.beschriftung, async (p) => { await p.getByRole("button", { name: /vergrößern/ }).first().click(); }],
  ["kennung", "#markiert",               async () => {}],
];

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  const b = await chromium.launch({ channel: "msedge", headless: true });
  /** @type {Record<string, any>} */
  const erg = {};
  for (const w of [1280, 390]) {
    for (const [stand, url] of Object.entries(STAENDE)) {
      for (const [name, adresse, tun] of ZUSTAENDE) {
        const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
        const p = await ctx.newPage(); /** @type {string[]} */ const fehler = [];
        p.on("console", (m) => { if (m.type() === "error") fehler.push(m.text().slice(0, 120)); });
        p.on("pageerror", (e) => fehler.push("PAGEERROR " + String(e).slice(0, 120)));
        await p.goto(url, { waitUntil: "domcontentloaded" });
        await p.evaluate((s) => localStorage.setItem("ap1v2_state", JSON.stringify(s)), STAND);
        await p.goto(url + adresse, { waitUntil: "networkidle" });
        await p.reload({ waitUntil: "networkidle" });
        await p.waitForTimeout(500);
        try { await tun(p); } catch (e) { fehler.push("KLICK " + String(/** @type {Error} */ (e).message).slice(0, 90)); }
        await p.waitForTimeout(400);
        /** @type {Record<string, any>} */
        const m = await p.evaluate(() => {
          const main = document.querySelector("main");
          const mr = main ? main.getBoundingClientRect() : null;
          const sel = "main [role=radio],main [role=checkbox],main select,main input,main textarea,main button,main table";
          const els = [...document.querySelectorAll(sel)];
          const raus = els.filter((e) => { const r = e.getBoundingClientRect();
            return r.width > 0 && mr && r.right > mr.right + 1; }).length;
          return { doc: document.documentElement.scrollWidth - innerWidth,
                   main: mr ? Math.round(mr.width) : -1, bedien: els.length, raus };
        });
        if (fehler.length) m.fehler = fehler;
        (erg[name] ??= {})[stand + w] = m;
        await p.screenshot({ path: path.join(AUS, `${stand}-${name}-${w}.png`), fullPage: w === 1280 });
        await ctx.close();
      }
    }
  }
  await b.close();
  fs.writeFileSync(path.join(AUS, "mass.json"), JSON.stringify(erg, null, 1));
  for (const [name, z] of Object.entries(erg)) {
    for (const w of [1280, 390]) {
      const a = z["alt" + w], n = z["neu" + w];
      const gleich = a.bedien === n.bedien && a.raus === n.raus && a.doc === n.doc;
      console.log(`${name} ${w}: ${gleich ? "GLEICH" : "ABWEICHUNG"} alt=${JSON.stringify(a)} neu=${JSON.stringify(n)}`);
    }
  }
})().catch((e) => { console.log("ABBRUCH", e.message); process.exit(1); });
