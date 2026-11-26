/* ============================================================================
   DER TASCHENRECHNER — TASTEN, TEXTE, RUECKSCHRITT (N26 T3)

   ⛔ VERTRAG: die Namen der Tasten. Tests und die Einbindung (T4) bedienen den
      Rechner ueber `getByRole("button", { name })`. Wer einen Namen aendert,
      bricht sie. Warum 32 Tasten, warum dieser Block, warum Woerter fuer Symbole:
      Kopf von `schirme/Rechner.tsx` (Nutzer-Entscheide 22.09.2026).
   Eigene Datei, weil eine Komponentendatei nur Komponenten exportieren soll
   (oxlint only-export-components / Fast Refresh).
   ============================================================================ */

import type { Lernstand } from "./stand";

export const RECHNER_TEXTE = {
  titel: "Taschenrechner",
  anzeige: "Rechner-Eingabe",
  notizen: "Notizen (Nebenrechnung)",
  notizPlatzhalter: "Platz für Nebenrechnungen. Wird beim Fragenwechsel nicht gespeichert.",
  imSpeicher: "Im Speicher: ",
  speicherGeloescht: "Speicher gelöscht",
  hinweis: "Winkel in Grad. Tastatur: Ziffern und Rechenzeichen, Enter rechnet, Escape löscht, Rücktaste nimmt das Letzte zurück.",
} as const;

export type Aktion = "gleich" | "loeschen" | "zurueck" | "mc" | "mr" | "mplus";
export interface Taste { zeichen: string; name: string; einfuegen?: string | undefined; aktion?: Aktion | undefined }

const t = (zeichen: string, name: string, einfuegen?: string, aktion?: Aktion): Taste =>
  ({ zeichen, name, einfuegen: aktion ? undefined : (einfuegen ?? zeichen), aktion });

/** Die 32 Tasten in Lesereihenfolge (vier Spalten, Zeile fuer Zeile). */
export const TASTEN: readonly Taste[] = [
  t("sin", "Sinus", "sin("), t("cos", "Kosinus", "cos("), t("tan", "Tangens", "tan("), t("ln", "natürlicher Logarithmus", "ln("),
  t("log", "Zehnerlogarithmus", "log("), t("√", "Wurzel", "√("), t("^", "hoch"), t("π", "Pi", "pi"),
  t("MC", "Speicher löschen", "", "mc"), t("MR", "Speicher abrufen", "", "mr"), t("M+", "Speicher addieren", "", "mplus"), t("%", "Prozent"),
  t("(", "("), t(")", ")"), t("←", "Rückschritt", "", "zurueck"), t("C", "Alles löschen", "", "loeschen"),
  t("7", "7"), t("8", "8"), t("9", "9"), t("÷", "geteilt"),
  t("4", "4"), t("5", "5"), t("6", "6"), t("×", "mal"),
  t("1", "1"), t("2", "2"), t("3", "3"), t("−", "minus"),
  t("0", "0"), t(",", "Komma"), t("=", "gleich", "", "gleich"), t("+", "plus"),
];

/** Was eine Taste der Tastatur einfuegt (Anzeige in Tastenzeichen). */
export const TASTATUR: Record<string, string> = {
  "+": "+", "-": "−", "*": "×", "/": "÷", "^": "^", "%": "%", "(": "(", ")": ")", ",": ",", ".": ",",
};
/** Was die Ruecktaste als Ganzes zuruecknimmt. */
const EINHEITEN = ["sin(", "cos(", "tan(", "ln(", "log(", "√(", "pi"];

export function zurueck(s: string): string {
  const e = EINHEITEN.find((x) => s.endsWith(x));
  return s.slice(0, s.length - (e ? e.length : 1));
}

/* ---- Wo der Rechner steht, und ob seine Klappe offen ist (N26 T4) ------------------
   Nutzer-Entscheide 22.09.2026: wie die alte App (`app_loeser.js` `rechnerAnhaengen`)
   - bei `rechenassistent`, `kalkulation` und den Zufallsaufgaben (`generator`), in
   einer Klappe, die ZU startet; NICHT in der Simulation, NICHT im Rechen-Generator-
   Schirm (alt dort auch nicht, gemessen). Ob sie offen ist, merkt sich - wie alt -
   `panelOffen.rechner` im Lernstand, damit beide Fassungen denselben Zustand zeigen. */
/** Pool-Typen mit Rechner. Die Zufallsaufgabe (`generator`) haengt ihn selbst an. */
export const RECHNER_TYPEN: ReadonlySet<string> = new Set(["rechenassistent", "kalkulation"]);

const KLAPPE = "rechner";
const STANDARD_OFFEN = false;          // statPanel("rechner", …, false)

/** Wie `statPanel`: steht der Schluessel da, gilt sein Wahrheitswert, sonst der Standard. */
export function rechnerOffen(s: Lernstand): boolean {
  const p = s.panelOffen;
  return p && Object.prototype.hasOwnProperty.call(p, KLAPPE) ? !!p[KLAPPE] : STANDARD_OFFEN;
}

/** Wie `statPanel.ontoggle`: gleich dem Standard → Schluessel weg, sonst den Wert setzen. */
export function setzeRechnerOffen(s: Lernstand, offen: boolean): Lernstand {
  const p = { ...(s.panelOffen || {}) };
  if (offen === STANDARD_OFFEN) delete p[KLAPPE];
  else p[KLAPPE] = offen;
  return { ...s, panelOffen: p };
}
