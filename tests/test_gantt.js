/* Test (FB-R3 Punkt 2): Gantt-Balkenplaene – Bildgeometrie UND Ablesbarkeit.

   ANLASS (2026-07-22): Der Bestandsabgleich für Punkt 2 fand ZWEI defekte Bestands-SVGs.
   M01-481 hatte eine NICHT-LINEARE Zeitachse (15 / 12 / 16 / 14 px je Tag), und die Balken
   passten nicht zu ihr: der Entwicklungs-Balken lag geometrisch bei Tag 9–19, beschriftet
   war er mit „Tag 6-15". Die richtige Antwort (10 Tage) war damit NUR aus dem Textlabel im
   Balken ablesbar, nicht aus dem Diagramm – das genaue Gegenteil dessen, was die Aufgabe
   prüfen soll. M01-113 nannte im Fragetext „10 Tage" und „Meilenstein am Tag 7", während die
   Achse bei „9+" endete und die Markierung bei Tag 5,5 saß; gezeichnet war sie außerdem als
   winziges DREIECK, obwohl M01-960 und M09-053 (heute M01-511) im selben Pool die RAUTE als Meilenstein-
   Symbol lehren.

   NUTZER-VORGABE (2026-07-22, nach Sichtprüfung der ersten Fassung): jeder AP1-Balkenplan
   zeigt MINDESTENS 20 Arbeitstage und MINDESTENS 8 Vorgänge. Die erste Fassung mit 6 Wochen
   und 3–4 Vorgängen war zu dünn. Test 7 bewacht das.

   DIESE SUITE BEWACHT:
   1. Die Zeitachse jedes Balkenplans ist LINEAR (alle Gitterabstände gleich).
   2. Jede Balkenkante liegt EXAKT auf einer Gitterlinie – ein Balken kann also nicht
      „zwischen" zwei Zeiteinheiten enden.
   3. KEIN Balken trägt seinen Zeitraum als Text. Die Achse ist die einzige Quelle; sonst
      löst man die Aufgabe aus dem Label statt aus dem Bild (der M01-481-Fehler).
   4. Meilensteine werden als Raute gezeichnet (rotate(45)), nie als Polygon/Dreieck.
   5. Die Lösungen aller acht Fragen werden aus dem BILD nachgerechnet, nicht aus dem
      Skript übernommen, das sie erzeugt hat.

   cairosvg ist in dieser Umgebung nicht installierbar (pip 403) – die Geometrieprüfung
   ersetzt die Sichtprüfung nicht. Sie hätte die Achsen-Inkonsistenz der ersten Fassung
   (mittige vs. kantenbündige Tagesbeschriftung) NICHT gefunden, weil beide Varianten für
   sich linear sind. Gefunden hat sie erst der gerenderte Abzug. Beides fahren. */
const { t: check, report } = require("./_harness.js");
const FRAGEN = require("./fragen.js");

const byId = id => FRAGEN.find(f => f.id === id);
const GANTT = FRAGEN.filter(f => /Gantt/.test(f.thema || "") && f.svg);
// Die acht AP1-Balkenpläne aus M01, für die die Nutzer-Vorgabe gilt.
const M01_PLAENE = ["M01-113", "M01-481", "M01-482", "M01-483", "M01-484", "M01-485",
  "M01-486", "M01-487"];

check("Gantt-Fragen mit SVG im Pool gefunden (>= 12)", GANTT.length >= 12, "gefunden: " + GANTT.length);

// ── Parser: Gitter und Balken aus dem SVG lesen ──────────────────────────────────────
function attrs(tag) {
  // Achtung: Attributnamen enthalten ZIFFERN (x1, y2) – ein reines [a-zA-Z-]+ hätte
  // genau die Gitterlinien übersehen und die Suite still grün gemeldet.
  const a = {};
  for (const m of tag.matchAll(/([a-zA-Z][a-zA-Z0-9-]*)='([^']*)'/g)) a[m[1]] = m[2];
  return a;
}
function raster(svg) {
  const mvb = /viewBox='([^']+)'/.exec(svg);
  const vb = mvb ? mvb[1].trim().split(/\s+/).map(Number) : [0, 0, 0, 0];
  const linien = [...svg.matchAll(/<line\b[^>]*\/>/g)].map(attrsOf);
  // Gitterlinien = senkrechte Linien, die sich y1 UND y2 teilen. Die größte solche
  // Gruppe ist das Zeitgitter; die gestrichelte Meilenstein-Lotlinie fällt heraus,
  // weil sie ein anderes y2 hat. So funktioniert der Parser für das Wochenraster der
  // M09-Bilder genauso wie für das Tagesraster der M01-Bilder.
  // Mindesthöhe 60 px: M09-053 (heute M01-511) markiert seine Zeitachse mit 10-px-TICKS, an denen die
  // Balken bewusst nicht ausgerichtet sind (es ist ein Beschriftungsbild, kein Raster).
  // Ohne diese Schranke hätte der Parser die Ticks für ein Gitter gehalten.
  const gruppen = {};
  for (const l of linien) {
    if (Number(l.x1) !== Number(l.x2)) continue;
    if (Math.abs(Number(l.y2) - Number(l.y1)) < 60) continue;
    const k = l.y1 + ":" + l.y2;
    (gruppen[k] = gruppen[k] || []).push(Number(l.x1));
  }
  const beste = Object.values(gruppen).sort((a, b) => b.length - a.length)[0] || [];
  const gitter = [...new Set(beste)].sort((a, b) => a - b);
  const rects = [...svg.matchAll(/<rect\b[^>]*\/>/g)].map(attrsOf);
  // Balken = Rechteck MIT Rahmen und OHNE transform. Damit fallen die Wochenbänder
  // (Flächen ohne stroke) und die Meilenstein-Raute (rotate(45 …)) heraus.
  const balken = rects.filter(r => r.stroke && !r.transform)
    .map(r => ({ x: Number(r.x), y: Number(r.y), w: Number(r.width), h: Number(r.height) }))
    .sort((a, b) => a.y - b.y);
  // Bei der Raute zählt der DREHPUNKT aus dem transform, nicht nur die Rechteck-Position:
  // ein Quadrat, das um einen fremden Punkt gedreht wird, wandert aus seinem Feld.
  const rauten = rects.filter(r => /rotate\(45/.test(r.transform || "")).map(r => {
    const m = /rotate\(45\s+([\d.]+)\s+([\d.]+)\)/.exec(r.transform);
    return {
      x: Number(r.x), y: Number(r.y), w: Number(r.width), h: Number(r.height),
      drehX: m ? Number(m[1]) : NaN, drehY: m ? Number(m[2]) : NaN,
      mitteX: Number(r.x) + Number(r.width) / 2, mitteY: Number(r.y) + Number(r.height) / 2
    };
  });
  const texte = [...svg.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)]
    .map(m => Object.assign(attrs("<text" + m[1] + ">"), { text: m[2] }));
  return { W: vb[2], H: vb[3], gitter, balken, rauten, texte };
  function attrsOf(m) { return attrs(m[0]); }
}

// Abstand zweier benachbarter Gitterlinien; null, wenn uneinheitlich (= nicht linear)
function schrittweite(gitter) {
  if (gitter.length < 3) return null;
  const d = gitter[1] - gitter[0];
  for (let i = 1; i < gitter.length; i++) if (gitter[i] - gitter[i - 1] !== d) return null;
  return d;
}
// Zeitspanne eines Balkens in Einheiten (1-basiert, beide Grenzen einschließlich)
function spanne(b, gitter) {
  const von = gitter.indexOf(b.x), bis = gitter.indexOf(b.x + b.w);
  if (von < 0 || bis < 0) return null;
  return { start: von + 1, ende: bis, dauer: bis - von };
}
// Balken über den Namen in der linken Spalte finden (Grundlinie = Balken-y + 17)
function balkenMit(f, name) {
  const r = raster(f.svg);
  const txt = r.texte.find(t => t.text === name);
  if (!txt) return null;
  const b = r.balken.find(b => Number(txt.y) === b.y + 17);
  if (!b) return null;
  const sp = spanne(b, r.gitter);
  return sp ? Object.assign({}, sp, { rect: b }) : null;
}

// ── 1) Linearität der Zeitachse ──────────────────────────────────────────────────────
{
  const krumm = [];
  for (const f of GANTT) {
    const r = raster(f.svg);
    if (r.gitter.length < 3) continue;          // M01-960 ist ein Legendenbild, kein Balkenplan
    if (schrittweite(r.gitter) === null) krumm.push(f.id + " [" + r.gitter.join(",") + "]");
  }
  check("jede Gantt-Zeitachse ist linear (alle Gitterabstände gleich)", krumm.length === 0,
    krumm.length ? krumm.join(" | ") : "");
}

// ── 2) Balkenkanten liegen auf Gitterlinien und innerhalb der Achse ──────────────────
{
  const daneben = [];
  for (const f of GANTT) {
    const r = raster(f.svg);
    if (r.gitter.length < 3 || !r.balken.length) continue;
    const links = r.gitter[0], rechts = r.gitter[r.gitter.length - 1];
    for (const b of r.balken) {
      if (!r.gitter.includes(b.x) || !r.gitter.includes(b.x + b.w)) {
        daneben.push(f.id + ": Kante " + b.x + "/" + (b.x + b.w) + " nicht auf dem Gitter");
      } else if (b.x < links || b.x + b.w > rechts) {
        daneben.push(f.id + ": Balken ragt über die Zeitachse hinaus");
      }
      if (b.x < 0 || b.y < 0 || b.x + b.w > r.W || b.y + b.h > r.H) {
        daneben.push(f.id + ": Balken außerhalb der viewBox");
      }
    }
  }
  check("jede Balkenkante liegt exakt auf einer Gitterlinie und innerhalb der Achse",
    daneben.length === 0, daneben.length ? daneben.join(" | ") : "");
}

// ── 3) Balken derselben Zeile überlappen nicht ───────────────────────────────────────
{
  const kollision = [];
  for (const f of GANTT) {
    const r = raster(f.svg);
    for (let i = 0; i < r.balken.length; i++) {
      for (let j = i + 1; j < r.balken.length; j++) {
        const a = r.balken[i], b = r.balken[j];
        if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) {
          kollision.push(f.id);
        }
      }
    }
  }
  check("keine zwei Balken überdecken einander", kollision.length === 0,
    [...new Set(kollision)].join(", "));
}

// ── 4) Kein Balken verrät seinen Zeitraum als Text ───────────────────────────────────
//     Die aktive Fassung der M01-481-Regel: die Achse ist die einzige Quelle.
{
  const verraeter = [];
  for (const id of M01_PLAENE) {
    const f = byId(id);
    if (!f) continue;
    const r = raster(f.svg);
    for (const b of r.balken) {
      const drin = r.texte.find(t => Number(t.y) > b.y && Number(t.y) < b.y + b.h + 6 &&
        Number(t.x) > b.x && Number(t.x) < b.x + b.w);
      if (drin) verraeter.push(f.id + ": '" + drin.text + "' steht im Balken");
    }
  }
  check("kein Balken trägt seinen Zeitraum als Text – die Achse ist die einzige Quelle",
    verraeter.length === 0, verraeter.length ? verraeter.join(" | ") : "");
}

// ── 5) Wo ein Balkentext einen Zeitraum nennt, stimmt er mit der Geometrie ───────────
//     Bleibt als Rückfall-Wächter, falls je wieder Text in Balken geschrieben wird.
{
  const luegen = [];
  for (const f of GANTT) {
    const r = raster(f.svg);
    if (!schrittweite(r.gitter)) continue;
    for (const b of r.balken) {
      const beschriftung = r.texte.find(t => Number(t.y) === b.y + 19 &&
        Math.abs(Number(t.x) - (b.x + Math.floor(b.w / 2))) <= 1 && /^Tag \d/.test(t.text));
      if (!beschriftung) continue;
      const sp = spanne(b, r.gitter);
      const m = /^Tag (\d+)(?:-(\d+))?$/.exec(beschriftung.text);
      if (!sp || !m) { luegen.push(f.id + ": Beschriftung '" + beschriftung.text + "' unlesbar"); continue; }
      const von = Number(m[1]), bis = m[2] ? Number(m[2]) : von;
      if (von !== sp.start || bis !== sp.ende) {
        luegen.push(f.id + ": Text '" + beschriftung.text + "' vs. Balken Tag " + sp.start + "-" + sp.ende);
      }
    }
  }
  check("kein Balkentext widerspricht der Balkengeometrie", luegen.length === 0,
    luegen.length ? luegen.join(" | ") : "");
}

// ── 6) Meilenstein-Symbol: Raute, niemals Dreieck/Polygon ────────────────────────────
{
  const polygone = GANTT.filter(f => /<polygon/.test(f.svg)).map(f => f.id);
  check("kein Gantt-SVG zeichnet den Meilenstein als Polygon (Dreieck)", polygone.length === 0,
    polygone.join(", "));
  /* ⚠️ GEAENDERT 2026-07-30: Diese Sanity-Pruefung suchte das WORT "Meilenstein" im SVG als
     Stellvertreter fuer "dieses Diagramm hat einen Meilenstein". Genau dieses Wort war aber der
     Selbstverrat, den Waechter 6 in test_didaktik.js jetzt verbietet: In M09-051 (heute M01-510) lautete die Frage
     "Klicke den Meilenstein an", und die Raute war mit "Meilenstein" beschriftet.
     ►► DER TEST HING AM DEFEKT. Jetzt wird nach der FORM gesucht - rotate(45) ist die Raute, und
     genau die ist das Symbol, dessen Verwendung dieser Abschnitt bewacht. Gemessen: 3 Diagramme
     mit Raute (M01-113, M09-051, M09-053 – die beiden letzten heissen seit dem 04.08.2026
     M01-510 und M01-511), aber nur noch 1 mit dem Wort.
     ⚠️ Ein Test, dessen Suchbegriff das Problem ist, meldet Erfolg, solange das Problem besteht. */
  const mitMS = GANTT.filter(f => /rotate\(\s*45/.test(f.svg));
  check("Gantt-SVGs mit Meilenstein-Raute vorhanden (Symbolpruefung hat Substanz)",
    mitMS.length >= 2, "gefunden: " + mitMS.map(f => f.id).join(", "));
  const ohneRaute = mitMS.filter(f => raster(f.svg).rauten.length === 0).map(f => f.id);
  check("jeder gezeichnete Meilenstein ist eine Raute (rotate(45))", ohneRaute.length === 0,
    ohneRaute.join(", "));
}

// ── 7) Nutzer-Vorgabe: Mindestumfang je AP1-Balkenplan ───────────────────────────────
{
  const zuDuenn = [];
  for (const id of M01_PLAENE) {
    const f = byId(id);
    if (!f) { zuDuenn.push(id + " fehlt"); continue; }
    const r = raster(f.svg);
    const tage = r.gitter.length - 1;
    if (tage < 20) zuDuenn.push(id + ": nur " + tage + " Tage");
    if (r.balken.length < 8) zuDuenn.push(id + ": nur " + r.balken.length + " Vorgänge");
  }
  check("jeder AP1-Balkenplan zeigt >= 20 Arbeitstage und >= 8 Vorgänge (Nutzer-Vorgabe)",
    zuDuenn.length === 0, zuDuenn.join(" | "));
}

// ── 8) Stufenverteilung: der Anlass des Tasks ────────────────────────────────────────
{
  const m01 = FRAGEN.filter(f => f.modul === "M01" && f.thema === "Gantt & PSP");
  const je = s => m01.filter(f => f.schwierigkeit === s).length;
  check("M01 'Gantt & PSP' hat mindestens 12 Fragen", m01.length >= 12, "ist: " + m01.length);
  check("mindestens 4 Fragen auf Stufe 1 (vorher 1)", je(1) >= 4, "ist: " + je(1));
  check("mindestens 4 Fragen auf Stufe 2 (vorher 2)", je(2) >= 4, "ist: " + je(2));
  const untenMitBild = m01.filter(f => f.schwierigkeit <= 2 && f.svg).length;
  check("mindestens 6 der Stufe-1/2-Fragen zeigen ein Diagramm", untenMitBild >= 6, "ist: " + untenMitBild);
}

// ── 9) Die sechs neuen Fragen – Lösungen aus dem BILD nachgerechnet ──────────────────
{
  const q = byId("M01-482");
  check("M01-482 vorhanden, Stufe 1, bild/mc", !!q && q.schwierigkeit === 1 && q.typ === "bild" && q.unterTyp === "mc");
  const sw = q && balkenMit(q, "Switch-Konfiguration");
  check("M01-482: Switch-Konfiguration liegt laut Bild über Tag 11 bis 15",
    !!sw && sw.start === 11 && sw.ende === 15);
  check("M01-482: die als richtig markierte Option nennt das Ende von Tag 15",
    !!q && /Ende von Tag 15/.test(q.optionen[q.loesungIndex]));
  const kab = q && balkenMit(q, "Kabelverlegung");
  check("M01-482: Kabelverlegung und Switch-Konfiguration überlappen sich",
    !!kab && !!sw && kab.ende >= sw.start);
  const vlan = q && balkenMit(q, "VLAN-Einrichtung");
  check("M01-482: der Distraktor 'Ende von Tag 16' trifft den Start des Folgevorgangs",
    !!vlan && vlan.start === 16);
}
{
  const q = byId("M01-483");
  check("M01-483 vorhanden, Stufe 1, hotspot", !!q && q.schwierigkeit === 1 && q.typ === "hotspot");
  const sp = q && balkenMit(q, "Software-Paketierung");
  check("M01-483: die Software-Paketierung deckt laut Bild Tag 9 bis 12 durchgehend ab",
    !!sp && sp.start <= 9 && sp.ende >= 12);
  const richtig = q && q.zonen.filter(z => z.richtig);
  check("M01-483 hat genau eine richtige Zone", !!richtig && richtig.length === 1);
  check("M01-483: die richtige Zone deckt sich exakt mit ihrem Balken",
    !!sp && !!richtig && richtig[0].x === sp.rect.x && richtig[0].y === sp.rect.y &&
    richtig[0].w === sp.rect.w && richtig[0].h === sp.rect.h);
  const r = q && raster(q.svg);
  // Jede FALSCHE Zone muss ebenfalls auf ihrem Balken sitzen (sonst klickt man ins Leere)
  // und darf den Schulungszeitraum NICHT durchgehend abdecken.
  const falsch = q ? q.zonen.filter(z => !z.richtig) : [];
  check("M01-483: alle 7 falschen Zonen sitzen auf einem Balken",
    falsch.length === 7 && falsch.every(z => r.balken.some(b => b.x === z.x && b.y === z.y &&
      b.w === z.w && b.h === z.h)));
  check("M01-483: keine falsche Zone deckt Tag 9 bis 12 durchgehend ab",
    falsch.every(z => {
      const b = r.balken.find(b => b.x === z.x && b.y === z.y);
      const s = b && spanne(b, r.gitter);
      return s && !(s.start <= 9 && s.ende >= 12);
    }));
  // Der eigentliche Stolperstein: ein Vorgang MITTEN im Zeitraum, aber nicht durchgehend.
  const nds = q && balkenMit(q, "Nutzerdaten-Sicherung");
  check("M01-483: die Nutzerdaten-Sicherung liegt im Zeitraum, aber nicht durchgehend",
    !!nds && nds.start >= 9 && nds.ende <= 12 && !(nds.start <= 9 && nds.ende >= 12));
}
{
  const q = byId("M01-484");
  check("M01-484 vorhanden, Stufe 1, bild/dropdown",
    !!q && q.schwierigkeit === 1 && q.typ === "bild" && q.unterTyp === "dropdown");
  const kern = q && balkenMit(q, "Kernbohrung"), mon = q && balkenMit(q, "Montage Klimagerät");
  const pl = q && balkenMit(q, "Planung"), inb = q && balkenMit(q, "Inbetriebnahme");
  const luecke = (kern && mon) ? mon.start - kern.ende - 1 : -1;
  check("M01-484: die Lücke zwischen Kernbohrung und Montage beträgt laut Bild 3 Tage",
    luecke === 3, "ist: " + luecke);
  check("M01-484: Antwort auf Lücke 1 ist die abgelesene Lückenbreite",
    !!q && Number(q.luecken[0].optionen[q.luecken[0].loesung]) === luecke);
  const gesamt = (pl && inb) ? inb.ende - pl.start + 1 : -1;
  check("M01-484: Gesamtdauer laut Bild 20 Tage", gesamt === 20, "ist: " + gesamt);
  check("M01-484: Antwort auf Lücke 2 ist die abgelesene Gesamtdauer",
    !!q && Number(q.luecken[1].optionen[q.luecken[1].loesung]) === gesamt);
  // Der Distraktor 17 muss die SUMME der Balkenlängen sein, sonst führt er nicht in
  // den gemeinten Denkfehler.
  const r = q && raster(q.svg);
  const summe = r && r.balken.reduce((s, b) => s + spanne(b, r.gitter).dauer, 0);
  check("M01-484: der Distraktor ist die Summe der Balkenlängen (Aufwand statt Durchlaufzeit)",
    !!q && summe === 17 && q.luecken[1].optionen.includes(String(summe)), "Summe: " + summe);
}
{
  const q = byId("M01-485");
  check("M01-485 vorhanden, Stufe 2, bild/mc",
    !!q && q.schwierigkeit === 2 && q.typ === "bild" && q.unterTyp === "mc");
  const an = q && balkenMit(q, "Anforderungsanalyse"), pr = q && balkenMit(q, "Programmierung");
  const te = q && balkenMit(q, "Testbetrieb"), sc = q && balkenMit(q, "Schulung");
  const dm = q && balkenMit(q, "Datenmigration"), ab = q && balkenMit(q, "Abnahme");
  // Aussage 1 wahr, 2 falsch, 3 wahr, 4 wahr – GENAU EIN Widerspruch, sonst ist die Frage kaputt.
  check("M01-485 (1) Anforderungsanalyse dauert 3 Tage – wahr", !!an && an.dauer === 3);
  check("M01-485 (2) Testbetrieb startet VOR Ende der Programmierung – die einzige falsche Aussage",
    !!te && !!pr && te.start <= pr.ende);
  check("M01-485 (3) Schulung ist genauso lang wie die Datenmigration – wahr",
    !!sc && !!dm && sc.dauer === dm.dauer);
  const r = q && raster(q.svg);
  const ende = r && Math.max(...r.balken.map(b => spanne(b, r.gitter).ende));
  check("M01-485 (4) Projektende ist das Ende von Tag 20 – wahr", ende === 20, "ist: " + ende);
  check("M01-485: der letzte Balken ist die Abnahme", !!ab && ab.ende === ende);
  check("M01-485: als richtig markiert ist Aussage (2)",
    !!q && q.optionen[q.loesungIndex] === "Aussage (2)");
}
{
  const q = byId("M01-486");
  check("M01-486 vorhanden, Stufe 2, bild/dropdown",
    !!q && q.schwierigkeit === 2 && q.typ === "bild" && q.unterTyp === "dropdown");
  const r = q && raster(q.svg);
  // Die Behauptung der Frage („jeder Vorgang folgt unmittelbar") muss im BILD stimmen –
  // sonst wäre die Rechnung nicht eindeutig.
  const folge = r && r.balken.map(b => spanne(b, r.gitter));
  const lueckenlos = folge && folge.every((s, i) => i === 0 || s.start === folge[i - 1].ende + 1);
  check("M01-486: alle Balken schließen lückenlos aneinander an (kein Puffer)", !!lueckenlos);
  const ech = q && balkenMit(q, "Echtmigration");
  check("M01-486: Echtmigration nach 4 Tagen Verzug an Tag " + (ech && ech.start + 4),
    !!q && !!ech && Number(q.luecken[0].optionen[q.luecken[0].loesung]) === ech.start + 4);
  const ende = folge && Math.max(...folge.map(s => s.ende));
  check("M01-486: Projektende nach 4 Tagen Verzug an Tag " + (ende + 4),
    !!q && Number(q.luecken[1].optionen[q.luecken[1].loesung]) === ende + 4);
}
{
  const q = byId("M01-487");
  check("M01-487 vorhanden, Stufe 2, bild/lueckentext",
    !!q && q.schwierigkeit === 2 && q.typ === "bild" && q.unterTyp === "lueckentext");
  const srv = q && balkenMit(q, "Serverinstallation"), net = q && balkenMit(q, "Netzwerkanschluss");
  const pak = q && balkenMit(q, "Softwarepaketierung"), liz = q && balkenMit(q, "Lizenzprüfung");
  const cli = q && balkenMit(q, "Client-Verteilung");
  check("M01-487: beide Zweige starten laut Bild am selben Tag",
    !!srv && !!pak && srv.start === pak.start);
  check("M01-487: die Zweige laufen sequenziell in sich (A: Server → Netz, B: Paket → Lizenz)",
    !!net && !!srv && net.start === srv.ende + 1 && !!liz && !!pak && liz.start === pak.ende + 1);
  const puffer = (net && liz) ? liz.ende - net.ende : -1;
  check("M01-487: Puffer von Zweig A laut Bild 5 Tage", puffer === 5, "ist: " + puffer);
  check("M01-487: erste Lücke akzeptiert genau diesen Puffer",
    !!q && q.luecken[0].includes(String(puffer)));
  check("M01-487: die Client-Verteilung folgt auf den LÄNGEREN Zweig",
    !!cli && !!liz && cli.start === liz.ende + 1);
  const r = q && raster(q.svg);
  const ende = r && Math.max(...r.balken.map(b => spanne(b, r.gitter).ende));
  check("M01-487: zweite Lücke ist Projektende + 2 Tage",
    !!q && q.luecken[1].includes(String(ende + 2)), "Projektende: " + ende);
  check("M01-487: beide Lücken lassen auch das ausgeschriebene Zahlwort zu",
    !!q && q.luecken.every(l => l.some(x => /^[a-zäöü]+$/.test(x))));
}

// ── 10) Die beiden neu gezeichneten Bestandsfragen ───────────────────────────────────
{
  const q = byId("M01-481");
  const r = q && raster(q.svg);
  check("M01-481: Zeitachse ist jetzt linear", !!r && schrittweite(r.gitter) !== null);
  const ent = q && balkenMit(q, "Entwicklung");
  check("M01-481: der Entwicklungs-Balken dauert laut Bild 10 Tage", !!ent && ent.dauer === 10,
    ent ? "ist: " + ent.dauer : "Balken nicht gefunden");
  check("M01-481: die als richtig markierte Option nennt 10 Tage",
    !!q && q.optionen[q.loesungIndex] === "10 Tage");
  // Die drei Distraktoren müssen im Bild eine Entsprechung haben, sonst sind sie leer.
  const cr = q && balkenMit(q, "Code-Review");
  check("M01-481: der Distraktor '5 Tage' ist die Dauer des Code-Reviews", !!cr && cr.dauer === 5);
  const ende = r && Math.max(...r.balken.map(b => spanne(b, r.gitter).ende));
  check("M01-481: der Distraktor '20 Tage' ist die Gesamtdauer", ende === 20, "ist: " + ende);
  check("M01-481: der Distraktor '15 Tage' ist die Restlaufzeit ab Beginn der Entwicklung",
    !!ent && ende - ent.start + 1 === 15);
}
{
  const q = byId("M01-113");
  const r = q && raster(q.svg);
  check("M01-113: Zeitachse ist jetzt linear", !!r && schrittweite(r.gitter) !== null);
  check("M01-113: die Achse reicht über alle 20 Tage", !!r && r.gitter.length === 21,
    r ? "Gitterlinien: " + r.gitter.length : "");
  check("M01-113: Fragetext nennt den Meilenstein am ENDE von Tag 14",
    !!q && /Ende von Tag 14/.test(q.frage));
  // Die Raute muss dort stehen, wo Tag 14 endet – also auf der 15. Gitterlinie.
  const raute = r && r.rauten[0];
  check("M01-113: die Meilenstein-Raute steht am Ende von Tag 14",
    !!raute && raute.mitteX === r.gitter[14],
    raute ? "Raute bei x=" + raute.mitteX + ", Tagesgrenze bei x=" + r.gitter[14] : "keine Raute");
  check("M01-113: die Raute wird um ihren EIGENEN Mittelpunkt gedreht (sonst wandert sie weg)",
    !!raute && raute.drehX === raute.mitteX && raute.drehY === raute.mitteY,
    raute ? "Drehpunkt " + raute.drehX + "/" + raute.drehY + " vs. Mitte " + raute.mitteX + "/" + raute.mitteY : "");
  const frei = q && balkenMit(q, "Freigabe");
  const spaetestes = r && Math.max(...r.balken.map(b => (spanne(b, r.gitter) || { ende: -1 }).ende));
  check("M01-113: die Freigabe endet tatsächlich als Letzte", !!frei && frei.ende === spaetestes);
  check("M01-113: die als richtig markierte Option ist 'Freigabe'",
    !!q && q.optionen[q.loesungIndex] === "Freigabe");
  // Der Distraktor „Implementierung" lebt davon, dass sie der LÄNGSTE, aber nicht der
  // späteste Balken ist – sonst führt er nicht in den gemeinten Denkfehler.
  const imp = q && balkenMit(q, "Implementierung");
  const laengste = r && Math.max(...r.balken.map(b => spanne(b, r.gitter).dauer));
  check("M01-113: die Implementierung ist der längste, aber nicht der letzte Balken",
    !!imp && imp.dauer === laengste && imp.ende < spaetestes);
}

// ── 11) Gegenproben der Prüffunktionen ───────────────────────────────────────────────
//     Ohne diese Proben belegt ein grüner Lauf oben nichts (Lehre aus FB-R2a).
{
  const krumm = "<svg viewBox='0 0 300 200'>" +
    "<line x1='10' y1='60' x2='10' y2='150' stroke='#ccc'/>" +
    "<line x1='40' y1='60' x2='40' y2='150' stroke='#ccc'/>" +
    "<line x1='100' y1='60' x2='100' y2='150' stroke='#ccc'/></svg>";
  check("Gegenprobe: krumme Achse wird als nicht-linear erkannt",
    schrittweite(raster(krumm).gitter) === null);
  const grade = krumm.replace("x1='100' y1='60' x2='100'", "x1='70' y1='60' x2='70'");
  check("Gegenprobe: gleichmäßige Achse gilt als linear", schrittweite(raster(grade).gitter) === 30);

  const daneben = "<svg viewBox='0 0 300 200'>" +
    "<line x1='10' y1='60' x2='10' y2='150' stroke='#ccc'/>" +
    "<line x1='40' y1='60' x2='40' y2='150' stroke='#ccc'/>" +
    "<line x1='70' y1='60' x2='70' y2='150' stroke='#ccc'/>" +
    "<rect x='10' y='80' width='25' height='30' fill='#cfe3ff' stroke='#2A4B8D'/></svg>";
  const rd = raster(daneben);
  check("Gegenprobe: eine Balkenkante neben dem Gitter wird erkannt",
    spanne(rd.balken[0], rd.gitter) === null);

  const luegner = "<svg viewBox='0 0 300 200'>" +
    "<line x1='10' y1='60' x2='10' y2='150' stroke='#ccc'/>" +
    "<line x1='40' y1='60' x2='40' y2='150' stroke='#ccc'/>" +
    "<line x1='70' y1='60' x2='70' y2='150' stroke='#ccc'/>" +
    "<rect x='10' y='80' width='30' height='30' fill='#cfe3ff' stroke='#2A4B8D'/>" +
    "<text x='25' y='99' font-size='13'>Tag 5-9</text></svg>";
  const rl = raster(luegner);
  const sp = spanne(rl.balken[0], rl.gitter);
  check("Gegenprobe: Balken deckt Tag 1-1 ab, der Text behauptet Tag 5-9",
    sp.start === 1 && sp.ende === 1 && rl.texte[0].text === "Tag 5-9");

  // Die Raute-Erkennung darf ein Dreieck NICHT durchgehen lassen
  const dreieck = "<svg viewBox='0 0 100 100'><polygon points='50,20 45,25 55,25' fill='#c0392b'/>" +
    "<text x='40' y='15'>Meilenstein</text></svg>";
  check("Gegenprobe: ein Polygon-Meilenstein wird nicht als Raute gezählt",
    raster(dreieck).rauten.length === 0 && /<polygon/.test(dreieck));
  const raute = "<svg viewBox='0 0 100 100'><rect x='40' y='40' width='20' height='20' " +
    "stroke='#B8860B' transform='rotate(45 50 50)'/></svg>";
  check("Gegenprobe: eine gedrehte Raute wird erkannt und zählt nicht als Balken",
    raster(raute).rauten.length === 1 && raster(raute).balken.length === 0);
  const verrutscht = raute.replace("rotate(45 50 50)", "rotate(45 20 50)");
  const vr = raster(verrutscht).rauten[0];
  check("Gegenprobe: ein fremder Drehpunkt fällt auf", vr.drehX !== vr.mitteX);

  // Ein Wochenband (Fläche ohne Rahmen) darf nicht als Balken durchgehen – sonst
  // würde jeder Plan scheinbar vier Vorgänge mehr haben.
  const band = "<svg viewBox='0 0 300 200'><rect x='10' y='60' width='90' height='100' fill='#f2f5f9'/>" +
    "<rect x='10' y='80' width='30' height='26' fill='#cfe3ff' stroke='#2A4B8D'/></svg>";
  check("Gegenprobe: Wochenbänder zählen nicht als Balken", raster(band).balken.length === 1);
}

process.exit(report());
