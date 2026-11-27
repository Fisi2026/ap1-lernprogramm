/* ============================================================================
   DER ORT DES LERNSTANDS - EINE QUELLE JE TAB (N31, E27/E28 in docs/plaene/PLAN_NEUBAU.md)

   ⛔⛔ KEIN SEITENEFFEKT IM STATE-UPDATER (Lehre N6c). Bis N30 schrieb
      `useLernstand.aendere` INNERHALB von `setStand(alt => ...)`. Hier rechnet
      `aendere` synchron auf dem aktuellen Stand, schreibt DANACH und meldet es den
      Abonnenten; React liest nur (`useSyncExternalStore`).

   ⛔⛔ EIN TAB SCHREIBT (E27). Gemessen 22.09.: „neu lesen und die Aenderung neu
      anwenden" traegt NICHT - `Ueben.tsx` rechnet den Zug ausserhalb der Aenderung
      aus dem alten Stand. Deshalb:
      (1) die Sperre `fisi_ap1_stand` (navigator.locks); wer sie hat, ist AKTIV.
      (2) jeder weitere Tab ist ZUSCHAUER: zeigt live (storage-Ereignis), schreibt nie.
      (3) `hierWeiter` stiehlt die Sperre (steal); der neue Tab liest frisch.
      (4) schliesst der aktive Tab, bekommt ein wartender die Sperre von selbst.
      (5) `rev`: vor jedem Schreiben wird die Platte gelesen; steht dort ein hoeheres
          `rev`, wird NICHT geschrieben, sondern der Plattenstand uebernommen.
      Ohne navigator.locks gilt nur (5) - Rolle „ohneSperre".
   ============================================================================ */
import { lade, speichere, sichererSpeicher, LS_SCHLUESSEL } from "./stand";
import type { Lernstand, Ladebefund } from "./stand";
import { istObjekt } from "./pruefe.ts";

export const SPERRE = "fisi_ap1_stand";

/** start = die Sperre ist noch nicht entschieden (Millisekunden); dort gilt (5). */
export type Rolle = "start" | "aktiv" | "zuschauer" | "ohneSperre";
export type Dauerhaft = "unbekannt" | "ja" | "nein" | "fehlt";
/** Was im aktiven Tab gerade laeuft - der Grund fuer die Rueckfrage beim Uebernehmen. */
export type Lauf = "simulation" | "serie";

interface Zustand {
  stand: Lernstand;
  befund: Ladebefund;
  reparaturen: string[];
  gesichert: boolean;
  speicherFehler: boolean;
  rolle: Rolle;
  /** wie oft (5) ein eigenes Schreiben verhindert hat */
  konflikte: number;
  dauerhaft: Dauerhaft;
  /** N33: laeuft in DIESEM Tab eine Simulation oder Tagesserie? (sperrt den Update-Hinweis) */
  lauf: Lauf | null;
}

/** Das Stueck von LockManager, das hier gebraucht wird (in Tests nachgebaut). */
export interface Sperren {
  request(
    name: string,
    opt: { ifAvailable?: boolean; steal?: boolean; signal?: AbortSignal },
    cb: (lock: unknown) => Promise<unknown> | unknown,
  ): Promise<unknown>;
}
export interface Kanal {
  postMessage(m: unknown): void;
  onmessage: ((e: { data: unknown }) => void) | null;
  close(): void;
}
export interface Umgebung {
  speicher: Storage | undefined;
  jetzt: () => number;
  sperren?: Sperren | undefined;
  kanal?: (() => Kanal) | undefined;
  /** meldet, dass ein ANDERER Tab den Schluessel geschrieben hat (storage-Ereignis) */
  aufFremdes?: ((cb: () => void) => () => void) | undefined;
  dauerhaft?: { persist(): Promise<boolean>; persisted(): Promise<boolean> } | undefined;
  /** wie lange `fremderLauf` auf die Antwort des aktiven Tabs wartet */
  warteMs?: number;
}

function browserUmgebung(): Umgebung {
  const nav = typeof navigator === "undefined" ? undefined : navigator;
  const st = nav?.storage;
  return {
    speicher: sichererSpeicher(),
    jetzt: () => Date.now(),
    sperren: nav?.locks,
    /* N38 Q1: BEGRUENDET STEHEN GELASSEN – `Kanal` ist die kleine Schnittstelle, die Tests nachbauen;
       BroadcastChannel erfuellt sie bis auf den Ereignistyp (MessageEvent statt { data }). */
    kanal: typeof BroadcastChannel === "undefined" ? undefined : () => new BroadcastChannel(SPERRE) as unknown as Kanal,
    aufFremdes: typeof window === "undefined" ? undefined : (cb) => {
      const h = (e: StorageEvent) => { if (e.key === LS_SCHLUESSEL || e.key === null) cb(); };
      window.addEventListener("storage", h);
      return () => window.removeEventListener("storage", h);
    },
    dauerhaft: st && typeof st.persist === "function" && typeof st.persisted === "function"
      ? { persist: () => st.persist(), persisted: () => st.persisted() } : undefined,
  };
}

interface Quelle {
  zustand(): Zustand;
  abonniere(cb: () => void): () => void;
  aendere(fn: (s: Lernstand) => Lernstand): void;
  /** startet Sperre, Kanal und Lauscher; gibt das Beenden zurueck (StrictMode-fest) */
  starte(): () => void;
  /** (3) diesen Tab zum aktiven machen */
  hierWeiter(): Promise<void>;
  /** fragt den aktiven Tab, ob dort eine Simulation oder Serie laeuft */
  fremderLauf(): Promise<Lauf | null>;
  /** meldet einen laufenden Durchgang an (an=true) oder ab; mehrere duerfen gleichzeitig laufen */
  setzeLauf(l: Lauf, an: boolean): void;
}

/** `rev` auf der Platte - null, wenn nichts oder nichts Lesbares dort liegt. Wirft nie. */
function liesRev(sp: Storage | undefined): number | null {
  if (!sp) return null;
  try {
    const t = sp.getItem(LS_SCHLUESSEL);
    if (!t) return null;
    const p: unknown = JSON.parse(t);
    const r = istObjekt(p) ? p.rev : undefined;   // N38 Q1: `null` warf vorher und landete im catch – gleiches Ergebnis
    return typeof r === "number" && Number.isInteger(r) && r >= 0 ? r : null;
  } catch {
    return null;
  }
}

export interface QuelleMitDauer extends Quelle {
  /** beim ersten Buchen: navigator.storage.persist() - einmal je Tab (E28) */
  bitteDauerhaft(): void;
}

export function erzeugeQuelle(u: Umgebung = browserUmgebung()): QuelleMitDauer {
  const start = lade(u.speicher, u.jetzt());
  const schreibenErlaubt = start.schreibenErlaubt;
  let z: Zustand = {
    stand: start.stand, befund: start.befund, reparaturen: start.reparaturen,
    gesichert: start.gesichert, speicherFehler: !schreibenErlaubt,
    rolle: u.sperren ? "start" : "ohneSperre", konflikte: 0,
    dauerhaft: u.dauerhaft ? "unbekannt" : "fehlt",
    lauf: null,
  };
  const abos = new Set<() => void>();
  const setze = (teil: Partial<Zustand>) => { z = { ...z, ...teil }; for (const cb of [...abos]) cb(); };

  let lebt = false;
  let gen = 0;
  let loslassen: (() => void) | null = null;
  let warten: AbortController | null = null;
  let kanal: Kanal | null = null;
  let abmelden: (() => void) | null = null;
  const laeufe = new Set<Lauf>();
  let dauerGefragt = false;
  const offen = new Map<string, (l: Lauf | null) => void>();

  function uebernimmPlatte() {
    const r = lade(u.speicher, u.jetzt());
    if (r.befund === "gelesen") setze({ stand: r.stand });
  }
  function werdeAktiv() { uebernimmPlatte(); setze({ rolle: "aktiv" }); }
  function halte(): Promise<void> { return new Promise((res) => { loslassen = res; }); }
  function verloren() { loslassen = null; setze({ rolle: "zuschauer" }); wartend(); }

  /** (2)/(4): in die Schlange stellen - wird die Sperre frei, ist dieser Tab dran. */
  function wartend() {
    if (!u.sperren || !lebt) return;
    const meine = ++gen;
    const ab = new AbortController();
    warten = ab;
    u.sperren.request(SPERRE, { signal: ab.signal }, () => {
      if (meine !== gen || !lebt) return undefined;
      warten = null;
      werdeAktiv();
      return halte();
    }).then(() => undefined, () => { if (meine === gen && lebt) verloren(); });
  }

  function aufNachricht(d: unknown) {
    const m = (d ?? {}) as { art?: string; id?: string; lauf?: Lauf | null };
    if (m.art === "frage" && z.rolle === "aktiv") kanal?.postMessage({ art: "status", id: m.id, lauf: [...laeufe][0] ?? null });
    if (m.art === "status" && m.id !== undefined) {
      const fertig = offen.get(m.id);
      if (fertig) { offen.delete(m.id); fertig(m.lauf ?? null); }
    }
  }

  function aendere(fn: (s: Lernstand) => Lernstand) {
    if (z.rolle === "zuschauer") return;          /* (2) schreibt nie */
    const neu: Lernstand = { ...fn(z.stand) };
    if (!schreibenErlaubt) { setze({ stand: neu, speicherFehler: true }); return; }
    const platte = liesRev(u.speicher);           /* (5) */
    if (platte !== null && platte > z.stand.rev) {
      const r = lade(u.speicher, u.jetzt());
      setze({ stand: r.stand, konflikte: z.konflikte + 1 });
      return;
    }
    neu.rev = z.stand.rev + 1;
    const ok = speichere(neu, u.speicher);
    setze({ stand: neu, speicherFehler: z.speicherFehler || !ok });
  }

  function starte(): () => void {
    lebt = true;
    if (u.kanal) { kanal = u.kanal(); kanal.onmessage = (e) => aufNachricht(e.data); }
    if (u.aufFremdes) {
      abmelden = u.aufFremdes(() => {
        if (!lebt) return;
        const p = liesRev(u.speicher);
        if (z.rolle === "zuschauer" || (p !== null && p > z.stand.rev)) uebernimmPlatte();
      });
    }
    if (u.dauerhaft) {
      void u.dauerhaft.persisted().then((j) => { if (j) setze({ dauerhaft: "ja" }); }, () => undefined);
    }
    if (u.sperren) {
      const meine = ++gen;
      u.sperren.request(SPERRE, { ifAvailable: true }, (lock) => {
        if (meine !== gen || !lebt) return undefined;
        if (!lock) { setze({ rolle: "zuschauer" }); wartend(); return undefined; }
        werdeAktiv();
        return halte();
      }).then(() => undefined, () => { if (meine === gen && lebt) verloren(); });
    }
    return function beende() {
      lebt = false;
      gen++;
      loslassen?.(); loslassen = null;
      warten?.abort(); warten = null;
      kanal?.close(); kanal = null;
      abmelden?.(); abmelden = null;
      setze({ rolle: u.sperren ? "start" : "ohneSperre" });
    };
  }

  async function hierWeiter(): Promise<void> {
    const sp = u.sperren;
    if (!sp || !lebt || z.rolle === "aktiv") return;
    warten?.abort(); warten = null;
    const meine = ++gen;
    await new Promise<void>((fertig) => {
      sp.request(SPERRE, { steal: true }, () => {
        if (meine !== gen || !lebt) { fertig(); return undefined; }
        werdeAktiv();
        fertig();
        return halte();
      }).then(() => fertig(), () => { fertig(); if (meine === gen && lebt) verloren(); });
    });
  }

  function fremderLauf(): Promise<Lauf | null> {
    const k = kanal;
    if (!k) return Promise.resolve(null);
    const id = `${u.jetzt()}-${Math.random().toString(36).slice(2)}`;
    return new Promise((res) => {
      offen.set(id, res);
      k.postMessage({ art: "frage", id });
      setTimeout(() => { if (offen.delete(id)) res(null); }, u.warteMs ?? 300);
    });
  }

  function bitteDauerhaft() {
    const d = u.dauerhaft;
    if (!d || dauerGefragt || z.dauerhaft === "ja" || z.rolle === "zuschauer") return;
    dauerGefragt = true;
    void d.persist().then((j) => setze({ dauerhaft: j ? "ja" : "nein" }), () => setze({ dauerhaft: "nein" }));
  }

  return {
    zustand: () => z,
    abonniere: (cb) => { abos.add(cb); return () => { abos.delete(cb); }; },
    aendere, starte, hierWeiter, fremderLauf, bitteDauerhaft,
    setzeLauf: (l, an) => {
      if (an) laeufe.add(l); else laeufe.delete(l);
      const jetzt = [...laeufe][0] ?? null;
      if (jetzt !== z.lauf) setze({ lauf: jetzt });  // nur bei echter Aenderung neu zeichnen
    },
  };
}
