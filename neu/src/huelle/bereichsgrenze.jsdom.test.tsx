// @vitest-environment jsdom
/* ============================================================================
   N32 Schritt 2 – SABOTAGE (Abnahme aus PLAN_NEUBAU): ein Wurf in EINEM Schirm
   -> nur dieser Bereich fällt. Schiene, Kopf und Lernstand bleiben, ein anderer
   Bereich zeichnet normal, der Bericht geht einmal hinaus und der Kasten sagt es.
   ============================================================================ */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, act, screen, fireEvent } from "@testing-library/react";
import App from "@/App";
import { LS_SCHLUESSEL, leererStand } from "@/kern/stand";

vi.mock("@/schirme/Statistik", () => ({
  Statistik: () => { throw new Error("Sabotage in Frage M03-907"); },
}));

let sende: ReturnType<typeof vi.fn>;
beforeEach(() => {
  cleanup();
  localStorage.clear();
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), pruefungsdatum: "2026-11-25" }));
  sende = vi.fn(async () => new Response("{}", { status: 201 }));
  vi.stubGlobal("fetch", sende);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

async function zeichne(hash: string) {
  history.replaceState(null, "", hash);
  render(<App />);
  await act(async () => {});
}
const berichte = () => sende.mock.calls.filter((c) => c[0] === "/api/fehler");

describe("Error Boundary je Bereich", () => {
  it("der sabotierte Bereich fällt, Schiene und Kopf bleiben, der Bericht geht einmal hinaus", async () => {
    const vorher = localStorage.getItem(LS_SCHLUESSEL);
    await zeichne("#stat");
    expect(screen.getByRole("alert").textContent).toContain("Dieser Bereich ist abgestürzt");
    expect(screen.getByRole("navigation", { name: "Bereiche" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Statistik" })).toBeTruthy();
    expect(berichte()).toHaveLength(1);
    const koerper = JSON.parse(String((berichte()[0]![1] as RequestInit).body));
    expect(koerper.bereich).toBe("stat");
    expect(JSON.stringify(koerper)).not.toMatch(/M\d{2}-\d{3}|pruefungsdatum|#stat/);
    expect(screen.getByRole("alert").textContent).toContain("Ein Fehlerbericht wurde gesendet");
    expect(localStorage.getItem(LS_SCHLUESSEL)).toBe(vorher);
  });

  it("„Zur Startseite\" führt heraus, und die Startseite zeichnet normal", async () => {
    await zeichne("#stat");
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Zur Startseite" })); });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(window.location.hash).toBe("#start");
  });

  it("ohne Netz sagt der Kasten, dass nichts gesendet wurde", async () => {
    sende.mockRejectedValue(new TypeError("offline"));
    await zeichne("#stat");
    expect(screen.getByRole("alert").textContent).toContain("konnte nicht gesendet werden");
  });

  it("ein anderer Bereich ist nicht betroffen und sendet nichts", async () => {
    await zeichne("#glossar");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(berichte()).toHaveLength(0);
  });
});
