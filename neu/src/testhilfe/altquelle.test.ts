/* Gegenprobe zu `altQuelle`: jede Datei der Liste liegt in `referenz/` UND nicht mehr an der
   Wurzel. Liegt eine doppelt, koennte ein Test still die falsche Fassung lesen. */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { createHash } from "node:crypto"
import { EINGEFROREN, IN_REFERENZ, altQuelle } from "./altquelle"

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")

describe("altQuelle: die alte App liegt in referenz/", () => {
  it.each([...IN_REFERENZ])("%s: in referenz/, nicht an der Wurzel", (datei) => {
    expect(altQuelle(WURZEL, datei)).toBe(path.join(WURZEL, "referenz", datei))
    expect(fs.existsSync(path.join(WURZEL, datei))).toBe(false)
  })
  /* N34 T0 (E50): der Kern wird aus der eingefrorenen Kopie gelesen – und die Kopie ist
     byte-gleich mit dem Tag `alt-app-final`. Faellt das, hat jemand die Referenz angefasst.
     Ausnahme seit 18.10.2026 (N40 V3 O5, Nutzer-Entscheid, SCHIENE_NEU E60 geschaerft): in `logik.js` ist
     genau EINE Kommentarzeile (FB-R3, Quellenname) neutral umgeschrieben – Code unveraendert, Summe neu gesetzt. */
  const SOLL: Record<string, string> = {
    "logik.js": "78c8fef8d0dbecbdc10dd58196dc9146a9d3b3e2c486e06e0a214fd040fff8d6",
    "app_glossar.js": "9c3a942bea1a49e8cc78eb6bfb4fc4dbdeda5a9923a98bba2b9d065c182b4c59",
    "spickzettel.js": "447fc0335f699f3d0cc95d3536385eb573958aa7878aac6dd7995ca65ed6db77",
    "abkuerzungen.js": "866c45ad34cc37e103553dc7c969824606f3800863b6d8ff4a295e17c0f9b951",
  }
  it("die eingefrorene Liste ist genau die mit Pruefsumme", () => {
    expect([...EINGEFROREN].sort()).toEqual(Object.keys(SOLL).sort())
  })
  it.each([...EINGEFROREN])("%s: aus referenz/ gelesen, Pruefsumme = alt-app-final", (datei) => {
    const p = altQuelle(WURZEL, datei)
    expect(p).toBe(path.join(WURZEL, "referenz", datei))
    expect(createHash("sha256").update(fs.readFileSync(p)).digest("hex")).toBe(SOLL[datei])
  })
  it("eine fehlende Datei wirft, statt still auszuweichen", () => {
    expect(() => altQuelle(WURZEL, "gibtsnicht.js")).toThrow(/fehlt/)
  })
})
