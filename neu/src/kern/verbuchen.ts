/* ============================================================================
   EINE ANTWORT VERBUCHEN

   Die alte App tut das in `app_verbuchen.js` — **34 Zeilen**, und fast jede davon
   ruft nur `L.*` auf. Das ist kein Zufall: die Regeln, wann eine Frage ins
   Fehler-Deck wandert, wann sie es verlaesst und wann ein Thema aufsteigt, stehen
   in logik.js. Diese Datei uebersetzt sie nicht — sie ruft sie.

   ⛔ WAS HIER PASSIERT, IST DER LERNSTAND SELBST. Ein Fehler faellt nicht sofort
      auf: er zeigt sich Wochen spaeter als "warum kommt diese Frage nie wieder"
      oder "warum bin ich immer noch auf Anfaenger". Deshalb steht neben dieser
      Datei `verbuchen.gleichheit.test.ts`, der `app_verbuchen.js` WIRKLICH
      AUSFUEHRT und ueber lange Antwortfolgen Zeichen fuer Zeichen vergleicht.

   ⚠️ `heute` ist ein Parameter, kein `Date.now()` mitten im Code. Sonst haengt
      jede Faelligkeit an der Uhr des Rechners, und kein Test kann einen zweiten
      Tag ueberhaupt erreichen.
   ============================================================================ */
import { CONFIG } from "./tabellen/konfig.ts";
import type { Lernstand } from "./stand";
import { jsonKopie } from "./kopie.ts";
import { istObjekt } from "./pruefe.ts";
import { adaptivBuchen, dayKey, fdOnCorrect, fdOnWrong, themaKey } from "./lernen.ts";

/* ⛔⛔ GEMESSEN AM 14.09.2026, vom Typpruefer gefunden: **der Typraum zur LAUFZEIT ist
   groesser als `FRAGETYPEN`.** logik.js baut Zufallsaufgaben und gibt ihnen
   `typ: "generator"` (dazu einmal `typ: "gantt"`) — die stehen in KEINER Pool-Datei
   und kommen trotzdem beim Verbuchen an, sobald die neue Oberflaeche sie anbietet.
   ►► Deshalb nimmt `verbuche` nicht `Frage`, sondern das Wenige, das es wirklich
      liest. `Frage` passt da hinein; eine erfundene Erweiterung von `FRAGETYPEN`
      waere gelogen, denn im Bestand gibt es diese Typen nicht. */
export interface VerbuchbareFrage {
  id: string;
  modul: string;
  thema?: string;
  /** bewusst `string`: "generator" und "gantt" entstehen erst zur Laufzeit. */
  typ: string;
}

/** Aus app_pool.js: UNTERRICHT_MODUL[0]. Die Klausurvorbereitung ist kein
    gewoehnliches Modul — ihre Fehler sind SOFORT wieder faellig. */
export const UNTERRICHT_MODUL = "M09";

export function istUnterricht(f: VerbuchbareFrage): boolean {
  return !!f && f.modul === UNTERRICHT_MODUL;
}

export interface VerbuchOptionen {
  /** Der Zeitpunkt in Millisekunden. Vorgabe: jetzt. */
  heute?: number;
  /** Wie in der alten App: manche Wege buchen bewusst NICHT ins Fehler-Deck. */
  keinFehlerDeck?: boolean;
}

/** Bucht eine beantwortete Frage und liefert den NEUEN Stand.

    ⛔ Die Vorlage (`app_verbuchen.js`) aendert den Stand an Ort und Stelle, weil
       die alte Oberflaeche ihn danach einfach neu zeichnet. React braucht ein
       neues Objekt, sonst sieht es die Aenderung nicht. Kopiert wird ueber JSON —
       genau die Form, in der der Stand ohnehin gespeichert wird, also verliert
       die Kopie nichts, was ueberhaupt ueberleben koennte. */
export function verbuche(
  stand: Lernstand,
  frage: VerbuchbareFrage,
  korrekt: boolean,
  opt: VerbuchOptionen = {},
): Lernstand {
  const jetzt = typeof opt.heute === "number" ? opt.heute : Date.now();
  const s = jsonKopie(stand);

  /* --- Statistik je Modul und je Feinthema --- */
  const statistik = s.statistik;
  const modul = (statistik[frage.modul] ??= { richtig: 0, gesamt: 0 });
  modul.gesamt++;
  if (korrekt) modul.richtig++;

  const themaSchluessel = "T:" + frage.modul + ":" + frage.thema;
  const thema = (statistik[themaSchluessel] ??= { richtig: 0, gesamt: 0 });
  thema.gesamt++;
  if (korrekt) thema.richtig++;

  /* --- die letzten 30 Antworten (Adaptivitaet) --- */
  const antworten = s.antworten;
  antworten.push({ richtig: korrekt });
  if (antworten.length > 30) antworten.shift();

  /* --- Tageszaehler --- */
  const tag = dayKey(jetzt);
  const tage = s.dailyCounts;
  tage[tag] = (tage[tag] || 0) + 1;

  /* --- Fehler-Deck ---
     ⚠️ M09 bekommt ein Erstintervall von 0 Tagen: eine falsch beantwortete Frage
        der Klausurvorbereitung ist SOFORT wieder faellig und kommt noch in
        derselben Sitzung zurueck. Wer am Vorabend einer Klausur uebt, bekaeme
        seine Fehler sonst erst am Pruefungsmorgen wieder vorgelegt. */
  const fdTage = istUnterricht(frage)
    ? CONFIG.fdTageFehlerUnterricht
    : undefined;
  const deck = s.fehlerDeck;

  if (deck[frage.id]) {
    if (korrekt) fdOnCorrect(deck, frage.id, jetzt);
    else fdOnWrong(deck, frage.id, jetzt, fdTage);
  } else if (!korrekt && !opt.keinFehlerDeck) {
    fdOnWrong(deck, frage.id, jetzt, fdTage);
  }

  /* --- adaptive Stufe JE THEMA ---
     Nur im Automatik-Modus; "manuell" bleibt Uebersteuerung durch den Lerner.
     Generator-Pseudofragen tragen kein echtes Thema und werden nicht gewertet. */
  if (s.levelModus === "auto" && frage.thema && frage.typ !== "generator") {
    adaptivBuchen(
      s.themaLevel,
      s.themaTrack,
      themaKey(frage.modul, frage.thema),
      korrekt,
      s.level,
    );
  }

  return s;
}

/** Merkt sich, dass eine Frage gezeigt wurde — getrennt vom Verbuchen, weil die
    alte App es auch trennt (app_seiten.js: `seen` beim Ziehen, `lastShown` beim
    Zeichnen). `lastShown` ist auf 50 begrenzt; daran haengt die Sperrfrist. */
export function merkeGezeigt(stand: Lernstand, id: string): Lernstand {
  const s = jsonKopie(stand);
  s.seen[id] = true;
  const zuletzt = s.lastShown;
  zuletzt.push(id);
  if (zuletzt.length > 50) zuletzt.shift();
  return s;
}

/* ------------------------------------------------------------------ das Urteil */

/** Was gebucht werden soll — oder `null`, wenn es dafuer noch zu frueh ist. */
export interface Buchung {
  korrekt: boolean;
  keinFehlerDeck: boolean;
}

/** Typen, bei denen der MENSCH urteilt: `freitext` und `erklaeren` haben in
    `TYP` keinen Bewerter. Dort wird erst gebucht, wenn er sich eingeschaetzt hat. */
export const EIGENES_URTEIL: ReadonlySet<string> = new Set(["freitext", "erklaeren"]);

/** Leitet aus Typ, Antwort und Maschinen-Urteil die Buchung ab.

    ⛔ DIE MITTE ZAEHLT ALS NICHT RICHTIG, KOMMT ABER NICHT INS FEHLER-DECK.
       So macht es die alte App (app_loeser.js:704 —
       `fertig(o[2] === true, { keinFehlerDeck: o[2] === null })`), und daran
       haengt der Lernrhythmus: "halb gewusst" soll nicht wie "nicht gewusst"
       behandelt werden, aber auch nicht als Treffer durchgehen.

    ⚠️ `aufgegeben` ist eine NEUE Entscheidung, nicht geerbt: die alte App kennt
       keinen Aufgeben-Knopf. Gebucht wird als falsch UND mit Fehler-Deck — genau
       die Frage, die man nicht konnte, soll wiederkommen. */
export function urteilAus(
  typ: string,
  antwort: unknown,
  maschinenUrteil: unknown,
  aufgegeben = false,
): Buchung | null {
  if (EIGENES_URTEIL.has(typ)) {
    if (aufgegeben) return null;   // der Mensch urteilt noch, auch nach "Aufgeben"
    const selbst = istObjekt(antwort) ? antwort.selbst : undefined;   // N38 Q1: vorher behauptet
    if (selbst === undefined) return null;
    return { korrekt: selbst === true, keinFehlerDeck: selbst === null };
  }
  if (aufgegeben) return { korrekt: false, keinFehlerDeck: false };
  const korrekt =
    maschinenUrteil === true ||
    (typeof maschinenUrteil === "object" &&
      maschinenUrteil !== null &&
      (maschinenUrteil as { korrekt?: boolean }).korrekt === true);
  return { korrekt, keinFehlerDeck: false };
}
