// @vitest-environment jsdom
/* Der Fragetext allein: Begriffe als Knoepfe, Erklaerung per Maus (Hover) und Tipp (Klick), Fokus bleibt,
   Text bleibt vollstaendig; ohne Tooltips oder ohne Text nur einfacher Absatz.
   Die Auswahlregel pruefen kern/glossartip.test.ts und glossartip.jsdom.test.tsx. */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Fragetext } from "./Fragetext";
import { FRAGEN } from "@/daten/laden";
import { tipTreffer } from "@/kern/glossartip";
import type { Frage } from "@/daten/typen";

afterEach(cleanup);

const MIT_BEGRIFF = FRAGEN.find((f) => f.typ === "mc" && tipTreffer(f, true).length > 0)!;
const BEGRIFF = tipTreffer(MIT_BEGRIFF, true)[0]!;
const tip = () => document.querySelector('[data-teil="glossar-tip"]') as HTMLElement | null;
const knopf = () => screen.getByRole("button", { name: `Begriff: ${BEGRIFF.term}` });
const nutzer = () => userEvent.setup({ delay: null });

describe("Fragetext", () => {
  it("Ausgangslage: der Bestand hat eine Frage mit Begriff", () => {
    expect(MIT_BEGRIFF).toBeTruthy();
  });

  it("zeigt den ganzen Text; der Begriff steht als Knopf darin, mit seinem Wortlaut", () => {
    render(<Fragetext frage={MIT_BEGRIFF} tooltips className="eigen" />);
    const absatz = document.querySelector('[data-teil="fragetext"]') as HTMLElement;
    expect(absatz.textContent).toBe(MIT_BEGRIFF.frage);
    expect(absatz.classList.contains("eigen")).toBe(true);
    expect(knopf().textContent!.toLowerCase()).toBe(BEGRIFF.term.toLowerCase());
    expect(tip()).toBeNull();
  });

  it("ohne Tooltips: kein Begriffsknopf, der Text bleibt", () => {
    render(<Fragetext frage={MIT_BEGRIFF} tooltips={false} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(document.querySelector('[data-teil="fragetext"]')!.textContent).toBe(MIT_BEGRIFF.frage);
  });

  it("eine Frage ohne Text (kein String) ergibt einen leeren Absatz statt eines Absturzes", () => {
    const kaputt = { ...MIT_BEGRIFF, frage: 42 } as unknown as Frage;
    render(<Fragetext frage={kaputt} tooltips />);
    expect(document.querySelector('[data-teil="fragetext"]')!.textContent).toBe("");
  });

  it("Maus darueber oeffnet die Erklaerung mit Begriff und Definition, Wegziehen schliesst sie", async () => {
    const n = nutzer();
    render(<Fragetext frage={MIT_BEGRIFF} tooltips />);
    await n.hover(knopf());
    await waitFor(() => expect(tip()).not.toBeNull());
    expect(tip()!.querySelector("b")!.textContent).toBe(BEGRIFF.term);
    expect(tip()!.textContent).toContain(BEGRIFF.def);
    await n.unhover(knopf());
    await waitFor(() => expect(tip()).toBeNull());
  });

  it("Klick (Tippen) oeffnet sie, schliesst sie nicht gleich wieder; Escape schliesst", async () => {
    const n = nutzer();
    render(<Fragetext frage={MIT_BEGRIFF} tooltips />);
    await n.click(knopf());
    await waitFor(() => expect(tip()).not.toBeNull());
    expect(tip()).not.toBeNull();
    await n.keyboard("{Escape}");
    await waitFor(() => expect(tip()).toBeNull());
  });

  it("der Fokus bleibt auf dem Begriff, wenn die Erklaerung aufgeht (kein Sprung in das Fenster)", async () => {
    const n = nutzer();
    render(<Fragetext frage={MIT_BEGRIFF} tooltips />);
    await n.click(knopf());
    await waitFor(() => expect(tip()).not.toBeNull());
    expect(document.activeElement).toBe(knopf());
    expect(tip()!.contains(document.activeElement)).toBe(false);
  });
});
