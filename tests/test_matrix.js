/* Test (FB-R3 Punkt 5): Matrix-Aufgaben – Ableitbarkeit statt Vokabelabgleich.

   ANLASS (2026-07-22): Der Bestandsabgleich über alle 25 matrix-Fragen (106 Elemente) fand
   drei Befunde.
   1. **40 % der Elemente nannten die EINSTUFUNG wörtlich.** Bei den Achsen
      „Eintrittswahrscheinlichkeit" und „Schadenshöhe" stand im Element „Brand im Serverraum:
      sehr unwahrscheinlich, aber existenzbedrohender Schaden". Die Aufgabe prüfte damit einen
      Vokabelabgleich und keine Beurteilung – dieselbe Fehlerklasse wie das Balkenlabel in
      M01-481 bei FB-R3 Punkt 2, nur in Textform.
   2. **Nur 4 von 25 Fragen enthielten überhaupt eine Zahl** – genau der Anlass des Punktes
      („branchenübliche Beispielwerte").
   3. **Motive wiederholten sich**: Serverausfall in 5 Fragen, Testrechner-ohne-Daten in 4,
      kosmetische Design-Kleinigkeit in 4.

   ⚠️ DIE ENTSCHEIDENDE ABGRENZUNG, ohne die dieser Test falsch wäre:
   Verboten ist **Bewertungsvokabular** – das Wort, das die Lernenden selbst finden sollen
   („selten", „häufig", „wichtig", „dringend", „hoher Aufwand"). Erlaubt bleibt
   **Sachvokabular**: Eine Marktform lässt sich nicht ohne „ein einziger Anbieter" beschreiben,
   das Johari-Fenster nicht ohne „mir bekannt". Dort IST die Achsenaussage der gegebene
   Sachverhalt und nicht die Beurteilungsleistung. Deshalb prüft Test 1 gezielt die
   Bewertungswörter und nicht die Achsenbegriffe. */
const { t: check, report } = require("./_harness.js");
const FRAGEN = require("./fragen.js");

const MATRIX = FRAGEN.filter(f => f.typ === "matrix");
const byId = id => FRAGEN.find(f => f.id === id);

check("matrix-Fragen im Pool gefunden (>= 25)", MATRIX.length >= 25, "gefunden: " + MATRIX.length);

// ── Bewertungsvokabular: das Wort, das der Lernende selbst finden soll ───────────────
const BEWERTUNG = [
  /\bsehr selten\b/i, /\bselten\b/i, /\bhäufig/i, /\bregelmäßig/i, /\bwiederkehrend/i,
  /\bgelegentlich/i, /\bunwahrscheinlich/i, /\bwahrscheinlich/i, /\bexistenzbedrohend/i,
  /\bkatastrophal/i, /\bfolgenlos/i, /\bwichtig/i, /\bdringend/i, /\bkritisch\b/i,
  /\bkaum Nutzen/i, /\bhoher Aufwand/i, /\bwenig Aufwand/i, /\bgeringer Aufwand/i,
  /\briesiger Aufwand/i, /\bgroße Wirkung/i, /\bkaum Mehrwert/i, /\bstark .{0,10}interessiert/i,
  /\bkaum betroffen/i, /\bminimalem? Aufwand/i, /\bschnell erledigt/i, /\bleicht zu ersetzen/i,
  /\bohne Auswirkung/i, /\bkaum jemanden interessiert/i, /\bkaum genutzt/i
];
function verraet(text) {
  return BEWERTUNG.filter(r => r.test(text)).map(r => (text.match(r) || [])[0]);
}

// ── 1) Kein Element nennt die Einstufung wörtlich ────────────────────────────────────
{
  const treffer = [];
  for (const f of MATRIX) {
    for (const e of f.elemente) {
      const w = verraet(e.text);
      if (w.length) treffer.push(f.id + ": „" + w.join("/") + "“");
    }
  }
  check("kein Matrix-Element nennt die Einstufung wörtlich (vorher 42 von 106)",
    treffer.length === 0, treffer.length ? treffer.join(" | ") : "");
}

// ── 2) Die Elemente tragen konkrete Angaben, aus denen sich einstufen lässt ──────────
{
  // „Konkret" heißt: eine Zahl (Ziffern ODER ausgeschriebenes Zahlwort), ein Datum oder
  // eine Zeitangabe. Ohne so etwas bliebe nur wieder das Adjektiv.
  // ⚠️ KEINE Artikel in dieser Liste. Die erste Fassung führte „ein|eine|einen" mit –
  //    damit galt praktisch jeder deutsche Satz als „konkret" und der Wächter war wirkungslos.
  //    Aufgefallen ist das erst durch die Gegenprobe „alle Zahlen aus einem Element entfernt",
  //    die daraufhin stumm blieb.
  const ZAHLWORT = new RegExp("\\b(zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|" +
    "zwanzig|dreißig|hundert|tausend|einmal|zweimal|dreimal|viermal|jährlich|täglich|" +
    "wöchentlich|monatlich|Quartal|einzig)", "i");
  const KONKRET = t => /\d/.test(t) || ZAHLWORT.test(t);
  const duenn = [];
  for (const f of MATRIX) {
    const n = f.elemente.filter(e => KONKRET(e.text)).length;
    if (n < f.elemente.length) duenn.push(f.id + ": nur " + n + "/" + f.elemente.length);
  }
  check("jedes Matrix-Element trägt eine konkrete Angabe (Zahl, Häufigkeit, Frist)",
    duenn.length === 0, duenn.join(" | "));

  const mitZiffer = MATRIX.filter(f => f.elemente.some(e => /\d/.test(e.text)));
  check("mindestens 22 der 25 Fragen enthalten echte Ziffern (vorher 4)",
    mitZiffer.length >= 22, "ist: " + mitZiffer.length);
}

// ── 3) Motive wiederholen sich nicht mehr quer durch den Pool ────────────────────────
{
  const MOTIVE = {
    "Testrechner ohne Daten": /[Tt]estrechner|[Tt]est-PC|[Tt]estserver|Entwicklungsserver/,
    "Serverausfall/Serverraum": /Produktivserver|Dateiserver|E-Mail-Server|Serverraum/,
    "kosmetische Design-Kleinigkeit": /Hintergrundfarbe|Desktop-Hintergrund|farblich vereinheitlich|kosmetisch|um \w+ Pixel/,
    "alte Mails/Akten sortieren": /alte[rn]? ?(E-Mails|Akten|Support-Mails|Besucherliste)/
  };
  const zuOft = [];
  for (const [name, re] of Object.entries(MOTIVE)) {
    const treffer = MATRIX.filter(f => f.elemente.some(e => re.test(e.text)));
    if (treffer.length > 3) zuOft.push(name + " in " + treffer.length + " Fragen (" +
      treffer.map(f => f.id).join(", ") + ")");
  }
  check("kein Beispielmotiv taucht in mehr als 3 Matrix-Fragen auf", zuOft.length === 0,
    zuOft.join(" | "));
}

// ── 4) Struktur: jeder Quadrant ist belegt, keiner doppelt gemeint ───────────────────
{
  const luecken = [];
  for (const f of MATRIX) {
    const belegt = new Set(f.elemente.map(e => e.quadrant));
    if (belegt.size !== 4) luecken.push(f.id + ": nur " + belegt.size + " Quadranten belegt");
    if (f.quadranten.length !== 4) luecken.push(f.id + ": " + f.quadranten.length + " Quadrantennamen");
    if (new Set(f.quadranten).size !== f.quadranten.length) luecken.push(f.id + ": doppelter Quadrantenname");
  }
  check("jede Matrix-Frage belegt alle vier Quadranten mit eindeutigen Namen",
    luecken.length === 0, luecken.join(" | "));
}

// ── 5) Achsenbeschriftung vorhanden, wo die Matrix zwei Dimensionen hat ──────────────
{
  // M05-702 (Qualitätskosten) ist bewusst eine reine Vier-Kategorien-Zuordnung ohne Achsen.
  const ohneAchsen = MATRIX.filter(f => !f.xAchse || !f.yAchse).map(f => f.id);
  check("nur M05-702 kommt ohne Achsenbeschriftung aus",
    ohneAchsen.length === 1 && ohneAchsen[0] === "M05-702", ohneAchsen.join(", "));
}

// ── 6) Frage und Erklärung passen zu den Elementen ───────────────────────────────────
{
  // Die Erklärung muss die Ableitung zeigen, nicht nur die Lösung nennen. Als messbaren
  // Anker verlangen wir, dass erklaerungKurz mindestens eine der Zahlen aus den Elementen
  // wieder aufgreift – sonst steht dort nur wieder ein Adjektiv.
  const ohneBezug = [];
  for (const f of MATRIX) {
    const zahlen = new Set();
    f.elemente.forEach(e => (e.text.match(/\d[\d.]*/g) || []).forEach(z => zahlen.add(z)));
    if (!zahlen.size) continue;
    const kurz = f.erklaerungKurz || "";
    if (![...zahlen].some(z => kurz.includes(z))) ohneBezug.push(f.id);
  }
  check("die Kurzerklärung greift mindestens eine konkrete Angabe aus den Elementen auf",
    ohneBezug.length === 0, "ohne Bezug: " + (ohneBezug.join(", ") || "keine"));

  const kurzzu = MATRIX.filter(f => (f.erklaerungLang || "").length < 300).map(f => f.id);
  check("jede Matrix-Frage hat eine ausführliche Erklärung (>= 300 Zeichen)",
    kurzzu.length === 0, kurzzu.join(", "));
}

// ── 7) Die konkret gemeldeten Textfehler aus M01-521 ─────────────────────────────────
{
  const q = byId("M01-521");
  check("M01-521 vorhanden mit 6 Elementen", !!q && q.elemente.length === 6);
  check("M01-521: der kaputte Satz 'Nicht wichtig, aber verwaltet werden' ist weg",
    !!q && !/verwaltet werden/.test(JSON.stringify(q)));
  check("M01-521: der kaputte Satz 'kann ihn an die Abteilung zurück mit Feedback' ist weg",
    !!q && !/zurück mit Feedback/.test(JSON.stringify(q)));
  // Beide Delegier-Elemente müssen jetzt einen echten Termin nennen, sonst ist der
  // Quadrant „dringend, aber nicht wichtig" nicht begründet.
  const deleg = q ? q.elemente.filter(e => e.quadrant === 3) : [];
  check("M01-521: beide Delegier-Aufgaben nennen einen konkreten Termin",
    deleg.length === 2 && deleg.every(e => /\d|heute|morgen/i.test(e.text)));
}

// ── 8) Stichproben: die fachliche Zuordnung stimmt weiterhin ─────────────────────────
{
  // Quadrantenlage: 0 = oben links, 1 = oben rechts, 2 = unten links, 3 = unten rechts.
  const q = byId("M01-553");
  check("M01-553: Risikostrategien in der richtigen Lage (übertragen / vermeiden / akzeptieren / vermindern)",
    !!q && /übertragen/i.test(q.quadranten[0]) && /vermeiden/i.test(q.quadranten[1]) &&
    /akzeptieren/i.test(q.quadranten[2]) && /vermindern/i.test(q.quadranten[3]));
  const brand = q && q.elemente.find(e => /Brand/.test(e.text));
  check("M01-553: der seltene Grossschaden steht oben links (übertragen)", !!brand && brand.quadrant === 0);

  const e = byId("M01-552");
  check("M01-552: Eisenhower-Felder in der richtigen Lage",
    !!e && /[Tt]erminieren/.test(e.quadranten[0]) && /[Ss]ofort/.test(e.quadranten[1]) &&
    /[Ww]eglassen/.test(e.quadranten[2]) && /[Dd]elegieren/.test(e.quadranten[3]));

  const m = byId("M02-701");
  check("M02-701: ein Anbieter und viele Nachfrager ergeben das Angebotsmonopol",
    !!m && /Angebotsmonopol/.test(m.quadranten[1]) &&
    m.elemente.some(x => x.quadrant === 1 && /einziger Hersteller/.test(x.text)));
  check("M02-701: viele Anbieter und ein Nachfrager ergeben das Nachfragemonopol",
    !!m && /Nachfragemonopol/.test(m.quadranten[2]) &&
    m.elemente.some(x => x.quadrant === 2 && /40 mittelständische Zulieferer/.test(x.text)));

  const j = byId("M02-702");
  const blind = j && j.elemente.find(x => x.quadrant === 1);
  check("M02-702: der blinde Fleck ist der Fall, in dem ich überrascht bin",
    !!blind && /überrascht/.test(blind.text));

  const qk = byId("M05-702");
  const extern = qk ? qk.elemente.filter(x => x.quadrant === 3) : [];
  check("M05-702: externe Fehlerkosten sind Garantie und Rückruf (die teuersten)",
    extern.length === 2 && extern.every(x => /Garantie|Rueckruf|Rückruf/.test(x.text)));

  const tom = byId("M06-702");
  const reaktiv = tom ? tom.elemente.filter(x => x.quadrant === 1) : [];
  check("M06-702: das Zurückspielen aus dem Backup ist technisch-reaktiv",
    reaktiv.length === 1 && /Backup/.test(reaktiv[0].text) && /reaktiv/i.test(tom.quadranten[1]));
}

// ── 9) Rechtsbezüge, die in dieser Runde neu gesetzt wurden ──────────────────────────
//     Die teuerste Lehre aus R2b.3 war ein Agenten-Batch mit falschen Paragrafen.
//     Diese drei sind von Hand am Gesetzestext geprüft und werden hier festgehalten.
{
  // ⚠️ NICHT über JSON.stringify prüfen – der Paragraf steht auch in der Erklärung, damit
  //    bliebe eine Verfälschung im ELEMENT unbemerkt. Genau das zeigten zwei Gegenproben.
  const s = byId("M01-551");
  const betrvg = s && s.elemente.find(e => /BetrVG/.test(e.text));
  check("M01-551: das Betriebsrats-Element nennt § 87 Abs. 1 Nr. 6 BetrVG",
    !!betrvg && /§ 87 Abs\. 1 Nr\. 6 BetrVG/.test(betrvg.text),
    betrvg ? betrvg.text.slice(0, 90) : "kein BetrVG-Element");
  check("M01-551: nicht § 99 BetrVG (das ist die personelle Einzelmaßnahme)",
    !!s && !/§ 99 BetrVG/.test(JSON.stringify(s)));
  check("M01-551: der Betriebsrat steht wegen des Vetorechts oben links (zufriedenstellen)",
    !!betrvg && betrvg.quadrant === 0);

  const t = byId("M06-702");
  const frist = t && t.elemente.find(e => /72 Stunden/.test(e.text));
  check("M06-702: das Element mit der 72-Stunden-Frist nennt Art. 33 DSGVO",
    !!frist && /Art\. 33 DSGVO/.test(frist.text),
    frist ? frist.text.slice(0, 90) : "kein Fristen-Element");
  check("M06-702: die Meldefrist wird nicht Art. 34 DSGVO zugeschrieben (das ist die "
    + "Benachrichtigung der Betroffenen)",
    !!t && !/Art\. 34 DSGVO/.test(JSON.stringify(t)));
  check("M06-702: TOM sind Art. 32 DSGVO", !!t && /Art\. 32 DSGVO/.test(t.erklaerungLang));
}

// ── 10) Gegenproben der Prüffunktionen ───────────────────────────────────────────────
{
  check("Gegenprobe: ein selbstverratendes Element wird erkannt",
    verraet("Brand im Serverraum: sehr unwahrscheinlich, aber existenzbedrohender Schaden").length >= 2);
  check("Gegenprobe: ein sachlich formuliertes Element wird NICHT beanstandet",
    verraet("Brand im Serverraum: laut Versicherer ein Fall in 2.000 Betriebsjahren; " +
      "der Betrieb stünde danach sechs Wochen still").length === 0);
  // Sachvokabular darf nicht fälschlich anschlagen – sonst wären Marktformen und
  // Johari-Fenster gar nicht formulierbar.
  check("Gegenprobe: Sachvokabular der Marktformen schlägt nicht an",
    verraet("Ein einziger Hersteller vertreibt ein CAD-Programm; 4.000 Betriebe arbeiten damit").length === 0);
  check("Gegenprobe: Sachvokabular des Johari-Fensters schlägt nicht an",
    verraet("Ich habe mich intern beworben und darüber mit niemandem gesprochen").length === 0);
}

process.exit(report());
