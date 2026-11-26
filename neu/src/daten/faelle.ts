/* ============================================================================
   Die Fallaufgaben — direkt aus `pool/pool_faelle.json`.

   ⛔ NICHT aus `faelle.js`: das ist ein Bauergebnis, und wer das Bauergebnis
      liest, merkt nicht, wenn der Bau schiefgeht. Dieselbe Begruendung wie in
      `daten/laden.ts`; den Drift zwischen beiden bewacht check.sh ohnehin.
   ============================================================================ */
/* N32/E31: die Daten kommen mit dem Pool-Chunk (`pooldaten.ts`); `ladePool()` in
   laden.ts reicht sie hierher. Vor dem Laden ist `FAELLE` leer – nur beim Aufruf lesen. */

import { istObjekt, istText, istZahl, listeAus, optional } from "../kern/pruefe.ts";

interface Teilaufgabe {
  typ: string;
  frage: string;
  schwierigkeit?: number;
  [weiteres: string]: unknown;
}

export interface Fall {
  id: string;
  modul: string;
  thema: string;
  pruefungsteil?: string;
  titel: string;
  szenario: string;
  teilaufgaben: Teilaufgabe[];
}

export let FAELLE: Fall[] = [];

/* N38 Q1 (30.09.2026): jeder Fall wird so geprueft, wie der Typ ihn behauptet – vorher nur `id`
   und „teilaufgaben ist eine Liste“. Gemessen: alle 9 Faelle in `pool/pool_faelle.json` bestehen,
   das Ergebnis ist gleich; ein kaputter Fall faellt jetzt heraus, statt spaeter zu scheitern. */

function istTeilaufgabe(x: unknown): x is Teilaufgabe {
  return istObjekt(x) && istText(x.typ) && istText(x.frage) && optional(istZahl)(x.schwierigkeit);
}

function istFall(x: unknown): x is Fall {
  return istObjekt(x) && istText(x.id) && istText(x.modul) && istText(x.thema) && istText(x.titel)
    && istText(x.szenario) && optional(istText)(x.pruefungsteil) && listeAus(istTeilaufgabe)(x.teilaufgaben);
}

export function setzeFaelle(roh: unknown): void {
  FAELLE = Array.isArray(roh) ? roh.filter(istFall) : [];
}
