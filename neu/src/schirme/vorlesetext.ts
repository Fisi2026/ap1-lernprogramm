/* Meldung 13 (M07-717, 25.11.2026): was der Knopf „Vorlesen“ auf der Karteikarte spricht.
   Nutzer-Entscheid: Fragetext und danach die Antwortmoeglichkeiten in der ANGEZEIGTEN
   (gemischten) Reihenfolge; bei Typen ohne Optionen nur der Fragetext.
   ⚠️ Rein und DOM-frei: die angezeigten Optionen liest der Aufrufer von
      der Karte (`Vorlesen.tsx`), weil nur die Eingabe-Komponente ihre Mischung kennt (`fragetypen/mischung.ts`). */
import { PLATZHALTER } from "@/fragetypen/luecken";

/** Die Teile, die nacheinander gesprochen werden – je Teil eine Ansage, damit dazwischen eine Pause liegt. */
export function vorleseTeile(fragetext: string, optionen: readonly string[]): string[] {
  let n = 0;
  const frage = fragetext.split(PLATZHALTER).reduce((a, b) => `${a} Lücke ${++n} ${b}`).replace(/\s+/g, " ").trim();
  const teile = frage ? [frage] : [];
  optionen.forEach((o, i) => {
    const t = o.replace(/\s+/g, " ").trim();
    if (t) teile.push(`Antwort ${String.fromCharCode(65 + i)}: ${t}`);
  });
  return teile;
}

/** Gibt es eine deutsche Stimme? Ohne sie bleibt der Knopf verborgen (gemessen 25.11.: der App-Browser hat 0 Stimmen). */
export function deutscheStimme(stimmen: ReadonlyArray<{ lang: string }>): boolean {
  return stimmen.some((s) => s.lang.toLowerCase().startsWith("de"));
}
