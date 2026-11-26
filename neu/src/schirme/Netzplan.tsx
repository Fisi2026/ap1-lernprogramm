/* ============================================================================
   DAS NETZPLAN-TRAINING (Bereich `netzplan`)

   Fuenf Felder je Vorgang: FAZ, FEZ, SAZ, SEZ, GP. Die Dauer steht vorgegeben in
   der Mitte, der freie Puffer wird nicht abgefragt (Nutzer-Entscheid 22.07.2026).

   ⛔ Gerechnet wird in logik.js, geordnet in `kern/netzplan.ts` — auch die
      Anordnung der Knoten, weil sie aus den Abhaengigkeiten folgt und nicht aus
      dem Geschmack. Hier wird nur gezeichnet.
   ⚠️ Der kritische Weg wird ERST NACH DEM PRUEFEN hervorgehoben: vorher waere er
      die halbe Loesung (GP = 0).
   ============================================================================ */
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "cn";
import {
  neueAufgabe, pruefe, istRichtig, verbucheNetzplan, anordnung, kanten, BESTEHENSGRENZE,
} from "@/kern/netzplan";
import type { NetzplanAufgabe, NetzplanVorgang, Eingaben, Feld } from "@/kern/netzplan";
import type { StandHaken } from "@/huelle/useLernstand";

/* Maszе des Knotens und der Luecken — hier, weil die Pfeile damit rechnen. */
const BREIT = 180;
const HOCH = 122;
const LUECKE_X = 56;
const LUECKE_Y = 28;

/* N25 P6b: das Feld ist shadcn `Input`; hier steht nur, was davon abweicht (klein, zentriert,
   Monoschrift). ⚠️ `md:text-…` mit, sonst gewinnt ab md das `md:text-sm` des Bausteins. */
const FELD =
  "h-7 rounded-[4px] px-1 py-0 text-center font-mono text-[0.75rem] md:text-[0.75rem] " +
  "focus-visible:ring-[2px] disabled:opacity-80";

export function Netzplan({ lernstand }: { lernstand: StandHaken }) {
  const [aufgabe, setAufgabe] = useState<NetzplanAufgabe>(() => neueAufgabe());
  const [eingaben, setEingaben] = useState<Eingaben>({});
  const [geprueft, setGeprueft] = useState(false);

  const daten = aufgabe.daten;
  const ergebnis = pruefe(daten, eingaben);
  const plaetze = useMemo(() => anordnung(daten), [daten]);
  const platzVon = new Map(plaetze.map((p) => [p.id, p]));
  const spalten = Math.max(...plaetze.map((p) => p.spalte)) + 1;
  const zeilen = Math.max(...plaetze.map((p) => p.zeile)) + 1;
  const breite = spalten * BREIT + (spalten - 1) * LUECKE_X;
  const hoehe = zeilen * HOCH + (zeilen - 1) * LUECKE_Y;

  const x = (sp: number) => sp * (BREIT + LUECKE_X);
  const y = (ze: number) => ze * (HOCH + LUECKE_Y);

  function setze(id: string, feld: Feld, wert: string) {
    setEingaben((e) => ({ ...e, [id]: { ...e[id], [feld]: wert } }));
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
              FAZ | Dauer | FEZ oben · SAZ | GP | SEZ unten · Zählung ab 0
            </span>
          </div>
          <p className="mt-2 max-w-[80ch] text-[0.9375rem] leading-relaxed">
            {aufgabe.szenario.text}
          </p>
        </Card>

        <Card className="overflow-x-auto px-5 py-5">
          <div className="relative" style={{ width: breite, height: hoehe }}>
            {/* Die Pfeile liegen HINTER den Knoten. */}
            <svg className="absolute inset-0" width={breite} height={hoehe} aria-hidden="true">
              {kanten(daten).map((k) => {
                const a = platzVon.get(k.von)!;
                const b = platzVon.get(k.nach)!;
                const x1 = x(a.spalte) + BREIT;
                const y1 = y(a.zeile) + HOCH / 2;
                const x2 = x(b.spalte);
                const y2 = y(b.zeile) + HOCH / 2;
                return (
                  <g key={k.von + "-" + k.nach}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                          className="stroke-muted-foreground/50" strokeWidth={1.5} />
                    <polygon points={`${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`}
                             className="fill-muted-foreground/50" />
                  </g>
                );
              })}
            </svg>

            {daten.vorgaenge.map((v) => {
              const p = platzVon.get(v.id)!;
              const kritisch = geprueft && daten.kritisch.indexOf(v.id) >= 0;
              return (
                <div
                  key={v.id}
                  data-kritisch={kritisch ? "ja" : "nein"}
                  className={cn("absolute rounded-lg border bg-card px-2 py-1.5",
                    kritisch && "border-destructive")}
                  style={{ left: x(p.spalte), top: y(p.zeile), width: BREIT, height: HOCH }}
                >
                  <div className="mb-1 text-center text-[0.75rem] font-medium text-muted-foreground">
                    {v.id}
                  </div>
                  <Reihe v={v} felder={["faz", "fez"]} mitte={String(v.dauer)}
                         eingaben={eingaben} geprueft={geprueft} setze={setze} />
                  <div className="my-1 truncate text-center text-[0.75rem]" title={v.name}>
                    {v.name}
                  </div>
                  <Reihe v={v} felder={["saz", "sez"]} mitteFeld="gp"
                         eingaben={eingaben} geprueft={geprueft} setze={setze} />
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[0.75rem] text-muted-foreground">
            Erst vorwärts (FAZ, FEZ), dann rückwärts (SEZ, SAZ), dann GP = SAZ − FAZ.
          </p>
        </Card>

        {!geprueft ? (
          <div>
            <Button onClick={() => {
              setGeprueft(true);
              lernstand.aendere((s) => verbucheNetzplan(s, ergebnis.quote));
            }}>
              Netzplan prüfen
            </Button>
          </div>
        ) : (
          <>
            <Card className={cn("px-5 py-4",
              ergebnis.quote >= BESTEHENSGRENZE ? "border-chart-1/40" : "border-destructive/50")}>
              <b className="text-[0.9375rem]">
                {ergebnis.richtig} von {ergebnis.gesamt} Feldern richtig ({ergebnis.quote} %).
              </b>
              <p className="mt-2 max-w-[80ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                Kritischer Pfad: <b className="text-foreground">{daten.kritisch.join(" → ")}</b>.
                Dort ist GP = 0 — jede Verzögerung verlängert das Projekt direkt. Die Projektdauer
                beträgt <b className="text-foreground">{daten.projektdauer} Tage</b> (größter FEZ).
                Vorgänge mit GP &gt; 0 dürfen sich um ihren Puffer verschieben, ohne das Projektende
                zu gefährden.
              </p>
            </Card>

            {/* N25 P6b: `<details open>` → `Collapsible defaultOpen` – offen wie vorher. */}
            <Collapsible defaultOpen className="group/weg rounded-lg border px-5 py-4" data-teil="loesungsweg">
              <CollapsibleTrigger className="inline-flex cursor-pointer items-center gap-1 rounded-sm text-[0.9375rem] font-medium focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
                <ChevronRight className="size-4 transition-transform group-data-[state=open]/weg:rotate-90" aria-hidden />
                Kompletter Lösungsweg
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 flex flex-col gap-0.5 font-mono text-[0.8125rem] leading-relaxed text-muted-foreground">
                {/* oxlint-disable-next-line react/no-array-index-key -- Loesungsweg, feste Zeilen */}
                {aufgabe.weg.map((z, i) => <span key={i}>{z}</span>)}
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

/** Eine Zeile des Knotens: zwei Eingabefelder mit etwas dazwischen —
    oben die vorgegebene Dauer, unten das dritte Eingabefeld (GP). */
function Reihe({
  v, felder, mitte, mitteFeld, eingaben, geprueft, setze,
}: {
  v: NetzplanVorgang;
  felder: [Feld, Feld];
  mitte?: string;
  mitteFeld?: Feld;
  eingaben: Eingaben;
  geprueft: boolean;
  setze: (id: string, feld: Feld, wert: string) => void;
}) {
  const kasten = (feld: Feld) => {
    const ok = istRichtig(v, feld, eingaben[v.id]?.[feld]);
    return (
      <div className="flex flex-col gap-0.5">
        <Input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          disabled={geprueft}
          value={eingaben[v.id]?.[feld] ?? ""}
          onChange={(e) => setze(v.id, feld, e.target.value)}
          placeholder={feld.toUpperCase()}
          aria-label={feld.toUpperCase() + " für Vorgang " + v.id}
          className={cn(FELD, geprueft && (ok ? "border-chart-1/60" : "border-destructive"))}
        />
        {geprueft && !ok && (
          <span className="text-center font-mono text-[0.6875rem] text-muted-foreground">
            {String(v[feld])}
          </span>
        )}
      </div>
    );
  };
  return (
    <div className="grid grid-cols-3 gap-1">
      {kasten(felder[0])}
      {mitteFeld ? (
        kasten(mitteFeld)
      ) : (
        <div className="grid h-7 place-items-center rounded-[4px] bg-muted font-mono text-[0.75rem]"
             title="Dauer des Vorgangs (vorgegeben)">
          {mitte}
        </div>
      )}
      {kasten(felder[1])}
    </div>
  );
}
