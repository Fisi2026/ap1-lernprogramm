// @vitest-environment jsdom
/* Spickzettel direkt gerendert: jede Art von Block und Auszeichnung erscheint als das passende Element,
   die Suche öffnet Treffer (Leerzeichen zählen nicht als Suche). Erwartet wird aus dem Modell in kern/spickzettel. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { bloecke, gefiltert, sektionen, type Block, type Teil } from "@/kern/spickzettel";
import { Spickzettel } from "./Spickzettel";

/* Der Bestand hat keine Zwischenüberschrift (`###`) im Abschnitt; für diesen Block steht ein eigener kleiner Text bereit. */
const EIGEN = { an: false };
const TEXT = "## Eigen\n### Zwischentitel mit **fett**\n> Zitat *schräg*\n1. eins\n2. zwei\n- a\n- b `c`\nAbsatz\n";
vi.mock("@/kern/spickzettel", async (orig) => {
  const echt = await orig<typeof import("@/kern/spickzettel")>();
  return { ...echt, sektionen: (q?: string) => echt.sektionen(q ?? (EIGEN.an ? TEXT : undefined)) };
});

afterEach(cleanup);
const ALLE = sektionen();
const alleBloecke = ALLE.flatMap((s) => bloecke(s.koerper));
const klappen = () => Array.from(document.querySelectorAll('[data-slot="accordion-item"]'));
const offene = () => klappen().filter((d) => d.getAttribute("data-state") === "open");
const feld = () => screen.getByLabelText("Im Spickzettel suchen") as HTMLInputElement;

async function oeffneAlle() {
  const nutzer = userEvent.setup({ delay: null });
  for (const d of klappen()) {
    const k = d.querySelector('[data-slot="accordion-trigger"]') as HTMLElement;
    if (k.getAttribute("aria-expanded") !== "true") await nutzer.click(k);
  }
}
const teileIn = (b: Block): Teil[] => {
  if (b.art === "liste") return b.punkte.flat();
  if (b.art === "tabelle") return [...b.kopf.flat(), ...b.zeilen.flat(2)];
  return b.teile;
};

describe("Bloecke und Auszeichnung", () => {
  it("jede Art Block und Auszeichnung des Bestands erscheint als eigenes, passendes Element", async () => {
    render(<Spickzettel />);
    await oeffneAlle();
    const inhalt = document.body;
    const zaehle = (art: Block["art"]) => alleBloecke.filter((b) => b.art === art).length;
    const teile = alleBloecke.flatMap(teileIn);
    const nur = (art: Teil["art"]) => teile.filter((t) => t.art === art).length;
    /* der Bestand enthält jede Art – sonst prüfte der Test nichts */
    for (const a of ["zitat", "liste", "tabelle", "absatz"] as const) expect(zaehle(a), a).toBeGreaterThan(0);
    for (const a of ["text", "fett", "kursiv"] as const) expect(nur(a), a).toBeGreaterThan(0);
    expect(alleBloecke.some((b) => b.art === "liste" && b.geordnet)).toBe(true);
    expect(alleBloecke.some((b) => b.art === "liste" && !b.geordnet)).toBe(true);

    expect(inhalt.querySelectorAll("blockquote")).toHaveLength(zaehle("zitat"));
    expect(inhalt.querySelectorAll("table")).toHaveLength(zaehle("tabelle"));
    expect(inhalt.querySelectorAll("ol")).toHaveLength(alleBloecke.filter((b) => b.art === "liste" && b.geordnet).length);
    expect(inhalt.querySelectorAll("ul")).toHaveLength(alleBloecke.filter((b) => b.art === "liste" && !b.geordnet).length);
    expect(inhalt.querySelectorAll("li")).toHaveLength(alleBloecke.reduce((n, b) => n + (b.art === "liste" ? b.punkte.length : 0), 0));
    expect(inhalt.querySelectorAll("th")).toHaveLength(alleBloecke.reduce((n, b) => n + (b.art === "tabelle" ? b.kopf.length : 0), 0));
    expect(inhalt.querySelectorAll("td")).toHaveLength(alleBloecke.reduce((n, b) => n + (b.art === "tabelle" ? b.zeilen.reduce((m, r) => m + r.length, 0) : 0), 0));
    expect(inhalt.querySelectorAll("tbody tr")).toHaveLength(alleBloecke.reduce((n, b) => n + (b.art === "tabelle" ? b.zeilen.length : 0), 0));
    expect(inhalt.querySelectorAll('[data-slot="accordion-content"] p')).toHaveLength(zaehle("absatz"));
    expect(inhalt.querySelectorAll("b.font-semibold")).toHaveLength(nur("fett"));
    expect(inhalt.querySelectorAll('[data-slot="accordion-content"] i')).toHaveLength(nur("kursiv"));
    expect(inhalt.querySelectorAll('[data-slot="accordion-content"] code')).toHaveLength(nur("code"));
    expect(inhalt.querySelectorAll('[data-slot="accordion-content"] span')).toHaveLength(nur("text"));
    for (const ol of inhalt.querySelectorAll("ol")) expect(ol.className).toContain("list-decimal");
    for (const ul of inhalt.querySelectorAll("ul")) expect(ul.className).toContain("list-disc");
    for (const ul of inhalt.querySelectorAll("ul")) expect(ul.className).not.toContain("list-decimal");
    for (const ol of inhalt.querySelectorAll("ol")) expect(ol.className).not.toContain("list-disc");
  });
});

describe("Eigene Abschnitte", () => {
  it("Zwischenüberschrift, Zitat, geordnete und ungeordnete Liste, Absatz mit passenden Elementen", () => {
    EIGEN.an = true;
    try {
      render(<Spickzettel />);
    } finally { EIGEN.an = false; }
    expect(klappen()).toHaveLength(1);
    const h3 = document.querySelector("h3")!;
    expect(h3.textContent).toBe("Zwischentitel mit fett");
    expect(h3.querySelector("b")?.textContent).toBe("fett");
    expect(h3.className).toContain("text-foreground");
    const zitat = document.querySelector("blockquote")!;
    expect(zitat.textContent).toBe("Zitat schräg");
    expect(zitat.querySelector("i")?.textContent).toBe("schräg");
    expect(document.querySelector("ol")!.textContent).toBe("einszwei");
    expect(document.querySelector("ul")!.textContent).toBe("ab c");
    expect(document.querySelector("ul code")?.textContent).toBe("c");
    expect(document.querySelector('[data-slot="accordion-content"] p')?.textContent).toBe("Absatz");
  });
});

describe("Suche", () => {
  it("am Anfang ist nur der erste Abschnitt offen", () => {
    render(<Spickzettel />);
    expect(klappen()).toHaveLength(ALLE.length);
    expect(offene()).toHaveLength(1);
    expect(offene()[0]).toBe(klappen()[0]);
  });

  it("Leerzeichen sind keine Suche: alle Abschnitte bleiben, nur der erste ist offen", () => {
    render(<Spickzettel />);
    fireEvent.change(feld(), { target: { value: "   " } });
    expect(klappen()).toHaveLength(ALLE.length);
    expect(offene()).toHaveLength(1);
  });

  it("Suchtext: genau die Treffer, alle offen; zurück auf leer: nur der erste", () => {
    render(<Spickzettel />);
    const wort = ALLE[ALLE.length - 1]!.titel.toLowerCase();
    const soll = gefiltert(ALLE, wort);
    expect(soll.length).toBeGreaterThan(0);
    fireEvent.change(feld(), { target: { value: wort } });
    expect(klappen()).toHaveLength(soll.length);
    expect(offene()).toHaveLength(soll.length);
    fireEvent.change(feld(), { target: { value: "" } });
    expect(klappen()).toHaveLength(ALLE.length);
    expect(offene()).toHaveLength(1);
  });

  it("ohne Treffer ein Satz statt leerer Seite", () => {
    render(<Spickzettel />);
    fireEvent.change(feld(), { target: { value: "zzzqqq-gibt-es-nicht" } });
    expect(screen.getByText("Dazu steht nichts im Spickzettel.")).toBeTruthy();
    expect(klappen()).toHaveLength(0);
  });
});
