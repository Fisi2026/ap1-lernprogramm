/* ============================================================================
   DER TASCHENRECHNER — DIE OBERFLAECHE (N26 T3, E6)

   Gerechnet wird NUR in `kern/rechner.ts` (`rechne`, `formatiere`) - hier steht
   keine Rechenregel. Deren Gleichheit mit der alten App beweist T2.

   Nutzer-Entscheide vom 22.09.2026 (AskUserQuestion), abweichend von der alten App:
   * Die Anzeige ist SCHREIBGESCHUETZT - Eingabe nur ueber Tasten und Tastatur.
     Deshalb gibt es sechs Tasten mehr als alt: sin, cos, tan, ln, log, π
     (alt waren sie nur tippbar). 32 statt 26.
   * KLASSISCHER ZIFFERNBLOCK: Ziffern 7-8-9 oben, 0 unten, Rechenzeichen in einer
     Spalte rechts; Funktionen und Speicher darueber. Vier Spalten.
   * Symboltasten tragen einen GESPROCHENEN NAMEN (× = „mal", √ = „Wurzel" …),
     sichtbar bleibt das Symbol. ⛔ Die Namen sind Vertrag: Tests und die
     Einbindung (T4) bedienen die Tasten ueber `getByRole("button", { name })`.
   Unveraendert wie alt: „=" rechnet und laesst das Ergebnis zum Weiterrechnen
   stehen; M+ addiert den AUSGEWERTETEN Ausdruck; das Notizfeld ist NICHT
   persistent (Entscheid 21.07.) - es lebt nur im Zustand dieser Komponente.
   Tastatur: Ziffern, + - * / ^ % ( ) , . fuegen ein, Enter oder = rechnet,
   Escape loescht alles, Ruecktaste nimmt das letzte Zeichen (eine Funktion wie
   „sin(" als Ganzes) zurueck.
   ============================================================================ */
import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { rechne, formatiere } from "@/kern/rechner";
import { RECHNER_TEXTE, TASTEN, TASTATUR, zurueck, rechnerOffen, setzeRechnerOffen } from "@/kern/rechnertasten";
import type { MerkHaken } from "./Melden";
import type { Aktion, Taste } from "@/kern/rechnertasten";

export function Rechner() {
  const [ausdruck, setAusdruck] = useState("");
  const [meldung, setMeldung] = useState<{ text: string; fehler: boolean }>({ text: "", fehler: false });
  const [speicher, setSpeicher] = useState(0);
  const [notiz, setNotiz] = useState("");
  const notizId = useId();

  const melde = (text: string, fehler = false) => setMeldung({ text, fehler });

  function fuehreAus(taste: Taste) {
    if (taste.einfuegen !== undefined) { setAusdruck((a) => a + taste.einfuegen); return; }
    switch (taste.aktion) {
      case "gleich": {
        const r = rechne(ausdruck);
        if (!r.ok) { melde(r.fehler, true); return; }
        const text = formatiere(r.wert);
        melde("= " + text);
        setAusdruck(text);                      // Weiterrechnen mit dem Ergebnis, wie alt
        return;
      }
      case "loeschen": setAusdruck(""); melde(""); return;
      case "zurueck": setAusdruck((a) => zurueck(a)); return;
      case "mc": setSpeicher(0); melde(RECHNER_TEXTE.speicherGeloescht); return;
      case "mr": setAusdruck((a) => a + formatiere(speicher)); return;
      case "mplus": {
        const r = rechne(ausdruck);
        if (!r.ok) { melde(r.fehler, true); return; }
        const neu = speicher + r.wert;
        setSpeicher(neu);
        melde(RECHNER_TEXTE.imSpeicher + formatiere(neu));
        break;
      }
      case undefined: break;   // Tasten mit `einfuegen` sind oben schon erledigt
    }
  }

  const aktion = (a: Aktion) => fuehreAus(TASTEN.find((x) => x.aktion === a)!);

  /* Am Rahmen, nicht an der Anzeige: die Tastatur wirkt auch, wenn der Fokus auf einer
     Taste steht. ⛔ Enter auf einer fokussierten Taste loest sonst ZUSAETZLICH deren
     Klick aus - deshalb preventDefault fuer jede Taste, die hier behandelt wird. */
  function beiTaste(e: KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    let behandelt = true;
    if (k >= "0" && k <= "9" && k.length === 1) setAusdruck((a) => a + k);
    else if (TASTATUR[k] !== undefined) setAusdruck((a) => a + TASTATUR[k]);
    else if (k === "Enter" || k === "=") aktion("gleich");
    else if (k === "Escape") aktion("loeschen");
    else if (k === "Backspace") aktion("zurueck");
    else behandelt = false;
    if (behandelt) e.preventDefault();
  }

  return (
    <section aria-label={RECHNER_TEXTE.titel} data-teil="rechner" className="flex flex-col gap-3">
      {/* oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- Tastatur-Weiterleitung: Tasten aus Eingabefeld und Tastenfeld landen hier, der Container selbst ist kein Bedienelement */}
      <div onKeyDown={beiTaste} className="flex flex-col gap-2">
        <Input
          readOnly
          value={ausdruck}
          aria-label={RECHNER_TEXTE.anzeige}
          autoComplete="off"
          spellCheck={false}
          className="text-right font-mono text-lg h-10"
        />
        <output aria-live="polite" data-teil="rechner-meldung"
          className={"block min-h-5 text-right text-sm " + (meldung.fehler ? "text-destructive" : "text-muted-foreground")}>
          {meldung.text}
        </output>
        <fieldset aria-label="Tasten" className="min-w-0 grid grid-cols-4 gap-1.5">
          {TASTEN.map((taste) => (
            <Button
              key={taste.zeichen}
              type="button"
              variant={taste.aktion === "gleich" ? "default" : "outline"}
              aria-label={taste.name === taste.zeichen ? undefined : taste.name}
              title={taste.name === taste.zeichen ? undefined : taste.name}
              onClick={() => fuehreAus(taste)}
              className="h-9 font-mono"
            >
              {taste.zeichen}
            </Button>
          ))}
        </fieldset>
      </div>
      <p className="text-xs text-muted-foreground">{RECHNER_TEXTE.hinweis}</p>
      <Field>
        <FieldLabel htmlFor={notizId}>{RECHNER_TEXTE.notizen}</FieldLabel>
        <Textarea id={notizId} rows={4} value={notiz} onChange={(e) => setNotiz(e.target.value)}
          placeholder={RECHNER_TEXTE.notizPlatzhalter} />
      </Field>
    </section>
  );
}

/** Der Rechner in seiner Klappe, wie er unter einer Rechenaufgabe steht (N26 T4).
    Startet ZU; mit `merk` gilt `panelOffen.rechner` aus dem Lernstand (wie alt),
    ohne `merk` merkt sich die Klappe ihren Zustand nur selbst.
    ⚠️ `forceMount`: der Inhalt bleibt auch zugeklappt gezeichnet - wie `<details>`
       alt. Sonst waeren Eingabe, Speicher und Notiz beim Zuklappen weg. Verborgen wird
       ueber das Attribut `hidden` (nicht nur per CSS), damit auch Vorleseprogramme und
       Tests den zugeklappten Inhalt nicht sehen - mit forceMount setzt Radix es nicht. Neu (leer)
       ist er erst bei der naechsten Frage: die Karte wird je Frage neu gemountet. */
export function RechnerKlappe({ merk }: { merk?: MerkHaken | undefined }) {
  const [eigen, setEigen] = useState(false);
  const offen = merk ? rechnerOffen(merk.stand) : eigen;
  const setze = (o: boolean) => (merk ? merk.aendere((s) => setzeRechnerOffen(s, o)) : setEigen(o));
  return (
    <Collapsible open={offen} onOpenChange={setze} data-teil="rechner-klappe" className="rounded-lg border">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <ChevronRight aria-hidden className={"size-4 transition-transform " + (offen ? "rotate-90" : "")} />
          {RECHNER_TEXTE.titel}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent forceMount hidden={!offen} className="px-3 pb-3">
        <Rechner />
      </CollapsibleContent>
    </Collapsible>
  );
}
