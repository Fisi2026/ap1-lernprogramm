// @vitest-environment jsdom
/* Mutationstest huelle: Kopf (Messwerte, Warnfarbe, Trenner, Fehler-Deck) und Schiene (aktiver Bereich,
   Trenner zwischen den Bloecken). Geprueft wird, was man sieht und was beim Klick hinausgeht. */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { KLAUSUR_SET } from "@/kern/klausur"
import { render, screen, cleanup, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Kopf } from "./Kopf"
import { Schiene as SchieneRoh } from "./Schiene"
import { TooltipProvider } from "@/components/ui/tooltip"

const Schiene = (p: React.ComponentProps<typeof SchieneRoh>) => <TooltipProvider><SchieneRoh {...p} /></TooltipProvider>

/* Klausurtag aus dem Set selbst – ein neues Set mit anderem Datum bricht den Test nicht. */
const [J, M, T] = KLAUSUR_SET.datum.split("-").map(Number)
const VORHER = new Date(J, M - 1, T, 12, 0).getTime()
const DANACH = new Date(J, M - 1, T + 1, 0, 0).getTime()
function uhr(t: number) { vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(t) }

beforeEach(() => { cleanup() })
afterEach(() => { vi.useRealTimers() })

describe("Kopf", () => {
  const mw = [
    { wert: "12", bezeichnung: "Heute" },
    { wert: "40 %", bezeichnung: "Quote", warnung: true },
    { wert: "3", bezeichnung: "Serie" },
  ]
  it("zeigt Titel als h1 und den Untertitel nur, wenn er da ist", () => {
    const { rerender } = render(<Kopf titel="Üben" messwerte={[]} />)
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Üben")
    expect(document.querySelector("header p")).toBeNull()
    rerender(<Kopf titel="Üben" untertitel="Thema A" messwerte={[]} />)
    expect(document.querySelector("header p")!.textContent).toBe("Thema A")
  })
  it("leerer Untertitel bleibt unsichtbar (kein leeres p)", () => {
    render(<Kopf titel="Üben" untertitel="" messwerte={[]} />)
    expect(document.querySelector("header p")).toBeNull()
  })
  it("jeder Messwert zeigt Wert und Bezeichnung; nur die Warnung ist rot", () => {
    render(<Kopf titel="T" messwerte={mw} />)
    for (const m of mw) {
      const wert = screen.getByText(m.wert)
      expect(wert.tagName).toBe("B")
      expect(wert.nextElementSibling!.textContent).toBe(m.bezeichnung)
      expect(wert.classList.contains("text-destructive")).toBe(m.warnung === true)
    }
  })
  it("Trenner stehen zwischen den Messwerten, nicht davor: bei drei Werten zwei", () => {
    const { container, rerender } = render(<Kopf titel="T" messwerte={mw} />)
    expect(container.querySelectorAll('[data-slot="separator"]')).toHaveLength(2)
    rerender(<Kopf titel="T" messwerte={mw.slice(0, 1)} />)
    expect(container.querySelectorAll('[data-slot="separator"]')).toHaveLength(0)
    const erster = container.querySelector("b")!.closest("div.flex.items-center")!
    expect(erster.firstElementChild!.getAttribute("data-slot")).not.toBe("separator")
  })
  it("Fehler-Deck-Zaehler erscheint auch bei 0, ohne Angabe gar nicht", () => {
    const { rerender } = render(<Kopf titel="T" messwerte={[]} />)
    expect(screen.queryByText(/Fehler-Deck/)).toBeNull()
    rerender(<Kopf titel="T" messwerte={[]} faelligeKarten={0} />)
    const badge = screen.getByText(/Fehler-Deck/)
    expect(badge.textContent).toBe("Fehler-Deck 0")
    rerender(<Kopf titel="T" messwerte={[]} faelligeKarten={7} />)
    expect(screen.getByText(/Fehler-Deck/).textContent).toBe("Fehler-Deck 7")
  })
})

describe("Schiene", () => {
  it("nur der aktive Bereich traegt aria-current und die Hervorhebung", () => {
    uhr(VORHER)
    render(<Schiene aktiv="sim" aufBereich={() => {}} />)
    const nav = screen.getByRole("navigation", { name: "Bereiche" })
    const knoepfe = within(nav).getAllByRole("button")
    expect(knoepfe).toHaveLength(14)
    const aktive = knoepfe.filter((b) => b.getAttribute("aria-current") === "page")
    expect(aktive.map((b) => b.getAttribute("aria-label"))).toEqual(["Prüfungssimulation"])
    for (const b of knoepfe) {
      const hervorgehoben = b.classList.contains("bg-sidebar-accent")
      expect(hervorgehoben).toBe(b === aktive[0])
      expect(b.classList.contains("text-sidebar-foreground")).toBe(b === aktive[0])
    }
  })
  /* K3-E41 / BUILD_LOG 318: die Uhr steht fest – sonst haengt die Knopfzahl am Tag des Testlaufs. */
  it("am Klausurtag noch mit Klausurvorbereitung, ab 0 Uhr danach ohne (13 Knoepfe)", () => {
    uhr(VORHER)
    const { unmount } = render(<Schiene aktiv="start" aufBereich={() => {}} />)
    expect(screen.getByRole("button", { name: "Klausurvorbereitung" })).toBeTruthy()
    unmount()
    uhr(DANACH)
    render(<Schiene aktiv="start" aufBereich={() => {}} />)
    const knoepfe = within(screen.getByRole("navigation", { name: "Bereiche" })).getAllByRole("button")
    expect(knoepfe).toHaveLength(13)
    expect(screen.queryByRole("button", { name: "Klausurvorbereitung" })).toBeNull()
    expect(screen.getByRole("button", { name: "Üben" })).toBeTruthy()
  })
  it("Einstellungen unten ist aktivierbar", () => {
    render(<Schiene aktiv="einst" aufBereich={() => {}} />)
    expect(screen.getByRole("button", { name: "Einstellungen" }).getAttribute("aria-current")).toBe("page")
    expect(screen.getByRole("button", { name: "Startseite" }).hasAttribute("aria-current")).toBe(false)
  })
  it("ein Klick meldet genau die Kennung dieses Knopfes", async () => {
    const auf = vi.fn()
    render(<Schiene aktiv="start" aufBereich={auf} />)
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: "Glossar" }))
    expect(auf).toHaveBeenCalledTimes(1)
    expect(auf).toHaveBeenCalledWith("glossar")
  })
  it("Trennlinien liegen zwischen den vier Bloecken: drei, keine vor dem ersten", () => {
    render(<Schiene aktiv="start" aufBereich={() => {}} />)
    const nav = screen.getByRole("navigation", { name: "Bereiche" })
    const linien = nav.querySelectorAll("div.h-px")
    expect(linien).toHaveLength(3)
    const bloecke = Array.from(nav.children).filter((e) => e.querySelector("button") && !e.classList.contains("mt-auto"))
    expect(bloecke).toHaveLength(4)
    expect(bloecke[0]!.querySelector("div.h-px")).toBeNull()
    for (const b of bloecke.slice(1)) expect(b.firstElementChild!.classList.contains("h-px")).toBe(true)
  })
})
