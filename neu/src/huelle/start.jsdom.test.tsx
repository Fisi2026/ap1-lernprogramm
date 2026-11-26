// @vitest-environment jsdom
/* N38 P1 (E63, loest N32 Schritt 3 / E31 ab): die App zeichnet sofort; Bereiche mit Fragen warten
   mit „Fragen werden geladen …"; scheitert das Laden, sagen sie es und laden auf Wunsch erneut. */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, screen, fireEvent } from "@testing-library/react";
import { createRoot, type Root } from "react-dom/client";
import { starte } from "./start";

let wurzel: Root;
let behaelter: HTMLElement;
beforeEach(() => {
  localStorage.clear();
  history.replaceState(null, "", "#stat");
  behaelter = document.createElement("div");
  document.body.appendChild(behaelter);
  wurzel = createRoot(behaelter);
});
afterEach(() => { act(() => wurzel.unmount()); behaelter.remove(); vi.restoreAllMocks(); });

function aufgeschoben() {
  let fertig!: () => void, scheitere!: (e: unknown) => void;
  const p = new Promise<void>((j, n) => { fertig = j; scheitere = n; });
  return { p, fertig, scheitere };
}

describe("Start: App sofort, Pool im Hintergrund (N38 P1, E63)", () => {
  it("poolfreier Bereich steht sofort; ein Bereich mit Fragen wartet und erscheint mit dem Pool", async () => {
    const a = aufgeschoben();
    let lauf!: Promise<void>;
    await act(async () => { lauf = starte(wurzel, () => a.p); });
    expect(screen.getByRole("navigation", { name: "Bereiche" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Statistik" })).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
    await act(async () => { history.replaceState(null, "", "#fd"); window.dispatchEvent(new HashChangeEvent("hashchange")); });
    expect(screen.getByRole("status").textContent).toBe("Fragen werden geladen …");
    await act(async () => { a.fertig(); await lauf; });
    expect(screen.queryByText("Fragen werden geladen …")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("scheitert das Laden: nur der Bereich mit Fragen sagt es, „Nochmal versuchen\" lädt erneut", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    history.replaceState(null, "", "#fd");
    const laden = vi.fn()
      .mockImplementationOnce(() => Promise.reject(new Error("offline")))
      .mockImplementationOnce(() => Promise.resolve());
    await act(async () => { await starte(wurzel, laden); });
    expect(screen.getByRole("alert").textContent).toContain("konnten nicht geladen werden");
    expect(screen.getByRole("navigation", { name: "Bereiche" })).toBeTruthy();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Nochmal versuchen" })); });
    await act(async () => {});
    expect(laden).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
