// @vitest-environment jsdom
/* ============================================================================
   KEIN TASCHENRECHNER IN DER SIMULATION (N26 T4, Entscheid 21.07.2026)

   ⛔⛔ GEMESSEN 22.09.2026: von 53 Rechenfragen ist KEINE `simBewertbar`, in 200
      gezogenen Pruefungen kam keine vor. Ein Test, der nur durch eine echte
      Simulation klickt, waere also IMMER gruen - er haette nichts gemessen.
   ►► Deshalb schiebt dieses vi.mock eine rechenassistent-Frage an Platz 1 der
      Pruefung. Erst dann ist „kein Rechner" eine Aussage ueber den Schirm - und
      nicht ueber den Pool. Geprueft wird ausdruecklich, dass sie wirklich dasteht.
   ============================================================================ */
import { describe, it, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { FRAGEN } from "@/daten/laden";

const RECHEN = FRAGEN.find((f) => f.typ === "rechenassistent")!;
/* Der Text ist instanziiert ({dauerA} → Zahl): verglichen wird der feste Anfang. */
const ANFANG = RECHEN.frage.split("{")[0]!.trim();
const alsMuster = (s: string) => new RegExp("^" + s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

vi.mock("@/kern/simulation", async (original) => {
  const o = await original<typeof import("@/kern/simulation")>();
  const { FRAGEN: F } = await import("@/daten/laden");
  const r = F.find((f) => f.typ === "rechenassistent")!;
  return {
    ...o,
    bauePruefung: (...a: Parameters<typeof o.bauePruefung>) => {
      const p = o.bauePruefung(...a);
      return { ...p, fragen: [r, ...p.fragen.slice(1)] };
    },
  };
});

describe("Prüfungssimulation", () => {
  it("zeigt bei einer Rechenfrage KEINE Rechner-Klappe - auf keiner Seite", async () => {
    localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Prüfungssimulation" }));
    const feld = screen.getByLabelText("Aufgaben insgesamt");
    await nutzer.clear(feld);
    await nutzer.type(feld, "12");
    await nutzer.click(screen.getByRole("button", { name: "Prüfung starten" }));

    expect(ANFANG.length).toBeGreaterThan(30);
    expect(screen.getByText(alsMuster(ANFANG))).toBeTruthy();          // die Rechenfrage steht wirklich auf Seite 1
    const seiten = screen.getAllByRole("button", { name: /^Frage \d+$/ });
    expect(seiten.length).toBeGreaterThanOrEqual(12);
    for (const s of seiten) {
      await nutzer.click(s);
      expect(screen.queryByRole("button", { name: "Taschenrechner" }), s.textContent ?? "").toBeNull();
      expect(screen.queryByRole("group", { name: "Tasten" })).toBeNull();
    }
  });
});
