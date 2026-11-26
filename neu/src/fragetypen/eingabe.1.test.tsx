// @vitest-environment jsdom
/* Eingaben liefern die Form, die L.grade erwartet – Teil 1 von 4 (Gruppe 1 in testhilfe/eingabe.treiber.tsx).
   Schliesst den Kreis von der Bedienung bis zur Bewertung; Begruendung, Stichprobe und Treiber: dort.
   Geteilt am 18.10.2026 (N42), weil vitest nur Dateien parallelisiert. */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { eingabeFuer } from "./register";
import { GEBAUT, GRUPPEN, eingabeSuite } from "../testhilfe/eingabe.treiber";

eingabeSuite(GRUPPEN[0]);

describe("Eingaben liefern die Form, die L.grade erwartet", () => {
  /* ⚠️ Stand frueher auf "matrix" — und fiel, sobald matrix gebaut war. Ein Test,
     der einen einzelnen offenen Typ beim Namen nennt, ist eine Zeitbombe mit
     Datum. Gefragt ist die EIGENSCHAFT: ein Typ ohne Eingabe liefert auch keine,
     die Karte zeigt dort ihren Platzhalter. Sind irgendwann alle gebaut, sagt der
     Test genau das — statt still durchzulaufen oder zu faelschen. */
  it("liefert fuer einen noch nicht gebauten Typ keine Eingabe", () => {
    /* N42: die vier Dateien zusammen decken jeden gebauten Typ genau einmal ab – nichts faellt beim Teilen heraus. */
    const verteilt = GRUPPEN.flat();
    expect([...verteilt].sort(), "GRUPPEN (testhilfe/eingabe.treiber.tsx) und TREIBER weichen ab").toEqual([...GEBAUT].sort());
    expect(new Set(verteilt).size, "ein Typ steht in mehreren Gruppen").toBe(verteilt.length);
    const offen = [...new Set(FRAGEN.map((f) => f.typ))].filter(
      (t) => !FRAGEN.some((f) => f.typ === t && eingabeFuer(f)),
    );
    if (offen.length === 0) {
      expect(FRAGEN.every((f) => eingabeFuer(f)), "alle Typen gebaut").toBe(true);
      return;
    }
    for (const typ of offen) {
      const f = FRAGEN.find((x) => x.typ === typ)!;
      expect(eingabeFuer(f), `Typ ${typ} gilt als offen, liefert aber eine Eingabe`).toBeUndefined();
    }
  });
});
