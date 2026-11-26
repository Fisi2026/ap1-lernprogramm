// @vitest-environment jsdom
/* Das Fehler-Deck als Liste: was liegt an, und wann kommt es wieder?

   ⛔ Geprueft wird gegen dieselben Regeln, die beim Ueben gelten — `L.fdDue`
      entscheidet, was faellig ist, nicht dieser Schirm. */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL, leererStand } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { deckStand, wannWieder } from "@/kern/fehlerdeck";
import type { Lernstand } from "@/kern/stand";

const TAG = 86400000;
const JETZT = Date.UTC(2026, 8, 14, 10, 0, 0);
const POOL = new Map(FRAGEN.map((f) => [f.id, f]));
const nachId = (id: string) => POOL.get(id);

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

describe("deckStand ordnet, was logik.js entschieden hat", () => {
  const a = FRAGEN[0].id, b = FRAGEN[1].id, c = FRAGEN[2].id;
  const stand = {
    ...leererStand(),
    fehlerDeck: {
      [a]: { streak: 0, due: JETZT - 2 * TAG },   // laengst faellig
      [b]: { streak: 1, due: JETZT - TAG },       // faellig
      [c]: { streak: 2, due: JETZT + 3 * TAG },   // spaeter
      "M99-999": { streak: 0, due: JETZT - TAG }, // gibt es nicht mehr
    },
  } as Lernstand;

  const d = deckStand(stand, nachId, JETZT);

  it("trennt faellig von spaeter", () => {
    expect(d.faellig.map((e) => e.id)).toEqual([a, b]);
    expect(d.spaeter.map((e) => e.id)).toEqual([c]);
  });

  it("sortiert das laengst Ueberfaellige nach vorn", () => {
    expect(d.faellig[0].id).toBe(a);
  });

  it("verschweigt eine Kennung ohne Frage NICHT", () => {
    expect(d.verwaist.map((e) => e.id)).toEqual(["M99-999"]);
  });

  it("kennt die Grenze, ab der eine Frage das Deck verlaesst", () => {
    expect(d.raus).toBeGreaterThan(0);
  });

  it("wannWieder sagt jetzt, morgen, in N Tagen", () => {
    expect(wannWieder(JETZT - TAG, JETZT)).toBe("jetzt");
    expect(wannWieder(JETZT + TAG, JETZT)).toBe("morgen");
    expect(wannWieder(JETZT + 3 * TAG, JETZT)).toBe("in 3 Tagen");
  });
});

describe("Der Schirm", () => {
  it("sagt bei leerem Deck, dass es leer ist — und wie etwas hineinkommt", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Fehler-Deck" }));
    expect(screen.getByText("Das Fehler-Deck ist leer.")).toBeTruthy();
    expect(screen.getByText(/jede fünfte Frage/)).toBeTruthy();
  });

  it("zeigt faellige und spaetere Fragen mit Streak und Zeitpunkt", async () => {
    const a = FRAGEN[0], c = FRAGEN[2];
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1,
      fehlerDeck: {
        [a.id]: { streak: 0, due: Date.now() - TAG },
        [c.id]: { streak: 2, due: Date.now() + 3 * TAG },
      },
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Fehler-Deck" }));

    expect(screen.getByText(/Jetzt fällig/)).toBeTruthy();
    expect(screen.getByText(a.id)).toBeTruthy();
    expect(screen.getByText(c.id)).toBeTruthy();
    expect(screen.getByText("jetzt")).toBeTruthy();
    expect(screen.getByText("in 3 Tagen")).toBeTruthy();
    /* Der Streak steht als "getroffen / Grenze" da. */
    expect(screen.getByText(/^2 \/ \d+$/)).toBeTruthy();
  });

  it("zeigt eine verwaiste Kennung als eigenen, roten Abschnitt", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1,
      fehlerDeck: { "M99-999": { streak: 0, due: Date.now() - TAG } },
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Fehler-Deck" }));
    expect(screen.getByText(/Ohne Frage im Bestand \(1\)/)).toBeTruthy();
    expect(screen.getByText("M99-999")).toBeTruthy();
  });

  /* ⛔ Der Kopf und dieser Schirm muessen dasselbe sagen — sie lesen beide denselben Stand. */
  it("stimmt mit der Zahl im Kopf ueberein", async () => {
    const a = FRAGEN[0], b = FRAGEN[1];
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1,
      fehlerDeck: {
        [a.id]: { streak: 0, due: Date.now() - TAG },
        [b.id]: { streak: 0, due: Date.now() + TAG },
      },
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    const kopfZahl = screen.getByRole("banner").textContent ?? "";
    expect(kopfZahl).toContain("Fehler-Deck");
    await nutzer.click(screen.getByRole("button", { name: "Fehler-Deck" }));
    expect(screen.getByText(/Jetzt fällig/)).toBeTruthy();
    expect(screen.getByText(/Kommt später/)).toBeTruthy();
  });
});

describe("Verwaiste Kennungen aufraeumen", () => {
  /* ⛔ Die alte App loescht so etwas STILL beim Laden. Hier nicht: Loeschen ist
     der einzige Schritt, der Lernstand vernichtet, und er passiert auf Klick. */
  it("loescht beim Laden NICHTS von selbst", async () => {
    const a = FRAGEN[0];
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1,
      fehlerDeck: {
        [a.id]: { streak: 0, due: Date.now() - TAG },
        "M99-999": { streak: 0, due: Date.now() - TAG },
      },
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Fehler-Deck" }));

    const deck = JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!).fehlerDeck;
    expect(Object.keys(deck).sort()).toEqual([a.id, "M99-999"].sort());
  });

  it("entfernt sie erst auf Klick — und laesst die echten Fragen stehen", async () => {
    const a = FRAGEN[0];
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1,
      fehlerDeck: {
        [a.id]: { streak: 1, due: Date.now() - TAG },
        "M99-998": { streak: 0, due: Date.now() - TAG },
        "M99-999": { streak: 0, due: Date.now() - TAG },
      },
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Fehler-Deck" }));

    await nutzer.click(screen.getByRole("button", { name: "Diese 2 Kennungen entfernen" }));

    const deck = JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!).fehlerDeck;
    expect(Object.keys(deck)).toEqual([a.id]);
    expect(deck[a.id]).toEqual({ streak: 1, due: expect.any(Number) });
    /* und der rote Abschnitt ist weg */
    expect(screen.queryByText(/Ohne Frage im Bestand/)).toBeNull();
  });
});
