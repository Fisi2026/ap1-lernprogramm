/* N38 P1 (E63): der Ladezustand des Pools fuer die Oberflaeche.
   ⛔ Nur ueber diesen Haken lesen – wer `poolGeladen()` im Zeichnen liest, zeichnet nicht neu,
      wenn der Pool ankommt. */
import { useSyncExternalStore } from "react";
import { abonnierePool, poolStatus, type PoolStatus } from "@/daten/laden";

export function usePoolStatus(): PoolStatus {
  return useSyncExternalStore(abonnierePool, poolStatus, poolStatus);
}
