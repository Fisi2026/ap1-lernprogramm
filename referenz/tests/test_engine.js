/* test_engine.js – Node-Testsuite für die A3-Gewichtungs-Engine (pickGewichtet / gewichteFrage /
   THEMA_RELEVANZ / deckPick 6.Parameter) + jsdom-Integrationstests der App (app.html).
   Aufruf: node test_engine.js   -> Ausgabe "N OK / M FEHLER", exit 1 bei mind. 1 Fehler.        */
"use strict";
const L = require("./logik.js");
const FRAGEN = require("./fragen.js");
const { t, close, within, boot, report } = require("./_harness.js");

/* =====================================================================
   A) Unit-Tests pickGewichtet
   ===================================================================== */
(function testA() {
  // A1: deterministisches rng -> bei Gewichten [1,0,0] immer erste ID
  {
    const ids = ["x", "y", "z"];
    const w = { x: 1, y: 0, z: 0 };
    const rngs = [() => 0, () => 0.4999999, () => 0.9999999, () => 0.123456];
    rngs.forEach(function (rng, i) {
      const r = L.pickGewichtet(ids, function (id) { return w[id]; }, rng);
      t("A1: Gewichte [1,0,0] -> immer erste ID (rng-Variante " + i + ")", r === "x");
    });
  }

  // A2: 20.000 Ziehungen über 3 IDs, Gewichte 6/3/1 -> Häufigkeiten ~0.6/0.3/0.1 (±15% relativ)
  // ⚠️ FESTER SEED SEIT 28.07.2026 – VORHER Math.random.
  //    Die Toleranz ist mit ±15 % bei N=20.000 rund sieben Sigma, ein Fehlschlag war also
  //    praktisch ausgeschlossen. ABER: Er waere NICHT REPRODUZIERBAR gewesen. Ein roter Lauf,
  //    der beim zweiten Versuch gruen ist, kostet mehr Zeit als er je an Aussage bringt – und
  //    verleitet dazu, den naechsten echten Fehlschlag ebenfalls als Ausreisser abzutun.
  //    Das ist die abgeschwaechte Fassung der Lehre „eine Pruefung, die wuerfelt, ist keine".
  //    mulberry32: kleiner, deterministischer PRNG mit guter Gleichverteilung.
  {
    function seedRng(seed) {
      let s = seed >>> 0;
      return function () {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    const rng = seedRng(20260728);
    const ids = ["a", "b", "c"];
    const w = { a: 6, b: 3, c: 1 };
    const N = 20000;
    const counts = { a: 0, b: 0, c: 0 };
    for (let i = 0; i < N; i++) {
      const r = L.pickGewichtet(ids, function (id) { return w[id]; }, rng);
      counts[r]++;
    }
    const fa = counts.a / N, fb = counts.b / N, fc = counts.c / N;
    within("A2: relative Häufigkeit a ~0.6 (±15%)", fa, 0.6 * 0.85, 0.6 * 1.15);
    within("A2: relative Häufigkeit b ~0.3 (±15%)", fb, 0.3 * 0.85, 0.3 * 1.15);
    within("A2: relative Häufigkeit c ~0.1 (±15%)", fc, 0.1 * 0.85, 0.1 * 1.15);
  }

  // A3: alle Gewichte 0 -> Fallback auf ungewichtete Ziehung (kein Crash, gibt eine der IDs)
  {
    const ids = ["p", "q", "r"];
    let crashed = false;
    let gezogen = new Set();
    try {
      for (let i = 0; i < 200; i++) {
        const r = L.pickGewichtet(ids, function () { return 0; }, Math.random);
        gezogen.add(r);
      }
    } catch (e) { crashed = true; }
    t("A3: alle Gewichte 0 -> kein Crash", !crashed);
    t("A3: alle Gewichte 0 -> gibt stets eine gültige ID zurück", [...gezogen].every(function (x) { return ids.indexOf(x) >= 0; }));
  }

  // A4: leeres Array -> undefined
  {
    const r = L.pickGewichtet([], function () { return 1; }, Math.random);
    t("A4: leeres Array -> undefined", r === undefined);
  }
})();

/* =====================================================================
   B) Unit-Tests gewichteFrage
   ===================================================================== */
(function testB() {
  // relevanzAn true/false, bekanntes Thema mit Relevanz 3
  const relevanz3Thema = Object.keys(L.THEMA_RELEVANZ).find(function (k) { return L.THEMA_RELEVANZ[k] === 3; });
  const relevanz1Thema = Object.keys(L.THEMA_RELEVANZ).find(function (k) { return L.THEMA_RELEVANZ[k] === 1; });
  t("B: relevanz3Thema gefunden", !!relevanz3Thema);
  t("B: relevanz1Thema gefunden", !!relevanz1Thema);

  {
    const f = { thema: relevanz3Thema };
    const wAn = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: false });
    close("B: relevanzAn=true, Relevanz 3 -> Basis 3", wAn, 3);
    const wAus = L.gewichteFrage(f, { relevanzAn: false, adaptivAktiv: false });
    close("B: relevanzAn=false -> immer Basis 2 (ignoriert Relevanz 3)", wAus, 2);
  }
  {
    const f = { thema: relevanz1Thema };
    const wAn = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: false });
    close("B: relevanzAn=true, Relevanz 1 -> Basis 1", wAn, 1);
    const wAus = L.gewichteFrage(f, { relevanzAn: false, adaptivAktiv: false });
    close("B: relevanzAn=false, Relevanz 1 -> trotzdem Basis 2", wAus, 2);
  }
  // unbekanntes Thema -> Fallback 2
  {
    const f = { thema: "___nicht_im_katalog___" };
    const w = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: false });
    close("B: unbekanntes Thema, relevanzAn=true -> Fallback 2", w, 2);
  }
  // adaptiv: schwach {richtig:0,gesamt:10} vs. stark {richtig:10,gesamt:10} (Basis 1, relevanzAn=true)
  {
    const f = { thema: relevanz1Thema };
    const erwSchwach = 1 * (1.5 - (0 + 1) / (10 + 2)); // 1.41666...
    const wSchwach = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: true, themaStat: function () { return { richtig: 0, gesamt: 10 }; } });
    close("B: adaptiv schwach (0/10) -> Faktor 1.5-1/12 ≈ 1.4167", wSchwach, erwSchwach, 1e-9);

    const erwStark = 1 * (1.5 - (10 + 1) / (10 + 2)); // 0.58333...
    const wStark = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: true, themaStat: function () { return { richtig: 10, gesamt: 10 }; } });
    close("B: adaptiv stark (10/10) -> Faktor 1.5-11/12 ≈ 0.5833", wStark, erwStark, 1e-9);

    t("B: schwach-Faktor größer als stark-Faktor (adaptiv wirkt in richtige Richtung)", wSchwach > wStark);
  }
  // gesamt < 3 -> kein Faktor (adaptivAktiv true, aber themaStat.gesamt < 3 -> unverändert Basis)
  {
    const f = { thema: relevanz1Thema };
    const w = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: true, themaStat: function () { return { richtig: 2, gesamt: 2 }; } });
    close("B: adaptivAktiv=true aber gesamt<3 -> kein Faktor, bleibt Basis 1", w, 1);
  }
  // themaStat liefert null -> ebenfalls kein Faktor
  {
    const f = { thema: relevanz1Thema };
    const w = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: true, themaStat: function () { return null; } });
    close("B: themaStat=null -> kein Faktor, bleibt Basis 1", w, 1);
  }
  // letzteThemen-Malus x0.3
  {
    const f = { thema: relevanz3Thema };
    const wOhne = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: false, letzteThemen: ["irgendwas anderes"] });
    close("B: letzteThemen ohne Treffer -> kein Malus", wOhne, 3);
    const wMit = L.gewichteFrage(f, { relevanzAn: true, adaptivAktiv: false, letzteThemen: [relevanz3Thema] });
    close("B: letzteThemen mit Treffer -> ×0.3 Malus", wMit, 3 * 0.3);
  }
  // Untergrenze: Relevanz 1 + stark (kontraintuitiv extrem, richtig>gesamt um Faktor <0 zu erzwingen) + Malus -> exakt 0.15
  {
    const f = { thema: relevanz1Thema };
    // Bewusst ein extremer/kontrafaktischer Stat-Wert (richtig > gesamt), um den Boden-Clamp zu
    // erzwingen und dessen Verhalten deterministisch/exakt zu prüfen (statt nur asymptotisch anzunähern).
    const ctx = {
      relevanzAn: true, adaptivAktiv: true,
      themaStat: function () { return { richtig: 50, gesamt: 10 }; },
      letzteThemen: [relevanz1Thema]
    };
    const w = L.gewichteFrage(f, ctx);
    t("B: Untergrenze -> exakt 0.15 (ist=" + w + ")", w === 0.15);
  }
})();

/* =====================================================================
   C) Abdeckung: 74 distinct f.thema aus fragen.js === Keys von L.THEMA_RELEVANZ
   (73 bis 26.07., 74 seit Etappe 5 am 27.07.: neues Feinthema M07|Einweisung & Schulung)
   M09 „Klausurvorbereitung" ist hier bewusst AUSGENOMMEN (2026-07-20): die Kategorie ist von
   Gewichtung und Bereitschafts-Score ausgeschlossen und hat mit L.M09_THEMEN eine eigene
   kanonische Themenliste. Ihre Themen dürfen deshalb NICHT in THEMA_RELEVANZ stehen –
   test_unterricht prüft die Disjunktheit aktiv. Die Aussage dieses Blocks bleibt unverändert:
   jedes Thema einer AP-Frage hat ein Gewicht, und kein Gewicht steht ohne Frage herum.
   ===================================================================== */
(function testC() {
  const themenSet = new Set(FRAGEN.filter(function (f) { return f.modul !== "M09"; })
    .map(function (f) { return f.thema; }).filter(Boolean));
  const relKeys = new Set(Object.keys(L.THEMA_RELEVANZ));
  const nurInFragen = [...themenSet].filter(function (th) { return !relKeys.has(th); });
  const nurInRelevanz = [...relKeys].filter(function (th) { return !themenSet.has(th); });
  /* ⚠️ HIER STAND BIS 27.07. EINE HARTE ZAHL („=== 73"). Beim Anlegen des Feinthemas
     „Einweisung & Schulung" fiel deshalb erst diese Stelle und – in einem SPAETEREN Lauf – die
     gleichlautende Zahl in test_themenauswahl. Zwei Fundstellen fuer DIESELBE Tatsache, nacheinander
     entdeckt, jede einzeln von Hand nachgezogen.
     Jetzt wird gegen L.THEMA_GEBIET geprueft. Das ist KEIN Weichspuelen der Zusicherung, sondern
     eine bessere: Sie vergleicht zwei UNABHAENGIGE Register (Pool gegen Gebiets-Registrierung) und
     faellt weiterhin, wenn ein Thema nur in einem von beiden auftaucht – sie muss nur nicht mehr
     gepflegt werden, wenn ein Thema LEGITIM hinzukommt. */
  const gebietKeys = new Set(Object.keys(L.THEMA_GEBIET).map(function (k) { return k.split("|")[1]; }));
  t("C: Themen in fragen.js == Themen in L.THEMA_GEBIET (Pool=" + themenSet.size + ", Register=" + gebietKeys.size + ")",
    themenSet.size === gebietKeys.size);
  t("C: THEMA_RELEVANZ hat gleiche Anzahl Keys (ist=" + relKeys.size + ")", relKeys.size === themenSet.size);
  t("C: keine Themen aus fragen.js fehlen in THEMA_RELEVANZ" +
    (nurInFragen.length ? " (fehlend: " + JSON.stringify(nurInFragen) + ")" : ""), nurInFragen.length === 0);
  t("C: keine überzähligen Keys in THEMA_RELEVANZ ohne Frage" +
    (nurInRelevanz.length ? " (überzählig: " + JSON.stringify(nurInRelevanz) + ")" : ""), nurInRelevanz.length === 0);
})();

/* =====================================================================
   D) Statistik auf echtem Pool
   ===================================================================== */
(function testD() {
  const pool = FRAGEN.filter(function (f) { return f.pruefungsteil !== "AP2" && f.schwierigkeit === 2; });
  t("D: AP1-Pool Schwierigkeit 2 nicht leer (ist=" + pool.length + ")", pool.length > 0);
  const ids = pool.map(function (f) { return f.id; });
  const byId = {};
  pool.forEach(function (f) { byId[f.id] = f; });

  // --- Relevanz-Test: relevanzAn=true, adaptivAktiv=false, 30.000 Ziehungen ---
  {
    const ctx = { relevanzAn: true, adaptivAktiv: false };
    const gewichtFn = function (id) { return L.gewichteFrage(byId[id], ctx); };
    const counts = {}; ids.forEach(function (id) { counts[id] = 0; });
    const N = 30000;
    for (let i = 0; i < N; i++) { counts[L.pickGewichtet(ids, gewichtFn, Math.random)]++; }

    const zero = ids.filter(function (id) { return counts[id] === 0; });
    t("D: keine Frage mit 0 Ziehungen (ist=" + zero.length + " von " + ids.length + ")", zero.length === 0);

    let sumRel3 = 0, cntRel3 = 0, sumRel1 = 0, cntRel1 = 0;
    ids.forEach(function (id) {
      const r = L.THEMA_RELEVANZ[byId[id].thema] || 2;
      if (r === 3) { sumRel3 += counts[id]; cntRel3++; }
      if (r === 1) { sumRel1 += counts[id]; cntRel1++; }
    });
    t("D: Relevanz-3-Themen im Pool vorhanden (ist=" + cntRel3 + ")", cntRel3 > 0);
    t("D: Relevanz-1-Themen im Pool vorhanden (ist=" + cntRel1 + ")", cntRel1 > 0);
    const meanRel3 = sumRel3 / cntRel3, meanRel1 = sumRel1 / cntRel1;
    t("D: mittlere Ziehhäufigkeit Relevanz-3 ≥ 2× Relevanz-1 (rel3=" + meanRel3.toFixed(2) +
      ", rel1=" + meanRel1.toFixed(2) + ", ratio=" + (meanRel3 / meanRel1).toFixed(3) + ")",
      meanRel3 >= 2 * meanRel1);
  }

  // --- Adaptiv-Test: relevanzAn=false, adaptivAktiv=true, EIN schwaches Thema ---
  {
    // Thema mit vielen Fragen wählen, um statistisches Rauschen zu minimieren
    const themaCounts = {};
    pool.forEach(function (f) { themaCounts[f.thema] = (themaCounts[f.thema] || 0) + 1; });
    const schwachThema = Object.keys(themaCounts).sort(function (a, b) { return themaCounts[b] - themaCounts[a]; })[0];
    t("D: schwaches Thema für Adaptiv-Test gefunden (ist='" + schwachThema + "', n=" + themaCounts[schwachThema] + ")", !!schwachThema);

    const ctx = {
      relevanzAn: false, adaptivAktiv: true,
      themaStat: function (f) { return f.thema === schwachThema ? { richtig: 1, gesamt: 10 } : { richtig: 8, gesamt: 10 }; }
    };
    const gewichtFn = function (id) { return L.gewichteFrage(byId[id], ctx); };
    const counts = {}; ids.forEach(function (id) { counts[id] = 0; });
    const N = 30000;
    for (let i = 0; i < N; i++) { counts[L.pickGewichtet(ids, gewichtFn, Math.random)]++; }

    const schwachIds = ids.filter(function (id) { return byId[id].thema === schwachThema; });
    const otherIds = ids.filter(function (id) { return byId[id].thema !== schwachThema; });
    const meanSchwach = schwachIds.reduce(function (s, id) { return s + counts[id]; }, 0) / schwachIds.length;
    const meanOther = otherIds.reduce(function (s, id) { return s + counts[id]; }, 0) / otherIds.length;
    t("D: schwaches Thema wird pro Frage ≥1.5× so oft gezogen wie Durchschnitt der übrigen " +
      "(schwach=" + meanSchwach.toFixed(2) + ", übrige=" + meanOther.toFixed(2) + ", ratio=" + (meanSchwach / meanOther).toFixed(3) + ")",
      meanSchwach >= 1.5 * meanOther);
  }
})();

/* =====================================================================
   E) jsdom-Integrationstests der App (app.html)
   ===================================================================== */
async function testE() {
  const LS_KEY = "ap1v2_state";
  function seedState() {
    const statistik = {};
    ["M01", "M02", "M03", "M04", "M05", "M06", "M07"].forEach(function (m) {
      statistik[m] = { richtig: 3, gesamt: 6 };
    });
    statistik["T:M03:OSI-Modell & Protokolle"] = { richtig: 1, gesamt: 6 };
    return {
      version: 5,
      seen: {}, lastShown: [], antworten: [],
      level: 2, levelModus: "auto", module: [],
      fehlerDeck: {}, notizen: {},
      statistik: statistik,
      dailyCounts: {}, tagesziel: 20,
      pruefungsdatum: "", theme: null,
      simHistorie: [], simAnzahl: 40, simUsedIds: [],
      uebenZaehler: 0, fokusZu: true, serieDone: "",
      lastTyp: "",
      inklAP2: false,
      markiert: {}, simDauerMin: 90, fokus: false, meldungen: {},
      // relevanzGewichtung bewusst NICHT gesetzt -> muss per Default/Migration true werden
      farbsymbole: false, ariaAltTexte: false, onboardingDone: true, typHilfeAus: {}
    };
  }

  const w = await boot(seedState());

  // E1: Boot ohne Fehler, relevanzGewichtung Default true
  t("E1: window.S existiert nach Boot", !!w.S);
  t("E1: window.S.version === 5", w.S && w.S.version === 5);
  t("E1: window.S.relevanzGewichtung === true (Default bei frischem/migriertem State)", w.S && w.S.relevanzGewichtung === true);

  // E2: anzahlBeantwortet() liefert die Summe (>30)
  {
    const anz = w.anzahlBeantwortet ? w.anzahlBeantwortet() : undefined;
    t("E2: anzahlBeantwortet() ist eine Zahl", typeof anz === "number");
    t("E2: anzahlBeantwortet() === 42 (7 Module × 6 gesamt)", anz === 42);
    t("E2: anzahlBeantwortet() > 30", anz > 30);
  }

  // E3: Route "ueben" rendern, danach mehrfach naechsteFrage triggern
  {
    let renderFehler = null;
    try { w.eval('seite="ueben"; render();'); } catch (e) { renderFehler = e; }
    t("E3: Route 'ueben' rendert ohne Fehler (" + (renderFehler ? renderFehler.message : "") + ")", !renderFehler);

    let exception = null;
    try {
      for (let i = 0; i < 15; i++) {
        const qa = w.document.getElementById("qa");
        if (qa) w.naechsteFrage(qa);
      }
    } catch (e) { exception = e; }
    t("E3: 15× naechsteFrage() ohne Exception (" + (exception ? exception.message : "") + ")", !exception);
    t("E3: letzteThemen.length <= 2 nach 15 Ziehungen (ist=" + (w.letzteThemen && w.letzteThemen.length) + ")",
      w.letzteThemen && w.letzteThemen.length <= 2);
  }

  // E4: zeigeThemenSerieAngebot direkt testen
  let mcFrage1 = null, mcFrage2 = null;
  {
    const mcFragen = w.POOL.filter(function (f) { return f.typ === "mc" && f.thema; });
    mcFrage1 = mcFragen[0];
    mcFrage2 = mcFragen.find(function (f) { return f.thema !== (mcFrage1 && mcFrage1.thema); }) || mcFragen[1];
    t("E4: mindestens zwei passende MC-Fragen mit unterschiedlichem Thema im Pool gefunden", !!mcFrage1 && !!mcFrage2);

    w.themenSerie = []; // sauberer Ausgangszustand für den Test
    const div1 = w.document.createElement("div");
    let exc = null;
    try { w.zeigeThemenSerieAngebot(mcFrage1, div1); } catch (e) { exc = e; }
    t("E4: zeigeThemenSerieAngebot() ohne Exception", !exc);
    const btn = div1.querySelector("button");
    t("E4: Button vorhanden mit Text 'Mehr zu diesem Thema' (Inhalt='" + (btn && btn.textContent) + "')",
      !!btn && btn.textContent.indexOf("Mehr zu diesem Thema") !== -1);

    if (btn) {
      btn.click();
      const serie = w.themenSerie;
      t("E4: themenSerie.length zwischen 1 und 5 (ist=" + (serie && serie.length) + ")",
        !!serie && serie.length >= 1 && serie.length <= 5);
      t("E4: f.id (" + mcFrage1.id + ") nicht in der Serie enthalten", !serie || serie.indexOf(mcFrage1.id) === -1);
      const alleGleichesThemaOderModul = (serie || []).every(function (id) {
        const x = w.frageById(id);
        return x && (x.thema === mcFrage1.thema || x.modul === mcFrage1.modul);
      });
      t("E4: alle IDs in der Serie haben gleiches Thema (oder Modul als Fallback)", alleGleichesThemaOderModul);
    }
  }

  // E5: erneuter Aufruf mit anderer Frage darf KEINEN zweiten Button erzeugen (themenSerie noch gefüllt)
  {
    const div2 = w.document.createElement("div");
    let exc = null;
    try { w.zeigeThemenSerieAngebot(mcFrage2, div2); } catch (e) { exc = e; }
    t("E5: zweiter Aufruf zeigeThemenSerieAngebot() ohne Exception", !exc);
    t("E5: div bleibt leer, solange themenSerie noch gefüllt ist (innerHTML='" + div2.innerHTML + "')",
      div2.innerHTML === "" || div2.children.length === 0);
  }

  // E6: sEinstellungen rendern; Checkbox "prüfungsnah" togglen -> S.relevanzGewichtung wechselt + wird gespeichert
  {
    let renderFehler = null;
    try { w.eval('seite="einst"; render();'); } catch (e) { renderFehler = e; }
    t("E6: Route 'einst' rendert ohne Fehler (" + (renderFehler ? renderFehler.message : "") + ")", !renderFehler);

    const labels = Array.from(w.document.querySelectorAll("label"));
    const label = labels.find(function (l) { return l.textContent.indexOf("prüfungsnah") !== -1; });
    t("E6: Label mit 'prüfungsnah' im Text gefunden", !!label);
    const checkbox = label && label.querySelector("input[type=checkbox]");
    t("E6: zugehörige Checkbox gefunden", !!checkbox);

    if (checkbox) {
      const vorher = w.S.relevanzGewichtung;
      checkbox.checked = !vorher;
      const ev = new w.Event("change", { bubbles: true });
      checkbox.dispatchEvent(ev);
      t("E6: S.relevanzGewichtung wechselt beim Togglen (vorher=" + vorher + ", nachher=" + w.S.relevanzGewichtung + ")",
        w.S.relevanzGewichtung === !vorher);
      const gespeichert = JSON.parse(w.localStorage.getItem(LS_KEY));
      t("E6: Toggle wird via speichere() in localStorage geschrieben",
        gespeichert && gespeichert.relevanzGewichtung === w.S.relevanzGewichtung);
    }
  }

  // E7: alle 12 Routen rendern ohne Fehler
  {
    const routen = ["start", "ueben", "fd", "gen", "netzplan", "gantt", "sim", "glossar", "spickzettel", "serie", "stat", "einst"];
    routen.forEach(function (route) {
      let exc = null;
      try { w.eval('seite=' + JSON.stringify(route) + '; render();'); } catch (e) { exc = e; }
      t("E7: Route '" + route + "' rendert ohne Fehler" + (exc ? " (" + exc.message + ")" : ""), !exc);
    });
  }

  w.close();
}

/* =====================================================================
   Ausführung + Abschluss
   ===================================================================== */
testE().then(function () {
  process.exit(report());
}).catch(function (e) {
  console.log("FEHLER: unerwartete Exception in testE(): " + (e && e.stack || e));
  process.exit(1);
});
