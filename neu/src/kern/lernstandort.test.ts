/* N31/E27: EIN TAB SCHREIBT - bewiesen an zwei (und drei) Quellen auf einem Speicher.
   Nachgebaut: LockManager (ifAvailable, steal, Schlange, Abbruch), das storage-Ereignis
   (nur an ANDERE Tabs, wie im Browser) und BroadcastChannel (nicht an sich selbst). */
import { describe, it, expect, vi, afterEach } from "vitest";
import { erzeugeQuelle, SPERRE } from "./lernstandort";
import type { Sperren, Kanal, Umgebung } from "./lernstandort";
import { LS_SCHLUESSEL, DEFEKT_SCHLUESSEL, leererStand } from "./stand";

const flush = async () => { for (let i = 0; i < 6; i++) await new Promise((r) => { setTimeout(r, 0); }); };

function welt() {
  const m = new Map<string, string>();
  const lauscher = new Set<{ tab: number; cb: () => void }>();
  let sperre: Set<string> | null = null;
  const schreibe: { k: string; tab: number }[] = [];
  /* --- LockManager --- */
  type Anfrage = { cb: (l: unknown) => unknown; res: (v: unknown) => void; rej: (e: unknown) => void };
  let halter: Anfrage | null = null;
  const schlange: Anfrage[] = [];
  const gewaehre = (a: Anfrage) => {
    halter = a;
    void Promise.resolve().then(() => a.cb({ name: SPERRE })).then((v) => {
      if (halter !== a) return;
      halter = null; a.res(v);
      const n = schlange.shift(); if (n) gewaehre(n);
    }, (e) => { if (halter === a) { halter = null; a.rej(e); } });
  };
  const sperren: Sperren = {
    request: (_n, opt, cb) => new Promise((res, rej) => {
      const a: Anfrage = { cb, res, rej };
      if (opt.steal) {
        const alt = halter; halter = null;
        if (alt) alt.rej(new DOMException("gestohlen", "AbortError"));
        gewaehre(a); return;
      }
      if (!halter && schlange.length === 0) { gewaehre(a); return; }
      if (opt.ifAvailable) { void Promise.resolve().then(() => cb(null)).then(res, rej); return; }
      schlange.push(a);
      opt.signal?.addEventListener("abort", () => {
        const i = schlange.indexOf(a);
        if (i >= 0) { schlange.splice(i, 1); rej(new DOMException("ab", "AbortError")); }
      });
    }),
  };
  /* --- Kanal --- */
  const kanaele = new Set<Kanal>();
  const neuerKanal = (): Kanal => {
    const k: Kanal = {
      onmessage: null,
      postMessage: (d) => { for (const o of kanaele) if (o !== k) queueMicrotask(() => o.onmessage?.({ data: d })); },
      close: () => { kanaele.delete(k); },
    };
    kanaele.add(k); return k;
  };
  /* --- Speicher je Tab --- */
  const speicher = (tab: number) => ({
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => {
      if (sperre?.has(k)) throw new Error("voll");
      m.set(k, v); schreibe.push({ k, tab });
      for (const l of lauscher) if (l.tab !== tab && k === LS_SCHLUESSEL) queueMicrotask(l.cb);
    },
    removeItem: (k: string) => { m.delete(k); },
  }) as unknown as Storage;
  let naechster = 0;
  const tab = (mit: Partial<Umgebung> = {}, sperrenAn = true) => {
    const id = ++naechster;
    return erzeugeQuelle({
      speicher: speicher(id), jetzt: () => Date.UTC(2026, 8, 22),
      sperren: sperrenAn ? sperren : undefined, kanal: neuerKanal, warteMs: 20,
      aufFremdes: (cb) => { const l = { tab: id, cb }; lauscher.add(l); return () => lauscher.delete(l); },
      ...mit,
    });
  };
  /** schreibt wie ein weiterer Tab (Nr. 0): loest bei allen Tabs das storage-Ereignis aus */
  const fremd = (v: string) => { speicher(0).setItem(LS_SCHLUESSEL, v); };
  return { m, tab, schreibe, fremd, sperreSchluessel: (s: string[]) => { sperre = new Set(s); } };
}
const platte = (w: ReturnType<typeof welt>) => JSON.parse(w.m.get(LS_SCHLUESSEL) ?? "null");
const setze = (tagesziel: number) => (s: ReturnType<typeof leererStand>) => ({ ...s, tagesziel });

describe("Rollen", () => {
  it("der erste Tab wird aktiv, der zweite Zuschauer", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush(); b.starte(); await flush();
    expect(a.zustand().rolle).toBe("aktiv");
    expect(b.zustand().rolle).toBe("zuschauer");
  });
  it("ohne navigator.locks: ohneSperre", () => {
    const w = welt(); const a = w.tab({}, false); a.starte();
    expect(a.zustand().rolle).toBe("ohneSperre");
  });
});

describe("(2) der Zuschauer", () => {
  it("schreibt nie - auch wenn eine Aenderung kommt", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush(); b.starte(); await flush();
    a.aendere(setze(33));
    b.aendere(setze(99));
    expect(platte(w).tagesziel).toBe(33);
    expect(w.schreibe.filter((s) => s.tab === 2)).toEqual([]);
  });
  it("sieht live, was der aktive Tab schreibt", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush(); b.starte(); await flush();
    a.aendere(setze(41)); await flush();
    expect(b.zustand().stand.tagesziel).toBe(41);
  });
});

describe("(3) hier weiterarbeiten", () => {
  it("dreht die Rollen, der neue Tab liest frisch und schreibt, der alte nicht mehr", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush(); b.starte(); await flush();
    a.aendere(setze(21));
    await b.hierWeiter(); await flush();
    expect(b.zustand().rolle).toBe("aktiv");
    expect(a.zustand().rolle).toBe("zuschauer");
    expect(b.zustand().stand.tagesziel).toBe(21);
    a.aendere(setze(1));
    b.aendere(setze(22));
    expect(platte(w).tagesziel).toBe(22);
    expect(platte(w).rev).toBe(2);
  });
  it("der alte Tab stellt sich wieder an und wird aktiv, wenn der neue schliesst", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush(); const endeB = b.starte(); await flush();
    await b.hierWeiter(); await flush();
    endeB(); await flush();
    expect(a.zustand().rolle).toBe("aktiv");
  });
});

describe("(4) schliesst der aktive Tab", () => {
  it("wird ein wartender aktiv und liest frisch", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab(); const c = w.tab();
    const endeA = a.starte(); await flush(); b.starte(); await flush(); c.starte(); await flush();
    a.aendere(setze(17));
    endeA(); await flush();
    expect(b.zustand().rolle).toBe("aktiv");
    expect(c.zustand().rolle).toBe("zuschauer");
    expect(b.zustand().stand.tagesziel).toBe(17);
  });
});

describe("Aktiv werden heisst frisch lesen - auch ohne storage-Ereignis", () => {
  /* ⚠️ Die Faelle oben bekommen den frischen Stand schon ueber das Ereignis; die Sabotage
     „aktiv ohne frisch lesen" blieb dort gruen. Hier hat der Zuschauer kein Ereignis. */
  it("(3) hier weiterarbeiten", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab({ aufFremdes: undefined });
    a.starte(); await flush(); b.starte(); await flush();
    a.aendere(setze(44));
    expect(b.zustand().stand.tagesziel).toBe(20);
    await b.hierWeiter(); await flush();
    expect(b.zustand().stand).toMatchObject({ tagesziel: 44, rev: 1 });
  });
  it("(4) der wartende nach dem Schliessen", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab({ aufFremdes: undefined });
    const endeA = a.starte(); await flush(); b.starte(); await flush();
    a.aendere(setze(45)); endeA(); await flush();
    expect(b.zustand()).toMatchObject({ rolle: "aktiv", stand: { tagesziel: 45 } });
  });
});

describe("(5) rev - die zweite Sicherung", () => {
  it("jedes Schreiben zaehlt rev hoch", () => {
    const w = welt(); const a = w.tab({}, false); a.starte();
    a.aendere(setze(5)); a.aendere(setze(6));
    expect(platte(w).rev).toBe(2);
  });
  it("ohne Sperre: ein veralteter Tab schreibt NICHT ueber einen neueren Stand", () => {
    const w = welt(); const a = w.tab({ aufFremdes: undefined }, false); const b = w.tab({ aufFremdes: undefined }, false);
    a.starte(); b.starte();
    a.aendere(setze(30));
    b.aendere(setze(99));
    expect(platte(w).tagesziel).toBe(30);
    expect(b.zustand().stand.tagesziel).toBe(30);
    expect(b.zustand().konflikte).toBe(1);
    b.aendere(setze(31));
    expect(platte(w)).toMatchObject({ tagesziel: 31, rev: 2 });
  });
});

describe("Kein Seiteneffekt im Updater, keine verlorene Folge", () => {
  it("je Aenderung genau ein Aufruf der Funktion und genau ein Schreiben", () => {
    const w = welt(); const a = w.tab({}, false); a.starte();
    const fn = vi.fn(setze(12));
    a.aendere(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(w.schreibe.filter((s) => s.k === LS_SCHLUESSEL)).toHaveLength(1);
  });
  it("zwei Aenderungen hintereinander sehen einander", () => {
    const w = welt(); const a = w.tab({}, false); a.starte();
    a.aendere((s) => ({ ...s, tagesziel: 10 }));
    a.aendere((s) => ({ ...s, tagesziel: s.tagesziel + 1 }));
    expect(platte(w).tagesziel).toBe(11);
  });
  it("E26: konnte die Sicherung nicht angelegt werden, wird nicht geschrieben", () => {
    const w = welt(); w.m.set(LS_SCHLUESSEL, "{kaputt"); w.sperreSchluessel([DEFEKT_SCHLUESSEL]);
    const a = w.tab({}, false); a.starte();
    expect(a.zustand().speicherFehler).toBe(true);
    a.aendere(setze(3));
    expect(w.m.get(LS_SCHLUESSEL)).toBe("{kaputt");
  });
});

describe("Laeuft etwas im aktiven Tab?", () => {
  it("N33: der eigene Lauf steht im Zustand und meldet nur echte Wechsel", () => {
    const w = welt(); const a = w.tab(); const zaehler = vi.fn(); a.abonniere(zaehler);
    expect(a.zustand().lauf).toBeNull();
    a.setzeLauf("simulation", true); a.setzeLauf("simulation", true);
    expect(a.zustand().lauf).toBe("simulation");
    expect(zaehler).toHaveBeenCalledTimes(1);
    a.setzeLauf("simulation", false);
    expect(a.zustand().lauf).toBeNull();
  });
  it("der aktive Tab antwortet, sonst null", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    const endeA = a.starte(); await flush(); b.starte(); await flush();
    expect(await b.fremderLauf()).toBeNull();
    a.setzeLauf("simulation", true); a.setzeLauf("serie", true); a.setzeLauf("simulation", false);
    expect(await b.fremderLauf()).toBe("serie");
    a.setzeLauf("simulation", true);
    expect(await b.fremderLauf()).not.toBeNull();
    a.setzeLauf("simulation", false); a.setzeLauf("serie", false);
    expect(await b.fremderLauf()).toBeNull();
    endeA();
    expect(await b.fremderLauf()).toBeNull();
  });
});

describe("Dauerhafter Speicher (E28)", () => {
  it("fragt einmal, merkt das Ergebnis", async () => {
    const persist = vi.fn(async () => false);
    const w = welt(); const a = w.tab({ dauerhaft: { persist, persisted: async () => false } }, false);
    a.starte(); await flush();
    expect(a.zustand().dauerhaft).toBe("unbekannt");
    a.bitteDauerhaft(); a.bitteDauerhaft(); await flush();
    expect(persist).toHaveBeenCalledTimes(1);
    expect(a.zustand().dauerhaft).toBe("nein");
  });
  it("schon dauerhaft: ja, ohne zu fragen; ohne API: fehlt", async () => {
    const persist = vi.fn(async () => true);
    const w = welt(); const a = w.tab({ dauerhaft: { persist, persisted: async () => true } }, false);
    a.starte(); await flush(); a.bitteDauerhaft();
    expect(a.zustand().dauerhaft).toBe("ja");
    expect(persist).not.toHaveBeenCalled();
    expect(w.tab({}, false).zustand().dauerhaft).toBe("fehlt");
  });
});

/* ============================================================================
   N43 M3 (17.10.2026): Mutationstest lernstandort.ts 64,01 % -> Randfaelle. Jede Gruppe prueft ein
   VERHALTEN: die Browser-Umgebung (Sperre, Kanal, storage-Ereignis, Speicher, persist), das Lesen
   von `rev` auf der Platte, Nachrichten des Kanals, das Beenden (StrictMode) und die Schutzwege.
   ============================================================================ */
const roh = (w: ReturnType<typeof welt>, rev: unknown) => { w.m.set(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), tagesziel: 77, rev })); };

describe("(5) rev auf der Platte: nur eine ganze Zahl ab 0 zaehlt", () => {
  it.each([[2.5], [-3], ["9"], [null], [true]])("rev %j auf der Platte haelt das Schreiben NICHT auf", (rev) => {
    const w = welt(); const a = w.tab({ aufFremdes: undefined }, false); a.starte();
    roh(w, rev);
    a.aendere(setze(8));
    expect(a.zustand().konflikte).toBe(0);
    expect(platte(w)).toMatchObject({ tagesziel: 8, rev: 1 });
  });
  it.each([["kein JSON", "{kaputt"], ["Zahl", "5"], ["null", "null"], ["leer", ""]])("Platte %s: kein Konflikt, es wird geschrieben", (_n, t) => {
    const w = welt(); const a = w.tab({ aufFremdes: undefined }, false); a.starte();
    w.m.set(LS_SCHLUESSEL, t);
    a.aendere(setze(9));
    expect(a.zustand().konflikte).toBe(0);
    expect(platte(w).tagesziel).toBe(9);
  });
  it("gleiches rev auf der Platte ist KEIN Konflikt, hoeheres schon (und uebernimmt die Platte)", () => {
    const w = welt(); const a = w.tab({ aufFremdes: undefined }, false); a.starte();
    a.aendere(setze(4));
    roh(w, 1);
    a.aendere(setze(5));
    expect(a.zustand().konflikte).toBe(0);
    expect(platte(w)).toMatchObject({ tagesziel: 5, rev: 2 });
    roh(w, 3);
    a.aendere(setze(6));
    expect(a.zustand()).toMatchObject({ konflikte: 1, stand: { tagesziel: 77, rev: 3 } });
    expect(platte(w).tagesziel).toBe(77);
  });
  it("getItem wirft: kein Konflikt, kein Absturz", () => {
    const w = welt();
    const sp = { getItem: () => { throw new Error("weg"); }, setItem: () => undefined } as unknown as Storage;
    const b = w.tab({ speicher: sp, aufFremdes: undefined }, false); b.starte();
    expect(() => b.aendere(setze(2))).not.toThrow();
    expect(b.zustand().konflikte).toBe(0);
  });
});

describe("Schreiben: Fehler und Melden", () => {
  it("scheitert setItem, steht speicherFehler – und bleibt stehen, auch wenn spaeter wieder geschrieben wird", () => {
    const w = welt(); const a = w.tab({}, false); a.starte();
    expect(a.zustand().speicherFehler).toBe(false);
    a.aendere(setze(3));
    expect(a.zustand().speicherFehler).toBe(false);
    w.sperreSchluessel([LS_SCHLUESSEL]);
    a.aendere(setze(4));
    expect(a.zustand()).toMatchObject({ speicherFehler: true, stand: { tagesziel: 4, rev: 2 } });
    w.sperreSchluessel([]);
    a.aendere(setze(5));
    expect(a.zustand().speicherFehler).toBe(true);
    expect(platte(w).tagesziel).toBe(5);
  });
  it("ohne Schreiberlaubnis: der Stand aendert sich nur im Tab, rev bleibt, Abonnent hoert es", () => {
    const w = welt(); w.m.set(LS_SCHLUESSEL, "{kaputt"); w.sperreSchluessel([DEFEKT_SCHLUESSEL]);
    const a = w.tab({}, false); a.starte();
    const cb = vi.fn(); a.abonniere(cb);
    a.aendere(setze(3));
    expect(a.zustand()).toMatchObject({ speicherFehler: true, stand: { tagesziel: 3, rev: 0 } });
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it("die Aenderung bekommt eine Kopie: das Ergebnis der Funktion wird nicht veraendert", () => {
    const w = welt(); const a = w.tab({}, false); a.starte();
    const raus = { ...leererStand(), tagesziel: 6 };
    a.aendere(() => raus);
    expect(raus.rev).toBe(0);
    expect(a.zustand().stand).not.toBe(raus);
    expect(a.zustand().stand.rev).toBe(1);
  });
  it("abonniere: jede Aenderung meldet, abbestellen beendet es", () => {
    const w = welt(); const a = w.tab({}, false); a.starte();
    const cb = vi.fn(); const ab = a.abonniere(cb);
    a.aendere(setze(1)); expect(cb).toHaveBeenCalledTimes(1);
    ab(); a.aendere(setze(2)); expect(cb).toHaveBeenCalledTimes(1);
  });
  it("Startzustand traegt den Ladebefund", () => {
    const w = welt(); w.m.set(LS_SCHLUESSEL, "{kaputt");
    const a = w.tab({}, false);
    expect(a.zustand()).toMatchObject({ befund: "unlesbar", gesichert: true, speicherFehler: false, konflikte: 0, lauf: null });
    const b = welt().tab();
    expect(b.zustand()).toMatchObject({ befund: "leer", rolle: "start", reparaturen: [], gesichert: false });
  });
});

describe("storage-Ereignis", () => {
  it("der aktive Tab uebernimmt die Platte nur bei hoeherem rev", async () => {
    const w = welt(); const a = w.tab(); a.starte(); await flush();
    a.aendere(setze(5));                       /* rev 1 */
    w.fremd(JSON.stringify({ ...leererStand(), tagesziel: 66, rev: 1 })); await flush();
    expect(a.zustand().stand.tagesziel).toBe(5);
    w.fremd(JSON.stringify({ ...leererStand(), tagesziel: 67, rev: 2 })); await flush();
    expect(a.zustand().stand).toMatchObject({ tagesziel: 67, rev: 2 });
    w.fremd("{kaputt"); await flush();
    expect(a.zustand().stand.tagesziel).toBe(67);
  });
  it("nach dem Beenden wird nichts mehr uebernommen und der Lauscher ist abgemeldet", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush(); const endeB = b.starte(); await flush();
    endeB(); await flush();
    a.aendere(setze(55)); await flush();
    expect(b.zustand().stand.tagesziel).toBe(20);
    expect(b.zustand().rolle).toBe("start");
  });
  it("der Zuschauer uebernimmt jeden lesbaren Stand (auch mit kleinerem rev), aber keinen unlesbaren", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush(); b.starte(); await flush();
    a.aendere(setze(12)); a.aendere(setze(13)); await flush();
    expect(b.zustand().stand).toMatchObject({ tagesziel: 13, rev: 2 });
    w.fremd(JSON.stringify({ ...leererStand(), tagesziel: 14, rev: 0 })); await flush();
    expect(b.zustand().stand.tagesziel).toBe(14);
    w.fremd("{kaputt"); await flush();
    expect(b.zustand().stand.tagesziel).toBe(14);
  });
});

describe("Kanal: Nachrichten", () => {
  it("nur der aktive Tab antwortet; ein Zuschauer schweigt", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab(); const c = w.tab();
    a.starte(); await flush(); b.starte(); await flush(); c.starte(); await flush();
    b.setzeLauf("serie", true);
    expect(await c.fremderLauf()).toBeNull();
    a.setzeLauf("simulation", true);
    expect(await c.fremderLauf()).toBe("simulation");
  });
  it("ohne Kanal-Fabrik: fremderLauf ist sofort null und starte/beende laufen", async () => {
    const w = welt(); const a = w.tab({ kanal: undefined });
    const ende = a.starte(); await flush();
    expect(await a.fremderLauf()).toBeNull();
    expect(() => ende()).not.toThrow();
  });
  it("Vorgabe-Wartezeit ist 300 ms", async () => {
    vi.useFakeTimers();
    try {
      /* ohne warteMs (Vorgabe greift), ohne Speicher und Sperre; ein Kanal, auf dem niemand antwortet */
      const a = erzeugeQuelle({ speicher: undefined, jetzt: () => 0, kanal: () => ({ onmessage: null, postMessage: () => undefined, close: () => undefined }) });
      a.starte();
      let fertig: unknown = "offen";
      void a.fremderLauf().then((l) => { fertig = l; });
      await vi.advanceTimersByTimeAsync(299);
      expect(fertig).toBe("offen");
      await vi.advanceTimersByTimeAsync(2);
      expect(fertig).toBeNull();
    } finally { vi.useRealTimers(); }
  });
  it("eine Antwort mit falscher id beendet die Frage nicht; die mit der richtigen schon", async () => {
    const gesendet: unknown[] = [];
    let k: Kanal | null = null;
    const fabrik = (): Kanal => { k = { onmessage: null, postMessage: (d) => { gesendet.push(d); }, close: () => undefined }; return k; };
    const w = welt(); const a = w.tab({ kanal: fabrik, sperren: undefined, warteMs: 50 });
    a.starte();
    const p = a.fremderLauf();
    const frage = gesendet[0] as { art: string; id: string };
    expect(frage.art).toBe("frage");
    expect(frage.id).toMatch(/^\d+-[a-z0-9]+$/);
    expect(frage.id.startsWith(String(Date.UTC(2026, 8, 22)) + "-")).toBe(true);
    k!.onmessage?.({ data: { art: "status", id: "falsch", lauf: "serie" } });
    k!.onmessage?.({ data: null });
    k!.onmessage?.({ data: { art: "status" } });
    k!.onmessage?.({ data: { art: "status", id: frage.id } });
    expect(await p).toBeNull();
    const q = a.fremderLauf();
    const f2 = gesendet[1] as { id: string };
    k!.onmessage?.({ data: { art: "status", id: f2.id, lauf: "simulation" } });
    expect(await q).toBe("simulation");
  });
  it("der aktive Tab antwortet auf eine Frage mit art, id und lauf", async () => {
    const gesendet: unknown[] = [];
    let k: Kanal | null = null;
    const fabrik = (): Kanal => { k = { onmessage: null, postMessage: (d) => { gesendet.push(d); }, close: () => undefined }; return k; };
    const w = welt(); const a = w.tab({ kanal: fabrik });
    a.starte(); await flush();
    expect(a.zustand().rolle).toBe("aktiv");
    k!.onmessage?.({ data: { art: "frage", id: "x1" } });
    a.setzeLauf("serie", true);
    k!.onmessage?.({ data: { art: "frage", id: "x2" } });
    k!.onmessage?.({ data: { art: "status", id: "x3" } });
    k!.onmessage?.({ data: { art: "anderes", id: "x4" } });
    expect(gesendet).toEqual([{ art: "status", id: "x1", lauf: null }, { art: "status", id: "x2", lauf: "serie" }]);
  });
  it("beende schliesst den Kanal", async () => {
    const close = vi.fn();
    const w = welt(); const a = w.tab({ kanal: () => ({ onmessage: null, postMessage: () => undefined, close }) });
    const ende = a.starte(); await flush();
    ende();
    expect(close).toHaveBeenCalledTimes(1);
    ende();
    expect(close).toHaveBeenCalledTimes(1);
    expect(await a.fremderLauf()).toBeNull();
  });
});

describe("Beenden und Neustart (StrictMode)", () => {
  it("beende gibt die Sperre frei: ein wartender Tab wird aktiv; die Rolle faellt auf start bzw. ohneSperre", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    const endeA = a.starte(); await flush(); b.starte(); await flush();
    endeA(); await flush();
    expect(a.zustand().rolle).toBe("start");
    expect(b.zustand().rolle).toBe("aktiv");
    const c = w.tab({}, false); const endeC = c.starte(); endeC();
    expect(c.zustand().rolle).toBe("ohneSperre");
  });
  it("starte – beende – starte: wird wieder Zuschauer bzw. aktiv, ohne doppelte Lauscher", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush();
    const e1 = b.starte(); e1(); b.starte(); await flush();
    expect(b.zustand().rolle).toBe("zuschauer");
    const cb = vi.fn(); b.abonniere(cb);
    a.aendere(setze(31)); await flush();
    expect(b.zustand().stand.tagesziel).toBe(31);
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it("beende, bevor die Sperre entschieden ist: der Tab wird weder aktiv noch Zuschauer", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush();
    const eb = b.starte(); eb(); await flush();
    expect(b.zustand().rolle).toBe("start");
    const c = w.tab(); const ec = c.starte(); ec(); await flush();
    expect(c.zustand().rolle).toBe("start");
  });
  it("ein beendeter wartender Tab wird nicht aktiv, wenn der aktive schliesst", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab(); const c = w.tab();
    const ea = a.starte(); await flush(); const eb = b.starte(); await flush(); c.starte(); await flush();
    eb(); await flush();
    ea(); await flush();
    expect(b.zustand().rolle).toBe("start");
    expect(c.zustand().rolle).toBe("aktiv");
  });
});

describe("(3) hierWeiter: wann es nichts tut", () => {
  it("ohne Sperre, nicht gestartet oder schon aktiv: kein Rollenwechsel", async () => {
    const w = welt();
    const o = w.tab({}, false); o.starte(); await o.hierWeiter();
    expect(o.zustand().rolle).toBe("ohneSperre");
    const a = w.tab(); a.starte(); await flush();
    const b = w.tab(); await b.hierWeiter(); await flush();
    expect(b.zustand().rolle).toBe("start");
    expect(a.zustand().rolle).toBe("aktiv");
    const cb = vi.fn(); a.abonniere(cb);
    await a.hierWeiter(); await flush();
    expect(a.zustand().rolle).toBe("aktiv");
    expect(cb).not.toHaveBeenCalled();
  });
  it("beendet waehrend des Stehlens: wird nicht aktiv", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab();
    a.starte(); await flush(); const eb = b.starte(); await flush();
    const p = b.hierWeiter(); eb(); await p; await flush();
    expect(b.zustand().rolle).toBe("start");
  });
  it("wer gestohlen hat, verliert die Sperre an den naechsten Stehler und wartet wieder", async () => {
    const w = welt(); const a = w.tab(); const b = w.tab(); const c = w.tab();
    a.starte(); await flush(); b.starte(); await flush(); c.starte(); await flush();
    await b.hierWeiter(); await flush();
    await c.hierWeiter(); await flush();
    expect(c.zustand().rolle).toBe("aktiv");
    expect(b.zustand().rolle).toBe("zuschauer");
    expect(a.zustand().rolle).toBe("zuschauer");
  });
});

describe("Sperre lehnt ab (Fehler im LockManager)", () => {
  it("der Tab wird Zuschauer und stellt sich an; beendet bleibt er start", async () => {
    let n = 0;
    const sperren: Sperren = { request: (_n, _o, _cb) => { n++; return n === 1 ? Promise.reject(new Error("nein")) : new Promise(() => { /* nie entschieden */ }); } };
    const w = welt(); const a = w.tab({ sperren });
    a.starte(); await flush();
    expect(a.zustand().rolle).toBe("zuschauer");
    expect(n).toBe(2);
    const sperren2: Sperren = { request: () => Promise.reject(new Error("nein")) };
    const b = w.tab({ sperren: sperren2 }); const eb = b.starte(); eb(); await flush();
    expect(b.zustand().rolle).toBe("start");
  });
  it("die Anfragen tragen Name und Optionen", async () => {
    const anfragen: { name: string; opt: object }[] = [];
    const sperren: Sperren = { request: (name, opt) => { anfragen.push({ name, opt }); return new Promise(() => { /* nie entschieden */ }); } };
    const w = welt(); const a = w.tab({ sperren });
    a.starte(); await flush();
    expect(anfragen).toEqual([{ name: SPERRE, opt: { ifAvailable: true } }]);
  });
});

describe("Dauerhafter Speicher: Grenzfaelle", () => {
  it("persist wirft -> nein; persisted wirft -> bleibt unbekannt", async () => {
    const w = welt();
    const a = w.tab({ dauerhaft: { persist: () => Promise.reject(new Error("x")), persisted: () => Promise.reject(new Error("y")) } }, false);
    a.starte(); await flush();
    expect(a.zustand().dauerhaft).toBe("unbekannt");
    a.bitteDauerhaft(); await flush();
    expect(a.zustand().dauerhaft).toBe("nein");
  });
  it("persist sagt ja -> ja; danach wird nicht mehr gefragt", async () => {
    const persist = vi.fn(async () => true);
    const w = welt(); const a = w.tab({ dauerhaft: { persist, persisted: async () => false } }, false);
    a.starte(); await flush();
    a.bitteDauerhaft(); await flush();
    expect(a.zustand().dauerhaft).toBe("ja");
    a.bitteDauerhaft(); await flush();
    expect(persist).toHaveBeenCalledTimes(1);
  });
  it("ein Zuschauer fragt nicht; ohne API passiert nichts", async () => {
    const persist = vi.fn(async () => true);
    const w = welt(); const a = w.tab(); a.starte(); await flush();
    const b = w.tab({ dauerhaft: { persist, persisted: async () => false } }); b.starte(); await flush();
    expect(b.zustand().rolle).toBe("zuschauer");
    b.bitteDauerhaft(); await flush();
    expect(persist).not.toHaveBeenCalled();
    expect(b.zustand().dauerhaft).toBe("unbekannt");
    a.bitteDauerhaft(); await flush();
    expect(a.zustand().dauerhaft).toBe("fehlt");
  });
});

describe("Laeufe: mehrere zugleich", () => {
  it("der erste noch laufende zaehlt; Abmelden eines nie angemeldeten aendert nichts", () => {
    const w = welt(); const a = w.tab(); const cb = vi.fn(); a.abonniere(cb);
    a.setzeLauf("serie", false);
    expect(cb).not.toHaveBeenCalled();
    a.setzeLauf("serie", true); a.setzeLauf("simulation", true);
    expect(a.zustand().lauf).toBe("serie");
    a.setzeLauf("serie", false);
    expect(a.zustand().lauf).toBe("simulation");
    expect(cb).toHaveBeenCalledTimes(2);
  });
});

describe("Browser-Umgebung (Vorgabe von erzeugeQuelle)", () => {
  afterEach(() => { vi.unstubAllGlobals(); });
  function browser(opt: { storage?: object; ohneFenster?: boolean } = {}) {
    const w = welt();
    const anfragen: { name: string; opt: object }[] = [];
    const locks: Sperren = { request: (name, o, cb) => { anfragen.push({ name, opt: o }); return Promise.resolve(cb({ name })).then(() => undefined); } };
    const kanaele: { name: string; closed: boolean }[] = [];
    class BC { onmessage = null; name: string; constructor(n: string) { this.name = n; kanaele.push(this as unknown as { name: string; closed: boolean }); } postMessage() { /* leer */ } close() { (this as unknown as { closed: boolean }).closed = true; } }
    const handler = new Set<(e: { key: string | null }) => void>();
    const fenster = {
      addEventListener: (t: string, h: (e: { key: string | null }) => void) => { if (t === "storage") handler.add(h); },
      removeEventListener: (t: string, h: (e: { key: string | null }) => void) => { if (t === "storage") handler.delete(h); },
    };
    const ls = { getItem: (k: string) => w.m.get(k) ?? null, setItem: (k: string, v: string) => { w.m.set(k, v); }, removeItem: (k: string) => { w.m.delete(k); } };
    vi.stubGlobal("navigator", { locks, storage: opt.storage });
    vi.stubGlobal("BroadcastChannel", BC);
    vi.stubGlobal("localStorage", ls);
    if (!opt.ohneFenster) vi.stubGlobal("window", fenster);
    const feuer = (key: string | null) => { for (const h of [...handler]) h({ key }); };
    return { w, anfragen, kanaele, handler, feuer };
  }
  it("liest localStorage, nimmt navigator.locks und einen BroadcastChannel namens SPERRE", async () => {
    const b = browser();
    b.w.m.set(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), tagesziel: 42, rev: 4 }));
    const q = erzeugeQuelle();
    expect(q.zustand()).toMatchObject({ befund: "gelesen", stand: { tagesziel: 42 }, rolle: "start", dauerhaft: "fehlt" });
    const ende = q.starte(); await flush();
    expect(b.anfragen[0]).toEqual({ name: SPERRE, opt: { ifAvailable: true } });
    expect(q.zustand().rolle).toBe("aktiv");
    expect(b.kanaele.map((k) => k.name)).toEqual([SPERRE]);
    q.aendere(setze(43));
    expect(JSON.parse(b.w.m.get(LS_SCHLUESSEL)!)).toMatchObject({ tagesziel: 43, rev: 5 });
    expect(b.handler.size).toBe(1);
    ende();
    expect(b.handler.size).toBe(0);
    expect(b.kanaele[0]!.closed).toBe(true);
  });
  it("storage-Ereignis: nur der eigene Schluessel oder key null (clear) loesen das Lesen aus", async () => {
    const b = browser();
    vi.stubGlobal("navigator", { locks: { request: () => Promise.resolve(undefined).then(() => undefined) } });
    /* Sperre nie gewaehrt -> bleibt start; ohne Sperren-Antwort hilft (5): hoeheres rev wird uebernommen */
    const q = erzeugeQuelle(); q.starte(); await flush();
    b.w.m.set(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), tagesziel: 61, rev: 3 }));
    b.feuer("anderer_schluessel");
    expect(q.zustand().stand.tagesziel).toBe(20);
    b.feuer(LS_SCHLUESSEL);
    expect(q.zustand().stand.tagesziel).toBe(61);
    b.w.m.set(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), tagesziel: 62, rev: 4 }));
    b.feuer(null);
    expect(q.zustand().stand.tagesziel).toBe(62);
  });
  it("persist nur, wenn beide Funktionen da sind; die Aufrufe gehen an navigator.storage", async () => {
    const persist = vi.fn(async () => true);
    const persisted = vi.fn(async () => false);
    browser({ storage: { persist, persisted } });
    const q = erzeugeQuelle();
    expect(q.zustand().dauerhaft).toBe("unbekannt");
    q.starte(); await flush();
    expect(persisted).toHaveBeenCalledTimes(1);
    q.bitteDauerhaft(); await flush();
    expect(persist).toHaveBeenCalledTimes(1);
    expect(q.zustand().dauerhaft).toBe("ja");
    vi.unstubAllGlobals();
    browser({ storage: { persist } });
    expect(erzeugeQuelle().zustand().dauerhaft).toBe("fehlt");
    vi.unstubAllGlobals();
    browser({ storage: { persisted } });
    expect(erzeugeQuelle().zustand().dauerhaft).toBe("fehlt");
  });
  it("ohne window, ohne BroadcastChannel, ohne navigator: laeuft trotzdem (Rolle ohneSperre)", async () => {
    browser({ ohneFenster: true });
    vi.stubGlobal("BroadcastChannel", undefined);
    vi.stubGlobal("navigator", undefined);
    const q = erzeugeQuelle();
    expect(q.zustand()).toMatchObject({ rolle: "ohneSperre", dauerhaft: "fehlt" });
    const ende = q.starte(); await flush();
    expect(await q.fremderLauf()).toBeNull();
    q.aendere(setze(7));
    expect(q.zustand().stand.rev).toBe(1);
    ende();
  });
  it("die Uhr ist Date.now: eine Sicherung beim Laden traegt die aktuelle Zeit", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(Date.UTC(2026, 9, 17, 12));
      const b = browser();
      b.w.m.set(LS_SCHLUESSEL, "{kaputt");
      erzeugeQuelle();
      const s = JSON.parse(b.w.m.get(DEFEKT_SCHLUESSEL)!) as { zeit: string }[];
      expect(s.at(-1)!.zeit).toBe("2026-10-17T12:00:00.000Z");
    } finally { vi.useRealTimers(); }
  });
});

describe("Veraltete Antworten der Sperre nach Neustart (StrictMode) – von Hand ausgeloest", () => {
  /** LockManager, dessen Antworten der Test selbst ausloest: gewaehre(i, lock) ruft den Rueckruf, lehneAb(i) verwirft. */
  function handSperre() {
    const an: { opt: { ifAvailable?: boolean; steal?: boolean; signal?: AbortSignal }; cb: (l: unknown) => unknown; res: (v: unknown) => void; rej: (e: unknown) => void }[] = [];
    const sperren: Sperren = { request: (_n, opt, cb) => new Promise((res, rej) => { an.push({ opt, cb, res, rej }); }) };
    /* der Rueckruf des aktiven Tabs gibt `halte()` zurueck – ein Promise, das erst beim Loslassen endet; darauf wird NICHT gewartet */
    const gewaehre = async (i: number, lock: unknown = { name: SPERRE }) => { const a = an[i]!; const v = a.cb(lock); if (!(v instanceof Promise)) a.res(v); await flush(); };
    const lehneAb = async (i: number) => { an[i]!.rej(new DOMException("weg", "AbortError")); await flush(); };
    return { an, sperren, gewaehre, lehneAb };
  }
  it("die Antwort auf das erste starte wird nach beende+starte ignoriert, die zweite zaehlt", async () => {
    const h = handSperre(); const w = welt(); const q = w.tab({ sperren: h.sperren });
    const e1 = q.starte(); e1(); q.starte();
    expect(h.an.map((a) => a.opt)).toEqual([{ ifAvailable: true }, { ifAvailable: true }]);
    await h.gewaehre(0);
    expect(q.zustand().rolle).toBe("start");
    await h.lehneAb(0);
    expect(q.zustand().rolle).toBe("start");
    await h.gewaehre(1);
    expect(q.zustand().rolle).toBe("aktiv");
  });
  it("veraltetes „nicht verfuegbar“ macht den neu gestarteten Tab nicht zum Zuschauer", async () => {
    const h = handSperre(); const w = welt(); const q = w.tab({ sperren: h.sperren });
    const e1 = q.starte(); e1(); q.starte();
    await h.gewaehre(0, null);
    expect(q.zustand().rolle).toBe("start");
    expect(h.an).toHaveLength(2);
  });
  it("Warteschlange: eine veraltete Zusage oder Ablehnung nach Neustart bleibt ohne Wirkung", async () => {
    const h = handSperre(); const w = welt(); const q = w.tab({ sperren: h.sperren });
    const e1 = q.starte();
    await h.gewaehre(0, null);                       /* nicht frei -> Zuschauer, stellt sich an (1) */
    expect(q.zustand().rolle).toBe("zuschauer");
    expect(h.an[1]!.opt.signal).toBeInstanceOf(AbortSignal);
    expect(h.an[1]!.opt.signal!.aborted).toBe(false);
    e1();
    expect(h.an[1]!.opt.signal!.aborted).toBe(true);
    q.starte();                                      /* (2) */
    await h.gewaehre(1);
    expect(q.zustand().rolle).toBe("start");
    await h.lehneAb(1);
    expect(q.zustand().rolle).toBe("start");
    expect(h.an).toHaveLength(3);
  });
  it("Warteschlange: wird die wartende Anfrage abgelehnt, stellt sich der Tab erneut an", async () => {
    const h = handSperre(); const w = welt(); const q = w.tab({ sperren: h.sperren });
    q.starte();
    await h.gewaehre(0, null);
    await h.lehneAb(1);
    expect(q.zustand().rolle).toBe("zuschauer");
    expect(h.an).toHaveLength(3);
    expect(h.an[2]!.opt.signal).toBeInstanceOf(AbortSignal);
    await h.gewaehre(2);
    expect(q.zustand().rolle).toBe("aktiv");
  });
  it("hierWeiter, waehrend die erste Anfrage noch offen ist: kein Fehler, stiehlt, wird aktiv", async () => {
    const h = handSperre(); const w = welt(); const q = w.tab({ sperren: h.sperren });
    q.starte();
    const p = q.hierWeiter();
    expect(h.an[1]!.opt).toEqual({ steal: true });
    await h.gewaehre(1);
    await expect(p).resolves.toBeUndefined();
    expect(q.zustand().rolle).toBe("aktiv");
  });
  it("hierWeiter: beendet vor der Zusage -> Promise endet trotzdem, Tab bleibt start", async () => {
    const h = handSperre(); const w = welt(); const q = w.tab({ sperren: h.sperren });
    const e = q.starte();
    await h.gewaehre(0, null);
    const p = q.hierWeiter();
    e();
    let fertig = false; void p.then(() => { fertig = true; });
    await h.gewaehre(2);
    expect(fertig).toBe(true);
    expect(q.zustand().rolle).toBe("start");
  });
  it("hierWeiter: wird das Stehlen abgelehnt, endet das Promise und der Tab wartet wieder", async () => {
    const h = handSperre(); const w = welt(); const q = w.tab({ sperren: h.sperren });
    q.starte();
    await h.gewaehre(0, null);
    const p = q.hierWeiter();
    let fertig = false; void p.then(() => { fertig = true; });
    await h.lehneAb(2);
    expect(fertig).toBe(true);
    expect(q.zustand().rolle).toBe("zuschauer");
    expect(h.an).toHaveLength(4);
    expect(h.an[3]!.opt.signal).toBeInstanceOf(AbortSignal);
  });
  it("hierWeiter abgelehnt NACH beende: kein Zuschauer, keine neue Anfrage", async () => {
    const h = handSperre(); const w = welt(); const q = w.tab({ sperren: h.sperren });
    const e = q.starte();
    await h.gewaehre(0, null);
    const p = q.hierWeiter(); e();
    await h.lehneAb(2); await p;
    expect(q.zustand().rolle).toBe("start");
    expect(h.an).toHaveLength(3);
  });
  it("ohne aktiven Tab antwortet auch ein Zuschauer mit Lauf nicht", async () => {
    const w = welt(); const sperren: Sperren = { request: (_n, o, cb) => (o.ifAvailable ? Promise.resolve(cb(null)) : new Promise(() => { /* nie entschieden */ })) };
    const b = w.tab({ sperren }); const c = w.tab({ sperren });
    b.starte(); c.starte(); await flush();
    expect(b.zustand().rolle).toBe("zuschauer");
    b.setzeLauf("serie", true);
    expect(await c.fremderLauf()).toBeNull();
  });
});
