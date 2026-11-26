/* Test: Tippfehler-Toleranz (2026-08-04, Nutzer-Entscheid nach Messung aller getippten Typen).

   ⚠️⚠️ DER PUNKT DIESER SUITE IST NICHT „Toleranz wirkt", SONDERN „Toleranz wirkt GENAU DORT".
   Eine Toleranz ist ein einseitiger Wächter im Sinne von TASKLIST 0b: Wer sie grün bekommen
   will, macht sie weit – und tilgt damit genau die Unterscheidungen, die der Pool prüft.
   Deshalb steht in jedem Abschnitt die Gegenrichtung daneben:

     lueckentext        Toleranz AN  (gemessen: 0 echte Verwechslungspaare)
     freitext/erklaeren Toleranz AN, aber SELBSTABSCHALTEND je Frage
     dropdown-Freitext  Toleranz AUS (9 Paare ab 6 Zeichen, u. a. ISO 9001/ISO 9000)
     trace              Toleranz AUS (Stufe 1 / Stufe 2 / Stufe 3)
     konsole            Toleranz AUS (ein Befehl laeuft oder laeuft nicht)
     rechenassistent    Toleranz AUS (Zahlen; numerische Schritte haben eigene Toleranz)

   Die Messung, auf der die Grenze 6 beruht, steht im BUILD_LOG-Eintrag vom 04.08.2026. */
"use strict";
const H = require("./_harness.js");

(async () => {
  const w = await H.boot();
  const L = w.L;

  /* ---- 1. Die Distanzfunktion selbst ---- */
  H.t("distanzEins: Fehler am Wortanfang", L.distanzEins("aufgabenanalyse", "ufgabenanalyse"));
  H.t("distanzEins: Fehler in der Mitte", L.distanzEins("beschaffung", "beschafung"));
  H.t("distanzEins: Fehler am Wortende", L.distanzEins("netzplan", "netzplaz"));
  H.t("distanzEins: eingefuegtes Zeichen", L.distanzEins("prokura", "prokurra"));
  H.t("distanzEins: gleiche Woerter sind NICHT Distanz 1", !L.distanzEins("prokura", "prokura"));
  H.t("distanzEins: zwei Fehler werden abgelehnt", !L.distanzEins("beschaffung", "beschafug"));
  H.t("distanzEins: Laengenunterschied 2 wird abgelehnt", !L.distanzEins("prokura", "prokuraaa"));
  H.t("distanzEins: voellig verschieden", !L.distanzEins("beschaffung", "produktion"));

  /* ---- 2. lueckentext: Toleranz AN ---- */
  const lue = { typ: "lueckentext", luecken: [["Aufgabenanalyse"], ["Aufgabensynthese"]] };
  H.t("lueckentext: exakte Antwort bleibt richtig",
    L.gradeLueckentext(lue, ["Aufgabenanalyse", "Aufgabensynthese"]));
  H.t("lueckentext: ein Tippfehler wird akzeptiert (der gemeldete Fall)",
    L.gradeLueckentext(lue, ["ufgabenanalyse", "Aufgabensynthese"]));
  H.t("lueckentext: zwei Tippfehler werden NICHT akzeptiert",
    !L.gradeLueckentext(lue, ["ufgabenanalse", "Aufgabensynthese"]));
  H.t("lueckentext: eine voellig andere Antwort bleibt falsch",
    !L.gradeLueckentext(lue, ["Ablauforganisation", "Aufgabensynthese"]));

  /* ---- 3. Die Grenzen der Toleranz: kurz und mit Ziffern ---- */
  H.t("Mindestlaenge ist 6 (Konstante, nicht danebengeschrieben)", L.TIPP_MINLAENGE === 6);
  const kurz = { typ: "lueckentext", luecken: [["Puffer"]] };
  H.t("genau 6 Zeichen: Toleranz greift", L.gradeLueckentext(kurz, ["Puffor"]));
  const zuKurz = { typ: "lueckentext", luecken: [["SEZ"]] };
  H.t("unter 6 Zeichen: KEINE Toleranz (SEZ/SAZ bleiben unterscheidbar)",
    !L.gradeLueckentext(zuKurz, ["SAZ"]));
  const zahl = { typ: "lueckentext", luecken: [["1.200,50"]] };
  H.t("mit Ziffern: KEINE Toleranz", !L.gradeLueckentext(zahl, ["1.300,50"]));
  H.t("mit Ziffern: exakt bleibt richtig", L.gradeLueckentext(zahl, ["1.200,50"]));

  /* ---- 4. Die anderen getippten Typen: Toleranz bleibt AUS ----
     GEGENPROBE-CHARAKTER: Faellt einer dieser Tests, ist die Toleranz aus gradeLuecke heraus
     durchgesickert – der wahrscheinlichste Fehler bei einer spaeteren Vereinfachung. */
  H.t("gradeLuecke selbst ist weiterhin EXAKT (Basis fuer trace/dropdown/rechenassistent)",
    !L.gradeLuecke(["Wartung"], "Warnung") && L.gradeLuecke(["Wartung"], "wartung"));
  const tr = { typ: "trace", zeilen: [["Stufe 1", "Stufe 2"]] };
  H.t("trace: exakte Eingabe richtig", L.gradeTrace(tr, [["Stufe 1", "Stufe 2"]]));
  H.t("trace: KEINE Toleranz (Stufe 1 / Stufe 2 bleiben getrennt)",
    !L.gradeTrace(tr, [["Stufe 2", "Stufe 2"]]));
  const dd = { typ: "dropdown", luecken: [{ optionen: ["ISO 9000", "ISO 9001"], loesung: 1 }] };
  H.t("dropdown-Freitext: exakte Eingabe richtig", L.gradeDropdownText(dd, ["ISO 9001"]));
  H.t("dropdown-Freitext: KEINE Toleranz (ISO 9000 bleibt falsch)",
    !L.gradeDropdownText(dd, ["ISO 9000"]));
  const kon = { typ: "konsole", aufgaben: [{ akzeptiert: ["ipconfig /all"] }] };
  H.t("konsole: exakter Befehl richtig", L.gradeKonsole(kon, ["ipconfig /all"]));
  H.t("konsole: KEINE Toleranz (ifconfig ist ein anderer Befehl)",
    !L.gradeKonsole(kon, ["ifconfig /all"]));

  /* ---- 5. Freitext: Toleranz AN, aber selbstabschaltend ---- */
  const frei = {
    typ: "freitext", id: "PROBE-01",
    schluesselbegriffe: { pflicht: [["Aufgabenanalyse"], ["Wertschoepfung"]], kuer: [] }
  };
  const stufe = (antwort, f) => w.gradeTeilpunkte(antwort, f).pflichtTreffer;
  H.t("freitext: exakte Begriffe werden gefunden",
    stufe("Die Aufgabenanalyse zerlegt, die Wertschoepfung entsteht dabei.", frei) === 2);
  H.t("freitext: Tippfehler am Wortanfang wird jetzt akzeptiert",
    stufe("Die ufgabenanalyse zerlegt, die Wertschoepfung entsteht dabei.", frei) === 2);
  H.t("freitext: zwei Tippfehler bleiben ein Fehlschlag",
    stufe("Die ufgabenanalse zerlegt, die Wertschoepfung entsteht dabei.", frei) === 1);
  H.t("freitext: die vorhandene Wortende-Toleranz (Stem) wirkt weiter",
    stufe("Die Aufgabenanalysen zerlegen, die Wertschoepfung entsteht.", frei) === 2);

  /* ---- 5b. DIE SELBSTABSCHALTUNG – der eigentliche Grund fuer diese Suite ----
     M04-015 fuehrt `ipconfig` UND `ifconfig` als Begriffe derselben Frage. Genau hier darf die
     Toleranz NICHT greifen, sonst tilgt sie die geprueften Unterscheidung. */
  const nachbarn = {
    typ: "freitext", id: "PROBE-02",
    schluesselbegriffe: { pflicht: [["ipconfig"], ["ifconfig"]], kuer: [] }
  };
  const rIp = w.gradeTeilpunkte("Unter Windows nutzt man ipconfig.", nachbarn);
  H.t("Selbstabschaltung: ipconfig trifft, ifconfig NICHT (beide in derselben Frage)",
    rIp.pflichtTreffer === 1 && rIp.gefunden.indexOf("ipconfig") >= 0);
  const rOhne = w.gradeTeilpunkte("Unter Linux nutzt man ifconfig.", nachbarn);
  H.t("Selbstabschaltung: Gegenrichtung ebenso", rOhne.pflichtTreffer === 1 &&
    rOhne.gefunden.indexOf("ifconfig") >= 0);
  /* GEGENPROBE ZUR SELBSTABSCHALTUNG: Steht derselbe Begriff OHNE Nachbarn in der Frage,
     MUSS die Toleranz greifen – sonst waere die Regel nicht selbstabschaltend, sondern schlicht
     aus, und die Tests darueber waeren wertlos. */
  const alleine = {
    typ: "freitext", id: "PROBE-03",
    schluesselbegriffe: { pflicht: [["ipconfig"]], kuer: [] }
  };
  /* ⚠️ DER TIPPFEHLER MUSS IN DEN ERSTEN FUENF ZEICHEN LIEGEN. Der erste Entwurf nahm
     „ipconfog" – den akzeptiert schon die VORHANDENE Stem-Regel (Stamm „ipcon"), der Test waere
     also auch ohne die neue Toleranz gruen gewesen. „iconfig" (fehlendes p an Position 2) ist von
     „ipconfig" wie von „ifconfig" genau eine Ersetzung entfernt und vom Stem nicht gedeckt. */
  H.t("GEGENPROBE: ohne Nachbarn greift die Toleranz bei demselben Begriff",
    w.gradeTeilpunkte("Man nutzt dafuer iconfig.", alleine).pflichtTreffer === 1);
  H.t("GEGENPROBE: mit Nachbarn greift sie beim GLEICHEN Tippfehler nicht",
    w.gradeTeilpunkte("Man nutzt dafuer iconfig.", nachbarn).pflichtTreffer === 0);
  H.t("GEGENPROBE zur Gegenprobe: die alte Stem-Regel deckt diesen Fehler NICHT",
    w.gradeTeilpunkte("Man nutzt dafuer iconfig.", nachbarn).pflichtTreffer === 0 &&
    w.gradeTeilpunkte("Man nutzt dafuer ipconfog.", nachbarn).pflichtTreffer === 1);

  /* ---- 5c. Ziffern und Kurzbegriffe im Freitext ---- */
  const zahlen = {
    typ: "freitext", id: "PROBE-04",
    schluesselbegriffe: { pflicht: [["2.400 EUR"]], kuer: [] }
  };
  H.t("freitext: Betraege bekommen keine Toleranz",
    w.gradeTeilpunkte("Der Betrag liegt bei 2.300 EUR.", zahlen).pflichtTreffer === 0);

  /* ---- 6. Der Bestand bleibt bewertbar: keine Frage wird durch die Toleranz mehrdeutig ----
     Poolweite Kontrolle statt Stichprobe – die Regel ist datenabhaengig, also wird sie gegen
     die Daten geprueft, nicht gegen ein Beispiel. */
  const mitBegriffen = w.POOL.filter(f => f.schluesselbegriffe &&
    Array.isArray(f.schluesselbegriffe.pflicht));
  H.t("Es gibt ueberhaupt Fragen mit Schluesselbegriffen", mitBegriffen.length > 50);
  let stillFalsch = 0;
  mitBegriffen.forEach(f => {
    const r = w.gradeTeilpunkte(f.musterloesung || "", f);
    if (f.musterloesung && r.pflichtTreffer < r.pflichtGesamt) stillFalsch++;
  });
  H.t("Jede Musterloesung trifft weiterhin alle eigenen Pflichtbegriffe (ist " +
    stillFalsch + " Ausfaelle)", stillFalsch === 0);

  process.exit(H.report());
})();
