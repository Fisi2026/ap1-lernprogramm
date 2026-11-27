import path from "node:path"
import { defineConfig } from "vitest/config"
import { appVersion } from "./appversion.config.ts"

const WURZEL = path.resolve(import.meta.dirname, "..")

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(appVersion(WURZEL)) },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@pool": path.resolve(WURZEL, "pool"),
    },
  },
  test: {
    /* GEMESSEN AM 11.09.2026: mit jsdom als Vorgabe brauchte der Lauf 68 s, davon
       84 % allein fuer das Aufbauen der Umgebung — fuer zwei Dateien, die gar kein
       DOM anfassen. Eine Pruefung, die so lange braucht, faehrt bald niemand mehr.
       ►► Vorgabe ist "node". Wer ein DOM braucht, sagt es in seiner Datei:
          // @vitest-environment jsdom      (erste Zeile) */
    environment: "node",
    /* ⛔⛔ GEMESSEN AM 16.09.2026, NICHT GERATEN: der volle Lauf war in 3 von 4
       Durchlaeufen rot — jedes Mal mit "Test timed out in 5000ms", NIE mit einer
       falschen Zusicherung. Derselbe Test braucht ALLEIN 0,4-1,9 s, im vollen Lauf
       5,4 s; der naechstbeste Wert im selben Lauf lag bei 4,4 s. Zwoelf Worker
       teilen sich die Maschine, und die Vorgabe von 5 s liegt genau auf der Kante.
       ►► **Eine Zeitgrenze soll einen Haenger fangen, nicht die Auslastung messen.**
          Ein Test, der an der Maschinenlast scheitert, meldet nichts ueber den Code
          und macht jeden roten Lauf wertlos, weil niemand mehr hinsieht.
       ⚠️ 20 s ist fast das Vierfache des gemessenen Hoechstwertes und bleibt eine
          Grenze: ein echter Haenger faellt weiterhin auf. Wer sie senkt, misst
          vorher wieder (5 volle Laeufe, nicht einer). */
    /* ⛔ NACHGEMESSEN 08.10.2026: im vollen check.sh (7 Suiten parallel) kippten 3 von 5 Laeufen an
       "Test timed out in 20000ms" (schema.deckung, rechner.simulation.jsdom) - auf Akku UND am Netzteil;
       allein 1187/1187 gruen, Hoechstwert eines gruenen Laufs 11,4 s (eingabe.test.tsx). 40 s ist das
       3,5-Fache davon und faengt einen echten Haenger weiterhin. */
    testTimeout: 40000,
    globals: false,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/pruefstand.ts"],
    /* Audit 26.09.2026 (AUD-B4): Schwellen knapp UNTER dem Ist vom 26.09. (Stmts 92,86 · Branches
       83,8 · Functions 92 · Lines 94,86). Sie greifen nur mit `--coverage` – die CI faehrt das als
       eigenen Schritt. ⛔ Nicht senken, um grün zu werden: fehlende Tests schreiben. */
    coverage: {
      provider: "v8",
      /* Neupruefung 28.09.2026 (NB1): der Bericht liegt AUSSERHALB von neu/ - als `neu/coverage/` las
         Tailwind ihn als Quelle, und der Probebau wich von `v2/` ab (check.sh rot, Gefahr: fremde Klassen
         in der Auslieferung). Die CI setzt denselben Ordner. */
      reportsDirectory: "../_to_delete/helfer/coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/testhilfe/**", "src/huelle/__schnappschuss__/**"],
      /* Neupruefung 27.09.2026 (NA3): nachgezogen auf knapp unter das Ist 94,69 / 87,23 / 93,52 / 96,36.
         branches 86 -> 89 (Nutzer-Entscheid 18.10.2026, BUILD_LOG 220/221): Ist 90,36 % (3744/4143, gemessen 18.10.).
         branches 89 -> 93 (Nutzer-Entscheid 27.11.2026, BUILD_LOG 303): Ist 94,26 % (gemessen 27.11., Cloud). */
      thresholds: { statements: 94, branches: 93, functions: 93, lines: 96 },
    },
  },
})
