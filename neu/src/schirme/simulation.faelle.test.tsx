// @vitest-environment jsdom
/* Die Pruefungssimulation allein (ohne App-Huelle): Startschirm mit Dauer und Verlaufsbalken, Navigation
   im Lauf, Uhr (knapp, Abgabe auf die Sekunde), Auswertung mit Kennzahlen, Faerbung, Ueberblick.
   Die Pruefung ist gewuerfelt; gemessen wird, was nicht an den gezogenen Fragen haengt.
   Verdrahtung ueber die App und Lernstand-Buchung: simulation.jsdom.test.tsx. */
import { describe, it, expect, vi, beforeEach, afterEach, onTestFinished } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Simulation } from "./Simulation";
import { useLernstand } from "@/huelle/useLernstand";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { LS_SCHLUESSEL, leererStand } from "@/kern/stand";

function Buehne({ pool }: { pool?: readonly Frage[] }) {
  const lernstand = useLernstand();
  return pool ? <Simulation lernstand={lernstand} pool={pool} /> : <Simulation lernstand={lernstand} />;
}
const legeStand = (extra: Record<string, unknown> = {}) =>
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), ...extra }));
const nutzer = (zeit = false) =>
  userEvent.setup(zeit ? { delay: null, advanceTimers: vi.advanceTimersByTime } : { delay: null });
const hat = (e: Element, k: string) => e.classList.contains(k);
const nav = () => screen.getAllByRole("button", { name: /^Frage \d+$/ });
const frageZeile = () => screen.getByText(/^Frage \d+ \/ \d+$/).textContent;
async function starte(n: ReturnType<typeof nutzer>, anzahl = "12") {
  const feld = screen.getByLabelText("Aufgaben insgesamt");
  await n.clear(feld);
  await n.type(feld, anzahl);
  await n.click(screen.getByRole("button", { name: "Prüfung starten" }));
}

beforeEach(() => { localStorage.clear(); legeStand(); });
afterEach(() => { vi.useRealTimers(); cleanup(); });

describe("Startschirm", () => {
  it("nennt die eingestellte Dauer in Minuten, sonst die automatische", () => {
    legeStand({ simDauerMin: 45 });
    render(<Buehne />);
    expect(screen.getByText("45 Minuten")).toBeTruthy();
    cleanup();
    legeStand({ simDauerMin: 0 });
    render(<Buehne />);
    expect(screen.getByText("automatisch aus den Richtwerten der Fragetypen")).toBeTruthy();
  });

  it("Verlauf: die letzten zwoelf Balken, aeltester links, Hoehe nach Prozent (mindestens 3), Beschriftung mit Datum", () => {
    const h = Array.from({ length: 14 }, (_, i) => ({ datum: `2026-10-${String(i + 1).padStart(2, "0")}`, prozent: i === 13 ? 100 : i === 2 ? 1 : 40 + i, note: "3" }));
    legeStand({ simHistorie: h });
    render(<Buehne />);
    const verlauf = screen.getByLabelText("Verlauf der Ergebnisse");
    const balken = [...verlauf.querySelectorAll(".bg-chart-1")] as HTMLElement[];
    expect(balken).toHaveLength(12);
    expect(balken[0]!.title).toBe("2026-10-03: 1 %");
    expect(balken.at(-1)!.title).toBe("2026-10-14: 100 %");
    expect(balken[0]!.style.height).toBe("3px");
    expect(balken.at(-1)!.style.height).toBe("70px");
    expect(within(verlauf).getAllByText(/^\d+$/).map((s) => s.textContent).slice(0, 2)).toEqual(["1", "43"]);
  });

  it("Zusammenfassung: die letzten fuenf, neueste zuerst, mit Note", () => {
    const h = Array.from({ length: 7 }, (_, i) => ({ datum: `2026-10-0${i + 1}`, prozent: 50 + i, note: String(i % 4 + 1) }));
    legeStand({ simHistorie: h });
    render(<Buehne />);
    expect(screen.getByText(
      "2026-10-07: 56 % (Note 3) · 2026-10-06: 55 % (Note 2) · 2026-10-05: 54 % (Note 1) · 2026-10-04: 53 % (Note 4) · 2026-10-03: 52 % (Note 3)",
    )).toBeTruthy();
  });
});

describe("Lauf", () => {
  it("Navigation: nummeriert 1..N, 'Zurück' gesperrt am Anfang, 'Weiter' gesperrt am Ende, beide bewegen um eine Frage", async () => {
    const n = nutzer();
    render(<Buehne />);
    await starte(n);
    const anzahl = nav().length;
    expect(anzahl).toBeGreaterThanOrEqual(12);
    expect(nav().map((k) => k.textContent)).toEqual(Array.from({ length: anzahl }, (_, i) => String(i + 1)));
    expect(nav().map((k) => k.getAttribute("aria-label"))).toEqual(Array.from({ length: anzahl }, (_, i) => `Frage ${i + 1}`));
    const zurueck = () => screen.getByRole("button", { name: "← Zurück" }) as HTMLButtonElement;
    const weiter = () => screen.getByRole("button", { name: "Weiter →" }) as HTMLButtonElement;
    expect(frageZeile()).toBe(`Frage 1 / ${anzahl}`);
    expect([zurueck().disabled, weiter().disabled]).toEqual([true, false]);
    await n.click(weiter());
    expect(frageZeile()).toBe(`Frage 2 / ${anzahl}`);
    expect(zurueck().disabled).toBe(false);
    await n.click(zurueck());
    expect(frageZeile()).toBe(`Frage 1 / ${anzahl}`);
    await n.click(nav()[anzahl - 1]!);
    expect(frageZeile()).toBe(`Frage ${anzahl} / ${anzahl}`);
    expect([zurueck().disabled, weiter().disabled]).toEqual([false, true]);
    await n.click(zurueck());
    expect(frageZeile()).toBe(`Frage ${anzahl - 1} / ${anzahl}`);
  });

  it("die aktuelle Frage ist im Band hervorgehoben, Markierung und Beschriftung wechseln", async () => {
    const n = nutzer();
    render(<Buehne />);
    await starte(n);
    expect(hat(nav()[0]!, "ring-2")).toBe(true);
    expect(hat(nav()[1]!, "ring-2")).toBe(false);
    expect(hat(nav()[0]!, "border-chart-4")).toBe(false);
    await n.click(screen.getByRole("button", { name: "Später prüfen" }));
    expect(nav()[0]!.getAttribute("data-markiert")).toBe("ja");
    expect(hat(nav()[0]!, "border-chart-4")).toBe(true);
    expect(screen.getByRole("button", { name: "Markierung entfernen" })).toBeTruthy();
    await n.click(screen.getByRole("button", { name: "Markierung entfernen" }));
    expect(nav()[0]!.getAttribute("data-markiert")).toBe("nein");
    expect(hat(nav()[0]!, "border-chart-4")).toBe(false);
    await n.click(nav()[1]!);
    expect(hat(nav()[0]!, "ring-2")).toBe(false);
    expect(hat(nav()[1]!, "ring-2")).toBe(true);
  });

  it("eine beantwortete Frage ist im Band getoent", async () => {
    const n = nutzer();
    render(<Buehne />);
    await starte(n);
    let i = 0;
    while (screen.queryAllByRole("radio").length === 0 && i < nav().length - 1) { i++; await n.click(nav()[i]!); }
    expect(hat(nav()[i]!, "bg-chart-1/20")).toBe(false);
    await n.click(screen.getAllByRole("radio")[0]!);
    expect(nav()[i]!.getAttribute("data-beantwortet")).toBe("ja");
    expect(hat(nav()[i]!, "bg-chart-1/20")).toBe(true);
    expect(hat(nav()[i === 0 ? 1 : 0]!, "bg-chart-1/20")).toBe(false);
  });

  it("Restzeit ab fuenf Minuten normal, darunter rot", async () => {
    legeStand({ simDauerMin: 5 });
    const n = nutzer(true);
    vi.useFakeTimers({ now: new Date(2026, 9, 17, 12, 0, 0), shouldAdvanceTime: true });
    render(<Buehne />);
    await starte(n);
    const uhr = () => screen.getByLabelText("Restzeit");
    expect(uhr().textContent).toBe("5:00");
    expect(hat(uhr(), "text-foreground")).toBe(true);
    expect(hat(uhr(), "text-destructive")).toBe(false);
    await vi.advanceTimersByTimeAsync(2500);
    expect(uhr().textContent).toMatch(/^4:5\d$/);
    expect(hat(uhr(), "text-destructive")).toBe(true);
    expect(hat(uhr(), "text-foreground")).toBe(false);
  });

  it("gibt genau bei 0:00 ab, eine Sekunde vorher noch nicht", async () => {
    legeStand({ simDauerMin: 1 });
    const n = nutzer();
    /* Nur Uhr und Takt gefaelscht (Simulation.tsx: Date.now + setInterval), ohne shouldAdvanceTime: sonst lief unter
       Last echte Zeit mit und "0:01" war schon "0:00" oder wurde uebersprungen (flackerte 18.10., gemessen).
       setTimeout bleibt echt – userEvent und React brauchen ihn (alles gefaelscht ohne Mitlauf: Zeitueberschreitung). */
    vi.useFakeTimers({ now: new Date(2026, 9, 17, 12, 0, 0), toFake: ["Date", "setInterval", "clearInterval"] });
    render(<Buehne />);
    await starte(n);
    await screen.findByLabelText("Restzeit");
    await vi.advanceTimersByTimeAsync(59000);
    expect(screen.getByLabelText("Restzeit").textContent).toBe("0:01");
    expect(screen.queryByText("Ergebnis je Aufgabe")).toBeNull();
    await vi.advanceTimersByTimeAsync(1000);
    expect(await screen.findByText("Ergebnis je Aufgabe")).toBeTruthy();
  });
});

describe("Auswertung (nichts beantwortet)", () => {
  async function gebeAb() {
    const n = nutzer();
    render(<Buehne />);
    await starte(n);
    const anzahl = nav().length;
    await n.click(screen.getByRole("button", { name: "Abgeben" }));
    return { n, anzahl };
  }

  it("Kennzahlen: 0 Punkte, 0 %, Note 6, nicht bestanden in Warnfarbe", async () => {
    const { anzahl } = await gebeAb();
    expect(screen.getByText(`0 / ${anzahl}`)).toBeTruthy();
    expect(screen.getByText("0 %")).toBeTruthy();
    expect(screen.getByText("Note 6")).toBeTruthy();
    const urteil = screen.getByText("Nicht bestanden");
    expect(hat(urteil, "text-destructive")).toBe(true);
    expect(hat(urteil, "text-chart-1")).toBe(false);
    expect(screen.getByText("bestanden ab 50 %")).toBeTruthy();
    expect(hat(screen.getByText("Note 6"), "text-destructive")).toBe(false);
  });

  it("je Aufgabe: 'richtig/gesamt', Punkte und ein leerer Balken (0 %)", async () => {
    await gebeAb();
    const zeilen = screen.getAllByText(/ richtig · /);
    expect(zeilen.length).toBeGreaterThan(0);
    for (const z of zeilen) {
      expect(z.textContent).toMatch(/^0\/\d+ richtig · 0 \/ \d+ Punkte \(0 %\)$/);
      const balken = z.parentElement!.querySelector(".bg-chart-1") as HTMLElement;
      expect(balken.style.width).toBe("0%");
    }
  });

  it("Ueberblick: jede Frage 'falsch' mit Nummer und Thema", async () => {
    const { anzahl } = await gebeAb();
    const punkte = [...document.querySelectorAll('[data-slot="accordion-trigger"]')] as HTMLElement[];
    expect(punkte).toHaveLength(anzahl);
    punkte.forEach((p, i) => {
      expect(p.textContent).toMatch(new RegExp(`^falschFrage ${i + 1} — `));
      expect(p.querySelector('[data-slot="badge"]')!.getAttribute("data-variant")).toBe("destructive");
    });
  });

  it("aufgeklappt: Fragetext und Erklaerung - oder der Ersatztext, wenn keine hinterlegt ist", async () => {
    /* Der echte Pool hat zu JEDER Frage eine Erklaerung; der Ersatzzweig braucht einen gebauten Bestand. */
    const mc = FRAGEN.filter((f) => f.typ === "mc" && typeof f.erklaerungKurz === "string" && f.erklaerungKurz);
    const pool = mc.map((f, i) => (i % 2 === 0 ? Object.assign({}, f, { erklaerungKurz: undefined }) : f)) as unknown as Frage[];
    /* Fester Zufall (Startwert 1): sonst zog die Pruefung mitunter nur Fragen MIT Erklaerung (flackerte 18.10.). */
    let z = 1;
    const zufall = vi.spyOn(Math, "random").mockImplementation(() => {
      z = (z + 0x6d2b79f5) | 0; let t = Math.imul(z ^ (z >>> 15), 1 | z);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    });
    onTestFinished(() => zufall.mockRestore());
    const n = nutzer();
    render(<Buehne pool={pool} />);
    await starte(n);
    await n.click(screen.getByRole("button", { name: "Abgeben" }));
    for (const t of [...document.querySelectorAll('[data-slot="accordion-trigger"]')]) await n.click(t);
    const inhalte = [...document.querySelectorAll('[data-slot="accordion-content"]')].filter((e) => (e.textContent ?? "").trim() !== "");
    const nachText = new Map(pool.map((f) => [f.frage as string, f]));
    let mitErkl = 0, ohneErkl = 0;
    for (const inh of inhalte) {
      const ps = inh.querySelectorAll("p");
      const f = nachText.get(ps[0]!.textContent!);
      if (!f) continue;                       // Fallaufgabe o. ae.: nicht aus dem gebauten Bestand
      if (f.erklaerungKurz) { mitErkl++; expect(ps[1]!.textContent).toBe(f.erklaerungKurz); }
      else { ohneErkl++; expect(ps[1]!.textContent).toBe("Zu dieser Frage ist keine Erklärung hinterlegt."); }
    }
    expect(mitErkl, "Frage mit Erklaerung vorhanden").toBeGreaterThan(0);
    expect(ohneErkl, "Frage ohne Erklaerung vorhanden").toBeGreaterThan(0);
  });

  it("'Zurück zum Start' fuehrt zum Startschirm mit Verlauf", async () => {
    const { n } = await gebeAb();
    await n.click(screen.getByRole("button", { name: "Zurück zum Start" }));
    expect(screen.getByRole("button", { name: "Prüfung starten" })).toBeTruthy();
    expect(screen.getByLabelText("Verlauf der Ergebnisse")).toBeTruthy();
  });
});
