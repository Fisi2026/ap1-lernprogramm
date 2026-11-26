/* N32 (oxlint only-export-components): aus Rueckseite.tsx herausgezogen, damit die
   Komponentendatei nur Komponenten exportiert. Inhalt unveraendert. */
import type { Frage } from "@/daten/typen";

export function textOder(wert: unknown): string {
  return typeof wert === "string" ? wert.trim() : "";
}

/** Die Distraktor-Erklaerungen einer mc-Frage, ohne die richtige Option.
    ⛔ Wie die alte App: nur Typ `mc`, Reihenfolge des Pools (die Anzeige
       mischt, die Erklaerung nennt die Option beim Wortlaut). */
export function distraktoren(frage: Frage): { option: string; warum: string }[] {
  if (frage.typ !== "mc") return [];
  const erkl = frage.distraktorErklaerungen;
  const opt = frage.optionen;
  if (!Array.isArray(erkl) || !Array.isArray(opt)) return [];
  const aus: { option: string; warum: string }[] = [];
  erkl.forEach((t, i) => {
    if (i === frage.loesungIndex || !textOder(t)) return;
    aus.push({ option: (opt[i] ?? ""), warum: t });
  });
  return aus;
}
