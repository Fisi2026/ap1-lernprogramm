/* ============================================================================
   Die Gegenprobe ueber den GESAMTEN Bestand.

   Fuer jede der 1131 Fragen wird aus der Frage selbst die richtige Antwort
   gebaut und `L.grade` vorgelegt. Werte alle als richtig — dann stimmt meine
   Vorstellung von der Antwortform mit der Auswertung ueberein, und zwar fuer
   jede echte Frage, nicht fuer ein Beispiel.

   Danach dasselbe mit einer absichtlich verbogenen Antwort. Ohne diesen zweiten
   Durchgang waere die Probe wertlos: ein `grade`, das immer `true` liefert,
   bestuende den ersten muehelos.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { richtigeAntwort, falscheAntwort, NICHT_ABLEITBAR } from "./antwortform";
import { instanziiere } from "./instanz";
/* N34 T2: geprueft wird die Bewertung, die die App benutzt (kern/bewertung.ts); dass sie
   L.grade gleicht, beweist bewertung.gleichheit.test.ts. */
import { grade } from "./bewertung";
import type { Frage } from "@/daten/typen";


/* ⛔ GEPRUEFT WIRD DIE GESTELLTE FRAGE, NICHT DIE ROHE POOL-FRAGE.
   27 Fragen tragen `variablen` und 2 `varianten`; ihre Schritte tragen Formeln
   statt Werte. Fuer alle anderen 1102 ist `instanziiere` ein Durchreicher — es
   gibt dieselbe Frage unveraendert zurueck. Genau so sieht die Karte sie auch. */
const nachTyp = new Map<string, Frage[]>();
for (const roh of FRAGEN) {
  const f = instanziiere(roh);
  const liste = nachTyp.get(f.typ) ?? [];
  liste.push(f);
  nachTyp.set(f.typ, liste);
}
const typen = [...nachTyp.keys()].sort();

describe("Antwortform gegen den gesamten Bestand", () => {
  it("deckt jeden Typ ab — entweder mit Bauer oder mit begruendeter Ausnahme", () => {
    const ungeklaert = typen.filter(
      (t) => !richtigeAntwort(nachTyp.get(t)![0]) && !NICHT_ABLEITBAR[t],
    );
    expect(
      ungeklaert,
      `Typen ohne Bauer und ohne Begruendung: ${ungeklaert.join(", ")}`,
    ).toEqual([]);
  });

  describe.each(typen)("Typ %s", (typ) => {
    const fragen = nachTyp.get(typ)!;
    const ausnahme = NICHT_ABLEITBAR[typ];

    it(`hat Fragen im Bestand (${fragen.length})`, () => {
      expect(fragen.length).toBeGreaterThan(0);
    });

    if (ausnahme) {
      it(`ist bewusst ausgenommen: ${ausnahme}`, () => {
        expect(richtigeAntwort(fragen[0])).toBeNull();
      });
      return;
    }

    it("wertet JEDE richtige Antwort als richtig", () => {
      const durchgefallen: string[] = [];
      for (const f of fragen) {
        const a = richtigeAntwort(f);
        if (!a) { durchgefallen.push(`${f.id}: keine Antwort gebaut`); continue; }
        const urteil = grade(f, a.wert);
        if (!urteil) durchgefallen.push(`${f.id}: grade sagt ${JSON.stringify(urteil)}`);
      }
      expect(
        durchgefallen.slice(0, 8),
        `${durchgefallen.length} von ${fragen.length} Fragen des Typs ${typ} durchgefallen`,
      ).toEqual([]);
    });

    it("wertet eine verbogene Antwort NICHT als richtig", () => {
      const faelschlichRichtig: string[] = [];
      let geprueft = 0;
      for (const f of fragen) {
        const a = falscheAntwort(f);
        if (!a) continue;
        geprueft++;
        if (grade(f, a.wert)) faelschlichRichtig.push(f.id);
      }
      /* ⚠️ Nicht jede Verbiegung MUSS falsch sein — bei zuordnung koennen zwei
         Eintraege inhaltlich dieselbe Kategorie tragen, dann ist ein Tausch
         weiterhin korrekt. Deshalb eine Quote statt Null-Toleranz, aber eine
         hohe: faellt sie, hat grade aufgehoert zu pruefen. */
      const quote = geprueft ? 1 - faelschlichRichtig.length / geprueft : 1;
      expect(geprueft, "keine einzige Verbiegung gebaut — die Probe liefe leer").toBeGreaterThan(0);
      expect(
        quote,
        `${faelschlichRichtig.length} von ${geprueft} verbogenen Antworten galten weiter als richtig ` +
          `(z.B. ${faelschlichRichtig.slice(0, 5).join(", ")})`,
      ).toBeGreaterThan(0.6);
    });
  });
});
