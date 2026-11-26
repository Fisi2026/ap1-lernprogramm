/* AUD-B2: Lernstand als Datei – Hin- und Rueckweg, und jede Ablehnung mit bekannter Antwort. */
import { describe, it, expect } from "vitest";
import { alsDatei, ausDatei, dateiname, DATEI_FORMAT, DATEI_GRENZE } from "./lernstanddatei";
import { leererStand, STAND_VERSION } from "./stand";

const T = Date.UTC(2026, 8, 26, 12);
const probe = () => ({ ...leererStand(), tagesziel: 33, fehlerDeck: { "M01-002": { streak: 1, due: T } } });

describe("Lernstand als Datei", () => {
  it("Hin und zurück ergibt denselben Stand – ohne Reparatur", () => {
    const r = ausDatei(alsDatei(probe(), T, "2.2.0"));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.stand).toEqual(probe());
    expect(r.reparaturen).toEqual([]);
    expect(r.exportiert).toBe("2026-09-26T12:00:00.000Z");
  });
  it("Dateiname trägt das Datum", () => {
    expect(dateiname(T)).toBe("ap1-lernstand-2026-09-26.json");
  });
  it("falsche Arten werden repariert und genannt, unbekannte Felder verworfen", () => {
    const d = JSON.parse(alsDatei(probe(), T, "x"));
    d.stand.tagesziel = "viel";
    d.stand.fremd = 1;
    const r = ausDatei(JSON.stringify(d));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.stand.tagesziel).toBe(leererStand().tagesziel);
    expect(r.reparaturen.join(" | ")).toMatch(/tagesziel/);
    expect(r.reparaturen.join(" | ")).toMatch(/fremd/);
  });
  it("lehnt ab: kein JSON, kein Objekt, fremdes Format, ohne Stand, zu groß", () => {
    const nein = (t: string) => { const r = ausDatei(t); expect(r.ok, t.slice(0, 40)).toBe(false); return r.ok ? "" : r.fehler; };
    expect(nein("{kaputt")).toMatch(/kein gültiges JSON/);
    expect(nein("[1,2]")).toMatch(/keinen Lernstand/);
    expect(nein(JSON.stringify({ format: "anders", fassung: 1, stand: {} }))).toMatch(/keine Lernstand-Datei/);
    expect(nein(JSON.stringify({ format: DATEI_FORMAT, fassung: 1 }))).toMatch(/keinen Lernstand/);
    expect(nein(JSON.stringify({ format: DATEI_FORMAT, fassung: 1, stand: [] }))).toMatch(/keinen Lernstand/);
    expect(nein(" ".repeat(DATEI_GRENZE + 1))).toMatch(/zu groß/);
  });
  it("⛔ lehnt Dateien aus einer NEUEREN App ab, statt sie still zu kürzen", () => {
    const zuNeu = (o: Record<string, unknown>) => ausDatei(JSON.stringify({ format: DATEI_FORMAT, fassung: 1, stand: probe(), ...o }));
    const a = zuNeu({ fassung: 2 });
    expect(a.ok).toBe(false);
    const b = zuNeu({ stand: { ...probe(), version: STAND_VERSION + 1 } });
    expect(b.ok).toBe(false);
    if (!b.ok) expect(b.fehler).toMatch(/neueren Fassung/);
  });
});
