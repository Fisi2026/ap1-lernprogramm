// @vitest-environment jsdom
/* ⚠️ N24: ALLE Staende hier tragen `abrufAn: false`. Die Abruf-Uebung ist
   Voreinstellung (alte App, Nutzer-Entscheid 23.07.) und verdeckt mc/mehrfach/
   dropdown hinter einem Knopf — diese Datei prueft etwas anderes. Die Abruf-
   Uebung selbst prueft schalter.jsdom.test.tsx. */
/* ============================================================================
   N20a: STERN, „FRAGE MELDEN", SCHIRM „MARKIERT" UND EXPORT — DURCH DIE ECHTE APP

   ⛔ Gezeichnet wird die GANZE App (wie ueben.jsdom.test.tsx): der Lernstand
      kommt von oben, und geprüft wird, was wirklich im localStorage landet –
      in denselben Feldern, die die alte App liest (`markiert`, `meldungen`).
   ============================================================================ */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { meldungenText } from "@/kern/markiert";
import type { Lernstand } from "@/kern/stand";

const MC = FRAGEN.filter((f) => f.typ === "mc" && typeof f.loesungIndex === "number");
const A = MC[0];
const B = MC[1];

function gespeichert(): Record<string, any> {
  return JSON.parse(localStorage.getItem(LS_SCHLUESSEL) || "{}");
}
function legeStand(extra: Record<string, unknown>) {
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, abrufAn: false, ...extra }));
}
/** Erzwingt die gezogene Frage über den Fehler-Deck-Takt (Muster: ueben.jsdom.test.tsx). */
function stelleFrage(id: string, extra: Record<string, unknown> = {}) {
  legeStand({ uebenZaehler: 4, fehlerDeck: { [id]: { streak: 0, due: Date.now() - 86400000 } }, ...extra });
}
async function geheZu(nutzer: ReturnType<typeof userEvent.setup>, name: string) {
  await nutzer.click(screen.getByRole("button", { name }));
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

describe("Der Stern auf der Karteikarte", () => {
  it("schreibt markiert[id] = 1 und nimmt es wieder heraus", async () => {
    stelleFrage(A.id);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.getByText(/^M\d\d-\d+$/).textContent).toBe(A.id);
    const stern = screen.getByRole("button", { name: "Zum gezielten Wiederholen markieren" });
    expect(stern.getAttribute("aria-pressed")).toBe("false");
    await nutzer.click(stern);
    expect(gespeichert().markiert).toEqual({ [A.id]: 1 });
    const an = screen.getByRole("button", { name: "Markierung entfernen" });
    expect(an.getAttribute("aria-pressed")).toBe("true");
    await nutzer.click(an);
    expect(gespeichert().markiert).toEqual({});
  });
});

describe("Frage melden", () => {
  it("legt denselben Eintrag an wie die alte App und entfernt ihn wieder", async () => {
    stelleFrage(A.id);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByText("⚑ Frage melden"));
    await nutzer.click(screen.getByRole("radio", { name: "Tippfehler" }));
    await nutzer.type(screen.getByLabelText("Details zur Meldung"), "  Komma fehlt ");
    await nutzer.click(screen.getByRole("button", { name: "Melden" }));
    const m = gespeichert().meldungen[A.id];
    expect(m.grund).toBe("Tippfehler");
    expect(m.text).toBe("Komma fehlt");
    expect(typeof m.datum).toBe("number");
    expect(Object.keys(m).sort()).toEqual(["datum", "grund", "text"]);
    /* seit N20b steht dahinter der Versandstand */
    expect(document.querySelector('[data-teil="meldestatus"]')!.textContent).toMatch(/^Gemeldet am .* – Tippfehler: Komma fehlt/);
    await nutzer.click(screen.getByRole("button", { name: "Meldung entfernen" }));
    expect(gespeichert().meldungen).toEqual({});
  });

  it("ohne gewählten Grund wird „Sonstiges\" gespeichert", async () => {
    stelleFrage(A.id);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByText("⚑ Frage melden"));
    await nutzer.click(screen.getByRole("button", { name: "Melden" }));
    expect(gespeichert().meldungen[A.id].grund).toBe("Sonstiges");
  });
});

describe("Der Schirm „Markierte Fragen\"", () => {
  it("ist über die Schiene erreichbar, listet und entfernt – auch verwaiste Kennungen", async () => {
    legeStand({ markiert: { [A.id]: 1, [B.id]: 1, "WEG-999": 1 } });
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Markierte Fragen");
    const liste = document.querySelector('[data-teil="markiert-liste"]') as HTMLElement;
    expect(liste.textContent).toContain(A.id);
    expect(liste.textContent).toContain(B.id);
    expect(liste.textContent).not.toContain("WEG-999");
    expect(screen.getByText("Ohne Frage im Bestand (1)")).toBeTruthy();

    await nutzer.click(screen.getByRole("button", { name: `Markierung ${A.id} entfernen` }));
    expect(Object.keys(gespeichert().markiert).sort()).toEqual([B.id, "WEG-999"].sort());
    await nutzer.click(screen.getByRole("button", { name: "Diese Kennung entfernen" }));
    expect(gespeichert().markiert).toEqual({ [B.id]: 1 });
  });

  it("„Markierte üben\": jede Frage einmal, gebucht, weiter erst nach der Antwort", async () => {
    legeStand({ markiert: { [A.id]: 1, [B.id]: 1 } });
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Markierte Fragen");
    await nutzer.click(screen.getByRole("button", { name: "Markierte üben (2)" }));

    const gesehen: string[] = [];
    for (let i = 0; i < 2; i++) {
      gesehen.push(screen.getByText(/^M\d\d-\d+$/).textContent!);
      const weiter = screen.getByRole("button", { name: "Nächste markierte Frage" });
      expect((weiter as HTMLButtonElement).disabled, "vor der Antwort gesperrt").toBe(true);
      await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
      expect((weiter as HTMLButtonElement).disabled, "nach der Antwort frei").toBe(false);
      await nutzer.click(weiter);
    }
    expect(gesehen.sort()).toEqual([A.id, B.id].sort());
    expect(screen.getByText(/Fertig – alle markierten Fragen dieser Runde sind durch/)).toBeTruthy();
    /* gebucht wie beim Üben: beide im Fehler-Deck, zwei Antworten gezählt */
    const s = gespeichert();
    expect(Object.keys(s.fehlerDeck).sort()).toEqual([A.id, B.id].sort());
    expect((s.antworten as unknown[]).length).toBe(2);
    /* und die Markierungen bleiben stehen */
    expect(s.markiert).toEqual({ [A.id]: 1, [B.id]: 1 });
  });

  it("ohne Markierung: ein Satz, kein Übungsknopf", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Markierte Fragen");
    expect(screen.getByText(/Noch nichts markiert/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Markierte üben/ })).toBeNull();
  });
});

describe("Export der Meldungen in den Einstellungen", () => {
  it("bietet den Text im Format der alten App zum Speichern an", async () => {
    const meldungen = { [A.id]: { grund: "Veraltet", text: "Norm neu", datum: 1789600000000 } };
    legeStand({ meldungen });
    const erzeugt: Blob[] = [];
    const orig = { c: URL.createObjectURL, r: URL.revokeObjectURL };
    URL.createObjectURL = vi.fn((b: Blob) => { erzeugt.push(b); return "blob:x"; }) as never;
    URL.revokeObjectURL = vi.fn() as never;
    const klick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    try {
      const nutzer = userEvent.setup({ delay: null });
      render(<App />);
      await geheZu(nutzer, "Einstellungen");
      const karte = document.querySelector('[data-teil="meldungen-export"]') as HTMLElement;
      expect(karte.textContent).toContain("1 Meldung auf diesem Gerät.");
      await nutzer.click(within(karte).getByRole("button", { name: "Als Text speichern" }));
      expect(klick).toHaveBeenCalledTimes(1);
      expect(erzeugt).toHaveLength(1);
      const erwartet = meldungenText({ meldungen } as unknown as Lernstand, (id) => FRAGEN.find((f) => f.id === id));
      expect(await erzeugt[0].text()).toBe(erwartet);
      expect(erwartet).toContain(`[${A.id}]`);
    } finally {
      URL.createObjectURL = orig.c; URL.revokeObjectURL = orig.r; klick.mockRestore();
    }
  });

  it("ohne Meldung: ein Satz, keine Knöpfe", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Einstellungen");
    expect(screen.getByText("Auf diesem Gerät ist noch keine Frage gemeldet.")).toBeTruthy();
    /* nur im Abschnitt „Gemeldete Fragen“ – „Lernstand speichern“ (AUD-B2) steht unter „Speicher“ */
    const teil = document.querySelector('[data-teil="meldungen-export"]') as HTMLElement;
    expect(within(teil).queryByRole("button", { name: /speichern/ })).toBeNull();
  });
});
