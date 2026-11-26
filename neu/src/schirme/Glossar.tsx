/* ============================================================================
   DAS GLOSSAR (Bereich `glossar`) — Begriffslexikon und Abkuerzungen

   Zwei Reiter, genau wie `sGlossar` in app_pages2.js. ⛔ Der zweite ist VERSPERRT,
   solange nicht mehr als `CONFIG.gate` Fragen beantwortet sind — und das Tor
   sagt, wie viele noch fehlen, statt bloss zu fehlen.

   ⚠️ Der Modul-Tag zeigt die KENNUNG (M01, M09), nicht den langen Modulnamen wie
      die alte App: `modulName` wohnt in app_pool.js ohne Export, und der Neubau
      zeigt ueberall sonst ebenfalls die Kennung (Karteikarte, Zufallskarte). Das
      ist Darstellung, keine Regel — hier steht es, damit es niemand fuer ein
      Versehen haelt.
   ============================================================================ */
import { FRAGEN } from "@/daten/laden";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import {
  begriffe, abkuerzungen, abkuerzungenFrei, nochBisFrei, passendeBegriffe, passendeAbk,
} from "@/kern/glossar";
import type { Lernstand } from "@/kern/stand";

type Reiter = "begriffe" | "abk";

export function Glossar({ stand }: { stand: Lernstand }) {
  /* Beide Listen entstehen einmal — der Bestand aendert sich im Betrieb nicht. */
  const BEGRIFFE = useMemo(() => begriffe(FRAGEN), []);
  const ABK = useMemo(() => abkuerzungen(), []);
  const frei = abkuerzungenFrei(stand);
  const [reiter, setReiter] = useState<Reiter>("begriffe");
  const [suche, setSuche] = useState("");
  /* Welche Begriffe aufgeklappt sind. ⚠️ Beim `<details open={suche !== ""}>` von N14 hielt der
     Browser den Zustand; das Accordion braucht ihn hier. Gesetzt wird er an den zwei Stellen,
     die ihn frueher auch gesetzt haben: beim Tippen (alle Treffer auf) und beim Reiterwechsel. */
  const [offeneBegriffe, setOffeneBegriffe] = useState<string[]>([]);

  /* ⛔ HIER STAND `reiter === "abk" && !frei ? "begriffe" : reiter` — EINE SPERRE
     GEGEN EINEN ZUSTAND, DEN ES NICHT GIBT, und die Sabotage hat es gezeigt: sie
     entfernen liess **null** Tests fallen. Bei geschlossenem Tor gibt es den
     Abk-Knopf gar nicht, `reiter` kann also nie auf "abk" stehen — und das Tor
     geht im Betrieb nur auf, nie zu (beantwortete Fragen werden nicht weniger).
     ►► Was den versperrten Reiter verhindert, ist der fehlende Knopf, und DAS ist
        gemessen ("bleibt zu und sagt, wie viele Fragen noch fehlen"). */
  const offen: Reiter = reiter;
  /* N38 Q1: zwei Listen statt einer Union, die unten per Umwandlung wieder getrennt wurde. */
  const begriffTreffer = offen === "begriffe" ? passendeBegriffe(BEGRIFFE, suche) : [];
  const abkTreffer = offen === "begriffe" ? [] : passendeAbk(ABK, suche);
  const trefferZahl = offen === "begriffe" ? begriffTreffer.length : abkTreffer.length;

  function wechsle(r: Reiter) {
    setReiter(r);
    setSuche("");
    setOffeneBegriffe([]);
  }

  /* ⛔ Nicht im Render ableiten: waeren die Treffer erzwungen offen, koennte man
     waehrend einer Suche keinen einzelnen mehr zuklappen - das ging vorher. */
  function sucheAendern(wert: string) {
    setSuche(wert);
    setOffeneBegriffe(wert.trim() === "" ? [] : passendeBegriffe(BEGRIFFE, wert).map((b) => b.term));
  }

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4 px-6 pt-4 pb-6">
      <div className="flex flex-col gap-3">
        <fieldset aria-label="Glossar-Teile" className="min-w-0 flex flex-wrap items-center gap-2">
          <Button size="sm" variant={offen === "begriffe" ? "default" : "outline"}
                  onClick={() => wechsle("begriffe")}>
            Begriffe ({BEGRIFFE.length})
          </Button>
          {frei ? (
            <Button size="sm" variant={offen === "abk" ? "default" : "outline"}
                    onClick={() => wechsle("abk")}>
              Abkürzungen ({ABK.length})
            </Button>
          ) : (
            /* ⚠️ Das Tor sagt die ZAHL. "Noch nicht freigeschaltet" allein waere
               eine Wand ohne Klinke. */
            <span className="text-[0.8125rem] text-muted-foreground">
              Abkürzungen: noch {nochBisFrei(stand)}{" "}
              {nochBisFrei(stand) === 1 ? "Frage" : "Fragen"} bis zur Freischaltung
            </span>
          )}
        </fieldset>
        {/* Dasselbe Suchfeld wie im Spickzettel (P6: InputGroup mit Lupe). */}
        <InputGroup className="h-9 bg-card">
          <InputGroupAddon><SearchIcon aria-hidden="true" /></InputGroupAddon>
          <InputGroupInput
            type="search"
            value={suche}
            onChange={(e) => sucheAendern(e.target.value)}
            aria-label={offen === "begriffe" ? "Begriff suchen" : "Abkürzung suchen"}
            placeholder={offen === "begriffe"
              ? "Begriff oder Definition durchsuchen …"
              : "Kürzel, Langform, Definition oder Kategorie durchsuchen …"}
          />
        </InputGroup>
      </div>

      <div className="min-h-0 overflow-auto">
        {trefferZahl === 0 ? (
          <Card className="grid place-items-center px-8 py-10 text-center text-sm text-muted-foreground">
            Dazu steht hier nichts. Andere Schreibweise versuchen?
          </Card>
        ) : offen === "begriffe" ? (
          /* Aufklappbar, und bei aktiver Suche offen — wie in der alten App.
             ⚠️ Anders als `<details>` haengt das Accordion den Inhalt AUS, solange
             zugeklappt ist: die Definition steht dann nicht im DOM. Fuer die Suche
             ist das gleichgueltig (sie liest den Bestand, nicht die Seite). */
          <Accordion type="multiple" className="flex flex-col gap-2"
                     value={offeneBegriffe} onValueChange={setOffeneBegriffe}>
            {begriffTreffer.map((b) => (
              <AccordionItem key={b.term} value={b.term} className="rounded-lg border px-4 py-1">
                <AccordionTrigger className="text-[0.9375rem] font-medium">
                  <span>
                    {b.term}{" "}
                    <Badge variant="secondary" className="ml-1 font-normal">{b.modul}</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="max-w-[70ch] text-[0.8125rem] leading-relaxed whitespace-pre-line text-muted-foreground">
                  {b.def}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-col gap-2">
            {abkTreffer.map((a) => (
              <div key={a.kurz} className="rounded-lg border px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.9375rem] font-medium">{a.kurz}</span>
                  <Badge variant="secondary" className="font-normal">{a.kat}</Badge>
                </div>
                <div className="mt-1 text-[0.875rem]">{a.lang}</div>
                <div className="mt-1 max-w-[70ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {a.def}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
