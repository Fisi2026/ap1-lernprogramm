/* ============================================================================
   DER SPICKZETTEL — NEUN ABSCHNITTE, EINE SUCHE

   ⛔ Gerechnet und geordnet wird in `kern/spickzettel.ts`; hier wird nur
      gezeichnet. Die Regeln der alten App (`sSpickzettel`) bleiben dieselben:
      **mit Suchtext sind alle Treffer offen, ohne Suchtext nur der erste**, und
      wer nichts findet, bekommt einen Satz statt einer leeren Seite.
   ⚠️ Seit P6 ein `Accordion` statt `<details>`: die Tastatur kann es weiterhin von
      Haus aus, aber den Klappzustand haelt jetzt dieser Schirm (`offen`), nicht der
      Browser. ⛔ Damit haengt der Inhalt eines zugeklappten Abschnitts AUS dem DOM.
   ============================================================================ */
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchIcon } from "lucide-react";
import { sektionen, gefiltert, bloecke, type Block, type Teil } from "@/kern/spickzettel";

function Fliesstext({ teile }: { teile: Teil[] }) {
  return (
    <>
      {teile.map((t, i) =>
        // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
        t.art === "fett" ? <b key={i} className="font-semibold text-foreground">{t.text}</b>
        // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
        : t.art === "kursiv" ? <i key={i}>{t.text}</i>
        : t.art === "code" ? (
          // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
          <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8125rem]">{t.text}</code>
        ) : (
          // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
          <span key={i}>{t.text}</span>
        ),
      )}
    </>
  );
}

function Bloecke({ liste }: { liste: Block[] }) {
  return (
    <div className="grid gap-2.5 text-[0.875rem] leading-relaxed text-muted-foreground">
      {liste.map((b, i) => {
        if (b.art === "ueberschrift")
          // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
          return <h3 key={i} className="pt-1 font-semibold text-foreground"><Fliesstext teile={b.teile} /></h3>;
        if (b.art === "zitat")
          return (
            // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
            <blockquote key={i} className="border-l-2 border-primary/60 bg-primary/5 px-3 py-2 text-foreground">
              <Fliesstext teile={b.teile} />
            </blockquote>
          );
        if (b.art === "liste") {
          const Punkte = b.geordnet ? "ol" : "ul";
          return (
            // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
            <Punkte key={i} className={b.geordnet ? "ml-5 list-decimal space-y-1" : "ml-5 list-disc space-y-1"}>
              {/* oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert */}
              {b.punkte.map((p, j) => <li key={j}><Fliesstext teile={p} /></li>)}
            </Punkte>
          );
        }
        if (b.art === "tabelle")
          return (
            /* ⚠️ Den eigenen Rollbereich bringt `Table` selbst mit (table-container),
               und er ist weiter noetig: eine breite Tabelle darf die Seite nicht schieben. */
            // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
            <Table key={i} className="border-collapse text-[0.8125rem]">
              <TableHeader>
                <TableRow>
                  {b.kopf.map((z, j) => (
                    // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
                    <TableHead key={j} className="h-auto px-2 py-1.5 font-semibold text-foreground">
                      <Fliesstext teile={z} />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {b.zeilen.map((r, j) => (
                  // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
                  <TableRow key={j}>
                    {r.map((z, k) => (
                      // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
                      <TableCell key={k} className="px-2 py-1.5 align-top">
                        <Fliesstext teile={z} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );
        // oxlint-disable-next-line react/no-array-index-key -- fester Spickzettel-Text, nie umsortiert
        return <p key={i}><Fliesstext teile={b.teile} /></p>;
      })}
    </div>
  );
}

export function Spickzettel() {
  const alle = useMemo(() => sektionen(), []);
  const [suche, setSuche] = useState("");
  const treffer = useMemo(() => gefiltert(alle, suche), [alle, suche]);
  /* Die Regel der alten App: mit Suchtext alle Treffer offen, ohne nur der erste.
     ⛔ Nicht im Render erzwingen, sonst liesse sich waehrend einer Suche keiner
     mehr zuklappen - das ging mit `<details>`. Gesetzt wird beim Tippen. */
  const [offen, setOffen] = useState<string[]>(() => (alle.length ? [alle[0]!.titel] : []));

  function sucheAendern(wert: string) {
    setSuche(wert);
    const t = gefiltert(alle, wert);
    setOffen(wert.trim() !== "" ? t.map((s) => s.titel) : t.length ? [t[0]!.titel] : []);
  }

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 px-6 pt-3.5 pb-6">
      <InputGroup className="h-9 bg-card">
        <InputGroupAddon><SearchIcon aria-hidden="true" /></InputGroupAddon>
        <InputGroupInput
          type="search"
          value={suche}
          onChange={(e) => sucheAendern(e.target.value)}
          aria-label="Im Spickzettel suchen"
          placeholder="Suchen — Formel, Begriff, Modul …"
        />
      </InputGroup>

      <div className="min-h-0 overflow-y-auto">
        {treffer.length === 0 ? (
          <Card className="grid place-items-center px-8 py-10 text-center text-sm text-muted-foreground">
            Dazu steht nichts im Spickzettel.
          </Card>
        ) : (
          <Accordion type="multiple" className="grid gap-2.5"
                     value={offen} onValueChange={setOffen}>
            {treffer.map((s) => (
              /* `key` ist der TITEL, nicht der Index - Identitaet statt Platz.
                 ⚠️ GEMESSEN 15.09.2026, damit hier keine Behauptung steht: eine
                 Sabotage auf `key={i}` bleibt GRUEN, und das ist richtig so. Der
                 Klappzustand lebt im DOM, und die Suche wirft jeden Abschnitt
                 heraus, der nicht trifft - danach ist er ohnehin weg, mit jedem
                 Schluessel. **Das ist eine Ordnungsfrage, keine Zusicherung**; wer
                 den Zustand ueber die Suche retten will, muss ihn in den Stand
                 nehmen, und das ist ein eigener Entscheid. */
              <AccordionItem key={s.titel} value={s.titel}
                             className="rounded-lg border bg-card px-4 py-1">
                <AccordionTrigger className="font-semibold text-foreground">
                  <span>{s.titel}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <Bloecke liste={bloecke(s.koerper)} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
