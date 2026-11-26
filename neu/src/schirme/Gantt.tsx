/* ============================================================================
   DAS GANTT-TRAINING (Bereich `gantt`)

   Eine gewuerfelte Planungsaufgabe: fuer jeden Vorgang den fruehesten Start- und
   Endtag eintragen. Nach dem Pruefen steht der BALKENPLAN da — vorher nicht, denn
   er ist die Loesung.

   ⛔ Gerechnet wird in logik.js (`L.genGantt` / `L.ganttBerechne`), geordnet in
      `kern/gantt.ts`. Hier wird nur gezeichnet und geklickt.
   ⚠️ Verbucht wird wie auf dem Generator-Schirm: `GEN:gantt` und der Tageszaehler,
      kein Modul. Richtig ab 80 % der Felder — die Regel steht im Kern.
   ============================================================================ */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "cn";
import {
  neueAufgabe, pruefe, istRichtig, verbucheGantt, loesungsweg, zelle, BESTEHENSGRENZE,
} from "@/kern/gantt";
import type { GanttAufgabe, Eingaben, Feld } from "@/kern/gantt";
import type { StandHaken } from "@/huelle/useLernstand";

/* N25 P6b: das Feld ist shadcn `Input`; hier steht nur, was davon abweicht (schmal,
   zentriert, Monoschrift). ⚠️ `md:text-…` mit, sonst gewinnt ab md das `md:text-sm` des Bausteins. */
const FELD =
  "h-8 w-16 rounded-md px-2 py-0 text-center font-mono text-[0.8125rem] md:text-[0.8125rem] " +
  "disabled:opacity-80";
/* Kopf und Zellen der Planungstabelle: die Abstaende von vorher, nicht die des Bausteins. */
const KOPF = "h-auto py-2 pr-4 pl-0 font-medium text-muted-foreground";
const ZELLE = "py-2 pr-4 pl-0";
const AUSLOESER =
  "inline-flex cursor-pointer items-center gap-1 rounded-sm text-[0.9375rem] font-medium " +
  "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

export function Gantt({ lernstand }: { lernstand: StandHaken }) {
  const [aufgabe, setAufgabe] = useState<GanttAufgabe>(() => neueAufgabe());
  const [eingaben, setEingaben] = useState<Eingaben>({});
  const [geprueft, setGeprueft] = useState(false);

  const daten = aufgabe.daten;
  const ergebnis = pruefe(daten, eingaben);

  function setze(id: string, feld: Feld, wert: string) {
    setEingaben((e) => ({ ...e, [id]: { ...e[id], [feld]: wert } }));
  }

  /* ⛔ KEINE SPERRE `if (geprueft) return` — zum dritten Mal in diesem Neubau
     gemessen: sie entfernen laesst **null** Tests fallen. Nach dem Pruefen ist
     der Knopf weg, und was den zweiten Klick verhindert, ist genau das. Der
     Zweig waere Zierde, und Zierde sieht aus wie Schutz.
     ⚠️ Gemessen wird stattdessen, dass der Durchgang nur EINMAL gebucht wird
        ("zaehlt denselben Durchgang nicht zweimal"). */
  function aufPruefen() {
    setGeprueft(true);
    lernstand.aendere((s) => verbucheGantt(s, ergebnis.quote));
  }

  function aufNeu() {
    setAufgabe(neueAufgabe());
    setEingaben({});
    setGeprueft(false);
  }

  return (
    <div className="min-h-0 overflow-auto px-6 pt-4 pb-6">
      <div className="flex flex-col gap-4">
        <Card className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="font-normal">{aufgabe.szenario.titel}</Badge>
            <span className="text-[0.8125rem] text-muted-foreground">
              Ende-Start-Beziehung · Tag 1 = Projektstart
            </span>
          </div>
          <p className="mt-2 max-w-[80ch] text-[0.9375rem] leading-relaxed">
            {aufgabe.szenario.text}
          </p>
        </Card>

        {/* N25 P6b: `Table` bringt den Rollbereich selbst mit (table-container). */}
        <Card className="px-5 py-4">
          <Table className="text-[0.8125rem]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={KOPF}>Vorgang</TableHead>
                <TableHead className={KOPF}>Dauer</TableHead>
                <TableHead className={KOPF}>Vorgänger</TableHead>
                <TableHead className={KOPF}>Start-Tag</TableHead>
                <TableHead className={KOPF}>End-Tag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {daten.vorgaenge.map((v) => (
                <TableRow key={v.id} className="hover:bg-transparent">
                  <TableCell className={ZELLE}>{v.id} – {v.name}</TableCell>
                  <TableCell className={cn(ZELLE, "tabular-nums")}>{v.dauer}</TableCell>
                  <TableCell className={ZELLE}>{v.vorgaenger.join(", ") || "–"}</TableCell>
                  {(["start", "ende"] as Feld[]).map((feld) => {
                    const ok = istRichtig(v, feld, eingaben[v.id]?.[feld]);
                    return (
                      <TableCell key={feld} className={ZELLE}>
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            disabled={geprueft}
                            value={eingaben[v.id]?.[feld] ?? ""}
                            onChange={(e) => setze(v.id, feld, e.target.value)}
                            aria-label={`${feld === "start" ? "Start-Tag" : "End-Tag"} ${v.id}`}
                            className={cn(FELD, geprueft && (ok ? "border-chart-1/60" : "border-destructive"))}
                          />
                          {geprueft && !ok && (
                            <span className="font-mono text-[0.75rem] text-muted-foreground">
                              richtig: {feld === "start" ? v.start : v.ende}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {!geprueft ? (
          <div>
            <Button onClick={aufPruefen}>Planung prüfen</Button>
          </div>
        ) : (
          <>
            <Card className={cn("px-5 py-4",
              ergebnis.quote >= BESTEHENSGRENZE ? "border-chart-1/40" : "border-destructive/50")}>
              <b className="text-[0.9375rem]">
                {ergebnis.richtig} von {ergebnis.gesamt} Feldern richtig ({ergebnis.quote} %).
              </b>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                Projektdauer: <b className="text-foreground">{daten.projektdauer} Tage</b>. Kritischer
                Pfad (Puffer = 0): <b className="text-foreground">{daten.kritisch.join(" → ")}</b>.
                {/* ⚠️ Der Puffer-Satz kommt nur, wenn es ueberhaupt einen Puffer gibt —
                    sonst stuende dort eine Aussage ueber nichts. */}
                {daten.vorgaenge.some((v) => v.puffer > 0) && (() => {
                  const p = daten.vorgaenge.find((v) => v.puffer > 0)!;
                  return (
                    <> Vorgang {p.id} hat {p.puffer} Tag(e) Puffer (spätester Start Tag {p.spStart}),
                      ohne das Projektende zu verschieben.</>
                  );
                })()}
              </p>
            </Card>

            <Balkenplan aufgabe={aufgabe} />

            {/* N25 P6b: `<details>` → `Collapsible`, zu wie vorher. ⚠️ Zugeklappt steht der
                Weg NICHT im DOM (anders als `<details>`). */}
            <Collapsible className="group/weg rounded-lg border px-5 py-4" data-teil="loesungsweg">
              <CollapsibleTrigger className={AUSLOESER}>
                <ChevronRight className="size-4 transition-transform group-data-[state=open]/weg:rotate-90" aria-hidden />
                Kompletter Lösungsweg
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 flex flex-col gap-1 font-mono text-[0.8125rem] leading-relaxed text-muted-foreground">
                {/* oxlint-disable-next-line react/no-array-index-key -- Loesungsweg, feste Zeilen */}
                {loesungsweg(daten).map((z, i) => <span key={i}>{z}</span>)}
              </CollapsibleContent>
            </Collapsible>

            <div>
              <Button onClick={aufNeu}>Neue Aufgabe →</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Der Balkenplan: eine Spalte je Tag, eine Zeile je Vorgang.
    ⛔ Erst NACH dem Pruefen — er zeigt die Loesung. */
function Balkenplan({ aufgabe }: { aufgabe: GanttAufgabe }) {
  const daten = aufgabe.daten;
  const tage = Array.from({ length: daten.projektdauer }, (_, i) => i + 1);
  return (
    <Card className="px-5 py-4">
      <b className="mb-2 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
        Balkenplan
      </b>
      {/* N25 P6b: `Table` – ohne Zeilenlinien und Hover, der Plan ist ein Raster, keine Liste.
          ⚠️ KEIN `w-auto`: gemessen am 21.09. war der ausgelieferte Balkenplan 1136 px breit
          (volle Kartenbreite), mit `w-auto` nur 441 – die Tage ruecken dann zusammen. Die
          Vorgabe `w-full` des Bausteins trifft den ausgelieferten Stand. */}
      <Table className="text-[0.75rem]" aria-label="Balkenplan">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="h-auto py-1 pr-3 pl-0 font-medium text-muted-foreground">Vorgang</TableHead>
            {tage.map((t) => (
              <TableHead key={t} className="h-auto w-6 px-0 py-1 text-center font-medium text-muted-foreground tabular-nums">{t}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {daten.vorgaenge.map((v) => (
            <TableRow key={v.id} className="border-0 hover:bg-transparent">
              <TableCell className="py-0.5 pr-3 pl-0">{v.id} · {v.name}</TableCell>
              {tage.map((t) => {
                const art = zelle(v, t);
                return (
                  <TableCell key={t} className="p-[2px]">
                    <div
                      data-zelle={art}
                      className={cn("h-4 rounded-[2px]",
                        art === "kritisch" && "bg-destructive",
                        art === "balken" && "bg-chart-1",
                        art === "puffer" && "bg-muted-foreground/30")}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-2 text-[0.75rem] text-muted-foreground">
        Rot = kritischer Weg (Puffer 0) · Blau = Balken mit Puffer · Grau = der Puffer selbst.
      </p>
    </Card>
  );
}
