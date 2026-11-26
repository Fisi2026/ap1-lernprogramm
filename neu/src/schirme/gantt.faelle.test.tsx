// @vitest-environment jsdom
/* Der Gantt-Schirm mit einer GEBAUTEN Aufgabe (fuenf Vorgaenge, bekannte Tage): Tabelle, Korrekturhinweise,
   Urteilsrahmen an der 80-%-Grenze, Puffer-Satz, Balkenplan Zelle fuer Zelle, neue Aufgabe.
   Zufallsweg und Rechnung: kern/gantt und gantt.jsdom.test.tsx. */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { GanttAufgabe, GanttVorgang } from "@/kern/gantt";

const hier = vi.hoisted(() => ({ aufgaben: [] as unknown[] }));
vi.mock("@/kern/gantt", async (orig) => {
  const echt = await orig<typeof import("@/kern/gantt")>();
  return { ...echt, neueAufgabe: () => hier.aufgaben.shift() };
});

import { Gantt } from "./Gantt";
import { useLernstand } from "@/huelle/useLernstand";
import { LS_SCHLUESSEL } from "@/kern/stand";

const vg = (id: string, dauer: number, vor: string[], start: number, spStart: number): GanttVorgang =>
  ({ id, name: "Name " + id, dauer, vorgaenger: vor, start, ende: start + dauer - 1, spStart, spEnde: spStart + dauer - 1, puffer: spStart - start });
/* A(2) -> B(3) -> D(1), E(1);  A -> C(1) mit 2 Tagen Puffer. Projektdauer 6, kritisch A, B, D, E. */
const VORGAENGE = [
  vg("A", 2, [], 1, 1), vg("B", 3, ["A"], 3, 3), vg("C", 1, ["A"], 3, 5),
  vg("D", 1, ["B"], 6, 6), vg("E", 1, ["B", "C"], 6, 6),
];
const aufgabe = (titel: string, vorgaenge = VORGAENGE, kritisch = ["A", "B", "D", "E"]): GanttAufgabe => ({
  szenario: { titel, text: "Text zu " + titel },
  daten: { vorgaenge, projektdauer: 6, kritisch },
});

function Buehne() { return <Gantt lernstand={useLernstand()} />; }
const nutzer = () => userEvent.setup({ delay: null });
const feld = (art: "Start-Tag" | "End-Tag", id: string) => screen.getByLabelText(`${art} ${id}`) as HTMLInputElement;
const hat = (e: HTMLElement, k: string) => e.classList.contains(k);
const rahmen = () => screen.getByText(/Feldern richtig/).closest('[data-slot="card"]') as HTMLElement;
async function fuelle(n: ReturnType<typeof nutzer>, ausser: string[] = []) {
  for (const v of VORGAENGE) {
    if (!ausser.includes("s" + v.id)) await n.type(feld("Start-Tag", v.id), String(v.start));
    if (!ausser.includes("e" + v.id)) await n.type(feld("End-Tag", v.id), String(v.ende));
  }
}
const pruefen = (n: ReturnType<typeof nutzer>) => n.click(screen.getByRole("button", { name: "Planung prüfen" }));

beforeEach(() => { localStorage.clear(); hier.aufgaben = [aufgabe("Erste"), aufgabe("Zweite")]; });
afterEach(cleanup);

describe("Aufbau", () => {
  it("Szenario, und je Vorgang Name, Dauer, Vorgaenger (oder Strich) und zwei leere Felder", () => {
    render(<Buehne />);
    expect(screen.getByText("Erste")).toBeTruthy();
    expect(screen.getByText("Text zu Erste")).toBeTruthy();
    const zeilen = within(screen.getAllByRole("table")[0]!).getAllByRole("row").slice(1);
    const zellen = zeilen.map((z) => within(z).getAllByRole("cell").slice(0, 3).map((c) => c.textContent));
    expect(zellen).toEqual([
      ["A – Name A", "2", "–"], ["B – Name B", "3", "A"], ["C – Name C", "1", "A"],
      ["D – Name D", "1", "B"], ["E – Name E", "1", "B, C"],
    ]);
    expect(feld("Start-Tag", "A").value).toBe("");
    expect(feld("End-Tag", "E").value).toBe("");
  });

  it("Eingaben bleiben je Vorgang und Feld getrennt stehen", async () => {
    const n = nutzer();
    render(<Buehne />);
    await n.type(feld("Start-Tag", "A"), "4");
    await n.type(feld("End-Tag", "B"), "7");
    expect([feld("Start-Tag", "A").value, feld("End-Tag", "B").value, feld("End-Tag", "A").value, feld("Start-Tag", "B").value])
      .toEqual(["4", "7", "", ""]);
  });
});

describe("Pruefen", () => {
  it("richtige Felder gruen ohne Hinweis; falsche und leere rot mit 'richtig: Zahl' (Start und Ende getrennt)", async () => {
    const n = nutzer();
    render(<Buehne />);
    await n.type(feld("Start-Tag", "B"), "3");   // richtig
    await n.type(feld("End-Tag", "B"), "9");     // falsch, richtig waere 5
    await pruefen(n);
    expect(hat(feld("Start-Tag", "B"), "border-chart-1/60")).toBe(true);
    expect(hat(feld("Start-Tag", "B"), "border-destructive")).toBe(false);
    expect(feld("Start-Tag", "B").parentElement!.querySelector("span")).toBeNull();
    expect(hat(feld("End-Tag", "B"), "border-destructive")).toBe(true);
    expect(hat(feld("End-Tag", "B"), "border-chart-1/60")).toBe(false);
    expect(feld("End-Tag", "B").parentElement!.querySelector("span")!.textContent).toBe("richtig: 5");
    expect(feld("Start-Tag", "C").parentElement!.querySelector("span")!.textContent).toBe("richtig: 3");
    expect(feld("End-Tag", "C").parentElement!.querySelector("span")!.textContent).toBe("richtig: 3");
    expect(feld("Start-Tag", "D").parentElement!.querySelector("span")!.textContent).toBe("richtig: 6");
    expect(feld("Start-Tag", "A").disabled).toBe(true);
  });

  it("vor dem Pruefen ist nichts gefaerbt und keine Loesung sichtbar", () => {
    render(<Buehne />);
    expect(hat(feld("Start-Tag", "A"), "border-destructive")).toBe(false);
    expect(hat(feld("Start-Tag", "A"), "border-chart-1/60")).toBe(false);
    expect(screen.queryByText(/richtig:/)).toBeNull();
    expect(screen.queryByRole("table", { name: "Balkenplan" })).toBeNull();
  });

  it("alles richtig: 100 %, gruener Rahmen", async () => {
    const n = nutzer();
    render(<Buehne />);
    await fuelle(n);
    await pruefen(n);
    expect(screen.getByText("10 von 10 Feldern richtig (100 %).")).toBeTruthy();
    expect(hat(rahmen(), "border-chart-1/40")).toBe(true);
    expect(hat(rahmen(), "border-destructive/50")).toBe(false);
  });

  it("genau 80 % (8 von 10) zaehlt noch als bestanden", async () => {
    const n = nutzer();
    render(<Buehne />);
    await fuelle(n, ["sA", "eA"]);
    await pruefen(n);
    expect(screen.getByText("8 von 10 Feldern richtig (80 %).")).toBeTruthy();
    expect(hat(rahmen(), "border-chart-1/40")).toBe(true);
  });

  it("70 % (7 von 10): roter Rahmen", async () => {
    const n = nutzer();
    render(<Buehne />);
    await fuelle(n, ["sA", "eA", "sB"]);
    await pruefen(n);
    expect(screen.getByText("7 von 10 Feldern richtig (70 %).")).toBeTruthy();
    expect(hat(rahmen(), "border-destructive/50")).toBe(true);
    expect(hat(rahmen(), "border-chart-1/40")).toBe(false);
  });

  it("nennt Projektdauer, kritischen Pfad und den ersten Vorgang mit Puffer", async () => {
    const n = nutzer();
    render(<Buehne />);
    await pruefen(n);
    const text = rahmen().textContent!;
    expect(text).toContain("Projektdauer: 6 Tage.");
    expect(text).toContain("Pfad (Puffer = 0): A → B → D → E.");
    expect(text).toContain("Vorgang C hat 2 Tag(e) Puffer (spätester Start Tag 5), ohne das Projektende zu verschieben.");
  });

  it("ohne Puffer fehlt der Puffer-Satz", async () => {
    const n = nutzer();
    const ohne = VORGAENGE.map((v) => Object.assign({}, v, { spStart: v.start, spEnde: v.ende, puffer: 0 }));
    hier.aufgaben = [aufgabe("Ohne", ohne, ["A", "B", "C", "D", "E"])];
    render(<Buehne />);
    await pruefen(n);
    expect(rahmen().textContent).not.toContain("Puffer (spätester");
    expect(rahmen().textContent).not.toContain("hat");
  });

  it("der Loesungsweg steht als Text da, wenn man ihn aufklappt", async () => {
    const n = nutzer();
    render(<Buehne />);
    await pruefen(n);
    await n.click(screen.getByText("Kompletter Lösungsweg"));
    expect(screen.getByText("A: Start Tag 1, Ende Tag 2 (Dauer 2, ohne Vorgänger), Puffer 0")).toBeTruthy();
    expect(screen.getByText("E: Start Tag 6, Ende Tag 6 (Dauer 1, frühestens nach B/C), Puffer 0")).toBeTruthy();
  });
});

describe("Balkenplan", () => {
  it("eine Spalte je Tag 1..6, je Vorgang die Zellen kritisch/Balken/Puffer/leer in der richtigen Farbe", async () => {
    const n = nutzer();
    render(<Buehne />);
    await pruefen(n);
    const plan = screen.getByRole("table", { name: "Balkenplan" });
    const kopf = within(plan).getAllByRole("columnheader").map((h) => h.textContent);
    expect(kopf).toEqual(["Vorgang", "1", "2", "3", "4", "5", "6"]);
    const art = (zeile: HTMLElement) => [...zeile.querySelectorAll("[data-zelle]")].map((z) => z.getAttribute("data-zelle"));
    const zeilen = within(plan).getAllByRole("row").slice(1);
    expect(zeilen.map((z) => z.querySelector("td")!.textContent)).toEqual(["A · Name A", "B · Name B", "C · Name C", "D · Name D", "E · Name E"]);
    expect(art(zeilen[0]!)).toEqual(["kritisch", "kritisch", "leer", "leer", "leer", "leer"]);
    expect(art(zeilen[2]!)).toEqual(["leer", "leer", "balken", "puffer", "puffer", "leer"]);
    expect(art(zeilen[4]!)).toEqual(["leer", "leer", "leer", "leer", "leer", "kritisch"]);
    const farbe = (art: string) => {
      const z = plan.querySelector(`[data-zelle="${art}"]`) as HTMLElement;
      return ["bg-destructive", "bg-chart-1", "bg-muted-foreground/30"].filter((k) => hat(z, k));
    };
    expect(farbe("kritisch")).toEqual(["bg-destructive"]);
    expect(farbe("balken")).toEqual(["bg-chart-1"]);
    expect(farbe("puffer")).toEqual(["bg-muted-foreground/30"]);
    expect(farbe("leer")).toEqual([]);
  });
});

describe("Buchung und neue Aufgabe", () => {
  it("bucht GEN:gantt einmal; 'Neue Aufgabe' laedt die naechste und leert alles", async () => {
    const n = nutzer();
    render(<Buehne />);
    await n.type(feld("Start-Tag", "A"), "1");
    await pruefen(n);
    const st = (JSON.parse(localStorage.getItem(LS_SCHLUESSEL) ?? "{}") as { statistik: Record<string, unknown> }).statistik;
    expect(st["GEN:gantt"]).toEqual({ richtig: 0, gesamt: 1 });
    await n.click(screen.getByRole("button", { name: "Neue Aufgabe →" }));
    expect(screen.getByText("Zweite")).toBeTruthy();
    expect(screen.queryByText("Erste")).toBeNull();
    expect(feld("Start-Tag", "A").value).toBe("");
    expect(feld("Start-Tag", "A").disabled).toBe(false);
    expect(screen.queryByText(/Feldern richtig/)).toBeNull();
  });
});
