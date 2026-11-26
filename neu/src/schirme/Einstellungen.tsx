/* Einstellungen — N25 P2: aus shadcn-Bausteinen neu komponiert (E16).

   ⛔ Nicht die alte Karte je Wert nachgebaut, sondern nach Aufgabe gegliedert:
      „Prüfung", „Üben", „Anzeige und Hilfe", „Gemeldete Fragen". Jede Zeile ist ein
      `Field`: Titel, Erklärung, Bedienelement – und der Screenreader hört den Titel
      als NAMEN und die Erklärung als BESCHREIBUNG, nicht beides zusammengeklebt
      (Befund N25 P0: „BeideAP1-Stoff und AP2-Zusatz").
   ⛔ Jeder Wert wird dort gelesen, wo er wirkt (Kopf, Ziehung, Karte, Simulation) –
      die Wirkung prüfen einstellungen/schalter/typhilfe.jsdom.test.tsx.
   ⚠️ Geschrieben wird über `aendere`, nie direkt in den Speicher.
   N38 Q2 (30.09.2026): je Abschnitt eine Unterkomponente; der Zustand (Entwürfe, Datei-Import)
      liegt in dem Abschnitt, in dem er wirkt. Markup unverändert (Schnappschuss). */
import { useId, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import {
  Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldTitle,
} from "@/components/ui/field";
import { tageBis } from "@/kern/kennzahlen";
import { FRAGEN } from "@/daten/laden";
import { anzahlMeldungen, meldungenJSON, meldungenText } from "@/kern/markiert";
import { bieteDateiAn } from "@/lib/download";
import type { StandHaken } from "@/huelle/useLernstand";
import { simDauerAus } from "@/kern/schalter";
import { sicherungen, sichere, sichererSpeicher } from "@/kern/stand";
import { alsDatei, ausDatei, dateiname, DATEI_GRENZE, type Import } from "@/kern/lernstanddatei";
import { DatenschutzHinweis } from "./Datenschutz";
import { anzahlAusgeblendet, alleHilfenZurueck, TYP_HILFE } from "@/kern/typhilfe";

const TEILE: Array<{ wert: string; name: string; erklaerung: string }> = [
  { wert: "beide", name: "Beide", erklaerung: "AP1-Stoff und AP2-Zusatz" },
  { wert: "ap1", name: "Nur AP1", erklaerung: "was in Teil 1 drankommt" },
  { wert: "ap2", name: "Nur AP2", erklaerung: "Subnetting, Datenbanken, WiSo" },
];

/** N31/E28: was `navigator.storage.persist()` ergeben hat - in Worten. */
const DAUERHAFT: Record<StandHaken["dauerhaft"], string> = {
  ja: "Ja – der Browser räumt den Lernstand nicht von selbst weg.",
  nein: "Verweigert – bei Platzmangel darf der Browser den Lernstand löschen.",
  unbekannt: "Noch nicht angefragt – das geschieht bei der ersten beantworteten Frage.",
  fehlt: "Dieser Browser bietet keinen dauerhaften Speicher an.",
};

export function Einstellungen({ lernstand, oeffneMeldungen }: {
  lernstand: StandHaken;
  /** N20b: öffnet die geschützte Ansicht „Meldungen aller Lerner“. */
  oeffneMeldungen?: (() => void) | undefined;
}) {
  return (
    <div className="grid min-h-0 auto-rows-max overflow-auto p-6">
      <div className="flex max-w-2xl flex-col gap-6">
        <AbschnittPruefung lernstand={lernstand} />
        <AbschnittUeben lernstand={lernstand} />
        <AbschnittAnzeige lernstand={lernstand} />
        {/* N20a: Export der Meldungen – dasselbe Format wie die alte App (Gleichheitstest).
            N20b schickt Meldungen zusätzlich online. */}
        <AbschnittMeldungen lernstand={lernstand} oeffneMeldungen={oeffneMeldungen} />
        {/* N31/E28: gemessen, nicht behauptet - was der Browser zugesagt hat und was beim Laden repariert wurde. */}
        <AbschnittSpeicher lernstand={lernstand} />
        {/* AUD-A2 (26.09.2026): Datenschutzhinweis nach Art. 13 DSGVO – Text in Datenschutz.tsx. */}
        <Abschnitt teil="datenschutz" titel="Datenschutz" beschreibung="Wer verantwortlich ist und welche Daten wohin gehen.">
          <DatenschutzHinweis />
        </Abschnitt>
      </div>
    </div>
  );
}

/* ⛔⛔ ENTWURF STATT DIREKTEM WERT (Befund der alten Fassung, vom Test gemeldet): ein
   Zahlenfeld, das nur GUELTIGE Werte annimmt und direkt aus dem Stand liest, laesst sich
   nicht leeren – React setzt den alten Wert zurueck, „20“ + „3“ wird „203“. Getippt wird
   in einen Entwurf; in den Stand geht nur Gueltiges (`uebernimm` entscheidet); beim
   Verlassen zurueck auf den Stand. */
function useZahlEntwurf(ausStand: string, uebernimm: (eingabe: string) => void) {
  const [entwurf, setEntwurf] = useState(ausStand);
  return {
    value: entwurf,
    onChange: (e: ChangeEvent<HTMLInputElement>) => { setEntwurf(e.target.value); uebernimm(e.target.value); },
    onBlur: () => setEntwurf(ausStand),
  };
}

function AbschnittPruefung({ lernstand: { stand, aendere } }: { lernstand: StandHaken }) {
  const datum = stand.pruefungsdatum || "";
  /* N32: die Uhr einmal beim Oeffnen lesen, nicht bei jedem Zeichnen (oxlint purity). Der
     Abstand in Tagen aendert sich waehrend eines Besuchs der Einstellungen nicht. */
  const [jetzt] = useState(Date.now);
  const tage = tageBis(datum, jetzt);
  const dauer = useZahlEntwurf(String(stand.simDauerMin || 0), (v) => {
    if (v.trim() !== "") {
      const n = simDauerAus(v);
      aendere((s) => ({ ...s, simDauerMin: n }));
    }
  });
  return (
    <Abschnitt teil="pruefung" titel="Prüfung" beschreibung="Termin und Zeitrahmen der Prüfungssimulation.">
      <Field>
        <FieldLabel htmlFor="pruefungsdatum">Datum der AP1</FieldLabel>
        <Input id="pruefungsdatum" type="date" value={datum}
               onChange={(e) => aendere((s) => ({ ...s, pruefungsdatum: e.target.value }))} />
        {/* ⛔ Ohne Datum steht hier ein Satz, keine Zahl. */}
        <FieldDescription>
          {tage === null
            ? "Kein Termin gesetzt — der Kopf zeigt dann keine Tage an."
            : tage >= 0
              ? `Noch ${tage} Tage.`
              : `Der Termin liegt ${-tage} Tage zurück.`}
        </FieldDescription>
      </Field>
      <FieldSeparator />
      <Field>
        <FieldLabel htmlFor="simdauer">Dauer in Minuten</FieldLabel>
        <InputGroup>
          <InputGroupInput id="simdauer" type="number" min={0} max={240} {...dauer} />
          <InputGroupAddon align="inline-end"><InputGroupText>Min.</InputGroupText></InputGroupAddon>
        </InputGroup>
        <FieldDescription>0 = automatisch aus den Richtwerten der Fragetypen. Höchstens 240.</FieldDescription>
      </Field>
    </Abschnitt>
  );
}

function AbschnittUeben({ lernstand: { stand, aendere } }: { lernstand: StandHaken }) {
  const teilId = useId();
  const ziel = useZahlEntwurf(String(stand.tagesziel), (v) => {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 1 && n <= 200) {
      aendere((s) => ({ ...s, tagesziel: Math.round(n) }));
    }
  });
  return (
    <Abschnitt teil="ueben" titel="Üben" beschreibung="Wie viel, welcher Stoff und wie gefragt wird.">
      <Field>
        <FieldLabel htmlFor="tagesziel">Fragen pro Tag</FieldLabel>
        <InputGroup>
          <InputGroupInput id="tagesziel" type="number" min={1} max={200} {...ziel} />
          <InputGroupAddon align="inline-end"><InputGroupText>Fragen</InputGroupText></InputGroupAddon>
        </InputGroup>
        <FieldDescription>Steht im Kopf als Nenner von „heute“.</FieldDescription>
      </Field>
      <FieldSeparator />
      {/* ⚠️ Bewusst kein <fieldset>: die Gruppe hiesse dann zweimal „Prüfungsteil“
          (Legende UND Radiogruppe) – der Schnappschuss hat es gezeigt. Den Namen
          traegt allein die Radiogruppe. */}
      <Field>
        <FieldTitle id={teilId}>Prüfungsteil</FieldTitle>
        <FieldDescription id={teilId + "-b"}>Entscheidet, welche Fragen überhaupt gezogen werden – wirkt ab der nächsten Frage.</FieldDescription>
        <RadioGroup aria-labelledby={teilId} aria-describedby={teilId + "-b"} value={(stand.uebenAP ?? "beide")}
                    onValueChange={(v) => aendere((s) => ({ ...s, uebenAP: v }))}>
          {TEILE.map((t) => <Wahlkarte key={t.wert} wert={t.wert} name={t.name} erklaerung={t.erklaerung} />)}
        </RadioGroup>
      </Field>
      <FieldSeparator />
      <Schalter an={stand.relevanzGewichtung} name="Prüfungsnah gewichten"
                erklaerung="IHK-relevante Themen kommen häufiger dran."
                umschalten={() => aendere((s) => ({ ...s, relevanzGewichtung: !s.relevanzGewichtung }))} />
      <Schalter an={stand.abrufAn} name="Abruf-Übung"
                erklaerung="Auswahlfragen zeigen zuerst nur die Frage – du deckst die Optionen selbst auf. Nicht in der Simulation und nicht in der Einzelfrage."
                umschalten={() => aendere((s) => ({ ...s, abrufAn: !s.abrufAn }))} />
    </Abschnitt>
  );
}

function AbschnittAnzeige({ lernstand: { stand, aendere } }: { lernstand: StandHaken }) {
  const aus = anzahlAusgeblendet(stand);
  return (
    <Abschnitt teil="anzeige" titel="Anzeige und Hilfe" beschreibung="Was auf der Karte zusätzlich erscheint.">
      <Schalter an={stand.glossarTip} name="Begriffs-Tooltips im Fragetext"
                erklaerung="Höchstens zwei Begriffe je Frage, nie einer, der die Lösung verrät."
                umschalten={() => aendere((s) => ({ ...s, glossarTip: !s.glossarTip }))} />
      <Schalter an={stand.ariaAltTexte} name="Inhaltliche Bildbeschreibungen"
                erklaerung="Screenreader hören statt „Zeichnung zur Frage …“ den Grafiktyp und das Thema."
                umschalten={() => aendere((s) => ({ ...s, ariaAltTexte: !s.ariaAltTexte }))} />
      <FieldSeparator />
      {/* responsive: unter @md der FieldGroup steht der Knopf unter dem Text (N25b, 390 px). */}
      <Field orientation="responsive">
        <FieldContent>
          <FieldTitle>Bedienhilfen</FieldTitle>
          <FieldDescription>
            {aus === 0
              ? "Alle Bedienhilfen werden angezeigt."
              : `${aus} von ${Object.keys(TYP_HILFE).length} ausgeblendet.`}
          </FieldDescription>
        </FieldContent>
        <Button size="sm" variant="secondary" disabled={aus === 0}
                onClick={() => aendere((s) => alleHilfenZurueck(s))}>
          Bedienhilfen wieder einblenden
        </Button>
      </Field>
    </Abschnitt>
  );
}

function AbschnittMeldungen({ lernstand: { stand }, oeffneMeldungen }: {
  lernstand: StandHaken;
  oeffneMeldungen?: (() => void) | undefined;
}) {
  const [downloadFehler, setDownloadFehler] = useState<string | null>(null);
  const meldungen = anzahlMeldungen(stand);
  return (
    <Abschnitt teil="meldungen-export" titel="Gemeldete Fragen" beschreibung={meldungen === 0
      ? "Auf diesem Gerät ist noch keine Frage gemeldet."
      : `${meldungen} ${meldungen === 1 ? "Meldung" : "Meldungen"} auf diesem Gerät.`}>
      {meldungen > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary"
                  onClick={() => setDownloadFehler(bieteDateiAn("meldungen.json", meldungenJSON(stand), "application/json;charset=utf-8"))}>
            Als JSON speichern
          </Button>
          <Button size="sm" variant="secondary"
                  onClick={() => setDownloadFehler(bieteDateiAn("meldungen.txt", meldungenText(stand, (id) => FRAGEN.find((f) => f.id === id))))}>
            Als Text speichern
          </Button>
        </div>
      )}
      {downloadFehler && (
        <p className="text-sm text-destructive">Download nicht möglich: {downloadFehler}</p>
      )}
      {oeffneMeldungen && (
        <Field orientation="horizontal">
          <FieldContent>
            <FieldDescription>
              Meldungen gehen außerdem online an den Betreiber – ohne deinen Namen, die IP-Adresse wird nicht gespeichert. Mit dem Schlüssel sind sie hier einsehbar.
            </FieldDescription>
          </FieldContent>
          <Button size="sm" variant="outline" onClick={oeffneMeldungen}>Meldungen aller Lerner öffnen</Button>
        </Field>
      )}
    </Abschnitt>
  );
}

function AbschnittSpeicher({ lernstand }: { lernstand: StandHaken }) {
  const { stand, aendere } = lernstand;
  /* N31: einmal beim Oeffnen gezaehlt - die Liste waechst nur beim Laden. */
  const [sicherungenZahl] = useState(() => sicherungen().length);
  /* AUD-B2: Lernstand als Datei. Ein gelesener Import WARTET auf die Rueckfrage, bevor er ersetzt. */
  const dateiWahl = useRef<HTMLInputElement>(null);
  const [importBereit, setImportBereit] = useState<Extract<Import, { ok: true }> | null>(null);
  const [dateiMeldung, setDateiMeldung] = useState<{ art: "ok" | "fehler"; text: string } | null>(null);

  async function waehleDatei(e: ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    e.target.value = "";
    setImportBereit(null);
    if (!datei) return;
    if (datei.size > DATEI_GRENZE) { setDateiMeldung({ art: "fehler", text: "Die Datei ist zu groß für einen Lernstand." }); return; }
    const r = ausDatei(await datei.text());
    if (!r.ok) { setDateiMeldung({ art: "fehler", text: r.fehler }); return; }
    setDateiMeldung(null);
    setImportBereit(r);
  }

  function ersetzeStand() {
    if (!importBereit) return;
    /* Der bisherige Stand wandert in die Sicherungen (E26) – ein falscher Klick ist so nicht endgueltig. */
    const sp = sichererSpeicher();
    if (sp) sichere(sp, JSON.stringify(stand), "vor dem Laden einer Lernstand-Datei", Date.now());
    const neu = importBereit.stand;
    const n = importBereit.reparaturen.length;
    aendere(() => neu);
    setImportBereit(null);
    setDateiMeldung({ art: "ok", text: "Lernstand übernommen" + (n ? ` – ${n === 1 ? "eine Stelle" : `${n} Stellen`} repariert.` : ".") });
  }

  return (
    <Abschnitt teil="speicher" titel="Speicher" beschreibung="Wie sicher dein Lernstand auf diesem Gerät liegt.">
      <Field>
        <FieldTitle>Dauerhafter Speicher</FieldTitle>
        <FieldDescription data-dauerhaft={lernstand.dauerhaft}>{DAUERHAFT[lernstand.dauerhaft]}</FieldDescription>
      </Field>
      <FieldSeparator />
      <Field data-teil="lernstanddatei">
        <FieldTitle>Lernstand als Datei</FieldTitle>
        <FieldDescription>
          Der Lernstand liegt nur in diesem Browser. Als Datei nimmst du ihn auf ein anderes Gerät mit
          oder holst ihn nach dem Löschen der Browserdaten zurück.
        </FieldDescription>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary"
                  onClick={() => { const zeitpunkt = Date.now(); setDateiMeldung(null);
                    const f = bieteDateiAn(dateiname(zeitpunkt), alsDatei(stand, zeitpunkt, __APP_VERSION__), "application/json;charset=utf-8");
                    if (f) setDateiMeldung({ art: "fehler", text: "Speichern nicht möglich: " + f }); }}>
            Lernstand speichern
          </Button>
          <Button size="sm" variant="secondary" onClick={() => dateiWahl.current?.click()}>
            Lernstand laden …
          </Button>
          <input ref={dateiWahl} type="file" accept="application/json,.json" className="hidden"
                 aria-label="Lernstand-Datei wählen" onChange={(e) => void waehleDatei(e)} />
        </div>
        {importBereit && (
          <fieldset aria-label="Lernstand ersetzen?" className="min-w-0 grid gap-2 rounded-md border border-destructive/40 p-3 text-sm">
            <p>
              Den Lernstand auf diesem Gerät durch die Datei ersetzen
              {importBereit.exportiert ? ` (gespeichert am ${new Date(importBereit.exportiert).toLocaleString("de-DE")})` : ""}?
              Der bisherige Stand wird vorher auf diesem Gerät gesichert.
              {importBereit.reparaturen.length > 0 && ` ${importBereit.reparaturen.length === 1 ? "Eine Stelle wird" : `${importBereit.reparaturen.length} Stellen werden`} dabei repariert.`}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={ersetzeStand}>Ersetzen</Button>
              <Button size="sm" variant="secondary" onClick={() => setImportBereit(null)}>Abbrechen</Button>
            </div>
          </fieldset>
        )}
        {dateiMeldung && (
          <output className={"block text-sm " + (dateiMeldung.art === "fehler" ? "text-destructive" : "text-muted-foreground")}>
            {dateiMeldung.text}
          </output>
        )}
      </Field>
      <FieldSeparator />
      <Field>
        <FieldTitle>Beim Start gelesen</FieldTitle>
        {lernstand.reparaturen.length === 0 ? (
          <FieldDescription>Ohne Reparatur.</FieldDescription>
        ) : (
          <>
            <FieldDescription>
              {lernstand.reparaturen.length === 1 ? "Eine Stelle" : `${lernstand.reparaturen.length} Stellen`} repariert
              {lernstand.gesichert ? " – das Original ist auf diesem Gerät gesichert." : "."}
            </FieldDescription>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {lernstand.reparaturen.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </>
        )}
        {sicherungenZahl > 0 && (
          <FieldDescription>
            {sicherungenZahl === 1 ? "Eine Sicherung" : `${sicherungenZahl} Sicherungen`} eines früheren Stands (nicht lesbar, repariert oder vor dem Laden einer Datei) {sicherungenZahl === 1 ? "liegt" : "liegen"} auf diesem Gerät.
          </FieldDescription>
        )}
      </Field>
      {lernstand.konflikte > 0 && (
        <>
          <FieldSeparator />
          <Field>
            <FieldTitle>Anderer Tab</FieldTitle>
            <FieldDescription>
              {lernstand.konflikte === 1 ? "Einmal" : `${lernstand.konflikte}-mal`} lag schon ein neuerer Stand aus einem anderen Tab vor; er wurde übernommen statt überschrieben.
            </FieldDescription>
          </Field>
        </>
      )}
    </Abschnitt>
  );
}

/** Ein Abschnitt: Karte mit Überschrift (h2 – die Gliederung bleibt navigierbar) und Feldern. */
function Abschnitt({ teil, titel, beschreibung, children }: {
  /** Fester Anker fuer Tests (`data-teil`) – unabhaengig von Ueberschrift und Aussehen. */
  teil: string; titel: string; beschreibung: string; children: ReactNode;
}) {
  return (
    <Card data-teil={teil}>
      <CardHeader>
        <CardTitle><h2>{titel}</h2></CardTitle>
        <CardDescription>{beschreibung}</CardDescription>
      </CardHeader>
      <CardContent><FieldGroup>{children}</FieldGroup></CardContent>
    </Card>
  );
}

/** Ein Schalter als Zeile: Titel = Name, Erklärung = Beschreibung, Switch rechts. */
function Schalter({ an, name, erklaerung, umschalten }: {
  an: boolean; name: string; erklaerung: string; umschalten: () => void;
}) {
  const id = useId();
  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor={id}>{name}</FieldLabel>
        <FieldDescription id={id + "-b"}>{erklaerung}</FieldDescription>
      </FieldContent>
      <Switch id={id} checked={an} onCheckedChange={umschalten} aria-describedby={id + "-b"} />
    </Field>
  );
}

/** Eine Wahlkarte (shadcn „Choice Card“): die ganze Karte ist anklickbar, der Radio-
    Knopf heißt nur wie die Wahl, die Erklärung ist seine Beschreibung. */
function Wahlkarte({ wert, name, erklaerung }: { wert: string; name: string; erklaerung: string }) {
  const id = useId();
  return (
    <FieldLabel htmlFor={id}>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle id={id + "-t"}>{name}</FieldTitle>
          <FieldDescription id={id + "-b"}>{erklaerung}</FieldDescription>
        </FieldContent>
        <RadioGroupItem id={id} value={wert} aria-labelledby={id + "-t"} aria-describedby={id + "-b"} />
      </Field>
    </FieldLabel>
  );
}
