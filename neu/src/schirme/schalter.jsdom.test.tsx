// @vitest-environment jsdom
/* ============================================================================
   N24: JEDER SCHALTER WIRKT — GEPRÜFT DORT, WO ER GELESEN WIRD

   ⛔ Ein Schalter, der nur im Lernstand steht, ist Zierde. Deshalb prüft jeder
      Block hier ZWEI Dinge: dass die Einstellung im Lernstand landet, UND dass
      sie an der Stelle wirkt, die sie liest (Karte, Zeichnung, Simulation,
      Ziehung). Die Regeln selbst misst schalter.gleichheit.test.ts gegen die
      alte App.
   ============================================================================ */
import { istTyp } from "@/daten/typen";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { LS_SCHLUESSEL, leererStand } from "@/kern/stand";
import type { Lernstand } from "@/kern/stand";
import { FRAGEN } from "@/daten/laden";
import { Karteikarte } from "./Karteikarte";
import { svgAltFuer } from "@/kern/schalter";
import { gewichtsKontext } from "@/kern/ziehen";
import { lade } from "@/kern/stand";
import { useState } from "react";
import { useLernstand } from "@/huelle/useLernstand";
import { Simulation } from "./Simulation";
import { Tagesserie, type SerienLauf } from "./Tagesserie";

const MC = FRAGEN.filter((f) => istTyp(f, "mc")).filter((f) => Array.isArray(f.optionen) && typeof f.loesungIndex === "number");
const A = MC[0];
const B = MC[1];
const FREI = FRAGEN.find((f) => f.typ === "freitext")!;
const BILD = FRAGEN.find((f) => "svg" in f && typeof f.svg === "string" && f.typ !== "hotspot" && typeof f.thema === "string")!;
const HOTSPOT = FRAGEN.find((f) => f.typ === "hotspot")!;
const UEBERLEGT = "Ich hab's überlegt – Optionen zeigen";

function gespeichert(): Record<string, any> {
  return JSON.parse(localStorage.getItem(LS_SCHLUESSEL) || "{}");
}
function legeStand(extra: Record<string, unknown>) {
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ version: 1, ...extra }));
}
function merk(extra: Partial<Lernstand> = {}) {
  return { stand: { ...leererStand(), ...extra }, aendere: () => {} };
}
async function geheZu(nutzer: ReturnType<typeof userEvent.setup>, name: string) {
  await nutzer.click(screen.getByRole("button", { name }));
}
const richtigeOption = (f: typeof A) => (f.optionen as string[])[f.loesungIndex as number];

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben"); });

describe("Abruf-Übung (abrufAn) — an der Karte", () => {
  it("an: mc zeigt zuerst nur die Frage, der Knopf deckt die Optionen auf", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<Karteikarte frage={A} nummer={1} abruf />);
    expect(screen.queryByRole("radio", { name: richtigeOption(A) })).toBeNull();
    expect(screen.queryByRole("button", { name: "Aufgeben" }), "ohne Optionen nichts zu prüfen").toBeNull();
    await nutzer.click(screen.getByRole("button", { name: UEBERLEGT }));
    expect(screen.getByRole("radio", { name: richtigeOption(A) })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Aufgeben" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: UEBERLEGT })).toBeNull();
  });
  it("aus: die Optionen stehen sofort da", () => {
    render(<Karteikarte frage={A} nummer={1} abruf={false} />);
    expect(screen.getByRole("radio", { name: richtigeOption(A) })).toBeTruthy();
    expect(screen.queryByRole("button", { name: UEBERLEGT })).toBeNull();
  });
  it("freitext wird nie verdeckt (nur mc / mehrfach / dropdown)", () => {
    render(<Karteikarte frage={FREI} nummer={1} abruf />);
    expect(screen.queryByRole("button", { name: UEBERLEGT })).toBeNull();
    expect(screen.getByRole("button", { name: "Aufgeben" })).toBeTruthy();
  });
  it("eine Karte aus dem Verlauf wird nie verdeckt — sie ist schon beantwortet", () => {
    render(<Karteikarte frage={A} nummer={1} abruf herkunft="verlauf" antwortAusVerlauf={A.loesungIndex} />);
    expect(screen.queryByRole("button", { name: UEBERLEGT })).toBeNull();
    expect(screen.getByRole("radio", { name: richtigeOption(A) })).toBeTruthy();
  });
});

describe("Abruf-Übung (abrufAn) — durch die App", () => {
  it("Voreinstellung an: „Markierte üben“ verdeckt, die Einzelfrage nicht", async () => {
    legeStand({ markiert: { [A.id]: 1 } });
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Markierte Fragen");
    await nutzer.click(screen.getByRole("button", { name: "Markierte üben (1)" }));
    expect(screen.getByRole("button", { name: UEBERLEGT })).toBeTruthy();
    cleanup();
    history.replaceState(null, "", "#frage=" + A.id);
    render(<App />);
    expect(screen.getByRole("radio", { name: richtigeOption(A) })).toBeTruthy();
    expect(screen.queryByRole("button", { name: UEBERLEGT }), "E15: nicht in der Einzelfrage").toBeNull();
  });
  it("der Schalter in den Einstellungen schaltet sie ab — und die nächste Karte zeigt die Optionen", async () => {
    legeStand({ markiert: { [B.id]: 1 } });
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Einstellungen");
    const schalter = screen.getByRole("switch", { name: "Abruf-Übung" });
    expect(schalter.getAttribute("aria-checked")).toBe("true");
    await nutzer.click(schalter);
    expect(gespeichert().abrufAn).toBe(false);
    expect(schalter.getAttribute("aria-checked")).toBe("false");
    await geheZu(nutzer, "Markierte Fragen");
    await nutzer.click(screen.getByRole("button", { name: "Markierte üben (1)" }));
    expect(screen.queryByRole("button", { name: UEBERLEGT })).toBeNull();
    expect(screen.getByRole("radio", { name: richtigeOption(B) })).toBeTruthy();
  });
});

describe("Abruf-Übung — jeder Übungsweg reicht den Schalter durch", () => {
  it("Üben: die gezogene mc-Karte ist verdeckt", () => {
    /* Frage über den Fehler-Deck-Takt erzwingen (Muster: markiert.jsdom.test.tsx). */
    legeStand({ uebenZaehler: 4, fehlerDeck: { [A.id]: { streak: 0, due: Date.now() - 86400000 } } });
    render(<App />);
    expect(screen.getByText(A.id)).toBeTruthy();
    expect(screen.getByRole("button", { name: UEBERLEGT })).toBeTruthy();
  });
  it("Tagesserie: die Karte ist verdeckt", () => {
    function Buehne() {
      const lernstand = useLernstand();
      const [lauf, setLauf] = useState<SerienLauf | null>({
        gebiet: A.gebiet, ids: [A.id], pos: 0, richtig: 0, beantwortet: false, fertig: false,
      });
      return lauf ? <Tagesserie lernstand={lernstand} lauf={lauf} setzeLauf={setLauf} zumUeben={() => {}} /> : null;
    }
    render(<Buehne />);
    expect(screen.getByRole("button", { name: UEBERLEGT })).toBeTruthy();
  });
});

describe("Inhaltliche Bildbeschreibungen (ariaAltTexte)", () => {
  it("aus (Voreinstellung): die generische Zeile — das Bild bleibt beschriftet (E15)", () => {
    render(<Karteikarte frage={BILD} nummer={1} merk={merk()} />);
    expect(screen.getByRole("img", { name: `Zeichnung zur Frage ${BILD.id}` })).toBeTruthy();
  });
  it("an: der inhaltliche Text aus svgAltFuer", () => {
    render(<Karteikarte frage={BILD} nummer={1} merk={merk({ ariaAltTexte: true })} />);
    expect(screen.getByRole("img", { name: svgAltFuer(BILD) })).toBeTruthy();
    expect(svgAltFuer(BILD)).toContain(" zum Thema ");
  });
  it("hotspot: dieselbe Regel an der Zeichnung, die die Eingabe ist, und an ihrer Lupe", () => {
    render(<Karteikarte frage={HOTSPOT} nummer={1} merk={merk({ ariaAltTexte: true })} />);
    expect(screen.getByRole("img", { name: svgAltFuer(HOTSPOT) })).toBeTruthy();
    expect(screen.getByRole("button", { name: `${svgAltFuer(HOTSPOT)} vergrößern` })).toBeTruthy();
  });
  it("der Schalter schreibt den Lernstand, und die Einzelfrage liest ihn", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Einstellungen");
    await nutzer.click(screen.getByRole("switch", { name: "Inhaltliche Bildbeschreibungen" }));
    expect(gespeichert().ariaAltTexte).toBe(true);
    cleanup();
    history.replaceState(null, "", "#frage=" + BILD.id);
    render(<App />);
    expect(screen.getByRole("img", { name: svgAltFuer(BILD) })).toBeTruthy();
  });
});

describe("Inhaltliche Bildbeschreibungen — auch in der Prüfungssimulation", () => {
  function Buehne() {
    const lernstand = useLernstand();
    const [pool] = useState(() => FRAGEN.filter((f) => f.typ === "bild"));
    return <Simulation lernstand={lernstand} pool={pool} />;
  }
  it("an: die Zeichnung trägt den inhaltlichen Text", async () => {
    legeStand({ ariaAltTexte: true });
    const nutzer = userEvent.setup({ delay: null });
    render(<Buehne />);
    const feld = screen.getByLabelText("Aufgaben insgesamt");
    await nutzer.clear(feld);
    await nutzer.type(feld, "8");
    await nutzer.click(screen.getByRole("button", { name: "Prüfung starten" }));
    /* Die Fallaufgabe hat kein Bild — blättern bis zur ersten Bildfrage (Muster glossartip.jsdom). */
    let label: string | null = null;
    for (const knopf of screen.getAllByRole("button", { name: /^Frage \d+$/ })) {
      await nutzer.click(knopf);
      const fig = document.querySelector("figure[role=img]");
      if (fig) { label = fig.getAttribute("aria-label"); break; }
    }
    expect(label, "keine Bildfrage in der Prüfung").not.toBeNull();
    expect(label).toContain(" zum Thema ");
    expect(label).not.toContain("Zeichnung zur Frage");
  });
});

describe("Simulationsdauer (simDauerMin)", () => {
  it("45 eingetragen: gespeichert und auf dem Startschirm der Simulation", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Einstellungen");
    const feld = screen.getByLabelText("Dauer in Minuten");
    expect((feld as HTMLInputElement).value).toBe("90");
    await nutzer.clear(feld);
    await nutzer.type(feld, "45");
    expect(gespeichert().simDauerMin).toBe(45);
    await geheZu(nutzer, "Prüfungssimulation");
    expect(screen.getByText("45 Minuten")).toBeTruthy();
  });
  it("0 heißt automatisch, über 240 wird gedeckelt", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await geheZu(nutzer, "Einstellungen");
    const feld = screen.getByLabelText("Dauer in Minuten");
    await nutzer.clear(feld);
    await nutzer.type(feld, "999");
    expect(gespeichert().simDauerMin).toBe(240);
    await nutzer.clear(feld);
    await nutzer.type(feld, "0");
    expect(gespeichert().simDauerMin).toBe(0);
    await geheZu(nutzer, "Prüfungssimulation");
    expect(screen.getByText("automatisch aus den Richtwerten der Fragetypen")).toBeTruthy();
  });
});

describe("Prüfungsnah gewichten (relevanzGewichtung)", () => {
  it("der Schalter schreibt den Lernstand, und die Ziehung liest ihn", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(gewichtsKontext(lade().stand, []).relevanzAn, "Voreinstellung an").toBe(true);
    await geheZu(nutzer, "Einstellungen");
    await nutzer.click(screen.getByRole("switch", { name: "Prüfungsnah gewichten" }));
    expect(gespeichert().relevanzGewichtung).toBe(false);
    expect(gewichtsKontext(lade().stand, []).relevanzAn).toBe(false);
  });
});
