/* N25b, MESSUNG (22.09.2026): WOHER kommt die Mindestbreite?
   Befund 21.09. bei P2: bei 390 px Viewport ist `main` 554-610 px breit, jeder Schirm wird
   rechts abgeschnitten. Dieses Skript RAET NICHT, sondern fragt den Browser:
     1. welche Elemente ragen ueber den Viewport hinaus (`scrollWidth > clientWidth`)?
     2. fuer das breiteste davon: die KETTE nach oben mit width/minWidth/flex/grid-template,
        damit sichtbar wird, WELCHE Regel die Breite erzwingt - nicht welche sie nur erbt.
   ⛔ Es aendert nichts. Was daraus folgt, ist ein Entscheid des Nutzers (PLAN_NEUBAU N25b). */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const AUS = path.join(__dirname, "../../_to_delete/helfer/sichtb");
const URL = "http://127.0.0.1:8765/v2/";
const BEREICHE = ["start", "ueben", "stat", "glossar"];

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  const b = await chromium.launch({ channel: "msedge", headless: true });
  /** @type {Record<string, any>} */
  const erg = {};
  for (const w of [390, 1280]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    for (const bereich of BEREICHE) {
      await p.goto(URL + "#" + bereich, { waitUntil: "networkidle" });
      await p.waitForTimeout(250);
      erg[w + "/" + bereich] = await p.evaluate(() => {
        const roll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
        const vw = document.documentElement.clientWidth;
        /** @param {Element | null} el */
        const kette = (el) => {
          const aus = [];
          for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
            const s = getComputedStyle(n);
            const r = n.getBoundingClientRect();
            aus.push({
              el: n.tagName.toLowerCase() + (n.id ? "#" + n.id : "") +
                  (n.className && typeof n.className === "string" ? "." + n.className.trim().split(/\s+/).slice(0, 3).join(".") : ""),
              b: Math.round(r.width), minW: s.minWidth, w: s.width,
              disp: s.display, flex: s.flex, cols: s.gridTemplateColumns.slice(0, 60),
            });
          }
          return aus.slice(0, 7);
        };
        const alle = Array.from(document.querySelectorAll("body *"));
        const raus = alle.filter((n) => n.getBoundingClientRect().right > vw + 1)
          .map((n) => ({ el: n.tagName.toLowerCase() + "." + String(n.className || "").trim().split(/\s+/).slice(0, 2).join("."),
                         breite: Math.round(n.getBoundingClientRect().width),
                         rechts: Math.round(n.getBoundingClientRect().right) }));
        const main = document.querySelector("main");
        const nav = document.querySelector("nav");
        const breitestes = alle.filter((n) => n.children.length === 0 || n.scrollWidth > n.clientWidth)
          .sort((a, b2) => b2.scrollWidth - a.scrollWidth)[0];
        return {
          vw, waagerechtRollbar: roll,
          main: main ? Math.round(main.getBoundingClientRect().width) : null,
          mainMinW: main ? getComputedStyle(main).minWidth : null,
          nav: nav ? Math.round(nav.getBoundingClientRect().width) : null,
          navMinW: nav ? getComputedStyle(nav).minWidth : null,
          rootCols: getComputedStyle(/** @type {HTMLElement} */ (document.querySelector("#root")).firstElementChild || document.body).gridTemplateColumns,
          ueberlaeufer: raus.length, ersteDrei: raus.slice(0, 3),
          ketteBreitestes: breitestes ? kette(breitestes) : null,
        };
      });
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(AUS, "breite.json"), JSON.stringify(erg, null, 1));
  for (const [k, v] of Object.entries(erg)) {
    console.log(k.padEnd(16), "vw", v.vw, "| main", v.main, "(minW " + v.mainMinW + ")",
      "| nav", v.nav, "(minW " + v.navMinW + ")", "| rollbar", v.waagerechtRollbar,
      "| ueber Rand:", v.ueberlaeufer);
  }
  await b.close();
})();
