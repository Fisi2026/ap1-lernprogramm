/* Eine Frage-Kennung, die die Einzelfrage öffnet (N22, Nutzer-Entscheid 17.09.2026).
   Ohne `oeffne` bleibt sie reiner Text — dann gibt es keinen Knopf, der nichts tut.
   N25 P4: der Knopf ist shadcns `Button variant="link"`; Höhe und Innenabstand
   nimmt er zurück, weil die Kennung mitten in Listenzeilen und Sätzen steht. */
import { Button } from "@/components/ui/button";
import { cn } from "cn";

export function Kennung({ id, oeffne, className }: { id: string; oeffne?: ((id: string) => void) | undefined; className?: string }) {
  if (!oeffne) return <span className={cn("font-mono", className)}>{id}</span>;
  return (
    <Button variant="link" type="button" onClick={() => oeffne(id)} aria-label={`Frage ${id} öffnen`}
            className={cn("h-auto p-0 font-mono font-normal underline decoration-dotted underline-offset-2",
              "text-inherit hover:text-foreground", className)}>
      {id}
    </Button>
  );
}
