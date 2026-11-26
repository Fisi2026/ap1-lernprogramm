/* Die Zusicherung hinter `instanz.ts`.

   ⛔ Der Befund, um den es geht: die neue Oberflaeche hat bis zum 14.09.2026 ROHE
      Pool-Fragen gezeichnet. Fuer 1102 Fragen ist das dasselbe — fuer 29 nicht.
      Dieser Test misst genau die Grenze zwischen beidem. */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { instanziiere, istVeraenderlich, zufallMitSaat, saatAus } from "./instanz";

const OFFEN = String.fromCharCode(123);
const ZU = String.fromCharCode(125);

function hatPlatzhalter(t: unknown): boolean {
  if (typeof t !== "string") return false;
  const a = t.indexOf(OFFEN);
  return a >= 0 && t.indexOf(ZU, a) > a;
}

const VERAENDERLICH = FRAGEN.filter(istVeraenderlich);
/** N37 U4: `schritte` tragen nicht alle Typen – ohne sie `undefined`, wie vorher beim losen Typ. */
const schritteVon = (f: Frage): unknown => ("schritte" in f ? f.schritte : undefined);

describe("instanziieren: aus der Pool-Frage wird die gestellte Frage", () => {
  it("findet die veraenderlichen Fragen — und es sind ausschliesslich rechenassistent", () => {
    expect(VERAENDERLICH.length).toBeGreaterThan(0);
    expect([...new Set(VERAENDERLICH.map((f) => f.typ))]).toEqual(["rechenassistent"]);
  });

  it("loest jeden Platzhalter im Fragetext auf", () => {
    const rest = VERAENDERLICH.filter((f) => hatPlatzhalter(instanziiere(f).frage)).map((f) => f.id);
    expect(rest).toEqual([]);
  });

  it("gibt jedem Schritt mit Formel einen Wert und eine Loesung", () => {
    const fehlt: string[] = [];
    for (const f of VERAENDERLICH) {
      const i = instanziiere(f);
      const schritte = (schritteVon(i) as Array<{ formel?: string; wert?: number; loesung?: string[] }>) ?? [];
      schritte.forEach((s, k) => {
        if (!s.formel) return;
        if (typeof s.wert !== "number") fehlt.push(`${f.id} Schritt ${k + 1}: kein Wert`);
        else if (!Array.isArray(s.loesung) || s.loesung.length === 0)
          fehlt.push(`${f.id} Schritt ${k + 1}: keine Loesung`);
      });
    }
    expect(fehlt).toEqual([]);
  });

  it("liefert bei gleicher Saat dieselbe Aufgabe — sonst wuerfelt sie unter der Eingabe neu", () => {
    for (const f of VERAENDERLICH.slice(0, 8)) {
      const a = instanziiere(f, 3);
      const b = instanziiere(f, 3);
      expect(JSON.stringify(schritteVon(a)), f.id).toBe(JSON.stringify(schritteVon(b)));
    }
  });

  it("liefert bei anderer Saat auch andere Aufgaben — sonst waere die Randomisierung Zierde", () => {
    const anders = VERAENDERLICH.filter((f) => {
      const a = JSON.stringify(schritteVon(instanziiere(f, 1)));
      return [2, 3, 4, 5, 6].some((v) => JSON.stringify(schritteVon(instanziiere(f, v))) !== a);
    });
    expect(anders.length / VERAENDERLICH.length).toBeGreaterThan(0.8);
  });

  /* ⚠️ Zwei Fragen tragen geschweifte Klammern, die KEINE Platzhalter sind:
     M04-209 (`{abstract}`) und M04-210 (`{static, final}`) — UML-Schreibweise.
     Sie haben keine `variablen` und duerfen deshalb gar nicht erst angefasst werden. */
  it("laesst UML-Klammern in Ruhe, weil diese Fragen nicht veraenderlich sind", () => {
    for (const id of ["M04-209", "M04-210"]) {
      const f = FRAGEN.find((x) => x.id === id);
      expect(f, `${id} fehlt im Bestand`).toBeDefined();
      expect(istVeraenderlich(f!)).toBe(false);
      expect(instanziiere(f!)).toBe(f!);
      expect(hatPlatzhalter(f!.frage), `${id} sollte geschweifte Klammern tragen`).toBe(true);
    }
  });

  it("eine unveraenderliche Frage wird unveraendert durchgereicht, nicht kopiert", () => {
    const fest = FRAGEN.find((f) => !istVeraenderlich(f))!;
    expect(instanziiere(fest)).toBe(fest);
  });
});

describe("der Zufall mit Saat", () => {
  it("gibt Werte zwischen 0 und 1", () => {
    const r = zufallMitSaat(saatAus("M01-500"));
    for (let i = 0; i < 200; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("zwei Saaten aus verschiedenen Fragen laufen auseinander", () => {
    const a = zufallMitSaat(saatAus("M01-500"));
    const b = zufallMitSaat(saatAus("M01-501"));
    expect(a()).not.toBe(b());
  });
});

/* N44 C5: Randfaelle, die der Bestand nicht beruehrt (Mutationstest). */
describe("istVeraenderlich an den Raendern", () => {
  const ist = (f: object) => istVeraenderlich(f as never);
  it("variablen zaehlen nur als Objekt – nicht als Liste, Text, null oder fehlend", () => {
    expect(ist({ variablen: { a: 1 } })).toBe(true);
    expect(ist({ variablen: [] })).toBe(false);
    expect(ist({ variablen: [1] })).toBe(false);
    expect(ist({ variablen: "a" })).toBe(false);
    expect(ist({ variablen: null })).toBe(false);
    expect(ist({})).toBe(false);
  });
  it("varianten zaehlen nur als nicht-leere Liste", () => {
    expect(ist({ varianten: [{}] })).toBe(true);
    expect(ist({ varianten: [] })).toBe(false);
    expect(ist({ varianten: undefined })).toBe(false);
    expect(ist({ varianten: "x" })).toBe(false);
  });
});

describe("saatAus ist FNV-1a ueber Text, '#' und Versuch", () => {
  /* Unabhaengige Referenz: FNV-1a 32 Bit nach der Spezifikation, mit BigInt gerechnet. */
  function fnv1a(s: string): number {
    let h = 2166136261n;
    for (const b of new TextEncoder().encode(s)) h = ((h ^ BigInt(b)) * 16777619n) & 0xffffffffn;
    return Number(h);
  }
  it("stimmt fuer ASCII-Ids mit der Referenz ueberein", () => {
    for (const [t, v] of [["M01-500", 0], ["M04-209", 3], ["", 0], ["a", 12]] as const)
      expect(saatAus(t, v), `${t}#${v}`).toBe(fnv1a(`${t}#${v}`));
  });
  it("Id und Versuch laufen nicht ineinander (a1/0 ≠ a/10)", () => {
    expect(saatAus("a1", 0)).not.toBe(saatAus("a", 10));
  });
});
