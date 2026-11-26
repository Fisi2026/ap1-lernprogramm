/* „⚑ Frage melden" an der Karteikarte — Etappe N20a.

   Vorbild `renderMelden` (app_frage.js): fünf Schnellgründe, optionaler
   Freitext, „Melden" und „Meldung entfernen", Statuszeile mit Datum.
   ⛔ Keinerlei Einfluss auf die Wertung. Die Regeln stehen in `kern/markiert.ts`.
   ⚠️ Eine vorhandene Meldung klappt den Bereich auf – wie in der alten App.
   ⚠️ SEIT N20b geht jede Meldung zusätzlich ONLINE an den Betreiber (Entscheid E8),
      ohne Namen, IP wird nicht gespeichert (pseudonym ueber die Geraetekennung, AUD-A2). Ohne Netz wartet sie in der Schlange
      (`kern/meldeversand.ts`). Lokal gespeichert wird sie weiterhin – die alte
      App liest dasselbe Feld. */
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { MELDE_GRUENDE, meldungFuer, setzeMeldung, entferneMeldung } from "@/kern/markiert";
import { vormerken, zuruecknehmen, versandstand, sendeAusstehende } from "@/kern/meldeversand";
import type { Ablage, Sende } from "@/kern/meldeversand";
import type { Lernstand } from "@/kern/stand";
import type { StandHaken } from "@/huelle/useLernstand";

export interface MerkHaken {
  stand: Lernstand;
  aendere: StandHaken["aendere"];
}

const VERSAND_TEXT = {
  gesendet: "an den Betreiber übermittelt",
  wartet: "wartet auf Verbindung – wird automatisch nachgeschickt",
  abgewiesen: "vom Server abgewiesen – bitte über den Export melden",
} as const;

const netz: Sende = (url, init) => fetch(url, init);

export function Melden({ id, merk, ablage = localStorage, sende = netz }: {
  id: string;
  merk: MerkHaken;
  /** Für Tests austauschbar; in der App der Browser-Speicher und `fetch`. */
  ablage?: Ablage;
  sende?: Sende;
}) {
  const vorhanden = meldungFuer(merk.stand, id);
  const [grund, setGrund] = useState(vorhanden?.grund ?? "");
  const [text, setText] = useState(vorhanden?.text ?? "");
  const [, neuZeichnen] = useState(0);
  /* N25 P4 (Nutzer-Entscheid 21.09.2026): eine vorhandene Meldung klappt den
     Bereich beim Einhaengen auf; nach „Meldung entfernen" BLEIBT er offen –
     man steht gerade darin. Vorher klappte das details-Element zu. */
  const [offen, setOffen] = useState(!!vorhanden);
  const versand = vorhanden ? versandstand(ablage, id, vorhanden.datum) : null;

  function melde() {
    const datum = Date.now();
    merk.aendere((s) => setzeMeldung(s, id, grund, text, datum));
    vormerken(ablage, { frageId: id, grund: grund || "Sonstiges", text: text.trim(), datum });
    neuZeichnen((n) => n + 1);
    void sendeAusstehende(ablage, sende, __APP_VERSION__).finally(() => neuZeichnen((n) => n + 1));
  }

  function entferne() {
    merk.aendere((s) => entferneMeldung(s, id));
    zuruecknehmen(ablage, id);
    setGrund("");
    setText("");
  }

  return (
    <Collapsible open={offen} onOpenChange={setOffen}
                 className="group/melden mt-3 max-w-[56ch] text-[0.8125rem]" data-teil="melden">
      {/* N48 P4 (11.10.2026): min-h-6 – 19 px hoch verfehlte der Knopf neben „Ausfuehrliche Erklaerung“
          die 24 px aus WCAG 2.2 SC 2.5.8 samt Abstands-Ausnahme (19 Fragen, tools/sichtpruefung/n48p4.js). */}
      <CollapsibleTrigger className="inline-flex min-h-6 cursor-pointer items-center gap-1 rounded-sm text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
        <ChevronRight className="size-3.5 transition-transform group-data-[state=open]/melden:rotate-90" aria-hidden />
        ⚑ Frage melden
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 flex flex-col gap-2">
        {vorhanden && (
          <p className="text-muted-foreground" data-teil="meldestatus">
            Gemeldet am {new Date(vorhanden.datum).toLocaleDateString("de-DE")} – {vorhanden.grund || "?"}
            {vorhanden.text ? `: ${vorhanden.text}` : ""}
            {versand && <> · <span data-teil="versand">{VERSAND_TEXT[versand]}</span></>}
          </p>
        )}
        {/* Vertrag: `radio` je Grund (markiert.jsdom). Radix' ToggleGroup
            `single` vergibt genau das; ein zweiter Klick auf denselben Grund
            liefert "" – die Wahl bleibt dann stehen, wie vorher. */}
        <ToggleGroup type="single" variant="outline" size="sm" spacing={1.5}
                     aria-label="Grund der Meldung" className="flex-wrap"
                     value={grund} onValueChange={(g) => { if (g) setGrund(g); }}>
          {MELDE_GRUENDE.map((g) => (
            <ToggleGroupItem key={g} value={g}
                             className="data-[state=on]:border-ring data-[state=on]:bg-accent">
              {g}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Textarea aria-label="Details zur Meldung" placeholder="Details (optional) …" value={text}
                  onChange={(e) => setText(e.target.value)} className="min-h-12" />
        <div className="flex gap-2">
          <Button size="sm" onClick={melde}>
            Melden
          </Button>
          {vorhanden && (
            <Button size="sm" variant="secondary" onClick={entferne}>
              Meldung entfernen
            </Button>
          )}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Die Meldung geht an den Betreiber der App – ohne deinen Namen, die IP-Adresse wird nicht
          gespeichert. Mehr unter Einstellungen → Datenschutz.
          {versand === "gesendet" && " „Entfernen“ löscht sie nur auf diesem Gerät."}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
