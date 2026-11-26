/* ============================================================================
   N24: DIE REGELN HINTER DEN SCHALTERN DER EINSTELLUNGEN

   Jeder Schalter braucht eine Wirkung, die man messen kann — ein Schalter, der
   nur im Lernstand steht, ist Zierde. Die Regeln stehen deshalb HIER, an einer
   Stelle, und die Schirme wenden sie nur an:

   * `abrufGilt`      — die Abruf-Übung (#98, `S.abrufAn`): Auswahlfragen zeigen
                        zuerst nur die Frage. Alte App: app_loeser.js, Ende von
                        `loeseFrage` (mc / mehrfach / dropdown, nie in der Simulation).
   * `svgAltFuer`     — der inhaltliche Bildtext (#65), neu geschrieben nach
                        app_util.js und dort in node:vm gegengemessen (E15:
                        app_util.js bekommt keinen UMD-Ausgang).
   * `bildBeschriftung` — EINE Beschriftungsregel für Übungskarte, Simulation und
                        Hotspot. ⛔ Bewusste Abweichung von der alten App (E15):
                        dort ist ein Bild OHNE den Schalter gar nicht beschriftet.
                        Hier bleibt dann die generische Zeile stehen; der Schalter
                        VERBESSERT die Beschriftung, statt sie erst hinzuzufügen.
   * `simDauerAus`    — die Simulationsdauer (#45), dieselbe Grenze 0–240 wie
                        app_pages2.js (0 = automatisch aus den Richtwerten).
   ============================================================================ */
import type { Frage, SimKarte } from "@/daten/typen";
import { wirkTyp } from "./wirktyp";

/** Die Typen, deren Optionen die Abruf-Übung zuerst verdeckt (alte App, wörtlich). */
const ABRUF_TYPEN: ReadonlySet<string> = new Set(["mc", "mehrfach", "dropdown"]);

/** Verdeckt die Karte die Antwortmöglichkeiten zuerst?
    ⚠️ Nur die REGEL am Fragetyp. WO sie gilt (Üben, Tagesserie, Markiert — nicht
       Einzelfrage, Simulation, Verlauf), entscheidet der Aufrufer über `abrufAn`. */
export function abrufGilt(f: Frage, abrufAn: boolean): boolean {
  return abrufAn && ABRUF_TYPEN.has(wirkTyp(f));
}

/** #65: generischer Text je Grafiktyp, optional mit dem Thema (app_util.js `svgAltFuer`). */
export function svgAltFuer(f: SimKarte): string {
  const t = f.typ === "bild" ? (typeof f.unterTyp === "string" && f.unterTyp ? f.unterTyp : "bild") : f.typ;
  const m: Record<string, string> = {
    hotspot: "Hotspot-Grafik zum Anklicken",
    beschriftung: "Beschriftungs-Grafik zum Zuordnen",
    matrix: "Matrix-Grafik",
    lueckentext: "Aufgaben-Grafik mit Lücken",
  };
  return (m[t] || "Aufgaben-Grafik") + (f.thema ? " zum Thema " + f.thema : "");
}

/** Die Beschriftung jeder Zeichnung — aus: die generische Zeile, an: der inhaltliche Text. */
export function bildBeschriftung(f: SimKarte, ariaAltTexte: boolean): string {
  return ariaAltTexte ? svgAltFuer(f) : `Zeichnung zur Frage ${f.id}`;
}

/** Die Simulationsdauer aus einer Eingabe: 0–240 Minuten, Unsinn → 0 (automatisch).
    Wörtlich die alte App (app_pages2.js): `Math.max(0, Math.min(240, +wert || 0))`. */
export function simDauerAus(wert: unknown): number {
  return Math.max(0, Math.min(240, Number(wert) || 0));
}
