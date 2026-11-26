// @ts-nocheck
// @vitest-environment jsdom
/* matrix: vier Felder, zwei Achsen. Geprüft: was der Lerner sieht und welche Antwortform hinausgeht. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Matrix } from "./Matrix";

afterEach(cleanup);

const QUADRANTEN = ["Planen", "Machen", "Delegieren", "Streichen"];
const ELEMENTE = [
  { text: "Prüfung lernen", quadrant: 0 },
  { text: "Mails sortieren", quadrant: 2 },
  { text: "Serie schauen", quadrant: 3 },
];
const frage = (extra = {}) => ({
  id: "T-MX", typ: "matrix", quadranten: QUADRANTEN, elemente: ELEMENTE,
  xAchse: "Dringlichkeit", yAchse: "Wichtigkeit", ...extra,
});

function zeige(props = {}, f = frage()) {
  const aufAntwort = vi.fn();
  const r = render(<Matrix frage={f} antwort={undefined} aufAntwort={aufAntwort} gesperrt={false} {...props} />);
  return { aufAntwort, ...r };
}
const feld = (n: number) => screen.getByRole("combobox", { name: `Element ${n}` }) as HTMLSelectElement;
/** Das Kästchen der Karte, nicht die Option im Auswahlfeld. */
const kasten = (name: string) => screen.getAllByText(name).find((e) => e.tagName === "DIV")!.parentElement!;

describe("Matrix – Anzeige", () => {
  it("jedes Element hat ein Auswahlfeld, das mit „— wählen —“ beginnt und die vier Felder anbietet", () => {
    zeige();
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
    const optionen = within(feld(1)).getAllByRole("option").map((o) => o.textContent);
    expect(optionen).toEqual(["— wählen —", ...QUADRANTEN]);
    expect(feld(1).value).toBe("");
  });

  it("die Achsen stehen an der Karte, wenn die Frage sie trägt", () => {
    zeige();
    expect(screen.getByText("Dringlichkeit")).toBeTruthy();
    expect(screen.getByText("Wichtigkeit")).toBeTruthy();
  });

  it("ohne Achsenbeschriftung wird die Karte ohne Achsen gezeichnet", () => {
    const { container } = zeige({}, frage({ xAchse: undefined, yAchse: "" }));
    expect(screen.queryByText("Dringlichkeit")).toBeNull();
    expect(container.querySelectorAll(".uppercase")).toHaveLength(0);
  });

  it("nur die vorhandene Achse wird gezeichnet", () => {
    zeige({}, frage({ yAchse: undefined }));
    expect(screen.getByText("Dringlichkeit")).toBeTruthy();
    expect(screen.queryByText("Wichtigkeit")).toBeNull();
  });

  it("eine Achse, die kein Text ist, wird nicht gezeichnet", () => {
    zeige({}, frage({ xAchse: 5, yAchse: 7 }));
    expect(screen.queryByText("5")).toBeNull();
    expect(screen.queryByText("7")).toBeNull();
  });

  it("die Anleitung steht oben", () => {
    zeige();
    expect(screen.getByText("Ordne jedes Element einem der vier Felder zu.")).toBeTruthy();
  });

  it("gewählte Elemente erscheinen im Kästchen ihres gewählten Feldes, sonst nirgends", () => {
    zeige({ antwort: { 0: 1, 1: 1, 2: 0 } });
    expect(within(kasten("Machen")).getByText("Prüfung lernen")).toBeTruthy();
    expect(within(kasten("Machen")).getByText("Mails sortieren")).toBeTruthy();
    expect(within(kasten("Planen")).getByText("Serie schauen")).toBeTruthy();
    expect(within(kasten("Delegieren")).queryByText(/./, { selector: "span" })).toBeNull();
  });

  it("ohne Wahl bleiben die Kästchen leer", () => {
    zeige();
    for (const q of QUADRANTEN) expect(kasten(q).querySelectorAll("span")).toHaveLength(0);
  });

  it("die Auswahlfelder zeigen den Stand der Antwort", () => {
    zeige({ antwort: { 0: 0, 2: 3 } });
    expect(feld(1).value).toBe("0");
    expect(feld(2).value).toBe("");
    expect(feld(3).value).toBe("3");
  });

  it("Feld 0 (oben links) zählt als gewählt und nicht als leer", () => {
    zeige({ antwort: { 1: 0 } });
    expect(feld(2).value).toBe("0");
    expect(within(kasten("Planen")).getByText("Mails sortieren")).toBeTruthy();
  });

  it("eine unbrauchbare Antwort gilt als keine Wahl", () => {
    zeige({ antwort: { 0: "eins" } });
    expect(feld(1).value).toBe("");
  });

  it("Quadranten und Elemente, die keine Listen sind, ergeben eine leere Fläche ohne Absturz", () => {
    zeige({}, frage({ quadranten: "x", elemente: 3 }));
    expect(screen.queryAllByRole("combobox")).toHaveLength(0);
  });
});

describe("Matrix – Bedienung", () => {
  it("eine Wahl meldet {elementIndex: quadrantIndex}", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().selectOptions(feld(2), "Delegieren");
    expect(aufAntwort).toHaveBeenCalledTimes(1);
    expect(aufAntwort).toHaveBeenCalledWith({ 1: 2 });
  });

  it("bisherige Wahlen bleiben erhalten, eine Zahl bleibt eine Zahl", async () => {
    const { aufAntwort } = zeige({ antwort: { 0: 1 } });
    await userEvent.setup().selectOptions(feld(3), "Streichen");
    const gemeldet = aufAntwort.mock.calls[0][0];
    expect(gemeldet).toStrictEqual({ 0: 1, 2: 3 });
    expect(typeof gemeldet[2]).toBe("number");
  });

  it("die Wahl „— wählen —“ nimmt das Element wieder heraus", async () => {
    const { aufAntwort } = zeige({ antwort: { 0: 1, 1: 2 } });
    await userEvent.setup().selectOptions(feld(1), "— wählen —");
    expect(aufAntwort).toHaveBeenCalledWith({ 1: 2 });
  });

  it("das Feld für Quadrant 0 meldet 0, nicht „keine Wahl“", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().selectOptions(feld(1), "Planen");
    expect(aufAntwort).toHaveBeenCalledWith({ 0: 0 });
  });
});

describe("Matrix – nach dem Prüfen", () => {
  it("die Auswahlfelder sind gesperrt", () => {
    zeige({ gesperrt: true });
    for (const f of screen.getAllByRole("combobox")) expect(f.disabled).toBe(true);
  });

  it("vorher sind sie bedienbar und die Lösung steht nicht da", () => {
    zeige();
    for (const f of screen.getAllByRole("combobox")) expect(f.disabled).toBe(false);
    expect(screen.queryByText("Richtig wäre")).toBeNull();
  });

  it("der Kasten nennt jedes Element mit seinem richtigen Feld, mit Mittelpunkt getrennt", () => {
    zeige({ gesperrt: true });
    expect(screen.getByText("Richtig wäre")).toBeTruthy();
    expect(screen.getByText("Prüfung lernen → Planen · Mails sortieren → Delegieren · Serie schauen → Streichen")).toBeTruthy();
  });

  it("falsch oder offen gelassene Elemente sind rot umrandet, richtig gesetzte nicht", () => {
    zeige({ antwort: { 0: 0, 1: 1 }, gesperrt: true });
    const rot = (n: number) => feld(n).parentElement!.className.includes("border-destructive");
    expect(rot(1)).toBe(false);
    expect(rot(2)).toBe(true);
    expect(rot(3)).toBe(true);
  });

  it("vor dem Prüfen ist nichts rot", () => {
    zeige({ antwort: { 0: 3 } });
    for (const f of screen.getAllByRole("combobox")) {
      expect(f.parentElement!.className.includes("border-destructive")).toBe(false);
    }
  });
});
