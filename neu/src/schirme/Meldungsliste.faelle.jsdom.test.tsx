// @vitest-environment jsdom
/* Meldungsliste: Antwortprüfung, Fehlertexte, Seiten, überholte Antworten, Zeilenanzeige und Statuswechsel.
   Das Netz ist die `sende`-Eigenschaft; alles andere ist die echte Ansicht. */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAGEN } from "@/daten/laden";
import type { Sende } from "@/kern/meldeversand";
import { Meldungsliste, S_SCHLUESSEL } from "./Meldungsliste";

const A = FRAGEN[0]!;
const antwort = (status: number, daten: unknown = {}) =>
  Promise.resolve(new Response(JSON.stringify(daten), { status, headers: { "content-type": "application/json" } }));
const zeile = (nr: number, mehr: Record<string, unknown> = {}) => ({
  nr, frage_id: A.id, grund: "Veraltet", text: "Norm neu", erstellt: 1789600000000,
  fassung: "neu", version: "1.29.0", status: "offen", erledigt: null, ...mehr,
});
const liste = () => document.querySelector('[data-teil="meldungsliste"]') as HTMLElement | null;
const fehler = () => document.querySelector('[data-teil="fehler"]');
const nutzer = () => userEvent.setup({ delay: null });

beforeEach(() => { localStorage.clear(); localStorage.setItem(S_SCHLUESSEL, "schluessel-12345"); });
afterEach(cleanup);

describe("Antwortprüfung", () => {
  const kaputt: [string, Record<string, unknown>][] = [
    ["nr", { nr: "2" }], ["frage_id", { frage_id: 5 }], ["grund", { grund: null }], ["text", { text: 1 }],
    ["erstellt", { erstellt: "gestern" }], ["fassung", { fassung: 3 }], ["version", { version: null }],
    ["status", { status: "irgendwas" }], ["erledigt", { erledigt: "gestern" }],
  ];
  it.each(kaputt)("ein ungültiges Feld (%s) macht die ganze Antwort unlesbar", async (_n, mehr) => {
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [zeile(1), zeile(2, mehr)] })} />);
    await waitFor(() => expect(screen.getByText("Antwort des Servers unlesbar.")).toBeTruthy());
    expect(liste()).toBeNull();
  });

  it("Körper ohne Liste, mit Nicht-Objekt oder als Liste: unlesbar", async () => {
    for (const koerper of [{}, [], "text", null]) {
      render(<Meldungsliste sende={() => antwort(200, koerper)} />);
      await waitFor(() => expect(screen.getByText("Antwort des Servers unlesbar.")).toBeTruthy());
      cleanup();
    }
  });

  it("erledigte Zeile mit Zeitstempel ist gültig", async () => {
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [zeile(4, { status: "erledigt", erledigt: 1789700000000 })] })} />);
    await waitFor(() => expect(liste()).not.toBeNull());
    expect(fehler()).toBeNull();
  });
});

describe("Fehlertexte", () => {
  it("503, 401 und anderer Status beim Laden haben je ihren Satz", async () => {
    render(<Meldungsliste sende={() => antwort(503)} />);
    await waitFor(() => expect(fehler()?.textContent).toBe("Die Ansicht ist auf dem Server noch nicht eingerichtet (kein Schlüssel hinterlegt)."));
    cleanup();
    render(<Meldungsliste sende={() => antwort(401)} />);
    await waitFor(() => expect(fehler()?.textContent).toBe("Der Schlüssel ist falsch."));
    cleanup();
    render(<Meldungsliste sende={() => antwort(500)} />);
    await waitFor(() => expect(fehler()?.textContent).toBe("Fehler 500"));
  });

  it("ohne Fehler gibt es keinen Fehlerabsatz", async () => {
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [zeile(1)] })} />);
    await waitFor(() => expect(liste()).not.toBeNull());
    expect(fehler()).toBeNull();
  });

  it("Statuswechsel: Server-Fehler zeigt seinen Satz, lädt NICHT neu, die Liste bleibt", async () => {
    for (const [status, text] of [[500, "Fehler 500"], [401, "Der Schlüssel ist falsch."], [503, /noch nicht eingerichtet/]] as const) {
      const sende = vi.fn<Sende>((url) => url.startsWith("/api/meldungen?") ? antwort(200, { meldungen: [zeile(7)] }) : antwort(status));
      render(<Meldungsliste sende={sende} />);
      await nutzer().click(await screen.findByRole("button", { name: "Meldung 7 erledigt" }));
      await waitFor(() => expect(fehler()?.textContent).toMatch(text));
      expect(sende.mock.calls.filter(([u]) => u.startsWith("/api/meldungen?"))).toHaveLength(1);
      expect(liste()).not.toBeNull();
      cleanup();
    }
  });

  it("Statuswechsel ohne Netz: „Keine Verbindung zum Server.“", async () => {
    const sende = vi.fn<Sende>((url) => url.startsWith("/api/meldungen?") ? antwort(200, { meldungen: [zeile(7)] }) : Promise.reject(new TypeError("x")));
    render(<Meldungsliste sende={sende} />);
    await nutzer().click(await screen.findByRole("button", { name: "Meldung 7 erledigt" }));
    await waitFor(() => expect(fehler()?.textContent).toBe("Keine Verbindung zum Server."));
  });

  it("Statuswechsel schickt JSON mit Inhaltstyp", async () => {
    const sende = vi.fn<Sende>((url) => url.startsWith("/api/meldungen?") ? antwort(200, { meldungen: [zeile(7)] }) : antwort(200));
    render(<Meldungsliste sende={sende} />);
    await nutzer().click(await screen.findByRole("button", { name: "Meldung 7 erledigt" }));
    await waitFor(() => expect(sende.mock.calls.some(([u]) => u === "/api/meldungen/7/status")).toBe(true));
    const init = sende.mock.calls.find(([u]) => u === "/api/meldungen/7/status")![1];
    expect(init.headers).toEqual({ authorization: "Bearer schluessel-12345", "content-type": "application/json" });
  });
});

describe("Schlüsseleingabe", () => {
  beforeEach(() => { localStorage.clear(); });

  it("trimmt den Schlüssel, der Knopf ist bei Leerzeichen gesperrt, Enter schickt ab", async () => {
    const sende = vi.fn<Sende>(() => antwort(200, { meldungen: [] }));
    const n = nutzer();
    render(<Meldungsliste sende={sende} />);
    const feld = screen.getByLabelText("Schlüssel");
    const knopf = screen.getByRole("button", { name: "Öffnen" }) as HTMLButtonElement;
    expect(knopf.disabled).toBe(true);
    await n.type(feld, "   ");
    expect(knopf.disabled).toBe(true);
    await n.type(feld, "  abc-123  {Enter}");
    expect(localStorage.getItem(S_SCHLUESSEL)).toBe("abc-123");
    await waitFor(() => expect(sende).toHaveBeenCalled());
    expect((sende.mock.calls[0]![1].headers as Record<string, string>).authorization).toBe("Bearer abc-123");
  });
});

describe("Laden, Neu laden, Vergessen", () => {
  it("Neu laden ersetzt Fehler und Liste und übernimmt „weitere“", async () => {
    const antworten = [() => antwort(500), () => antwort(200, { meldungen: [zeile(3)], weitere: true }),
      () => antwort(200, { meldungen: [zeile(3)], weitere: false })];
    let i = 0;
    const sende = vi.fn<Sende>(() => antworten[Math.min(i++, 2)]!());
    const n = nutzer();
    render(<Meldungsliste sende={sende} />);
    await waitFor(() => expect(fehler()?.textContent).toBe("Fehler 500"));
    expect(liste()).toBeNull();
    await n.click(screen.getByRole("button", { name: "Neu laden" }));
    await waitFor(() => expect(liste()).not.toBeNull());
    expect(fehler()).toBeNull();
    expect(screen.getByRole("button", { name: "Ältere laden" })).toBeTruthy();
    await n.click(screen.getByRole("button", { name: "Neu laden" }));
    await waitFor(() => expect(screen.queryByRole("button", { name: "Ältere laden" })).toBeNull());
  });

  it("„Schlüssel vergessen“ leert die Liste und verlangt den Schlüssel neu", async () => {
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [zeile(1)] })} />);
    await waitFor(() => expect(liste()).not.toBeNull());
    await nutzer().click(screen.getByRole("button", { name: "Schlüssel vergessen" }));
    expect(liste()).toBeNull();
    expect(localStorage.getItem(S_SCHLUESSEL)).toBeNull();
    expect(screen.getByLabelText("Schlüssel")).toBeTruthy();
  });

  it("ohne Schlüssel wird nichts abgefragt", () => {
    localStorage.clear();
    const sende = vi.fn<Sende>(() => antwort(200, { meldungen: [] }));
    render(<Meldungsliste sende={sende} />);
    expect(sende).not.toHaveBeenCalled();
  });

  it("ein erneuter Klick auf den gewählten Filter lässt ihn stehen (keine neue Abfrage)", async () => {
    const sende = vi.fn<Sende>(() => antwort(200, { meldungen: [] }));
    const n = nutzer();
    render(<Meldungsliste sende={sende} />);
    await waitFor(() => expect(screen.getByText("Keine Meldungen in dieser Auswahl.")).toBeTruthy());
    await n.click(screen.getByRole("radio", { name: "offen" }));
    expect((screen.getByRole("radio", { name: "offen" }) as HTMLElement).getAttribute("aria-checked")).toBe("true");
    await n.click(screen.getByRole("radio", { name: "erledigt" }));
    await waitFor(() => expect(sende.mock.calls.map(([u]) => u)).toContain("/api/meldungen?status=erledigt"));
    expect(sende.mock.calls.map(([u]) => u).every((u) => !u.includes("undefined"))).toBe(true);
    await n.click(screen.getByRole("radio", { name: "erledigt" }));
    expect(sende.mock.calls.map(([u]) => u).every((u) => !u.includes("undefined"))).toBe(true);
    expect(screen.getByRole("radio", { name: "erledigt" }).getAttribute("aria-checked")).toBe("true");
  });

  it("eine überholte Antwort wird verworfen (schneller Filterwechsel)", async () => {
    const offene: Record<string, (r: Response) => void> = {};
    const sende = vi.fn<Sende>((url) => new Promise<Response>((res) => { offene[url] = res; }));
    const n = nutzer();
    render(<Meldungsliste sende={sende} />);
    await n.click(screen.getByRole("radio", { name: "alle" }));
    await waitFor(() => expect(offene["/api/meldungen?status=alle"]).toBeDefined());
    const ok = (daten: unknown) => new Response(JSON.stringify(daten), { status: 200 });
    offene["/api/meldungen?status=alle"]!(ok({ meldungen: [zeile(9, { grund: "ALLE-ANTWORT" })] }));
    await waitFor(() => expect(liste()?.textContent).toContain("ALLE-ANTWORT"));
    offene["/api/meldungen?status=offen"]!(ok({ meldungen: [zeile(1, { grund: "OFFEN-ANTWORT" })], weitere: true }));
    await new Promise<void>((r) => { setTimeout(r, 30); });
    expect(liste()?.textContent).toContain("ALLE-ANTWORT");
    expect(liste()?.textContent).not.toContain("OFFEN-ANTWORT");
    expect(screen.queryByRole("button", { name: "Ältere laden" })).toBeNull();
  });

  it("nach dem Ausblenden setzt eine späte Antwort nichts mehr (kein Absturz, keine Anzeige)", async () => {
    let lose: ((r: Response) => void) | undefined;
    const sende = vi.fn<Sende>(() => new Promise<Response>((res) => { lose = res; }));
    const { unmount } = render(<Meldungsliste sende={sende} />);
    await waitFor(() => expect(lose).toBeDefined());
    unmount();
    lose!(new Response(JSON.stringify({ meldungen: [zeile(1)] }), { status: 200 }));
    await new Promise<void>((r) => { setTimeout(r, 20); });
    expect(document.body.textContent).toBe("");
  });
});

describe("Ältere laden", () => {
  it("nimmt die kleinste Nummer ganz hinten, hängt an und übernimmt „weitere“", async () => {
    const sende = vi.fn<Sende>((url) => url.includes("vor=")
      ? antwort(200, { meldungen: [zeile(5, { grund: "Seite2" })], weitere: false })
      : antwort(200, { meldungen: [zeile(9), zeile(8), zeile(7)], weitere: true }));
    render(<Meldungsliste sende={sende} />);
    await nutzer().click(await screen.findByRole("button", { name: "Ältere laden" }));
    await waitFor(() => expect(within(liste()!).getAllByRole("listitem")).toHaveLength(4));
    expect(sende.mock.calls.map(([u]) => u)).toContain("/api/meldungen?status=offen&vor=7");
    expect(screen.queryByRole("button", { name: "Ältere laden" })).toBeNull();
  });

  it("Fehler auf der zweiten Seite: Satz, bisherige Liste bleibt, Knopf bleibt", async () => {
    const sende = vi.fn<Sende>((url) => url.includes("vor=")
      ? antwort(500)
      : antwort(200, { meldungen: [zeile(9), zeile(8)], weitere: true }));
    render(<Meldungsliste sende={sende} />);
    await nutzer().click(await screen.findByRole("button", { name: "Ältere laden" }));
    await waitFor(() => expect(fehler()?.textContent).toBe("Fehler 500"));
    expect(within(liste()!).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Ältere laden" })).toBeTruthy();
  });

  it("leere Liste: nur der Leer-Hinweis, keine Listengruppe, solange die Zeilen leer sind", async () => {
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [], weitere: false })} />);
    await waitFor(() => expect(screen.getByText("Keine Meldungen in dieser Auswahl.")).toBeTruthy());
    expect(liste()).toBeNull();
  });

  it("mit Zeilen steht kein Leer-Hinweis; „weitere“ nur bei true (nicht bei anderem Wert)", async () => {
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [zeile(1)], weitere: "ja" })} />);
    await waitFor(() => expect(liste()).not.toBeNull());
    expect(screen.queryByText("Keine Meldungen in dieser Auswahl.")).toBeNull();
    expect(screen.queryByRole("button", { name: "Ältere laden" })).toBeNull();
  });
});

describe("Zeilenanzeige", () => {
  it("Frage im Pool: Thema, Fragetext, Kennung als Knopf; Version, Grund und Text", async () => {
    const oeffne = vi.fn();
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [zeile(3)] })} oeffneFrage={oeffne} />);
    await waitFor(() => expect(liste()).not.toBeNull());
    const t = liste()!.textContent!;
    expect(t).toContain("#3");
    expect(t).toContain(A.thema);
    expect(t).toContain(A.frage ?? "");
    expect(t).toContain("v1.29.0");
    expect(t).toContain("Veraltet: Norm neu");
    expect(t).not.toContain("(nicht im Pool)");
    await nutzer().click(screen.getByRole("button", { name: `Frage ${A.id} öffnen` }));
    expect(oeffne).toHaveBeenCalledExactlyOnceWith(A.id);
  });

  it("Frage nicht im Pool: Hinweis, kein Fragetext, Kennung nur als Text; leere Version „v?“, leerer Text ohne Doppelpunkt", async () => {
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [zeile(3, { frage_id: "X99-999", version: "", text: "" })] })} oeffneFrage={vi.fn()} />);
    await waitFor(() => expect(liste()).not.toBeNull());
    const t = liste()!.textContent!;
    expect(t).toContain("(nicht im Pool)");
    expect(t).toContain("(nicht im Pool)v?Veraltet");
    expect(t).not.toContain("Veraltet:");
    expect(within(liste()!).queryByRole("button", { name: /Frage X99-999 öffnen/ })).toBeNull();
    expect(within(liste()!).getByText("X99-999")).toBeTruthy();
  });

  it("erledigte Meldung: „Wieder offen“ setzt zurück auf offen", async () => {
    const sende = vi.fn<Sende>((url) => url.startsWith("/api/meldungen?")
      ? antwort(200, { meldungen: [zeile(6, { status: "erledigt", erledigt: 1789700000000 })] }) : antwort(200));
    render(<Meldungsliste sende={sende} />);
    const k = await screen.findByRole("button", { name: "Meldung 6 wieder offen" });
    expect(k.textContent).toBe("Wieder offen");
    await nutzer().click(k);
    await waitFor(() => expect(sende.mock.calls.some(([u]) => u === "/api/meldungen/6/status")).toBe(true));
    const init = sende.mock.calls.find(([u]) => u === "/api/meldungen/6/status")![1];
    expect(JSON.parse(String(init.body))).toEqual({ status: "offen" });
  });

  it("offene Meldung: Knopf „Erledigt“ in Hauptfarbe, erledigte in Zweitfarbe", async () => {
    render(<Meldungsliste sende={() => antwort(200, { meldungen: [zeile(1), zeile(2, { status: "erledigt", erledigt: 5 })] })} />);
    const offen = await screen.findByRole("button", { name: "Meldung 1 erledigt" });
    const fertig = screen.getByRole("button", { name: "Meldung 2 wieder offen" });
    expect(offen.textContent).toBe("Erledigt");
    expect(offen.getAttribute("data-variant")).toBe("default");
    expect(fertig.getAttribute("data-variant")).toBe("secondary");
  });
});
