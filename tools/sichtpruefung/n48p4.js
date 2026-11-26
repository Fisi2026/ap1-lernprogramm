/* N48 P4 – DARSTELLUNG AUF HANDY-BREITE (Nutzer-Entscheid 11.10.2026, BUILD_LOG 136).
   Frage: zeigen bild/hotspot/beschriftung, dropdown mit langen Optionen und Fragen mit
   Sonderzeichen bei 390 px alles – ohne Ueberlauf, ohne abgeschnittenes SVG, mit
   bedienbaren Klickflaechen? jsdom kennt keine Groessen (LIESMICH), deshalb hier im Browser.
   Gemessen wird der AUSGELIEFERTE Stand `v2/` (dienst.py, Koepfe aus _headers), je Frage
   zweimal: frisch und nach „Aufgeben" (Loesung sichtbar).
   ⚠️ Erste Stufe ist eine BEFUNDLISTE, kein Waechter (PLAN_NEUBAU N48 „Ablauf").
   Aufruf: node tools/sichtpruefung/n48p4.js [--nur ID,ID]   (PW_KANAL, Vorgabe msedge)
   Gegenprobe: N48P4_SABOTAGE=1 ... --nur M01-002 -> muss doc, raus und svg0 melden.
   Ausgabe: _to_delete/helfer/sicht4/n48p4.json, Bilder je Befund ebendort (n48p4-<ID>-<zustand>.png). */
const { chromium } = require("playwright-core");
const { spawn } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const { laden } = require("../pool_laden.js");

const WURZEL = path.join(__dirname, "../..");
const PORT = 8770;
const URL = `http://127.0.0.1:${PORT}/`;
const BREITE = 390, HOEHE = 844;
const KLICK_MIN = 24;            /* WCAG 2.2 SC 2.5.8 (Target Size, Minimum): 24 x 24 CSS-Pixel */
const LANG = 40;                 /* dropdown-Option ab dieser Zeichenzahl gilt als lang */
const SONDER = /[²³√≤≥×·∑≠≈→⇒±µΩ∞∆π]/;
const AUS = path.join(WURZEL, "_to_delete/helfer/sicht4");

function auswahl() {
  const { fragen } = laden(WURZEL);
  const nur = process.argv.indexOf("--nur");
  if (nur > 0) { const s = new Set(process.argv[nur + 1].split(",")); return fragen.filter((f) => s.has(f.id)).map((f) => [f.id, "nur"]); }
  const liste = [];
  for (const f of fragen) {
    const text = JSON.stringify([f.frage, f.optionen, f.luecken, f.paare]);
    if (["bild", "hotspot", "beschriftung"].includes(f.typ)) liste.push([f.id, f.typ]);
    else if (f.typ === "dropdown" && JSON.stringify(f.luecken || []).split('"').some((s) => s.length >= LANG)) liste.push([f.id, "dropdown-lang"]);
    else if (SONDER.test(text)) liste.push([f.id, "sonderzeichen"]);
  }
  return liste;
}

async function warteAufServer() {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(URL); if (r.ok) return; } catch { /* noch nicht da */ } // nosemgrep -- lokaler Pruefserver
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("dienst.py antwortet nicht");
}

/* Laeuft IM Browser: misst die Karte. */
/**
 * @param {number[]} arg
 * @returns {{doc: number, raus: string[], rausN: number, svg: {w: number, h: number, right: number}[], svg0: number, klein: string[], kleinN: number, abstandOk: number, absturz: boolean, zeichen: number, fehler?: string[]}}
 */
function messen(arg) {
  const [KMIN, W] = arg;
  const main = document.querySelector("main");
  /** @param {Element} e */
  const r = (e) => e.getBoundingClientRect();
  /** @param {Element} e */
  const sichtbar = (e) => { const s = getComputedStyle(e); return s.display !== "none" && s.visibility !== "hidden"; };
  const doc = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  const raus = [];
  for (const e of main ? main.querySelectorAll("*") : []) {
    if (!sichtbar(e)) continue;
    const b = r(e);
    if (b.width > 0 && b.right > W + 1) {
      let rollt = false;
      for (let p = e.parentElement; p && p !== main; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if ((o === "auto" || o === "scroll") && p.scrollWidth > p.clientWidth) { rollt = true; break; }
      }
      if (!rollt) raus.push(e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""));
    }
  }
  const svgs = main ? [...main.querySelectorAll("svg")].filter((s) => s.getAttribute("viewBox")) : [];
  /** @param {Element} e */
  const rolltIn = (e) => { for (let p = e.parentElement; p && p !== main; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if ((o === "auto" || o === "scroll") && p.scrollWidth > p.clientWidth) return true; } return false; };
  /* Ein SVG in einem waagerecht rollenden Kasten (Hotspot mit Mindestbreite) ist nicht abgeschnitten: right zaehlt dann nicht. */
  const svg = svgs.map((s) => { const b = r(s); return { w: Math.round(b.width), h: Math.round(b.height), right: rolltIn(s) ? 0 : Math.round(b.right) }; });
  const svg0 = svg.filter((s) => s.w < 2 || s.h < 2).length;
  /* WCAG 2.2 SC 2.5.8: zu klein ist nur, was auch die ABSTANDS-Ausnahme verfehlt – ein Kreis von
     24 px um die Mitte darf kein anderes Ziel und keinen anderen solchen Kreis schneiden. */
  const ziele = [];
  const klickbar = main ? main.querySelectorAll("button, select, input, [role=button], [tabindex='0'], a[href]") : [];
  for (const e of klickbar) {
    if (!sichtbar(e)) continue;
    /* Wirksame Flaeche: ein Radio/Checkbox im <label> (oder label[for]) wird ueber das Label bedient. */
    /* NUR fuer Radio/Checkbox – ein <select> mit label[for] ist selbst die Flaeche (11.10.: sonst galt
       das 19 px hohe Label einer 32 px hohen Auswahl, Scheinbefund „Luecke“). */
    const auswahl = e.matches("input[type=radio], input[type=checkbox], [role=radio], [role=checkbox]");
    const lab = auswahl ? (e.closest("label") || (e.id ? document.querySelector('label[for="' + e.id + '"]') : null)) : null;
    const be = r(e), bl = lab ? r(lab) : null;
    const b = bl && bl.width * bl.height > be.width * be.height ? bl : be;
    if (b.width === 0 && b.height === 0) continue;
    ziele.push({ e, b, klein: b.width < KMIN || b.height < KMIN });
  }
  const R = KMIN / 2;
  /** @param {DOMRect} b */
  const mitte = (b) => [b.left + b.width / 2, b.top + b.height / 2];
  /** @param {number[]} m @param {DOMRect} b */
  const kreisRechteck = (m, b) => { const dx = Math.max(b.left - m[0], 0, m[0] - b.right), dy = Math.max(b.top - m[1], 0, m[1] - b.bottom); return dx * dx + dy * dy < R * R; };
  /** @type {string[]} */
  const klein = [], /** @type {string[]} */ abstand = [];
  for (const z of ziele) {
    if (!z.klein) continue;
    const m = mitte(z.b);
    const stoesst = ziele.some((o) => o !== z && (o.klein
      ? Math.hypot(mitte(o.b)[0] - m[0], mitte(o.b)[1] - m[1]) < 2 * R
      : kreisRechteck(m, o.b)));
    const t = ((z.e.getAttribute("aria-label") || z.e.textContent || z.e.tagName).trim().slice(0, 30)) + " " + Math.round(z.b.width) + "x" + Math.round(z.b.height);
    (stoesst ? klein : abstand).push(t);
  }
  const text = (main?.innerText ?? "");
  return { doc, raus: [...new Set(raus)].slice(0, 6), rausN: raus.length, svg, svg0, klein: klein.slice(0, 8), kleinN: klein.length, abstandOk: abstand.length,
    absturz: text.includes("Dieser Bereich ist abgestürzt"), zeichen: text.trim().length };
}

(async () => {
  const liste = auswahl();
  fs.mkdirSync(AUS, { recursive: true });
  const zeiger = path.join(os.tmpdir(), "n48p4.zeiger");
  fs.writeFileSync(zeiger, path.join(WURZEL, "v2"));
  const py = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
  const dienst = spawn(py, [path.join(__dirname, "dienst.py"), zeiger, String(PORT)], { stdio: "ignore" });
  /** @type {Record<string, any>} */
  const erg = { breite: BREITE, klickMin: KLICK_MIN, anzahl: liste.length, fragen: {}, befunde: [] };
  let b;
  try {
    await warteAufServer();
    b = await chromium.launch({ channel: process.env.PW_KANAL || "msedge", headless: true });
    const ctx = await b.newContext({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 2, hasTouch: true });
    const p = await ctx.newPage();
    /** @type {string[]} */
    let fehler = [];
    p.on("pageerror", (e) => fehler.push("pageerror: " + e.message.slice(0, 160)));
    p.on("console", (m) => { if (m.type() === "error") fehler.push("console: " + m.text().slice(0, 160)); });
    await p.goto(URL);
    for (const [id, grund] of liste) {
      /** @type {Record<string, any>} */
      const je = { grund };
      for (const zustand of ["frisch", "loesung"]) {
        fehler = [];
        if (zustand === "frisch") {
          await p.evaluate((h) => { location.hash = h; }, "ueben");
          await p.waitForTimeout(150);
          await p.evaluate((h) => { location.hash = h; }, "frage=" + id);
          await p.waitForTimeout(600);
        } else {
          const k = p.getByRole("button", { name: "Aufgeben" });
          if (!(await k.count())) { je.loesung = "kein Aufgeben-Knopf"; continue; }
          await k.first().click();
          await p.waitForTimeout(400);
        }
        if (process.env.N48P4_SABOTAGE) await p.evaluate(() => {   /* Gegenprobe: muss raus/doc und svg0 melden */
          const d = document.createElement("div"); d.style.width = "600px"; d.textContent = "Sabotage";
          document.querySelector("main")?.appendChild(d);
          const s = /** @type {SVGElement | null} */ (document.querySelector("main svg[viewBox]")); if (s) s.style.width = "0px";
        });
        const m = await p.evaluate(messen, [KLICK_MIN, BREITE]);
        m.fehler = fehler.slice(0, 4);
        je[zustand] = m;
        const svgRaus = m.svg.filter((s) => s.right > BREITE + 1).length;
        const art = [];
        if (m.absturz || m.zeichen < 20) art.push("leer/abgestuerzt");
        if (m.doc > 0) art.push("doc+" + m.doc);
        if (m.rausN) art.push("raus " + m.rausN);
        if (m.svg0) art.push("svg0 " + m.svg0);
        if (svgRaus) art.push("svg rechts raus " + svgRaus);
        if (m.kleinN) art.push("klein " + m.kleinN);
        if (m.fehler.length) art.push("fehler " + m.fehler.length);
        if (art.length) {
          const nurKlein = art.every((a) => a.startsWith("klein"));
          erg.befunde.push(`${id} ${grund} ${zustand}: ${art.join(", ")}`);
          if (!nurKlein) await p.screenshot({ path: path.join(AUS, `n48p4-${id}-${zustand}.png`), fullPage: true });
        }
      }
      erg.fragen[id] = je;
    }
  } catch (e) {
    erg.befunde.push("Lauf abgebrochen: " + (e && /** @type {Error} */ (e).message ? /** @type {Error} */ (e).message : String(e)));
  } finally {
    if (b) await b.close();
    dienst.kill();
  }
  fs.writeFileSync(path.join(AUS, "n48p4.json"), JSON.stringify(erg, null, 1));
  console.log(`N48 P4: ${liste.length} Fragen, ${erg.befunde.length} Befund(e) -> _to_delete/helfer/sicht4/n48p4.json`);
  for (const x of erg.befunde.slice(0, 40)) console.log("  " + x);
})();
