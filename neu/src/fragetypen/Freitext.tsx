/* freitext und erklaeren — die beiden Typen, die TYP NICHT bewertet.

   ⛔ Der Ablauf ist bewusst derselbe wie in der alten App (app_loeser.js R_TYP.freitext):
      1. schreiben
      2. AUTOMATISCHE EINSCHAETZUNG — ausdruecklich als Naeherung beschriftet
      3. Musterloesung
      4. SELBSTEINSCHAETZUNG mit drei Knoepfen; die Automatik schlaegt einen vor,
         entscheiden tut der Mensch.
   ⚠️ Die Mitte ("teilweise") bucht die Frage NICHT ins Fehler-Deck — so war es schon
      in der alten App, und daran haengt der Lernrhythmus. */
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { einschaetzen } from "@/kern/freitext";
import type { Stufe, AutoBefund, TeilpunkteBefund } from "@/kern/freitext";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import type { EingabeProps } from "./vertrag";
import { istObjekt, istText } from "@/kern/pruefe";

/** Was die Oberflaeche einsammelt: der geschriebene Text und — nach dem Pruefen —
    die Selbsteinschaetzung. `null` in der Mitte heisst "teilweise". */
interface FreitextAntwort {
  text: string;
  selbst?: boolean | null;
}

const STUFE_TEXT: Record<Stufe, string> = {
  richtig: "wahrscheinlich richtig",
  teilweise: "teilweise richtig",
  "unvollständig": "eher unvollständig",
  unklar: "nicht sicher bewertbar",
  leer: "keine Antwort erkannt",
};

/* Farbe nur dort, wo sie etwas bedeutet. Der shadcn-Neutral-Satz kennt nur
   --destructive als Farbe; "richtig" bleibt bewusst neutral-hell statt gruen,
   weil der Satz kein success-Token hat, das nicht erfunden waere. */
const STUFE_RAHMEN: Record<Stufe, string> = {
  richtig: "border-chart-1/40",
  teilweise: "border-input",
  "unvollständig": "border-destructive/50",
  unklar: "border-input",
  leer: "border-destructive/50",
};

function istTeilpunkte(b: AutoBefund | TeilpunkteBefund): b is TeilpunkteBefund {
  return "pflichtGesamt" in b;
}

/* N37 U4: EIN Props-Typ fuer beide Typen statt Generik – bei generischem `T` loest TS `FrageMitWirkTyp<T>` nicht auf. */
export function Freitext({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"freitext"> | EingabeProps<"erklaeren">) {
  /* N38 Q1: vorher `(antwort ?? { text: "" }) as FreitextAntwort` – jetzt aus den gepruefteten Feldern. */
  const roh: Record<string, unknown> = istObjekt(antwort) ? antwort : {};
  const text = istText(roh.text) ? roh.text : "";
  const selbst = roh.selbst === true || roh.selbst === false || roh.selbst === null ? roh.selbst : undefined;
  const stand: FreitextAntwort = selbst === undefined ? { text } : { text, selbst };

  if (!gesperrt) {
    return (
      <Field className="gap-2">
        {/* N25 P3: Field + Textarea. Der Name bleibt „Deine Antwort“ (Vertrag). */}
        <FieldLabel htmlFor="freitext-antwort" className="text-[0.8125rem] font-normal text-muted-foreground">
          {frage.typ === "erklaeren"
            ? "Erkläre es in eigenen Worten — vollständige Sätze, keine Stichpunkte."
            : "Deine Antwort"}
        </FieldLabel>
        <Textarea
          id="freitext-antwort"
          aria-label="Deine Antwort"
          rows={8}
          value={text}
          onChange={(e) => aufAntwort({ ...stand, text: e.target.value })}
          className="min-h-40 resize-y text-[0.9375rem] leading-relaxed"
          placeholder="Schreib auf, was du weißt …"
        />
      </Field>
    );
  }

  const befund = einschaetzen(text, frage);
  const kern = istTeilpunkte(befund)
    ? `${befund.pflichtTreffer} von ${befund.pflichtGesamt} Kernpunkten getroffen` +
      (befund.kuerGesamt
        ? ` (+ ${befund.kuerTreffer} von ${befund.kuerGesamt} Zusatzpunkten)`
        : "") +
      ` (${befund.prozent} %)`
    : `${befund.treffer} von ${befund.anzahl} Kernpunkten erkannt (${befund.prozent} %)`;

  /* Vorschlag wie in der alten App: richtig -> "wusste ich", teilweise -> Mitte,
     leer/unvollstaendig -> "wusste ich nicht", unklar -> kein Vorschlag. */
  const vorschlag =
    befund.stufe === "richtig" ? 0
    : befund.stufe === "teilweise" ? 1
    : befund.stufe === "leer" || befund.stufe === "unvollständig" ? 2
    : -1;

  const knoepfe: Array<{ label: string; wert: boolean | null }> = [
    { label: "Wusste ich", wert: true },
    { label: "Teilweise", wert: null },
    { label: "Wusste ich nicht", wert: false },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-input px-3 py-2 text-[0.8125rem] whitespace-pre-wrap text-muted-foreground">
        {text || "— nichts geschrieben —"}
      </div>

      <div className={cn("rounded-md border px-4 py-3", STUFE_RAHMEN[befund.stufe])}>
        <div className="text-[0.9375rem]">
          <b className="font-medium">Automatische Einschätzung:</b> {kern} →{" "}
          <b className={cn("font-semibold", befund.stufe === "unvollständig" || befund.stufe === "leer"
            ? "text-destructive" : "text-foreground")}>
            {STUFE_TEXT[befund.stufe]}
          </b>
        </div>
        {/* ⚠️ Diese Zeile steht so auch in der alten App und bleibt: die Automatik ist
            ein Begriffs-Abgleich, keine Bedeutungspruefung. Sie darf sich nicht als
            Urteil ausgeben. */}
        <div className="mt-1.5 text-xs text-muted-foreground">
          Näherung über Begriffs-Abgleich — maßgeblich ist deine eigene Einschätzung.
        </div>
      </div>

      {typeof frage.musterloesung === "string" && (
        <div className="rounded-md border border-input px-4 py-3">
          <b className="mb-1.5 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Musterlösung
          </b>
          <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap">
            {frage.musterloesung}
          </p>
        </div>
      )}

      <div>
        <div className="mb-2 text-[0.8125rem] text-muted-foreground">
          Deine Selbsteinschätzung — sie zählt für die Statistik:
        </div>
        <div className="flex flex-wrap gap-2">
          {knoepfe.map((k, i) => (
            <Button
              key={k.label}
              variant={stand.selbst === k.wert && stand.selbst !== undefined ? "default" : "secondary"}
              onClick={() => aufAntwort({ ...stand, selbst: k.wert })}
            >
              {k.label}
              {i === vorschlag && (
                <span className="ml-1.5 text-xs opacity-70">(Vorschlag)</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
