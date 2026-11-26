/* dropdown — je Luecke eine Auswahl. gradeDropdown erwartet ein Feld mit
   einem Options-Index je Luecke, in der Reihenfolge der Luecken.

   ⚠️ Bewusst ein natives <select> statt shadcns Select (Radix-Popover):
      1. Operate-Regel: fuer eine Standardaufgabe keine erfundene Bedienung.
      2. Tastatur und Handy bekommen ohne Zutun das Richtige.
      3. Es ist pruefbar, ohne einen Popover in jsdom nachzustellen.
      Seit N25 P3 ist es shadcns NativeSelect: dasselbe <select>, nur im Stil
      der Bausteine. Der Name bleibt „Lücke i“ (Vertrag eingabe.test.tsx). */
import { useId } from "react";
import { cn } from "cn";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Field, FieldLabel } from "@/components/ui/field";
import type { EingabeProps } from "./vertrag";
import { istZahl, listeVon, oderNull } from "@/kern/pruefe";
import { bleibtGeordnet, inReihenfolge, zahlenReihenfolge } from "@/kern/anzeige";
import { useMischer } from "./mischung";
import { RichtigWaere } from "./RichtigWaere";

interface Luecke {
  optionen: string[];
  loesung: number;
  text?: string;
}

export function Dropdown({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"dropdown">) {
  const basis = useId();
  const luecken = (Array.isArray(frage.luecken) ? frage.luecken : []) as Luecke[];
  const stand: Array<number | null> = listeVon(antwort, oderNull(istZahl)) ?? luecken.map(() => null);
  /* N47 A: je Luecke gemischt – ausser reinen Zahlen-Listen, die stehen aufsteigend nach Wert
     (Nutzer-Entscheid 10.10., Regeln `bleibtGeordnet`/`zahlenReihenfolge` in kern/anzeige.ts). */
  const mischer = useMischer();
  const reihen = luecken.map((l, i) =>
    bleibtGeordnet(l.optionen) ? zahlenReihenfolge(l.optionen)
                               : mischer.reihenfolge(`${frage.id}:luecke${i}`, l.optionen.length));

  function setze(i: number, wert: number | null) {
    const neu = luecken.map((_, k) => (k === i ? wert : (stand[k] ?? null)));
    aufAntwort(neu);
  }

  return (
    <div className="flex flex-col gap-3">
      {luecken.map((l, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
        <Field key={i} className="gap-1.5">
          <FieldLabel htmlFor={`${basis}-${i}`} className="text-[0.8125rem] font-normal text-muted-foreground">
            {l.text ? l.text : `Lücke ${i + 1}`}
          </FieldLabel>
          <NativeSelect
            id={`${basis}-${i}`}
            aria-label={`Lücke ${i + 1}`}
            disabled={gesperrt}
            value={stand[i] ?? ""}
            onChange={(e) => setze(i, e.target.value === "" ? null : Number(e.target.value))}
            className={cn("w-full", stand[i] == null && "text-muted-foreground")}
          >
            <NativeSelectOption value="">— bitte wählen —</NativeSelectOption>
            {inReihenfolge(l.optionen, reihen[i] ?? []).map(({ wert: o, index: k }) => (
              <NativeSelectOption key={k} value={k}>{o}</NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      ))}
      {/* N47 B: nach dem Pruefen die Loesung je Luecke (Lerner-Meldung 5, M01-486). */}
      {gesperrt && (
        <RichtigWaere zeilen={luecken.map((l, i) =>
          `${luecken.length > 1 ? `Lücke ${i + 1}: ` : ""}${l.optionen[l.loesung] ?? "–"}`)} />
      )}
    </div>
  );
}
