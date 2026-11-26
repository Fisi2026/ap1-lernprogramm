/* Der Fehler-Deck-Schirm: was liegt an, und wann kommt es wieder?

   ⚠️ Eine LISTE, kein zweiter Uebungsschirm. Wiedervorgelegt wird beim Ueben —
      dort kommt bei jeder fuenften Frage eine faellige aus dem Deck (N6b). Einen
      eigenen Uebungsweg daneben zu bauen hiesse, zwei Wege zu pflegen, die
      auseinanderlaufen koennen. Hier steht, WAS ansteht; geuebt wird drueben. */
import { Kennung } from "./Kennung";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { cn } from "cn";
import { frageMitId } from "@/daten/laden";
import { Button } from "@/components/ui/button";
import { deckStand, wannWieder, raeumeVerwaiste } from "@/kern/fehlerdeck";
import type { DeckEintrag } from "@/kern/fehlerdeck";
import type { StandHaken } from "@/huelle/useLernstand";


export function Fehlerdeck({ lernstand, oeffneFrage }: { lernstand: StandHaken; oeffneFrage?: (id: string) => void }) {
  const { stand } = lernstand;
  const d = deckStand(stand, (id) => frageMitId(id));
  const gesamt = d.faellig.length + d.spaeter.length + d.verwaist.length;

  if (gesamt === 0) {
    return (
      <div className="grid place-items-center p-10">
        <Empty className="max-w-md">
          <EmptyHeader>
            <EmptyTitle>Das Fehler-Deck ist leer.</EmptyTitle>
            <EmptyDescription>
              Falsch beantwortete Fragen kommen hier hinein und beim Üben von selbst wieder —
              jede fünfte Frage ist eine fällige aus dem Deck.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 auto-rows-max gap-5 overflow-auto p-6">
      <Abschnitt titel="Jetzt fällig" eintraege={d.faellig} raus={d.raus} betont
                 oeffne={oeffneFrage} leerText="Nichts fällig — alles liegt in der Zukunft." />
      <Abschnitt titel="Kommt später" eintraege={d.spaeter} raus={d.raus}
                 oeffne={oeffneFrage} leerText="Nichts liegt auf Wiedervorlage." />
      {d.verwaist.length > 0 && (
        /* ⛔ Nicht verschweigen: eine Kennung ohne Frage im Bestand. Die alte App
           raeumt so etwas in `sanitizeState` auf; bis das hier passiert, soll man
           es sehen statt es stillschweigend zu verlieren. */
        <Card className="gap-3 border-destructive/50 p-5">
          <h2 className="text-[0.9375rem] font-semibold text-destructive">
            Ohne Frage im Bestand ({d.verwaist.length})
          </h2>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            Zu diesen Kennungen gibt es keine Frage mehr — vermutlich aus dem Bestand entfernt.
            Sie werden beim Üben übersprungen.
          </p>
          <div className="flex flex-wrap gap-1.5 font-mono text-[0.8125rem]">
            {d.verwaist.map((e) => <Badge key={e.id} variant="outline">{e.id}</Badge>)}
          </div>
          {/* ⛔ Loeschen ist der einzige Schritt, der Lernstand vernichtet — er
              passiert auf Klick, nicht nebenbei beim Laden (anders als in der
              alten App, die das still in `sanitizeState` tut). */}
          <Button variant="secondary" size="sm" className="self-start"
                  onClick={() => lernstand.aendere((s) => raeumeVerwaiste(s, (id) => frageMitId(id)))}>
            {d.verwaist.length === 1 ? "Diese Kennung entfernen" : `Diese ${d.verwaist.length} Kennungen entfernen`}
          </Button>
        </Card>
      )}
    </div>
  );
}

function Abschnitt({
  titel, eintraege, raus, leerText, betont, oeffne,
}: {
  oeffne?: ((id: string) => void) | undefined;
  titel: string;
  eintraege: DeckEintrag[];
  raus: number;
  leerText: string;
  betont?: boolean;
}) {
  return (
    <Card className="gap-3 p-5">
      <h2 className="text-[0.9375rem] font-semibold">
        {titel}{" "}
        <span className={cn("tabular-nums", betont && eintraege.length > 0 && "text-destructive")}>
          ({eintraege.length})
        </span>
      </h2>
      {eintraege.length === 0 ? (
        <Empty className="border p-4">
          <EmptyHeader>
            <EmptyDescription>{leerText}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ItemGroup className="gap-2">
          {eintraege.map((e) => (
            <Item key={e.id} asChild variant="outline" size="sm">
              <li>
              <ItemContent className="min-w-0">
                <ItemTitle className="w-full min-w-0">
                  <Kennung id={e.id} oeffne={oeffne} className="text-[0.8125rem] text-muted-foreground" />
                  <span className="truncate">{e.frage?.thema}</span>
                </ItemTitle>
              </ItemContent>
              <ItemActions className="gap-4">
              <span className="w-12 text-[0.8125rem] text-muted-foreground tabular-nums">
                {/* ⚠️ Der Streak ist die Zahl, die zaehlt: bei `raus` Treffern in
                    Folge verlaesst die Frage das Deck. */}
                {e.streak} / {raus}
              </span>
              <span className={cn("w-24 text-right text-[0.8125rem] tabular-nums",
                                  e.faellig ? "text-destructive" : "text-muted-foreground")}>
                {wannWieder(e.faelligAb)}
              </span>
              </ItemActions>
              </li>
            </Item>
          ))}
        </ItemGroup>
      )}
    </Card>
  );
}
