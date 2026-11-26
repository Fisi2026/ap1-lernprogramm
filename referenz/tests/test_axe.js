/* G1.5 #46: axe-core-Audit über die Hauptseiten (jsdom). BLOCKIEREND – JEDER Verstoß (unabhängig vom
   impact) lässt die Suite fehlschlagen (Nutzer-Entscheid 2026-07-18).
   Geprüft werden die 5 Hauptseiten Start/Üben/Simulation/Statistik/Einstellungen: je Seite wird über
   `seite = <route>; render()` neu gezeichnet und danach axe.run über das gesamte Dokument gefahren.
   ABGESCHALTETE REGEL: color-contrast – jsdom hat kein Layout/Rendering, die Regel kann dort nicht
   ausgewertet werden (liefert nur „incomplete"). Kontrast bleibt Sache des visuellen Reviews.
   axe-core wird als Quelltext in das jsdom-Fenster injiziert (window.axe); das ist der von axe-core
   vorgesehene Weg und betrifft KEINE App-Skripte (die werden weiterhin per fromFile geladen).

   ══════════ ⚠️⚠️ TEIL 2 SEIT 2026-07-27: JE FRAGETYP EIN EIGENER AXE-LAUF ══════════
   WARUM ES DEN TEIL GIBT – der lehrreichste Befund der Qualitätsrunde Q1:
   Die Üben-Seite zieht ihre Frage über L.pick(arr, Math.random). Von rund 922 AP1/AP2-Fragen sind
   etwa 32 vom Typ `hotspot`. Der Seiten-Teil dieser Suite prüfte damit **eine zufällig gezogene
   Frage** und traf einen bestimmten Fragetyp mit ~3,5 % Wahrscheinlichkeit pro Lauf.
   Folge: In `hotspot` steckte seit R10 (a) ein role="button" auf einem <rect> OHNE zugänglichen
   Namen. Die Suite lief trotzdem monatelang grün – nicht weil die App sauber war, sondern weil die
   Ziehung meist einen anderen Typ erwischte. Am 27.07. fiel die CI dann scheinbar „grundlos" aus
   (Lauf 30247883708 auf v1.10.0, 3 Knoten aus M03-471); derselbe Commit war lokal in drei von vier
   Läufen grün, der vierte meldete 8 Knoten aus einer ANDEREN Frage.
   ⚠️⚠️ **EINE PRÜFUNG, DIE WÜRFELT, IST KEINE PRÜFUNG.** Sie meldet Erfolg, ohne geprüft zu haben –
   dieselbe Fehlerklasse wie ci2.sh am selben Tag. Deshalb wird jeder Typ aus L.TYPEN jetzt EINZELN
   und DETERMINISTISCH gerendert und einzeln von axe geprüft. Craft-Muster und Renderweg sind aus
   test_render_smoke übernommen, damit die beiden Suiten nicht auseinanderlaufen.
   ⚠️ Der axe-Lauf ist in Teil 2 auf den Host-Knoten der Frage EINGEGRENZT (axe.run(host, …)), nicht
   auf das ganze Dokument – sonst zählte jeder Typ die Seiten-Befunde noch einmal mit.
   ⚠️ ZÄHLWERT = 5 Seiten + Anzahl L.TYPEN (Sollwert `axe` in sollwerte.env). Kommt ein Fragetyp
   hinzu, MUSS sollwerte.env mitwachsen. */
"use strict";
const H = require("./_harness.js");
const axeSource = require("axe-core").source;

const SEITEN = [
  ["start", "Start"],
  ["ueben", "Üben"],
  ["sim",   "Simulation"],
  ["stat",  "Statistik"],
  ["einst", "Einstellungen"]
];

const OPTS = {
  resultTypes: ["violations"],
  rules: { "color-contrast": { enabled: false } }
};

/* Minimal gültige Ersatzfrage für Typen ohne Pool-Instanz – inhaltlich gleich wie in
   test_render_smoke. Aktuell betrifft das nur 'lueckentext'. */
const CRAFT = {
  lueckentext: {
    id: "M01-001", pruefungsteil: "AP1", modul: "M01", thema: null, typ: "lueckentext",
    schwierigkeit: 1, frage: "Ein Byte besteht aus ___ Bit.", luecken: [["8", "acht"]],
    erklaerungKurz: "1 Byte = 8 Bit."
  }
};

/* Verstöße einheitlich ausgeben, damit ein CI-Fehlschlag OHNE lokalen Nachlauf auswertbar ist.
   Genau daran hing es am 27.07.: der Fehlgrund stand ausschließlich im CI-Log. */
function zeigeVerstoesse(verstoesse) {
  verstoesse.forEach(function (v) {
    console.log("  [" + v.impact + "] " + v.id + " (" + v.nodes.length + " Knoten): " + v.help);
    v.nodes.slice(0, 3).forEach(function (n) { console.log("      " + String(n.html).slice(0, 160)); });
  });
}

(async () => {
  const w = await H.boot();
  w.eval(axeSource);
  if (!w.axe) { console.log("FEHLER: axe-core konnte nicht injiziert werden"); process.exit(1); }

  /* ── TEIL 1: die fünf Hauptseiten ─────────────────────────────────────────────────────────── */
  for (const [route, name] of SEITEN) {
    let verstoesse = null, fehler = "";
    try {
      w.seite = route;
      w.render();
      /* 2026-07-30: hier stand `H.sleep(250)`, unten `H.sleep(30)` – zusammen 1906 ms je Lauf,
         beide ohne Kommentar und ohne Messung dahinter. `render()` und `loeseFrage()` bauen das
         DOM SYNCHRON auf, die Marge war wirkungslos.
         ⚠️ NACHGEWIESEN, NICHT VERMUTET – und bewusst NICHT ueber „ist noch gruen": Ein zu frueher
         axe-Lauf faende WENIGER Knoten und meldete deshalb WENIGER Verstoesse. Gruen waere hier
         also genau das falsche Kriterium (dieselbe Falle wie „eine Korrektur, die nur den Scanner
         zufriedenstellt"). Gemessen wurde stattdessen, wie viele Knoten axe INSPIZIERT
         (Summe ueber res.passes[].nodes) – mit und ohne Warten **identisch in allen 26 Laeufen**,
         ueber alle 5 Seiten und 21 Fragetypen. Laufzeit 7,9 s -> 5,3 s.
         `sleep(0)` statt gar nichts: ein einziges `await` gibt dem Event-Loop seine Runde – genau
         der Punkt, der bei der Harness-Umstellung am selben Tag den Unterschied machte. */
      await H.sleep(0);
      const res = await w.axe.run(w.document, OPTS);
      verstoesse = res.violations;
    } catch (e) {
      fehler = " EXCEPTION: " + (e && e.message ? e.message : String(e));
    }
    if (verstoesse && verstoesse.length) zeigeVerstoesse(verstoesse);
    H.t("axe " + name + " (" + route + "): 0 Verstöße" + fehler, !fehler && verstoesse && verstoesse.length === 0);
  }

  /* ── TEIL 2: je Fragetyp eine reale Frage, deterministisch ────────────────────────────────── */
  const L = w.L, POOL = w.FRAGEN || [];
  const typen = (L && Array.isArray(L.TYPEN)) ? L.TYPEN : [];
  /* Harte Boot-Guards: zählen NICHT als Test, damit der Zählwert 5 + Anzahl Typen bleibt. */
  if (typen.length < 20) { console.log("BOOT-FEHLER: L.TYPEN fehlt/zu kurz (" + typen.length + ")"); process.exit(1); }
  if (typeof w.loeseFrage !== "function") { console.log("BOOT-FEHLER: loeseFrage nicht vorhanden"); process.exit(1); }
  const kanon = (L && L.THEMA_RELEVANZ) ? Object.keys(L.THEMA_RELEVANZ)[0] : "Betriebssysteme";

  for (const typ of typen) {
    /* ⚠️ find() liefert IMMER dieselbe Frage (erste Pool-Position). Genau das ist hier der Zweck –
       kein Math.random, kein Pool-Zufall, gleicher Baum = gleiches Ergebnis. */
    let quelle = POOL.find(function (f) { return f.typ === typ; });
    if (!quelle && CRAFT[typ]) { quelle = Object.assign({}, CRAFT[typ]); if (quelle.thema == null) quelle.thema = kanon; }
    if (!quelle) { H.t("axe Fragetyp " + typ + " (keine Frage im Pool + kein Craft)", false); continue; }

    let verstoesse = null, fehler = "", host = null;
    try {
      const f = (typeof L.instanziiere === "function") ? L.instanziiere(quelle) : quelle;
      host = w.document.createElement("div");
      w.document.body.appendChild(host);
      w.loeseFrage(f, host, { simulation: false, onGraded: function () {}, onNext: function () {} });
      await H.sleep(0);   // s. Begruendung in Teil 1: Marge war wirkungslos, Knotenzahl identisch
      const res = await w.axe.run(host, OPTS);
      verstoesse = res.violations;
    } catch (e) {
      fehler = " EXCEPTION: " + (e && e.message ? e.message : String(e));
    }
    if (verstoesse && verstoesse.length) {
      console.log("  → Fragetyp " + typ + " (" + (quelle.id || "craft") + "):");
      zeigeVerstoesse(verstoesse);
    }
    if (host && host.parentNode) host.parentNode.removeChild(host);
    H.t("axe Fragetyp " + typ + ": 0 Verstöße" + fehler, !fehler && verstoesse && verstoesse.length === 0);
  }

  const c = H.counts();
  console.log("\n==== " + c.ok + " Tests OK, " + c.fail + " Fehler ====");
  process.exit(c.fail ? 1 : 0);
})();
