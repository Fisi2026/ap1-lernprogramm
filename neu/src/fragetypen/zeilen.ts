/* N32 (oxlint only-export-components): aus Bausteine.tsx herausgezogen, damit die
   Komponentendatei nur Komponenten exportiert. Inhalt unveraendert. */
/** Zerlegt eine Geruest-Zeile in Text und Marker.
    ⛔ Erkannt wird NUR, was auch eine Ziel-Nummer ist. Im Bestand stehen in den
       Pseudocode-Zeilen auch echte Feldzugriffe wie `werte[0]` und `werte[i]`
       (gemessen: zweimal `[0]`, einmal `[i]`) — die sind Teil des Codes und
       duerfen kein Eingabefeld werden. */
export function zerlegeZeile(
  zeile: string,
  nummern: ReadonlySet<string>,
): Array<{ text: string } | { marke: string }> {
  const teile: Array<{ text: string } | { marke: string }> = [];
  const OFFEN = String.fromCharCode(91);
  const ZU = String.fromCharCode(93);
  let i = 0;
  let puffer = "";
  while (i < zeile.length) {
    const a = zeile.indexOf(OFFEN, i);
    if (a < 0) break;
    const b = zeile.indexOf(ZU, a);
    if (b < 0) break;
    const inhalt = zeile.slice(a + 1, b);
    if (nummern.has(inhalt)) {
      puffer += zeile.slice(i, a);
      teile.push({ text: puffer });
      teile.push({ marke: inhalt });
      puffer = "";
    } else {
      puffer += zeile.slice(i, b + 1);
    }
    i = b + 1;
  }
  puffer += zeile.slice(i);
  if (puffer !== "" || teile.length === 0) teile.push({ text: puffer });
  return teile;
}
