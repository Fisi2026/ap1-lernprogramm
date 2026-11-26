/* ============================================================================
   SCHIRME, DIE ERST BEIM BETRETEN GELADEN WERDEN (N38 P3, E63)

   ►► Gemessen 28.09.2026: beim Start waren 121 von 209 KB JS ungenutzt; das
      Auswerten des Einstiegs kostete 35–46 ms (4× CPU-Drossel). Diese acht
      Schirme braucht die Startseite nicht – sie kommen als eigene Chunks.
   ⚠️ Offline bleibt alles da: der Service Worker legt JEDE Bau-Datei in den
      Vorab-Cache (`sw/plugin.ts`), die Chunks eingeschlossen.
   ⚠️ Bis ein Chunk da ist, zeigt der Bereich „Wird geladen …" (`<Suspense>` in
      `App.tsx`). Scheitert das Laden, faengt es die Bereichsgrenze.
   ⛔ `ladeFauleSchirme()` laedt alle vorab – der Pruefstand ruft es, damit die
      Tests weiter synchron zeichnen (wie `ladePool()`). Ist ein Schirm geladen,
      zeichnet `faul()` ihn DIREKT, ohne Suspense-Runde.
   ============================================================================ */
import { createElement, lazy, type ComponentType, type ReactElement } from "react";

const laeufe: (() => Promise<unknown>)[] = [];

function faul<P extends object>(laden: () => Promise<ComponentType<P>>): (props: P) => ReactElement {
  let fertig: ComponentType<P> | null = null;
  const hole = (): Promise<ComponentType<P>> => laden().then((k) => (fertig = k));
  laeufe.push(hole);
  const Faul = lazy(() => hole().then((k) => ({ default: k })));
  return function Geladen(props: P): ReactElement {
    const K = fertig ?? Faul;
    return createElement(K, props);
  };
}

export const Simulation = faul(() => import("@/schirme/Simulation").then((m) => m.Simulation));
export const Gantt = faul(() => import("@/schirme/Gantt").then((m) => m.Gantt));
export const Netzplan = faul(() => import("@/schirme/Netzplan").then((m) => m.Netzplan));
export const RechenGenerator = faul(() => import("@/schirme/RechenGenerator").then((m) => m.RechenGenerator));
export const Einstellungen = faul(() => import("@/schirme/Einstellungen").then((m) => m.Einstellungen));
export const Meldungsliste = faul(() => import("@/schirme/Meldungsliste").then((m) => m.Meldungsliste));
export const Spickzettel = faul(() => import("@/schirme/Spickzettel").then((m) => m.Spickzettel));
export const Glossar = faul(() => import("@/schirme/Glossar").then((m) => m.Glossar));

/** Laedt alle faulen Schirme (Pruefstand). */
export function ladeFauleSchirme(): Promise<unknown[]> {
  return Promise.all(laeufe.map((l) => l()));
}
