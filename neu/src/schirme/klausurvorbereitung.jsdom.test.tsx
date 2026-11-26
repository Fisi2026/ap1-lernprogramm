// @vitest-environment jsdom
/* K2 (PLAN_KLAUSUR2.md), seit K3 L1 am Set K3: die Klausurvorbereitung uebt das Set – echte App, echter Klick, echter Speicher.
   Vorher (N28, E47) nur ein Zaehlschirm fuer M09; der M09-Waechter bleibt unten stehen. */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { unterrichtsBestand } from "@/kern/auswahl";
import { KLAUSUR_SET, klausurIds } from "@/kern/klausur";

function gespeichert(): Record<string, unknown> {
  return JSON.parse(localStorage.getItem(LS_SCHLUESSEL) ?? "{}") as Record<string, unknown>;
}

/** Erzwingt die Frage ueber den Fehler-Deck-Takt (wie ueben.jsdom.test.tsx). */
function stelleFrage(id: string, extra: Record<string, unknown> = {}) {
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
    version: 1, abrufAn: false, uebenZaehler: 4,
    fehlerDeck: { [id]: { streak: 0, due: Date.now() - 86400000 } }, ...extra,
  }));
}

beforeEach(() => {
  localStorage.clear();
  cleanup();
  history.replaceState(null, "", "#unterricht");
});

describe("Klausurvorbereitung (Set K3)", () => {
  it("zeigt die Themen mit gezaehlter Menge und zieht eine Frage aus dem Set", () => {
    render(<App />);
    const gruppe = screen.getByRole("group", { name: "Themen der Klausur" });
    expect(within(gruppe).getAllByRole("button")).toHaveLength(1 + KLAUSUR_SET.themen.length);
    expect(within(gruppe).getByRole("button", { name: /Alle Themen/ }).getAttribute("aria-pressed")).toBe("true");
    const id = screen.getByText(/^M\d\d-\d+$/).textContent!;
    expect(klausurIds(KLAUSUR_SET, []).has(id)).toBe(true);
  });

  it("K2-E11: die Antwort wird ganz normal gebucht – auch bei Ueben-Auswahl „nur AP1“ und anderem Gebiet", async () => {
    const ids = klausurIds(KLAUSUR_SET, [2]);
    const frage = FRAGEN.find((f) => ids.has(f.id) && f.typ === "mc")!;
    stelleFrage(frage.id, { uebenAP: "ap1", gebiete: ["A5"] });
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(frage.id);
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
    const s = gespeichert();
    expect(s.fehlerDeck).toHaveProperty(frage.id);
    const statistik = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    expect(statistik[frage.modul]).toEqual({ richtig: 0, gesamt: 1 });
    expect(s.gebiete, "die Auswahl des Ueben-Bereichs bleibt unberuehrt").toEqual(["A5"]);
  });

  it("K2-E17: ein Thema waehlen – die naechste Frage kommt aus diesem Thema", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    const thema = KLAUSUR_SET.themen.find((t) => t.nr === 3)!;   /* Thema ohne Generator: jede Frage traegt eine Pool-ID */
    const gruppe = screen.getByRole("group", { name: "Themen der Klausur" });
    await nutzer.click(within(gruppe).getByRole("button", { name: new RegExp(thema.titel) }));
    expect(within(gruppe).getByRole("button", { name: /Alle Themen/ }).getAttribute("aria-pressed")).toBe("false");
    for (let i = 0; i < 4; i++) {
      const id = screen.getByText(/^M\d\d-\d+$/).textContent!;
      expect(thema.ids, id).toContain(id);
      await nutzer.click(screen.getByRole("button", { name: "Nächste Frage →" }));
    }
  });

  /* ⚠️ Stand-Waechter (E46/E47): M09 bleibt leer – die Klausur laeuft ueber das Set, nicht ueber M09. */
  it("heutiger Pool: 0 Fragen in M09", () => {
    expect(FRAGEN.length).toBeGreaterThan(1000);
    expect(unterrichtsBestand(FRAGEN)).toBe(0);
  });
});
