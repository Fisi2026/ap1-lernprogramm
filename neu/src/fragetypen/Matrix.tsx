/* matrix — vier Felder, aufgespannt von zwei Achsen.
   gradeMatrix erwartet {elementIndex: quadrantIndex}.

   ⚠️ Die Reihenfolge der Quadranten ist NICHT beliebig: 0 oben links, 1 oben
      rechts, 2 unten links, 3 unten rechts (zeilenweise). So liest sie die alte
      App (app_loeser.js: ein 2x2-Raster ueber [0,1,2,3]), und nur so passen die
      Achsenbeschriftungen zu den Namen. Deshalb steht die Karte oben als Bild —
      ohne sie waeren die vier Namen eine Liste ohne Bedeutung.
   ⚠️ Eine Frage im Bestand (M05-702) traegt KEINE Achsenbeschriftung. Die Karte
      wird dann ohne Achsen gezeichnet, nicht mit erfundenen. */
import { cn } from "cn";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { EingabeProps } from "./vertrag";
import { istZahl, tabelleVon } from "@/kern/pruefe";

/* N25 P3: NativeSelect (Grund wie in Dropdown.tsx). Der Name „Element i“ ist Vertrag.
   Die Klasse sitzt am Rahmen des Bausteins, der Rand am <select> darin. */

interface Element {
  text: string;
  quadrant: number;
}

export function Matrix({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"matrix">) {
  const quadranten = Array.isArray(frage.quadranten) ? frage.quadranten : [];
  const elemente = (Array.isArray(frage.elemente) ? frage.elemente : []) as Element[];
  const xAchse = typeof frage.xAchse === "string" ? frage.xAchse : "";
  const yAchse = typeof frage.yAchse === "string" ? frage.yAchse : "";
  const stand: Record<number, number> = tabelleVon(antwort, istZahl);   // N38 Q1: vorher behauptet

  function setze(i: number, q: string) {
    const neu = { ...stand };
    if (q === "") delete neu[i];
    else neu[i] = Number(q);
    aufAntwort(neu);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[0.8125rem] text-muted-foreground">
        Ordne jedes Element einem der vier Felder zu.
      </p>

      {/* Die Karte: reine Orientierung, hier wird nichts angeklickt. */}
      <div className="flex flex-col gap-1.5">
        {xAchse && (
          <div className="pl-6 text-center text-xs tracking-wider text-muted-foreground uppercase">
            {xAchse}
          </div>
        )}
        <div className="flex items-stretch gap-1.5">
          {yAchse && (
            <div
              className="flex-none self-center text-xs tracking-wider text-muted-foreground uppercase"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {yAchse}
            </div>
          )}
          <div className="grid flex-1 grid-cols-2 gap-1.5">
            {quadranten.map((q, qi) => {
              const drin = elemente.filter((_, ei) => stand[ei] === qi);
              return (
                // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
                <div key={qi} className="min-h-20 rounded-md border border-dashed border-input p-2.5">
                  <div className="text-xs font-medium tracking-wide text-muted-foreground">
                    {q}
                  </div>
                  <div className="mt-1.5 flex flex-col gap-1">
                    {drin.map((e) => (
                      <span key={e.text} className="line-clamp-2 text-[0.75rem] leading-snug text-foreground">
                        {e.text}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {elemente.map((e, i) => (
          // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
          <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,13rem)] items-center gap-3">
            <span className="text-[0.875rem] leading-snug">{e.text}</span>
            <NativeSelect
              aria-label={`Element ${i + 1}`}
              disabled={gesperrt}
              value={stand[i] === undefined ? "" : String(stand[i])}
              onChange={(ev) => setze(i, ev.target.value)}
              className={cn("w-full", gesperrt && stand[i] !== e.quadrant && "[&>select]:border-destructive")}
            >
              <NativeSelectOption value="">— wählen —</NativeSelectOption>
              {quadranten.map((q, qi) => (
                // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
                <NativeSelectOption key={qi} value={qi}>{q}</NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        ))}
      </div>

      {gesperrt && (
        <div className="rounded-md border border-input px-4 py-3 text-[0.8125rem]">
          <b className="mb-1 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Richtig wäre
          </b>
          <span className="text-foreground">
            {elemente.map((e) => `${e.text} → ${quadranten[e.quadrant]}`).join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}
