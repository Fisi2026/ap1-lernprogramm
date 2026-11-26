// @vitest-environment jsdom
/* ============================================================================
   DAS NETZPLAN-TRAINING ÜBER DEN SCHIRM

   ⚠️ Die Aufgabe ist gewuerfelt, und der Test rechnet sie NICHT nach. Gemessen
      wird ueber Faelle, die ohne die Loesung auskommen: gar nichts eintragen,
      und die eine Zahl, die die Rechnung selbst zusichert (FAZ des ersten
      Vorgangs ohne Vorgaenger ist 0).
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";

function gespeichert(): Record<string, unknown> | null {
  const roh = localStorage.getItem(LS_SCHLUESSEL);
  return roh ? (JSON.parse(roh) as Record<string, unknown>) : null;
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

async function zumNetzplan(nutzer: ReturnType<typeof userEvent.setup>) {
  await nutzer.click(screen.getByRole("button", { name: "Netzplan" }));
}
const felder = () => screen.getAllByLabelText(/^(FAZ|FEZ|SAZ|SEZ|GP) für Vorgang /) as HTMLInputElement[];
const knoten = () => Array.from(document.querySelectorAll("[data-kritisch]"));

describe("Das Netzplan-Training ist über die Schiene erreichbar", () => {
  it("zeigt je Vorgang fuenf Eingabefelder — die Dauer steht fest", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumNetzplan(nutzer);
    expect(screen.queryByText(/noch nicht gebaut/)).toBeNull();

    expect(knoten().length).toBeGreaterThan(3);
    expect(felder().length).toBe(knoten().length * 5);
    /* Die Dauer ist keine Eingabe: es gibt kein Feld dafuer. */
    expect(screen.queryByLabelText(/Dauer für Vorgang/)).toBeNull();
  });

  it("hebt den kritischen Weg erst NACH dem Pruefen hervor", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumNetzplan(nutzer);
    expect(knoten().every((k) => k.getAttribute("data-kritisch") === "nein")).toBe(true);
    expect(screen.queryByText(/Kritischer Pfad:/)).toBeNull();

    await nutzer.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    expect(knoten().some((k) => k.getAttribute("data-kritisch") === "ja")).toBe(true);
    expect(screen.getByText(/Kritischer Pfad:/)).toBeTruthy();
  });

  it("zeigt nach dem Pruefen die Trefferzahl und den Loesungsweg", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumNetzplan(nutzer);
    const anzahl = felder().length;
    await nutzer.click(screen.getByRole("button", { name: "Netzplan prüfen" }));

    expect(screen.getByText("0 von " + anzahl + " Feldern richtig (0 %).")).toBeTruthy();
    expect(screen.getByText(/Kompletter Lösungsweg/)).toBeTruthy();
    /* ⛔⛔ DIE UEBERSCHRIFT IST NICHT DER LOESUNGSWEG. Der erste Anlauf prueste nur
       auf das Wort im <summary> — die Sabotage, die alle Zeilen darunter entfernt,
       blieb deshalb gruen. Gezaehlt werden jetzt die ZEILEN.
       N25 P6b: `<details>` ist ein `Collapsible` – gezaehlt wird in seinem Inhalt. */
    expect(document.querySelectorAll('[data-teil="loesungsweg"] [data-slot="collapsible-content"] span').length).toBeGreaterThan(5);
    expect(felder().every((f) => f.disabled)).toBe(true);
  });

  it("rechnet die Quote aus den wirklich richtigen Feldern", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumNetzplan(nutzer);
    const anzahl = felder().length;
    /* FAZ des ersten Vorgangs ohne Vorgaenger ist 0 — das sichert die
       Vorwaertsrechnung zu, und der Kern-Test misst es. */
    await nutzer.type(felder()[0], "0");
    await nutzer.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    const quote = Math.round((1 / anzahl) * 100);
    expect(screen.getByText("1 von " + anzahl + " Feldern richtig (" + quote + " %).")).toBeTruthy();
  });

  it("bucht GEN:netzplan und den Tag, aber kein Modul", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumNetzplan(nutzer);
    await nutzer.click(screen.getByRole("button", { name: "Netzplan prüfen" }));

    const s = gespeichert()!;
    const st = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    expect(Object.keys(st)).toEqual(["GEN:netzplan"]);
    expect(st["GEN:netzplan"]).toEqual({ richtig: 0, gesamt: 1 });
    expect(Object.keys(s.dailyCounts as object).length).toBe(1);
    expect(Object.keys(s.fehlerDeck as object)).toEqual([]);
  });

  it("zaehlt denselben Durchgang nicht zweimal", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumNetzplan(nutzer);
    await nutzer.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    expect(screen.queryByRole("button", { name: "Netzplan prüfen" })).toBeNull();
    const st = gespeichert()!.statistik as Record<string, { gesamt: number }>;
    expect(st["GEN:netzplan"].gesamt).toBe(1);
  });

  it("gibt auf Klick eine neue Aufgabe mit leeren, offenen Feldern", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumNetzplan(nutzer);
    await nutzer.type(felder()[0], "9");
    await nutzer.click(screen.getByRole("button", { name: "Netzplan prüfen" }));
    await nutzer.click(screen.getByRole("button", { name: "Neue Aufgabe →" }));

    expect(felder().every((f) => f.value === "")).toBe(true);
    expect(felder().every((f) => !f.disabled)).toBe(true);
    expect(knoten().every((k) => k.getAttribute("data-kritisch") === "nein")).toBe(true);
    expect(screen.queryByText(/Kritischer Pfad:/)).toBeNull();
  });
});
