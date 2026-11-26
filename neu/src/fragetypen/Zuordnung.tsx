/* zuordnung — links eine Aussage, rechts eine Kategorie.
   gradeZuordnung erwartet {linksIndex: rechtsIndex} und vergleicht TEXTBASIERT:
   mehrere Aussagen duerfen auf dieselbe Kategorie zeigen. Deshalb steht rechts
   die Liste der Kategorien, nicht die der Aussagen — und Mehrfachnennung ist
   ausdruecklich erlaubt.
   N25 P3: die Auswahl ist shadcns NativeSelect (Grund wie in Dropdown.tsx). */
import { useMemo } from "react";
import { cn } from "cn";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { EingabeProps } from "./vertrag";
import { istText, istZahl, listeVon, tabelleVon } from "@/kern/pruefe";
import { inReihenfolge } from "@/kern/anzeige";
import { useMischer } from "./mischung";
import { RichtigWaere } from "./RichtigWaere";

const istPaar = (x: unknown): x is [string, string] =>
  Array.isArray(x) && x.length === 2 && istText(x[0]) && istText(x[1]);

export function Zuordnung({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"zuordnung">) {
  /* N32: useMemo, weil das Feld sonst bei jedem Zeichnen neu entsteht und das useMemo darunter
     wirkungslos machte (oxlint exhaustive-deps). */
  const paare = useMemo(
    () => listeVon(frage.paare, istPaar) ?? [],   // N38 Q1: gemessen – alle 104 Zuordnungen im Bestand bestehen
    [frage.paare],
  );
  const stand: Record<number, number> = tabelleVon(antwort, istZahl);   // N38 Q1: vorher behauptet

  /* Die Kategorien sind die rechten Haelften — ohne Wiederholung, aber mit dem
     ERSTEN Index, an dem sie stehen. Genau den erwartet gradeZuordnung. */
  const kategorien = useMemo(() => {
    const gesehen = new Map<string, number>();
    paare.forEach(([, rechts], i) => {
      if (!gesehen.has(rechts)) gesehen.set(rechts, i);
    });
    /* K3-E64 (Meldung 18): Zusatz-Kategorien bekommen die Indizes AB paare.length. gradeZuordnung findet dort kein
       Paar und wertet die Wahl als falsch – genau richtig, denn eine Zusatz-Kategorie gehoert zu keiner Aussage. */
    const extra = (listeVon(frage.extra, istText) ?? []).filter((t) => !gesehen.has(t));
    return [...gesehen.entries()].map(([text, index]) => ({ text, index }))
      .concat(extra.map((text, j) => ({ text, index: paare.length + j })));
  }, [paare, frage.extra]);
  /* N47 A: die Kategorien standen in der Reihenfolge der Paare – die erste Aussage gehoerte
     damit immer zur ersten Kategorie (gemessen 10.10.: alle 104). Gemischt wird die Anzeige;
     der Wert bleibt der erste Index der Kategorie, wie gradeZuordnung ihn erwartet. */
  /* K3-E65 / P3 (Meldung 8, 24.11.2026): EIN Schluessel fuer alle Zeilen gab jeder Zeile dieselbe Reihenfolge – je Zeile
     ein eigener. Der Mischer merkt sich jeden Schluessel, also bleibt jede Zeile waehrend der Frage stabil. */
  const mischer = useMischer();
  const anzeigeFuer = (zeile: number) =>
    inReihenfolge(kategorien, mischer.reihenfolge(frage.id + ":kategorien:" + zeile, kategorien.length));

  function setze(links: number, rechts: number | null) {
    const neu = { ...stand };
    if (rechts === null) delete neu[links];
    else neu[links] = rechts;
    aufAntwort(neu);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {paare.map(([links], i) => (
        // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
        <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,14rem)] items-center gap-3">
          <span className="text-[0.9375rem] leading-snug">{links}</span>
          <NativeSelect
            aria-label={`Zuordnung ${i + 1}`}
            disabled={gesperrt}
            value={stand[i] ?? ""}
            onChange={(e) => setze(i, e.target.value === "" ? null : Number(e.target.value))}
            className={cn("w-full", stand[i] == null && "text-muted-foreground")}
          >
            <NativeSelectOption value="">— zuordnen —</NativeSelectOption>
            {anzeigeFuer(i).map(({ wert: k }) => (
              <NativeSelectOption key={k.index} value={k.index}>{k.text}</NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      ))}
      {/* N47 B: nach dem Pruefen die richtige Zuordnung je Aussage. */}
      {gesperrt && <RichtigWaere zeilen={paare.map(([links, rechts]) => `${links} → ${rechts}`)} />}
    </div>
  );
}
