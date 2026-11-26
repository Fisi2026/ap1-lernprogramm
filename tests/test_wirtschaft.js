/* Test (FB-R3, Nutzerbefund 2026-07-22): Schwerpunkt „Wirtschaft".
   ANLASS: Der Nutzer vermisste WiSo-Fragen in der AP1. „WiSo" (M08) ist laut Prüfungskatalog
   eigener Prüfungsbereich der AP2 und im AP1-Modus zwangsläufig leer; der wirtschaftliche
   AP1-Stoff liegt verteilt in M01/M02/M03/M07. WIRTSCHAFT_THEMEN macht ihn auffindbar.

   ⚠️ DER WICHTIGSTE TEST hier ist Abschnitt 1: jedes Paar der kuratierten Liste MUSS im Pool
   existieren. Ein Tippfehler im Themennamen würde sonst still weniger Fragen liefern statt zu
   scheitern – genau die Art Fehler, die in R2a als „Test ist immer grün" teuer geworden ist. */
const { t: check, boot, report } = require("./_harness.js");
const FRAGEN = require("./fragen.js");

(async () => {
  const w = await boot();
  const WT = w.WIRTSCHAFT_THEMEN;
  const ap1 = FRAGEN.filter(f => f.pruefungsteil === "AP1" && f.modul !== "M09");

  // ── 1) Kuratierte Liste gegen den echten Pool ──────────────────────────────
  check("WIRTSCHAFT_THEMEN ist eine nicht-leere Liste", Array.isArray(WT) && WT.length > 0);
  const paare = new Set(ap1.map(f => f.modul + "|" + f.thema));
  const tot = WT.filter(p => !paare.has(p[0] + "|" + p[1]));
  check("kein Eintrag zeigt ins Leere (Tippfehler-Wächter)", tot.length === 0,
    tot.length ? "tote Einträge: " + JSON.stringify(tot) : "");
  const keys = WT.map(p => p[0] + "|" + p[1]);
  check("keine Dubletten in WIRTSCHAFT_THEMEN", new Set(keys).size === keys.length);
  check("nur die vier wirtschaftlich einschlägigen Lernfelder",
    WT.every(p => ["M01", "M02", "M03", "M07"].indexOf(p[0]) >= 0));
  check("M08 steht NICHT drin (WiSo ist AP2, nicht AP1)", WT.every(p => p[0] !== "M08"));
  check("M09 steht NICHT drin (Unterrichtspool bleibt getrennt)", WT.every(p => p[0] !== "M09"));

  // ── 2) istWirtschaft trennt sauber ─────────────────────────────────────────
  check("istWirtschaft(null) ist false", w.istWirtschaft(null) === false);
  check("istWirtschaft(undefined) ist false", w.istWirtschaft(undefined) === false);
  const treffer = ap1.filter(f => w.istWirtschaft(f));
  check("es werden überhaupt Fragen erfasst (> 100)", treffer.length > 100);
  check("jede erfasste Frage liegt in einem der vier Lernfelder",
    treffer.every(f => ["M01", "M02", "M03", "M07"].indexOf(f.modul) >= 0));
  check("jede erfasste Frage ist AP1", treffer.every(f => f.pruefungsteil === "AP1"));
  check("keine M08-Frage wird erfasst",
    FRAGEN.filter(f => f.modul === "M08").every(f => !w.istWirtschaft(f)));
  check("keine M09-Frage wird erfasst",
    FRAGEN.filter(f => f.modul === "M09").every(f => !w.istWirtschaft(f)));
  // Gegenprobe: ein rein technisches Thema darf NICHT erfasst sein
  const technisch = ap1.find(f => f.thema === "OSI-Modell & Protokolle");
  check("technisches Thema (OSI-Modell) wird nicht erfasst", !!technisch && !w.istWirtschaft(technisch));
  const hardware = ap1.find(f => f.thema === "Hardware-Komponenten");
  check("technisches Thema (Hardware) wird nicht erfasst", !!hardware && !w.istWirtschaft(hardware));

  // ── 3) Jedes gelistete Thema trägt auch wirklich Fragen ────────────────────
  let leer = [];
  for (const p of WT) {
    const n = ap1.filter(f => f.modul === p[0] && f.thema === p[1]).length;
    if (n === 0) leer.push(p.join("|"));
  }
  check("jedes gelistete Thema hat mindestens eine AP1-Frage", leer.length === 0,
    leer.length ? "leer: " + leer.join(", ") : "");

  // ── 4) Die sieben nachgezogenen Katalog-Stichworte sind jetzt belegt ───────
  const txt = f => JSON.stringify(f).toLowerCase();
  const zaehle = pats => ap1.filter(f => pats.some(p => txt(f).indexOf(p) >= 0)).length;
  check("Stichwort fixe/variable Kosten belegt (>= 3)",
    zaehle(["fixe kosten", "variable kosten", "fixkosten"]) >= 3);
  check("Stichwort Pay-per-Use belegt (>= 4)", zaehle(["pay-per-use", "pay per use"]) >= 4);
  check("Stichwort Wertschöpfung belegt (>= 5)", zaehle(["wertschöpfung"]) >= 5);
  check("Stichwort Matrixorganisation belegt (>= 4)",
    zaehle(["matrixorganisation", "matrix-organisation"]) >= 4);
  check("Stichwort Prokura belegt (>= 5)", zaehle(["prokura"]) >= 5);
  check("Stichwort Handlungsvollmacht belegt (>= 5)", zaehle(["handlungsvollmacht"]) >= 5);
  check("Stichwort Mietvertrag belegt (>= 6)", zaehle(["mietvertrag"]) >= 6);

  // ── 5) Der Filter wirkt im Übungspool (kandidaten) ─────────────────────────
  // FB-R3 Etappe 2: Themenauswahl läuft jetzt über S.gebiete/S.themen (nicht mehr S.module).
  w.S.inklAP2 = false; w.S.gebiete = []; w.S.themen = []; w.S.wirtschaftNur = false;
  const ohne = w.kandidaten().length;
  w.S.wirtschaftNur = true;
  const mit = w.kandidaten().length;
  check("Filter aus: mehr Kandidaten als mit Filter", ohne > mit);
  check("Filter an: es bleiben Kandidaten übrig", mit > 0);
  check("Filter an: ausschließlich Wirtschafts-Fragen",
    w.kandidaten().every(id => w.istWirtschaft(w.frageById(id))));

  // UND-Verknüpfung mit der Gebiets-Auswahl: A5 (Leistungserbringung) trägt die M07-Vertragsthemen.
  w.S.gebiete = ["A5"]; w.S.themen = [];
  const a5wi = w.kandidaten();
  check("Gebiet + Schwerpunkt wirken zusammen (nur A5)",
    a5wi.length > 0 && a5wi.every(id => w.frageById(id).gebiet === "A5"));
  check("Gebiet + Schwerpunkt: alle Treffer sind Wirtschaft",
    a5wi.every(id => w.istWirtschaft(w.frageById(id))));
  // Gebiet ohne Wirtschaftsthemen (A3 = IT-Arbeitsplatz/Sicherheit) -> leer, aber kein Absturz
  w.S.gebiete = ["A3"]; w.S.themen = [];
  check("Gebiet ohne Wirtschaftsthemen liefert leere Auswahl", w.kandidaten().length === 0);
  w.S.gebiete = []; w.S.themen = []; w.S.wirtschaftNur = false;

  // ── 6) Zähler am Häkchen ───────────────────────────────────────────────────
  const beschriftung = w.wirtschaftAnzahl();
  check("wirtschaftAnzahl liefert Text mit Zahl", /^\d+ Frage/.test(beschriftung));
  check("wirtschaftAnzahl passt zur Trefferzahl",
    parseInt(beschriftung, 10) === ap1.filter(f => w.istWirtschaft(f)).length);

  // ── 7) Voreinstellung: Filter ist aus ──────────────────────────────────────
  check("wirtschaftNur ist im Auslieferungszustand false",
    w.defaultState().wirtschaftNur === false);

  process.exit(report());
})();
