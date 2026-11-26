/* ============================================================================
   WELCHE FRAGEN KOMMEN UEBERHAUPT IN FRAGE?

   Vor dem Ziehen steht das Filtern. Die alte App tut das in drei Stufen, und
   jede hat einen eigenen Grund:

     1. `uebenPasst`  — Pruefungsteil-Filter der UEBEN-Auswahl (AP1 / AP2 / beide).
        ⚠️ BEWUSST NICHT `passtAP`: das steuert die globalen Ansichten (Statistik,
           Simulation) und bleibt AP1-zentriert. M09 ist in beiden ausgeschlossen.
     2. `themaGewaehlt` — ganze Gebiete ODER einzelne Feinthemen. Nichts gewaehlt
        heisst alles. Dazu der Schwerpunkt "Wirtschaft", der UND-verknuepft wirkt.
     3. `aufStufeFiltern` — die adaptive Stufe, JE THEMA.

   ⛔ ZU 3 GEHOERT EIN NUTZER-ENTSCHEID VOM 09.09.2026, DER NICHT VERLOREN GEHEN
      DARF ("Nachbarstufe bei Knappheit"): hat ein Thema auf seiner Stufe weniger
      als `CONFIG.stufeMinKandidaten` Fragen, rueckt die Stufe DARUNTER nach —
      je Thema gemessen, nie global, nie nach oben.
   ⛔ UND: KEIN RUECKFALL JE THEMA. Hat ein Thema auf seiner Stufe gar nichts,
      bleibt es draussen. Ein Rueckfall je Gruppe wuerde im Grundzustand Themen
      OHNE Stufe-1-Frage mit ihren hoeheren Stufen hereinholen — `test_adaptiv`
      der alten App hat genau das sofort gemeldet.
   ============================================================================ */
import { CONFIG } from "./tabellen/konfig.ts";
import type { Lernstand } from "./stand";
import type { Frage } from "@/daten/typen";
import { gebietFuer, themaKey, themaStufe } from "./lernen.ts";
import { istGekonnt } from "./gekonnt.ts";

/** Aus app_pool.js — der AP1-Querschnitt "Wirtschaft", quer ueber vier Module.
    ⚠️ Abgeschrieben, und deshalb in `auswahl.gleichheit.test.ts` Eintrag fuer
       Eintrag gegen die Liste der alten App gehalten. */
export const WIRTSCHAFT_THEMEN: ReadonlyArray<readonly [string, string]> = [
  ["M01", "Machbarkeit & Kalkulation"],
  ["M02", "Marktformen & Marktsituation"],
  ["M02", "Bezugskalkulation & Skonto"],
  ["M02", "Nutzwertanalyse"],
  ["M02", "Bedarfsanalyse & Marktforschung"],
  ["M02", "Vertriebsformen"],
  ["M03", "Wirtschaftlichkeit & TCO"],
  ["M07", "Vertragsarten"],
  ["M07", "Vertragsstörungen & Mängel"],
  ["M07", "SLA & Servicevertrag"],
  ["M07", "Unternehmensziele & Leitbild"],
  ["M07", "Aufbauorganisation & Vollmachten"],
  ["M07", "Soll-Ist & Nachkalkulation"],
];

export function istWirtschaft(f: Frage): boolean {
  if (!f) return false;
  return WIRTSCHAFT_THEMEN.some(([m, t]) => m === f.modul && t === f.thema);
}

/** M09 ist der Klausur-Pool und gehoert NIE in die allgemeine Zufallsauswahl. */
export function istUnterrichtsFrage(f: Frage): boolean {
  return !!f && f.modul === "M09";
}

/** N28/E47: wie viele Fragen der Klausurvorbereitung im Pool stehen. Der Schirm `unterricht`
    zeigt diese Zahl und sagt bei 0 selbst, dass kein Stoff da ist (kein stiller leerer Schirm). */
export function unterrichtsBestand(fragen: readonly Frage[]): number {
  return fragen.filter(istUnterrichtsFrage).length;
}

export function uebenPasst(stand: Lernstand, f: Frage): boolean {
  if (!f || istUnterrichtsFrage(f)) return false;
  if (stand.uebenAP === "ap1") return f.pruefungsteil !== "AP2";
  if (stand.uebenAP === "ap2") return f.pruefungsteil === "AP2";
  return true;
}

export function themaGewaehlt(stand: Lernstand, f: Frage): boolean {
  const g = stand.gebiete || [];
  const th = stand.themen || [];
  if (!g.length && !th.length) return true;
  const gb = f.gebiet ?? (gebietFuer ? gebietFuer(f) : undefined);
  if (gb && g.indexOf(gb) >= 0) return true;
  return th.indexOf(f.modul + "|" + f.thema) >= 0;
}

/** Die Stufe, auf der ein Thema gerade steht. Im Modus "manuell" uebersteuert
    der Lerner mit der globalen Stufe. */
export function stufeFuer(stand: Lernstand, f: Frage): number {
  if (stand.levelModus !== "auto") return stand.level;
  return themaStufe(
    stand.themaLevel,
    themaKey(f.modul, f.thema),
    stand.level,
  );
}

export function aufStufeFiltern(stand: Lernstand, menge: readonly Frage[]): Frage[] {
  const minN = CONFIG.stufeMinKandidaten;
  const proThema = new Map<string, Frage[]>();
  for (const f of menge) {
    const k = f.modul + "|" + f.thema;
    const liste = proThema.get(k);
    if (liste) liste.push(f);
    else proThema.set(k, [f]);
  }
  const out: Frage[] = [];
  for (const gruppe of proThema.values()) {
    const stufe = stufeFuer(stand, gruppe[0]!);   // haengt am Thema, in der Gruppe also gleich
    let genommen = gruppe.filter((f) => f.schwierigkeit === stufe);
    for (let s = stufe - 1; s >= 1 && genommen.length < minN; s--) {
      genommen = genommen.concat(gruppe.filter((f) => f.schwierigkeit === s));
    }
    out.push(...genommen);
  }
  return out.length ? out : [...menge];
}

export function kandidaten(stand: Lernstand, alle: readonly Frage[]): string[] {
  /* „Kann ich schon“ (25.11.2026, kern/gekonnt.ts): VOR dem Stufenfilter raus, damit die
     Nachbarstufe bei Knappheit an den Fragen misst, die wirklich noch kommen koennen. */
  const pool = alle.filter(
    (f) => uebenPasst(stand, f) && themaGewaehlt(stand, f) && (!stand.wirtschaftNur || istWirtschaft(f)) &&
      !istGekonnt(stand, f.id),
  );
  return aufStufeFiltern(stand, pool).map((f) => f.id);
}

/** Der Typ, an dem sich die Wiederholungssperre orientiert — bei `bild` der
    unterTyp, genau wie `typVon` in app_util.js. */
export function typVon(f: Frage): string {
  return f.typ === "bild" ? (f.unterTyp || "mc") : f.typ;
}

/** Kandidaten ohne direkte Typ-Wiederholung — wenn das ueberhaupt geht. */
export function kandidatenMitTypWechsel(
  stand: Lernstand,
  alle: readonly Frage[],
  nachId: (id: string) => Frage | undefined,
): string[] {
  const ids = kandidaten(stand, alle);
  if (!stand.lastTyp) return ids;
  const anders = ids.filter((id) => {
    const f = nachId(id);
    return f && typVon(f) !== stand.lastTyp;
  });
  return anders.length ? anders : ids;
}
