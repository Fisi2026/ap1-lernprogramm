/* ============================================================================
   DIE PRUEFUNGSSIMULATION (Bereich `sim`) — DER SCHIRM

   Drei Lagen, wie in der alten App: **Start** (Fragenzahl, Punktevorschau,
   Historie), **Lauf** (Uhr, Navigation, Frage) und **Auswertung**.

   ⛔ Gerechnet und gezogen wird in `kern/simulation.ts` — und damit in logik.js.
      Hier steht nur, was Oberflaeche ist.
   ⛔ WAEHREND DES LAUFS WIRD NICHTS BEWERTET UND NICHTS GEZEIGT: keine Loesung,
      keine Rueckseite, kein Urteil. Eine Pruefung, die nebenbei verraet, ob die
      Antwort stimmt, ist keine.
   ⚠️ DIE UHR LAEUFT NACH DER WANDUHR, nicht nach gezaehlten Ticks: ein
      gedrosselter Hintergrund-Tab wuerde die Pruefungszeit sonst verlaengern.
      Dieselbe Begruendung steht in app_sim.js (R3).
   ⚠️ Der Lauf lebt NUR im Schirm. Nur was bleiben soll, geht in den Lernstand:
      die gewaehlte Fragenzahl, das Wiederholungs-Gedaechtnis, die Historie und
      die falsch beantworteten Fragen (Fehler-Deck).
   ============================================================================ */
import { createElement, useEffect, useEffectEvent, useMemo, useReducer, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "cn";
import type { Frage, SimKarte } from "@/daten/typen";
import { FRAGEN } from "@/daten/laden";
import { FAELLE } from "@/daten/faelle";
import { eingabeFuer, wirkTyp, ZEICHNUNG_IST_EINGABE } from "@/fragetypen/register";
import { Bildflaeche } from "@/fragetypen/Bildflaeche";
import { bildBeschriftung } from "@/kern/schalter";
import { instanziiere } from "@/kern/instanz";
import type { StandHaken } from "@/huelle/useLernstand";
import type { Lernstand } from "@/kern/stand";
import { AP1_AUFGABEN, aufgabeVon, punkteVerteilung, jeAufgabe, verbucheSimulation } from "@/kern/simulation";
import {
  simSchritt, simStart, bereiteLauf, restZeit, werteAus, type Lauf, type Auswertung,
} from "@/kern/simablauf";
import { uhrzeit } from "./uhrzeit";
import { neuerMischer } from "@/kern/anzeige";
import { MischKontext } from "@/fragetypen/mischung";

export function Simulation({ lernstand, pool }: {
  lernstand: StandHaken;
  /** ⚠️ Nur fuer Tests: ein gebauter Bestand. Ohne ihn zieht die Pruefung aus
      dem echten Pool — eine Bildfrage kaeme dort nur mit Glueck vor. */
  pool?: readonly Frage[];
}) {
  const { stand } = lernstand;
  /* N37 U5 (E60): der ABLAUF (Start → Lauf → Auswertung, Antworten, Sprung, Marke, Restzeit) ist ein
     reiner Reducer in `kern/simablauf.ts` (DOM-frei getestet). Hier bleiben nur Uhr und Lernstand. */
  const [ablauf, schritt] = useReducer(simSchritt, stand, simStart);
  const { lauf, fertig, anzahl, restSek } = ablauf;
  /* N31/E27: eine laufende Pruefung ist ein Grund fuer die Rueckfrage im anderen Tab. */
  const laeuft = lauf !== null;
  const quelle = lernstand.quelle;
  useEffect(() => {
    quelle.setzeLauf("simulation", laeuft);
    return () => quelle.setzeLauf("simulation", false);
  }, [quelle, laeuft]);
  /* Die Punkteverteilung wird beim Betreten gewuerfelt und beim Start
     EINGEFROREN — Vorschau und Pruefung zeigen garantiert dieselben Werte. */
  const vorschau = useMemo(() => punkteVerteilung(), []);
  /* N47 A: EIN Mischer je Pruefung – die Eingabe wird je Blaettern neu eingehaengt
     (`key: lauf.idx`), die Reihenfolge der Optionen muss aber bleiben, auch in der Auswertung. */
  const [mischer, setzeMischer] = useState(() => neuerMischer());

  /* ⛔ Die Abgabe haengt an der Uhr, und die Uhr laeuft in einem Effekt. Damit der
     Effekt nicht bei jeder Antwort neu aufgesetzt wird, liegt die Abgabe in einem
     Ref — sonst startete die Uhr bei jedem Tastendruck von vorn.
     N32: der Ref wurde im Zeichnen beschrieben (oxlint refs). Jetzt ist die Abgabe eine
     gewoehnliche Funktion fuer den Knopf, und die Uhr ruft sie ueber ein Effekt-Ereignis
     (React 19.2) - es sieht immer den neuesten Lauf und ist keine Abhaengigkeit. */

  function starte() {
    const b = bereiteLauf(stand, anzahl, vorschau, pool ?? FRAGEN, FAELLE, Date.now());
    if (!b) return;
    lernstand.aendere((s) => ({ ...s, simAnzahl: b.n, simUsedIds: b.benutzt }));
    setzeMischer(neuerMischer());
    schritt({ art: "gestartet", lauf: b.lauf });
  }

  function abgeben() {
    if (!lauf) return;
    const a = werteAus(lauf, restSek);
    lernstand.aendere((s) => verbucheSimulation(s, a.fragen, a.korrekt, a.erg, a.zeitSek));
    schritt({ art: "abgegeben", auswertung: a });
  }
  const abgabeDerUhr = useEffectEvent(abgeben);

  /* Die Uhr. ⚠️ Haengt NUR am Start des Laufs — nicht an der Restzeit, sonst
     baute sich der Intervall jede Sekunde neu auf. */
  useEffect(() => {
    if (!lauf) return undefined;
    const t = setInterval(() => {
      const jetzt = Date.now();
      schritt({ art: "tick", jetzt });
      if (restZeit(lauf, jetzt) <= 0) abgabeDerUhr();
    }, 1000);
    return () => clearInterval(t);
  }, [lauf]);

  if (fertig) {
    return (
      <MischKontext.Provider value={mischer}>
        <Auswertungsschirm a={fertig} ariaAltTexte={stand.ariaAltTexte} aufNeu={() => schritt({ art: "neu" })} />
      </MischKontext.Provider>
    );
  }
  if (lauf) {
    return (
      <MischKontext.Provider value={mischer}>
      <Laufschirm
        lauf={lauf}
        restSek={restSek}
        ariaAltTexte={stand.ariaAltTexte}
        aufAntwort={(i, a) => schritt({ art: "antwort", i, antwort: a })}
        aufSprung={(i) => schritt({ art: "sprung", i })}
        aufMarke={() => schritt({ art: "marke" })}
        aufAbgabe={abgeben}
      />
      </MischKontext.Provider>
    );
  }
  return (
    <Startschirm
      stand={stand} anzahl={anzahl} setAnzahl={(n) => schritt({ art: "anzahl", anzahl: n })}
      vorschau={vorschau} aufStart={starte}
    />
  );
}

/* ------------------------------------------------------------------ Start */
function Startschirm({
  stand, anzahl, setAnzahl, vorschau, aufStart,
}: {
  stand: Lernstand;
  anzahl: number;
  setAnzahl: (n: number) => void;
  vorschau: number[];
  aufStart: () => void;
}) {
  const historie = stand.simHistorie || [];
  const dauer = stand.simDauerMin > 0
    ? stand.simDauerMin + " Minuten"
    : "automatisch aus den Richtwerten der Fragetypen";
  return (
    <div className="min-h-0 overflow-auto px-6 pt-4 pb-6">
      <div className="flex flex-col gap-4">
        <Card className="px-5 py-4">
          <p className="max-w-[80ch] text-[0.9375rem] leading-relaxed">
            Vier Aufgaben, 100 Punkte, eine gemeinsame Ausgangssituation — wie in der echten AP1.
            Zeit: <b>{dauer}</b>. Während des Laufs wird nichts bewertet und nichts verraten.
          </p>
          <div className="mt-4 flex flex-col gap-1.5">
            {AP1_AUFGABEN.map((a, bi) => (
              <div key={a.nr} className="text-[0.8125rem]">
                <b>{a.nr}. Aufgabe</b> ({vorschau[bi]} Punkte) — {a.titel}
              </div>
            ))}
          </div>
          {/* ⚠️ Die Verteilung ist gewuerfelt, nicht fest: die echte AP1 vergibt je
              Aufgabe 20 bis 30 Punkte. Das gehoert auf den Schirm, sonst wirkt eine
              andere Zahl beim naechsten Anlauf wie ein Fehler. */}
          <p className="mt-2 text-[0.75rem] text-muted-foreground">
            Die Punkte je Aufgabe schwanken von Prüfung zu Prüfung (20–30, Summe 100).
          </p>
        </Card>

        <Card className="flex flex-wrap items-center gap-3 px-5 py-4">
          {/* N25 P6b: `Field` waagerecht mit `FieldLabel` + `Input`. */}
          <Field orientation="horizontal" className="w-auto">
          <FieldLabel htmlFor="sim-anzahl" className="text-[0.8125rem] font-normal">Aufgaben insgesamt:</FieldLabel>
          <Input
            id="sim-anzahl"
            type="number"
            min={12}
            max={80}
            step={4}
            value={anzahl}
            onChange={(e) => setAnzahl(Number(e.target.value))}
            aria-label="Aufgaben insgesamt"
            className="h-9 w-24 px-3 text-[0.875rem] md:text-[0.875rem]"
          />
          </Field>
          <Button onClick={aufStart}>Prüfung starten</Button>
        </Card>

        {historie.length > 0 && (
          <Card className="px-5 py-4">
            <b className="mb-3 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Frühere Durchgänge
            </b>
            {/* Ein Trend aus Balken — die letzten zwölf, ältester links. */}
            <div className="flex h-24 items-end gap-1.5" aria-label="Verlauf der Ergebnisse">
              {historie.slice(-12).map((e, i) => (
                // oxlint-disable-next-line react/no-array-index-key -- Balken ohne Zustand; das Fenster der letzten 12 verschiebt sich, der Index genuegt
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[0.6875rem] tabular-nums text-muted-foreground">
                    {Math.round(e.prozent)}
                  </span>
                  <div
                    className="w-full rounded-t-[2px] bg-chart-1"
                    style={{ height: Math.max(3, e.prozent * 0.7) }}
                    title={String(e.datum) + ": " + e.prozent + " %"}
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.8125rem] text-muted-foreground">
              {historie.slice(-5).reverse()
                .map((e) => String(e.datum) + ": " + e.prozent + " % (Note " + String(e.note) + ")")
                .join(" · ")}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- Lauf */
function Laufschirm({
  lauf, restSek, ariaAltTexte, aufAntwort, aufSprung, aufMarke, aufAbgabe,
}: {
  lauf: Lauf;
  restSek: number;
  /** N24: dieselbe Beschriftungsregel wie auf der Übungskarte. */
  ariaAltTexte: boolean;
  aufAntwort: (i: number, a: unknown) => void;
  aufSprung: (i: number) => void;
  aufMarke: () => void;
  aufAbgabe: () => void;
}) {
  const roh = lauf.fragen[lauf.idx]!; // idx bleibt in 0..fragen.length-1 (Navigation)
  /* ⛔ Die gestellte Frage, nicht die Pool-Frage — sonst stuenden Platzhalter da.
     Der Schluessel ist die Frage selbst, damit sie nicht unter der Eingabe neu
     wuerfelt, wenn man blaettert. */
  const frage = useMemo(() => instanziiere(roh), [roh]);
  const Eingabe = eingabeFuer(frage);
  const bildtext = bildBeschriftung(frage, ariaAltTexte);
  const bi = aufgabeVon(frage);
  const aufgabe = AP1_AUFGABEN[bi]!; // aufgabeVon liefert 0..3
  const knapp = restSek < 300;

  return (
    <div className="min-h-0 overflow-auto px-6 pt-4 pb-6">
      <div className="flex flex-col gap-4">
        <Card className="px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <span
              aria-label="Restzeit"
              className={cn("font-mono text-[1.25rem] tabular-nums",
                knapp ? "text-destructive" : "text-foreground")}
            >
              {uhrzeit(restSek)}
            </span>
            <span className="text-[0.8125rem] text-muted-foreground tabular-nums">
              Frage {lauf.idx + 1} / {lauf.fragen.length}
            </span>
          </div>
          <div className="mt-3 text-[0.75rem] font-medium tracking-wider text-muted-foreground uppercase">
            {aufgabe.nr}. Aufgabe · {lauf.punkte[bi]} Punkte
          </div>
          <div className="text-[0.9375rem] font-medium">{aufgabe.titel}</div>
        </Card>

        {/* Die Navigation zeigt je Aufgabe, was beantwortet und was markiert ist. */}
        <Card className="px-5 py-4">
          {AP1_AUFGABEN.map((a, b) => {
            const idxs = lauf.fragen
              .map((f, i) => (aufgabeVon(f) === b ? i : -1))
              .filter((i) => i >= 0);
            if (!idxs.length) return null;
            return (
              <div key={a.nr} className="mb-3 last:mb-0">
                <div className="mb-1.5 text-[0.75rem] font-medium tracking-wider text-muted-foreground uppercase">
                  {a.nr}. Aufgabe ({lauf.punkte[b]} P)
                </div>
                <div className="flex flex-wrap gap-1">
                  {idxs.map((i) => (
                    /* N25 P6b: shadcn `Button` outline/icon-sm. ⚠️ Die Zustandsfarben brauchen
                       `dark:`, weil outline im Dunkeln eigene Hintergrund- und Randfarben setzt. */
                    <Button
                      key={i}
                      variant="outline"
                      size="icon-sm"
                      onClick={() => aufSprung(i)}
                      aria-label={"Frage " + (i + 1)}
                      data-beantwortet={lauf.antworten[i] != null ? "ja" : "nein"}
                      data-markiert={lauf.markiert[i] ? "ja" : "nein"}
                      className={cn(
                        "rounded-md text-[0.75rem] font-normal tabular-nums",
                        lauf.antworten[i] != null && "bg-chart-1/20 dark:bg-chart-1/20",
                        lauf.markiert[i] && "border-chart-4 dark:border-chart-4",
                        i === lauf.idx && "ring-2 ring-ring",
                      )}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>

        {typeof frage.fallSzenario === "string" && (
          <Card className="border-l-4 border-l-chart-4 px-5 py-4">
            <div className="text-[0.75rem] font-medium tracking-wider text-muted-foreground uppercase">
              Fallaufgabe
            </div>
            <div className="text-[0.9375rem] font-medium">{String(frage.fallTitel)}</div>
            <p className="mt-1 max-w-[80ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
              {frage.fallSzenario}
            </p>
          </Card>
        )}

        <Card className="px-5 py-4">
          <p className="mb-4 max-w-[80ch] text-[1.0625rem] leading-relaxed">{frage.frage}</p>
          {/* ⛔ N23: die Zeichnung fehlte hier GANZ — `bild` ist simAuto, also kommen
              Bildfragen in der Pruefung vor und liefen ohne ihr Bild (derselbe Fehler
              wie im Uebungsschirm vor N19). Tooltips gibt es hier bewusst nicht. */}
          {"svg" in frage && typeof frage.svg === "string" && !ZEICHNUNG_IST_EINGABE.has(wirkTyp(frage)) && (
            <Bildflaeche svg={frage.svg} klasse="mb-4 max-w-[80ch]" beschriftung={bildtext} />
          )}
          {Eingabe ? (
            /* ⛔ `gesperrt` ist IMMER falsch: in der Pruefung darf man bis zur
               Abgabe jede Antwort aendern. Und es wird nichts bewertet. */
            /* N32: createElement - `Eingabe` kommt stabil aus dem Register (oxlint static-components). */
            createElement(Eingabe, {
              key: lauf.idx,
              frage,
              antwort: lauf.antworten[lauf.idx],
              gesperrt: false,
              bildtext,
              aufAntwort: (a: unknown) => aufAntwort(lauf.idx, a),
            })
          ) : (
            <div className="rounded-md border border-dashed p-4 text-[0.8125rem] text-muted-foreground">
              Für den Typ <span className="font-mono">{frage.typ}</span> gibt es noch keine Eingabe.
            </div>
          )}
        </Card>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" disabled={lauf.idx === 0}
                  onClick={() => aufSprung(lauf.idx - 1)}>← Zurück</Button>
          <Button variant="outline" size="sm" onClick={aufMarke}>
            {lauf.markiert[lauf.idx] ? "Markierung entfernen" : "Später prüfen"}
          </Button>
          <Button variant="outline" size="sm" disabled={lauf.idx === lauf.fragen.length - 1}
                  onClick={() => aufSprung(lauf.idx + 1)}>Weiter →</Button>
          <Button size="sm" className="ml-auto" onClick={aufAbgabe}>Abgeben</Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Auswertung */
function Auswertungsschirm({ a, ariaAltTexte, aufNeu }: { a: Auswertung; ariaAltTexte: boolean; aufNeu: () => void }) {
  const je = jeAufgabe(a.fragen, a.korrekt, a.punkte);
  return (
    <div className="min-h-0 overflow-auto px-6 pt-4 pb-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Kennzahl gross={a.erg.punkte + " / " + a.erg.gesamt} klein="Punkte" />
          <Kennzahl gross={a.erg.prozent + " %"} klein="Ergebnis" />
          <Kennzahl gross={"Note " + a.erg.note.note} klein={a.erg.note.text} />
          <Kennzahl
            gross={a.erg.note.bestanden ? "Bestanden" : "Nicht bestanden"}
            klein="bestanden ab 50 %"
            gut={a.erg.note.bestanden}
          />
        </div>

        <Card className="px-5 py-4 text-[0.8125rem] text-muted-foreground">
          Benötigte Zeit: <b className="text-foreground">{uhrzeit(a.zeitSek)}</b> Minuten.
          Falsch beantwortete Fragen sind ins Fehler-Deck gewandert.
        </Card>

        <Card className="px-5 py-4">
          <b className="mb-3 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Ergebnis je Aufgabe
          </b>
          {je.map((e) => (
            <div key={e.aufgabe.nr} className="mb-3 last:mb-0">
              <div className="text-[0.875rem]">
                <b>{e.aufgabe.nr}. Aufgabe</b> — {e.aufgabe.titel}
              </div>
              <div className="text-[0.8125rem] text-muted-foreground tabular-nums">
                {e.richtig}/{e.gesamt} richtig · {e.punkte} / {e.maxPunkte} Punkte ({e.quote} %)
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-chart-1" style={{ width: e.quote + "%" }} />
              </div>
            </div>
          ))}
        </Card>

        <Card className="px-5 py-4">
          <b className="mb-3 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Alle Fragen im Überblick
          </b>
          {/* N25 P6b: `<details>` je Frage → `Accordion type="multiple"`, alle zu wie vorher.
              ⚠️ Zugeklappt steht die Erklaerung NICHT im DOM (anders als `<details>`). */}
          <Accordion type="multiple" className="flex flex-col gap-2">
            {a.fragen.map((f, i) => (
              // oxlint-disable-next-line react/no-array-index-key -- Balken ohne Zustand; das Fenster der letzten 12 verschiebt sich, der Index genuegt
              <AccordionItem key={f.id + "-" + i} value={f.id + "-" + i} className="rounded-lg border px-4">
                <AccordionTrigger className="py-2.5 text-[0.875rem] font-normal">
                  <span>
                  <Badge variant={a.korrekt[i] ? "secondary" : "destructive"}
                         className="mr-2 font-normal">
                    {a.korrekt[i] ? "richtig" : "falsch"}
                  </Badge>
                  Frage {i + 1} — {f.thema}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                <p className="mt-2 max-w-[80ch] text-[0.875rem] leading-relaxed">{f.frage}</p>
                {/* ⚠️ KEINE "Deine Antwort / Richtig"-Zeile: die alte App baut sie
                    fuer genau fuenf Typen aus typspezifischen Feldern zusammen und
                    laesst sie bei allen anderen weg. Diese Zeile hier nachzubauen
                    hiesse, die Antwortform ein zweites Mal zu beschreiben — sie
                    steht schon in kern/antwortform.ts. Die Erklaerung sagt, worauf
                    es ankommt, und die falschen Fragen kommen ueber das Fehler-Deck
                    ohnehin wieder. */}
                <p className="mt-2 max-w-[80ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {typeof f.erklaerungKurz === "string" && f.erklaerungKurz
                    ? f.erklaerungKurz
                    : "Zu dieser Frage ist keine Erklärung hinterlegt."}
                </p>
                <AuswertungsEingabe roh={f} antwort={a.antworten[i]} ariaAltTexte={ariaAltTexte} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div>
          <Button onClick={aufNeu}>Zurück zum Start</Button>
        </div>
      </div>
    </div>
  );
}

/** N47 B: die gesperrte Eingabe mit der gegebenen Antwort – die Eingabe markiert selbst die
    richtige Option bzw. zeigt „Richtig wäre" (dieselbe Darstellung wie auf der Uebungskarte,
    keine zweite Beschreibung der Antwortform). Ohne Eingabe fuer den Typ: nichts. */
function AuswertungsEingabe({ roh, antwort, ariaAltTexte }: { roh: SimKarte; antwort: unknown; ariaAltTexte: boolean }) {
  const frage = useMemo(() => instanziiere(roh), [roh]);
  const Eingabe = eingabeFuer(frage);
  if (!Eingabe) return null;
  return (
    <div className="mt-3 max-w-[80ch]" data-teil="auswertung-eingabe">
      {createElement(Eingabe, {
        frage, antwort, gesperrt: true, bildtext: bildBeschriftung(frage, ariaAltTexte), aufAntwort: () => {},
      })}
    </div>
  );
}

function Kennzahl({ gross, klein, gut }: { gross: string; klein: string; gut?: boolean }) {
  return (
    <Card className="px-4 py-3">
      <div className={cn("text-[1.25rem] font-medium",
        gut === true && "text-chart-1", gut === false && "text-destructive")}>
        {gross}
      </div>
      <div className="text-[0.75rem] text-muted-foreground">{klein}</div>
    </Card>
  );
}
