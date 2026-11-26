/* Kopf mit Messschiene. Vier Zahlen, auf jedem Schirm dieselben.
   ⚠️ Der schwerste Befund der Bestandsaufnahme war, dass der Lernstand hinter
      zugeklappten Klappen lag. Deshalb steht er hier fest und nicht in einer
      Statistik-Seite, die man aufsuchen muss. */
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface Messwert {
  wert: string;
  bezeichnung: string;
  warnung?: boolean;
}

export function Kopf({
  titel, untertitel, messwerte, faelligeKarten,
}: {
  titel: string;
  untertitel?: string;
  messwerte: Messwert[];
  faelligeKarten?: number;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-6 py-4">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{titel}</h1>
        {untertitel && (
          <p className="truncate text-sm text-muted-foreground">{untertitel}</p>
        )}
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
        {messwerte.map((m, i) => (
          <div key={m.bezeichnung} className="flex items-center gap-5">
            {i > 0 && <Separator orientation="vertical" className="h-8" />}
            <div className="flex flex-col gap-px">
              <b
                className={
                  "text-[1.0625rem] font-semibold leading-tight tracking-tight tabular-nums" +
                  (m.warnung ? " text-destructive" : "")
                }
              >
                {m.wert}
              </b>
              <span className="text-xs whitespace-nowrap text-muted-foreground">
                {m.bezeichnung}
              </span>
            </div>
          </div>
        ))}
        {faelligeKarten !== undefined && (
          <Badge variant="outline" className="ml-1 rounded-full px-3 py-1.5 text-[0.8125rem]">
            Fehler-Deck <b className="ml-1 text-destructive tabular-nums">{faelligeKarten}</b>
          </Badge>
        )}
      </div>
    </header>
  );
}
