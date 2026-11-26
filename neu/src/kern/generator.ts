/* ============================================================================
   DIE ZUFALLSAUFGABEN

   `generatoren.ts` (seit N34 T5, vorher logik.js) baut sechs Arten (dazu seit K3 vier neue, `K3_ARTEN`) von Rechenaufgaben mit frischen Werten
   (`GENERATOREN`). `check.sh` rechnet davon **27 Aufgaben mit 17429 Faellen**
   deterministisch durch — die Rechnung ist also laengst belegt. Was fehlte, war
   nur: die neue Oberflaeche konnte sie nicht zeigen.

   ⛔ EINE ZUFALLSAUFGABE IST KEINE POOL-FRAGE:
   * Sie hat KEINE feste Loesung, sondern `antwort` (oder `antwort2` fuer zwei
     Felder) mit den akzeptierten Schreibweisen — geprueft mit `gradeLuecke`.
   * `TYP` kennt `generator` NICHT. `grade` kann sie also gar nicht bewerten;
     das tut diese Datei, mit demselben Baustein wie die alte App.
   * Sie kommt NIE ins Fehler-Deck: die Werte sind gewuerfelt, dieselbe Aufgabe
     gibt es kein zweites Mal. (app_loeser.js: `fertig(ok, {keinFehlerDeck:true})`)
   * Sie zaehlt in eine EIGENE Statistik-Zeile `GEN:<art>`, nicht auf ein Modul.

   ⚠️ `netzplan` ist bewusst ausgenommen — so haelt es auch die alte App
      (app_seiten.js `genAlsFrage`), weil die Aufgabe ein eigenes Zeichenwerk
      braucht und nicht in die Einstreuung passt.
   ============================================================================ */
import { GENERATOREN } from "./generatoren.ts";
import { gradeLuecke } from "./bewertung.ts";
import type { Lernstand } from "./stand";
import { jsonKopie } from "./kopie.ts";
import { dayKey, gebietFuer } from "./lernen.ts";
import { pick } from "./zufall.ts";
import { istArtGekonnt, genSchluessel, setzeGekonnt } from "./gekonnt.ts";
import { verbuche } from "./verbuchen.ts";

interface GeneratorArt {
  name: string;
  modul: string;
  thema: string;
  ap2?: boolean;
  stufe?: number;
  fn: (rng?: () => number) => Record<string, unknown>;
}

/** Die gestellte Zufallsaufgabe — so, wie die Karte sie bekommt. */
export interface Zufallsaufgabe {
  id: string;
  typ: "generator";
  generator: string;
  generatorArt: string;
  modul: string;
  thema: string;
  pruefungsteil: string;
  schwierigkeit: number;
  frage: string;
  /** Ein Feld: die akzeptierten Schreibweisen. */
  antwort?: string[];
  /** Zwei oder mehr Felder, je eine Liste akzeptierter Schreibweisen. */
  antwort2?: string[][];
  einheit?: string;
  hinweis?: string;
  szenario?: unknown;
  /** Der Loesungsweg, Zeile fuer Zeile. */
  weg: string[];
  [weiteres: string]: unknown;
}

function alleArten(): Record<string, GeneratorArt> {
  return GENERATOREN;
}

/** Der Anzeigename einer Art — aus `GENERATOREN` (`generatoren.ts`), nicht hier noch einmal
    hingeschrieben. Unbekannte Art: die Kennung selbst, damit nichts leer bleibt. */
export function artName(art: string): string {
  return alleArten()[art]?.name ?? art;
}

/** Welche Arten zur aktuellen Auswahl passen — dieselben drei Filter wie in
    `genAlsFrage` der alten App: netzplan raus, Pruefungsteil, Gebiets-/Themenwahl. */
export function arten(stand: Lernstand): string[] {
  const alle = alleArten();
  let namen = Object.keys(alle).filter((a) => {
    if (a === "netzplan") return false;
    const ap2 = !!alle[a]!.ap2; // a stammt aus Object.keys(alle)
    if (stand.uebenAP === "ap1") return !ap2;
    if (stand.uebenAP === "ap2") return ap2;
    return true;
  });

  /* Generatoren tragen KEIN `gebiet`-Feld — ihr Gebiet wird aus Modul und Thema
     abgeleitet. Bei aktiver Auswahl bleibt eine Art nur, wenn ihr Gebiet gewaehlt
     ist ODER ihr "modul|thema" in den Feinthemen steht. */
  const gebiete = stand.gebiete || [];
  const themen = stand.themen || [];
  if (gebiete.length || themen.length) {
    namen = namen.filter((a) => {
      const meta = alle[a]!; // a stammt aus Object.keys(alle)
      const g = gebietFuer({
        modul: meta.modul, thema: meta.thema,
      });
      return (!!g && gebiete.indexOf(g) >= 0) || themen.indexOf(meta.modul + "|" + meta.thema) >= 0;
    });
  }
  return namen;
}

/** Baut eine Zufallsaufgabe einer BESTIMMTEN Art.

    ⚠️ Getrennt von `zufallsaufgabe`, seit es den Rechen-Generator als eigenen
       Schirm gibt: dort WAEHLT der Lerner die Art, beim Ueben wuerfelt die
       Einstreuung sie. Das Bauen ist in beiden Faellen dasselbe — und soll es
       bleiben, deshalb steht es nur einmal hier.
    Gibt null, wenn es die Art nicht gibt. */
export function aufgabeDerArt(
  stand: Lernstand, art: string, rng?: () => number,
): Zufallsaufgabe | null {
  const meta = alleArten()[art];
  if (!meta) return null;
  const g = meta.fn(rng);
  /* ⚠️ NUTZER-ENTSCHEID 09.09.2026: die feste Stufe der Art, NICHT stand.level.
     Im Automatik-Modus steht `level` dauerhaft auf 1 — jede vierte Aufgabe trug
     damit das Etikett "Anfaenger", und die Lernfluss-Probe rechnete an einem
     falschen Nenner. */
  /* N38 Q1: BEGRUENDET STEHEN GELASSEN – `Generatoraufgabe` ist die lose gemeinsame Form aller
     Generatoren (`typ: string`, `frage?`); die Rechen-Arten setzen `typ: "generator"` und `frage`
     (gemessen in generatoren.ts: alle ausser genGantt). Schaerfen wie bei Gantt/Netzplan = eigener Schritt. */
  return {
    ...g,
    id: "GEN-" + art,
    modul: meta.modul,
    thema: meta.thema,
    pruefungsteil: meta.ap2 ? "AP2" : "AP1",
    schwierigkeit: meta.stufe ?? stand.level,
    generatorArt: art,
  } as Zufallsaufgabe;
}

/** Baut eine Zufallsaufgabe zufaelliger Art — oder null, wenn zur Auswahl keine
    Art passt. Das ist der Weg der Einstreuung beim Ueben. */
export function zufallsaufgabe(stand: Lernstand, rng?: () => number): Zufallsaufgabe | null {
  /* „Kann ich schon“ (25.11.2026, kern/gekonnt.ts): ausgeblendete Arten nicht mehr einstreuen.
     ⚠️ Nicht in `arten` – die nutzt auch der Rechen-Generator-Schirm, dort waehlt man selbst. */
  const moeglich = arten(stand).filter((a) => !istArtGekonnt(stand, a));
  const art = pick(moeglich, rng);
  if (art === undefined) return null; // keine Art passt zur Auswahl
  return aufgabeDerArt(stand, art, rng);
}

/** Die Felder, die eine Zufallsaufgabe abfragt — eines oder mehrere. */
export function felder(f: Zufallsaufgabe): string[][] {
  if (Array.isArray(f.antwort2)) return f.antwort2;
  return [f.antwort ?? []];
}

/** Bewertet eine Zufallsaufgabe. Richtig ist nur, wenn JEDES Feld stimmt —
    verglichen mit `gradeLuecke` (kern/bewertung.ts, seit N34 T2), genau wie in app_loeser.js. */
export function bewerteZufall(f: Zufallsaufgabe, eingaben: string[]): boolean[] {
  return felder(f).map((akzeptiert, i) =>
    gradeLuecke(akzeptiert.map(String), eingaben[i] ?? ""),
  );
}

export function alleRichtig(f: Zufallsaufgabe, eingaben: string[]): boolean {
  const einzeln = bewerteZufall(f, eingaben);
  return einzeln.length > 0 && einzeln.every(Boolean);
}

/** Bucht das Ergebnis in die eigene Statistik-Zeile `GEN:<art>`.

    ⛔⛔ NACHGELESEN AM 14.09.2026, weil ich es zuerst falsch hatte: die alte App
       bucht eine Zufallsaufgabe **ZWEIMAL**. `R_TYP.generator` schreibt die
       `GEN:`-Zeile und ruft danach `fertig(ok, {keinFehlerDeck:true})` — also
       `verbucheAntwort`, die zusaetzlich Modul-, Themen-, Tages- und
       Antwort-Statistik fuehrt. **Das Modul SIEHT die Aufgabe also.**
       Nicht gebucht wird nur zweierlei: das Fehler-Deck (die Werte sind
       gewuerfelt, dieselbe Aufgabe gibt es nie wieder) und die adaptive Stufe
       (`verbucheAntwort` ueberspringt `typ === "generator"`).
    ►► Diese Funktion macht deshalb NUR die `GEN:`-Zeile. Wer sie aufruft, ruft
       daneben `verbuche(...)` mit `keinFehlerDeck: true`. */
export function verbucheZufall(stand: Lernstand, f: Zufallsaufgabe, richtig: boolean): Lernstand {
  const s = jsonKopie(stand);
  const st = s.statistik;
  const schluessel = "GEN:" + f.generator;
  const e = (st[schluessel] ??= { richtig: 0, gesamt: 0 });
  e.gesamt++;
  if (richtig) e.richtig++;
  return s;
}

/** Bucht eine Aufgabe, die auf dem RECHEN-GENERATOR-SCHIRM geloest wurde.

    ⛔⛔ HIER WIRD ANDERS GEBUCHT ALS BEIM UEBEN, UND DAS IST KEIN VERSEHEN.
       `sGenerator` in app_seiten.js schreibt genau zweierlei: die `GEN:`-Zeile
       und den Tageszaehler. **Kein Modul, kein Thema, keine Antwortliste, kein
       Fehler-Deck, kein `uebenZaehler`** — anders als die Einstreuung beim Ueben,
       die zusaetzlich `verbuche(...)` laeuft.
    ►► Der Grund steht im Verhalten: auf diesem Schirm SUCHT man sich die Art aus
       und rechnet so lange, wie man will. Wer das auf die Modul-Statistik
       schlagen liesse, koennte seine Trefferquote nach Belieben faerben — und
       die Bereitschaft je Gebiet waere nichts mehr wert.
    ⚠️ Der Tageszaehler zaehlt trotzdem mit: geuebt HAT man. So macht es die alte
       App auch (`s.dailyCounts[k]++` unmittelbar neben der GEN-Zeile). */
export function verbucheAufGeneratorschirm(
  stand: Lernstand,
  f: Zufallsaufgabe,
  richtig: boolean,
  jetzt: number = Date.now(),
): Lernstand {
  const s = verbucheZufall(stand, f, richtig);
  const tag = dayKey(jetzt);
  const tage = s.dailyCounts;
  tage[tag] = (tage[tag] ?? 0) + 1;
  return s;
}

/** „Kann ich schon“ an einer Zufallsaufgabe (Nutzer-Entscheid 25.11.2026, BUILD_LOG 278): bucht wie eine
    richtige Antwort – genau so, wie die Karte sonst bucht (`GEN:`-Statistikzeile UND `verbuche` ohne
    Fehler-Deck) – und blendet die ART aus (`GEN:<art>` in `gekonnt`). Ein Schreiben. */
export function ueberspringeZufall(stand: Lernstand, f: Zufallsaufgabe, jetzt: number): Lernstand {
  const gebucht = verbuche(verbucheZufall(stand, f, true), f, true, { heute: jetzt, keinFehlerDeck: true });
  return setzeGekonnt(gebucht, genSchluessel(f.generatorArt), jetzt);
}
