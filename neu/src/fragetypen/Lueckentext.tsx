/* lueckentext — der Fragetext SELBST traegt die Luecken.
   gradeLueckentext erwartet ein Feld mit einem Text je Luecke und prueft jede
   Luecke gegen ihre Liste akzeptierter Schreibweisen (gradeLueckeTolerant:
   Gross/Klein und Umlaute egal, ein Tippfehler erlaubt, sobald das Wort lang
   genug ist und keine Ziffer enthaelt).

   ⚠️ GEMESSEN AM 11.09.2026: alle 13 Fragen (12 lueckentext + 1 bild mit
      unterTyp lueckentext) schreiben ihre Luecken als genau `___` (drei
      Unterstriche), und die Zahl der Platzhalter stimmt bei jeder mit der Zahl
      der Luecken ueberein. `lueckentext.test.ts` haelt das fest — sonst zeichnet
      ein spaeterer Pool-Eintrag stillschweigend eine Luecke zu wenig. */
import { useId } from "react";
import type { EingabeProps } from "./vertrag";
import { zerlegen } from "./luecken";
import { istText, listeVon } from "@/kern/pruefe";
import { gradeLueckeTolerant } from "@/kern/bewertung";
import { cn } from "cn";

/** Genau drei Unterstriche, so wie der Bestand sie schreibt. Bewusst NICHT
    `_{2,}`: ein weicheres Muster wuerde einen Tippfehler im Pool verdecken. */

/* ⚠️ Ausnahme von N25 P3: das Feld steht MITTEN IM SATZ und bleibt ein rohes
   <input> (shadcns Input ist ein Block mit fester Hoehe). Nur die Klassen folgen
   seinem Stil (components/ui/input.tsx): Rand, Rundung, Fokusring, dunkle Flaeche. */
const FELD =
  "mx-0.5 inline-block min-w-[7rem] rounded-lg border border-input bg-transparent px-2 py-0.5 " +
  "align-baseline text-[0.9375rem] text-foreground transition-colors outline-none " +
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 " +
  "dark:bg-input/30 disabled:opacity-80";

export function Lueckentext({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"lueckentext">) {
  const luecken = Array.isArray(frage.luecken) ? frage.luecken : [];
  const kennung = useId();
  const stand: string[] = listeVon(antwort, istText) ?? luecken.map(() => "");

  function setze(i: number, wert: string) {
    const neu = luecken.map((_, k) => (k === i ? wert : (stand[k] ?? "")));
    aufAntwort(neu);
  }

  const text = typeof frage.frage === "string" ? frage.frage : "";
  const teile = zerlegen(text);
  /* Passt die Zahl der Platzhalter nicht zur Zahl der Luecken, wird NICHT geraten:
     dann stehen Text und Felder getrennt untereinander. Lieber sichtbar schlicht
     als stillschweigend falsch. */
  const passt = teile.length === luecken.length + 1;

  /* K3-E65 / P6 (Lerner-Meldung 11/12, 24.11.2026): nach dem Pruefen steht jede FALSCHE Luecke rot da – dieselbe
     Regel wie die Bewertung (gradeLueckeTolerant), damit Markierung und Urteil nie auseinanderlaufen. */
  const falsch = (i: number) => gesperrt && !gradeLueckeTolerant(luecken[i] ?? [], stand[i] ?? "");

  const feld = (i: number) => (
    <input
      key={`f${i}`}
      id={`${kennung}-${i}`}
      type="text"
      autoComplete="off"
      spellCheck={false}
      disabled={gesperrt}
      value={stand[i] ?? ""}
      onChange={(e) => setze(i, e.target.value)}
      aria-label={`Lücke ${i + 1} von ${luecken.length}`}
      aria-invalid={falsch(i) || undefined}
      className={cn(FELD, falsch(i) && "border-destructive")}
      size={Math.max(8, Math.min(24, (luecken[i]?.[0] ?? "").length + 2))}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[0.8125rem] text-muted-foreground">
        Fülle die Lücken. Groß- und Kleinschreibung spielt keine Rolle.
      </p>

      {passt ? (
        <p className="text-[1.0625rem] leading-[2.2]">
          {teile.map((t, i) => (
            // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
            <span key={i}>
              {t}
              {i < luecken.length && feld(i)}
            </span>
          ))}
        </p>
      ) : (
        <>
          <p className="text-[1.0625rem] leading-relaxed">{text}</p>
          <div className="flex flex-col gap-2">
            {luecken.map((_, i) => (
              // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
              <label key={i} className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
                <span className="w-20 flex-none">Lücke {i + 1}</span>
                {feld(i)}
              </label>
            ))}
          </div>
        </>
      )}

      {gesperrt && (
        <div className="rounded-md border border-input px-4 py-3 text-[0.8125rem]">
          <b className="mb-1 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Erwartet war
          </b>
          <span className="text-foreground">
            {luecken.map((l, i) => `${i + 1}. ${l[0]}`).join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}
