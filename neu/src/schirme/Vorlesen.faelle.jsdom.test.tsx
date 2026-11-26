// @vitest-environment jsdom
/* Meldung 13: Knopf „Vorlesen“ auf der Karteikarte (Web Speech API, nachgebaut). */
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { Karteikarte } from "./Karteikarte";
import { vorleseTeile, deutscheStimme } from "./vorlesetext";

const MC = FRAGEN.find((f) => f.typ === "mc" && (f.optionen?.length ?? 0) > 2)! as Frage & { optionen: string[] };
const LUECKE = FRAGEN.find((f) => f.typ === "lueckentext")!;
const nutzer = () => userEvent.setup({ delay: null });

class Ansage { text: string; lang = ""; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(t: string) { this.text = t; } }
function sprachausgabe(stimmen: Array<{ lang: string }>) {
  const gesprochen: Ansage[] = [];
  const s = {
    getVoices: () => stimmen,
    speak: vi.fn((a: Ansage) => { gesprochen.push(a); }),
    cancel: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  Object.defineProperty(window, "speechSynthesis", { value: s, configurable: true });
  Object.defineProperty(window, "SpeechSynthesisUtterance", { value: Ansage, configurable: true });
  return { s, gesprochen };
}
function ohneSprachausgabe() {
  delete (window as { speechSynthesis?: unknown }).speechSynthesis;
  delete (window as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance;
}

beforeEach(ohneSprachausgabe);
afterEach(() => { cleanup(); ohneSprachausgabe(); });

describe("vorleseTeile / deutscheStimme (rein)", () => {
  it("Fragetext, dann Antworten mit Buchstaben; Lücken werden genannt; Leeres fällt weg", () => {
    expect(vorleseTeile("Was ist  X?", ["eins", " ", "zwei"])).toEqual(["Was ist X?", "Antwort A: eins", "Antwort C: zwei"]);
    expect(vorleseTeile("A ___ B ___.", [])).toEqual(["A Lücke 1 B Lücke 2 ."]);
    expect(vorleseTeile("", [])).toEqual([]);
  });
  it("deutsche Stimme an lang de / de-DE / de-AT, sonst nicht", () => {
    expect(deutscheStimme([{ lang: "en-US" }])).toBe(false);
    expect(deutscheStimme([{ lang: "en-US" }, { lang: "de-AT" }])).toBe(true);
    expect(deutscheStimme([{ lang: "DE" }])).toBe(true);
    expect(deutscheStimme([])).toBe(false);
  });
});

describe("Knopf auf der Karteikarte", () => {
  it("ohne Sprachausgabe im Browser: kein Knopf", () => {
    render(<Karteikarte frage={MC} nummer={1} />);
    expect(screen.queryByRole("button", { name: "Frage vorlesen" })).toBeNull();
  });
  it("ohne deutsche Stimme: kein Knopf", () => {
    sprachausgabe([{ lang: "en-US" }]);
    render(<Karteikarte frage={MC} nummer={1} />);
    expect(screen.queryByRole("button", { name: "Frage vorlesen" })).toBeNull();
  });
  it("spricht Fragetext und Antworten in der ANGEZEIGTEN Reihenfolge, auf Deutsch", async () => {
    const { gesprochen } = sprachausgabe([{ lang: "de-DE" }]);
    render(<Karteikarte frage={MC} nummer={1} />);
    await nutzer().click(screen.getByRole("button", { name: "Frage vorlesen" }));
    const angezeigt = [...document.querySelectorAll('[aria-label="Antwortmöglichkeiten"] [id$="-t"]')].map((e) => e.textContent ?? "");
    expect(angezeigt).toHaveLength(MC.optionen.length);
    expect(gesprochen.map((a) => a.text)).toEqual(vorleseTeile(MC.frage as string, angezeigt));
    expect(gesprochen.every((a) => a.lang === "de-DE")).toBe(true);
  });
  it("während des Sprechens heißt der Knopf Stopp; Stopp bricht ab; nach dem Ende wieder Vorlesen", async () => {
    const { s, gesprochen } = sprachausgabe([{ lang: "de-DE" }]);
    render(<Karteikarte frage={MC} nummer={1} />);
    const u = nutzer();
    await u.click(screen.getByRole("button", { name: "Frage vorlesen" }));
    const stopp = screen.getByRole("button", { name: "Vorlesen beenden" });
    s.cancel.mockClear();
    await u.click(stopp);
    expect(s.cancel).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Frage vorlesen" })).toBeTruthy();
    await u.click(screen.getByRole("button", { name: "Frage vorlesen" }));
    act(() => { gesprochen.at(-1)!.onend?.(); });
    expect(screen.getByRole("button", { name: "Frage vorlesen" })).toBeTruthy();
  });
  it("Kartenwechsel (Aushängen) beendet das Sprechen", async () => {
    const { s } = sprachausgabe([{ lang: "de-DE" }]);
    const { unmount } = render(<Karteikarte frage={MC} nummer={1} />);
    await nutzer().click(screen.getByRole("button", { name: "Frage vorlesen" }));
    s.cancel.mockClear();
    unmount();
    expect(s.cancel).toHaveBeenCalled();
  });
  it("Lückentext: nur der Fragetext, die Lücken genannt", async () => {
    const { gesprochen } = sprachausgabe([{ lang: "de-DE" }]);
    render(<Karteikarte frage={LUECKE} nummer={1} />);
    await nutzer().click(screen.getByRole("button", { name: "Frage vorlesen" }));
    expect(gesprochen.map((a) => a.text)).toEqual(vorleseTeile(LUECKE.frage as string, []));
    expect(gesprochen[0]!.text).toContain("Lücke 1");
  });
});
