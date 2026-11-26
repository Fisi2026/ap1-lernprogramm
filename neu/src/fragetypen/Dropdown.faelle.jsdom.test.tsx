// @ts-nocheck
// @vitest-environment jsdom
/* dropdown: je Lücke eine Auswahl. Der Mischer wird vorgegeben, damit die Anordnung bekannt ist. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "./Dropdown";
import { MischKontext } from "./mischung";

afterEach(cleanup);

/* Der Mischer des laufenden Falls; als Feld einer Konstanten, damit der Kontextwert nicht je Aufruf neu gebaut wirkt. */
const MISCHER: { aktuell: Mischer | null } = { aktuell: null };

const LUECKEN = [
  { optionen: ["a", "b", "c"], loesung: 1, text: "Erste" },
  { optionen: ["10", "2", "3"], loesung: 0 },
];
const frage = (extra = {}) => ({ id: "T-DD", typ: "dropdown", luecken: LUECKEN, ...extra });

function zeige(props = {}, f = frage()) {
  const aufAntwort = vi.fn();
  const mischer = { reihenfolge: vi.fn((k, n) => Array.from({ length: n }, (_, i) => n - 1 - i)) };
  MISCHER.aktuell = mischer;
  const r = render(
    <MischKontext.Provider value={MISCHER.aktuell}>
      <Dropdown frage={f} antwort={undefined} aufAntwort={aufAntwort} gesperrt={false} {...props} />
    </MischKontext.Provider>,
  );
  return { aufAntwort, mischer, ...r };
}
const feld = (n: number) => screen.getByRole("combobox", { name: `Lücke ${n}` }) as HTMLSelectElement;
const optionen = (n: number) => within(feld(n)).getAllByRole("option").map((o) => [o.textContent, o.getAttribute("value")]);

describe("Dropdown – Anzeige", () => {
  it("jede Lücke hat ein Feld mit Aufforderung, die Optionen kommen in der Mischer-Reihenfolge mit ihrem Ursprungs-Index als Wert", () => {
    const { mischer } = zeige();
    expect(optionen(1)).toEqual([["— bitte wählen —", ""], ["c", "2"], ["b", "1"], ["a", "0"]]);
    expect(mischer.reihenfolge).toHaveBeenCalledWith("T-DD:luecke0", 3);
    expect(feld(1).value).toBe("");
  });

  it("eine Liste nur aus Zahlen steht aufsteigend nach Wert und wird nicht gemischt", () => {
    const { mischer } = zeige();
    expect(optionen(2)).toEqual([["— bitte wählen —", ""], ["2", "1"], ["3", "2"], ["10", "0"]]);
    expect(mischer.reihenfolge).not.toHaveBeenCalledWith("T-DD:luecke1", 3);
  });

  it("die Beschriftung ist der Text der Lücke, sonst „Lücke n“, und gehört zum Feld", () => {
    zeige();
    expect(screen.getByLabelText("Erste")).toBe(feld(1));
    expect(screen.getByText("Lücke 2", { selector: "label" })).toBeTruthy();
    expect(screen.getByLabelText("Lücke 2", { selector: "select" })).toBe(feld(2));
  });

  it("die Felder haben verschiedene Kennungen", () => {
    zeige();
    expect(feld(1).id).not.toBe(feld(2).id);
    expect(feld(1).id).toMatch(/-0$/);
    expect(feld(2).id).toMatch(/-1$/);
  });

  it("zeigt den Stand der Antwort, auch die erste Option (Index 0)", () => {
    zeige({ antwort: [0, 2] });
    expect(feld(1).value).toBe("0");
    expect(feld(2).value).toBe("2");
  });

  it("eine unbrauchbare Antwort gilt als keine Wahl", () => {
    zeige({ antwort: ["x", 1] });
    expect(feld(1).value).toBe("");
    expect(feld(2).value).toBe("");
  });

  it("ein leeres Feld ist gedämpft, ein gewähltes nicht", () => {
    zeige({ antwort: [1, null] });
    expect(feld(1).parentElement!.className).not.toContain("text-muted-foreground");
    expect(feld(2).parentElement!.className).toContain("text-muted-foreground");
  });

  it("luecken, die keine Liste sind, ergeben keine Felder", () => {
    zeige({}, frage({ luecken: "x" }));
    expect(screen.queryAllByRole("combobox")).toHaveLength(0);
  });
});

describe("Dropdown – Bedienung", () => {
  it("eine Wahl meldet je Lücke den Options-Index, als Zahl", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().selectOptions(feld(1), "b");
    expect(aufAntwort).toHaveBeenCalledTimes(1);
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual([1, null]);
  });

  it("die Option mit Index 0 wird als 0 gemeldet, nicht als leer", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().selectOptions(feld(1), "a");
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual([0, null]);
  });

  it("andere Lücken behalten ihre Wahl", async () => {
    const { aufAntwort } = zeige({ antwort: [2, 1] });
    await userEvent.setup().selectOptions(feld(2), "10");
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual([2, 0]);
  });

  it("zurück auf „— bitte wählen —“ meldet null", async () => {
    const { aufAntwort } = zeige({ antwort: [2, 1] });
    await userEvent.setup().selectOptions(feld(1), "— bitte wählen —");
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual([null, 1]);
  });
});

describe("Dropdown – nach dem Prüfen", () => {
  it("die Felder sind gesperrt, vorher nicht", () => {
    zeige({ gesperrt: true });
    expect(feld(1).disabled).toBe(true);
    expect(feld(2).disabled).toBe(true);
    cleanup();
    zeige();
    expect(feld(1).disabled).toBe(false);
  });

  it("vorher ist keine Lösung zu sehen", () => {
    zeige();
    expect(screen.queryByText("Richtig wäre")).toBeNull();
  });

  it("der Kasten nennt bei mehreren Lücken jede mit Nummer", () => {
    zeige({ gesperrt: true });
    expect(screen.getByText("Lücke 1: b · Lücke 2: 10")).toBeTruthy();
  });

  it("bei einer einzigen Lücke steht nur die Lösung da", () => {
    zeige({ gesperrt: true }, frage({ luecken: [{ optionen: ["x", "y"], loesung: 1 }] }));
    expect(screen.getByText("y", { selector: "span" })).toBeTruthy();
  });

  it("eine Lösung außerhalb der Optionen wird als Strich gezeigt", () => {
    zeige({ gesperrt: true }, frage({ luecken: [{ optionen: ["x"], loesung: 5 }] }));
    expect(screen.getByText("–")).toBeTruthy();
  });
});
