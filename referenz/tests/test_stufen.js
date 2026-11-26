/* Test: FB-R2b.2 – Stufen-Vorschau als fuenftes statPanel auf der Statistik-Seite (2026-07-21).
   Nutzer-Entscheide: VOLLE MATRIX Aufgabenart x Stufe, Beispiel AUFKLAPPBAR mit vollstaendiger
   Frage, Beispiele AUS DEM POOL gezogen statt geschrieben.

   Der Kern dieser Suite ist NICHT „ist eine Tabelle da", sondern: steht in jeder Zelle wirklich
   eine Frage DIESER Aufgabenart auf DIESER Stufe? Eine Vorschau, die das falsche Beispiel zeigt,
   sieht voellig unauffaellig aus – sie waere schlimmer als gar keine.
   GRUNDSATZ wie in den Vorrunden: jeder Test hat seine Gegenprobe im selben Lauf. */
const H = require("./_harness.js");
const fs = require("fs");
const path = require("path");

(async () => {
  const css = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
  const w = await H.boot();
  const doc = w.document;

  /* ⚠️ INJEKTION STATT BESTAND (2026-08-04). Die Gegenprobe zur Invariante „kein M09-Beispiel in
     der AP1-Vorschau" hing bis heute an der Zahl der echten M09-Fragen im Pool (`> 50`). Mit
     Etappe A der M09-Aufloesung fiel der Bestand auf 43 – der Test wurde rot, ohne dass am
     geprueften Verhalten irgendetwas falsch war, und in Etappe B (M09 wird leer) waere er gar
     nicht mehr zu erfuellen gewesen. Jetzt bringt die Suite ihre eigenen M09-Fragen mit, VOR dem
     Rendern und ueber alle vier Stufen und mehrere Aufgabenarten verteilt: genau so haben sie
     eine reale Chance, faelschlich in eine Zelle der Vorschau zu geraten. Dasselbe Muster wie
     in tests/test_unterricht.js. */
  const M09_INJ = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return { id: "M09-8" + String(90 + n).slice(-2), pruefungsteil: "AP1", modul: "M09",
      thema: w.L.M09_THEMEN[n % w.L.M09_THEMEN.length], typ: (n % 2 ? "mc" : "mehrfach"),
      schwierigkeit: ((n - 1) % 4) + 1,
      frage: "Unterrichtsstoff-Testfrage " + n + " (darf nie in der AP1-Vorschau stehen)?",
      optionen: ["richtig", "falsch1", "falsch2", "falsch3"],
      loesungIndex: 0, loesungIndizes: [0, 1],
      distraktorErklaerungen: ["", "warum falsch 1", "warum falsch 2", "warum falsch 3"],
      erklaerungKurz: "Testerklaerung." };
  });
  M09_INJ.forEach(function (f) { w.POOL.push(f); w.POOL_INDEX[f.id] = f; });

  w.gotoSeite("stat");
  await H.sleep(40);

  const panel = doc.querySelector("#main details.stat-panel#dummy") ||
    Array.prototype.filter.call(doc.querySelectorAll("#main details.stat-panel"),
      p => !!p.querySelector("table.stufen-tab"))[0];
  H.t("Stufen-Vorschau ist als Panel auf der Statistik-Seite da", !!panel);
  if (!panel) { process.exit(H.report()); }

  /* ⚠️ „fuenftes Panel" heisst fuenftes MOEGLICHES: zwei der vier Bestandspanels („Schwaechste
     Themen", „Generator") rendern nur, wenn es dazu Daten gibt. Im frischen Zustand sind es
     also drei. Ein Test auf `>= 5` waere hier falsch gruen gewesen – er faellt sofort auf. */
  const alle = Array.from(doc.querySelectorAll("#main details.stat-panel"));
  H.t("Stufen-Vorschau steht ALS LETZTES Panel (Bestandspanels bleiben oben)",
    alle[alle.length - 1] === panel);
  H.t("Die Bestandspanels sind unveraendert vorhanden (ist " + alle.length + " Panels)", alle.length >= 3);
  H.t("Stufen-Panel startet zugeklappt", panel.open === false);
  H.t("Stufen-Panel hat eine Kopfzeile .panel-kopf", !!panel.querySelector("summary.panel-kopf"));
  H.t("Kopfzeile nennt die Schwierigkeitsstufen",
    /Schwierigkeitsstufen/.test(panel.querySelector("summary").textContent));

  /* ---------- Aufbau der Matrix ---------- */
  const tbl = panel.querySelector("table.stufen-tab");
  const zeilen = Array.from(tbl.querySelectorAll("tr"));
  const kopf = zeilen[0];
  const koepfe = Array.from(kopf.querySelectorAll("th")).map(t => t.textContent);
  H.t("Kopfzeile hat 5 Spalten (Aufgabenart + 4 Stufen), ist " + koepfe.length, koepfe.length === 5);
  [1, 2, 3, 4].forEach(n => H.t("Spaltenkopf nennt Stufe " + n + " (" + w.LEVEL_NAMEN[n] + ")",
    koepfe.some(k => k.indexOf(w.LEVEL_NAMEN[n]) === 0)));
  H.t("Spaltenkoepfe zeigen die Bananen-Skala",
    Array.from(kopf.querySelectorAll("th .bananen")).length === 4);

  /* Erwartungswerte UNABHAENGIG neu aus dem Pool berechnen – nicht aus dem DOM ableiten,
     sonst prueft der Test nur sich selbst. */
  const soll = {}, sollAnzahl = {}, sollTypen = {};
  w.poolAP().forEach(f => {
    const t = w.typVon(f), k = t + "|" + f.schwierigkeit;
    sollTypen[t] = 1;
    sollAnzahl[k] = (sollAnzahl[k] || 0) + 1;
    if (!soll[k]) soll[k] = f;
  });
  const typAnzahl = Object.keys(sollTypen).length;
  H.t("Eine Zeile je vorkommender Aufgabenart (" + typAnzahl + " Typen)", zeilen.length - 1 === typAnzahl);

  const namen = zeilen.slice(1).map(tr => tr.querySelector("td.stufen-typ").textContent);
  H.t("Zeilen tragen Klarnamen, keine internen Bezeichner",
    namen.indexOf("mc") < 0 && namen.indexOf("rechenassistent") < 0 && namen.indexOf("Einfachauswahl") >= 0);
  H.t("Alle Zeilennamen sind verschieden", new Set(namen).size === namen.length);
  H.t("Zeilen sind alphabetisch sortiert",
    namen.slice().sort((a, b) => a.localeCompare(b, "de")).join("|") === namen.join("|"));
  /* GEGENPROBE zur Namensgebung: typName() muss auf den Rohnamen zurueckfallen, damit ein
     neuer Typ die Vorschau nicht leer laesst. */
  H.t("Gegenprobe: typName faellt bei unbekanntem Typ auf den Rohnamen zurueck",
    w.typName("gibtesnicht") === "gibtesnicht");

  /* ---------- Der eigentliche Punkt: stimmt der Inhalt jeder Zelle? ---------- */
  const rueckName = {};
  Object.keys(sollTypen).forEach(t => { rueckName[w.typName(t)] = t; });
  let geprueft = 0, leer = 0, falscherTyp = 0, falscheStufe = 0, nichtImPool = 0, falscheZahl = 0;
  zeilen.slice(1).forEach(tr => {
    const t = rueckName[tr.querySelector("td.stufen-typ").textContent];
    const zellen = Array.from(tr.querySelectorAll("td")).slice(1);
    zellen.forEach((td, i) => {
      const n = i + 1, k = t + "|" + n, erwartet = soll[k];
      const bsp = td.querySelector("details.stufen-bsp");
      if (!erwartet) { if (!td.classList.contains("stufen-leer") || bsp) leer++; return; }
      if (!bsp) { leer++; return; }
      geprueft++;
      const text = bsp.querySelector(".stufen-frage").textContent;
      const treffer = w.poolAP().filter(f => f.frage === text);
      if (!treffer.length) { nichtImPool++; return; }
      if (!treffer.some(f => w.typVon(f) === t)) falscherTyp++;
      if (!treffer.some(f => f.schwierigkeit === n)) falscheStufe++;
      if (bsp.querySelector("summary").textContent.indexOf(String(sollAnzahl[k])) < 0) falscheZahl++;
    });
  });
  H.t("Es wurden ueberhaupt Beispiele geprueft (ist " + geprueft + ")", geprueft >= 40);
  H.t("Jedes Beispiel stammt WOERTLICH aus dem Pool (Abweichungen: " + nichtImPool + ")", nichtImPool === 0);
  H.t("Jedes Beispiel hat die Aufgabenart seiner Zeile (Abweichungen: " + falscherTyp + ")", falscherTyp === 0);
  H.t("Jedes Beispiel hat die Stufe seiner Spalte (Abweichungen: " + falscheStufe + ")", falscheStufe === 0);
  H.t("Die Fragenzahl in der Zusammenfassung stimmt (Abweichungen: " + falscheZahl + ")", falscheZahl === 0);
  H.t("Leere Felder sind genau die im Pool fehlenden Kombinationen (Abweichungen: " + leer + ")", leer === 0);

  const leerZellen = tbl.querySelectorAll("td.stufen-leer");
  const sollLeer = typAnzahl * 4 - Object.keys(soll).length;
  H.t("Anzahl leerer Felder stimmt mit dem Pool ueberein (ist " + leerZellen.length + ", erwartet " + sollLeer + ")",
    leerZellen.length === sollLeer);
  /* GEGENPROBE: die Matrix darf nicht ZUFAELLIG voll oder ZUFAELLIG leer sein – gaebe es keine
     Luecken, waere der Vergleich oben wertlos, und waere alles leer ebenso. */
  H.t("Gegenprobe: es gibt sowohl gefuellte als auch leere Felder",
    leerZellen.length > 0 && geprueft > leerZellen.length);
  H.t("Leere Felder erklaeren sich per title-Attribut",
    Array.prototype.every.call(leerZellen, td => (td.getAttribute("title") || "").length > 10));

  /* ---------- Invariante AP1/M09: die Vorschau zeigt keinen Unterrichtsstoff ---------- */
  const m09Fragen = w.POOL.filter(f => f.modul === "M09").map(f => f.frage);
  const alleTexte = Array.from(tbl.querySelectorAll(".stufen-frage")).map(e => e.textContent);
  H.t("Kein M09-Beispiel in der AP1-Vorschau (Invariante AP1/M09-Trennung)",
    !alleTexte.some(x => m09Fragen.indexOf(x) >= 0));
  H.t("Gegenprobe: die injizierten M09-Fragen liegen wirklich im Pool und decken alle 4 Stufen ab",
    M09_INJ.every(f => m09Fragen.indexOf(f.frage) >= 0) &&
    [1, 2, 3, 4].every(s => M09_INJ.some(f => f.schwierigkeit === s)));

  /* ---------- Vollstaendige Frage, nicht gekuerzt (Nutzer-Entscheid) ---------- */
  const langsteImPool = w.poolAP().slice().sort((a, b) => b.frage.length - a.frage.length)[0];
  const langsteGezeigt = alleTexte.slice().sort((a, b) => b.length - a.length)[0];
  H.t("Beispiele werden ungekuerzt gezeigt (kein Auslassungszeichen)",
    !alleTexte.some(x => /…$|\.\.\.$/.test(x.trim())));
  H.t("Auch lange Fragen passen vollstaendig hinein (laengste gezeigt: " + langsteGezeigt.length + " Zeichen)",
    langsteGezeigt.length > 200 && langsteGezeigt.length <= langsteImPool.frage.length);
  H.t("Jedes Beispiel nennt Modul und Thema",
    Array.from(tbl.querySelectorAll("details.stufen-bsp"))
      .every(d => d.querySelectorAll(".meta .tag").length === 2));

  /* ---------- Aufklappen: verschachtelte <details> muessen einzeln funktionieren ---------- */
  const ersteBsp = tbl.querySelector("details.stufen-bsp");
  H.t("Beispiel startet zugeklappt", ersteBsp.open === false);
  ersteBsp.open = true;
  H.t("Beispiel laesst sich aufklappen", ersteBsp.open === true);
  H.t("Das aeussere Panel bleibt davon unberuehrt", panel.open === false);
  /* Das innere <details> darf NICHT im Panel-Merker landen – der ist fuer die Statistik-Panels
     gedacht, und 76 Zellen wuerden ihn zumuellen. */
  H.t("Aufklappen eines Beispiels landet NICHT in S.panelOffen",
    !Object.prototype.hasOwnProperty.call(w.S.panelOffen || {}, "stat-stufen") ||
    w.S.panelOffen["stat-stufen"] === undefined);

  /* ---------- Panel-Merker des AEUSSEREN Panels wie bei den anderen vier ---------- */
  panel.open = true; if (typeof panel.ontoggle === "function") panel.ontoggle();
  H.t("Aufklappen des Stufen-Panels wird gemerkt", w.S.panelOffen["stat-stufen"] === true);
  w.gotoSeite("start"); await H.sleep(20); w.gotoSeite("stat"); await H.sleep(40);
  const wieder = Array.prototype.filter.call(doc.querySelectorAll("#main details.stat-panel"),
    p => !!p.querySelector("table.stufen-tab"))[0];
  H.t("Nach Seitenwechsel ist das Stufen-Panel weiterhin offen", wieder.open === true);
  wieder.open = false; if (typeof wieder.ontoggle === "function") wieder.ontoggle();
  H.t("Gegenprobe: Zuklappen entfernt den Merker wieder",
    !Object.prototype.hasOwnProperty.call(w.S.panelOffen, "stat-stufen"));

  /* ---------- Druck (#30): die Vorschau kommt NICHT aufs Papier ----------
     app_ui.js klappt im beforeprint-Ereignis ALLE <details> auf. Ohne die Ausblend-Regel
     haette der Statistik-Ausdruck 51 vollstaendige Fragen mitgenommen. Nutzer-Entscheid
     2026-07-21: gar nicht drucken. */
  H.t("Stufen-Panel traegt die Klasse fuer die Druck-Regel", panel.classList.contains("stufen-panel"));
  const printBlock = css.slice(css.indexOf("@media print")).replace(/\/\*[\s\S]*?\*\//g, "");
  H.t("Die Druck-Regel blendet das Stufen-Panel auf der Statistik-Seite aus",
    /html\[data-seite="stat"\]\s+details\.stufen-panel\s*\{[^}]*display:\s*none/.test(printBlock));
  /* GEGENPROBE 1: die Regel darf NICHT die uebrigen Statistik-Panels mitnehmen – sonst waere
     der ganze Ausdruck leer und der Test trotzdem gruen. */
  H.t("Gegenprobe: die Bestandspanels bleiben druckbar",
    !/html\[data-seite="stat"\]\s+details\.stat-panel\s*\{[^}]*display:\s*none/.test(printBlock));
  /* GEGENPROBE 2: kein :has() – der Selektor muss auch in aelteren Browsern greifen. */
  H.t("Gegenprobe: die Druck-Regel nutzt kein :has()", !/:has\(/.test(printBlock));
  /* GEGENPROBE 3: der beforeprint-Hook oeffnet wirklich alle details – das ist die Ursache,
     gegen die die Regel schuetzt. Ohne diesen Beleg waere die Regel womoeglich ueberfluessig. */
  /* ⚠️ NEU HOLEN: der Seitenwechsel weiter oben hat die Statistik-Seite neu gezeichnet – `tbl`
     zeigt seitdem auf ein ABGEHAENGTES DOM. `druckVorbereiten()` arbeitet aber auf `document`,
     hat die alte Tabelle also nie gesehen. Der Test meldete deshalb erst „50 -> 50" und sah aus
     wie ein fehlender Hook. Nach jedem Re-Render Elementreferenzen erneuern. */
  const tblJetzt = doc.querySelector("#main table.stufen-tab");
  const vorher = tblJetzt.querySelectorAll("details.stufen-bsp:not([open])").length;
  w.druckVorbereiten();
  const nachher = tblJetzt.querySelectorAll("details.stufen-bsp:not([open])").length;
  H.t("Gegenprobe: beforeprint klappt tatsaechlich alle Beispiele auf (" + vorher + " -> " + nachher + ")",
    vorher > 10 && nachher === 0);
  w.druckAufraeumen();

  /* ---------- Mobile: fuenf Spalten passen nicht aufs Handy ---------- */
  H.t("Die Matrix liegt in einem eigenen Scroll-Bereich", !!panel.querySelector(".stufen-scroll"));
  const scrollRegel = css.slice(css.indexOf(".stufen-scroll{"), css.indexOf("}", css.indexOf(".stufen-scroll{")));
  H.t("Der Scroll-Bereich ist im CSS wirklich waagerecht scrollbar", /overflow-x:\s*auto/.test(scrollRegel));
  /* GEGENPROBE: ohne Mindestbreite wuerde die Tabelle trotz Scroll-Bereich gequetscht –
     der Scroll-Bereich allein beweist noch keine Lesbarkeit. */
  const minRegel = css.slice(css.indexOf(".stufen-tab{"), css.indexOf("}", css.indexOf(".stufen-tab{")));
  H.t("Die Tabelle hat eine Mindestbreite, wird also nicht gequetscht", /min-width:\s*\d{3}px/.test(minRegel));

  process.exit(H.report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
