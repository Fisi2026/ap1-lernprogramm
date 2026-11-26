/* Werkzeugschiene links. VIERZEHN Bereiche: die Startseite oben (seit N22), sechs im nächsten Block
   (seit N21 mit „Tagesserie", seit N28 mit „Klausurvorbereitung"), zwei Bloecke zu je drei, dazu Einstellungen unten (nachgezaehlt 17.09.2026 am Typ `Bereich`).
   Symbole aus lucide-react — gezeichnete SVG in einheitlicher Strichstaerke, keine Emoji. */
import {
  BookOpenCheck, Layers, Timer, Calculator, Network, GanttChartSquare,
  BookA, FileText, BarChart3, Settings, Star, CalendarCheck, House, GraduationCap,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

/* N22: die Liste der Bereiche steht in kern/route.ts (dort hängen die Adressen dran).
   Nicht in der Schiene: `meldungen` (über die Einstellungen) und `frage` (über eine Kennung). */
import type { Bereich } from "@/kern/route";
export type { Bereich };
import { KLAUSUR_SET, klausurVorbei } from "@/kern/klausur";
/** K3-E41: beim Laden der App einmal bestimmt (Date.now() im Zeichnen ist unrein – oxlint react/purity). */
const OHNE_KLAUSUR = klausurVorbei(KLAUSUR_SET, Date.now());

const BLOECKE: Array<Array<{ id: Bereich; name: string; Symbol: typeof BookOpenCheck }>> = [
  [
    { id: "start", name: "Startseite", Symbol: House },
  ],
  [
    { id: "ueben", name: "Üben", Symbol: BookOpenCheck },
    { id: "unterricht", name: "Klausurvorbereitung", Symbol: GraduationCap },
    { id: "serie", name: "Tagesserie", Symbol: CalendarCheck },
    { id: "fd", name: "Fehler-Deck", Symbol: Layers },
    { id: "markiert", name: "Markierte Fragen", Symbol: Star },
    { id: "sim", name: "Prüfungssimulation", Symbol: Timer },
  ],
  [
    { id: "gen", name: "Rechen-Generator", Symbol: Calculator },
    { id: "netzplan", name: "Netzplan", Symbol: Network },
    { id: "gantt", name: "Gantt", Symbol: GanttChartSquare },
  ],
  [
    { id: "glossar", name: "Glossar", Symbol: BookA },
    { id: "spickzettel", name: "Spickzettel", Symbol: FileText },
    { id: "stat", name: "Statistik", Symbol: BarChart3 },
  ],
];

/* N32: ausserhalb von Schiene() - innerhalb entstand bei jedem Zeichnen ein NEUER Komponententyp,
   React baute alle Knoepfe samt Tooltip jedes Mal neu auf (oxlint static-components). */
function Knopf({ id, name, Symbol, aktiv, aufBereich }: {
  id: Bereich; name: string; Symbol: typeof BookOpenCheck;
  aktiv: Bereich; aufBereich: (b: Bereich) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* ⚠️ N25b-Nachtrag 22.09.2026: der Knopf war bis hierher roh, allein weil die Huelle
            noch umgebaut werden sollte - ein Grund mit Verfallsdatum, kein sachlicher. Er ist
            jetzt ein `Button`; die Sidebar-Farben und die Breite (40 px, damit 14 Knoepfe in die
            56-px-Schiene passen) stehen als Ueberschreibung daneben. Rolle, Name und
            `aria-current` bleiben unveraendert - daran haengen Tests und der Schnappschuss. */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => aufBereich(id)}
          aria-current={aktiv === id ? "page" : undefined}
          aria-label={name}
          className={cn(
            "h-9 w-10 text-muted-foreground",
            "hover:bg-sidebar-accent hover:text-sidebar-foreground",
            aktiv === id && "bg-sidebar-accent text-sidebar-foreground",
          )}
        >
          <Symbol className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{name}</TooltipContent>
    </Tooltip>
  );
}

export function Schiene({
  aktiv, aufBereich,
}: {
  aktiv: Bereich;
  aufBereich: (b: Bereich) => void;
}) {
  return (
    <nav
      aria-label="Bereiche"
      className="flex h-screen w-14 flex-col items-center gap-0.5 border-r bg-sidebar py-3"
    >
      <div className="mb-4 grid size-8 place-items-center rounded-md bg-primary text-sm font-bold tracking-tight text-primary-foreground">
        A1
      </div>
      {/* K3-E41: nach der Klausur fehlt der Bereich Klausurvorbereitung (die Fragen bleiben im Pool). */}
      {BLOECKE.map((b) => (OHNE_KLAUSUR ? b.filter((k) => k.id !== "unterricht") : b)).map((block, i) => (
        // oxlint-disable-next-line react/no-array-index-key -- feste Bloecke der Schiene
        <div key={i} className="flex flex-col items-center gap-0.5">
          {i > 0 && <div className="my-1.5 h-px w-6 bg-sidebar-border" />}
          {block.map((e) => <Knopf key={e.id} {...e} aktiv={aktiv} aufBereich={aufBereich} />)}
        </div>
      ))}
      <div className="mt-auto">
        <Knopf id="einst" name="Einstellungen" Symbol={Settings} aktiv={aktiv} aufBereich={aufBereich} />
      </div>
    </nav>
  );
}
