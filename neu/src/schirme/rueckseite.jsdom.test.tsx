// @vitest-environment jsdom
/* ============================================================================
   ETAPPE N19: DIE RUECKSEITE VOLLSTAENDIG — erklaerungLang, Distraktoren, Verweis

   ⛔ Gemessen wird am ECHTEN Klick durch die Karteikarte, nicht an der Komponente
      allein: ein Feld, das die Rueckseite kann, aber die Karte nicht uebergibt,
      waere ein Zweig, den kein Aufrufer erreicht (N11).
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Karteikarte } from "./Karteikarte";
import { Rueckseite } from "./Rueckseite";
import { distraktoren } from "./distraktoren";
import { FRAGEN } from "@/daten/laden";
import { istTyp, type Frage, type FrageVon } from "@/daten/typen";

beforeEach(() => {
  localStorage.clear();
  cleanup();
});

function teil(name: string): HTMLElement | null {
  return document.querySelector(`[data-teil="${name}"]`);
}
function mcFrage(): FrageVon<"mc"> {
  const f = FRAGEN.filter((x) => istTyp(x, "mc")).find((x) => typeof x.loesungIndex === "number"
    && Array.isArray(x.distraktorErklaerungen));
  if (!f) throw new Error("kein mc im Bestand");
  return f;
}

describe("Der Bestand traegt, was die Rueckseite zeigt", () => {
  it("jede Frage hat erklaerungLang und verweis, jede mc-Frage Distraktor-Erklaerungen", () => {
    const ohneLang = FRAGEN.filter((f) => !(f.erklaerungLang ?? "").trim()).map((f) => f.id);
    const ohneVerweis = FRAGEN.filter((f) => !(f.verweis ?? "").trim()).map((f) => f.id);
    const mcOhne = FRAGEN.filter((f) => f.typ === "mc" && distraktoren(f).length === 0).map((f) => f.id);
    expect(FRAGEN.length).toBeGreaterThan(1000);
    expect(ohneLang).toEqual([]);
    expect(ohneVerweis).toEqual([]);
    expect(mcOhne).toEqual([]);
  });
});

describe("Die Rueckseite an der Karteikarte", () => {
  it("zeigt vor dem Pruefen nichts von der Loesung", () => {
    const f = mcFrage();
    render(<Karteikarte frage={f} nummer={1} buche={() => {}} />);
    expect(screen.getByText("Erscheint nach dem Prüfen.")).toBeTruthy();
    expect(teil("lang")).toBeNull();
    expect(screen.queryByText(/^Siehe /)).toBeNull();
  });

  it("nach falscher Antwort: aufgeklappt, mit Langtext, Distraktoren und Verweis als TEXT", async () => {
    const nutzer = userEvent.setup();
    const f = mcFrage();
    render(<Karteikarte frage={f} nummer={1} buche={() => {}} />);
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));

    /* Seit N25 P4 ein Collapsible statt <details>: der Klappzustand steht in
       `data-state` (Radix), nicht mehr in `open`. */
    const lang = teil("lang") as HTMLElement;
    expect(lang, "ausfuehrliche Erklaerung fehlt").not.toBeNull();
    expect(lang.getAttribute("data-state"), "nach falscher Antwort muss sie offen sein").toBe("open");
    expect(lang.textContent).toContain(String(f.erklaerungLang).trim().slice(0, 40));

    const d = teil("distraktoren") as HTMLElement;
    /* ⛔ Unabhaengig gezaehlt, nicht ueber `distraktoren()` — sonst prueft die
       Funktion sich selbst. */
    expect(within(d).getAllByRole("listitem")).toHaveLength(f.optionen!.length - 1);
    const richtige = f.optionen![f.loesungIndex!];
    expect(d.textContent).not.toContain(richtige + ":");

    const v = teil("verweis") as HTMLElement;
    expect(v.textContent).toBe(`Siehe ${String(f.verweis).trim()}`);
    /* ⛔ Die Kursdateien werden nicht ausgeliefert (.assetsignore: *.md) — kein Link. */
    expect(teil("rueckseite")!.querySelector("a")).toBeNull();
  });

  it("nach richtiger Antwort: vorhanden, aber zugeklappt", async () => {
    const nutzer = userEvent.setup();
    const f = mcFrage();
    render(<Karteikarte frage={f} nummer={1} buche={() => {}} />);
    const richtige = f.optionen![f.loesungIndex!];
    /* Seit N25 P3 steht der Optionstext im Label der Wahlkarte, nicht im Knopf –
       gesucht wird über den Namen (der Vertrag aus eingabe.test.tsx), nicht über den Inhalt. */
    const knopf = screen.queryAllByRole("radio", { name: richtige })[0];
    expect(knopf, "richtige Option nicht gefunden").toBeTruthy();
    await nutzer.click(knopf!);
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));
    expect(screen.getByText("Richtig.")).toBeTruthy();
    const lang = teil("lang") as HTMLElement;
    expect(lang).not.toBeNull();
    expect(lang.getAttribute("data-state")).toBe("closed");
  });

  it("eine Frage mit variablen zeigt den Langtext MIT eingesetzten Werten", async () => {
    const nutzer = userEvent.setup();
    const f = FRAGEN.filter((x) => istTyp(x, "rechenassistent")).find((x) => x.variablen && typeof x.variablen === "object"
      && /\{[A-Za-z]+\}/.test(String(x.erklaerungLang)));
    expect(f, "der Bestand hat keine solche Frage mehr").toBeTruthy();
    const namen = Object.keys(f!.variablen as object);
    render(<Karteikarte frage={f!} nummer={1} buche={() => {}} />);
    await nutzer.click(screen.getByRole("button", { name: "Aufgeben" }));
    const text = teil("lang")!.textContent ?? "";
    for (const n of namen) expect(text, `Platzhalter {${n}} steht noch da`).not.toContain(`{${n}}`);
  });
});

describe("Die richtige Option steht nie unter den Distraktoren (gebauter Fall)", () => {
  it("auch wenn der Pool an der Loesung eine Erklaerung traegt", () => {
    /* ⚠️ DER BESTAND ERREICHT DIESEN ZWEIG NICHT: gemessen 17.09.2026 ist die
       Erklaerung an der Loesungsposition bei allen 352 mc-Fragen leer — und
       wird schon deshalb uebersprungen. Ohne diesen Fall blieb die Sabotage
       "Loesung nicht ausfiltern" gruen. */
    const f = mcFrage();
    const erkl = [...f.distraktorErklaerungen!];
    erkl[f.loesungIndex!] = "DIES DARF NICHT ERSCHEINEN";
    render(<Rueckseite frage={{ ...f, distraktorErklaerungen: erkl }} geprueft aufklappen />);
    expect(teil("distraktoren")!.textContent).not.toContain("DIES DARF NICHT ERSCHEINEN");
    expect(within(teil("distraktoren")!).getAllByRole("listitem")).toHaveLength(f.optionen!.length - 1);
  });
});

describe("Eine Frage ohne die Felder sagt es selbst (gebauter Fall — der Bestand erreicht ihn nicht)", () => {
  it("nennt fehlenden Langtext und fehlenden Verweis", () => {
    const f = { ...mcFrage(), erklaerungLang: "", erklaerungKurz: "", verweis: undefined,
      typ: "wahrfalsch" } as unknown as Frage;
    render(<Rueckseite frage={f} geprueft aufklappen />);
    expect(screen.getByText(/keine ausführliche Erklärung/)).toBeTruthy();
    expect(screen.getByText(/kein Verweis/)).toBeTruthy();
    expect(teil("distraktoren")).toBeNull();
  });
});
