/* Sichtpruefung N26 T6: der TASCHENRECHNER in seiner Klappe, 1280 und 390 px.
   Je Rechen-Typ (rechenassistent, kalkulation) zwei Zustaende: Klappe zu, Klappe auf.
   Gemessen: waagerechter Rollweg (doc), Breite von main, Bedienelemente die rechts
   aus main ragen (raus), und fuer die Tasten: wie viele sichtbar, wie viele auf 0x0,
   wie viele rechts ausserhalb des Fensters, kleinste Tastenbreite/-hoehe.
   ⚠️ „alt" ist der AUSGELIEFERTE Stand (git archive HEAD v2) - dort gibt es den
      Rechner noch nicht; er dient nur als Grundlinie fuer doc/raus (Klappe zu). */
const { chromium } = require("playwright-core");
const fs = require("fs"), path = require("path");
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, "ids.json"), "utf8"));
const AUS = path.join(__dirname, "../../_to_delete/helfer/sicht4");
const STAENDE = { alt: "http://127.0.0.1:8766/v2/", neu: "http://127.0.0.1:8765/v2/" };
const TYPEN = ["rechenassistent", "kalkulation"];

(async () => {
  fs.mkdirSync(AUS, { recursive: true });
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const zeilen = [];
  for (const w of [1280, 390]) for (const typ of TYPEN) for (const [stand, url] of Object.entries(STAENDE)) {
    for (const auf of stand === "alt" ? [false] : [false, true]) {
      const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
      const p = await ctx.newPage();
      /** @type {string[]} */
      const fehler = [];
      p.on("console", (m) => { if (m.type() === "error") fehler.push(m.text().slice(0, 120)); });
      p.on("pageerror", (e) => fehler.push("PAGEERROR " + String(e).slice(0, 120)));
      await p.goto(url + "#frage=" + ids[typ], { waitUntil: "networkidle" });
      await p.waitForTimeout(400);
      if (auf) { try { await p.getByRole("button", { name: "Taschenrechner" }).click(); } catch (e) { fehler.push("KLICK " + /** @type {Error} */ (e).message.slice(0, 80)); } }
      await p.waitForTimeout(400);
      /** @type {Record<string, any>} */
      const m = await p.evaluate(() => {
        const main = document.querySelector("main"); const mr = main ? main.getBoundingClientRect() : null;
        const els = [...document.querySelectorAll("main button,main input,main textarea,main select,main [role=radio],main [role=checkbox]")];
        const raus = els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && mr && r.right > mr.right + 1; }).length;
        const gruppe = document.querySelector("fieldset[aria-label=Tasten]");
        const t = gruppe ? [...gruppe.querySelectorAll("button")] : [];
        const r = t.map((x) => x.getBoundingClientRect());
        const sicht = r.filter((q) => q.width > 0 && q.height > 0);
        return {
          doc: document.documentElement.scrollWidth - innerWidth, main: mr ? Math.round(mr.width) : -1, raus,
          klappe: !!document.querySelector("[data-teil=rechner-klappe]"),
          tasten: t.length, sichtbar: sicht.length, null0: r.length - sicht.length,
          rechtsRaus: sicht.filter((q) => q.right > innerWidth + 1).length,
          minB: sicht.length ? Math.round(Math.min(...sicht.map((q) => q.width))) : 0,
          minH: sicht.length ? Math.round(Math.min(...sicht.map((q) => q.height))) : 0,
        };
      });
      if (fehler.length) m.fehler = fehler;
      const name = `${stand}-rechner-${typ}-${auf ? "auf" : "zu"}-${w}`;
      await p.screenshot({ path: path.join(AUS, name + ".png"), fullPage: true });
      /* ⚠️ Die Karte hat einen EIGENEN Rollbereich - ein Vollbild zeigt den Rechner darin
         nicht. Deshalb: bis zur letzten Taste und zum Notizfeld rollen und messen, ob sie
         dann im Fenster liegen (= erreichbar), und von dort ein Bild. */
      if (auf) {
        for (const [wer, ort] of [["gleich", p.getByRole("button", { name: "gleich" })],
                                  ["notiz", p.getByRole("textbox", { name: "Notizen (Nebenrechnung)" })]]) {
          await /** @type {import("playwright-core").Locator} */ (ort).scrollIntoViewIfNeeded();
          await p.waitForTimeout(200);
          const r = await /** @type {import("playwright-core").Locator} */ (ort).boundingBox();
          m["erreichbar_" + wer] = !!r && r.y >= 0 && r.y + r.height <= 900 + 1 && r.x >= 0 && r.x + r.width <= w + 1;
          await p.screenshot({ path: path.join(AUS, `${name}-${wer}.png`) });
        }
      }
      zeilen.push(name + " " + JSON.stringify(m));
      await ctx.close();
    }
  }
  await b.close();
  fs.writeFileSync(path.join(AUS, "rechner.json"), zeilen.join("\n") + "\n");
  zeilen.forEach((z) => console.log(z));
})().catch((e) => { console.log("ABBRUCH", e.message); process.exit(1); });
