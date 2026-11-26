/* Der Statistik-Schirm: wie weit bin ich, je Pruefungsgebiet?

   ⛔ GERECHNET WIRD IN logik.js (`L.bereitschaft`), nicht hier. Die Gewichtung
      nach IHK-Relevanz, die Ampelgrenzen und der Ausschluss von M09 sind
      fachliche Entscheidungen und stehen dort — ein zweiter Rechenweg hier waere
      eine zweite Wahrheit.

   ⛔ KEINE ZAHL OHNE GRUNDLAGE. Ein Gebiet ohne beantwortete Frage taucht in
      `L.bereitschaft` gar nicht auf; es steht dann als "noch nichts" da und
      bekommt KEINEN Balken auf 0 %. Ein Balken auf 0 saehe aus wie ein Ergebnis. */
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "cn";
import { GEBIETE, GEBIET_KURZ } from "@/daten/typen";
import { bereitschaft, kennzahlen } from "@/kern/kennzahlen";
import type { Lernstand } from "@/kern/stand";

/** Die Ampel aus logik.js in eine Farbe uebersetzt — die Namen kommen von dort. */
const AMPELFARBE: Record<string, string> = {
  gruen: "text-chart-1",
  gelb: "text-chart-4",
  rot: "text-destructive",
};

const KOPF = "h-auto px-0 pb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase";

export function Statistik({ stand }: { stand: Lernstand }) {
  const b = bereitschaft(stand);
  const k = kennzahlen(stand);
  const nachCode = new Map(b.gebiete.map((g) => [g.code, g]));
  const faecher = GEBIETE.filter((g) => g.teil !== "M09");

  return (
    /* Komplettpruefung 09.10.2026 (ND1, WCAG 2.1.1): der Bereich scrollt, enthaelt aber nichts Fokussierbares –
       ohne tabIndex kaeme die Tastatur nicht hinein (axe `scrollable-region-focusable`, 390 px). */
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollbarer Bereich muss per Tastatur erreichbar sein (axe scrollable-region-focusable)
    <section className="grid min-h-0 auto-rows-max gap-5 overflow-auto p-6" tabIndex={0} aria-label="Statistik">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-4">
        <Kachel titel="Bereitschaft gesamt"
                wert={b.gesamt.score === null ? "—" : `${b.gesamt.score} %`}
                farbe={b.gesamt.score === null ? undefined : AMPELFARBE[b.gesamt.ampel]}
                fuss={b.gesamt.antworten > 0
                  ? `${b.gesamt.antworten} Antworten in ${b.gesamt.themen} Themen`
                  : "noch keine Antwort"} />
        <Kachel titel="Heute" wert={`${k.heute} / ${k.tagesziel}`}
                fuss={k.heute >= k.tagesziel && k.tagesziel > 0 ? "Tagesziel erreicht" : "Tagesziel"} />
        <Kachel titel="Fehler-Deck" wert={String(k.imDeck)}
                farbe={k.faellig > 0 ? "text-destructive" : undefined}
                fuss={k.faellig > 0 ? `${k.faellig} jetzt fällig` : "nichts fällig"} />
        <Kachel titel="Beantwortet" wert={String(k.beantwortet)}
                fuss={k.quote === null ? "noch keine Quote" : `${k.quote} % richtig`} />
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-[0.9375rem] font-semibold">Je Prüfungsgebiet</h2>
        {/* N25 P6b: die Gebietsliste ist eine `Table` (Nutzer-Entscheid 21.09.) – vier Spalten mit
            Kopf, damit ein Screenreader Wert und Gebiet zusammen vorliest. Die Texte der Zellen
            ("noch nichts geübt", "… % · n") sind Vertrag (statistik.jsdom). */}
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={cn(KOPF, "w-12")}>Code</TableHead>
              <TableHead className={cn(KOPF, "w-[14rem]")}>Gebiet</TableHead>
              <TableHead className={KOPF}>Bereitschaft</TableHead>
              <TableHead className={cn(KOPF, "w-36 text-right")}>Quote · Antworten</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {faecher.map((f) => {
            const g = nachCode.get(f.id);
            return (
              <TableRow key={f.id} className="border-0 hover:bg-transparent">
                <TableCell className="px-0 py-1.5 font-mono text-[0.8125rem] text-muted-foreground">{f.id}</TableCell>
                <TableCell className="truncate py-1.5 pr-4 pl-0 text-[0.875rem]" title={f.name}>{GEBIET_KURZ[f.id]}</TableCell>
                <TableCell className="py-1.5 pr-4 pl-0">
                {g ? (
                  <Progress value={g.score ?? 0} className="h-2" />
                ) : (
                  /* ⛔ Kein Balken auf 0 — das saehe aus wie ein Ergebnis. */
                  <span className="text-[0.8125rem] text-muted-foreground">noch nichts geübt</span>
                )}
                </TableCell>
                <TableCell className={cn("px-0 py-1.5 text-right text-[0.875rem] tabular-nums",
                                    g ? AMPELFARBE[g.ampel] : "text-muted-foreground")}>
                  {g ? `${g.score} % · ${g.antworten}` : "—"}
                </TableCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Die Bereitschaft wird je Feinthema nach IHK-Relevanz gewichtet (logik.js). Die
          Klausurvorbereitung (M09) zählt bewusst nicht mit. Gebiete ohne Antwort bleiben leer,
          statt als 0 % zu erscheinen.
        </p>
      </Card>
    </section>
  );
}

function Kachel({ titel, wert, fuss, farbe }: {
  titel: string; wert: string; fuss: string; farbe?: string | undefined;
}) {
  return (
    <Card className="gap-1 p-4">
      <span className="text-xs tracking-wider text-muted-foreground uppercase">{titel}</span>
      <b className={cn("text-2xl font-semibold tracking-tight tabular-nums", farbe)}>{wert}</b>
      <span className="text-xs text-muted-foreground">{fuss}</span>
    </Card>
  );
}
