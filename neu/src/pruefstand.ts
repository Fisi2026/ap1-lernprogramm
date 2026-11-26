/* Gemeinsame Vorbereitung aller Tests. Haelt sich kurz mit Absicht:
   was hier hineinwaechst, gilt still fuer jeden Test und ist dann nicht mehr
   nachvollziehbar.

   ⚠️ jest-dom nur dort, wo es ein Document gibt. Die Vorgabe-Umgebung ist "node"
      (siehe vitest.config.ts); Dateien mit // @vitest-environment jsdom bekommen
      die Zusicherungen, alle anderen brauchen sie nicht. */
if (typeof document !== "undefined") {
  await import("@testing-library/jest-dom/vitest");
}

/* N32/E31: der Pool ist ein eigener Chunk und wird in der App vor dem ersten
   Zeichnen geladen (`huelle/start.tsx`). Die Tests tun dasselbe HIER, einmal vor
   jeder Testdatei – so sehen Module, die `FRAGEN` beim Aufruf lesen, den Pool. */
const { ladePool } = await import("@/daten/laden");
await ladePool();

/* N38 P3: die faulen Schirme ebenso vorab – dann zeichnet `faul()` sie direkt, und die Tests
   bleiben synchron wie vorher (`huelle/faulschirme.ts`).
   ⛔ Im `beforeAll`, NICHT hier oben: hier liefe es VOR dem `vi.mock` der Testdatei, der Schirm
      zoege das echte Modul in den Cache, und der Mock griffe nicht (gemessen 28.09.:
      `simablauf.test.ts` und `rechner.simulation.jsdom.test.tsx` rot).
   ⚠️ Nur mit Document: ohne DOM zeichnet kein Test die App. */
if (typeof document !== "undefined") {
  const { ladeFauleSchirme } = await import("@/huelle/faulschirme");
  const { beforeAll } = await import("vitest");
  beforeAll(async () => { await ladeFauleSchirme(); });
}

