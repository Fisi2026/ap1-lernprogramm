/* N47 A/B (10.10.2026): Regeln der Anzeige-Reihenfolge und des Optionsurteils. */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import {
  bleibtGeordnet, festeReihenfolge, inReihenfolge, mischReihenfolge, neuerMischer, nichtGeordnet, urteilFuer, zahlenReihenfolge, zahlenwert,
} from "./anzeige";

/** Kleiner geseedeter Zufall (mulberry32) – reproduzierbar. */
function geseedet(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("mischReihenfolge", () => {
  it("liefert eine Permutation von 0..n-1", () => {
    const r = mischReihenfolge(7, geseedet(1));
    expect([...r].sort((x, y) => x - y)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(mischReihenfolge(0)).toEqual([]);
  });

  it("verteilt die richtige Option gleichmaessig ueber die Stellen (10 000 Ziehungen, 4 Optionen)", () => {
    const rng = geseedet(7);
    const stellen = [0, 0, 0, 0];
    for (let k = 0; k < 10_000; k++) {
      const r = mischReihenfolge(4, rng);
      const s = r.indexOf(0);
      stellen[s] = (stellen[s] ?? 0) + 1;
    }
    for (const n of stellen) expect(n).toBeGreaterThan(2300);   // Erwartung 2500
  });
});

describe("neuerMischer", () => {
  it("haelt je Schluessel EINE Reihenfolge und zieht je Schluessel neu", () => {
    const m = neuerMischer(geseedet(3));
    const a = m.reihenfolge("M04-001:optionen", 4);
    expect(m.reihenfolge("M04-001:optionen", 4)).toBe(a);
    expect(m.reihenfolge("M04-002:optionen", 4)).not.toBe(a);
  });
});

describe("inReihenfolge", () => {
  it("traegt den Ursprungs-Index mit", () => {
    expect(inReihenfolge(["a", "b", "c"], [2, 0, 1])).toEqual([
      { wert: "c", index: 2 }, { wert: "a", index: 0 }, { wert: "b", index: 1 },
    ]);
    expect(festeReihenfolge(3)).toEqual([0, 1, 2]);
  });
});

describe("bleibtGeordnet", () => {
  it("haelt reine Zahlen-Listen fest, mischt Text", () => {
    expect(bleibtGeordnet(["18", "19", "20", "22"])).toBe(true);
    expect(bleibtGeordnet(["1.024", "1.000", "512"])).toBe(true);
    expect(bleibtGeordnet(["3,5 %", "12 €", "100 Mbit/s"])).toBe(true);
    expect(bleibtGeordnet(["RAID 1", "RAID 5"])).toBe(false);
    expect(bleibtGeordnet(["20 Tage Puffer", "kein Puffer"])).toBe(false);
    expect(bleibtGeordnet([])).toBe(false);
  });

  it("trifft im Bestand genau die Dropdowns mit reinen Zahlen (gemessen 10.10.: 25 Fragen)", () => {
    const dd = FRAGEN.filter((f) => f.typ === "dropdown" || (f.typ === "bild" && f.unterTyp === "dropdown"));
    const fest = dd.filter((f) => "luecken" in f && Array.isArray(f.luecken)
      && f.luecken.every((l) => bleibtGeordnet(l.optionen)));
    expect(fest.length).toBeGreaterThanOrEqual(20);
    expect(fest.length).toBeLessThanOrEqual(30);
  });
});

describe("zahlenReihenfolge", () => {
  it("ordnet aufsteigend nach Wert in deutscher Schreibweise", () => {
    expect(zahlenReihenfolge(["60", "6", "200", "600"])).toEqual([1, 0, 2, 3]);
    expect(zahlenReihenfolge(["192,50", "577,50", "525,00", "1.732,50"])).toEqual([0, 2, 1, 3]);
    expect(zahlenwert("1.732,50")).toBe(1732.5);
    expect(zahlenwert("3,5 %")).toBe(3.5);
    expect(zahlenwert("100 Mbit/s")).toBe(100);
  });

  it("macht jede Zahlen-Liste im Bestand lesbar (kein NaN)", () => {
    for (const f of FRAGEN) {
      if (f.typ !== "dropdown" && !(f.typ === "bild" && f.unterTyp === "dropdown")) continue;
      for (const l of "luecken" in f && Array.isArray(f.luecken) ? f.luecken : []) {
        if (typeof l === "string" || !bleibtGeordnet(l.optionen)) continue;
        for (const o of l.optionen) expect(Number.isFinite(zahlenwert(o)), f.id + " " + o).toBe(true);
      }
    }
  });
});

describe("urteilFuer", () => {
  it("markiert nach dem Pruefen die richtige Option immer, die eigene falsche rot", () => {
    expect(urteilFuer(false, true, true)).toBeUndefined();
    expect(urteilFuer(true, true, false)).toBe("richtig");
    expect(urteilFuer(true, true, true)).toBe("richtig");
    expect(urteilFuer(true, false, true)).toBe("falsch");
    expect(urteilFuer(true, false, false)).toBeUndefined();
  });
});

describe("nichtGeordnet", () => {
  it("tauscht nur, wenn das Mischen die geordnete Lage traf", () => {
    expect(nichtGeordnet([0, 1, 2])).toEqual([1, 0, 2]);
    expect(nichtGeordnet([2, 0, 1])).toEqual([2, 0, 1]);
    expect(nichtGeordnet([0])).toEqual([0]);
  });
});
