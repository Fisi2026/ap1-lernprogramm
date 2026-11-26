-- Migration 0002: Fehlerberichte der Error Boundary (N32 Schritt 2, Entscheide E29/E30).
-- ⛔ Keine IP-Adresse, kein Name, keine Route, keine Frage-Kennung (schwaerze() in
--    fehlerregeln.ts, auf dem Geraet UND im Worker). `geraet` ist eine zufaellige
--    Kennung, die das Geraet selbst erzeugt – sie dient nur der Mengenbremse.
CREATE TABLE IF NOT EXISTS fehler (
  nr        INTEGER PRIMARY KEY AUTOINCREMENT,
  bereich   TEXT    NOT NULL,
  meldung   TEXT    NOT NULL,
  stack     TEXT    NOT NULL DEFAULT '',
  version   TEXT    NOT NULL DEFAULT '',
  erstellt  INTEGER NOT NULL,
  geraet    TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fehler_erstellt ON fehler (erstellt);
CREATE INDEX IF NOT EXISTS idx_fehler_geraet ON fehler (geraet, erstellt);
