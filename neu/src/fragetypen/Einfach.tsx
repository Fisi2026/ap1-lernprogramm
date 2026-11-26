/* Drei Typen, die sich eine Bauweise teilen — jeder liefert genau das, was
   logik.js erwartet (belegt in kern/antwortform.ts):

     fehlersuche  -> zeileIndex        (eine Zahl)
     mtf          -> [true, false, …]  (ein Feld von Wahrheitswerten)
     szenario2    -> {s1, s2}          (zwei Indizes, beide muessen stimmen)

   Sie stehen zusammen, weil sie dieselbe Frage stellen: "welches von diesen hier?"
   Getrennte Dateien waeren drei Kopien derselben Liste.

   N25 P3: fehlersuche und szenario2 als Wahlkarten (RadioGroup, Karte aus
   Auswahl.tsx), mtf als ToggleGroup je Aussage. Die Rollen und Namen sind
   Vertrag (eingabe.test.tsx): `radio` je Zeile, `radio` „Aussage i: wahr|falsch“,
   `radiogroup` „Schritt 1|2“. */
import { useId } from "react";
import { cn } from "cn";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { Karte } from "./Auswahl";
import { inReihenfolge, urteilFuer } from "@/kern/anzeige";
import { useMischer } from "./mischung";
import type { EingabeProps } from "./vertrag";
import { istWahrheit, listeVon, oderNull } from "@/kern/pruefe";

/* ---------------------------------------------------------------- fehlersuche */
export function Fehlersuche({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"fehlersuche">) {
  const basis = useId();
  const zeilen = Array.isArray(frage.zeilen) ? frage.zeilen : [];
  const gewaehlt = typeof antwort === "number" ? antwort : null;

  return (
    <div className="flex flex-col gap-2">
      <FieldDescription>Welche Zeile enthält den Fehler?</FieldDescription>
      <RadioGroup aria-label="Zeilen" disabled={gesperrt} className="gap-1.5"
                  value={gewaehlt === null ? "" : String(gewaehlt)}
                  onValueChange={(w) => aufAntwort(Number(w))}>
        {zeilen.map((z, i) => {
          const id = `${basis}-${i}`;
          return (
            // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
            <Karte key={i} id={id} i={i} text={z} marke={i + 1}
                   textKlasse="font-mono text-[0.875rem]"
                   /* N48 P1 (10.10.): nach dem Pruefen die fehlerhafte Zeile markieren. */
                   urteil={urteilFuer(gesperrt, i === frage.fehlerZeile, gewaehlt === i)}
                   knopf={<RadioGroupItem id={id} value={String(i)} aria-labelledby={id + "-t"} />} />
          );
        })}
      </RadioGroup>
    </div>
  );
}

/* ----------------------------------------------------------------------- mtf */
export function Mtf({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"mtf">) {
  const aussagen = (Array.isArray(frage.aussagen) ? frage.aussagen : []) as Array<{ text: string; wahr?: boolean }>;
  const stand: Array<boolean | null> = listeVon(antwort, oderNull(istWahrheit)) ?? aussagen.map(() => null);

  function setze(i: number, wert: boolean) {
    aufAntwort(aussagen.map((_, k) => (k === i ? wert : (stand[k] ?? null))));
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldDescription>Wahr oder falsch? Nur alles richtig zählt.</FieldDescription>
      {aussagen.map((a, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
        <div key={i} data-urteil={gesperrt ? (stand[i] === a.wahr ? "richtig" : "falsch") : undefined}
             className={cn("flex flex-wrap items-start gap-x-3 gap-y-2 rounded-lg border px-4 py-3",
                           gesperrt && stand[i] !== a.wahr && "border-destructive")}>
          {/* N25b: Text mindestens 12rem, sonst rutschen die Knoepfe in die naechste Zeile. */}
          <span className="min-w-0 grow basis-48 text-[0.9375rem] leading-snug">{a.text}</span>
          {/* Ein zweiter Klick auf die gewählte Seite liefert "" – das heißt hier
              NICHT „zurück auf offen“: die Wahl bleibt stehen, wie vor P3. */}
          <ToggleGroup type="single" variant="outline" size="sm" disabled={gesperrt}
                       aria-label={`Aussage ${i + 1}`} className="flex-none"
                       value={stand[i] === true ? "wahr" : stand[i] === false ? "falsch" : ""}
                       onValueChange={(w) => { if (w) setze(i, w === "wahr"); }}>
            {(["wahr", "falsch"] as const).map((w) => (
              <ToggleGroupItem key={w} value={w} aria-label={`Aussage ${i + 1}: ${w}`}
                               className="data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                {w}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {/* N48 P1 (10.10.): nach dem Pruefen steht je Aussage, was richtig ist – als Wort. */}
          {gesperrt && typeof a.wahr === "boolean" && (
            <span className={cn("basis-full text-xs font-medium", stand[i] === a.wahr ? "text-foreground" : "text-destructive")}>
              richtig: {a.wahr ? "wahr" : "falsch"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- szenario2 */
interface Schritt {
  frage: string;
  optionen: string[];
  loesungIndex: number;
}

export function Szenario2({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"szenario2">) {
  const basis = useId();
  const s1 = frage.schritt1 as Schritt | undefined;
  const s2 = frage.schritt2 as Schritt | undefined;
  const stand = (antwort && typeof antwort === "object" ? antwort : {}) as { s1?: number; s2?: number };
  /* N47 A: je Schritt gemischt (gemessen 10.10.: in allen 38 Schritten war Index 0 richtig). */
  const mischer = useMischer();

  function block(nr: "s1" | "s2", schritt: Schritt | undefined, titel: string) {
    if (!schritt) return null;
    const w = stand[nr];
    return (
      <FieldSet disabled={gesperrt} className="gap-2">
        <FieldLegend variant="label" className="text-muted-foreground">
          {titel}: {schritt.frage}
        </FieldLegend>
        <RadioGroup aria-label={titel} disabled={gesperrt} className="gap-1.5"
                    value={typeof w === "number" ? String(w) : ""}
                    onValueChange={(v) => aufAntwort({ ...stand, [nr]: Number(v) })}>
          {inReihenfolge(schritt.optionen, mischer.reihenfolge(`${frage.id}:${nr}`, schritt.optionen.length)).map(({ wert: o, index: i }, k) => {
            const id = `${basis}-${nr}-${i}`;
            return (
              <Karte key={i} id={id} i={k} text={o}
                     urteil={urteilFuer(gesperrt, i === schritt.loesungIndex, w === i)}
                     knopf={<RadioGroupItem id={id} value={String(i)} aria-labelledby={id + "-t"} />} />
            );
          })}
        </RadioGroup>
      </FieldSet>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {block("s1", s1, "Schritt 1")}
      {block("s2", s2, "Schritt 2")}
      {/* ⚠️ gradeSzenario2 wertet nur als richtig, wenn BEIDE Schritte stimmen.
          Das gehoert auf den Schirm, sonst raet man beim zweiten Schritt. */}
      <FieldDescription>Beide Schritte müssen stimmen.</FieldDescription>
    </div>
  );
}
