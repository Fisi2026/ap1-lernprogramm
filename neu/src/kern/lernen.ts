/* ============================================================================
   N34 T3 (E50, E53, 26.09.2026): DAS LERNEN AUS `logik.js`
   Uebernommen aus `referenz/logik.js` (Z. 59-96, 219-360, 1151-1187): Deck-Ziehung mit Sperrfrist,
   Gebiet/Thema, Gewichtung, Bereitschaft, adaptive Stufe je Thema, Fehler-Deck, Tages-Schluessel –
   Regeln UND Begruendungs-Kommentare wortgleich, typisiert. Die Tabellen kommen aus T1
   (`tabellen/*.ts`), der Zufall aus `zufall.ts`.
   ⚠️ Mutation wie in logik.js: `adaptivBuchen`, `fdOnWrong`, `fdOnCorrect` aendern ihre
      Argumente IN-PLACE und geben sie zurueck – die Aufrufer verlassen sich darauf.
   Gehalten von `lernen.gleichheit.test.ts` gegen `referenz/logik.js`.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49).
   ============================================================================ */
import { CONFIG, LEVEL_MAX, LEVEL_MIN, TAG_MS } from "./tabellen/konfig.ts";
import { GEBIETE, THEMA_GEBIET, THEMA_RELEVANZ } from "./tabellen/gebiete.ts";
import { BEREITSCHAFT_AMPEL } from "./tabellen/noten.ts";
import { pick, pickGewichtet, type Zufall } from "./zufall.ts";

type Gesehen = Record<string, unknown>;

/* ---------------- Deck-Prinzip mit Sperrfrist ----------------
   candidates: Array von Frage-IDs (bereits nach Filter/Schwierigkeit)
   seen:       Objekt {id:true} – in dieser Deck-Runde gesehene Fragen
   lastShown:  Array der zuletzt gezeigten IDs (neueste am Ende)
   sperrfrist: Anzahl Fragen, in denen eine gerade gesehene Frage
               nach dem Neumischen nicht wiederkommen darf (Default 10)
   gewichtFn:  optional, id -> Gewicht > 0; dann gewichtete Ziehung (A3)
   Rückgabe: {id, deckReset:boolean, seen} (seen ggf. zurückgesetzt)      */
export function deckPick(
  candidates: readonly string[] | null | undefined, seen?: Gesehen | null, lastShown?: readonly string[] | null,
  sperrfrist?: number | null, rng?: Zufall, gewichtFn?: ((id: string) => unknown) | null,
): { id: string | null | undefined; deckReset: boolean; seen: Gesehen } {
  const frist = sperrfrist ?? CONFIG.sperrfrist;
  let gesehen: Gesehen = seen ?? {};
  const zuletzt = lastShown ?? [];
  if (!candidates || candidates.length === 0) return { id: null, deckReset: false, seen: gesehen };
  let unseen = candidates.filter((id) => !gesehen[id]);
  let deckReset = false;
  if (unseen.length === 0) {                 // Deck erschöpft -> neu mischen
    deckReset = true;
    gesehen = {};
    const sperre: Record<string, boolean> = {};
    zuletzt.slice(-frist).forEach((id) => { sperre[id] = true; });
    unseen = candidates.filter((id) => !sperre[id]);
    if (unseen.length === 0) unseen = candidates.slice(); // Pool kleiner als Sperrfrist
  } else {
    // Auch innerhalb der Runde direkte Wiederholung der letzten Fragen vermeiden, wenn möglich
    const sperre2: Record<string, boolean> = {};
    zuletzt.slice(-Math.min(frist, Math.max(0, unseen.length - 1))).forEach((id) => { sperre2[id] = true; });
    const frei = unseen.filter((id) => !sperre2[id]);
    if (frei.length > 0) unseen = frei;
  }
  const id = gewichtFn ? pickGewichtet(unseen, gewichtFn, rng) : pick(unseen, rng);
  return { id, deckReset, seen: gesehen };
}

interface MitThema { modul?: unknown; thema?: unknown }
export function gebietFuer(f: MitThema | null | undefined): string | undefined {
  return (f && f.modul === "M09") ? "M9" : (f ? THEMA_GEBIET[String(f.modul) + "|" + String(f.thema)] : undefined);
}
export function gebietName(code: string): string {
  const e = GEBIETE.find((g) => g[0] === code);
  return e ? e[1] : code;
}

/* Gewicht einer Frage im Üben-Deck.
   ctx: { relevanzAn:bool, adaptivAktiv:bool (erst ab >30 beantwortet),
          themaStat: f -> {richtig,gesamt}|null, letzteThemen: [thema,...] } */
export interface GewichtKontext<F extends MitThema = MitThema> {
  relevanzAn?: unknown;
  adaptivAktiv?: unknown;
  /* N38 Q1: vorher `unknown` plus Umwandlung beim Aufruf – die verdeckte, dass `ziehen` eine
     Funktion auf `Frage` hineinreicht; jetzt traegt der Kontext den Fragetyp F. */
  themaStat?: ((f: F) => { richtig: number; gesamt: number } | null) | null;
  letzteThemen?: readonly unknown[] | null;
}
export function gewichteFrage<F extends MitThema>(f: F, ctx?: GewichtKontext<F> | null): number {
  const c = ctx ?? {};
  let w = c.relevanzAn ? (THEMA_RELEVANZ[String(f.thema)] || 2) : 2;
  if (c.adaptivAktiv && typeof c.themaStat === "function") {
    const st = c.themaStat(f);
    if (st && st.gesamt >= CONFIG.adaptivMinGesamt) {
      const q = (st.richtig + 1) / (st.gesamt + 2);   // geglättete Trefferquote (Laplace)
      w *= (1.5 - q);                                // 0.5 (stark) .. 1.5 (schwach)
    }
  }
  if (c.letzteThemen && c.letzteThemen.indexOf(f.thema) !== -1) w *= CONFIG.interleavingMalus; // Interleaving
  return Math.max(w, CONFIG.gewichtFloor);
}

/* ---------------- Bereitschafts-Score (L1 / G1) ----------------
   Gewichteter Mittelwert (Gewicht = THEMA_RELEVANZ, Default 2) der Themen-Trefferquoten,
   NUR über tatsächlich geübte Themen (gesamt>=1). Ungeübte Themen fließen NICHT ein
   (Nutzer-Entscheid "nur Geübtes werten") – sie werden im Render separat als "offen" gezeigt.
   Quote = richtig/gesamt*100 (roh, wie die Modul-Balken). Rein aus statistik ableitbar
   (Keys "T:<modul>:<thema>") → ohne Pool testbar. Rückgabe je Modul + gesamt.
   (Die Grenzen `BEREITSCHAFT_AMPEL` stehen seit T1 in `tabellen/noten.ts`.) */
export type Ampel = "keine" | "rot" | "gelb" | "gruen";
export function ampelFuer(score: number | null | undefined): Ampel {
  if (score == null) return "keine";
  if (score < BEREITSCHAFT_AMPEL.rot)  return "rot";
  if (score <= BEREITSCHAFT_AMPEL.gelb) return "gelb";
  return "gruen";
}
/* Zerlegt einen Statistik-Schlüssel "T:modul:thema" in {modul,thema} (thema kann ":" enthalten). */
export function themaKeyTeile(k: unknown): { modul: string | undefined; thema: string } {
  const teile = String(k).split(":");           // ["T", modul, ...thema]
  return { modul: teile[1], thema: teile.slice(2).join(":") };
}
type Statistik = Record<string, { richtig: number; gesamt: number } | null | undefined>;
/* FB-R3 (2026-07-23): Fragen je Gebiet aus den T:modul:thema-Einträgen ableiten (roh, ungewichtet).
   Liefert { gebietCode: {richtig,gesamt,themen} }. M09 wird ausgelassen (eigener Bereich). */
export function statProGebiet(statistik?: Statistik | null): Record<string, { richtig: number; gesamt: number; themen: number }> {
  const s = statistik ?? {};
  const out: Record<string, { richtig: number; gesamt: number; themen: number }> = {};
  Object.keys(s).forEach((k) => {
    if (k.indexOf("T:") !== 0) return;
    const e = s[k]; if (!e || !e.gesamt) return;
    const t = themaKeyTeile(k); if (t.modul === "M09") return;
    const g = THEMA_GEBIET[String(t.modul) + "|" + t.thema]; if (!g) return;
    const o = out[g] ?? (out[g] = { richtig: 0, gesamt: 0, themen: 0 });
    o.richtig += e.richtig; o.gesamt += e.gesamt; o.themen += 1;
  });
  return out;
}
/* Prüfungs-Bereitschaft je GEBIET (FB-R3 2026-07-23; vorher je Modul). Relevanz-gewichtet über
   die T:modul:thema-Einträge; die Zuordnung Thema→Gebiet kommt aus THEMA_GEBIET. Rückgabefeld
   heißt jetzt `gebiete` (Schlüssel = Gebiet-Codes A1..B3). M09 zählt NIE mit. */
export interface BereitschaftTeil { score: number | null; ampel: Ampel; themen: number; antworten: number }
export function bereitschaft(statistik?: Statistik | null): { gebiete: Record<string, BereitschaftTeil>; gesamt: BereitschaftTeil } {
  const s = statistik ?? {};
  const geb: Record<string, { wsum: number; rsum: number; themen: number; antworten: number }> = {};
  const g = { wsum: 0, rsum: 0, themen: 0, antworten: 0 };
  Object.keys(s).forEach((k) => {
    if (k.indexOf("T:") !== 0) return;
    const e = s[k];
    if (!e || !e.gesamt) return;
    const t = themaKeyTeile(k);
    if (t.modul === "M09") return;            // „Klausurvorbereitung" zaehlt NIE in die AP1-Bereitschaft (Nutzer-Entscheid 2026-07-20)
    const code = THEMA_GEBIET[String(t.modul) + "|" + t.thema];
    if (!code) return;                        // kein Soll-Gebiet -> nicht werten (Wächter fängt das im Pool ab)
    const rel = THEMA_RELEVANZ[t.thema] || 2;
    const quote = e.richtig / e.gesamt * 100;
    const m = geb[code] ?? (geb[code] = { wsum: 0, rsum: 0, themen: 0, antworten: 0 });
    m.wsum += rel * quote; m.rsum += rel; m.themen += 1; m.antworten += e.gesamt;
    g.wsum += rel * quote; g.rsum += rel; g.themen += 1; g.antworten += e.gesamt;
  });
  const gebiete: Record<string, BereitschaftTeil> = {};
  Object.keys(geb).forEach((code) => {
    const m = geb[code]!;
    const score = m.rsum ? Math.round(m.wsum / m.rsum) : null;
    gebiete[code] = { score, ampel: ampelFuer(score), themen: m.themen, antworten: m.antworten };
  });
  const gScore = g.rsum ? Math.round(g.wsum / g.rsum) : null;
  return {
    gebiete,
    gesamt: { score: gScore, ampel: ampelFuer(gScore), themen: g.themen, antworten: g.antworten },
  };
}

/* ---------------- G3.2 #6: Adaptive Schwierigkeit JE THEMA ----------------
   Loest das globale Auf-/Abstufen samt Level-Dialog ab (Nutzer-Entscheid E3, 2026-07-19).
   Je Thema werden die Antworten in einem BLOCK gesammelt; sobald CONFIG.adaptivBlock
   Antworten vorliegen, wird ausgewertet und der Block GELEERT (kein gleitendes Fenster,
   also hoechstens eine Stufenaenderung je Block):
     alle Antworten richtig                         -> Stufe +1
     hoechstens CONFIG.adaptivAbSchwelle richtig    -> Stufe -1
     alles dazwischen                               -> Stufe bleibt
   Grenzen LEVEL_MIN..LEVEL_MAX. Schluessel = "modul|thema" (themaKey).
   Der MANUELLE Modus uebersteuert das Ganze im App-Code (S.levelModus).             */
export function themaKey(modul: unknown, thema: unknown): string { return String(modul) + "|" + String(thema); }
/* Aktuelle Stufe eines Themas. Unbekanntes Thema startet auf `start` (= globale S.level). */
export function themaStufe(levels: Record<string, unknown> | null | undefined, key: string, start?: unknown): number {
  const roh = (levels ?? {})[key];
  const v = (typeof roh === "number" && isFinite(roh)) ? roh : (typeof start === "number" && isFinite(start)) ? start : LEVEL_MIN;
  return Math.max(LEVEL_MIN, Math.min(LEVEL_MAX, Math.round(v)));
}
/* ⚠️ 2026-07-30: Die Blockgroesse haengt an der AKTUELLEN Stufe. Aus Stufe 1 genuegt eine
   richtige Antwort (adaptivBlockStufe1), ab Stufe 2 sind es zwei (adaptivBlock).
   Nutzer-Entscheid: "von 3 auf 2 senken mit der Ausnahme das man nur 1ne richtige braucht um
   aus anfaenger rauszukommen". Grund siehe CONFIG. */
export function blockFuerStufe(stufe: number): number {
  return stufe <= LEVEL_MIN ? CONFIG.adaptivBlockStufe1 : CONFIG.adaptivBlock;
}
/* Bucht eine Antwort und liefert die (ggf. angepasste) Stufe. Mutiert levels/track bewusst
   in-place, damit der Aufruf ohne Rueckschreiben auskommt. */
export function adaptivBuchen(
  levels: Record<string, unknown> | null | undefined, track: Record<string, boolean[]> | null | undefined,
  key: string, richtig: unknown, start?: unknown,
): { levels: Record<string, unknown>; track: Record<string, boolean[]>; stufe: number } {
  const lv = levels ?? {}; const tr = track ?? {};
  let stufe = themaStufe(lv, key, start);
  const block = blockFuerStufe(stufe);
  const a = tr[key] = tr[key] ?? [];
  a.push(!!richtig);
  if (a.length >= block) {
    const treffer = a.filter(Boolean).length;
    if (treffer >= block) stufe = Math.min(LEVEL_MAX, stufe + 1);
    else if (treffer <= CONFIG.adaptivAbSchwelle) stufe = Math.max(LEVEL_MIN, stufe - 1);
    tr[key] = [];
  }
  lv[key] = stufe;
  return { levels: lv, track: tr, stufe };
}

/* ---------------- Fehler-Deck (Spaced Repetition) ----------------
   deck: {id: {streak, due}}  due = Timestamp (ms)
   Intervalle: falsch -> +1 Tag; 1. richtig -> +3 Tage; 2. richtig -> +7 Tage;
   3. richtig in Folge -> Frage verlässt das Deck. Fehler -> Rückfall.
   (`TAG_MS` steht seit T1 in `tabellen/konfig.ts`.)   */
export interface DeckEintrag { streak: number; due: number }
export type Deck = Record<string, DeckEintrag>;
/* tage: optionales Erstintervall in Tagen. Ohne Angabe gilt CONFIG.fdTageFehler (= 1 Tag).
   ⚠️ 2026-07-30: Die Klausurvorbereitung (M09) uebergibt fdTageFehlerUnterricht = 0, damit eine
   falsch beantwortete Frage NOCH IN DERSELBEN SITZUNG zurueckkommt. Grund: Vor einer Klausur am
   naechsten Tag ist ein Erstintervall von 24 Stunden die falsche Einstellung – die Frage taucht
   dann erst am Pruefungsmorgen wieder auf. Fuer AP1 bleibt es bei 1 Tag (Spaced Repetition auf
   Monate), festgeschrieben durch tests/test_logik.js „FD: nicht sofort faellig". */
export function fdOnWrong(deck: Deck | null | undefined, id: string, now: number, tage?: unknown): Deck {
  const d = deck ?? {};
  const t = (typeof tage === "number") ? tage : CONFIG.fdTageFehler;
  d[id] = { streak: 0, due: now + t * TAG_MS };
  return d;
}
export function fdOnCorrect(deck: Deck | null | undefined, id: string, now: number): Deck {
  const d = deck ?? {};
  const e = d[id];
  if (!e) return d;
  e.streak = (e.streak || 0) + 1;
  if (e.streak >= CONFIG.fdStreakWeg) { delete d[id]; return d; }
  e.due = now + (e.streak === 1 ? CONFIG.fdTageStreak1 : CONFIG.fdTageStreakRest) * TAG_MS;
  return d;
}
export function fdDue(deck: Deck | null | undefined, now: number): string[] {
  const d = deck ?? {};
  return Object.entries(d).filter(([, e]) => e.due <= now).map(([id]) => id);
}

/* ---------------- Tagesziel (Datums-Schlüssel) ---------------- */
export function dayKey(ts: number | string | Date): string {
  const d = new Date(ts);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
