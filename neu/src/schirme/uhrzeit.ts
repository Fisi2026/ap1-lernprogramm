/* N32 (oxlint only-export-components): aus Simulation.tsx herausgezogen, damit die
   Komponentendatei nur Komponenten exportiert. Inhalt unveraendert. */
export function uhrzeit(sek: number): string {
  const s = Math.max(0, Math.floor(sek));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}
