// @ts-nocheck
// @vitest-environment jsdom
/* Der Kasten „Richtig wäre": wann steht die Lösung als Liste, wann in einer Zeile. */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { RichtigWaere } from "./RichtigWaere";

afterEach(cleanup);

const lang = (n: number) => "x".repeat(n);

describe("RichtigWaere", () => {
  it("trägt die Überschrift und ist als Kasten auffindbar", () => {
    const { container } = render(<RichtigWaere zeilen={["A"]} />);
    expect(screen.getByText("Richtig wäre")).toBeTruthy();
    expect(container.querySelector('[data-teil="richtig-waere"]')).not.toBeNull();
  });

  it("mehrere kurze Zeilen stehen in einer Zeile, mit Mittelpunkt getrennt", () => {
    render(<RichtigWaere zeilen={["Lücke 1: Alpha", "Lücke 2: Beta"]} />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("Lücke 1: Alpha · Lücke 2: Beta")).toBeTruthy();
  });

  it("eine einzelne lange Zeile bleibt eine Zeile", () => {
    render(<RichtigWaere zeilen={[lang(80)]} />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText(lang(80))).toBeTruthy();
  });

  it("genau 40 Zeichen gelten noch als kurz, 41 machen eine Liste", () => {
    const { unmount } = render(<RichtigWaere zeilen={[lang(40), "kurz"]} />);
    expect(screen.queryByRole("list")).toBeNull();
    unmount();
    render(<RichtigWaere zeilen={[lang(41), "kurz"]} />);
    const liste = screen.getByRole("list");
    const punkte = within(liste).getAllByRole("listitem");
    expect(punkte.map((p) => p.textContent)).toEqual([lang(41), "kurz"]);
  });

  it("eine lange Zeile unter mehreren genügt für die Liste", () => {
    render(<RichtigWaere zeilen={["kurz", "auch kurz", lang(45)]} />);
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(3);
  });

  it("ohne Zeilen bleibt der Kasten leer bis auf die Überschrift", () => {
    const { container } = render(<RichtigWaere zeilen={[]} />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(container.querySelector("span")!.textContent).toBe("");
  });
});
