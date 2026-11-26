// @vitest-environment jsdom
/* RechenGenerator direkt gerendert: Zufällig-Knopf, Prüfknopf nur mit Eingabe, Buchung nur beim Prüfen/Aufgeben. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StandHaken } from "@/huelle/useLernstand";
import { leererStand } from "@/kern/stand";
import { arten, artName } from "@/kern/generator";
import { RechenGenerator } from "./RechenGenerator";

afterEach(cleanup);
function haken(teil: Record<string, unknown> = {}) {
  const aendere = vi.fn();
  const stand = { ...leererStand(), ...teil };
  return { h: { stand, aendere } as unknown as StandHaken, aendere };
}
const leiste = () => within(screen.getByRole("group", { name: "Aufgabenarten" }));
const felder = () => screen.getAllByRole("textbox") as HTMLInputElement[];
const pruefKnopf = () => screen.getByRole("button", { name: "Lösung prüfen" }) as HTMLButtonElement;

async function mitMehrerenFeldern(h: StandHaken) {
  const n = userEvent.setup({ delay: null });
  for (const a of arten(h.stand)) {
    await n.click(leiste().getByRole("button", { name: artName(a) }));
    if (screen.queryAllByRole("textbox").length >= 2) return n;
  }
  throw new Error("keine Art mit zwei Feldern");
}

describe("Zufällig", () => {
  it("der Knopf stellt irgendeine Aufgabe", async () => {
    const { h } = haken();
    expect(arten(h.stand).length).toBeGreaterThan(1);
    render(<RechenGenerator lernstand={h} />);
    expect(screen.queryByText(/Lösung prüfen/)).toBeNull();
    await userEvent.setup({ delay: null }).click(leiste().getByRole("button", { name: "Zufällig" }));
    expect(pruefKnopf()).toBeTruthy();
    expect(screen.queryByText(/Wähle eine Aufgabenart/)).toBeNull();
  });
});

describe("Prüfen", () => {
  it("vor jeder Eingabe ist „Lösung prüfen“ gesperrt; Leerzeichen zählen nicht", async () => {
    const { h } = haken();
    render(<RechenGenerator lernstand={h} />);
    await mitMehrerenFeldern(h);
    expect(pruefKnopf().disabled).toBe(true);
    fireEvent.change(felder()[0]!, { target: { value: "   " } });
    expect(pruefKnopf().disabled).toBe(true);
  });

  it("eine Eingabe in irgendeinem von mehreren Feldern genügt", async () => {
    const { h } = haken();
    render(<RechenGenerator lernstand={h} />);
    await mitMehrerenFeldern(h);
    fireEvent.change(felder()[1]!, { target: { value: "42" } });
    expect(pruefKnopf().disabled).toBe(false);
    fireEvent.change(felder()[1]!, { target: { value: "" } });
    expect(pruefKnopf().disabled).toBe(true);
  });

  it("Prüfen bucht genau einmal, tauscht den Knopf gegen „Neue Aufgabe →“ und sperrt die Felder; Aufgeben bucht auch", async () => {
    const { h, aendere } = haken();
    render(<RechenGenerator lernstand={h} />);
    const n = await mitMehrerenFeldern(h);
    fireEvent.change(felder()[0]!, { target: { value: "x" } });
    await n.click(pruefKnopf());
    expect(aendere).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "Lösung prüfen" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Aufgeben" })).toBeNull();
    expect(felder().every((f) => f.disabled || f.readOnly)).toBe(true);
    await n.click(screen.getByRole("button", { name: "Neue Aufgabe →" }));
    expect(pruefKnopf().disabled).toBe(true);
    expect(aendere).toHaveBeenCalledTimes(1);
    await n.click(screen.getByRole("button", { name: "Aufgeben" }));
    expect(aendere).toHaveBeenCalledTimes(2);
  });
});
