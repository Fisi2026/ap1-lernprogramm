// @vitest-environment jsdom
/* Mutationstest huelle/aktualisierung: Benachrichtigung nur bei Wechsel, nur echte Installationen,
   Abmelden, Neuladen nur im Zustand „aktiv", und die Browser-Umgebung (Sichtbarkeit, Protokoll). */
import { describe, it, expect, vi, afterEach } from "vitest"
import { erzeugeAktualisierung } from "./aktualisierung"

class Arbeiter extends EventTarget {
  state = "installing"
  postMessage = vi.fn()
  werde(s: string) { this.state = s; this.dispatchEvent(new Event("statechange")) }
}
function welt(mitSteuerung: boolean, wartet: Arbeiter | null = null) {
  const reg = Object.assign(new EventTarget(), {
    waiting: wartet as Arbeiter | null, installing: null as Arbeiter | null,
    update: vi.fn(async () => undefined),
  })
  const container = Object.assign(new EventTarget(), {
    controller: mitSteuerung ? {} : null,
    register: vi.fn(async () => reg),
  })
  const neuLaden = vi.fn()
  const a = erzeugeAktualisierung({
    container: container as unknown as ServiceWorkerContainer, neuLaden, beiSichtbar: () => {},
  })
  const wechsel = () => container.dispatchEvent(new Event("controllerchange"))
  return { a, reg, container, neuLaden, wechsel }
}
afterEach(() => { vi.unstubAllGlobals(); vi.resetModules() })

describe("Benachrichtigung", () => {
  it("meldet nur, wenn sich die Stufe wirklich aendert", async () => {
    const w = welt(true)
    await w.a.registriere("/sw.js", "/")
    const cb = vi.fn()
    w.a.abonniere(cb)
    w.wechsel()
    expect(w.a.zustand()).toBe("aktiv")
    expect(cb).toHaveBeenCalledTimes(1)
    w.wechsel()
    expect(cb).toHaveBeenCalledTimes(1)
  })
  it("Abmelden wirkt; ein Abonnent darf sich beim Benachrichtigen selbst abmelden, ohne dass einer uebersprungen wird", async () => {
    const w = welt(true)
    await w.a.registriere("/sw.js", "/")
    const ruf: string[] = []
    const ab1 = w.a.abonniere(() => { ruf.push("eins"); ab1() })
    w.a.abonniere(() => { ruf.push("zwei") })
    const weg = w.a.abonniere(() => { ruf.push("drei") })
    weg()
    w.wechsel()
    expect(ruf).toEqual(["eins", "zwei"])
  })
})

describe("Installation und Wechsel", () => {
  it("der erste controllerchange ohne Steuerung wird uebergangen, der zweite ist eine neue Fassung", async () => {
    const w = welt(false)
    await w.a.registriere("/sw.js", "/")
    w.wechsel()
    expect(w.a.zustand()).toBe("keine")
    w.wechsel()
    expect(w.a.zustand()).toBe("aktiv")
  })
  it("updatefound ohne installierenden Arbeiter ist harmlos", async () => {
    const w = welt(true)
    await w.a.registriere("/sw.js", "/")
    expect(() => w.reg.dispatchEvent(new Event("updatefound"))).not.toThrow()
    expect(w.a.zustand()).toBe("keine")
  })
  it("nur der Zustand „installed“ mit Steuerung macht „bereit“", async () => {
    const w = welt(true)
    await w.a.registriere("/sw.js", "/")
    const neu = new Arbeiter(); w.reg.installing = neu; w.reg.dispatchEvent(new Event("updatefound"))
    neu.werde("installing"); expect(w.a.zustand()).toBe("keine")
    neu.werde("activating"); expect(w.a.zustand()).toBe("keine")
    neu.werde("installed"); expect(w.a.zustand()).toBe("bereit")
  })
  it("„installed“ ohne Steuerung (Erstinstallation) bleibt „keine“", async () => {
    const w = welt(false)
    await w.a.registriere("/sw.js", "/")
    const neu = new Arbeiter(); w.reg.installing = neu; w.reg.dispatchEvent(new Event("updatefound"))
    neu.werde("installed")
    expect(w.a.zustand()).toBe("keine")
  })
  it("jetzt() laedt nur im Zustand „aktiv“ neu – nicht bei „keine“", async () => {
    const w = welt(true)
    await w.a.registriere("/sw.js", "/")
    w.a.jetzt()
    expect(w.neuLaden).not.toHaveBeenCalled()
    w.wechsel()
    w.a.jetzt()
    expect(w.neuLaden).toHaveBeenCalledTimes(1)
  })
})

describe("Browser-Umgebung", () => {
  function umgebung(protocol: string) {
    const reg = Object.assign(new EventTarget(), { waiting: null, installing: null, update: vi.fn(async () => undefined) })
    const container = Object.assign(new EventTarget(), { controller: {}, register: vi.fn(async () => reg) })
    const reload = vi.fn()
    vi.stubGlobal("navigator", { serviceWorker: container })
    vi.stubGlobal("location", { protocol, reload })
    return { reg, container, reload }
  }
  const sichtbarkeit = (s: string) => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => s })
    document.dispatchEvent(new Event("visibilitychange"))
  }
  it("ohne ServiceWorker im Browser oder ohne http(s): keine Registrierung", async () => {
    const u = umgebung("file:")
    const { aktualisierung } = await import("./aktualisierung")
    await aktualisierung.registriere("/sw.js", "/")
    expect(u.container.register).not.toHaveBeenCalled()
    vi.resetModules()
    vi.stubGlobal("navigator", {})
    const { aktualisierung: a2 } = await import("./aktualisierung")
    await expect(a2.registriere("/sw.js", "/")).resolves.toBeUndefined()
  })
  it("ganz ohne navigator (kein Browser): Import und Aufrufe werfen nicht", async () => {
    vi.stubGlobal("navigator", undefined)
    const { aktualisierung } = await import("./aktualisierung")
    await expect(aktualisierung.registriere("/sw.js", "/")).resolves.toBeUndefined()
    expect(aktualisierung.zustand()).toBe("keine")
  })
  it("http und https: registriert; Sichtbarwerden fragt nach, unsichtbar nicht", async () => {
    for (const p of ["http:", "https:"]) {
      vi.resetModules()
      const u = umgebung(p)
      const { aktualisierung } = await import("./aktualisierung")
      await aktualisierung.registriere("/sw.js", "/")
      expect(u.container.register).toHaveBeenCalledTimes(1)
      sichtbarkeit("hidden")
      expect(u.reg.update).not.toHaveBeenCalled()
      sichtbarkeit("visible")
      expect(u.reg.update).toHaveBeenCalledTimes(1)
    }
  })
  it("ein Knopfdruck nach dem Wechsel laedt die Seite wirklich neu (location.reload)", async () => {
    const u = umgebung("https:")
    const { aktualisierung } = await import("./aktualisierung")
    await aktualisierung.registriere("/sw.js", "/")
    u.container.dispatchEvent(new Event("controllerchange"))
    expect(aktualisierung.zustand()).toBe("aktiv")
    aktualisierung.jetzt()
    expect(u.reload).toHaveBeenCalledTimes(1)
  })
})
