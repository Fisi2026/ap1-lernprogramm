/* Die App-Version für den Neubau (N20b) – gelesen aus `neu/package.json` "version", der
   EINZIGEN Quelle der Version seit N29 Teil 2 (E41; vorher `app_state.js` der alten App).
   Versions-Guard in check.sh 4e. Vite und vitest setzen damit
   `__APP_VERSION__`; eine zweite, von Hand gepflegte Nummer gibt es nicht. */
import fs from "node:fs"
import path from "node:path"

export function appVersion(wurzel: string): string {
  const text = fs.readFileSync(path.join(wurzel, "neu", "package.json"), "utf8")
  const v: unknown = (JSON.parse(text) as { version?: unknown }).version
  if (typeof v !== "string" || !/^\d+\.\d+\.\d+$/.test(v)) throw new Error("version in neu/package.json nicht x.y.z")
  return v
}
