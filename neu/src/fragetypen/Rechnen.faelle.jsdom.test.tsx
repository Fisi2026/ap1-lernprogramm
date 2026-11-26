// @ts-nocheck
// @vitest-environment jsdom
/* rechenassistent und kalkulation: Felder, Antwortform und Lösungsanzeige. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Rechenassistent, Kalkulation } from "./Rechnen";

afterEach(cleanup);

function zeige(Komponente, f, props = {}) {
  const aufAntwort = vi.fn();
  const r = render(<Komponente frage={f} antwort={undefined} aufAntwort={aufAntwort} gesperrt={false} {...props} />);
  return { aufAntwort, ...r };
}
const tippe = (feld, wert) => fireEvent.change(feld, { target: { value: wert } });

describe("Rechenassistent", () => {
  const SCHRITTE = [
    { text: "Summe", einheit: "€", wert: 5, loesung: ["5", "5,0"] },
    { text: "Anteil", wert: 2, loesung: ["2"] },
    { text: "Rest", formel: "s1-s2", wert: 3 },
  ];
  const frage = (schritte = SCHRITTE) => ({ id: "T-RA", typ: "rechenassistent", schritte });
  const feld = (name: string) => screen.getByRole("textbox", { name }) as HTMLInputElement;

  it("je Schritt ein Feld, benannt mit Text und Einheit; die Einheit steht am Feld", () => {
    zeige(Rechenassistent, frage());
    expect(feld("Schritt 1: Summe (€)")).toBeTruthy();
    expect(feld("Schritt 2: Anteil")).toBeTruthy();
    expect(feld("Schritt 3: Rest")).toBeTruthy();
    expect(screen.getAllByText("€").length).toBeGreaterThan(0);
    expect(screen.getByText("1.")).toBeTruthy();
    expect(screen.getByText("3.")).toBeTruthy();
  });

  it("die Felder sind Zahlenfelder für die Handytastatur, aus Autovervollständigung und Rechtschreibprüfung", () => {
    zeige(Rechenassistent, frage());
    for (const n of ["Schritt 1: Summe (€)", "Schritt 2: Anteil"]) {
      expect(feld(n).getAttribute("inputmode")).toBe("decimal");
      expect(feld(n).getAttribute("autocomplete")).toBe("off");
      expect(feld(n).getAttribute("spellcheck")).toBe("false");
      expect(feld(n).type).toBe("text");
    }
  });

  it("die Hinweiszeile steht da", () => {
    zeige(Rechenassistent, frage());
    expect(screen.getByText("Rechne Schritt für Schritt. Punkt oder Komma ist egal.")).toBeTruthy();
  });

  it("Tippen meldet ein Feld je Schritt, in der Reihenfolge der Schritte", () => {
    const { aufAntwort } = zeige(Rechenassistent, frage());
    tippe(feld("Schritt 2: Anteil"), "2,5");
    expect(aufAntwort).toHaveBeenCalledTimes(1);
    expect(aufAntwort.mock.calls[0][0]).toEqual(["", "2,5", ""]);
  });

  it("andere Schritte behalten ihren Text – mit und ohne Einheit", () => {
    const { aufAntwort } = zeige(Rechenassistent, frage(), { antwort: ["1", "2", "3"] });
    tippe(feld("Schritt 1: Summe (€)"), "10");
    expect(aufAntwort.mock.calls[0][0]).toEqual(["10", "2", "3"]);
    tippe(feld("Schritt 2: Anteil"), "20");
    expect(aufAntwort.mock.calls[1][0]).toEqual(["1", "20", "3"]);
  });

  it("zeigt den Stand der Antwort; eine unbrauchbare Antwort gilt als leer", () => {
    zeige(Rechenassistent, frage(), { antwort: ["7", "8", "9"] });
    expect(feld("Schritt 1: Summe (€)").value).toBe("7");
    expect(feld("Schritt 3: Rest").value).toBe("9");
    cleanup();
    zeige(Rechenassistent, frage(), { antwort: [1, 2, 3] });
    expect(feld("Schritt 1: Summe (€)").value).toBe("");
  });

  it("eine Aufgabe mit Formel ohne Wert ist nicht gestellt worden und sagt das laut", () => {
    zeige(Rechenassistent, frage([{ text: "Rest", formel: "s1-s2" }]));
    expect(screen.getByText(/nicht gestellt, sondern roh durchgereicht/)).toBeTruthy();
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getByText("L.instanziiere")).toBeTruthy();
  });

  it("schon ein roher Schritt unter gestellten genügt für die Meldung", () => {
    zeige(Rechenassistent, frage([{ text: "A", wert: 1 }, { text: "B", formel: "x" }]));
    expect(screen.getByText(/roh durchgereicht/)).toBeTruthy();
  });

  it("eine Formel mit Wert ist in Ordnung, ein Wert ohne Formel ebenfalls", () => {
    zeige(Rechenassistent, frage([{ text: "A", formel: "x", wert: 0 }, { text: "B" }]));
    expect(screen.queryByText(/roh durchgereicht/)).toBeNull();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  it("Schritte, die keine Schritte sind, ergeben keine Felder", () => {
    zeige(Rechenassistent, frage([{ text: 5 }]));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    cleanup();
    zeige(Rechenassistent, frage("x"));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });

  it("ein Schritt mit falsch getyptem Zusatzfeld macht die ganze Liste unbrauchbar", () => {
    for (const kaputt of [{ einheit: 3 }, { formel: 3 }, { wert: "3" }, { loesung: "3" }, { loesung: [3] }]) {
      zeige(Rechenassistent, frage([{ text: "A", wert: 1 }, { text: "B", wert: 2, ...kaputt }]));
      expect(screen.queryAllByRole("textbox")).toHaveLength(0);
      cleanup();
    }
  });

  it("nach dem Prüfen: gesperrt, je Schritt die erste Lösung bzw. der Wert – vorher nicht", () => {
    zeige(Rechenassistent, frage());
    expect(screen.queryByText(/richtig:/)).toBeNull();
    expect(feld("Schritt 1: Summe (€)").disabled).toBe(false);
    cleanup();
    zeige(Rechenassistent, frage([...SCHRITTE.slice(0, 2), { text: "Rest", wert: 3 }, { text: "Leer", loesung: [] }]),
      { gesperrt: true });
    expect(feld("Schritt 1: Summe (€)").disabled).toBe(true);
    expect(feld("Schritt 2: Anteil").disabled).toBe(true);
    expect(screen.getByText("richtig: 5")).toBeTruthy();
    expect(screen.getByText("richtig: 2")).toBeTruthy();
    expect(screen.getByText("richtig: 3")).toBeTruthy();
  });

  it("ein Schritt ganz ohne Lösung und Wert zeigt „richtig: “ leer", () => {
    zeige(Rechenassistent, frage([{ text: "A" }]), { gesperrt: true });
    expect(screen.getByText(/^richtig:/).textContent).toBe("richtig: ");
  });
});

describe("Kalkulation", () => {
  const frage = (extra = {}) => ({
    id: "T-KA", typ: "kalkulation", kopf: ["Posten", "Betrag"],
    zeilen: [
      [{ v: "Miete" }, { loesung: ["100"] }],
      [{ v: "Strom" }, { loesung: ["20", "20,0"] }],
    ],
    ...extra,
  });
  const feld = (name: string) => screen.getByRole("textbox", { name }) as HTMLInputElement;

  it("Kopf als Spaltenüberschriften, feste Werte als Text, nur Lösungszellen als Felder", () => {
    zeige(Kalkulation, frage());
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Posten", "Betrag"]);
    expect(screen.getByText("Miete")).toBeTruthy();
    expect(screen.getByText("Strom")).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(feld("Betrag, Zelle 1")).toBeTruthy();
    expect(feld("Betrag, Zelle 2")).toBeTruthy();
  });

  it("die Felder sind Zahlenfelder", () => {
    zeige(Kalkulation, frage());
    const f = feld("Betrag, Zelle 1");
    expect(f.getAttribute("inputmode")).toBe("decimal");
    expect(f.getAttribute("autocomplete")).toBe("off");
    expect(f.getAttribute("spellcheck")).toBe("false");
  });

  it("die Hinweiszeile steht da", () => {
    zeige(Kalkulation, frage());
    expect(screen.getByText("Füll die leeren Zellen aus. Die vorgegebenen Werte bleiben stehen.")).toBeTruthy();
  });

  it("Tippen meldet {\"zeile,spalte\": Text} und behält die übrigen Zellen", () => {
    const { aufAntwort } = zeige(Kalkulation, frage());
    tippe(feld("Betrag, Zelle 2"), "21");
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ "1,1": "21" });
    cleanup();
    const z = zeige(Kalkulation, frage(), { antwort: { "0,1": "100" } });
    tippe(feld("Betrag, Zelle 2"), "21");
    expect(z.aufAntwort.mock.calls[0][0]).toStrictEqual({ "0,1": "100", "1,1": "21" });
  });

  it("zeigt den Stand der Antwort; eine unbrauchbare Antwort gilt als leer", () => {
    zeige(Kalkulation, frage(), { antwort: { "0,1": "100" } });
    expect(feld("Betrag, Zelle 1").value).toBe("100");
    expect(feld("Betrag, Zelle 2").value).toBe("");
    cleanup();
    zeige(Kalkulation, frage(), { antwort: { "0,1": 100 } });
    expect(feld("Betrag, Zelle 1").value).toBe("");
  });

  it("fehlt die Überschrift einer Spalte, heißt das Feld nach der Spalte", () => {
    zeige(Kalkulation, frage({ kopf: ["Posten"] }));
    expect(feld("Spalte 2, Zelle 1")).toBeTruthy();
  });

  it("eine Zelle mit leerer Lösungsliste ist trotzdem ein Feld", () => {
    zeige(Kalkulation, frage({ zeilen: [[{ loesung: [] }]], kopf: ["A"] }));
    expect(feld("A, Zelle 1")).toBeTruthy();
  });

  it("Kopf und Zeilen, die keine Listen sind, ergeben eine leere Tabelle", () => {
    zeige(Kalkulation, frage({ kopf: 3, zeilen: "x" }));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.queryAllByRole("columnheader")).toHaveLength(0);
  });

  it("Zeilen mit unbrauchbaren Zellen ergeben keine Felder", () => {
    zeige(Kalkulation, frage({ zeilen: [[{ v: 3 }, { loesung: "x" }]] }));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });

  it("nach dem Prüfen: gesperrt, richtige Werte mit Spaltenname und Zeilennummer – vorher nicht", () => {
    zeige(Kalkulation, frage());
    expect(screen.queryByText("Richtige Werte")).toBeNull();
    cleanup();
    zeige(Kalkulation, frage(), { gesperrt: true });
    expect(feld("Betrag, Zelle 1").disabled).toBe(true);
    expect(screen.getByText("Richtige Werte")).toBeTruthy();
    expect(screen.getByText("Betrag 1: 100 · Betrag 2: 20")).toBeTruthy();
  });

  it("die richtigen Werte sind mit zwei Leerzeichen um den Mittelpunkt getrennt", () => {
    const { container } = zeige(Kalkulation, frage(), { gesperrt: true });
    expect(container.querySelector("span.font-mono.text-foreground")!.textContent).toBe("Betrag 1: 100  ·  Betrag 2: 20");
  });
});
