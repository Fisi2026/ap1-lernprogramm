// @vitest-environment jsdom
/* ============================================================================
   N25 P4: DIE KARTE AUS SHADCN-BAUSTEINEN — NUR DAS, WAS DIE BAUSTEINE NEU
   ENTSCHIEDEN HABEN (Nutzer-Entscheide 21.09.2026)

   1. shadcns `Alert` setzt immer role="alert" (der Screenreader unterbricht
      und liest sofort vor). Auf der Karte traegt das NUR das Urteil; „So
      geht's", der Abruf-Hinweis und „Eingabe noch nicht gebaut" sind `note`.
   2. „Frage melden" ist ein `Collapsible` und BLEIBT nach „Meldung entfernen"
      offen — vorher haing das <details> am Vorhandensein der Meldung und
      klappte dabei zu.
   ⛔ Alles andere an der Karte prueft weiter, wer es schon prueft (Rollen und
      Namen sind Vertrag): markiert · typhilfe · schalter · rueckseite.
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { Karteikarte } from "./Karteikarte";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { TYP_HILFE } from "@/kern/typhilfe";

const HOTSPOT = FRAGEN.find((f) => f.typ === "hotspot")!;
const MC = FRAGEN.find((f) => f.typ === "mc" && typeof f.loesungIndex === "number")!;
const MELDEN = "⚑ Frage melden";

function gespeichert(): Record<string, unknown> {
  return JSON.parse(localStorage.getItem(LS_SCHLUESSEL) || "{}");
}
/** Die Einzelfrage (#frage=ID) bucht nichts und zeigt dieselbe Karteikarte. */
function oeffne(id: string) {
  cleanup();
  history.replaceState(null, "", "#frage=" + id);
  render(<App />);
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben"); });

describe("Nur das Urteil ist ein alert", () => {
  it("die Bedienhilfe ist eine note — vor dem Pruefen unterbricht nichts", () => {
    oeffne(HOTSPOT.id);
    const hilfe = screen.getByText(TYP_HILFE.hotspot);
    expect(hilfe.closest('[data-slot="alert"]')!.getAttribute("role")).toBe("note");
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  it("der Abruf-Hinweis ist eine note", () => {
    /* ⚠️ Nur ueber die Karteikarte selbst zu erreichen: in der Einzelfrage
       (#frage=ID) gilt die Abruf-Uebung NICHT (Entscheid E15) — der Fall der
       ganzen App wuerde hier still ins Leere laufen. Gemessen ueber die
       Sabotage P4b, die ohne diesen Fall gruen blieb. */
    render(<Karteikarte frage={MC} nummer={1} abruf />);
    const hinweis = screen.getByText(/Überlege die Antwort zuerst selbst/);
    expect(hinweis.closest('[data-slot="alert"]')!.getAttribute("role")).toBe("note");
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  it("nach dem Pruefen gibt es genau EINEN alert, und er traegt das Urteil", async () => {
    const nutzer = userEvent.setup({ delay: null });
    oeffne(MC.id);
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
    const alarme = screen.getAllByRole("alert");
    expect(alarme).toHaveLength(1);
    expect(alarme[0].textContent).toBe("Nicht richtig.");
  });
});

describe("„Frage melden\" bleibt nach dem Entfernen offen", () => {
  it("klappt mit vorhandener Meldung auf und bleibt danach offen", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1, abrufAn: false,
      meldungen: { [MC.id]: { grund: "Tippfehler", text: "", datum: Date.now() } },
    }));
    const nutzer = userEvent.setup({ delay: null });
    oeffne(MC.id);
    expect(screen.getByRole("button", { name: MELDEN }).getAttribute("aria-expanded"),
      "eine vorhandene Meldung klappt den Bereich auf").toBe("true");
    await nutzer.click(screen.getByRole("button", { name: "Meldung entfernen" }));
    expect(gespeichert().meldungen).toEqual({});
    expect(screen.getByRole("button", { name: MELDEN }).getAttribute("aria-expanded"),
      "man steht gerade darin — er bleibt offen").toBe("true");
    expect(screen.getByLabelText("Details zur Meldung")).toBeTruthy();
  });

  it("ohne Meldung ist der Bereich zu", () => {
    oeffne(MC.id);
    expect(screen.getByRole("button", { name: MELDEN }).getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByLabelText("Details zur Meldung")).toBeNull();
  });
});
