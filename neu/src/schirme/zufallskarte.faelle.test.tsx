// @vitest-environment jsdom
/* Die Zufallskarte allein, mit einer von Hand gebauten Aufgabe: Wann "Lösung prüfen" frei ist,
   was gebucht wird (richtig/falsch/aufgegeben) und was danach auf der Karte steht. */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Zufallskarte } from "./Zufallskarte";
import type { Zufallsaufgabe } from "@/kern/generator";

afterEach(cleanup);

const BASIS: Zufallsaufgabe = {
  id: "GEN-test", typ: "generator", generator: "x", generatorArt: "test", modul: "M03",
  thema: "Rechnen", pruefungsteil: "AP1", schwierigkeit: 3,
  frage: "Was ist 6 mal 7?", antwort: ["42"], weg: ["6 * 7", "= 42"],
};
const ZWEI: Zufallsaufgabe = { ...BASIS, antwort: undefined as never, antwort2: [["3"], ["4"]], weg: ["a", "b"] };
const pruefen = () => screen.getByRole("button", { name: "Lösung prüfen" }) as HTMLButtonElement;
const nutzer = () => userEvent.setup({ delay: null });

describe("Zufallskarte: Aufbau", () => {
  it("zeigt Kopf, Etiketten, Frage und den Hinweis zum Wuerfeln", () => {
    render(<Zufallskarte aufgabe={BASIS} nummer={5} />);
    expect(screen.getByText("GEN-test")).toBeTruthy();
    expect(screen.getByText("Karte 5")).toBeTruthy();
    expect(screen.getByText("Zufallsaufgabe")).toBeTruthy();
    expect(screen.getByText("M03")).toBeTruthy();
    expect(screen.getByText("Was ist 6 mal 7?")).toBeTruthy();
    expect(screen.getByText(/bei jedem Ziehen neu gewürfelt/)).toBeTruthy();
    expect(screen.getByRole("img", { name: "Schwierigkeit 3 von 4" })).toBeTruthy();
  });
});

describe("Zufallskarte: Lösung prüfen erst, wenn etwas dasteht", () => {
  it("leer und nur Leerzeichen: gesperrt; mit Text: frei", async () => {
    const n = nutzer();
    render(<Zufallskarte aufgabe={BASIS} nummer={1} />);
    expect(pruefen().disabled).toBe(true);
    await n.type(screen.getByRole("textbox", { name: "Antwort" }), "   ");
    expect(pruefen().disabled).toBe(true);
    await n.type(screen.getByRole("textbox", { name: "Antwort" }), "4");
    expect(pruefen().disabled).toBe(false);
  });

  it("bei zwei Feldern genügt EIN ausgefülltes (das andere bleibt leer)", async () => {
    const n = nutzer();
    render(<Zufallskarte aufgabe={ZWEI} nummer={1} />);
    expect(pruefen().disabled).toBe(true);
    await n.type(screen.getByRole("textbox", { name: "Antwort 2" }), "4");
    expect(pruefen().disabled).toBe(false);
  });

  it("Aufgeben ist von Anfang an frei", () => {
    render(<Zufallskarte aufgabe={BASIS} nummer={1} />);
    expect((screen.getByRole("button", { name: "Aufgeben" }) as HTMLButtonElement).disabled).toBe(false);
  });
});

describe("Zufallskarte: was gebucht wird", () => {
  it("richtige Antwort: buche(true), Urteil und Lösungsweg stehen da, die Knöpfe sind weg", async () => {
    const buche = vi.fn();
    const n = nutzer();
    render(<Zufallskarte aufgabe={BASIS} nummer={1} buche={buche} />);
    await n.type(screen.getByRole("textbox", { name: "Antwort" }), "42");
    await n.click(pruefen());
    expect(buche).toHaveBeenCalledTimes(1);
    expect(buche).toHaveBeenCalledWith(true);
    expect(screen.getByText("Richtig.")).toBeTruthy();
    expect(screen.getByText("Lösungsweg Schritt für Schritt")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Lösung prüfen" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Aufgeben" })).toBeNull();
    expect((screen.getByRole("textbox", { name: "Antwort" }) as HTMLInputElement).disabled).toBe(true);
  });

  it("falsche Antwort: buche(false), 'Nicht richtig.' und die richtige Zahl", async () => {
    const buche = vi.fn();
    const n = nutzer();
    render(<Zufallskarte aufgabe={BASIS} nummer={1} buche={buche} />);
    await n.type(screen.getByRole("textbox", { name: "Antwort" }), "41");
    await n.click(pruefen());
    expect(buche).toHaveBeenCalledWith(false);
    expect(screen.getByText("Nicht richtig.")).toBeTruthy();
    expect(screen.getByText("richtig: 42")).toBeTruthy();
  });

  it("zwei Felder, nur eines richtig: buche(false); beide richtig: buche(true)", async () => {
    const buche = vi.fn();
    const n = nutzer();
    render(<Zufallskarte aufgabe={ZWEI} nummer={1} buche={buche} />);
    await n.type(screen.getByRole("textbox", { name: "Antwort 1" }), "3");
    await n.type(screen.getByRole("textbox", { name: "Antwort 2" }), "9");
    await n.click(pruefen());
    expect(buche).toHaveBeenLastCalledWith(false);
    cleanup();
    const buche2 = vi.fn();
    render(<Zufallskarte aufgabe={ZWEI} nummer={1} buche={buche2} />);
    await n.type(screen.getByRole("textbox", { name: "Antwort 1" }), "3");
    await n.type(screen.getByRole("textbox", { name: "Antwort 2" }), "4");
    await n.click(pruefen());
    expect(buche2).toHaveBeenLastCalledWith(true);
  });

  it("Aufgeben ohne Eingabe: buche(false) und der Lösungsweg erscheint", async () => {
    const buche = vi.fn();
    render(<Zufallskarte aufgabe={BASIS} nummer={1} buche={buche} />);
    await nutzer().click(screen.getByRole("button", { name: "Aufgeben" }));
    expect(buche).toHaveBeenCalledTimes(1);
    expect(buche).toHaveBeenCalledWith(false);
    expect(screen.getByText("= 42")).toBeTruthy();
  });

  it("ohne buche geht Prüfen und Aufgeben ohne Fehler", async () => {
    const n = nutzer();
    render(<Zufallskarte aufgabe={BASIS} nummer={1} />);
    await n.type(screen.getByRole("textbox", { name: "Antwort" }), "42");
    await n.click(pruefen());
    expect(screen.getByText("Richtig.")).toBeTruthy();
    cleanup();
    render(<Zufallskarte aufgabe={BASIS} nummer={1} />);
    await n.click(screen.getByRole("button", { name: "Aufgeben" }));
    expect(screen.getByText("Nicht richtig.")).toBeTruthy();
  });
});
