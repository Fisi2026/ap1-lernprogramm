// @vitest-environment jsdom
/* Einstellungen: jeder Abschnitt einzeln, mit einem selbst gebauten Stand-Haken. Geprüft wird, was die Seite
   zeigt und was an `aendere`, am Download und am Speicher ankommt. */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StandHaken } from "@/huelle/useLernstand";
import { DEFEKT_SCHLUESSEL, leererStand, sicherungen, type Lernstand } from "@/kern/stand";
import { alsDatei, DATEI_GRENZE, dateiname } from "@/kern/lernstanddatei";
import { TYP_HILFE } from "@/kern/typhilfe";
import { FRAGEN } from "@/daten/laden";

vi.mock("@/lib/download", () => ({ bieteDateiAn: vi.fn(() => null) }));
import { bieteDateiAn } from "@/lib/download";
import { Einstellungen } from "./Einstellungen";

const bieteMock = vi.mocked(bieteDateiAn);
const JETZT = new Date(2026, 9, 18, 12, 0, 0);

const ergebnisse = new Map<object, Lernstand>();
function haken(teil: Partial<Lernstand> = {}, mehr: Partial<StandHaken> = {}) {
  const stand = { ...leererStand(), ...teil };
  /* wie der echte Haken: der Umschreiber läuft sofort (er liest `e.target.value`, das React danach zurücksetzt) */
  const aendere = vi.fn<(fn: (s: Lernstand) => Lernstand) => void>((fn) => { ergebnisse.set(aendere, fn(stand)); });
  const h = {
    stand, aendere, befund: "gelesen", speicherFehler: false, buche: vi.fn(), zeige: vi.fn(), rolle: "eigen",
    reparaturen: [], gesichert: false, konflikte: 0, dauerhaft: "unbekannt", lauf: null, quelle: {},
    ...mehr,
  } as unknown as StandHaken;
  return { h, aendere, stand };
}
/** Was `aendere` mit dem Stand macht – der zuletzt übergebene Umschreiber, auf den Stand angewendet. */
const wirkung = (aendere: ReturnType<typeof haken>["aendere"], _stand: Lernstand) => ergebnisse.get(aendere)!;
const abschnitt = (teil: string) => document.querySelector(`[data-teil="${teil}"]`) as HTMLElement;
const nutzer = () => userEvent.setup({ delay: null });

beforeEach(() => {
  localStorage.clear(); bieteMock.mockReset(); bieteMock.mockReturnValue(null);
  vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(JETZT);
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("Prüfung", () => {
  it("Termin: heute 0 Tage, in der Zukunft N Tage, in der Vergangenheit „liegt N Tage zurück“", () => {
    for (const [datum, text] of [["2026-10-18", "Noch 0 Tage."], ["2026-10-28", "Noch 10 Tage."], ["2026-10-15", "Der Termin liegt 3 Tage zurück."]] as const) {
      render(<Einstellungen lernstand={haken({ pruefungsdatum: datum }).h} />);
      expect(within(abschnitt("pruefung")).getByText(text)).toBeTruthy();
      cleanup();
    }
  });

  it("ohne Datum steht der Satz; das Datumsfeld schreibt den Wert in den Stand", () => {
    const { h, aendere, stand } = haken();
    render(<Einstellungen lernstand={h} />);
    expect(screen.getByText("Kein Termin gesetzt — der Kopf zeigt dann keine Tage an.")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Datum der AP1"), { target: { value: "2026-12-01" } });
    expect(wirkung(aendere, stand).pruefungsdatum).toBe("2026-12-01");
  });

  it("Dauer: gültige Eingabe wird auf 0–240 begrenzt übernommen, leere und Leerzeichen nicht, beim Verlassen zurück auf den Stand", () => {
    const { h, aendere, stand } = haken({ simDauerMin: 90 });
    render(<Einstellungen lernstand={h} />);
    const feld = screen.getByLabelText("Dauer in Minuten") as HTMLInputElement;
    expect(feld.value).toBe("90");
    fireEvent.change(feld, { target: { value: "45" } });
    expect(wirkung(aendere, stand).simDauerMin).toBe(45);
    fireEvent.change(feld, { target: { value: "999" } });
    expect(wirkung(aendere, stand).simDauerMin).toBe(240);
    aendere.mockClear();
    fireEvent.change(feld, { target: { value: "" } });
    expect(aendere).not.toHaveBeenCalled();
    expect(feld.value).toBe("");
    fireEvent.blur(feld);
    expect(feld.value).toBe("90");
  });

  it("ohne Dauer im Stand zeigt das Feld 0", () => {
    render(<Einstellungen lernstand={haken({ simDauerMin: 0 }).h} />);
    expect((screen.getByLabelText("Dauer in Minuten") as HTMLInputElement).value).toBe("0");
  });
});

describe("Üben", () => {
  it("Tagesziel: 1 und 200 gelten (gerundet), 0, 201, Text und leer nicht", () => {
    const { h, aendere, stand } = haken({ tagesziel: 20 });
    render(<Einstellungen lernstand={h} />);
    const feld = screen.getByLabelText("Fragen pro Tag") as HTMLInputElement;
    expect(feld.value).toBe("20");
    for (const [eingabe, soll] of [["1", 1], ["200", 200], ["35.4", 35], ["35.6", 36]] as const) {
      aendere.mockClear();
      fireEvent.change(feld, { target: { value: eingabe } });
      expect(wirkung(aendere, stand).tagesziel).toBe(soll);
    }
    for (const eingabe of ["0", "201", "-5", ""]) {
      aendere.mockClear();
      fireEvent.change(feld, { target: { value: eingabe } });
      expect(aendere).not.toHaveBeenCalled();
    }
    fireEvent.blur(feld);
    expect(feld.value).toBe("20");
  });

  it("Prüfungsteil: drei Wahlen mit Erklärung; Vorgabe „beide“, auch wenn im Stand nichts steht; Wahl schreibt uebenAP", async () => {
    const { h, aendere, stand } = haken();
    (stand as unknown as Record<string, unknown>).uebenAP = undefined;
    render(<Einstellungen lernstand={h} />);
    const gruppe = screen.getByRole("radiogroup", { name: "Prüfungsteil" });
    expect(gruppe.getAttribute("aria-describedby")).toBeTruthy();
    expect(gruppe).toHaveAccessibleDescription(/Entscheidet, welche Fragen überhaupt gezogen werden/);
    const erwartet: [string, string][] = [["Beide", "AP1-Stoff und AP2-Zusatz"], ["Nur AP1", "was in Teil 1 drankommt"], ["Nur AP2", "Subnetting, Datenbanken, WiSo"]];
    for (const [name, erklaerung] of erwartet) {
      expect(within(gruppe).getByRole("radio", { name })).toHaveAccessibleDescription(erklaerung);
    }
    expect(within(gruppe).getByRole("radio", { name: "Beide" }).getAttribute("aria-checked")).toBe("true");
    await nutzer().click(within(gruppe).getByRole("radio", { name: "Nur AP2" }));
    expect(wirkung(aendere, stand).uebenAP).toBe("ap2");
    await nutzer().click(within(gruppe).getByRole("radio", { name: "Nur AP1" }));
    expect(wirkung(aendere, stand).uebenAP).toBe("ap1");
  });

  it("die Wahl aus dem Stand ist angehakt", () => {
    render(<Einstellungen lernstand={haken({ uebenAP: "ap1" }).h} />);
    expect(screen.getByRole("radio", { name: "Nur AP1" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Beide" }).getAttribute("aria-checked")).toBe("false");
  });
});

describe("Anzeige und Hilfe", () => {
  it("ohne ausgeblendete Hilfen: Satz, Knopf gesperrt", () => {
    render(<Einstellungen lernstand={haken().h} />);
    expect(screen.getByText("Alle Bedienhilfen werden angezeigt.")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Bedienhilfen wieder einblenden" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("mit ausgeblendeten Hilfen: Zahl von Gesamt, Knopf leert typHilfeAus", async () => {
    const typen = Object.keys(TYP_HILFE);
    const { h, aendere, stand } = haken({ typHilfeAus: { [typen[0]!]: true, [typen[1]!]: true } });
    render(<Einstellungen lernstand={h} />);
    expect(screen.getByText(`2 von ${typen.length} ausgeblendet.`)).toBeTruthy();
    const k = screen.getByRole("button", { name: "Bedienhilfen wieder einblenden" }) as HTMLButtonElement;
    expect(k.disabled).toBe(false);
    await nutzer().click(k);
    expect(wirkung(aendere, stand).typHilfeAus).toEqual({});
  });
});

describe("Gemeldete Fragen", () => {
  const meldung = (n: number) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`F${i}`, { grund: "Veraltet", text: "", datum: 1 }]));

  it("0, 1 und 2 Meldungen: Satz in Einzahl/Mehrzahl, Knöpfe nur mit Meldungen", () => {
    const f = [[0, "Auf diesem Gerät ist noch keine Frage gemeldet."], [1, "1 Meldung auf diesem Gerät."], [2, "2 Meldungen auf diesem Gerät."]] as const;
    for (const [n, satz] of f) {
      render(<Einstellungen lernstand={haken({ meldungen: meldung(n) }).h} />);
      expect(within(abschnitt("meldungen-export")).getByText(satz)).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Als JSON speichern" } ) !== null).toBe(n > 0);
      expect(screen.queryByRole("button", { name: "Als Text speichern" }) !== null).toBe(n > 0);
      cleanup();
    }
  });

  it("JSON und Text gehen mit Dateiname, Inhalt und Typ an den Download; ein Fehler wird gezeigt, Erfolg nicht", async () => {
    const { h, stand } = haken({ meldungen: { [FRAGEN[0]!.id]: { grund: "Veraltet", text: "Norm", datum: 1 } } });
    render(<Einstellungen lernstand={h} />);
    const n = nutzer();
    await n.click(screen.getByRole("button", { name: "Als JSON speichern" }));
    expect(bieteMock).toHaveBeenLastCalledWith("meldungen.json", JSON.stringify(stand.meldungen, null, 2), "application/json;charset=utf-8");
    await n.click(screen.getByRole("button", { name: "Als Text speichern" }));
    const [name, text] = bieteMock.mock.lastCall!;
    expect(name).toBe("meldungen.txt");
    expect(text).toContain(FRAGEN[0]!.id);
    expect(text).toContain("Norm");
    expect(screen.queryByText(/Download nicht möglich/)).toBeNull();
    bieteMock.mockReturnValueOnce("Platte voll");
    await n.click(screen.getByRole("button", { name: "Als JSON speichern" }));
    expect(screen.getByText("Download nicht möglich: Platte voll")).toBeTruthy();
    await n.click(screen.getByRole("button", { name: "Als Text speichern" }));
    expect(screen.queryByText(/Download nicht möglich/)).toBeNull();
  });

  it("Meldungen aller Lerner: Knopf nur mit Handler", async () => {
    const oeffne = vi.fn();
    render(<Einstellungen lernstand={haken().h} oeffneMeldungen={oeffne} />);
    await nutzer().click(screen.getByRole("button", { name: "Meldungen aller Lerner öffnen" }));
    expect(oeffne).toHaveBeenCalledTimes(1);
    cleanup();
    render(<Einstellungen lernstand={haken().h} />);
    expect(screen.queryByRole("button", { name: "Meldungen aller Lerner öffnen" })).toBeNull();
  });
});

describe("Speicher", () => {
  it("Dauerhafter Speicher: je Zustand sein Satz", () => {
    const saetze = {
      ja: "Ja – der Browser räumt den Lernstand nicht von selbst weg.",
      nein: "Verweigert – bei Platzmangel darf der Browser den Lernstand löschen.",
      unbekannt: "Noch nicht angefragt – das geschieht bei der ersten beantworteten Frage.",
      fehlt: "Dieser Browser bietet keinen dauerhaften Speicher an.",
    } as const;
    for (const [z, satz] of Object.entries(saetze)) {
      render(<Einstellungen lernstand={haken({}, { dauerhaft: z as StandHaken["dauerhaft"] }).h} />);
      expect(abschnitt("speicher").querySelector(`[data-dauerhaft="${z}"]`)?.textContent).toBe(satz);
      cleanup();
    }
  });

  it("Reparaturen: ohne → „Ohne Reparatur.“; eine/mehrere mit Liste; „gesichert“ ändert den Schluss", () => {
    render(<Einstellungen lernstand={haken().h} />);
    expect(screen.getByText("Ohne Reparatur.")).toBeTruthy();
    cleanup();
    render(<Einstellungen lernstand={haken({}, { reparaturen: ["tagesziel"], gesichert: true }).h} />);
    expect(abschnitt("speicher").textContent).toContain("Eine Stelle repariert – das Original ist auf diesem Gerät gesichert.");
    expect(screen.queryByText("Ohne Reparatur.")).toBeNull();
    expect(within(abschnitt("speicher")).getAllByRole("listitem").map((l) => l.textContent)).toEqual(["tagesziel"]);
    cleanup();
    render(<Einstellungen lernstand={haken({}, { reparaturen: ["a", "b", "c"], gesichert: false }).h} />);
    expect(abschnitt("speicher").textContent).toContain("3 Stellen repariert.");
    expect(abschnitt("speicher").textContent).not.toContain("gesichert.");
    expect(within(abschnitt("speicher")).getAllByRole("listitem")).toHaveLength(3);
  });

  it("Sicherungen: keine → kein Satz; eine → „liegt“; mehrere → „liegen“", () => {
    render(<Einstellungen lernstand={haken().h} />);
    expect(abschnitt("speicher").textContent).not.toContain("früheren Stands");
    cleanup();
    localStorage.setItem(DEFEKT_SCHLUESSEL, JSON.stringify([{ zeit: "z", grund: "g", roh: "1" }]));
    render(<Einstellungen lernstand={haken().h} />);
    expect(abschnitt("speicher").textContent).toContain("Eine Sicherung eines früheren Stands (nicht lesbar, repariert oder vor dem Laden einer Datei) liegt auf diesem Gerät.");
    cleanup();
    localStorage.setItem(DEFEKT_SCHLUESSEL, JSON.stringify([{ zeit: "z", grund: "g", roh: "1" }, { zeit: "z", grund: "g", roh: "2" }]));
    render(<Einstellungen lernstand={haken().h} />);
    expect(abschnitt("speicher").textContent).toContain("2 Sicherungen eines früheren Stands (nicht lesbar, repariert oder vor dem Laden einer Datei) liegen auf diesem Gerät.");
  });

  it("Anderer Tab: nur bei Konflikten; einmal / N-mal", () => {
    render(<Einstellungen lernstand={haken().h} />);
    expect(screen.queryByText("Anderer Tab")).toBeNull();
    cleanup();
    render(<Einstellungen lernstand={haken({}, { konflikte: 1 }).h} />);
    expect(screen.getByText(/^Einmal lag schon ein neuerer Stand/)).toBeTruthy();
    cleanup();
    render(<Einstellungen lernstand={haken({}, { konflikte: 3 }).h} />);
    expect(screen.getByText(/^3-mal lag schon ein neuerer Stand/)).toBeTruthy();
  });
});

describe("Lernstand als Datei", () => {
  const datei = (inhalt: string, name = "stand.json") => new File([inhalt], name, { type: "application/json" });
  const wahl = () => screen.getByLabelText("Lernstand-Datei wählen") as HTMLInputElement;
  const meldungAus = () => abschnitt("lernstanddatei").querySelector("output");

  it("speichern: Dateiname mit Datum, Inhalt der Datei, Typ; Fehler gezeigt und beim nächsten Speichern gelöscht", async () => {
    const { h, stand } = haken({ tagesziel: 33 });
    render(<Einstellungen lernstand={h} />);
    const n = nutzer();
    await n.click(screen.getByRole("button", { name: "Lernstand speichern" }));
    expect(bieteMock).toHaveBeenLastCalledWith(dateiname(JETZT.getTime()), alsDatei(stand, JETZT.getTime(), __APP_VERSION__), "application/json;charset=utf-8");
    expect(meldungAus()).toBeNull();
    bieteMock.mockReturnValueOnce("gesperrt");
    await n.click(screen.getByRole("button", { name: "Lernstand speichern" }));
    expect(meldungAus()?.textContent).toBe("Speichern nicht möglich: gesperrt");
    expect(meldungAus()?.className).toContain("text-destructive");
    await n.click(screen.getByRole("button", { name: "Lernstand speichern" }));
    expect(meldungAus()).toBeNull();
  });

  it("„Lernstand laden …“ öffnet die Dateiwahl", async () => {
    render(<Einstellungen lernstand={haken().h} />);
    const geklickt = vi.fn();
    wahl().addEventListener("click", geklickt);
    await nutzer().click(screen.getByRole("button", { name: "Lernstand laden …" }));
    expect(geklickt).toHaveBeenCalledTimes(1);
  });

  it("zu große Datei: Satz; genau an der Grenze wird gelesen", async () => {
    render(<Einstellungen lernstand={haken().h} />);
    const gross = datei("x");
    Object.defineProperty(gross, "size", { value: DATEI_GRENZE + 1 });
    fireEvent.change(wahl(), { target: { files: [gross] } });
    await waitFor(() => expect(meldungAus()?.textContent).toBe("Die Datei ist zu groß für einen Lernstand."));
    expect(meldungAus()?.className).toContain("text-destructive");
    const grenze = datei("kein json");
    Object.defineProperty(grenze, "size", { value: DATEI_GRENZE });
    fireEvent.change(wahl(), { target: { files: [grenze] } });
    await waitFor(() => expect(meldungAus()?.textContent).toBe("Die Datei ist kein gültiges JSON."));
  });

  it("falsche Datei: ihr Fehlersatz; ohne Auswahl bleibt alles beim Alten und eine offene Rückfrage verschwindet", async () => {
    render(<Einstellungen lernstand={haken().h} />);
    fireEvent.change(wahl(), { target: { files: [datei(alsDatei(leererStand(), JETZT.getTime(), "1.0.0"))] } });
    await screen.findByRole("group", { name: "Lernstand ersetzen?" });
    fireEvent.change(wahl(), { target: { files: [datei("{}")] } });
    await waitFor(() => expect(meldungAus()?.textContent).toBe("Das ist keine Lernstand-Datei dieser App."));
    expect(screen.queryByRole("group", { name: "Lernstand ersetzen?" })).toBeNull();
    fireEvent.change(wahl(), { target: { files: [datei(alsDatei(leererStand(), JETZT.getTime(), "1.0.0"))] } });
    await screen.findByRole("group", { name: "Lernstand ersetzen?" });
    expect(meldungAus()).toBeNull();
    fireEvent.change(wahl(), { target: { files: [] } });
    expect(screen.queryByRole("group", { name: "Lernstand ersetzen?" })).toBeNull();
  });

  it("Rückfrage: Datum der Datei, Abbrechen; ohne Datum kein Klammersatz", async () => {
    render(<Einstellungen lernstand={haken().h} />);
    const n = nutzer();
    fireEvent.change(wahl(), { target: { files: [datei(alsDatei(leererStand(), JETZT.getTime(), "1.0.0"))] } });
    const frage = await screen.findByRole("group", { name: "Lernstand ersetzen?" });
    expect(frage.textContent).toContain(`(gespeichert am ${JETZT.toLocaleString("de-DE")})`);
    expect(frage.textContent).toContain("Der bisherige Stand wird vorher auf diesem Gerät gesichert.");
    expect(frage.textContent).not.toContain("repariert");
    await n.click(within(frage).getByRole("button", { name: "Abbrechen" }));
    expect(screen.queryByRole("group", { name: "Lernstand ersetzen?" })).toBeNull();
    const ohne = JSON.parse(alsDatei(leererStand(), JETZT.getTime(), "1.0.0")) as Record<string, unknown>;
    delete ohne.exportiert;
    fireEvent.change(wahl(), { target: { files: [datei(JSON.stringify(ohne))] } });
    const frage2 = await screen.findByRole("group", { name: "Lernstand ersetzen?" });
    expect(frage2.textContent).not.toContain("gespeichert am");
    expect(frage2.textContent).toContain("durch die Datei ersetzen?");
  });

  async function mitReparaturen(felder: Record<string, unknown>, erwartet: number) {
    const { h, aendere, stand } = haken({ tagesziel: 33 });
    render(<Einstellungen lernstand={h} />);
    const roh = JSON.parse(alsDatei(leererStand(), JETZT.getTime(), "1.0.0")) as { stand: Record<string, unknown> };
    Object.assign(roh.stand, felder);
    fireEvent.change(wahl(), { target: { files: [datei(JSON.stringify(roh))] } });
    const frage = await screen.findByRole("group", { name: "Lernstand ersetzen?" });
    return { frage, aendere, stand, erwartet };
  }

  it("Rückfrage nennt eine Reparatur in der Einzahl, Ersetzen schreibt Stand, sichert den alten und meldet", async () => {
    const { frage, aendere, stand } = await mitReparaturen({ tagesziel: "viel" }, 1);
    expect(frage.textContent).toContain(" Eine Stelle wird dabei repariert.");
    await nutzer().click(within(frage).getByRole("button", { name: "Ersetzen" }));
    expect(aendere).toHaveBeenCalledTimes(1);
    expect(typeof aendere.mock.calls[0]![0](stand).tagesziel).toBe("number");
    expect(aendere.mock.calls[0]![0](stand)).not.toBe(stand);
    const s = sicherungen(localStorage);
    expect(s).toHaveLength(1);
    expect(s[0]!.grund).toBe("vor dem Laden einer Lernstand-Datei");
    expect(JSON.parse(s[0]!.roh).tagesziel).toBe(33);
    expect(s[0]!.zeit).toBe(JETZT.toISOString());
    expect(screen.queryByRole("group", { name: "Lernstand ersetzen?" })).toBeNull();
    expect(meldungAus()?.textContent).toBe("Lernstand übernommen – eine Stelle repariert.");
    expect(meldungAus()?.className).toContain("text-muted-foreground");
    expect(meldungAus()?.className).not.toContain("text-destructive");
  });

  it("zwei Reparaturen: Mehrzahl in Rückfrage und Meldung", async () => {
    const { frage } = await mitReparaturen({ tagesziel: "viel", level: "hoch" }, 2);
    expect(frage.textContent).toContain(" 2 Stellen werden dabei repariert.");
    await nutzer().click(within(frage).getByRole("button", { name: "Ersetzen" }));
    expect(meldungAus()?.textContent).toBe("Lernstand übernommen – 2 Stellen repariert.");
  });

  it("ohne Reparatur: „Lernstand übernommen.“", async () => {
    const { frage } = await mitReparaturen({}, 0);
    await nutzer().click(within(frage).getByRole("button", { name: "Ersetzen" }));
    expect(meldungAus()?.textContent).toBe("Lernstand übernommen.");
  });
});
