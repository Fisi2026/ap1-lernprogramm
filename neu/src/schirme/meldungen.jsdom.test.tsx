// @vitest-environment jsdom
/* ============================================================================
   N20b: ONLINE-MELDUNGEN AUF DEM SCHIRM

   ⛔ Das Netz wird ersetzt (`fetch` bzw. die `sende`-Eigenschaft), der Rest ist
      die echte App: echter Melde-Dialog, echter Speicher, echte Verdrahtung.
   ============================================================================ */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { S_SCHLANGE, schlange } from "@/kern/meldeversand";
import type { Sende } from "@/kern/meldeversand";
import { Meldungsliste, S_SCHLUESSEL } from "./Meldungsliste";

const A = FRAGEN.find((f) => f.typ === "mc")!;
const antwort = (status: number, daten: unknown = {}) =>
  Promise.resolve(new Response(JSON.stringify(daten), { status, headers: { "content-type": "application/json" } }));
function stelleFrage() {
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
    version: 1, uebenZaehler: 4, fehlerDeck: { [A.id]: { streak: 0, due: Date.now() - 86400000 } },
  }));
}
const versand = () => document.querySelector('[data-teil="versand"]')?.textContent ?? "";

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });
afterEach(() => { vi.unstubAllGlobals(); });

describe("Der Melde-Dialog schickt online", () => {
  it("angekommen: „übermittelt“, Schlange leer, Hinweis auf den Datenschutz, richtiger Körper", async () => {
    stelleFrage();
    const netz = vi.fn((..._a: unknown[]) => antwort(201, { nr: 7 }));
    vi.stubGlobal("fetch", netz);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByText("⚑ Frage melden"));
    /* AUD-A2: pseudonym (Gerätekennung) ist nicht anonym – das Wort darf nicht mehr fallen. */
    expect(screen.getByText(/an den Betreiber der App – ohne deinen Namen/)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/anonym/i);
    await nutzer.click(screen.getByRole("radio", { name: "Veraltet" }));
    await nutzer.click(screen.getByRole("button", { name: "Melden" }));
    await waitFor(() => expect(versand()).toMatch(/an den Betreiber übermittelt/));
    expect(netz).toHaveBeenCalledTimes(1);
    const [url, init] = netz.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/meldung");
    const koerper = JSON.parse(String(init.body));
    expect(koerper).toMatchObject({ frageId: A.id, grund: "Veraltet", text: "" });
    expect(koerper.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(schlange(localStorage)).toEqual([]);
    expect(screen.getByText(/löscht sie nur auf diesem Gerät/)).toBeTruthy();
  });

  it("ohne Netz „wartet“, beim nächsten Start nachgeschickt", async () => {
    stelleFrage();
    const offline = vi.fn(() => Promise.reject(new TypeError("offline")));
    vi.stubGlobal("fetch", offline);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByText("⚑ Frage melden"));
    await nutzer.click(screen.getByRole("button", { name: "Melden" }));
    await waitFor(() => expect(offline).toHaveBeenCalled());
    await waitFor(() => expect(versand()).toMatch(/wartet auf Verbindung/));
    expect(schlange(localStorage)).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!).meldungen[A.id].grund).toBe("Sonstiges");

    cleanup();
    const online = vi.fn((..._a: unknown[]) => antwort(201, { nr: 1 }));
    vi.stubGlobal("fetch", online);
    render(<App />);
    await waitFor(() => expect(online).toHaveBeenCalledTimes(1));
    expect(online.mock.calls[0][0]).toBe("/api/meldung");
    await waitFor(() => expect(schlange(localStorage)).toEqual([]));
  });

  it("beim Ereignis „online“ wird nachgeschickt", async () => {
    localStorage.setItem(S_SCHLANGE, JSON.stringify([{ frageId: A.id, grund: "Tippfehler", text: "", datum: 5 }]));
    const netz = vi.fn()
      .mockImplementationOnce(() => Promise.reject(new TypeError("offline")))
      .mockImplementation(() => antwort(201));
    vi.stubGlobal("fetch", netz);
    render(<App />);
    await waitFor(() => expect(netz).toHaveBeenCalledTimes(1));
    expect(schlange(localStorage)).toHaveLength(1);
    window.dispatchEvent(new Event("online"));
    await waitFor(() => expect(netz).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(schlange(localStorage)).toEqual([]));
  });

  it("Entfernen vor dem Senden nimmt die Meldung aus der Schlange", async () => {
    stelleFrage();
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("offline"))));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByText("⚑ Frage melden"));
    await nutzer.click(screen.getByRole("button", { name: "Melden" }));
    await waitFor(() => expect(schlange(localStorage)).toHaveLength(1));
    await nutzer.click(screen.getByRole("button", { name: "Meldung entfernen" }));
    expect(schlange(localStorage)).toEqual([]);
  });
});

describe("Die geschützte Ansicht", () => {
  const ZEILEN = [
    { nr: 2, frage_id: A.id, grund: "Veraltet", text: "Norm neu", erstellt: 1789600000000, fassung: "neu", version: "1.29.0", status: "offen", erledigt: null },
  ];

  it("fragt den Schlüssel ab, merkt ihn, lädt mit Bearer und setzt erledigt", async () => {
    const sende = vi.fn<Sende>((url) =>
      url.startsWith("/api/meldungen?") ? antwort(200, { meldungen: ZEILEN }) : antwort(200, { nr: 2, status: "erledigt" }));
    const nutzer = userEvent.setup({ delay: null });
    render(<Meldungsliste sende={sende} />);
    expect(sende).not.toHaveBeenCalled();
    await nutzer.type(screen.getByLabelText("Schlüssel"), "geheimer-schluessel-123");
    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    expect(localStorage.getItem(S_SCHLUESSEL)).toBe("geheimer-schluessel-123");
    await waitFor(() => expect(document.querySelector('[data-teil="meldungsliste"]')).not.toBeNull());
    expect(sende.mock.calls[0][0]).toBe("/api/meldungen?status=offen");
    expect((sende.mock.calls[0][1].headers as Record<string, string>).authorization).toBe("Bearer geheimer-schluessel-123");
    const liste = document.querySelector('[data-teil="meldungsliste"]') as HTMLElement;
    expect(liste.textContent).toContain(A.id);
    expect(liste.textContent).toContain("Veraltet: Norm neu");
    /* N25 P5: die Liste ist eine Liste – je Meldung ein `listitem`. */
    expect(within(liste).getAllByRole("listitem")).toHaveLength(ZEILEN.length);

    await nutzer.click(within(liste).getByRole("button", { name: "Meldung 2 erledigt" }));
    await waitFor(() => expect(sende.mock.calls.some(([u]) => u === "/api/meldungen/2/status")).toBe(true));
    const aufruf = sende.mock.calls.find(([u]) => u === "/api/meldungen/2/status")!;
    expect(aufruf[1].method).toBe("POST");
    expect((aufruf[1].headers as Record<string, string>).authorization).toBe("Bearer geheimer-schluessel-123");
    expect(JSON.parse(String(aufruf[1].body))).toEqual({ status: "erledigt" });
    /* danach wird neu geladen */
    await waitFor(() => expect(sende.mock.calls.filter(([u]) => u.startsWith("/api/meldungen?")).length).toBe(2));
  });

  it("der Filter lädt mit dem gewählten Status", async () => {
    localStorage.setItem(S_SCHLUESSEL, "geheimer-schluessel-123");
    const sende = vi.fn<Sende>(() => antwort(200, { meldungen: [] }));
    const nutzer = userEvent.setup({ delay: null });
    render(<Meldungsliste sende={sende} />);
    await waitFor(() => expect(screen.getByText("Keine Meldungen in dieser Auswahl.")).toBeTruthy());
    await nutzer.click(screen.getByRole("radio", { name: "alle" }));
    await waitFor(() => expect(sende.mock.calls.map(([u]) => u)).toContain("/api/meldungen?status=alle"));
  });

  it("AUD-C5: „Ältere laden“ holt die nächste Seite mit vor=<kleinste Nummer> und hängt sie an", async () => {
    localStorage.setItem(S_SCHLUESSEL, "geheimer-schluessel-123");
    const z = (nr: number) => ({ ...ZEILEN[0], nr });
    const sende = vi.fn<Sende>((url) => url.includes("vor=")
      ? antwort(200, { meldungen: [z(3)], weitere: false })
      : antwort(200, { meldungen: [z(5), z(4)], weitere: true }));
    const nutzer = userEvent.setup({ delay: null });
    render(<Meldungsliste sende={sende} />);
    await nutzer.click(await screen.findByRole("button", { name: "Ältere laden" }));
    await waitFor(() => expect(within(document.querySelector('[data-teil="meldungsliste"]') as HTMLElement).getAllByRole("listitem")).toHaveLength(3));
    expect(sende.mock.calls.map(([u]) => u)).toContain("/api/meldungen?status=offen&vor=4");
    expect(screen.queryByRole("button", { name: "Ältere laden" })).toBeNull();
  });

  it("falscher Schlüssel: Satz statt Liste; „Schlüssel vergessen“ löscht ihn", async () => {
    localStorage.setItem(S_SCHLUESSEL, "falsch-falsch-falsch");
    const nutzer = userEvent.setup({ delay: null });
    render(<Meldungsliste sende={() => antwort(401, { fehler: "x" })} />);
    await waitFor(() => expect(screen.getByText("Der Schlüssel ist falsch.")).toBeTruthy());
    expect(document.querySelector('[data-teil="meldungsliste"]')).toBeNull();
    await nutzer.click(screen.getByRole("button", { name: "Schlüssel vergessen" }));
    expect(localStorage.getItem(S_SCHLUESSEL)).toBeNull();
    expect(screen.getByLabelText("Schlüssel")).toBeTruthy();
  });

  it("nicht eingerichtet und ohne Netz: jeweils ein eigener Satz", async () => {
    localStorage.setItem(S_SCHLUESSEL, "irgendein-schluessel-1");
    render(<Meldungsliste sende={() => antwort(503)} />);
    await waitFor(() => expect(screen.getByText(/noch nicht eingerichtet/)).toBeTruthy());
    cleanup();
    render(<Meldungsliste sende={() => Promise.reject(new TypeError("x"))} />);
    await waitFor(() => expect(screen.getByText("Keine Verbindung zum Server.")).toBeTruthy());
  });

  it("ist über die Einstellungen erreichbar und steht NICHT in der Schiene", async () => {
    vi.stubGlobal("fetch", vi.fn(() => antwort(200, { meldungen: [] })));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.queryByRole("button", { name: /Meldungen aller Lerner/ })).toBeNull();
    await nutzer.click(screen.getByRole("button", { name: "Einstellungen" }));
    await nutzer.click(screen.getByRole("button", { name: "Meldungen aller Lerner öffnen" }));
    expect(screen.getByLabelText("Schlüssel")).toBeTruthy();
  });
});
