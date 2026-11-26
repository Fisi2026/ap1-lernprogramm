"use strict";
/* Test (FB-R3 Etappe 2, 2026-07-23): Üben-Themenauswahl nach PRÜFUNGSORDNUNG (Gebiete).
   Die modul-basierte Auswahl (S.module/S.ap2Themen) ist ersetzt durch S.gebiete (ganze Gebiete,
   Codes A1..A5/B1..B3) und S.themen ("modul|thema", Feinthemen), poolweit aus f.gebiet abgeleitet.

   Geprüft wird: Ableitung der Feinthemen aus dem Pool (gebietThemen), themaGewaehlt/kandidaten,
   das GESPIEGELTE „ganzes Gebiet"-Häkchen (inkl. Verdichten aller Feinthemen zum Gebiet und
   Auflösen des Gebiets in Einzelthemen), das Render (2 Sektionen, 8 Gebiete, M9 ausgeschlossen,
   3 Umschalt-Knöpfe, Wirtschafts-Chip), der AP-Umschalter, die „bald"-Info unter B1/B2 (Katalog-
   Reststoff aus Punkt 6 bewahrt), Zurücksetzen, die Generator-Einstreuung und die Reichweiten-
   Invariante (passtAP hängt weiter NUR an S.inklAP2, ignoriert uebenAP). */
const { t: check, boot, report } = require("./_harness.js");
const FRAGEN = require("./fragen.js");

function renderUeben(w) {
  const host = w.document.createElement("div");
  w.document.body.appendChild(host);
  w.sUeben(host);
  return host;
}
const blockOf = (host, code) => [...host.querySelectorAll(".gebiet-block")]
  .find(b => b.querySelector(".geb-alle b") && b.querySelector(".geb-alle b").textContent === code);

(async () => {
  const w = await boot();
  const S = w.S;
  const L = w.L;

  // ── 1) Voreinstellungen ────────────────────────────────────────────────────
  check("defaultState().uebenAP === 'beide'", w.defaultState().uebenAP === "beide");
  check("defaultState().gebiete ist leere Liste",
    Array.isArray(w.defaultState().gebiete) && w.defaultState().gebiete.length === 0);
  check("defaultState().themen ist leere Liste",
    Array.isArray(w.defaultState().themen) && w.defaultState().themen.length === 0);
  check("S.uebenAP nach Boot === 'beide'", S.uebenAP === "beide");

  // ── 2) L.GEBIETE: 5 AP1 + 3 AP2 + M9 ───────────────────────────────────────
  const G = L.GEBIETE;
  check("L.GEBIETE hat 9 Einträge", G.length === 9);
  check("genau 5 AP1-Gebiete", G.filter(g => g[2] === "AP1").length === 5);
  check("genau 3 AP2-Bereiche", G.filter(g => g[2] === "AP2").length === 3);
  check("M9 ist der Klausur-Bereich (M09)", G.some(g => g[0] === "M9" && g[2] === "M09"));
  check("AP1-Codes = A1..A5", G.filter(g => g[2] === "AP1").map(g => g[0]).join(",") === "A1,A2,A3,A4,A5");
  check("AP2-Codes = B1..B3", G.filter(g => g[2] === "AP2").map(g => g[0]).join(",") === "B1,B2,B3");

  // ── 3) gebietThemen(): Feinthemen aus dem Pool, M9 ausgeschlossen ───────────
  const GT = w.gebietThemen();
  check("gebietThemen enthält KEIN M9", !GT["M9"]);
  const nonM09 = FRAGEN.filter(f => f.modul !== "M09");
  check("Summe der Feinthemen-Zähler == Nicht-M09-Fragen mit Gebiet",
    Object.keys(GT).reduce((a, c) => a + GT[c].reduce((x, t) => x + t[3], 0), 0)
      === nonM09.filter(f => f.gebiet && f.gebiet !== "M9").length);
  check("Feinthema-Zähler == Pool (Stichprobe A5)",
    (GT["A5"] || []).every(t => t[3] === FRAGEN.filter(f => (f.modul + "|" + f.thema) === t[0]).length));
  check("jedes Feinthema trägt den 'modul|thema'-Schlüssel und den Klarnamen",
    Object.keys(GT).every(c => GT[c].every(t => t[0] === t[2] + "|" + t[1])));

  // ── 3b) FB-R3 PUNKT 9: Sortierung – erst Modul, darin alphabetisch ─────────
  //  Vorher stand die Liste in Pool-Reihenfolge (zufälliges erstes Auftreten). Der Wächter prüft
  //  jedes benachbarte Paar in JEDEM Gebiet, nicht nur eine Stichprobe.
  {
    const verstoesse = [];
    Object.keys(GT).forEach(function (c) {
      for (let i = 1; i < GT[c].length; i++) {
        const a = GT[c][i - 1], b = GT[c][i];
        const ok = a[2] < b[2] ||
          (a[2] === b[2] && String(a[1]).localeCompare(String(b[1]), "de") <= 0);
        if (!ok) verstoesse.push(c + ": '" + a[2] + " " + a[1] + "' vor '" + b[2] + " " + b[1] + "'");
      }
    });
    check("Feinthemen sind je Gebiet nach Modul, darin alphabetisch sortiert",
      verstoesse.length === 0, verstoesse.slice(0, 3).join(" | "));
  }
  //  Warum localeCompare("de") und nicht < / > : Ein naiver Stringvergleich sortiert nach
  //  Code-Punkten und stellt damit GROSSBUCHSTABEN vor Kleinbuchstaben. Im Pool gibt es genau
  //  drei Paare, bei denen sich beide Verfahren unterscheiden – alle drei wegen Groß-/Klein-
  //  schreibung, KEINES wegen Umlauten: „Scrum & Wasserfall" / „SMART-Ziele" (M01),
  //  „Wirtschaftlichkeit & TCO" / „WLAN & Übertragungsstandards" (M03) und
  //  „Backup & Verfügbarkeit" / „BSI-Grundschutz & Schutzbedarf" (M06).
  //  Naiv käme jeweils der Großbuchstaben-Titel zuerst, im Duden-Sinn ist es umgekehrt.
  check("Groß-/Kleinschreibung: 'Scrum & Wasserfall' steht in A1 vor 'SMART-Ziele'",
    (function () {
      const m1 = (GT["A1"] || []).filter(t => t[2] === "M01").map(t => t[1]);
      const iS = m1.indexOf("Scrum & Wasserfall"), iM = m1.indexOf("SMART-Ziele");
      return iS >= 0 && iM >= 0 && iS < iM;
    })());
  check("Groß-/Kleinschreibung: 'Backup & Verfügbarkeit' steht in A3 vor 'BSI-Grundschutz & Schutzbedarf'",
    (function () {
      const m6 = (GT["A3"] || []).filter(t => t[2] === "M06").map(t => t[1]);
      const iB = m6.indexOf("Backup & Verfügbarkeit"), iS = m6.indexOf("BSI-Grundschutz & Schutzbedarf");
      return iB >= 0 && iS >= 0 && iB < iS;
    })());
  // ⚠️ Hier stand bis 27.07. eine harte Zahl („=== 73"). Sie war die ZWEITE Fundstelle derselben
  //    Tatsache (die erste in test_engine) und fiel beim Anlegen eines neuen Feinthemas in einem
  //    separaten Lauf noch einmal auf. Jetzt gegen die Single Source L.THEMA_GEBIET geprueft:
  //    Die Aussage der Zusicherung – „die Sortierung verliert kein Feinthema" – bleibt dieselbe,
  //    nur muss die Zahl nicht mehr an zwei Stellen von Hand nachgezogen werden.
  check("Sortierung ändert die Feinthemen-Menge nicht (== Einträge in L.THEMA_GEBIET)",
    Object.keys(GT).reduce((a, c) => a + GT[c].length, 0) === Object.keys(L.THEMA_GEBIET).length);

  // ── 3b2) FB-R3 PUNKT 8: kein Themenname darf in zwei Modulen vorkommen ──────
  //  Die Themen-Serie („Mehr zu diesem Thema") zieht über modul+thema. Wäre ein Themenname in
  //  zwei Modulen vergeben, würde ein „modul|thema"-Schlüssel zwei verschiedene Feinthemen
  //  meinen – dieselbe Falle wie „Gantt 13 Fragen" = M01 6 + M09 7 (START_PROMPT, Lehre 5).
  {
    const proModul = {};
    FRAGEN.forEach(function (f) {
      if (!f.thema) return;
      (proModul[f.thema] = proModul[f.thema] || {})[f.modul] = true;
    });
    const kollisionen = Object.keys(proModul)
      .filter(n => Object.keys(proModul[n]).length > 1)
      .map(n => n + " in " + Object.keys(proModul[n]).join("+"));
    check("kein Themenname kommt in mehr als einem Modul vor",
      kollisionen.length === 0, kollisionen.slice(0, 3).join(" | "));
  }

  // ── 3c) app_seiten.js enthält keine NUL-Bytes (grep-Wächter sonst blind) ────
  {
    const fs = require("fs"), p = require("path");
    const roh = fs.readFileSync(p.join(__dirname, "app_seiten.js"));
    check("app_seiten.js ist frei von NUL-Bytes", roh.indexOf(0) < 0);
  }

  // ── 4) themaGewaehlt: leer=alle, Gebiet, Feinthema ─────────────────────────
  S.gebiete = []; S.themen = [];
  check("nichts gewählt -> jede Frage passt", w.themaGewaehlt(FRAGEN.find(f => f.gebiet === "A1")) === true);
  S.gebiete = ["A1"]; S.themen = [];
  check("Gebiet gewählt -> Frage dieses Gebiets passt", w.themaGewaehlt(FRAGEN.find(f => f.gebiet === "A1")) === true);
  check("Gebiet gewählt -> fremde Frage passt NICHT", w.themaGewaehlt(FRAGEN.find(f => f.gebiet === "A3")) === false);
  const einThema = FRAGEN.find(f => f.gebiet === "A3");
  const einKey = einThema.modul + "|" + einThema.thema;
  S.gebiete = []; S.themen = [einKey];
  check("Feinthema gewählt -> Frage dieses Themas passt", w.themaGewaehlt(einThema) === true);
  check("Feinthema gewählt -> Frage anderen Themas passt NICHT",
    w.themaGewaehlt(FRAGEN.find(f => (f.modul + "|" + f.thema) !== einKey)) === false);
  S.gebiete = []; S.themen = [];

  // ── 5) kandidaten() folgt der Gebiets-/Feinthemen-Auswahl ──────────────────
  S.uebenAP = "beide"; S.wirtschaftNur = false;
  S.gebiete = ["A2"]; S.themen = [];
  const kA2 = w.kandidaten();
  check("Gebiet A2: nur A2-Fragen", kA2.length > 0 && kA2.every(id => w.frageById(id).gebiet === "A2"));
  const ftKey = (GT["A5"] || [])[0][0];
  S.gebiete = []; S.themen = [ftKey];
  const kFt = w.kandidaten();
  check("Feinthema: nur Fragen dieses Themas",
    kFt.length > 0 && kFt.every(id => (w.frageById(id).modul + "|" + w.frageById(id).thema) === ftKey));
  S.gebiete = []; S.themen = [];

  // ── 6) uebenPasst (AP-Filter der Üben-Auswahl) ─────────────────────────────
  const ap1F = { modul: "M03", pruefungsteil: "AP1" };
  const ap2F = { modul: "M08", pruefungsteil: "AP2" };
  /* ⚠️ 2026-08-04: Hier stand `FRAGEN.find(f => f.modul === "M09")`. Mit Etappe B der
     M09-Aufloesung ist der Bereich leer – die Sperre gilt trotzdem und muss geprueft bleiben.
     Die Testfrage kommt deshalb aus dem Test, nicht aus dem Bestand. */
  const m09F = { modul: "M09", pruefungsteil: "AP1", gebiet: "M9" };
  S.uebenAP = "ap1"; check("ap1: AP1 passt", w.uebenPasst(ap1F)); check("ap1: AP2 passt nicht", !w.uebenPasst(ap2F));
  S.uebenAP = "ap2"; check("ap2: AP2 passt", w.uebenPasst(ap2F)); check("ap2: AP1 passt nicht", !w.uebenPasst(ap1F));
  S.uebenAP = "beide"; check("beide: beide passen", w.uebenPasst(ap1F) && w.uebenPasst(ap2F));
  check("M09 in jedem Modus abgelehnt", !!m09F && ["ap1", "ap2", "beide"].every(m => { S.uebenAP = m; return !w.uebenPasst(m09F); }));
  check("uebenPasst(null) ist false", w.uebenPasst(null) === false);
  S.uebenAP = "beide";

  S.gebiete = []; S.themen = [];
  const nBeide = w.kandidaten().length;
  S.uebenAP = "ap1"; const idsAp1 = w.kandidaten();
  S.uebenAP = "ap2"; const idsAp2 = w.kandidaten();
  check("ap1: keine AP2-Frage", idsAp1.every(id => w.frageById(id).pruefungsteil !== "AP2"));
  check("ap2: nur AP2-Fragen", idsAp2.length > 0 && idsAp2.every(id => w.frageById(id).pruefungsteil === "AP2"));
  check("beide >= ap1 und >= ap2", nBeide >= idsAp1.length && nBeide >= idsAp2.length);
  S.uebenAP = "beide";

  // ── 7) Render: Umschalter, Sektionen, Gebiete, wi-chip ─────────────────────
  S.gebiete = []; S.themen = []; S.wirtschaftNur = false;
  let host = renderUeben(w);
  check("3 Umschalt-Knöpfe", host.querySelectorAll(".ap-seg-btn").length === 3);
  check("genau ein Knopf aktiv ('Beide')",
    host.querySelectorAll(".ap-seg-btn.aktiv").length === 1 &&
    [...host.querySelectorAll(".ap-seg-btn")].find(b => b.classList.contains("aktiv")).textContent.trim() === "Beide");
  check("2 Sektionen (AP1/AP2)", host.querySelectorAll(".ap-sektion").length === 2);
  check("8 Gebiet-Blöcke (A1..A5, B1..B3)", host.querySelectorAll(".gebiet-block").length === 8);
  check("kein M9-Block gerendert", ![...host.querySelectorAll(".geb-alle b")].some(e => e.textContent === "M9"));
  check("Reihenfolge A1..A5,B1..B3",
    [...host.querySelectorAll(".geb-alle b")].map(e => e.textContent).join(",") === "A1,A2,A3,A4,A5,B1,B2,B3");
  check("Wirtschafts-Chip in der AP1-Sektion",
    host.querySelectorAll(".ap-sektion")[0].querySelector(".wi-chip") !== null);
  const a1b = blockOf(host, "A1");
  check("A1-Block nennt den Gebietsnamen", a1b.textContent.indexOf("Kundenbedarfe ermitteln") >= 0);
  check("A1-Block nennt eine Fragenzahl", /· \d+ Fragen/.test(a1b.textContent));
  check("jeder Block hat ein 'ganzes Gebiet'-Häkchen und einen Feinthemen-Knopf",
    [...host.querySelectorAll(".gebiet-block")].every(b => b.querySelector(".geb-alle input[type=checkbox]") && b.querySelector(".geb-toggle")));

  // ── 8) Feinthemen: eingeklappt, Knopf klappt auf (reines DOM) ──────────────
  const a3b = blockOf(host, "A3");
  const a3fein = a3b.querySelector(".geb-feinthemen");
  check("Feinthemen sind zunächst eingeklappt", a3fein.hidden === true);
  const a3themen = a3fein.querySelectorAll(".themen-kachel.fein");
  check("A3 listet mehrere Feinthemen", a3themen.length === (GT["A3"] || []).length && a3themen.length > 1);
  a3b.querySelector(".geb-toggle").click();
  check("Knopf klappt Feinthemen auf", a3fein.hidden === false);

  // ── 9) Ganzes Gebiet anhaken -> S.gebiete + gespiegelte Feinthemen ─────────
  S.gebiete = []; S.themen = [];
  host = renderUeben(w);
  blockOf(host, "A2").querySelector(".geb-alle input").click();
  check("Klick auf 'ganzes Gebiet' nimmt Code in S.gebiete", (S.gebiete || []).indexOf("A2") >= 0);
  check("kandidaten danach nur A2", w.kandidaten().every(id => w.frageById(id).gebiet === "A2"));
  host = renderUeben(w);   // frisch, um die Spiegelung zu sehen
  const a2b = blockOf(host, "A2");
  check("'ganzes Gebiet'-Häkchen ist gesetzt", a2b.querySelector(".geb-alle input").checked === true);
  check("bei ganzem Gebiet erscheinen die Feinthemen mitgewählt (gespiegelt)",
    [...a2b.querySelectorAll(".themen-kachel.fein input")].every(i => i.checked === true));

  // ── 10) Feinthema aus ganzem Gebiet abwählen -> Gebiet löst sich auf ───────
  const a2keys = (GT["A2"] || []).map(t => t[0]);
  host = renderUeben(w);   // S.gebiete=["A2"]
  const einInput = blockOf(host, "A2").querySelectorAll(".themen-kachel.fein input")[0];
  einInput.click();        // abwählen (war gespiegelt checked)
  check("Abwählen löst 'ganzes Gebiet' auf (A2 nicht mehr in S.gebiete)", (S.gebiete || []).indexOf("A2") < 0);
  check("die übrigen Feinthemen wandern einzeln nach S.themen",
    (S.themen || []).length === a2keys.length - 1 && (S.themen || []).indexOf(a2keys[0]) < 0);

  // ── 11) Alle Feinthemen anhaken -> verdichtet sich zum ganzen Gebiet ───────
  S.gebiete = []; S.themen = [];
  host = renderUeben(w);
  const b3inputs = [...blockOf(host, "B3").querySelectorAll(".themen-kachel.fein input")];
  b3inputs.forEach(i => { if (!i.checked) i.click(); });
  check("alle Feinthemen gewählt -> zum Gebiet verdichtet (B3 in S.gebiete)", (S.gebiete || []).indexOf("B3") >= 0);
  check("die Einzel-Feinthemen sind dann NICHT mehr in S.themen",
    (GT["B3"] || []).every(t => (S.themen || []).indexOf(t[0]) < 0));

  // ── 12) AP-Umschalten graut die andere Sektion aus ────────────────────────
  S.gebiete = []; S.themen = [];
  S.uebenAP = "ap1"; host = renderUeben(w);
  check("ap1: AP2-Sektion ist 'aus'", host.querySelectorAll(".ap-sektion")[1].classList.contains("aus"));
  check("ap1: AP2-Häkchen sind deaktiviert",
    [...host.querySelectorAll(".ap-sektion")[1].querySelectorAll("input")].every(i => i.disabled));
  S.uebenAP = "ap2"; host = renderUeben(w);
  check("ap2: AP1-Sektion ist 'aus'", host.querySelectorAll(".ap-sektion")[0].classList.contains("aus"));
  check("ap2: AP1-Häkchen sind deaktiviert",
    [...host.querySelectorAll(".ap-sektion")[0].querySelectorAll("input")].every(i => i.disabled));
  S.uebenAP = "beide";

  // ── 13) Wirtschafts-Chip: Klick + Reset durch AP2 + Deaktivierung in ap2 ──
  S.gebiete = []; S.themen = []; S.wirtschaftNur = false;
  host = renderUeben(w);
  host.querySelector(".wi-chip input").click();
  check("Klick auf Wirtschafts-Chip setzt S.wirtschaftNur", S.wirtschaftNur === true);
  const btnAp2 = [...host.querySelectorAll(".ap-seg-btn")].find(b => b.textContent.trim() === "AP2");
  btnAp2.click();
  check("AP2 setzt S.uebenAP='ap2'", S.uebenAP === "ap2");
  check("AP2 schaltet den Wirtschafts-Schwerpunkt ab", S.wirtschaftNur === false);
  S.uebenAP = "ap1"; host = renderUeben(w);
  check("ap1: Wirtschafts-Chip ist aktiv (nicht disabled)", host.querySelector(".wi-chip input").disabled === false);
  S.uebenAP = "ap2"; host = renderUeben(w);
  check("ap2: Wirtschafts-Chip ist deaktiviert", host.querySelector(".wi-chip input").disabled === true);
  S.uebenAP = "beide";

  // ── 14) AP2 „bald"-Info unter B1/B2 (Katalog-Reststoff, Punkt 6 bewahrt) ──
  host = renderUeben(w);
  const b1b = blockOf(host, "B1"), b2b = blockOf(host, "B2");
  check("B1 trägt eine 'bald'-Info",
    !!b1b.querySelector(".platzhalter-info .bald") && b1b.querySelector(".platzhalter-info .bald").textContent.trim() === "bald");
  check("B2 trägt eine 'bald'-Info", !!b2b.querySelector(".platzhalter-info .bald"));
  check("die 'bald'-Info listet Fragenkomplexe (<li>)",
    b1b.querySelectorAll(".platzhalter-info ul li").length >= 1 && b2b.querySelectorAll(".platzhalter-info ul li").length >= 1);
  check("B3 (WiSo) hat KEINE 'bald'-Info (echter Stoff)", blockOf(host, "B3").querySelector(".platzhalter-info") === null);
  check("AP2_PLATZHALTER-Titel decken sich mit den B1/B2-Gebietsnamen (Katalog wörtlich)",
    w.AP2_PLATZHALTER.every(p => [L.gebietName("B1"), L.gebietName("B2")].indexOf(p.titel) >= 0));

  // ── 15) Zurücksetzen ──────────────────────────────────────────────────────
  S.gebiete = ["A2", "B3"]; S.themen = ["M03|Hardware-Komponenten"]; S.wirtschaftNur = true; S.uebenAP = "ap2";
  host = renderUeben(w);
  const reset = [...host.querySelectorAll("button")].find(b => b.textContent.indexOf("zurücksetzen") >= 0);
  check("Zurücksetzen-Knopf vorhanden", !!reset);
  reset.click();
  check("Zurücksetzen leert S.gebiete", (S.gebiete || []).length === 0);
  check("Zurücksetzen leert S.themen", (S.themen || []).length === 0);
  check("Zurücksetzen schaltet Wirtschaft ab", S.wirtschaftNur === false);
  check("Zurücksetzen stellt uebenAP='beide'", S.uebenAP === "beide");

  // ── 16) Generator-Einstreuung folgt der Gebiets-Auswahl (genAlsFrage) ─────
  S.gebiete = []; S.themen = []; S.uebenAP = "beide"; S.level = 1;
  S.gebiete = ["A2"];   // A2 trägt den Generator „datenmengen" (M03|Datenmengen & Präfixe)
  let sawForeign = false, sawA2 = false;
  for (let i = 0; i < 40; i++) {
    const g = w.genAlsFrage(); if (!g) continue;
    const gg = L.gebietFuer({ modul: g.modul, thema: g.thema });
    if (gg === "A2") sawA2 = true; if (gg && gg !== "A2") sawForeign = true;
  }
  check("Generator bei Gebiet A2: es feuert überhaupt ein A2-Generator", sawA2 === true);
  check("Generator bei Gebiet A2: kein Generator aus fremdem Gebiet", sawForeign === false);
  S.gebiete = ["A4"];   // A4 hat keinen Generator
  check("Gebiet ohne Generator: genAlsFrage liefert null", w.genAlsFrage() === null);
  S.gebiete = []; S.themen = [];

  // ── 17) Reichweite: passtAP bleibt an S.inklAP2 gekoppelt, ignoriert uebenAP ─
  check("passtAP kennt uebenAP NICHT (weiterhin an S.inklAP2 gekoppelt)",
    (function () {
      S.inklAP2 = false; S.uebenAP = "ap2";
      const a = w.passtAP({ modul: "M08", pruefungsteil: "AP2" });
      S.inklAP2 = true;
      const b = w.passtAP({ modul: "M08", pruefungsteil: "AP2" });
      S.inklAP2 = false; S.uebenAP = "beide";
      return a === false && b === true;
    })());

  process.exit(report());
})();
