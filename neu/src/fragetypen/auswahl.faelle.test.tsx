// @vitest-environment jsdom
/* N43 M3 (Mutationstest fragetypen): Verhalten der Auswahl-, Zuordnungs-, Konsolen-, Tabellen-,
   Generator- und Bildkomponenten sowie der Hilfsdateien – an GEBAUTEN Fragen, je Regel ein Fall.
   Geprueft wird, was auf dem Schirm steht und was `aufAntwort` meldet, nicht die Umsetzung. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MC, Mehrfach } from "./Auswahl";
import { Fehlersuche, Mtf, Szenario2 } from "./Einfach";
import { Zuordnung } from "./Zuordnung";
import { Konsole } from "./Konsole";
import { Trace, Kreuztabelle } from "./Tabellen";
import { Generator } from "./Generator";
import { Bildflaeche, BILDGRUND } from "./Bildflaeche";
import { hatGeantwortet } from "./vertrag";
import { zerlegen, PLATZHALTER } from "./luecken";
import { MischKontext, useMischer } from "./mischung";
import { neuerMischer } from "@/kern/anzeige";
import { gradeZuordnung } from "@/kern/bewertung";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

/* Gebaute Fragen: nur die Felder, die die Komponente liest. */
/** Klassen als Liste: Teilstrings wie `aria-invalid:border-destructive` zaehlen nicht. */
const hat = (e: Element, k: string) => e.className.split(/\s+/).includes(k);

/** Text unnormalisiert (Leerzeichen um Trenner zaehlen). */
const roh = (t: string) => screen.queryByText((_, e) => e?.children.length === 0 && e.textContent === t);

const bau = (f: Record<string, unknown>) => f as never;

/** Zeichnet und liefert, was `aufAntwort` gemeldet hat. */
function zeichne(Komp: (p: never) => unknown, frage: Record<string, unknown>, antwort?: unknown, gesperrt = false) {
  const meldungen: unknown[] = [];
  const props = { frage: bau(frage), antwort, gesperrt, aufAntwort: (a: unknown) => meldungen.push(a) };
  const r = render(createElement(Komp as never, props as never));
  return { meldungen, ...r };
}

/* ------------------------------------------------------------------ vertrag */
describe("hatGeantwortet", () => {
  it("undefined und null sind keine Antwort", () => {
    expect(hatGeantwortet(undefined)).toBe(false);
    expect(hatGeantwortet(null)).toBe(false);
  });
  it("Feld: nur wenn nicht leer und jedes Element befuellt ist", () => {
    expect(hatGeantwortet([])).toBe(false);
    expect(hatGeantwortet([1, 2])).toBe(true);
    expect(hatGeantwortet([0])).toBe(true);
    expect(hatGeantwortet([1, ""])).toBe(false);
    expect(hatGeantwortet([1, null])).toBe(false);
    expect(hatGeantwortet([undefined, 1])).toBe(false);
    expect(hatGeantwortet([false])).toBe(true);
  });
  it("Objekt: nur mit mindestens einem Schluessel", () => {
    expect(hatGeantwortet({})).toBe(false);
    expect(hatGeantwortet({ 0: 1 })).toBe(true);
  });
  it("Text: leer oder nur Leerraum zaehlt nicht", () => {
    expect(hatGeantwortet("")).toBe(false);
    expect(hatGeantwortet("   ")).toBe(false);
    expect(hatGeantwortet(" a ")).toBe(true);
  });
  it("Zahlen und Wahrheitswerte zaehlen immer, auch 0 und false", () => {
    expect(hatGeantwortet(0)).toBe(true);
    expect(hatGeantwortet(false)).toBe(true);
    expect(hatGeantwortet(3)).toBe(true);
  });
});

describe("luecken", () => {
  it("zerlegt am Platzhalter ___", () => {
    expect(PLATZHALTER).toBe("___");
    expect(zerlegen("a ___ b ___ c")).toEqual(["a ", " b ", " c"]);
    expect(zerlegen("ohne")).toEqual(["ohne"]);
  });
});

describe("mischung", () => {
  function Zeige({ melde }: { melde: (m: unknown) => void }) {
    melde(useMischer());
    return null;
  }
  it("ein Rahmen gibt seinen Mischer weiter", () => {
    const m = neuerMischer();
    let gesehen: unknown;
    render(createElement(MischKontext.Provider, { value: m }, createElement(Zeige, { melde: (x) => { gesehen = x; } })));
    expect(gesehen).toBe(m);
  });
  it("ohne Rahmen hat die Anzeige einen eigenen, stabilen Mischer", () => {
    const gesehen: unknown[] = [];
    const { rerender } = render(createElement(Zeige, { melde: (x) => gesehen.push(x) }));
    rerender(createElement(Zeige, { melde: (x) => gesehen.push(x) }));
    expect(gesehen[0]).toBeTruthy();
    expect(gesehen[1]).toBe(gesehen[0]);
  });
});

/* ------------------------------------------------------------------ Auswahl */
const MC_FRAGE = { id: "T-MC", optionen: ["Alpha", "Beta", "Gamma"], loesungIndex: 1 };

describe("MC", () => {
  it("zeigt Marken A, B, C (Schmuck, fuer den Screenreader stumm) und meldet den Ursprungs-Index", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);   // Zufall nahe 1: Reihenfolge bleibt
    const { meldungen, container } = zeichne(MC as never, MC_FRAGE);
    const marken = [...container.querySelectorAll("span[aria-hidden]")].map((s) => s.textContent);
    expect([...marken].sort()).toEqual(["A", "B", "C"]);
    await userEvent.click(screen.getByRole("radio", { name: "Gamma" }));
    expect(meldungen).toEqual([2]);
  });
  it("die Gruppe heisst Antwortmoeglichkeiten und waehlt die uebergebene Antwort vor", () => {
    zeichne(MC as never, MC_FRAGE, 0);
    expect(screen.getByRole("radiogroup", { name: "Antwortmöglichkeiten" })).toBeTruthy();
    expect((screen.getByRole("radio", { name: "Alpha" }) as HTMLElement).getAttribute("aria-checked")).toBe("true");
    expect((screen.getByRole("radio", { name: "Beta" }) as HTMLElement).getAttribute("aria-checked")).toBe("false");
  });
  it("ohne Antwort ist nichts gewaehlt", () => {
    zeichne(MC as never, MC_FRAGE);
    for (const r of screen.getAllByRole("radio")) expect(r.getAttribute("aria-checked")).toBe("false");
  });
  it("ohne optionen steht nichts da (kein Absturz)", () => {
    zeichne(MC as never, { id: "T-MC0" });
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });
  it("vor dem Pruefen kein Urteil; gesperrt sind die Knoepfe aus", () => {
    const { container } = zeichne(MC as never, MC_FRAGE, 0);
    expect(container.querySelector("[data-urteil]")?.getAttribute("data-urteil") ?? null).toBeNull();
    expect(screen.queryByText("richtig")).toBeNull();
    cleanup();
    zeichne(MC as never, MC_FRAGE, 0, true);
    for (const r of screen.getAllByRole("radio")) expect(r.hasAttribute("disabled")).toBe(true);
  });
  it("nach dem Pruefen: richtige Option 'richtig', eigene falsche 'deine Wahl – falsch', andere ohne Wort", () => {
    const { container } = zeichne(MC as never, MC_FRAGE, 0, true);
    expect(screen.getAllByText("richtig")).toHaveLength(1);
    expect(screen.getAllByText("deine Wahl – falsch")).toHaveLength(1);
    expect(container.querySelectorAll('[data-urteil="richtig"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-urteil="falsch"]')).toHaveLength(1);
    const richtig = container.querySelector('[data-urteil="richtig"]')!;
    expect(within(richtig as HTMLElement).getByText("Beta")).toBeTruthy();
    const falsch = container.querySelector('[data-urteil="falsch"]')!;
    expect(within(falsch as HTMLElement).getByText("Alpha")).toBeTruthy();
  });
  it("richtig gewaehlt: nur ein Urteil, kein falsches", () => {
    const { container } = zeichne(MC as never, MC_FRAGE, 1, true);
    expect(container.querySelectorAll('[data-urteil="falsch"]')).toHaveLength(0);
    expect(screen.queryByText("deine Wahl – falsch")).toBeNull();
    expect(screen.getAllByText("richtig")).toHaveLength(1);
  });
});

describe("Mehrfach", () => {
  const F = { id: "T-MF", optionen: ["Alpha", "Beta", "Gamma", "Delta"], loesungIndizes: [0, 2] };
  it("haengt an die bestehende Wahl an und meldet Ursprungs-Indizes", async () => {
    const { meldungen } = zeichne(Mehrfach as never, F, [1]);
    await userEvent.click(screen.getByRole("checkbox", { name: "Gamma" }));
    expect(meldungen).toEqual([[1, 2]]);
  });
  it("nimmt eine gewaehlte Option wieder heraus", async () => {
    const { meldungen } = zeichne(Mehrfach as never, F, [0, 2]);
    await userEvent.click(screen.getByRole("checkbox", { name: "Alpha" }));
    expect(meldungen).toEqual([[2]]);
  });
  it("zeigt die Auswahl als angehakt und nennt die Gruppe Antwortmoeglichkeiten", () => {
    zeichne(Mehrfach as never, F, [3]);
    expect(screen.getByRole("group", { name: "Antwortmöglichkeiten" })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Delta" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("checkbox", { name: "Alpha" }).getAttribute("aria-checked")).toBe("false");
  });
  it("eine Antwort, die keine Zahlenliste ist, zaehlt als nichts gewaehlt", () => {
    zeichne(Mehrfach as never, F, "quatsch");
    for (const c of screen.getAllByRole("checkbox")) expect(c.getAttribute("aria-checked")).toBe("false");
  });
  it("nach dem Pruefen: richtige 'richtig', falsch Gewaehlte 'deine Wahl – falsch', verpasste ohne Falsch-Urteil", () => {
    const { container } = zeichne(Mehrfach as never, F, [1, 2], true);
    expect(container.querySelectorAll('[data-urteil="richtig"]')).toHaveLength(2);   // Alpha (verpasst) und Gamma
    expect(container.querySelectorAll('[data-urteil="falsch"]')).toHaveLength(1);    // Beta
    for (const c of screen.getAllByRole("checkbox")) expect(c.hasAttribute("disabled")).toBe(true);
  });
  it("ohne loesungIndizes kein Urteil 'richtig'", () => {
    const { container } = zeichne(Mehrfach as never, { id: "x", optionen: ["A1", "B1"] }, [0], true);
    expect(container.querySelectorAll('[data-urteil="richtig"]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-urteil="falsch"]')).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------- Einfach */
describe("Fehlersuche", () => {
  const F = { id: "T-FS", zeilen: ["x = 1", "y = x +", "z = 3"], fehlerZeile: 1 };
  it("fragt nach der fehlerhaften Zeile, nummeriert 1..n und meldet den Index", async () => {
    const { meldungen, container } = zeichne(Fehlersuche as never, F);
    expect(screen.getByText("Welche Zeile enthält den Fehler?")).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Zeilen" })).toBeTruthy();
    const marken = [...container.querySelectorAll("span[aria-hidden]")].map((s) => s.textContent);
    expect(marken).toEqual(["1", "2", "3"]);
    await userEvent.click(screen.getByRole("radio", { name: "z = 3" }));
    expect(meldungen).toEqual([2]);
  });
  it("Zeile 0 ist waehlbar und vorgewaehlt", async () => {
    const { meldungen } = zeichne(Fehlersuche as never, F, 0);
    expect(screen.getByRole("radio", { name: "x = 1" }).getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByRole("radio", { name: "y = x +" }));
    expect(meldungen).toEqual([1]);
  });
  it("nach dem Pruefen: fehlerhafte Zeile 'richtig', falsche Wahl 'deine Wahl – falsch'", () => {
    const { container } = zeichne(Fehlersuche as never, F, 2, true);
    expect(within(container.querySelector('[data-urteil="richtig"]') as HTMLElement).getByText("y = x +")).toBeTruthy();
    expect(within(container.querySelector('[data-urteil="falsch"]') as HTMLElement).getByText("z = 3")).toBeTruthy();
  });
  it("ohne Zeilen leer; keine Zahl als Antwort = nichts gewaehlt", () => {
    zeichne(Fehlersuche as never, { id: "x" }, "a");
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });
});

describe("Mtf", () => {
  const F = { id: "T-MTF", aussagen: [{ text: "Erste", wahr: true }, { text: "Zweite", wahr: false }] };
  it("meldet ein Feld aus Wahrheitswerten, der Rest bleibt offen (null)", async () => {
    const { meldungen } = zeichne(Mtf as never, F);
    expect(screen.getByText("Wahr oder falsch? Nur alles richtig zählt.")).toBeTruthy();
    await userEvent.click(screen.getByRole("radio", { name: "Aussage 2: falsch" }));
    expect(meldungen).toEqual([[null, false]]);
  });
  it("behaelt die andere Aussage und stellt den Zustand dar", async () => {
    const { meldungen } = zeichne(Mtf as never, F, [true, null]);
    expect(screen.getByRole("radio", { name: "Aussage 1: wahr" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Aussage 1: falsch" }).getAttribute("aria-checked")).toBe("false");
    await userEvent.click(screen.getByRole("radio", { name: "Aussage 2: wahr" }));
    expect(meldungen).toEqual([[true, true]]);
  });
  it("ein zweiter Klick auf die gewaehlte Seite aendert nichts (keine Meldung)", async () => {
    const { meldungen } = zeichne(Mtf as never, F, [true, false]);
    await userEvent.click(screen.getByRole("radio", { name: "Aussage 1: wahr" }));
    expect(meldungen).toEqual([]);
  });
  it("false als gewaehlter Wert bleibt false (nicht offen)", () => {
    zeichne(Mtf as never, F, [false, false]);
    expect(screen.getByRole("radio", { name: "Aussage 1: falsch" }).getAttribute("aria-checked")).toBe("true");
  });
  it("nach dem Pruefen: je Aussage 'richtig: wahr|falsch' und Urteil richtig/falsch", () => {
    const { container } = zeichne(Mtf as never, F, [false, false], true);
    expect(screen.getByText("richtig: wahr")).toBeTruthy();
    expect(screen.getByText("richtig: falsch")).toBeTruthy();
    const urteile = [...container.querySelectorAll("[data-urteil]")].map((e) => e.getAttribute("data-urteil"));
    expect(urteile).toEqual(["falsch", "richtig"]);
    for (const r of screen.getAllByRole("radio")) expect(r.hasAttribute("disabled")).toBe(true);
  });
  it("vor dem Pruefen weder Urteil noch Loesungswort", () => {
    const { container } = zeichne(Mtf as never, F, [true, false]);
    expect(container.querySelector("[data-urteil]")).toBeNull();
    expect(screen.queryByText(/richtig:/)).toBeNull();
  });
  it("eine Aussage ohne wahr-Angabe zeigt kein Loesungswort", () => {
    zeichne(Mtf as never, { id: "x", aussagen: [{ text: "Offen" }] }, [true], true);
    expect(screen.queryByText(/richtig:/)).toBeNull();
  });
});

describe("Szenario2", () => {
  const F = {
    id: "T-S2",
    schritt1: { frage: "Erst?", optionen: ["a1", "a2"], loesungIndex: 0 },
    schritt2: { frage: "Dann?", optionen: ["b1", "b2", "b3"], loesungIndex: 2 },
  };
  it("zwei Schritte mit Titel und Frage, Hinweis dass beide stimmen muessen", () => {
    zeichne(Szenario2 as never, F);
    expect(screen.getByText("Schritt 1: Erst?")).toBeTruthy();
    expect(screen.getByText("Schritt 2: Dann?")).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Schritt 1" })).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Schritt 2" })).toBeTruthy();
    expect(screen.getByText("Beide Schritte müssen stimmen.")).toBeTruthy();
  });
  it("meldet {s1, s2} und behaelt den anderen Schritt", async () => {
    const { meldungen } = zeichne(Szenario2 as never, F, { s1: 1 });
    await userEvent.click(screen.getByRole("radio", { name: "b3" }));
    expect(meldungen).toEqual([{ s1: 1, s2: 2 }]);
  });
  it("nur ein Schritt gegeben: der andere fehlt", () => {
    zeichne(Szenario2 as never, { id: "x", schritt1: F.schritt1 });
    expect(screen.queryByRole("radiogroup", { name: "Schritt 2" })).toBeNull();
    expect(screen.getByRole("radiogroup", { name: "Schritt 1" })).toBeTruthy();
  });
  it("nach dem Pruefen je Schritt richtig/falsch markiert", () => {
    const { container } = zeichne(Szenario2 as never, F, { s1: 1, s2: 2 }, true);
    expect(container.querySelectorAll('[data-urteil="richtig"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-urteil="falsch"]')).toHaveLength(1);
  });
  it("eine Antwort, die kein Objekt ist, waehlt nichts vor", () => {
    zeichne(Szenario2 as never, F, "x");
    for (const r of screen.getAllByRole("radio")) expect(r.getAttribute("aria-checked")).toBe("false");
  });
});

/* ----------------------------------------------------------------- Zuordnung */
describe("Zuordnung", () => {
  const F = { id: "T-ZU", paare: [["Hund", "Tier"], ["Katze", "Tier"], ["Rose", "Pflanze"]] };
  it("eine Auswahl je Aussage, Kategorien ohne Wiederholung, Wert = erster Index der Kategorie", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    const { meldungen } = zeichne(Zuordnung as never, F);
    const feld = screen.getByLabelText("Zuordnung 2") as HTMLSelectElement;
    const texte = [...feld.options].map((o) => o.textContent);
    expect(texte[0]).toBe("— zuordnen —");
    expect(texte.slice(1).sort()).toEqual(["Pflanze", "Tier"]);
    const werte = new Map([...feld.options].slice(1).map((o) => [o.textContent, o.value]));
    expect(werte.get("Tier")).toBe("0");
    expect(werte.get("Pflanze")).toBe("2");
    await userEvent.selectOptions(feld, [...feld.options].find((o) => o.textContent === "Pflanze")!);
    expect(meldungen).toEqual([{ 1: 2 }]);
  });
  /* K3-E64 (Meldung 18): Zusatz-Kategorien stehen in der Auswahl, ihre Wahl ist falsch, eine Doppelung wird verschluckt. */
  it("Zusatz-Kategorien (extra): zur Wahl, Index ab paare.length, Wahl bewertet falsch", async () => {
    const FX = { ...F, extra: ["Pilz", "Tier", "Stein"] };
    const { meldungen } = zeichne(Zuordnung as never, FX);
    const feld = screen.getByLabelText("Zuordnung 3") as HTMLSelectElement;
    const werte = new Map([...feld.options].slice(1).map((o) => [o.textContent, o.value]));
    expect([...werte.keys()].sort()).toEqual(["Pflanze", "Pilz", "Stein", "Tier"]);
    expect(werte.get("Pilz")).toBe("3");
    expect(werte.get("Stein")).toBe("4");
    expect(werte.get("Tier")).toBe("0");
    await userEvent.selectOptions(feld, werte.get("Pilz")!);
    expect(meldungen).toEqual([{ 2: 3 }]);
    expect(gradeZuordnung(FX as never, { 0: 0, 1: 0, 2: 3 })).toBe(false);
    expect(gradeZuordnung(FX as never, { 0: 0, 1: 0, 2: 2 })).toBe(true);
  });
  /* K3-E65 / P3 (Meldung 8): jede Zeile hat ihre EIGENE Reihenfolge – sonst stand die Loesung in allen Zeilen gleich. */
  it("mischt je Zeile mit eigenem Schluessel (Zeile 1 vorwaerts, Zeile 2 rueckwaerts)", () => {
    const schluessel: string[] = [];
    const mischer = { reihenfolge: (k: string, n: number) => { schluessel.push(k); const r = [...Array(n).keys()]; return k.endsWith(":0") ? r : r.reverse(); } };
    render(createElement(MischKontext.Provider, { value: mischer },
      createElement(Zuordnung as never, { frage: bau(F), antwort: undefined, gesperrt: false, aufAntwort: () => {} } as never)));
    const text = (n: number) => [...(screen.getByLabelText("Zuordnung " + n) as HTMLSelectElement).options].slice(1).map((o) => o.textContent);
    expect(text(1)).toEqual(["Tier", "Pflanze"]);
    expect(text(2)).toEqual(["Pflanze", "Tier"]);
    expect(new Set(schluessel)).toEqual(new Set(["T-ZU:kategorien:0", "T-ZU:kategorien:1", "T-ZU:kategorien:2"]));
  });
  it("behaelt die uebrigen Zuordnungen und loescht bei 'zuordnen' die eigene", async () => {
    const { meldungen } = zeichne(Zuordnung as never, F, { 0: 0, 2: 2 });
    const feld = screen.getByLabelText("Zuordnung 1") as HTMLSelectElement;
    expect(feld.value).toBe("0");
    await userEvent.selectOptions(feld, "");
    expect(meldungen).toEqual([{ 2: 2 }]);
  });
  it("Index 0 als Wert ist eine echte Wahl (nicht leer)", () => {
    zeichne(Zuordnung as never, F, { 0: 0 });
    expect((screen.getByLabelText("Zuordnung 1") as HTMLSelectElement).value).toBe("0");
    expect((screen.getByLabelText("Zuordnung 2") as HTMLSelectElement).value).toBe("");
  });
  it("zeigt die linken Texte; gesperrt: Felder aus und 'Richtig wäre' je Aussage", () => {
    zeichne(Zuordnung as never, F, { 0: 0 }, true);
    expect(screen.getByText("Hund")).toBeTruthy();
    expect((screen.getByLabelText("Zuordnung 3") as HTMLSelectElement).disabled).toBe(true);
    expect(screen.getByText("Richtig wäre")).toBeTruthy();
    expect(screen.getByText("Hund → Tier · Katze → Tier · Rose → Pflanze")).toBeTruthy();
  });
  it("vor dem Pruefen kein 'Richtig wäre'", () => {
    zeichne(Zuordnung as never, F);
    expect(screen.queryByText("Richtig wäre")).toBeNull();
    expect((screen.getByLabelText("Zuordnung 1") as HTMLSelectElement).disabled).toBe(false);
  });
  it("ohne paare leer; Paare mit falscher Form werden nicht gezeigt", () => {
    zeichne(Zuordnung as never, { id: "x", paare: [["nur eins"]] });
    expect(screen.queryByLabelText("Zuordnung 1")).toBeNull();
  });
});

/* ------------------------------------------------------------------- Konsole */
describe("Konsole", () => {
  const F = { id: "T-KO", aufgaben: [
    { prompt: "Pingen", akzeptiert: ["ping localhost", "ping 127.0.0.1"] },
    { prompt: "Auflisten", akzeptiert: ["ls"] },
  ] };
  it("beschriftet jedes Feld mit Nummer und Aufgabe, zeigt Anleitung und Nummern", () => {
    zeichne(Konsole as never, F);
    expect(screen.getByText("Schreib je Schritt den passenden Befehl.")).toBeTruthy();
    expect(screen.getByLabelText("Befehl 1: Pingen")).toBeTruthy();
    expect(screen.getByLabelText("Befehl 2: Auflisten")).toBeTruthy();
    expect(screen.getByText("1.")).toBeTruthy();
    expect(screen.getByText("2.")).toBeTruthy();
    expect(screen.getByText("Pingen")).toBeTruthy();
    expect((screen.getByLabelText("Befehl 1: Pingen") as HTMLInputElement).placeholder).toBe("Befehl …");
  });
  it("meldet ein Feld mit allen Befehlen, die anderen bleiben stehen", async () => {
    const { meldungen } = zeichne(Konsole as never, F, ["ping", "ls"]);
    const feld = screen.getByLabelText("Befehl 2: Auflisten") as HTMLInputElement;
    expect(feld.value).toBe("ls");
    await userEvent.type(feld, "x");
    expect(meldungen).toEqual([["ping", "lsx"]]);
  });
  it("ohne Antwort beginnt jedes Feld leer; ein Tippen meldet leere Reste als Text", async () => {
    const { meldungen } = zeichne(Konsole as never, F);
    await userEvent.type(screen.getByLabelText("Befehl 1: Pingen"), "p");
    expect(meldungen).toEqual([["p", ""]]);
  });
  it("gesperrt: Felder aus, kein Platzhalter, akzeptierte Schreibweisen sichtbar", () => {
    zeichne(Konsole as never, F, ["a", "b"], true);
    const feld = screen.getByLabelText("Befehl 1: Pingen") as HTMLInputElement;
    expect(feld.disabled).toBe(true);
    expect(feld.placeholder).toBe("");
    expect(roh("akzeptiert: ping localhost  ·  ping 127.0.0.1")).toBeTruthy();
    expect(screen.getByText("akzeptiert: ls")).toBeTruthy();
  });
  it("vor dem Pruefen keine Loesung; ohne Aufgaben leer", () => {
    zeichne(Konsole as never, F);
    expect(screen.queryByText(/akzeptiert:/)).toBeNull();
    cleanup();
    zeichne(Konsole as never, { id: "x" });
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });
  it("der Prompt-Text und die Terminalfarben sind gesetzt", () => {
    zeichne(Konsole as never, F);
    const feld = screen.getByLabelText("Befehl 1: Pingen") as HTMLInputElement;
    expect(feld.style.color).toBe("rgb(214, 245, 214)");
    expect(feld.closest("[data-slot='input-group']")?.getAttribute("style") ?? "").toContain("rgb(21, 23, 28)");
  });
});

/* ------------------------------------------------------------------ Tabellen */
describe("Trace", () => {
  const F = { id: "T-TR", spalten: ["i", "summe"], zeilen: [["0", "1"], ["1", "3"]], code: ["s = 0", "for i in 1..2"] };
  it("zeigt Anleitung, Code, Spaltenkoepfe und je Zelle ein benanntes Feld", () => {
    const { container } = zeichne(Trace as never, F);
    expect(screen.getByText(/Schreibtischtest/)).toBeTruthy();
    expect(container.querySelector("pre")?.textContent).toBe("s = 0\nfor i in 1..2");
    expect(screen.getByRole("columnheader", { name: "i" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "summe" })).toBeTruthy();
    expect(screen.getAllByLabelText("i, Zelle 1")).toHaveLength(1);
    expect(screen.getAllByLabelText("summe, Zelle 2")).toHaveLength(1);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });
  it("ohne Code kein Codekasten; fehlende Spaltenkoepfe heissen 'Spalte n'", () => {
    const { container } = zeichne(Trace as never, { id: "x", zeilen: [["a", "b"]] });
    expect(container.querySelector("pre")).toBeNull();
    expect(screen.getByLabelText("Spalte 1, Zelle 1")).toBeTruthy();
    expect(screen.getByLabelText("Spalte 2, Zelle 1")).toBeTruthy();
  });
  it("meldet das ganze Feld; die uebrigen Zellen bleiben, fehlende werden leer", async () => {
    const { meldungen } = zeichne(Trace as never, F, [["x", ""], ["", "y"]]);
    const zelle = screen.getByLabelText("summe, Zelle 1") as HTMLInputElement;
    await userEvent.type(zelle, "5");
    expect(meldungen).toEqual([[["x", "5"], ["", "y"]]]);
  });
  it("ohne Antwort: alles leer; ein Tippen gibt die Form [zeile][spalte] aus Texten", async () => {
    const { meldungen } = zeichne(Trace as never, F);
    await userEvent.type(screen.getByLabelText("i, Zelle 2"), "7");
    expect(meldungen).toEqual([[["", ""], ["7", ""]]]);
  });
  it("gesperrt: Zellen aus, 'Richtige Werte, zeilenweise' mit | und ·", () => {
    zeichne(Trace as never, F, undefined, true);
    for (const t of screen.getAllByRole("textbox")) expect((t as HTMLInputElement).disabled).toBe(true);
    expect(screen.getByText("Richtige Werte, zeilenweise")).toBeTruthy();
    expect(roh("0 | 1   ·   1 | 3")).toBeTruthy();
  });
  it("vor dem Pruefen keine richtigen Werte", () => {
    zeichne(Trace as never, F);
    expect(screen.queryByText("Richtige Werte, zeilenweise")).toBeNull();
  });
});

describe("Kreuztabelle", () => {
  const F = { id: "T-KT", spalten: ["ja", "nein"], zeilen: ["Frage A", "Frage B"], loesung: [[true, false], [false, true]] };
  it("eine Zelle je Zeile und Spalte, benannt '<Zeile> — <Spalte>'", () => {
    zeichne(Kreuztabelle as never, F);
    expect(screen.getByText(/Gewertet wird nur, wenn die ganze Tabelle stimmt/)).toBeTruthy();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(screen.getByRole("checkbox", { name: "Frage A — ja" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "nein" })).toBeTruthy();
    expect(screen.getByRole("rowheader", { name: "Frage B" })).toBeTruthy();
  });
  it("kippt genau eine Zelle und meldet [zeile][spalte] aus Wahrheitswerten", async () => {
    const { meldungen } = zeichne(Kreuztabelle as never, F);
    await userEvent.click(screen.getByRole("checkbox", { name: "Frage B — nein" }));
    expect(meldungen).toEqual([[[false, false], [false, true]]]);
  });
  it("nimmt ein gesetztes Kreuz wieder heraus und behaelt die anderen", async () => {
    const { meldungen } = zeichne(Kreuztabelle as never, F, [[true, false], [false, true]]);
    expect(screen.getByRole("checkbox", { name: "Frage A — ja" }).getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByRole("checkbox", { name: "Frage A — ja" }));
    expect(meldungen).toEqual([[[false, false], [false, true]]]);
  });
  it("nach dem Pruefen: Zellen aus, 'Richtig angekreuzt wäre' je Zeile, 'nichts' bei leerer Zeile", () => {
    zeichne(Kreuztabelle as never, { ...F, loesung: [[true, true], [false, false]] }, undefined, true);
    for (const c of screen.getAllByRole("checkbox")) expect(c.hasAttribute("disabled")).toBe(true);
    expect(screen.getByText("Richtig angekreuzt wäre")).toBeTruthy();
    expect(screen.getByText("Frage A: ja, nein · Frage B: nichts")).toBeTruthy();
  });
  it("falsch gesetzte Zellen sind nach dem Pruefen rot (destructive), richtige nicht", () => {
    zeichne(Kreuztabelle as never, F, [[false, true], [false, true]], true);
    const rot = (n: string) => hat(screen.getByRole("checkbox", { name: n }), "border-destructive");
    expect(rot("Frage A — ja")).toBe(true);     // fehlt
    expect(rot("Frage A — nein")).toBe(true);   // zu viel
    expect(rot("Frage B — nein")).toBe(false);  // stimmt
    expect(rot("Frage B — ja")).toBe(false);    // stimmt (leer)
  });
  it("vor dem Pruefen keine Loesung und keine Rotfaerbung", () => {
    zeichne(Kreuztabelle as never, F, [[false, true], [false, true]]);
    expect(screen.queryByText("Richtig angekreuzt wäre")).toBeNull();
    expect(hat(screen.getByRole("checkbox", { name: "Frage A — ja" }), "border-destructive")).toBe(false);
  });
});

/* ------------------------------------------------------------------ Generator */
describe("Generator", () => {
  const EIN = { id: "GEN-x", typ: "generator", antwort: ["42", "42,0"], einheit: "Euro", hinweis: "Nur ganze Zahlen", weg: ["6 * 7", "= 42"] };
  const ZWEI = { id: "GEN-y", typ: "generator", antwort2: [["1"], ["2"]], weg: ["a", "b"] };
  function gen(frage: unknown, antwort: unknown, gesperrt = false) {
    const meldungen: unknown[] = [];
    render(createElement(Generator, { frage: frage as never, antwort, gesperrt, aufAntwort: (a) => meldungen.push(a) }));
    return meldungen;
  }
  it("ein Feld 'Antwort (Einheit)', Hinweis und Anleitung", () => {
    gen(EIN, undefined);
    expect(screen.getByText(/frischen Zufallswerten/)).toBeTruthy();
    expect(screen.getByText("Nur ganze Zahlen")).toBeTruthy();
    expect(screen.getByLabelText("Antwort")).toBeTruthy();
    expect(screen.getByText("Antwort (Euro)")).toBeTruthy();
    expect((screen.getByLabelText("Antwort") as HTMLInputElement).inputMode).toBe("decimal");
  });
  it("ohne Hinweis/Einheit nichts davon; bei mehreren Feldern 'Antwort i' ohne Einheit", () => {
    gen({ ...ZWEI, einheit: "kg", hinweis: "" }, undefined);
    expect(screen.getByLabelText("Antwort 1")).toBeTruthy();
    expect(screen.getByLabelText("Antwort 2")).toBeTruthy();
    expect(screen.queryByText(/kg/)).toBeNull();
    expect(screen.queryByText("Nur ganze Zahlen")).toBeNull();
  });
  it("meldet alle Felder, die anderen bleiben stehen", async () => {
    const m = gen(ZWEI, ["5", "6"]);
    await userEvent.type(screen.getByLabelText("Antwort 2"), "7");
    expect(m).toEqual([["5", "67"]]);
  });
  it("ohne Antwort starten die Felder leer", async () => {
    const m = gen(ZWEI, undefined);
    await userEvent.type(screen.getByLabelText("Antwort 1"), "3");
    expect(m).toEqual([["3", ""]]);
  });
  it("gesperrt und alles richtig: 'Richtig.', Loesungsweg, kein 'richtig:'-Hinweis", () => {
    gen(EIN, ["42"], true);
    expect(screen.getByText("Richtig.")).toBeTruthy();
    expect(screen.getByText("Lösungsweg Schritt für Schritt")).toBeTruthy();
    expect(screen.getByText("6 * 7")).toBeTruthy();
    expect(screen.getByText("= 42")).toBeTruthy();
    expect(screen.queryByText(/richtig: /)).toBeNull();
    expect((screen.getByLabelText("Antwort") as HTMLInputElement).disabled).toBe(true);
    expect(hat(screen.getByLabelText("Antwort"), "border-chart-1/60")).toBe(true);
  });
  it("gesperrt und falsch: 'Nicht richtig.' und die erste akzeptierte Loesung am falschen Feld", () => {
    gen(ZWEI, ["1", "9"], true);
    expect(screen.getByText("Nicht richtig.")).toBeTruthy();
    expect(screen.getByText("richtig: 2")).toBeTruthy();
    expect(screen.queryByText("richtig: 1")).toBeNull();
    expect(hat(screen.getByLabelText("Antwort 2"), "border-destructive")).toBe(true);
    expect(hat(screen.getByLabelText("Antwort 1"), "border-destructive")).toBe(false);
  });
  it("vor dem Pruefen kein Urteil und kein Loesungsweg", () => {
    gen(EIN, ["1"]);
    expect(screen.queryByText("Nicht richtig.")).toBeNull();
    expect(screen.queryByText("Richtig.")).toBeNull();
    expect(screen.queryByText("Lösungsweg Schritt für Schritt")).toBeNull();
  });
  it("ohne weg: Kasten ohne Zeilen, kein Absturz", () => {
    gen({ id: "x", typ: "generator", antwort: ["1"] }, ["1"], true);
    expect(screen.getByText("Richtig.")).toBeTruthy();
  });
});

/* ---------------------------------------------------------------- Bildflaeche */
describe("Bildflaeche", () => {
  const SVG = '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" id="kreis"/></svg>';
  it("zeichnet das SVG als Bild mit Beschriftung auf heller Flaeche", () => {
    const { container } = render(createElement(Bildflaeche, { svg: SVG, beschriftung: "Netz", klasse: "mein-kasten" }));
    const bild = screen.getByRole("img", { name: "Netz" });
    expect(bild.querySelector("#kreis")).toBeTruthy();
    expect(bild.style.background).not.toBe("");
    expect(BILDGRUND).toBe("#eef1f5");
    expect(container.firstElementChild?.className).toContain("mein-kasten");
    expect(container.firstElementChild?.className).toContain("relative");
  });
  it("hat Lupenknopf und Tap-Flaeche; ein Klick oeffnet die Vergroesserung mit dem Bild darin", async () => {
    render(createElement(Bildflaeche, { svg: SVG, beschriftung: "Netz" }));
    expect(screen.getAllByRole("button", { name: "Netz vergrößern" })).toHaveLength(2);
    await userEvent.click(screen.getAllByRole("button", { name: "Netz vergrößern" })[0]);
    const dialog = await screen.findByRole("dialog", { name: "Netz" });
    expect(dialog.querySelector("#kreis")).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "Schließen" })).toBeTruthy();
    await userEvent.click(within(dialog).getByRole("button", { name: "Schließen" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("der Tap auf das Bild selbst oeffnet ebenfalls", async () => {
    render(createElement(Bildflaeche, { svg: SVG, beschriftung: "Netz" }));
    await userEvent.click(screen.getAllByRole("button", { name: "Netz vergrößern" })[1]);
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });
  it("Escape schliesst die Vergroesserung", async () => {
    render(createElement(Bildflaeche, { svg: SVG, beschriftung: "Netz" }));
    await userEvent.click(screen.getAllByRole("button", { name: "Netz vergrößern" })[0]);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("zoom=false: weder Knopf noch Tap-Flaeche", () => {
    render(createElement(Bildflaeche, { svg: SVG, beschriftung: "Netz", zoom: false }));
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("img", { name: "Netz" })).toBeTruthy();
  });
});

/* ---------------------------------------------------- Farbe als Zweitsignal */
describe("Urteilsfarben (neben dem Wort)", () => {
  it("Wahlkarte: richtig gruen/akzentuiert, falsch rot; Urteilswort passend gefaerbt", () => {
    const { container } = zeichne(MC as never, MC_FRAGE, 0, true);
    const richtig = container.querySelector('[data-urteil="richtig"]') as HTMLElement;
    const falsch = container.querySelector('[data-urteil="falsch"]') as HTMLElement;
    expect(hat(richtig, "border-chart-1")).toBe(true);
    expect(hat(richtig, "bg-accent")).toBe(true);
    expect(hat(richtig, "border-destructive")).toBe(false);
    expect(hat(falsch, "border-destructive")).toBe(true);
    expect(hat(falsch, "bg-destructive/10")).toBe(true);
    expect(hat(falsch, "border-chart-1")).toBe(false);
    expect(hat(screen.getByText("richtig"), "text-foreground")).toBe(true);
    expect(hat(screen.getByText("richtig"), "text-destructive")).toBe(false);
    expect(hat(screen.getByText("deine Wahl – falsch"), "text-destructive")).toBe(true);
    expect(hat(screen.getByText("deine Wahl – falsch"), "text-foreground")).toBe(false);
  });
  it("Karte ohne Urteil traegt keine Urteilsfarben", () => {
    const { container } = zeichne(MC as never, MC_FRAGE, 0, false);
    for (const k of container.querySelectorAll("label")) {
      expect(hat(k, "border-chart-1")).toBe(false);
      expect(hat(k, "border-destructive")).toBe(false);
    }
  });
  it("Mtf: nur die falsch beantwortete Aussage hat roten Rand; Loesungswort richtig/falsch gefaerbt", () => {
    const F = { id: "T-MTF", aussagen: [{ text: "Erste", wahr: true }, { text: "Zweite", wahr: false }] };
    const { container } = zeichne(Mtf as never, F, [false, false], true);
    const zeilen = [...container.querySelectorAll("[data-urteil]")] as HTMLElement[];
    expect(hat(zeilen[0], "border-destructive")).toBe(true);
    expect(hat(zeilen[1], "border-destructive")).toBe(false);
    expect(hat(zeilen[0], "rounded-lg")).toBe(true);
    expect(hat(screen.getByText("richtig: wahr"), "text-destructive")).toBe(true);   // Aussage 1 falsch beantwortet
    expect(hat(screen.getByText("richtig: falsch"), "text-foreground")).toBe(true);  // Aussage 2 richtig
    expect(hat(screen.getByText("richtig: falsch"), "text-destructive")).toBe(false);
  });
});

describe("Mischer-Schluessel je Frage", () => {
  it("zwei Fragen im selben Rahmen mischen unabhaengig (Schluessel enthaelt die Kennung)", () => {
    const folge = [0.9, 0.1, 0.5, 0.2, 0.7, 0.3, 0.6, 0.4, 0.8, 0.05];
    let i = 0;
    vi.spyOn(Math, "random").mockImplementation(() => folge[i++ % folge.length]);
    const m = neuerMischer();
    const optionen = ["o1", "o2", "o3", "o4", "o5"];
    const reihenfolge = (id: string) => {
      cleanup();
      render(createElement(MischKontext.Provider, { value: m },
        createElement(MC as never, { frage: bau({ id, optionen, loesungIndex: 0 }), antwort: undefined, gesperrt: false, aufAntwort: () => {} } as never)));
      return screen.getAllByRole("radio").map((r) => document.getElementById(r.getAttribute("aria-labelledby")!)!.textContent);
    };
    const a = reihenfolge("F-A");
    const b = reihenfolge("F-B");
    expect(a).not.toEqual(b);
    expect(reihenfolge("F-A")).toEqual(a);   // dieselbe Frage bleibt stabil
  });
});

/* ------------------------------------------- Nachschaerfen nach der 1. Messung */
describe("Zuordnung (Nachmessung)", () => {
  const F = { id: "T-ZU2", paare: [["Hund", "Tier"], ["Rose", "Pflanze"]] };
  it("ein Paar ist genau zwei Texte; enthaelt die Liste ein anderes Element, zeichnet nichts (alles oder nichts)", () => {
    const kaputt: unknown[] = [["nur"], [1, "y"], ["a", 2], ["a", "b", "c"], "text", null];
    for (const schlecht of kaputt) {
      zeichne(Zuordnung as never, { id: "x", paare: [["A", "B"], schlecht] });
      expect(document.querySelectorAll("select")).toHaveLength(0);
      cleanup();
    }
    zeichne(Zuordnung as never, { id: "x", paare: [["A", "B"]] });
    expect(document.querySelectorAll("select")).toHaveLength(1);
  });
  it("wechselt die Frage, wechseln Aussagen und Kategorien mit (kein veralteter Stand)", () => {
    const eigenschaften = (frage: unknown) => ({ frage: bau(frage as Record<string, unknown>), antwort: undefined, gesperrt: false, aufAntwort: () => {} });
    const { rerender } = render(createElement(Zuordnung as never, eigenschaften(F) as never));
    expect(screen.getByText("Hund")).toBeTruthy();
    rerender(createElement(Zuordnung as never, eigenschaften({ id: "T-ZU3", paare: [["Auto", "Fahrzeug"]] }) as never));
    expect(screen.queryByText("Hund")).toBeNull();
    expect(screen.getByText("Auto")).toBeTruthy();
    const optionen = [...(screen.getByLabelText("Zuordnung 1") as HTMLSelectElement).options].map((o) => o.textContent);
    expect(optionen).toEqual(["— zuordnen —", "Fahrzeug"]);
  });
  it("ohne Wahl gedaempfte Schrift, mit Wahl nicht; Feld ueber die volle Breite", () => {
    zeichne(Zuordnung as never, F, { 1: 1 });
    const leer = screen.getByLabelText("Zuordnung 1");
    const gewaehlt = screen.getByLabelText("Zuordnung 2");
    const kasten = (e: HTMLElement) => e.closest("[data-slot='native-select-wrapper']") as HTMLElement;
    expect(hat(kasten(leer), "text-muted-foreground")).toBe(true);
    expect(hat(kasten(gewaehlt), "text-muted-foreground")).toBe(false);
    expect(hat(kasten(leer), "w-full")).toBe(true);
    expect((leer as HTMLSelectElement).value).toBe("");
    expect((gewaehlt as HTMLSelectElement).value).toBe("1");
  });
  it("die Kategorien zweier Fragen im selben Rahmen werden unabhaengig gemischt", () => {
    /* 11 Werte: seit P3 (24.11.) mischt jede der 5 Zeilen selbst (20 Zuege je Frage) – bei 10 Werten begann
       die zweite Frage genau wieder am Anfang der Folge und waere gleich gemischt worden. */
    const folge = [0.9, 0.1, 0.5, 0.2, 0.7, 0.3, 0.6, 0.4, 0.8, 0.05, 0.95];
    let i = 0;
    vi.spyOn(Math, "random").mockImplementation(() => folge[i++ % folge.length]);
    const m = neuerMischer();
    const paare = [["1", "k1"], ["2", "k2"], ["3", "k3"], ["4", "k4"], ["5", "k5"]];
    const reihenfolge = (id: string) => {
      cleanup();
      render(createElement(MischKontext.Provider, { value: m },
        createElement(Zuordnung as never, { frage: bau({ id, paare }), antwort: undefined, gesperrt: false, aufAntwort: () => {} } as never)));
      return [...(screen.getByLabelText("Zuordnung 1") as HTMLSelectElement).options].map((o) => o.textContent);
    };
    const a = reihenfolge("Z-A");
    expect(reihenfolge("Z-B")).not.toEqual(a);
    expect(reihenfolge("Z-A")).toEqual(a);
  });
});

describe("Generator (Nachmessung)", () => {
  const EIN = { id: "GEN-x", typ: "generator", antwort: ["42"], hinweis: "Nur ganze Zahlen", weg: ["6 * 7"] };
  const ZWEI = { id: "GEN-y", typ: "generator", antwort2: [["1"], ["2"]], weg: ["a"] };
  const gen = (frage: unknown, antwort: unknown, gesperrt = false) =>
    render(createElement(Generator, { frage: frage as never, antwort, gesperrt, aufAntwort: () => {} }));
  it("der Hinweis steht als eigener Absatz; leerer oder fehlender Hinweis zeigt nichts", () => {
    const { container } = gen(EIN, undefined);
    expect([...container.querySelectorAll("p")].map((p) => p.textContent)).toContain("Nur ganze Zahlen");
    cleanup();
    const leer = gen({ ...EIN, hinweis: "" }, undefined);
    expect(leer.container.querySelectorAll("p")).toHaveLength(1);   // nur die Anleitung
    cleanup();
    const keiner = gen({ ...EIN, hinweis: undefined }, undefined);
    expect(keiner.container.querySelectorAll("p")).toHaveLength(1);
    cleanup();
    const keinText = gen({ ...EIN, hinweis: 5 }, undefined);
    expect(keinText.container.textContent).not.toContain("5");
  });
  it("jedes Feld hat sichtbare Beschriftung UND Namen, die zusammengehoeren; Kennungen sind eindeutig", () => {
    const { container } = gen(ZWEI, undefined);
    expect(screen.getByText("Antwort 1")).toBeTruthy();
    expect(screen.getByText("Antwort 2")).toBeTruthy();
    const felder = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(felder.map((f) => f.getAttribute("aria-label"))).toEqual(["Antwort 1", "Antwort 2"]);
    expect(felder[0].id).not.toBe("");
    expect(felder[0].id).not.toBe(felder[1].id);
    const labels = [...container.querySelectorAll("label")];
    expect(labels.map((l) => l.htmlFor)).toEqual(felder.map((f) => f.id));
  });
  it("ein einzelnes Feld heisst 'Antwort' ohne Nummer", () => {
    gen(EIN, undefined);
    expect(screen.getByText("Antwort")).toBeTruthy();
    expect(screen.getByRole("textbox").getAttribute("aria-label")).toBe("Antwort");
    expect(screen.queryByText("Antwort 1")).toBeNull();
  });
  it("kein Rechtschreibabgleich im Zahlenfeld", () => {
    gen(EIN, undefined);
    expect(screen.getByRole("textbox").getAttribute("spellcheck")).toBe("false");
  });
  it("Urteilsfarben: Kasten richtig gruen / nicht richtig rot; nur teilweise richtig ist nicht richtig", () => {
    const { container } = gen(ZWEI, ["1", "2"], true);
    const kasten = screen.getByText("Richtig.");
    expect(hat(kasten, "border-chart-1/40")).toBe(true);
    expect(hat(kasten, "text-destructive")).toBe(false);
    cleanup();
    gen(ZWEI, ["1", "x"], true);
    const falsch = screen.getByText("Nicht richtig.");
    expect(hat(falsch, "border-destructive/50")).toBe(true);
    expect(hat(falsch, "text-destructive")).toBe(true);
    expect(hat(falsch, "border-chart-1/40")).toBe(false);
    expect(container).toBeTruthy();
  });
  it("ohne weg bleibt der Loesungsweg leer", () => {
    const { container } = gen({ id: "x", typ: "generator", antwort: ["1"] }, ["1"], true);
    const weg = screen.getByText("Lösungsweg Schritt für Schritt").parentElement!;
    expect(weg.querySelectorAll("span")).toHaveLength(0);
    expect(container.textContent).not.toContain("Stryker");
  });
});

describe("Bildflaeche (Nachmessung)", () => {
  const SVG = '<svg viewBox="0 0 10 10"><circle id="kreis" r="4"/></svg>';
  it("Tap-Flaeche liegt ausserhalb der Tab-Reihenfolge; Vergroesserung hat genau einen Schliessen-Knopf auf heller Flaeche", async () => {
    render(createElement(Bildflaeche, { svg: SVG, beschriftung: "Netz" }));
    const knoepfe = screen.getAllByRole("button", { name: "Netz vergrößern" });
    expect(knoepfe.map((k) => k.getAttribute("tabindex"))).toEqual([null, "-1"]);
    await userEvent.click(knoepfe[0]);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getAllByRole("button")).toHaveLength(1);
    expect(within(dialog).queryByRole("button", { name: "Close" })).toBeNull();
    const flaeche = dialog.querySelector("#kreis")!.closest("div") as HTMLElement;
    expect(flaeche.style.background).not.toBe("");
  });
});

describe("Einfach (Nachmessung)", () => {
  it("jede Aussage ohne Wahl ist offen, jeder Knopf traegt Namen und Auswahlzustand", () => {
    zeichne(Mtf as never, { id: "x", aussagen: [{ text: "A", wahr: true }, { text: "B", wahr: false }] });
    for (const r of screen.getAllByRole("radio")) expect(r.getAttribute("aria-checked")).toBe("false");
    expect(screen.getAllByRole("radiogroup", { name: /Aussage/ })).toHaveLength(2);
  });
  it("die Gruppe einer Aussage ist gesperrt, solange geprueft ist, und sonst bedienbar", () => {
    zeichne(Mtf as never, { id: "x", aussagen: [{ text: "A", wahr: true }] }, [true]);
    expect((screen.getByRole("radio", { name: "Aussage 1: falsch" }) as HTMLButtonElement).disabled).toBe(false);
  });
});
