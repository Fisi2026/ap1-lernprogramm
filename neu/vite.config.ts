import path from "node:path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { appVersion } from "./appversion.config.ts"
import { serviceWorker } from "./sw/plugin.ts"

// pool/ liegt eine Ebene hoeher und bleibt die EINZIGE Quelle des Bestands.
// Es wird nicht kopiert und nicht gespiegelt - Vite zieht es beim Bauen ein.
const WURZEL = path.resolve(__dirname, "..")
const VERSION = appVersion(WURZEL)
/* N29: der Neubau liegt unter / (vorher parallel unter /v2/, E2). */
const BASIS = "/"

export default defineConfig({
  /* N33 (E33): `sw.js`, Manifest und Icons entstehen beim Bau - `sw/plugin.ts`. */
  plugins: [react(), tailwindcss(), serviceWorker(WURZEL, VERSION, {
    vorlage: path.resolve(__dirname, "sw/vorlage.js"),
    abschalten: path.resolve(__dirname, "sw/abschalten.js"),
    basis: BASIS,
  })],
  define: { __APP_VERSION__: JSON.stringify(VERSION) },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pool": path.resolve(WURZEL, "pool"),
    },
  },
  server: { fs: { allow: [__dirname, WURZEL] } },
  /* ⛔⛔ GEBAUT WIRD NACH `../v2` – UND SEIT N29 IST DAS DER GANZE AUSLIEFERUNGSORDNER.
     `wrangler.jsonc` `assets.directory: "./v2"` (E22: Positivliste statt Sperrliste im
     Wurzelordner). Der Name `v2` ist Geschichte (Parallelbetrieb unter /v2/, E2); die App
     liegt unter / (`BASIS`). Das Bauergebnis liegt im Repo, `check.sh` bewacht den Drift.
     ⚠️ `base` MUSS mit dem Pfad uebereinstimmen, unter dem ausgeliefert wird – sonst zeigen
        die Verweise ins Leere und die Seite bleibt weiss. */
  base: BASIS,
  /* N32 Schritt 3 (E31): 3500 verdeckte das EINE 3-MB-Stueck. Jetzt liegt nur der
     Pool-Chunk darueber (2,37 MB roh, Absicht: ein Stueck, offline vollstaendig).
     2500 laesst genau ihn durch; die Grenze, die zaehlt, prueft `check.sh` 4f:
     Einstieg unter 190 KB GZIP (gemessen 212, seit N38 P3 mit faulen Schirmen 164). */
  build: { outDir: "../v2", emptyOutDir: true, sourcemap: false, chunkSizeWarningLimit: 2500 },
})
