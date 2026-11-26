/* Die Startseite (`start`) — Etappe N22.

   Vorbild `sStart` (app_seiten.js): Kachelmenü, darunter „Dein Stand" (zuklappbar,
   startet offen, gemerkt in `panelOffen["stat-start"]` wie in der alten App).
   ⛔ Die Zahlen rechnet `kern/startseite.ts`; hier wird nur gezeichnet.
   ⚠️ Die Schiene bleibt — die Startseite tritt daneben (PLAN_NEUBAU N22). */
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "cn";
import { FRAGEN } from "@/daten/laden";
import type { Bereich } from "@/kern/route";
import type { StandHaken } from "@/huelle/useLernstand";
import { kacheln, standZeile, aktivitaet14, quoteJeGebiet, poolZahlen } from "@/kern/startseite";

const AMPEL: Record<string, string> = { gruen: "bg-chart-1", gelb: "bg-chart-4", rot: "bg-destructive" };
const PANEL = "stat-start";

function datumDE(tag: string): string {
  const [j, m, d] = tag.split("-");
  return `${d}.${m}.${j}`;
}

const JETZT_STANDARD = () => Date.now();

const AUSLOESER =
  "flex cursor-pointer items-center gap-1 rounded-sm text-left focus-visible:ring-[3px] " +
  "focus-visible:ring-ring/50 focus-visible:outline-none";

export function Startseite({
  lernstand, geheZu, jetzt = JETZT_STANDARD, poolDa = true,
}: {
  lernstand: StandHaken;
  geheZu: (b: Bereich) => void;
  jetzt?: () => number;
  /** N38 P1 (E63): ohne Pool nur zeigen, was ohne ihn stimmt (`kacheln(…, null, …)`). */
  poolDa?: boolean;
}) {
  const { stand, aendere } = lernstand;
  const t = jetzt();
  const liste = kacheln(stand, poolDa ? FRAGEN : null, t);
  const z = standZeile(stand, t);
  const tage = aktivitaet14(stand, t);
  const maxTag = Math.max(1, ...tage.map((x) => x.anzahl));
  const pool = poolDa ? poolZahlen(FRAGEN) : null;
  const gemerkt = stand.panelOffen || {};
  const offen = Object.prototype.hasOwnProperty.call(gemerkt, PANEL) ? !!gemerkt[PANEL] : true;

  function umschalten(neu: boolean) {
    if (neu === offen) return;
    aendere((s) => {
      const p = { ...(s.panelOffen || {}) };
      /* wie statPanel(): nur die Abweichung vom Standard wird gespeichert */
      if (neu) delete p[PANEL];
      else p[PANEL] = false;
      return { ...s, panelOffen: p };
    });
  }

  return (
    <div className="grid min-h-0 auto-rows-max gap-5 overflow-auto p-6">
      <div className="text-[0.75rem] uppercase tracking-wide text-muted-foreground">Was möchtest du tun?</div>
      <nav aria-label="Kacheln" className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">
        {liste.map((k) => (
          /* N25 P6b: Kachel als shadcn `Button` (Nutzer-Entscheid 21.09.). ghost, weil die Kachel
             ihre Flaeche selbst malt; ueberschrieben wird, was der Knopf-Stil mitbringt
             (Hoehe, eine Zeile, zentriert) – sonst waere es keine Kachel mehr. */
          <Button key={k.ziel} type="button" variant="ghost" onClick={() => geheZu(k.ziel)} data-ziel={k.ziel}
                  className={cn(
                    "relative h-auto flex-col items-stretch justify-start gap-1 whitespace-normal rounded-xl border-0 p-4 text-left font-normal",
                    "bg-card ring-1 ring-foreground/10 hover:bg-accent hover:text-foreground dark:hover:bg-accent",
                    k.hero && "sm:col-span-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground dark:hover:bg-primary/90",
                  )}>
            {k.badge && (
              <Badge className="absolute top-3 right-3 font-normal tabular-nums" variant={k.hero ? "secondary" : "default"}>
                {k.badge}
              </Badge>
            )}
            {/* Sichtpruefung 23.09.: „heute offen" ist ~80 px breit plus right-3 - pr-16 reichte nicht,
                das Badge lag auf „schwächstes". */}
            <span className={cn("text-[0.9375rem] font-semibold", k.badge ? "pr-24" : "pr-16")}>{k.titel}</span>
            <span className={cn("text-[0.8125rem] leading-snug", k.hero ? "text-primary-foreground/80" : "text-muted-foreground")}>
              {k.sub}
            </span>
          </Button>
        ))}
      </nav>

      <Card className="gap-0 p-0">
        {/* N25 P6b: `<details onToggle>` → `Collapsible` gesteuert ueber open/onOpenChange –
            der gemerkte Klappzustand (panelOffen) bleibt so erhalten. */}
        <Collapsible open={offen} onOpenChange={umschalten} data-teil="dein-stand" className="group/stand">
          <CollapsibleTrigger className={cn(AUSLOESER, "w-full px-5 py-3 text-[0.9375rem] font-semibold")}>
            <ChevronRight className="size-4 transition-transform group-data-[state=open]/stand:rotate-90" aria-hidden />
            Dein Stand
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-4 px-5 pb-5">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.875rem]" data-teil="stand-zeile">
              {z.bereitschaft ? (
                <span className="inline-flex items-center gap-2">
                  Bereitschaft
                  <i aria-hidden className={cn("inline-block size-2.5 rounded-full", AMPEL[z.bereitschaft.ampel] ?? "bg-muted")} />
                  <b className="tabular-nums">{z.bereitschaft.score} %</b>
                </span>
              ) : (
                <span className="text-muted-foreground">Bereitschaft: noch keine Daten – leg los.</span>
              )}
              <span>Heute <b className="tabular-nums">{z.heute}/{z.tagesziel}</b> Fragen</span>
              {z.quote !== null && <span>Trefferquote <b className="tabular-nums">{z.quote} %</b></span>}
              <span>Fehler-Deck fällig <b className="tabular-nums">{z.faellig}</b></span>
              {z.letzteSimulation !== null && (
                <span>Letzte Simulation <b className="tabular-nums">{z.letzteSimulation} %</b></span>
              )}
            </div>
            <Collapsible data-teil="mehr-statistik" className="group/mehr">
              <CollapsibleTrigger className={cn(AUSLOESER, "text-[0.8125rem] text-muted-foreground")}>
                <ChevronRight className="size-3.5 transition-transform group-data-[state=open]/mehr:rotate-90" aria-hidden />
                Mehr Statistik anzeigen
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 flex flex-col gap-4">
                <div>
                  <div className="mb-2 text-[0.75rem] uppercase tracking-wide text-muted-foreground">Aktivität (letzte 14 Tage)</div>
                  <div className="flex h-[60px] items-end gap-1" data-teil="aktivitaet">
                    {tage.map((x) => (
                      <div key={x.tag} title={`${datumDE(x.tag)}: ${x.anzahl} Fragen`}
                           className="w-[15px] rounded-sm bg-chart-1"
                           style={{ height: `${Math.max(3, Math.round((x.anzahl / maxTag) * 54))}px` }} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[0.75rem] uppercase tracking-wide text-muted-foreground">Trefferquote je Gebiet</div>
                  <div className="flex flex-col gap-2">
                    {quoteJeGebiet(stand).map((g) => (
                      <div key={g.code} className="grid grid-cols-[minmax(0,16rem)_5rem_minmax(0,1fr)] items-center gap-3 text-[0.8125rem]">
                        <span className="truncate" title={g.name}>{g.name}</span>
                        <span className="tabular-nums text-muted-foreground">{g.gesamt ? `${g.richtig}/${g.gesamt}` : "noch offen"}</span>
                        {g.quote === null ? <span /> : <Progress value={g.quote} className="h-1.5" />}
                      </div>
                    ))}
                  </div>
                </div>
                {pool && (
                  <p className="text-[0.8125rem] text-muted-foreground">
                    Pool: {pool.gesamt} Fragen ({pool.ap1} AP1 · {pool.ap2} AP2-Zusatz)
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
