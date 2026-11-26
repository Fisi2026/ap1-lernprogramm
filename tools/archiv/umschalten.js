/* Abnahme N29 Teil 1 (R9): ein Geraet mit den ALTEN Service Workern landet auf dem Neubau.
   Dienst: `_to_delete/helfer/umsch/web/` auf Port 8768 – NUR mit `dienst.py` (no-cache wie Cloudflare).
   Phase 1 = was HEAD ausliefert (`git archive HEAD` nach web/: alte App unter /, Neubau 1.41 unter /v2/) –
   beide SW registrieren, die Seite der alten App auf #ueben. Dann tauscht das Skript den INHALT
   des Ordners gegen `v2/` (= Auslieferungsordner seit N29) und stoesst den Update-Check an.
   Misst: beide Seiten auf / mit Neubau (#root gefuellt), #ueben erhalten · keine Registrierung
   ausser app-sw.js · keine Caches `ap1-v*`/`ap1v2-*`, ein `ap1-app-*` · danach offline neu laden.
   ⚠️ `_redirects` wertet python nicht aus – die Umleitungen misst der Live-Test nach dem Deploy.
   Ergebnis: _to_delete/helfer/sicht4/umschalten.json */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "../..");
const WEB = path.join(WURZEL, "_to_delete/helfer/umsch/web");
const ZEIGER = path.join(WURZEL, "_to_delete/helfer/umsch/wurzel.txt");
const AUS = path.join(WURZEL, "_to_delete/helfer/sicht4");
const U = "http://127.0.0.1:8768";

const lage = (p) => p.evaluate(async () => ({
  url: location.pathname + location.hash,
  neubau: !!document.querySelector("#root") && document.querySelector("#root").children.length > 0,
  steuert: navigator.serviceWorker.controller ? new URL(navigator.serviceWorker.controller.scriptURL).pathname : null,
  regs: (await navigator.serviceWorker.getRegistrations()).map((r) => new URL(r.scope).pathname + " -> " +
    new URL((r.active || r.waiting || r.installing).scriptURL).pathname),
  caches: await caches.keys(),
}));
const warteBis = async (p, fn, ms) => { const t = Date.now() + ms; while (Date.now() < t) { try { if (fn(await lage(p))) return true; } catch { /* Seite laedt gerade */ } await p.waitForTimeout(400); } return false; };

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  fs.writeFileSync(ZEIGER, WEB);  // Phase 1: der ausgelieferte Stand von HEAD
  const erg = { fehler: [] };
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const alt = await ctx.newPage(), v2 = await ctx.newPage();
  for (const p of [alt, v2]) p.on("pageerror", (e) => erg.fehler.push(e.message.slice(0, 160)));

  await alt.goto(U + "/lernprogramm_ap1.html#ueben");
  await alt.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
  await v2.goto(U + "/v2/");
  await v2.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
  erg.vorher = { alt: await lage(alt), v2: await lage(v2) };

  /* Umschalten wie beim Deploy: ab jetzt liefert der Server den Auslieferungsordner v2/ aus. */
  fs.writeFileSync(ZEIGER, path.join(WURZEL, "v2"));
  const probe = await (await fetch(U + "/v2/sw.js", { cache: "no-store" })).text(); // nosemgrep -- lokaler Pruefserver (127.0.0.1, dienst.py), kein Netz: Fehlalarm react-insecure-request
  const umgel = await fetch(U + "/v2/", { redirect: "manual" }); // nosemgrep -- lokaler Pruefserver (127.0.0.1, dienst.py), kein Netz: Fehlalarm react-insecure-request
  erg.getauscht = probe.includes("Abschalt") && umgel.status === 301;

  for (const p of [alt, v2]) await p.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r.update(); }).catch((e) => erg.fehler.push("update: " + e.message));
  const istNeu = (l) => l.neubau && l.url.startsWith("/") && !l.url.startsWith("/v2") && !l.url.includes("lernprogramm");
  const regLage = () => v2.evaluate(async () => {
    const r = await navigator.serviceWorker.getRegistration();
    const z = (w) => (w ? w.state + " " + new URL(w.scriptURL).pathname : null);
    return r ? { scope: r.scope, installing: z(r.installing), waiting: z(r.waiting), active: z(r.active),
      steuert: navigator.serviceWorker.controller ? navigator.serviceWorker.controller.state : null } : "keine";
  }).catch((e) => ({ fehler: e.message }));
  ctx.on("serviceworker", (w) => w.on("console", (m) => erg.fehler.push("SW " + w.url().replace(U, "") + ": " + m.text().slice(0, 120))));
  erg.altAngekommen = await warteBis(alt, istNeu, 25000);
  erg.v2Angekommen = await warteBis(v2, istNeu, 25000);
  await warteBis(alt, (l) => l.steuert === "/app-sw.js", 20000);
  erg.nachher = { alt: await lage(alt), v2: await lage(v2) };
  erg.v2regEnde = await regLage();
  /* Der natuerliche Weg des Lerners: die alte /v2/-Seite neu laden (oder schliessen und wiederkommen). */
  await v2.reload().catch((e) => erg.fehler.push("v2 reload: " + e.message.split("\n")[0]));
  erg.v2NachNeuladen = await warteBis(v2, istNeu, 20000);
  erg.v2regNachNeuladen = await regLage();
  console.log("V2_NACH_NEULADEN", erg.v2NachNeuladen, JSON.stringify(erg.v2regNachNeuladen), JSON.stringify(await lage(v2)));
  console.log("V2REG_ENDE", JSON.stringify(erg.v2regEnde));
  await alt.screenshot({ path: path.join(AUS, "umschalten-alt.png") });

  console.log("ZWISCHEN", JSON.stringify(erg.nachher), erg.altAngekommen, erg.v2Angekommen);
  erg.umleitungen = {};
  for (const q of ["/lernprogramm_ap1.html", "/v2/", "/v2/index.html"]) {
    const r = await fetch(U + q, { redirect: "manual" });
    erg.umleitungen[q] = r.status + " " + r.headers.get("location");
  }
  await ctx.setOffline(true);
  try { await alt.reload(); await alt.waitForTimeout(1500); erg.offline = await lage(alt); }
  catch (e) { erg.offline = { neubau: false, fehler: e.message.split("\n")[0] }; }

  const n = erg.nachher.alt;
  erg.urteil = {
    getauscht: erg.getauscht,
    umleitungen: Object.values(erg.umleitungen).every((v) => v === "301 /"),
    vorherBeideAlt: erg.vorher.alt.regs.length === 2 && erg.vorher.alt.caches.some((c) => c.startsWith("ap1-v")) && erg.vorher.alt.caches.some((c) => c.startsWith("ap1v2-")),
    altAufNeubau: erg.altAngekommen, bereichErhalten: n.url === "/#ueben",
    v2AufNeubau: erg.v2Angekommen,
    v2NachNeuladen: erg.v2NachNeuladen,
    nurAppSw: n.regs.length === 1 && n.regs[0] === "/ -> /app-sw.js",
    alteCachesWeg: !n.caches.some((c) => c.startsWith("ap1-v") || c.startsWith("ap1v2-")),
    neuerCache: n.caches.some((c) => c.startsWith("ap1-app-")),
    offlineNeubau: erg.offline.neubau,
  };
  fs.writeFileSync(path.join(AUS, "umschalten.json"), JSON.stringify(erg, null, 1));
  console.log(JSON.stringify(erg.urteil, null, 1));
  console.log("vorher", JSON.stringify(erg.vorher.alt.regs), "nachher", JSON.stringify(n.regs), JSON.stringify(n.caches));
  console.log("fehler:", erg.fehler.length, erg.fehler.slice(0, 5));
  await b.close();
})().catch((e) => { console.error("ABBRUCH", e.message); process.exit(1); });
