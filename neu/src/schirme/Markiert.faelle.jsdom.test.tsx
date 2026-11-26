// @vitest-environment jsdom
/* Markiert: Übersicht (gekürzter Fragetext, Leerzustand), Übungsrunde (Zähler, Runde beenden, Ende), Waisen-Kennungen. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAGEN } from "@/daten/laden";
import { leererStand, type Lernstand } from "@/kern/stand";
import type { StandHaken } from "@/huelle/useLernstand";
import { Markiert } from "./Markiert";

afterEach(cleanup);
const MC = FRAGEN.filter((f) => f.typ === "mc");
const LANG = MC.find((f) => (f.frage ?? "").length > 90)!;
const [A, B] = [MC[0]!, MC[1]!];
function haken(markiert: Record<string, unknown>) {
  const aendere = vi.fn();
  const stand = { ...leererStand(), abrufAn: false, markiert } as Lernstand;
  return { h: { stand, aendere, buche: vi.fn(), zeige: vi.fn() } as unknown as StandHaken, aendere, stand };
}
const nutzer = () => userEvent.setup({ delay: null });

describe("Übersicht", () => {
  it("ohne Markierung: Leerzustand, keine Übersicht, kein Üben-Knopf", () => {
    render(<Markiert lernstand={haken({}).h} />);
    expect(screen.getByText("Noch nichts markiert.")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Übersicht" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Markierte üben/ })).toBeNull();
  });

  it("mit Markierungen: Zahl, Knopf, je Frage eine Zeile mit Kennung, Modul · Thema und auf 80 Zeichen gekürztem Text", () => {
    render(<Markiert lernstand={haken({ [LANG.id]: 1, [A.id]: 1 }).h} />);
    expect(screen.getByRole("button", { name: "Markierte üben (2)" })).toBeTruthy();
    const liste = document.querySelector('[data-teil="markiert-liste"]') as HTMLElement;
    expect(within(liste).getAllByRole("listitem")).toHaveLength(2);
    expect(liste.textContent).toContain(LANG.id);
    expect(liste.textContent).toContain((LANG.frage ?? "").slice(0, 80));
    expect(liste.textContent).not.toContain((LANG.frage ?? "").slice(0, 90));
  });

  it("Entfernen schreibt die Markierung heraus; die Kennung öffnet die Frage", async () => {
    const oeffne = vi.fn();
    const { h, aendere, stand } = haken({ [A.id]: 1, [B.id]: 1 });
    render(<Markiert lernstand={h} oeffneFrage={oeffne} />);
    const n = nutzer();
    await n.click(screen.getByRole("button", { name: `Markierung ${A.id} entfernen` }));
    expect(aendere.mock.calls[0]![0](stand).markiert).toEqual({ [B.id]: 1 });
    await n.click(screen.getByRole("button", { name: `Frage ${B.id} öffnen` }));
    expect(oeffne).toHaveBeenCalledExactlyOnceWith(B.id);
  });
});

describe("Übungsrunde", () => {
  it("zählt „Markierte Frage n von m“, geht erst nach der Antwort weiter, „Runde beenden“ führt zur Übersicht", async () => {
    const { h } = haken({ [A.id]: 1, [B.id]: 1 });
    render(<Markiert lernstand={h} />);
    const n = nutzer();
    await n.click(screen.getByRole("button", { name: "Markierte üben (2)" }));
    expect(screen.getByText("Markierte Frage 1 von 2")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Nächste markierte Frage" }) as HTMLButtonElement).disabled).toBe(true);
    await n.click(screen.getByRole("button", { name: "Aufgeben" }));
    await n.click(screen.getByRole("button", { name: "Nächste markierte Frage" }));
    expect(screen.getByText("Markierte Frage 2 von 2")).toBeTruthy();
    await n.click(screen.getByRole("button", { name: "Runde beenden" }));
    expect(screen.getByRole("button", { name: "Markierte üben (2)" })).toBeTruthy();
    expect(screen.queryByText(/Markierte Frage \d von/)).toBeNull();
  });

  it("nach der letzten Frage „Fertig“ und „Zur Übersicht“", async () => {
    const { h } = haken({ [A.id]: 1 });
    render(<Markiert lernstand={h} />);
    const n = nutzer();
    await n.click(screen.getByRole("button", { name: "Markierte üben (1)" }));
    await n.click(screen.getByRole("button", { name: "Aufgeben" }));
    await n.click(screen.getByRole("button", { name: "Nächste markierte Frage" }));
    expect(screen.getByText(/Fertig – alle markierten Fragen dieser Runde sind durch/)).toBeTruthy();
    await n.click(screen.getByRole("button", { name: "Zur Übersicht" }));
    expect(screen.getByRole("button", { name: "Markierte üben (1)" })).toBeTruthy();
  });
});

describe("Kennungen ohne Frage", () => {
  it("eine: Einzahl-Knopf; mehrere: Zahl im Knopf; jede Kennung steht da; Klick entfernt alle", async () => {
    const { h, aendere, stand } = haken({ [A.id]: 1, "X00-001": 1 });
    render(<Markiert lernstand={h} />);
    expect(screen.getByText("Ohne Frage im Bestand (1)")).toBeTruthy();
    expect(screen.getByText("X00-001")).toBeTruthy();
    await nutzer().click(screen.getByRole("button", { name: "Diese Kennung entfernen" }));
    expect(aendere.mock.calls[0]![0](stand).markiert).toEqual({ [A.id]: 1 });
    cleanup();
    const zwei = haken({ "X00-001": 1, "X00-002": 1 });
    render(<Markiert lernstand={zwei.h} />);
    expect(screen.getByText("Ohne Frage im Bestand (2)")).toBeTruthy();
    expect(screen.getByText("X00-001")).toBeTruthy();
    expect(screen.getByText("X00-002")).toBeTruthy();
    await nutzer().click(screen.getByRole("button", { name: "Diese 2 Kennungen entfernen" }));
    expect(zwei.aendere.mock.calls[0]![0](zwei.stand).markiert).toEqual({});
  });
});
