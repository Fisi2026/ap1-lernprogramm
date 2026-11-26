/* ============================================================================
   DIE ANTWORTFORM JE FRAGETYP

   Jede `grade*`-Funktion erwartet die Antwort in einer eigenen Form: mal eine
   Zahl, mal ein Feld, mal ein Objekt. Diese Formen stehen als Kommentar in
   logik.js — und Kommentare veralten.

   Hier steht zu jedem Typ eine Funktion, die aus der FRAGE SELBST die richtige
   Antwort baut. Das ist keine Hilfsfunktion fuer die App, sondern das Rueckgrat
   der Gegenprobe: `antwortform.test.ts` laesst sie ueber ALLE 1131 Fragen laufen
   und verlangt, dass `grade` jede davon als richtig wertet.

   ⛔ Wenn ich die Form eines Typs falsch verstanden habe, faellt das damit fuer
      jede Frage dieses Typs auf — nicht erst, wenn du beim Lernen darueber
      stolperst. Genau dafuer ist es da.

   ⚠️ NICHT fuer die Oberflaeche gedacht. Kein Bildschirm ruft das hier auf;
      es waere die Loesung, nicht die Eingabe des Lernenden.
   ============================================================================ */
import type { Frage, FrageMitWirkTyp, Fragetyp } from "@/daten/typen";
import { istObjekt } from "./pruefe.ts";

/** Typen, deren richtige Antwort sich NICHT aus der Frage ableiten laesst. */
export const NICHT_ABLEITBAR: Record<string, string> = {
  freitext: "wird von Hand bewertet (kein grade in TYP)",
  erklaeren: "wird von Hand bewertet (kein grade in TYP)",
};

/* ⛔ HIER STANDEN BIS 14.09.2026 ZWEI WEITERE AUSNAHMEN, UND BEIDE WAREN FALSCH:
     `kalkulation` — angeblich entscheide "die Aufgabe zur Laufzeit", welche Zellen
       Loesungszellen sind. **Gemessen: 106 von 313 Zellen tragen ein `loesung`-Feld,
       fest im Bestand.** Genau daran erkennt auch gradeKalkulation sie. Die
       Ausnahme war eine Vermutung, die nie jemand nachgezaehlt hat.
     `rechenassistent` — die Schritte tragen wirklich Formeln statt Werte. Aber die
       Rechnung steht ebenfalls laengst in logik.js (`L.instanziiere`), und nach
       der Instanziierung TRAEGT jeder Schritt sein `wert`. Nicht unableitbar,
       sondern eine Stufe frueher abzuleiten.
   ►► Eine Ausnahme, die niemand nachrechnet, wird zur Dauerbefreiung.
      Beide Typen laufen jetzt durch dieselbe Gegenprobe wie alle anderen. */

/** N37 U4 (E60): je Typ ein Bauer, der GENAU die Frage seines Typs bekommt (bei `bild` auch die
    Huelle mit diesem `unterTyp`) und ihre Felder ohne `as` liest. */
type Bauer<T extends Fragetyp> = (f: FrageMitWirkTyp<T>) => unknown;
type BauerTabelle = { [T in Fragetyp]?: Bauer<T> };

/* antwortIndex: number */
const bauMc: Bauer<"mc"> = (f) => f.loesungIndex;

/* auswahl: Array gewaehlter Options-Index je Luecke */
const bauDropdown: Bauer<"dropdown"> = (f) => f.luecken.map((l) => l.loesung);

/* Array Freitext je Luecke; jede Luecke ist eine Liste akzeptierter Schreibweisen */
const bauLueckentext: Bauer<"lueckentext"> = (f) => f.luecken.map((l) => l[0]);

/* {zielIndex: text} – beschriftung und baukasten haben dieselbe Form */
const bauZiele = (ziele: ReadonlyArray<{ loesung: string }>): Record<number, string> => {
  const z: Record<number, string> = {};
  ziele.forEach((t, i) => (z[i] = t.loesung));
  return z;
};

/** Zelle mit `loesung` (Loesungszelle) – feste Zellen tragen nur `v`. Im Schema ist die Zelle `unknown`. */
function loesungDerZelle(zelle: unknown): unknown[] | null {
  if (typeof zelle !== "object" || zelle === null || !("loesung" in zelle)) return null;
  return Array.isArray(zelle.loesung) ? zelle.loesung : null;
}

const BAUER: BauerTabelle = {
  mc: bauMc,

  /* ⚠️ GEMESSEN AM 11.09.2026, vom Test gefunden: "bild" ist KEIN eigener Typ, sondern
     eine Huelle. grade verteilt ueber `frage.unterTyp || "mc"`. Im Bestand:
     22x mc, 6x dropdown, 1x lueckentext. Die erste Fassung nahm mc an und liess
     7 von 29 Fragen durchfallen. ►► Hier wird derselbe Weg gegangen wie in grade.
     N37 U4: das Schema kennt genau diese drei `unterTyp` – der switch ist vollstaendig. */
  bild: (f) => {
    switch (f.unterTyp) {
      case "mc":
        return bauMc(f);
      case "dropdown":
        return bauDropdown(f);
      case "lueckentext":
        return bauLueckentext(f);
      default:
        return undefined;   // N38 Q4: wie vorher (Funktion fiel unten heraus) – richtigeAntwort liefert { wert: undefined }
    }
  },

  /* indizes: Array gewaehlter Options-Indizes */
  mehrfach: (f) => f.loesungIndizes,

  dropdown: bauDropdown,

  /* zuordnung: {linksIndex: rechtsIndex} — die Kennzeichnung ist die Identitaet.
     Vergleich in gradeZuordnung ist TEXTBASIERT, damit mehrere Aussagen auf
     dieselbe Kategorie zeigen duerfen. */
  zuordnung: (f) => {
    const z: Record<number, number> = {};
    f.paare.forEach((_, i) => (z[i] = i));
    return z;
  },

  /* reihenfolge: Original-Indizes in Nutzer-Reihenfolge; richtig ist 0,1,2,… */
  reihenfolge: (f) => f.schritte.map((_, i) => i),

  /* index der angeklickten Zone */
  hotspot: (f) => f.zonen.findIndex((z) => z.richtig === true),

  /* zeileIndex der fehlerhaften Zeile */
  fehlersuche: (f) => f.fehlerZeile,

  /* Array Bool je Aussage */
  mtf: (f) => f.aussagen.map((a) => a.wahr),

  /* 2D-Bool-Feld, Zeilen x Spalten */
  kreuztabelle: (f) => f.loesung,

  /* {s1, s2}: beide Schritte muessen stimmen */
  szenario2: (f) => ({ s1: f.schritt1.loesungIndex, s2: f.schritt2.loesungIndex }),

  /* {elementIndex: quadrantIndex} */
  matrix: (f) => {
    const z: Record<number, number> = {};
    f.elemente.forEach((e, i) => (z[i] = e.quadrant));
    return z;
  },

  /* {zielIndex: labelText} */
  beschriftung: (f) => bauZiele(f.ziele),

  /* {zielIndex: bausteinText} */
  baukasten: (f) => bauZiele(f.ziele),

  /* 2D-Feld [zeile][spalte] — die Zeilen der Frage sind bereits die Loesung */
  trace: (f) => f.zeilen,

  /* Array je Aufgabe; die erste akzeptierte Schreibweise ist die Musterloesung */
  konsole: (f) => f.aufgaben.map((a) => a.akzeptiert[0]),

  lueckentext: bauLueckentext,

  /* {"zeile,spalte": wert} — NUR fuer Zellen mit `loesung`. Feste Zellen (`v`)
     werden von gradeKalkulation uebersprungen und duerfen nicht im Satz stehen. */
  kalkulation: (f) => {
    const z: Record<string, string> = {};
    f.zeilen.forEach((row, r) =>
      row.forEach((zelle, c) => {
        const loesung = loesungDerZelle(zelle);
        if (loesung) z[r + "," + c] = String(loesung[0]);
      }),
    );
    return z;
  },

  /* Array je Schritt.
     ⛔ VERLANGT EINE INSTANZIIERTE FRAGE. In der rohen Pool-Frage traegt ein Schritt
        nur `formel`; `wert` und `loesung` entstehen erst in L.instanziiere. Ohne die
        gibt es hier nichts abzuleiten — das ist kein Rueckfall, das ist die
        Reihenfolge. (`wert` steht nicht im Schema; der Schritt traegt eine Index-Signatur.) */
  rechenassistent: (f) =>
    f.schritte.map((s) => {
      if (typeof s.wert === "number") return String(s.wert);
      return Array.isArray(s.loesung) ? (s.loesung[0] ?? "") : "";
    }),
};

/** Baut die richtige Antwort — oder null, wenn sie sich nicht ableiten laesst. */
export function richtigeAntwort(f: Frage): { wert: unknown } | null {
  /* N37 U4: EINE Umwandlung, begruendet wie in `eingabeFuer` – TS sieht nicht, dass `BAUER[f.typ]` genau
     zu `f` passt (korrelierte Union); das sichert `BauerTabelle` (je Schluessel der Bauer SEINES Typs). */
  const bauer = BAUER[f.typ] as Bauer<Fragetyp> | undefined;
  if (!bauer) return null;
  return { wert: bauer(f) };
}

/** Verbiegt einen einzelnen Antworttext so, dass er sicher falsch ist.

    ⛔⛔ GEFUNDEN AM 14.09.2026, ALS `rechenassistent` DAZUKAM: bis dahin wurde an
       jede Text-Antwort schlicht "###falsch" angehaengt. Bei einer ZAHL bringt das
       nichts — `zahlAusText("3###falsch")` liefert ueber `parseFloat` weiterhin
       **3**, und die verbogene Antwort galt bei **27 von 29** Fragen weiter als
       richtig. Die Gegenprobe war fuer numerische Typen also blind.
       ►► Eine Zahl wird jetzt NUMERISCH verbogen (+7,77 — weit jenseits jeder
          Toleranz, die `toleranzFuer` je vergibt), Text weiter per Anhang.
       ⚠️ Bewusst kein NaN erzeugt: dann pruefte die Probe den Parser, nicht den
          Vergleich. */
function verbiegeText(wert: string): string {
  const roh = wert.trim().replace(",", ".");
  const zahl = Number(roh);
  if (roh !== "" && Number.isFinite(zahl)) return String(zahl + 7.77);
  return wert + "###falsch";
}

/** Verbiegt das erste Element einer Liste — null, wenn sich nichts verbiegen laesst. */
function falscheListe(w: unknown[]): { wert: unknown } | null {
  if (w.length === 0) return null; // nichts zu verbiegen
  const kopie = [...w];
  const erst = kopie[0];
  if (typeof erst === "number") kopie[0] = erst === 0 ? 999 : 0;
  else if (typeof erst === "boolean") kopie[0] = !erst;
  else if (typeof erst === "string") kopie[0] = verbiegeText(erst);
  else if (Array.isArray(erst)) kopie[0] = erst.map(() => "###falsch");
  else return null;
  return { wert: kopie };
}

/** Verbiegt den ersten Wert eines Objekts — null, wenn sich nichts verbiegen laesst. */
function falschesObjekt(w: Record<string, unknown>): { wert: unknown } | null {
  const kopie = { ...w };
  const schluessel = Object.keys(kopie);
  if (schluessel.length === 0) return null;
  const k = schluessel[0]!; // Laenge oben auf > 0 geprueft
  const v = kopie[k];
  if (typeof v === "number") kopie[k] = v === 0 ? 999 : 0;
  else if (typeof v === "string") kopie[k] = verbiegeText(v);
  else return null;
  return { wert: kopie };
}

/** Baut eine absichtlich FALSCHE Antwort. Ohne sie waere die Gegenprobe halb:
    ein grade, das immer true liefert, faellt sonst nicht auf. */
export function falscheAntwort(f: Frage): { wert: unknown } | null {
  const richtig = richtigeAntwort(f);
  if (!richtig) return null;
  const w = richtig.wert;
  if (typeof w === "number") return { wert: w === 0 ? 1 : 0 };
  if (typeof w === "boolean") return { wert: !w };
  if (typeof w === "string") return { wert: verbiegeText(w) };
  if (Array.isArray(w)) return falscheListe(w);
  if (istObjekt(w)) return falschesObjekt(w);   // Listen sind oben schon behandelt
  return null;
}
