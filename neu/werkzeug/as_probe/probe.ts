// Selbsttest der as-Ratsche: GENAU 3 unsichere Umwandlungen (Zeilen mit "UNSICHER"), 3 sichere.
type Tier = { name: string };
type Hund = Tier & { bellt: boolean };
declare const t: Tier;
declare const u: unknown;
declare const a: any;
export const h = t as Hund; // UNSICHER: enger als der Ausdruck
export const s = u as string; // UNSICHER: aus unknown
export const b = a as number; // UNSICHER: aus any
export const w = { name: "x", bellt: true } as Tier; // sicher: weiter
export const k = [1, 2] as const; // sicher: as const
export const d = h as Tier; // sicher: weiter
