/* Sichtpruefung N25 P6a: Glossar und Spickzettel, alt gegen neu, 1280 und 390.
   ⛔⛔ DER EIGENTLICHE ZWECK: ein Accordion animiert seine Hoehe. Ein aufgeklappter
   Abschnitt OHNE Hoehe sieht in jsdom aus wie ein aufgeklappter Abschnitt - das ist
   dieselbe Klasse wie die leere Lupe von N23 bis P4. `offen0` zaehlt genau das. */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const AUS = path.join(__dirname, "../../_to_delete/helfer/sicht6");
const STAENDE = { alt: "http://127.0.0.1:8766/v2/", neu: "http://127.0.0.1:8765/v2/" };
const TOR = { version: 5, statistik: { M01: { richtig: 500, gesamt: 500 } } };
/* name, Adresse, Lernstand, was getippt wird (Label, Text) */
/** @type {[string, string, any, string | string[] | null][]} */
const ZUSTAENDE = [
  ["glossar",       "#glossar", TOR, null],
  ["glossar-suche", "#glossar", TOR, ["Begriff suchen", "netz"]],
  ["glossar-abk",   "#glossar", TOR, "ABK"],
  ["spick",         "#spickzettel", TOR, null],
  ["spick-suche",   "#spickzettel", TOR, ["Im Spickzettel suchen", "kosten"]],
];

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  const b = await chromium.launch({ channel: "msedge", headless: true });
  /** @type {Record<string, any>} */
  const erg = {};
  for (const w of [1280, 390]) {
    for (const [stand, url] of Object.entries(STAENDE)) {
      for (const [name, adresse, lern, tun] of ZUSTAENDE) {
        const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
        const p = await ctx.newPage();
        /** @type {string[]} */
        const fehler = [];
        p.on("console", (m) => { if (m.type() === "error") fehler.push(m.text().slice(0, 120)); });
        p.on("pageerror", (e) => fehler.push("PAGEERROR " + String(e).slice(0, 120)));
        await p.goto(url, { waitUntil: "domcontentloaded" });
        await p.evaluate((s) => localStorage.setItem("ap1v2_state", JSON.stringify(s)), lern);
        await p.goto(url + adresse, { waitUntil: "networkidle" });
        await p.reload({ waitUntil: "networkidle" });
        await p.waitForTimeout(600);
        try {
          if (tun === "ABK") await p.getByRole("button", { name: /Abkürzungen/ }).click();
          else if (tun) { await p.getByLabel(tun[0]).fill(tun[1]); await p.waitForTimeout(500); }
          else { const k = p.locator('[data-slot="accordion-trigger"]').first();
                 if (await k.count()) await k.click(); }
        } catch (e) { fehler.push("KLICK " + String(/** @type {Error} */ (e).message).slice(0, 90)); }
        await p.waitForTimeout(700);
        /** @type {Record<string, any>} */
        const m = await p.evaluate(() => {
          const main = document.querySelector("main");
          const mr = main ? main.getBoundingClientRect() : null;
          const els = [...document.querySelectorAll("main input,main button,main table")];
          const raus = els.filter((e) => { const r = e.getBoundingClientRect();
            return r.width > 0 && mr && r.right > mr.right + 1; }).length;
          /* Aufgeklappte Abschnitte: haben sie Hoehe? Und hat ihr Text Hoehe? */
          const auf = [...document.querySelectorAll('[data-slot="accordion-item"][data-state="open"]')];
          const offen0 = auf.filter((i) => {
            const c = i.querySelector('[data-slot="accordion-content"]');
            if (!c) return true;
            const r = c.getBoundingClientRect();
            return r.height < 4 || r.width < 4;
          }).length;
          return { doc: document.documentElement.scrollWidth - innerWidth,
                   main: mr ? Math.round(mr.width) : -1, bedien: els.length, raus,
                   posten: document.querySelectorAll('[data-slot="accordion-item"]').length,
                   auf: auf.length, offen0,
                   tabellen: document.querySelectorAll("main table").length };
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
