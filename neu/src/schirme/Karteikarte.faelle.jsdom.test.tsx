// @vitest-environment jsdom
/* Karteikarte: Stern, Merkmale (mehrfach, Herkunft), Bild, Typ-Hilfe, Aufklappen der Rückseite nach falscher/richtiger Antwort. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { leererStand, type Lernstand } from "@/kern/stand";
import { typHilfeFuer } from "@/kern/typhilfe";
import type { MerkHaken } from "./Melden";
import { Karteikarte } from "./Karteikarte";

afterEach(cleanup);
const MC = FRAGEN.find((f) => f.typ === "mc" && typeof f.loesungIndex === "number" && (f.optionen?.length ?? 0) > 2 && f.erklaerungLang)! as Frage & { optionen: string[]; loesungIndex: number };
const MEHRFACH = FRAGEN.find((f) => f.typ === "mehrfach")!;
const MIT_SVG = FRAGEN.find((f) => f.typ !== "hotspot" && "svg" in f && typeof f.svg === "string")!;
const MIT_HILFE = FRAGEN.find((f) => typHilfeFuer(f, { typHilfeAus: {} }) !== null && f.typ !== "hotspot")!;
const nutzer = () => userEvent.setup({ delay: null });
function merk(teil: Partial<Lernstand> = {}) {
  const aendere = vi.fn();
  return { m: { stand: { ...leererStand(), abrufAn: false, ...teil }, aendere } as MerkHaken, aendere };
}
const lang = () => document.querySelector('[data-teil="lang"]') as HTMLElement | null;

describe("Stern", () => {
  it("unmarkiert: Aufforderung, nicht gedrückt, Symbol ungefüllt; markiert: Entfernen, gedrückt, gefüllt; Klick schaltet", async () => {
    const { m, aendere } = merk();
    const { rerender } = render(<Karteikarte frage={MC} nummer={1} merk={m} />);
    const aus = screen.getByRole("button", { name: "Zum gezielten Wiederholen markieren" });
    expect(aus.getAttribute("aria-pressed")).toBe("false");
    expect(aus.getAttribute("title")).toBe("Zum gezielten Wiederholen markieren");
    expect(aus.querySelector("svg")!.getAttribute("class")).not.toContain("fill-current");
    expect(aus.querySelector("svg")!.getAttribute("class")).toContain("size-4");
    await nutzer().click(aus);
    expect(aendere.mock.calls[0]![0](m.stand).markiert).toEqual({ [MC.id]: 1 });
    rerender(<Karteikarte frage={MC} nummer={1} merk={{ ...m, stand: { ...m.stand, markiert: { [MC.id]: 1 } } }} />);
    const an = screen.getByRole("button", { name: "Markierung entfernen" });
    expect(an.getAttribute("aria-pressed")).toBe("true");
    expect(an.querySelector("svg")!.getAttribute("class")).toContain("fill-current");
    expect(an.querySelector("svg")!.getAttribute("class")).toContain("size-4");
  });

  it("ohne Lernstand gibt es weder Stern noch Melden", () => {
    render(<Karteikarte frage={MC} nummer={1} />);
    expect(screen.queryByRole("button", { name: /markieren|Markierung/ })).toBeNull();
    expect(screen.queryByText("⚑ Frage melden")).toBeNull();
  });
});

describe("Merkmale", () => {
  it("„mehrere richtig“ nur bei Mehrfachauswahl", () => {
    render(<Karteikarte frage={MEHRFACH} nummer={1} />);
    expect(screen.getByText("mehrere richtig")).toBeTruthy();
    cleanup();
    render(<Karteikarte frage={MC} nummer={1} />);
    expect(screen.queryByText("mehrere richtig")).toBeNull();
  });

  it("Herkunft: Fehler-Deck, Serie, Verlauf je mit eigener Marke, sonst keine", () => {
    const marken = [["fehlerdeck", "Wiederholung (Fehler-Deck)"], ["serie", "mehr zu diesem Thema"], ["verlauf", "aus dem Verlauf — zählt nicht noch einmal"]] as const;
    for (const [h] of marken) {
      render(<Karteikarte frage={MC} nummer={1} herkunft={h} />);
      for (const [h2, t2] of marken) expect(screen.queryByText(t2) !== null, `${h} zeigt ${h2}`).toBe(h === h2);
      cleanup();
    }
    render(<Karteikarte frage={MC} nummer={1} />);
    for (const [, t] of marken) expect(screen.queryByText(t)).toBeNull();
  });

  it("eine Frage mit Zeichnung zeigt sie (als Bild mit Beschriftung), eine ohne nicht", () => {
    expect(MIT_SVG).toBeTruthy();
    render(<Karteikarte frage={MIT_SVG} nummer={1} />);
    expect(document.querySelectorAll('figure[role="img"]').length).toBeGreaterThan(0);
    cleanup();
    render(<Karteikarte frage={MC} nummer={1} />);
    expect(document.querySelectorAll('figure[role="img"]')).toHaveLength(0);
  });
});

describe("Typ-Hilfe", () => {
  it("zeigt „So geht's:“ mit dem Hilfetext; das Häkchen blendet sie aus, Wegnehmen des Häkchens nicht", async () => {
    const { m, aendere } = merk();
    render(<Karteikarte frage={MIT_HILFE} nummer={1} merk={m} />);
    const hilfe = document.querySelector('[data-teil="typ-hilfe"]') as HTMLElement;
    expect(hilfe).toBeTruthy();
    expect(hilfe.getAttribute("role")).toBe("note");
    expect(hilfe.textContent).toContain("So geht's:");
    expect(hilfe.textContent).toContain(typHilfeFuer(MIT_HILFE, { typHilfeAus: {} })!);
    const haken = screen.getByRole("checkbox", { name: "Diese Bedienhilfe nicht mehr zeigen" });
    const n = nutzer();
    await n.click(haken);
    expect(aendere).toHaveBeenCalledTimes(1);
    await n.click(haken);
    expect(aendere).toHaveBeenCalledTimes(1);
  });
});

describe("Rückseite nach dem Prüfen", () => {
  const falsch = MC.loesungIndex === 0 ? 1 : 0;
  async function antworte(index: number) {
    const n = nutzer();
    await n.click(screen.getByRole("radio", { name: MC.optionen[index]! }));
    await n.click(screen.getByRole("button", { name: "Lösung prüfen" }));
  }

  it("nach falscher Antwort ist die ausführliche Erklärung aufgeklappt, nach richtiger zu", async () => {
    render(<Karteikarte frage={MC} nummer={1} buche={vi.fn()} />);
    expect(lang()).toBeNull();
    await antworte(falsch);
    expect(lang()!.getAttribute("data-state")).toBe("open");
    cleanup();
    render(<Karteikarte frage={MC} nummer={1} buche={vi.fn()} />);
    await antworte(MC.loesungIndex);
    expect(lang()!.getAttribute("data-state")).toBe("closed");
  });
});

/* K3-E65 / P7 (Lerner-Meldung 15, 24.11.2026): der Rechner steht bei den Rechen-Typen UND bei jeder Frage mit `rechner: true`. */
describe("Rechner-Klappe", () => {
  const klappe = () => document.querySelector('[data-teil="rechner-klappe"]');
  it("mc ohne Feld: keine Klappe; mit `rechner: true`: Klappe da", () => {
    const { m } = merk();
    render(<Karteikarte frage={MC} nummer={1} merk={m} />);
    expect(klappe()).toBeNull();
    cleanup();
    render(<Karteikarte frage={{ ...MC, rechner: true } as Frage} nummer={1} merk={m} />);
    expect(klappe()).not.toBeNull();
  });
});
