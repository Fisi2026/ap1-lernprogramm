/* N33 (E33): der Update-Ablauf – wann „bereit", wann „aktiv", wer neu laedt. */
import { describe, it, expect, vi } from "vitest"
import { erzeugeAktualisierung } from "./aktualisierung"

class Arbeiter extends EventTarget {
  state = "installing"
  postMessage = vi.fn()
  werde(s: string) { this.state = s; this.dispatchEvent(new Event("statechange")) }
}

function welt(mitSteuerung: boolean, wartet: Arbeiter | null = null, allein?: () => Promise<boolean>) {
  const reg = Object.assign(new EventTarget(), {
    waiting: wartet as Arbeiter | null, installing: null as Arbeiter | null,
    update: vi.fn(async () => undefined),
  })
  const container = Object.assign(new EventTarget(), {
    controller: mitSteuerung ? {} : null,
    register: vi.fn(async () => reg),
  })
  let sichtbar: (() => void) | null = null
  const neuLaden = vi.fn()
  const a = erzeugeAktualisierung({
    container: container as unknown as ServiceWorkerContainer, neuLaden,
    beiSichtbar: (cb) => { sichtbar = cb },
    ...(allein ? { umschaltenWennAllein: vi.fn(allein) } : {}),
  })
  const neueFassung = () => {
    const w = new Arbeiter(); reg.installing = w; reg.dispatchEvent(new Event("updatefound")); return w
  }
  const wechsel = () => container.dispatchEvent(new Event("controllerchange"))
  return { a, reg, container, neuLaden, neueFassung, wechsel, sichtbar: () => sichtbar?.() }
}

describe("Update-Ablauf", () => {
  it("ohne Umgebung (Test, file://) tut nichts", async () => {
    const a = erzeugeAktualisierung(null)
    await a.registriere("/v2/sw.js", "/v2/")
    a.jetzt()
    expect(a.zustand()).toBe("keine")
  })
  it("registriert mit Geltungsbereich", async () => {
    const w = welt(false)
    await w.a.registriere("/v2/sw.js", "/v2/")
    expect(w.container.register).toHaveBeenCalledWith("/v2/sw.js", { scope: "/v2/" })
  })
  it("erste Installation ist KEINE neue Fassung – auch nicht ihr controllerchange", async () => {
    const w = welt(false)
    await w.a.registriere("/v2/sw.js", "/v2/")
    w.neueFassung().werde("installed")
    w.wechsel()
    expect(w.a.zustand()).toBe("keine")
    expect(w.neuLaden).not.toHaveBeenCalled()
  })
  it("wartet beim Start schon eine Fassung, ist sie bereit", async () => {
    const w = welt(true, new Arbeiter())
    await w.a.registriere("/v2/sw.js", "/v2/")
    expect(w.a.zustand()).toBe("bereit")
  })
  it("beim Start: allein -> kein Hinweis, der Wechsel laedt neu (BUILD_LOG 277)", async () => {
    const w = welt(true, new Arbeiter(), async () => true)
    await w.a.registriere("/v2/sw.js", "/v2/")
    expect(w.a.zustand()).toBe("keine")
    w.wechsel()
    expect(w.neuLaden).toHaveBeenCalledTimes(1)
  })
  it("beim Start: anderes Fenster offen oder keine Antwort -> Hinweis wie bisher; ein fremder Wechsel laedt NICHT neu", async () => {
    for (const antwort of [async () => false, async () => { throw new Error("weg") }]) {
      const w = welt(true, new Arbeiter(), antwort)
      await w.a.registriere("/v2/sw.js", "/v2/")
      expect(w.a.zustand()).toBe("bereit")
      w.wechsel()
      expect(w.neuLaden).not.toHaveBeenCalled()
      expect(w.a.zustand()).toBe("aktiv")
    }
  })
  it("neue Fassung installiert -> bereit; Knopf schickt SKIP_WAITING, erst der Wechsel laedt neu", async () => {
    const w = welt(true)
    await w.a.registriere("/v2/sw.js", "/v2/")
    const neu = w.neueFassung()
    expect(w.a.zustand()).toBe("keine")
    neu.werde("installed")
    expect(w.a.zustand()).toBe("bereit")
    w.a.jetzt()
    expect(neu.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" })
    expect(w.neuLaden).not.toHaveBeenCalled()
    w.wechsel()
    expect(w.neuLaden).toHaveBeenCalledTimes(1)
  })
  it("schaltet ein ANDERER Tab um, wird hier nur angezeigt – neu geladen erst auf Knopfdruck", async () => {
    const w = welt(true)
    await w.a.registriere("/v2/sw.js", "/v2/")
    w.neueFassung().werde("installed")
    w.wechsel()
    expect(w.a.zustand()).toBe("aktiv")
    expect(w.neuLaden).not.toHaveBeenCalled()
    w.a.jetzt()
    expect(w.neuLaden).toHaveBeenCalledTimes(1)
  })
  it("wird die Seite wieder sichtbar, fragt sie nach einer neuen Fassung", async () => {
    const w = welt(true)
    await w.a.registriere("/v2/sw.js", "/v2/")
    w.sichtbar()
    expect(w.reg.update).toHaveBeenCalledTimes(1)
  })
})
