/* ============================================================================
   DER LERNSTAND DES NEUBAUS (N31, E17 + E25-E28 in PLAN_NEUBAU.md)

   ⛔⛔ DAS IST DER EINZIGE TEIL DES PROGRAMMS, DEN MAN NICHT NEU BAUEN KANN.
      Fragen, Bewertung, Oberflaeche - alles liesse sich wiederherstellen. Was
      der Lerner in Monaten geuebt hat, nicht.

   ►► SEIT N31 EIN EIGENER SCHLUESSEL (`fisi_ap1_stand`) MIT EIGENER VERSION.
      Bis N30 teilte der Neubau `ap1v2_state` mit der alten App. Seit E17 ist die
      alte App nur noch Referenz und ihr Lernstand ohne Wert: `ap1v2_state` wird
      NICHT mehr gelesen - und NICHT geloescht (die alte App laeuft bis N29 weiter).

   ►► DREI SICHERUNGEN BEIM LADEN:
      1. `migriere` - eine KETTE (v1->v2->...), je Schritt eine Funktion und ein Test.
      2. `pruefe`  - jedes Feld gegen seinen Typ. Ein kaputtes Feld wird zur Vorgabe,
         ein unbekanntes wird verworfen - beides als REPARATUR gemeldet (E25/E28),
         nie als Absturz.
      3. Unlesbarer Text (und ein Stand aus einer NEUEREN Fassung) wird VOR dem
         Weiterarbeiten nach `fisi_ap1_stand_defekt` gesichert (E26). Klappt die
         Sicherung nicht, wird nicht geschrieben - sonst waere der erste Klick
         der endgueltige Verlust.
   ============================================================================ */
import { unerreichbar } from "./da.ts";

/** Der Schluessel des Neubaus. ⛔ Nicht `ap1v2_state` (E17). */
export const LS_SCHLUESSEL = "fisi_ap1_stand";
/** Hierhin wandert, was nicht gelesen werden konnte (E26). Eine LISTE, nie ueberschrieben. */
export const DEFEKT_SCHLUESSEL = "fisi_ap1_stand_defekt";
/** Der Schluessel der alten App - nur genannt, damit ein Test beweisen kann, dass er unberuehrt bleibt. */
export const ALT_SCHLUESSEL = "ap1v2_state";

/** Die Fassung des Schemas. Jede Erhoehung braucht einen Schritt in MIGRATIONEN. */
export const STAND_VERSION = 2;

const VORGABE = {
  tagesziel: 20,
  simAnzahl: 40,
} as const;

/** Ein Zaehler je Modul, Feinthema (`T:<modul>:<thema>`) oder Generator (`GEN:<art>`). */
interface StatEintrag { richtig: number; gesamt: number }
/** Ein Eintrag im Fehler-Deck: Treffer in Folge und naechste Faelligkeit (ms). */
interface DeckEintrag { streak: number; due: number }
/** Ein Durchgang der Pruefungssimulation. Geschrieben wird er vollstaendig (`verbucheSimulation`:
    datum, prozent, note, punkte, gesamt, zeitSek); GERECHNET wird nur mit `prozent` – der Rest wird
    nur angezeigt und bleibt deshalb ungeprueft (`unknown`), statt einen Durchgang wegen einer
    Anzeigezeile zu verwerfen. */
interface SimEintrag {
  prozent: number;
  datum?: unknown;
  note?: unknown;
  punkte?: unknown;
  gesamt?: unknown;
  zeitSek?: unknown;
}

/** Der Lernstand. ⛔ KEIN Index `[weiteres: string]`: unbekannte Felder werden
    beim Laden verworfen und gemeldet (E25) - der Typ sagt, was es gibt. */
export interface Lernstand {
  /* --- was der Lerner erarbeitet hat: der unersetzliche Teil --- */
  seen: Record<string, unknown>;
  lastShown: string[];
  antworten: Array<{ richtig: boolean }>;
  seenUnterricht: Record<string, unknown>;
  fehlerDeck: Record<string, DeckEintrag>;
  notizen: Record<string, unknown>;
  statistik: Record<string, StatEintrag>;
  dailyCounts: Record<string, number>;
  simHistorie: SimEintrag[];
  themaLevel: Record<string, number>;
  themaTrack: Record<string, boolean[]>;
  markiert: Record<string, unknown>;
  meldungen: Record<string, unknown>;
  /** „Kann ich schon“ (Nutzer-Wunsch 25.11.2026, kern/gekonnt.ts): Pool-Kennung -> Zeitpunkt in ms.
      Solche Fragen zieht weder Üben noch Tagesserie noch das Fehler-Deck. Seit Fassung 2. */
  gekonnt: Record<string, unknown>;
  uebenZaehler: number;
  level: number;

  /* --- Einstellungen und Sitzungsreste --- */
  levelModus: string;
  module: string[];
  tagesziel: number;
  pruefungsdatum: string;
  theme: string | null;
  simAnzahl: number;
  simUsedIds: string[];
  serieDone: string;
  lastTyp: string;
  inklAP2: boolean;
  uebenAP: string;
  gebiete: string[];
  themen: string[];
  wirtschaftNur: boolean;
  abrufAn: boolean;
  simDauerMin: number;
  relevanzGewichtung: boolean;
  ariaAltTexte: boolean;
  typHilfeAus: Record<string, unknown>;
  glossarTip: boolean;
  markierenAn: boolean;
  panelOffen: Record<string, unknown>;

  /* --- Verwaltung --- */
  version: number;
  /** Zaehlt jedes Schreiben hoch - die zweite Sicherung gegen einen zweiten Tab (E27 Punkt 5). */
  rev: number;
}

export function leererStand(): Lernstand {
  return {
    seen: {}, lastShown: [], antworten: [],
    seenUnterricht: {},
    fehlerDeck: {}, notizen: {}, statistik: {}, dailyCounts: {},
    simHistorie: [],
    themaLevel: {}, themaTrack: {},
    markiert: {}, meldungen: {}, gekonnt: {},
    uebenZaehler: 0, level: 1,
    levelModus: "auto",
    module: [],
    tagesziel: VORGABE.tagesziel,
    pruefungsdatum: "", theme: null,
    simAnzahl: VORGABE.simAnzahl, simUsedIds: [],
    serieDone: "", lastTyp: "",
    inklAP2: false, uebenAP: "beide",
    gebiete: [], themen: [],
    wirtschaftNur: false, abrufAn: true,
    simDauerMin: 90,
    relevanzGewichtung: true, ariaAltTexte: false,
    typHilfeAus: {}, glossarTip: true, markierenAn: false,
    panelOffen: {},
    version: STAND_VERSION,
    rev: 0,
  };
}

/** Die Art je Feld - die Grundlage von `pruefe`. */
type Art = "objekt" | "liste" | "zahl" | "ganz" | "text" | "textOderNull" | "janein";

export const SCHEMA: Record<keyof Lernstand, Art> = {
  seen: "objekt", lastShown: "liste", antworten: "liste", seenUnterricht: "objekt",
  fehlerDeck: "objekt", notizen: "objekt", statistik: "objekt", dailyCounts: "objekt",
  simHistorie: "liste", themaLevel: "objekt", themaTrack: "objekt", markiert: "objekt",
  meldungen: "objekt", gekonnt: "objekt", uebenZaehler: "zahl", level: "zahl",
  levelModus: "text", module: "liste", tagesziel: "zahl", pruefungsdatum: "text",
  theme: "textOderNull", simAnzahl: "zahl", simUsedIds: "liste", serieDone: "text",
  lastTyp: "text", inklAP2: "janein", uebenAP: "text", gebiete: "liste", themen: "liste",
  wirtschaftNur: "janein", abrufAn: "janein", simDauerMin: "zahl",
  relevanzGewichtung: "janein", ariaAltTexte: "janein", typHilfeAus: "objekt",
  glossarTip: "janein", markierenAn: "janein", panelOffen: "objekt",
  version: "ganz", rev: "ganz",
};

/** N38 Q1: `passt("ganz", v)` als Typwaechter – spart `v as number` danach. */
function istGanz(v: unknown): v is number { return passt("ganz", v); }
function passt(art: Art, v: unknown): boolean {
  switch (art) {
    case "objekt": return typeof v === "object" && v !== null && !Array.isArray(v);
    case "liste": return Array.isArray(v);
    case "zahl": return typeof v === "number" && Number.isFinite(v);
    case "ganz": return typeof v === "number" && Number.isInteger(v) && v >= 0;
    case "text": return typeof v === "string";
    case "textOderNull": return v === null || typeof v === "string";
    case "janein": return typeof v === "boolean";
    default: return unerreichbar(art, "passt");
  }
}

/* --------------------------------------------------------------- Inhalt */
/* Seit dem Nutzer-Entscheid E62 (27.09.2026) prueft `pruefe` bei zwoelf Feldern auch den INHALT: jeder
   Eintrag einer Liste bzw. jeder Wert eines Objekts muss die Form haben, in der die App ihn SCHREIBT
   (gemessen an allen Schreibstellen: verbuchen, merkeGezeigt, verbucheZufall/-Gantt/-Netzplan,
   verbucheSimulation, fdOnWrong/fdOnCorrect, adaptivBuchen, Ueben/Simulation).
   ⛔ Verworfen wird nur der EINZELNE kaputte Eintrag, nie das ganze Feld – und jede Verwerfung ist
      eine Reparatur: `lade` sichert dann den Rohtext (E26) und die Einstellungen zeigen sie (E28).
   ⚠️ Geprueft wird nur, womit die App RECHNET – nicht jede Nebenbedingung, die sie beim Schreiben
      einhaelt: `richtig <= gesamt` wird NICHT verlangt, und bei `simHistorie` nur `prozent` (der Rest
      ist Anzeige). Eine Regel, die echte Lerndaten wegen einer Nebensache verwirft, waere ein Verlust
      ohne Gewinn. */
type Inhaltsregel = (v: unknown) => boolean;
const istObjekt = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const istZahl = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const istZaehler = (v: unknown): v is number => istZahl(v) && v >= 0;
const istText = (v: unknown): v is string => typeof v === "string";

export const INHALT: Partial<Record<keyof Lernstand, Inhaltsregel>> = {
  lastShown: istText,
  simUsedIds: istText,
  gebiete: istText,
  themen: istText,
  module: istText,
  antworten: (v) => istObjekt(v) && typeof v.richtig === "boolean",
  statistik: (v) => istObjekt(v) && istZaehler(v.richtig) && istZaehler(v.gesamt),
  dailyCounts: istZaehler,
  themaLevel: istZahl,
  themaTrack: (v) => Array.isArray(v) && v.every((b) => typeof b === "boolean"),
  fehlerDeck: (v) => istObjekt(v) && istZahl(v.streak) && istZahl(v.due),
  simHistorie: (v) => istObjekt(v) && istZahl(v.prozent),
  gekonnt: istZahl,
};

/** Behaelt nur die Eintraege, die ihre Regel erfuellen; liefert den Wert und die Zahl der verworfenen.
    Eine Liste bleibt eine Liste (Reihenfolge erhalten), ein Objekt ein Objekt (Schluessel erhalten). */
export function siebe(v: unknown, regel: Inhaltsregel): { wert: unknown; verworfen: number } {
  if (Array.isArray(v)) {
    const gut = v.filter((e) => regel(e));
    return { wert: gut, verworfen: v.length - gut.length };
  }
  if (istObjekt(v)) {
    const gut: Record<string, unknown> = {};
    let verworfen = 0;
    for (const [k, e] of Object.entries(v)) {
      if (regel(e)) gut[k] = e;
      else verworfen++;
    }
    return { wert: gut, verworfen };
  }
  return { wert: v, verworfen: 0 };
}

/* ---------------------------------------------------------------- Kette */

/** Ein Schritt: hebt einen Stand von Fassung n auf n+1. Er bekommt eine Kopie. */
export type Migration = (s: Record<string, unknown>) => Record<string, unknown>;

/** Die Kette, Schluessel = Ausgangsfassung.
    1 -> 2 (25.11.2026): das Feld `gekonnt` („Kann ich schon“). Ohne diesen Schritt meldete `pruefe`
    bei JEDEM bisherigen Stand „Feld gekonnt fehlte“ als Reparatur und legte eine Sicherung an. */
export const MIGRATIONEN: Record<number, Migration> = {
  1: (s) => ({ ...s, gekonnt: istObjekt(s.gekonnt) ? s.gekonnt : {} }),
};

export interface Wanderung {
  stand: Record<string, unknown>;
  /** die Ausgangsfassungen der gelaufenen Schritte, in Reihenfolge */
  schritte: number[];
  /** gesetzt, wenn ein Schritt fehlt - dann ist NICHT weitergewandert worden */
  fehlt?: number;
}

/** Wandert Schritt fuer Schritt bis `ziel`. ⛔ Fehlt ein Schritt, bricht es ab und
    sagt welcher - ein uebersprungener Schritt waere ein still falsch gedeuteter Stand. */
export function migriere(
  s: Record<string, unknown>,
  kette: Record<number, Migration> = MIGRATIONEN,
  ziel: number = STAND_VERSION,
): Wanderung {
  let v = istGanz(s.version) && s.version >= 1 ? s.version : 1;
  let akt = s;
  const schritte: number[] = [];
  while (v < ziel) {
    const schritt = kette[v];
    if (!schritt) return { stand: akt, schritte, fehlt: v };
    akt = schritt({ ...akt });
    schritte.push(v);
    v += 1;
    akt.version = v;
  }
  return { stand: akt, schritte };
}

/* -------------------------------------------------------------- Pruefung */

export interface Pruefung {
  stand: Lernstand;
  /** je Reparatur ein Satz fuer die Einstellungen (E28) */
  reparaturen: string[];
}

function artVon(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "Liste";
  return typeof v;
}

/** Legt jedes bekannte Feld gegen seine Art. Wirft nie. */
export function pruefe(roh: Record<string, unknown>): Pruefung {
  const stand = leererStand();
  /* N38 Q1: BEGRUENDET STEHEN GELASSEN (auch Z. `felder`): hier wird schemagetrieben kopiert –
     die Pruefung IST `passt(SCHEMA[feld], v)` darunter; die Umwandlung macht nur das Schreiben
     ueber den Feldnamen moeglich. */
  const ziel = stand as unknown as Record<string, unknown>;
  const reparaturen: string[] = [];
  const felder = Object.keys(SCHEMA) as (keyof Lernstand)[];
  const fehlend: string[] = [];
  for (const feld of felder) {
    if (feld === "version") continue;
    if (!Object.prototype.hasOwnProperty.call(roh, feld)) { fehlend.push(feld); continue; }
    const v = roh[feld];
    if (!passt(SCHEMA[feld], v)) {
      reparaturen.push(`Feld „${feld}“ war ${artVon(v)} statt ${SCHEMA[feld]} – Vorgabe gesetzt`);
      continue;
    }
    const regel = INHALT[feld];
    if (!regel) { ziel[feld] = v; continue; }
    const { wert, verworfen } = siebe(v, regel);
    ziel[feld] = wert;
    if (verworfen === 1) reparaturen.push(`Feld „${feld}“: 1 Eintrag in unbekannter Form – verworfen`);
    else if (verworfen > 1) reparaturen.push(`Feld „${feld}“: ${verworfen} Einträge in unbekannter Form – verworfen`);
  }
  /* Fehlende Felder als EINE Meldung - ein Teilstand ergaebe sonst Dutzende Zeilen. */
  if (fehlend.length === 1) reparaturen.push(`Feld „${fehlend[0]}“ fehlte – Vorgabe gesetzt`);
  else if (fehlend.length > 1) reparaturen.push(`${fehlend.length} Felder fehlten – Vorgabe gesetzt: ${fehlend.join(", ")}`);
  for (const feld of Object.keys(roh)) {
    if (!Object.prototype.hasOwnProperty.call(SCHEMA, feld)) {
      reparaturen.push(`Unbekanntes Feld „${feld}“ verworfen`);
    }
  }
  stand.version = STAND_VERSION;
  return { stand, reparaturen };
}

/* ------------------------------------------------------------- Sicherung */

export interface Sicherung { zeit: string; grund: string; roh: string }
/* N38 Q1: vorher galt jede Liste als Sicherungsliste (`p as Sicherung[]`). */
const istSicherung = (v: unknown): v is Sicherung =>
  istObjekt(v) && istText(v.zeit) && istText(v.grund) && istText(v.roh);

/** Haengt den Rohtext an die Liste unter DEFEKT_SCHLUESSEL (E26). Nie ueberschrieben;
    derselbe Text zweimal hintereinander wird nur einmal abgelegt. */
export function sichere(speicher: Storage, roh: string, grund: string, jetzt: number): boolean {
  try {
    const vorher = speicher.getItem(DEFEKT_SCHLUESSEL);
    let liste: Sicherung[] = [];
    if (vorher) {
      try {
        const p = JSON.parse(vorher) as unknown;
        /* passt ein Eintrag nicht, wird der ganze Rohtext EINE Sicherung – nichts geht verloren */
        liste = Array.isArray(p) && p.every(istSicherung) ? p : [{ zeit: "", grund: "unbekannt", roh: vorher }];
      } catch {
        liste = [{ zeit: "", grund: "unbekannt", roh: vorher }];
      }
    }
    if (liste.length > 0 && liste[liste.length - 1]?.roh === roh) return true;
    liste.push({ zeit: new Date(jetzt).toISOString(), grund, roh });
    speicher.setItem(DEFEKT_SCHLUESSEL, JSON.stringify(liste));
    return true;
  } catch {
    return false;
  }
}

/** Die abgelegten Sicherungen - fuer die Einstellungen. Wirft nie. */
export function sicherungen(speicher: Storage | undefined = sichererSpeicher()): Sicherung[] {
  try {
    const p = speicher ? (JSON.parse(speicher.getItem(DEFEKT_SCHLUESSEL) ?? "[]") as unknown) : [];
    return Array.isArray(p) ? p.filter(istSicherung) : [];   // nur Anzeige: Unlesbares faellt weg
  } catch {
    return [];
  }
}

/* ----------------------------------------------------------------- Laden */

/** Was beim Laden herauskam. ⛔ Ein still verschluckter Lesefehler sieht aus wie ein neuer Lerner. */
export type Ladebefund = "gelesen" | "leer" | "unlesbar";

export interface Ladeergebnis {
  stand: Lernstand;
  befund: Ladebefund;
  /** was `pruefe` repariert hat (und warum gesichert wurde) */
  reparaturen: string[];
  /** Ausgangsfassungen der gelaufenen Kettenschritte */
  gewandert: number[];
  /** true, wenn der Rohtext nach DEFEKT_SCHLUESSEL gesichert wurde */
  gesichert: boolean;
  /** ⛔ false: der verlustreiche Rohtext konnte NICHT gesichert werden (oder der
      Speicher ist nicht lesbar) - dann darf nichts geschrieben werden (E26). */
  schreibenErlaubt: boolean;
}

function ergebnis(stand: Lernstand, befund: Ladebefund, rest: Partial<Ladeergebnis> = {}): Ladeergebnis {
  return { stand, befund, reparaturen: [], gewandert: [], gesichert: false, schreibenErlaubt: true, ...rest };
}

/** Liest den Lernstand. Wirft nie. ⛔ Liest `ap1v2_state` nicht (E17). */
export function lade(
  speicher: Storage | undefined = sichererSpeicher(),
  jetzt: number = Date.now(),
): Ladeergebnis {
  if (!speicher) return ergebnis(leererStand(), "unlesbar", { schreibenErlaubt: false });
  let roh: string | null;
  try {
    roh = speicher.getItem(LS_SCHLUESSEL);
  } catch {
    return ergebnis(leererStand(), "unlesbar", { schreibenErlaubt: false });
  }
  if (roh === null || roh === "") return ergebnis(leererStand(), "leer");

  let gelesen: unknown;
  try {
    gelesen = JSON.parse(roh);
  } catch {
    gelesen = undefined;
  }
  if (!istObjekt(gelesen)) {
    const ok = sichere(speicher, roh, "unlesbar", jetzt);
    return ergebnis(leererStand(), "unlesbar", { gesichert: ok, schreibenErlaubt: ok });
  }

  const s = gelesen;
  const reparaturen: string[] = [];
  let quelle = s;
  let gewandert: number[] = [];
  if (istGanz(s.version) && s.version > STAND_VERSION) {
    /* Ein Stand aus einer NEUEREN Fassung (z. B. ein alter Cache nach einem Update).
       Zurueckwandern gibt es nicht - also sichern und lesen, was bekannt ist. */
    reparaturen.push(`Stand aus einer neueren Fassung (v${s.version}) – nur bekannte Felder gelesen`);
  } else {
    const w = migriere(s);
    if (w.fehlt !== undefined) {
      reparaturen.push(`Wanderung ab v${w.fehlt} fehlt – nur bekannte Felder gelesen`);
    }
    quelle = w.stand;
    gewandert = w.schritte;
  }
  const p = pruefe(quelle);
  reparaturen.push(...p.reparaturen);
  if (reparaturen.length === 0) return ergebnis(p.stand, "gelesen", { gewandert });
  const ok = sichere(speicher, roh, "repariert", jetzt);
  return ergebnis(p.stand, "gelesen", { reparaturen, gewandert, gesichert: ok, schreibenErlaubt: ok });
}

/* -------------------------------------------------------------- Schreiben */

/** Schreibt den Lernstand VOLLSTAENDIG. ⛔ `false`, wenn es nicht geklappt hat -
    die Oberflaeche zeigt dann ihren Banner. `rev` zaehlt der Aufrufer (lernstandort.ts). */
export function speichere(
  stand: Lernstand,
  speicher: Storage | undefined = sichererSpeicher(),
): boolean {
  if (!speicher) return false;
  try {
    speicher.setItem(LS_SCHLUESSEL, JSON.stringify(stand));
    return true;
  } catch {
    return false;
  }
}

/** localStorage gibt es nicht ueberall (Test ohne Browser, private Fenster,
    blockierte Seitendaten). Schon der Zugriff darauf kann werfen. */
export function sichererSpeicher(): Storage | undefined {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined;
  }
}
