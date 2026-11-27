/* ============================================================================
   DIE RUECKSEITE DER KARTEIKARTE — Etappe N19 (docs/plaene/PLAN_NEUBAU.md, Entscheid E4)

   Vorbild ist `zeigeErklaerung` in app_frage.js. Bis N19 zeigte der Neubau
   nur `erklaerungKurz` — der groesste inhaltliche Verlust gegenueber der
   alten App. Gemessen am 17.09.2026: alle 1131 Fragen tragen
   `erklaerungLang` UND `verweis`, alle 352 mc-Fragen `distraktorErklaerungen`.

   ⛔ DER VERWEIS IST TEXT, KEIN LINK (Nutzer-Entscheid 17.09.2026). Die alte
      App verlinkt die Kursdatei (`MODUL_DATEI`) — aber `.assetsignore` sperrt
      `*.md`, und der Link liefert beim Lerner 404 (live geprueft). Einen
      toten Link nachzubauen waere ein Fehler mit Gleichheitsbeweis.
   ⚠️ AUFGEKLAPPT WIRD NACH EINER FALSCHEN ANTWORT (alte App, FB-R1.2) —
      genau dann braucht man die ausfuehrliche Erklaerung.
   ⚠️ Die Karte uebergibt die GESTELLTE Frage (`instanziiere`): 24 Fragen
      tragen Platzhalter auch in `erklaerungLang`.
   ============================================================================ */
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Frage } from "@/daten/typen";
import { distraktoren, textOder } from "./distraktoren";

const TEXT = {
  kopf: "Rückseite",
  vorher: "Erscheint nach dem Prüfen.",
  ohneKurz: "Zu dieser Frage ist keine Erklärung hinterlegt.",
  lang: "Ausführliche Erklärung",
  ohneLang: "Zu dieser Frage ist keine ausführliche Erklärung hinterlegt.",
  warum: "Warum sind die anderen falsch?",
  ohneVerweis: "Zu dieser Frage ist kein Verweis auf den Lehrtext hinterlegt.",
} as const;

export function Rueckseite({
  frage, geprueft, aufklappen = false,
}: {
  frage: Frage;
  geprueft: boolean;
  /** true nach einer falschen Antwort: die ausfuehrliche Erklaerung ist offen. */
  aufklappen?: boolean;
}) {
  const kurz = textOder(frage.erklaerungKurz);
  const lang = textOder(frage.erklaerungLang);
  const verweis = textOder(frage.verweis);
  const falsch = distraktoren(frage);

  return (
    <div className="max-w-[56ch] border-t pt-3.5" data-teil="rueckseite">
      <b className="mb-1.5 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {TEXT.kopf}
      </b>
      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
        {geprueft ? kurz || TEXT.ohneKurz : TEXT.vorher}
      </p>
      {geprueft && (
        /* N25 P4: `<details>` → shadcn `Collapsible`. ⚠️ key haengt am Aufklappen:
           `defaultOpen` wirkt nur beim Einhaengen — kommt das Urteil nach, wird
           neu eingehaengt (wie vorher bei `open` am details-Element). */
        <Collapsible key={aufklappen ? "offen" : "zu"} defaultOpen={aufklappen}
                     className="group/lang mt-3 text-[0.8125rem] leading-relaxed" data-teil="lang">
          <CollapsibleTrigger className="inline-flex cursor-pointer items-center gap-1 rounded-sm text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
            <ChevronRight className="size-3.5 transition-transform group-data-[state=open]/lang:rotate-90" aria-hidden />
            {TEXT.lang}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">
              {lang || kurz || TEXT.ohneLang}
            </p>
            {falsch.length > 0 && (
              <div className="mt-3" data-teil="distraktoren">
                <b className="font-medium text-foreground">{TEXT.warum}</b>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                  {falsch.map((d, i) => (
                    // oxlint-disable-next-line react/no-array-index-key -- Erklaerungen je Option, fest
                    <li key={i}><i>{d.option}:</i> {d.warum}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-3 text-muted-foreground" data-teil="verweis">
              {verweis ? `Siehe ${verweis}` : TEXT.ohneVerweis}
            </p>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
