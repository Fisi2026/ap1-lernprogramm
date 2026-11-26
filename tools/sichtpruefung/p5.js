/* Sichtpruefung N25 P5: die LISTEN und ihre Leerzustaende, alt gegen neu, 1280 und 390.
   Markiert, Fehler-Deck, Meldungsliste - je gefuellt und leer. Die Meldungsliste
   bekommt ihren Server ueber p.route (http.server kennt kein /api). Masse wie p4.js. */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, "ids.json"), "utf8"));
const AUS = path.join(__dirname, "../../_to_delete/helfer/sicht5");
const STAENDE = { alt: "http://127.0.0.1:8766/v2/", neu: "http://127.0.0.1:8765/v2/" };
const TAG = 86400000, JETZT = Date.now();
const LEER = { version: 5, abrufAn: false };
const VOLL = { ...LEER, markiert: { [ids.mc]: 1, [ids.hotspot]: 1, "M99-999": 1 },
  fehlerDeck: { [ids.mc]: { streak: 0, due: JETZT - TAG }, [ids.hotspot]: { streak: 2, due: JETZT + 3 * TAG } } };
const ZEILEN = [
  { nr: 2, frage_id: ids.mc, grund: "Veraltet", text: "Norm neu, bitte pruefen", erstellt: JETZT - TAG,
    fassung: "neu", version: "1.36.0", status: "offen", erledigt: null },
  { nr: 3, frage_id: "M99-999", grund: "Tippfehler", text: "", erstellt: JETZT,
    fassung: "alt", version: "", status: "offen", erledigt: null },
];
/* name, Adresse, Lernstand, Meldungen vom Server (null = kein Schluessel) */
/** @type {[string, string, any, any[] | null][]} */
const ZUSTAENDE = [
  ["markiert",      "#markiert",  VOLL, null],
  ["markiert-leer", "#markiert",  LEER, null],
  ["fd",            "#fd",        VOLL, null],
  ["fd-leer",       "#fd",        LEER, null],
  ["meld",          "#meldungen", LEER, ZEILEN],
  ["meld-leer",     "#meldungen", LEER, []],
  ["meld-schluessel", "#meldungen", LEER, null],
];

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  const b = await chromium.launch({ channel: "msedge", headless: true });
  /** @type {Record<string, any>} */
  const erg = {};
  for (const w of [1280, 390]) {
    for (const [stand, url] of Object.entries(STAENDE)) {
      for (const [name, adresse, lern, zeilen] of ZUSTAENDE) {
        const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
        const p = await ctx.newPage();
        /** @type {string[]} */
        const fehler = [];
        p.on("console", (m) => { if (m.type() === "error") fehler.push(m.text().slice(0, 120)); });
        p.on("pageerror", (e) => fehler.push("PAGEERROR " + String(e).slice(0, 120)));
        await p.route("**/api/meldungen**", (r) => r.fulfill({ json: { meldungen: zeilen ?? [] } }));
        await p.goto(url, { waitUntil: "domcontentloaded" });
        await p.evaluate(([s, k]) => {
          localStorage.setItem("ap1v2_state", JSON.stringify(s));
          if (k) localStorage.setItem("ap1v2_meldeschluessel", "probe"); else localStorage.removeItem("ap1v2_meldeschluessel");
        }, [lern, zeilen !== null]);
        await p.goto(url + adresse, { waitUntil: "networkidle" });
        await p.reload({ waitUntil: "networkidle" });   /* Falle 1: Hash-Wechsel laedt nicht neu */
        await p.waitForTimeout(700);
        /** @type {Record<string, any>} */
        const m = await p.evaluate(() => {
          const main = document.querySelector("main");
          const mr = main ? main.getBoundingClientRect() : null;
          const sel = "main [role=radio],main input,main button,main li[data-slot=item],main [data-slot=empty]";
          const els = [...document.querySelectorAll(sel)];
          const raus = els.filter((e) => { const r = e.getBoundingClientRect();
            return r.width > 0 && mr && r.right > mr.right + 1; }).length;
          const null0 = [...document.querySelectorAll("main li[data-slot=item],main [data-slot=empty]")]
            .filter((e) => { const r = e.getBoundingClientRect(); return r.width === 0 || r.height === 0; }).length;
          return { doc: document.documentElement.scrollWidth - innerWidth, main: mr ? Math.round(mr.width) : -1,
                   bedien: els.length, raus, null0,
                   eintraege: document.querySelectorAll("main li[data-slot=item]").length };
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
  for (const [name, z] of Object.entries(erg)) for (const w of [1280, 390]) {
    const a = z["alt" + w], n = z["neu" + w];
    console.log(`${name} ${w}: alt=${JSON.stringify(a)} neu=${JSON.stringify(n)}`);
  }
})().catch((e) => { console.log("ABBRUCH", e.message); process.exit(1); });
