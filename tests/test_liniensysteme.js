/* Test (FB-R3 Punkt 4): Leitungs-/Liniensysteme – Fachlichkeit UND Bildgeometrie.

   ANLASS (2026-07-22): Der Bestandsabgleich fand einen SELBSTWIDERSPRUCH im Pool. M07-311 und
   M07-312 bezeichneten ein Fachbereich-plus-Projekt-Beispiel als MEHRLINIENorganisation – das ist
   eine MATRIX. M07-410/024 und M07-709 erklärten es zugleich richtig. Je nachdem, welche Frage
   gezogen wurde, lernte man es richtig oder falsch.
   Dazu waren beide Organigramm-SVGs kaputt: M07-009 fehlte eine Weisungslinie und hatte zwei
   Linien ins Leere, M07-117 hatte überlappende Boxen und sechs Linien ohne Ziel.

   DIESE SUITE BEWACHT BEIDES:
   1. Die Begriffe – ein Text, der Fachbereich UND Projekt nennt, darf nicht „Mehrlinie" heißen.
   2. Die Geometrie – kein SVG darf überlappende Boxen oder Linienenden im Nichts haben.
      (cairosvg ist in dieser Umgebung nicht installierbar, pip/npm sind gesperrt. Die
      Geometrieprüfung ersetzt die Sichtprüfung nicht, fängt aber genau die zwei Fehlerklassen,
      die hier tatsächlich aufgetreten sind.) */
const { t: check, report } = require("./_harness.js");
const FRAGEN = require("./fragen.js");

const LINIEN = FRAGEN.filter(f =>
  /[Ee]inlinien|[Mm]ehrlinien|[Ss]tablinie|[Ss]tabsstelle|Matrixorganisation|Liniensystem|Leitungssystem|Funktionsmeister/
    .test(JSON.stringify(f)));

check("Liniensystem-Fragen im Pool gefunden (>= 15)", LINIEN.length >= 15);

// ── 1) Begriffs-Wächter: Mehrlinie darf nicht mit Matrix verwechselt werden ──────────
{
  /* Ein Text beschreibt eine MATRIX, wenn er Fach-/Funktionsebene UND Projektebene als die
     beiden Weisungsquellen nennt. Steht in demselben Textstück „Mehrlinie", ist es falsch. */
  const projekt = /[Pp]rojektleit|[Pp]rojektleiter|[Pp]rojektebene/;
  const fach = /Fachbereichsleit|Funktionsleit|IT-Leiter|Fachvorgesetzt|fachliche Leitung|Abteilungsleit/;
  const mehrlinie = /[Mm]ehrlinien/;
  const matrix = /[Mm]atrix/;
  const verdacht = [];
  for (const f of LINIEN) {
    for (const feld of ["frage", "erklaerungKurz", "erklaerungLang"]) {
      const t = f[feld];
      if (!t) continue;
      // Nur Textstücke prüfen, die NICHT ausdrücklich die Abgrenzung erklären
      if (matrix.test(t)) continue;             // nennt Matrix -> grenzt bewusst ab
      if (mehrlinie.test(t) && projekt.test(t) && fach.test(t)) {
        verdacht.push(f.id + "/" + feld);
      }
    }
  }
  check("kein Text nennt ein Fachbereich+Projekt-Beispiel 'Mehrlinie' (ohne Matrix zu erwähnen)",
    verdacht.length === 0, verdacht.length ? "Verdacht: " + verdacht.join(", ") : "");
}
{
  // Die Abgrenzung muss im Pool ÜBERHAUPT erklärt sein – sonst ist der Wächter oben wertlos.
  const erklaert = LINIEN.filter(f =>
    /[Mm]ehrlinien/.test(JSON.stringify(f)) && /[Mm]atrix/.test(JSON.stringify(f)));
  check("die Abgrenzung Mehrlinie/Matrix wird mindestens 3× ausdrücklich erklärt", erklaert.length >= 3);
  const dimension = LINIEN.filter(f => /Gliederungsdimension|zwei Dimensionen|zwei verschiedene.{0,20}Dimension/i
    .test(JSON.stringify(f)));
  check("das Unterscheidungsmerkmal 'Dimension' kommt vor", dimension.length >= 2);
}
{
  // Funktionsmeisterprinzip gehört zur Mehrlinie, nicht zur Matrix
  const fm = FRAGEN.filter(f => /Funktionsmeister/.test(JSON.stringify(f)));
  check("Funktionsmeisterprinzip ist erwähnt", fm.length >= 1);
  const falsch = fm.filter(f => {
    const s = JSON.stringify(f);
    return /Funktionsmeister/.test(s) && /Matrix/.test(s) && !/[Mm]ehrlinien/.test(s);
  });
  check("Funktionsmeister wird nicht der Matrix zugeschrieben", falsch.length === 0);
}

// ── 2) Stabsstelle: nie weisungsbefugt ───────────────────────────────────────────────
{
  const stab = FRAGEN.filter(f => /[Ss]tabsstelle/.test(JSON.stringify(f)));
  check("Stabsstellen-Fragen vorhanden", stab.length >= 3);
  const widerspruch = stab.filter(f =>
    /Stabsstelle[^.]{0,80}(hat|mit) Weisungsbefugnis/.test(JSON.stringify(f)) &&
    !/KEINE Weisungsbefugnis|keine Weisungsbefugnis|ohne Weisungsbefugnis/.test(JSON.stringify(f)));
  check("keine Frage schreibt der Stabsstelle Weisungsbefugnis zu", widerspruch.length === 0);
}

// ── 3) Bildgeometrie aller Liniensystem-SVGs ─────────────────────────────────────────
function geometrie(svg) {
  const mvb = /viewBox='([^']+)'/.exec(svg) || /viewBox="([^"]+)"/.exec(svg);
  const vb = mvb ? mvb[1].trim().split(/\s+/).map(Number) : [0, 0, 0, 0];
  const W = vb[2], H = vb[3];
  const rects = [...svg.matchAll(/<rect x='(\d+)' y='(\d+)' width='(\d+)' height='(\d+)'/g)]
    .map(m => m.slice(1).map(Number));
  const lines = [...svg.matchAll(/<line x1='(\d+)' y1='(\d+)' x2='(\d+)' y2='(\d+)'/g)]
    .map(m => m.slice(1).map(Number));
  const circs = [...svg.matchAll(/<circle cx='(\d+)' cy='(\d+)' r='(\d+)'/g)]
    .map(m => m.slice(1).map(Number));
  const fehler = [];
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const [ax, ay, aw, ah] = rects[i], [bx, by, bw, bh] = rects[j];
      if (ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah) {
        fehler.push("Boxen überlappen");
      }
    }
  }
  for (const L of lines) {
    const [x1, y1, x2, y2] = L;
    for (const [px, py] of [[x1, y1], [x2, y2]]) {
      const anBox = rects.some(([x, y, w, h]) => px >= x - 2 && px <= x + w + 2 && py >= y - 2 && py <= y + h + 2);
      const anKreis = circs.some(([cx, cy, r]) => (px - cx) ** 2 + (py - cy) ** 2 <= (r + 2) ** 2);
      const anLinie = lines.some(o => o !== L &&
        px >= Math.min(o[0], o[2]) - 2 && px <= Math.max(o[0], o[2]) + 2 &&
        py >= Math.min(o[1], o[3]) - 2 && py <= Math.max(o[1], o[3]) + 2);
      if (!anBox && !anKreis && !anLinie) fehler.push("Linienende ohne Anschluss (" + px + "," + py + ")");
    }
  }
  for (const [x, y, w, h] of rects) {
    if (x < 0 || y < 0 || (W && x + w > W) || (H && y + h > H)) fehler.push("Box außerhalb viewBox");
  }
  return { fehler, rects: rects.length, lines: lines.length };
}

{
  const mitSvg = LINIEN.filter(f => f.svg);
  check("Liniensystem-Fragen mit SVG vorhanden (>= 6)", mitSvg.length >= 6);
  const kaputt = [];
  for (const f of mitSvg) {
    const g = geometrie(f.svg);
    if (g.fehler.length) kaputt.push(f.id + ": " + [...new Set(g.fehler)].join(" / "));
  }
  check("kein Liniensystem-SVG hat überlappende Boxen oder Linienenden im Leeren",
    kaputt.length === 0, kaputt.length ? kaputt.join(" | ") : "");

  // Gegenprobe der Prüffunktion selbst: ein künstlich kaputtes SVG MUSS auffallen.
  const kaputtProbe = "<svg viewBox='0 0 100 100'>" +
    "<rect x='10' y='10' width='40' height='20'/><rect x='30' y='10' width='40' height='20'/>" +
    "<line x1='10' y1='60' x2='90' y2='60'/></svg>";
  const probe = geometrie(kaputtProbe);
  check("Prüffunktion erkennt überlappende Boxen", probe.fehler.some(x => /überlappen/.test(x)));
  check("Prüffunktion erkennt Linienenden im Leeren", probe.fehler.some(x => /ohne Anschluss/.test(x)));
  const heilProbe = "<svg viewBox='0 0 100 100'>" +
    "<rect x='10' y='10' width='30' height='20'/><rect x='60' y='10' width='30' height='20'/>" +
    "<line x1='25' y1='30' x2='75' y2='30'/></svg>";
  check("Prüffunktion meldet sauberes SVG nicht", geometrie(heilProbe).fehler.length === 0);
}

// ── 4) Die konkret reparierten Fragen ────────────────────────────────────────────────
const byId = id => FRAGEN.find(f => f.id === id);
{
  const q = byId("M07-312");
  check("M07-312 vorhanden", !!q);
  check("M07-312 führt die Matrixorganisation auf",
    !!q && q.paare.some(p => /Matrixorganisation/.test(p[0])));
  check("M07-312 hat 5 Zuordnungspaare", !!q && q.paare.length === 5);
  const mehr = q && q.paare.find(p => /Mehrlinien/.test(p[0]));
  check("M07-312 beschreibt Mehrlinie über Fachvorgesetzte, nicht über Projekte",
    !!mehr && /[Ff]achvorgesetzt|Funktionsmeister/.test(mehr[1]) && !/[Pp]rojekt/.test(mehr[1]));
}
{
  const q = byId("M07-311");
  check("M07-311 nennt kein Projekt-Beispiel mehr in der Frage", !!q && !/[Pp]rojektleit/.test(q.frage));
  check("M07-311 grenzt in der Erklärung gegen die Matrix ab", !!q && /[Mm]atrix/.test(q.erklaerungLang));
}
{
  const q = byId("M07-412");
  check("M07-412 hat 6 Zeilen × 4 Spalten", !!q && q.zeilen.length === 6 && q.spalten.length === 4);
  check("M07-412 Lösungsmatrix passt zur Größe",
    !!q && q.loesung.length === 6 && q.loesung.every(z => z.length === 4));
  const i = q ? q.zeilen.findIndex(z => /Gliederungsdimension/.test(z)) : -1;
  check("M07-412 enthält die Zeile mit den zwei Gliederungsdimensionen", i >= 0);
  check("M07-412: diese Zeile trifft NUR auf die Matrix zu",
    i >= 0 && JSON.stringify(q.loesung[i]) === JSON.stringify([false, false, false, true]));
  const j = q ? q.zeilen.findIndex(z => /nur beraten/.test(z)) : -1;
  check("M07-412: 'nur beraten' trifft NUR auf die Stablinie zu",
    j >= 0 && JSON.stringify(q.loesung[j]) === JSON.stringify([false, false, true, false]));
}
{
  const q = byId("M07-413");
  check("M07-413 behauptet nicht mehr, der Aufsichtsrat sei ein reines AG-Organ",
    !!q && !/Hauptversammlung und Aufsichtsrat sind AG-Organe/.test(q.erklaerungKurz + q.erklaerungLang));
  check("M07-413 nennt § 52 GmbHG", !!q && /52 GmbHG/.test(q.erklaerungLang));
}
{
  const q = byId("M07-009");
  check("M07-009 Bildunterschrift verrät die Organisationsform nicht mehr",
    !!q && !/untersteht einem Fachbereichsleiter \(durchgezogen\) UND einem Projektleiter/.test(q.svg));
  check("M07-009 hat eine neutrale Legende", !!q && /durchgezogen = Weisung der Fachbereichsleitung/.test(q.svg));
}
{
  const q = byId("M07-109");
  check("M07-109 Tippfehler behoben", !!q && !/Positzionen/.test(JSON.stringify(q)));
}

process.exit(report());
