/* N32 (oxlint only-export-components): aus Lueckentext.tsx herausgezogen, damit die
   Komponentendatei nur Komponenten exportiert. Inhalt unveraendert. */
export const PLATZHALTER = "___";

export function zerlegen(text: string): string[] {
  return text.split(PLATZHALTER);
}
