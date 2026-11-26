// @vitest-environment jsdom
/* Mutationstest huelle: Rest-Faelle zu Zuschauer, Bereichsgrenze, Ladehuelle, useLernstand.
   Geprueft wird die sichtbare Wirkung und was an die Schnittstellen hinausgeht. */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, renderHook, screen, cleanup, act, within, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Zuschauer } from "./Zuschauer"
import { Bereichsgrenze } from "./Bereichsgrenze"
import { PoolWartet, SchirmLaedt } from "./Ladehuelle"
import { useLernstand } from "./useLernstand"
import type { StandHaken } from "./useLernstand"
import type { Lauf, QuelleMitDauer } from "@/kern/lernstandort"
import { leererStand } from "@/kern/stand"

beforeEach(() => { cleanup() })
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

describe("Zuschauer", () => {
  function haken(lauf: Lauf | null, offen?: Promise<Lauf | null>) {
    const quelle = { fremderLauf: vi.fn(() => offen ?? Promise.resolve(lauf)), hierWeiter: vi.fn(async () => undefined) }
    return { h: { rolle: "zuschauer", quelle } as unknown as StandHaken, quelle }
  }
  const nutzer = () => userEvent.setup({ delay: null, pointerEventsCheck: 0 })

  it("der Knopf ist anfangs bedienbar und waehrend der Rueckfrage nach dem anderen Tab gesperrt", async () => {
    let frei!: (l: Lauf | null) => void
    const { h, quelle } = haken(null, new Promise((r) => { frei = r }))
    render(<Zuschauer lernstand={h} />)
    const knopf = screen.getByRole("button", { name: "Hier weiterarbeiten" }) as HTMLButtonElement
    expect(knopf.disabled).toBe(false)
    await nutzer().click(knopf)
    expect(knopf.disabled).toBe(true)
    await act(async () => { frei(null) })
    expect(knopf.disabled).toBe(false)
    expect(quelle.hierWeiter).toHaveBeenCalledTimes(1)
  })
  it("Tagesserie im anderen Tab: die Rueckfrage nennt sie beim Namen", async () => {
    const { h } = haken("serie")
    render(<Zuschauer lernstand={h} />)
    await nutzer().click(screen.getByRole("button", { name: "Hier weiterarbeiten" }))
    /* Der Dialog oeffnet erst nach der Rueckfrage (await fremderLauf) – darauf warten, nicht sofort greifen:
       unter Last (parallele Stryker-Laeufe) war der Test sonst rot (BUILD_LOG 220). */
    expect((await screen.findByRole("dialog")).textContent).toContain("Im anderen Tab läuft eine Tagesserie")
  })
  it("Escape schliesst die Rueckfrage ohne zu uebernehmen", async () => {
    const { h, quelle } = haken("simulation")
    const n = nutzer()
    render(<Zuschauer lernstand={h} />)
    await n.click(screen.getByRole("button", { name: "Hier weiterarbeiten" }))
    expect(await screen.findByRole("dialog")).toBeTruthy()
    await n.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(quelle.hierWeiter).not.toHaveBeenCalled()
  })
  it("„Trotzdem hier weiter“ uebernimmt UND schliesst die Rueckfrage", async () => {
    const { h, quelle } = haken("simulation")
    const n = nutzer()
    render(<Zuschauer lernstand={h} />)
    await n.click(screen.getByRole("button", { name: "Hier weiterarbeiten" }))
    await n.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Trotzdem hier weiter" }))
    expect(quelle.hierWeiter).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})

describe("Bereichsgrenze", () => {
  function Wirf(): never { throw new Error("Sabotage") }
  beforeEach(() => { vi.spyOn(console, "error").mockImplementation(() => {}) })

  it("waehrend der Bericht unterwegs ist, steht dort „wird gesendet“", async () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})))
    render(<Bereichsgrenze bereich="stat" zurStart={() => {}}><Wirf /></Bereichsgrenze>)
    await act(async () => {})
    expect(screen.getByRole("alert").textContent).toContain("Ein Fehlerbericht wird gesendet")
  })
  it("ohne Wurf zeichnet sie nur ihre Kinder", () => {
    render(<Bereichsgrenze bereich="stat" zurStart={() => {}}><p>heil</p></Bereichsgrenze>)
    expect(screen.queryByRole("alert")).toBeNull()
    expect(screen.getByText("heil")).toBeTruthy()
  })
  it("meldet je Grenze hoechstens einmal, auch wenn der Wurf doppelt gemeldet wird", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 201 }))
    vi.stubGlobal("fetch", fetchMock)
    const g = new Bereichsgrenze({ bereich: "stat", zurStart: () => {}, children: null })
    g.setState = vi.fn()
    g.componentDidCatch(new Error("a"))
    g.componentDidCatch(new Error("b"))
    await act(async () => {})
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it("„Neu laden“ laedt die Seite neu, „Zur Startseite“ ruft zurStart", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 201 })))
    const neu = vi.fn()
    const loc = window.location
    vi.stubGlobal("location", { protocol: loc.protocol, hash: loc.hash, href: loc.href, reload: neu })
    const start = vi.fn()
    render(<Bereichsgrenze bereich="stat" zurStart={start}><Wirf /></Bereichsgrenze>)
    await act(async () => {})
    const n = userEvent.setup({ delay: null })
    await n.click(screen.getByRole("button", { name: "Neu laden" }))
    expect(neu).toHaveBeenCalledTimes(1)
    expect(start).not.toHaveBeenCalled()
    await n.click(screen.getByRole("button", { name: "Zur Startseite" }))
    expect(start).toHaveBeenCalledTimes(1)
  })
})

describe("Ladehuelle", () => {
  it("Pool laedt: Hinweis „Fragen werden geladen“, kein Knopf", () => {
    render(<PoolWartet status="laedt" nochmal={() => {}} />)
    expect(screen.getByRole("status").textContent).toBe("Fragen werden geladen …")
    expect(screen.queryByRole("button")).toBeNull()
  })
  it("Pool fehlt: Fehlertext und „Nochmal versuchen“ ruft nochmal", async () => {
    const nochmal = vi.fn()
    render(<PoolWartet status="fehler" nochmal={nochmal} />)
    expect(screen.getByRole("alert").textContent).toContain("Die Fragen konnten nicht geladen werden")
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: "Nochmal versuchen" }))
    expect(nochmal).toHaveBeenCalledTimes(1)
  })
  it("ein fauler Schirm zeigt „Wird geladen …“", () => {
    render(<SchirmLaedt />)
    expect(screen.getByRole("status").textContent).toBe("Wird geladen …")
  })
})

describe("useLernstand reicht an die Quelle durch", () => {
  function quelle() {
    const z = { stand: leererStand(), befund: "neu", speicherFehler: false, rolle: "aktiv", reparaturen: [], gesichert: false, konflikte: 0, dauerhaft: "fehlt", lauf: null }
    return {
      zustand: () => z, abonniere: () => () => {}, starte: vi.fn(() => () => {}),
      aendere: vi.fn(), bitteDauerhaft: vi.fn(), fremderLauf: vi.fn(), hierWeiter: vi.fn(),
    }
  }
  it("starte laeuft einmal beim Einhaengen", () => {
    const q = quelle()
    renderHook(() => useLernstand(q as unknown as QuelleMitDauer))
    expect(q.starte).toHaveBeenCalledTimes(1)
  })
  it("buche aendert den Stand UND bittet um dauerhaften Speicher", () => {
    const q = quelle()
    const { result } = renderHook(() => useLernstand(q as unknown as QuelleMitDauer))
    result.current.buche({ id: "M01-001", typ: "mc" } as never, true)
    expect(q.aendere).toHaveBeenCalledTimes(1)
    expect(typeof q.aendere.mock.calls[0]![0]).toBe("function")
    expect(q.bitteDauerhaft).toHaveBeenCalledTimes(1)
  })
  it("zeige merkt die Frage im Stand; aendere reicht die Funktion unveraendert durch", () => {
    const q = quelle()
    const { result } = renderHook(() => useLernstand(q as unknown as QuelleMitDauer))
    result.current.zeige("M01-001")
    expect(q.aendere).toHaveBeenCalledTimes(1)
    const neu = q.aendere.mock.calls[0]![0](leererStand())
    expect(JSON.stringify(neu)).toContain("M01-001")
    const fn = (s: unknown) => s
    result.current.aendere(fn as never)
    expect(q.aendere).toHaveBeenLastCalledWith(fn)
  })
  it("liefert Quelle und Zustand mit", () => {
    const q = quelle()
    const { result } = renderHook(() => useLernstand(q as unknown as QuelleMitDauer))
    expect(result.current.quelle).toBe(q)
    expect(result.current).toMatchObject({ rolle: "aktiv", befund: "neu", konflikte: 0, lauf: null })
  })
})
