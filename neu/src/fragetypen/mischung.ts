/* N47 A (10.10.2026): woher eine Fragetyp-Komponente ihren Mischer bekommt.

   ⛔ Die Regel steht in `kern/anzeige.ts`; hier nur, WER den Mischer haelt:
      * ohne Rahmen haelt ihn die Komponente selbst – einer je Einhaengen. Die Karteikarte
        haengt die Eingabe je gestellter Frage neu ein, also mischt jede Anzeige neu, und das
        Pruefen (gleiche Komponente, `gesperrt` wechselt) mischt NICHT neu.
      * die Pruefungssimulation legt EINEN Mischer (`MischKontext.Provider`) um den ganzen Lauf: sie haengt die
        Eingabe je Blaettern neu ein (`key: lauf.idx`), die Reihenfolge muss aber bleiben.
   ⚠️ Der Schluessel enthaelt die Fragen-Kennung: wird eine Komponente fuer eine ANDERE Frage
      weiterbenutzt, zieht sie fuer diese eine eigene Reihenfolge. */
import { createContext, useContext, useState } from "react";
import { neuerMischer, type Mischer } from "@/kern/anzeige";

export const MischKontext = createContext<Mischer | null>(null);

/** Der Mischer dieser Anzeige: der des Rahmens, sonst ein eigener je Einhaengen. */
export function useMischer(): Mischer {
  const rahmen = useContext(MischKontext);
  const [eigen] = useState(() => neuerMischer());
  return rahmen ?? eigen;
}
