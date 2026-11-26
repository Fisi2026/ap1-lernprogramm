/* mc und mehrfach — dieselbe Liste, zwei Verhalten.
   mc liefert eine Zahl, mehrfach ein Feld von Zahlen. Genau so erwartet es
   gradeMC bzw. gradeMehrfach (belegt in kern/antwortform.ts).

   N25 P3: Wahlkarten (shadcn „Choice Card“) wie in den Einstellungen – die ganze
   Karte ist anklickbar, der Knopf heißt genau wie die Option (Vertrag aus
   eingabe.test.tsx: `radio`/`checkbox` mit Namen = Optionstext). Der Buchstabe
   davor ist Schmuck und bleibt für den Screenreader stumm. */
import { useId, type ReactNode } from "react";
import { cn } from "cn";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import type { EingabeProps } from "./vertrag";
import { istZahl, listeVon } from "@/kern/pruefe";
import { inReihenfolge, urteilFuer, type OptionsUrteil } from "@/kern/anzeige";
import { useMischer } from "./mischung";

function optionenVon(frage: EingabeProps<"mc" | "mehrfach">["frage"]): string[] {
  return Array.isArray(frage.optionen) ? frage.optionen : [];
}

const URTEIL_TEXT = { richtig: "richtig", falsch: "deine Wahl – falsch" } as const;

/** Eine Wahlkarte: Marke (Buchstabe, Zeilennummer), Text, Bedienelement. Der Knopf
    heißt über `aria-labelledby={id + "-t"}` genau wie der Text. Auch Einfach.tsx baut damit.
    ⚠️ N47 B: das Urteil steht als WORT neben dem Text, nicht nur als Farbe (WCAG 1.4.1). Es
       liegt ausserhalb von `id + "-t"`, damit der Name des Knopfs gleich bleibt. */
export function Karte({ id, i, text, knopf, marke, textKlasse, urteil }: {
  id: string; i: number; text: string; knopf: ReactNode; marke?: ReactNode; textKlasse?: string;
  urteil?: OptionsUrteil;
}) {
  return (
    <FieldLabel htmlFor={id} data-urteil={urteil}
                className={cn(urteil === "richtig" && "border-chart-1 bg-accent",
                              urteil === "falsch" && "border-destructive bg-destructive/10")}>
      <Field orientation="horizontal">
        {knopf}
        <FieldContent>
          <FieldTitle className={cn("font-normal text-[0.9375rem] leading-normal", textKlasse)}>
            <span aria-hidden className="mr-1 font-mono text-xs text-muted-foreground tabular-nums">
              {marke ?? String.fromCharCode(65 + i)}
            </span>
            <span id={id + "-t"} className="whitespace-pre-wrap">{text}</span>
          </FieldTitle>
          {urteil && (
            <span className={cn("text-xs font-medium",
                                urteil === "richtig" ? "text-foreground" : "text-destructive")}>
              {URTEIL_TEXT[urteil]}
            </span>
          )}
        </FieldContent>
      </Field>
    </FieldLabel>
  );
}

export function MC({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"mc">) {
  const basis = useId();
  const optionen = optionenVon(frage);
  /* N47 A: Anzeige gemischt, Wert bleibt der Ursprungs-Index (`kern/anzeige.ts`). */
  const liste = inReihenfolge(optionen, useMischer().reihenfolge(frage.id + ":optionen", optionen.length));
  return (
    <RadioGroup aria-label="Antwortmöglichkeiten" disabled={gesperrt} className="gap-2"
                value={typeof antwort === "number" ? String(antwort) : ""}
                onValueChange={(w) => aufAntwort(Number(w))}>
      {liste.map(({ wert: o, index: i }, k) => {
        const id = `${basis}-${i}`;
        return (
          <Karte key={i} id={id} i={k} text={o}
                 urteil={urteilFuer(gesperrt, i === frage.loesungIndex, antwort === i)}
                 knopf={<RadioGroupItem id={id} value={String(i)} aria-labelledby={id + "-t"} />} />
        );
      })}
    </RadioGroup>
  );
}

export function Mehrfach({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"mehrfach">) {
  const basis = useId();
  const optionen = optionenVon(frage);
  const gewaehlt = listeVon(antwort, istZahl) ?? [];
  const richtig = Array.isArray(frage.loesungIndizes) ? frage.loesungIndizes : [];
  const liste = inReihenfolge(optionen, useMischer().reihenfolge(frage.id + ":optionen", optionen.length));
  return (
    <fieldset aria-label="Antwortmöglichkeiten" className="min-w-0 flex flex-col gap-2">
      {liste.map(({ wert: o, index: i }, k) => {
        const id = `${basis}-${i}`;
        const an = gewaehlt.includes(i);
        return (
          <Karte key={i} id={id} i={k} text={o}
                 urteil={urteilFuer(gesperrt, richtig.includes(i), an)}
                 knopf={<Checkbox id={id} checked={an} disabled={gesperrt} aria-labelledby={id + "-t"}
                                  onCheckedChange={() =>
                                    aufAntwort(an ? gewaehlt.filter((x) => x !== i) : [...gewaehlt, i])} />} />
        );
      })}
    </fieldset>
  );
}
