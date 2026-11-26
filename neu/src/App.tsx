/* ⛔⛔ ANLASS 14.09.2026: Hier standen VIER ERFUNDENE ZAHLEN im Kopf —
   "12/20 heute", "71 % Trefferquote", "8 Fehler-Deck faellig", "412 Tage bis
   AP1". Sie sahen gut aus und waren Fuellung aus dem Entwurf. Dieselbe Sorte
   Fehler wie die drei erfundenen Faecher vom 11.09., nur an der sichtbarsten
   Stelle des Programms.
   ►► Jede Zahl kommt jetzt aus dem Lernstand (`kern/kennzahlen.ts`). Was sich
      nicht messen laesst — ohne Pruefungstermin gibt es keine Tage, ohne
      beantwortete Frage keine Trefferquote — wird WEGGELASSEN, nicht genullt.

   ⚠️ Der Lernstand liegt deshalb jetzt HIER und wird hinuntergereicht. Ein
      zweiter `useLernstand` im Kopf waere eine zweite Fassung desselben Standes,
      und die beiden liefen auseinander. */
import { Suspense, useCallback, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Schiene } from "@/huelle/Schiene";
import { lies, schreibe, gleich, type Bereich, type Route } from "@/kern/route";
import { Startseite } from "@/schirme/Startseite";
import { Einzelfrage } from "@/schirme/Einzelfrage";
import { Kopf } from "@/huelle/Kopf";
import { Ueben } from "@/schirme/Ueben";
import { Statistik } from "@/schirme/Statistik";
import { Fehlerdeck } from "@/schirme/Fehlerdeck";
import { Markiert } from "@/schirme/Markiert";
import { sendeAusstehende } from "@/kern/meldeversand";
import { Tagesserie } from "@/schirme/Tagesserie";
/* N38 P3: diese acht erst beim Betreten (`huelle/faulschirme.tsx`). */
import { Einstellungen, Meldungsliste, Spickzettel, RechenGenerator, Glossar, Gantt, Netzplan, Simulation } from "@/huelle/faulschirme";
import { Klausurvorbereitung } from "@/schirme/Klausurvorbereitung";
import { neuerLauf, type SerienLauf } from "@/schirme/serienlauf";
import { useLernstand } from "@/huelle/useLernstand";
import { Zuschauer } from "@/huelle/Zuschauer";
import { Updatehinweis } from "@/huelle/Updatehinweis";
import { Bereichsgrenze } from "@/huelle/Bereichsgrenze";
import { PoolWartet, SchirmLaedt } from "@/huelle/Ladehuelle";
import { usePoolStatus } from "@/huelle/usePool";
import { nochmalPool, poolStatus } from "@/daten/laden";
import { kennzahlen } from "@/kern/kennzahlen";
import type { Messwert } from "@/huelle/Kopf";

const TITEL: Partial<Record<Bereich, { titel: string; untertitel: string }>> = {
  start: { titel: "Start", untertitel: "Was möchtest du tun?" },
  frage: { titel: "Einzelne Frage", untertitel: "Zum Nachschlagen — zählt nicht" },
  ueben: { titel: "Üben", untertitel: "Karteikasten — gezogen, nicht durchgeblättert" },
  serie: { titel: "Tagesserie", untertitel: "Fünf Fragen gegen deine größte Schwäche" },
  stat: { titel: "Statistik", untertitel: "Bereitschaft je Prüfungsgebiet" },
  einst: { titel: "Einstellungen", untertitel: "Prüfung, Üben, Anzeige und Hilfe" },
  fd: { titel: "Fehler-Deck", untertitel: "Was ansteht — geübt wird im Karteikasten" },
  markiert: { titel: "Markierte Fragen", untertitel: "Per ★ gemerkt — gezielt wiederholen" },
  meldungen: { titel: "Meldungen aller Lerner", untertitel: "Geschützt — nur mit Schlüssel" },
  spickzettel: { titel: "Spickzettel", untertitel: "Die wichtigsten Fakten, Formeln und Merksätze" },
  gen: { titel: "Rechen-Generator", untertitel: "Aufgabenart wählen — Werte frisch gewürfelt" },
  glossar: { titel: "Glossar", untertitel: "Begriffslexikon und Abkürzungen" },
  gantt: { titel: "Gantt-Training", untertitel: "Balkenplan planen — früheste Termine" },
  netzplan: { titel: "Netzplan-Training", untertitel: "FAZ, FEZ, SAZ, SEZ und Gesamtpuffer" },
  sim: { titel: "Prüfungssimulation", untertitel: "Vier Aufgaben, 100 Punkte, auf Zeit" },
  unterricht: { titel: "Klausurvorbereitung", untertitel: "Nächste Klausur — Fragen aus dem Pool, nach Themen" },
};

/** Was ein Schirm von der Huelle bekommt. */
interface SchirmKontext {
  lernstand: ReturnType<typeof useLernstand>;
  poolDa: boolean;
  route: Route;
  geheZu: (b: Bereich, frageId?: string | null) => void;
  serienLauf: SerienLauf | null;
  setSerienLauf: Dispatch<SetStateAction<SerienLauf | null>>;
}

/* Audit 26.09.2026 (AUD-C7): EINE Tabelle statt einer Kette aus 17 Bedingungen. `Record<Bereich, …>`
   zwingt den Typpruefer, JEDEN Bereich aus `kern/route.ts` zu nennen – ein neuer Bereich ohne Schirm
   ist ein Typfehler, kein stiller „noch nicht gebaut"-Kasten mehr. */
const SCHIRME: Record<Bereich, (k: SchirmKontext) => ReactNode> = {
  start: ({ lernstand, geheZu, poolDa }) => <Startseite lernstand={lernstand} geheZu={geheZu} poolDa={poolDa} />,
  frage: ({ lernstand, route, geheZu }) => (
    <Einzelfrage key={route.frageId ?? ""} id={route.frageId} lernstand={lernstand} geheZu={geheZu} />
  ),
  ueben: ({ lernstand }) => <Ueben lernstand={lernstand} />,
  stat: ({ lernstand }) => <Statistik stand={lernstand.stand} />,
  einst: ({ lernstand, geheZu }) => <Einstellungen lernstand={lernstand} oeffneMeldungen={() => geheZu("meldungen")} />,
  fd: ({ lernstand, geheZu }) => <Fehlerdeck lernstand={lernstand} oeffneFrage={(id) => geheZu("frage", id)} />,
  meldungen: ({ geheZu }) => <Meldungsliste oeffneFrage={(id) => geheZu("frage", id)} />,
  markiert: ({ lernstand, geheZu }) => <Markiert lernstand={lernstand} oeffneFrage={(id) => geheZu("frage", id)} />,
  spickzettel: () => <Spickzettel />,
  gen: ({ lernstand }) => <RechenGenerator lernstand={lernstand} />,
  glossar: ({ lernstand }) => <Glossar stand={lernstand.stand} />,
  gantt: ({ lernstand }) => <Gantt lernstand={lernstand} />,
  netzplan: ({ lernstand }) => <Netzplan lernstand={lernstand} />,
  /* Der Lauf wird beim Betreten gezogen (`wechsle`) – ohne Lauf gibt es nichts zu zeigen. */
  serie: ({ lernstand, serienLauf, setSerienLauf, geheZu }) => serienLauf ? (
    <Tagesserie lernstand={lernstand} lauf={serienLauf} setzeLauf={setSerienLauf} zumUeben={() => geheZu("ueben")} />
  ) : null,
  sim: ({ lernstand }) => <Simulation lernstand={lernstand} />,
  unterricht: ({ lernstand }) => <Klausurvorbereitung lernstand={lernstand} />,
};

/* N38 P1 (E63): diese Bereiche lesen den Pool NICHT (gemessen: kein Import von `daten/laden` im
   Schirm) und zeichnen deshalb sofort. Die Startseite zeigt ohne Pool nur, was ohne ihn stimmt
   (`kern/startseite.ts`). ⛔ Wer einem dieser Schirme den Pool gibt, nimmt ihn hier heraus –
   `app.pool.jsdom.test.tsx` prueft die Liste gegen die Importe. */
export const OHNE_POOL: ReadonlySet<Bereich> = new Set<Bereich>(["start", "stat", "gen", "gantt", "netzplan", "spickzettel"]);

export default function App() {
  const lernstand = useLernstand();
  const pool = usePoolStatus();
  const poolDa = pool === "da";
  /* N22: die Adresse ist die Quelle (`#ueben`, `#frage=M03-907`, ohne Hash die
     Startseite) — Format der alten App, Regeln in `kern/route.ts`. */
  const [route, setRoute] = useState<Route>(() => lies(window.location.hash));
  const bereich = route.bereich;
  /* N21: der Lauf der Tagesserie lebt HIER, damit ein Bereichswechsel ihn nicht verwirft.
     Gezogen wird beim Betreten — im Klick bzw. beim Adresswechsel, nicht in einem
     Effekt; eine abgeschlossene Serie wird dabei durch eine neue ersetzt. */
  const [serienLauf, setSerienLauf] = useState<SerienLauf | null>(
    () => (route.bereich === "serie" && poolDa ? neuerLauf(lernstand.stand) : null),
  );
  /* N38 P1: kommt der Pool, waehrend die Tagesserie offen ist, wird sie JETZT gezogen – im Zeichnen
     aus dem vorigen Zustand abgeleitet (React: „Informationen aus vorigen Renderings"), kein Effekt. */
  const [warDa, setWarDa] = useState(poolDa);
  if (warDa !== poolDa) {
    setWarDa(poolDa);
    if (poolDa && route.bereich === "serie" && !serienLauf) setSerienLauf(neuerLauf(lernstand.stand));
  }
  /* N31/E27: eine offene Tagesserie ist ein Grund fuer die Rueckfrage im anderen Tab. */
  const serieOffen = !!serienLauf && !serienLauf.fertig;
  const quelle = lernstand.quelle;
  useEffect(() => { quelle.setzeLauf("serie", serieOffen); }, [quelle, serieOffen]);
  /* Der Adress-Lauscher lebt länger als ein Zeichnen — er liest den Stand hierüber. */
  const standRef = useRef(lernstand.stand);
  useEffect(() => { standRef.current = lernstand.stand; }, [lernstand.stand]);

  const wechsle = useCallback((r: Route) => {
    /* N38 P1: ohne Pool wird nicht gezogen – das holt der Pool-Wechsel oben nach. */
    if (r.bereich === "serie" && poolStatus() === "da") {
      setSerienLauf((l) => (!l || l.fertig ? neuerLauf(standRef.current) : l));
    }
    setRoute((alt) => (gleich(alt, r) ? alt : r));
  }, []);

  const geheZu = useCallback((b: Bereich, frageId: string | null = null) => {
    const r: Route = { bereich: b, frageId: b === "frage" ? frageId : null };
    wechsle(r);
    const h = schreibe(r);
    if (window.location.hash !== h) window.location.hash = h;
  }, [wechsle]);

  /* Browser-Zurück/Vorwärts und von Hand geänderte Adressen. Gelesen wird
     `location.hash` zum Zeitpunkt des Ereignisses, nicht `event.newURL` — ein
     verspätetes Ereignis trifft so auf den aktuellen Stand und tut nichts. */
  useEffect(() => {
    const nachAdresse = () => wechsle(lies(window.location.hash));
    window.addEventListener("hashchange", nachAdresse);
    return () => window.removeEventListener("hashchange", nachAdresse);
  }, [wechsle]);

  /* N20b: liegengebliebene Meldungen beim Start und bei wiederhergestellter
     Verbindung nachschicken. ⚠️ Fehler bleiben still – die Meldung wartet weiter. */
  useEffect(() => {
    const nach = () => { void sendeAusstehende(localStorage, (u, i) => fetch(u, i), __APP_VERSION__).catch(() => 0); };
    nach();
    window.addEventListener("online", nach);
    return () => window.removeEventListener("online", nach);
  }, []);
  const k = kennzahlen(lernstand.stand);

  /* Nur, was gemessen ist. `null` heisst: es gibt die Zahl noch nicht. */
  const messwerte: Messwert[] = [
    { wert: `${k.heute}/${k.tagesziel}`, bezeichnung: "heute" },
    ...(k.quote === null
      ? []
      : [{ wert: `${k.quote} %`, bezeichnung: `Trefferquote (${k.beantwortet})` }]),
    ...(k.tageBisPruefung === null
      ? []
      : [{ wert: String(k.tageBisPruefung), bezeichnung: "Tage bis zur Prüfung" }]),
  ];

  const kopf = TITEL[bereich] ?? { titel: bereich, untertitel: "" };

  return (
    <TooltipProvider delayDuration={300}>
      {/* N31/E27: ein Zuschauer-Tab zeigt nur an - alles darunter ist dann `inert`. */}
      <div className="grid h-screen grid-cols-[3.5rem_minmax(0,1fr)] overflow-hidden" inert={lernstand.rolle === "zuschauer"}>
        <Schiene aktiv={bereich} aufBereich={geheZu} />
        <main className="grid min-h-0 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)]">
          <Kopf
            titel={kopf.titel}
            untertitel={kopf.untertitel}
            faelligeKarten={k.faellig}
            messwerte={messwerte}
          />
          {/* N32/E29: wirft ein Schirm, faellt nur dieser Bereich (key: frische Grenze je Bereich). */}
          <Bereichsgrenze key={bereich} bereich={bereich} zurStart={() => geheZu("start")}>
          <Suspense fallback={<SchirmLaedt />}>
          {poolDa || OHNE_POOL.has(bereich)
            ? SCHIRME[bereich]({ lernstand, poolDa, route, geheZu, serienLauf, setSerienLauf })
            : <PoolWartet status={pool === "fehler" ? "fehler" : "laedt"} nochmal={nochmalPool} />}
          </Suspense>
          </Bereichsgrenze>
        </main>
      </div>
      <Zuschauer lernstand={lernstand} />
      {/* N33: nie waehrend einer Simulation oder Tagesserie dieses Tabs. */}
      <Updatehinweis lauf={lernstand.lauf} />
    </TooltipProvider>
  );
}
