/* ============================================================================
   DER BEREICH „KLAUSURVORBEREITUNG" (`unterricht`)

   K3 (PLAN_KLAUSUR3.md, 23.11.2026): geuebt wird `pool/sets/klausur_k3.json` (K3-E10 ersetzt K2); je Thema
   Klausurpunkte und Fortschritt im Durchgang (K3-E40), Ziehung nach Punkten gewichtet (K3-E54, in `kern/klausur.ts`),
   nach der Klausur blendet die Schiene den Bereich aus (K3-E41).
   K2 (PLAN_KLAUSUR2.md, 14.10.2026): geuebt wird das Klausur-Set –
   Verweise auf Pool-Fragen je Klausurthema, keine Kopien (K2-E3). Gezogen wird mit derselben Regel wie
   im Bereich Ueben (`kern/klausur.ts` → `ziehe`), gezeichnet mit denselben Teilen (`UebenKarte`,
   `Serienzeile`, `Fussleiste` aus Ueben.tsx) – kein Nachbau.
   * K2-E11: Antworten zaehlen ganz normal (Lernstand, Fehler-Deck, Statistik, Bereitschaft).
   * K2-E17: alle Themen gemischt; Themen an-/abwaehlbar. Die Wahl gilt fuer die Sitzung (sie steht
     bewusst NICHT im Lernstand – kein neues Feld, keine Migration).
   * K2-E18: mit Subnetting oder RAID jede fuenfte Ziehung eine Rechenaufgabe.
   * 25.11.2026 (Nutzer-Wunsch, BUILD_LOG 275): „Kann ich schon“ auch hier, wie in Üben (kern/gekonnt.ts).
     Sind alle Fragen der Auswahl uebersprungen, sagt die Leer-Anzeige, wo man sie zurueckholt.
   Vorher (N28, E47): nur ein Zaehlschirm fuer M09 – M09 ist weiter leer (Waechter im Test).
   ============================================================================ */
import { useCallback, useEffect, useEffectEvent, useMemo, useReducer, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { FRAGEN, frageMitId } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import type { StandHaken } from "@/huelle/useLernstand";
import { nachDemZiehen } from "@/kern/ziehen";
import { UEBEN_START, uebenSchritt, angebotMoeglich } from "@/kern/uebenablauf";
import { serienKandidaten } from "@/kern/serie";
import { istGekonnt } from "@/kern/gekonnt";
import {
  KLAUSUR_SET, klausurBestand, klausurFortschritt, klausurIds, klausurSicht, zieheFuerKlausur, type KlausurSet,
} from "@/kern/klausur";
import { UebenKarte, Serienzeile, Fussleiste, Warnungen } from "./Ueben";

function datumDeutsch(iso: string): string {
  const [j, m, t] = iso.split("-");
  return j && m && t ? `${t}.${m}.${j}` : iso;
}

export function Klausurvorbereitung({ lernstand, set = KLAUSUR_SET }: {
  lernstand: StandHaken;
  set?: KlausurSet;
}) {
  const { stand } = lernstand;
  /** Gewaehlte Themen (Nummern); leer = alle. */
  const [themen, setzeThemen] = useState<number[]>([]);
  const [ablauf, schritt] = useReducer(uebenSchritt, UEBEN_START);
  const bestand = useMemo(() => klausurBestand(set, frageMitId), [set]);
  const schluessel = themen.join(",");

  const zieheNaechste = useCallback(() => {
    const s = lernstand.stand;
    const z = zieheFuerKlausur({
      stand: s, alle: FRAGEN, nachId: (id) => frageMitId(id),
      letzteThemen: ablauf.letzteThemen, serie: ablauf.serie, heute: Date.now(),
      set, themen,
    });
    const zug = z.zug;
    if (zug) lernstand.aendere((alt) => nachDemZiehen(alt, zug, z.frage));
    schritt({ art: "gezogen", ergebnis: z.ergebnis, serieVerbraucht: z.serieVerbraucht });
  }, [lernstand, ablauf.letzteThemen, ablauf.serie, set, themen]);

  /* Wie in Ueben.tsx: genau einmal je Auswahl ziehen – Ausloeser ist die Themenwahl. */
  const zieheBeiWechsel = useEffectEvent(() => zieheNaechste());
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    zieheBeiWechsel();
  // oxlint-disable-next-line react/exhaustive-effect-dependencies -- Absicht: `schluessel` ist der Ausloeser (neu ziehen bei Themenwechsel); gelesen wird er im Effekt-Ereignis
  }, [schluessel]);

  function umschalten(nr: number) {
    schritt({ art: "wechsle" });
    setzeThemen((alt) => (alt.includes(nr) ? alt.filter((x) => x !== nr) : [...alt, nr].sort((a, b) => a - b)));
  }
  function alle() {
    if (!themen.length) return;
    schritt({ art: "wechsle" });
    setzeThemen([]);
  }

  /* #60 wie beim Ueben – die Serie bleibt im Set. */
  function aufErgebnis(f: Frage, korrekt: boolean) {
    if (!angebotMoeglich(ablauf, korrekt)) return;
    const ids = klausurIds(set, themen);
    const ausSet = FRAGEN.filter((x) => ids.has(x.id));
    const kand = serienKandidaten(klausurSicht(lernstand.stand), ausSet, (id) => frageMitId(id), f);
    if (kand.length) schritt({ art: "angebot", frage: f, ids: kand });
  }

  const gesamt = klausurIds(set, []).size;
  const auswahl = [...klausurIds(set, themen)];
  const allesUebersprungen = auswahl.length > 0 && auswahl.every((id) => istGekonnt(stand, id));
  const fortschritt = klausurFortschritt(set, stand);
  const punkte = new Map(set.themen.map((t) => [t.nr, t.punkte]));
  const punkteSumme = set.themen.reduce((a, t) => a + (t.punkte ?? 0), 0);

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-0">
      <div>
        <Warnungen lernstand={lernstand} />
        <div className="px-6 pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-[0.9375rem] font-semibold">{set.name}</h2>
            <span className="text-[0.8125rem] text-muted-foreground tabular-nums">
              Klausur ca. {datumDeutsch(set.datum)} · {punkteSumme ? `${punkteSumme} Punkte · ` : ""}{gesamt} Fragen aus dem Pool
            </span>
          </div>
          <fieldset className="m-0 mt-2.5 flex min-w-0 flex-wrap gap-1.5 border-0 p-0">
            <legend className="sr-only">Themen der Klausur</legend>
            <Button size="sm" variant={themen.length ? "outline" : "secondary"} aria-pressed={!themen.length}
                    onClick={alle}>
              Alle Themen
            </Button>
            {bestand.map((t) => {
              const an = themen.includes(t.nr);
              const p = punkte.get(t.nr);
              const geuebt = fortschritt.get(t.nr) ?? 0;
              return (
                <Button key={t.nr} size="sm" variant={an ? "secondary" : "outline"} aria-pressed={an}
                        aria-label={`${t.titel}, ${p ? `${p} Punkte, ` : ""}${t.anzahl} Fragen, ${geuebt} geübt`}
                        title={`${geuebt} von ${t.anzahl} Fragen in diesem Durchgang geübt (ohne offene Fehler)`}
                        className={cn("gap-2", an && "ring-1 ring-ring")}
                        onClick={() => umschalten(t.nr)}>
                  {t.titel}
                  {p ? <span className="text-[0.6875rem] tabular-nums text-muted-foreground">{p} P.</span> : null}
                  <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">{geuebt}/{t.anzahl}</span>
                </Button>
              );
            })}
          </fieldset>
        </div>
      </div>

      <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto_auto] px-6 pt-3.5 pb-6 text-base">
        {gesamt === 0 ? (
          <Card className="grid place-items-center px-8 text-center text-sm text-muted-foreground">
            Gerade kein Klausurstoff.
          </Card>
        ) : (
          <UebenKarte ablauf={ablauf} schritt={schritt} lernstand={lernstand} aufErgebnis={aufErgebnis}
                      naechste={zieheNaechste}
                      leerText={allesUebersprungen
                        ? "Alle Fragen dieser Auswahl hast du mit „Kann ich schon“ übersprungen. Zurückholen kannst du sie unter „Markierte Fragen“."
                        : undefined} />
        )}
        <Serienzeile ablauf={ablauf} schritt={schritt} />
        <Fussleiste ablauf={ablauf} stand={stand} schritt={schritt} naechste={zieheNaechste} />
      </div>
    </div>
  );
}
