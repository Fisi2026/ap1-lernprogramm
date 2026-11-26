// Selbsttest der Zahl no_unsafe (tools/qualitaet_ratsche.py): GENAU 5 Befunde, je Regel einer (Zeilen mit "UNSICHER").
declare const a: any;
declare const u: unknown;
declare function zahl(x: number): number;
export function zugriff(): unknown { return u; }
export const m: unknown = a.feld; // UNSICHER: no-unsafe-member-access
export function ruf(): void { a(); } // UNSICHER: no-unsafe-call
export const z: number = a; // UNSICHER: no-unsafe-assignment
export function gib(): number { return a; } // UNSICHER: no-unsafe-return
export const r = zahl(a); // UNSICHER: no-unsafe-argument
export const sicher = zahl(1); // sicher
export const auchSicher: unknown = u; // sicher: unknown statt any
