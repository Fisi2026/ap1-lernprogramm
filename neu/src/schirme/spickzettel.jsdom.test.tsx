// @vitest-environment jsdom
/* ============================================================================
   DER SPICKZETTEL ÜBER DEN SCHIRM

   ⛔⛔ GEMESSEN WIRD IN DER APP, NICHT DANEBEN: der Weg geht über die
      Werkzeugschiene, weil genau dort der Bereich bisher "noch nicht gebaut"
      sagte. Ein Schirm, den man nur direkt rendern kann, ist nicht eingehängt.
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { sektionen } from "@/kern/spickzettel";

const ALLE = sektionen();

beforeEach(() => { localStorage.clear(); cleanup(); history.replaceState(null, "", "#ueben");  /* N22: ohne Adresse öffnet die App die Startseite */ });

async function zumSpickzettel(nutzer: ReturnType<typeof userEvent.setup>) {
  await nutzer.click(screen.getByRole("button", { name: "Spickzettel" }));
}

/* ⚠️ Seit P6 ein `Accordion` statt `<details>` (N25 P6a): der Zustand steht als
   `data-state` am Abschnitt, nicht als `open`. ⛔ UND: zugeklappte Abschnitte
   haengen ihren Inhalt AUS - wer hineinzaehlt, klappt vorher auf. */
const klappen = () => Array.from(document.querySelectorAll('[data-slot="accordion-item"]'));
const offene = () => klappen().filter((d) => d.getAttribute("data-state") === "open");
const knopf = (d: Element) => d.querySelector('[data-slot="accordion-trigger"]') as HTMLElement;
async function klappeAlleAuf(nutzer: ReturnType<typeof userEvent.setup>) {
  for (const d of klappen()) {
    const k = knopf(d);
    if (k.getAttribute("aria-expanded") !== "true") await nutzer.click(k);
  }
}

describe("Der Spickzettel ist über die Schiene erreichbar", () => {
  it("zeigt nach dem Klick alle Abschnitte, den ersten offen", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    expect(screen.queryByText(/noch nicht gebaut/)).toBeNull();   // Üben steht zuerst
    await zumSpickzettel(nutzer);

    expect(screen.getAllByText("Spickzettel").length).toBeGreaterThan(0);
    expect(klappen().length).toBe(ALLE.length);
    expect(offene().length).toBe(1);
    expect(knopf(klappen()[0]).textContent).toBe(ALLE[0].titel);
  });

  it("zeichnet die Auszeichnung des Bestands wirklich als Auszeichnung", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumSpickzettel(nutzer);
    /* ⛔⛔ HIER LAG EIN FEHLALARM, GEFUNDEN AM 15.09.2026 VON DER SABOTAGE
       "fett wird nicht fett": die erste Fassung zaehlte `b` im GANZEN Dokument -
       und `Kopf.tsx` zeichnet dort immer ein `<b>` fuer die faelligen Karten.
       Die Zusicherung war damit erfuellt, ohne den Spickzettel anzusehen.
       ►► Gezaehlt wird jetzt INNERHALB der Abschnitte, und der fette Anker wird
          beim Namen genannt.
       ⚠️ Seit P6 haengt ein zugeklappter Abschnitt seinen Inhalt aus - deshalb
          erst AUFKLAPPEN, sonst zaehlt man nur den ersten Abschnitt. */
    await klappeAlleAuf(nutzer);
    const zaehle = (sel: string) =>
      klappen().reduce((n, d) => n + d.querySelectorAll(sel).length, 0);
    expect(zaehle("table")).toBeGreaterThan(0);
    expect(zaehle("li")).toBeGreaterThan(0);
    expect(zaehle("b")).toBeGreaterThan(0);

    const fett = Array.from(document.querySelectorAll('[data-slot="accordion"] b')).map((e) => e.textContent);
    expect(fett, "der Bestand hat 'Nicht in AP1:' fett - das muss als <b> ankommen")
      .toContain("Nicht in AP1:");
    expect(document.body.textContent).not.toContain("**");
  });
});

describe("Die Suche", () => {
  it("laesst nur Treffer stehen und klappt sie auf", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumSpickzettel(nutzer);

    /* Ein Wort, das GENAU EINEN Abschnitt trifft - sonst misst der Test nichts. */
    const wort = "projektmanagement";
    const erwartet = ALLE.filter((s) => s.suchtext.includes(wort)).length;
    expect(erwartet, "Suchwort trifft nicht genau einen Abschnitt").toBe(1);

    await nutzer.type(screen.getByRole("searchbox", { name: /Spickzettel/ }), wort);
    expect(klappen().length).toBe(1);
    expect(offene().length).toBe(1);
  });

  it("klappt bei MEHREREN Treffern auch alle auf", async () => {
    /* ⛔⛔ DIESEN FALL GAB ES NICHT, UND DIE SABOTAGE HAT ES GEZEIGT (21.09.2026,
       N25 P6a): der Fall darueber sucht ein Wort, das GENAU EINEN Abschnitt
       trifft - dort ist "alle Treffer offen" von "nur der erste offen" nicht zu
       unterscheiden. Die zweite Haelfte seines eigenen Namens war ungemessen, und
       eine Sabotage auf die Aufklapp-Regel blieb gruen.
       ►► **Ein Fall misst erst, wenn sein Fixture die beiden Antworten trennt.** */
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumSpickzettel(nutzer);

    const wort = "kosten";
    const erwartet = ALLE.filter((s) => s.suchtext.includes(wort)).length;
    expect(erwartet, "Suchwort muss MEHRERE Abschnitte treffen").toBeGreaterThan(1);
    expect(erwartet, "und nicht gleich alle - sonst misst der Filter nichts")
      .toBeLessThan(ALLE.length);

    await nutzer.type(screen.getByRole("searchbox", { name: /Spickzettel/ }), wort);
    expect(klappen().length).toBe(erwartet);
    expect(offene().length).toBe(erwartet);
  });

  it("sagt es, wenn nichts passt - statt eine leere Seite zu zeigen", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumSpickzettel(nutzer);
    await nutzer.type(screen.getByRole("searchbox", { name: /Spickzettel/ }), "xyzqwertz");
    expect(klappen().length).toBe(0);
    expect(screen.getByText(/Dazu steht nichts im Spickzettel/)).toBeTruthy();
  });

  it("stellt nach dem Leeren den Ausgangszustand wieder her", async () => {
    const nutzer = userEvent.setup({ delay: null });
    render(<App />);
    await zumSpickzettel(nutzer);
    const feld = screen.getByRole("searchbox", { name: /Spickzettel/ });
    await nutzer.type(feld, "projektmanagement");
    await nutzer.clear(feld);
    expect(klappen().length).toBe(ALLE.length);
    expect(offene().length).toBe(1);
  });
});
