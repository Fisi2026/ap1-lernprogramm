/* Die Karteikarte — eine gestellte Frage mit Eingabe, Pruefen und Rueckseite.
   N32 (23.09.2026): aus Ueben.tsx herausgezogen (die Datei hatte 722 Zeilen). Inhalt unveraendert;
   benutzt von Ueben, Tagesserie, Markiert und Einzelfrage.
   N38 Q2 (30.09.2026): der ABLAUF (wann gebucht wird, genau einmal) steht als reiner Reducer in
   `kern/kartenablauf.ts` (DOM-frei getestet); die Teile der Karte sind Unterkomponenten. Die
   Gruende der Regeln stehen dort, die Fehler, die sie beheben, hier am Zeichnen. */
import { createElement, useMemo, useReducer } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "cn";
import type { Frage } from "@/daten/typen";
import {
  eingabeFuer, wirkTyp, EIGENES_URTEIL, ZEICHNUNG_IST_EINGABE, FRAGETEXT_IST_EINGABE,
} from "@/fragetypen/register";
import { Bildflaeche } from "@/fragetypen/Bildflaeche";
import { Fragetext } from "./Fragetext";
import { Rueckseite } from "./Rueckseite";
import { Melden } from "./Melden";
import { Vorlesen } from "./Vorlesen";
import type { MerkHaken } from "./Melden";
import { Kartenkopf } from "./Kartenkopf";
import { Star } from "lucide-react";
import { istMarkiert, schalteMarkierung } from "@/kern/markiert";
import { istGekonnt, holeZurueck, setzeGekonnt, ueberspringe } from "@/kern/gekonnt";
import { hatGeantwortet } from "@/fragetypen/vertrag";
import { grade as bewerte, istAutomatischBewertbar } from "@/kern/bewertung";
import { instanziiere } from "@/kern/instanz";
import { abrufGilt, bildBeschriftung } from "@/kern/schalter";
import { typHilfeFuer, hilfeTyp, blendeHilfeAus } from "@/kern/typhilfe";
import {
  kartenStart, kartenSchritt, zuBuchen, beurteilerFuer, kartenBewerterTyp, type KartenAktion,
} from "@/kern/kartenablauf";
import type { Herkunft } from "@/kern/ziehen";
import { RechnerKlappe } from "./Rechner";
import { RECHNER_TYPEN } from "@/kern/rechnertasten";

/** ⚠️ Ausdruecklich exportiert, damit `ueben.jsdom.test.tsx` eine EINZELNE Karte
    mit einer bestimmten Frage fahren kann. Ueber den ganzen Schirm kaeme man nur
    an die Frage, die im Bestand gerade vorn liegt — und der Fall, der gefaehrlich
    ist (zweimal auf eine Selbsteinschaetzung klicken), braucht `freitext`. */
export function Karteikarte({
  frage: roh, nummer, herkunft, buche, antwortAusVerlauf, aufAntwortGemerkt, aufErgebnis, merk, abruf = false,
  ueberspringen,
}: {
  frage: Frage;
  nummer: number;
  /* Woher die Frage kommt — "verlauf" heisst: schon beantwortet, wird NICHT
     noch einmal gebucht (alte App #52). */
  herkunft?: Herkunft | "verlauf" | undefined;
  /** fehlt bei einer Frage aus dem Verlauf: dann wird nichts gebucht. */
  buche?: ((frage: Frage, korrekt: boolean, opt?: { keinFehlerDeck?: boolean }) => void) | undefined;
  /** Die damals gegebene Antwort — nur bei einer Karte aus dem Verlauf. */
  antwortAusVerlauf?: unknown;
  /** Meldet jede Eingabe nach oben, damit der Verlauf sie behaelt. */
  aufAntwortGemerkt?: ((antwort: unknown) => void) | undefined;
  /** Meldet das Ergebnis nach oben — genau einmal je Karte, gleichzeitig mit
      dem Verbuchen. Daran haengt das Serien-Angebot (#60). */
  aufErgebnis?: ((frage: Frage, korrekt: boolean) => void) | undefined;
  /** Lernstand für Stern und Melden (N20a). Fehlt er, gibt es beides nicht. */
  merk?: MerkHaken | undefined;
  /** N24: die Abruf-Übung (#98, `abrufAn`). ⛔ Nur die Übungswege reichen sie
      durch — Üben, Tagesserie, Markiert. Die Einzelfrage lässt sie weg (E15). */
  abruf?: boolean;
  /** „Kann ich schon“ (25.11.2026, kern/gekonnt.ts): zur naechsten Frage. ⛔ Nur die Uebungswege
      reichen es durch – Üben, Tagesserie, Markiert. Fehlt es, gibt es keinen der beiden Knoepfe. */
  ueberspringen?: (() => void) | undefined;
}) {
  /* ⛔⛔ EINE KARTE AUS DEM VERLAUF IST BEREITS BEANTWORTET, UND SIE MUSS AUCH SO
     AUSSEHEN. Gefunden am 14.09.2026 vom Schirm-Test: sie wurde als frische Karte
     neu aufgebaut (eigenes `key`), zeigte wieder "Lösung prüfen" und "Aufgeben" —
     und ein Klick darauf verpuffte still, weil `buche` dort fehlt. Eine Bedienung,
     die nichts tut, ist schlimmer als keine.
     ⚠️ SEIT 15.09.2026 traegt sie auch die damals GEGEBENE Antwort wieder — der
        Verlauf haelt sie mit (`VerlaufEintrag`). Vorher stand hier nur die
        Loesung, und gerade bei `freitext` fehlte damit das, worauf es ankommt. */
  const ausVerlauf = herkunft === "verlauf";
  const [zustand, schritt] = useReducer(kartenSchritt, undefined, () => kartenStart(ausVerlauf, antwortAusVerlauf));
  const { antwort, geprueft, aufgedeckt } = zustand;

  /* ⛔ DIE GESTELLTE FRAGE, NICHT DIE POOL-FRAGE. 27 Fragen tragen `variablen`
     und 2 `varianten` — ihr Text traegt Platzhalter, ihre Schritte Formeln.
     Ohne diese Zeile stuende woertlich "{dauerA}" auf der Karte und keine
     Eingabe koennte richtig sein. Fuer alle anderen ist es ein Durchreicher.
     ⚠️ useMemo, nicht bei jedem Zeichnen: sonst wuerfelt die Frage unter der
        laufenden Eingabe neue Zahlen. Der Schluessel ist die Frage selbst —
        die Karte bekommt in Ueben() ohnehin ein frisches `key` je Frage. */
  const frage = useMemo(() => instanziiere(roh), [roh]);
  const beurteile = useMemo(() => beurteilerFuer(frage), [frage]);

  const Eingabe = eingabeFuer(frage);
  const automatisch = istAutomatischBewertbar(kartenBewerterTyp(frage));
  const eigenes = EIGENES_URTEIL.has(frage.typ);
  const verdeckt = !ausVerlauf && !aufgedeckt && abrufGilt(frage, abruf);
  const bildtext = bildBeschriftung(frage, !!merk?.stand.ariaAltTexte);
  /* N24b: die Typ-Hilfe. Ohne Lernstand kein Haken zum Abschalten – dann auch keine Hilfe. */
  const hilfe = merk ? typHilfeFuer(frage, merk.stand) : null;
  const urteil = geprueft && automatisch ? bewerte(frage, antwort) : null;
  /* `grade` liefert seit N34 T2 nur bool oder null (kein Teilpunkte-Objekt) – T6b, 27.09.2026. */
  const richtig = urteil === true;

  /* ============================= VERBUCHEN =============================
     ⛔ WANN gebucht wird, haengt am Typ (Regel: `zuBuchen` in kern/kartenablauf.ts).
     ⚠️ DIE MITTE ("Teilweise") ZAEHLT ALS NICHT RICHTIG, KOMMT ABER NICHT INS
        FEHLER-DECK (alte App app_loeser.js:704) – Regel in kern/verbuchen.ts. */
  /* „Kann ich schon“: nur an einer live Karte mit Lernstand. Vor der Antwort bucht es wie eine
     richtige Antwort und blendet aus (ein Schreiben, kern/gekonnt.ts), dann geht es weiter.
     ⚠️ `aufErgebnis` meldet es wie eine richtige Antwort – Tagesserie und Markiert zaehlen daran. */
  /* ⚠️ Kein `!ausVerlauf` hier: eine Karte aus dem Verlauf zeichnet weder die Knopfzeile noch die
     Abruf-Uebung noch den Zweig nach dem Pruefen (Sabotage 25.11.: die Sperre sperrte nichts). */
  const ueberspringbar = !!(ueberspringen && merk && buche);
  function kannIchSchon() {
    if (!ueberspringen || !merk || !buche) return;
    merk.aendere((s) => ueberspringe(s, frage, roh.id, Date.now()));
    aufErgebnis?.(frage, true);
    ueberspringen();
  }

  function tu(a: KartenAktion) {
    const b = zuBuchen(zustand, a, beurteile);
    schritt(a);
    if (a.art === "antwort") aufAntwortGemerkt?.(a.antwort);
    if (!b) return;
    schritt({ art: "gebucht" });
    buche?.(frage, b.korrekt, { keinFehlerDeck: b.keinFehlerDeck });
    aufErgebnis?.(frage, b.korrekt);
  }

  return (
    <Card className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden py-0">
      <Kartenkopf kennung={frage.id} thema={frage.thema} schwierigkeit={frage.schwierigkeit} nummer={nummer}>
        {merk && <Stern id={roh.id} merk={merk} />}
      </Kartenkopf>

      <div className="grid min-h-0 grid-cols-1 max-md:overflow-auto md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Fragenseite frage={frage} poolId={roh.id} herkunft={herkunft} merk={merk} bildtext={bildtext}
                     geprueft={geprueft} aufklappen={geprueft && automatisch && !richtig} />

        <div className="flex flex-col gap-4 p-6 md:min-h-0 md:overflow-auto">
          {hilfe && merk && <Typhilfe frage={frage} hilfe={hilfe} merk={merk} />}
          {Eingabe && verdeckt ? (
            <Abruf aufdecken={() => tu({ art: "aufdecken" })} kannIchSchon={ueberspringbar ? kannIchSchon : undefined} />
          ) : Eingabe ? (
            <>
              {/* N32: createElement, weil `Eingabe` aus dem Register kommt (stabil je Typ) -
                  als JSX-Variable hielt oxlint sie fuer eine im Zeichnen gebaute Komponente. */}
              {createElement(Eingabe, { frage, antwort, gesperrt: geprueft, aufAntwort: (a: unknown) => tu({ art: "antwort", antwort: a }), bildtext })}
              {geprueft ? (
                /* Typen mit eigenem Urteil zeigen es in ihrer Eingabe — die Karte
                   setzt dort nichts darueber. */
                ausVerlauf ? (
                  <VerlaufHinweis leer={antwortAusVerlauf === undefined} />
                ) : (
                  <>
                    {eigenes ? null : <Urteilszeile automatisch={automatisch} richtig={richtig} />}
                    {ueberspringbar && merk && <NichtMehrZeigen id={roh.id} merk={merk} />}
                  </>
                )
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Button disabled={!hatGeantwortet(antwort)} onClick={() => tu({ art: "pruefen" })}>
                    {eigenes ? "Antwort prüfen" : "Lösung prüfen"}
                  </Button>
                  <Button variant="secondary" onClick={() => tu({ art: "aufgeben" })}>
                    Aufgeben
                  </Button>
                  {ueberspringbar && <KannIchSchon onClick={kannIchSchon} />}
                </div>
              )}
              {/* N26 T4: der Rechner unter den Eingabefeldern bei den Rechen-Typen; K3-E65 / P7 (Meldung 15):
                  auch bei jeder anderen Frage mit `rechner: true` (z. B. RAID-Kapazitaet als Lueckentext). */}
              {(RECHNER_TYPEN.has(wirkTyp(frage)) || frage.rechner === true) && <RechnerKlappe merk={merk} />}
            </>
          ) : (
            <OhneEingabe typ={frage.typ} />
          )}
        </div>
      </div>
    </Card>
  );
}

/** Der Stern: markiert die POOL-Kennung (nicht die instanziierte Frage). */
function Stern({ id, merk }: { id: string; merk: MerkHaken }) {
  const an = istMarkiert(merk.stand, id);
  return (
    /* ⚠️ Entscheid 17.09.2026: im Neubau IMMER sichtbar (alte App: Schalter
       `markierenAn`, Standard aus). Markiert wird die Pool-Kennung. */
    <Button type="button" variant="ghost" size="icon-sm"
            onClick={() => merk.aendere((s) => schalteMarkierung(s, id))}
            aria-pressed={an}
            aria-label={an ? "Markierung entfernen" : "Zum gezielten Wiederholen markieren"}
            title="Zum gezielten Wiederholen markieren">
      <Star className={cn("size-4", an && "fill-current text-foreground")}
            strokeWidth={1.75} aria-hidden />
    </Button>
  );
}

/** „Kann ich schon“ vor der Antwort (25.11.2026). */
function KannIchSchon({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick}
            title="Zählt als richtig und kommt beim Üben nicht mehr – zurückholen unter „Markierte Fragen“">
      Kann ich schon
    </Button>
  );
}

/** Nach der Antwort: nur ausblenden bzw. zurückholen – gebucht ist schon (25.11.2026). */
function NichtMehrZeigen({ id, merk }: { id: string; merk: MerkHaken }) {
  const an = istGekonnt(merk.stand, id);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" aria-pressed={an}
              onClick={() => merk.aendere((s) => (an ? holeZurueck(s, id) : setzeGekonnt(s, id, Date.now())))}>
        {an ? "Wird nicht mehr gezeigt – zurückholen" : "Nicht mehr zeigen"}
      </Button>
    </div>
  );
}

/** Die linke Seite: Merkmale, Fragetext, Bild, Rueckseite und Melden. */
function Fragenseite({ frage, poolId, herkunft, merk, bildtext, geprueft, aufklappen }: {
  frage: Frage;
  poolId: string;
  herkunft?: Herkunft | "verlauf" | undefined;
  merk?: MerkHaken | undefined;
  bildtext: string;
  geprueft: boolean;
  aufklappen: boolean;
}) {
  return (
    <div className="grid md:min-h-0 grid-rows-[auto_auto_auto_auto] border-b p-6 md:grid-rows-[auto_auto_minmax(0,1fr)_auto] md:overflow-auto md:border-r md:border-b-0">
      <div className="mb-4 flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="font-normal">{frage.typ}</Badge>
        <Badge variant="secondary" className="font-normal">{frage.modul}</Badge>
        {frage.typ === "mehrfach" && (
          <Badge variant="secondary" className="font-normal">mehrere richtig</Badge>
        )}
        {/* ⚠️ Woher die Frage kommt, gehoert auf den Schirm: "wiederholt" erklaert,
            warum eine Frage wieder da ist, "aus dem Verlauf" erklaert, warum
            sie nicht noch einmal zaehlt. Die alte App zeigt dasselbe
            (hinweisFD, hinweisSerie). */}
        {herkunft === "fehlerdeck" && (
          <Badge className="font-normal">Wiederholung (Fehler-Deck)</Badge>
        )}
        {herkunft === "serie" && (
          <Badge className="font-normal">mehr zu diesem Thema</Badge>
        )}
        {herkunft === "verlauf" && (
          <Badge variant="outline" className="font-normal">
            aus dem Verlauf — zählt nicht noch einmal
          </Badge>
        )}
        {/* Meldung 13: rechts in der Merkmalzeile, verborgen ohne deutsche Stimme. */}
        <Vorlesen fragetext={typeof frage.frage === "string" ? frage.frage : ""} />
      </div>
      {FRAGETEXT_IST_EINGABE.has(wirkTyp(frage)) ? (
        <p className="max-w-[62ch] text-[0.8125rem] text-muted-foreground">
          Der Fragetext steht rechts — die Lücken sind Teil des Satzes.
        </p>
      ) : (
        <Fragetext frage={frage} tooltips={!!merk?.stand.glossarTip}
                   className="max-w-[62ch] text-[1.0625rem] leading-relaxed" />
      )}
      {/* ⛔ 96 Fragen tragen ein SVG. Bisher wurde es GAR NICHT gezeigt — die
          bild-Fragen liefen ohne ihr Bild. Siehe Bildflaeche.tsx zum Grund
          fuer die helle Flaeche. */}
      {"svg" in frage && typeof frage.svg === "string" && !ZEICHNUNG_IST_EINGABE.has(wirkTyp(frage)) ? (
        <Bildflaeche svg={frage.svg} klasse="mt-4 max-w-[62ch]" beschriftung={bildtext} />
      ) : (
        <div />
      )}
      <div>
        <Rueckseite frage={frage} geprueft={geprueft} aufklappen={aufklappen} />
        {merk && <Melden id={poolId} merk={merk} />}
      </div>
    </div>
  );
}

/** N24b: „So geht's" (alte App #67, renderTypHilfe) – über der Eingabe,
    der Haken wirkt sofort und gilt für den ganzen Typ. */
function Typhilfe({ frage, hilfe, merk }: { frage: Frage; hilfe: string; merk: MerkHaken }) {
  return (
    /* N25 P4: als shadcn `Alert`, aber mit role="note" statt "alert"
       (Nutzer-Entscheid 21.09.2026): sonst unterbricht der Screenreader
       bei JEDER Karte mit dieser Hilfe. Nur das Urteil ist ein alert. */
    <Alert role="note" data-teil="typ-hilfe"
           className="border-chart-4/50 bg-chart-4/5 px-4 py-3 text-[0.8125rem] leading-relaxed">
      <AlertTitle>{"So geht's:"}</AlertTitle>
      <AlertDescription className="text-[0.8125rem] text-foreground">
        <p>{hilfe}</p>
        <div className="mt-2 flex items-center gap-2">
          <Checkbox id={`hilfe-aus-${frage.id}`}
                    onCheckedChange={(c) => { if (c === true) merk.aendere((s) => blendeHilfeAus(s, hilfeTyp(frage))); }} />
          <Label htmlFor={`hilfe-aus-${frage.id}`} className="cursor-pointer font-normal text-muted-foreground">
            Diese Bedienhilfe nicht mehr zeigen
          </Label>
        </div>
      </AlertDescription>
    </Alert>
  );
}

/** N24: die Abruf-Uebung. Erst selbst ueberlegen, dann die Optionen
    aufdecken — Texte wie die alte App (TEXTE.hinweis.abrufUeberlegen,
    TEXTE.aktion.ichHabsUeberlegt). Pruefen und Aufgeben liegen mit
    hinter dem Knopf: ohne Optionen gibt es nichts zu pruefen. */
function Abruf({ aufdecken, kannIchSchon }: { aufdecken: () => void; kannIchSchon?: (() => void) | undefined }) {
  return (
    <div data-teil="abruf" className="flex flex-col items-start gap-3">
      <Alert role="note" className="px-4 py-3">
        <AlertTitle>Abruf-Übung</AlertTitle>
        <AlertDescription className="text-[0.8125rem]">
          Überlege die Antwort zuerst selbst – dann Optionen aufdecken.
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-auto max-w-full py-2 whitespace-normal" onClick={aufdecken}>{"Ich hab's überlegt – Optionen zeigen"}</Button>
        {kannIchSchon && <KannIchSchon onClick={kannIchSchon} />}
      </div>
    </div>
  );
}

function VerlaufHinweis({ leer }: { leer: boolean }) {
  return (
    <div className="rounded-md border border-dashed px-4 py-3 text-[0.8125rem] text-muted-foreground">
      {leer
        ? "Diese Frage hast du schon gesehen, aber nichts eingetragen."
        : "Diese Frage hast du schon beantwortet — oben steht, was du eingetragen hattest."}
    </div>
  );
}

function OhneEingabe({ typ }: { typ: string }) {
  return (
    <Alert role="note" className="border-dashed px-4 py-3">
      <AlertTitle>Eingabe noch nicht gebaut</AlertTitle>
      <AlertDescription className="text-[0.8125rem] leading-relaxed">
        <p>
          Die Eingabe für den Typ{" "}
          <span className="font-mono text-foreground">{typ}</span> ist noch nicht
          gebaut. Bewertet wird er weiterhin von{" "}
          <span className="font-mono text-foreground">kern/bewertung.ts</span> — es fehlt nur die
          Eingabe.
        </p>
      </AlertDescription>
    </Alert>
  );
}

function Urteilszeile({ automatisch, richtig }: { automatisch: boolean; richtig: boolean }) {
  if (!automatisch) {
    /* ⛔ freitext und erklaeren haben in TYP keinen Bewerter. Hier so zu tun,
       als sei etwas gewertet worden, waere gelogen. */
    return (
      <Alert className="border-dashed px-4 py-3">
        <AlertDescription className="text-[0.8125rem]">
          Dieser Fragetyp wird nicht maschinell bewertet — vergleiche selbst mit der Rückseite.
        </AlertDescription>
      </Alert>
    );
  }
  /* N25 P4: shadcn `Alert` – das Urteil ist die EINE Stelle der Karte mit
     role="alert" (Nutzer-Entscheid 21.09.2026): es wird nach dem Pruefen vorgelesen. */
  return (
    <Alert variant={richtig ? "default" : "destructive"}
           className={cn("px-4 py-3", richtig ? "border-chart-1/40" : "border-destructive/50")}>
      <AlertTitle className="text-[0.9375rem]">{richtig ? "Richtig." : "Nicht richtig."}</AlertTitle>
    </Alert>
  );
}
