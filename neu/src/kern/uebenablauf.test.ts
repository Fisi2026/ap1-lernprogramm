/* N37 U5 (E60): der Ablauf des Ueben-Schirms, DOM-frei. Jede Regel hier stand bis U5 nur im Schirm
   und war nur ueber jsdom-Klicks erreichbar. Die ⛔-Faelle sind die Fehler, die der Schirm schon hatte. */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Frage } from "@/daten/typen";
import type { Zufallsaufgabe } from "./generator";
import type { Zug } from "./ziehen";

const zuege: Zug[] = [];
vi.mock("./ziehen", () => ({
  ziehe: vi.fn(() => {
    const z = zuege.shift();
    if (!z) throw new Error("Test hat keinen Zug mehr vorbereitet");
    return z;
  }),
}));

import {
  UEBEN_START, uebenSchritt, zieheFuerUeben, aktuellerEintrag, istLive, kannZurueck, amEnde,
  angebotMoeglich, type UebenAktion, type UebenZustand,
} from "./uebenablauf";

const FRAGE = { id: "F1", thema: "Netz" } as unknown as Frage;
const AUFGABE = { id: "GEN-1" } as unknown as Zufallsaufgabe;
const pool = (id: string, thema?: string, herkunft: "deck" | "serie" | "fehlerdeck" = "deck"): UebenAktion =>
  ({ art: "gezogen", ergebnis: { art: "pool", id, herkunft, thema }, serieVerbraucht: herkunft === "serie" });
const zufall: UebenAktion = { art: "gezogen", ergebnis: { art: "zufall", aufgabe: AUFGABE }, serieVerbraucht: false };
const fahre = (...a: UebenAktion[]): UebenZustand => a.reduce(uebenSchritt, UEBEN_START);

describe("uebenSchritt", () => {
  it("eine Pool-Ziehung haengt an den Verlauf an und ist live", () => {
    const z = fahre(pool("A", "T1"), pool("B", "T2"));
    expect(z.verlauf.map((e) => e.id)).toEqual(["A", "B"]);
    expect(z.idx).toBe(1);
    expect(istLive(z)).toBe(true);
    expect(amEnde(z)).toBe(true);
    expect(kannZurueck(z)).toBe(true);
  });

  it("merkt nur die letzten zwei Themen und laesst leere aus", () => {
    expect(fahre(pool("A", "T1"), pool("B"), pool("C", "T2"), pool("D", "T3")).letzteThemen).toEqual(["T2", "T3"]);
  });

  it("zurueck im Verlauf: nicht mehr live, nicht am Ende; zurAktuellen fuehrt ans Ende", () => {
    const z = fahre(pool("A"), pool("B"), { art: "zurueck" });
    expect(z.idx).toBe(0);
    expect(istLive(z)).toBe(false);
    expect(amEnde(z)).toBe(false);
    expect(kannZurueck(z)).toBe(false);
    const w = uebenSchritt(z, { art: "zurAktuellen" });
    expect(w.idx).toBe(1);
    expect(istLive(w)).toBe(true);
  });

  it("⛔ eine Zufallsaufgabe kommt NICHT in den Verlauf, und die Karte davor ist danach nicht mehr live", () => {
    const z = fahre(pool("A"), zufall);
    expect(z.verlauf).toHaveLength(1);
    expect(z.zufall).toBe(AUFGABE);
    expect(z.herkunft).toBe("generator");
    expect(amEnde(z)).toBe(true);
    expect(istLive(z)).toBe(false);
    expect(kannZurueck(z), "auch bei idx 0: Zurueck fuehrt von der Aufgabe auf die echte Frage").toBe(true);
    const zurueck = uebenSchritt(z, { art: "zurueck" });
    expect(zurueck.zufall).toBeNull();
    expect(aktuellerEintrag(zurueck)?.id).toBe("A");
    expect(istLive(zurueck), "sonst buchte ein Klick ein zweites Mal").toBe(false);
  });

  it("⛔ N20a: ist die ERSTE Karte eine Zufallsaufgabe, ist Zurueck gesperrt", () => {
    expect(kannZurueck(fahre(zufall))).toBe(false);
  });

  it("die gemerkte Antwort landet am gezeigten Eintrag", () => {
    const z = fahre(pool("A"), pool("B"), { art: "antwortGemerkt", antwort: 2 });
    expect(z.verlauf.map((e) => e.antwort)).toEqual([undefined, 2]);
  });

  it("leer: nichts gezogen, Verlauf bleibt", () => {
    const z = fahre(pool("A"), { art: "gezogen", ergebnis: { art: "leer" }, serieVerbraucht: false });
    expect(z.leer).toBe(true);
    expect(z.verlauf).toHaveLength(1);
    expect(uebenSchritt(z, pool("B")).leer).toBe(false);
  });

  it("#60: Angebot nur nach falscher Antwort, ohne laufende Serie; Serie wird je Zug verbraucht", () => {
    const z = fahre(pool("A"));
    expect(angebotMoeglich(z, true)).toBe(false);
    expect(uebenSchritt(z, { art: "angebot", frage: FRAGE, ids: [] }).angebot, "ohne Kandidaten kein Angebot").toBeNull();
    const mitAngebot = uebenSchritt(z, { art: "angebot", frage: FRAGE, ids: ["X", "Y"] });
    expect(mitAngebot.angebot?.ids).toEqual(["X", "Y"]);
    expect(angebotMoeglich(mitAngebot, false), "schon ein Angebot").toBe(false);
    const serie = uebenSchritt(mitAngebot, { art: "serieStarten", ids: ["Y", "X"] });
    expect(serie.angebot).toBeNull();
    expect(serie.serie).toEqual(["Y", "X"]);
    expect(angebotMoeglich(serie, false), "Serie laeuft").toBe(false);
    const weiter = uebenSchritt(serie, pool("Y", undefined, "serie"));
    expect(weiter.serie).toEqual(["X"]);
    expect(uebenSchritt(mitAngebot, pool("B")).angebot, "jede Ziehung nimmt das Angebot weg").toBeNull();
  });

  it("wechsle: alles zurueck, auch Serie und Themen", () => {
    const z = fahre(pool("A", "T"), { art: "serieStarten", ids: ["Q"] }, zufall, { art: "wechsle" });
    expect({ ...z, herkunft: "deck" }).toEqual(UEBEN_START);
  });

  it("veraendert den alten Zustand nicht (React darf den Reducer zweimal rufen)", () => {
    const z = fahre(pool("A"));
    const kopie = structuredClone(z);
    uebenSchritt(z, pool("B"));
    uebenSchritt(z, { art: "antwortGemerkt", antwort: 1 });
    expect(z).toEqual(kopie);
  });
});

describe("zieheFuerUeben", () => {
  const k = {
    stand: {} as never, alle: [FRAGE], nachId: (id: string) => (id === "F1" ? FRAGE : undefined),
    letzteThemen: [], serie: [], heute: 0,
  };
  const zug = (id: string | null, herkunft: Zug["herkunft"]): Zug => ({ id, herkunft, deckNeu: false, seen: {} });
  beforeEach(() => { zuege.length = 0; });

  it("Pool-Zug: Frage nachgeschlagen, Thema mitgegeben", () => {
    zuege.push(zug("F1", "serie"));
    const r = zieheFuerUeben(k, () => true, () => AUFGABE);
    expect(r.ergebnis).toEqual({ art: "pool", id: "F1", herkunft: "serie", thema: "Netz" });
    expect(r.serieVerbraucht).toBe(true);
    expect(r.frage).toBe(FRAGE);
  });

  it("Generator-Zug mit Aufgabe: Zufall, Zug wird verbucht, keine Frage", () => {
    zuege.push(zug(null, "generator"));
    const r = zieheFuerUeben(k, () => true, () => AUFGABE);
    expect(r.ergebnis).toEqual({ art: "zufall", aufgabe: AUFGABE });
    expect(r.zug?.herkunft).toBe("generator");
    expect(r.frage).toBeUndefined();
  });

  it("Generator-Zug OHNE passende Art: noch einmal ohne Generator ziehen, statt die Runde zu verschenken", () => {
    zuege.push(zug(null, "generator"), zug("F1", "fehlerdeck"));
    const r = zieheFuerUeben(k, () => true, () => null);
    expect(r.ergebnis).toMatchObject({ art: "pool", id: "F1", herkunft: "fehlerdeck" });
    expect(r.zug?.id).toBe("F1");
  });

  it("leer: weder Zug noch Ersatz", () => {
    zuege.push(zug(null, "generator"), zug(null, "deck"));
    expect(zieheFuerUeben(k, () => true, () => null)).toMatchObject({ ergebnis: { art: "leer" }, zug: null });
    zuege.push(zug(null, "deck"));
    expect(zieheFuerUeben(k, () => true, () => AUFGABE).ergebnis.art).toBe("leer");
  });
});
