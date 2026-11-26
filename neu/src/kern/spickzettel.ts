/* ============================================================================
   DER SPICKZETTEL — SEKTIONEN, SUCHE, MARKDOWN

   Der Inhalt ist Bestand: `tabellen/spickzettel.ts` (aus 99_Spickzettel.md), eine Zeichenkette
   mit neun Abschnitten. ⛔ Hier wird nichts erzeugt und nichts umgeschrieben —
   nur geordnet.

   ⚠️ WARUM HIER EIN MARKDOWN-LESER STEHT UND DAS KEIN FORK IST: `mdToHtml` der
      alten App wohnt in `app_pages2.js` — einer Seiten-Datei ohne Export, die
      HTML-Zeichenketten zusammensetzt. Das ist DARSTELLUNG, nicht Regel; die
      neue Oberflaeche zeichnet ihre Bloecke selbst, wie bei jedem Fragetyp auch.
      ►► Die Zusicherung dazu steht im Test: **jede Zeile des echten Bestands
         muss in einem BEKANNTEN Blocktyp landen.** Kommt im Spickzettel je eine
         Schreibweise dazu, die dieser Leser nicht kennt, wird der Test rot —
         statt dass eine Zeile still als Absatz durchrutscht.
   ============================================================================ */
import { SPICKZETTEL } from "./tabellen/spickzettel.ts";

export interface Sektion {
  /** Die Ueberschrift ohne die Rauten. */
  titel: string;
  /** Der Abschnitt OHNE seine Ueberschriftszeile. */
  koerper: string;
  /** Titel + Koerper in Kleinschreibung — die Suche liest genau das. */
  suchtext: string;
}

/** Ein Stueck Fliesstext mit Auszeichnung. `text` ist bereits roh (unescaped). */
export type Teil =
  | { art: "text"; text: string }
  | { art: "fett"; text: string }
  | { art: "kursiv"; text: string }
  | { art: "code"; text: string };

export type Block =
  | { art: "ueberschrift"; teile: Teil[] }
  | { art: "zitat"; teile: Teil[] }
  | { art: "liste"; geordnet: boolean; punkte: Teil[][] }
  | { art: "tabelle"; kopf: Teil[][]; zeilen: Teil[][][] }
  | { art: "absatz"; teile: Teil[] };

/* ⛔ DIESELBE TRENNUNG WIE IN DER ALTEN APP (`sSpickzettel`): vor jeder Zeile,
   die mit einer oder zwei Rauten beginnt. Eine dritte Raute trennt NICHT — sie
   gliedert innerhalb eines Abschnitts. */
const TRENNER = /\n(?=#{1,2}\s)/;

export function sektionen(quelle: string = SPICKZETTEL): Sektion[] {
  return quelle
    .split(TRENNER)
    .filter((s) => s.trim())
    .map((s) => {
      const titel = (s.match(/^#{1,6}\s+(.+)/) ?? [])[1] ?? "Abschnitt";
      const koerper = s.replace(/^#{1,6}\s+.+\n?/, "");
      return { titel, koerper, suchtext: s.toLowerCase() };
    });
}

/** Welche Abschnitte die Suche uebrig laesst. Leerer Suchtext: alle.
    ⚠️ Gesucht wird im GANZEN Abschnitt samt Ueberschrift — wer "Netzplan"
    eintippt, will den Abschnitt auch dann sehen, wenn das Wort nur im Titel steht. */
export function gefiltert(alle: readonly Sektion[], suche: string): Sektion[] {
  const f = (suche || "").toLowerCase().trim();
  if (!f) return [...alle];
  return alle.filter((s) => s.suchtext.indexOf(f) >= 0);
}

/* ---- Auszeichnung im Fliesstext ------------------------------------------
   Reihenfolge wie in `mdInline`: **fett** vor *kursiv*, dann `code`. */
const AUSZEICHNUNG = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/;

export function teile(zeile: string): Teil[] {
  const raus: Teil[] = [];
  for (const stueck of zeile.split(AUSZEICHNUNG)) {
    if (!stueck) continue;
    if (stueck.startsWith("**") && stueck.endsWith("**") && stueck.length > 4)
      raus.push({ art: "fett", text: stueck.slice(2, -2) });
    else if (stueck.startsWith("`") && stueck.endsWith("`") && stueck.length > 2)
      raus.push({ art: "code", text: stueck.slice(1, -1) });
    else if (stueck.startsWith("*") && stueck.endsWith("*") && stueck.length > 2)
      raus.push({ art: "kursiv", text: stueck.slice(1, -1) });
    else raus.push({ art: "text", text: stueck });
  }
  return raus;
}

/** Der Koerper eines Abschnitts als Bloecke. Der Absatz ist der Auffangzweig -
    genau wie in `mdToHtml`. Was das absichert, steht im Kopf dieser Datei. */
export function bloecke(koerper: string): Block[] {
  const zeilen = koerper.split("\n");
  const raus: Block[] = [];
  let i = 0;
  while (i < zeilen.length) {
    const z = zeilen[i]!; // i < zeilen.length (Schleife)
    if (/^\s*$/.test(z) || /^-{3,}\s*$/.test(z)) { i++; continue; }
    if (/^#{1,6}\s/.test(z)) {
      raus.push({ art: "ueberschrift", teile: teile(z.replace(/^#+\s/, "")) }); i++; continue;
    }
    if (/^>\s/.test(z)) {
      raus.push({ art: "zitat", teile: teile(z.replace(/^>\s/, "")) }); i++; continue;
    }
    if (/^\s*[-*]\s/.test(z)) {
      const punkte: Teil[][] = [];
      while (i < zeilen.length && /^\s*[-*]\s/.test(zeilen[i]!)) {
        punkte.push(teile(zeilen[i]!.replace(/^\s*[-*]\s/, ""))); i++;
      }
      raus.push({ art: "liste", geordnet: false, punkte }); continue;
    }
    if (/^\s*\d+\.\s/.test(z)) {
      const punkte: Teil[][] = [];
      while (i < zeilen.length && /^\s*\d+\.\s/.test(zeilen[i]!)) {
        punkte.push(teile(zeilen[i]!.replace(/^\s*\d+\.\s/, ""))); i++;
      }
      raus.push({ art: "liste", geordnet: true, punkte }); continue;
    }
    if (/^\s*\|/.test(z)) {
      const rohzeilen: string[] = [];
      while (i < zeilen.length && /^\s*\|/.test(zeilen[i]!)) { rohzeilen.push(zeilen[i]!); i++; }
      const zellen = rohzeilen.map((r) =>
        r.trim().replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim()),
      );
      /* ⛔ Zeile 2 ist der Trennstrich der Markdown-Tabelle, nicht Inhalt —
         genau wie `mdTabelle` es haelt (`cells.slice(2)`). */
      raus.push({
        art: "tabelle",
        kopf: (zellen[0] ?? []).map(teile),
        zeilen: zellen.slice(2).map((r) => r.map(teile)),
      });
      continue;
    }
    raus.push({ art: "absatz", teile: teile(z) });
    i++;
  }
  return raus;
}
