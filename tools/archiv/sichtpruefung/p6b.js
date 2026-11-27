/* Sichtpruefung N25 P6b: Startseite, Statistik, Gantt, Netzplan, Simulation - alt gegen neu, 1280 und 390.
   ⛔⛔ Wie in p6.js ist der eigentliche Zweck `offen0`: ein aufgeklapptes Accordion ODER Collapsible
   OHNE Hoehe sieht in jsdom aus wie ein aufgeklapptes - die Klasse "leere Lupe" (N23 bis P4).
   Dazu `null0`: sichtbare Bedienelemente auf 0x0. */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const AUS = path.join(__dirname, "../../_to_delete/helfer/sicht6b");
const STAENDE = { alt: "http://127.0.0.1:8766/v2/", neu: "http://127.0.0.1:8765/v2/" };
const STAND = { version: 5, statistik: { M01: { richtig: 9, gesamt: 10 }, "T:M01:Netzplan & Puffer": { richtig: 9, gesamt: 10 } } };
/** @param {import("playwright-core").Page} p @param {string} n */
const knopf = (p, n) => p.getByRole("button", { name: n, exact: true }).first().click();
/** @param {import("playwright-core").Page} p */
const simStart = async (p) => { await p.getByLabel("Aufgaben insgesamt").fill("12"); await knopf(p, "Prüfung starten"); };
/* name, Adresse, was getan wird */
/** @type {[string, string, ((p: import("playwright-core").Page) => Promise<any>) | null][]} */
const ZUSTAENDE = [
  ["start", "#start", async (p) => knopf(p, "Mehr Statistik anzeigen")],
  ["stat", "#stat", null],
  ["gantt", "#gantt", async (p) => { await knopf(p, "Planung prüfen"); await knopf(p, "Kompletter Lösungsweg"); }],
  ["netzplan", "#netzplan", async (p) => knopf(p, "Netzplan prüfen")],
  ["sim-start", "#sim", null],
  ["sim-lauf", "#sim", simStart],
  ["sim-auswertung", "#sim", async (p) => { await simStart(p); await knopf(p, "Abgeben");
    await p.waitForTimeout(400); const t = p.locator('main [data-slot="accordion-trigger"], main details summary').first();
    if (await t.count()) await t.click(); }],
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
        const p = await ctx.newPage();
        /** @type {string[]} */
        const fehler = [];
        p.on("console", (m) => { if (m.type() === "error") fehler.push(m.text().slice(0, 120)); });
        p.on("pageerror", (e) => fehler.push("PAGEERROR " + String(e).slice(0, 120)));
        await p.goto(url, { waitUntil: "domcontentloaded" });
        await p.evaluate((s) => localStorage.setItem("ap1v2_state", JSON.stringify(s)), STAND);
        await p.goto(url + adresse, { waitUntil: "networkidle" });
        await p.reload({ waitUntil: "networkidle" });
        await p.waitForTimeout(600);
        try { if (tun) await tun(p); } catch (e) { fehler.push("KLICK " + String(/** @type {Error} */ (e).message).slice(0, 90)); }
        await p.waitForTimeout(700);
        /** @type {Record<string, any>} */
        const m = await p.evaluate(() => {
          const main = document.querySelector("main");
          const mr = main ? main.getBoundingClientRect() : null;
          const els = [...document.querySelectorAll("main input,main button,main table,main select")];
          const raus = els.filter((e) => { const r = e.getBoundingClientRect();
            return r.width > 0 && mr && r.right > mr.right + 1; }).length;
          const null0 = els.filter((e) => { const r = e.getBoundingClientRect();
            return e.checkVisibility() && (r.width < 1 || r.height < 1); }).length;
          const auf = [...document.querySelectorAll('[data-slot="accordion-item"][data-state="open"],[data-slot="collapsible"][data-state="open"]')];
          const offen0 = auf.filter((i) => {
            const c = i.querySelector('[data-slot="accordion-content"],[data-slot="collapsible-content"]');
            if (!c) return true; const r = c.getBoundingClientRect(); return r.height < 4 || r.width < 4;
          }).length;
          const t = [...document.querySelectorAll("main table")].map((x) => Math.round(x.getBoundingClientRect().width));
          return { doc: document.documentElement.scrollWidth - innerWidth,
                   main: mr ? Math.round(mr.width) : -1, bedien: els.length, raus, null0,
                   auf: auf.length, offen0, tabellen: t.join("/") };
        });
        if (fehler.length) m.fehler = fehler;
        (erg[name] ??= {})[stand + w] = m;
        await p.screenshot({ path: path.join(AUS, `${stand}-${name}-${w}.png`), fullPage: true });
        await ctx.close();
      }
    }
  }
  await b.close();
  fs.writeFileSync(path.join(AUS, "mass.json"), JSON.stringify(erg, null, 1));
  for (const [name, z] of Object.entries(erg)) for (const w of [1280, 390])
    console.log(`${name} ${w}: alt=${JSON.stringify(z["alt" + w])} neu=${JSON.stringify(z["neu" + w])}`);
})().catch((e) => { console.log("ABBRUCH", e.message); process.exit(1); });
