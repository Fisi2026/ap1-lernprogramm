// @vitest-environment jsdom
/* ============================================================================
   N22: STARTSEITE, EINZELFRAGE UND ADRESSEN — durch die echte App

   ⚠️ Hier beginnt jeder Test OHNE Adresse (alle anderen Schirm-Tests setzen
      `#ueben`), denn genau das ist der Fall, der die Startseite zeigt.
   ============================================================================ */
import { istTyp } from "@/daten/typen";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import type { Sende } from "@/kern/meldeversand";
import { Meldungsliste, S_SCHLUESSEL } from "./Meldungsliste";

const MC = FRAGEN.filter((f) => istTyp(f, "mc")).find((f) => typeof f.loesungIndex === "number")!;
const [A, B] = FRAGEN.filter((f) => f.typ === "mc" && f.pruefungsteil !== "AP2");
const gespeichert = (): Record<string, any> => JSON.parse(localStorage.getItem(LS_SCHLUESSEL) || "{}");
const legeStand = (extra: Record<string, unknown>) =>
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, ...extra }));
const titel = () => within(screen.getByRole("banner")).getByRole("heading", { level: 1 }).textContent;
const kachel = (ziel: string) => document.querySelector(`[data-ziel="${ziel}"]`) as HTMLElement | null;
const tag = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", location.pathname); });

describe("Die Startseite", () => {
  it("ohne Adresse: Startseite; eine Kachel führt in ihren Bereich und schreibt die Adresse", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(titel()).toBe("Start");
    expect(kachel("ueben")).not.toBeNull();
    expect(kachel("markiert"), "ohne Markierung keine Kachel").toBeNull();
    await nutzer.click(kachel("stat")!);
    expect(titel()).toBe("Statistik");
    expect(location.hash).toBe("#stat");
    await nutzer.click(screen.getByRole("button", { name: "Startseite" }));
    expect(titel()).toBe("Start");
    expect(location.hash).toBe("#start");
  });

  it("Badges sind gemessen: fällige Karten, Markierungen, Tagesserie offen/erledigt", () => {
    const jetzt = Date.now();
    legeStand({
      fehlerDeck: { [A.id]: { streak: 0, due: jetzt - 1000 }, [B.id]: { streak: 0, due: jetzt + 86400000 } },
      markiert: { [A.id]: 1, [B.id]: 1 },
    });
    render(<App />);
    expect(kachel("fd")!.textContent).toMatch(/^1/);
    expect(kachel("markiert")!.textContent).toMatch(/^2/);
    expect(kachel("serie")!.textContent).toMatch(/^heute offen/);
    cleanup();
    legeStand({ serieDone: tag() });
    render(<App />);
    expect(kachel("serie")!.textContent).not.toMatch(/heute offen/);
    expect(kachel("serie")!.textContent).toMatch(/Heute schon absolviert\./);
    expect(kachel("fd")!.textContent).toMatch(/^Fehler-Deck/);
  });

  it("„Dein Stand\": ohne Daten keine erfundene Quote; mit Daten die Zahlen", async () => {
    render(<App />);
    const zeile = () => document.querySelector('[data-teil="stand-zeile"]')!.textContent!;
    expect(zeile()).toContain("Bereitschaft: noch keine Daten");
    expect(zeile()).not.toContain("Trefferquote");
    expect(zeile()).not.toContain("Letzte Simulation");
    cleanup();
    legeStand({
      dailyCounts: { [tag()]: 4 }, tagesziel: 20,
      statistik: { [A.modul]: { richtig: 1, gesamt: 2 }, ["T:" + A.modul + ":" + A.thema]: { richtig: 1, gesamt: 2 } },
      simHistorie: [{ prozent: 58 }],
    });
    render(<App />);
    expect(zeile()).toContain("Heute 4/20 Fragen");
    expect(zeile()).toContain("Trefferquote 50 %");
    expect(zeile()).toContain("Letzte Simulation 58 %");
    expect(zeile()).toMatch(/Bereitschaft\s*\d+ %/);
    /* N25 P6b: „Mehr Statistik" ist ein Collapsible – zugeklappt steht sein Inhalt NICHT im
       DOM (anders als `<details>`). Erst aufklappen, dann zaehlen. */
    expect(document.querySelector('[data-teil="aktivitaet"]')).toBeNull();
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: "Mehr Statistik anzeigen" }));
    expect(document.querySelectorAll('[data-teil="aktivitaet"] > div')).toHaveLength(14);
  });

  it("„Dein Stand\" zuklappen wird gemerkt, aufklappen nimmt den Eintrag wieder heraus", async () => {
    /* N25 P6b: `<details>` → `Collapsible`. Bedient wird jetzt wie ein Mensch: Klick auf den
       Ausloeser; gelesen wird `aria-expanded` und ob der Inhalt im DOM steht. */
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    const knopf = () => screen.getByRole("button", { name: "Dein Stand" });
    const zeile = () => document.querySelector('[data-teil="stand-zeile"]');
    expect(knopf().getAttribute("aria-expanded")).toBe("true");
    expect(zeile()).not.toBeNull();
    await nutzer.click(knopf());
    expect(gespeichert().panelOffen).toEqual({ "stat-start": false });
    cleanup();
    render(<App />);
    expect(knopf().getAttribute("aria-expanded")).toBe("false");
    expect(zeile()).toBeNull();
    await nutzer.click(knopf());
    expect(gespeichert().panelOffen).toEqual({});
  });
});

describe("Adressen", () => {
  it("#serie beim Laden zieht die Tagesserie", () => {
    history.replaceState(null, "", "#serie");
    render(<App />);
    expect(screen.getByText("Frage 1 von 5 · bisher 0 richtig")).toBeTruthy();
  });

  it("Browser-Zurück (hashchange) wechselt den Bereich; eine unbekannte Adresse führt zur Startseite", async () => {
    render(<App />);
    location.hash = "#glossar";
    await waitFor(() => expect(titel()).toBe("Glossar"));
    location.hash = "#gibtsnicht";
    await waitFor(() => expect(titel()).toBe("Start"));
  });
});

describe("Die Einzelfrage", () => {
  it("#frage=ID: zeigt die Frage, bewertet, bucht aber nichts", async () => {
    legeStand({ tagesziel: 20 });
    history.replaceState(null, "", "#frage=" + MC.id);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(titel()).toBe("Einzelne Frage");
    expect(screen.getByText(new RegExp(`· ${MC.id}$`))).toBeTruthy();
    const vorher = JSON.stringify(gespeichert());
    await nutzer.click(screen.getByRole("radio", { name: (MC.optionen as string[])[MC.loesungIndex as number] }));
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));
    expect(screen.getByText("Richtig.")).toBeTruthy();
    expect(JSON.stringify(gespeichert())).toBe(vorher);
    await nutzer.click(screen.getByRole("button", { name: "Normal weiterüben" }));
    expect(titel()).toBe("Üben");
    expect(location.hash).toBe("#ueben");
  });

  it("unbekannte Kennung: sagt es und führt zur Startseite", async () => {
    history.replaceState(null, "", "#frage=GIBT-ES-NICHT");
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.getByText("Diese Frage gibt es nicht (mehr). (GIBT-ES-NICHT)")).toBeTruthy();
    await nutzer.click(screen.getByRole("button", { name: "Zur Startseite" }));
    expect(titel()).toBe("Start");
  });

  it("Kennungen in Markiert und Fehler-Deck öffnen die Frage", async () => {
    legeStand({ markiert: { [A.id]: 1 }, fehlerDeck: { [B.id]: { streak: 0, due: Date.now() + 86400000 } } });
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Markierte Fragen" }));
    await nutzer.click(screen.getByRole("button", { name: `Frage ${A.id} öffnen` }));
    expect(titel()).toBe("Einzelne Frage");
    expect(location.hash).toBe("#frage=" + A.id);
    await nutzer.click(screen.getByRole("button", { name: "Fehler-Deck" }));
    await nutzer.click(screen.getByRole("button", { name: `Frage ${B.id} öffnen` }));
    expect(screen.getByText(new RegExp(`· ${B.id}$`))).toBeTruthy();
  });

  it("Kennungen in der Meldungsliste öffnen die Frage – nur, wenn es sie gibt", async () => {
    localStorage.setItem(S_SCHLUESSEL, "geheimer-schluessel-123");
    const zeilen = [
      { nr: 1, frage_id: A.id, grund: "Tippfehler", text: "", erstellt: 1789600000000, fassung: "neu", version: "1.30.1", status: "offen", erledigt: null },
      { nr: 2, frage_id: "WEG-1", grund: "Sonstiges", text: "", erstellt: 1789600000000, fassung: "neu", version: "1.30.1", status: "offen", erledigt: null },
    ];
    const sende = vi.fn<Sende>(() => Promise.resolve(new Response(JSON.stringify({ meldungen: zeilen }), { status: 200 })));
    const oeffne = vi.fn();
    const nutzer = userEvent.setup({ delay: null });
    render(<Meldungsliste sende={sende} oeffneFrage={oeffne} />);
    await waitFor(() => expect(document.querySelector('[data-teil="meldungsliste"]')).not.toBeNull());
    expect(screen.queryByRole("button", { name: "Frage WEG-1 öffnen" })).toBeNull();
    await nutzer.click(screen.getByRole("button", { name: `Frage ${A.id} öffnen` }));
    expect(oeffne).toHaveBeenCalledWith(A.id);
  });
});
