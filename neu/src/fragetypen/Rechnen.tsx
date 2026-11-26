/* Die beiden Typen, bei denen gerechnet wird:

     rechenassistent -> Array je Schritt          (Text; numerisch mit Toleranz geprueft)
     kalkulation     -> {"zeile,spalte": Text}    (nur die Loesungszellen)

   ⛔ `rechenassistent` SETZT EINE INSTANZIIERTE FRAGE VORAUS. Im Bestand tragen die
      Schritte Formeln (`s1+dauerB`) und der Fragetext Platzhalter (`{dauerA}`);
      Werte entstehen erst in `L.instanziiere` (siehe kern/instanz.ts). Bekommt diese
      Eingabe eine rohe Pool-Frage, sagt sie das laut, statt Formeln hinzuschreiben.

   ⚠️ `gradeRechenassistent` prueft numerisch MIT Toleranz (`toleranzFuer`), nicht
      als Zeichenkette: "1.234,50", "1234.5" und "1234,50" sind dieselbe Antwort.
      Deshalb steht unter dem Feld keine Schreibweisen-Vorschrift.
   ⚠️ `gradeKalkulation` ueberspringt feste Zellen (die mit `v`). Nur Zellen mit
      `loesung` werden geprueft — und nur die bekommen hier ein Feld. */
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Field, FieldDescription } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EingabeProps } from "./vertrag";
import { istObjekt, istText, istZahl, listeAus, listeVon, optional, tabelleVon } from "@/kern/pruefe";

/* N25 P3: Field + Input bzw. InputGroup mit der Einheit als Addon (rechenassistent),
   Table + Input (kalkulation). Die Namen je Feld sind Vertrag (eingabe.test.tsx). */
const FELD = "h-8 min-w-[5.5rem] px-2 font-mono text-[0.8125rem] disabled:opacity-80";

const KOPF =
  "px-2 pb-2 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase";

interface Schritt {
  text: string;
  einheit?: string;
  formel?: string;
  wert?: number;
  loesung?: string[];
}
/* N38 Q1: Schritte und Zellen werden geprueft statt behauptet. Gemessen am Bestand: alle 29
   Rechenassistenten (Schluessel text/einheit/formel/loesung/dezimalen) und alle 24 Kalkulationen
   bestehen; `wert` setzt erst `instanziiere` (Zahl). */
const istSchritt = (x: unknown): x is Schritt =>
  istObjekt(x) && istText(x.text) && optional(istText)(x.einheit) && optional(istText)(x.formel)
  && optional(istZahl)(x.wert) && optional(listeAus(istText))(x.loesung);

/* ------------------------------------------------------------ rechenassistent */
export function Rechenassistent({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"rechenassistent">) {
  const schritte = listeVon(frage.schritte, istSchritt) ?? [];
  const stand: string[] = listeVon(antwort, istText) ?? schritte.map(() => "");

  /* Eine Frage mit Formeln, aber ohne Werte, ist nicht gestellt worden — sie ist
     roh durchgereicht. Das ist ein Fehler im Aufbau, kein Zustand fuer den Lerner. */
  const rohDurchgereicht = schritte.some((s) => s.formel && typeof s.wert !== "number");

  function setze(i: number, wert: string) {
    aufAntwort(schritte.map((_, k) => (k === i ? wert : (stand[k] ?? ""))));
  }

  if (rohDurchgereicht) {
    return (
      <div className="rounded-md border border-destructive/50 px-4 py-3 text-[0.8125rem] leading-relaxed text-destructive">
        Diese Aufgabe wurde nicht gestellt, sondern roh durchgereicht: ihre Schritte tragen
        Formeln statt Werte. Sie muss durch <span className="font-mono">L.instanziiere</span>{" "}
        (kern/instanz.ts), bevor sie gezeichnet werden darf.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldDescription>Rechne Schritt für Schritt. Punkt oder Komma ist egal.</FieldDescription>

      {schritte.map((s, i) => {
        const name = `Schritt ${i + 1}: ${s.text}${s.einheit ? ` (${s.einheit})` : ""}`;
        return (
          // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
          <Field key={i} className="gap-1.5">
            <div className="flex gap-2 text-[0.875rem] leading-snug">
              <span aria-hidden className="flex-none font-mono text-muted-foreground tabular-nums">
                {i + 1}.
              </span>
              <span>
                {s.text}
                {s.einheit && (
                  <span className="text-muted-foreground"> ({s.einheit})</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 pl-6">
              {s.einheit ? (
                <InputGroup className="h-8 max-w-56">
                  <InputGroupInput type="text" inputMode="decimal" autoComplete="off" spellCheck={false}
                                   disabled={gesperrt} value={stand[i] ?? ""}
                                   onChange={(e) => setze(i, e.target.value)}
                                   aria-label={name} className="px-2 font-mono text-[0.8125rem]" />
                  <InputGroupAddon align="inline-end" aria-hidden>
                    <InputGroupText className="text-[0.8125rem]">{s.einheit}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              ) : (
                <Input type="text" inputMode="decimal" autoComplete="off" spellCheck={false}
                       disabled={gesperrt} value={stand[i] ?? ""}
                       onChange={(e) => setze(i, e.target.value)}
                       aria-label={name} className={cn(FELD, "max-w-56")} />
              )}
              {gesperrt && (
                <span className="font-mono text-[0.8125rem] text-muted-foreground">
                  richtig: {s.loesung?.[0] ?? String(s.wert ?? "")}
                </span>
              )}
            </div>
          </Field>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- kalkulation */
interface Zelle {
  v?: string;
  loesung?: string[];
}
const istZelle = (x: unknown): x is Zelle =>
  istObjekt(x) && optional(istText)(x.v) && optional(listeAus(istText))(x.loesung);

/** Der Schluessel, den gradeKalkulation liest: "zeile,spalte". */
function zellenSchluessel(r: number, c: number): string {
  return r + "," + c;
}

export function Kalkulation({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"kalkulation">) {
  const kopf = listeVon(frage.kopf, istText) ?? [];
  const zeilen = listeVon(frage.zeilen, listeAus(istZelle)) ?? [];
  const stand = tabelleVon(antwort, istText);

  function setze(r: number, c: number, wert: string) {
    aufAntwort({ ...stand, [zellenSchluessel(r, c)]: wert });
  }

  return (
    <div className="flex flex-col gap-3">
      <FieldDescription>Füll die leeren Zellen aus. Die vorgegebenen Werte bleiben stehen.</FieldDescription>

      <Table>
        <TableHeader>
          <TableRow>
            {kopf.map((h, i) => (
              // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
              <TableHead key={i} scope="col" className={KOPF}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
            {zeilen.map((row, r) => (
              // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
              <TableRow key={r}>
                {row.map((zelle, c) => (
                  // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
                  <TableCell key={c} className="p-1">
                    {Array.isArray(zelle.loesung) ? (
                      <Input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        spellCheck={false}
                        disabled={gesperrt}
                        value={stand[zellenSchluessel(r, c)] ?? ""}
                        onChange={(e) => setze(r, c, e.target.value)}
                        aria-label={`${kopf[c] ?? `Spalte ${c + 1}`}, Zelle ${r + 1}`}
                        className={FELD}
                      />
                    ) : (
                      <span className="block px-2 font-mono text-[0.8125rem] text-muted-foreground">
                        {zelle.v}
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {gesperrt && (
        <div className="rounded-md border border-input px-4 py-3 text-[0.8125rem]">
          <b className="mb-1 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Richtige Werte
          </b>
          <span className="font-mono text-foreground">
            {zeilen
              .flatMap((row, r) =>
                row.flatMap((zelle, c) =>
                  Array.isArray(zelle.loesung)
                    ? [`${kopf[c]} ${r + 1}: ${zelle.loesung[0]}`]
                    : [],
                ),
              )
              .join("  ·  ")}
          </span>
        </div>
      )}
    </div>
  );
}
