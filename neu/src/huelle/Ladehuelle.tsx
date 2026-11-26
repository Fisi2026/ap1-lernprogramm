/* Was ein Schirm zeigt, solange der Pool fehlt (N32 Schritt 3, seit N38 P1 / E63 je Schirm statt fuer die
   ganze App – Ablauf und Begruendung in `start.tsx`). Schiene, Kopf und poolfreie Schirme stehen dabei schon. */
import { Button } from "@/components/ui/button";
import type { PoolStatus } from "@/daten/laden";

export function PoolWartet({ status, nochmal }: { status: Exclude<PoolStatus, "da">; nochmal: () => void }) {
  return (
    <div className="grid min-h-0 place-items-center p-10 text-sm text-muted-foreground">
      {status === "fehler" ? (
        <div role="alert" className="space-y-3 text-center">
          <p>Die Fragen konnten nicht geladen werden. Dein Lernstand ist davon nicht berührt.</p>
          <Button onClick={nochmal}>Nochmal versuchen</Button>
        </div>
      ) : (
        <output className="block" aria-live="polite">Fragen werden geladen …</output>
      )}
    </div>
  );
}

/** N38 P3: solange der Chunk eines faulen Schirms laedt (`huelle/faulschirme.tsx`). */
export function SchirmLaedt() {
  return (
    <div className="grid min-h-0 place-items-center p-10 text-sm text-muted-foreground">
      <output className="block" aria-live="polite">Wird geladen …</output>
    </div>
  );
}
