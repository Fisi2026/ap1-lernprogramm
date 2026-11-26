// @vitest-environment jsdom
/* ============================================================================
   DER RECHEN-GENERATOR ÜBER DEN SCHIRM

   ⛔⛔ GEMESSEN WIRD IN DER APP, NICHT DANEBEN — der Weg geht über die
      Werkzeugschiene, weil genau dort der Bereich bisher "noch nicht gebaut"
      sagte. Ein Schirm, den man nur direkt rendern kann, ist nicht eingehaengt.
   ⚠️ DIE AUFGABEN SIND GEWUERFELT, die richtige Antwort kennt der Test also
      nicht. Deshalb wird der FALSCHE Weg gefahren (eine Eingabe, die keine Zahl
      ist) — und ausdruecklich geprueft, dass der Schirm sie auch als falsch
      ausweist. Waere sie wider Erwarten richtig, faellt der Test laut auf.
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { GENERATOREN } from "@/kern/generatoren";
import { leererStand, LS_SCHLUESSEL } from "@/kern/stand";
import type { Lernstand } from "@/kern/stand";
import { arten, artName } from "@/kern/generator";

const MOEGLICH = arten(leererStand() as Lernstand);

function gespeichert(): Record<string, unknown> | null {
  const roh = localStorage.getItem(LS_SCHLUESSEL);
  return roh ? (JSON.parse(roh) as Record<string, unknown>) : null;
}

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

async function zumGenerator(nutzer: ReturnType<typeof userEvent.setup>) {
  await nutzer.click(screen.getByRole("button", { name: "Rechen-Generator" }));
}

/* ⛔ BEFUND BEIM ERSTEN LAUF: die Werkzeugschiene traegt einen Knopf "Netzplan",
   und L.GENERATOREN nennt seine Art genauso. `queryByRole` fand deshalb zwei
   Knoepfe und der Test fiel — zu Recht, denn die Frage war mehrdeutig gestellt.
   ►► Die Knopfleiste der Arten ist jetzt eine benannte Gruppe, und gefragt wird
      NUR in ihr. Das hilft auch einem Vorleseprogramm. */
const artenLeiste = () => within(screen.getByRole("group", { name: "Aufgabenarten" }));

describe("Der Rechen-Generator ist über die Schiene erreichbar", () => {
  it("bietet jede moegliche Art an — und netzplan ist keine davon", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGenerator(nutzer);
    expect(screen.queryByText(/noch nicht gebaut/)).toBeNull();

    expect(MOEGLICH.length).toBeGreaterThan(1);
    for (const a of MOEGLICH) {
      expect(artenLeiste().getByRole("button", { name: artName(a) }), a).toBeTruthy();
    }
    /* ⛔ `netzplan` steht in L.GENERATOREN, gehoert hier aber nicht hin — die
       Aufgabe braucht ein eigenes Zeichenwerk. So haelt es auch `sGenerator`. */
    expect(Object.keys(GENERATOREN)).toContain("netzplan");
    expect(artenLeiste().queryByRole("button", { name: artName("netzplan") })).toBeNull();
  });

  it("sagt vor dem ersten Klick, was zu tun ist — statt eine leere Flaeche zu zeigen", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGenerator(nutzer);
    expect(screen.getByText(/Wähle eine Aufgabenart/)).toBeTruthy();
    expect(screen.queryByLabelText(/^Antwort/)).toBeNull();
  });

  it("stellt nach dem Klick eine Aufgabe GENAU dieser Art", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGenerator(nutzer);
    const art = MOEGLICH[0];
    await nutzer.click(screen.getByRole("button", { name: artName(art) }));

    expect(screen.getByText("GEN-" + art)).toBeTruthy();
    expect(screen.getAllByLabelText(/^Antwort/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Lösungsweg/)).toBeNull();      // erst nach dem Pruefen
  });

  it("weist eine falsche Antwort als falsch aus und zeigt den Loesungsweg", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGenerator(nutzer);
    await nutzer.click(screen.getByRole("button", { name: artName(MOEGLICH[0]) }));

    for (const feld of screen.getAllByLabelText(/^Antwort/)) await nutzer.type(feld, "keinezahl");
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));

    expect(screen.getByText("Nicht richtig.")).toBeTruthy();
    expect(screen.getByText(/Lösungsweg/)).toBeTruthy();
    expect(screen.getAllByText(/^richtig: /).length).toBeGreaterThan(0);
  });

  /* ⛔⛔ DER KERN: hier darf man sich die Art aussuchen — also darf das Ergebnis
     die Modul-Statistik nicht anfassen. Sonst koennte sich jeder seine
     Trefferquote und damit seine "Bereitschaft" schoenrechnen. */
  it("bucht nur die GEN-Zeile und den Tag, kein Modul und kein Fehler-Deck", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGenerator(nutzer);
    const art = MOEGLICH[0];
    await nutzer.click(screen.getByRole("button", { name: artName(art) }));
    for (const feld of screen.getAllByLabelText(/^Antwort/)) await nutzer.type(feld, "keinezahl");
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));

    const s = gespeichert()!;
    const st = s.statistik as Record<string, { richtig: number; gesamt: number }>;
    expect(Object.keys(st).length).toBe(1);
    expect(Object.keys(st)[0].startsWith("GEN:")).toBe(true);
    expect(st[Object.keys(st)[0]]).toEqual({ richtig: 0, gesamt: 1 });
    expect(Object.keys(s.dailyCounts as object).length).toBe(1);
    expect(Object.keys(s.fehlerDeck as object)).toEqual([]);
    expect((s.antworten as unknown[]).length).toBe(0);
  });

  it("zaehlt dieselbe Aufgabe nicht zweimal, auch wenn man wieder klickt", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGenerator(nutzer);
    await nutzer.click(screen.getByRole("button", { name: artName(MOEGLICH[0]) }));
    for (const feld of screen.getAllByLabelText(/^Antwort/)) await nutzer.type(feld, "keinezahl");
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));
    /* Nach dem Pruefen steht dort "Neue Aufgabe" — der Pruefknopf ist weg. */
    expect(screen.queryByRole("button", { name: "Lösung prüfen" })).toBeNull();
    const st = (gespeichert()!.statistik as Record<string, { gesamt: number }>);
    expect(st[Object.keys(st)[0]].gesamt).toBe(1);
  });

  it("gibt auf Klick eine neue Aufgabe derselben Art, mit leerem Feld", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGenerator(nutzer);
    const art = MOEGLICH[0];
    await nutzer.click(screen.getByRole("button", { name: artName(art) }));
    for (const feld of screen.getAllByLabelText(/^Antwort/)) await nutzer.type(feld, "keinezahl");
    await nutzer.click(screen.getByRole("button", { name: "Lösung prüfen" }));
    await nutzer.click(screen.getByRole("button", { name: "Neue Aufgabe →" }));

    expect(screen.getByText("GEN-" + art)).toBeTruthy();
    expect(screen.queryByText("Nicht richtig.")).toBeNull();
    expect(screen.queryByText(/Lösungsweg/)).toBeNull();
    for (const feld of screen.getAllByLabelText(/^Antwort/)) {
      expect((feld as HTMLInputElement).value).toBe("");
    }
    expect(screen.getByRole("button", { name: "Lösung prüfen" })).toBeTruthy();
  });

  it("sagt es, wenn zur Auswahl keine Art passt — statt leerer Knopfleiste", async () => {
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({
      version: 1, themen: ["M09|gibtesnicht"],
    }));
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumGenerator(nutzer);
    expect(screen.getByText(/passt keine Aufgabenart/)).toBeTruthy();
    for (const a of MOEGLICH) {
      expect(artenLeiste().queryByRole("button", { name: artName(a) }), a).toBeNull();
    }
  });
});
