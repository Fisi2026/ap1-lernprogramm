/* ============================================================================
   DAS GLOSSAR — DIE REGELN, GEMESSEN AM ECHTEN BESTAND

   ⚠️ KEIN GLEICHHEITSBEWEIS: `glossarBegriffeView` schreibt in `host.innerHTML`
      und laesst sich ohne halbe alte Oberflaeche nicht fahren. Gemessen wird die
      REGEL — welcher Begriff entsteht, welcher nicht, in welcher Reihenfolge, und
      wann die Abkuerzungen frei sind.
   ============================================================================ */
import { CONFIG } from "./tabellen/konfig.ts";
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import * as GLOSSAR from "./tabellen/glossar.ts";
import { ABKUERZUNGEN as ROH_ABK } from "./tabellen/abkuerzungen.ts";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import {
  begriffAus, begriffe, abkuerzungen, abkuerzungenFrei, nochBisFrei,
  passendeBegriffe, passendeAbk, HOECHSTLAENGE,
} from "./glossar";

const ALLE = begriffe(FRAGEN);
const TOR = CONFIG.gate;

/** Ein Stand mit genau n beantworteten Fragen (die acht Module zaehlen). */
function mitAntworten(n: number): Lernstand {
  return { ...leererStand(), statistik: { M01: { richtig: n, gesamt: n } } } as Lernstand;
}
const frage = (f: Partial<Frage>): Frage =>
  ({ id: "X", typ: "erklaeren", modul: "M01", thema: "T", frage: "", musterloesung: "D", ...f }) as Frage;

describe("Welcher Begriff aus einer Frage entsteht", () => {
  it("schneidet den Vorspann und das Schlusszeichen weg", () => {
    expect(begriffAus(frage({ frage: "Erkläre den Begriff: Prokura." }))).toBe("Prokura");
    expect(begriffAus(frage({ frage: "Erkläre das Modell OSI-Schichtenmodell:" }))).toBe("OSI-Schichtenmodell");
    expect(begriffAus(frage({ frage: "Erkläre Hashwert" }))).toBe("Hashwert");
  });

  it("nimmt nur erklaeren-Fragen MIT Musterloesung", () => {
    expect(begriffAus(frage({ typ: "mc", frage: "Erkläre X" }))).toBeNull();
    expect(begriffAus(frage({ frage: "Erkläre X", musterloesung: undefined }))).toBeNull();
  });

  /* ⛔ DER KURZBEGRIFF-FILTER IST DER GRUND, WARUM DAS LEXIKON EINES IST: ohne ihn
     stuenden ganze Satzfragen zwischen den Begriffen. */
  it("laesst ganze Satzfragen und ueberlange Texte draussen", () => {
    expect(begriffAus(frage({ frage: "Erkläre: Was ist ein Netzplan?" }))).toBeNull();
    expect(begriffAus(frage({ frage: "Erkläre " + "A".repeat(HOECHSTLAENGE + 1) }))).toBeNull();
    expect(begriffAus(frage({ frage: "Erkläre " + "A".repeat(HOECHSTLAENGE) }))).toBe("A".repeat(HOECHSTLAENGE));
  });
});

describe("Das Lexikon aus dem Bestand", () => {
  it("hat genug Eintraege, und jeder traegt Begriff und Definition", () => {
    expect(ALLE.length).toBeGreaterThan(50);      // faellt der Bau still aus, faellt das auf
    for (const b of ALLE) {
      expect(b.term.length).toBeGreaterThan(0);
      expect(b.def.length).toBeGreaterThan(0);
      expect(b.modul.length).toBeGreaterThan(0);
    }
  });

  it("enthaelt genau die Begriffe, die der Pool hergibt — und keinen erfundenen", () => {
    const ausPool = new Set<string>();
    for (const f of FRAGEN) {
      const t = begriffAus(f);
      if (t) ausPool.add(t.toLowerCase());
    }
    expect(ausPool.size).toBeGreaterThan(20);
    const m09 = new Set(GLOSSAR.GLOSSAR_M09_BEGRIFFE.map((t) => t.toLowerCase()));
    for (const b of ALLE) {
      expect(ausPool.has(b.term.toLowerCase()) || m09.has(b.term.toLowerCase()), b.term).toBe(true);
    }
  });

  it("nimmt die Klausurbegriffe mit — Definition aus GLOSSAR_TIPS", () => {
    const drin = new Map(ALLE.map((b) => [b.term, b]));
    const ausPool = new Set<string>();
    for (const f of FRAGEN) {
      const t = begriffAus(f);
      if (t) ausPool.add(t.toLowerCase());
    }
    const erwartet = GLOSSAR.GLOSSAR_M09_BEGRIFFE.filter((t) => GLOSSAR.GLOSSAR_TIPS[t]);
    expect(erwartet.length).toBeGreaterThan(30);
    for (const t of erwartet) {
      expect(drin.has(t), t).toBe(true);
      /* ⛔ NUR WO DER POOL NICHTS HAT. "Meilenstein" steht in beiden Quellen, und
         der Pool kommt zuerst — dort gilt SEINE Musterloesung (die laengere).
         Der erste Anlauf verlangte hier GLOSSAR_TIPS fuer jeden Begriff und fiel
         zu Recht: er hat die Reihenfolge der alten App nicht abgebildet. */
      if (!ausPool.has(t.toLowerCase())) {
        expect(drin.get(t)!.def, t).toBe(GLOSSAR.GLOSSAR_TIPS[t]);
        expect(drin.get(t)!.modul, t).toBe("M09");
      }
    }
  });

  /* ⛔⛔ DIESER TEST WAR ZUERST LEER, UND ER WAERE GRUEN GEBLIEBEN. Er lief ueber
     "alle Klausurbegriffe ohne Definition" — und davon gibt es im Bestand
     **null von 34** (nachgemessen 16.09.2026). Eine Schleife ueber eine leere
     Liste prueft nichts und meldet Erfolg.
     ►► Gemessen wird jetzt an einem GEBAUTEN Fall, und der Test sagt ausdruecklich,
        dass der Bestand ihn nicht erreicht. */
  it("laesst einen Klausurbegriff OHNE Definition weg, statt ihn leer zu zeigen", () => {
    expect(GLOSSAR.GLOSSAR_M09_BEGRIFFE.filter((t) => !GLOSSAR.GLOSSAR_TIPS[t]).length).toBe(0);
    const gebaut = begriffe(FRAGEN, {
      GLOSSAR_M09_BEGRIFFE: ["Begriff ohne Definition", "Begriff mit Definition"],
      GLOSSAR_TIPS: { "Begriff mit Definition": "Hier steht etwas." },
    });
    expect(gebaut.some((b) => b.term === "Begriff mit Definition")).toBe(true);
    expect(gebaut.some((b) => b.term === "Begriff ohne Definition")).toBe(false);
  });

  /* ⛔ "Meilenstein" steht in BEIDEN Quellen. Der Pool kommt zuerst, also gewinnt
     sein Modul — und der Begriff steht genau EINMAL da. */
  it("zeigt einen doppelt vorhandenen Begriff nur einmal", () => {
    const doppelt = ALLE.filter((b) => b.term === "Meilenstein");
    expect(doppelt.length).toBe(1);
    expect(doppelt[0].modul).not.toBe("M09");
    const klein = ALLE.map((b) => b.term.toLowerCase());
    expect(new Set(klein).size).toBe(klein.length);
  });

  /* ⛔⛔ DER POOL ERREICHT DIESEN ZWEIG NICHT: nachgemessen am 16.09.2026 gibt es
     unter den 33 Pool-Begriffen **keinen einzigen doppelten**. Die Sabotage, die
     das Aussortieren im Pool-Durchlauf entfernt, blieb deshalb gruen — der Test
     oben trifft nur die Dopplung zwischen Pool und Klausurliste.
     ►► Gemessen wird der Zweig jetzt an einem GEBAUTEN Bestand: zwei Fragen,
        derselbe Begriff. Die erste gewinnt, wie in der alten App. */
  it("nimmt bei zwei Fragen zum selben Begriff die erste", () => {
    const zwei = [
      /* ⚠️ "Erkläre Hashwert" MIT Leerzeichen: der Vorspann verlangt `\s+` nach
         "Erkläre" — ohne Leerzeichen ("Erkläre: Hashwert") bleibt er stehen, und
         der erste Anlauf dieses Tests fiel genau darueber. */
      frage({ id: "A", frage: "Erkläre Hashwert", musterloesung: "Erste Fassung" }),
      frage({ id: "B", frage: "Erkläre den Begriff: hashwert", musterloesung: "Zweite Fassung" }),
    ];
    const l = begriffe(zwei, { GLOSSAR_M09_BEGRIFFE: [], GLOSSAR_TIPS: {} });
    expect(l.length).toBe(1);
    expect(l[0].def).toBe("Erste Fassung");
  });

  it("ist nach deutscher Sortierung geordnet", () => {
    const sortiert = [...ALLE].sort((a, b) => a.term.localeCompare(b.term, "de"));
    expect(ALLE.map((b) => b.term)).toEqual(sortiert.map((b) => b.term));
  });
});

describe("Die Abkuerzungen", () => {
  it("nimmt alle aus abkuerzungen.js, nach Kuerzel sortiert", () => {
    const a = abkuerzungen();
    expect(a.length).toBe(ROH_ABK.length);
    expect(a.length).toBeGreaterThan(100);
    expect(a.map((x) => x.kurz)).toEqual(
      [...ROH_ABK].sort((x, y) => x.kurz.localeCompare(y.kurz, "de")).map((x) => x.kurz),
    );
  });

  it("ruehrt die Quelle nicht an — Sortieren darf sie nicht umstellen", () => {
    const vorher = ROH_ABK.map((x) => x.kurz).join("|");
    abkuerzungen();
    expect(ROH_ABK.map((x) => x.kurz).join("|")).toBe(vorher);
  });
});

describe("Das Tor vor den Abkuerzungen", () => {
  it("geht erst UEBER der Grenze auf, nicht auf ihr", () => {
    expect(TOR).toBeGreaterThan(0);
    expect(abkuerzungenFrei(mitAntworten(TOR - 1))).toBe(false);
    expect(abkuerzungenFrei(mitAntworten(TOR))).toBe(false);      // "> gate", nicht ">="
    expect(abkuerzungenFrei(mitAntworten(TOR + 1))).toBe(true);
  });

  it("sagt, wie viele Fragen noch fehlen — und nie eine negative Zahl", () => {
    expect(nochBisFrei(leererStand() as Lernstand)).toBe(TOR + 1);
    expect(nochBisFrei(mitAntworten(TOR))).toBe(1);
    expect(nochBisFrei(mitAntworten(TOR + 1))).toBe(0);
    expect(nochBisFrei(mitAntworten(TOR + 50))).toBe(0);
  });
});

describe("Die Suche", () => {
  it("findet einen Begriff auch ueber seine Definition", () => {
    const ziel = ALLE.find((b) => b.def.length > 20)!;
    const wort = ziel.def.split(" ").find((w) => w.length > 6)!;
    expect(passendeBegriffe(ALLE, wort).some((b) => b.term === ziel.term)).toBe(true);
  });

  it("achtet nicht auf Gross- und Kleinschreibung", () => {
    const ziel = ALLE[0].term;
    expect(passendeBegriffe(ALLE, ziel.toUpperCase()).some((b) => b.term === ziel)).toBe(true);
    expect(passendeBegriffe(ALLE, ziel.toLowerCase()).some((b) => b.term === ziel)).toBe(true);
  });

  it("gibt bei leerem Suchtext alles zurueck, bei keinem Treffer nichts", () => {
    expect(passendeBegriffe(ALLE, "   ").length).toBe(ALLE.length);
    expect(passendeBegriffe(ALLE, "qqxyzqq").length).toBe(0);
    expect(passendeAbk(abkuerzungen(), "").length).toBe(abkuerzungen().length);
    expect(passendeAbk(abkuerzungen(), "qqxyzqq").length).toBe(0);
  });

  it("sucht bei den Abkuerzungen auch in Langform, Definition und Kategorie", () => {
    const a = abkuerzungen();
    const ziel = a.find((x) => x.lang.length > 8)!;
    expect(passendeAbk(a, ziel.lang).some((x) => x.kurz === ziel.kurz)).toBe(true);
    expect(passendeAbk(a, ziel.kat).some((x) => x.kurz === ziel.kurz)).toBe(true);
  });
});
