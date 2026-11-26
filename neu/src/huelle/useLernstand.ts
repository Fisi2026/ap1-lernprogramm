/* Der Lernstand als React-Zustand.

   ⛔ EINE Quelle im Programm. Wer den Stand aendern will, ruft `buche` oder
      `aendere` - niemand schreibt direkt in localStorage.

   ⛔⛔ SEIT N31 LIEST REACT NUR NOCH (`useSyncExternalStore`). Gerechnet, geschrieben
      und zwischen Tabs abgestimmt wird in `lernstandort.ts` - vorher schrieb
      `aendere` INNERHALB des State-Updaters (Lehre N6c verletzt; StrictMode ruft
      einen Updater zweimal).

   ⚠️ Gespeichert wird bei JEDER Aenderung, sofort: ein Lerner schliesst den Tab,
      wenn er fertig ist, nicht wenn ein Programm bereit waere.
   ⚠️ Ein Speicherfehler wird GEMELDET, nicht verschluckt (Banner in Ueben). */
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { erzeugeQuelle } from "@/kern/lernstandort";
import type { Dauerhaft, Lauf, QuelleMitDauer, Rolle } from "@/kern/lernstandort";
import type { Lernstand, Ladebefund } from "@/kern/stand";
import { verbuche, merkeGezeigt } from "@/kern/verbuchen";
import type { VerbuchOptionen, VerbuchbareFrage } from "@/kern/verbuchen";

export interface StandHaken {
  stand: Lernstand;
  /** Wie der Stand beim Start gelesen wurde. */
  befund: Ladebefund;
  /** true, sobald ein Schreibversuch fehlgeschlagen ist (oder nicht geschrieben werden darf, E26). */
  speicherFehler: boolean;
  /** Bucht eine beantwortete Frage. */
  /** Nimmt jede verbuchbare Aufgabe – auch Zufallsaufgaben, ohne Cast (Pruefbericht 26.09.). */
  buche: (frage: VerbuchbareFrage, korrekt: boolean, opt?: VerbuchOptionen) => void;
  /** Merkt sich, dass eine Frage gezeigt wurde. */
  zeige: (id: string) => void;
  /** Freier Zugriff fuer alles andere (Einstellungen, Notizen, Lesezeichen). */
  aendere: (fn: (s: Lernstand) => Lernstand) => void;
  /* --- N31 --- */
  rolle: Rolle;
  reparaturen: string[];
  gesichert: boolean;
  konflikte: number;
  dauerhaft: Dauerhaft;
  /** N33: eigener laufender Durchgang (Simulation/Tagesserie) oder null */
  lauf: Lauf | null;
  quelle: QuelleMitDauer;
}

export function useLernstand(vorgabe?: QuelleMitDauer): StandHaken {
  /* Die Quelle liest einmal beim Erzeugen; `starte` im Effekt holt Sperre, Kanal und
     Lauscher und gibt sein Beenden zurueck - StrictMode darf das zweimal tun. */
  const [q] = useState(() => vorgabe ?? erzeugeQuelle());
  useEffect(() => q.starte(), [q]);
  const z = useSyncExternalStore(q.abonniere, q.zustand, q.zustand);

  const aendere = useCallback((fn: (s: Lernstand) => Lernstand) => q.aendere(fn), [q]);
  const buche = useCallback(
    (frage: VerbuchbareFrage, korrekt: boolean, opt?: VerbuchOptionen) => {
      q.aendere((s) => verbuche(s, frage, korrekt, opt));
      q.bitteDauerhaft();
    },
    [q],
  );
  const zeige = useCallback((id: string) => q.aendere((s) => merkeGezeigt(s, id)), [q]);

  return {
    stand: z.stand, befund: z.befund, speicherFehler: z.speicherFehler,
    buche, zeige, aendere,
    rolle: z.rolle, reparaturen: z.reparaturen, gesichert: z.gesichert,
    konflikte: z.konflikte, dauerhaft: z.dauerhaft, lauf: z.lauf, quelle: q,
  };
}
