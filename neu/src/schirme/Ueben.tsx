import { useCallback, useEffect, useEffectEvent, useMemo, useReducer } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { FRAGEN, bestandJeGebiet, frageMitId } from "@/daten/laden";
import { GEBIETE, GEBIET_KURZ } from "@/daten/typen";
import type { Frage } from "@/daten/typen";
import type { StandHaken } from "@/huelle/useLernstand";
import type { Lernstand } from "@/kern/stand";
import { nachDemZiehen } from "@/kern/ziehen";
import { uebenPasst } from "@/kern/auswahl";
import { zufallsaufgabe, verbucheZufall, ueberspringeZufall } from "@/kern/generator";
import {
  UEBEN_START, uebenSchritt, zieheFuerUeben, aktuellerEintrag, istLive, kannZurueck, amEnde,
  angebotMoeglich, type UebenAktion, type UebenZustand,
} from "@/kern/uebenablauf";
import { serienKandidaten, starteSerie } from "@/kern/serie";
import { Karteikarte } from "./Karteikarte";
import { Zufallskarte } from "./Zufallskarte";

/* Der Karteikasten — und seit dem 14.09.2026 ZIEHT er, statt zu blaettern.

   ⛔ VORHER: `fragen[nummer]` mit Zurueck/Weiter durch das Fach. Das war ein
      Platzhalter und hat mit Lernen nichts zu tun: keine Wiederholung faelliger
      Fragen, keine Gewichtung, kein Deck. Jetzt entscheidet `kern/ziehen.ts`,
      welche Frage kommt — dieselbe Kaskade wie in der alten App.
   ⚠️ Die Reiter sind die AUSWAHL und werden im Lernstand gespeichert
      (`gebiete`), nicht bloss lokal gehalten. Sonst faellt die Wahl bei jedem
      Neuladen zurueck, und die Ziehung arbeitet auf einer anderen Menge als der,
      die der Lerner sieht.
   ⚠️ Eine Frage aus dem VERLAUF wird nicht noch einmal gebucht — genauso wie in
      der alten App (#52: "Live" ist die neueste, noch unbeantwortete Frage).
   N38 Q2 (30.09.2026): die Teile des Schirms (Warnungen, Fachreiter, Serienzeile, Fussleiste) sind
      Unterkomponenten; die Zufallskarte steht in `Zufallskarte.tsx`. */
/** ⛔ Der Lernstand kommt von OBEN (App.tsx). Ein eigener `useLernstand` hier
    waere eine zweite Fassung desselben Standes — Kopf und Schirm liefen
    auseinander, und wer im Kopf "12 heute" liest, saehe hier 13. */
export function Ueben({ lernstand }: { lernstand: StandHaken }) {
  const { stand } = lernstand;

  /* N37 U5 (E60): der ABLAUF steht als reiner Reducer in `kern/uebenablauf.ts` (DOM-frei getestet) –
     Verlauf mit Antworten, Zufallsaufgabe, "live", Themen-Serie (#60), Angebot, letzte Themen.
     Die Gruende der einzelnen Regeln stehen dort; die Fehler, die sie beheben, hier am Zeichnen. */
  const [ablauf, schritt] = useReducer(uebenSchritt, UEBEN_START);

  /** Der Bestand als Nachschlagewerk — einmal gebaut, nicht je Zug. */
  const bestand = useMemo(() => bestandJeGebiet(), []);
  const gewaehlt = stand.gebiete[0] ?? "";

  /* ⛔⛔ HIER LAG EIN FEHLER, GEFUNDEN AM 14.09.2026 VOM SCHIRM-TEST:
     Die erste Fassung hat GEZOGEN und dabei zwei aeussere Variablen gesetzt —
     mitten in einem `setState`-Updater. Ein Updater laeuft aber nicht sofort,
     sondern beim naechsten Zeichnen, und React darf ihn zweimal aufrufen. Die
     Zeilen danach lasen deshalb Werte, die es noch gar nicht gab: die Karte
     blieb bei "Wird gezogen …", und was danach gebucht wurde, fiel ins Leere.
     ►► **Ein State-Updater ist kein Ort fuer Seiteneffekte.** Gezogen wird jetzt
        VORHER, aus dem aktuellen Stand; der Updater tut nur noch eines. */
  const zieheNaechste = useCallback(() => {
    const s = lernstand.stand;
    const z = zieheFuerUeben(
      {
        stand: s, alle: FRAGEN, nachId: (id) => frageMitId(id),
        letzteThemen: ablauf.letzteThemen, serie: ablauf.serie,
        heute: Date.now(),
      },
      (f) => uebenPasst(s, f),
      () => zufallsaufgabe(s),
    );
    const zug = z.zug;
    if (zug) lernstand.aendere((alt) => nachDemZiehen(alt, zug, z.frage));
    schritt({ art: "gezogen", ergebnis: z.ergebnis, serieVerbraucht: z.serieVerbraucht });
  }, [lernstand, ablauf.letzteThemen, ablauf.serie]);

  /* ⛔⛔ HIER LAG EIN FEHLER, GEFUNDEN AM 14.09.2026 BEIM EINHAENGEN DES
     GENERATORS: die erste Fassung zog, "solange der Verlauf leer ist". Eine
     Zufallsaufgabe kommt aber gar nicht in den Verlauf — die Bedingung blieb
     also wahr, der Effekt lief wieder und wieder, und am Ende stand irgendeine
     Frage da statt der Aufgabe. **Eine Abbruchbedingung, die am Ergebnis haengt,
     bricht nicht ab, wenn das Ergebnis anderswo landet.**
     ►► Gezogen wird jetzt genau einmal je Auswahl: der Effekt haengt am
        gewaehlten Fach und sonst an nichts. Der Ref haelt die jeweils neueste
        Fassung von `zieheNaechste`, damit er nicht selbst zur Abhaengigkeit wird.
     N32: statt des Refs, der im Zeichnen beschrieben wurde, ein Effekt-Ereignis (React 19.2) -
        es sieht immer die neueste Fassung und ist keine Abhaengigkeit. */
  const zieheBeiWechsel = useEffectEvent(() => zieheNaechste());
  useEffect(() => {
    /* Gewollt: `gewaehlt` kommt aus dem gespeicherten Stand (auch ein anderer Tab kann ihn
       aendern) - das Ziehen folgt diesem aeusseren Zustand, nicht einem Klick. */
    // oxlint-disable-next-line react/set-state-in-effect
    zieheBeiWechsel();
  // oxlint-disable-next-line react/exhaustive-effect-dependencies -- Absicht: `gewaehlt` ist der Ausloeser (neu ziehen bei Fachwechsel); der Effekt liest es nicht, nur das Effekt-Ereignis
  }, [gewaehlt]);

  function wechsle(g: string) {
    /* ⚠️ Eine laufende Serie gehoert zum alten Fach — beim Wechsel ist sie hin (kern/uebenablauf.ts). */
    schritt({ art: "wechsle" });
    lernstand.aendere((s) => ({ ...s, gebiete: g ? [g] : [], themen: [] }));
    /* gezogen wird im Effekt oben, sobald `gewaehlt` sich geaendert hat */
  }

  /* #60: nach einer FALSCHEN Antwort eine kleine Serie aus demselben Thema
     anbieten — aber nur, wenn gerade keine laeuft und es ueberhaupt etwas zu
     ueben gibt. Die Regel selbst steht in `kern/serie.ts`. */
  function aufErgebnis(f: Frage, korrekt: boolean) {
    if (!angebotMoeglich(ablauf, korrekt)) return;
    const ids = serienKandidaten(lernstand.stand, FRAGEN, (id) => frageMitId(id), f);
    if (ids.length) schritt({ art: "angebot", frage: f, ids });
  }

  return (
    /* ⛔ N25b: Ueben liefert GENAU EIN Grid-Item an `main`. Vorher waren Warnungen, Filterleiste
       und Kartenbereich drei Geschwister - `main` hat aber nur zwei Zeilen (auto, 1fr), also fiel
       der Kartenbereich in eine implizite auto-Zeile. Gemessen 22.09. bei 390 px: die gestapelte
       Karte verlangte 581 px, die Filterleiste wurde auf 0 px gequetscht und lief ueber die Karte
       (alt 71/364/364 -> neu 139/0/660). Hier steht die Verteilung jetzt ausdruecklich. */
    <Tabs value={gewaehlt || "alle"} onValueChange={(g) => wechsle(g === "alle" ? "" : g)}
          className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-0">
      <div>
        <Warnungen lernstand={lernstand} />
        <Fachreiter bestand={bestand} />
      </div>

      {/* N39 A4: die Karte ist das Tab-Panel der Reiter (aria-controls zeigt sonst ins Leere). */}
      <TabsContent value={gewaehlt || "alle"}
                   className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto_auto] px-6 pt-3.5 pb-6 text-base">
        <UebenKarte ablauf={ablauf} schritt={schritt} lernstand={lernstand} aufErgebnis={aufErgebnis}
                    naechste={zieheNaechste} />

        <Serienzeile ablauf={ablauf} schritt={schritt} />
        <Fussleiste ablauf={ablauf} stand={stand} schritt={schritt} naechste={zieheNaechste} />
      </TabsContent>
    </Tabs>
  );
}

/** Die Karte des Ablaufs: Zufallsaufgabe, Karteikarte oder Hinweis. Gemeinsam fuer Ueben und
    Klausurvorbereitung (K2, PLAN_KLAUSUR2 §4: kein Nachbau) – der Ablauf kommt von aussen. */
export function UebenKarte({ ablauf, schritt, lernstand, aufErgebnis, naechste, leerText }: {
  ablauf: UebenZustand;
  schritt: (a: UebenAktion) => void;
  lernstand: StandHaken;
  aufErgebnis: (f: Frage, korrekt: boolean) => void;
  /** „Kann ich schon“ (25.11.2026): Üben und Klausurvorbereitung reichen es durch (Nutzer-Wunsch 25.11.,
      BUILD_LOG 275). Die Klausur-Ziehung laeuft ueber `ziehe` mit dem Lernstand und blendet gekonnte
      Fragen damit aus wie Üben (kern/ziehen.ts). Fehlt es, gibt es keinen Knopf. */
  naechste?: (() => void) | undefined;
  /** Eigener Text, wenn nichts zu ziehen ist (Klausurvorbereitung: alles übersprungen). */
  leerText?: string | undefined;
}) {
  const { stand } = lernstand;
  const { idx, herkunft, leer, zufall } = ablauf;
  const eintrag = aktuellerEintrag(ablauf);
  const roh = eintrag ? frageMitId(eintrag.id) : undefined;
  /* ⛔ Nur die NEUESTE Karte ist "live" und wird gebucht. */
  const live = istLive(ablauf);
  return (
    zufall ? (
      <Zufallskarte
        key={zufall.id + "-" + stand.uebenZaehler}
        aufgabe={zufall}
        nummer={stand.uebenZaehler}
        merk={lernstand}
        buche={(richtig) => {
          /* ⛔ ZWEIMAL buchen, genau wie die alte App: die eigene
             GEN:-Zeile UND die normale Statistik — aber nie ins
             Fehler-Deck (gewuerfelte Werte kommen nie wieder). */
          lernstand.aendere((s) => verbucheZufall(s, zufall, richtig));
          lernstand.buche(zufall, richtig, { keinFehlerDeck: true });
        }}
        kannIchSchon={naechste ? () => {
          /* ⚠️ Gezogen wird mit dem Stand dieses Zeichnens (vor dem Ausblenden). Unschaedlich: nach einer
             Zufallsaufgabe kommt nie gleich die naechste (`lastTyp`, kern/ziehen.ts und kern/klausur.ts). */
          lernstand.aendere((s) => ueberspringeZufall(s, zufall, Date.now()));
          naechste();
        } : undefined}
      />
    ) : roh && eintrag ? (
      <Karteikarte
        key={`${eintrag.id}-${idx}`}
        frage={roh}
        nummer={idx + 1}
        herkunft={live ? herkunft : "verlauf"}
        buche={live ? lernstand.buche : undefined}
        merk={lernstand}
        abruf={stand.abrufAn}
        antwortAusVerlauf={live ? undefined : eintrag.antwort}
        aufAntwortGemerkt={live
          ? (a) => schritt({ art: "antwortGemerkt", antwort: a })
          : undefined}
        aufErgebnis={live ? aufErgebnis : undefined}
        ueberspringen={live ? naechste : undefined}
      />
    ) : (
      <Card className="grid place-items-center px-8 text-center text-sm text-muted-foreground">
        {leer
          ? (leerText ?? "Zu dieser Auswahl gibt es keine Frage. Wähle ein anderes Fach.")
          : "Wird gezogen …"}
      </Card>
    )
  );
}

/** Speicher- und Lesefehler des Lernstands – oberhalb der Reiter. */
export function Warnungen({ lernstand }: { lernstand: StandHaken }) {
  return (
    <>
      {lernstand.speicherFehler && (
        <div className="mx-6 mt-4 rounded-md border border-destructive/50 px-4 py-2.5 text-[0.8125rem] text-destructive">
          Dein Fortschritt kann gerade <b>nicht gespeichert</b> werden (Speicher voll oder
          blockiert). Was du jetzt übst, geht beim Schließen verloren.
        </div>
      )}
      {lernstand.befund === "unlesbar" && (
        <div className="mx-6 mt-4 rounded-md border border-destructive/50 px-4 py-2.5 text-[0.8125rem] text-destructive">
          Der gespeicherte Lernstand war <b>nicht lesbar</b> — es wird mit einem leeren Stand
          weitergearbeitet.
        </div>
      )}
    </>
  );
}

/** Die Reiter der Fachgebiete – sie SIND die Auswahl (gespeichert in `gebiete`).
    Der `Tabs`-Rahmen steht in `Ueben`, damit die Karte das zugehoerige Panel ist (N39 A4). */
function Fachreiter({ bestand }: { bestand: ReturnType<typeof bestandJeGebiet> }) {
  const faecher = GEBIETE.filter((g) => g.teil !== "M09" && bestand[g.id] > 0);
  return (
    <div className="px-6 pt-4">
        {/* ⛔ N25b, gemessen 22.09.: `h-auto` allein genuegt NICHT - die Liste traegt aus shadcn
            die Variante `group-data-horizontal/tabs:h-8`, die tw-merge nicht ersetzt. Die Leiste
            blieb 32 px hoch, waehrend ihre Kinder auf scrollHeight 131 umbrachen und SICHTBAR
            ueber die Karte liefen. Deshalb die Variante unter md ausdruecklich aufheben.
            ⚠️ Nutzer-Entscheid 22.09.: umbrechen (alle 9 Gebiete sichtbar), nicht rollen. */}
        <TabsList className="h-auto w-full gap-0.5 p-1 max-md:flex-wrap max-md:group-data-horizontal/tabs:h-auto">
          <TabsTrigger value="alle" className="min-w-0 flex-none px-3 text-[0.8125rem]">
            Alles
          </TabsTrigger>
          {faecher.map((g, i) => (
            <TabsTrigger
              key={g.id}
              value={g.id}
              title={g.name}
              className={cn(
                "min-w-0 flex-1 justify-start gap-2 px-3 text-[0.8125rem] max-md:basis-[8.5rem]",
                i > 0 && faecher[i - 1]!.teil !== g.teil && "ml-3",
              )}
            >
              <span className="font-mono text-[0.6875rem] tracking-wide text-muted-foreground">{g.id}</span>
              <span className="min-w-0 truncate">{GEBIET_KURZ[g.id]}</span>
              <span className="ml-auto font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
                {bestand[g.id]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
    </div>
  );
}

/** ⚠️ Das Angebot steht UNTER der Karte, nicht darin: die Karteikarte
    weiss nichts von Serien, und sie soll auch nichts davon wissen. */
export function Serienzeile({ ablauf, schritt }: { ablauf: UebenZustand; schritt: (a: UebenAktion) => void }) {
  const { angebot, serie } = ablauf;
  if (angebot) {
    return (
      <div className="pt-3">
        <Button variant="secondary" size="sm"
                onClick={() => schritt({ art: "serieStarten", ids: starteSerie(angebot.ids) })}>
          📚 Mehr zu diesem Thema üben ({angebot.frage.thema})
        </Button>
      </div>
    );
  }
  if (serie.length) {
    return (
      <div className="pt-3 text-[0.8125rem] text-muted-foreground">
        Themen-Serie läuft — noch {serie.length}{" "}
        {serie.length === 1 ? "Frage" : "Fragen"} zu diesem Thema.
      </div>
    );
  }
  return <div />;
}

/** Zurueck, Zaehler und der Weg vorwaerts. */
export function Fussleiste({ ablauf, stand, schritt, naechste }: {
  ablauf: UebenZustand;
  stand: Lernstand;
  schritt: (a: UebenAktion) => void;
  naechste: () => void;
}) {
  const imDeck = Object.keys(stand.fehlerDeck).length;
  return (
    <div className="flex items-center justify-between gap-4 pt-3.5 text-[0.8125rem] text-muted-foreground">
      {/* ⛔⛔ GEFUNDEN AM 17.09.2026 IM RAUCHTEST (N20a): war die ERSTE Karte einer
          Sitzung eine Zufallsaufgabe, gab es noch keine echte Frage im Verlauf –
          „Zurück“ war trotzdem frei, nahm die Aufgabe weg und liess „Wird gezogen …“
          ohne Ausweg stehen. Seit N7 so; kein Test ging diesen Weg. */}
      <Button variant="outline" size="sm" disabled={!kannZurueck(ablauf)}
              onClick={() => schritt({ art: "zurueck" })}>
        ← Zurück
      </Button>
      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          {stand.uebenZaehler} geübt
          {imDeck > 0 && (
            <> · {imDeck} im Fehler-Deck</>
          )}
        </span>
      </div>
      {/* ⛔⛔ HIER GAB ES KEINEN WEG VORWAERTS: der Knopf hing an `live`, und
          bei einer Zufallsaufgabe ist `live` falsch (sie steht nicht im
          Verlauf). Wer eine Zufallsaufgabe vor sich hatte, kam nicht weiter.
          Gefunden am 14.09.2026 vom Einstellungs-Test, der einfach
          weiterklicken wollte.
          ►► Maszgeblich ist, ob man AM ENDE steht — und das ist man bei einer
             Zufallsaufgabe immer. */}
      {amEnde(ablauf) ? (
        <Button size="sm" onClick={naechste}>Nächste Frage →</Button>
      ) : (
        <Button variant="outline" size="sm"
                onClick={() => schritt({ art: "zurAktuellen" })}>
          Zur aktuellen →
        </Button>
      )}
    </div>
  );
}
