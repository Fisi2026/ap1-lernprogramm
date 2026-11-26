/* ============================================================================
   DER START: DIE APP SOFORT, DER POOL IM HINTERGRUND (N38 P1, E63 – loest E31 ab)

   ►► Gemessen 28.09.2026 (Lighthouse mobil, live): mit „erst der Pool, dann die
      App" (E31) erschien die Startseite erst nach 647 KB Pool – LCP 5,5 s.
      Jetzt zeichnet die App sofort; nur Schirme, die Fragen brauchen, zeigen
      „Fragen werden geladen …" (`App.tsx`, `OHNE_POOL`), bis der Pool da ist.
   ⚠️ Scheitert das Laden (kein Netz, alter Stand nach einem Update), sagen es
      genau diese Schirme und bieten „Nochmal versuchen" – keine weiße Seite,
      und alles Poolfreie (Startseite, Rechnen, Netzplan, Gantt …) geht weiter.
   ============================================================================ */
import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import App from "@/App";
import { ladePool, startePool } from "@/daten/laden";

export async function starte(wurzel: Root, laden: () => Promise<void> = ladePool): Promise<void> {
  wurzel.render(<StrictMode><App /></StrictMode>);
  await startePool(laden).catch(() => undefined);
}
