/* tools/trennschaerfe.js – HANDWERKZEUG zur Runde "TRENNSCHAERFE FREITEXT" (2026-09-09).
   KEIN Waechter – der ist tests/test_freitext.js, Block 2. Dieses Werkzeug beantwortet die
   Frage, die der Waechter NICHT beantwortet: WARUM rutscht eine fremde Musterloesung durch,
   und WELCHER Begriff der eigenen Musterloesung wuerde sie aussperren.

   AUFRUF (seit 13.10.2026 direkt, BUILD_LOG 153 – vorher Kopie ins flache Arbeitsverzeichnis):
       node tools/trennschaerfe.js                  -> Liste
       node tools/trennschaerfe.js M01-013 M07-016  -> Diagnose
       node tools/trennschaerfe.js --probe v.json   -> Vorschlaege
   Es liest den Pool aus pool/ (tools/pool_laden.js) – kein Neubau eines Arbeitsverzeichnisses noetig.

   ⚠️ GEGENPROBE EINGEBAUT (Lehre 4 vom 07.09.: "jeder neue Filter braucht Gegenproben mit
   bekannter Antwort VOR dem ersten Urteil"): der Listenmodus druckt Summe und Fragenzahl.
   ⛔ SEIT DEM 09.09. IST DER VERGLEICHSWERT DIE SUMME AUS BEIDEN MELDUNGEN der Suite – dem
   FEHLER-Zweig (themenfremd) und dem HINWEIS-Zweig (themengleich). Weichen sie ab, misst
   dieses Werkzeug etwas anderes als der Waechter – dann gilt der Waechter.
   (Erledigt seit 13.10.2026 – liest jetzt pool/ direkt. Damals:) ES MASS DAS ARBEITSVERZEICHNIS: nach einer Pool-Aenderung ODER einem
   `tools/sabotage.sh`-Lauf zuerst `bash tools/suite.sh freitext` fahren (baut es neu) und die
   Dateien erneut hineinkopieren. Am 09.09. meldete es sonst einen Durchrutscher, den eine
   zurueckgenommene Sabotage im Arbeitsverzeichnis hinterlassen hatte.

   ⚠️ Die Kandidatenliste ist ein KANDIDATENFILTER, KEIN URTEIL. Sie nennt Woerter der eigenen
   Musterloesung, die in KEINER durchrutschenden Fremdloesung stehen. Ob ein Wort ein
   PFLICHTbegriff sein darf, entscheidet die Sache: er muss den FACHKERN treffen und lang und
   fachlich sein (Lehre 08.09.: "Hop" mit 3 Zeichen machte die Pruefung stumpfer, nicht schaerfer).
*/
"use strict";
/* 13.10.2026 (BUILD_LOG 153): frueher `require("./_harness.js")` – lief nur, wenn man die Datei ins flache
   Arbeitsverzeichnis von tools/suite.sh kopierte, und bewertete mit der ALTEN App. Jetzt wie die App selbst:
   Pool ueber tools/pool_laden.js, Bewertung aus neu/src/kern/freitext.ts (ueber tools/kern.js). Aufruf direkt:
   node tools/<datei>.js. Gegenprobe beim Umbau: Ausgabe Zeile fuer Zeile gleich der alten (BUILD_LOG 153). */
/** @type {any} */ const L = require("./kern.js");
const H = { boot: async () => ({ POOL: require("./pool_laden.js").laden().fragen, gradeTeilpunkte: L.gradeTeilpunkte, normText: L.normFreitext }) };

const STOPP = new Set(("und oder aber der die das den dem des ein eine einer eines einem einen " +
  "ist sind war waren wird werden wurde wurden kann koennen muss muessen soll sollen hat haben " +
  "nicht auch nur noch schon dann wenn weil dass fuer mit ohne bei aus von vor nach ueber unter " +
  "zum zur beim ins man sich seine ihre diese dieser dieses alle allen jeder jede jedes zum " +
  "beispiel z.b also damit dabei dazu daran darauf werden wurde etwa mehr sehr immer wieder " +
  "zwischen gegen durch sowie sowohl bzw usw etc").split(/\s+/));

function woerter(/** @type {any} */ t){
  return String(t || "").split(/[^A-Za-zÄÖÜäöüß-]+/)
    .map(w => w.replace(/^-+|-+$/g, ""))
    .filter(w => w.length >= 7 && !STOPP.has(w.toLowerCase()));
}

(async () => {
  const w = await H.boot();
  const ziel = (process.argv[2] || "").toUpperCase();
  const mit = w.POOL.filter(f => f.schluesselbegriffe &&
    Array.isArray(f.schluesselbegriffe.pflicht) && f.schluesselbegriffe.pflicht.length);

  /* Durchrutscher genau so zaehlen wie der Waechter (Block 2 von test_freitext.js). */
  /** @type {Record<string, any>} */ const opfer = {};
  let summe = 0;
  mit.forEach(f => {
    mit.forEach(fremd => {
      if (fremd.id === f.id) return;
      if (w.gradeTeilpunkte(fremd.musterloesung, f).stufe === "richtig") {
        summe++;
        (opfer[f.id] = opfer[f.id] || []).push(fremd.id);
      }
    });
  });

  /* ⛔⛔ EIN DUBLETTEN-FILTER UEBER WORTUEBERLAPPUNG IST AM 09.09. GEBAUT, GEMESSEN UND
     VERWORFEN. NICHT ERNEUT VORSCHLAGEN. Die Frage war berechtigt – "ein Sachbefund ist ein
     Verdacht auf eine Fehlerklasse", und die letzten zwei Durchrutscher waren Paare, bei denen
     die hoeherstufige Musterloesung die Begriffsfrage mitbeantwortet. Gemessen wurde die
     UEBERDECKUNG der Inhaltswoerter (Anteil der kuerzeren Menge in der laengeren), getrennt fuer
     Fragetext und Musterloesung, mit Floskelfilter.
     ►► DAS ERGEBNIS, an fuenf Faellen mit bekannter Antwort kalibriert:
        M01-013/M07-016 (belegte Dublette)  Frage 100 % · Loesung 31 %
        M02-109/M02-750 (belegte Dublette)  Frage   0 % · Loesung 10 %
        M02-011/M02-305 (belegte Dublette)  Frage   0 % · Loesung 21 %
        M03-010/M03-117 (belegte Teilmenge) Frage  20 % · Loesung 52 %
        M02-011/M06-007 (unverwandt)        Frage   0 % · Loesung  6 %
     **Zwei der drei belegten Dubletten liegen bei 10 und 21 % – im Rauschen des unverwandten
     Paares (6 %).** Und die vier Kandidaten ab 60 % waren ALLE Fehlalarme: M04-012/M04-106 sind
     zwei Schreibtischtests mit verschiedenen Programmen (FUER-Schleife gegen SOLANGE),
     M07-007/M07-310/M07-113 drei verschiedene Begriffe desselben Themas (SLA, Service-Credits,
     Wartungsvertrag). **0 Befunde auf 4 Fehlalarme, und 2 von 3 bekannten Faellen nicht gefunden.**
     ►►► DIE LEHRE: WORTUEBERLAPPUNG MISST VOKABULAR, NICHT AUSSAGE. Ob eine Musterloesung eine
     fremde Frage beantwortet, weiss nur `gradeTeilpunkte` – und die fragt `test_freitext` bereits
     an allen 15006 Paaren ab. Ein zweiter, schwaecherer Filter daneben schafft nur Arbeit.
     (Der verworfene Code liegt im Commit-Verlauf zum 09.09.; hier steht bewusst nur das Urteil.) */

  if (!ziel) {
    const eintraege = Object.entries(opfer).sort((a, b) => b[1].length - a[1].length);
    eintraege.forEach(([id, fremde]) => {
      const f = mit.find(x => x.id === id);
      /* ⚠️ THEMENGLEICH ODER NICHT – die Pruefung heisst "themenfremde Musterloesung", misst
         aber ALLE Paare, auch zwei Fragen DESSELBEN Feinthemas. Bei denen ist eine inhaltliche
         Ueberschneidung zu erwarten (dieselbe Sache, andere Tiefe), bei themenfremden nie.
         Die Spalte trennt die beiden Klassen, damit man sie nicht gleich behandelt. */
      const marke = fremde.map(/** @param {any} fid */ fid => {
        const g = mit.find(x => x.id === fid);
        return fid + (g && g.thema === f.thema ? "*" : "");
      });
      console.log(String(id).padEnd(9) + String(fremde.length).padStart(2) + "  " +
        f.modul + " " + (f.thema || "").slice(0, 28).padEnd(29) + " <- " + marke.join(" "));
    });
    console.log("-".repeat(78));
    let gleich = 0, fremdTh = 0;
    Object.entries(opfer).forEach(([id, fl]) => {
      const f = mit.find(x => x.id === id);
      fl.forEach(/** @param {any} fid */ fid => {
        const g = mit.find(x => x.id === fid);
        if (g && g.thema === f.thema) gleich++; else fremdTh++;
      });
    });
    console.log("* = FREMDE FRAGE AUS DEMSELBEN FEINTHEMA: " + gleich +
      " von " + (gleich + fremdTh) + " Durchrutschern; wirklich themenfremd: " + fremdTh);
    /* ⚠️ SEIT 09.09. TRENNT test_freitext: der FEHLER-Zweig zaehlt nur die themenfremden, der
       HINWEIS-Zweig die themengleichen. Dieses Werkzeug zaehlt beide – die SUMME der zwei
       Meldungen der Suite muss der Zahl hier gleichen, nicht die Fehlerzahl allein. */
    console.log("GEGENPROBE (= FEHLER- plus HINWEIS-Zahl von test_freitext): " + summe +
      " Durchrutscher bei " + eintraege.length + " Fragen, " +
      (mit.length * (mit.length - 1)) + " Paare aus " + mit.length + " Fragen");
    return;
  }

  /* ---- PROBE-MODUS: Vorschlaege durchrechnen, OHNE den Pool anzufassen -------------------
     Aufruf: node trennschaerfe.js --probe vorschlaege.json
     Datei:  [{"id":"M01-013","pflicht":[...],"kuer":[...]}, ...]   (kuer optional)
     ⚠️ WARUM DAS DER SPARSAME WEG IST: eine Schaerfung schreiben, bauen und messen kostet drei
     Verbindungsaufrufe (je ~4 s Leerlauf, Messung 07.09.). Hier werden beliebig viele
     Vorschlaege in EINEM Aufruf durchgerechnet, und geschrieben wird nur, was besteht.
     ⚠️ Aenderungen an Frage A wirken NUR auf As eigene Durchrutscher – als "fremde" geht eine
     Frage mit ihrer MUSTERLOESUNG ein, nicht mit ihren Schluesselbegriffen. Die Vorschlaege sind
     deshalb voneinander unabhaengig.
     ⚠️ DREI GEGENPROBEN JE VORSCHLAG, sonst ist es nur ein zufriedengestellter Waechter:
       (1) die EIGENE Musterloesung muss weiter alle Pflichtbegriffe treffen,
       (2) hoechstens 4 Pflichtgruppen, jede Alternativliste mit mindestens ZWEI Eintraegen,
       (3) wo tools/mess_freitext.js eine Azubi-Antwort kennt, wird sie mitgemessen –
           das strenge und das realistische Gleis. Eine Schaerfung, die den Lerner aussperrt,
           ist keine Schaerfung. */
  if (ziel === "--PROBE") {
    const datei = process.argv[3];
    const vorschlaege = JSON.parse(require("fs").readFileSync(datei, "utf8"));
    /* ⛔ EINE QUELLE: die Azubi-Antworten werden aus tools/mess_freitext.js GELESEN, nicht
       kopiert. Eine zweite Liste fuer dieselbe Sache driftet – Beleg 28.07. (Archiv). Der
       Block wird als Text herausgeschnitten und ausgewertet; faellt das aus, laeuft die Probe
       ohne Azubi-Gleise weiter und sagt es. */
    /** @type {Record<string, any>} */ let ANT = {};
    try {
      const q = require("fs").readFileSync("mess_freitext.js", "utf8");
      const start = q.indexOf("{", q.indexOf("const ANTWORTEN ="));
      let tiefe = 0, ende = -1;
      for (let i = start; i < q.length; i++) {
        if (q[i] === "{") tiefe++;
        else if (q[i] === "}") { tiefe--; if (!tiefe) { ende = i + 1; break; } }
      }
      ANT = new Function("return " + q.slice(start, ende))();
    } catch (e) { console.log("(Azubi-Gleise nicht verfuegbar: " + /** @type {Error} */ (e).message + ")"); }
    let summeNeu = summe;
    vorschlaege.forEach(/** @param {any} v */ v => {
      const f = mit.find(x => x.id === v.id);
      if (!f) { console.log(v.id + ": NICHT IM POOL"); return; }
      const sicher = f.schluesselbegriffe;
      const probe = { pflicht: v.pflicht, kuer: v.kuer !== undefined ? v.kuer : (sicher.kuer || []) };
      const formfehler = [];
      if (probe.pflicht.length > 4) formfehler.push("mehr als 4 Pflichtgruppen");
      probe.pflicht.concat(probe.kuer).forEach(/** @param {any} e */ e => {
        if (Array.isArray(e) && e.length < 2) formfehler.push("einelementige Liste " + JSON.stringify(e));
      });
      f.schluesselbegriffe = probe;
      const eigen = w.gradeTeilpunkte(f.musterloesung, f);
      /** @type {string[]} */ const durch = [], /** @type {string[]} */ warum = [];
      mit.forEach(fremd => {
        if (fremd.id === f.id) return;
        const r = w.gradeTeilpunkte(fremd.musterloesung, f);
        if (r.stufe === "richtig") {
          durch.push(fremd.id);
          /* WARUM er durchkommt – sonst raet man beim naechsten Vorschlag. */
          warum.push("      " + fremd.id + " " + r.prozent + "% Pflicht " + r.pflichtTreffer +
            "/" + r.pflichtGesamt + " getroffen: " + r.gefunden.join(" | "));
        }
      });
      /** @type {string[]} */ const gleise = [];
      if (ANT[v.id]) ["streng", "realistisch"].forEach(g => {
        const r = w.gradeTeilpunkte(ANT[v.id][g], f);
        gleise.push(g + " " + r.stufe + "(" + r.prozent + "%)");
      });
      f.schluesselbegriffe = sicher;
      const vorherN = (opfer[v.id] || []).length;
      summeNeu += durch.length - vorherN;
      const ok = durch.length === 0 && eigen.pflichtTreffer === eigen.pflichtGesamt && !formfehler.length
        && gleise.every(g => !/ unvollständig|teilweise/.test(g));
      console.log((ok ? "✅" : "❌") + " " + v.id + "  " + vorherN + " -> " + durch.length +
        (durch.length ? " (" + durch.join(" ") + ")" : "") +
        " · eigen " + eigen.pflichtTreffer + "/" + eigen.pflichtGesamt + " " + eigen.stufe +
        (gleise.length ? " · Azubi: " + gleise.join(", ") : "") +
        (formfehler.length ? " · FORM: " + formfehler.join(", ") : ""));
      warum.forEach(z => console.log(z));
    });
    console.log("-".repeat(78));
    console.log("SUMME nach allen Vorschlaegen: " + summeNeu + " (jetzt " + summe + ")");
    return;
  }

  /* Mehrere IDs je Aufruf – jeder Verbindungsaufruf kostet ~4 s Leerlauf (Messung 07.09.),
     der jsdom-Start noch einmal so viel. Messungen buendeln. */
  const zielIds = process.argv.slice(2).map(x => x.toUpperCase());
  zielIds.forEach(zid => diagnose(zid));
  return;

  function diagnose(/** @type {any} */ ziel) {
  const f = mit.find(x => x.id === ziel);
  if (!f) { console.log(ziel + " hat keine schluesselbegriffe oder liegt nicht im Pool."); return; }
  const fremde = (opfer[ziel] || []).map(/** @param {any} id */ id => mit.find(x => x.id === id));
  console.log("== " + f.id + " (" + f.modul + " · " + f.thema + " · Stufe " + f.schwierigkeit + ") ==");
  console.log("FRAGE: " + f.frage);
  console.log("PFLICHT: " + JSON.stringify(f.schluesselbegriffe.pflicht));
  console.log("KUER:    " + JSON.stringify(f.schluesselbegriffe.kuer || []));
  console.log("EIGENE MUSTERLOESUNG: " + String(f.musterloesung).replace(/\s+/g, " "));
  console.log("DURCHRUTSCHER: " + fremde.length);
  fremde.forEach(/** @param {any} g */ g => {
    const r = w.gradeTeilpunkte(g.musterloesung, f);
    console.log("  " + g.id + " (" + g.modul + " · " + (g.thema || "") + ") " +
      r.prozent + "% · Pflicht " + r.pflichtTreffer + "/" + r.pflichtGesamt +
      " · getroffen: " + r.gefunden.join(" | "));
    console.log("      \"" + String(g.musterloesung).replace(/\s+/g, " ").slice(0, 240) + "\"");
  });

  /* KANDIDATEN: Woerter der eigenen Musterloesung, die in KEINER durchrutschenden Fremdloesung
     stehen. Gegen die NORMALISIERTE Fremdloesung geprueft, damit Gross-/Kleinschreibung und
     Umlaute nicht zu Scheinkandidaten fuehren (Falle 1 vom 07.09.). */
  const fremdText = fremde.map(/** @param {any} g */ g => " " + w.normText(g.musterloesung) + " ").join("\n");
  const gesehen = new Set(), /** @type {string[]} */ kand = [];
  woerter(f.musterloesung).forEach(wo => {
    const n = w.normText(wo);
    if (!n || gesehen.has(n)) return;
    gesehen.add(n);
    if (fremdText.indexOf(n) === -1) kand.push(wo);
  });
  console.log("KANDIDATEN (>=7 Zeichen, in KEINER der obigen Fremdloesungen) – Filter, kein Urteil:");
  console.log("  " + (kand.join(" · ") || "(keine)"));
  }
})();
