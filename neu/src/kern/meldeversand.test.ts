/* ============================================================================
   N20b: VERSAND MIT WARTESCHLANGE – UND DER DURCHGANG APP → API → SQL

   ⛔ Der wichtigste Fall ist der letzte: `sendeAusstehende` spricht dort mit der
      ECHTEN `bearbeite()` über echtes SQLite. Nur so ist belegt, dass das, was
      die App schickt, vom Server auch angenommen wird – zwei Seiten, die jede
      für sich grün sind, können trotzdem aneinander vorbeireden.
   ============================================================================ */
import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import {
  vormerken, zuruecknehmen, schlange, versandstand, sendeAusstehende, geraetKennung,
  S_GERAET, S_SCHLANGE,
} from "./meldeversand";
import type { Ablage, Sende } from "./meldeversand";
import { bearbeite } from "@/server/api";
import type { D1, D1Anweisung } from "@/server/api";
import { pruefeEingang } from "@/server/regeln";
import { FRAGE_IDS } from "@/server/fragen-ids";

function ablage(): Ablage & { daten: Map<string, string> } {
  const daten = new Map<string, string>();
  return { daten, getItem: (k) => daten.get(k) ?? null, setItem: (k, v) => { daten.set(k, v); } };
}
const antwort = (status: number) => Promise.resolve(new Response("{}", { status }));
const A = { frageId: FRAGE_IDS[0], grund: "Tippfehler", text: "x", datum: 100 };
const B = { frageId: FRAGE_IDS[1], grund: "Veraltet", text: "", datum: 200 };

describe("Warteschlange", () => {
  it("ersetzt eine ältere Meldung zur selben Frage und nimmt zurück", () => {
    const a = ablage();
    vormerken(a, A);
    vormerken(a, B);
    vormerken(a, { ...A, text: "neu", datum: 300 });
    expect(schlange(a).map((m) => [m.frageId, m.datum])).toEqual([[B.frageId, 200], [A.frageId, 300]]);
    zuruecknehmen(a, B.frageId);
    expect(schlange(a).map((m) => m.frageId)).toEqual([A.frageId]);
  });

  it("überlebt kaputten Speicher", () => {
    const a = ablage();
    a.setItem(S_SCHLANGE, "{kaputt");
    expect(schlange(a)).toEqual([]);
    a.setItem(S_SCHLANGE, '{"kein":"array"}');
    expect(schlange(a)).toEqual([]);
  });
});

describe("sendeAusstehende", () => {
  it("leere Schlange: kein Netz, keine Gerätekennung", async () => {
    const a = ablage();
    const sende = vi.fn<Sende>();
    expect(await sendeAusstehende(a, sende, "1")).toBe(0);
    expect(sende).not.toHaveBeenCalled();
    expect(a.daten.has(S_GERAET)).toBe(false);
  });

  it("201: raus aus der Schlange, Stand „gesendet“ – mit dem richtigen Körper", async () => {
    const a = ablage();
    vormerken(a, A);
    const sende = vi.fn<Sende>(() => antwort(201));
    expect(await sendeAusstehende(a, sende, "1.29.0")).toBe(1);
    const [url, init] = sende.mock.calls[0];
    expect(url).toBe("/api/meldung");
    expect(init.method).toBe("POST");
    const koerper = JSON.parse(String(init.body));
    expect(koerper).toEqual({ frageId: A.frageId, grund: "Tippfehler", text: "x", geraet: koerper.geraet, version: "1.29.0" });
    expect(schlange(a)).toEqual([]);
    expect(versandstand(a, A.frageId, A.datum)).toBe("gesendet");
    expect(versandstand(a, A.frageId, 999), "eine NEUERE Meldung ist nicht die gesendete").toBeNull();
  });

  it("kein Netz: alles bleibt liegen, der Rest wird gar nicht erst versucht", async () => {
    const a = ablage();
    vormerken(a, A);
    vormerken(a, B);
    const sende = vi.fn<Sende>(() => Promise.reject(new TypeError("offline")));
    expect(await sendeAusstehende(a, sende, "1")).toBe(0);
    expect(sende).toHaveBeenCalledTimes(1);
    expect(schlange(a)).toHaveLength(2);
    expect(versandstand(a, A.frageId, A.datum)).toBe("wartet");
  });

  it.each([429, 404, 500, 503])("%i: bleibt in der Schlange", async (status) => {
    const a = ablage();
    vormerken(a, A);
    expect(await sendeAusstehende(a, () => antwort(status), "1")).toBe(0);
    expect(versandstand(a, A.frageId, A.datum)).toBe("wartet");
  });

  it("400: abgewiesen, wird nicht endlos wiederholt – die nächste geht trotzdem", async () => {
    const a = ablage();
    vormerken(a, A);
    vormerken(a, B);
    const sende = vi.fn<Sende>()
      .mockImplementationOnce(() => antwort(400))
      .mockImplementationOnce(() => antwort(201));
    expect(await sendeAusstehende(a, sende, "1")).toBe(1);
    expect(versandstand(a, A.frageId, A.datum)).toBe("abgewiesen");
    expect(versandstand(a, B.frageId, B.datum)).toBe("gesendet");
    expect(schlange(a)).toEqual([]);
  });
});

describe("Gerätekennung", () => {
  it("bleibt gleich, ersetzt Unbrauchbares – und der Server nimmt sie an", () => {
    const a = ablage();
    const k = geraetKennung(a);
    expect(geraetKennung(a)).toBe(k);
    a.setItem(S_GERAET, JSON.stringify("<b>"));
    const k2 = geraetKennung(a, () => "ersatz-kennung-1234567890");
    expect(k2).toBe("ersatz-kennung-1234567890");
    expect(pruefeEingang({ frageId: A.frageId, grund: "Sonstiges", geraet: k }).ok).toBe(true);
  });
});

describe("Durchgang: App → API → SQL", () => {
  it("was die App schickt, landet in der Tabelle", async () => {
    const hier = path.dirname(fileURLToPath(import.meta.url));
    const mig = path.join(hier, "../server/migrationen");
    const db = new DatabaseSync(":memory:");
    for (const d of fs.readdirSync(mig).sort()) db.exec(fs.readFileSync(path.join(mig, d), "utf8"));
    const DB: D1 = {
      prepare(sql) {
        let w: unknown[] = [];
        const a: D1Anweisung = {
          bind: (...x) => { w = x; return a; },
          first: async <T,>() => (db.prepare(sql).get(...(w as never[])) as T) ?? null,
          // oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- T ist die vom Aufrufer gesetzte Ergebnistyp-Annahme (all<X>())
          all: async <T,>() => ({ results: db.prepare(sql).all(...(w as never[])) as T[] }),
          run: async () => db.prepare(sql).run(...(w as never[])),
        };
        return a;
      },
    };
    const sende: Sende = (url, init) => bearbeite(new Request("https://lern.app" + url, init), { DB });
    const a = ablage();
    vormerken(a, { ...A, text: "  am Server  " });
    vormerken(a, B);
    expect(await sendeAusstehende(a, sende, "1.29.0")).toBe(2);
    const zeilen = db.prepare("SELECT frage_id, grund, text, version, fassung, geraet FROM meldungen ORDER BY nr").all();
    expect(zeilen).toEqual([
      { frage_id: A.frageId, grund: "Tippfehler", text: "am Server", version: "1.29.0", fassung: "neu", geraet: geraetKennung(a) },
      { frage_id: B.frageId, grund: "Veraltet", text: "", version: "1.29.0", fassung: "neu", geraet: geraetKennung(a) },
    ]);
  });
});
