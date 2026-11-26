/* Der Fragetext mit Begriffs-Tooltips (#53) — Etappe N23.

   ⛔ Die Auswahlregel steht in `kern/glossartip.ts` und wird dort gegen die alte
      App gemessen; hier wird nur gezeichnet.
   ⚠️ Radix-Popover (im Paket `radix-ui` vorhanden): Hover wie am Schreibtisch,
      Tippen wie am Handy, Escape und Klick daneben schließen — die alte App baut
      dasselbe von Hand (`glossarPopEl`).
   ⛔ In der Simulation gibt es keine Tooltips (alte App: `opts.simulation`), und
      ohne die Einstellung `glossarTip` auch nicht. Beides entscheidet der Aufrufer
      über `tooltips`. */
import { useState } from "react";
import { Popover } from "radix-ui";
import { cn } from "cn";
import type { Frage } from "@/daten/typen";
import { tipTreffer, tipTeile } from "@/kern/glossartip";
import type { Treffer } from "@/kern/glossartip";

export function Fragetext({
  frage, tooltips, className,
}: {
  frage: Frage;
  tooltips: boolean;
  className?: string;
}) {
  const text = typeof frage.frage === "string" ? frage.frage : "";
  const teile = tipTeile(text, tipTreffer(frage, tooltips));
  return (
    <p className={className} data-teil="fragetext">
      {teile.map((t, i) => (t.treffer
        // oxlint-disable-next-line react/no-array-index-key -- Textteile der Frage, fest
        ? <Begriff key={i} text={t.text} treffer={t.treffer} />
        // oxlint-disable-next-line react/no-array-index-key -- Textteile der Frage, fest
        : <span key={i}>{t.text}</span>))}
    </p>
  );
}

function Begriff({ text, treffer }: { text: string; treffer: Treffer }) {
  const [offen, setOffen] = useState(false);
  return (
    <Popover.Root open={offen} onOpenChange={setOffen}>
      {/* ⛔ `Anchor`, nicht `Trigger`: der Trigger SCHALTET UM, und beim Tippen kommt
          zuerst das Hover-Ereignis — der Klick hätte die eben geöffnete Erklärung
          sofort wieder geschlossen (im Test gemessen). Hier öffnet beides, und
          geschlossen wird mit Escape, einem Klick daneben oder beim Wegziehen der Maus. */}
      <Popover.Anchor asChild>
        <button type="button" aria-label={`Begriff: ${treffer.term}`}
                onMouseEnter={() => setOffen(true)} onMouseLeave={() => setOffen(false)}
                onClick={() => setOffen(true)}
                className={cn("underline decoration-dotted decoration-from-font underline-offset-4",
                  "hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none")}>
          {text}
        </button>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content sideOffset={6} data-teil="glossar-tip"
                         onOpenAutoFocus={(e) => e.preventDefault()}
                         className="z-50 max-w-xs rounded-md border bg-popover px-3 py-2 text-[0.8125rem] text-popover-foreground shadow-md">
          <b className="block font-medium">{treffer.term}</b>
          {treffer.def}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
