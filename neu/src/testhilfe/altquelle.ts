/* Wo die Quellen der ALTEN App liegen – fuer die Gleichheitstests (N29 Teil 2, E39).

   Seit dem 24.09.2026 liegt die alte App in `referenz/` (nicht ausgeliefert, Tag `alt-app-final`).
   Seit N34 T6c auch `logik.js`, `app_glossar.js`, `abkuerzungen.js`, `spickzettel.js` – an der Wurzel
   liegt nichts mehr davon (der Neubau liest `kern/tabellen/`). `fragen.js`/`faelle.js` gibt es
   nicht mehr (E40): der Pool kommt ueber `tools/pool_laden.js`.

   ⛔⛔ REGEL „JE FALL" (E60, N37 U2, 27.09.2026): `referenz/` wird NIE angepasst. Aendert jemand eine Regel in
      `kern/` BEWUSST, wird genau der betroffene Gleichheitstest auf eine Eigenschaft der neuen Regel umgestellt
      und die Abweichung zur alten App dort benannt (Fall, alt → neu, Entscheid) – SCHIENE_NEU.md Abschnitt 5.
   ⛔ KEIN stiller Rueckfall: fehlt die Datei am erwarteten Ort, wirft `altQuelle`. Ein Test, der
      unbemerkt eine andere Fassung liest, beweist nichts mehr (derselbe Grund wie beim
      Drift-Waechter). */
import fs from "node:fs"
import path from "node:path"

/** Die Dateien, die mit N29 Teil 2 nach `referenz/` gezogen sind. */
export const IN_REFERENZ: ReadonlySet<string> = new Set([
  "lernprogramm_ap1.html", "index.html", "styles.css", "sw.js", "manifest.webmanifest",
  "app_state.js", "app_pool.js", "app_util.js", "app_ui.js", "app_frage.js", "app_loeser.js",
  "app_verbuchen.js", "app_seiten.js", "app_sim.js", "app_pages2.js",
])

/** N34 T0 (E50, 25.09.2026): der Kern, EINGEFROREN als Kopie in `referenz/` (Stand Tag `alt-app-final`,
    Pruefsumme in `altquelle.test.ts`). Die Gleichheitstests lesen ab jetzt DIESE Fassung – die an der
    Wurzel-Fassung ist seit T6c entfernt. */
export const EINGEFROREN: ReadonlySet<string> = new Set([
  "logik.js", "app_glossar.js", "spickzettel.js", "abkuerzungen.js",
])

export function altQuelle(wurzel: string, datei: string): string {
  const inRef = IN_REFERENZ.has(datei) || EINGEFROREN.has(datei)
  const p = inRef ? path.join(wurzel, "referenz", datei) : path.join(wurzel, datei)
  if (!fs.existsSync(p)) throw new Error(`altQuelle: ${datei} fehlt unter ${p}`)
  return p
}
