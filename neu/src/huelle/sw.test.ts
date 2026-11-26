/* N33 (E33): der Service Worker des Neubaus – Bau-Plugin UND Verhalten der Vorlage.
   ►► Die Vorlage laeuft hier in einer Sandbox mit nachgebautem `self`/`caches`: so ist jede
      Regel aus PLAN_NEUBAU N33 ein Test und keine Behauptung im Kommentar. */
import fs from "node:fs"
import path from "node:path"
import { describe, it, expect, vi } from "vitest"
import { POLITIK } from "@/lib/vertrauen"
import { stempelFuer } from "../../sw/plugin"
import { cacheName, swQuelltext, vorabListe, manifestText, ICONS, abschaltQuelltext, weiterleitungen, APP_SW, ABSCHALTEN, sicherheitsKoepfe, CSP } from "../../sw/plugin"

const NEU = path.resolve(import.meta.dirname, "../..")
const VORLAGE = fs.readFileSync(path.join(NEU, "sw/vorlage.js"), "utf8")
const ABSCHALT = fs.readFileSync(path.join(NEU, "sw/abschalten.js"), "utf8")
const HERKUNFT = "https://ap1.example"

/* NP1: der Cache heisst nach Version UND Stempel der Dateiliste */
const CACHE_T = cacheName("9.9.9", stempelFuer(["index.html", "assets/index-A.js", "assets/pooldaten-B.js", "sw.js"]))
function sandbox(keys: string[] = []) {
  const h: Record<string, (e: unknown) => void> = {}
  const self = {
    location: { origin: HERKUNFT },
    addEventListener: (t: string, f: (e: unknown) => void) => { h[t] = f },
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn(async () => undefined), matchAll: vi.fn(async () => [{}]) },
  }
  const cache = { addAll: vi.fn(async () => undefined) }
  const caches = {
    open: vi.fn(async () => cache),
    keys: vi.fn(async () => keys),
    delete: vi.fn(async () => true),
    match: vi.fn(async () => "TREFFER"),
  }
  const quelle = swQuelltext(VORLAGE, "9.9.9", ["index.html", "assets/index-A.js", "assets/pooldaten-B.js", "sw.js"])
  new Function("self", "caches", "fetch", quelle)(self, caches, vi.fn(async () => "NETZ"))
  const abruf = (url: string, mode = "cors", method = "GET") => {
    const respondWith = vi.fn()
    h.fetch!({ request: { url, mode, method }, respondWith })
    return respondWith
  }
  return { h, self, cache, caches, abruf }
}
const warte = async (e: { waitUntil: ReturnType<typeof vi.fn> }) => { await (e.waitUntil.mock.calls[0] as unknown[])[0] }

describe("Bau-Plugin", () => {
  it("Cache-Name = APP_VERSION mit eigenem Vorsatz – nie einer der alten Fassungen", () => {
    expect(cacheName("2.0.0")).toBe("ap1-app-2.0.0")
    /* NP1: jede andere Dateiliste = eigener Cache; gleiche Liste (andere Reihenfolge) = derselbe */
    const a = stempelFuer(["assets/a-1.js", "index.html"]), b = stempelFuer(["index.html", "assets/a-1.js"])
    const c = stempelFuer(["assets/a-2.js", "index.html"])
    expect(a).toMatch(/^[0-9a-f]{8}$/)
    expect(a).toBe(b)
    expect(a).not.toBe(c)
    expect(cacheName("2.0.0", a)).toBe("ap1-app-2.0.0-" + a)
    expect(swQuelltext('var CACHE = "__CACHE__"; var D = __DATEIEN__;', "2.0.0", ["assets/a-1.js"])).toContain(`"ap1-app-2.0.0-${stempelFuer(["assets/a-1.js"])}"`)
    for (const alt of ["ap1-v", "ap1v2-"]) expect(cacheName("2.0.0").indexOf(alt)).toBe(-1)
  })
  it("Vorab-Liste: Huelle zuerst, ohne Service Worker, Regeln und Sourcemaps", () => {
    expect(vorabListe(["sw.js", "v2/sw.js", "app-sw.js", "_redirects", "b.js", "a.js.map", "a.js"]))
      .toEqual(["./", "a.js", "b.js"])
  })
  it("⛔ der Neubau-SW liegt NICHT unter sw.js – dort liegt der Abschalt-SW", () => {
    expect(APP_SW).not.toBe("sw.js")
    expect(ABSCHALTEN).toContain("sw.js")
    expect(ABSCHALTEN).toContain("v2/sw.js")
  })
  it("Sicherheits-Koepfe gelten fuer alle Pfade; die CSP erlaubt nur die eigene Herkunft", () => {
    const k = sicherheitsKoepfe().trimEnd().split("\n")
    expect(k[0]).toBe("/*")
    for (const z of k.slice(1)) expect(z, z).toMatch(/^  [A-Z][A-Za-z-]+: \S/)
    const text = k.join("\n")
    for (const kopf of ["Strict-Transport-Security", "X-Content-Type-Options: nosniff", "X-Frame-Options: DENY",
      "Referrer-Policy", "Content-Security-Policy: "]) expect(text).toContain(kopf)
    expect(text).not.toContain("Report-Only")
    for (const d of ["script-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'none'"]) expect(CSP).toContain(d)
    expect(CSP).not.toMatch(/unsafe-eval|https?:|\*/)
    /* AUD-C8: Trusted Types, genau eine Politik – dieselbe, die src/lib/vertrauen.ts anlegt */
    expect(CSP).toContain("require-trusted-types-for 'script'")
    expect(CSP).toContain("trusted-types " + POLITIK)
    expect(vorabListe(["_headers", "a.js"])).toEqual(["./", "a.js"])
    /* AUD-C3: nur latin/latin-ext vorab */
    expect(vorabListe(["assets/geist-latin-wght-normal-X.woff2", "assets/geist-latin-ext-wght-normal-X.woff2",
      "assets/geist-cyrillic-wght-normal-X.woff2", "assets/geist-cyrillic-ext-wght-normal-X.woff2",
      "assets/geist-vietnamese-wght-normal-X.woff2"]))
      .toEqual(["./", "assets/geist-latin-ext-wght-normal-X.woff2", "assets/geist-latin-wght-normal-X.woff2"])
  })
  it("Weiterleitungen: alte Startseite und /v2/ auf die Basis", () => {
    const w = weiterleitungen("/").trim().split("\n")
    expect(w).toContain("/lernprogramm_ap1.html / 301")
    expect(w).toContain("/v2/ / 301")
    /* ⛔ KEIN Platzhalter unter /v2/: /v2/sw.js muss den Abschalt-SW liefern, nicht umleiten
       (ein Service-Worker-Skript hinter einer Umleitung wird nicht geladen). */
    expect(w.some((z) => z.startsWith("/v2/*"))).toBe(false)
  })
  it("fehlt ein Platzhalter in der Vorlage, bricht der Bau laut ab", () => {
    expect(() => swQuelltext("var x = 1", "1", [])).toThrow(/Platzhalter/)
  })
  it("Manifest: relativ zum Geltungsbereich, Icons aus der Liste", () => {
    const m = JSON.parse(manifestText())
    expect(m.start_url).toBe("./")
    expect(m.scope).toBe("./")
    for (const i of m.icons) expect(ICONS).toContain(i.src)
  })
})

describe("Die Vorlage im Betrieb", () => {
  it("install legt Huelle und Pool vorab ab – und schaltet NICHT von selbst um", async () => {
    const s = sandbox()
    const e = { waitUntil: vi.fn() }
    s.h.install!(e); await warte(e)
    expect(s.caches.open).toHaveBeenCalledWith(CACHE_T)
    const liste = (s.cache.addAll.mock.calls[0] as unknown[])[0] as string[]
    expect(liste[0]).toBe("./")
    expect(liste).toContain("assets/pooldaten-B.js")
    expect(liste).not.toContain("sw.js")
    expect(s.self.skipWaiting).not.toHaveBeenCalled()
  })
  it("umgeschaltet wird nur auf SKIP_WAITING", () => {
    const s = sandbox()
    s.h.message!({ data: { type: "ANDERES" } })
    expect(s.self.skipWaiting).not.toHaveBeenCalled()
    s.h.message!({ data: { type: "SKIP_WAITING" } })
    expect(s.self.skipWaiting).toHaveBeenCalledTimes(1)
  })
  it("SKIP_WAITING_ALLEIN: allein -> Antwort true, dann umschalten; mit zweitem Fenster -> false, nicht umschalten", async () => {
    for (const [fenster, allein] of [[1, true], [2, false]] as const) {
      const s = sandbox()
      s.self.clients.matchAll.mockResolvedValue(Array.from({ length: fenster }, () => ({})))
      const port = { postMessage: vi.fn() }
      const e = { data: { type: "SKIP_WAITING_ALLEIN" }, ports: [port], waitUntil: vi.fn() }
      s.h.message!(e); await warte(e)
      expect(s.self.clients.matchAll).toHaveBeenCalledWith({ type: "window", includeUncontrolled: true })
      expect(port.postMessage).toHaveBeenCalledWith({ allein })
      expect(s.self.skipWaiting).toHaveBeenCalledTimes(allein ? 1 : 0)
    }
  })
  it("activate raeumt nur eigene alte Caches – die der alten Fassungen raeumt der Abschalt-SW", async () => {
    const s = sandbox(["ap1-app-9.9.8", "ap1-app-9.9.9-deadbeef", CACHE_T, "ap1v2-1.41.0", "ap1-v1.40.0", "fremd"])
    const e = { waitUntil: vi.fn() }
    s.h.activate!(e); await warte(e)
    /* NP1: auch die GLEICHE Version mit altem Stempel wird geraeumt */
    expect(s.caches.delete.mock.calls).toEqual([["ap1-app-9.9.8"], ["ap1-app-9.9.9-deadbeef"]])
  })
  it("/api/* wird nie beantwortet – weder GET noch POST", () => {
    const s = sandbox()
    expect(s.abruf(`${HERKUNFT}/api/meldungen`)).not.toHaveBeenCalled()
    expect(s.abruf(`${HERKUNFT}/api/meldung`, "cors", "POST")).not.toHaveBeenCalled()
    expect(s.abruf(`${HERKUNFT}/api/fehler`, "navigate")).not.toHaveBeenCalled()
  })
  it("fremde Herkunft geht am Service Worker vorbei", () => {
    expect(sandbox().abruf("https://anderswo.example/x.js")).not.toHaveBeenCalled()
  })
  it("Navigation bekommt die Huelle aus dem eigenen Cache, Dateien ihren Treffer", async () => {
    const s = sandbox()
    const nav = s.abruf(`${HERKUNFT}/`, "navigate")
    expect(await nav.mock.calls[0]![0]).toBe("TREFFER")
    expect(s.caches.match).toHaveBeenLastCalledWith("./", { cacheName: CACHE_T })
    s.abruf(`${HERKUNFT}/assets/index-A.js`)
    expect(s.caches.match).toHaveBeenCalledTimes(2)
  })
})

describe("Der Abschalt-SW (N29, R9)", () => {
  function welt(keys: string[]) {
    const h: Record<string, (e: unknown) => void> = {}
    const fenster = [
      { url: "https://ap1.example/lernprogramm_ap1.html#ueben", navigate: vi.fn(async () => null) },
      { url: "https://ap1.example/v2/", navigate: vi.fn(async () => { throw new Error("weg") }) },
    ]
    const self = {
      addEventListener: (t: string, f: (e: unknown) => void) => { h[t] = f },
      skipWaiting: vi.fn(),
      registration: { unregister: vi.fn(async () => true) },
      clients: { matchAll: vi.fn(async () => fenster) },
    }
    const caches = { keys: vi.fn(async () => keys), delete: vi.fn(async () => true) }
    new Function("self", "caches", abschaltQuelltext(ABSCHALT, "/"))(self, caches)
    return { h, self, caches, fenster }
  }
  it("uebernimmt sofort", () => {
    const w = welt([])
    w.h.install!({})
    expect(w.self.skipWaiting).toHaveBeenCalledTimes(1)
  })
  it("loescht die Caches der alten Fassungen – den des Neubaus nicht –, meldet sich ab, laedt auf / mit Bereich", async () => {
    const w = welt(["ap1-v1.41.0", "ap1v2-1.41.0", "ap1-app-2.0.0", "fremd"])
    const e = { waitUntil: vi.fn() }
    w.h.activate!(e); await warte(e)
    expect(w.caches.delete.mock.calls).toEqual([["ap1-v1.41.0"], ["ap1v2-1.41.0"]])
    expect(w.self.registration.unregister).toHaveBeenCalledTimes(1)
    await new Promise((r) => { setTimeout(r, 0); })  // das Neuladen laeuft nach waitUntil
    expect(w.fenster[0]!.navigate).toHaveBeenCalledWith("/#ueben")
    expect(w.fenster[1]!.navigate).toHaveBeenCalledWith("/")
  })
  it("⛔ waitUntil wartet NICHT auf das Neuladen – ein haengendes navigate blockiert das Abmelden nicht", async () => {
    const w = welt(["ap1-v1.41.0"])
    for (const f of w.fenster) f.navigate = vi.fn(() => new Promise<null>(() => {}))
    const e = { waitUntil: vi.fn() }
    w.h.activate!(e)
    await expect(Promise.race([(e.waitUntil.mock.calls[0] as unknown[])[0], new Promise((_, n) => { setTimeout(() => n(new Error("haengt")), 200); })])).resolves.toBe(true)
  })
  it("hat keinen fetch-Lauscher – bis zum Neuladen geht alles ins Netz", () => {
    expect(Object.keys(welt([]).h).sort()).toEqual(["activate", "install"])
  })
  it("fehlt der Platzhalter, bricht der Bau laut ab", () => {
    expect(() => abschaltQuelltext("var x", "/")).toThrow(/Platzhalter/)
  })
})

describe("Das Bauergebnis v2/ (= der ganze Auslieferungsordner seit N29)", () => {
  const v2 = path.resolve(NEU, "../v2")
  const lies = (d: string) => fs.readFileSync(path.join(v2, d), "utf8")
  /* ⛔ Die Liste im Bau muss JEDE ausgelieferte Datei enthalten – sonst fehlt sie offline. */
  it("app-sw.js nennt jede gebaute Datei und die aktuelle Version", () => {
    const sw = lies(APP_SW)
    /* NP1: Version + Stempel der Dateiliste */
    expect(sw).toMatch(new RegExp(`"ap1-app-${__APP_VERSION__.split(".").join("[.]")}-[0-9a-f]{8}"`))
    const alle = fs.readdirSync(v2, { recursive: true, withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => path.relative(v2, path.join(d.parentPath, d.name)).split(path.sep).join("/"))
      .filter((d) => d !== APP_SW && !(ABSCHALTEN as readonly string[]).includes(d) && d !== "_redirects" && d !== "_headers")
    expect(alle.length).toBeGreaterThan(8)
    const vorab = vorabListe(alle)
    for (const d of vorab.slice(1)) expect(sw, d).toContain(`"${d}"`)
    /* AUD-C3: was NICHT vorab geladen wird, sind genau die fremden Schriftschnitte – nichts sonst */
    const draussen = alle.filter((d) => !vorab.includes(d))
    for (const d of draussen) {
      expect(d, d).toMatch(/geist-(cyrillic|cyrillic-ext|vietnamese)-wght/)
      expect(sw, d).not.toContain(`"${d}"`)
    }
  })
  it("sw.js und v2/sw.js sind der Abschalt-SW, _redirects liegt bei", () => {
    for (const d of ABSCHALTEN) expect(lies(d), d).toContain("registration.unregister")
    expect(lies("_redirects")).toContain("/lernprogramm_ap1.html / 301")
    /* Pruefbericht 26.09.2026: die Sicherheits-Koepfe liegen im Auslieferungsordner (Cloudflare wertet sie aus) */
    expect(lies("_headers")).toContain("X-Content-Type-Options: nosniff")
    expect(lies(APP_SW)).not.toContain('"_headers"')
  })
  it("index.html verweist unter / (nicht mehr /v2/)", () => {
    const html = lies("index.html")
    expect(html).toMatch(/src="\/assets\/index-[^"]+\.js"/)
    expect(html).not.toContain("/v2/")
  })
})
