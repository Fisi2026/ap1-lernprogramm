// @vitest-environment jsdom
/* Der Fehler-Deck-Schirm allein, mit gebauten Staenden (Zeit weit weg von "jetzt", damit nichts kippt):
   Leer-Zustand, die zwei Abschnitte mit Zaehler und Faerbung, die Zeilen, verwaiste Kennungen samt Entfernen.
   Die Ordnung selbst (deckStand) pruefen fehlerdeck.jsdom.test.tsx und kern/fehlerdeck. */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Fehlerdeck } from "./Fehlerdeck";
import { useLernstand } from "@/huelle/useLernstand";
import { FRAGEN } from "@/daten/laden";
import { LS_SCHLUESSEL, leererStand } from "@/kern/stand";
import { CONFIG } from "@/kern/tabellen/konfig";

const TAG = 86400000;
const [F1, F2, F3] = FRAGEN;
const legeDeck = (deck: Record<string, { streak: number; due: number }>) =>
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), fehlerDeck: deck }));
const gespeichert = () => JSON.parse(localStorage.getItem(LS_SCHLUESSEL) ?? "{}") as { fehlerDeck: Record<string, unknown> };
function Buehne({ oeffne }: { oeffne?: (id: string) => void }) {
  const lernstand = useLernstand();
  return oeffne ? <Fehlerdeck lernstand={lernstand} oeffneFrage={oeffne} /> : <Fehlerdeck lernstand={lernstand} />;
}
const abschnitt = (titel: string) => screen.getByRole("heading", { name: new RegExp(`^${titel}`) }).closest('[data-slot="card"]') as HTMLElement;
const zaehler = (titel: string) => abschnitt(titel).querySelector("h2 span") as HTMLElement;
const hat = (e: Element, k: string) => e.classList.contains(k);

beforeEach(() => { localStorage.clear(); });
afterEach(cleanup);

describe("Leeres Deck", () => {
  it("sagt es und zeigt keinen Abschnitt", () => {
    render(<Buehne />);
    expect(screen.getByText("Das Fehler-Deck ist leer.")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: /Jetzt fällig/ })).toBeNull();
  });
});

describe("Abschnitte", () => {
  it("faellig und spaeter getrennt gezaehlt; Zaehler 'Jetzt faellig' rot, 'Kommt spaeter' nicht", () => {
    legeDeck({
      [F1!.id]: { streak: 0, due: Date.now() - 2 * TAG },
      [F2!.id]: { streak: 1, due: Date.now() - TAG },
      [F3!.id]: { streak: 2, due: Date.now() + 3 * TAG },
    });
    render(<Buehne />);
    expect(zaehler("Jetzt fällig").textContent).toBe("(2)");
    expect(zaehler("Kommt später").textContent).toBe("(1)");
    expect(hat(zaehler("Jetzt fällig"), "text-destructive")).toBe(true);
    expect(hat(zaehler("Kommt später"), "text-destructive")).toBe(false);
  });

  it("nichts faellig: Zaehler (0) ohne Warnfarbe und der Leertext des Abschnitts", () => {
    legeDeck({ [F3!.id]: { streak: 0, due: Date.now() + 3 * TAG } });
    render(<Buehne />);
    expect(zaehler("Jetzt fällig").textContent).toBe("(0)");
    expect(hat(zaehler("Jetzt fällig"), "text-destructive")).toBe(false);
    expect(within(abschnitt("Jetzt fällig")).getByText("Nichts fällig — alles liegt in der Zukunft.")).toBeTruthy();
  });

  it("nichts auf Wiedervorlage: Leertext in 'Kommt spaeter'", () => {
    legeDeck({ [F1!.id]: { streak: 0, due: Date.now() - TAG } });
    render(<Buehne />);
    expect(within(abschnitt("Kommt später")).getByText("Nichts liegt auf Wiedervorlage.")).toBeTruthy();
  });

  it("Zeile: Kennung, Thema, 'Streak / Grenze', wann wieder; faellig rot, spaeter gedaempft", () => {
    legeDeck({
      [F1!.id]: { streak: 1, due: Date.now() - TAG },
      [F3!.id]: { streak: 2, due: Date.now() + 2.5 * TAG },
    });
    render(<Buehne />);
    const faellig = within(abschnitt("Jetzt fällig")).getAllByRole("listitem")[0]!;
    expect(within(faellig).getByText(F1!.id)).toBeTruthy();
    expect(within(faellig).getByText(F1!.thema!)).toBeTruthy();
    expect(within(faellig).getByText(`1 / ${CONFIG.fdStreakWeg}`)).toBeTruthy();
    const wann = within(faellig).getByText("jetzt");
    expect(hat(wann, "text-destructive")).toBe(true);
    expect(hat(wann, "text-muted-foreground")).toBe(false);
    const spaeter = within(abschnitt("Kommt später")).getAllByRole("listitem")[0]!;
    expect(within(spaeter).getByText(`2 / ${CONFIG.fdStreakWeg}`)).toBeTruthy();
    const spaet = within(spaeter).getByText("in 3 Tagen");
    expect(hat(spaet, "text-muted-foreground")).toBe(true);
    expect(hat(spaet, "text-destructive")).toBe(false);
  });

  it("mit oeffneFrage ist die Kennung ein Knopf, der die Frage meldet", async () => {
    const oeffne = vi.fn();
    legeDeck({ [F1!.id]: { streak: 0, due: Date.now() - TAG } });
    render(<Buehne oeffne={oeffne} />);
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: `Frage ${F1!.id} öffnen` }));
    expect(oeffne).toHaveBeenCalledWith(F1!.id);
  });
});

describe("Kennungen ohne Frage", () => {
  it("eine faellige und eine verwaiste: die Liste steht (kein Leer-Zustand), die verwaiste unter eigener Ueberschrift", () => {
    legeDeck({ [F1!.id]: { streak: 0, due: Date.now() - TAG }, "M99-999": { streak: 0, due: Date.now() - TAG } });
    render(<Buehne />);
    expect(screen.queryByText("Das Fehler-Deck ist leer.")).toBeNull();
    expect(screen.getByRole("heading", { name: "Ohne Frage im Bestand (1)" })).toBeTruthy();
    expect(screen.getByText("M99-999")).toBeTruthy();
  });

  it("nur verwaiste: kein Leer-Zustand; Einzahl 'Diese Kennung entfernen' loescht sie auf Klick", async () => {
    legeDeck({ "M99-999": { streak: 0, due: Date.now() - TAG } });
    render(<Buehne />);
    expect(screen.queryByText("Das Fehler-Deck ist leer.")).toBeNull();
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: "Diese Kennung entfernen" }));
    expect(gespeichert().fehlerDeck).toEqual({});
    expect(screen.getByText("Das Fehler-Deck ist leer.")).toBeTruthy();
  });

  it("Mehrzahl nennt die Zahl; entfernt nur die verwaisten", async () => {
    legeDeck({
      [F1!.id]: { streak: 0, due: Date.now() - TAG },
      "M99-998": { streak: 0, due: Date.now() - TAG }, "M99-999": { streak: 0, due: Date.now() - TAG },
    });
    render(<Buehne />);
    await userEvent.setup({ delay: null }).click(screen.getByRole("button", { name: "Diese 2 Kennungen entfernen" }));
    expect(Object.keys(gespeichert().fehlerDeck)).toEqual([F1!.id]);
    expect(screen.queryByText(/Ohne Frage im Bestand/)).toBeNull();
  });

  it("ohne verwaiste Kennung gibt es den Kasten nicht", () => {
    legeDeck({ [F1!.id]: { streak: 0, due: Date.now() - TAG } });
    render(<Buehne />);
    expect(screen.queryByText(/Ohne Frage im Bestand/)).toBeNull();
  });
});
