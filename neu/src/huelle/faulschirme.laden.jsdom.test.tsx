// @vitest-environment jsdom
/* Mutationstest huelle/faulschirme: der faule Weg – erst Suspense-Rueckfall, dann der echte Schirm. */
import { describe, it, expect, vi } from "vitest"
import { Suspense } from "react"
import { render, screen } from "@testing-library/react"
import { leererStand } from "@/kern/stand"

describe("faule Schirme", () => {
  it("vor dem Laden steht der Rueckfall, danach der Schirm selbst", async () => {
    /* frisches Modul: der Pruefstand laedt die faulen Schirme sonst vorab (setup) */
    vi.resetModules()
    const { Glossar } = await import("./faulschirme")
    render(<Suspense fallback={<p>Wird geladen …</p>}><Glossar stand={leererStand()} /></Suspense>)
    expect(screen.getByText("Wird geladen …")).toBeTruthy()
    expect(await screen.findByRole("button", { name: /^Begriffe \(/ }, { timeout: 15000 })).toBeTruthy()
    expect(screen.queryByText("Wird geladen …")).toBeNull()
  }, 20000)
  it("ladeFauleSchirme laedt alle acht Schirme vorab, jeder ist danach eine Komponente", async () => {
    vi.resetModules()
    const m = await import("./faulschirme")
    const geladen = await m.ladeFauleSchirme()
    expect(geladen).toHaveLength(8)
    for (const k of geladen) expect(typeof k).toBe("function")
    expect(new Set(geladen).size).toBe(8)
    const namen = geladen.map((k) => (k as { name: string }).name)
    expect(namen).toEqual(["Simulation", "Gantt", "Netzplan", "RechenGenerator", "Einstellungen", "Meldungsliste", "Spickzettel", "Glossar"])
  }, 60000)
})
