// @vitest-environment jsdom
/* Der Netzplan-Schirm mit einer GEBAUTEN Aufgabe (vier Vorgaenge, bekannte Zahlen): Lage der Knoten,
   Pfeile, kritischer Weg nach dem Pruefen, Felderfarben, Urteilsrahmen an der 80-%-Grenze, neue Aufgabe.
   Der Zufallsweg (genNetzplan) und die Rechnung gehoeren kern/netzplan und netzplan.jsdom.test.tsx. */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { NetzplanAufgabe, NetzplanVorgang } from "@/kern/netzplan";

const hier = vi.hoisted(() => ({ aufgaben: [] as unknown[] }));
vi.mock("@/kern/netzplan", async (orig) => {
  const echt = await orig<typeof import("@/kern/netzplan")>();
  return { ...echt, neueAufgabe: () => hier.aufgaben.shift() };
});

import { Netzplan } from "./Netzplan";
import { useLernstand } from "@/huelle/useLernstand";

const vg = (id: string, dauer: number, vor: string[], nach: string[], faz: number, saz: number, gp: number): NetzplanVorgang =>
  ({ id, name: "Name " + id, dauer, vorgaenger: vor, nachfolger: nach, faz, fez: faz + dauer, saz, sez: saz + dauer, gp, fp: 0 });
/* A(2) -> B(3), C(4) -> D(2); kritisch A, C, D; B hat 1 Tag Puffer. */
const VORGAENGE = [
  vg("A", 2, [], ["B", "C"], 0, 0, 0),
  vg("B", 3, ["A"], ["D"], 2, 3, 1),
  vg("C", 4, ["A"], ["D"], 2, 2, 0),
  vg("D", 2, ["B", "C"], [], 6, 6, 0),
];
const aufgabe = (titel: string): NetzplanAufgabe => ({
  szenario: { titel, text: "Text zu " + titel },
  daten: { vorgaenge: VORGAENGE, projektdauer: 8, kritisch: ["A", "C", "D"] },
  weg: ["Zeile eins", "Zeile zwei"],
});

function Buehne() {
  return <Netzplan lernstand={useLernstand()} />;
}
const nutzer = () => userEvent.setup({ delay: null });
const feld = (f: string, id: string) => screen.getByLabelText(`${f} für Vorgang ${id}`) as HTMLInputElement;
const knoten = (id: string) => screen.getByText(id, { selector: "div" }).closest("[data-kritisch]") as HTMLElement;
async function fuelle(n: ReturnType<typeof nutzer>, ausser: string[] = []) {
  for (const v of VORGAENGE) {
    for (const f of ["faz", "fez", "saz", "sez", "gp"] as const) {
      const key = `${f}:${v.id}`;
      if (ausser.includes(key)) continue;
      await n.type(feld(f.toUpperCase(), v.id), String(v[f]));
    }
  }
}
const hat = (e: HTMLElement, klasse: string) => e.classList.contains(klasse);
const urteilsrahmen = () => screen.getByText(/Feldern richtig/).closest('[data-slot="card"]') as HTMLElement;

beforeEach(() => { localStorage.clear(); hier.aufgaben = [aufgabe("Erste"), aufgabe("Zweite")]; });
afterEach(cleanup);

describe("Aufbau", () => {
  it("zeigt Titel und Text des Szenarios", () => {
    render(<Buehne />);
    expect(screen.getByText("Erste")).toBeTruthy();
    expect(screen.getByText("Text zu Erste")).toBeTruthy();
  });

  it("Felder tragen ihre Kuerzel als Platzhalter, leer, und die Dauer steht fest in der Mitte", () => {
    render(<Buehne />);
    expect(feld("FAZ", "A").placeholder).toBe("FAZ");
    expect(feld("SEZ", "D").placeholder).toBe("SEZ");
    expect(feld("GP", "B").placeholder).toBe("GP");
    expect(feld("FEZ", "C").value).toBe("");
    expect(screen.getAllByTitle("Dauer des Vorgangs (vorgegeben)").map((e) => e.textContent)).toEqual(["2", "3", "4", "2"]);
  });

  it("eine Eingabe bleibt stehen, die der anderen Vorgaenge und Felder bleibt unberuehrt", async () => {
    const n = nutzer();
    render(<Buehne />);
    await n.type(feld("FAZ", "A"), "7");
    await n.type(feld("FEZ", "B"), "9");
    expect(feld("FAZ", "A").value).toBe("7");
    expect(feld("FEZ", "B").value).toBe("9");
    expect(feld("FEZ", "A").value).toBe("");
    expect(feld("FAZ", "B").value).toBe("");
  });
});

describe("Lage der Knoten und Pfeile", () => {
  it("Knoten stehen in Spalte (Tiefe) und Zeile; die Flaeche ist drei Spalten breit und zwei Zeilen hoch", () => {
    render(<Buehne />);
    const stil = (id: string) => { const s = knoten(id).style; return [s.left, s.top, s.width, s.height]; };
    expect(stil("A")).toEqual(["0px", "0px", "180px", "122px"]);
    expect(stil("B")).toEqual(["236px", "0px", "180px", "122px"]);
    expect(stil("C")).toEqual(["236px", "150px", "180px", "122px"]);
    expect(stil("D")).toEqual(["472px", "0px", "180px", "122px"]);
    const flaeche = knoten("A").parentElement!;
    expect([flaeche.style.width, flaeche.style.height]).toEqual(["652px", "272px"]);
    const svg = flaeche.querySelector("svg")!;
    expect([svg.getAttribute("width"), svg.getAttribute("height")]).toEqual(["652", "272"]);
  });

  it("je Abhaengigkeit eine Linie von rechts Mitte des Vorgaengers zu links Mitte des Nachfolgers, mit Pfeilspitze", () => {
    render(<Buehne />);
    const svg = knoten("A").parentElement!.querySelector("svg")!;
    const linien = [...svg.querySelectorAll("line")].map((l) => ["x1", "y1", "x2", "y2"].map((a) => l.getAttribute(a)).join(","));
    expect(linien).toEqual(["180,61,236,61", "180,61,236,211", "416,61,472,61", "416,211,472,61"]);
    const spitzen = [...svg.querySelectorAll("polygon")].map((p) => p.getAttribute("points"));
    expect(spitzen).toEqual([
      "236,61 228,57 228,65", "236,211 228,207 228,215", "472,61 464,57 464,65", "472,61 464,57 464,65",
    ]);
  });

  it("ein einzelner Vorgang: die Flaeche ist genau ein Knoten gross", () => {
    hier.aufgaben = [{ ...aufgabe("Eins"), daten: { vorgaenge: [VORGAENGE[0]!], projektdauer: 2, kritisch: ["A"] } }];
    render(<Buehne />);
    const flaeche = knoten("A").parentElement!;
    expect([flaeche.style.width, flaeche.style.height]).toEqual(["180px", "122px"]);
  });
});

describe("Pruefen", () => {
  it("der kritische Weg wird erst danach hervorgehoben - und nur er", async () => {
    const n = nutzer();
    render(<Buehne />);
    for (const id of ["A", "B", "C", "D"]) {
      expect(knoten(id).getAttribute("data-kritisch")).toBe("nein");
      expect(knoten(id).className).not.toContain("border-destructive");
    }
    await n.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    const stand = Object.fromEntries(["A", "B", "C", "D"].map((id) =>
      [id, [knoten(id).getAttribute("data-kritisch"), knoten(id).className.includes("border-destructive")]]));
    expect(stand).toEqual({ A: ["ja", true], B: ["nein", false], C: ["ja", true], D: ["ja", true] });
    expect(screen.getByText("A → C → D")).toBeTruthy();
    expect(screen.getByText("8 Tage")).toBeTruthy();
    expect(screen.getByText("Zeile eins")).toBeTruthy();
  });

  it("richtige Felder gruen ohne Hinweis, falsche rot mit der richtigen Zahl daneben, leere ebenso", async () => {
    const n = nutzer();
    render(<Buehne />);
    await n.type(feld("FAZ", "B"), "2");        // richtig
    await n.type(feld("FEZ", "B"), "9");        // falsch (5)
    await n.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    expect(hat(feld("FAZ", "B"), "border-chart-1/60")).toBe(true);
    expect(hat(feld("FAZ", "B"), "border-destructive")).toBe(false);
    expect(hat(feld("FEZ", "B"), "border-destructive")).toBe(true);
    expect(hat(feld("FEZ", "B"), "border-chart-1/60")).toBe(false);
    expect(hat(feld("SEZ", "B"), "border-destructive")).toBe(true);   // leer
    expect(feld("FAZ", "B").parentElement!.querySelector("span")).toBeNull();
    expect(feld("FEZ", "B").parentElement!.querySelector("span")!.textContent).toBe("5");
    expect(feld("SEZ", "B").parentElement!.querySelector("span")!.textContent).toBe("6");
  });

  it("vor dem Pruefen ist kein Feld gefaerbt und keine richtige Zahl zu sehen", () => {
    render(<Buehne />);
    expect(hat(feld("FAZ", "B"), "border-chart-1/60")).toBe(false);
    expect(hat(feld("FAZ", "B"), "border-destructive")).toBe(false);
    expect(feld("FAZ", "B").parentElement!.querySelector("span")).toBeNull();
  });

  it("Ergebnis: alles richtig = 100 %, gruener Rahmen; die Felder sind gesperrt", async () => {
    const n = nutzer();
    render(<Buehne />);
    await fuelle(n);
    await n.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    expect(screen.getByText("20 von 20 Feldern richtig (100 %).")).toBeTruthy();
    expect(urteilsrahmen().className).toContain("border-chart-1/40");
    expect(urteilsrahmen().className).not.toContain("border-destructive/50");
    expect(feld("FAZ", "A").disabled).toBe(true);
  });

  it("genau 80 % (16 von 20) zaehlt noch als bestanden", async () => {
    const n = nutzer();
    render(<Buehne />);
    await fuelle(n, ["faz:A", "fez:A", "saz:A", "sez:A"]);
    await n.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    expect(screen.getByText("16 von 20 Feldern richtig (80 %).")).toBeTruthy();
    expect(urteilsrahmen().className).toContain("border-chart-1/40");
  });

  it("75 % (15 von 20) ist unter der Grenze: roter Rahmen", async () => {
    const n = nutzer();
    render(<Buehne />);
    await fuelle(n, ["faz:A", "fez:A", "saz:A", "sez:A", "gp:A"]);
    await n.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    expect(screen.getByText("15 von 20 Feldern richtig (75 %).")).toBeTruthy();
    expect(urteilsrahmen().className).toContain("border-destructive/50");
    expect(urteilsrahmen().className).not.toContain("border-chart-1/40");
  });
});

describe("Neue Aufgabe", () => {
  it("eine Aufgabe mit anderem Netz wird neu angeordnet (kein Rest der alten Lage)", async () => {
    const n = nutzer();
    const klein = { ...aufgabe("Klein"), daten: { vorgaenge: [vg("X", 1, [], [], 0, 0, 0)], projektdauer: 1, kritisch: ["X"] } };
    hier.aufgaben = [aufgabe("Erste"), klein];
    render(<Buehne />);
    await n.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    await n.click(screen.getByRole("button", { name: "Neue Aufgabe →" }));
    const flaeche = knoten("X").parentElement!;
    expect([flaeche.style.width, flaeche.style.height]).toEqual(["180px", "122px"]);
    expect([knoten("X").style.left, knoten("X").style.top]).toEqual(["0px", "0px"]);
  });

  it("laedt die naechste Aufgabe, leert Eingaben und hebt die Sperre auf", async () => {
    const n = nutzer();
    render(<Buehne />);
    await n.type(feld("FAZ", "A"), "5");
    await n.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    await n.click(screen.getByRole("button", { name: "Neue Aufgabe →" }));
    expect(screen.getByText("Zweite")).toBeTruthy();
    expect(screen.queryByText("Erste")).toBeNull();
    expect(feld("FAZ", "A").value).toBe("");
    expect(feld("FAZ", "A").disabled).toBe(false);
    expect(screen.queryByText(/Feldern richtig/)).toBeNull();
    expect(screen.getByRole("button", { name: "Netzplan prüfen" })).toBeTruthy();
  });
});
