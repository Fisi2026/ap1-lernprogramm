/* Die Kopfleiste einer Karte: Kennung, Thema, Stufe, Kartennummer – und rechts daneben, was der
   Aufrufer anhaengt (der Stern der Karteikarte).
   N38 Q2 (30.09.2026): aus Karteikarte und Zufallskarte herausgezogen – dort stand sie zweimal
   fast wortgleich. Das Markup ist unveraendert (Schnappschuss).
   N48 P4 (11.10.2026): `min-w-0` aussen – sonst setzte das `truncate`-Thema (nowrap) die
   Mindestbreite der Kartenspalte; bei 390 px ragte die Karte 11 bis 142 px rechts heraus
   (M03-056, M03-704, M03-747, M04-701; tools/sichtpruefung/n48p4.js). */
import type { ReactNode } from "react";
import { cn } from "cn";

export function Kartenkopf({ kennung, thema, schwierigkeit, nummer, children }: {
  kennung: string;
  thema: string | undefined;
  schwierigkeit: number;
  nummer: number;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-5 py-3 text-[0.8125rem] text-muted-foreground">
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-mono text-foreground">{kennung}</span>
        <span className="truncate">{thema}</span>
      </div>
      <div className="flex flex-none items-center gap-3">
        <span>Stufe</span>
        {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- vier gezeichnete Punkte als Kinder; <img> darf keine Kinder haben */}
        <span role="img" className="inline-flex items-center gap-[3px]"
              aria-label={`Schwierigkeit ${schwierigkeit} von 4`}>
          {[1, 2, 3, 4].map((s) => (
            <i key={s} className={cn("block size-[5px] rounded-full",
               s <= schwierigkeit ? "bg-chart-1" : "ring-1 ring-input")} />
          ))}
        </span>
        <span className="tabular-nums">Karte {nummer}</span>
        {children}
      </div>
    </div>
  );
}
