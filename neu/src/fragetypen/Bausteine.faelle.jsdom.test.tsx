// @ts-nocheck
// @vitest-environment jsdom
/* beschriftung und baukasten: welcher Baustein gehört an welche Stelle. Antwort: {zielIndex: Text}. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Beschriftung, Baukasten } from "./Bausteine";
import { MischKontext } from "./mischung";

afterEach(cleanup);

/* Der Mischer des laufenden Falls; als Feld einer Konstanten, damit der Kontextwert nicht je Aufruf neu gebaut wirkt. */
const MISCHER: { aktuell: Mischer | null } = { aktuell: null };

function zeige(Komponente, f, props = {}) {
  const aufAntwort = vi.fn();
  const mischer = { reihenfolge: vi.fn((k, n) => Array.from({ length: n }, (_, i) => n - 1 - i)) };
  MISCHER.aktuell = mischer;
  const r = render(
    <MischKontext.Provider value={MISCHER.aktuell}>
      <Komponente frage={f} antwort={undefined} aufAntwort={aufAntwort} gesperrt={false} {...props} />
    </MischKontext.Provider>,
  );
  return { aufAntwort, mischer, ...r };
}
const feld = (name: string) => screen.getByRole("combobox", { name }) as HTMLSelectElement;
const optionen = (name: string) => within(feld(name)).getAllByRole("option").map((o) => o.textContent);

describe("Beschriftung", () => {
  const frage = (extra = {}) => ({
    id: "T-BE", typ: "beschriftung", labels: ["Alpha", "Beta", "Gamma"],
    ziele: [{ nr: 7, loesung: "Alpha" }, { nr: 6, loesung: "Beta" }], ...extra,
  });

  it("je Stelle ein Feld, benannt und nummeriert nach der Nummer der Zeichnung, nicht nach der Position", () => {
    zeige(Beschriftung, frage());
    expect(feld("Stelle 7")).toBeTruthy();
    expect(feld("Stelle 6")).toBeTruthy();
    expect(screen.queryByRole("combobox", { name: "Stelle 1" })).toBeNull();
    expect(screen.getByText("7.")).toBeTruthy();
    expect(screen.getByText("6.")).toBeTruthy();
  });

  it("ohne Nummer zählt die Position ab 1", () => {
    zeige(Beschriftung, frage({ ziele: [{ loesung: "Alpha" }, { loesung: "Beta" }] }));
    expect(feld("Stelle 1")).toBeTruthy();
    expect(feld("Stelle 2")).toBeTruthy();
    expect(screen.getByText("2.")).toBeTruthy();
  });

  it("die Begriffe kommen in der Reihenfolge des Mischers, nach „— wählen —“", () => {
    const { mischer } = zeige(Beschriftung, frage());
    expect(optionen("Stelle 7")).toEqual(["— wählen —", "Gamma", "Beta", "Alpha"]);
    expect(mischer.reihenfolge).toHaveBeenCalledWith("T-BE:labels", 3);
  });

  it("die Felder sind breit (Standardgröße) und leer", () => {
    zeige(Beschriftung, frage());
    expect(feld("Stelle 7").getAttribute("data-size")).toBe("default");
    expect(feld("Stelle 7").value).toBe("");
    expect(feld("Stelle 7").parentElement!.className).toContain("w-full");
  });

  it("eine Wahl meldet {zielIndex: Text}", async () => {
    const { aufAntwort } = zeige(Beschriftung, frage());
    await userEvent.setup().selectOptions(feld("Stelle 6"), "Gamma");
    expect(aufAntwort).toHaveBeenCalledTimes(1);
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ 1: "Gamma" });
  });

  it("andere Stellen behalten ihre Wahl, „— wählen —“ nimmt die Stelle heraus", async () => {
    const { aufAntwort } = zeige(Beschriftung, frage(), { antwort: { 0: "Alpha", 1: "Beta" } });
    await userEvent.setup().selectOptions(feld("Stelle 6"), "Gamma");
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ 0: "Alpha", 1: "Gamma" });
    await userEvent.setup().selectOptions(feld("Stelle 7"), "— wählen —");
    expect(aufAntwort.mock.calls[1][0]).toStrictEqual({ 1: "Beta" });
  });

  it("zeigt den Stand der Antwort", () => {
    zeige(Beschriftung, frage(), { antwort: { 0: "Beta" } });
    expect(feld("Stelle 7").value).toBe("Beta");
    expect(feld("Stelle 6").value).toBe("");
  });

  it("ein anderswo schon vergebener Begriff ist abgeschaltet, der eigene und freie nicht", () => {
    zeige(Beschriftung, frage(), { antwort: { 0: "Alpha" } });
    const aus = (name: string, text: string) =>
      (within(feld(name)).getByRole("option", { name: text }) as HTMLOptionElement).disabled;
    expect(aus("Stelle 6", "Alpha")).toBe(true);
    expect(aus("Stelle 6", "Beta")).toBe(false);
    expect(aus("Stelle 7", "Alpha")).toBe(false);
    expect(aus("Stelle 7", "Beta")).toBe(false);
  });

  it("die Hinweiszeile steht da", () => {
    zeige(Beschriftung, frage());
    expect(screen.getByText("Ordne jeder markierten Stelle den passenden Begriff zu. Nicht jeder Begriff kommt vor.")).toBeTruthy();
  });

  it("nach dem Prüfen: Felder gesperrt, Lösung nummeriert im Kasten – vorher nicht", () => {
    zeige(Beschriftung, frage());
    expect(feld("Stelle 7").disabled).toBe(false);
    expect(screen.queryByText("Richtig wäre")).toBeNull();
    cleanup();
    zeige(Beschriftung, frage(), { gesperrt: true });
    expect(feld("Stelle 7").disabled).toBe(true);
    expect(screen.getByText("7. Alpha · 6. Beta")).toBeTruthy();
  });

  it("labels und ziele, die keine Listen sind, ergeben eine leere Aufgabe", () => {
    zeige(Beschriftung, frage({ labels: "x", ziele: 3 }));
    expect(screen.queryAllByRole("combobox")).toHaveLength(0);
  });
});

describe("Baukasten", () => {
  const frage = (extra = {}) => ({
    id: "T-BK", typ: "baukasten", bausteine: ["wenn", "dann", "sonst"],
    geruest: ["[2] x > 0", "  tue y", "[1] z"],
    ziele: [{ nr: 1, loesung: "wenn" }, { nr: 2, loesung: "sonst" }], ...extra,
  });

  it("die Felder stehen im Gerüst an den Marken, benannt nach der Nummer", () => {
    const { container } = zeige(Baukasten, frage());
    expect(feld("Lücke 1")).toBeTruthy();
    expect(feld("Lücke 2")).toBeTruthy();
    const zeilen = [...container.querySelectorAll("div.font-mono")];
    expect(zeilen).toHaveLength(3);
    expect(within(zeilen[0]).getByRole("combobox", { name: "Lücke 2" })).toBeTruthy();
    expect(zeilen[0].textContent).toContain(" x > 0");
    expect(zeilen[1].textContent).toBe("  tue y");
    expect(within(zeilen[2]).getByRole("combobox", { name: "Lücke 1" })).toBeTruthy();
  });

  it("die Felder sind schmal (klein), die Bausteine kommen in der Mischer-Reihenfolge", () => {
    const { mischer } = zeige(Baukasten, frage());
    expect(feld("Lücke 1").getAttribute("data-size")).toBe("sm");
    expect(feld("Lücke 1").parentElement!.className).not.toContain("w-full");
    expect(optionen("Lücke 1")).toEqual(["— wählen —", "sonst", "dann", "wenn"]);
    expect(mischer.reihenfolge).toHaveBeenCalledWith("T-BK:bausteine", 3);
  });

  it("die Wahl wird unter der Stelle im ziele-Feld gemeldet, nicht unter der Nummer", async () => {
    const f = frage({ ziele: [{ nr: 2, loesung: "sonst" }, { nr: 1, loesung: "wenn" }] });
    const { aufAntwort } = zeige(Baukasten, f);
    await userEvent.setup().selectOptions(feld("Lücke 1"), "dann");
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ 1: "dann" });
    await userEvent.setup().selectOptions(feld("Lücke 2"), "wenn");
    expect(aufAntwort.mock.calls[1][0]).toStrictEqual({ 0: "wenn" });
  });

  it("ohne Nummern zählen die Positionen ab 1", async () => {
    const f = frage({ ziele: [{ loesung: "wenn" }, { loesung: "sonst" }] });
    const { aufAntwort } = zeige(Baukasten, f);
    await userEvent.setup().selectOptions(feld("Lücke 2"), "dann");
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ 1: "dann" });
  });

  it("zeigt den Stand, behält andere Lücken, nimmt bei „— wählen —“ heraus", async () => {
    const { aufAntwort } = zeige(Baukasten, frage(), { antwort: { 0: "wenn", 1: "dann" } });
    expect(feld("Lücke 1").value).toBe("wenn");
    expect(feld("Lücke 2").value).toBe("dann");
    await userEvent.setup().selectOptions(feld("Lücke 2"), "sonst");
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ 0: "wenn", 1: "sonst" });
    await userEvent.setup().selectOptions(feld("Lücke 1"), "— wählen —");
    expect(aufAntwort.mock.calls[1][0]).toStrictEqual({ 1: "dann" });
  });

  it("ein vergebener Baustein ist in der anderen Lücke abgeschaltet", () => {
    zeige(Baukasten, frage(), { antwort: { 0: "wenn" } });
    const aus = (name: string, text: string) =>
      (within(feld(name)).getByRole("option", { name: text }) as HTMLOptionElement).disabled;
    expect(aus("Lücke 2", "wenn")).toBe(true);
    expect(aus("Lücke 1", "wenn")).toBe(false);
    expect(aus("Lücke 2", "dann")).toBe(false);
  });

  it("Feldzugriffe im Gerüst bleiben Text und werden keine Felder", () => {
    const f = frage({ geruest: ["werte[0] = [1]"], ziele: [{ nr: 1, loesung: "wenn" }] });
    const { container } = zeige(Baukasten, f);
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
    expect(container.querySelector("div.font-mono")!.textContent).toContain("werte[0] = ");
  });

  it("nach dem Prüfen: gesperrt, Lösung im Kasten – vorher nicht", () => {
    zeige(Baukasten, frage());
    expect(feld("Lücke 1").disabled).toBe(false);
    expect(screen.queryByText("Richtig wäre")).toBeNull();
    cleanup();
    zeige(Baukasten, frage(), { gesperrt: true });
    expect(feld("Lücke 1").disabled).toBe(true);
    expect(screen.getByText("1. wenn · 2. sonst")).toBeTruthy();
  });

  it("die Anleitung steht da; bausteine, geruest und ziele, die keine Listen sind, ergeben nichts", () => {
    zeige(Baukasten, frage({ bausteine: 1, geruest: "x", ziele: null }));
    expect(screen.getByText("Setz die passenden Bausteine in die Lücken.")).toBeTruthy();
    expect(screen.queryAllByRole("combobox")).toHaveLength(0);
  });
});
