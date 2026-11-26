// @vitest-environment jsdom
/* ============================================================================
   N23: TOOLTIPS UND LUPE ÜBER DIE ECHTE APP

   ⚠️ Die Ziehung würfelt, deshalb wird die Frage über das Fehler-Deck erzwungen
      (Muster: ueben.jsdom.test.tsx) — eine Frage MIT Begriff und eine MIT Bild.
   ============================================================================ */
import { useState } from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { tipTreffer } from "@/kern/glossartip";
import { useLernstand } from "@/huelle/useLernstand";
import { Simulation } from "./Simulation";

/** Eine mc-Frage, in der die Regel genau einen Begriff findet — und ihr Begriff. */
const MIT_BEGRIFF = FRAGEN.find((f) => f.typ === "mc" && tipTreffer(f, true).length > 0)!;
const BEGRIFF = tipTreffer(MIT_BEGRIFF, true)[0];
const MIT_BILD = FRAGEN.find((f) => "svg" in f && typeof f.svg === "string" && f.typ === "bild")!;
const gespeichert = (): Record<string, any> => JSON.parse(localStorage.getItem(LS_SCHLUESSEL) || "{}");
function stelleFrage(f: Frage, extra: Record<string, unknown> = {}) {
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
    version: 1, uebenZaehler: 4,
    fehlerDeck: { [f.id]: { streak: 0, due: Date.now() - 86400000 } }, ...extra,
  }));
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben"); });

describe("Begriffs-Tooltips im Fragetext", () => {
  it("der Bestand liefert die Testfälle", () => {
    expect(MIT_BEGRIFF, "keine mc-Frage mit Begriff im Bestand").toBeTruthy();
    expect(MIT_BILD, "keine Bildfrage im Bestand").toBeTruthy();
  });

  it("zeigt den Begriff, öffnet die Erklärung auf Klick und schließt mit Escape", async () => {
    stelleFrage(MIT_BEGRIFF);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    const knopf = screen.getByRole("button", { name: `Begriff: ${BEGRIFF.term}` });
    expect(knopf.textContent!.toLowerCase()).toBe(BEGRIFF.term.toLowerCase());
    /* der Fragetext bleibt vollständig lesbar */
    expect(document.querySelector('[data-teil="fragetext"]')!.textContent).toBe(MIT_BEGRIFF.frage);
    expect(document.querySelector('[data-teil="glossar-tip"]')).toBeNull();
    await nutzer.click(knopf);
    await waitFor(() => expect(document.querySelector('[data-teil="glossar-tip"]')).not.toBeNull());
    expect(document.querySelector('[data-teil="glossar-tip"]')!.textContent).toContain(BEGRIFF.def);
    await nutzer.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector('[data-teil="glossar-tip"]')).toBeNull());
  });

  it("ohne die Einstellung kein Begriff — der Text steht trotzdem da", () => {
    stelleFrage(MIT_BEGRIFF, { glossarTip: false });
    render(<App />);
    expect(screen.queryByRole("button", { name: `Begriff: ${BEGRIFF.term}` })).toBeNull();
    expect(document.querySelector('[data-teil="fragetext"]')!.textContent).toBe(MIT_BEGRIFF.frage);
  });

  it("der Schalter in den Einstellungen wirkt sofort auf die Karte", async () => {
    stelleFrage(MIT_BEGRIFF);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Einstellungen" }));
    const schalter = screen.getByRole("switch", { name: "Begriffs-Tooltips im Fragetext" });
    expect(schalter.getAttribute("aria-checked")).toBe("true");
    await nutzer.click(schalter);
    expect(gespeichert().glossarTip).toBe(false);
    await nutzer.click(screen.getByRole("button", { name: "Üben" }));
    expect(screen.queryByRole("button", { name: `Begriff: ${BEGRIFF.term}` })).toBeNull();
  });
});

describe("Die Lupe", () => {
  it("vergrößert das Bild und schließt mit Escape", async () => {
    stelleFrage(MIT_BILD);
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(document.querySelector('[data-teil="bild-zoom"]')).toBeNull();
    const knoepfe = screen.getAllByRole("button", { name: `Zeichnung zur Frage ${MIT_BILD.id} vergrößern` });
    expect(knoepfe.length, "Lupen-Knopf und Tap-Fläche").toBe(2);
    await nutzer.click(knoepfe[0]);
    await waitFor(() => expect(document.querySelector('[data-teil="bild-zoom"]')).not.toBeNull());
    expect(document.querySelector('[data-teil="bild-zoom"] svg')).not.toBeNull();
    expect(screen.getByRole("button", { name: "Schließen" })).toBeTruthy();
    await nutzer.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector('[data-teil="bild-zoom"]')).toBeNull());
  });

  it("bei hotspot gibt es nur den Knopf — der Klick aufs Bild wählt die Zone", () => {
    const hs = FRAGEN.find((f) => f.typ === "hotspot")!;
    expect(hs, "keine hotspot-Frage im Bestand").toBeTruthy();
    stelleFrage(hs);
    render(<App />);
    /* N24: dieselbe Beschriftung wie auf der Karte (bildBeschriftung), also mit Kennung. */
    expect(screen.getAllByRole("button", { name: `Zeichnung zur Frage ${hs.id} vergrößern` })).toHaveLength(1);
  });
});

describe("In der Prüfungssimulation", () => {
  /* ⛔ Der echte Pool würfelt; hier ein GEBAUTER Bestand aus lauter Bildfragen —
     sonst käme eine Bildfrage nur mit Glück in die Prüfung. */
  function Buehne() {
    const lernstand = useLernstand();
    const [pool] = useState(() => FRAGEN.filter((f) => f.typ === "bild"));
    return <Simulation lernstand={lernstand} pool={pool} />;
  }
  it("zeigt die Zeichnung, aber keine Tooltips", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<Buehne />);
    const feld = screen.getByLabelText("Aufgaben insgesamt");
    await nutzer.clear(feld);
    await nutzer.type(feld, "8");
    await nutzer.click(screen.getByRole("button", { name: "Prüfung starten" }));
    /* ⚠️ Die Fallaufgabe kommt aus `pool_faelle.json` und hat KEIN Bild — sie kann als
       erste Frage stehen (im vollen Lauf so gefallen). Also wird geblättert, bis eine
       Bildfrage kommt; dass es sie gibt, sichert der gebaute Bestand. */
    const nav = screen.getAllByRole("button", { name: /^Frage \d+$/ });
    let gefunden = false;
    for (const knopf of nav) {
      await nutzer.click(knopf);
      expect(screen.queryByRole("button", { name: /^Begriff: / }), "keine Tooltips in der Prüfung").toBeNull();
      if (document.querySelector("figure[role=img]")) { gefunden = true; break; }
    }
    expect(gefunden, "keine Zeichnung in der ganzen Prüfung").toBe(true);
    expect(screen.getAllByRole("button", { name: /vergrößern$/ }).length).toBeGreaterThan(0);
  });
});
