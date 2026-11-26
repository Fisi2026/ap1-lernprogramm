// @vitest-environment jsdom
/* ============================================================================
   DAS GANTT-TRAINING ÜBER DEN SCHIRM

   ⛔⛔ Der Weg geht über die Werkzeugschiene — dort sagte der Bereich bisher
      "noch nicht gebaut".
   ⚠️ DIE AUFGABE IST GEWUERFELT, und der Test rechnet sie NICHT nach — sonst
      stuende hier eine zweite Fassung von `L.ganttBerechne`. Gemessen wird ueber
      Faelle, die ohne die Loesung auskommen: gar nichts eintragen (0 Treffer),
      und genau EIN Feld, dessen Wert die Rechnung selbst zusichert (der erste
      Vorgang ohne Vorgaenger startet an Tag 1).
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

async function zumGantt(nutzer: ReturnType<typeof userEvent.setup>) {
  await nutzer.click(screen.getByRole("button", { name: "Gantt" }));
}
const felder = () => screen.getAllByLabelText(/^(Start|End)-Tag /) as HTMLInputElement[];

describe("Das Gantt-Training ist über die Schiene erreichbar", () => {
  it("stellt eine Aufgabe mit zwei Feldern je Vorgang — und zeigt den Balkenplan noch NICHT", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGantt(nutzer);
    expect(screen.queryByText(/noch nicht gebaut/)).toBeNull();

    expect(felder().length).toBeGreaterThanOrEqual(6);
    expect(felder().length % 2).toBe(0);
    /* ⛔ Der Balkenplan IST die Loesung — vor dem Pruefen hat er dort nichts zu suchen. */
    expect(screen.queryByLabelText("Balkenplan")).toBeNull();
    expect(screen.queryByText(/Kompletter Lösungsweg/)).toBeNull();
  });

  it("zeigt nach dem Pruefen Balkenplan, Loesungsweg und die Trefferzahl", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGantt(nutzer);
    const anzahl = felder().length;
    await nutzer.click(screen.getByRole("button", { name: "Planung prüfen" }));

    /* ⚠️ Als GANZER Satz, nicht als Regex: die Klammern im Prozentteil muessten
       dort maskiert werden, und genau daran ist der erste Anlauf gescheitert. */
    expect(screen.getByText("0 von " + anzahl + " Feldern richtig (0 %).")).toBeTruthy();
    expect(screen.getByLabelText("Balkenplan")).toBeTruthy();
    expect(screen.getByText(/Kompletter Lösungsweg/)).toBeTruthy();
    /* N25 P6b: der Loesungsweg ist ein `Collapsible`, zu wie vorher. ⛔ Die Ueberschrift ist
       NICHT der Weg (Lehre aus dem Netzplan): zu steht keine Zeile im DOM, aufgeklappt mehrere. */
    const zeilen = () => document.querySelectorAll('[data-teil="loesungsweg"] [data-slot="collapsible-content"] span').length;
    expect(zeilen()).toBe(0);
    await nutzer.click(screen.getByRole("button", { name: "Kompletter Lösungsweg" }));
    expect(zeilen()).toBeGreaterThan(3);
    expect(screen.getByText(/Projektdauer:/)).toBeTruthy();
    /* Jedes falsche Feld sagt, was richtig gewesen waere. */
    expect(screen.getAllByText(/^richtig: /).length).toBe(anzahl);
    expect(felder().every((f) => f.disabled)).toBe(true);
  });

  /* ⛔ EIN einziges richtiges Feld, der Rest leer — und die Quote muss genau dazu
     passen. Der Wert ist der einzige, den man ohne Nachrechnen kennt. */
  it("rechnet die Quote aus den wirklich richtigen Feldern", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGantt(nutzer);
    const anzahl = felder().length;
    /* Der erste Vorgang ohne Vorgaenger startet immer an Tag 1 — das ist die
       Zusage von L.ganttBerechne und steht so auch im Kern-Test. */
    await nutzer.type(felder()[0], "1");
    await nutzer.click(screen.getByRole("button", { name: "Planung prüfen" }));

    const quote = Math.round((1 / anzahl) * 100);
    expect(screen.getByText("1 von " + anzahl + " Feldern richtig (" + quote + " %).")).toBeTruthy();
    expect(screen.getAllByText(/^richtig: /).length).toBe(anzahl - 1);
  });

  it("bucht GEN:gantt und den Tag, aber kein Modul", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGantt(nutzer);
    await nutzer.click(screen.getByRole("button", { name: "Planung prüfen" }));

    const s = gespeichert()!;
    const st = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    expect(Object.keys(st)).toEqual(["GEN:gantt"]);
    expect(st["GEN:gantt"]).toEqual({ richtig: 0, gesamt: 1 });
    expect(Object.keys(s.dailyCounts as object).length).toBe(1);
    expect(Object.keys(s.fehlerDeck as object)).toEqual([]);
  });

  it("zaehlt denselben Durchgang nicht zweimal", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGantt(nutzer);
    await nutzer.click(screen.getByRole("button", { name: "Planung prüfen" }));
    expect(screen.queryByRole("button", { name: "Planung prüfen" })).toBeNull();
    const st = gespeichert()!.statistik as Record<string, { gesamt: number }>;
    expect(st["GEN:gantt"].gesamt).toBe(1);
  });

  it("gibt auf Klick eine neue Aufgabe mit leeren, offenen Feldern", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGantt(nutzer);
    await nutzer.type(felder()[0], "7");
    await nutzer.click(screen.getByRole("button", { name: "Planung prüfen" }));
    await nutzer.click(screen.getByRole("button", { name: "Neue Aufgabe →" }));

    expect(felder().every((f) => f.value === "")).toBe(true);
    expect(felder().every((f) => !f.disabled)).toBe(true);
    expect(screen.queryByLabelText("Balkenplan")).toBeNull();
    expect(screen.getByRole("button", { name: "Planung prüfen" })).toBeTruthy();
    /* Der alte Durchgang bleibt gebucht — eine neue Aufgabe loescht nichts. */
    const st = gespeichert()!.statistik as Record<string, { gesamt: number }>;
    expect(st["GEN:gantt"].gesamt).toBe(1);
  });
});
