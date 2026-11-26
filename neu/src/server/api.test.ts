/* ============================================================================
   N20b: DIE API DER ONLINE-MELDUNGEN – GEGEN ECHTES SQL

   ⛔ D1 wird durch node:sqlite nachgebildet, das Schema kommt aus denselben
      Migrationen, die in D1 eingespielt werden. Geprüft wird, was wirklich in der
      Tabelle landet – nicht, was eine Attrappe verspricht.
   ============================================================================ */
import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { bearbeite, raeumeAuf, AUFBEWAHRUNG, SEITE } from "./api";
import type { D1, D1Anweisung, Umgebung, Ratenbremse } from "./api";
import worker from "./worker";
import { GRENZEN, gleicherSchluessel } from "./regeln";
import { FEHLER_GRENZEN, schwaerze, kuerzeStack } from "./fehlerregeln";
import { FRAGE_IDS } from "./fragen-ids";
import { FRAGEN } from "@/daten/laden";

const hier = path.dirname(fileURLToPath(import.meta.url));
/* ⛔ DIESELBEN Migrationen, die `wrangler d1 migrations apply` in D1 einspielt – in Reihenfolge. */
const MIGRATIONEN = path.join(hier, "migrationen");
const SCHEMA = fs.readdirSync(MIGRATIONEN).filter((d) => d.endsWith(".sql")).sort()
  .map((d) => fs.readFileSync(path.join(MIGRATIONEN, d), "utf8")).join("\n");
const SCHLUESSEL = "prüf-schlüssel-0123456789abcdef";
const GERAET = "geraet-aaaaaaaaaaaaaaaa";
const T0 = 1_789_600_000_000;
/* Seit 26.09.2026 nimmt die API nur noch JSON an (415 sonst) – so schickt es auch das Geraet. */
const JSON_KOPF = { "content-type": "application/json" };

function d1(db: DatabaseSync): D1 {
  return {
    prepare(sql: string): D1Anweisung {
      let werte: unknown[] = [];
      const a: D1Anweisung = {
        bind: (...w: unknown[]) => { werte = w; return a; },
        first: async <T,>() => (db.prepare(sql).get(...(werte as never[])) as T) ?? null,
        // oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- T ist die vom Aufrufer gesetzte Ergebnistyp-Annahme (all<X>())
        all: async <T,>() => ({ results: db.prepare(sql).all(...(werte as never[])) as T[] }),
        run: async () => db.prepare(sql).run(...(werte as never[])),
      };
      return a;
    },
  };
}

let db: DatabaseSync;
let env: Umgebung;
beforeEach(() => {
  db = new DatabaseSync(":memory:");
  db.exec(SCHEMA);
  env = { DB: d1(db), MELDE_SCHLUESSEL: SCHLUESSEL };
});

const ID = FRAGE_IDS[0];
function melde(koerper: unknown, jetzt = T0) {
  return bearbeite(new Request("https://x/api/meldung", {
    method: "POST", headers: JSON_KOPF, body: typeof koerper === "string" ? koerper : JSON.stringify(koerper),
  }), env, jetzt);
}
const gut = (extra: Record<string, unknown> = {}) =>
  ({ frageId: ID, grund: "Tippfehler", text: "  Komma fehlt ", geraet: GERAET, version: "1.29.0", ...extra });
function admin(pfad: string, init: RequestInit = {}, schluessel = SCHLUESSEL, jetzt = T0) {
  return bearbeite(new Request("https://x" + pfad, {
    ...init, headers: { authorization: "Bearer " + schluessel, ...(init.method === "POST" ? JSON_KOPF : {}) },
  }), env, jetzt);
}
const zeilen = () => db.prepare("SELECT * FROM meldungen ORDER BY nr").all() as Record<string, unknown>[];

describe("Die Kennungsliste des Workers", () => {
  it("stimmt mit dem Pool überein (sonst: node tools/melde_ids.js)", () => {
    expect([...FRAGE_IDS].sort()).toEqual(FRAGEN.map((f) => f.id).sort());
    expect(FRAGE_IDS.length).toBeGreaterThan(1000);
  });
});

describe("POST /api/meldung", () => {
  it("legt eine Meldung an – ohne IP, mit getrimmtem Text", async () => {
    const r = await bearbeite(new Request("https://x/api/meldung", {
      method: "POST", body: JSON.stringify(gut()),
      headers: { ...JSON_KOPF, "cf-connecting-ip": "203.0.113.9", "user-agent": "Spion/1.0" },
    }), env, T0);
    expect(r.status).toBe(201);
    expect(await r.json()).toEqual({ nr: 1 });
    const z = zeilen();
    expect(z).toHaveLength(1);
    expect(z[0]).toMatchObject({ nr: 1, frage_id: ID, grund: "Tippfehler", text: "Komma fehlt",
      erstellt: T0, geraet: GERAET, fassung: "neu", version: "1.29.0", status: "offen", erledigt: null });
    expect(JSON.stringify(z)).not.toContain("203.0.113.9");
    expect(JSON.stringify(z)).not.toContain("Spion");
  });

  it.each([
    ["unbekannte Frage", gut({ frageId: "M99-999" })],
    ["unbekannter Grund", gut({ grund: "Spam" })],
    ["Text zu lang", gut({ text: "x".repeat(GRENZEN.text + 1) })],
    ["Text ist kein Text", gut({ text: 5 })],
    ["Gerätekennung ungültig", gut({ geraet: "kurz" })],
    ["Gerätekennung ungültig", gut({ geraet: "a".repeat(16) + "<script>" })],
    ["Version zu lang", gut({ version: "v".repeat(21) })],
    ["kein Objekt", [1, 2]],
  ])("weist ab: %s", async (fehler, koerper) => {
    const r = await melde(koerper);
    expect(r.status).toBe(400);
    expect((await r.json()).fehler).toBe(fehler);
    expect(zeilen()).toHaveLength(0);
  });

  it("weist kaputtes JSON und übergroße Körper ab", async () => {
    expect((await melde("{kaputt")).status).toBe(400);
    expect((await melde(JSON.stringify(gut({ text: "ä".repeat(900) })) + " ".repeat(3000))).status).toBe(400);
    expect(zeilen()).toHaveLength(0);
  });

  it("lässt nur POST zu", async () => {
    const r = await bearbeite(new Request("https://x/api/meldung"), env, T0);
    expect(r.status).toBe(405);
  });

  it("Mengenbremse je Gerät: 10 pro Stunde, danach 429 – eine Stunde später wieder frei", async () => {
    for (let i = 0; i < GRENZEN.jeGeraetProStunde; i++) expect((await melde(gut(), T0 + i)).status).toBe(201);
    const zuviel = await melde(gut(), T0 + 100);
    expect(zuviel.status).toBe(429);
    expect((await melde(gut({ geraet: "anderes-geraet-bbbbbbbb" }), T0 + 100)).status, "anderes Gerät").toBe(201);
    expect((await melde(gut(), T0 + 3600_001 + 10)).status, "nach einer Stunde").toBe(201);
  });

  it("Tagesgrenze über alle Geräte", async () => {
    const ins = db.prepare("INSERT INTO meldungen (frage_id, grund, text, erstellt, geraet) VALUES (?, 'Sonstiges', '', ?, ?)");
    for (let i = 0; i < GRENZEN.gesamtProTag; i++) ins.run(ID, T0 - 1000, "g-" + i);
    expect((await melde(gut(), T0)).status).toBe(429);
    expect((await melde(gut(), T0 + 86_400_000)).status, "am nächsten Tag").toBe(201);
  });
});

describe("Audit 26.09.2026: Seiten, Pforte, Index", () => {
  const ins = () => db.prepare("INSERT INTO meldungen (frage_id, grund, text, erstellt, geraet, fassung, version) VALUES (?, 'Tippfehler', '', ?, ?, 'neu', '')");
  it("AUD-C5: blaettert mit ?vor=<nr> in Seiten zu SEITE, neueste zuerst", async () => {
    const a = ins();
    for (let i = 0; i < SEITE + 5; i++) a.run(ID, T0 + i, "g-" + (i % 50));
    const s1 = await (await admin("/api/meldungen?status=alle")).json();
    expect(s1.meldungen).toHaveLength(SEITE);
    expect(s1.weitere).toBe(true);
    expect(s1.meldungen[0].nr).toBe(SEITE + 5);
    const letzte = s1.meldungen[SEITE - 1].nr as number;
    const s2 = await (await admin("/api/meldungen?status=alle&vor=" + letzte)).json();
    expect(s2.meldungen.map((m: { nr: number }) => m.nr)).toEqual([5, 4, 3, 2, 1]);
    expect(s2.weitere).toBe(false);
    const s3 = await (await admin("/api/meldungen?status=offen&vor=3")).json();
    expect(s3.meldungen.map((m: { nr: number }) => m.nr)).toEqual([2, 1]);
  });
  it("AUD-C5: ungueltiges vor → 400", async () => {
    for (const v of ["0", "-1", "abc", "1.5", "99999999999999999999"]) {
      expect((await admin("/api/meldungen?vor=" + v)).status, v).toBe(400);
    }
  });
  it("AUD-C5: Status setzen nur mit JSON und von der eigenen Seite", async () => {
    ins().run(ID, T0, GERAET);
    const r = (h: Record<string, string>) => bearbeite(new Request("https://x/api/meldungen/1/status", {
      method: "POST", headers: { authorization: "Bearer " + SCHLUESSEL, ...h }, body: '{"status":"erledigt"}',
    }), env, T0);
    expect((await r({ "content-type": "text/plain" })).status).toBe(415);
    expect((await r({ ...JSON_KOPF, origin: "https://boese.example" })).status).toBe(403);
    expect(zeilen()[0]?.status).toBe("offen");
    expect((await r(JSON_KOPF)).status).toBe(200);
  });
  it("NP3: jede API-Antwort – auch Fehler und der Absturz – traegt CSP und Frame-Sperre", async () => {
    const antworten = [
      await melde({}), await admin("/api/meldungen"), await admin("/api/unbekannt"),
      await worker.fetch(new Request("https://x/api/meldung", { method: "POST", headers: JSON_KOPF, body: "{}" }),
        { DB: { prepare: () => { throw new Error("DB weg"); } }, ASSETS: { fetch: async () => new Response("") } } as never),
    ];
    for (const r of antworten) {
      expect(r.headers.get("content-security-policy"), String(r.status)).toBe("default-src 'none'; frame-ancestors 'none'");
      expect(r.headers.get("x-frame-options"), String(r.status)).toBe("DENY");
      expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    }
  });
  it("AUD-C1: die Tagesgrenze zaehlt ueber den Index, nicht ueber die ganze Tabelle", () => {
    const plan = db.prepare("EXPLAIN QUERY PLAN SELECT COUNT(*) AS n FROM meldungen WHERE erstellt > ?").all(0) as { detail: string }[];
    expect(plan.map((z) => z.detail).join(" | ")).toContain("idx_meldungen_erstellt");
  });
});

describe("Die geschützte Ansicht", () => {
  beforeEach(async () => {
    await melde(gut(), T0);
    await melde(gut({ grund: "Veraltet", text: "" }), T0 + 5);
  });

  it("ohne eingerichtetes Secret: gesperrt (503), nie offen", async () => {
    delete env.MELDE_SCHLUESSEL;
    expect((await admin("/api/meldungen")).status).toBe(503);
    env.MELDE_SCHLUESSEL = "kurz";
    expect((await admin("/api/meldungen", {}, "kurz")).status).toBe(503);
  });

  it("falscher oder fehlender Schlüssel: 401", async () => {
    expect((await admin("/api/meldungen", {}, SCHLUESSEL + "x")).status).toBe(401);
    expect((await bearbeite(new Request("https://x/api/meldungen"), env, T0)).status).toBe(401);
    expect((await admin("/api/meldungen/1/status", { method: "POST", body: '{"status":"erledigt"}' }, "falsch-falsch-falsch")).status).toBe(401);
    expect(zeilen().every((z) => z.status === "offen")).toBe(true);
  });

  it("listet offene Meldungen, neueste zuerst, OHNE Gerätekennung", async () => {
    const r = await admin("/api/meldungen");
    expect(r.status).toBe(200);
    const { meldungen } = await r.json();
    expect(meldungen.map((m: { nr: number }) => m.nr)).toEqual([2, 1]);
    expect(JSON.stringify(meldungen)).not.toContain(GERAET);
    expect(Object.keys(meldungen[0])).not.toContain("geraet");
  });

  it("setzt erledigt und wieder offen; Filter wirken", async () => {
    const r = await admin("/api/meldungen/1/status", { method: "POST", body: '{"status":"erledigt"}' }, SCHLUESSEL, T0 + 99);
    expect(await r.json()).toEqual({ nr: 1, status: "erledigt" });
    expect(zeilen()[0]).toMatchObject({ status: "erledigt", erledigt: T0 + 99 });
    const offen = (await (await admin("/api/meldungen?status=offen")).json()).meldungen;
    const erledigt = (await (await admin("/api/meldungen?status=erledigt")).json()).meldungen;
    const alle = (await (await admin("/api/meldungen?status=alle")).json()).meldungen;
    expect(offen.map((m: { nr: number }) => m.nr)).toEqual([2]);
    expect(erledigt.map((m: { nr: number }) => m.nr)).toEqual([1]);
    expect(alle).toHaveLength(2);
    await admin("/api/meldungen/1/status", { method: "POST", body: '{"status":"offen"}' });
    expect(zeilen()[0]).toMatchObject({ status: "offen", erledigt: null });
  });

  it("weist unbekannten Status, fremde Nummer und falsche Methode ab", async () => {
    expect((await admin("/api/meldungen?status=geloescht")).status).toBe(400);
    expect((await admin("/api/meldungen/1/status", { method: "POST", body: '{"status":"weg"}' })).status).toBe(400);
    expect((await admin("/api/meldungen/77/status", { method: "POST", body: '{"status":"erledigt"}' })).status).toBe(404);
    expect((await admin("/api/meldungen", { method: "POST" })).status).toBe(405);
    expect((await admin("/api/meldungen/1/status")).status).toBe(405);
    expect((await admin("/api/meldungen/1/loeschen", { method: "POST" })).status).toBe(404);
  });
});

describe("POST /api/fehler (N32, E29/E30)", () => {
  const bericht = (extra: Record<string, unknown> = {}) => ({
    bereich: "stat", meldung: "Cannot read properties of undefined (reading 'x')",
    stack: "TypeError: x\n    at Statistik (https://ap1.example/v2/assets/index-abc.js:1:200)",
    geraet: GERAET, version: "1.39.0", ...extra,
  });
  function sende(koerper: unknown, jetzt = T0, headers: Record<string, string> = {}) {
    return bearbeite(new Request("https://x/api/fehler", {
      method: "POST", headers: { ...JSON_KOPF, ...headers }, body: typeof koerper === "string" ? koerper : JSON.stringify(koerper),
    }), env, jetzt);
  }
  const fehlerZeilen = () => db.prepare("SELECT * FROM fehler ORDER BY nr").all() as Record<string, unknown>[];

  it("legt einen Bericht an – genau die Spalten aus E30, ohne IP und User-Agent", async () => {
    const r = await sende(bericht(), T0, { "cf-connecting-ip": "203.0.113.9", "user-agent": "Spion/1.0" });
    expect(r.status).toBe(201);
    expect(await r.json()).toEqual({ nr: 1 });
    const z = fehlerZeilen();
    expect(z).toHaveLength(1);
    expect(Object.keys(z[0]!).sort()).toEqual(["bereich", "erstellt", "geraet", "meldung", "nr", "stack", "version"]);
    expect(z[0]).toMatchObject({ bereich: "stat", erstellt: T0, geraet: GERAET, version: "1.39.0" });
    expect(JSON.stringify(z)).not.toContain("203.0.113.9");
    expect(JSON.stringify(z)).not.toContain("Spion");
  });

  it("schwärzt Frage-Kennung und Route auch dann, wenn der Absender es nicht tat", async () => {
    const r = await sende(bericht({
      meldung: "Frage M03-907 hat keine Optionen",
      stack: "Error\n    at x (https://ap1.example/v2/?a=1#frage=M03-907:1:2)\n    at y (#frage=M01-001)",
    }));
    expect(r.status).toBe(201);
    const z = JSON.stringify(fehlerZeilen());
    expect(z).not.toMatch(/M\d{2}-\d{3}/);
    expect(z).not.toContain("a=1");
    expect(z).toContain("M??-???");
  });

  it.each([
    ["unbekannter Bereich", bericht({ bereich: "admin" })],
    ["Meldung fehlt", bericht({ meldung: "  " })],
    ["Meldung zu lang", bericht({ meldung: "x".repeat(FEHLER_GRENZEN.meldung + 1) })],
    ["Stack ist kein Text", bericht({ stack: 5 })],
    ["Stack zu lang", bericht({ stack: "s".repeat(FEHLER_GRENZEN.stack + 1) })],
    ["Gerätekennung ungültig", bericht({ geraet: "kurz" })],
    ["Version zu lang", bericht({ version: "v".repeat(21) })],
    ["kein Objekt", "[1]"],
  ])("weist ab: %s", async (fehler, koerper) => {
    const r = await sende(koerper);
    expect(r.status).toBe(400);
    expect((await r.json()).fehler).toBe(fehler);
    expect(fehlerZeilen()).toHaveLength(0);
  });

  it("lässt nur POST zu und weist kaputtes JSON ab", async () => {
    expect((await bearbeite(new Request("https://x/api/fehler"), env, T0)).status).toBe(405);
    expect((await sende("{kaputt")).status).toBe(400);
  });

  it("Mengenbremse je Gerät (5/h) und Tagesgrenze (200) – getrennt von den Meldungen", async () => {
    for (let i = 0; i < FEHLER_GRENZEN.jeGeraetProStunde; i++) expect((await sende(bericht(), T0 + i)).status).toBe(201);
    expect((await sende(bericht(), T0 + 100)).status).toBe(429);
    expect((await melde(gut(), T0 + 100)).status, "Meldungen bleiben frei").toBe(201);
    expect((await sende(bericht(), T0 + 3600_001 + 10)).status, "nach einer Stunde").toBe(201);
    const ins = db.prepare("INSERT INTO fehler (bereich, meldung, erstellt, geraet) VALUES ('stat', 'm', ?, ?)");
    for (let i = 0; i < FEHLER_GRENZEN.gesamtProTag; i++) ins.run(T0 + 7200_000, "g-" + i);
    expect((await sende(bericht({ geraet: "anderes-geraet-bbbbbbbb" }), T0 + 7200_001)).status).toBe(429);
  });

  it("schwaerze/kuerzeStack: Grenzen und harmlose Texte", () => {
    expect(schwaerze("keine Kennung hier")).toBe("keine Kennung hier");
    expect(schwaerze("https://h/v2/#stat")).toBe("https://h/v2/");
    const lang = Array.from({ length: 40 }, (_, i) => "    at f" + i + " (x.js:" + i + ")").join("\n");
    const k = kuerzeStack(lang);
    expect(k.split("\n")).toHaveLength(FEHLER_GRENZEN.stackZeilen);
    expect(kuerzeStack("y".repeat(5000))).toHaveLength(FEHLER_GRENZEN.stack);
  });
});

describe("Der Worker-Einstieg", () => {
  it("gibt Nicht-API-Pfade an die Assets, API-Pfade an die API, Fehler als 500", async () => {
    const assets = { fetch: vi.fn(async () => new Response("asset")) };
    const w = { ...env, ASSETS: assets };
    expect(await (await worker.fetch(new Request("https://x/v2/"), w)).text()).toBe("asset");
    expect(assets.fetch).toHaveBeenCalledTimes(1);
    expect((await worker.fetch(new Request("https://x/api/gibtsnicht"), w)).status).toBe(404);
    expect(assets.fetch).toHaveBeenCalledTimes(1);
    const kaputt = { ...w, DB: { prepare: () => { throw new Error("DB weg"); } } };
    const r = await worker.fetch(new Request("https://x/api/meldung", { method: "POST", headers: JSON_KOPF, body: JSON.stringify(gut()) }), kaputt);
    expect(r.status).toBe(500);
    expect(await r.text()).not.toContain("DB weg");
  });
});

describe("Schlüsselvergleich", () => {
  it("nur exakt gleich ist gleich", async () => {
    expect(await gleicherSchluessel("abc", "abc")).toBe(true);
    for (const [a, b] of [["abc", "abd"], ["abc", "abcabc"], ["", ""], ["abc", ""], ["abcabc", "abc"]]) {
      expect(await gleicherSchluessel(a!, b!), `${a}|${b}`).toBe(false);
    }
  });
});

/* ============================================================================
   HÄRTUNG 26.09.2026 (Prüfbericht). Jede Regel an einem gebauten Fall mit
   bekannter Antwort – und die Gegenprobe, dass der gute Weg offen bleibt.
   ============================================================================ */
function roh(pfad: string, koerper: unknown, headers: Record<string, string>) {
  return bearbeite(new Request("https://x" + pfad, {
    method: "POST", headers, body: typeof koerper === "string" ? koerper : JSON.stringify(koerper),
  }), env, T0);
}
/** Eine Bremse wie das Cloudflare-Binding: je Schlüssel `grenze` Durchlässe. */
function bremse(grenze: number): Ratenbremse {
  const zaehler = new Map<string, number>();
  return {
    limit: async ({ key }) => {
      const n = (zaehler.get(key) ?? 0) + 1;
      zaehler.set(key, n);
      return { success: n <= grenze };
    },
  };
}

describe("Härtung: nur JSON von der eigenen Seite", () => {
  it.each(["/api/meldung", "/api/fehler"])("%s: text/plain und fehlender Typ → 415, nichts gespeichert", async (pfad) => {
    expect((await roh(pfad, gut(), { "content-type": "text/plain" })).status).toBe(415);
    expect((await roh(pfad, gut(), {})).status).toBe(415);
    expect(zeilen()).toHaveLength(0);
  });
  it.each([
    ["fremder Origin", { origin: "https://boese.example" }],
    ["Sec-Fetch-Site cross-site", { "sec-fetch-site": "cross-site" }],
    ["Sec-Fetch-Site same-site", { "sec-fetch-site": "same-site" }],
  ])("%s → 403", async (_n, kopf) => {
    const r = await roh("/api/meldung", gut(), { ...JSON_KOPF, ...kopf });
    expect(r.status).toBe(403);
    expect(zeilen()).toHaveLength(0);
  });
  it("die eigene Seite kommt durch (Gegenprobe)", async () => {
    const r = await roh("/api/meldung", gut(), { ...JSON_KOPF, origin: "https://x", "sec-fetch-site": "same-origin" });
    expect(r.status).toBe(201);
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
  });
  it("angekündigter Riesenkörper wird gar nicht erst gelesen", async () => {
    const r = await roh("/api/meldung", gut(), { ...JSON_KOPF, "content-length": String(GRENZEN.koerperBytes + 1) });
    expect(r.status).toBe(400);
  });
});

describe("Härtung: Ratenbremse am Rand", () => {
  it("bremst je IP, nicht je Gerätekennung – und speichert die IP nicht", async () => {
    env.RL_SCHREIBEN = bremse(2);
    const kopf = (ip: string) => ({ ...JSON_KOPF, "cf-connecting-ip": ip });
    for (let i = 0; i < 2; i++) expect((await roh("/api/meldung", gut({ geraet: "wechsel-geraet-" + i + "xxxxxxxx" }), kopf("198.51.100.7"))).status).toBe(201);
    expect((await roh("/api/meldung", gut({ geraet: "wechsel-geraet-9xxxxxxxx" }), kopf("198.51.100.7"))).status, "neue Kennung hilft nicht").toBe(429);
    expect((await roh("/api/meldung", gut(), kopf("198.51.100.8"))).status, "andere IP").toBe(201);
    expect(JSON.stringify(zeilen())).not.toContain("198.51.100");
  });
  it("fällt die Bremse aus, bleibt der Weg offen (D1-Grenzen halten weiter)", async () => {
    env.RL_SCHREIBEN = { limit: async () => { throw new Error("weg"); } };
    expect((await melde(gut())).status).toBe(201);
  });
  it("Admin: gebremst wird VOR dem Schlüssel – auch der richtige kommt dann nicht durch", async () => {
    env.RL_ADMIN = bremse(0);
    expect((await admin("/api/meldungen")).status).toBe(429);
    env.RL_ADMIN = bremse(1);
    expect((await admin("/api/meldungen")).status, "Gegenprobe").toBe(200);
  });
  it("parallele Anfragen überholen die Gerätegrenze nicht (Zählen und Einfügen in EINER Anweisung)", async () => {
    const n = GRENZEN.jeGeraetProStunde + 5;
    const antworten = await Promise.all(Array.from({ length: n }, (_, i) => melde(gut(), T0 + i)));
    expect(antworten.filter((r) => r.status === 201)).toHaveLength(GRENZEN.jeGeraetProStunde);
    expect(zeilen()).toHaveLength(GRENZEN.jeGeraetProStunde);
  });
});

describe("Härtung: Aufbewahrung (Nutzer-Entscheid 26.09.2026)", () => {
  it("löscht alte Fehlerberichte und lange erledigte Meldungen – offene nie", async () => {
    const TAG = 86_400_000;
    const f = db.prepare("INSERT INTO fehler (bereich, meldung, erstellt, geraet) VALUES ('stat', ?, ?, 'g')");
    f.run("alt", T0 - (AUFBEWAHRUNG.fehlerTage + 1) * TAG);
    f.run("frisch", T0 - (AUFBEWAHRUNG.fehlerTage - 1) * TAG);
    const m = db.prepare("INSERT INTO meldungen (frage_id, grund, erstellt, geraet, status, erledigt) VALUES (?, 'Sonstiges', ?, 'g', ?, ?)");
    const uralt = T0 - 2000 * TAG;
    m.run("offen-uralt", uralt, "offen", null);
    /* wieder geoeffnet, aber mit altem Datum (Altbestand/Fremdschreiber): der STATUS entscheidet */
    m.run("offen-altes-datum", uralt, "offen", uralt);
    m.run("erledigt-alt", uralt, "erledigt", T0 - (AUFBEWAHRUNG.erledigtTage + 1) * TAG);
    m.run("erledigt-frisch", uralt, "erledigt", T0 - (AUFBEWAHRUNG.erledigtTage - 1) * TAG);
    await raeumeAuf(env, T0);
    expect((db.prepare("SELECT meldung FROM fehler").all() as { meldung: string }[]).map((z) => z.meldung)).toEqual(["frisch"]);
    expect(zeilen().map((z) => z.frage_id).sort()).toEqual(["erledigt-frisch", "offen-altes-datum", "offen-uralt"]);
  });
  it("der Worker räumt im Cron-Lauf auf", async () => {
    db.prepare("INSERT INTO fehler (bereich, meldung, erstellt, geraet) VALUES ('stat', 'm', 0, 'g')").run();
    const warte: Promise<unknown>[] = [];
    await worker.scheduled({}, { ...env, ASSETS: { fetch: async () => new Response() } }, { waitUntil: (p) => { warte.push(p); } });
    await Promise.all(warte);
    expect(warte).toHaveLength(1);
    expect(db.prepare("SELECT COUNT(*) AS n FROM fehler").get()).toEqual({ n: 0 });
  });
});

describe("Härtung: Absturz wird protokolliert – ohne Inhalt", () => {
  it("console.error bekommt Pfad und Fehlerart, nie den Körper", async () => {
    const spion = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const kaputt = { ...env, DB: { prepare: () => { throw new Error("DB weg"); } }, ASSETS: { fetch: async () => new Response() } };
      const r = await worker.fetch(new Request("https://x/api/meldung", {
        method: "POST", headers: JSON_KOPF, body: JSON.stringify(gut({ text: "GEHEIMTEXT" })),
      }), kaputt);
      expect(r.status).toBe(500);
      expect(spion).toHaveBeenCalledTimes(1);
      const zeile = String(spion.mock.calls[0]?.[0]);
      expect(JSON.parse(zeile)).toMatchObject({ ereignis: "api_fehler", pfad: "/api/meldung", methode: "POST", fehler: "Error: DB weg" });
      expect(zeile).not.toContain("GEHEIMTEXT");
      expect(zeile).not.toContain(GERAET);
    } finally { spion.mockRestore(); }
  });
});

/* ⛔ WÄCHTER: `Umgebung` und wrangler.jsonc beschreiben DIESELBEN Bindungen. `wrangler types`
   gibt es hier nicht (wrangler ist keine Abhängigkeit) – der Record unten zwingt den
   Typprüfer, JEDE Bindung aus `Umgebung` zu nennen, und der Test sucht jede in der Konfiguration. */
describe("Wächter: wrangler.jsonc passt zum Code", () => {
  const ART: Record<Exclude<keyof Umgebung, "MELDE_SCHLUESSEL">, "d1" | "rl"> = {
    DB: "d1", RL_SCHREIBEN: "rl", RL_ADMIN: "rl",
  };
  const text = fs.readFileSync(path.join(hier, "../../../wrangler.jsonc"), "utf8");
  const cfg = JSON.parse(text.split("\n").filter((z) => !z.trim().startsWith("//")).join("\n")) as {
    main: string; assets: { binding: string; run_worker_first: string[] };
    d1_databases: { binding: string; migrations_dir: string }[];
    ratelimits: { name: string; namespace_id: string; simple: { limit: number; period: number } }[];
    triggers: { crons: string[] }; vars?: Record<string, unknown>;
  };
  it("jede Bindung aus Umgebung steht in der Konfiguration – und umgekehrt", () => {
    const d1 = cfg.d1_databases.map((d) => d.binding);
    const rl = cfg.ratelimits.map((r) => r.name);
    for (const [name, art] of Object.entries(ART)) expect(art === "d1" ? d1 : rl, name).toContain(name);
    expect([...d1, ...rl].sort()).toEqual(Object.keys(ART).sort());
    expect(cfg.assets.binding).toBe("ASSETS");
  });
  it("Einstieg, Migrationen, API-Weg, Cron und Bremsen sind gültig", () => {
    expect(cfg.main).toBe("neu/src/server/worker.ts");
    expect(cfg.assets.run_worker_first).toEqual(["/api/*"]);
    for (const d of cfg.d1_databases) expect(fs.existsSync(path.join(hier, "../../..", d.migrations_dir)), d.migrations_dir).toBe(true);
    expect(cfg.triggers.crons.length).toBeGreaterThan(0);
    const ids = cfg.ratelimits.map((r) => r.namespace_id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of cfg.ratelimits) {
      expect(Number.isInteger(Number(r.namespace_id)), r.name).toBe(true);
      expect([10, 60], r.name).toContain(r.simple.period);
      expect(r.simple.limit, r.name).toBeGreaterThan(0);
    }
  });
  it("⛔ Invocation-Logs aus (Audit AUD-A3): Cloudflare protokolliert sonst JEDE Anfrage samt Metadaten", () => {
    const o = (cfg as unknown as { observability: { enabled: boolean; logs?: { invocation_logs?: boolean } } }).observability;
    expect(o.enabled).toBe(true);
    expect(o.logs?.invocation_logs).toBe(false);
  });
  it("⛔ kein Secret in der Konfiguration (gehört nach `wrangler secret put`)", () => {
    expect(Object.keys(cfg.vars ?? {})).not.toContain("MELDE_SCHLUESSEL");
  });
});

/* ============================================================================
   N43 M3 (17.10.2026): Mutationstest api.ts 72,34 % → Randfälle. Jede Gruppe prüft ein
   VERHALTEN der API: genaue Antworttexte (die der Client anzeigt), Grenzwerte auf der
   Kante, die Vorprüfung vor dem INSERT, die Grenze IM INSERT bei veralteter Zählung,
   Ratenbremse-Schlüssel, Strom-Lesen in Stücken, Pfad-Anker der Status-Route.
   ============================================================================ */
const J = (r: Response) => r.json() as Promise<Record<string, unknown>>;
const STUNDE_MS = 3600_000;
const TAG_MS = 86_400_000;

/** D1 mit Protokoll der SQL-Anweisungen. `zaehler`: feste Antwort für alle `SELECT COUNT(*)` –
    `{n:0}` = veraltete Zählung (parallele Anfrage hat noch nicht eingefügt), `null` = keine Zeile. */
function beobachtetes(zaehler?: { n: number } | null) {
  const sql: string[] = [];
  const basis = d1(db);
  const hülle: D1 = {
    prepare(s: string): D1Anweisung {
      sql.push(s);
      const a = basis.prepare(s);
      if (zaehler === undefined || !s.startsWith("SELECT COUNT(*)")) return a;
      const b: D1Anweisung = { bind: () => b, first: (async () => zaehler) as D1Anweisung["first"], all: a.all, run: a.run };
      return b;
    },
  };
  return { sql, hülle };
}
const fuelleMeldungen = (anzahl: number, geraet: (i: number) => string, erstellt = T0 - 1000) => {
  const ins = db.prepare("INSERT INTO meldungen (frage_id, grund, text, erstellt, geraet) VALUES (?, 'Sonstiges', '', ?, ?)");
  for (let i = 0; i < anzahl; i++) ins.run(ID, erstellt, geraet(i));
};
const fuelleFehler = (anzahl: number, geraet: (i: number) => string, erstellt = T0 - 1000) => {
  const ins = db.prepare("INSERT INTO fehler (bereich, meldung, erstellt, geraet) VALUES ('stat', 'm', ?, ?)");
  for (let i = 0; i < anzahl; i++) ins.run(erstellt, geraet(i));
};
const fb = (extra: Record<string, unknown> = {}) => ({
  bereich: "stat", meldung: "Fehler", stack: "TypeError: x", geraet: GERAET, version: "1.39.0", ...extra,
});
function post(pfad: string, koerper: unknown, headers: Record<string, string> = JSON_KOPF, jetzt = T0) {
  return bearbeite(new Request("https://x" + pfad, {
    method: "POST", headers, body: typeof koerper === "string" ? koerper : JSON.stringify(koerper),
  }), env, jetzt);
}
const SCHREIBWEGE = [["/api/meldung", gut], ["/api/fehler", fb]] as const;

describe("Antworttexte der Schreibwege (der Client zeigt sie an)", () => {
  it.each(SCHREIBWEGE)("%s: 405 / 415 / 403 / 429 / 400 mit genauem Text", async (pfad, koerper) => {
    expect(await J(await bearbeite(new Request("https://x" + pfad), env, T0))).toEqual({ fehler: "nur POST" });
    expect(await J(await post(pfad, koerper(), { "content-type": "text/plain" }))).toEqual({ fehler: "nur application/json" });
    const fremd = await post(pfad, koerper(), { ...JSON_KOPF, origin: "https://boese.example" });
    expect(fremd.status).toBe(403);
    expect(await J(fremd)).toEqual({ fehler: "fremde Herkunft" });
    const kaputt = await post(pfad, "{kaputt");
    expect(kaputt.status).toBe(400);
    expect(await J(kaputt)).toEqual({ fehler: "ungültiger Inhalt" });
    env.RL_SCHREIBEN = bremse(0);
    const gebremst = await post(pfad, koerper());
    expect(gebremst.status).toBe(429);
    expect(await J(gebremst)).toEqual({ fehler: "zu viele Anfragen – bitte später" });
  });
  it.each(SCHREIBWEGE)("%s: Body ohne Inhalt (Anfrage ohne Körper und ohne Typ) → 415", async (pfad) => {
    const r = await bearbeite(new Request("https://x" + pfad, { method: "POST" }), env, T0);
    expect(r.status).toBe(415);
  });
  it.each(SCHREIBWEGE)("%s: richtiger Typ, aber gar kein Körper → 400 „ungültiger Inhalt“ (kein Absturz)", async (pfad) => {
    const r = await bearbeite(new Request("https://x" + pfad, { method: "POST", headers: JSON_KOPF }), env, T0);
    expect(r.status).toBe(400);
    expect(await J(r)).toEqual({ fehler: "ungültiger Inhalt" });
  });
  it.each(SCHREIBWEGE)("%s: JSON-Typ mit Zeichensatz und in Großschreibung gilt; Sec-Fetch-Site none/same-origin kommen durch", async (pfad, koerper) => {
    for (const kopf of [
      { "content-type": "application/json; charset=utf-8" },
      { "content-type": "Application/JSON" },
      { ...JSON_KOPF, "sec-fetch-site": "none" },
      { ...JSON_KOPF, "sec-fetch-site": "same-origin" },
      { ...JSON_KOPF, origin: "https://x" },
    ]) {
      expect((await post(pfad, koerper(), kopf, T0)).status, JSON.stringify(kopf)).toBe(201);
      db.exec("DELETE FROM meldungen; DELETE FROM fehler");
    }
  });
  it("Vorprüfung meldet die genaue Grenze – und versucht dann KEINEN INSERT", async () => {
    const meldung = beobachtetes();
    env = { ...env, DB: meldung.hülle };
    fuelleMeldungen(GRENZEN.jeGeraetProStunde, () => GERAET);
    const a = await melde(gut());
    expect(a.status).toBe(429);
    expect(await J(a)).toEqual({ fehler: "zu viele Meldungen – bitte später" });
    expect(meldung.sql.filter((s) => s.startsWith("INSERT"))).toHaveLength(0);

    db.exec("DELETE FROM meldungen");
    meldung.sql.length = 0;
    fuelleMeldungen(GRENZEN.gesamtProTag, (i) => "g-" + i);
    const b = await melde(gut());
    expect(b.status).toBe(429);
    expect(await J(b)).toEqual({ fehler: "Tagesgrenze erreicht – bitte morgen" });
    expect(meldung.sql.filter((s) => s.startsWith("INSERT"))).toHaveLength(0);
  });
  it("Vorprüfung der Fehlerberichte: genaue Texte, kein INSERT", async () => {
    const spion = beobachtetes();
    env = { ...env, DB: spion.hülle };
    fuelleFehler(FEHLER_GRENZEN.jeGeraetProStunde, () => GERAET);
    const a = await post("/api/fehler", fb());
    expect(a.status).toBe(429);
    expect(await J(a)).toEqual({ fehler: "zu viele Berichte – bitte später" });
    expect(spion.sql.filter((s) => s.startsWith("INSERT"))).toHaveLength(0);

    db.exec("DELETE FROM fehler");
    spion.sql.length = 0;
    fuelleFehler(FEHLER_GRENZEN.gesamtProTag, (i) => "g-" + i);
    const b = await post("/api/fehler", fb());
    expect(b.status).toBe(429);
    expect(await J(b)).toEqual({ fehler: "Tagesgrenze erreicht" });
    expect(spion.sql.filter((s) => s.startsWith("INSERT"))).toHaveLength(0);
  });
  it("eine Zeile unter der Grenze geht durch (Kante: Grenze − 1 → 201, Grenze → 429)", async () => {
    fuelleMeldungen(GRENZEN.jeGeraetProStunde - 1, () => GERAET);
    expect((await melde(gut())).status).toBe(201);
    expect((await melde(gut())).status).toBe(429);
    db.exec("DELETE FROM meldungen");
    fuelleMeldungen(GRENZEN.gesamtProTag - 1, (i) => "g-" + i);
    expect((await melde(gut())).status).toBe(201);
    expect((await melde(gut({ geraet: "anderes-geraet-bbbbbbbb" }))).status).toBe(429);
    fuelleFehler(FEHLER_GRENZEN.jeGeraetProStunde - 1, () => GERAET);
    expect((await post("/api/fehler", fb())).status).toBe(201);
    expect((await post("/api/fehler", fb())).status).toBe(429);
    db.exec("DELETE FROM fehler");
    fuelleFehler(FEHLER_GRENZEN.gesamtProTag - 1, (i) => "g-" + i);
    expect((await post("/api/fehler", fb())).status).toBe(201);
    expect((await post("/api/fehler", fb({ geraet: "anderes-geraet-bbbbbbbb" }))).status).toBe(429);
  });
});

describe("Die Grenze hält IM INSERT, auch wenn die Vorprüfung veraltet ist (parallele Anfrage)", () => {
  it("Meldungen: Gerätegrenze und Tagesgrenze", async () => {
    env = { ...env, DB: beobachtetes({ n: 0 }).hülle };
    fuelleMeldungen(GRENZEN.jeGeraetProStunde, () => GERAET);
    const a = await melde(gut());
    expect(a.status).toBe(429);
    expect(await J(a)).toEqual({ fehler: "zu viele Meldungen – bitte später" });
    expect(zeilen()).toHaveLength(GRENZEN.jeGeraetProStunde);

    db.exec("DELETE FROM meldungen");
    fuelleMeldungen(GRENZEN.gesamtProTag, (i) => "g-" + i);
    const b = await melde(gut());
    expect(b.status).toBe(429);
    expect(await J(b)).toEqual({ fehler: "zu viele Meldungen – bitte später" });
    expect(zeilen()).toHaveLength(GRENZEN.gesamtProTag);
  });
  it("Fehlerberichte: Gerätegrenze und Tagesgrenze", async () => {
    env = { ...env, DB: beobachtetes({ n: 0 }).hülle };
    fuelleFehler(FEHLER_GRENZEN.jeGeraetProStunde, () => GERAET);
    const a = await post("/api/fehler", fb());
    expect(a.status).toBe(429);
    expect(await J(a)).toEqual({ fehler: "zu viele Berichte – bitte später" });
    expect(db.prepare("SELECT COUNT(*) AS n FROM fehler").get()).toEqual({ n: FEHLER_GRENZEN.jeGeraetProStunde });

    db.exec("DELETE FROM fehler");
    fuelleFehler(FEHLER_GRENZEN.gesamtProTag, (i) => "g-" + i);
    const b = await post("/api/fehler", fb());
    expect(b.status).toBe(429);
    expect(await J(b)).toEqual({ fehler: "zu viele Berichte – bitte später" });
    expect(db.prepare("SELECT COUNT(*) AS n FROM fehler").get()).toEqual({ n: FEHLER_GRENZEN.gesamtProTag });
  });
  it("Zeilen außerhalb des Zeitfensters zählen im INSERT nicht mit", async () => {
    env = { ...env, DB: beobachtetes({ n: 0 }).hülle };
    fuelleMeldungen(GRENZEN.jeGeraetProStunde, () => GERAET, T0 - STUNDE_MS - 1);
    expect((await melde(gut())).status, "Gerät: älter als eine Stunde").toBe(201);
    fuelleMeldungen(GRENZEN.gesamtProTag, (i) => "alt-" + i, T0 - TAG_MS - 1);
    expect((await melde(gut(), T0 + 1)).status, "gesamt: älter als ein Tag").toBe(201);
    fuelleFehler(FEHLER_GRENZEN.jeGeraetProStunde, () => GERAET, T0 - STUNDE_MS - 1);
    expect((await post("/api/fehler", fb())).status).toBe(201);
    fuelleFehler(FEHLER_GRENZEN.gesamtProTag, (i) => "alt-" + i, T0 - TAG_MS - 1);
    expect((await post("/api/fehler", fb({ geraet: "anderes-geraet-bbbbbbbb" }), JSON_KOPF, T0 + 1)).status).toBe(201);
  });
  it("fehlt die Zählzeile (D1 liefert null), gilt sie als 0 – kein Absturz", async () => {
    env = { ...env, DB: beobachtetes(null).hülle };
    expect((await melde(gut())).status).toBe(201);
    expect((await post("/api/fehler", fb())).status).toBe(201);
  });
});

describe("Körper lesen: Grenze, Stücke, Abbruch", () => {
  const kodiere = (t: string) => new TextEncoder().encode(t);
  function strom(teile: Uint8Array[], gezogen = { n: 0, abgebrochen: false }) {
    let i = 0;
    const s = new ReadableStream<Uint8Array>({
      pull(c) { gezogen.n++; if (i < teile.length) c.enqueue(teile[i++]!); else c.close(); },
      cancel() { gezogen.abgebrochen = true; },
    });
    return { s, gezogen };
  }
  const anfrage = (s: ReadableStream<Uint8Array>, headers: Record<string, string> = JSON_KOPF) =>
    bearbeite(new Request("https://x/api/meldung", { method: "POST", headers, body: s, duplex: "half" } as RequestInit), env, T0);

  it("genau koerperBytes Byte werden gelesen, ein Byte mehr nicht", async () => {
    const basis = JSON.stringify(gut());
    const genau = basis + " ".repeat(GRENZEN.koerperBytes - kodiere(basis).length);
    expect(kodiere(genau).length).toBe(GRENZEN.koerperBytes);
    expect((await melde(genau)).status).toBe(201);
    expect((await melde(genau + " ")).status).toBe(400);
  });
  it("angekündigte Länge: genau die Grenze gilt, Unsinn → 400", async () => {
    expect((await roh("/api/meldung", gut(), { ...JSON_KOPF, "content-length": String(GRENZEN.koerperBytes) })).status).toBe(201);
    expect((await roh("/api/meldung", gut(), { ...JSON_KOPF, "content-length": "abc" })).status).toBe(400);
  });
  it("mehrere Stücke werden hintereinander zusammengesetzt – auch mitten in einem Zeichen geteilt", async () => {
    const bytes = kodiere(JSON.stringify(gut({ text: "Größe äöü" })));
    const schnitt = bytes.indexOf(0xc3) + 1;        // zwischen den zwei Bytes von „ö"
    expect(bytes[schnitt]! & 0xc0, "Schnitt liegt mitten im Zeichen").toBe(0x80);
    const r = await anfrage(strom([bytes.slice(0, schnitt), bytes.slice(schnitt, schnitt + 7), bytes.slice(schnitt + 7)]).s);
    expect(r.status).toBe(201);
    expect(zeilen()[0]?.text).toBe("Größe äöü");
  });
  it("überschreitet der Strom die Grenze, wird abgebrochen und der Rest nie gelesen", async () => {
    const stueck = new Uint8Array(1000).fill(32);
    const { s, gezogen } = strom(Array.from({ length: 100 }, () => stueck));
    const r = await anfrage(s);
    expect(r.status).toBe(400);
    expect(gezogen.abgebrochen).toBe(true);
    expect(gezogen.n).toBeLessThan(20);
    expect(zeilen()).toHaveLength(0);
  });
  it("ein Strom genau auf der Grenze wird ganz gelesen", async () => {
    const basis = kodiere(JSON.stringify(gut()));
    const rest = new Uint8Array(GRENZEN.koerperBytes - basis.length).fill(32);
    const { s, gezogen } = strom([basis, rest]);
    expect((await anfrage(s)).status).toBe(201);
    expect(gezogen.abgebrochen).toBe(false);
  });
});

describe("Ratenbremse: Schlüssel und Texte", () => {
  function schluesselSpion() {
    const keys: string[] = [];
    const rl: Ratenbremse = { limit: async ({ key }) => { keys.push(key); return { success: true }; } };
    return { keys, rl };
  }
  it("Schreibwege zählen je Pfad und IP; ohne IP unter „ohne-ip“", async () => {
    const { keys, rl } = schluesselSpion();
    env.RL_SCHREIBEN = rl;
    await roh("/api/meldung", gut(), { ...JSON_KOPF, "cf-connecting-ip": "198.51.100.7" });
    await roh("/api/fehler", fb(), JSON_KOPF);
    expect(keys).toEqual(["/api/meldung:198.51.100.7", "/api/fehler:ohne-ip"]);
  });
  it("Admin zählt unter „admin:<ip>“, und nur die Admin-Bremse (nicht die der Schreibwege)", async () => {
    const admin1 = schluesselSpion();
    const schreiben = schluesselSpion();
    env.RL_ADMIN = admin1.rl;
    env.RL_SCHREIBEN = schreiben.rl;
    await bearbeite(new Request("https://x/api/meldungen", {
      headers: { authorization: "Bearer " + SCHLUESSEL, "cf-connecting-ip": "198.51.100.9" },
    }), env, T0);
    await admin("/api/meldungen");
    expect(admin1.keys).toEqual(["admin:198.51.100.9", "admin:ohne-ip"]);
    expect(schreiben.keys).toEqual([]);
  });
  it("gebremster Admin: 429 mit Text, auch auf der Status-Route", async () => {
    env.RL_ADMIN = bremse(0);
    const r = await admin("/api/meldungen/1/status", { method: "POST", body: '{"status":"erledigt"}' });
    expect(r.status).toBe(429);
    expect(await J(r)).toEqual({ fehler: "zu viele Versuche – bitte später" });
  });
});

describe("Schlüsselprüfung der Ansicht", () => {
  const mit = (kopf: string | null, pfad = "/api/meldungen") =>
    bearbeite(new Request("https://x" + pfad, { headers: kopf === null ? {} : { authorization: kopf } }), env, T0);
  it("503 und 401 tragen ihren Text", async () => {
    delete env.MELDE_SCHLUESSEL;
    const a = await mit("Bearer " + SCHLUESSEL);
    expect(a.status).toBe(503);
    expect(await J(a)).toEqual({ fehler: "Ansicht nicht eingerichtet" });
    env.MELDE_SCHLUESSEL = SCHLUESSEL;
    const b = await mit("Bearer falsch");
    expect(b.status).toBe(401);
    expect(await J(b)).toEqual({ fehler: "Schlüssel falsch" });
  });
  it("ein Schlüssel von genau 16 Zeichen genügt, 15 sperren die Ansicht", async () => {
    env.MELDE_SCHLUESSEL = "0123456789abcdef";
    expect((await mit("Bearer 0123456789abcdef")).status).toBe(200);
    env.MELDE_SCHLUESSEL = "0123456789abcde";
    expect((await mit("Bearer 0123456789abcde")).status).toBe(503);
  });
  it("nur „Bearer <Schlüssel>“ gilt: roher Schlüssel, andere Schreibung, beliebiges 7-Zeichen-Präfix → 401", async () => {
    expect((await mit(SCHLUESSEL)).status, "roh").toBe(401);
    expect((await mit("bearer " + SCHLUESSEL)).status, "klein").toBe(401);
    expect((await mit("Basic " + SCHLUESSEL)).status, "Basic").toBe(401);
    expect((await mit("Bearer" + SCHLUESSEL)).status, "ohne Leerzeichen").toBe(401);
    expect((await mit("XXXXXXX" + SCHLUESSEL)).status, "7 beliebige Zeichen").toBe(401);
    expect((await mit(null)).status, "kein Kopf").toBe(401);
    expect((await mit("Bearer " + SCHLUESSEL)).status, "Gegenprobe").toBe(200);
  });
  it("Pfade: nur /api/meldungen und /api/meldungen/… verlangen den Schlüssel", async () => {
    expect((await mit(null, "/api/meldungenx")).status).toBe(404);
    expect((await mit(null, "/api/meldungen/")).status).toBe(401);
    expect((await mit(null, "/api/meldungen/1/status")).status).toBe(401);
  });
});

describe("Die geschützte Liste: Kanten und Texte", () => {
  const ins = () => db.prepare("INSERT INTO meldungen (frage_id, grund, text, erstellt, geraet, fassung, version, status) VALUES (?, 'Tippfehler', '', ?, ?, 'neu', '', ?)");
  it("Fehlertexte der Liste", async () => {
    const a = await admin("/api/meldungen?status=geloescht");
    expect(a.status).toBe(400);
    expect(await J(a)).toEqual({ fehler: "unbekannter Status" });
    const b = await admin("/api/meldungen?vor=0");
    expect(b.status).toBe(400);
    expect(await J(b)).toEqual({ fehler: "ungültiges vor" });
    const c = await admin("/api/meldungen", { method: "POST" });
    expect(c.status).toBe(405);
    expect(await J(c)).toEqual({ fehler: "nur GET" });
  });
  it("vor=1 ist gültig (kleinster Zeiger) und liefert nichts Älteres", async () => {
    ins().run(ID, T0, GERAET, "offen");
    const r = await admin("/api/meldungen?vor=1");
    expect(r.status).toBe(200);
    expect(await J(r)).toEqual({ meldungen: [], weitere: false });
  });
  it("genau SEITE Meldungen: alle da, weitere = false; SEITE + 1: weitere = true", async () => {
    const a = ins();
    for (let i = 0; i < SEITE; i++) a.run(ID, T0 + i, GERAET, "offen");
    const s = await J(await admin("/api/meldungen"));
    expect(s.meldungen).toHaveLength(SEITE);
    expect(s.weitere).toBe(false);
    a.run(ID, T0, GERAET, "offen");
    const t = await J(await admin("/api/meldungen"));
    expect(t.meldungen).toHaveLength(SEITE);
    expect(t.weitere).toBe(true);
  });
  it("Status und Zeiger zusammen, Vorgabe ist „offen“", async () => {
    const a = ins();
    a.run(ID, T0, GERAET, "offen");
    a.run(ID, T0, GERAET, "erledigt");
    a.run(ID, T0, GERAET, "offen");
    a.run(ID, T0, GERAET, "erledigt");
    const nrn = async (q: string) => ((await J(await admin("/api/meldungen" + q))).meldungen as { nr: number }[]).map((m) => m.nr);
    expect(await nrn("")).toEqual([3, 1]);
    expect(await nrn("?status=erledigt&vor=4")).toEqual([2]);
    expect(await nrn("?status=alle&vor=3")).toEqual([2, 1]);
    expect(await nrn("?status=offen&vor=3")).toEqual([1]);
  });
});

describe("Status setzen: Pfad-Anker, Texte, nur die eine Zeile", () => {
  const setze = (pfad: string, koerper: unknown = { status: "erledigt" }, jetzt = T0 + 77) =>
    admin(pfad, { method: "POST", body: typeof koerper === "string" ? koerper : JSON.stringify(koerper) }, SCHLUESSEL, jetzt);
  beforeEach(() => {
    const a = db.prepare("INSERT INTO meldungen (frage_id, grund, text, erstellt, geraet) VALUES (?, 'Tippfehler', '', ?, ?)");
    for (let i = 0; i < 12; i++) a.run(ID, T0, GERAET);
  });
  it("mehrstellige Nummer; nur die eine Zeile ändert sich; erledigt = jetzt, offen = null", async () => {
    const r = await setze("/api/meldungen/12/status");
    expect(r.status).toBe(200);
    expect(await J(r)).toEqual({ nr: 12, status: "erledigt" });
    expect(zeilen().filter((z) => z.status === "erledigt").map((z) => z.nr)).toEqual([12]);
    expect(zeilen()[11]?.erledigt).toBe(T0 + 77);
    expect(zeilen()[0]?.erledigt).toBeNull();
    await setze("/api/meldungen/12/status", { status: "offen" });
    expect(zeilen()[11]).toMatchObject({ status: "offen", erledigt: null });
  });
  it.each([
    ["/api/meldungen/1/status/extra"],
    ["/api/meldungen/1/statusx"],
    ["/api/meldungen/zz/api/meldungen/1/status"],
    ["/api/meldungen/1x/status"],
    ["/api/meldungen/"],
    ["/api/meldungen/1"],
  ])("%s → 404 „unbekannter Pfad“, nichts geändert", async (pfad) => {
    const r = await setze(pfad);
    expect(r.status).toBe(404);
    expect(await J(r)).toEqual({ fehler: "unbekannter Pfad" });
    expect(zeilen().every((z) => z.status === "offen")).toBe(true);
  });
  it("Texte der Status-Route", async () => {
    const a = await admin("/api/meldungen/1/status");
    expect(a.status).toBe(405);
    expect(await J(a)).toEqual({ fehler: "nur POST" });
    const b = await setze("/api/meldungen/99/status");
    expect(b.status).toBe(404);
    expect(await J(b)).toEqual({ fehler: "keine solche Meldung" });
    const kopf = (h: Record<string, string>) => bearbeite(new Request("https://x/api/meldungen/1/status", {
      method: "POST", headers: { authorization: "Bearer " + SCHLUESSEL, ...h }, body: '{"status":"erledigt"}',
    }), env, T0);
    expect(await J(await kopf({ "content-type": "text/plain" }))).toEqual({ fehler: "nur application/json" });
    const c = await kopf({ ...JSON_KOPF, origin: "https://boese.example" });
    expect(c.status).toBe(403);
    expect(await J(c)).toEqual({ fehler: "fremde Herkunft" });
  });
  it.each([["kein JSON", "{kaputt"], ["Array", "[1]"], ["null", "null"], ["Zahl", "5"], ["Status fehlt", "{}"], ["Status unbekannt", '{"status":"weg"}'], ["Status Zahl", '{"status":1}']])("%s → 400 „unbekannter Status“", async (_n, koerper) => {
    const r = await setze("/api/meldungen/1/status", koerper);
    expect(r.status).toBe(400);
    expect(await J(r)).toEqual({ fehler: "unbekannter Status" });
    expect(zeilen().every((z) => z.status === "offen")).toBe(true);
  });
  it("die Status-Route braucht die Schreib-Bremse nicht", async () => {
    env.RL_SCHREIBEN = bremse(0);
    expect((await setze("/api/meldungen/1/status")).status).toBe(200);
  });
  it("unbekannter Pfad außerhalb der API-Zweige: 404 mit Text", async () => {
    const r = await bearbeite(new Request("https://x/api/nichts"), env, T0);
    expect(r.status).toBe(404);
    expect(await J(r)).toEqual({ fehler: "unbekannter Pfad" });
  });
});

describe("Aufräumen: Kanten und Vorgabezeit", () => {
  it("genau auf der Aufbewahrungsgrenze bleibt stehen, eine Millisekunde älter geht", async () => {
    const f = db.prepare("INSERT INTO fehler (bereich, meldung, erstellt, geraet) VALUES ('stat', ?, ?, 'g')");
    const grenzeF = T0 - AUFBEWAHRUNG.fehlerTage * TAG_MS;
    f.run("auf-grenze", grenzeF);
    f.run("drueber", grenzeF - 1);
    const m = db.prepare("INSERT INTO meldungen (frage_id, grund, erstellt, geraet, status, erledigt) VALUES (?, 'Sonstiges', 1, 'g', 'erledigt', ?)");
    const grenzeM = T0 - AUFBEWAHRUNG.erledigtTage * TAG_MS;
    m.run("auf-grenze", grenzeM);
    m.run("drueber", grenzeM - 1);
    m.run("erledigt-ohne-datum", null);
    await raeumeAuf(env, T0);
    expect((db.prepare("SELECT meldung FROM fehler").all() as { meldung: string }[]).map((z) => z.meldung)).toEqual(["auf-grenze"]);
    expect(zeilen().map((z) => z.frage_id).sort()).toEqual(["auf-grenze", "erledigt-ohne-datum"]);
  });
  it("ohne Zeitangabe gilt die jetzige Zeit", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(T0);
      const f = db.prepare("INSERT INTO fehler (bereich, meldung, erstellt, geraet) VALUES ('stat', ?, ?, 'g')");
      f.run("alt", T0 - (AUFBEWAHRUNG.fehlerTage + 1) * TAG_MS);
      f.run("frisch", T0 - (AUFBEWAHRUNG.fehlerTage - 1) * TAG_MS);
      await raeumeAuf(env);
      expect((db.prepare("SELECT meldung FROM fehler").all() as { meldung: string }[]).map((z) => z.meldung)).toEqual(["frisch"]);
    } finally { vi.useRealTimers(); }
  });
});
