/* Der Schirm „Markierte Fragen ★" — Etappe N20a.

   Vorbild `sMarkiert` (app_seiten.js): Übersicht mit „Entfernen" und
   „Markierte üben" — zufällige Reihenfolge, jede Frage einmal, gebucht wie beim
   normalen Üben, weiter erst nach der Antwort (alte App #54).
   ⚠️ Anders als die alte App: Kennungen ohne Frage im Bestand werden GEZEIGT und
      auf Klick entfernt, nicht still übergangen (Lehre N10).
   25.11.2026 (Nutzer-Entscheid): darunter „Übersprungen“ – die per „Kann ich schon“ ausgeblendeten
   Fragen (kern/gekonnt.ts), je Frage und alle auf einmal zurückholbar. */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { frageMitId } from "@/daten/laden";
import { markierteIds, verwaisteMarkierungen, entferneMarkierung, modulName } from "@/kern/markiert";
import { gekonnteIds, gekonnteArten, genSchluessel, verwaisteGekonnte, holeZurueck, holeAlleZurueck } from "@/kern/gekonnt";
import { artName } from "@/kern/generator";
import type { StandHaken } from "@/huelle/useLernstand";
import { Karteikarte } from "./Karteikarte";
import { Kennung } from "./Kennung";
import { shuffle } from "@/kern/zufall";

const nachId = (id: string) => frageMitId(id);
const mische = shuffle as (a: string[]) => string[];

export function Markiert({ lernstand, oeffneFrage }: { lernstand: StandHaken; oeffneFrage?: (id: string) => void }) {
  const { stand, aendere } = lernstand;
  const ids = markierteIds(stand, nachId);
  const verwaist = verwaisteMarkierungen(stand, nachId);
  /* Die Übungsrunde: feste Reihenfolge beim Start, danach unabhängig davon,
     ob in der Runde Markierungen entfernt werden. */
  const [runde, setRunde] = useState<{ reihe: string[]; pos: number; beantwortet: boolean } | null>(null);

  if (runde) {
    const id = runde.reihe[runde.pos];
    if (id === undefined) {
      return (
        <div className="grid place-items-center p-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-[0.9375rem]">Fertig – alle markierten Fragen dieser Runde sind durch.</p>
            <Button variant="secondary" onClick={() => setRunde(null)}>Zur Übersicht</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 px-6 pt-4 pb-6">
        <Karteikarte key={`${id}-${runde.pos}`} frage={frageMitId(id)!} /* markierteIds laesst nur Fragen aus dem Pool durch */ nummer={runde.pos + 1}
                     buche={lernstand.buche} merk={lernstand} abruf={lernstand.stand.abrufAn}
                     aufErgebnis={() => setRunde((r) => (r ? { ...r, beantwortet: true } : r))}
                     ueberspringen={() => setRunde((r) => (r ? { ...r, pos: r.pos + 1, beantwortet: false } : r))} />
        <div className="flex items-center justify-between gap-3 text-[0.8125rem] text-muted-foreground">
          <span className="tabular-nums">Markierte Frage {runde.pos + 1} von {runde.reihe.length}</span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setRunde(null)}>Runde beenden</Button>
            <Button disabled={!runde.beantwortet}
                    onClick={() => setRunde((r) => (r ? { ...r, pos: r.pos + 1, beantwortet: false } : r))}>
              Nächste markierte Frage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 auto-rows-max content-start gap-5 overflow-auto p-6">
      <Card className="gap-3 p-5">
        <div className="text-[0.9375rem] font-semibold">Markierte Fragen ★</div>
        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
          Deine per ★ markierten Fragen zum gezielten Wiederholen – unabhängig vom Fehler-Deck.
        </p>
        <p className="text-[0.8125rem]">
          Markiert (im aktuellen Prüfungsteil-Filter): <b className="tabular-nums">{ids.length}</b>
        </p>
        {ids.length === 0 ? (
          <Empty className="border p-6">
            <EmptyHeader>
              <EmptyTitle>Noch nichts markiert.</EmptyTitle>
              <EmptyDescription>Der ★ steht oben rechts auf jeder Karteikarte.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Button className="self-start"
                  onClick={() => setRunde({ reihe: mische(ids.slice()), pos: 0, beantwortet: false })}>
            Markierte üben ({ids.length})
          </Button>
        )}
      </Card>

      {ids.length > 0 && (
        <Card className="gap-2 p-5">
          <h2 className="text-[0.9375rem] font-semibold">Übersicht</h2>
          {/* Item-Liste (N25 P5): ItemGroup traegt `list`, jedes Item `listitem`. */}
          <ItemGroup className="gap-2" data-teil="markiert-liste">
            {ids.map((id) => {
              const f = frageMitId(id)!; // markierteIds laesst nur Fragen aus dem Pool durch
              return (
                <Item key={id} asChild variant="outline" size="sm">
                  <li>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full min-w-0">
                      <Kennung id={id} oeffne={oeffneFrage} className="text-[0.8125rem] text-muted-foreground" />
                      <span className="truncate">{modulName(f.modul)} · {f.thema}</span>
                    </ItemTitle>
                    <ItemDescription className="truncate">{(f.frage ?? "").slice(0, 80)}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="sm" variant="secondary" aria-label={`Markierung ${id} entfernen`}
                            onClick={() => aendere((s) => entferneMarkierung(s, id))}>
                      Entfernen
                    </Button>
                  </ItemActions>
                  </li>
                </Item>
              );
            })}
          </ItemGroup>
        </Card>
      )}

      <Uebersprungen lernstand={lernstand} oeffneFrage={oeffneFrage} />

      {verwaist.length > 0 && (
        <Card className="gap-3 border-destructive/50 p-5">
          <h2 className="text-[0.9375rem] font-semibold text-destructive">Ohne Frage im Bestand ({verwaist.length})</h2>
          <div className="flex flex-wrap gap-1.5 font-mono text-[0.8125rem]">
            {verwaist.map((id) => <Badge key={id} variant="outline">{id}</Badge>)}
          </div>
          <Button variant="secondary" size="sm" className="self-start"
                  onClick={() => aendere((s) => verwaist.reduce((acc, id) => entferneMarkierung(acc, id), s))}>
            {verwaist.length === 1 ? "Diese Kennung entfernen" : `Diese ${verwaist.length} Kennungen entfernen`}
          </Button>
        </Card>
      )}
    </div>
  );
}

/** Die per „Kann ich schon“ ausgeblendeten Fragen (25.11.2026). */
function Uebersprungen({ lernstand, oeffneFrage }: { lernstand: StandHaken; oeffneFrage?: ((id: string) => void) | undefined }) {
  const { stand, aendere } = lernstand;
  const ids = gekonnteIds(stand, nachId);
  const ohne = verwaisteGekonnte(stand, nachId);
  const artenAus = gekonnteArten(stand);
  const n = ids.length + artenAus.length + ohne.length;
  return (
    <Card className="gap-3 p-5" data-teil="uebersprungen">
      <h2 className="text-[0.9375rem] font-semibold">Übersprungen ({n})</h2>
      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
        Per „Kann ich schon“ ausgeblendet: diese Fragen kommen beim Üben, in der Tagesserie und aus dem
        Fehler-Deck nicht mehr. Ausgeblendete Arten von Rechenaufgaben kommen in Üben und
        Klausurvorbereitung nicht mehr. Die Prüfungssimulation stellt alles weiter.
      </p>
      {n === 0 ? (
        <p className="text-[0.8125rem]">Noch nichts übersprungen.</p>
      ) : (
        <>
          <Button variant="secondary" size="sm" className="self-start"
                  onClick={() => aendere((s) => holeAlleZurueck(s))}>
            {n === 1 ? "Zurückholen" : `Alle ${n} zurückholen`}
          </Button>
          <ItemGroup className="gap-2" data-teil="uebersprungen-liste">
            {artenAus.map((art) => (
              <Item key={"art-" + art} asChild variant="outline" size="sm">
                <li data-art={art}>
                <ItemContent className="min-w-0">
                  <ItemTitle className="w-full min-w-0">
                    <span className="truncate">Rechenaufgabe: {artName(art)}</span>
                  </ItemTitle>
                  <ItemDescription className="truncate">Mit Zufallswerten – die ganze Art ist ausgeblendet.</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button size="sm" variant="secondary" aria-label={`Rechenaufgabe ${artName(art)} zurückholen`}
                          onClick={() => aendere((s) => holeZurueck(s, genSchluessel(art)))}>
                    Zurückholen
                  </Button>
                </ItemActions>
                </li>
              </Item>
            ))}
            {ids.map((id) => {
              const f = frageMitId(id)!; // gekonnteIds laesst nur Fragen aus dem Pool durch
              return (
                <Item key={id} asChild variant="outline" size="sm">
                  <li>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full min-w-0">
                      <Kennung id={id} oeffne={oeffneFrage} className="text-[0.8125rem] text-muted-foreground" />
                      <span className="truncate">{modulName(f.modul)} · {f.thema}</span>
                    </ItemTitle>
                    <ItemDescription className="truncate">{(f.frage ?? "").slice(0, 80)}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="sm" variant="secondary" aria-label={`${id} zurückholen`}
                            onClick={() => aendere((s) => holeZurueck(s, id))}>
                      Zurückholen
                    </Button>
                  </ItemActions>
                  </li>
                </Item>
              );
            })}
          </ItemGroup>
          {ohne.length > 0 && (
            <p className="text-[0.8125rem] text-muted-foreground">
              Ohne Frage im Bestand: <span className="font-mono">{ohne.join(", ")}</span> – „Alle zurückholen“ entfernt sie.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
