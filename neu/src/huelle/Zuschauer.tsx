/* N31/E27 (2)+(3): der Hinweis im ZUSCHAUER-Tab und die Uebernahme mit Rueckfrage.
   ⛔ Solange dieser Tab Zuschauer ist, macht App.tsx den Rest `inert` - wer hier
      antwortet, wuerde nichts buchen, und das darf nicht so aussehen, als ginge es.
   ⚠️ Fester Platz ueber der Huelle (fixed), damit das Raster von `main` unberuehrt
      bleibt (Lehre N25b: ein drittes Kind in `main` fiel in eine implizite Zeile). */
import { useState } from "react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { Lauf } from "@/kern/lernstandort";
import type { StandHaken } from "@/huelle/useLernstand";

const LAUF_TEXT: Record<Lauf, string> = {
  simulation: "eine Prüfungssimulation",
  serie: "eine Tagesserie",
};

export function Zuschauer({ lernstand }: { lernstand: StandHaken }) {
  const [frage, setFrage] = useState<Lauf | null>(null);
  const [fragt, setFragt] = useState(false);
  if (lernstand.rolle !== "zuschauer") return null;
  const q = lernstand.quelle;

  async function weiter() {
    setFragt(true);
    const l = await q.fremderLauf();
    setFragt(false);
    if (l) setFrage(l);
    else await q.hierWeiter();
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 p-3">
      {/* Sichtpruefung 23.09.: die Vorlage haelt fuer den Knopf nur pr-18 (72 px) frei, „Hier
          weiterarbeiten" ist 136 px breit - bei 390 px lag er auf dem Titel. Ab sm genug Platz
          rechts, darunter steht der Knopf unter dem Text. */}
      <Alert className="mx-auto max-w-2xl shadow-lg max-sm:has-data-[slot=alert-action]:pr-2.5 sm:has-data-[slot=alert-action]:pr-40">
        <AlertTitle>Die App ist in einem anderen Tab offen</AlertTitle>
        <AlertDescription>
          Hier siehst du deinen Stand nur an – gespeichert wird im anderen Tab.
        </AlertDescription>
        <AlertAction className="max-sm:static max-sm:mt-2">
          <Button size="sm" onClick={() => void weiter()} disabled={fragt}>Hier weiterarbeiten</Button>
        </AlertAction>
      </Alert>
      <Dialog open={frage !== null} onOpenChange={(o) => { if (!o) setFrage(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pr-6">Im anderen Tab läuft {frage ? LAUF_TEXT[frage] : ""}</DialogTitle>
            <DialogDescription>Trotzdem hier weiterarbeiten? Sie wird dort abgebrochen.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFrage(null)}>Abbrechen</Button>
            <Button onClick={() => { setFrage(null); void q.hierWeiter(); }}>Trotzdem hier weiter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
