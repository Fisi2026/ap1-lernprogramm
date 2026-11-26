/* tools/mess_freitext.js – Messgeruest fuer die Freitext-Kalibrierung (FB-R2a, 2026-07-21).
   KEIN Dauertest (der ist tests/test_freitext.js), sondern ein MESSWERKZEUG: es beziffert, wie gut
   realistisch formulierte Azubi-Antworten erkannt werden. Aufruf (seit 13.10.2026 direkt, BUILD_LOG 153):
       node tools/mess_freitext.js

   ZWEI MESSGLEISE (Nutzer-Vorgabe seit 19.07., hier fest verdrahtet):
     * STRENG      – Fachwoerter bewusst GEMIEDEN, Sache mit Alltagssprache umschrieben.
                     Das ist der harte Fall: fachlich richtig, aber ohne die erwarteten Vokabeln.
     * REALISTISCH – normales Azubi-Vokabular, wie es in einer Klausur wirklich steht:
                     ein paar Fachwoerter, unvollstaendig, mit Tippfehlern und falschen Endungen.

   WICHTIG ZUR METHODE: Diese Antworten wurden VOR der Kalibrierung geschrieben und danach NICHT
   mehr angefasst. Sonst misst man nur, ob man die Schluessel auf die eigenen Testsaetze
   zugeschnitten hat. Wer hier Antworten nachtraeglich anpasst, macht die Messung wertlos.

   NEGATIV-GLEIS: dieselben Antworten werden zusaetzlich gegen eine FREMDE Frage gehalten.
   Jede Lockerung der Erkennung muss sich daran messen lassen – Falsch-Positive bleiben 0. */
"use strict";
/* 13.10.2026 (BUILD_LOG 153): frueher `require("./_harness.js")` – lief nur, wenn man die Datei ins flache
   Arbeitsverzeichnis von tools/suite.sh kopierte, und bewertete mit der ALTEN App. Jetzt wie die App selbst:
   Pool ueber tools/pool_laden.js, Bewertung aus neu/src/kern/freitext.ts (ueber tools/kern.js). Aufruf direkt:
   node tools/<datei>.js. Gegenprobe beim Umbau: Ausgabe Zeile fuer Zeile gleich der alten (BUILD_LOG 153). */
/** @type {any} */ const L = require("./kern.js");
const H = { boot: async () => ({ POOL: require("./pool_laden.js").laden().fragen, gradeTeilpunkte: L.gradeTeilpunkte, normText: L.normFreitext }) };

/* je Frage: streng (Fachwoerter gemieden) und realistisch (normales Vokabular, inkl. Fehlern) */
/** @type {Record<string, Record<string, string>>} */ const ANTWORTEN = {
  "M01-115": {
    streng: "Ein Sprint ist ein fest abgesteckter Zeitabschnitt von meistens zwei Wochen. " +
      "Das Team nimmt sich am Anfang eine bestimmte Menge Aufgaben vor und arbeitet die ab. " +
      "Am Ende steht etwas Fertiges, das man auch wirklich benutzen koennte. Danach faengt der " +
      "naechste Abschnitt an und es wiederholt sich immer wieder.",
    realistisch: "Ein Sprint ist ein fester Zeitraum von 2 Wochen in Scrum. Das Team arbeitet die " +
      "Aufgaben aus dem Sprint Backlog ab, die der Product Owner vorher priorisiert hat. Am Ende " +
      "gibt es ein fertiges Inkrement. Das laeuft dann immer wieder von vorne los."
  },
  "M02-011": {
    streng: "Damit vergleicht man mehrere Angebote miteinander. Man legt vorher fest, worauf es " +
      "ankommt, und wie wichtig die einzelnen Punkte jeweils sind. Dann gibt man Punkte und " +
      "rechnet sie mit der Wichtigkeit hoch. Am Schluss zaehlt man alles zusammen und das " +
      "Angebot mit der hoechsten Summe gewinnt.",
    realistisch: "Mit der Nutzwertanalyse vergleicht man mehrere Alternativen nach vorher " +
      "festgelegten Kriterien. Jedes Kriterium bekommt eine Gewichtung, weil nicht alles gleich " +
      "wichtig ist. Punkte mal Gewichtung ergibt den Teilnutzen, und alles zusammen die " +
      "Gesamtpunktzahl. Wer am meisten Punkte hat, gewinnt."
  },
  "M02-109": {
    streng: "Bei einem Eisberg sieht man nur die Spitze, der Rest liegt unter Wasser. Beim Reden " +
      "ist das genauso: Man hoert nur die Worte, aber das meiste bleibt unausgesprochen. " +
      "Darunter stecken Gefuehle und wie die Leute zueinander stehen. Deshalb gibt es Streit, " +
      "obwohl es sachlich gar keinen Grund dafuer gibt.",
    realistisch: "Das Eisbergmodell sagt, dass man bei Kommunikation nur ca 20 % sieht, das ist " +
      "die Sachebene mit den Woertern. Die restlichen 80 % sind verborgen, da stecken die " +
      "Emotionen und die Beziehungsebene drin. Konflikte kommen meistens aus dem unsichtbaren " +
      "Teil und nicht aus der Sache."
  },
  "M03-012": {
    streng: "Man guckt nicht nur auf den Kaufpreis, sondern auf alles, was das Geraet ueber die " +
      "ganze Zeit kostet, die man es benutzt. Also Strom, Reparaturen, Wartung und Schulungen " +
      "kommen noch obendrauf. Am Ende kann man das Geraet noch verkaufen, das rechnet man ab. " +
      "So sieht man erst, was wirklich teurer ist.",
    realistisch: "TCO heisst Total Cost of Ownership, also die Gesamtbetriebskosten. Da zaehlen " +
      "nicht nur die Anschaffungskosten, sondern auch die Betriebskosten wie Strom, Wartung und " +
      "Support ueber den ganzen Lebenszyklus. Am Ende zieht man den Restwert ab. Damit kann man " +
      "Kauf und Leasing fair vergleichen."
  },
  "M03-115": {
    streng: "Alle Rechner und Benutzer einer Firma haengen an einer gemeinsamen zentralen " +
      "Verwaltung. Ein Server in der Mitte weiss, wer sich anmelden darf und was er tun darf. " +
      "Man meldet sich einmal an und kommt dann ueberall dran. Die Regeln, was erlaubt ist, " +
      "werden zentral vorgegeben und gelten fuer alle.",
    realistisch: "Eine Domaene ist ein Netzwerkverbund, wo alle Benutzer und Computer zentral " +
      "verwaltet werden. Das macht der Domain Controller mit dem Active Directory. Ueber Group " +
      "Policies werden die Sicherheitsrichtlinien fuer alle vorgegeben. Der Benutzer meldet sich " +
      "einmal mit seinem Domaenenkonto an."
  },
  "M04-206": {
    streng: "Es gibt zwei Sorten von Dingen, die man speichern will: die Leute und die Geraete. " +
      "Zu jeder Sorte schreibt man auf, was man darueber wissen will, also Name, Abteilung " +
      "bzw. Modell und wann es gekauft wurde. Ein Mensch kann mehrere Geraete haben, ein Geraet " +
      "gehoert aber nur einem. Deshalb 1 zu n.",
    realistisch: "Die zwei Entitaeten sind Mitarbeiter und Geraet. Attribute beim Mitarbeiter " +
      "sind MitarbeiterID, Name und Abteilung, beim Geraet GeraeteID, Modell und " +
      "Anschaffungsdatum. Die Kardinalitaet ist 1:n, weil ein Mitarbeiter mehrere Geraete nutzen " +
      "kann, ein Geraet aber genau einem gehoert."
  },
  "M05-001": {
    streng: "Man arbeitet in vier Schritten immer im Kreis. Erst schaut man, wie es gerade ist, " +
      "und ueberlegt sich, was man besser machen will. Dann probiert man es aus. Danach schaut " +
      "man nach, ob es was gebracht hat. Zum Schluss behaelt man bei, was funktioniert hat, und " +
      "faengt wieder von vorne an.",
    realistisch: "Der PDCA Zyklus steht fuer Plan Do Check Act und gehoert zum " +
      "Qualitaetsmanagement. Bei Plan analysiert man den Ist Zustand und plant Massnahmen, bei " +
      "Do setzt man sie um. Check heisst messen und vergleichen, Act heisst anpassen und " +
      "standartisieren. Danach geht es wieder von vorne los, das ist iterativ."
  },
  "M06-113": {
    streng: "Das ist eine Stelle, der alle glauben. Sie stellt Ausweise fuer Webseiten und " +
      "Personen aus und bestaetigt damit, dass jemand wirklich der ist, der er zu sein " +
      "behauptet. Dazu setzt sie ihre eigene Unterschrift darunter. Der Browser prueft das im " +
      "Hintergrund und zeigt dann das Schloss an.",
    realistisch: "Eine Zertifizierungsstelle oder CA stellt digitale Zertifikate aus. Das " +
      "Zertifikat verbindet eine Identitaet, also zum Beispiel eine Webseite, mit ihrem " +
      "oeffentlichen Schluessel. Die CA hat das signirt, und weil man der CA vertraut, vertraut " +
      "man auch dem Zertifikat. Der Browser prueft das bei SSL automatisch."
  },
  "M08-011": {
    streng: "Das sind gewaehlte Vertreter fuer die jungen Leute im Betrieb, also die Azubis und " +
      "alle unter 25. Sie kuemmern sich um deren Anliegen und reden mit dem Chef und mit der " +
      "Arbeitnehmervertretung darueber. Gewaehlt wird, wenn genug junge Leute da sind. Sie duerfen " +
      "bei Sachen rund um die Ausbildung mitreden.",
    realistisch: "Die JAV ist die Interessenvertretung fuer Azubis und Arbeitnehmer unter 25 im " +
      "Betrieb. Sie wird gewaehlt, wenn mindestens 5 solche Leute da sind. Sie vertritt deren " +
      "Interessen gegenueber dem Arbeitgeber und dem Betriebsrat. Ihre Rechte stehen im BetrVG, " +
      "sie hat da auch Mitbestimmung bei Ausbildungsfragen."
  },
  "M08-012": {
    streng: "Man lernt an zwei Stellen gleichzeitig. Im Betrieb macht man die Praxis mit und " +
      "sieht, wie die Ablaeufe wirklich laufen. In der Schule bekommt man die Theorie dazu und " +
      "die allgemeinen Faecher. Beides zusammen sorgt dafuer, dass man den Beruf hinterher " +
      "wirklich kann und nicht nur davon gehoert hat.",
    realistisch: "Das duale System ist das Ausbildungssystem in Deutschland mit zwei Lernorten. " +
      "Der eine ist der Ausbildungsbetrieb, da macht man die praktischen Sachen, der andere ist " +
      "die Berufsschule fuer die Theorie. Dadurch lernt man Praxis und Theorie gleichzeitig und " +
      "ist am Ende besser qualifiziert."
  }
};

(async () => {
  const w = await H.boot();
  const ids = Object.keys(ANTWORTEN);
  /** @type {Record<string, any>} */ const pool = {};
  w.POOL.forEach(f => { if (ANTWORTEN[f.id]) pool[f.id] = f; });

  let /** @type {{ id: string, pf: number }[]} */ zeilen = [], /** @type {Record<string, number>} */ summe = { streng: 0, realistisch: 0 }, n = 0;
  console.log("ID        Pfl  streng                        realistisch");
  console.log("-".repeat(78));
  ids.forEach(id => {
    const f = pool[id];
    if (!f) { console.log(id + "  NICHT IM POOL"); return; }
    n++;
    /** @type {string[]} */ const out = [];
    ["streng", "realistisch"].forEach(gleis => {
      const r = w.gradeTeilpunkte(ANTWORTEN[id][gleis], f);
      if (r.stufe === "richtig") summe[gleis]++;
      out.push((r.stufe + "        ").slice(0, 14) + (r.prozent + "%").padStart(4) +
        " " + r.pflichtTreffer + "/" + r.pflichtGesamt);
    });
    const pf = (f.schluesselbegriffe.pflicht || []).length;
    console.log(id + "  " + String(pf).padStart(3) + "  " + out[0].padEnd(28) + "  " + out[1]);
    zeilen.push({ id, pf });
  });

  console.log("-".repeat(78));
  console.log("ALS RICHTIG GEWERTET:  streng " + summe.streng + "/" + n +
    "   realistisch " + summe.realistisch + "/" + n);
  const schnitt = zeilen.reduce((a, z) => a + z.pf, 0) / (zeilen.length || 1);
  console.log("Ø Pflichtbegriffe: " + schnitt.toFixed(2));

  /* NEGATIV-GLEIS: dieselbe Antwort gegen eine FREMDE Frage. Muss 0 bleiben, sonst erkauft die
     Lockerung ihre Trefferquote mit Falsch-Positiven. */
  let fp = 0, /** @type {string[]} */ fpListe = [];
  ids.forEach((id, i) => {
    const fremd = pool[ids[(i + 3) % ids.length]];
    if (!fremd || fremd.id === id) return;
    ["streng", "realistisch"].forEach(gleis => {
      const r = w.gradeTeilpunkte(ANTWORTEN[id][gleis], fremd);
      if (r.stufe === "richtig") { fp++; fpListe.push(fremd.id + " <- " + id + "/" + gleis); }
    });
  });
  console.log("FALSCH-POSITIVE (fremde Frage): " + fp + (fpListe.length ? "  " + fpListe.join(", ") : ""));
})();
