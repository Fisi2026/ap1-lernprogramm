// @ts-nocheck
// @vitest-environment jsdom
/* reihenfolge: Schritte mit zwei Knöpfen umordnen. Der Mischer wird vorgegeben, damit die Startlage bekannt ist. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Reihenfolge } from "./Reihenfolge";
import { MischKontext } from "./mischung";

afterEach(cleanup);

/* Der Mischer des laufenden Falls; als Feld einer Konstanten, damit der Kontextwert nicht je Aufruf neu gebaut wirkt. */
const MISCHER: { aktuell: Mischer | null } = { aktuell: null };

const frage = (extra = {}) => ({ id: "T-RF", typ: "reihenfolge", schritte: ["Alpha", "Beta", "Gamma"], ...extra });

function zeige(props = {}, f = frage(), reihe = [2, 0, 1]) {
  const aufAntwort = vi.fn();
  const mischer = { reihenfolge: vi.fn(() => reihe) };
  MISCHER.aktuell = mischer;
  const r = render(
    <MischKontext.Provider value={MISCHER.aktuell}>
      <Reihenfolge frage={f} antwort={undefined} aufAntwort={aufAntwort} gesperrt={false} {...props} />
    </MischKontext.Provider>,
  );
  return { aufAntwort, mischer, ...r };
}
const reihenfolge = () => screen.getAllByRole("listitem").map((li) => li.querySelector("span.flex-1")!.textContent);
const nummern = () => screen.getAllByRole("listitem").map((li) => li.querySelector("span[aria-hidden]")!.textContent);
const btn = (name: string) => screen.getByRole("button", { name }) as HTMLButtonElement;

describe("Reihenfolge – Anzeige", () => {
  it("startet in der gemischten Reihenfolge des Mischers, je Schritt mit laufender Nummer", () => {
    const { mischer } = zeige();
    expect(reihenfolge()).toEqual(["Gamma", "Alpha", "Beta"]);
    expect(nummern()).toEqual(["1", "2", "3"]);
    expect(mischer.reihenfolge).toHaveBeenCalledWith("T-RF:schritte", 3);
  });

  it("trifft der Mischer die richtige Ordnung, werden die ersten beiden getauscht", () => {
    zeige({}, frage(), [0, 1, 2]);
    expect(reihenfolge()).toEqual(["Beta", "Alpha", "Gamma"]);
  });

  it("ein einzelner Schritt wird nicht umgestellt", () => {
    zeige({}, frage({ schritte: ["Nur"] }), [0]);
    expect(reihenfolge()).toEqual(["Nur"]);
  });

  it("eine vorhandene Antwort bestimmt die Reihenfolge", () => {
    zeige({ antwort: [1, 2, 0] });
    expect(reihenfolge()).toEqual(["Beta", "Gamma", "Alpha"]);
  });

  it("eine unbrauchbare Antwort fällt auf die Startlage zurück", () => {
    zeige({ antwort: ["a", "b"] });
    expect(reihenfolge()).toEqual(["Gamma", "Alpha", "Beta"]);
  });

  it("die Anleitung steht da", () => {
    zeige();
    expect(screen.getByText("Bring die Schritte in die richtige Reihenfolge.")).toBeTruthy();
  });

  it("schritte, die keine Liste sind, ergeben eine leere Liste", () => {
    zeige({}, frage({ schritte: "x" }), []);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("jede Zeile trägt zwei Knöpfe, benannt nach ihrem Platz", () => {
    zeige({ antwort: [0, 1, 2] });
    const zeilen = screen.getAllByRole("listitem");
    expect(within(zeilen[1]).getByRole("group", { name: "Schritt 2 verschieben" })).toBeTruthy();
    expect(within(zeilen[1]).getByRole("button", { name: "Schritt 2 nach oben" })).toBeTruthy();
    expect(within(zeilen[1]).getByRole("button", { name: "Schritt 2 nach unten" })).toBeTruthy();
  });
});

describe("Reihenfolge – Bedienung", () => {
  it("nach unten tauscht mit dem Nachfolger und meldet die Original-Indizes", async () => {
    const { aufAntwort } = zeige({ antwort: [0, 1, 2] });
    await userEvent.setup().click(btn("Schritt 1 nach unten"));
    expect(aufAntwort).toHaveBeenCalledTimes(1);
    expect(aufAntwort).toHaveBeenCalledWith([1, 0, 2]);
  });

  it("nach oben tauscht mit dem Vorgänger", async () => {
    const { aufAntwort } = zeige({ antwort: [0, 1, 2] });
    await userEvent.setup().click(btn("Schritt 3 nach oben"));
    expect(aufAntwort).toHaveBeenCalledWith([0, 2, 1]);
  });

  it("aus der Startlage heraus wird mit den angezeigten Plätzen getauscht", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().click(btn("Schritt 2 nach unten"));
    expect(aufAntwort).toHaveBeenCalledWith([2, 1, 0]);
  });

  it("der oberste Schritt kann nicht nach oben, der unterste nicht nach unten", async () => {
    const { aufAntwort } = zeige({ antwort: [0, 1, 2] });
    expect(btn("Schritt 1 nach oben").disabled).toBe(true);
    expect(btn("Schritt 3 nach unten").disabled).toBe(true);
    expect(btn("Schritt 1 nach unten").disabled).toBe(false);
    expect(btn("Schritt 3 nach oben").disabled).toBe(false);
    expect(btn("Schritt 2 nach oben").disabled).toBe(false);
    expect(btn("Schritt 2 nach unten").disabled).toBe(false);
    await userEvent.setup().click(btn("Schritt 1 nach oben"));
    expect(aufAntwort).not.toHaveBeenCalled();
  });

  it("die eigene Antwort wird nicht verändert (neue Liste)", async () => {
    const antwort = [0, 1, 2];
    zeige({ antwort });
    await userEvent.setup().click(btn("Schritt 1 nach unten"));
    expect(antwort).toEqual([0, 1, 2]);
  });
});

describe("Reihenfolge – nach dem Prüfen", () => {
  it("alle Knöpfe sind gesperrt", () => {
    zeige({ gesperrt: true, antwort: [0, 1, 2] });
    for (const b of screen.getAllByRole("button")) expect(b.disabled).toBe(true);
  });

  it("vorher ist keine Lösung zu sehen", () => {
    zeige({ antwort: [0, 1, 2] });
    expect(screen.queryByText("Richtig wäre")).toBeNull();
  });

  it("die richtige Ordnung steht nummeriert im Kasten, unabhängig von der Anordnung des Lerners", () => {
    zeige({ gesperrt: true, antwort: [2, 1, 0] });
    expect(screen.getByText("Richtig wäre")).toBeTruthy();
    expect(screen.getByText("1. Alpha · 2. Beta · 3. Gamma")).toBeTruthy();
  });
});

/* Meldung 7 (M04-029, 24.11.2026): Ziehen am Griff, zusaetzlich zu den Knoepfen.
   jsdom kennt kein Layout – jede Zeile bekommt deshalb ein festes Rechteck (Zeile i: 50*i bis 50*i+40). */
function mitLayout() {
  screen.getAllByRole("listitem").forEach((li, i) => {
    li.getBoundingClientRect = () => ({ top: 50 * i, bottom: 50 * i + 40, height: 40, left: 0, right: 300, width: 300, x: 0, y: 50 * i, toJSON() {} });
  });
}
const griffe = () => screen.getAllByRole("listitem").map((li) => li.querySelector("[data-griff]") as HTMLElement);
function ziehe(von: number, nachY: number) {
  const g = griffe()[von]!;
  fireEvent.pointerDown(g, { pointerId: 1, clientY: 50 * von + 20, button: 0 });
  fireEvent.pointerMove(g, { pointerId: 1, clientY: nachY });
  fireEvent.pointerUp(g, { pointerId: 1, clientY: nachY });
}

describe("Reihenfolge – Ziehen am Griff (Meldung 7)", () => {
  it("jede Zeile hat einen Griff, der für Screenreader verborgen ist", () => {
    zeige();
    expect(griffe()).toHaveLength(3);
    griffe().forEach((g) => expect(g.getAttribute("aria-hidden")).toBe("true"));
  });

  it("den ersten Schritt ans Ende ziehen", () => {
    const { aufAntwort } = zeige(); mitLayout();
    ziehe(0, 140);                                   // unter die Mitte der letzten Zeile (100–140)
    expect(aufAntwort).toHaveBeenLastCalledWith([0, 1, 2]);
  });

  it("den letzten Schritt nach oben vor den ersten ziehen", () => {
    const { aufAntwort } = zeige(); mitLayout();
    ziehe(2, 5);
    expect(aufAntwort).toHaveBeenLastCalledWith([1, 2, 0]);
  });

  it("an dieselbe Stelle ziehen ändert nichts", () => {
    const { aufAntwort } = zeige(); mitLayout();
    ziehe(1, 72);
    expect(aufAntwort).not.toHaveBeenCalled();
  });

  it("nach dem Prüfen lässt sich nichts mehr ziehen", () => {
    const { aufAntwort } = zeige({ gesperrt: true }); mitLayout();
    ziehe(0, 140);
    expect(aufAntwort).not.toHaveBeenCalled();
  });

  it("während des Ziehens zeigt eine Linie die Zielstelle", () => {
    zeige(); mitLayout();
    const g = griffe()[0]!;
    fireEvent.pointerDown(g, { pointerId: 1, clientY: 20, button: 0 });
    fireEvent.pointerMove(g, { pointerId: 1, clientY: 140 });
    expect(document.querySelectorAll("[data-ziellinie]")).toHaveLength(1);
    fireEvent.pointerUp(g, { pointerId: 1, clientY: 140 });
    expect(document.querySelectorAll("[data-ziellinie]")).toHaveLength(0);
  });
});
