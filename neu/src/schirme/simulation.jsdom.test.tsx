// @vitest-environment jsdom
/* ============================================================================
   DIE PRUEFUNGSSIMULATION ÜBER DEN SCHIRM

   ⛔⛔ DER GEFAEHRLICHSTE FEHLER WAERE, WAEHREND DES LAUFS ETWAS ZU VERRATEN.
      Deshalb wird ausdruecklich geprueft, dass waehrend der Pruefung kein Urteil,
      keine Rueckseite und kein "Lösung prüfen" auftaucht.
   ⚠️ Die Pruefung ist gewuerfelt; der Test rechnet nichts nach. Gemessen wird,
      was ohne die Loesung messbar ist: Struktur, Navigation, Uhr, Abgabe und was
      danach im Lernstand steht.
   ============================================================================ */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { uhrzeit } from "./uhrzeit";

function gespeichert(): Record<string, unknown> | null {
  const roh = localStorage.getItem(LS_SCHLUESSEL);
  return roh ? (JSON.parse(roh) as Record<string, unknown>) : null;
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

async function zurSimulation(nutzer: ReturnType<typeof userEvent.setup>) {
  await nutzer.click(screen.getByRole("button", { name: "Prüfungssimulation" }));
}
/** Startet eine kurze Pruefung (12 Fragen) und gibt den Nutzer zurueck. */
async function starte(nutzer: ReturnType<typeof userEvent.setup>) {
  await zurSimulation(nutzer);
  const feld = screen.getByLabelText("Aufgaben insgesamt");
  await nutzer.clear(feld);
  await nutzer.type(feld, "12");
  await nutzer.click(screen.getByRole("button", { name: "Prüfung starten" }));
}
const navKnoepfe = () => screen.getAllByRole("button", { name: /^Frage \d+$/ });

describe("Der Startbildschirm", () => {
  it("zeigt die vier Aufgaben mit Punkten, die sich auf 100 summieren", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zurSimulation(nutzer);
    expect(screen.queryByText(/noch nicht gebaut/)).toBeNull();

    /* ⚠️ `getByText` trifft das <b> mit "1. Aufgabe" — die Punkte stehen in der
       Zeile DARUEBER. Und gelesen wird ohne Regex: ein maskiertes "\(" ueberlebt
       den Weg hierher nicht zuverlaessig (dieselbe Falle wie beim Gantt-Test). */
    const zeilen = [1, 2, 3, 4].map(
      (nr) => screen.getByText(new RegExp("^" + nr + ". Aufgabe")).parentElement!,
    );
    expect(zeilen.length).toBe(4);
    const punkte = zeilen.map((z) => {
      const text = z.textContent || "";
      return Number(text.split("(")[1].split(" Punkte")[0]);
    });
    expect(punkte.reduce((s, x) => s + x, 0)).toBe(100);
    for (const p of punkte) {
      expect(p).toBeGreaterThanOrEqual(20);
      expect(p).toBeLessThanOrEqual(30);
    }
  });

  it("zeigt ohne frühere Durchgänge keinen leeren Verlauf", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zurSimulation(nutzer);
    expect(screen.queryByLabelText("Verlauf der Ergebnisse")).toBeNull();
  });

  it("zeigt den Verlauf, sobald es einen gibt", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1,
      simHistorie: [{ datum: "2026-09-15", prozent: 62, note: "3", punkte: 25, gesamt: 40, zeitSek: 900 }],
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zurSimulation(nutzer);
    const verlauf = screen.getByLabelText("Verlauf der Ergebnisse");
    expect(within(verlauf).getByText("62")).toBeTruthy();
    expect(screen.getByText(/2026-09-15: 62 % \(Note 3\)/)).toBeTruthy();
  });
});

describe("Der Lauf", () => {
  it("stellt die gewünschte Zahl Fragen und merkt sie sich im Lernstand", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await starte(nutzer);

    expect(navKnoepfe().length).toBeGreaterThanOrEqual(12);
    expect(screen.getByText(/^Frage 1 \/ \d+$/)).toBeTruthy();
    const s = gespeichert()!;
    expect(s.simAnzahl).toBe(12);
    expect((s.simUsedIds as unknown[]).length).toBeGreaterThanOrEqual(12);
  });

  /* ⛔⛔ DIE VORSCHAU MUSS DIE PRUEFUNG SEIN. Die alte App friert die gewuerfelte
     Punkteverteilung beim Start ausdruecklich ein (G3.6b), damit Kopfzeile,
     Navigation und Auswertung dieselben Zahlen zeigen wie die Vorschau. Ohne
     diesen Test blieb die Sabotage "beim Start neu wuerfeln" gruen. */
  it("übernimmt die Punkte der Vorschau unverändert in den Lauf", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zurSimulation(nutzer);

    const vorschau = [1, 2, 3, 4].map((nr) => {
      const text = screen.getByText(new RegExp("^" + nr + ". Aufgabe")).parentElement!.textContent || "";
      return Number(text.split("(")[1].split(" Punkte")[0]);
    });

    const feld = screen.getByLabelText("Aufgaben insgesamt");
    await nutzer.clear(feld);
    await nutzer.type(feld, "12");
    await nutzer.click(screen.getByRole("button", { name: "Prüfung starten" }));

    /* In der Navigation steht je Aufgabe "N. Aufgabe (P P)" — dieselben Zahlen.
       ⚠️ Ohne Regex gelesen: ein maskiertes "\(" ueberlebt den Weg in diese Datei
          nicht zuverlaessig, und der erste Anlauf ist genau daran gescheitert. */
    const zeilen = Array.from(document.querySelectorAll("div"))
      .map((d) => d.textContent || "")
      .filter((t) => t.endsWith(" P)") && t.indexOf(". Aufgabe (") === 1);
    expect(zeilen.length).toBeGreaterThan(0);
    const imLauf = [1, 2, 3, 4].map((nr) => {
      const zeile = zeilen.find((t) => t.startsWith(nr + ". Aufgabe ("));
      return zeile ? Number(zeile.split("(")[1].split(" P)")[0]) : null;
    });
    expect(imLauf.some((x) => x !== null)).toBe(true);
    imLauf.forEach((p, i) => {
      if (p !== null) expect(p, "Aufgabe " + (i + 1)).toBe(vorschau[i]);
    });
  });

  /* ⛔⛔ HIER LIEGT DER KERN: waehrend der Pruefung wird NICHTS verraten. */
  it("verrät während des Laufs nichts — kein Urteil, keine Rückseite", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await starte(nutzer);

    expect(screen.queryByText("Richtig.")).toBeNull();
    expect(screen.queryByText("Nicht richtig.")).toBeNull();
    expect(screen.queryByText(/Rückseite/)).toBeNull();
    expect(screen.queryByRole("button", { name: "Lösung prüfen" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Aufgeben" })).toBeNull();
  });

  it("springt über die Navigation und merkt sich Markierungen", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await starte(nutzer);

    await nutzer.click(screen.getByRole("button", { name: "Später prüfen" }));
    expect(navKnoepfe()[0].getAttribute("data-markiert")).toBe("ja");

    await nutzer.click(navKnoepfe()[3]);
    expect(screen.getByText(/^Frage 4 \/ \d+$/)).toBeTruthy();
    /* Die Markierung der ersten Frage bleibt, auch wenn man weiterblättert. */
    expect(navKnoepfe()[0].getAttribute("data-markiert")).toBe("ja");
    expect(screen.getByRole("button", { name: "Später prüfen" })).toBeTruthy();
  });

  /* ⛔⛔ OHNE DIESEN TEST WAERE NIE EINE ANTWORT GEGEBEN WORDEN — und damit weder
     die Markierung "beantwortet" noch das Ueberleben der Antwort beim Blaettern
     gemessen. Die Pruefung wird gewuerfelt, also wird zur ersten Frage mit
     Auswahlknoepfen geblaettert, statt einen Typ zu erzwingen. */
  it("nimmt eine Antwort an, merkt sie in der Navigation und behält sie beim Blättern", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await starte(nutzer);

    let i = 0;
    while (screen.queryAllByRole("radio").length === 0 && i < navKnoepfe().length - 1) {
      i++;
      await nutzer.click(navKnoepfe()[i]);
    }
    expect(screen.queryAllByRole("radio").length, "keine Frage mit Auswahlknöpfen gefunden")
      .toBeGreaterThan(0);

    expect(navKnoepfe()[i].getAttribute("data-beantwortet")).toBe("nein");
    await nutzer.click(screen.getAllByRole("radio")[0]);
    expect(navKnoepfe()[i].getAttribute("data-beantwortet")).toBe("ja");

    const woanders = i === 0 ? 1 : 0;
    await nutzer.click(navKnoepfe()[woanders]);
    await nutzer.click(navKnoepfe()[i]);
    /* ⚠️ Der Auswahlknopf ist ein <button role="radio">, kein <input> — `.checked`
       ist dort `undefined`. Gefragt wird `aria-checked`, und genau daran ist der
       erste Anlauf gescheitert. */
    expect(screen.getAllByRole("radio")[0].getAttribute("aria-checked")).toBe("true");
  });

  it("zeigt die Restzeit als Uhr und zählt sie herunter", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const nutzer = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
    render(<App />);
    await starte(nutzer);

    const vorher = screen.getByLabelText("Restzeit").textContent!;
    expect(vorher).toMatch(/^\d+:\d\d$/);
    await vi.advanceTimersByTimeAsync(3000);
    const nachher = screen.getByLabelText("Restzeit").textContent!;
    expect(nachher).not.toBe(vorher);
    vi.useRealTimers();
  });
});

describe("Die Abgabe und die Auswertung", () => {
  it("zeigt Punkte, Note und das Ergebnis je Aufgabe", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await starte(nutzer);
    const anzahl = navKnoepfe().length;
    await nutzer.click(screen.getByRole("button", { name: "Abgeben" }));

    /* Nichts beantwortet: null Punkte, nicht bestanden — und das steht da. */
    expect(screen.getByText("0 / " + anzahl)).toBeTruthy();
    expect(screen.getByText("0 %")).toBeTruthy();
    expect(screen.getByText("Nicht bestanden")).toBeTruthy();
    expect(screen.getByText(/Ergebnis je Aufgabe/)).toBeTruthy();
    expect(screen.getByText(/Alle Fragen im Überblick/)).toBeTruthy();
    expect(screen.getAllByText("falsch").length).toBe(anzahl);
  });

  it("schreibt Historie und Fehler-Deck in den Lernstand", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await starte(nutzer);
    const anzahl = navKnoepfe().length;
    await nutzer.click(screen.getByRole("button", { name: "Abgeben" }));

    const s = gespeichert()!;
    const h = s.simHistorie as Array<Record<string, unknown>>;
    expect(h.length).toBe(1);
    expect(h[0].prozent).toBe(0);
    expect(h[0].gesamt).toBe(anzahl);
    /* ⛔⛔ GEMESSEN WIRD DIE EIGENSCHAFT, NICHT DIE ZAHL: im Fehler-Deck darf keine
       Kennung liegen, zu der es keine Frage gibt. Genau das lag dort bis zum
       16.09.2026 — die Teilaufgaben der Fallaufgabe, gefunden im Rauchtest. Eine
       feste Zahl haette hier nur gesagt, dass sich etwas geaendert hat, nicht was. */
    const deck = Object.keys(s.fehlerDeck as object);
    expect(deck.length).toBeGreaterThan(0);
    expect(deck.length).toBeLessThanOrEqual(anzahl);
    const imBestand = new Set(FRAGEN.map((f) => f.id));
    for (const id of deck) expect(imBestand.has(id), id + " hat keine Frage im Bestand").toBe(true);
    /* ⛔ Eine Pruefung ist kein Uebungsdurchgang: kein Tageszaehler, keine
       Modul-Statistik. */
    expect(Object.keys(s.dailyCounts as object)).toEqual([]);
    expect(Object.keys(s.statistik as object)).toEqual([]);
  });

  it("zeigt erst NACH der Abgabe die Erklärungen", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await starte(nutzer);
    /* N25 P6b: die Ueberblicks-Klappen sind Accordion-Eintraege, keine `<details>` mehr. */
    const klappen = () => document.querySelectorAll('[data-slot="accordion-item"]').length;
    expect(klappen()).toBe(0);
    await nutzer.click(screen.getByRole("button", { name: "Abgeben" }));
    expect(klappen()).toBeGreaterThan(0);
    /* Zu steht die Erklaerung NICHT im DOM; ein Klick auf EINE Frage zeigt genau ihre.
       ⚠️ Gemessen: Radix laesst die HUELLE `accordion-content` zu stehen und haengt nur ihre
       Kinder aus – gezaehlt werden deshalb Huellen MIT Text, nicht Huellen. */
    const inhalte = () => Array.from(document.querySelectorAll('[data-slot="accordion-content"]'))
      .filter((e) => (e.textContent ?? "").trim() !== "");
    expect(inhalte()).toHaveLength(0);
    await nutzer.click(document.querySelector('[data-slot="accordion-trigger"]') as HTMLElement);
    expect(inhalte()).toHaveLength(1);
    expect(inhalte()[0].textContent!.length).toBeGreaterThan(20);
  });

  it("führt vom Ergebnis zurück zum Start — und der Verlauf ist da", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await starte(nutzer);
    await nutzer.click(screen.getByRole("button", { name: "Abgeben" }));
    await nutzer.click(screen.getByRole("button", { name: "Zurück zum Start" }));

    expect(screen.getByRole("button", { name: "Prüfung starten" })).toBeTruthy();
    expect(screen.getByLabelText("Verlauf der Ergebnisse")).toBeTruthy();
  });

  /* ⚠️ Die Uhr gibt selbst ab, wenn die Zeit um ist. Gemessen mit einer
     Restzeit von einer Minute, damit der Test nicht 90 Minuten wartet. */
  it("gibt von selbst ab, wenn die Zeit abgelaufen ist", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, simDauerMin: 1 }));
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const nutzer = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
    render(<App />);
    await starte(nutzer);
    expect(screen.getByLabelText("Restzeit").textContent).toBe("1:00");

    await vi.advanceTimersByTimeAsync(61000);
    expect(screen.getByText(/Ergebnis je Aufgabe/)).toBeTruthy();
    expect((gespeichert()!.simHistorie as unknown[]).length).toBe(1);
    vi.useRealTimers();
  });
});

describe("Die Uhr selbst", () => {
  it("schreibt Minuten und Sekunden zweistellig", () => {
    expect(uhrzeit(0)).toBe("0:00");
    expect(uhrzeit(9)).toBe("0:09");
    expect(uhrzeit(60)).toBe("1:00");
    expect(uhrzeit(5400)).toBe("90:00");
    expect(uhrzeit(-5)).toBe("0:00");      // nie negativ
  });
});
