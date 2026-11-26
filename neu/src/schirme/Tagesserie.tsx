/* Der Schirm „Tagesserie" (`serie`) — Etappe N21.

   Vorbild `sSerie` (app_pages2.js): fünf Fragen aus dem schwächsten Gebiet,
   gebucht wie beim normalen Üben, weiter erst nach der Antwort; am Ende
   „x von 5 richtig" und `serieDone` auf heute.
   ⛔ Der Lauf liegt in App.tsx, nicht hier: wer mitten in der Serie den Bereich
      wechselt, kommt an dieselbe Stelle zurück (alte App: `serieAktiv`). Eine
      abgeschlossene Serie wird beim nächsten Betreten neu gezogen.
   ⛔ Gebiet und Auswahl stehen ab dem Start fest — die alte App rechnete nach
      jeder Antwort neu (gemessen, Kopf von kern/tagesserie.ts). */
import type { Dispatch, SetStateAction } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { frageMitId } from "@/daten/laden";
import type { StandHaken } from "@/huelle/useLernstand";
import { markiereSerieErledigt, serieHeuteErledigt } from "@/kern/tagesserie";
import { Karteikarte } from "./Karteikarte";
import { neuerLauf, type SerienLauf } from "./serienlauf";
import { gebietName as gebietNameVon } from "@/kern/lernen";

export type { SerienLauf } from "./serienlauf";


const JETZT_STANDARD = () => Date.now();

export function Tagesserie({
  lernstand, lauf, setzeLauf, zumUeben, jetzt = JETZT_STANDARD,
}: {
  lernstand: StandHaken;
  lauf: SerienLauf;
  setzeLauf: Dispatch<SetStateAction<SerienLauf | null>>;
  zumUeben: () => void;
  jetzt?: () => number;
}) {
  const gebietName = gebietNameVon(lauf.gebiet);
  const n = lauf.ids.length;

  if (n === 0) {
    return (
      <div className="grid content-start p-6">
        <Card className="gap-2 p-5">
          <h2 className="text-[0.9375rem] font-semibold">{gebietName}</h2>
          <p className="text-[0.8125rem] text-muted-foreground">Keine Fragen im Lernfeld verfügbar.</p>
        </Card>
      </div>
    );
  }

  if (lauf.fertig) {
    return (
      <div className="grid content-start gap-5 p-6">
        <Card className="gap-3 p-5" data-teil="serie-ergebnis">
          <h2 className="text-[0.9375rem] font-semibold">Serie abgeschlossen</h2>
          <p className="text-[1.05rem]">
            <b className="tabular-nums">{lauf.richtig} von {n}</b> richtig im Gebiet {gebietName}.
          </p>
          <p className="text-[0.8125rem] text-muted-foreground">
            {lauf.richtig >= 4
              ? "Stark – dieses Lernfeld holt auf."
              : "Dranbleiben – genau dafür ist die Serie da. Morgen gibt es einen neuen Durchgang."}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setzeLauf(neuerLauf(lernstand.stand))}>Noch eine Serie</Button>
            <Button variant="secondary" onClick={zumUeben}>Zum Üben</Button>
          </div>
        </Card>
      </div>
    );
  }

  const id = lauf.ids[lauf.pos];
  const letzte = lauf.pos + 1 >= n;
  const heuteSchon = serieHeuteErledigt(lernstand.stand, jetzt());

  function weiter() {
    if (letzte) {
      lernstand.aendere((s) => markiereSerieErledigt(s, jetzt()));
      setzeLauf((l) => (l ? { ...l, fertig: true } : l));
    } else {
      setzeLauf((l) => (l ? { ...l, pos: l.pos + 1, beantwortet: false } : l));
    }
  }

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 px-6 pt-4 pb-6">
      <div data-teil="serie-kopf">
        <div className="text-[0.75rem] uppercase tracking-wide text-muted-foreground">
          5er-Serie · schwächstes Lernfeld
        </div>
        <h2 className="text-[0.9375rem] font-semibold">{gebietName}</h2>
        <p className="text-[0.8125rem] text-muted-foreground">
          Beim Start aus deinen gespeicherten Ergebnissen zusammengestellt.
          {heuteSchon ? " Heute schon absolviert." : ""}
        </p>
      </div>
      <Karteikarte key={`${id}-${lauf.pos}`} frage={frageMitId(id!)!} /* die Serie zieht nur aus FRAGEN */ nummer={lauf.pos + 1}
                   buche={lernstand.buche} merk={lernstand} abruf={lernstand.stand.abrufAn} ueberspringen={weiter}
                   /* Einmal je Karte: die Sperre dafür sitzt in der Karteikarte (`gebucht`).
                      Eine zweite hier war unerreichbar — die Sabotage blieb grün. */
                   aufErgebnis={(_f, korrekt) => setzeLauf((l) => (l
                     ? { ...l, beantwortet: true, richtig: l.richtig + (korrekt ? 1 : 0) }
                     : l))} />
      <div className="flex items-center justify-between gap-3 text-[0.8125rem] text-muted-foreground">
        <span className="tabular-nums">Frage {lauf.pos + 1} von {n} · bisher {lauf.richtig} richtig</span>
        <Button disabled={!lauf.beantwortet} onClick={weiter}>
          {letzte ? "Serie abschließen" : "Nächste Frage"}
        </Button>
      </div>
    </div>
  );
}
