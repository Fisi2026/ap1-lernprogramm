/* N43 M3 Rest (17.10.2026): gebaute Grenzfaelle fuer `meldeversand.ts` – Form der Schlange, Kennung nur in voller
   Laenge, „wartet“ nur fuer genau diese Meldung, Abbau der Schlange nach dem Senden. */
import { describe, expect, it, vi } from "vitest";

import { geraetKennung, schlange, sendeAusstehende, versandstand, vormerken, S_GERAET, S_SCHLANGE, type Ablage } from "./meldeversand";

function ablage(start: Record<string, unknown> = {}): Ablage & { daten: Map<string, string> } {
  const daten = new Map(Object.entries(start).map(([k, v]) => [k, JSON.stringify(v)]));
  return { daten, getItem: (k) => daten.get(k) ?? null, setItem: (k, v) => { daten.set(k, v); } };
}
const m = (frageId: string, datum: number) => ({ frageId, grund: "g", text: "t", datum });
const antwort = (...status: number[]) => {
  let i = 0;
  return vi.fn(async () => new Response("{}", { status: status[i++] ?? 500 }));
};

describe("schlange – nur Eintraege in voller Form", () => {
  it("jeder fehlende oder falsche Teil verwirft den Eintrag", () => {
    const gut = m("A", 1);
    const roh = [gut, { ...gut, frageId: 1 }, { ...gut, grund: null }, { ...gut, text: 2 }, { ...gut, datum: "1" }, null, "x"];
    expect(schlange(ablage({ [S_SCHLANGE]: roh }))).toEqual([gut]);
  });
});

describe("geraetKennung", () => {
  it("eine gespeicherte Kennung gilt nur, wenn sie GANZ aus erlaubten Zeichen besteht", () => {
    const a16 = "a".repeat(16);
    expect(geraetKennung(ablage({ [S_GERAET]: a16 }), () => "neu")).toBe(a16);
    expect(geraetKennung(ablage({ [S_GERAET]: "!" + a16 }), () => "neu-1")).toBe("neu-1");
    expect(geraetKennung(ablage({ [S_GERAET]: a16 + "!" }), () => "neu-2")).toBe("neu-2");
  });
});

describe("versandstand", () => {
  it("„wartet“ nur, wenn Frage UND Datum passen", () => {
    const a = ablage();
    vormerken(a, m("A", 1));
    expect(versandstand(a, "A", 1)).toBe("wartet");
    expect(versandstand(a, "A", 2)).toBeNull();
    expect(versandstand(a, "B", 1)).toBeNull();
  });
  it("ein Ergebnis zaehlt nur mit passendem Datum und bekanntem Stand", () => {
    const S_ERGEBNIS = "ap1v2_meldeergebnis";   // nicht exportiert; so schreibt sendeAusstehende
    const a = ablage({ [S_ERGEBNIS]: { A: { datum: 1, stand: "gesendet" }, B: { datum: 1, stand: "komisch" }, C: 5 } });
    expect(versandstand(a, "A", 1)).toBe("gesendet");
    expect(versandstand(a, "A", 2)).toBeNull();
    expect(versandstand(a, "B", 1)).toBeNull();
    expect(versandstand(a, "C", 1)).toBeNull();
  });
  it("ohne Eintrag und ohne Ergebnis: null", () => {
    expect(versandstand(ablage(), "A", 1)).toBeNull();
  });
});

describe("sendeAusstehende – Abbau der Schlange", () => {
  it("nach dem Senden faellt genau die gesendete Meldung (Frage UND Datum) aus der Schlange", async () => {
    const a = ablage({ [S_SCHLANGE]: [m("A", 1), m("A", 2), m("B", 1)] });
    expect(await sendeAusstehende(a, antwort(201, 500), "1")).toBe(1);
    expect(schlange(a)).toEqual([m("A", 2), m("B", 1)]);
  });
  it("bei 429 bricht der Versand ab, statt die naechste zu schicken", async () => {
    const a = ablage({ [S_SCHLANGE]: [m("A", 1), m("B", 1)] });
    const sende = antwort(429, 201);
    expect(await sendeAusstehende(a, sende, "1")).toBe(0);
    expect(sende).toHaveBeenCalledTimes(1);
    expect(schlange(a)).toHaveLength(2);
  });
});
