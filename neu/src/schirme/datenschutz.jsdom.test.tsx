// @vitest-environment jsdom
/* AUD-A2 / AUD-B2 (Audit 26.09.2026): Datenschutzhinweis und Lernstand als Datei – in der echten App. */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL, DEFEKT_SCHLUESSEL, leererStand } from "@/kern/stand";
import { alsDatei } from "@/kern/lernstanddatei";
import { AUFBEWAHRUNG } from "@/server/api";
import { FRIST_TEXT, VERANTWORTLICH } from "@/kern/datenschutz";

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#einst"); });
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
const teil = (t: string) => document.querySelector(`[data-teil="${t}"]`) as HTMLElement;

describe("Datenschutzhinweis", () => {
  it("nennt Verantwortlichen, Kontakt, Hosting, Rechtsgrundlage und Rechte", () => {
    render(<App />);
    const d = teil("datenschutz");
    expect(d).not.toBeNull();
    expect(d.textContent).toContain(VERANTWORTLICH.name);
    expect(within(d).getByRole("link", { name: VERANTWORTLICH.mail }).getAttribute("href")).toBe("mailto:" + VERANTWORTLICH.mail);
    for (const s of ["Cloudflare", "Art. 6 Abs. 1 lit. f DSGVO", "Art. 15–21 DSGVO", "Aufsichtsbehörde", "keine IP-Adresse"]) {
      expect(d.textContent, s).toContain(s);
    }
    expect(d.textContent).not.toMatch(/anonym/i);
  });
  it("⛔ die genannten Fristen sind die, nach denen der Server wirklich löscht", () => {
    expect(FRIST_TEXT.erledigtTage).toBe(AUFBEWAHRUNG.erledigtTage);
    expect(FRIST_TEXT.fehlerTage).toBe(AUFBEWAHRUNG.fehlerTage);
    render(<App />);
    const s = teil("datenschutz-server").textContent ?? "";
    expect(s).toContain(`nach ${AUFBEWAHRUNG.erledigtTage} Tagen`);
    expect(s).toContain(`nach ${AUFBEWAHRUNG.fehlerTage} Tagen`);
  });
});

describe("Lernstand als Datei (Einstellungen → Speicher)", () => {
  it("„Lernstand speichern“ bietet eine JSON-Datei mit dem aktuellen Stand an", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), tagesziel: 41 }));
    const blobs: Blob[] = [];
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: (b: Blob) => { blobs.push(b); return "blob:x"; }, revokeObjectURL: () => {} }));
    const klick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(within(teil("lernstanddatei")).getByRole("button", { name: "Lernstand speichern" }));
    expect(klick).toHaveBeenCalledTimes(1);
    const inhalt = JSON.parse(await blobs[0]!.text());
    expect(inhalt.format).toBe("fisi-ap1-lernstand");
    expect(inhalt.stand.tagesziel).toBe(41);
  });

  it("Laden fragt erst, sichert den alten Stand und ersetzt dann", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), tagesziel: 7 }));
    const datei = new File([alsDatei({ ...leererStand(), tagesziel: 33 }, Date.UTC(2026, 8, 1), "2.2.0")], "s.json", { type: "application/json" });
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.upload(screen.getByLabelText("Lernstand-Datei wählen"), datei);
    const frage = await screen.findByRole("group", { name: "Lernstand ersetzen?" });
    expect(JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!).tagesziel, "vor der Rückfrage unverändert").toBe(7);
    await nutzer.click(within(frage).getByRole("button", { name: "Ersetzen" }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!).tagesziel).toBe(33));
    const sich = JSON.parse(localStorage.getItem(DEFEKT_SCHLUESSEL) ?? "[]") as { grund: string; roh: string }[];
    expect(sich.at(-1)?.grund).toMatch(/vor dem Laden/);
    expect(JSON.parse(sich.at(-1)!.roh).tagesziel).toBe(7);
    expect(screen.getByText(/Lernstand übernommen/)).toBeTruthy();
  });

  it("Abbrechen lässt den Stand stehen; eine fremde Datei wird mit Grund abgelehnt", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), tagesziel: 7 }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    const gut = new File([alsDatei({ ...leererStand(), tagesziel: 33 }, 0, "x")], "s.json", { type: "application/json" });
    await nutzer.upload(screen.getByLabelText("Lernstand-Datei wählen"), gut);
    await nutzer.click(within(await screen.findByRole("group", { name: "Lernstand ersetzen?" })).getByRole("button", { name: "Abbrechen" }));
    expect(screen.queryByRole("group", { name: "Lernstand ersetzen?" })).toBeNull();
    expect(JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!).tagesziel).toBe(7);
    await nutzer.upload(screen.getByLabelText("Lernstand-Datei wählen"), new File(['{"x":1}'], "f.json", { type: "application/json" }));
    expect(await screen.findByText("Das ist keine Lernstand-Datei dieser App.")).toBeTruthy();
    expect(screen.queryByRole("group", { name: "Lernstand ersetzen?" })).toBeNull();
  });
});
