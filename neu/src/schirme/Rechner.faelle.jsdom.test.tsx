// @vitest-environment jsdom
/* Rechner: Meldungsfarbe, Tastatur (Zeichen, Umschalttasten, behandelte/unbehandelte Tasten), Tastenbeschriftung, Klappe. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Rechner, RechnerKlappe } from "./Rechner";
import type { MerkHaken } from "./Melden";
import { leererStand } from "@/kern/stand";
import { TASTEN } from "@/kern/rechnertasten";

afterEach(cleanup);
const anzeige = () => (screen.getByLabelText("Rechner-Eingabe") as HTMLInputElement).value;
const meldung = () => document.querySelector('[data-teil="rechner-meldung"]') as HTMLElement;
const nutzer = () => userEvent.setup({ delay: null });
const taste = (name: string) => screen.getByRole("button", { name });
const rahmen = () => screen.getByLabelText("Rechner-Eingabe");
/** true, wenn die Taste NICHT abgefangen (preventDefault) wurde. */
const druecke = (key: string, mehr: Record<string, unknown> = {}) => fireEvent.keyDown(rahmen(), { key, ...mehr });

describe("Meldung", () => {
  it("anfangs leer und in Zurückhaltungsfarbe; Ergebnis „= …“ ebenfalls; Fehler rot; danach wieder normal", async () => {
    render(<Rechner />);
    const n = nutzer();
    expect(meldung().textContent).toBe("");
    expect(meldung().className).toContain("text-muted-foreground");
    expect(meldung().className).not.toContain("text-destructive");
    await n.click(taste("1")); await n.click(taste("plus")); await n.click(taste("2")); await n.click(taste("gleich"));
    expect(meldung().textContent).toBe("= 3");
    expect(anzeige()).toBe("3");
    expect(meldung().className).toContain("text-muted-foreground");
    await n.click(taste("Alles löschen"));
    await n.click(taste("("));
    await n.click(taste("gleich"));
    expect(meldung().textContent).not.toBe("");
    expect(meldung().className).toContain("text-destructive");
    expect(meldung().className).not.toContain("text-muted-foreground");
    expect(anzeige()).toBe("(");
    await n.click(taste("Alles löschen"));
    expect(meldung().textContent).toBe("");
    expect(meldung().className).toContain("text-muted-foreground");
    expect(anzeige()).toBe("");
  });

  it("Speicher addieren: Fehler rot, Erfolg „Im Speicher: …“ normal; Speicher löschen meldet; abrufen fügt ein", async () => {
    render(<Rechner />);
    const n = nutzer();
    await n.click(taste("("));
    await n.click(taste("Speicher addieren"));
    expect(meldung().className).toContain("text-destructive");
    await n.click(taste("Alles löschen"));
    await n.click(taste("5")); await n.click(taste("Speicher addieren"));
    expect(meldung().textContent).toBe("Im Speicher: 5");
    expect(meldung().className).toContain("text-muted-foreground");
    await n.click(taste("Alles löschen"));
    await n.click(taste("Speicher abrufen"));
    expect(anzeige()).toBe("5");
    await n.click(taste("Speicher löschen"));
    expect(meldung().textContent).toBe("Speicher gelöscht");
    await n.click(taste("Alles löschen"));
    await n.click(taste("Speicher abrufen"));
    expect(anzeige()).toBe("0");
  });
});

describe("Tastatur", () => {
  it("Ziffern 0 und 9 und die Rechenzeichen werden eingefügt und die Taste abgefangen", () => {
    render(<Rechner />);
    for (const k of ["0", "5", "9"]) expect(druecke(k), k).toBe(false);
    expect(anzeige()).toBe("059");
    for (const [k, z] of [["+", "+"], ["-", "−"], ["*", "×"], ["/", "÷"], [".", ","]] as const) {
      expect(druecke(k), k).toBe(false);
      expect(anzeige().endsWith(z), k).toBe(true);
    }
  });

  it("mit Strg, Meta oder Alt (jede einzeln) passiert nichts und die Taste bleibt unabgefangen", () => {
    render(<Rechner />);
    for (const mod of ["ctrlKey", "metaKey", "altKey"]) {
      expect(druecke("1", { [mod]: true }), mod).toBe(true);
      expect(druecke("Enter", { [mod]: true }), mod).toBe(true);
    }
    expect(anzeige()).toBe("");
  });

  it("andere Tasten ändern nichts und werden nicht abgefangen – auch mehrstellige Namen zwischen 0 und 9 nicht", () => {
    render(<Rechner />);
    fireEvent.change(rahmen(), { target: { value: "x" } });
    for (const k of ["a", "Tab", "F5", "00", "1a", "ä", ":", "Shift"]) expect(druecke(k), k).toBe(true);
    expect(anzeige()).toBe("");
  });

  it("Rücktaste nimmt zurück (Funktion als Ganzes), Escape löscht, Enter und = rechnen", () => {
    render(<Rechner />);
    druecke("1"); druecke("2");
    druecke("Backspace");
    expect(anzeige()).toBe("1");
    druecke("Escape");
    expect(anzeige()).toBe("");
    druecke("2"); druecke("+"); druecke("2"); druecke("Enter");
    expect(anzeige()).toBe("4");
    druecke("Escape"); druecke("3"); druecke("*"); druecke("3"); druecke("=");
    expect(anzeige()).toBe("9");
    expect(meldung().textContent).toBe("= 9");
    druecke("Backspace");
    expect(anzeige()).toBe("");
  });

  it("Enter auf einer fokussierten Taste löst nicht zusätzlich deren Klick aus (abgefangen)", () => {
    render(<Rechner />);
    expect(fireEvent.keyDown(taste("1"), { key: "Enter" })).toBe(false);
  });
});

describe("Tasten", () => {
  it("Symboltasten tragen Namen als Beschriftung und Hinweis, Zeichentasten nicht; nur „=“ ist die Hauptfarbe", () => {
    render(<Rechner />);
    for (const t of TASTEN) {
      const k = taste(t.name);
      if (t.name === t.zeichen) {
        expect(k.getAttribute("aria-label"), t.zeichen).toBeNull();
        expect(k.getAttribute("title"), t.zeichen).toBeNull();
      } else {
        expect(k.getAttribute("aria-label"), t.zeichen).toBe(t.name);
        expect(k.getAttribute("title"), t.zeichen).toBe(t.name);
      }
      expect(k.getAttribute("data-variant"), t.zeichen).toBe(t.aktion === "gleich" ? "default" : "outline");
    }
  });
});

describe("Klappe", () => {
  it("ohne Merker: startet zu (verborgen), öffnet auf Klick, Pfeil dreht sich nur offen", async () => {
    render(<RechnerKlappe />);
    const inhalt = () => document.querySelector('[data-teil="rechner-klappe"] [data-slot="collapsible-content"]') as HTMLElement;
    const pfeil = () => document.querySelector('[data-teil="rechner-klappe"] svg') as SVGElement;
    expect(inhalt().hidden).toBe(true);
    expect(pfeil().getAttribute("class")).not.toContain("rotate-90");
    await nutzer().click(screen.getByRole("button", { name: "Taschenrechner" }));
    expect(inhalt().hidden).toBe(false);
    expect(pfeil().getAttribute("class")).toContain("rotate-90");
    await nutzer().click(screen.getByRole("button", { name: "Taschenrechner" }));
    expect(inhalt().hidden).toBe(true);
  });

  it("mit Merker gilt der Lernstand und der Klick schreibt dorthin", async () => {
    const aendere = vi.fn();
    const merk: MerkHaken = { stand: { ...leererStand(), panelOffen: { rechner: true } }, aendere };
    render(<RechnerKlappe merk={merk} />);
    expect((document.querySelector('[data-slot="collapsible-content"]') as HTMLElement).hidden).toBe(false);
    await nutzer().click(screen.getByRole("button", { name: "Taschenrechner" }));
    expect(aendere).toHaveBeenCalledTimes(1);
    expect(aendere.mock.calls[0]![0](merk.stand).panelOffen).toEqual({});
  });
});
