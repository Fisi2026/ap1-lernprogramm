/* ============================================================================
   N24b: DIE TYP-HILFE ("So geht's") UND IHR SCHALTER

   Die alte App (app_ui.js #67, `TYP_HILFE` / `renderTypHilfe`) zeigt bei zehn
   interaktiven Typen eine kurze Bedienhilfe über der Eingabe, mit einem Häkchen
   „Diese Bedienhilfe nicht mehr zeigen" je Typ (`S.typHilfeAus[typ] = true`).
   Ein Knopf in den Einstellungen holt alle zurück (`typHilfeAus = {}`).

   ⛔ Die Texte sind DATEN der alten App und werden hier nicht umformuliert:
      typhilfe.gleichheit.test.ts liest `TYP_HILFE` aus app_ui.js und verlangt
      Zeichengleichheit. Ändert sich dort ein Text, wird der Test rot.
   ⚠️ Nicht in der Simulation (dort gibt es keine Karteikarte). In der Abruf-
      Übung bleibt sie sichtbar – sie verrät keine Lösung (app_loeser.js R6);
      die zehn Typen sind ohnehin keine Auswahl-Typen.
   ============================================================================ */
import type { Frage } from "@/daten/typen";
import type { Lernstand } from "./stand";
import { wirkTyp } from "./wirktyp";

export const TYP_HILFE: Readonly<Record<string, string>> = {
  zuordnung: "Klicke erst ein Element, dann sein Gegenstück – oder ziehe es hinüber. Eine Zuordnung durch erneutes Klicken lösen.",
  reihenfolge: "Bringe die Schritte in die richtige Reihenfolge – mit den Pfeilen verschieben oder ziehen.",
  matrix: "Ordne jedes Element der passenden Zelle zu: Element anklicken, dann Zielzelle.",
  beschriftung: "Ziehe jeden Begriff auf die passende nummerierte Stelle – oder Begriff anklicken, dann Stelle.",
  hotspot: "Klicke die richtige Stelle direkt in der Grafik an.",
  baukasten: "Setze die Lösung aus den Bausteinen zusammen – anklicken oder ziehen.",
  trace: "Trage die Werte Schritt für Schritt in die Tabelle ein (Schreibtischtest).",
  konsole: "Gib den passenden Befehl bzw. die fehlenden Teile ein.",
  rechenassistent: "Trage Zwischen- und Endergebnisse in die Felder ein. Kommazahlen mit Komma oder Punkt.",
  kalkulation: "Fülle die Kalkulations-Felder aus – Kommazahlen mit Komma oder Punkt.",
};

function aus(stand: Pick<Lernstand, "typHilfeAus">): Record<string, unknown> {
  const a = stand.typHilfeAus;
  return a && typeof a === "object" ? a : {};
}

/** Welcher Typ zählt für die Hilfe — der wirkende (bild → sein unterTyp). */
export function hilfeTyp(f: Frage): string {
  return wirkTyp(f);
}

/** Der Hilfetext zu dieser Frage, oder null (kein Hilfetyp oder abgehakt). */
export function typHilfeFuer(f: Frage, stand: Pick<Lernstand, "typHilfeAus">): string | null {
  const t = hilfeTyp(f);
  const text = TYP_HILFE[t];
  if (!text || aus(stand)[t]) return null;
  return text;
}

/** „Nicht mehr zeigen": nur dieser Typ, die anderen bleiben, wie sie sind. */
export function blendeHilfeAus<S extends Pick<Lernstand, "typHilfeAus">>(stand: S, typ: string): S {
  return { ...stand, typHilfeAus: { ...aus(stand), [typ]: true } };
}

/** Wie viele Hilfen gerade abgehakt sind (für den Knopf in den Einstellungen). */
export function anzahlAusgeblendet(stand: Pick<Lernstand, "typHilfeAus">): number {
  return Object.keys(TYP_HILFE).filter((t) => aus(stand)[t]).length;
}

/** Der Knopf „Bedienhilfen wieder einblenden" (alte App: `setS('typHilfeAus', {})`). */
export function alleHilfenZurueck<S extends Pick<Lernstand, "typHilfeAus">>(stand: S): S {
  return { ...stand, typHilfeAus: {} };
}
