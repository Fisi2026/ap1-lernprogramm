/* ============================================================================
   DER RECHEN-GENERATOR ALS EIGENER SCHIRM (Bereich `gen`)

   Beim Ueben streut die Ziehung jede vierte Runde eine Zufallsaufgabe ein — die
   Art wuerfelt sie. Hier WAEHLT der Lerner: eine Art anklicken, rechnen,
   Loesungsweg lesen, naechste Aufgabe. Dieselben Generatoren aus `L.GENERATOREN`,
   dieselbe Pruefung mit `gradeLuecke`, dieselbe Karte.

   ⛔ GEBUCHT WIRD HIER ANDERS: nur die `GEN:`-Zeile und der Tageszaehler, kein
      Modul und kein Thema (`verbucheAufGeneratorschirm`, Herleitung dort). Wer
      sich die Art aussuchen darf, darf damit nicht seine Trefferquote faerben.
   ⚠️ `netzplan` fehlt in der Liste — genau wie in der alten App (`sGenerator`
      filtert ihn heraus): die Aufgabe braucht ein eigenes Zeichenwerk. Die alte
      App setzt daneben einen Knopf ins Netzplan-Training; der Bereich `netzplan`
      ist im Neubau noch nicht gebaut und sagt das selbst, deshalb steht hier
      kein Knopf, der ins Leere zeigt.
   ============================================================================ */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Generator } from "@/fragetypen/Generator";
import { arten, artName, aufgabeDerArt, alleRichtig, verbucheAufGeneratorschirm } from "@/kern/generator";
import type { Zufallsaufgabe } from "@/kern/generator";
import type { StandHaken } from "@/huelle/useLernstand";
import { pick } from "@/kern/zufall";
import { istText, listeVon } from "@/kern/pruefe";

export function RechenGenerator({ lernstand }: { lernstand: StandHaken }) {
  const moeglich = arten(lernstand.stand);
  const [aufgabe, setAufgabe] = useState<Zufallsaufgabe | null>(null);
  const [antwort, setAntwort] = useState<unknown>(undefined);
  const [geprueft, setGeprueft] = useState(false);

  function stelle(art: string) {
    const a = aufgabeDerArt(lernstand.stand, art);
    if (!a) return;
    setAufgabe(a);
    setAntwort(undefined);
    setGeprueft(false);
  }

  const eingaben = listeVon(antwort, istText) ?? [];
  const etwasDa = eingaben.some((x) => (x ?? "").trim() !== "");

  /* ⛔ HIER STAND EINE SPERRE `if (geprueft) return`, UND SIE IST RAUS — gemessen,
     nicht vermutet: die Sabotage, die sie entfernt, liess **null** Tests fallen.
     Kein Pfad erreicht sie, denn nach dem Pruefen ist der Pruefknopf weg und an
     seiner Stelle steht "Neue Aufgabe". **Was den zweiten Klick verhindert, ist
     der verschwundene Knopf** — und genau das ist gemessen (Sabotage: Knopf
     bleibt stehen -> Test faellt). Eine Sperre, die nichts sperrt, sieht nach
     Schutz aus und ist keiner.
     ⚠️ Anders als auf der Uebungskarte: dort trifft die Selbsteinschaetzung NACH
        dem Pruefen ein, dort sperrt `gebucht` also wirklich etwas. */
  function pruefe() {
    if (!aufgabe) return;
    setGeprueft(true);
    lernstand.aendere((s) => verbucheAufGeneratorschirm(s, aufgabe, alleRichtig(aufgabe, eingaben)));
  }

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4 px-6 pt-4 pb-6">
      {/* ⚠️ Als benannte Gruppe: die Schiene links traegt Knoepfe mit denselben
          Namen (z. B. "Netzplan"). Ohne diesen Anker kann weder ein Test noch
          ein Vorleseprogramm sagen, welcher Knopf eine AUFGABENART ist. */}
      <fieldset aria-label="Aufgabenarten" className="min-w-0 flex flex-wrap items-center gap-2">
        {moeglich.map((a) => (
          <Button key={a} variant="outline" size="sm" onClick={() => stelle(a)}>
            {artName(a)}
          </Button>
        ))}
        {moeglich.length > 1 && (
          <Button
            size="sm"
            onClick={() => { const art = pick(moeglich); if (art !== undefined) stelle(art); }}
          >
            Zufällig
          </Button>
        )}
      </fieldset>

      {!aufgabe ? (
        <Card className="grid place-items-center px-8 text-center text-sm text-muted-foreground">
          {moeglich.length
            ? "Wähle eine Aufgabenart — die Werte werden bei jedem Klick frisch gewürfelt."
            : "Zu deiner Auswahl (Prüfungsteil, Gebiete) passt keine Aufgabenart. Ändere sie in den Einstellungen."}
        </Card>
      ) : (
        <Card className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden py-0">
          <div className="flex items-center justify-between gap-4 border-b px-5 py-3 text-[0.8125rem] text-muted-foreground">
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-mono text-foreground">{aufgabe.id}</span>
              <span className="truncate">{aufgabe.thema}</span>
            </div>
            <Badge variant="secondary" className="font-normal">{aufgabe.modul}</Badge>
          </div>

          <div className="grid min-h-0 grid-cols-1 max-md:overflow-auto md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="grid md:min-h-0 grid-rows-[auto_auto_auto] border-b p-6 md:grid-rows-[auto_minmax(0,1fr)_auto] md:overflow-auto md:border-r md:border-b-0">
              <div className="mb-4 flex flex-wrap gap-1.5">
                <Badge className="font-normal">{artName(aufgabe.generatorArt)}</Badge>
              </div>
              <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed whitespace-pre-wrap">
                {aufgabe.frage}
              </p>
              {/* ⚠️ Dieselbe Zusage wie auf der Uebungskarte, und sie gilt hier
                  noch staerker: was hier gerechnet wird, faerbt keine Statistik. */}
              <div className="max-w-[56ch] border-t pt-3.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                Zählt auf deinen Tagesstand, aber nicht auf die Trefferquote eines Moduls —
                und nie ins Fehler-Deck.
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6 md:min-h-0 md:overflow-auto">
              <Generator frage={aufgabe} antwort={antwort} gesperrt={geprueft}
                         aufAntwort={(a) => setAntwort(a)} />
              {geprueft ? (
                <div>
                  <Button size="sm" onClick={() => stelle(aufgabe.generatorArt)}>
                    Neue Aufgabe →
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Button disabled={!etwasDa} onClick={pruefe}>Lösung prüfen</Button>
                  <Button variant="secondary" onClick={pruefe}>Aufgeben</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
