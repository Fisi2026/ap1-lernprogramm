/* Die Karte fuer eine Rechenaufgabe mit gewuerfelten Werten.
   N38 Q2 (30.09.2026): aus Ueben.tsx in eine eigene Datei; die Kopfleiste teilt sie seitdem mit
   der Karteikarte (`Kartenkopf`). Inhalt sonst unveraendert.

   ⛔ Bewusst eine EIGENE Karte, keine Sonderfaelle in `Karteikarte`: eine
      Zufallsaufgabe hat keine Kennung im Bestand, keine Rueckseite, keinen
      Eintrag in `TYP` und kein Fehler-Deck. Sie in die Karteikarte zu pressen
      haette dort fuenf `if`s hinterlassen, die nur fuer sie gelten. */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MerkHaken } from "./Melden";
import { alleRichtig } from "@/kern/generator";
import type { Zufallsaufgabe } from "@/kern/generator";
import { Generator } from "@/fragetypen/Generator";
import { RechnerKlappe } from "./Rechner";
import { Kartenkopf } from "./Kartenkopf";
import { istText, listeVon } from "@/kern/pruefe";

export function Zufallskarte({
  aufgabe, nummer, buche, merk, kannIchSchon,
}: {
  aufgabe: Zufallsaufgabe;
  nummer: number;
  buche?: ((richtig: boolean) => void) | undefined;
  /** N26 T4: fuer die Klappe des Rechners (`panelOffen.rechner`). */
  merk?: MerkHaken | undefined;
  /** „Kann ich schon“ (Nutzer-Entscheid 25.11.2026, BUILD_LOG 278): zählt als richtig und blendet die ART
      aus (kern/generator.ts `ueberspringeZufall`), dann geht es weiter. Nur Üben und Klausurvorbereitung
      reichen es durch; fehlt es, gibt es keinen Knopf. */
  kannIchSchon?: (() => void) | undefined;
}) {
  const [antwort, setAntwort] = useState<unknown>(undefined);
  const [geprueft, setGeprueft] = useState(false);

  const eingaben = listeVon(antwort, istText) ?? [];
  const etwasDa = eingaben.length > 0 && eingaben.some((x) => (x ?? "").trim() !== "");

  function pruefe() {
    setGeprueft(true);
    buche?.(alleRichtig(aufgabe, eingaben));
  }

  return (
    <Card className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden py-0">
      <Kartenkopf kennung={aufgabe.id} thema={aufgabe.thema} schwierigkeit={aufgabe.schwierigkeit} nummer={nummer} />

      <div className="grid min-h-0 grid-cols-1 max-md:overflow-auto md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid md:min-h-0 grid-rows-[auto_auto_auto] border-b p-6 md:grid-rows-[auto_minmax(0,1fr)_auto] md:overflow-auto md:border-r md:border-b-0">
          <div className="mb-4 flex flex-wrap gap-1.5">
            <Badge className="font-normal">Zufallsaufgabe</Badge>
            <Badge variant="secondary" className="font-normal">{aufgabe.modul}</Badge>
          </div>
          <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed whitespace-pre-wrap">
            {aufgabe.frage}
          </p>
          <div className="max-w-[56ch] border-t pt-3.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {/* ⚠️ Keine Rueckseite wie bei einer Pool-Frage: bei gewuerfelten Zahlen
                ist der Loesungsweg die Erklaerung, und der steht rechts. */}
            Diese Aufgabe wird bei jedem Ziehen neu gewürfelt — sie kommt so kein zweites Mal,
            und sie landet nie im Fehler-Deck.
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6 md:min-h-0 md:overflow-auto">
          <Generator frage={aufgabe} antwort={antwort} gesperrt={geprueft}
                     aufAntwort={(a) => setAntwort(a)} />
          {!geprueft && (
            <div className="flex flex-wrap items-center gap-2">
              <Button disabled={!etwasDa} onClick={pruefe}>Lösung prüfen</Button>
              <Button variant="secondary" onClick={pruefe}>Aufgeben</Button>
              {kannIchSchon && (
                <Button variant="outline" onClick={kannIchSchon}
                        title="Zählt als richtig; diese Art Rechenaufgabe kommt nicht mehr – zurückholen unter „Markierte Fragen“">
                  Kann ich schon
                </Button>
              )}
            </div>
          )}
          <RechnerKlappe merk={merk} />
        </div>
      </div>
    </Card>
  );
}
