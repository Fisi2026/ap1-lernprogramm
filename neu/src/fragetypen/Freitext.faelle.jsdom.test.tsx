// @ts-nocheck
// @vitest-environment jsdom
/* freitext und erklaeren: schreiben, Näherung, Musterlösung, Selbsteinschätzung. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Freitext } from "./Freitext";

afterEach(cleanup);

const PFLICHT4 = ["Router", "Switch", "Server", "Kabel"];
const frage = (extra = {}) => ({ id: "T-FT", typ: "freitext", frage: "Erkläre.", ...extra });

function zeige(props = {}, f = frage()) {
  const aufAntwort = vi.fn();
  const r = render(<Freitext frage={f} antwort={undefined} aufAntwort={aufAntwort} gesperrt={false} {...props} />);
  return { aufAntwort, ...r };
}
const knopf = (name: string) => screen.getByRole("button", { name: new RegExp(`^${name}`) });

describe("Freitext – Eingabe", () => {
  it("zeigt ein leeres Feld mit Platzhalter und acht Zeilen", () => {
    zeige();
    const feld = screen.getByRole("textbox", { name: "Deine Antwort" }) as HTMLTextAreaElement;
    expect(feld.value).toBe("");
    expect(feld.rows).toBe(8);
    expect(feld.placeholder).toBe("Schreib auf, was du weißt …");
    expect(screen.getByText("Deine Antwort", { selector: "label" })).toBeTruthy();
  });

  it("bei „erklären“ steht die längere Aufforderung über dem Feld, der Feldname bleibt", () => {
    zeige({}, frage({ typ: "erklaeren" }));
    expect(screen.getByText("Erkläre es in eigenen Worten — vollständige Sätze, keine Stichpunkte.")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Deine Antwort" })).toBeTruthy();
  });

  it("zeigt den bisherigen Text", () => {
    zeige({ antwort: { text: "Hallo" } });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Hallo");
  });

  it("ein Text, der kein Text ist, gilt als leer", () => {
    zeige({ antwort: { text: 5 } });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("");
  });

  it("eine Antwort, die kein Objekt ist, gilt als leer", () => {
    zeige({ antwort: "roh" });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("");
  });

  it("Tippen meldet {text} – ohne Selbsteinschätzung, solange es keine gab", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().type(screen.getByRole("textbox"), "a");
    expect(aufAntwort).toHaveBeenCalledTimes(1);
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ text: "a" });
  });

  it("Tippen behält eine vorhandene Selbsteinschätzung, auch die Mitte (null) und false", () => {
    for (const selbst of [true, false, null]) {
      const { aufAntwort, unmount } = zeige({ antwort: { text: "ab", selbst } });
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "abc" } });
      expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ text: "abc", selbst });
      unmount();
    }
  });

  it("eine ungültige Selbsteinschätzung wird nicht weitergereicht", () => {
    const { aufAntwort } = zeige({ antwort: { text: "ab", selbst: "ja" } });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "abc" } });
    expect(aufAntwort.mock.calls[0][0]).toStrictEqual({ text: "abc" });
  });

  it("vor dem Prüfen steht weder Einschätzung noch Musterlösung da", () => {
    zeige({}, frage({ musterloesung: "Geheim" }));
    expect(screen.queryByText("Musterlösung")).toBeNull();
    expect(screen.queryByText(/Automatische Einschätzung/)).toBeNull();
  });
});

describe("Freitext – nach dem Prüfen", () => {
  const geprueft = (text: string, f: object = {}, extra = {}) =>
    zeige({ gesperrt: true, antwort: { text }, ...extra }, frage({ schluesselbegriffe: { pflicht: PFLICHT4 }, ...f }));

  it("zeigt den Text des Lerners, bei leerer Antwort einen Hinweis", () => {
    geprueft("Der Router und der Switch");
    expect(screen.getByText("Der Router und der Switch")).toBeTruthy();
    cleanup();
    geprueft("");
    expect(screen.getByText("— nichts geschrieben —")).toBeTruthy();
  });

  it("das Feld ist weg", () => {
    geprueft("Router");
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("Schlüsselbegriffe: Kernpunkte, Prozent und Stufe „teilweise“", () => {
    geprueft("Der Router und der Switch");
    expect(screen.getByText(/2 von 4 Kernpunkten getroffen \(50 %\)/)).toBeTruthy();
    expect(screen.getByText("teilweise richtig")).toBeTruthy();
    expect(screen.getByText("Näherung über Begriffs-Abgleich — maßgeblich ist deine eigene Einschätzung.")).toBeTruthy();
  });

  it("Zusatzpunkte stehen nur da, wenn es welche gibt", () => {
    geprueft("Router Switch", { schluesselbegriffe: { pflicht: ["Router", "Switch"], kuer: ["Gateway"] } });
    expect(screen.getByText(/2 von 2 Kernpunkten getroffen \(\+ 0 von 1 Zusatzpunkten\) \(80 %\)/)).toBeTruthy();
    expect(screen.getByText("wahrscheinlich richtig")).toBeTruthy();
    cleanup();
    geprueft("Router Switch", { schluesselbegriffe: { pflicht: ["Router", "Switch"] } });
    expect(screen.getByText(/2 von 2 Kernpunkten getroffen \(100 %\)/)).toBeTruthy();
    expect(screen.queryByText(/Zusatzpunkten/)).toBeNull();
  });

  it("ohne Schlüsselbegriffe zählt der Abgleich mit der Musterlösung", () => {
    zeige({ gesperrt: true, antwort: { text: "Netzwerk Sicherheit Verschlüsselung" } },
      frage({ musterloesung: "Netzwerk Sicherheit Verschlüsselung Firewall" }));
    expect(screen.getByText(/3 von 4 Kernpunkten erkannt \(75 %\)/)).toBeTruthy();
    expect(screen.getByText("wahrscheinlich richtig")).toBeTruthy();
  });

  it("keine Treffer: „eher unvollständig“ in Warnfarbe", () => {
    geprueft("Das ist eine ganz andere Antwort");
    const stufe = screen.getByText("eher unvollständig");
    expect(stufe.className).toContain("text-destructive");
  });

  it("keine Antwort: „keine Antwort erkannt“ in Warnfarbe", () => {
    geprueft("");
    expect(screen.getByText("keine Antwort erkannt").className).toContain("text-destructive");
  });

  it("richtig und teilweise sind nicht in Warnfarbe", () => {
    geprueft("Router Switch Server Kabel");
    expect(screen.getByText("wahrscheinlich richtig").className).not.toContain("text-destructive");
    cleanup();
    geprueft("Router Switch");
    expect(screen.getByText("teilweise richtig").className).not.toContain("text-destructive");
  });

  it("zu wenige Kernbegriffe in der Musterlösung: „nicht sicher bewertbar“, kein Vorschlag", () => {
    zeige({ gesperrt: true, antwort: { text: "Irgendwas Geschriebenes" } }, frage({ musterloesung: "Router" }));
    expect(screen.getByText("nicht sicher bewertbar")).toBeTruthy();
    expect(screen.queryByText("(Vorschlag)")).toBeNull();
  });

  it("die Musterlösung steht da, wenn die Frage eine hat – sonst nicht", () => {
    zeige({ gesperrt: true, antwort: { text: "x" } }, frage({ schluesselbegriffe: { pflicht: ["Router"] }, musterloesung: "Der Router verbindet." }));
    expect(screen.getByText("Musterlösung")).toBeTruthy();
    expect(screen.getByText("Der Router verbindet.")).toBeTruthy();
    cleanup();
    geprueft("x");
    expect(screen.queryByText("Musterlösung")).toBeNull();
  });

  it("eine leere Musterlösung wird trotzdem gezeigt (Text bleibt Text)", () => {
    zeige({ gesperrt: true, antwort: { text: "x" } }, frage({ schluesselbegriffe: { pflicht: ["Router"] }, musterloesung: "" }));
    expect(screen.getByText("Musterlösung")).toBeTruthy();
  });

  it("der Vorschlag steht beim passenden Knopf: richtig → Wusste ich", () => {
    geprueft("Router Switch Server Kabel");
    expect(knopf("Wusste ich\\s*(\\(Vorschlag\\))?$").textContent).toContain("(Vorschlag)");
    expect(knopf("Teilweise").textContent).not.toContain("(Vorschlag)");
    expect(knopf("Wusste ich nicht").textContent).not.toContain("(Vorschlag)");
    expect(screen.getAllByText("(Vorschlag)")).toHaveLength(1);
  });

  it("teilweise → Teilweise", () => {
    geprueft("Router Switch");
    expect(knopf("Teilweise").textContent).toContain("(Vorschlag)");
    expect(screen.getAllByText("(Vorschlag)")).toHaveLength(1);
  });

  it("unvollständig und leer → Wusste ich nicht", () => {
    geprueft("Das ist eine ganz andere Antwort");
    expect(knopf("Wusste ich nicht").textContent).toContain("(Vorschlag)");
    expect(screen.getAllByText("(Vorschlag)")).toHaveLength(1);
    cleanup();
    geprueft("");
    expect(knopf("Wusste ich nicht").textContent).toContain("(Vorschlag)");
    expect(screen.getAllByText("(Vorschlag)")).toHaveLength(1);
  });

  it("die Knöpfe melden die Selbsteinschätzung zusammen mit dem Text", async () => {
    const nutzer = userEvent.setup();
    const { aufAntwort } = geprueft("Router");
    await nutzer.click(knopf("Wusste ich\\s*(\\(Vorschlag\\))?$"));
    await nutzer.click(knopf("Teilweise"));
    await nutzer.click(knopf("Wusste ich nicht"));
    expect(aufAntwort.mock.calls.map((c) => c[0])).toStrictEqual([
      { text: "Router", selbst: true },
      { text: "Router", selbst: null },
      { text: "Router", selbst: false },
    ]);
  });

  it("ohne Einschätzung ist keiner der Knöpfe hervorgehoben", () => {
    geprueft("Router");
    for (const n of ["Wusste ich\\s*(\\(Vorschlag\\))?$", "Teilweise", "Wusste ich nicht"]) {
      expect(knopf(n).getAttribute("data-variant")).toBe("secondary");
    }
  });

  it("die gewählte Einschätzung ist hervorgehoben – auch die Mitte", () => {
    const stand = (selbst: boolean | null) => {
      geprueft("Router", {}, { antwort: { text: "Router", selbst } });
      const v = (n: string) => knopf(n).getAttribute("data-variant");
      const r = [v("Wusste ich\\s*(\\(Vorschlag\\))?$"), v("Teilweise"), v("Wusste ich nicht")];
      cleanup();
      return r;
    };
    expect(stand(true)).toEqual(["default", "secondary", "secondary"]);
    expect(stand(null)).toEqual(["secondary", "default", "secondary"]);
    expect(stand(false)).toEqual(["secondary", "secondary", "default"]);
  });
});
