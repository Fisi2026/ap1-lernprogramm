/* N33 (E33): der Service Worker des Neubaus – handgeschrieben, OHNE neue Abhaengigkeit.
   ►► Das Plugin liest beim Bau die fertige Dateiliste aus dem Buendel (dieselbe Quelle wie das
      Vite-Manifest, inklusive `pooldaten-*.js`) und schreibt `app-sw.js` aus `vorlage.js`.
      Eine von Hand gepflegte Liste gibt es nicht – das war die Schwachstelle der alten `sw.js`.
   ►► Manifest und Icons kommen aus dem Wurzelordner (die der alten App, EINE Quelle).
   N29 (Umschalten, R9): dazu `sw.js` und `v2/sw.js` als ABSCHALT-SW (`abschalten.js`) fuer die
   dort registrierten alten Service Worker, und `_redirects` (Cloudflare wertet die Datei aus und
   liefert sie nicht aus) fuer Lesezeichen und installierte alte Apps. */
import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

export const ICONS = ["icon-192.png", "icon-512.png", "apple-touch-icon-180.png"] as const
/** Adresse des Neubau-SW relativ zur Basis. ⛔ NICHT `sw.js` – dort liegt der Abschalt-SW. */
export const APP_SW = "app-sw.js"
/** Adressen der alten Service Worker, jeweils relativ zur Basis. */
export const ABSCHALTEN = ["sw.js", "v2/sw.js"] as const
/** Nie vorab cachen: die Service Worker selbst und die Weiterleitungsregeln. */
const NIE_VORAB = new Set<string>([APP_SW, ...ABSCHALTEN, "_redirects", "_headers"])

/** NP1 (Nachpruefung 26.09.2026): der Cache-Name traegt neben der Version einen STEMPEL der
    Dateiliste (8 Hex aus SHA-256). Vorher teilten zwei Deploys derselben Version (N34 T1, T2)
    EINEN Cache: alte Buendel blieben liegen (~2,4 MB Pool je Schritt) und die neue Huelle kam ohne
    Update-Hinweis. Jetzt ist jede Auslieferung ein eigener Cache – `activate` raeumt den alten. */
export function cacheName(version: string, stempel?: string): string {
  return stempel ? `ap1-app-${version}-${stempel}` : `ap1-app-${version}`
}

/** Vorab-Liste relativ zum Geltungsbereich: "./" (Huelle), dann alle Dateien ausser SW und Regeln. */
/** Audit 26.09.2026 (AUD-C3): Schriftschnitte fuer Kyrillisch und Vietnamesisch braucht der Pool
    nicht (gemessen: 0 Zeichen aus deren Bereichen). Sie bleiben im Bau – der Browser holt sie nur,
    wenn ein Zeichen sie verlangt –, aber nicht mehr im Vorab-Cache (~31 KB je Geraet und Fassung). */
const NIE_VORAB_SCHRIFT = /geist-(cyrillic|cyrillic-ext|vietnamese)-wght/

export function vorabListe(dateien: readonly string[]): string[] {
  const rest = dateien.filter((d) => !NIE_VORAB.has(d) && !d.endsWith(".map") && !NIE_VORAB_SCHRIFT.test(d)).sort()
  return ["./", ...rest]
}

/** Stempel der VORAB-Liste (sortiert) – dieselbe Liste ergibt denselben Stempel. */
export function stempelFuer(dateien: readonly string[]): string {
  return createHash("sha256").update(vorabListe(dateien).join("\n")).digest("hex").slice(0, 8)
}

export function swQuelltext(vorlage: string, version: string, dateien: readonly string[]): string {
  if (!vorlage.includes('"__CACHE__"') || !vorlage.includes("__DATEIEN__")) {
    throw new Error("sw/vorlage.js: Platzhalter __CACHE__ oder __DATEIEN__ fehlt")
  }
  return vorlage
    .replace('"__CACHE__"', JSON.stringify(cacheName(version, stempelFuer(dateien))))
    .replace("__DATEIEN__", JSON.stringify(vorabListe(dateien), null, 2))
}

export function abschaltQuelltext(vorlage: string, basis: string): string {
  if (!vorlage.includes('"__ZIEL__"')) throw new Error("sw/abschalten.js: Platzhalter __ZIEL__ fehlt")
  return vorlage.replace('"__ZIEL__"', JSON.stringify(basis))
}

/** Weiterleitungen: die Startseite der alten App und die Parallel-Adresse des Neubaus. */
export function weiterleitungen(basis: string): string {
  return [
    `/lernprogramm_ap1.html ${basis} 301`,
    `/v2/index.html ${basis} 301`,
    `/v2/ ${basis} 301`,
    `/v2 ${basis} 301`,
  ].join("\n") + "\n"
}

/** Sicherheits-Koepfe fuer ALLE Assets (Cloudflare wertet `_headers` aus und liefert die Datei
    nicht aus). Pruefbericht 26.09.2026, OWASP HTTP Headers / CSP Cheat Sheet.
    ⛔ Seit 2.1.2 SCHARF (Konsolenprobe 26.09.: 0 Verstoesse). Seit 2.2.0 (Audit AUD-C8) zusaetzlich
       Trusted Types: HTML- und Skript-Senken nehmen nur Werte der Politik „ap1" (`src/lib/vertrauen.ts`).
       ►► Jede Aenderung hier faehrt `tools/sichtpruefung/rauch.js` (CI) – es sieht jeden Verstoss. */
export const CSP = [
  "default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:", "font-src 'self'", "connect-src 'self'", "worker-src 'self'",
  "manifest-src 'self'", "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'",
  "form-action 'self'", "require-trusted-types-for 'script'", "trusted-types ap1",
].join("; ")

export function sicherheitsKoepfe(): string {
  return [
    "/*",
    "  Strict-Transport-Security: max-age=31536000",
    "  X-Content-Type-Options: nosniff",
    "  X-Frame-Options: DENY",
    "  Referrer-Policy: no-referrer",
    "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "  Cross-Origin-Opener-Policy: same-origin",
    "  Content-Security-Policy: " + CSP,
  ].join("\n") + "\n"
}

export function manifestText(): string {
  return JSON.stringify({
    name: "AP1-Trainer – Fachinformatiker Systemintegration",
    short_name: "AP1-Trainer",
    description: "Offline-Lernprogramm zur Vorbereitung auf die AP1 (Fachinformatiker Systemintegration).",
    start_url: "./",
    scope: "./",
    display: "standalone",
    lang: "de",
    theme_color: "#15171C",
    background_color: "#15171C",
    icons: [
      { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  }, null, 2) + "\n"
}

export interface SwOrte { vorlage: string; abschalten: string; basis: string }

export function serviceWorker(wurzel: string, version: string, orte: SwOrte): Plugin {
  return {
    name: "ap1-service-worker",
    apply: "build",
    enforce: "post",
    generateBundle: { order: "post", handler(_opt, buendel) {
      for (const d of ICONS) {
        this.emitFile({ type: "asset", fileName: d, source: fs.readFileSync(path.join(wurzel, d)) })
      }
      this.emitFile({ type: "asset", fileName: "manifest.webmanifest", source: manifestText() })
      this.emitFile({ type: "asset", fileName: "_redirects", source: weiterleitungen(orte.basis) })
      this.emitFile({ type: "asset", fileName: "_headers", source: sicherheitsKoepfe() })
      const aus = abschaltQuelltext(fs.readFileSync(orte.abschalten, "utf8"), orte.basis)
      for (const d of ABSCHALTEN) this.emitFile({ type: "asset", fileName: d, source: aus })
      /* index.html ist hier schon im Buendel (vite:build-html laeuft vorher) – sonst waere
         die Huelle nicht in der Liste. Die Pruefung unten macht das laut statt still. */
      const dateien = [...Object.keys(buendel), ...ICONS, "manifest.webmanifest"]
      if (!dateien.includes("index.html")) throw new Error("sw: index.html fehlt im Buendel")
      if (!dateien.some((d) => /pooldaten-.*\.js$/.test(d))) throw new Error("sw: Pool-Chunk fehlt im Buendel")
      const vorlage = fs.readFileSync(orte.vorlage, "utf8")
      this.emitFile({ type: "asset", fileName: APP_SW, source: swQuelltext(vorlage, version, [...new Set(dateien)]) })
    } },
  }
}
