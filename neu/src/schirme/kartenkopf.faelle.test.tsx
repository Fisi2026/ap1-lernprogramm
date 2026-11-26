// @vitest-environment jsdom
/* Die Kopfleiste einer Karte: was sichtbar ist (Kennung, Thema, Stufe als vier Punkte, Nummer, Anhang). */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Kartenkopf } from "./Kartenkopf";

afterEach(cleanup);

function punkte(stufe: number): { gefuellt: number; leer: number; gesamt: number } {
  render(<Kartenkopf kennung="M01-001" thema="Thema" schwierigkeit={stufe} nummer={1} />);
  const bild = screen.getByRole("img", { name: `Schwierigkeit ${stufe} von 4` });
  const alle = [...bild.querySelectorAll("i")];
  const gefuellt = alle.filter((p) => p.classList.contains("bg-chart-1")).length;
  const leer = alle.filter((p) => p.classList.contains("ring-1") && !p.classList.contains("bg-chart-1")).length;
  cleanup();
  return { gefuellt, leer, gesamt: alle.length };
}

describe("Kartenkopf", () => {
  it("zeigt Kennung, Thema, Stufe und Kartennummer", () => {
    render(<Kartenkopf kennung="M03-056" thema="Netzplan" schwierigkeit={2} nummer={7} />);
    expect(screen.getByText("M03-056")).toBeTruthy();
    expect(screen.getByText("Netzplan")).toBeTruthy();
    expect(screen.getByText("Stufe")).toBeTruthy();
    expect(screen.getByText("Karte 7")).toBeTruthy();
  });

  it("haengt an, was der Aufrufer als Kind uebergibt", () => {
    render(<Kartenkopf kennung="K" thema="T" schwierigkeit={1} nummer={1}><button>Stern</button></Kartenkopf>);
    expect(screen.getByRole("button", { name: "Stern" })).toBeTruthy();
  });

  it("ohne Thema bleibt die Kennung stehen und nichts bricht", () => {
    render(<Kartenkopf kennung="M01-002" thema={undefined} schwierigkeit={1} nummer={3} />);
    expect(screen.getByText("M01-002")).toBeTruthy();
    expect(screen.getByText("Karte 3")).toBeTruthy();
  });

  it.each([0, 1, 2, 3, 4])("Stufe %i: immer vier Punkte, genau so viele gefuellt wie die Stufe", (s) => {
    expect(punkte(s)).toEqual({ gefuellt: s, leer: 4 - s, gesamt: 4 });
  });
});
