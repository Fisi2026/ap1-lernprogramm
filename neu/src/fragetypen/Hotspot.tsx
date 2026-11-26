/* hotspot — die Zeichnung IST die Antwortflaeche. gradeHotspot erwartet den
   Index der angeklickten Zone.

   ⚠️ aria-label auf jeder Zone ist PFLICHT, nicht Schmuck. Ein <rect> hat keinen
      Textinhalt; ohne Label sind das fuer Screenreader namenlose Schalter
      ("Schaltflaeche, Schaltflaeche, Schaltflaeche"). Die alte App hat dafuer einen
      eigenen Befund (2026-07-27, axe: aria-command-name, serious). Jede Zone im
      Bestand traegt ein `label`; der Rueckfall greift nur bei kuenftigen Fragen. */
import { BILDGRUND, Lupe } from "./Bildflaeche";
import { cn } from "cn";
import type { EingabeProps } from "./vertrag";
import { svgInhalt } from "@/lib/vertrauen";
import { RichtigWaere } from "./RichtigWaere";

/* Mindestseite einer Klickflaeche in CSS-Pixeln – WCAG 2.2 SC 2.5.8 (Target Size, Minimum). */
const ZIEL_PX = 24;

interface Zone {
  x: number; y: number; w: number; h: number;
  richtig?: boolean;
  label?: string;
}

export function Hotspot({ frage, antwort, aufAntwort, gesperrt, bildtext }: EingabeProps<"hotspot">) {
  const svg = typeof frage.svg === "string" ? frage.svg : "";
  const zonen = (Array.isArray(frage.zonen) ? frage.zonen : []) as Zone[];
  const gewaehlt = typeof antwort === "number" ? antwort : null;

  /* Die Zonen werden als eigenes, absolut liegendes SVG UEBER die Zeichnung gelegt,
     statt sie in den Bestands-String hineinzuschreiben. Der Bestand bleibt damit
     unangetastet, und React behaelt die Ereignisse in der Hand. */
  const box = svg.match(/viewBox\s*=\s*['"]([^'"]+)['"]/);
  const viewBox = box ? box[1] : "0 0 320 185";
  /* N24: dieselbe Beschriftungsregel wie auf der Karte (Schalter `ariaAltTexte`). */
  const beschriftung = bildtext ?? `Zeichnung zur Frage ${frage.id}`;
  /* N48 P4 (11.10.2026, Nutzer-Entscheid „Ziele groesser zeichnen“): bei 390 px war die kleinste
     Zone in M01-483 nur 7 px hoch (WCAG 2.2 SC 2.5.8 verlangt 24 px). Die Zeichnung bekommt deshalb
     eine Mindestbreite, bei der die kleinste Zonenseite 24 px misst; schmaler rollt der Kasten
     waagerecht (`overflow-x-auto` war schon da). Groessere Trefferflaechen haetten sich bei
     Zeilenabstaenden von 14 Einheiten ueberlappt. Messung: tools/sichtpruefung/n48p4.js. */
  const vbBreite = Number((viewBox ?? "").split(/[\s,]+/)[2]) || 320;
  const kleinsteSeite = Math.min(...zonen.map((z) => Math.min(z.w, z.h)).filter((n) => n > 0));
  const mindestBreite = Number.isFinite(kleinsteSeite) ? Math.ceil((vbBreite * ZIEL_PX) / kleinsteSeite) : undefined;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[0.8125rem] text-muted-foreground">
        Klick die richtige Stelle in der Zeichnung an.
      </p>
      <div
        style={{ background: BILDGRUND }}
        className="relative overflow-x-auto rounded-md border border-border p-2"
      >
        <div className="relative" style={{ minWidth: mindestBreite }}>
        {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Inhalt ist eingebettetes SVG (dangerouslySetInnerHTML); <img> darf keinen Inhalt haben */}
        <div role="img" aria-label={beschriftung} dangerouslySetInnerHTML={svgInhalt(svg)} />
        <svg
          viewBox={viewBox}
          className="absolute inset-0 size-full"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- SVG-Element: fieldset gibt es in SVG nicht
          role="group"
          aria-label="Anklickbare Bereiche"
        >
          {zonen.map((z, i) => (
            <rect
              // oxlint-disable-next-line react/no-array-index-key -- feste Liste aus der Frage, nie umsortiert – Index = Stelle
              key={i}
              x={z.x} y={z.y} width={z.w} height={z.h} rx={3}
              // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- SVG-<rect> als Zone: <button> gibt es in SVG nicht; Tastatur (Enter/Leertaste) und aria-pressed sind da
              role="button"
              tabIndex={gesperrt ? -1 : 0}
              aria-label={z.label ? z.label : `Zone ${i + 1}`}
              aria-pressed={gewaehlt === i}
              onClick={() => !gesperrt && aufAntwort(i)}
              onKeyDown={(e) => {
                if (gesperrt) return;
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); aufAntwort(i); }
              }}
              className={cn("cursor-pointer outline-none", gesperrt && "cursor-default")}
              /* N48 P1 (10.10.): nach dem Pruefen die richtige Zone hervorheben, eine falsche Wahl rot. */
              data-urteil={gesperrt ? (z.richtig === true ? "richtig" : gewaehlt === i ? "falsch" : undefined) : undefined}
              fill={gesperrt && z.richtig === true ? "rgba(20,160,90,0.22)"
                    : gesperrt && gewaehlt === i ? "rgba(200,40,40,0.18)"
                    : gewaehlt === i ? "rgba(20,20,20,0.16)" : "rgba(20,20,20,0.04)"}
              stroke={gesperrt && z.richtig === true ? "#137a4a" : gesperrt && gewaehlt === i ? "#b42318" : "#2A2F39"}
              strokeWidth={gewaehlt === i || (gesperrt && z.richtig === true) ? 2.5 : 1.5}
              strokeDasharray={gewaehlt === i || (gesperrt && z.richtig === true) ? undefined : "4 3"}
            />
          ))}
        </svg>
        </div>
        {/* N23: nur der Knopf, kein Tap-Zoom — der Klick waehlt hier die Stelle (alte App FB-R1.4). */}
        <Lupe svg={svg} beschriftung={beschriftung} tap={false} />
      </div>
      {gewaehlt !== null && (
        <p className="text-[0.8125rem] text-muted-foreground">
          Gewählt: <b className="text-foreground">{zonen[gewaehlt]?.label ?? `Zone ${gewaehlt + 1}`}</b>
        </p>
      )}
      {gesperrt && (
        <RichtigWaere zeilen={zonen.flatMap((z, i) =>
          z.richtig === true ? [`${z.label ?? `Zone ${i + 1}`} (in der Zeichnung hervorgehoben)`] : [])} />
      )}
    </div>
  );
}
