/* ============================================================================
   DER POOL ALS EIGENE DATEI (N32 Schritt 3, Entscheid E31)

   ⛔ Dieses Modul wird NUR dynamisch geladen (`ladePool()` in laden.ts) – so
      baut Vite es als eigenen Chunk, und der Einstieg bleibt klein. Wer es
      statisch importiert, zieht ~650 KB gzip zurück in den Einstieg.
   Vite zieht alle Pool-Dateien beim Bauen ein (eager INNERHALB dieses Chunks):
   ist der Chunk da, ist der ganze Pool da – offline wie bisher.
   ============================================================================ */
export const fragenDateien = import.meta.glob<{ default: unknown }>("@pool/pool_m*.json", { eager: true });
export const faelleDateien = import.meta.glob<{ default: unknown }>("@pool/pool_faelle.json", { eager: true });
