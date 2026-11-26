/* Mutationstest (N43 M3): dieselbe Konfiguration wie `vitest.config.ts`, aber ohne die Pruefungen, die unter
   Strykers Instrumentierung nicht laufen:
   * Zusage „keine dynamische Codeauswertung“ liest den QUELLTEXT – Stryker baut seinen Mutantenschalter in genau
     diese Dateien ein, die Zusage schlaegt im Probelauf darum immer an.
   * `validierung.gleichheit.test.ts` laeuft seit N43 M3 Runde 2 (16.10.2026) mit: V8 baut den Text nativer TypeErrors
     aus dem instrumentierten Ausdruck; der Test kuerzt ihn nur unter Stryker (`meldung()`). Gemessen an validierung.ts:
     mit der Datei 96,04 % in 17:20, mit Ausschluss 76,22 % in 32:51 (BUILD_LOG 211).
   * `huelle/faulschirme.laden.jsdom.test.tsx` NICHT (Nutzer-Entscheid 18.10.2026, BUILD_LOG 220): der Test laedt mit
     `vi.resetModules` alle Schirme neu und fuehrt damit Modul-Code IN einem Test aus – Stryker wertet statische Mutanten
     dann als „ueberlebt“ statt „ignoriert“. Gemessen an freitext-synonyme.ts: mit dem Test 604 ueberlebt, ohne ihn
     604 ignoriert; kern+server 84,26 % (196 ignoriert) gegen 92,62 % (1021 ignoriert). faulschirme.ts selbst sinkt dadurch. */
import { defineConfig, mergeConfig, configDefaults } from "vitest/config"
import basis from "./vitest.config.ts"

export default mergeConfig(basis, defineConfig({
  test: {
    testNamePattern: "^(?!.*keine dynamische Codeauswertung).*$",
    exclude: [...configDefaults.exclude, "src/huelle/faulschirme.laden.jsdom.test.tsx"],
  },
}))
