// @vitest-environment jsdom
/* N33 (E33): der Update-Hinweis – nie waehrend einer Simulation oder Tagesserie. */
import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, cleanup, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Updatehinweis } from "./Updatehinweis"
import type { Aktualisierung, Stufe } from "./aktualisierung"

function falsch(start: Stufe) {
  let s = start
  const abos = new Set<() => void>()
  const a = {
    zustand: () => s,
    abonniere: (cb: () => void) => { abos.add(cb); return () => { abos.delete(cb) } },
    registriere: vi.fn(), jetzt: vi.fn(),
  } as unknown as Aktualisierung
  return { a, setze: (n: Stufe) => act(() => { s = n; for (const cb of abos) cb() }) }
}
beforeEach(() => { cleanup() })
const titel = () => screen.queryByText("Neue Fassung verfügbar")

describe("Der Update-Hinweis", () => {
  it("ohne neue Fassung: nichts", () => {
    render(<Updatehinweis lauf={null} a={falsch("keine").a} />)
    expect(titel()).toBeNull()
  })
  it("erscheint, sobald eine Fassung bereit ist; der Knopf ruft jetzt()", async () => {
    const f = falsch("keine")
    render(<Updatehinweis lauf={null} a={f.a} />)
    f.setze("bereit")
    expect(titel()).not.toBeNull()
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: "Neu laden" }))
    expect(f.a.jetzt).toHaveBeenCalledTimes(1)
  })
  it("⛔ waehrend einer Simulation oder Tagesserie unsichtbar – danach von selbst da", () => {
    const f = falsch("bereit")
    const { rerender } = render(<Updatehinweis lauf="simulation" a={f.a} />)
    expect(titel()).toBeNull()
    rerender(<Updatehinweis lauf="serie" a={f.a} />)
    expect(titel()).toBeNull()
    rerender(<Updatehinweis lauf={null} a={f.a} />)
    expect(titel()).not.toBeNull()
  })
  it("„Später“ blendet aus – eine weitere Stufe zeigt ihn wieder", async () => {
    const f = falsch("bereit")
    render(<Updatehinweis lauf={null} a={f.a} />)
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: "Später" }))
    expect(titel()).toBeNull()
    f.setze("aktiv")
    expect(titel()).not.toBeNull()
  })
})
