/* Sichtpruefung N31 (nachgeholt 23.09.): der ZUSCHAUER-HINWEIS und Einstellungen -> „Speicher",
   1280 und 390 px, nur der Arbeitsbaum (8765). Kein alt/neu-Vergleich: beides ist mit v1.39.0
   ausgeliefert, HEAD v2 = Arbeitsbaum.
   Der Zuschauer entsteht ECHT: zwei Seiten im SELBEN Kontext teilen navigator.locks und
   BroadcastChannel - die erste haelt die Sperre, die zweite wird Zuschauer (kein Nachbau).
   Zustaende: zs-start / zs-einst (Hinweis ueber zwei Schirmen) · zs-rueckfrage (im ersten Tab
   laeuft eine Simulation, Klick auf „Hier weiterarbeiten") · zs-uebernommen (ohne Lauf: der
   Klick macht den ersten Tab zum Zuschauer) · speicher-sauber / speicher-repariert.
   Gemessen: doc (waagerechter Rollweg), main, raus, und fuer Hinweis/Dialog/Karte der Kasten,
   ob er ganz im Fenster liegt, ob Text rechts herausragt, Groesse des Knopfs, inert. */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const AUS = path.join(__dirname, "../../_to_delete/helfer/sicht4");
const URL = "http://127.0.0.1:8765/v2/";
const H = 900;

/**
 * @param {import("playwright-core").Page} p
 * @param {string} sel
 * @returns {Promise<Record<string, any>>}
 */
async function mass(p, sel) {
  return p.evaluate(/** @param {any[]} arg */ ([sel, H]) => {
    const main = document.querySelector("main"); const mr = main ? main.getBoundingClientRect() : null;
    const els = [...document.querySelectorAll("main button,main input,main textarea,main select,main [role=radio],main [role=checkbox]")];
    const raus = els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && mr && r.right > mr.right + 1; }).length;
    /** @type {Record<string, any>} */
    const m = { doc: document.documentElement.scrollWidth - innerWidth, main: mr ? Math.round(mr.width) : -1, raus,
      inert: !!document.querySelector("[inert]") };
    const k = sel ? document.querySelector(sel) : null;
    if (sel) {
      if (!k) { m.kasten = "FEHLT"; return m; }
      const r = k.getBoundingClientRect();
      m.kasten = [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
      m.imFenster = r.x >= 0 && r.y >= 0 && r.right <= innerWidth + 1 && r.bottom <= H + 1;
      const kinder = [...k.querySelectorAll("*")].filter((e) => { const q = e.getBoundingClientRect(); return q.width > 0 && q.right > r.right + 1; });
      m.textRaus = kinder.length;
      m.ueberlauf = [...k.querySelectorAll("*")].filter((e) => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== "visible").length;
      const b = [...k.querySelectorAll("button")].map((x) => { const q = x.getBoundingClientRect(); return [x.textContent.trim().slice(0, 28), Math.round(q.width), Math.round(q.height)]; });
      m.knoepfe = b;
      /* Ueberdeckung: Titel gegen Knopf im selben Kasten. textRaus sieht sie NICHT (ein absolut
         liegender Knopf ragt nicht heraus, er liegt DRAUF) - gefunden am 23.09. bei 390 px. */
      /** @param {DOMRect} a @param {DOMRect} c */
      const schnitt = (a, c) => Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left)) * Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top));
      const titel = [...k.querySelectorAll("[data-slot=alert-title],[data-slot=dialog-title]")];
      /** @param {Element} t */
      const zeilen = (t) => { const rg = document.createRange(); rg.selectNodeContents(t); return [...rg.getClientRects()]; }; /* der TEXT, nicht die Box (die ist volle Breite) */
      m.deckt = titel.flatMap((t) => [...k.querySelectorAll("button")].map((x) => zeilen(t).some((z) => schnitt(z, x.getBoundingClientRect()) > 4) ? x.textContent.trim().slice(0, 20) || "X" : null)).filter(Boolean);
    }
    /* Kacheln der Startseite: Badge gegen Kacheltitel (vorbestehend, gefunden 23.09.) */
    m.badgeDeckt = [...document.querySelectorAll("[data-ziel]")].filter((kach) => {
      const bd = kach.querySelector("[data-slot=badge]"); const t = kach.querySelector("span.font-semibold");
      if (!bd || !t) return false;
      const a = bd.getBoundingClientRect(); const rg = document.createRange(); rg.selectNodeContents(t); const rs = [...rg.getClientRects()]; /* Textzeilen, nicht die Box samt Innenabstand */
      return rs.some((c) => Math.min(a.right, c.right) - Math.max(a.left, c.left) > 1 && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 1);
    }).map((kach) => kach.getAttribute("data-ziel"));
    return m;
  }, [sel, H]);
}

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  const b = await chromium.launch({ channel: "msedge", headless: true });
  /** @type {string[]} */
  const zeilen = [];
  /** @param {string} name @param {Record<string, any>} m @param {string[]} fehler */
  const merke = (name, m, fehler) => { if (fehler.length) m.fehler = fehler; zeilen.push(name + " " + JSON.stringify(m)); };
  const HINWEIS = "div.fixed.inset-x-0.top-0";
  for (const w of [1280, 390]) {
    /* --- Zuschauer: zwei Seiten, ein Kontext --- */
    for (const [was, hash] of [["start", "#start"], ["einst", "#einst"]]) {
      const ctx = await b.newContext({ viewport: { width: w, height: H } });
      /** @type {string[]} */
      const fehler = [];
      const p1 = await ctx.newPage(); await p1.goto(URL + "#start", { waitUntil: "networkidle" }); await p1.waitForTimeout(500);
      const p2 = await ctx.newPage();
      p2.on("console", (m) => { if (m.type() === "error") fehler.push(m.text().slice(0, 120)); });
      p2.on("pageerror", (e) => fehler.push("PAGEERROR " + String(e).slice(0, 120)));
      await p2.goto(URL + hash, { waitUntil: "networkidle" }); await p2.waitForTimeout(600);
      const m = await mass(p2, HINWEIS);
      m.p1_hinweis = !!(await p1.$(HINWEIS));
      const name = `zs-${was}-${w}`;
      await p2.screenshot({ path: path.join(AUS, name + ".png") });
      merke(name, m, fehler);
      if (was === "start") {
        /* ohne Lauf: der Klick uebernimmt, der erste Tab wird Zuschauer */
        await p2.getByRole("button", { name: "Hier weiterarbeiten" }).click(); await p2.waitForTimeout(800);
        const m2 = await mass(p1, HINWEIS); m2.p2_hinweis = !!(await p2.$(HINWEIS));
        await p1.bringToFront(); await p1.screenshot({ path: path.join(AUS, `zs-uebernommen-${w}.png`) });
        merke(`zs-uebernommen-${w}`, m2, []);
      }
      await ctx.close();
    }
    /* --- Rueckfrage: im ersten Tab laeuft eine Simulation --- */
    {
      const ctx = await b.newContext({ viewport: { width: w, height: H } });
      /** @type {string[]} */
      const fehler = [];
      const p1 = await ctx.newPage(); await p1.goto(URL + "#sim", { waitUntil: "networkidle" }); await p1.waitForTimeout(500);
      try { await p1.getByRole("button", { name: "Prüfung starten" }).click(); } catch (e) { fehler.push("START " + /** @type {Error} */ (e).message.slice(0, 80)); }
      await p1.waitForTimeout(500);
      const p2 = await ctx.newPage(); await p2.goto(URL + "#start", { waitUntil: "networkidle" }); await p2.waitForTimeout(600);
      await p2.getByRole("button", { name: "Hier weiterarbeiten" }).click(); await p2.waitForTimeout(800);
      const m = await mass(p2, "[role=dialog]");
      const name = `zs-rueckfrage-${w}`;
      await p2.screenshot({ path: path.join(AUS, name + ".png") });
      merke(name, m, fehler);
      await ctx.close();
    }
    /* --- Einstellungen -> Speicher, sauber und repariert --- */
    for (const [was, stand] of [["sauber", null], ["repariert", { version: 1, rev: 3, unbekanntA: 1, unbekanntB: "x" }]]) {
      const ctx = await b.newContext({ viewport: { width: w, height: H } });
      const p = await ctx.newPage();
      /** @type {string[]} */
      const fehler = [];
      p.on("console", (m) => { if (m.type() === "error") fehler.push(m.text().slice(0, 120)); });
      p.on("pageerror", (e) => fehler.push("PAGEERROR " + String(e).slice(0, 120)));
      await p.goto(URL + "#einst", { waitUntil: "networkidle" });
      if (stand) { await p.evaluate((s) => localStorage.setItem("fisi_ap1_stand", JSON.stringify(s)), stand); await p.reload({ waitUntil: "networkidle" }); }
      await p.waitForTimeout(500);
      const karte = p.locator("[data-teil=speicher]");
      await karte.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
      const m = await mass(p, "[data-teil=speicher]");
      m.text = (await karte.innerText()).replace(/\s+/g, " ").slice(0, 400);
      const name = `speicher-${was}-${w}`;
      await p.screenshot({ path: path.join(AUS, name + ".png") });
      await karte.screenshot({ path: path.join(AUS, name + "-karte.png") });
      merke(name, m, fehler);
      await ctx.close();
    }
  }
  await b.close();
  fs.writeFileSync(path.join(AUS, "zuschauer.json"), zeilen.join("\n") + "\n");
  zeilen.forEach((z) => console.log(z));
})().catch((e) => { console.log("ABBRUCH", e.message); process.exit(1); });
