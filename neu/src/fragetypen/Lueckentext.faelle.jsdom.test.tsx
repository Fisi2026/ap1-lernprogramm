// @ts-nocheck
// @vitest-environment jsdom
/* lueckentext: die Felder stehen im Satz; passt die Zahl nicht, stehen Text und Felder getrennt. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lueckentext } from "./Lueckentext";

afterEach(cleanup);

const frage = (extra = {}) => ({
  id: "T-LT", typ: "lueckentext", frage: "Der ___ ist ___ schnell.",
  luecken: [["Router"], ["sehr", "extrem"]], ...extra,
});

function zeige(props = {}, f = frage()) {
  const aufAntwort = vi.fn();
  const r = render(<Lueckentext frage={f} antwort={undefined} aufAntwort={aufAntwort} gesperrt={false} {...props} />);
  return { aufAntwort, ...r };
}
const feld = (n: number, von = 2) => screen.getByRole("textbox", { name: `Lücke ${n} von ${von}` }) as HTMLInputElement;

describe("Lueckentext – Anzeige", () => {
  it("die Felder stehen im Satz, der Text dazwischen bleibt", () => {
    const { container } = zeige();
    const satz = container.querySelector("p.leading-\\[2\\.2\\]")!;
    expect(satz.textContent).toBe("Der  ist  schnell.");
    expect(satz.querySelectorAll("input")).toHaveLength(2);
    // Reihenfolge im Satz: Feld 1 vor Feld 2
    const felder = [...satz.querySelectorAll("input")];
    expect(felder.map((f) => f.getAttribute("aria-label"))).toEqual(["Lücke 1 von 2", "Lücke 2 von 2"]);
  });

  it("die Hinweiszeile steht da", () => {
    zeige();
    expect(screen.getByText("Fülle die Lücken. Groß- und Kleinschreibung spielt keine Rolle.")).toBeTruthy();
  });

  it("die Felder sind leer, aus, ohne Rechtschreibprüfung und haben verschiedene Kennungen", () => {
    zeige();
    expect(feld(1).value).toBe("");
    expect(feld(1).type).toBe("text");
    expect(feld(1).getAttribute("autocomplete")).toBe("off");
    expect(feld(1).getAttribute("spellcheck")).toBe("false");
    expect(feld(1).id).not.toBe(feld(2).id);
    expect(feld(1).id).toMatch(/-0$/);
    expect(feld(2).id).toMatch(/-1$/);
  });

  it("zeigt den Stand der Antwort", () => {
    zeige({ antwort: ["Router", "sehr"] });
    expect(feld(1).value).toBe("Router");
    expect(feld(2).value).toBe("sehr");
  });

  it("eine unbrauchbare Antwort gilt als leer", () => {
    zeige({ antwort: [1, 2] });
    expect(feld(1).value).toBe("");
  });

  it("die Feldbreite folgt der Länge der ersten Lösung, mindestens 8, höchstens 24", () => {
    const f = frage({
      frage: "___ ___ ___ ___",
      luecken: [["ab"], ["Zehnbuchst."], ["x".repeat(40)], []],
    });
    zeige({}, f);
    const breite = (n: number) => feld(n, 4).size;
    expect(breite(1)).toBe(8);      // 2 + 2 = 4 -> 8
    expect(breite(2)).toBe(13);     // 11 + 2
    expect(breite(3)).toBe(24);     // gedeckelt
    expect(breite(4)).toBe(8);      // keine Lösung
  });

  it("Breite genau an den Grenzen: 6 Zeichen → 8, 22 Zeichen → 24", () => {
    zeige({}, frage({ frage: "___ ___", luecken: [["123456"], ["x".repeat(22)]] }));
    expect(feld(1).size).toBe(8);
    expect(feld(2).size).toBe(24);
  });
});

describe("Lueckentext – Bedienung", () => {
  it("Tippen meldet den Text je Lücke", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().type(feld(2), "s");
    expect(aufAntwort).toHaveBeenCalledTimes(1);
    expect(aufAntwort.mock.calls[0][0]).toEqual(["", "s"]);
  });

  it("andere Lücken behalten ihren Text", () => {
    const { aufAntwort } = zeige({ antwort: ["Router", "se"] });
    fireEvent.change(feld(2), { target: { value: "sehr" } });
    expect(aufAntwort.mock.calls[0][0]).toEqual(["Router", "sehr"]);
    fireEvent.change(feld(1), { target: { value: "Switch" } });
    expect(aufAntwort.mock.calls[1][0]).toEqual(["Switch", "se"]);
  });
});

describe("Lueckentext – Zahl der Platzhalter passt nicht", () => {
  const f = frage({ frage: "Nur ___ ein Platzhalter", luecken: [["a"], ["b"]] });

  it("Text und Felder stehen getrennt: der Fragetext ganz, dann je Lücke eine Zeile", () => {
    zeige({}, f);
    expect(screen.getByText("Nur ___ ein Platzhalter")).toBeTruthy();
    expect(screen.getByText("Lücke 1")).toBeTruthy();
    expect(screen.getByText("Lücke 2")).toBeTruthy();
    expect(feld(1)).toBeTruthy();
    expect(feld(2)).toBeTruthy();
  });

  it("die Felder bleiben bedienbar", () => {
    const { aufAntwort } = zeige({}, f);
    fireEvent.change(feld(1), { target: { value: "x" } });
    expect(aufAntwort.mock.calls[0][0]).toEqual(["x", ""]);
  });

  it("ein Fragetext, der kein Text ist, ergibt keinen Absturz", () => {
    zeige({}, frage({ frage: 5, luecken: [["a"]] }));
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("luecken, die keine Liste sind, ergeben keine Felder", () => {
    zeige({}, frage({ luecken: "x" }));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });
});

describe("Lueckentext – nach dem Prüfen", () => {
  it("die Felder sind gesperrt, vorher nicht", () => {
    zeige({ gesperrt: true });
    expect(feld(1).disabled).toBe(true);
    expect(feld(2).disabled).toBe(true);
    cleanup();
    zeige();
    expect(feld(1).disabled).toBe(false);
  });

  it("vorher steht keine Lösung da", () => {
    zeige();
    expect(screen.queryByText("Erwartet war")).toBeNull();
  });

  /* K3-E65 / P6 (Lerner-Meldung 11/12, 24.11.2026): nach dem Pruefen ist jede FALSCHE Luecke rot markiert. */
  it("nach dem Prüfen: falsche Lücke rot und aria-invalid, richtige (auch tolerant) nicht", () => {
    zeige({ gesperrt: true, antwort: ["router", "langsam"] });
    expect(feld(1).getAttribute("aria-invalid")).toBeNull();
    expect(feld(1).className.split(/\s+/)).not.toContain("border-destructive");
    expect(feld(2).getAttribute("aria-invalid")).toBe("true");
    expect(feld(2).className.split(/\s+/)).toContain("border-destructive");
  });
  it("vor dem Prüfen ist nichts markiert, auch bei falscher Eingabe", () => {
    zeige({ antwort: ["Switch", "langsam"] });
    expect(feld(1).getAttribute("aria-invalid")).toBeNull();
    expect(feld(2).className.split(/\s+/)).not.toContain("border-destructive");
  });
  it("leere Lücke gilt nach dem Prüfen als falsch", () => {
    zeige({ gesperrt: true, antwort: ["Router", ""] });
    expect(feld(2).getAttribute("aria-invalid")).toBe("true");
  });

  it("der Kasten nennt je Lücke die erste akzeptierte Schreibweise, nummeriert", () => {
    zeige({ gesperrt: true });
    expect(screen.getByText("Erwartet war")).toBeTruthy();
    expect(screen.getByText("1. Router · 2. sehr")).toBeTruthy();
  });
});
