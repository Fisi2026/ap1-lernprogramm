/* N33 (E33): „Neue Fassung – neu laden". Ablauf und Regeln in `aktualisierung.ts`.
   ⛔ Waehrend einer Simulation oder Tagesserie IN DIESEM TAB wird nichts gezeigt –
      der Hinweis erscheint danach von selbst (`lauf` kommt aus dem Lernstand).
   ⚠️ Fester Platz unten (fixed), ausserhalb des `inert`-Bereichs – wie der Zuschauer-Hinweis. */
import { useState, useSyncExternalStore } from "react"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Lauf } from "@/kern/lernstandort"
import { aktualisierung as vorgabe, type Aktualisierung } from "@/huelle/aktualisierung"

export function Updatehinweis({ lauf, a = vorgabe }: { lauf: Lauf | null; a?: Aktualisierung }) {
  const stufe = useSyncExternalStore(a.abonniere, a.zustand, a.zustand)
  const [spaeter, setSpaeter] = useState<string | null>(null)
  if (stufe === "keine" || lauf !== null || spaeter === stufe) return null
  return (
    <section className="fixed inset-x-0 bottom-0 z-40 p-3" aria-label="Neue Fassung">
      <Alert className="mx-auto max-w-2xl shadow-lg max-sm:has-data-[slot=alert-action]:pr-2.5 sm:has-data-[slot=alert-action]:pr-52">
        <AlertTitle>Neue Fassung verfügbar</AlertTitle>
        <AlertDescription>Neu laden, um sie zu benutzen – dein Lernstand bleibt erhalten.</AlertDescription>
        <AlertAction className="flex gap-2 max-sm:static max-sm:mt-2">
          <Button size="sm" variant="outline" onClick={() => setSpaeter(stufe)}>Später</Button>
          <Button size="sm" onClick={() => a.jetzt()}>Neu laden</Button>
        </AlertAction>
      </Alert>
    </section>
  )
}
