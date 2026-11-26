/* ============================================================================
   N43 M2 (E67, 14.10.2026, BUILD_LOG 170): DIE SCHICHTREGELN, ALS WAECHTER
   Gepruefter Graph: alle Module unter src/ (TypeScript-Quellen, `import type` erkannt).
   Laeuft ueber tools/architektur.py (Waechter 4f_architektur) mit dependency-cruiser aus .tooling/, Arbeitsverzeichnis neu/ (bzw. die Probe) –
   dort mit typescript@6, weil dependency-cruiser 18.6 TypeScript 7 (die App) noch nicht liest:
   gemessen 14.10. mit TS 7 1342 statt 1396 Kanten und `import type` als Laufzeit-Import (2 Fehlalarme).
   Ersetzt kern/architektur.test.ts (Regex): der liess Seiteneffekt-Importe, Zyklen und server/ durch
   (Sabotage-Vergleich in BUILD_LOG 170). Bekannte Antworten: tools/architektur_probe/ (--probe).
   ============================================================================ */
const AUSSER_TESTS = "\\.test\\.tsx?$";

module.exports = {
  forbidden: [
    {
      name: "keine-zyklen",
      comment: "Kein Modul darf ueber eine Kette auf sich selbst zurueckfuehren (Ziel E67: keine Zyklen).",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "kern-ohne-oberflaeche",
      comment: "kern/ rechnet – kein React, kein Laden des Pools, keine Oberflaechen-Schicht (Regel 1, ARCHITECTURE.md). `import type` ist erlaubt.",
      severity: "error",
      from: { path: "^src/kern/", pathNot: AUSSER_TESTS },
      to: {
        path: [
          "^src/(schirme|huelle|fragetypen|components|lib)/",
          "^src/daten/(laden|pooldaten|faelle)\\.",
          "(^|/)node_modules/react(-dom)?/",
          "^react(-dom)?(/|$)",
          "^@pool/",
        ],
        dependencyTypesNot: ["type-only"],
      },
    },
    {
      name: "server-nur-pruefe-und-route",
      comment: "Der Worker zieht aus der App nur kern/pruefe.ts und kern/route.ts (beide ohne eigene Importe, gemessen 14.10.) – Nutzer-Entscheid 14.10.: messen und bewerten.",
      severity: "error",
      from: { path: "^src/server/", pathNot: AUSSER_TESTS },
      to: {
        pathNot: ["^src/server/", "^src/kern/(pruefe|route)\\.ts$"],
        dependencyTypesNot: ["core", "npm", "npm-dev", "type-only"],
      },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.app.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: { extensions: [".ts", ".tsx", ".js", ".json"] },
  },
};
