/* Test #76: Teilpunkte via gewichtete Schlüsselbegriffe (jsdom). Prüft: gradeTeilpunkte (Pflicht=Gewicht 2 /
   Kür=Gewicht 1, Anteil, Schwelle 65 %), Synonym-/Stem-Treffer, leere Antwort, Render-Anzeige "x/y Kernpunkte
   getroffen", Fallback auf autoCheckText ohne Feld, Validierung des optionalen Feldes. */
const { t: check, boot, report } = require("./_harness.js");

(async () => {
  const w = await boot();
  const D = w.document;

  const F = { schluesselbegriffe: { pflicht: ["vertraulichkeit", "integritaet"], kuer: ["verfuegbarkeit"] } };

  // Gewichtung + Schwelle
  let r = w.gradeTeilpunkte("Es geht um Vertraulichkeit, Integrität und Verfügbarkeit.", F);
  check("alle getroffen: 100 %", r.prozent === 100);
  check("alle getroffen: stufe richtig", r.stufe === "richtig");
  check("Pflicht 2/2", r.pflichtTreffer === 2 && r.pflichtGesamt === 2);
  check("Kür 1/1", r.kuerTreffer === 1 && r.kuerGesamt === 1);

  r = w.gradeTeilpunkte("Nur die Vertraulichkeit ist wichtig.", F);
  check("1 Pflicht: Gewicht 2/5 = 40 %", r.prozent === 40);
  check("1 Pflicht: stufe teilweise", r.stufe === "teilweise");

  r = w.gradeTeilpunkte("Vertraulichkeit und Integrität sind zentral.", F);
  check("2 Pflicht ohne Kür: 4/5 = 80 %", r.prozent === 80);
  check("2 Pflicht: stufe richtig (>=65)", r.stufe === "richtig");

  r = w.gradeTeilpunkte("Nur die Verfügbarkeit zählt.", F);
  check("nur Kür: 1/5 = 20 %", r.prozent === 20);
  check("nur Kür: stufe unvollständig", r.stufe === "unvollständig");
  check("fehlendPflicht listet beide", r.fehlendPflicht.length === 2);

  check("leere Antwort: stufe leer", w.gradeTeilpunkte("", F).stufe === "leer");

  // Synonym-Treffer (Langform statt Kürzel)
  const Fsyn = { schluesselbegriffe: { pflicht: ["dsgvo"], kuer: [] } };
  check("Synonym: 'Datenschutz-Grundverordnung' trifft dsgvo",
    w.gradeTeilpunkte("Die Datenschutz-Grundverordnung schützt Daten.", Fsyn).pflichtTreffer === 1);

  // Render-Integration: Freitext mit Schlüsselbegriffen zeigt "Kernpunkte getroffen"
  const host = D.createElement("div"); D.body.appendChild(host);
  const fFrei = { id:"TP-1", typ:"freitext", modul:"M06", thema:"Schutzziele", schwierigkeit:2,
    frage:"Nenne die drei Schutzziele der Informationssicherheit.",
    musterloesung:"Vertraulichkeit, Integrität und Verfügbarkeit.",
    schluesselbegriffe:{ pflicht:["vertraulichkeit","integritaet","verfuegbarkeit"], kuer:[] } };
  w.loeseFrage(fFrei, host, { onGraded:function(){}, onNext:function(){} });
  const ta = host.querySelector("textarea");
  ta.value = "Vertraulichkeit, Integrität, Verfügbarkeit";
  D.getElementById("btnAktion").click();
  check("Render: 'Kernpunkten getroffen' angezeigt", host.textContent.indexOf("Kernpunkten getroffen") >= 0);
  check("Render: Musterlösung angezeigt", host.textContent.indexOf("Musterlösung") >= 0);
  check("Render: Selbsteinschätzung bleibt (Buttons da)", !!Array.prototype.find.call(host.querySelectorAll("button"), b=>b.textContent.indexOf("wusste ich")>=0));

  // Fallback ohne Feld → autoCheckText-Wortlaut
  const host2 = D.createElement("div"); D.body.appendChild(host2);
  const fAlt = { id:"TP-2", typ:"freitext", modul:"M06", thema:"X", schwierigkeit:2,
    frage:"Erkläre Verschlüsselung.", musterloesung:"Verschlüsselung wandelt Klartext in Chiffrat mit einem Schlüssel um." };
  w.loeseFrage(fAlt, host2, { onGraded:function(){}, onNext:function(){} });
  host2.querySelector("textarea").value = "Verschlüsselung macht Klartext zu Chiffrat.";
  D.getElementById("btnAktion").click();
  check("Fallback: 'Kernpunkten erkannt' (autoCheckText)", host2.textContent.indexOf("Kernpunkten erkannt") >= 0);

  // Validierung des optionalen Feldes
  const raw = (w.FRAGEN || []).find(f => f.typ === "freitext" || f.typ === "erklaeren");
  const good = JSON.parse(JSON.stringify(raw)); good.id = "VAL-OK"; good.schluesselbegriffe = { pflicht:["alpha"], kuer:["beta"] };
  const bad = JSON.parse(JSON.stringify(raw)); bad.id = "VAL-BAD"; bad.schluesselbegriffe = { pflicht:[], kuer:["beta"] };
  const vGood = w.L.validateFragen([good]);
  const vBad = w.L.validateFragen([bad]);
  check("Validierung: gültiges schluesselbegriffe akzeptiert", vGood.gueltig.length === 1 && vGood.fehler.length === 0);
  check("Validierung: leere pflicht abgelehnt", vBad.gueltig.length === 0 && vBad.fehler.length === 1);

  process.exit(report());
})();
