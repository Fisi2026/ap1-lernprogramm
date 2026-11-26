/* Abnahme N33 (E33): der Neubau OFFLINE und der UPDATE-FALL im echten Edge.
   Seit N29 unter / : dient `_to_delete/helfer/offl/` auf Port 8767 mit `dienst.py` aus (no-cache wie
   Cloudflare; Zeiger `_to_delete/helfer/offl.zeiger`) – dorthin kopiert das Skript den Inhalt von v2/
   und legt fuer den Update-Fall eine ZWEITE Fassung darueber (app-sw.js mit anderem Cache-Namen).
   Misst: (1) Vorab-Cache nach dem ersten Besuch · (2) offline JEDEN Bereich per Neuladen:
   Ladefehler? weisse Seite? Seitenfehler? · (3) Update: waehrend einer laufenden Simulation
   KEIN Hinweis, nach dem Abgeben ja · „Neu laden" -> neuer Cache aktiv, alter eigener weg,
   der Cache der ALTEN App (ap1-v…) unberuehrt. Ergebnis: _to_delete/helfer/sicht4/offline.json */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "../..");
const DIENST = path.join(WURZEL, "_to_delete/helfer/offl");
const AUS = path.join(WURZEL, "_to_delete/helfer/sicht4");
const URL = "http://127.0.0.1:8767/";
const BEREICHE = ["start", "ueben", "serie", "stat", "einst", "fd", "markiert", "spickzettel", "gen",
  "glossar", "gantt", "netzplan", "sim", "meldungen", "frage=M01-001"];

/** @param {import("playwright-core").Page} p */
const cachesJetzt = (p) => p.evaluate(async () => {
  /** @type {Record<string, number>} */
  const o = {};
  for (const k of await caches.keys()) o[k] = (await (await caches.open(k)).keys()).length;
  return o;
});

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  fs.rmSync(DIENST, { recursive: true, force: true });
  fs.cpSync(path.join(WURZEL, "v2"), DIENST, { recursive: true });
  /** @type {Record<string, any>} */
  const erg = { fehler: [] };
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => erg.fehler.push("pageerror: " + e.message));
  p.on("console", (m) => { if (m.type() === "error") erg.fehler.push("console: " + m.text().slice(0, 160)); });

  await p.goto(URL);
  await p.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
  /* ein Stellvertreter fuer den Cache der alten App – er muss alles ueberleben */
  await p.evaluate(async () => { await (await caches.open("ap1-v1.40.0")).put("/probe", new Response("x")); });
  erg.vorab = await cachesJetzt(p);

  await ctx.setOffline(true);
  erg.offline = {};
  for (const bereich of BEREICHE) {
    await p.goto(URL + "#" + bereich);
    await p.reload();
    await p.waitForFunction(() => !document.body.innerText.includes("Fragen werden geladen"), null, { timeout: 15000 }).catch(() => {});
    erg.offline[bereich] = await p.evaluate(() => {
      const t = (document.querySelector("main") || document.body).innerText;
      return { zeichen: t.length, ladefehler: t.includes("konnten nicht geladen"),
        ungebaut: t.includes("noch nicht gebaut"), absturz: !!document.querySelector("[data-bereichsgrenze],[role=alert]") && t.includes("Fehlerbericht"),
        anfang: t.replace(/\s+/g, " ").slice(0, 70) };
    });
  }
  await p.screenshot({ path: path.join(AUS, "offline-sim.png") });

  /* ---- Update-Fall: zweite Fassung ausliefern ---- */
  await ctx.setOffline(false);
  await p.goto(URL + "#sim"); await p.reload();
  await p.getByRole("button", { name: "Prüfung starten" }).click();
  const swPfad = path.join(DIENST, "app-sw.js");
  const alt = fs.readFileSync(swPfad, "utf8");
  const altName = /** @type {RegExpExecArray} */ (/var CACHE = "([^"]+)"/.exec(alt))[1];
  const neuName = altName + "-probe";
  fs.writeFileSync(swPfad, alt.replace(`"${altName}"`, `"${neuName}"`));
  const frage = () => p.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await /** @type {ServiceWorkerRegistration} */ (r).update(); });
  await frage();
  await p.waitForFunction(async () => !!/** @type {ServiceWorkerRegistration} */ (await navigator.serviceWorker.getRegistration()).waiting, null, { timeout: 20000 });
  await p.waitForTimeout(800);
  erg.hinweisInSimulation = await p.getByText("Neue Fassung verfügbar").count();
  await p.getByRole("button", { name: "Abgeben" }).click();
  await p.waitForTimeout(800);
  erg.hinweisNachAbgabe = await p.getByText("Neue Fassung verfügbar").count();
  await p.screenshot({ path: path.join(AUS, "offline-update-hinweis.png") });
  /* 390 px: liegt ein Knopf auf dem Titel? (dieselbe Klasse wie beim Zuschauer, 23.09.) */
  await p.setViewportSize({ width: 390, height: 900 });
  erg.schmal = await p.evaluate(() => {
    const k = /** @type {Element} */ (document.querySelector("[aria-label='Neue Fassung'] [data-slot=alert]"));
    const r = k.getBoundingClientRect(); const t = /** @type {Element} */ (k.querySelector("[data-slot=alert-title]"));
    const rg = document.createRange(); rg.selectNodeContents(t); const z = [...rg.getClientRects()];
    const deckt = [...k.querySelectorAll("button")].filter((x) => { const q = x.getBoundingClientRect();
      return z.some((l) => Math.min(l.right, q.right) > Math.max(l.left, q.left) && Math.min(l.bottom, q.bottom) > Math.max(l.top, q.top)); }).length;
    return { imFenster: r.x >= 0 && r.right <= innerWidth + 1, deckt, doc: document.documentElement.scrollWidth - innerWidth };
  });
  await p.screenshot({ path: path.join(AUS, "offline-update-390.png") });
  await p.setViewportSize({ width: 1280, height: 900 });
  await Promise.all([p.waitForEvent("load", { timeout: 20000 }), p.getByRole("button", { name: "Neu laden" }).click()]);
  await p.waitForTimeout(1000);
  erg.nachUpdate = await cachesJetzt(p);
  erg.steuertNeu = await p.evaluate(async () => /** @type {any} */ (await navigator.serviceWorker.getRegistration()).active.scriptURL);
  erg.urteil = {
    vorabVollstaendig: Object.entries(erg.vorab).some(([k, n]) => k === altName && n >= 14),
    offlineAlleDa: Object.values(erg.offline).every((o) => !o.ladefehler && !o.ungebaut && o.zeichen > 40),
    keinHinweisInSimulation: erg.hinweisInSimulation === 0,
    hinweisDanach: erg.hinweisNachAbgabe === 1,
    neuerCache: neuName in erg.nachUpdate, alterWeg: !(altName in erg.nachUpdate),
    alteAppUnberuehrt: "ap1-v1.40.0" in erg.nachUpdate,
    schmalSauber: erg.schmal.imFenster && erg.schmal.deckt === 0 && erg.schmal.doc <= 0,
  };
  fs.writeFileSync(path.join(AUS, "offline.json"), JSON.stringify(erg, null, 1));
  console.log(JSON.stringify(erg.urteil, null, 1));
  console.log("fehler:", erg.fehler.length, erg.fehler.slice(0, 6));
  await b.close();
})().catch((e) => { console.error("ABBRUCH", e.message); process.exit(1); });
