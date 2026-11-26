/* reihenfolge — Schritte in die richtige Ordnung bringen.
   gradeReihenfolge erwartet die ORIGINAL-Indizes in der Reihenfolge des Nutzers;
   richtig ist 0,1,2,… — der Bestand haelt die Schritte also bereits sortiert.

   ⚠️ Deshalb wird beim ersten Zeichnen GEMISCHT (seit N48 ueber den Mischer, `kern/anzeige.ts`
      `nichtGeordnet`). Ohne das Mischen stuende die Loesung schon da, und die Frage waere keine.
   ⚠️ Die zwei Knoepfe bleiben der Hauptweg: Tastatur und Screenreader bedienen nur sie.
   Meldung 7 (M04-029, Nutzer-Entscheid 24.11.2026): ZUSAETZLICH Ziehen am Griff links –
      eigene Umsetzung mit Pointer-Events (Maus und Finger gleich), ohne Bibliothek. Nur der
      Griff zieht (`touch-none`), der Rest der Zeile scrollt auf dem Handy wie gewohnt. Der
      Griff ist aria-hidden: wer nicht zeigen kann, hat die Knoepfe – kein zweiter Tastaturweg.
   N25 P3: die zwei Knoepfe sind eine ButtonGroup aus shadcn-Buttons; ihre Namen
   („Schritt n nach oben|unten“) sind Vertrag (eingabe.test.tsx). */
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { FieldDescription } from "@/components/ui/field";
import type { EingabeProps } from "./vertrag";
import { istZahl, listeVon } from "@/kern/pruefe";
import { nichtGeordnet } from "@/kern/anzeige";
import { useMischer } from "./mischung";
import { RichtigWaere } from "./RichtigWaere";

export function Reihenfolge({ frage, antwort, aufAntwort, gesperrt }: EingabeProps<"reihenfolge">) {
  const schritte = Array.isArray(frage.schritte) ? frage.schritte : [];
  /* N48 P1 (10.10.): neu je Anzeige wie die Auswahllisten (N47, Nutzer-Entscheid „neu je Anzeige") –
     vorher fest je Kennung, die Startlage war also auswendig lernbar. */
  const start = nichtGeordnet(useMischer().reihenfolge(frage.id + ":schritte", schritte.length));
  const ordnung = listeVon(antwort, istZahl) ?? start;

  /* Ziehen: `zug.von` = Platz der gezogenen Zeile, `zug.vor` = Einfuegestelle 0..n (vor welcher Zeile). */
  const [zug, setZug] = useState<{ von: number; vor: number } | null>(null);
  const zeilen = useRef<Array<HTMLLIElement | null>>([]);

  function einfuegestelle(y: number): number {
    let vor = 0;
    zeilen.current.slice(0, ordnung.length).forEach((li) => {
      const r = li?.getBoundingClientRect();
      if (r && y > r.top + r.height / 2) vor++;
    });
    return vor;
  }

  function lasseLos() {
    if (zug && zug.vor !== zug.von && zug.vor !== zug.von + 1) {
      const neu = [...ordnung];
      const [zeile] = neu.splice(zug.von, 1);
      neu.splice(zug.vor > zug.von ? zug.vor - 1 : zug.vor, 0, zeile!);
      aufAntwort(neu);
    }
    setZug(null);
  }

  function schiebe(von: number, richtung: -1 | 1) {
    const nach = von + richtung;
    if (nach < 0 || nach >= ordnung.length) return;
    const neu = [...ordnung];
    [neu[von], neu[nach]] = [neu[nach]!, neu[von]!];
    aufAntwort(neu);
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldDescription>Bring die Schritte in die richtige Reihenfolge.</FieldDescription>
      <ol className="flex flex-col gap-1.5">
        {ordnung.map((original, platz) => (
          <li key={original} ref={(el) => { zeilen.current[platz] = el; }}
              className={cn("relative flex items-start gap-3 rounded-lg border px-3 py-2.5 text-[0.9375rem] leading-snug",
                            zug?.von === platz && "opacity-60 ring-2 ring-ring")}>
            {zug && zug.vor === platz && <Ziellinie oben />}
            {zug && platz === ordnung.length - 1 && zug.vor === ordnung.length && <Ziellinie />}
            {/* Griff und Nummer in EINER Spalte uebereinander: der Griff kostet so keine Textbreite
                (390 px gemessen: Text 112 px wie vorher statt 88 px mit eigener Griff-Spalte). */}
            <div className="flex w-5 flex-none flex-col items-center gap-1">
              <div aria-hidden data-griff
                   className={cn("text-muted-foreground touch-none",
                                 gesperrt ? "opacity-40" : "cursor-grab active:cursor-grabbing")}
                   onPointerDown={(e) => {
                     if (gesperrt || e.button !== 0) return;
                     e.currentTarget.setPointerCapture?.(e.pointerId);
                     setZug({ von: platz, vor: platz });
                   }}
                   onPointerMove={(e) => { if (zug) setZug({ ...zug, vor: einfuegestelle(e.clientY) }); }}
                   onPointerUp={lasseLos}
                   onPointerCancel={() => setZug(null)}>
                <GripVertical className="size-4" strokeWidth={1.75} />
              </div>
              <span aria-hidden className="font-mono text-xs text-muted-foreground tabular-nums">
                {platz + 1}
              </span>
            </div>
            {/* N48 P4 (11.10.2026): min-w-0 + break-words – „Material/Lieferanten/Preise“ (M08-361) hat keine
                Trennstelle und schob bei 390 px die Pfeile 40 px aus der Karte (tools/sichtpruefung/n48p4.js). */}
            <span className="min-w-0 flex-1 break-words">{schritte[original]}</span>
            <ButtonGroup aria-label={`Schritt ${platz + 1} verschieben`} className="flex-none">
              <Pfeil richtung="hoch" aus={gesperrt || platz === 0}
                     platz={platz} aufKlick={() => schiebe(platz, -1)} />
              <Pfeil richtung="runter" aus={gesperrt || platz === ordnung.length - 1}
                     platz={platz} aufKlick={() => schiebe(platz, 1)} />
            </ButtonGroup>
          </li>
        ))}
      </ol>
      {gesperrt && <RichtigWaere zeilen={schritte.map((s, i) => `${i + 1}. ${s}`)} />}
    </div>
  );
}

/* Linie an der Zielstelle beim Ziehen: oben an der Zeile, vor der eingefuegt wird – bei „ans Ende“ unten an der letzten. */
function Ziellinie({ oben = false }: { oben?: boolean }) {
  return <div data-ziellinie aria-hidden
              className={cn("pointer-events-none absolute inset-x-0 h-0.5 rounded bg-primary", oben ? "-top-1" : "-bottom-1")} />;
}

function Pfeil({
  richtung, aus, platz, aufKlick,
}: {
  richtung: "hoch" | "runter";
  aus: boolean;
  platz: number;
  aufKlick: () => void;
}) {
  const Symbol = richtung === "hoch" ? ChevronUp : ChevronDown;
  return (
    <Button type="button" variant="outline" size="icon-sm" disabled={aus} onClick={aufKlick}
            aria-label={`Schritt ${platz + 1} nach ${richtung === "hoch" ? "oben" : "unten"}`}>
      <Symbol strokeWidth={1.75} aria-hidden />
    </Button>
  );
}
