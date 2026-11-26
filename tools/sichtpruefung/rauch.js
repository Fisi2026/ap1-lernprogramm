/* RAUCHTEST IM ECHTEN BROWSER (Audit 26.09.2026, AUD-B4) – laeuft in der CI nach check.sh.
   Frage: startet der AUSGELIEFERTE Stand (`v2/`, mit den Koepfen aus `_headers`, also mit
   SCHARFER CSP) in jedem Bereich, ohne Absturz, ohne Seitenfehler, ohne CSP-Verstoss – und
   laeuft er offline? Das ist die Konsolenprobe vom 26.09., die bis dahin nur von Hand lief.
   Bereiche kommen aus `neu/src/kern/route.ts` (BEREICHE) – keine zweite Liste.
   Aufruf: node tools/sichtpruefung/rauch.js   (PW_KANAL=chrome in der CI, sonst msedge)
   Rueckgabewert 1 bei jedem Befund; Urteil als JSON auf stdout. */
const { chromium } = require("playwright-core");
const { spawn } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");

const WURZEL = path.join(__dirname, "../..");
const PORT = 8769;
const URL = `http://127.0.0.1:${PORT}/`;
const BILDFRAGEN = ["M01-002", "M01-471", "M01-511"];   /* bild, hotspot, beschriftung */

function bereiche() {
  const t = fs.readFileSync(path.join(WURZEL, "neu/src/kern/route.ts"), "utf8");
  const block = t.split("export const BEREICHE = [")[1].split("]")[0];
  return block.split(",").map((s) => s.trim().replace(/"/g, "")).filter((s) => s && s !== "frage");
}

async function warteAufServer() {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(URL); if (r.ok) return; } catch { /* noch nicht da */ } // nosemgrep -- lokaler Pruefserver (127.0.0.1, dienst.py), kein Netz: Fehlalarm react-insecure-request
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("dienst.py antwortet nicht");
}

(async () => {
  const zeiger = path.join(os.tmpdir(), "rauch.zeiger");
  fs.writeFileSync(zeiger, path.join(WURZEL, "v2"));
  const py = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
  const dienst = spawn(py, [path.join(__dirname, "dienst.py"), zeiger, String(PORT)], { stdio: "ignore" });
  /** @type {string[]} */
  const befunde = [];
  /** @type {Record<string, any>} */
  const erg = { bereiche: {}, bildfragen: {}, offline: null, csp: [], befunde };
  let b;
  try {
    await warteAufServer();
    const kopf = (await fetch(URL)).headers.get("content-security-policy"); // nosemgrep -- lokaler Pruefserver (127.0.0.1, dienst.py), kein Netz: Fehlalarm react-insecure-request
    if (!kopf) befunde.push("CSP-Kopf fehlt (dienst.py liest _headers nicht?)");
    b = await chromium.launch({ channel: process.env.PW_KANAL || "msedge", headless: true });
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(() => {
      /** @type {any} */ (window).__csp = [];
      document.addEventListener("securitypolicyviolation", (e) =>
        /** @type {any} */ (window).__csp.push(e.violatedDirective + " " + e.blockedURI + " " + location.hash));
    });
    const p = await ctx.newPage();
    p.on("pageerror", (e) => befunde.push("pageerror: " + e.message));
    p.on("console", (m) => { if (m.type() === "error") befunde.push("console: " + m.text().slice(0, 160)); });

    await p.goto(URL);
    /** @param {string} hash */
    const pruefe = async (hash) => {
      await p.evaluate((h) => { location.hash = h; }, hash);
      await p.waitForTimeout(700);
      return p.evaluate(() => {
        const main = document.querySelector("main");
        const text = (main?.innerText ?? "").trim();
        return {
          zeichen: text.length,
          absturz: text.includes("Dieser Bereich ist abgestürzt"),
          nichtGebaut: text.includes("noch nicht gebaut"),
          svg: main ? main.querySelectorAll("svg[viewBox], .svgbox svg").length : 0,
        };
      });
    };
    for (const x of bereiche()) {
      const m = await pruefe(x);
      erg.bereiche[x] = m;
      if (m.absturz || m.nichtGebaut || m.zeichen < 20) befunde.push(`Bereich ${x}: ${JSON.stringify(m)}`);
    }
    for (const id of BILDFRAGEN) {
      const m = await pruefe("frage=" + id);
      erg.bildfragen[id] = m;
      if (m.absturz || m.svg === 0) befunde.push(`Bildfrage ${id}: ${JSON.stringify(m)}`);
    }
    /* offline: erst muss der SW die Seite steuern, dann ohne Netz neu laden */
    await p.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 });
    await ctx.setOffline(true);
    await p.reload();
    const off = await pruefe("ueben");
    erg.offline = off;
    if (off.absturz || off.zeichen < 20) befunde.push("offline: " + JSON.stringify(off));
    await ctx.setOffline(false);
    erg.csp = await p.evaluate(() => /** @type {any} */ (window).__csp);
    for (const v of erg.csp) befunde.push("CSP-Verstoss: " + v);
  } catch (e) {
    befunde.push("Lauf abgebrochen: " + (e && /** @type {Error} */ (e).message ? /** @type {Error} */ (e).message : String(e)));
  } finally {
    if (b) await b.close();
    dienst.kill();
  }
  console.log(JSON.stringify(erg, null, 1));
  console.log(befunde.length ? `RAUCH: ${befunde.length} BEFUND(E)` : "RAUCH: GRUEN");
  process.exit(befunde.length ? 1 : 0);
})();
