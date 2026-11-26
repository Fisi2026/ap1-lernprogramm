/* ============================================================================
   FREITEXT-EINSCHAETZUNG — Portierung aus app_util.js (Zeilen 617-950)

   ⛔ WARUM PORTIERT UND NICHT VERSCHOBEN: die alte App bleibt unangetastet, bis die
      neue vollstaendig ist. Ein Umbau an `app_util.js` waere Risiko an der Schicht,
      die heute noch funktioniert — zugunsten einer Datei, die am Ende geloescht wird.
      (Entscheidung des Nutzers, 11.09.2026.)

   ⛔⛔ DER WERT DIESER 340 ZEILEN IST NICHT DER CODE, SONDERN DIE KALIBRIERUNG.
      Die Schwellen, die Wortgrenzen-Regel, die Tippfehler-Toleranz und die
      FB-R2a-Korrektur wurden ueber Wochen an echten Antworten gemessen. Deshalb gilt
      hier: **nichts verbessern, nichts aufraeumen, nichts vereinfachen.** Die
      Gleichheit mit dem Original wird von `freitext.gleichheit.test.ts` erzwungen —
      ueber alle 123 Freitext-Fragen und beide Messgleise aus tools/mess_freitext.js.

   ⚠️ `normText` HIER IST NICHT `L.normText`. Diese Fassung schreibt Umlaute aus
      (ae/oe/ue/ss), die in logik.js behaelt sie. Gleicher Name, anderes Verhalten —
      in der alten App eine echte Falle. Deshalb heisst sie hier `normFreitext`.
   ============================================================================ */
import { TIPP_MINLAENGE } from "./tabellen/konfig.ts";
import { distanzEins } from "./bewertung.ts";
import { SYN_MAP } from "./freitext-synonyme.ts";

/** Schwellen aus app_state.js APP_CONFIG. Gemessen, nicht gesetzt. */
const TEILPUNKTE_RICHTIG = 0.65;
const TEILPUNKTE_TEILWEISE = 0.35;

/** WORTGRENZEN-REGEL (2026-07-20): Begriffe bis zu dieser Laenge muessen als eigenes
    Wort vorkommen, laengere duerfen im Kompositum stehen. Gemessen: Falsch-Positive
    7 -> 0, Treffer auf den 147 Musterloesungs-Begriffen unveraendert 145. */
const KURZ_MAX = 4;

const STOPWORTE: Record<string, 1> = {
  der:1,die:1,das:1,und:1,oder:1,ein:1,eine:1,einen:1,einer:1,eines:1,einem:1,ist:1,
  sind:1,war:1,wird:1,werden:1,kann:1,muss:1,soll:1,auch:1,nicht:1,bei:1,mit:1,fuer:1,
  von:1,zum:1,zur:1,den:1,dem:1,des:1,auf:1,aus:1,als:1,dass:1,sich:1,man:1,sie:1,ihr:1,
  wenn:1,ueber:1,unter:1,durch:1,diese:1,dieser:1,dieses:1,diesen:1,wie:1,was:1,aber:1,
  nur:1,noch:1,vor:1,nach:1,dabei:1,sowie:1,bzw:1,etc:1,mehr:1,sehr:1,koennen:1,
  sollte:1,sollten:1,haben:1,damit:1,ohne:1,gegen:1,zwischen:1,jeweils:1,beispiel:1,
  beispielsweise:1,
};

/** Normalisierung inkl. Umlaut-/ss-Varianten: "Verschlüsselung" und "Verschluesselung"
    werden identisch behandelt. ⚠️ NICHT L.normText — siehe Kopf dieser Datei.
    @public – genutzt von tools/mess_freitext.js und tools/trennschaerfe.js ueber tools/kern.js (knip sieht tools/ nicht, N44 C2). */
export function normFreitext(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

type Toleranz = ((v: string) => boolean) | null;

/** TIPPFEHLER-TOLERANZ (2026-08-04). Sie schaltet sich selbst ab: nur bei Begriffen
    ab TIPP_MINLAENGE Zeichen, ohne Ziffer, einwortig, und nur wenn in DIESER Frage
    kein Nachbar in Distanz 1 steht. Gemessen: 1274 von 1512 Begriffen (84,3 %)
    bekommen Toleranz; ipconfig/ifconfig, 7,1/7,5 und 2.300/2.400 bleiben getrennt. */
function tippbar(v: string, tol: Toleranz): boolean {
  const minLaenge = TIPP_MINLAENGE;
  return !!tol && v.indexOf(" ") < 0 && v.length >= minLaenge && !/[0-9]/.test(v) && tol(v);
}


function variantenTreffer(antTextNorm: string, v: string, tol: Toleranz): boolean {
  if (!v) return false;
  if (v.length <= KURZ_MAX) return antTextNorm.indexOf(" " + v + " ") >= 0;
  if (antTextNorm.indexOf(v) >= 0) return true;
  /* Flexions-/Schreibvarianten-Toleranz NUR bei Einwort-Varianten. Auf einer
     Mehrwort-Phrase wuerde der Stem den letzten Bestandteil abschneiden und genau
     die Unterscheidung tilgen, auf die es ankommt ("monitor b" -> "monito"). */
  if (v.indexOf(" ") >= 0) return false;
  const stem = v.slice(0, Math.max(4, v.length - 3));
  if (stem.length >= 4 && antTextNorm.indexOf(" " + stem) >= 0) return true;
  /* Der Stem faengt den Tippfehler am WORTENDE; die Distanz-1-Pruefung den am Anfang
     (gemeldeter Fall: "ufgabenanalyse"). */
  if (!tippbar(v, tol)) return false;
  const woerter = antTextNorm.split(" ");
  for (const w of woerter) if (w.length >= 4 && distanzEins(v, w)) return true;
  return false;
}

function begriffTreffer(antTextNorm: string, begriff: string, tol: Toleranz): boolean {
  const key = normFreitext(begriff);
  if (!key) return false;
  const gruppe = SYN_MAP[key];
  if (gruppe) {
    for (const g of gruppe) if (variantenTreffer(antTextNorm, g, tol)) return true;
    return false;
  }
  if (variantenTreffer(antTextNorm, key, tol)) return true;
  /* TOKEN-FALLBACK (2026-07-20). Ein Mehrwort-Begriff ohne eigene Gruppe fand die
     Gruppen seiner Bestandteile nie. Jetzt wird je Token geprueft — aber der Begriff
     gilt nur als getroffen, wenn ALLE inhaltstragenden Tokens treffen. Die
     Alles-Bedingung ist der Schutz gegen Falsch-Positive: bei M02-006 erfuellt
     "Monitor A" den Pflichtbegriff "Monitor B" weiterhin NICHT. */
  const toks = key.split(" ").filter((t) => t && !STOPWORTE[t]);
  if (toks.length < 2) return false;
  for (const tok of toks) {
    const g = SYN_MAP[tok];
    let hit = false;
    if (g) { for (const m of g) { if (variantenTreffer(antTextNorm, m, tol)) { hit = true; break; } } }
    else hit = variantenTreffer(antTextNorm, tok, tol);
    if (!hit) return false;
  }
  return true;
}

/** Ein Eintrag in pflicht/kuer darf statt eines Strings eine LISTE gleichwertiger
    Formulierungen sein. Er zaehlt als EIN Begriff und gilt als getroffen, sobald
    IRGENDEINE Alternative trifft. */
type Begriff = string | string[];

function begriffErfuellt(antTextNorm: string, b: Begriff, tol: Toleranz): boolean {
  if (Array.isArray(b)) {
    for (const x of b) if (begriffTreffer(antTextNorm, x, tol)) return true;
    return false;
  }
  return begriffTreffer(antTextNorm, b, tol);
}

/** Anzeigeform: Alternativlisten werden zu "Puffer / Spielraum / Reserve" verflacht. */
function begriffLabel(b: Begriff): string {
  return Array.isArray(b) ? b.join(" / ") : b;
}

/** Frageindividuelle Toleranz-Freigabe: ein Begriff bekommt sie nur, wenn in DIESER
    Frage kein anderer Begriff in Distanz 1 zu ihm steht. Einmal je Bewertung. */
function toleranzFreigabe(pflicht: Begriff[], kuer: Begriff[]): Toleranz {
  const alle: string[] = [];
  const sammle = (b: Begriff) =>
    (Array.isArray(b) ? b : [b]).forEach((x) => { const n = normFreitext(x); if (n) alle.push(n); });
  pflicht.forEach(sammle);
  kuer.forEach(sammle);
  return (v: string) => {
    for (const a of alle) if (a !== v && distanzEins(a, v)) return false;
    return true;
  };
}

export type Stufe = "richtig" | "teilweise" | "unvollständig" | "unklar" | "leer";

export interface AutoBefund {
  anzahl: number;
  treffer: number;
  prozent: number;
  gefunden: string[];
  fehlend: string[];
  stufe: Stufe;
}

/** Kernbegriffe der Musterloesung: laenger zuerst, hoechstens 14. */
function kernBegriffe(referenz: unknown): string[] {
  const refToks = normFreitext(referenz).split(" ").filter(Boolean);
  const seen: Record<string, 1> = {};
  let keys: string[] = [];
  for (const t of refToks) {
    if (STOPWORTE[t]) continue;
    const istZahl = /^[0-9]+$/.test(t);
    if ((t.length >= 5 || (istZahl && t.length >= 2) || SYN_MAP[t]) && !seen[t]) {
      seen[t] = 1;
      keys.push(t);
    }
  }
  keys.sort((a, b) => b.length - a.length);
  if (keys.length > 14) keys = keys.slice(0, 14);
  return keys;
}

function stufeAuto(leer: boolean, anzahl: number, score: number): Stufe {
  if (leer) return "leer";
  if (anzahl < 3) return "unklar";
  if (score >= 0.65) return "richtig";
  if (score >= 0.35) return "teilweise";
  return "unvollständig";
}

/** Naeherung ueber die Kernbegriffe der Musterloesung. Keine Bedeutungspruefung —
    die Selbsteinschaetzung bleibt massgeblich. */
export function autoCheckText(antwort: unknown, referenz: unknown): AutoBefund {
  const keys = kernBegriffe(referenz);
  const antText = " " + normFreitext(antwort) + " ";
  const gefunden: string[] = [];
  const fehlend: string[] = [];
  for (const k of keys) {
    if (begriffTreffer(antText, k, null)) gefunden.push(k);
    else fehlend.push(k);
  }
  const anzahl = keys.length;
  const treffer = gefunden.length;
  const score = anzahl ? treffer / anzahl : 0;
  const leer = normFreitext(antwort).length < 3;
  const stufe = stufeAuto(leer, anzahl, score);
  return { anzahl, treffer, prozent: Math.round(score * 100), gefunden, fehlend, stufe };
}

export interface TeilpunkteBefund {
  pflichtTreffer: number;
  pflichtGesamt: number;
  kuerTreffer: number;
  kuerGesamt: number;
  prozent: number;
  stufe: Stufe;
  gefunden: string[];
  fehlendPflicht: string[];
}

export interface Schluesselbegriffe {
  pflicht?: Begriff[];
  kuer?: Begriff[];
}

/** Teilpunkte ueber gewichtete Schluesselbegriffe: Pflicht zaehlt doppelt, Kuer einfach.
    ⚠️ FB-R2a (2026-07-21): WER ALLE PFLICHTBEGRIFFE TRIFFT, IST "RICHTIG" — unabhaengig
    von der Prozentzahl. Grund war ein Rechenfehler: der Nenner (2*Pflicht + Kuer) waechst
    mit jedem Kuer-Begriff, also senkte jeder zusaetzliche Kuer-Begriff die Note einer
    vollstaendig richtigen Antwort. Bei 3 Pflicht + 4 Kuer landete sie bei 60 % und damit
    unter der Schwelle — Bestehen war rechnerisch unmoeglich.
    GEMESSEN: strenges Messgleis 3/10 -> 6/10, realistisches unveraendert 10/10,
    Falsch-Positive unveraendert 0. */
export function gradeTeilpunkte(
  antwort: unknown,
  f: { schluesselbegriffe?: Schluesselbegriffe },
): TeilpunkteBefund {
  const sb = f.schluesselbegriffe ?? {};
  const pflicht = Array.isArray(sb.pflicht) ? sb.pflicht : [];
  const kuer = Array.isArray(sb.kuer) ? sb.kuer : [];
  const antTextNorm = " " + normFreitext(antwort) + " ";
  const tol = toleranzFreigabe(pflicht, kuer);

  let pTreffer = 0;
  let kTreffer = 0;
  const gefunden: string[] = [];
  const fehlendPflicht: string[] = [];

  for (const b of pflicht) {
    if (begriffErfuellt(antTextNorm, b, tol)) { pTreffer++; gefunden.push(begriffLabel(b)); }
    else fehlendPflicht.push(begriffLabel(b));
  }
  for (const b of kuer) {
    if (begriffErfuellt(antTextNorm, b, tol)) { kTreffer++; gefunden.push(begriffLabel(b)); }
  }

  const gesamtGewicht = 2 * pflicht.length + 1 * kuer.length;
  const trefferGewicht = 2 * pTreffer + 1 * kTreffer;
  const score = gesamtGewicht ? trefferGewicht / gesamtGewicht : 0;
  const leer = normFreitext(antwort).length < 3;
  const allePflicht = pflicht.length > 0 && pTreffer === pflicht.length;
  const stufe: Stufe = leer
    ? "leer"
    : allePflicht || score >= TEILPUNKTE_RICHTIG
      ? "richtig"
      : score >= TEILPUNKTE_TEILWEISE
        ? "teilweise"
        : "unvollständig";

  return {
    pflichtTreffer: pTreffer,
    pflichtGesamt: pflicht.length,
    kuerTreffer: kTreffer,
    kuerGesamt: kuer.length,
    prozent: Math.round(score * 100),
    stufe,
    gefunden,
    fehlendPflicht,
  };
}

/** Der eine Einstieg fuer die Oberflaeche: mit Schluesselbegriffen die gewichtete
    Bewertung, sonst der Begriffs-Abgleich gegen die Musterloesung. Genau diese
    Verzweigung steht auch in app_loeser.js. */
export function einschaetzen(
  antwort: unknown,
  f: { schluesselbegriffe?: Schluesselbegriffe; musterloesung?: unknown },
): AutoBefund | TeilpunkteBefund {
  return f.schluesselbegriffe
    ? gradeTeilpunkte(antwort, f)
    : autoCheckText(antwort, f.musterloesung);
}
