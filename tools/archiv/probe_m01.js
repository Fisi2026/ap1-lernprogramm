/* tools/probe_m01.js – MODUL-PROBE M01 (FB-R2a, 2026-07-21).
   Nutzer-Entscheid: ein Modul beide Wege bearbeiten (Haiku-Agent vs. Handarbeit) und die Ergebnisse
   an denselben Antworten messen, bevor die restlichen 66 Fragen nach einem der beiden Muster laufen.

   Die Azubi-Antworten unten wurden geschrieben, BEVOR eine der beiden Begriffs-Fassungen entstand –
   sonst misst man nur, wer besser auf die eigenen Testsaetze zugeschnitten hat.
   Aufruf: NODE_PATH=/tmp/jt/node_modules node probe_m01.js */
"use strict";
const H = require("./_harness.js");

/* Realistische Klausurantworten: unvollstaendig, mit Tippfehlern, normales Azubi-Vokabular. */
const ANTWORTEN = {
  "M01-013": "Nach dem Projekt setzt sich das Team zusammen und schaut, was gut lief und was nicht so " +
    "gut. Das wird dann dokumentiert, damit man die gleichen Fehler beim naechsten Projekt nicht " +
    "nochmal macht. So gibt es eine staendige Verbesserung und das Wissen geht nicht verloren.",
  "M01-106": "Die Latenz zum Fileserver soll bis zum 31.12. von 80 ms auf unter 50 ms gesenkt werden, " +
    "gemessen woechentlich mit dem Monitoring Tool. Spezifisch ist es, weil genau die Latenz gemeint " +
    "ist und nicht die Performance allgemein. Messbar durch den Zielwert von 50 ms. Terminiert durch " +
    "den Stichtag 31.12.",
  "M01-107": "Position 1 sind 24 Stunden mal 85 Euro, das sind 2.040 Euro. Dazu kommt das Material " +
    "mit 1.200 Euro. Die Anfahrten sind 3 mal 40 Euro, also 120 Euro. Zusammen ergibt das eine " +
    "Angebotssumme von 3.360 Euro netto.",
  "M01-111": "Eine Chance ist, dass der Chatbot rund um die Uhr erreichbar ist, auch nachts und am " +
    "Wochenende. Ausserdem geht die Bearbeitung schneller, weil er die haeufigen Anfragen sofort " +
    "einsortiert. Eine Grenze ist, dass er komplexe Anfragen falsch versteht. Und bei Kunden die " +
    "sauer sind fehlt ihm die Empathie.",
  "M01-114": "Ein Meilenstein ist ein wichtiger Zeitpunkt im Projekt, an dem ein Zwischenziel " +
    "erreicht ist. Er hat keine Dauer, ist also nur ein Punkt und kein Vorgang. Im Gantt Diagramm " +
    "wird er als Raute gezeichnet. Man kann daran kontrollieren, ob das Projekt im Plan liegt.",
  "M01-204": "Eine Retrospektive ist ein Meeting am Ende vom Sprint, wo das Team zurueckschaut. Man " +
    "ueberprueft, was gut lief und was besser laufen koennte, und was man beim naechsten Mal anders " +
    "machen will. Das Ziel ist die staendige Verbesserung der Zusammenarbeit.",
  "M01-604": "Erstens sollte der Projektleiter die Konflikte moderieren und klare Gespraechsregeln " +
    "vorgeben. Zweitens muessen die Rollen und Zustaendigkeiten klar geklaert werden, damit jeder " +
    "weiss wofuer er da ist. Drittens stellt das Team gemeinsame Spielregeln auf, an die sich alle " +
    "halten.",
  "M01-733": "Der Chatbot entlastet die Kollegen, weil er Standardanfragen wie Passwort " +
    "zuruecksetzen automatisch und rund um die Uhr erledigt. Ausserdem ist die Reaktionszeit " +
    "kuerzer, weil sofort geantwortet wird. Ein Risiko ist, dass die KI falsche Antworten erfindet, " +
    "also halluziniert. Und bei schwierigen Faellen fehlt das Verstaendnis fuer den Kunden."
};

/* VORSCHLAG A – Haiku-Agent (2026-07-21), unveraendert uebernommen. */
const HAIKU = {
  "M01-013": {pflicht: [["Lessons Learned","gelernte Lektionen","Lektionen"],["Dokumentation","dokumentiert"],["Verbesserung","kontinuierliche Verbesserung","Wissenssicherung"]], kuer: ["Projektabschluss","Best Practices","Reflexion","Team"]},
  "M01-106": {pflicht: [["Spezifisch","Specific"],["Messbar","Measurable","quantifizierbar"],["Terminiert","Time-bound","Zeitgebunden"]], kuer: ["SMART","Realistisch","Attraktiv","Zielwert"]},
  "M01-107": {pflicht: [["Angebotssumme","Gesamtsumme"],["Position","Positionen"],["3360","3.360"]], kuer: ["Netto","berechnen","Techniker","EUR"]},
  "M01-111": {pflicht: [["Chancen","Vorteile","Möglichkeiten"],["Grenzen","Risiken","Nachteile"],["Verfügbarkeit","Erreichbarkeit","rund um die Uhr"]], kuer: ["Empathie","Fehlinterpretation","Bearbeitung","Automatisch"]},
  "M01-114": {pflicht: [["Meilenstein","Milestone"],["zeitpunktbezogen","Zeitpunkt","Punkt in der Zeit"],["Dauer 0","Dauer null","keine Dauer"]], kuer: ["Zwischenziel","Projekt-Kontrolle","Gantt-Diagramm","Raute"]},
  "M01-204": {pflicht: [["Retrospektive","Retro"],["Reflexion","Reflexions-Meeting","überprüft"],["Verbesserung","kontinuierliche Verbesserung"]], kuer: ["Sprint","Team","SCRUM","Start-Stop-Continue"]},
  "M01-604": {pflicht: [["Moderation","moderieren","Konfliktmoderation"],["Rollenklärung","Rollen klären","Zuständigkeiten"],["Regeln","Spielregeln"]], kuer: ["Transparenz","Team-Building","Konflikt","Norming"]},
  "M01-733": {pflicht: [["Chancen","Vorteile","Möglichkeiten"],["Grenzen","Risiken","Nachteile"],["Verfügbarkeit","Entlastung"]], kuer: ["Empathie","Halluzinationen","Reaktionszeit","automatisch"]}
};

/* VORSCHLAG B – Handarbeit. Leitgedanke, in dem sich die beiden Fassungen unterscheiden:
   Pflicht wird nur INHALT, nie die Gliederungsvokabel der Aufgabenstellung. Wer bei einer
   Chancen/Grenzen-Aufgabe „Chancen" verlangt, belohnt das Abschreiben der Frage. */
const HAND = {
  "M01-013": {pflicht: [["Lessons Learned","Erfahrungssicherung"],["dokumentiert","Dokumentation","festgehalten"],["Verbesserung","daraus lernen","Wissenssicherung"]], kuer: ["Projektabschluss","Best Practices","Fehler","Erkenntnisse"]},
  "M01-106": {pflicht: [["messbar","Zielwert","gemessen"],["terminiert","Stichtag","Termin"],["spezifisch","konkret","Latenz"]], kuer: ["SMART","realistisch","attraktiv","akzeptiert"]},
  "M01-107": {pflicht: [["3.360","3360"],["2.040","2040"],["120"]], kuer: ["Angebotssumme","Netto","Material","Anfahrten"]},
  "M01-111": {pflicht: [["Verfügbarkeit","rund um die Uhr","nachts","jederzeit"],["schneller","sofort","Zeitersparnis","Entlastung"],["komplexe","mehrdeutige","fehlinterpretiert","Empathie"]], kuer: ["Klassifizierung","eskaliert","Techniker","Kundenerlebnis"]},
  "M01-114": {pflicht: [["Meilenstein","Milestone"],["Zeitpunkt","zeitpunktbezogen","keine Dauer","Dauer 0"],["Zwischenziel","Etappe","Ereignis"]], kuer: ["Gantt","Raute","Go-Live","Statusüberprüfung"]},
  "M01-204": {pflicht: [["Retrospektive","Retro"],["Reflexion","reflektiert","überprüft","zurückschaut"],["Verbesserung","besser laufen","anders machen"]], kuer: ["Sprint","Team","Start-Stop-Continue","Arbeitsphase"]},
  "M01-604": {pflicht: [["Moderation","moderieren","vermitteln"],["Rollen","Zuständigkeiten","Rollenklärung"],["Regeln","Spielregeln","Vereinbarungen"]], kuer: ["Norming","Storming","Team-Building","Transparenz"]},
  "M01-733": {pflicht: [["Entlastung","Verfügbarkeit","rund um die Uhr","automatisch"],["Reaktionszeit","schneller","sofort","vorqualifiziert"],["Halluzinationen","falsche","fehlerhafte","erfundene"]], kuer: ["Wissensdatenbank","SLA","Empathie","Priorität"]}
};

(async () => {
  const w = await H.boot();
  const muster = {};
  w.POOL.forEach(f => { if (ANTWORTEN[f.id]) muster[f.id] = f.musterloesung; });
  const ids = Object.keys(ANTWORTEN);

  function fahre(name, satz) {
    let richtig = 0, sanityFehler = [], detail = [];
    ids.forEach(id => {
      const f = { schluesselbegriffe: satz[id] };
      // SANITY: die Musterloesung muss die eigenen Pflichtbegriffe treffen
      const rm = w.gradeTeilpunkte(muster[id] || "", f);
      if (rm.fehlendPflicht.length) sanityFehler.push(id + " (" + rm.fehlendPflicht.join(", ") + ")");
      const r = w.gradeTeilpunkte(ANTWORTEN[id], f);
      if (r.stufe === "richtig") richtig++;
      detail.push("  " + id + "  " + (r.stufe + "        ").slice(0, 14) +
        (r.prozent + "%").padStart(5) + "  " + r.pflichtTreffer + "/" + r.pflichtGesamt +
        (r.fehlendPflicht.length ? "   fehlt: " + r.fehlendPflicht.join(" | ") : ""));
    });
    // NEGATIV: Antwort gegen eine fremde Frage
    let fp = 0;
    ids.forEach((id, i) => {
      const fremd = ids[(i + 3) % ids.length];
      if (fremd === id) return;
      if (w.gradeTeilpunkte(ANTWORTEN[id], { schluesselbegriffe: satz[fremd] }).stufe === "richtig") fp++;
    });
    console.log("\n===== " + name + " =====");
    console.log(detail.join("\n"));
    console.log("  -> richtig " + richtig + "/" + ids.length +
      " | Falsch-Positive " + fp +
      " | Sanity-Fehler " + sanityFehler.length +
      (sanityFehler.length ? ": " + sanityFehler.join("; ") : ""));
    return { richtig, fp, sanity: sanityFehler.length };
  }

  const a = fahre("A – HAIKU-AGENT", HAIKU);
  const b = fahre("B – HANDARBEIT", HAND);
  console.log("\n" + "=".repeat(60));
  console.log("VERGLEICH   richtig   Falsch-Positive   Sanity-Fehler");
  console.log("Haiku       " + a.richtig + "/8" + "       " + a.fp + "                 " + a.sanity);
  console.log("Handarbeit  " + b.richtig + "/8" + "       " + b.fp + "                 " + b.sanity);
})();
