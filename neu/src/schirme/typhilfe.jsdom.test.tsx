// @vitest-environment jsdom
/* ============================================================================
   N24b: DIE TYP-HILFE DURCH DIE APP

   Abnahme laut docs/plaene/PLAN_NEUBAU.md: die Hilfe erscheint je Typ, das Häkchen wirkt
   SOFORT und übersteht das Neuladen, der Knopf in den Einstellungen holt alle
   zurück. Nicht in der Simulation.
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import App from "@/App";
import { LS_SCHLUESSEL } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { TYP_HILFE } from "@/kern/typhilfe";
import { useLernstand } from "@/huelle/useLernstand";
import { Simulation } from "./Simulation";

const HOTSPOT = FRAGEN.find((f) => f.typ === "hotspot")!;
const ZUORDNUNG = FRAGEN.find((f) => f.typ === "zuordnung")!;
const MC = FRAGEN.find((f) => f.typ === "mc")!;
const HAKEN = "Diese Bedienhilfe nicht mehr zeigen";

function gespeichert(): Record<string, any> {
  return JSON.parse(localStorage.getItem(LS_SCHLUESSEL) || "{}");
}
function oeffne(id: string) {
  cleanup();
  history.replaceState(null, "", "#frage=" + id);
  render(<App />);
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben"); });

describe("Die Hilfe erscheint je Typ", () => {
  it("hotspot und zuordnung zeigen ihren Text, mc keinen", () => {
    oeffne(HOTSPOT.id);
    expect(screen.getByText(TYP_HILFE.hotspot)).toBeTruthy();
    oeffne(ZUORDNUNG.id);
    expect(screen.getByText(TYP_HILFE.zuordnung)).toBeTruthy();
    oeffne(MC.id);
    expect(screen.queryByText("So geht's:")).toBeNull();
  });
});

describe("Das Häkchen", () => {
  it("wirkt sofort, nur für diesen Typ, und übersteht das Neuladen", async () => {
    const nutzer = userEvent.setup({ delay: null });
    oeffne(HOTSPOT.id);
    await nutzer.click(screen.getByRole("checkbox", { name: HAKEN }));
    expect(screen.queryByText(TYP_HILFE.hotspot), "sofort weg").toBeNull();
    expect(gespeichert().typHilfeAus).toEqual({ hotspot: true });
    oeffne(HOTSPOT.id);
    expect(screen.queryByText(TYP_HILFE.hotspot), "nach dem Neuladen weiter weg").toBeNull();
    oeffne(ZUORDNUNG.id);
    expect(screen.getByText(TYP_HILFE.zuordnung), "andere Typen bleiben").toBeTruthy();
  });
});

describe("Der Knopf in den Einstellungen", () => {
  it("holt alle zurück", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, typHilfeAus: { hotspot: true, matrix: true } }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Einstellungen" }));
    expect(screen.getByText("2 von 10 ausgeblendet.")).toBeTruthy();
    const knopf = screen.getByRole("button", { name: "Bedienhilfen wieder einblenden" });
    await nutzer.click(knopf);
    expect(gespeichert().typHilfeAus).toEqual({});
    expect(screen.getByText("Alle Bedienhilfen werden angezeigt.")).toBeTruthy();
    expect((knopf as HTMLButtonElement).disabled).toBe(true);
    oeffne(HOTSPOT.id);
    expect(screen.getByText(TYP_HILFE.hotspot)).toBeTruthy();
  });
});

describe("Nicht in der Prüfungssimulation", () => {
  /* ⚠️ hotspot ist NICHT simAuto (L.TYP) und kommt nie in die Prüfung – von den zehn
     Hilfetypen sind es nur zuordnung und reihenfolge. Also ein Bestand aus genau diesen. */
  function Buehne() {
    const lernstand = useLernstand();
    const [pool] = useState(() => FRAGEN.filter((f) => f.typ === "zuordnung" || f.typ === "reihenfolge"));
    return <Simulation lernstand={lernstand} pool={pool} />;
  }
  it("keine Frage im Lauf trägt eine Hilfe", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<Buehne />);
    const feld = screen.getByLabelText("Aufgaben insgesamt");
    await nutzer.clear(feld);
    await nutzer.type(feld, "8");
    await nutzer.click(screen.getByRole("button", { name: "Prüfung starten" }));
    const nav = screen.getAllByRole("button", { name: /^Frage \d+$/ });
    expect(nav.length).toBeGreaterThan(3);
    // NICHT VOM POOL HER FRAGEN, SONDERN VOM BILDSCHIRM (22.09.2026, BUILD_LOG 28).
    // Die erste Fassung rief fuer JEDE der 129 zuordnung/reihenfolge-Fragen screen.queryByText
    // auf - das ist je Aufruf ein voller DOM-Durchlauf, bei 8 Knoepfen 1032 Stueck. Der Test
    // brauchte allein 8,5 s und riss unter der Parallellast des vollen Laufs die 20-s-Grenze.
    // Jetzt: EIN Durchlauf je Knopf, Abgleich gegen ein Set. Dieselbe Frage, dieselbe Antwort -
    // der Vergleich ist wie bei queryByText der normalisierte Textinhalt eines Elements.
    const norm = (s: string) => s.replace(/\s+/g, " ").trim();
    const HILFETEXTE = new Set(
      FRAGEN.filter((f) => f.typ === "zuordnung" || f.typ === "reihenfolge").map((f) => norm(f.frage)),
    );
    let mitHilfetyp = 0;
    for (const knopf of nav) {
      await nutzer.click(knopf);
      const zeigtHilfetyp = Array.from(document.body.querySelectorAll("*")).some((el) =>
        HILFETEXTE.has(norm(el.textContent || "")),
      );
      if (zeigtHilfetyp) mitHilfetyp++;
      expect(screen.queryByText("So geht's:")).toBeNull();
    }
    expect(mitHilfetyp, "keine Frage eines Hilfetyps in der Prüfung").toBeGreaterThan(0);
  });
});
