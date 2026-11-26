/* N37 U1 (E60, 27.09.2026): aus `fragetypen/register.ts` hierher – `kern/schalter.ts` und
   `kern/typhilfe.ts` brauchen die Regel, und `kern/` darf die Oberflaechen-Schicht nicht importieren
   (heute `tools/architektur_regeln.cjs`, frueher `kern/architektur.test.ts`). Wortgleich uebernommen. */
import type { Fragetyp, SimKarte } from "@/daten/typen";

/** Der Typ, nach dem sich die Oberflaeche richtet. Bei `bild` ist das der
    unterTyp — dieselbe Aufloesung, die grade und `eingabeFuer` vornehmen.
    ⚠️ Ohne das greifen die beiden Mengen oben bei der einen bild-Frage mit
       unterTyp `lueckentext` nicht, und ihr Fragetext stuende zweimal da. */
export function wirkTyp(f: SimKarte): Fragetyp {
  if (f.typ !== "bild") return f.typ;
  const unter = (typeof f.unterTyp === "string" ? f.unterTyp : "mc") as Fragetyp;
  return unter === "bild" ? "mc" : unter;
}
