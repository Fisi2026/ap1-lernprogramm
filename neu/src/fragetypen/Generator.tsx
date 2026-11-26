/* generator — eine Rechenaufgabe mit frisch gewuerfelten Werten.

   ⛔ SIE WIRD NICHT VON `grade` BEWERTET. `TYP` kennt den Typ nicht; geprueft
      wird Feld fuer Feld mit `gradeLuecke` (kern/generator.ts), genau wie in der
      alten App. Deshalb zeigt die Karte hier ihr Urteil selbst.
   ⚠️ Nach dem Pruefen steht der LOESUNGSWEG da, Zeile fuer Zeile — bei einer
      Aufgabe mit gewuerfelten Zahlen ist er das Einzige, woraus man etwas lernt;
      die Zahl selbst kommt nie wieder. */
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { bewerteZufall, felder } from "@/kern/generator";
import type { Zufallsaufgabe } from "@/kern/generator";
import { istText, listeVon } from "@/kern/pruefe";

/* N25 P3: Field + Input. Die Namen „Antwort“ / „Antwort i“ sind Vertrag. */
const FELD = "h-9 w-56 font-mono text-[0.9375rem] disabled:opacity-80";

export function Generator({
  frage, antwort, aufAntwort, gesperrt,
}: {
  frage: Zufallsaufgabe;
  antwort: unknown;
  aufAntwort: (a: unknown) => void;
  gesperrt: boolean;
}) {
  const teile = felder(frage);
  const stand: string[] = listeVon(antwort, istText) ?? teile.map(() => "");
  const urteil = gesperrt ? bewerteZufall(frage, stand) : [];

  function setze(i: number, wert: string) {
    aufAntwort(teile.map((_, k) => (k === i ? wert : (stand[k] ?? ""))));
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldDescription>Rechenaufgabe mit frischen Zufallswerten — sie kommt so kein zweites Mal.</FieldDescription>

      {typeof frage.hinweis === "string" && frage.hinweis && (
        <p className="rounded-md border border-input px-3 py-2 text-[0.8125rem] text-muted-foreground">
          {frage.hinweis}
        </p>
      )}

      {teile.map((akzeptiert, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
        <Field key={i} className="gap-1.5">
          <FieldLabel htmlFor={`gen-${i}`} className="text-[0.8125rem] font-normal text-muted-foreground">
            {teile.length > 1 ? `Antwort ${i + 1}` : "Antwort"}
            {frage.einheit && teile.length === 1 ? ` (${frage.einheit})` : ""}
          </FieldLabel>
          <div className="flex items-center gap-3">
            <Input
              id={`gen-${i}`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              disabled={gesperrt}
              value={stand[i] ?? ""}
              onChange={(e) => setze(i, e.target.value)}
              aria-label={teile.length > 1 ? `Antwort ${i + 1}` : "Antwort"}
              className={cn(FELD, gesperrt && (urteil[i] ? "border-chart-1/60" : "border-destructive"))}
            />
            {gesperrt && !urteil[i] && (
              <span className="font-mono text-[0.8125rem] text-muted-foreground">
                richtig: {String(akzeptiert[0])}
              </span>
            )}
          </div>
        </Field>
      ))}

      {gesperrt && (
        <>
          <div
            className={cn(
              "rounded-md border px-4 py-3 text-[0.9375rem] font-medium",
              urteil.every(Boolean)
                ? "border-chart-1/40 text-foreground"
                : "border-destructive/50 text-destructive",
            )}
          >
            {urteil.every(Boolean) ? "Richtig." : "Nicht richtig."}
          </div>

          <div className="rounded-md border border-input px-4 py-3">
            <b className="mb-1.5 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Lösungsweg Schritt für Schritt
            </b>
            <div className="flex flex-col gap-1 font-mono text-[0.8125rem] leading-relaxed">
              {(frage.weg ?? []).map((zeile, i) => (
                // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
                <span key={i}>{zeile}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
