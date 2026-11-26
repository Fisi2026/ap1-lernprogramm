/* ============================================================================
   N34 T4 (E50, E55, 26.09.2026): DIE PRUEFUNGSSIMULATION AUS `logik.js`
   Uebernommen aus `referenz/logik.js` (Z. 352-399, 406-415, 1189-1320): Punkte wuerfeln, IHK-Note,
   Zeit-/Punkte-Richtwert je Frage, Zuordnung zu den vier Aufgaben, Sim-Bewertbarkeit, Fallaufgabe,
   Pruefungsbau und Ergebnis – Regeln UND Begruendungs-Kommentare wortgleich, typisiert. Die Tabellen
   kommen aus T1 (`tabellen/*.ts`), der Zufall aus `zufall.ts`, die Instanziierung aus `rechenaufgabe.ts`.
   ⚠️ `simulation.ts` bleibt die App-Schicht (Pool, Faelle, Lernstand) und ruft diese Datei (E55).
   Gehalten von `pruefung.gleichheit.test.ts` gegen `referenz/logik.js`.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49).
   ============================================================================ */
import { AP1_AUFGABEN, M04_NETZ } from "./tabellen/pruefung.ts";
import { NOTEN_SCHLUESSEL, NOTE_BESTANDEN_AB } from "./tabellen/noten.ts";
import { SIM_TYPEN, TYP_META, TYP_META_DEFAULT } from "./tabellen/fragetypen.ts";
import { pick, shuffle, type Zufall } from "./zufall.ts";
import { instanziiere } from "./rechenaufgabe.ts";
import { istObjekt } from "./pruefe.ts";

/** Was diese Datei an einer Frage liest (E49: kein `@/daten/typen`). */
export interface SimFrage {
  id: string;
  modul?: string;
  thema?: string;
  typ?: string;
  unterTyp?: unknown;
  sek?: unknown;
  punkte?: unknown;
  [weiteres: string]: unknown;
}

/** Was diese Datei an einer Fallaufgabe liest. */
export interface SimFall {
  id?: string;
  modul?: string;
  thema?: string;
  pruefungsteil?: string;
  titel?: string;
  szenario?: string;
  teilaufgaben?: readonly Record<string, unknown>[];
}

/* ---------------- G3.6b: Punkteverteilung der AP1-Aufgaben ----------------
   RECHERCHE-BEFUND (2026-07-19, zwei unabhaengige Quellen): Die AP1 besteht aus VIER
   ungebundenen Aufgaben, jede zwischen 20 und 30 Punkten, Summe 100, 90 Minuten. Der
   Schwerpunkt je Aufgabe wird zufaellig gezogen. Die bisher fest verdrahteten 25/25/26/24
   waren also nicht falsch (Summe 100, alle im Korridor), aber nur EINE moegliche Auspraegung.
   Nutzer-Entscheid: Punkte je Simulationslauf wuerfeln, die THEMATISCHE Zuordnung der vier
   Aufgaben aber fest lassen, damit jeder Durchlauf den ganzen Stoff abdeckt.
   Liefert n Werte in [min, max] mit exakter Summe `summe`. Verteilt den Rest ueber `summe`
   hinaus Punkt fuer Punkt auf zufaellige, noch nicht ausgereizte Aufgaben – dadurch sind alle
   zulaessigen Verteilungen erreichbar und die Summe stimmt immer.
   Ist die Vorgabe unerfuellbar (z. B. Summe groesser als n*max), wird defensiv so weit wie
   moeglich aufgefuellt und das Ergebnis auf den gueltigen Bereich begrenzt zurueckgegeben. */
export function wuerfelPunkte(n: number, min: number, max: number, summe: number, rng?: Zufall): number[] {
  const zufall = rng ?? Math.random;
  const a: number[] = [];
  for (let i = 0; i < n; i++) a.push(min);
  let rest = summe - n * min;
  while (rest > 0) {
    const frei: number[] = [];
    for (let i = 0; i < n; i++) if (a[i]! < max) frei.push(i);
    if (!frei.length) break;                       // Kapazitaet erschoepft (unerfuellbare Vorgabe)
    const j = frei[Math.floor(zufall() * frei.length)]!;
    a[j] = a[j]! + 1;
    rest--;
  }
  return a;
}

/* ---------------- IHK-Notenschlüssel ----------------
   Der Schluessel selbst steht seit T1 in `tabellen/noten.ts`. */
export interface Note { note: number; text: string; bestanden: boolean }
export function note(prozent: unknown): Note {
  let p = Number(prozent);
  if (!isFinite(p)) p = 0;
  for (let i = 0; i < NOTEN_SCHLUESSEL.length; i++) {
    const s = NOTEN_SCHLUESSEL[i]!;
    if (p >= s.ab) return { note: s.note, text: s.text, bestanden: p >= NOTE_BESTANDEN_AB };
  }
  return { note: 6, text: "ungenügend", bestanden: false };
}

/* Liefert {sek, punkte} für eine Frage; Frage-Overrides (f.sek/f.punkte) haben Vorrang. */
export function metaFuer(f: SimFrage | null | undefined): { sek: number; punkte: number } {
  const base = (f && TYP_META[String(f.typ)]) ?? TYP_META_DEFAULT;   /* ohne typ: Schluessel "undefined" wie vorher */
  return {
    sek:    (f && typeof f.sek    === "number" && f.sek    > 0) ? f.sek    : base.sek,
    punkte: (f && typeof f.punkte === "number" && f.punkte > 0) ? f.punkte : base.punkte,
  };
}

/* ══════════ DIE VIER AP1-AUFGABEN UND DER PRUEFUNGSBAU (hierher am 16.09.2026) ══════════
   ⛔⛔ SIE STANDEN IN app_seiten.js UND app_sim.js — ALSO IN DER OBERFLAECHE. Solange es nur
      eine Oberflaeche gab, fiel das nicht auf. Der Neubau braucht dieselbe Ziehung, und ein
      zweiter Bauer waere eine zweite Fassung derselben Regel: zwei Listen fuer dieselbe Sache
      driften immer (nachgelesen 27.08.2026 an genau dieser Datei: `SIM_TYPEN` gegen eine
      hartkodierte Typenliste, 23 Fragen still ausgeschlossen).
   ►► Seit N34 T4 ist HIER der Ort, an dem gerechnet wird (vorher logik.js).
   ⚠️ Der Bauer ist REIN: Pool, Faelle und das Wiederholungs-Gedaechtnis kommen als Parameter.
      Diese Datei kennt weder POOL noch S noch FAELLE — und soll sie nicht kennen.
   Die vier Aufgaben und `M04_NETZ` stehen seit T1 in `tabellen/pruefung.ts`. */

/* In welche der vier Aufgaben eine Frage faellt. Alles, was keine Zuordnung hat, landet in 4. */
export function aufgabeVon(f: SimFrage): number {
  if (f.modul === "M01" || f.modul === "M02") return 0;
  if (f.modul === "M03") return 2;
  if (f.modul === "M05" || f.modul === "M06" || f.modul === "M07") return 3;
  if (f.modul === "M04") return f.thema !== undefined && M04_NETZ.indexOf(f.thema) >= 0 ? 2 : 1;
  return 3;
}

/* Ist die Frage in der AP1-Simulation automatisch bewertbar? Quelle ist die Registry
   (SIM_TYPEN aus TYP.simAuto), NICHT eine zweite Typenliste. Bei `bild` entscheidet
   der unterTyp. */
export function simBewertbar(f: SimFrage): boolean {
  const t = f.typ === "bild" ? (f.unterTyp || "mc") : f.typ;
  return typeof t === "string" && SIM_TYPEN.indexOf(t) >= 0;   /* SIM_TYPEN enthaelt nur Strings */
}

/* N38 Q1: `o` wird zur SimFrage, ohne zu behaupten. Ein `typ`, der kein Text ist, faellt heraus –
   `simBewertbar` lehnte ihn ohnehin ab (gleiches Ergebnis). Die Schluessel bleiben, wie sie in `o`
   stehen (Reihenfolge, auch ein `typ: undefined`). */
function alsSimFrage(o: Record<string, unknown>, id: string): SimFrage | null {
  const typ = o.typ;
  if (typ === undefined) return { ...o, id };
  return typeof typ === "string" ? { ...o, id, typ } : null;
}

/* Eine Fallaufgabe fuer die Simulation aufbereiten — ihre Teilaufgaben werden zu eigenen
   Fragen mit Szenario-Anzeige. Gibt null, wenn keine taugt. */
export function fallFuerSim(
  faelle: readonly SimFall[] | null | undefined, vermeide: Record<string, unknown>, rng?: Zufall,
): { id: string | undefined; teile: SimFrage[] } | null {
  const liste: readonly SimFall[] = Array.isArray(faelle) ? faelle : [];   // der Gleichheitstest reicht auch "x" herein
  if (!liste.length) return null;
  const frisch = liste.filter((fall) => !vermeide["FALL:" + fall.id]);
  const fall = pick(frisch.length ? frisch : liste, rng)!;
  const teile = (fall.teilaufgaben ?? []).map((q, i) => {
    const o: Record<string, unknown> = {};
    Object.keys(q).forEach((k) => { o[k] = q[k]; });
    const id = (fall.id || "FALL") + "-t" + i;
    o.id = id;
    o.modul = fall.modul; o.thema = fall.thema;
    o.pruefungsteil = fall.pruefungsteil || "AP1";
    o.schwierigkeit = q.schwierigkeit || 3;
    o.fallTitel = fall.titel; o.fallSzenario = fall.szenario;
    return alsSimFrage(o, id);
  }).filter((f): f is SimFrage => f !== null && simBewertbar(f));
  return teile.length ? { id: fall.id, teile } : null;
}

/* Ist das die Teilaufgabe einer Fallaufgabe? Sie traegt das Szenario mit sich —
   `fallFuerSim` haengt es an. Ihre Kennung ("<Fall>-t0") entsteht erst beim
   Bauen der Pruefung und steht in KEINEM Pool.
   ⛔⛔ ANLASS 16.09.2026, GEFUNDEN IM RAUCHTEST: nach einer Simulation lagen
      fuenf solcher Kennungen im Fehler-Deck. Sie koennen dort nie wieder
      herauskommen — die Ziehung filtert jede Kennung heraus, zu der es keine
      Frage gibt. **Ein Eintrag, der nie faellig werden kann, ist kein
      Wiedersehen, sondern totes Gewicht.** Der Neubau macht es sichtbar, weil
      er unaufloesbare Kennungen ausweist; die alte App uebergeht sie still. */
export function istFallTeil(f: unknown): boolean {
  return istObjekt(f) && (typeof f.fallSzenario === "string" || typeof f.fallTitel === "string");
}

export interface PruefungsOptionen<T extends SimFrage> {
  pool?: readonly T[] | null;
  faelle?: readonly SimFall[] | null;
  benutzt?: readonly string[] | null;
  anzahl?: number | null;
  punkte?: readonly number[] | null;
  rng?: Zufall;
}

/* Baut eine AP1-Pruefung. REIN: alles Aeussere kommt als Parameter.
     pool     — alle Fragen (M08 und der Unterrichts-Pool M09 werden hier ausgeschlossen)
     faelle   — FAELLE oder []
     benutzt  — Kennungen frueherer Laeufe (Wiederholungs-Gedaechtnis)
     anzahl   — gewuenschte Fragenzahl
     punkte   — Punkte je Aufgabe (Laenge 4); fehlt sie, gelten die Vorgabewerte
   Zurueck kommt { fragen, benutzt } — der Aufrufer speichert `benutzt`.
   ⚠️ `fragen` enthaelt auch die Teilaufgaben der Fallaufgabe; sie tragen nur die Felder, die
      `fallFuerSim` setzt, und sind KEINE Pool-Fragen (`istFallTeil`). */
export function baueAP1Pruefung<T extends SimFrage>(opt: PruefungsOptionen<T>): { fragen: (T | SimFrage)[]; benutzt: string[] } {
  const pool = opt.pool ?? [], anzahl = opt.anzahl || 40, rng = opt.rng;
  const punkte = opt.punkte && opt.punkte.length === AP1_AUFGABEN.length
    ? opt.punkte : AP1_AUFGABEN.map((a) => a.punkte);
  const basis = pool.filter((f) => f.modul !== "M08" && f.modul !== "M09" && simBewertbar(f));
  const proBlock: SimFrage[][] = [[], [], [], []];
  basis.forEach((f) => { proBlock[aufgabeVon(f)]!.push(f); });
  const soll = AP1_AUFGABEN.map((_a, bi) => Math.max(3, Math.round(anzahl * punkte[bi]! / 100)));
  const vermeide: Record<string, number> = {};
  (opt.benutzt ?? []).forEach((id) => { vermeide[id] = 1; });
  const fall = fallFuerSim(opt.faelle, vermeide, rng);
  const fallBlock = fall ? aufgabeVon(fall.teile[0]!) : -1;
  const blockFragen: SimFrage[][] = [[], [], [], []];
  proBlock.forEach((topf, bi) => {
    let zielN = soll[bi]! - (bi === fallBlock ? fall!.teile.length : 0);
    zielN = Math.max(bi === fallBlock ? 0 : 3, zielN);
    const frisch = shuffle(topf.filter((f) => !vermeide[f.id]), rng);
    const alt = shuffle(topf.filter((f) => vermeide[f.id]), rng);
    blockFragen[bi] = frisch.concat(alt).slice(0, Math.min(zielN, topf.length));
  });
  if (fall) blockFragen[fallBlock] = blockFragen[fallBlock]!.concat(fall.teile);
  const fragen = blockFragen[0]!.concat(blockFragen[1]!, blockFragen[2]!, blockFragen[3]!);
  /* Gedaechtnis ueber MEHRERE Laeufe. Erst wenn rund 70 % des geeigneten Bestands
     verbraucht sind, faengt es von vorn an. */
  const neu = fragen.map((f) => f.id);
  if (fall) neu.push("FALL:" + fall.id);
  let benutzt = (opt.benutzt ?? []).concat(neu);
  if (benutzt.length > basis.length * 0.7) benutzt = neu;
  return {
    /* N38 (30.09.2026): ehrlich `(T | SimFrage)[]` – die Teilaufgaben der Fallaufgabe sind SimFrage,
       nicht T (`istFallTeil`; ihnen fehlt u. a. `gebiet`). Vorher `as T[]`. Die Grenze zur Karte
       zieht `simulation.ts` (`istSimKarte`). */
    fragen: fragen.map((f) => instanziiere(f)),   // Zahlenvarianz auch hier
    benutzt,
  };
}

export interface Ergebnis {
  punkte: number;
  gesamt: number;
  prozent: number;
  note: Note;
  proModul: Record<string, { richtig: number; gesamt: number }>;
}

export function simErgebnis(fragen: readonly SimFrage[], korrekt: readonly unknown[]): Ergebnis { // korrekt: Array bool
  const punkte = korrekt.filter(Boolean).length;
  const prozent = fragen.length ? Math.round(punkte / fragen.length * 1000) / 10 : 0;
  const proModul: Ergebnis["proModul"] = {};
  fragen.forEach((f, i) => {
    const e = proModul[String(f.modul)] = proModul[String(f.modul)] ?? { richtig: 0, gesamt: 0 };   /* ohne modul: "undefined" wie vorher */
    e.gesamt++; if (korrekt[i]) e.richtig++;
  });
  return { punkte, gesamt: fragen.length, prozent, note: note(prozent), proModul };
}
