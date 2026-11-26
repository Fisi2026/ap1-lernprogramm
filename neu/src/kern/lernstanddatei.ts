/* LERNSTAND ALS DATEI – sichern und zurueckholen (Audit 26.09.2026, AUD-B2).

   Warum: der Lernstand liegt NUR im Speicher dieses Browsers. `storage.persist()` schuetzt vor
   dem Aufraeumen des Browsers, nicht vor Geraetewechsel, neuem Browser oder geloeschten Daten.
   ⛔ Import ERSETZT den Stand (Nutzer-Entscheid 26.09.: „Ersetzen nach Rueckfrage"), er mischt nicht.
   ⛔ Die Datei geht durch DIESELBE Kette wie ein geladener Stand: `migriere` → `pruefe`. Eine Datei
      aus einer NEUEREN App wird abgelehnt – sie still zu kuerzen hiesse, Lernstand zu vernichten.
   ⚠️ Kein DOM hier: die Datei wird im Schirm gelesen, hier nur Text → Ergebnis. */
import { migriere, pruefe, STAND_VERSION } from "./stand";
import type { Lernstand } from "./stand";
import { istObjekt } from "./pruefe.ts";

export const DATEI_FORMAT = "fisi-ap1-lernstand";
const DATEI_FASSUNG = 1;
/** Obergrenze fuer eine Importdatei – ein echter Stand liegt weit darunter. */
export const DATEI_GRENZE = 5_000_000;

export function dateiname(jetzt: number): string {
  return `ap1-lernstand-${new Date(jetzt).toISOString().slice(0, 10)}.json`;
}

export function alsDatei(stand: Lernstand, jetzt: number, appVersion: string): string {
  return JSON.stringify({
    format: DATEI_FORMAT, fassung: DATEI_FASSUNG,
    exportiert: new Date(jetzt).toISOString(), appVersion, stand,
  }, null, 1);
}

export type Import =
  | { ok: true; stand: Lernstand; reparaturen: string[]; exportiert: string | null }
  | { ok: false; fehler: string };

export function ausDatei(text: string): Import {
  if (text.length > DATEI_GRENZE) return { ok: false, fehler: "Die Datei ist zu groß für einen Lernstand." };
  let roh: unknown;
  try { roh = JSON.parse(text); } catch { return { ok: false, fehler: "Die Datei ist kein gültiges JSON." }; }
  if (!istObjekt(roh)) return { ok: false, fehler: "Die Datei enthält keinen Lernstand." };
  const o = roh;
  if (o.format !== DATEI_FORMAT) return { ok: false, fehler: "Das ist keine Lernstand-Datei dieser App." };
  if (typeof o.fassung !== "number" || o.fassung > DATEI_FASSUNG) {
    return { ok: false, fehler: "Die Datei stammt aus einer neueren Fassung der App – bitte erst die App aktualisieren." };
  }
  const s = o.stand;
  if (!istObjekt(s)) return { ok: false, fehler: "Die Datei enthält keinen Lernstand." };
  const st = s;
  if (typeof st.version === "number" && st.version > STAND_VERSION) {
    return { ok: false, fehler: "Der Lernstand stammt aus einer neueren Fassung der App – bitte erst die App aktualisieren." };
  }
  const w = migriere(st);
  if (w.fehlt !== undefined) return { ok: false, fehler: `Der Lernstand (Fassung ${w.fehlt}) lässt sich nicht übernehmen.` };
  const p = pruefe(w.stand);
  return { ok: true, stand: p.stand, reparaturen: p.reparaturen, exportiert: typeof o.exportiert === "string" ? o.exportiert : null };
}
