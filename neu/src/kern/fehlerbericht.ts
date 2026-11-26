/* ============================================================================
   FEHLERBERICHT DER ERROR BOUNDARY (N32 Schritt 2, Entscheide E29/E30)

   Bricht ein Bereich beim Zeichnen ab, fängt `huelle/Bereichsgrenze.tsx` den
   Wurf und schickt EINEN Bericht an `POST /api/fehler`.
   ⛔ Nur Bereich, Meldung, gekürzter Stack, App-Version, Gerätekennung – keine
      Route, keine Frage-Kennung, nichts aus dem Lernstand (E30). Geschwärzt wird
      hier UND im Worker (dieselbe Funktion, `server/fehlerregeln.ts`).
   ⚠️ KEINE Warteschlange: ein Bericht ohne Netz geht verloren. Der Kasten sagt
      dann „konnte nicht gesendet werden" – er behauptet nichts, was nicht war.
   ============================================================================ */
import { FEHLER_GRENZEN, kuerzeStack, schwaerze } from "@/server/fehlerregeln";
import { geraetKennung, type Ablage, type Sende } from "@/kern/meldeversand";
import type { Bereich } from "@/kern/route";

export interface Fehlerbericht {
  bereich: Bereich;
  meldung: string;
  stack: string;
  geraet: string;
  version: string;
}

export function baueBericht(bereich: Bereich, wurf: unknown, geraet: string, version: string): Fehlerbericht {
  const f = wurf instanceof Error ? wurf : null;
  const roh = f ? `${f.name}: ${f.message}` : String(wurf);
  const meldung = schwaerze(roh).trim().slice(0, FEHLER_GRENZEN.meldung) || "(ohne Meldung)";
  return {
    bereich,
    meldung,
    stack: kuerzeStack(f?.stack ?? ""),
    geraet,
    version: version.slice(0, FEHLER_GRENZEN.version),
  };
}

export type Berichtstand = "sendet" | "gesendet" | "nicht gesendet";

/** Schickt den Bericht einmal. Liefert, ob der Server ihn angenommen hat (201). */
export async function sendeFehlerbericht(
  bereich: Bereich, wurf: unknown, ablage: Ablage, sende: Sende, version: string,
): Promise<Exclude<Berichtstand, "sendet">> {
  try {
    const b = baueBericht(bereich, wurf, geraetKennung(ablage), version);
    const r = await sende("/api/fehler", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(b),
    });
    return r.status === 201 ? "gesendet" : "nicht gesendet";
  } catch {
    return "nicht gesendet";
  }
}
