/* ============================================================================
   ONLINE-MELDUNGEN: DIE API (N20b, Entscheid E8)

   POST /api/meldung                       – jeder; legt eine Meldung an (201)
   GET  /api/meldungen?status=offen|erledigt|alle – nur mit Schlüssel
   POST /api/meldungen/<nr>/status {status} – nur mit Schlüssel
   POST /api/fehler                        – jeder; Fehlerbericht der Error Boundary (201,
                                             N32/E29/E30 – Regeln in fehlerregeln.ts)

   ⛔ Ohne gesetztes Secret `MELDE_SCHLUESSEL` ist die Ansicht GESPERRT (503),
      nie offen. ⛔ Keine CORS-Freigabe: nur die eigene Seite spricht mit der API.
   ⛔ HÄRTUNG 26.09.2026 (Prüfbericht, OWASP A01/A06):
      • Schreibende Zugänge nehmen NUR `application/json` von der EIGENEN Seite an
        (415/403) – ein Formular oder `fetch` einer fremden Seite kann `text/plain`
        ohne Vorabanfrage schicken; vorher kam so etwas bis zur Prüfung durch.
      • Ratenbremse am Rand (Cloudflare Rate Limiting, `RL_SCHREIBEN`/`RL_ADMIN`)
        je IP. ⛔ Die IP ist dabei NUR flüchtiger Zählschlüssel und wird NIRGENDS
        gespeichert (E8 gilt weiter). Die Gerätekennung wählt der Absender selbst –
        sie allein bremst niemanden, der sie wechselt.
      • Zählen und Einfügen in EINER Anweisung: parallele Anfragen überholen die
        Grenzen nicht mehr.
      • Der Körper wird gestreamt gelesen und bei der Grenze abgebrochen.
   ⚠️ `D1` ist hier als kleinste Schnittstelle beschrieben, damit die Tests
      dieselben Aufrufe gegen node:sqlite fahren können.
   ============================================================================ */
import { GRENZEN, pruefeEingang, gleicherSchluessel } from "./regeln";
import { FEHLER_GRENZEN, pruefeFehler } from "./fehlerregeln";
import { istObjekt } from "../kern/pruefe.ts";

interface D1Ergebnis<T> { results: T[] }
export interface D1Anweisung {
  bind(...werte: unknown[]): D1Anweisung;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Ergebnis<T>>;
  run(): Promise<unknown>;
}
export interface D1 { prepare(sql: string): D1Anweisung }

/** Das Rate-Limiting-Binding (`ratelimits` in wrangler.jsonc) als kleinste Schnittstelle. */
export interface Ratenbremse { limit(o: { key: string }): Promise<{ success: boolean }> }

/** ⛔ Jede Bindung hier steht auch in wrangler.jsonc – der Wächter in api.test.ts vergleicht beide. */
export interface Umgebung {
  DB: D1;
  MELDE_SCHLUESSEL?: string;
  RL_SCHREIBEN?: Ratenbremse;
  RL_ADMIN?: Ratenbremse;
}

const STUNDE = 3600_000;
const TAG = 24 * STUNDE;

/** Aufbewahrung (Nutzer-Entscheid 26.09.2026): Fehlerberichte 90 Tage, erledigte Meldungen
    365 Tage ab Erledigung. ⛔ OFFENE Meldungen werden nie gelöscht. Läuft täglich (Cron). */
export const AUFBEWAHRUNG = { fehlerTage: 90, erledigtTage: 365 } as const;

/** Seitengroesse der geschuetzten Liste (Audit 26.09.2026, AUD-C5). Weitergeblaettert wird mit
    `?vor=<nr>` – Nummern steigen streng, darum ist `nr` der Zeiger, nicht die Zeit. */
export const SEITE = 200;

/** Koepfe JEDER API-Antwort. NP3 (Nachpruefung 26.09.2026): `_headers` gilt nur fuer Assets, nicht fuer
    Antworten des Workers – deshalb hier eine eigene, strengste CSP und die Frame-Sperre. */
export const API_KOEPFE: Record<string, string> = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "x-frame-options": "DENY",
};

function json(daten: unknown, status = 200): Response {
  return new Response(JSON.stringify(daten), { status, headers: API_KOEPFE });
}

/** Liest höchstens `grenze` Byte; darüber `undefined`, ohne den Rest zu lesen. */
async function leseText(req: Request, grenze: number): Promise<string | undefined> {
  const angekuendigt = Number(req.headers.get("content-length") ?? "0");
  if (!Number.isFinite(angekuendigt) || angekuendigt > grenze) return undefined;
  if (!req.body) return "";
  const leser = req.body.getReader();
  const teile: Uint8Array[] = [];
  let n = 0;
  for (;;) {
    // oxlint-disable-next-line eslint/no-await-in-loop -- ein Strom liefert Stueck fuer Stueck; die Grenze wird waehrend des Lesens geprueft
    const { done, value } = await leser.read();
    if (done) break;
    n += value.byteLength;
    // oxlint-disable-next-line eslint/no-await-in-loop -- Abbruch nach Grenzueberschreitung, danach Ende der Schleife
    if (n > grenze) { await leser.cancel(); return undefined; }
    teile.push(value);
  }
  const alles = new Uint8Array(n);
  let o = 0;
  for (const t of teile) { alles.set(t, o); o += t.byteLength; }
  return new TextDecoder().decode(alles);
}

async function leseJson(req: Request): Promise<unknown | undefined> {
  const text = await leseText(req, GRENZEN.koerperBytes);
  if (text === undefined) return undefined;
  try { return JSON.parse(text); } catch { return undefined; }
}

/** Nur JSON und nur von der eigenen Seite. Absender ohne `Origin`/`Sec-Fetch-Site`
    (Werkzeuge) sind keine CSRF-Gefahr und bleiben zugelassen. */
function eigenerJsonPost(req: Request): "ok" | "typ" | "herkunft" {
  const typ = (req.headers.get("content-type") ?? "").toLowerCase();
  if (!typ.startsWith("application/json")) return "typ";
  const site = req.headers.get("sec-fetch-site");
  if (site !== null && site !== "same-origin" && site !== "none") return "herkunft";
  const origin = req.headers.get("origin");
  if (origin !== null && origin !== new URL(req.url).origin) return "herkunft";
  return "ok";
}

/** true = gebremst. ⛔ Fällt die Bremse selbst aus, bleibt der Weg offen – die Grenzen in
    D1 halten dann weiter (lieber eine Meldung zu viel als ein Lerner ausgesperrt). */
async function gebremst(rl: Ratenbremse | undefined, req: Request, zweck: string): Promise<boolean> {
  if (!rl) return false;
  const ip = req.headers.get("cf-connecting-ip") ?? "ohne-ip";
  try { return !(await rl.limit({ key: zweck + ":" + ip })).success; } catch { return false; }
}

async function berechtigt(req: Request, env: Umgebung): Promise<"ja" | "nein" | "gesperrt"> {
  const soll = env.MELDE_SCHLUESSEL ?? "";
  if (soll.length < 16) return "gesperrt";
  const kopf = req.headers.get("authorization") ?? "";
  const ist = kopf.startsWith("Bearer ") ? kopf.slice(7) : "";
  return (await gleicherSchluessel(ist, soll)) ? "ja" : "nein";
}

/** Gemeinsamer Eingang der beiden schreibenden Zugänge. `null` = weiter. */
async function schreibTor(req: Request, env: Umgebung, pfad: string): Promise<Response | null> {
  if (req.method !== "POST") return json({ fehler: "nur POST" }, 405);
  const e = eigenerJsonPost(req);
  if (e === "typ") return json({ fehler: "nur application/json" }, 415);
  if (e === "herkunft") return json({ fehler: "fremde Herkunft" }, 403);
  if (await gebremst(env.RL_SCHREIBEN, req, pfad)) return json({ fehler: "zu viele Anfragen – bitte später" }, 429);
  return null;
}

/** Tägliches Aufräumen (Cron-Auslöser, `worker.ts` → `scheduled`). */
export async function raeumeAuf(env: Pick<Umgebung, "DB">, jetzt = Date.now()): Promise<void> {
  await env.DB.prepare("DELETE FROM fehler WHERE erstellt < ?")
    .bind(jetzt - AUFBEWAHRUNG.fehlerTage * TAG).run();
  await env.DB.prepare("DELETE FROM meldungen WHERE status = 'erledigt' AND erledigt IS NOT NULL AND erledigt < ?")
    .bind(jetzt - AUFBEWAHRUNG.erledigtTage * TAG).run();
}

export async function bearbeite(req: Request, env: Umgebung, jetzt = Date.now()): Promise<Response> {
  const url = new URL(req.url);
  const pfad = url.pathname;

  if (pfad === "/api/meldung") {
    const tor = await schreibTor(req, env, pfad);
    if (tor) return tor;
    const roh = await leseJson(req);
    if (roh === undefined) return json({ fehler: "ungültiger Inhalt" }, 400);
    const p = pruefeEingang(roh);
    if (!p.ok) return json({ fehler: p.fehler }, 400);
    const m = p.wert;
    /* Die Vorprüfungen liefern die genaue Antwort; die EIGENTLICHE Grenze hält die
       Bedingung im INSERT – dort überholt keine parallele Anfrage die Zählung. */
    const geraet = await env.DB
      .prepare("SELECT COUNT(*) AS n FROM meldungen WHERE geraet = ? AND erstellt > ?")
      .bind(m.geraet, jetzt - STUNDE).first<{ n: number }>();
    if ((geraet?.n ?? 0) >= GRENZEN.jeGeraetProStunde) return json({ fehler: "zu viele Meldungen – bitte später" }, 429);
    const gesamt = await env.DB
      .prepare("SELECT COUNT(*) AS n FROM meldungen WHERE erstellt > ?")
      .bind(jetzt - TAG).first<{ n: number }>();
    if ((gesamt?.n ?? 0) >= GRENZEN.gesamtProTag) return json({ fehler: "Tagesgrenze erreicht – bitte morgen" }, 429);
    const neu = await env.DB
      .prepare("INSERT INTO meldungen (frage_id, grund, text, erstellt, geraet, fassung, version) " +
        "SELECT ?, ?, ?, ?, ?, ?, ? " +
        "WHERE (SELECT COUNT(*) FROM meldungen WHERE geraet = ? AND erstellt > ?) < ? " +
        "AND (SELECT COUNT(*) FROM meldungen WHERE erstellt > ?) < ? RETURNING nr")
      .bind(m.frageId, m.grund, m.text, jetzt, m.geraet, m.fassung, m.version,
        m.geraet, jetzt - STUNDE, GRENZEN.jeGeraetProStunde, jetzt - TAG, GRENZEN.gesamtProTag)
      .first<{ nr: number }>();
    if (!neu) return json({ fehler: "zu viele Meldungen – bitte später" }, 429);
    return json({ nr: neu.nr }, 201);
  }

  if (pfad === "/api/fehler") {
    const tor = await schreibTor(req, env, pfad);
    if (tor) return tor;
    const roh = await leseJson(req);
    if (roh === undefined) return json({ fehler: "ungültiger Inhalt" }, 400);
    const p = pruefeFehler(roh);
    if (!p.ok) return json({ fehler: p.fehler }, 400);
    const f = p.wert;
    const geraet = await env.DB
      .prepare("SELECT COUNT(*) AS n FROM fehler WHERE geraet = ? AND erstellt > ?")
      .bind(f.geraet, jetzt - STUNDE).first<{ n: number }>();
    if ((geraet?.n ?? 0) >= FEHLER_GRENZEN.jeGeraetProStunde) return json({ fehler: "zu viele Berichte – bitte später" }, 429);
    const gesamt = await env.DB
      .prepare("SELECT COUNT(*) AS n FROM fehler WHERE erstellt > ?")
      .bind(jetzt - TAG).first<{ n: number }>();
    if ((gesamt?.n ?? 0) >= FEHLER_GRENZEN.gesamtProTag) return json({ fehler: "Tagesgrenze erreicht" }, 429);
    const neu = await env.DB
      .prepare("INSERT INTO fehler (bereich, meldung, stack, version, erstellt, geraet) " +
        "SELECT ?, ?, ?, ?, ?, ? " +
        "WHERE (SELECT COUNT(*) FROM fehler WHERE geraet = ? AND erstellt > ?) < ? " +
        "AND (SELECT COUNT(*) FROM fehler WHERE erstellt > ?) < ? RETURNING nr")
      .bind(f.bereich, f.meldung, f.stack, f.version, jetzt, f.geraet,
        f.geraet, jetzt - STUNDE, FEHLER_GRENZEN.jeGeraetProStunde, jetzt - TAG, FEHLER_GRENZEN.gesamtProTag)
      .first<{ nr: number }>();
    if (!neu) return json({ fehler: "zu viele Berichte – bitte später" }, 429);
    return json({ nr: neu.nr }, 201);
  }

  if (pfad === "/api/meldungen" || pfad.startsWith("/api/meldungen/")) {
    /* ⛔ Die Bremse VOR dem Schlüssel: sonst ließe sich der Schlüssel beliebig oft raten. */
    if (await gebremst(env.RL_ADMIN, req, "admin")) return json({ fehler: "zu viele Versuche – bitte später" }, 429);
    const b = await berechtigt(req, env);
    if (b === "gesperrt") return json({ fehler: "Ansicht nicht eingerichtet" }, 503);
    if (b === "nein") return json({ fehler: "Schlüssel falsch" }, 401);

    if (pfad === "/api/meldungen") {
      if (req.method !== "GET") return json({ fehler: "nur GET" }, 405);
      const status = url.searchParams.get("status") ?? "offen";
      if (!["offen", "erledigt", "alle"].includes(status)) return json({ fehler: "unbekannter Status" }, 400);
      const vorRoh = url.searchParams.get("vor");
      const vor = vorRoh === null ? null : Number(vorRoh);
      if (vor !== null && (!Number.isSafeInteger(vor) || vor < 1)) return json({ fehler: "ungültiges vor" }, 400);
      /* Zusammengesetzt werden nur FESTE Textstücke – die Werte selbst gehen über bind(). */
      const bedingungen: string[] = [];
      const werte: unknown[] = [];
      if (status !== "alle") { bedingungen.push("status = ?"); werte.push(status); }
      if (vor !== null) { bedingungen.push("nr < ?"); werte.push(vor); }
      const sql = "SELECT nr, frage_id, grund, text, erstellt, fassung, version, status, erledigt FROM meldungen" +
        (bedingungen.length ? " WHERE " + bedingungen.join(" AND ") : "") + " ORDER BY nr DESC LIMIT ?";
      const erg = await env.DB.prepare(sql).bind(...werte, SEITE + 1).all();
      /* ⛔ `geraet` geht nicht hinaus – auch nicht an den Betreiber. */
      return json({ meldungen: erg.results.slice(0, SEITE), weitere: erg.results.length > SEITE });
    }

    const treffer = /^\/api\/meldungen\/(\d+)\/status$/.exec(pfad);
    if (!treffer) return json({ fehler: "unbekannter Pfad" }, 404);
    if (req.method !== "POST") return json({ fehler: "nur POST" }, 405);
    /* Audit 26.09.2026 (AUD-C5): dieselbe Pforte wie die offenen Schreibwege – der Bearer-Kopf
       erzwingt zwar schon eine Vorabanfrage, aber eine Regel fuer alle Schreibwege ist leichter zu halten. */
    const e = eigenerJsonPost(req);
    if (e === "typ") return json({ fehler: "nur application/json" }, 415);
    if (e === "herkunft") return json({ fehler: "fremde Herkunft" }, 403);
    const roh = await leseJson(req);
    const status = istObjekt(roh) ? roh.status : undefined;   // N38 Q1: vorher behauptet
    if (status !== "offen" && status !== "erledigt") return json({ fehler: "unbekannter Status" }, 400);
    await env.DB.prepare("UPDATE meldungen SET status = ?, erledigt = ? WHERE nr = ?")
      .bind(status, status === "erledigt" ? jetzt : null, Number(treffer[1])).run();
    const zeile = await env.DB.prepare("SELECT nr, status FROM meldungen WHERE nr = ?").bind(Number(treffer[1])).first();
    if (!zeile) return json({ fehler: "keine solche Meldung" }, 404);
    return json(zeile);
  }

  return json({ fehler: "unbekannter Pfad" }, 404);
}
