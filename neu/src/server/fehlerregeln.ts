/* ============================================================================
   FEHLERBERICHTE: DIE ANNAHMEREGELN (N32 Schritt 2, Entscheide E29/E30)

   Die Error Boundary eines Bereichs schickt automatisch einen Bericht an
   `POST /api/fehler` und sagt es im Absturz-Kasten (E29).
   ⛔ Inhalt NUR (E30): Bereich, Meldung, gekürzter Stack, App-Version, Zeitpunkt
      (setzt der Server), Gerätekennung (nur Mengenbremse). Keine IP, kein Name,
      kein User-Agent, KEINE Route und KEINE Frage-Kennung – Regeln wie
      `/api/meldung`.
   ►► Deshalb wird SCHWARZ GEMACHT, und zwar ZWEIMAL: das Gerät vor dem Senden
      und der Server vor dem Speichern (ein alter oder fremder Absender hält
      sich nicht an die erste Stelle).
   ⚠️ Diese Datei importiert NICHTS Großes (nicht die 1131 Kennungen) – das Gerät
      bindet sie mit ein. Nur relative Importe (wrangler bündelt ohne `@`).
   ============================================================================ */
import { BEREICHE } from "../kern/route";
import { istObjekt } from "../kern/pruefe.ts";

export const FEHLER_GRENZEN = {
  meldung: 300,
  stack: 1500,
  stackZeilen: 12,
  version: 20,
  jeGeraetProStunde: 5,
  gesamtProTag: 200,
} as const;

const GERAET = /^[A-Za-z0-9-]{16,64}$/;

/** Entfernt, was eine Route oder eine Frage verrät: Frage-Kennungen (`M03-907`)
    und Query/Hash in Adressen (`…/v2/#frage=…`). */
export function schwaerze(s: string): string {
  return s
    .replace(/(https?:\/\/[^\s?#)]*)[?#][^\s)]*/g, "$1")
    .replace(/#frage=[^\s)]*/g, "#frage=…")
    .replace(/\bM\d{2}-\d{2,4}\b/g, "M??-???");
}

/** Erste Zeilen des Stacks, geschwärzt und auf die Grenze gekürzt. */
export function kuerzeStack(stack: string): string {
  const zeilen = schwaerze(stack).split("\n").slice(0, FEHLER_GRENZEN.stackZeilen);
  return zeilen.join("\n").slice(0, FEHLER_GRENZEN.stack);
}

interface FehlerEingang {
  bereich: string;
  meldung: string;
  stack: string;
  geraet: string;
  version: string;
}

export type FehlerPruefung = { ok: true; wert: FehlerEingang } | { ok: false; fehler: string };

type Felder = Record<string, unknown>;

/** Die Felder als Text gelesen: fehlt oder falscher Typ → null (stack/version → ""). */
function lies(o: Felder) {
  const str = (k: string) => (typeof o[k] === "string" ? o[k] : null);
  return { bereich: str("bereich"), meldung: str("meldung"), stack: str("stack") ?? "", geraet: str("geraet"), version: str("version") ?? "" };
}
type Gelesen = ReturnType<typeof lies>;

function pruefeKopf(f: Gelesen): string | { bereich: string; meldung: string } {
  const { bereich, meldung } = f;
  if (!bereich || !(BEREICHE as readonly string[]).includes(bereich)) return "unbekannter Bereich";
  if (meldung === null || !meldung.trim()) return "Meldung fehlt";
  if (meldung.length > FEHLER_GRENZEN.meldung) return "Meldung zu lang";
  return { bereich, meldung };
}

function pruefeRest(f: Gelesen, o: Felder): string | { geraet: string } {
  const { stack, geraet, version } = f;
  if (typeof o.stack !== "undefined" && typeof o.stack !== "string") return "Stack ist kein Text";
  if (stack.length > FEHLER_GRENZEN.stack) return "Stack zu lang";
  if (!geraet || !GERAET.test(geraet)) return "Gerätekennung ungültig";
  if (version.length > FEHLER_GRENZEN.version) return "Version zu lang";
  return { geraet };
}

export function pruefeFehler(roh: unknown): FehlerPruefung {
  if (!istObjekt(roh)) return { ok: false, fehler: "kein Objekt" };
  const f = lies(roh);
  const kopf = pruefeKopf(f);
  if (typeof kopf === "string") return { ok: false, fehler: kopf };
  const rest = pruefeRest(f, roh);
  if (typeof rest === "string") return { ok: false, fehler: rest };
  return {
    ok: true,
    wert: { bereich: kopf.bereich, meldung: schwaerze(kopf.meldung.trim()), stack: kuerzeStack(f.stack), geraet: rest.geraet, version: f.version },
  };
}
