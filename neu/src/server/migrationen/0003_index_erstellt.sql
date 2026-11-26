-- Migration 0003 (Audit 26.09.2026, AUD-C1): die Tagesgrenze zaehlt bei JEDER Meldung
-- `COUNT(*) FROM meldungen WHERE erstellt > ?`. Ohne diesen Index lief das ueber die ganze
-- Tabelle – und offene Meldungen werden nie geloescht, die Tabelle waechst also nur.
CREATE INDEX IF NOT EXISTS idx_meldungen_erstellt ON meldungen (erstellt);
