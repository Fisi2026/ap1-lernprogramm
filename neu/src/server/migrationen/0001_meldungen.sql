-- Migration 0001: D1-Schema der Online-Meldungen (N20b, Entscheid E8).
-- ⛔ Keine IP-Adresse, kein Name. `geraet` ist eine zufaellige Kennung, die das
--    Geraet selbst erzeugt – sie dient nur der Mengenbremse.
CREATE TABLE IF NOT EXISTS meldungen (
  nr        INTEGER PRIMARY KEY AUTOINCREMENT,
  frage_id  TEXT    NOT NULL,
  grund     TEXT    NOT NULL,
  text      TEXT    NOT NULL DEFAULT '',
  erstellt  INTEGER NOT NULL,
  geraet    TEXT    NOT NULL,
  fassung   TEXT    NOT NULL DEFAULT '',
  version   TEXT    NOT NULL DEFAULT '',
  status    TEXT    NOT NULL DEFAULT 'offen',
  erledigt  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_meldungen_status ON meldungen (status, erstellt);
CREATE INDEX IF NOT EXISTS idx_meldungen_geraet ON meldungen (geraet, erstellt);
