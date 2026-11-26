// @vitest-environment jsdom
/* N31: die sichtbare Seite von E27 (Zuschauer, Uebernahme mit Rueckfrage) und E28 (Speicher). */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { Zuschauer } from "./Zuschauer";
import type { StandHaken } from "@/huelle/useLernstand";
import type { Lauf } from "@/kern/lernstandort";
import { LS_SCHLUESSEL, leererStand } from "@/kern/stand";

function haken(rolle: string, lauf: Lauf | null) {
  const quelle = { fremderLauf: vi.fn(async () => lauf), hierWeiter: vi.fn(async () => undefined) };
  return { h: { rolle, quelle } as unknown as StandHaken, quelle };
}
beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben"); });
afterEach(() => { Reflect.deleteProperty(navigator, "locks"); });

describe("Der Zuschauer-Hinweis", () => {
  it("erscheint nur im Zuschauer-Tab", () => {
    render(<Zuschauer lernstand={haken("aktiv", null).h} />);
    expect(screen.queryByText("Die App ist in einem anderen Tab offen")).toBeNull();
  });
  it("laeuft nichts, uebernimmt der Knopf ohne Rueckfrage", async () => {
    const { h, quelle } = haken("zuschauer", null);
    const nutzer = userEvent.setup({ delay: null });
    render(<Zuschauer lernstand={h} />);
    await nutzer.click(screen.getByRole("button", { name: "Hier weiterarbeiten" }));
    expect(quelle.fremderLauf).toHaveBeenCalledTimes(1);
    expect(quelle.hierWeiter).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("laeuft dort eine Simulation, fragt er zurueck - Abbrechen uebernimmt nicht", async () => {
    const { h, quelle } = haken("zuschauer", "simulation");
    /* ⚠️ Radix laesst nach dem Schliessen in jsdom `pointer-events: none` am body stehen
       (keine Animation, die es aufhebt) - im Browser nicht; deshalb ohne diese Pruefung. */
    const nutzer = userEvent.setup({ delay: null, pointerEventsCheck: 0 });
    render(<Zuschauer lernstand={h} />);
    await nutzer.click(screen.getByRole("button", { name: "Hier weiterarbeiten" }));
    const d = screen.getByRole("dialog");
    expect(d.textContent).toContain("Im anderen Tab läuft eine Prüfungssimulation");
    expect(quelle.hierWeiter).not.toHaveBeenCalled();
    await nutzer.click(within(d).getByRole("button", { name: "Abbrechen" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(quelle.hierWeiter).not.toHaveBeenCalled();
    await nutzer.click(screen.getByRole("button", { name: "Hier weiterarbeiten" }));
    await nutzer.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Trotzdem hier weiter" }));
    expect(quelle.hierWeiter).toHaveBeenCalledTimes(1);
  });
  it("in der App: der Rest ist inert, solange dieser Tab Zuschauer ist", async () => {
    Object.defineProperty(navigator, "locks", {
      configurable: true,
      value: { request: (_n: string, opt: { ifAvailable?: boolean }, cb: (l: unknown) => unknown) =>
        (opt.ifAvailable ? Promise.resolve(cb(null)) : new Promise(() => { /* haengt absichtlich */ })) },
    });
    render(<App />);
    expect(await screen.findByText("Die App ist in einem anderen Tab offen")).toBeTruthy();
    const huelle = screen.getByRole("navigation").closest("[inert]");
    expect(huelle).not.toBeNull();
    expect(huelle!.contains(screen.getByRole("button", { name: "Hier weiterarbeiten" }))).toBe(false);
  });
  it("ohne navigator.locks ist nichts inert", () => {
    render(<App />);
    expect(document.querySelector("[inert]")).toBeNull();
  });
});

describe("Einstellungen - Speicher (E28)", () => {
  it("nennt die Reparatur, die Sicherung und den dauerhaften Speicher", () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), seen: "kaputt" }));
    history.replaceState(null, "", "#einst");
    const { container } = render(<App />);
    const teil = container.querySelector("[data-teil='speicher']") as HTMLElement;
    expect(teil).not.toBeNull();
    expect(teil.textContent).toContain("Eine Stelle repariert – das Original ist auf diesem Gerät gesichert.");
    expect(teil.textContent).toContain("Feld „seen“ war string statt objekt – Vorgabe gesetzt");
    expect(teil.textContent).toContain("Eine Sicherung eines früheren Stands (nicht lesbar, repariert oder vor dem Laden einer Datei) liegt auf diesem Gerät"); /* Einzahl - stand bis 23.09. als „liegen" */
    expect(teil.querySelector("[data-dauerhaft]")?.getAttribute("data-dauerhaft")).toBe("fehlt");
  });
  it("ein sauberer Stand: ohne Reparatur, keine Sicherung", () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify(leererStand()));
    history.replaceState(null, "", "#einst");
    const { container } = render(<App />);
    const teil = container.querySelector("[data-teil='speicher']") as HTMLElement;
    expect(teil.textContent).toContain("Ohne Reparatur.");
    expect(teil.textContent).not.toContain("Sicherung");
  });
});

describe("Laufende Durchgaenge melden sich im Kanal (echte App, echter BroadcastChannel)", () => {
  /* ⛔ Lehre N11: ein Zweig, den kein Aufrufer erreicht, ist kein Feature. Die Rueckfrage
     haengt daran, dass Simulation und Serie sich wirklich melden - hier in der App gemessen. */
  function halteSperre() {
    Object.defineProperty(navigator, "locks", {
      configurable: true,
      value: { request: (_n: string, _o: unknown, cb: (l: unknown) => unknown) => { void cb({}); return new Promise(() => { /* haengt absichtlich */ }); } },
    });
  }
  async function frage(): Promise<unknown> {
    const k = new BroadcastChannel("fisi_ap1_stand");
    try {
      return await new Promise((res) => {
        k.onmessage = (e) => { if ((e.data as { art?: string })?.art === "status") res((e.data as { lauf: unknown }).lauf); };
        k.postMessage({ art: "frage", id: "test" });
        setTimeout(() => res("keine Antwort"), 500);
      });
    } finally {
      k.close();
    }
  }
  it("die Pruefungssimulation - erst ab dem Start", async () => {
    halteSperre();
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Prüfungssimulation" }));
    expect(await frage()).toBeNull();
    const feld = screen.getByLabelText("Aufgaben insgesamt");
    await nutzer.clear(feld);
    await nutzer.type(feld, "12");
    await nutzer.click(screen.getByRole("button", { name: "Prüfung starten" }));
    expect(await frage()).toBe("simulation");
  });
  it("die Tagesserie", async () => {
    halteSperre();
    history.replaceState(null, "", "#serie");
    render(<App />);
    expect(await frage()).toBe("serie");
  });
});
