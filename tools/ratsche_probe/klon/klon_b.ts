// Probe der jscpd-Ratsche: zwei gleiche Dateien = genau EIN Klon
export function summe(werte: number[]): number {
  let ergebnis = 0;
  for (const wert of werte) {
    if (wert > 0) {
      ergebnis += wert * 2;
    } else {
      ergebnis -= wert / 2;
    }
  }
  const mittel = ergebnis / Math.max(werte.length, 1);
  return Math.round(mittel * 100) / 100 + ergebnis;
}
