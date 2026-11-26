/* Was ragt NACH minmax(0,1fr) noch ueber den Rand? Gruppiert, damit die Art der Nacharbeit
   sichtbar wird - eine Liste von 370 Einzelelementen sagt nichts.
   Aufruf: node rest.js [--probe] [bereich ...]   (ohne Bereiche: alle 13 der Schiene)
   --probe spritzt minmax(0,1fr) im Browser ein (Messung vom 22.09. vor dem Umbau).
   Seit dem Umbau steht die Regel im Quelltext; OHNE --probe misst es, was ausgeliefert wird -
   mit --probe wuerde ein Rueckfall im Quelltext verdeckt. */
const { chromium } = require("playwright-core");
const ALLE = ["start", "ueben", "serie", "fd", "markiert", "sim", "gen", "netzplan", "gantt",
              "glossar", "spickzettel", "stat", "einst"];
const args = process.argv.slice(2);
const probe = args.includes("--probe");
const liste = args.filter((a) => a !== "--probe");
const BEREICHE = liste.length ? liste : ALLE;
const PORT = process.env.SICHT_PORT || "8765";
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  let summe = 0;
  for (const bereich of BEREICHE) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 800 } });
    const p = await ctx.newPage();
    await p.goto("http://127.0.0.1:" + PORT + "/v2/#" + bereich, { waitUntil: "networkidle" });
    if (probe) await p.addStyleTag({ content: "#root > div { grid-template-columns: 3.5rem minmax(0,1fr) !important; }" });
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const raus = Array.from(document.querySelectorAll("main *"))
        .filter((n) => n.getBoundingClientRect().right > vw + 1);
      const oben = raus.filter((n) => !raus.includes(/** @type {Element} */ (n.parentElement)));
      // Liegt ein Ueberlaeufer in einem ABSICHTLICH waagerecht rollenden Bereich (Klasse
      // overflow-x-auto/-scroll im Quelltext, selbst im Bild, nicht die Bereichsflaeche direkt
      // unter main), ist er erreichbar - getrennt zaehlen. ⛔ NUR die Klasse zaehlt: ein
      // senkrecht rollender Kasten hat berechnet AUCH overflowX:auto (22.09.: der Knopf
      // "Ich hab's ueberlegt" rutschte so als "rollbar" durch).
      const mainEl = document.querySelector("main");
      /** @param {Element} n */
      const roller = (n) => {
        for (let a = n.parentElement; a && a !== mainEl && a.parentElement !== mainEl; a = a.parentElement) {
          const absicht = /(^|\s)overflow-x-(auto|scroll)(\s|$)/.test(a.getAttribute("class") || "");
          if (absicht && a.getBoundingClientRect().right <= vw + 1) return a;
        }
        return null;
      };
      const rollbar = oben.filter((n) => roller(n)).map((n) => n.tagName.toLowerCase() + " in " +
        (/** @type {Element} */ (roller(n)).getAttribute("data-slot") || /** @type {Element} */ (roller(n)).tagName.toLowerCase()) + " | " +
        (n.textContent || "").trim().slice(0, 30));
      const tiefste = oben.filter((n) => !roller(n));
      /** @type {Record<string, {n: number, max: number, bsp: string}>} */
      const grp = {};
      for (const n of tiefste) {
        const s = getComputedStyle(n);
        const k = n.tagName.toLowerCase() + " ws:" + s.whiteSpace + " minW:" + s.minWidth +
                  " ov:" + s.overflowX + " flex:" + (s.flexShrink);
        (grp[k] = grp[k] || { n: 0, max: 0, bsp: "" });
        grp[k].n++;
        grp[k].max = Math.max(grp[k].max, Math.round(n.getBoundingClientRect().right));
        if (!grp[k].bsp) grp[k].bsp = (n.textContent || "").trim().slice(0, 40);
      }
      // ⛔⛔ 22.09.: die Zahl "0 oberste" war FALSCH, weil nur die Breite gemessen wurde. Die
      // Filterleiste war 32 px hoch, ihre Kinder brachen auf 131 px um und liefen SICHTBAR ueber
      // die Karte. Ein Container, dessen Kinder unten herausragen, ist derselbe Fehler wie einer,
      // der rechts herausragt - also wird er hier mitgezaehlt.
      const platzt = [...document.querySelectorAll("main *")].filter((n) => {
        const s = getComputedStyle(n);
        // ⚠️ Inline-Elemente NICHT pruefen: ihr Rect ist die Vereinigung der Zeilenboxen, ihre
        // Kinder ragen dort regelmaessig heraus, ohne dass etwas ueberlappt (4 Fehlalarme im
        // Lueckentext M02-207, 22.09.). Erkennbar an scrollHeight 0.
        if (s.display.startsWith("inline") && s.display !== "inline-flex" && s.display !== "inline-grid") return false;
        if (s.overflowY !== "visible" || !n.children.length) return false;
        const r = n.getBoundingClientRect();
        if (r.height < 1) return false;
        return [...n.children].some((c) => c.getBoundingClientRect().bottom > r.bottom + 1);
      }).map((n) => n.tagName.toLowerCase() + (n.getAttribute("role") ? "[" + n.getAttribute("role") + "]" : "") +
        " H" + Math.round(n.getBoundingClientRect().height) + " Inhalt " + n.scrollHeight +
        " | " + (n.textContent || "").trim().slice(0, 30));
      const m = document.querySelector("main");
      return { alle: raus.length, oberste: tiefste.length, rollbar, platzt, grp, main: m ? Math.round(m.getBoundingClientRect().width) : -1 };
    });
    summe += r.oberste;
    console.log("=== " + bereich + ": main " + r.main + " px, " + r.alle + " ueber Rand, davon " + r.oberste + " oberste" +
      (r.rollbar.length ? ", " + r.rollbar.length + " im eigenen Rollbereich" : ""));
    r.rollbar.forEach((t) => console.log("   rollbar: " + t));
    r.platzt.forEach((t) => console.log("   PLATZT NACH UNTEN: " + t));
    summe += r.platzt.length;
    Object.entries(r.grp).sort((a, c) => c[1].n - a[1].n).slice(0, 5)
      .forEach(([k, v]) => console.log("   " + String(v.n).padStart(3) + "x bis " + String(v.max).padStart(5) + "px  " + k + "  | " + v.bsp));
    await ctx.close();
  }
  await b.close();
  console.log("SUMME OBERSTE: " + summe + (probe ? "  (mit --probe)" : ""));
  process.exitCode = summe === 0 ? 0 : 1;
})();
