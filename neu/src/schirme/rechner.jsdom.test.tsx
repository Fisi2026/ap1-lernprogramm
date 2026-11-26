// @vitest-environment jsdom
/* ============================================================================
   DER TASCHENRECHNER — DIE OBERFLAECHE (N26 T3)

   ⛔ Bedient wird wie ein Mensch: Tasten ueber ihren Namen, Tastatur ueber
      userEvent. Die Rechenregeln selbst prueft kern/rechner(.gleichheit).test.ts;
      hier nur, ob die Oberflaeche sie richtig erreicht.
   ⚠️ Die Einbindung in die App (wo der Rechner steht - und in der Simulation
      NICHT) ist T4; bis dahin wird die Komponente direkt gerendert.
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Rechner } from "./Rechner";
import { TASTEN, RECHNER_TEXTE, zurueck } from "@/kern/rechnertasten";

beforeEach(() => { cleanup(); localStorage.clear(); });

const anzeige = () => screen.getByRole("textbox", { name: RECHNER_TEXTE.anzeige }) as HTMLInputElement;
const meldung = () => screen.getByRole("status");
const taste = (name: string) => within(screen.getByRole("group", { name: "Tasten" })).getByRole("button", { name });

async function druecke(nutzer: ReturnType<typeof userEvent.setup>, ...namen: string[]) {
  for (const n of namen) await nutzer.click(taste(n));
}
function starte() {
  const nutzer = userEvent.setup({ delay: null });
  render(<Rechner />);
  return nutzer;
}

describe("Tasten: 32, klassischer Ziffernblock, sprechende Namen", () => {
  it("genau die 32 Tasten, in Lesereihenfolge, jede ueber ihren Namen erreichbar", () => {
    starte();
    const knoepfe = within(screen.getByRole("group", { name: "Tasten" })).getAllByRole("button");
    expect(TASTEN.length).toBe(32);
    expect(knoepfe.length).toBe(32);
    knoepfe.forEach((k, i) => expect(k.textContent, TASTEN[i]!.name).toBe(TASTEN[i]!.zeichen));
    for (const t of TASTEN) expect(taste(t.name)).toBeTruthy();
    expect(new Set(TASTEN.map((t) => t.name)).size).toBe(32);
  });

  it("der Ziffernblock: 7 8 9 oben, 0 unten, Rechenzeichen rechts in einer Spalte", () => {
    const zeichen = TASTEN.map((t) => t.zeichen);
    const zeile = (n: number) => zeichen.slice(n * 4, n * 4 + 4).join(" ");
    expect(zeile(4)).toBe("7 8 9 ÷");
    expect(zeile(5)).toBe("4 5 6 ×");
    expect(zeile(6)).toBe("1 2 3 −");
    expect(zeile(7)).toBe("0 , = +");
  });

  it("Symboltasten haben Woerter als Namen, Ziffern und Klammern ihr Zeichen", () => {
    starte();
    for (const [n, z] of [["mal", "×"], ["geteilt", "÷"], ["minus", "−"], ["plus", "+"], ["Wurzel", "√"], ["hoch", "^"],
      ["Prozent", "%"], ["Pi", "π"], ["Rückschritt", "←"], ["Alles löschen", "C"], ["gleich", "="], ["Komma", ","],
      ["Speicher abrufen", "MR"], ["Sinus", "sin"], ["7", "7"], ["(", "("]] as const) {
      expect(taste(n).textContent).toBe(z);
    }
  });
});

describe("Rechnen ueber die Tasten", () => {
  it("7 × 8 = 56 - und das Ergebnis bleibt zum Weiterrechnen stehen", async () => {
    const nutzer = starte();
    await druecke(nutzer, "7", "mal", "8");
    expect(anzeige().value).toBe("7×8");
    await druecke(nutzer, "gleich");
    expect(anzeige().value).toBe("56");
    expect(meldung().textContent).toBe("= 56");
    await druecke(nutzer, "plus", "4", "gleich");
    expect(anzeige().value).toBe("60");
  });

  it("Prozent, Vorrang, Komma und Funktionen", async () => {
    const nutzer = starte();
    await druecke(nutzer, "5", "0", "plus", "1", "0", "Prozent", "gleich");
    expect(anzeige().value).toBe("50.1");
    await druecke(nutzer, "Alles löschen", "Sinus", "3", "0", ")", "gleich");
    expect(anzeige().value).toBe("0.5");
    await druecke(nutzer, "Alles löschen", "Wurzel", "1", "6", ")", "mal", "2", "Komma", "5", "gleich");
    expect(anzeige().value).toBe("10");
    await druecke(nutzer, "Alles löschen", "Pi", "gleich");
    expect(anzeige().value).toBe("3.141592654");
  });

  it("ein Fehler steht in der Meldung, die Eingabe bleibt zum Korrigieren stehen", async () => {
    const nutzer = starte();
    await druecke(nutzer, "1", "geteilt", "0", "gleich");
    expect(meldung().textContent).toBe("Division durch null");
    expect(anzeige().value).toBe("1÷0");
    await druecke(nutzer, "Rückschritt", "4", "gleich");
    expect(anzeige().value).toBe("0.25");
  });

  it("Rueckschritt nimmt eine Funktion als Ganzes zurueck, sonst ein Zeichen", async () => {
    const nutzer = starte();
    await druecke(nutzer, "1", "2", "Rückschritt");
    expect(anzeige().value).toBe("1");
    await druecke(nutzer, "plus", "Kosinus", "Rückschritt");
    expect(anzeige().value).toBe("1+");
    expect(zurueck("2pi")).toBe("2");
    expect(zurueck("")).toBe("");
  });

  it("Speicher: M+ addiert den ausgewerteten Ausdruck, MR fuegt ein, MC leert", async () => {
    const nutzer = starte();
    await druecke(nutzer, "2", "plus", "3", "Speicher addieren");
    expect(meldung().textContent).toBe(RECHNER_TEXTE.imSpeicher + "5");
    await druecke(nutzer, "Alles löschen", "5", "Speicher addieren");
    expect(meldung().textContent).toBe(RECHNER_TEXTE.imSpeicher + "10");
    await druecke(nutzer, "Alles löschen", "Speicher abrufen");
    expect(anzeige().value).toBe("10");
    await druecke(nutzer, "Speicher löschen");
    expect(meldung().textContent).toBe(RECHNER_TEXTE.speicherGeloescht);
    await druecke(nutzer, "Alles löschen", "Speicher abrufen");
    expect(anzeige().value).toBe("0");
  });
});

describe("Anzeige schreibgeschuetzt, Tastatur bedienbar", () => {
  it("die Anzeige ist readonly - Buchstaben kommen nicht hinein", async () => {
    const nutzer = starte();
    expect(anzeige().readOnly).toBe(true);
    await nutzer.click(anzeige());
    await nutzer.keyboard("abc");
    expect(anzeige().value).toBe("");
  });

  it("Ziffern und Rechenzeichen, Enter rechnet, Escape loescht, Ruecktaste nimmt zurueck", async () => {
    const nutzer = starte();
    await nutzer.click(anzeige());
    await nutzer.keyboard("12*3-4/2");
    expect(anzeige().value).toBe("12×3−4÷2");
    await nutzer.keyboard("{Enter}");
    expect(anzeige().value).toBe("34");
    await nutzer.keyboard("{Backspace}");
    expect(anzeige().value).toBe("3");
    await nutzer.keyboard("{Escape}");
    expect(anzeige().value).toBe("");
    await nutzer.keyboard("1.5+1,5=");
    expect(anzeige().value).toBe("3");
  });

  it("Enter auf einer fokussierten Taste rechnet - und fuegt sie NICHT zusaetzlich ein", async () => {
    const nutzer = starte();
    await druecke(nutzer, "2", "plus", "7");
    expect(document.activeElement).toBe(taste("7"));
    await nutzer.keyboard("{Enter}");
    expect(anzeige().value).toBe("9");
  });
});

describe("Notizfeld: da, beschriftet, nicht persistent", () => {
  it("nimmt Text auf, schreibt nichts in den Speicher des Browsers, ist nach neuem Oeffnen leer", async () => {
    const nutzer = starte();
    const feld = screen.getByRole("textbox", { name: RECHNER_TEXTE.notizen });
    await nutzer.type(feld, "Nebenrechnung 12*3");
    expect((feld as HTMLTextAreaElement).value).toBe("Nebenrechnung 12*3");
    expect(anzeige().value).toBe("");                  // Tippen im Notizfeld rechnet nicht mit
    expect(localStorage.length).toBe(0);
    cleanup();
    render(<Rechner />);
    expect((screen.getByRole("textbox", { name: RECHNER_TEXTE.notizen }) as HTMLTextAreaElement).value).toBe("");
  });
});
