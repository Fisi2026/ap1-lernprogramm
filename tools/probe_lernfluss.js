"use strict";
/* =====================================================================================
   tools/probe_lernfluss.js – ETAPPE VII: WAS DER LERNER IN EINER SITZUNG SIEHT
   ⛔⛔ DIESE PROBE MISST NUR. Sie schreibt nichts ins Projekt und aendert kein
       Produktverhalten (Nutzer-Entscheid 10 vom 27.08.: "NUR MESSEN").

   Anlass (docs/archiv/PLAENE.md, Etappe VII): Die Waechter messen die Zusammensetzung des POOLS.
   Was aus 50 gezogenen Fragen tatsaechlich wird, hat nie jemand gemessen.

   ⚠️ SIE WUERFELT NICHT. `Math.random` wird je Sitzung durch einen geseedeten PRNG
      ersetzt (mulberry32, Seed = Sitzungsnummer). Derselbe Aufruf liefert dieselben
      Zahlen - die Lehre "eine Pruefung, die wuerfelt, ist keine Pruefung" gilt auch
      fuer eine Messung, sonst ist kein Vorher/Nachher moeglich.

   ⚠️ SIE MISST DIE ECHTE FUNKTION, NICHT EINEN NACHBAU. Gezogen wird ueber
      w.naechsteFrage() aus app_seiten.js - mit Themen-Serie, Fehler-Deck-Einstreuung,
      Generator-Einstreuung, kandidatenMitTypWechsel, deckPick und gewichteFrage.
      Ein Nachbau der Ziehung wuerde genau das messen, was ich mir dabei denke.

   Aufruf im Training-Ordner:
     node tools/probe_lernfluss.js <arbeitskopie> [sitzungen] [fragen] [--antworten <quote>]
       <arbeitskopie>  Verzeichnis mit app.html (z. B. /tmp/ap1_work, s. tools/suite.sh --waermen)
       sitzungen       Default 20
       fragen          Fragen je Sitzung, Default 50
       --antworten q   jede Frage mit Trefferquote q beantworten (0..1). Ohne den Schalter
                       wird NUR gezogen - dann bleibt S.themaLevel unberuehrt und der
                       Stufenverlauf zeigt die Ziehung ohne Lernfortschritt.
       --kette         Themenstufen NICHT je Sitzung zuruecksetzen, sondern fortschreiben.
                       ⚠️ OHNE diesen Schalter misst die Probe 20 unabhaengige ERSTSITZUNGEN
                       und kann Lernfortschritt bauartbedingt nicht zeigen (Befund 08.09.).
       --ohne-relevanz GEGENPROBE zu Abschnitt 1: setzt S.relevanzGewichtung auf false, damit
                       L.gewichteFrage fuer JEDE Frage das Gewicht 2 nimmt. Die Modul-
                       Abweichungen muessen dann zusammenfallen. ⛔ Nur fuer die Messung -
                       geschrieben wird nichts (Neu 10.09.2026, s. Abschnitt 1).
   ===================================================================================== */
const { JSDOM } = require(/** @type {string} */ ("jsdom"));
const sleep = /** @param {any} ms */ ms => new Promise(r => setTimeout(r, ms));

function mulberry32(/** @type {any} */ a) {                      // kurzer, guter 32-Bit-PRNG - reproduzierbar
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const proz = (/** @type {any} */ x, /** @type {any} */ n) => n ? (Math.round(x / n * 1000) / 10).toFixed(1) + " %" : "–";
const KETTE = process.argv.includes("--kette");   // Themenstufen ueber die Sitzungen fortschreiben
const OHNE_RELEVANZ = process.argv.includes("--ohne-relevanz");   // Gegenprobe zu Abschnitt 1
const mittel = /** @param {any} a */ a => a.length ? a.reduce((/** @type {any} */ s, /** @type {any} */ x) => s + x, 0) / a.length : 0;

(async () => {
  const W = process.argv[2];
  if (!W) { console.log("Aufruf: node tools/probe_lernfluss.js <arbeitskopie> [sitzungen] [fragen] [--antworten q]"); process.exit(2); }
  const SITZUNGEN = parseInt(process.argv[3] || "20", 10);
  const FRAGEN    = parseInt(process.argv[4] || "50", 10);
  const iA = process.argv.indexOf("--antworten");
  const QUOTE = iA >= 0 ? parseFloat(process.argv[iA + 1]) : null;
  const MESSE_GEWICHTE = process.argv.indexOf("--gewichte") >= 0;

  const dom = await JSDOM.fromFile(W + "/app.html", {
    runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
    url: "file://" + W + "/app.html",
    beforeParse(/** @type {any} */ w) {
      w.confirm = () => true; w.alert = () => {};
      Object.defineProperty(w, "localStorage", { configurable: true, value: {
        getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, key: () => null, length: 0 } });
    }
  });
  const w = dom.window, D = w.document;
  const bereit = () => typeof w.render === "function" && Array.isArray(w.POOL) && w.POOL.length > 0 && !!D.getElementById("main");
  const bis = Date.now() + 20000;
  while (!bereit() && Date.now() < bis) await sleep(5);
  await sleep(150);
  if (!bereit()) { console.log("ABBRUCH: App nicht bereit"); process.exit(3); }

  const sitzungen = [];
  /** @type {Record<string, any>} */ const erwartet = {}; let erwartetN = 0; const kandGroesse = [];

  /* ══════════ --gewichte: WELCHER FAKTOR DRUECKT EIN MODUL? (31.08.2026, Befund L1) ══════════
     ⛔ NUR MESSUNG. L.gewichteFrage wird UMHUELLT, nicht ersetzt - der Rueckgabewert ist
     unveraendert der der Originalfunktion. Protokolliert wird je Aufruf, welcher Faktor
     gegriffen hat.
     ⚠️ ANLASS: M08 wird halb so oft gezogen wie erwartet.
     ⛔⛔ KORRIGIERT 10.09.2026: HIER STAND "Relevanzgewichtung (THEMA_RELEVANZ ist leer) ...
     als Ursache ausgeschlossen". DAS WAR EINE DER DREI FALSCHMESSUNGEN DES 31.08. - genau
     die, die START_PROMPT Abschnitt 6 als "THEMA_RELEVANZ per require '0 Eintraege', in der
     App 80" fuehrt. Nachgemessen am 10.09.: `require("./logik.js").THEMA_RELEVANZ` hat 81
     Eintraege, `S.relevanzGewichtung` steht per Default auf TRUE (app_state.js), und ALLE
     ZWOELF M08-Themen stehen auf Relevanz 1 - halbes Gewicht gegenueber dem Default 2.
     ►► Damit ist "halb so oft gezogen" keine offene Frage mehr, sondern der Sollwert.
     ►► DIE LEHRE WAR NOTIERT, DER KOMMENTAR IM WERKZEUG NICHT: eine widerlegte Messung, die
        als Begruendung stehen bleibt, steuert jeden naechsten Leser an der Ursache vorbei.
     ►► Gegenprobe mit bekannter Antwort: `--ohne-relevanz` (Abschnitt 1). */
  /** @type {Record<string, any>} */ const gw = {};
  if (MESSE_GEWICHTE) {
    const origGw = w.L.gewichteFrage;
    w.L.gewichteFrage = function (/** @type {any} */ f, /** @type {any} */ ctx) {
      const r = origGw.call(this, f, ctx);
      const m = f && f.modul; if (!m) return r;
      const e = gw[m] = gw[m] || { n: 0, summe: 0, malus: 0, adaptiv: 0, floor: 0 };
      e.n++; e.summe += r;
      if (ctx && ctx.letzteThemen && ctx.letzteThemen.indexOf(f.thema) !== -1) e.malus++;
      if (ctx && ctx.adaptivAktiv && typeof ctx.themaStat === "function") {
        const st = ctx.themaStat(f);
        if (st && st.gesamt >= w.L.CONFIG.adaptivMinGesamt) e.adaptiv++;
      }
      if (r <= w.L.CONFIG.gewichtFloor) e.floor++;
      return r;
    };
  }
  /* ══════════ --ohne-relevanz: GEGENPROBE MIT BEKANNTER ANTWORT (10.09.2026) ══════════
     ⛔ NUR MESSUNG. Der Schalter setzt denselben Nutzer-Schalter, den die Einstellungen-Seite
     setzt (S.relevanzGewichtung); gespeichert wird in dieser Probe ohnehin nichts. */
  if (OHNE_RELEVANZ) w.S.relevanzGewichtung = false;

  for (let s = 1; s <= SITZUNGEN; s++) {
    w.Math.random = mulberry32(s);            // ⚠️ je Sitzung ein fester Seed
    /* Frische Sitzung: Deck, Historie und Zaehler zuruecksetzen. Das ist Messcode - es
       bildet den Zustand nach, mit dem ein neuer Lerner startet. */
    w.S.seen = {}; w.S.lastShown = []; w.S.uebenZaehler = 0; w.S.lastTyp = null;
    w.S.fehlerDeck = {}; w.S.statistik = {};
    /* ⚠️⚠️ HIER STAND BIS ZUM 08.09.2026 AUCH `w.S.themaLevel = {}` – OHNE SCHALTER.
       Folge: die Probe mass 20 unabhaengige ERSTSITZUNGEN und konnte Lernfortschritt
       gar nicht zeigen. Ihre Stufenverteilung (rund 80 % Stufe 1) war deshalb eine
       Aussage ueber die BAUART DER PROBE, nicht ueber die App – und sie stand direkt
       unter der Ueberschrift „FUEHRT SIE VOM LEICHTEN ZUM SCHWEREN?".
       ►► Mit `--kette` bleiben themaLevel und themaTrack ueber die Sitzungen stehen,
       wie beim echten Lerner (beides wird in app_state.js persistiert). OHNE den
       Schalter verhaelt sich die Probe unveraendert – gegengeprobt am 08.09. */
    if (!KETTE) { w.S.themaLevel = {}; w.S.themaTrack = {}; }
    w.gotoSeite("ueben"); await sleep(60);
    const qa = D.querySelector("#main #uebenqa") || D.querySelector("#main div");
    w.uebenVerlauf = []; w.uebenIdx = -1;

    const folge = [];
    for (let i = 0; i < FRAGEN; i++) {
      /* ⚠️⚠️ DER NENNER WIRD ZUM ZIEHUNGSZEITPUNKT GENOMMEN, NICHT AM ENDE.
         Beim Bauen habe ich zweimal den falschen Nenner benutzt: erst den ganzen Pool
         (M03 schien +17,9 Punkte ueberrepraesentiert), dann die Kandidatenmenge im
         Endzustand der letzten Sitzung (M08 schien -6,3 Punkte). Beides waren Artefakte:
         `kandidaten()` filtert ueber `aufStufeFiltern` auf die AKTUELLE Stufe, und die
         waechst waehrend der Sitzung mit. Erwartet wird deshalb je Ziehung neu. */
      const kIds = w.kandidaten();
      if (kIds.length) {
        /** @type {Record<string, any>} */ const kM = {};
        kIds.forEach(/** @param {any} id */ id => { const kf = w.frageById(id); if (kf) kM[kf.modul] = (kM[kf.modul] || 0) + 1; });
        Object.keys(kM).forEach(m => { erwartet[m] = (erwartet[m] || 0) + kM[m] / kIds.length; });
        erwartetN++;
        kandGroesse.push(kIds.length);
      }
      w.naechsteFrage(qa);
      const f = w.uebenVerlauf[w.uebenVerlauf.length - 1];
      if (!f) break;
      folge.push({ id: f.id, thema: f.thema, modul: f.modul, gebiet: f.gebiet,
                   typ: f.typ === "generator" ? "generator" : w.typVon(f),
                   stufe: f.schwierigkeit,
                   herkunft: f.hinweisSerie ? "serie" : f.hinweisFD ? "fehlerdeck"
                            : String(f.id).indexOf("GEN-") === 0 ? "generator" : "deck" });
      if (QUOTE !== null && typeof w.verbucheAntwort === "function" && String(f.id).indexOf("GEN-") !== 0) {
        try { w.verbucheAntwort(f, w.Math.random() < QUOTE, null); } catch (e) {}
      }
    }
    sitzungen.push(folge);
  }

  /* ══════════ AUSWERTUNG ══════════ */
  const alle = sitzungen.flat();
  const N = alle.length;
  console.log("=".repeat(78));
  console.log("LERNFLUSS-PROBE – " + SITZUNGEN + " Sitzungen à " + FRAGEN + " Fragen = " + N + " Ziehungen");
  console.log("Pool: " + w.POOL.length + " Fragen" + (QUOTE !== null ? "   |   simulierte Trefferquote: " + Math.round(QUOTE * 100) + " %" : "   |   ohne Antworten (reine Ziehung)"));
  console.log("=".repeat(78));

  /* 1) THEMENVERTEILUNG JE SITZUNG */
  const versch = sitzungen.map(f => new Set(f.map(x => x.thema)).size);
  const groesster = sitzungen.map(f => {
    /** @type {Record<string, any>} */ const t = {}; f.forEach(x => t[x.thema] = (t[x.thema] || 0) + 1);
    return Math.max.apply(null, Object.values(t));
  });
  const halbeAus = sitzungen.map(f => {
    /** @type {Record<string, any>} */ const t = {}; f.forEach(x => t[x.thema] = (t[x.thema] || 0) + 1);
    const v = Object.values(t).sort((a, b) => b - a); let s = 0, k = 0;
    while (s < f.length / 2) { s += v[k++]; }
    return k;
  });
  console.log("\n1) THEMENVERTEILUNG (je Sitzung)");
  console.log("   verschiedene Themen:      Mittel " + mittel(versch).toFixed(1) +
              "   Spanne " + Math.min.apply(null, versch) + "–" + Math.max.apply(null, versch));
  console.log("   groesstes Thema:          Mittel " + mittel(groesster).toFixed(1) + " Fragen" +
              "   Spanne " + Math.min.apply(null, groesster) + "–" + Math.max.apply(null, groesster));
  console.log("   halbe Sitzung stammt aus: Mittel " + mittel(halbeAus).toFixed(1) + " Themen");
  /* Erwartete gegen tatsaechliche Ziehungen. Der Erwartungswert ist die ueber ALLE
     Ziehungszeitpunkte gemittelte Modulverteilung der jeweiligen Kandidatenmenge. */
  /** @type {Record<string, any>} */ const modG = {}; alle.forEach(x => { if (x.herkunft !== "generator") modG[x.modul] = (modG[x.modul] || 0) + 1; });
  const nEcht = Object.values(modG).reduce((s, x) => s + x, 0);
  /** @type {Record<string, any>} */ const poolMod = {}; w.POOL.forEach(/** @param {any} f */ f => poolMod[f.modul] = (poolMod[f.modul] || 0) + 1);
  console.log("   Kandidatenmenge je Ziehung: Mittel " + mittel(kandGroesse).toFixed(0) +
              " von " + w.POOL.length + " Poolfragen   Spanne " +
              Math.min.apply(null, kandGroesse) + "–" + Math.max.apply(null, kandGroesse));
  console.log("   ⚠️ Verglichen wird gegen den ERWARTUNGSWERT: die je Ziehung gemittelte");
  console.log("      Modulverteilung der Kandidaten. Generatoren sind ausgenommen.");
  /* ⚠️⚠️ 10.09.2026: DIESE ZEILEN FEHLTEN, UND DIE SPALTE "Abweichung" LAS SICH DESHALB WIE
     EIN BEFUND. Der Erwartungswert zaehlt Kandidaten - gezogen wird ueber L.gewichteFrage,
     also MIT Relevanz (Faktor 1/2/3), Themenschwaeche und Interleaving-Malus. Ein Modul aus
     lauter Relevanz-1-Themen MUSS unter seinem Kandidatenanteil landen; das ist der Sollwert
     und kein Fehler. Wer die Spalte ohne diesen Satz liest, jagt einen Entscheid. */
  console.log("   ⛔ Der Erwartungswert enthaelt WEDER Relevanzgewichtung NOCH Adaptiv-Faktor");
  console.log("      noch Interleaving-Malus. Relevanzgewichtung in diesem Lauf: " +
              (w.S.relevanzGewichtung ? "AN (Default)" : "AUS (--ohne-relevanz)") +
              " · Gegenprobe: --ohne-relevanz");
  console.log("   Modul   gezogen   erwartet   im Pool   (Abweichung)");
  Object.keys(modG).sort().forEach(m => {
    const g = modG[m] / nEcht, e = (erwartet[m] || 0) / (erwartetN || 1);
    console.log("   " + m.padEnd(7) + proz(modG[m], nEcht).padStart(7) + "   " +
                ((Math.round(e * 1000) / 10).toFixed(1) + " %").padStart(8) + "   " +
                proz(poolMod[m] || 0, w.POOL.length).padStart(7) + "   " +
                ((g - e) * 100 >= 0 ? "+" : "") + ((g - e) * 100).toFixed(1) + " Punkte");
  });
  /* 2) TYPWIEDERHOLUNG */
  let direkt = 0, paare = 0, laengste = 1;
  sitzungen.forEach(f => {
    let lauf = 1;
    for (let i = 1; i < f.length; i++) {
      paare++;
      if (f[i].typ === f[i - 1].typ) { direkt++; lauf++; if (lauf > laengste) laengste = lauf; }
      else lauf = 1;
    }
  });
  console.log("\n2) DERSELBE FRAGETYP HINTEREINANDER");
  console.log("   direkte Wiederholungen:   " + direkt + " von " + paare + " Uebergaengen = " + proz(direkt, paare));
  console.log("   laengste Serie:           " + laengste + " Fragen desselben Typs");
  /** @type {Record<string, any>} */ const typG = {}; alle.forEach(x => typG[x.typ] = (typG[x.typ] || 0) + 1);
  console.log("   Typen: " + Object.keys(typG).sort((a, b) => typG[b] - typG[a])
              .map(t => t + " " + proz(typG[t], N)).join(" · "));

  /* 3) STUFENVERLAUF */
  const /** @type {any[]} */ erste = [], /** @type {any[]} */ letzte = [];
  sitzungen.forEach(f => {
    f.slice(0, 10).forEach(x => { if (x.stufe) erste.push(x.stufe); });
    f.slice(-10).forEach(x => { if (x.stufe) letzte.push(x.stufe); });
  });
  /* ⛔⛔ GENERATOREN AUS DEM NENNER – BEFUND 09.09.2026, UND ER TRAF DIE EIGENE MESSUNG
     VON EINER STUNDE VORHER. `genAlsFrage()` setzt `schwierigkeit: S.level`, und S.level bleibt
     im Automatik-Modus DAUERHAFT 1 (es wird nur im manuellen Modus geschrieben, app_seiten.js).
     Also zaehlten 26 % der Ziehungen unabhaengig vom Lernstand als "Stufe 1" – und sie koennen
     bauartbedingt NIE Stufe 3 oder 4 sein. Damit war jeder Stufenanteil am falschen Nenner
     gerechnet: bei 80 % Trefferquote las sich Stufe 4 als 12,2 % (1,4-fach), bezogen auf die
     POOL-Ziehungen sind es 16,5 % (1,9-fach).
     ✅ DIE URSACHE IST AM SELBEN TAG BEHOBEN (Nutzer-Entscheid): jede Generator-Art traegt jetzt
     eine feste `stufe` (L.GENERATOREN), das Tag beim Lerner stimmt. DIE TRENNUNG BLEIBT TROTZDEM
     RICHTIG – eine feste Stufe folgt dem Lernfortschritt nicht, und genau danach fragt dieser
     Abschnitt. Sie gehoert in die Sitzungs-Zeile darunter, nicht in den Nenner.
     ►► Die Modulverteilung nimmt Generatoren seit jeher aus ("Generatoren sind ausgenommen") –
     die Stufenverteilung tat es nicht. **Zwei Nenner in einem Bericht sind einer zu viel.**
     ⚠️ Beide Zahlen werden gedruckt: die Pool-Sicht ist die vergleichbare, die Sitzungs-Sicht
     sagt, was der Lerner tatsaechlich vor sich hat. */
  const poolZieh = alle.filter(x => String(x.id).indexOf("GEN-") !== 0);
  /** @type {Record<string, any>} */ const stG = {}; poolZieh.forEach(x => { if (x.stufe) stG[x.stufe] = (stG[x.stufe] || 0) + 1; });
  console.log("\n3) STUFENLOGIK – FUEHRT SIE VOM LEICHTEN ZUM SCHWEREN?");
  console.log("   Verteilung (nur POOL-Ziehungen, " + poolZieh.length + " von " + N + "):");
  console.log("   " + Object.keys(stG).sort()
              .map(s => "Stufe " + s + " " + proz(stG[s], poolZieh.length)).join(" · "));
  console.log("   ⚠️ Generatoren tragen schwierigkeit = S.level (im Auto-Modus dauerhaft 1) und");
  console.log("      sind deshalb ausgenommen – sonst zaehlt jede vierte Ziehung als Stufe 1.");
  console.log("   Anteil an der ganzen Sitzung: " + Object.keys(stG).sort()
              .map(s => "Stufe " + s + " " + proz(stG[s], N)).join(" · ") +
              " · Generator " + proz(N - poolZieh.length, N));
  console.log("   ⚠️ die naechsten zwei Zeilen messen INNERHALB einer Sitzung, nicht ueber Wochen:");
  console.log("   mittlere Stufe erste 10:  " + mittel(erste).toFixed(2));
  console.log("   mittlere Stufe letzte 10: " + mittel(letzte).toFixed(2) +
              "   (Differenz " + (mittel(letzte) - mittel(erste) >= 0 ? "+" : "") +
              (mittel(letzte) - mittel(erste)).toFixed(2) + ")");

  /* ⚠️⚠️ NEU 10.09.2026 – WAS DIE ZWEI ZEILEN DARUEBER NICHT MESSEN KOENNEN.
     "erste 10 / letzte 10" mittelt INNERHALB einer Sitzung ueber alle Sitzungen hinweg. Mit
     --kette startet Sitzung 30 auf dem Stand von Sitzung 29 - der Anstieg liegt dann ZWISCHEN
     den Sitzungen und faellt aus dem Fenster. Gemessen am 10.09. (60 Sitzungen, 80 %):
     erste 10 = 2,80, letzte 10 = 2,81, Differenz +0,01 - und genau das las sich wie
     "die Stufung steigt nicht", waehrend die Zeile darunter den Anstieg zeigt.
     ►► DIE UEBERSCHRIFT FRAGT NACH DEM WEG DES LERNERS, DIE ZWEI ZEILEN ANTWORTEN FUER EINE
     SITZUNG. Dieselbe Klasse wie B147 (die Probe war blind fuer ihre eigene Ueberschrift) und
     wie "0 Wiederholungen galt der SITZUNG, nicht den Wochen".
     ⚠️ Generatoren sind auch hier ausgenommen (schwierigkeit = S.level, im Auto-Modus 1). */
  const jeSitzung = sitzungen.map(f => {
    const st = f.filter(x => x.herkunft !== "generator" && x.stufe).map(x => x.stufe);
    return st.length ? mittel(st) : null;
  });
  const marken = [1, Math.ceil(SITZUNGEN / 4), Math.ceil(SITZUNGEN / 2),
                  Math.ceil(SITZUNGEN * 3 / 4), SITZUNGEN]
                 .filter((v, i, a) => v >= 1 && v <= SITZUNGEN && a.indexOf(v) === i);
  console.log("   mittlere Stufe JE SITZUNG (das ist der Lernweg" +
              (KETTE ? "" : " – OHNE --kette startet jede Sitzung neu, hier also flach") + "):");
  console.log("   " + marken.map(n => "Sitzung " + n + ": " +
              (jeSitzung[n - 1] === null ? "–" : /** @type {number} */ (jeSitzung[n - 1]).toFixed(2))).join("  ·  "));
  /* Der Zaehler hinter der Kennzahl: wie weit sind die THEMEN gekommen? Ohne diese Zeile
     bleibt offen, ob eine flache Stufe am Lerner oder am Pool-Vorrat liegt. */
  const lv = w.S.themaLevel || {};
  /** @type {Record<string, any>} */ const lvG = {};
  Object.keys(lv).forEach(k => {
    const st = w.L.themaStufe(lv, k, w.S.level); lvG[st] = (lvG[st] || 0) + 1;
  });
  console.log("   erreichte Themenstufen am Ende: " + (Object.keys(lvG).length
              ? Object.keys(lvG).sort().map(s => "Stufe " + s + ": " + lvG[s] + " Themen").join(" · ")
              : "keine – ohne --antworten bewegt sich S.themaLevel nicht"));

  /* 4b) WIEDERSEHEN UEBER DIE GANZE MESSUNG – NEU 09.09.2026.
     ⚠️⚠️ WARUM DAS FEHLTE: Abschnitt 4 zaehlt Wiederholungen NUR INNERHALB einer Sitzung, und
     dort sind es seit jeher 0. Daraus wurde gelesen "der Lerner sieht keine Frage doppelt" –
     die Messung galt aber nur fuer das Gemessene. **Der Lerner uebt ueber Wochen**, und genau
     dort schlaegt ein duenner Stufen-Vorrat durch: 97 Stufe-4-Fragen tragen, wer alle Themen
     hochgestuft hat. Diese Zeile misst, was Abschnitt 4 nicht sehen kann.
     ⚠️ Generatoren sind ausgenommen – sie sind je Ziehung neu und koennen sich nicht wiederholen. */
  /** @type {Record<string, any>} */ const gesehen = {};
  alle.forEach(x => { if (String(x.id).indexOf("GEN-") !== 0) {
    (gesehen[x.stufe] = gesehen[x.stufe] || {})[x.id] = (gesehen[x.stufe][x.id] || 0) + 1; } });
  console.log("\n4b) WIEDERSEHEN UEBER ALLE " + SITZUNGEN + " SITZUNGEN (Pool-Fragen, je Stufe)");
  console.log("   Stufe  versch. Fragen  Ziehungen  im Mittel je Frage  Spitzenreiter");
  Object.keys(gesehen).sort().forEach(st => {
    const m = gesehen[st], ids = Object.keys(m);
    const zieh = ids.reduce((a, id) => a + m[id], 0);
    const max = ids.reduce((a, id) => m[id] > m[a] ? id : a, ids[0]);
    const imPool = w.POOL.filter(/** @param {any} f */ f => f.schwierigkeit === +st).length;
    console.log("     " + st + "    " + String(ids.length).padStart(5) + " von " +
      String(imPool).padStart(4) + "  " + String(zieh).padStart(7) + "   " +
      (zieh / ids.length).toFixed(1).padStart(6) + "x           " +
      max + " (" + m[max] + "x)");
  });

  /* 4) WIEDERSEHEN */
  let wieder = 0; const /** @type {any[]} */ abstaende = [];
  sitzungen.forEach(f => {
    /** @type {Record<string, any>} */ const zuletzt = {};
    f.forEach((x, i) => {
      if (String(x.id).indexOf("GEN-") === 0) return;      // Generatoren sind je Ziehung neu
      if (zuletzt[x.id] !== undefined) { wieder++; abstaende.push(i - zuletzt[x.id]); }
      zuletzt[x.id] = i;
    });
  });
  console.log("\n4) WIEDERSEHEN EINER FRAGE INNERHALB DER SITZUNG");
  console.log("   Wiederholungen:           " + wieder + " in " + N + " Ziehungen = " + proz(wieder, N));
  console.log("   Abstand bis zum Wiedersehen: " + (abstaende.length
        ? "Mittel " + mittel(abstaende).toFixed(1) + " Fragen, kuerzester " + Math.min.apply(null, abstaende)
        : "– (keine Wiederholung)"));

  /* 6) WARUM WEICHT EIN MODUL AB? – Typkonzentration in der Kandidatenmenge.
     ⚠️ `kandidatenMitTypWechsel()` entfernt vor JEDER Ziehung alle Fragen des zuletzt
     gezeigten Typs. Ein Modul, dessen Kandidaten stark auf einen Typ konzentriert sind,
     faellt dadurch systematisch oefter aus der Auswahl. Diese Tabelle macht das pruefbar.
     ⛔ Gemessen wird ueber die ECHTE w.kandidaten() – ein Nachbau des Filters lieferte beim
     Bauen 139 statt 169 Kandidaten und fuer M08 faelschlich null. */
  console.log("\n6) TYPKONZENTRATION DER KANDIDATEN (erklaert Modul-Abweichungen)");
  /** @type {Record<string, any>} */ const kandTyp = {};
  w.kandidaten().forEach(/** @param {any} id */ id => {
    const f = w.frageById(id); if (!f) return;
    const m = f.modul, t = w.typVon(f);
    (kandTyp[m] = kandTyp[m] || {})[t] = (kandTyp[m][t] || 0) + 1;
  });
  console.log("   (Momentaufnahme am Ende der letzten Sitzung)");
  console.log("   Modul   Kand.   haeufigster Typ        Anteil");
  Object.keys(kandTyp).sort().forEach(m => {
    const t = kandTyp[m], n = Object.values(t).reduce((s, x) => s + x, 0);
    const top = Object.keys(t).sort((a, b) => t[b] - t[a])[0];
    console.log("   " + m.padEnd(7) + String(n).padStart(4) + "    " + top.padEnd(22) + proz(t[top], n).padStart(7));
  });

  /* 7) FEHLER-DECK AM SITZUNGSENDE */
  const deck = w.S.fehlerDeck || {};
  const faellig = (typeof w.L.fdDue === "function") ? w.L.fdDue(deck, Date.now()).length : 0;
  console.log("\n7) FEHLER-DECK AM ENDE DER LETZTEN SITZUNG");
  console.log("   Karten im Deck: " + Object.keys(deck).length + "   davon HEUTE faellig: " + faellig);
  console.log("   ⚠️ Dass hier 0 faellig sind, ist ABSICHT und dokumentiert: L.fdOnWrong setzt");
  console.log("      due = jetzt + fdTageFehler (1 Tag). tests/test_logik.js haelt das mit");
  console.log("      'FD: nicht sofort faellig' fest. Die Einstreuung '1 von 5' wirkt");
  console.log("      deshalb NIE innerhalb einer Sitzung, sondern erst am Folgetag.");

  /* 8) GEWICHTSFAKTOREN JE MODUL (nur mit --gewichte) */
  if (MESSE_GEWICHTE && Object.keys(gw).length) {
    console.log("\n8) WARUM WIRD EIN MODUL SELTENER GEZOGEN? – gewichteFrage instrumentiert");
    console.log("   Modul   Aufrufe   mittl. Gewicht   Interleaving-Malus   Adaptiv aktiv   auf Floor");
    Object.keys(gw).sort().forEach(m => {
      const e = gw[m];
      console.log("   " + m.padEnd(7) + String(e.n).padStart(7) + "   " +
                  (e.summe / e.n).toFixed(3).padStart(13) + "   " +
                  proz(e.malus, e.n).padStart(18) + "   " +
                  proz(e.adaptiv, e.n).padStart(13) + "   " + proz(e.floor, e.n).padStart(9));
    });
    console.log("   (interleavingMalus=" + w.L.CONFIG.interleavingMalus +
                ", gewichtFloor=" + w.L.CONFIG.gewichtFloor +
                ", adaptivMinGesamt=" + w.L.CONFIG.adaptivMinGesamt + ")");
  }

  /* 5) HERKUNFT */
  /** @type {Record<string, any>} */ const hG = {}; alle.forEach(x => hG[x.herkunft] = (hG[x.herkunft] || 0) + 1);
  console.log("\n5) WOHER DIE FRAGE KAM");
  Object.keys(hG).sort((a, b) => hG[b] - hG[a]).forEach(h =>
    console.log("   " + h.padEnd(12) + String(hG[h]).padStart(5) + "   " + proz(hG[h], N)));
  console.log("   (Sollwerte aus APP_CONFIG: Fehler-Deck 1 von " + w.APP_CONFIG.fdEinstreuung +
              ", Generator 1 von " + w.APP_CONFIG.generatorEinstreuung + ")");
  console.log("\n" + "=".repeat(78));
  console.log("⛔ NUR GEMESSEN. Keine Aenderung an der Ziehungslogik (Nutzer-Entscheid 10).");
  process.exit(0);
})();
