/* Test: FB-R2b.1 – Wissenschaftlicher Taschenrechner mit Notizfeld (2026-07-21).
   Zwei Teile:
     A) rechnerAuswerten() als reiner Parser – Vorrang, Klammern, Rechtsassoziativitaet,
        Prozent, Dezimalkomma, Anzeige-Zeichen, und ALLE Fehlerfaelle (die Funktion darf
        NIE werfen, sie liefert immer {ok:false, fehler:"..."}).
     B) das Panel im DOM – erscheint bei den drei Rechen-Typen, NICHT bei den anderen und
        NICHT in Simulation/Klausur, startet zugeklappt, Tasten und Notizfeld sind da.

   GRUNDSATZ (Lehre aus FB-R1/R2a, dort dreimal teuer bezahlt): jeder neue Test hat seine
   GEGENPROBE im selben Lauf – einen Fall, der ohne die neue Logik anders ausgehen MUSS.
   Ein Test, der beide Richtungen nicht unterscheidet, bleibt still immer gruen. */
const H = require("./_harness.js");
const fs = require("fs");
const path = require("path");

(async () => {
  const css = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
  const utilSrc = fs.readFileSync(path.join(__dirname, "app_util.js"), "utf8");
  const w = await H.boot();
  const doc = w.document;
  const R = w.rechnerAuswerten;

  /* ================= A) Parser ================= */
  H.t("rechnerAuswerten ist global verfuegbar", typeof R === "function");

  function wert(name, ausdruck, soll) {
    const r = R(ausdruck);
    H.t(name + " – Auswertung gelingt (" + ausdruck + ")", r.ok === true);
    if (r.ok) H.close(name + " (" + ausdruck + ")", r.wert, soll, 1e-9);
  }
  function fehlerFall(name, ausdruck) {
    let r;
    try { r = R(ausdruck); }
    catch (e) { H.t(name + " – wirft NICHT (" + ausdruck + ")", false); return; }
    H.t(name + " – liefert ok:false (" + ausdruck + ")", r && r.ok === false);
    H.t(name + " – hat einen Klartext-Fehler", !!(r && typeof r.fehler === "string" && r.fehler.length > 3));
  }

  wert("Punkt vor Strich", "2+3*4", 14);
  wert("Klammern brechen den Vorrang", "(2+3)*4", 20);
  wert("Verschachtelte Klammern", "((2+3)*(4-1))/5", 3);
  wert("Unaeres Minus", "-5+8", 3);
  wert("Unaeres Minus bindet lockerer als die Potenz", "-2^2", -4);
  wert("Potenz ist rechtsassoziativ", "2^3^2", 512);
  wert("Vorzeichen im Exponenten", "2^-2", 0.25);
  wert("Wurzel", "sqrt(16)", 4);
  wert("Prozent als Postfix", "200*19%", 38);
  wert("Prozent allein", "19%", 0.19);
  wert("Dezimalkomma", "1,5*2", 3);
  wert("Dezimalpunkt", "1.5*2", 3);
  wert("Konstante pi", "pi", Math.PI);
  wert("Logarithmus zur Basis 10", "log(1000)", 3);
  wert("Natuerlicher Logarithmus", "ln(1)", 0);
  /* Gradmass, nicht Bogenmass – bewusste Entscheidung fuer Pruefungsaufgaben. */
  H.close("sin rechnet im Gradmass (sin(90)=1)", R("sin(90)").wert, 1, 1e-9);
  H.close("cos rechnet im Gradmass (cos(180)=-1)", R("cos(180)").wert, -1, 1e-9);
  /* Die Tasten schreiben huebsche Anzeige-Zeichen ins Feld – der Parser muss sie kennen. */
  wert("Anzeige-Zeichen × und ÷", "6×4÷3", 8);
  wert("Anzeige-Zeichen − (Minuszeichen, kein Bindestrich)", "10−4", 6);
  wert("Anzeige-Zeichen √", "√(81)", 9);

  fehlerFall("Division durch null", "5/0");
  fehlerFall("Division durch berechnete Null", "5/(3-3)");
  fehlerFall("Unbalancierte Klammer auf", "(2+3");
  fehlerFall("Unbalancierte Klammer zu", "2+3)");
  fehlerFall("Leere Eingabe", "");
  fehlerFall("Nur Leerzeichen", "   ");
  fehlerFall("Unbekanntes Zeichen", "2+x");
  fehlerFall("Unbekannter Funktionsname", "wurzel(9)");
  fehlerFall("Wurzel aus negativer Zahl", "sqrt(-1)");
  fehlerFall("Logarithmus von null", "ln(0)");
  fehlerFall("Logarithmus von negativer Zahl", "log(-5)");
  fehlerFall("Unvollstaendiger Ausdruck", "2+");
  fehlerFall("Funktion ohne Klammer", "sqrt 9");
  fehlerFall("null als Eingabe", null);

  /* GEGENPROBE zum Parser: die Fehlerpruefung darf nicht einfach ALLES ablehnen –
     sonst waeren die 14 Faelle oben wertlos. Ein gueltiger Nachbarausdruck muss durchgehen. */
  H.t("Gegenprobe: 5/0.5 gelingt trotz aehnlicher Form", R("5/0.5").ok === true);
  H.t("Gegenprobe: sqrt(1) gelingt trotz aehnlicher Form", R("sqrt(1)").ok === true);

  /* Sicherheits-Invariante: der Rechner darf Nutzereingaben NIE als Code ausfuehren.
     Der Beleg wird am Quelltext gefuehrt, nicht am Verhalten – ein eval() koennte im
     Normalbetrieb voellig unauffaellig aussehen. */
  const rechnerBlock = utilSrc.slice(utilSrc.indexOf("var rechnerAuswerten, rechnerPanel;"));
  H.t("Rechner-Code enthaelt kein eval(", !/\beval\s*\(/.test(rechnerBlock));
  H.t("Rechner-Code enthaelt kein new Function(", !/new\s+Function\s*\(/.test(rechnerBlock));
  H.t("Gegenprobe: der gepruefte Block ist nicht leer", rechnerBlock.length > 2000);

  /* ================= B) Panel im DOM ================= */
  function rendere(f, opts) {
    const host = doc.createElement("div");
    doc.body.appendChild(host);
    w.loeseFrage(w.L.instanziiere(f), host,
      Object.assign({ simulation: false, onGraded: function () {}, onNext: function () {} }, opts || {}));
    return host;
  }
  const genFrage = w.L.GENERATOREN.uebertragung.fn();
  const raFrage = w.POOL.filter(f => f.typ === "rechenassistent")[0];
  const kaFrage = w.POOL.filter(f => f.typ === "kalkulation")[0];
  const mcFrage = w.POOL.filter(f => f.typ === "mc")[0];
  H.t("Testfragen fuer alle vier Typen gefunden", !!genFrage && !!raFrage && !!kaFrage && !!mcFrage);

  const hostGen = rendere(genFrage);
  const hostRA = rendere(raFrage);
  const hostKa = rendere(kaFrage);
  const hostMC = rendere(mcFrage);
  H.t("Rechner erscheint beim Typ generator", !!hostGen.querySelector(".rechner-wrap"));
  H.t("Rechner erscheint beim Typ rechenassistent", !!hostRA.querySelector(".rechner-wrap"));
  H.t("Rechner erscheint beim Typ kalkulation", !!hostKa.querySelector(".rechner-wrap"));
  /* GEGENPROBE: „nur bei den Rechen-Typen" ist der Nutzer-Entscheid – ohne diesen Test
     waere ein global eingehaengter Rechner genauso gruen. */
  H.t("Gegenprobe: KEIN Rechner beim Typ mc", !hostMC.querySelector(".rechner-wrap"));
  H.t("Gegenprobe: KEIN Rechner in der Simulation",
    !rendere(raFrage, { simulation: true }).querySelector(".rechner-wrap"));
  H.t("Gegenprobe: KEIN Rechner in der M09-Klausur",
    !rendere(kaFrage, { klausur: true }).querySelector(".rechner-wrap"));

  const panel = hostRA.querySelector("details.stat-panel");
  H.t("Rechner haengt in einem statPanel", !!panel);
  H.t("Rechner-Panel startet ZUGEKLAPPT", !!panel && panel.open === false);
  H.t("Panel traegt eine Kopfzeile mit Titel",
    !!panel && /Taschenrechner/.test(panel.querySelector("summary").textContent));

  const tasten = hostRA.querySelectorAll(".rechner-taste");
  H.t("Tastenblock vorhanden (mind. 25 Tasten, ist " + tasten.length + ")", tasten.length >= 25);
  H.t("Alle Tasten sind echte button-Elemente vom Typ button",
    Array.prototype.every.call(tasten, b => b.tagName === "BUTTON" && b.getAttribute("type") === "button"));
  H.t("Alle Tasten tragen zusaetzlich .b.leise (haengt an der 44px-Regel)",
    Array.prototype.every.call(tasten, b => b.classList.contains("b") && b.classList.contains("leise")));
  const labels = Array.prototype.map.call(tasten, b => b.textContent);
  ["0", "9", ",", "+", "−", "×", "÷", "(", ")", "^", "%", "√", "C", "←", "=", "M+", "MR", "MC"]
    .forEach(l => H.t("Taste vorhanden: " + l, labels.indexOf(l) >= 0));

  /* WAECHTER gegen einen Rueckfall, der in dieser Sitzung schon einmal passiert ist:
     das Rechnerfeld trug zuerst die Klasse `luecke` – den Selektor der ANTWORTFELDER.
     test_diagnose zaehlt `input.luecke` gegen die Zahl der Rechenschritte und fiel sofort.
     Der Waechter steht hier, weil er DORT entsteht, wo der Fehler gemacht wird. */
  H.t("Rechnerfeld traegt NICHT die Antwortfeld-Klasse .luecke",
    !hostRA.querySelector("input.rechner-anzeige").classList.contains("luecke"));
  H.t("Antwortfelder des Rechenassistenten bleiben unverfaelscht zaehlbar",
    hostRA.querySelectorAll("input.luecke").length === w.L.instanziiere(raFrage).schritte.length);

  const notiz = hostRA.querySelector("textarea.rechner-notiz");
  H.t("Notizfeld vorhanden", !!notiz);
  H.t("Notizfeld steht UNTER dem Tastenblock (Nutzer-Entscheid)",
    !!notiz && !!hostRA.querySelector(".rechner-tasten") &&
    (hostRA.querySelector(".rechner-tasten").compareDocumentPosition(notiz) & 4) !== 0);
  const label = hostRA.querySelector("label.rechner-notiz-label");
  H.t("Notizfeld hat ein verknuepftes label", !!label && !!notiz && label.getAttribute("for") === notiz.id);
  /* Nutzer-Entscheid: das Notizfeld ist BEWUSST nicht persistent – es darf nichts in S landen. */
  notiz.value = "Nebenrechnung 12 * 4";
  H.t("Gegenprobe: Notizinhalt landet NICHT im gespeicherten Zustand",
    JSON.stringify(w.S).indexOf("Nebenrechnung") < 0);

  /* --- Bedienung: Tasten fuellen die Anzeige, = rechnet, C loescht --- */
  const anzeige = hostRA.querySelector("input.rechner-anzeige");
  const ergebnis = hostRA.querySelector(".rechner-ergebnis");
  H.t("Anzeigefeld und Ergebniszeile vorhanden", !!anzeige && !!ergebnis);
  function druecke(l) {
    const b = Array.prototype.filter.call(tasten, x => x.textContent === l)[0];
    b.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  }
  ["1", "2", "×", "4", "="].forEach(druecke);
  H.t("Tastenkette 12×4 ergibt 48 (ist \"" + ergebnis.textContent + "\")", ergebnis.textContent === "= 48");
  H.t("Ergebnis steht danach in der Anzeige (Weiterrechnen moeglich)", anzeige.value === "48");
  H.t("Ergebniszeile ist NICHT als Fehler markiert", !ergebnis.classList.contains("fehler"));
  druecke("C");
  H.t("C leert Anzeige und Ergebniszeile", anzeige.value === "" && ergebnis.textContent === "");
  /* Fehlerweg: die Meldung erscheint im Klartext und ist als Fehler markiert. */
  ["5", "÷", "0", "="].forEach(druecke);
  H.t("Division durch null meldet Klartext (ist \"" + ergebnis.textContent + "\")",
    /Division durch null/.test(ergebnis.textContent));
  H.t("Fehlermeldung ist als .fehler markiert", ergebnis.classList.contains("fehler"));
  /* GEGENPROBE: die Fehlermarkierung muss auch wieder VERSCHWINDEN, sonst bliebe die
     Zeile nach dem ersten Fehler dauerhaft rot. */
  druecke("C");
  ["8", "="].forEach(druecke);
  H.t("Gegenprobe: .fehler verschwindet bei gelungener Rechnung", !ergebnis.classList.contains("fehler"));

  /* --- Speicher M+/MR/MC --- */
  druecke("C"); ["7", "M+"].forEach(druecke);
  druecke("C"); druecke("MR");
  H.t("M+ speichert und MR ruft ab (ist \"" + anzeige.value + "\")", anzeige.value === "7");
  druecke("MC"); druecke("C"); druecke("MR");
  H.t("MC leert den Speicher", anzeige.value === "0");

  /* --- Mobile-Audit: die Tasten muessen im 44px-Block stehen --- */
  /* ⚠️ Der Ausschnitt muss AM BLOCKENDE aufhoeren. Erste Fassung schnitt bis zum Dateiende –
     damit fand die Suche die spaetere .rechner-taste-Regel und der Test war STILL IMMER GRUEN
     (die Gegenprobe „Klasse aus dem coarse-Block entfernt" biss nicht). Zum vierten Mal in
     dieser Sitzungsreihe dieselbe Sorte Fehler: erst die Gegenprobe hat ihn gezeigt. */
  const coarseStart = css.indexOf("@media (pointer:coarse){", css.indexOf("F3 Mobil-Feinschliff"));
  /* Kommentare RAUS, bevor gesucht wird. Zweiter Anlauf derselben Falle: der erklaerende
     Kommentar IM Block nennt .rechner-taste selbst – der Test hat also erst den Kommentar
     gemessen statt den Selektor und blieb auch dann gruen, als die Klasse aus der
     Selektorliste entfernt war. */
  const coarse = css.slice(coarseStart, css.indexOf("\n}", coarseStart)).replace(/\/\*[\s\S]*?\*\//g, "");
  H.t("Tasten stehen namentlich im pointer:coarse-44px-Block", /\.rechner-taste/.test(coarse));
  H.t("Der Block setzt dort min-width:44px", /min-width:44px/.test(coarse));
  /* GEGENPROBE: die Tasten duerfen KEINE Inline-Groesse tragen – ein inline style haette
     die Media-Query ausgehebelt (genau die Falle der Wisch-Leiste aus R1.7). */
  H.t("Gegenprobe: keine Taste traegt eine Inline-Groesse",
    Array.prototype.every.call(tasten, b => !/min-width|width|height/.test(b.getAttribute("style") || "")));

  /* --- Offline-Invariante --- */
  H.t("Rechner-Code laedt nichts aus dem Netz",
    !/https?:\/\//.test(rechnerBlock) && !/fetch\s*\(|XMLHttpRequest/.test(rechnerBlock));

  process.exit(H.report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
