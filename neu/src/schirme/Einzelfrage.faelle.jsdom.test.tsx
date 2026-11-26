// @vitest-environment jsdom
/* Einzelfrage: gefundene Frage mit Kopf und Wegen weiter; unbekannte oder fehlende Kennung mit Satz und Weg zur Startseite. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAGEN } from "@/daten/laden";
import { modulName } from "@/kern/markiert";
import { leererStand } from "@/kern/stand";
import type { StandHaken } from "@/huelle/useLernstand";
import { Einzelfrage } from "./Einzelfrage";

afterEach(cleanup);
const haken = () => ({ stand: { ...leererStand(), abrufAn: false }, aendere: vi.fn(), buche: vi.fn(), zeige: vi.fn() }) as unknown as StandHaken;
const F = FRAGEN[0]!;

describe("Einzelfrage", () => {
  it("unbekannte Kennung: Satz mit Kennung in Klammern, Weg zur Startseite", async () => {
    const geheZu = vi.fn();
    render(<Einzelfrage id="X99-999" lernstand={haken()} geheZu={geheZu} />);
    expect(screen.getByText("Diese Frage gibt es nicht (mehr). (X99-999)")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Normal weiterüben" })).toBeNull();
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: "Zur Startseite" }));
    expect(geheZu).toHaveBeenCalledExactlyOnceWith("start");
  });

  it("ohne Kennung: derselbe Satz ohne Klammern", () => {
    render(<Einzelfrage id={null} lernstand={haken()} geheZu={vi.fn()} />);
    const p = screen.getByText(/^Diese Frage gibt es nicht \(mehr\)\./);
    expect(p.textContent).toBe("Diese Frage gibt es nicht (mehr).");
  });

  it("gefundene Frage: Kopf mit Modul, Thema und Kennung; beide Wege führen weiter", async () => {
    const geheZu = vi.fn();
    render(<Einzelfrage id={F.id} lernstand={haken()} geheZu={geheZu} />);
    const kopf = document.querySelector('[data-teil="einzelfrage-kopf"]')!;
    expect(kopf.textContent).toContain(`${modulName(F.modul)} · ${F.thema} · ${F.id}`);
    expect(screen.getByText("Direkt aufgerufene Fragen zählen nicht für Statistik und Fehler-Deck.")).toBeTruthy();
    const n = userEvent.setup({ delay: null });
    await n.click(screen.getByRole("button", { name: "Zur Startseite" }));
    expect(geheZu).toHaveBeenLastCalledWith("start");
    await n.click(screen.getByRole("button", { name: "Normal weiterüben" }));
    expect(geheZu).toHaveBeenLastCalledWith("ueben");
    expect(geheZu).toHaveBeenCalledTimes(2);
  });
});
