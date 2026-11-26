/* Einstieg des Cloudflare-Workers (N20b). `wrangler.jsonc` leitet NUR `/api/*`
   hierher (`run_worker_first`); alles andere liefert Cloudflare direkt aus den
   Assets – so wie vor N20b. Fällt eine Anfrage trotzdem hier herein, geht sie
   an die Assets weiter.
   ⛔ HÄRTUNG 26.09.2026: ein Absturz wird PROTOKOLLIERT (Workers Logs, strukturiert)
      und nach außen nur als „interner Fehler" gemeldet. Ins Protokoll kommen Pfad,
      Methode und Fehlerart – NIE der Körper, keine Gerätekennung, keine IP.
   ►► `scheduled` (Cron in wrangler.jsonc): tägliches Aufräumen nach AUFBEWAHRUNG. */
import { bearbeite, raeumeAuf, API_KOEPFE } from "./api";
import type { Umgebung } from "./api";

interface WorkerUmgebung extends Umgebung {
  ASSETS: { fetch(req: Request): Promise<Response> };
}
/** Kleinste Form des ExecutionContext – mehr braucht der Worker nicht. */
interface Kontext { waitUntil(p: Promise<unknown>): void }

function protokolliere(ereignis: string, daten: Record<string, string>, e: unknown): void {
  console.error(JSON.stringify({
    ereignis, ...daten,
    fehler: e instanceof Error ? e.name + ": " + e.message : String(e),
  }));
}

export default {
  async fetch(req: Request, env: WorkerUmgebung): Promise<Response> {
    const pfad = new URL(req.url).pathname;
    if (!pfad.startsWith("/api/")) return env.ASSETS.fetch(req);
    try {
      return await bearbeite(req, env);
    } catch (e) {
      protokolliere("api_fehler", { pfad, methode: req.method }, e);
      return new Response(JSON.stringify({ fehler: "interner Fehler" }), {
        status: 500,
        headers: API_KOEPFE,
      });
    }
  },
  async scheduled(_ereignis: unknown, env: WorkerUmgebung, ctx: Kontext): Promise<void> {
    ctx.waitUntil(raeumeAuf(env).catch((e: unknown) => protokolliere("aufraeumen_fehler", {}, e)));
  },
};
