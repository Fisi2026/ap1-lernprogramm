// @vitest-environment jsdom
/* Rückseite: Kurzerklärung vor/nach dem Prüfen, Aufklappen nach falscher Antwort, Ersatztexte bei Lücken im Pool. */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { Frage } from "@/daten/typen";
import { Rueckseite } from "./Rueckseite";

afterEach(cleanup);
const frage = (teil: Record<string, unknown> = {}) => ({
  typ: "mc", loesungIndex: 0, optionen: ["A", "B", "C"],
  erklaerungKurz: "Kurz", erklaerungLang: "Lang", verweis: "Kapitel 3",
  distraktorErklaerungen: ["", "weil B", "weil C"], ...teil,
}) as unknown as Frage;
const lang = () => document.querySelector('[data-teil="lang"]') as HTMLElement | null;

describe("Rückseite", () => {
  it("vor dem Prüfen nur der Hinweis, keine Erklärung, kein Aufklapper", () => {
    render(<Rueckseite frage={frage()} geprueft={false} />);
    expect(screen.getByText("Rückseite")).toBeTruthy();
    expect(screen.getByText("Erscheint nach dem Prüfen.")).toBeTruthy();
    expect(screen.queryByText("Kurz")).toBeNull();
    expect(lang()).toBeNull();
  });

  it("nach dem Prüfen die Kurzerklärung; ohne sie der Ersatzsatz", () => {
    render(<Rueckseite frage={frage()} geprueft />);
    expect(screen.getByText("Kurz")).toBeTruthy();
    expect(screen.queryByText("Erscheint nach dem Prüfen.")).toBeNull();
    cleanup();
    render(<Rueckseite frage={frage({ erklaerungKurz: "  " })} geprueft />);
    expect(screen.getByText("Zu dieser Frage ist keine Erklärung hinterlegt.")).toBeTruthy();
  });

  it("standardmäßig zu; mit aufklappen offen; ein später kommendes Urteil hängt neu ein und öffnet", () => {
    const { rerender } = render(<Rueckseite frage={frage()} geprueft />);
    expect(lang()!.getAttribute("data-state")).toBe("closed");
    rerender(<Rueckseite frage={frage()} geprueft aufklappen />);
    expect(lang()!.getAttribute("data-state")).toBe("open");
    expect(screen.getByText("Lang")).toBeTruthy();
    cleanup();
    render(<Rueckseite frage={frage()} geprueft aufklappen={false} />);
    expect(lang()!.getAttribute("data-state")).toBe("closed");
  });

  it("aufgeklappt: Distraktor-Erklärungen mit Option, Verweis als Text; Ersatztexte bei Lücken", () => {
    render(<Rueckseite frage={frage()} geprueft aufklappen />);
    expect(screen.getByText("Warum sind die anderen falsch?")).toBeTruthy();
    const punkte = Array.from(document.querySelectorAll('[data-teil="distraktoren"] li')).map((l) => l.textContent);
    expect(punkte).toEqual(["B: weil B", "C: weil C"]);
    expect(document.querySelector('[data-teil="verweis"]')!.textContent).toBe("Siehe Kapitel 3");
    cleanup();
    render(<Rueckseite frage={frage({ erklaerungLang: "", verweis: "", distraktorErklaerungen: undefined })} geprueft aufklappen />);
    expect(document.querySelector('[data-teil="distraktoren"]')).toBeNull();
    expect(screen.getAllByText("Kurz").length).toBeGreaterThan(1);   // Kurzfassung ersetzt die fehlende Langfassung
    expect(document.querySelector('[data-teil="verweis"]')!.textContent).toBe("Zu dieser Frage ist kein Verweis auf den Lehrtext hinterlegt.");
    cleanup();
    render(<Rueckseite frage={frage({ erklaerungLang: "", erklaerungKurz: "" })} geprueft aufklappen />);
    expect(screen.getByText("Zu dieser Frage ist keine ausführliche Erklärung hinterlegt.")).toBeTruthy();
  });
});
