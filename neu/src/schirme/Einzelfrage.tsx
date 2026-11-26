/* Die Einzelfrage (`frage`, Adresse `#frage=ID`) — Etappe N22.

   Vorbild `sEinzelfrage` (app_seiten.js, G4.2 #29): genau eine Frage, zum
   Nachschlagen und Teilen.
   ⛔ BEWUSST OHNE BUCHUNG — wie in der alten App: ein Link, der mehrfach geöffnet
      wird, soll die Auswertung nicht verfälschen. Die Karte bekommt kein `buche`.
   ⚠️ Stern und Melden bleiben: gerade beim Prüfen einer Meldung will man die
      Frage markieren oder nachmelden können (Nutzer-Entscheid 17.09.2026:
      Kennungen in Meldungsliste, Markiert und Fehler-Deck öffnen diesen Schirm). */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { frageMitId } from "@/daten/laden";
import type { Bereich } from "@/kern/route";
import type { StandHaken } from "@/huelle/useLernstand";
import { modulName } from "@/kern/markiert";
import { Karteikarte } from "./Karteikarte";


export function Einzelfrage({
  id, lernstand, geheZu,
}: {
  id: string | null;
  lernstand: StandHaken;
  geheZu: (b: Bereich) => void;
}) {
  const f = id ? frageMitId(id) : undefined;
  if (!f) {
    return (
      <div className="grid min-h-0 auto-rows-max gap-4 overflow-auto p-6">
        <Card className="gap-2 p-5">
          <h2 className="text-[0.9375rem] font-semibold">Einzelne Frage</h2>
          <p className="text-[0.8125rem] text-muted-foreground">
            Diese Frage gibt es nicht (mehr).{id ? ` (${id})` : ""}
          </p>
        </Card>
        <Button className="justify-self-start" onClick={() => geheZu("start")}>Zur Startseite</Button>
      </div>
    );
  }
  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 px-6 pt-4 pb-6">
      <div data-teil="einzelfrage-kopf">
        <h2 className="text-[0.9375rem] font-semibold">Einzelne Frage</h2>
        <p className="text-[0.8125rem] text-muted-foreground">
          {modulName(f.modul)} · {f.thema} · {f.id}
        </p>
      </div>
      <Karteikarte key={f.id} frage={f} nummer={1} merk={lernstand} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[0.8125rem] text-muted-foreground">
          Direkt aufgerufene Fragen zählen nicht für Statistik und Fehler-Deck.
        </span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => geheZu("start")}>Zur Startseite</Button>
          <Button onClick={() => geheZu("ueben")}>Normal weiterüben</Button>
        </div>
      </div>
    </div>
  );
}
