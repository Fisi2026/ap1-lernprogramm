/* Die Zeichenflaeche fuer alle SVG-Fragen.

   ⛔ GEMESSEN AM 11.09.2026: 96 Fragen tragen ein SVG (bild, hotspot, beschriftung)
      mit **1762 fest verdrahteten Farbangaben und 0 ueber Token** — die Palette ist
      fuer hellen Grund gezeichnet (#2A2F39 dunkle Linien 486x, #fff Fuellungen 310x).
      Auf dem dunklen Grund waeren die Linien praktisch unsichtbar.

   ►► DIE ALTE APP HATTE DAS BEREITS GELOEST, und zwar so (styles.css:208-209):
          .svgbox                          { background:#fff; }
          html[data-theme="dark"] .svgbox  { background:#eef1f5; }
      Im Dunkelmodus also eine **gedaempfte helle Flaeche** statt reinem Weiss, damit
      sie nicht blendet. Diese Entscheidung wird uebernommen, nicht neu getroffen —
      der Bestand bleibt unangetastet und die Zeichnungen bleiben lesbar.

   ⚠️ Das SVG kommt aus dem eigenen Bestand (pool/), nicht von aussen. Es wird
      trotzdem nur dort eingesetzt, wo es hingehoert, und nirgends aus Nutzereingaben. */
import { useState } from "react";
import { VisuallyHidden } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2, X } from "lucide-react";
import { cn } from "cn";
import { svgInhalt } from "@/lib/vertrauen";

/** Der Wert aus styles.css:209 — dieselbe Flaeche wie in der alten App. */
export const BILDGRUND = "#eef1f5";

/* ============================================================================
   N23: DIE LUPE. Vorbild `svgBox`/`zoomOeffnen` (app_util.js, FB-R1.4): ein
   Lupen-Knopf auf JEDEM Bild, dazu Tap/Klick auf das Bild selbst — ausser dort,
   wo die Zeichnung die ANTWORTFLAECHE ist (`hotspot`): dort waehlt der Klick die
   Stelle, und nur der Knopf vergroessert.
   ⚠️ Das Overlay ist ein Radix-Dialog: Escape, Fokusfalle und `aria-modal` kommen
      von dort, statt sie — wie die alte App — von Hand nachzubauen.
   N25 P4: seit dem shadcn-Baustein `Dialog` (statt Radix direkt). Sein Inhalt ist
      ein zentriertes Kästchen; hier wird er zur Vollfläche mit dunklem Grund, und
      der eingebaute Schließknopf („Close") weicht dem deutschen „Schließen". */
export function Lupe({ svg, beschriftung, tap = true }: { svg: string; beschriftung: string; tap?: boolean }) {
  const [offen, setOffen] = useState(false);
  return (
    <Dialog open={offen} onOpenChange={setOffen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon" title="Vergrößern" aria-label={`${beschriftung} vergrößern`}
                className="absolute top-1.5 right-1.5 z-10 bg-background/85 text-foreground opacity-80 hover:opacity-100">
          <Maximize2 className="size-4" strokeWidth={1.75} aria-hidden />
        </Button>
      </DialogTrigger>
      {tap && (
        /* Der Tap auf das Bild: eine eigene Flaeche HINTER dem Knopf, damit die
           Zeichnung selbst nichts von React wissen muss. Bleibt ein rohes
           <button> – eine unsichtbare Klickflaeche, kein Bedienelement (P7-Ausnahme). */
        <DialogTrigger asChild>
          <button type="button" aria-label={`${beschriftung} vergrößern`} tabIndex={-1}
                  className="absolute inset-0 z-0 cursor-zoom-in" />
        </DialogTrigger>
      )}
      <DialogContent showCloseButton={false} data-teil="bild-zoom"
                     className="inset-0 grid h-full w-full max-w-none translate-x-0 translate-y-0 place-items-center rounded-none bg-black/80 p-6 ring-0 sm:max-w-none">
        <VisuallyHidden.Root asChild><DialogTitle>{beschriftung}</DialogTitle></VisuallyHidden.Root>
        {/* ⛔ GEMESSEN AM 21.09.2026 (N25 P4, in Edge, im ausgelieferten UND im neuen
            Stand): die Lupe ging auf und zeigte ein LEERES Kaestchen. Die Pool-SVGs
            tragen nur eine `viewBox`, keine Breite — mit `w-auto` in einem Kasten,
            der sich nach seinem Inhalt richtet, rechnet der Browser beides auf 0
            (Kaestchen 24x24 = nur das Polster, SVG 0x0). ►► Der Kasten bekommt
            eine FESTE Breite, das SVG fuellt sie: `w-full`, Hoehe nach Seitenverhaeltnis.
            ⚠️ Der Fehler war seit N23 drin und von keinem Test bemerkt — der Test
            fragte, OB der Dialog aufgeht, nicht, ob etwas darin steht. */}
        <div style={{ background: BILDGRUND }}
             className="max-h-[92vh] w-[92vw] max-w-[92vw] overflow-auto rounded-md p-3 [&_svg]:h-auto [&_svg]:w-full"
             dangerouslySetInnerHTML={svgInhalt(svg)} />
        <DialogClose asChild>
          <Button type="button" variant="outline" size="icon-lg" aria-label="Schließen"
                  className="fixed top-3.5 right-4 bg-background/70 text-foreground">
            <X className="size-5" strokeWidth={1.75} aria-hidden />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export function Bildflaeche({
  svg, klasse, beschriftung, zoom = true,
}: {
  svg: string;
  klasse?: string;
  beschriftung: string;
  /** false: kein Tap-Zoom und kein Knopf (die Zeichnung ist die Antwortflaeche). */
  zoom?: boolean;
}) {
  return (
    <div className={cn("relative", klasse)}>
      <figure
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Inhalt ist eingebettetes SVG (dangerouslySetInnerHTML); <img> darf keinen Inhalt haben
        role="img"
        aria-label={beschriftung}
        style={{ background: BILDGRUND }}
        className="overflow-x-auto rounded-md border border-border p-2"
        dangerouslySetInnerHTML={svgInhalt(svg)}
      />
      {zoom && <Lupe svg={svg} beschriftung={beschriftung} />}
    </div>
  );
}
