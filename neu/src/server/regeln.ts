/* ============================================================================
   ONLINE-MELDUNGEN: DIE ANNAHMEREGELN (N20b, Entscheid E8)

   ⛔ Jeder darf schreiben – deshalb wird hier alles geprüft, was ankommt:
      bekannte Frage-Kennung, bekannter Grund, Längen, Form der Gerätekennung.
   ⛔ Es wird NICHTS gespeichert, was eine Person erkennbar macht: keine IP,
      kein Name, kein User-Agent. Die Gerätekennung erzeugt das Gerät selbst
      (zufällig) – sie dient nur der Mengenbremse.
   ⚠️ Nur relative Importe: wrangler bündelt diese Datei ohne Vites `@`-Alias.
   ============================================================================ */
import { FRAGE_IDS } from "./fragen-ids";
import { istObjekt } from "../kern/pruefe.ts";

const GRUENDE = ["Falsche Lösung", "Unklar formuliert", "Tippfehler", "Veraltet", "Sonstiges"] as const;
export const GRENZEN = {
  koerperBytes: 4096,
  text: 1000,
  version: 20,
  jeGeraetProStunde: 10,
  gesamtProTag: 500,
} as const;

const IDS = new Set<string>(FRAGE_IDS);
const GERAET = /^[A-Za-z0-9-]{16,64}$/;

interface Eingang {
  frageId: string;
  grund: string;
  text: string;
  geraet: string;
  fassung: string;
  version: string;
}

export type Pruefung = { ok: true; wert: Eingang } | { ok: false; fehler: string };

type Felder = Record<string, unknown>;

/** Die Felder als Text gelesen: fehlt oder falscher Typ → null (text/version → ""). */
function lies(o: Felder) {
  const str = (k: string) => (typeof o[k] === "string" ? o[k] : null);
  return { frageId: str("frageId"), grund: str("grund"), text: str("text") ?? "", geraet: str("geraet"), version: str("version") ?? "" };
}
type Gelesen = ReturnType<typeof lies>;

function pruefeKennung(f: Gelesen): string | { frageId: string; grund: string } {
  const { frageId, grund } = f;
  if (!frageId || !IDS.has(frageId)) return "unbekannte Frage";
  if (!grund || !(GRUENDE as readonly string[]).includes(grund)) return "unbekannter Grund";
  return { frageId, grund };
}

function pruefeFelder(f: Gelesen, o: Felder): string | { geraet: string } {
  const { text, geraet, version } = f;
  if (typeof o.text !== "undefined" && typeof o.text !== "string") return "Text ist kein Text";
  if (text.length > GRENZEN.text) return "Text zu lang";
  if (!geraet || !GERAET.test(geraet)) return "Gerätekennung ungültig";
  if (version.length > GRENZEN.version) return "Version zu lang";
  return { geraet };
}

export function pruefeEingang(roh: unknown): Pruefung {
  if (!istObjekt(roh)) return { ok: false, fehler: "kein Objekt" };
  const f = lies(roh);
  const kennung = pruefeKennung(f);
  if (typeof kennung === "string") return { ok: false, fehler: kennung };
  const rest = pruefeFelder(f, roh);
  if (typeof rest === "string") return { ok: false, fehler: rest };
  return { ok: true, wert: { ...kennung, text: f.text.trim(), geraet: rest.geraet, fassung: "neu", version: f.version } };
}

/** Vergleich in fester Zeit (Befund 26.09.2026, Cloudflare Workers Best Practices): beide Werte
    werden erst auf 32 Byte gehasht (SHA-256), dann Byte fuer Byte ohne fruehen Abbruch verglichen.
    So verraet die Antwortzeit weder den Inhalt noch die LAENGE des Schluessels. Laeuft im Worker
    und in Node gleich (nur Web Crypto, kein `timingSafeEqual`, das Node nicht kennt). */
export async function gleicherSchluessel(a: string, b: string): Promise<boolean> {
  if (!a || !b) return false;
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let d = x.length ^ y.length;
  for (let i = 0; i < x.length; i++) d |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return d === 0;
}
