/* N32 (oxlint only-export-components): Typ und Anfang eines Serienlaufs aus Tagesserie.tsx
   herausgezogen, damit die Komponentendatei nur Komponenten exportiert. Inhalt unveraendert. */
import { FRAGEN } from "@/daten/laden";
import type { Lernstand } from "@/kern/stand";
import { baueTagesserie } from "@/kern/tagesserie";

export interface SerienLauf {
  gebiet: string;
  ids: string[];
  pos: number;
  richtig: number;
  /** Die Karte an `pos` ist beantwortet (gebucht). */
  beantwortet: boolean;
  fertig: boolean;
}

export function neuerLauf(stand: Lernstand, rng?: () => number): SerienLauf {
  const t = baueTagesserie(stand, FRAGEN, rng);
  return { gebiet: t.gebiet, ids: t.ids, pos: 0, richtig: 0, beantwortet: false, fertig: false };
}
