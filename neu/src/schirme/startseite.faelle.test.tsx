// @vitest-environment jsdom
/* Die Startseite allein (Prop `jetzt` fest, Stand ueber den echten Speicher): Kacheln, Stand-Zeile,
   Aktivitaetsbalken, Quote je Gebiet, Pool-Zeile und der gemerkte Klappzustand "Dein Stand".
   Die Verdrahtung in der App (Adresse, Kachelklick) pruefen startseite.jsdom.test.tsx. */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Startseite } from "./Startseite";
import { useLernstand } from "@/huelle/useLernstand";
import { FRAGEN } from "@/daten/laden";
import { LS_SCHLUESSEL, leererStand } from "@/kern/stand";
import { dayKey } from "@/kern/lernen";
import { kacheln, quoteJeGebiet, poolZahlen } from "@/kern/startseite";
import type { Lernstand } from "@/kern/stand";

const JETZT = new Date(2026, 9, 17, 12, 0, 0).getTime();
const TAG = 86400000;
const legeStand = (extra: Record<string, unknown> = {}) =>
  localStorage.setItem(LS_SCHLUESSEL, JSON.stringify({ ...leererStand(), ...extra }));
const gespeichert = () => JSON.parse(localStorage.getItem(LS_SCHLUESSEL) ?? "{}") as Record<string, any>;

const KEIN_SCHRITT = () => {};
function Buehne({ poolDa, geheZu = KEIN_SCHRITT }: { poolDa?: boolean; geheZu?: (b: any) => void }) {
  const lernstand = useLernstand();
  return poolDa === undefined
    ? <Startseite lernstand={lernstand} geheZu={geheZu} jetzt={() => JETZT} />
    : <Startseite lernstand={lernstand} geheZu={geheZu} jetzt={() => JETZT} poolDa={poolDa} />;
}
const nutzer = () => userEvent.setup({ delay: null });
const mehr = async (n: ReturnType<typeof nutzer>) => n.click(screen.getByText("Mehr Statistik anzeigen"));
const stat = () => document.querySelector('[data-teil="stand-zeile"]') as HTMLElement;

beforeEach(() => { localStorage.clear(); legeStand(); });
afterEach(cleanup);

describe("Kacheln", () => {
  it("jede Kachel der Rechnung steht da, mit Titel, Untertitel, Badge; ein Klick meldet ihr Ziel", async () => {
    const n = nutzer();
    legeStand({ fehlerDeck: { [FRAGEN[0]!.id]: { streak: 0, due: JETZT - 1000 } } });
    const geheZu = vi.fn();
    render(<Buehne geheZu={geheZu} />);
    const erwartet = kacheln(JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!) as Lernstand, FRAGEN, JETZT);
    expect(erwartet.some((k) => k.badge), "Ausgangslage: mindestens eine Kachel mit Badge").toBe(true);
    for (const k of erwartet) {
      const knopf = document.querySelector(`[data-ziel="${k.ziel}"]`) as HTMLElement;
      expect(knopf, k.ziel).not.toBeNull();
      expect(within(knopf).getByText(k.titel)).toBeTruthy();
      expect(within(knopf).getByText(k.sub)).toBeTruthy();
      if (k.badge) expect(within(knopf).getByText(k.badge)).toBeTruthy();
      else expect(knopf.querySelector('[data-slot="badge"]')).toBeNull();
    }
    const erste = erwartet[0]!;
    await n.click(document.querySelector(`[data-ziel="${erste.ziel}"]`)!);
    expect(geheZu).toHaveBeenCalledWith(erste.ziel);
  });

  it("die Hauptkachel ist doppelt breit und gefuellt, die anderen nicht; ihr Badge ist 'secondary', sonst 'default'", () => {
    legeStand({ fehlerDeck: { [FRAGEN[0]!.id]: { streak: 0, due: JETZT - 1000 } }, markiert: { [FRAGEN[1]!.id]: true } });
    render(<Buehne />);
    const liste = kacheln(JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!) as Lernstand, FRAGEN, JETZT);
    const hero = liste.filter((k) => k.hero);
    const normal = liste.filter((k) => !k.hero);
    expect(hero.length).toBeGreaterThan(0);
    expect(normal.length).toBeGreaterThan(0);
    for (const k of hero) {
      const e = document.querySelector(`[data-ziel="${k.ziel}"]`) as HTMLElement;
      expect(e.classList.contains("sm:col-span-2")).toBe(true);
      expect(e.classList.contains("bg-primary")).toBe(true);
      const b = e.querySelector('[data-slot="badge"]');
      if (b) expect(b.getAttribute("data-variant")).toBe("secondary");
    }
    for (const k of normal) {
      const e = document.querySelector(`[data-ziel="${k.ziel}"]`) as HTMLElement;
      expect(e.classList.contains("sm:col-span-2")).toBe(false);
      expect(e.classList.contains("bg-primary")).toBe(false);
      const b = e.querySelector('[data-slot="badge"]');
      if (b) expect(b.getAttribute("data-variant")).toBe("default");
    }
  });
});

describe("Stand-Zeile", () => {
  it("ohne Daten: Hinweis statt Bereitschaft, Heute 0/Ziel, Fehler-Deck 0, weder Trefferquote noch Simulation", () => {
    render(<Buehne />);
    expect(screen.getByText("Bereitschaft: noch keine Daten – leg los.")).toBeTruthy();
    expect(stat().textContent).toContain("Heute 0/");
    expect(stat().textContent).toContain("Fehler-Deck fällig 0");
    expect(stat().textContent).not.toContain("Trefferquote");
    expect(stat().textContent).not.toContain("Letzte Simulation");
  });

  it.each([
    [10, 10, "bg-chart-1"],
    [7, 10, "bg-chart-4"],
    [1, 10, "bg-destructive"],
  ])("Bereitschaft aus %i/%i richtig: Punkt in Ampelfarbe %s, Prozentzahl, Trefferquote und letzte Simulation", (r, g, farbe) => {
    legeStand({
      statistik: { M01: { richtig: r, gesamt: g }, "T:M01:Netzplan & Puffer": { richtig: r, gesamt: g } },
      simHistorie: [{ prozent: 40 }, { prozent: 66 }],
      dailyCounts: { [dayKey(JETZT)]: 4 },
    });
    render(<Buehne />);
    const punkt = stat().querySelector("i")!;
    expect(punkt.classList.contains(farbe)).toBe(true);
    expect(stat().textContent).toContain("Heute 4/");
    expect(stat().textContent).toContain(`Trefferquote ${Math.round((r / g) * 100)} %`);
    expect(stat().textContent).toContain("Letzte Simulation 66 %");
    expect(screen.queryByText(/noch keine Daten/)).toBeNull();
  });

  it("zaehlt faellige Karten im Fehler-Deck", () => {
    legeStand({ fehlerDeck: {
      [FRAGEN[0]!.id]: { streak: 0, due: JETZT - 1000 }, [FRAGEN[1]!.id]: { streak: 0, due: JETZT - 5000 },
      [FRAGEN[2]!.id]: { streak: 0, due: JETZT + TAG },
    } });
    render(<Buehne />);
    expect(stat().textContent).toContain("Fehler-Deck fällig 2");
  });
});

describe("Mehr Statistik", () => {
  it("ist zugeklappt, bis man sie oeffnet", async () => {
    const n = nutzer();
    render(<Buehne />);
    expect(screen.queryByText("Trefferquote je Gebiet")).toBeNull();
    await mehr(n);
    expect(screen.getByText("Trefferquote je Gebiet")).toBeTruthy();
    expect(screen.getByText("Aktivität (letzte 14 Tage)")).toBeTruthy();
  });

  it("14 Balken, aeltester zuerst, beschriftet mit deutschem Datum und Anzahl; Hoehe im Verhaeltnis zum Maximum, mindestens 3 px", async () => {
    const n = nutzer();
    legeStand({ dailyCounts: { [dayKey(JETZT)]: 10, [dayKey(JETZT - TAG)]: 5, [dayKey(JETZT - 2 * TAG)]: 1 } });
    render(<Buehne />);
    await mehr(n);
    const balken = [...document.querySelectorAll('[data-teil="aktivitaet"] > div')] as HTMLElement[];
    expect(balken).toHaveLength(14);
    expect(balken.map((b) => b.title).slice(-3)).toEqual([
      "15.10.2026: 1 Fragen", "16.10.2026: 5 Fragen", "17.10.2026: 10 Fragen",
    ]);
    expect(balken[0]!.title).toBe("04.10.2026: 0 Fragen");
    expect(balken.map((b) => b.style.height).slice(-4)).toEqual(["3px", "5px", "27px", "54px"]);
  });

  it("ohne jede Aktivitaet sind alle Balken 3 px hoch", async () => {
    const n = nutzer();
    render(<Buehne />);
    await mehr(n);
    const hoehen = [...document.querySelectorAll('[data-teil="aktivitaet"] > div')].map((b) => (b as HTMLElement).style.height);
    expect(new Set(hoehen)).toEqual(new Set(["3px"]));
  });

  it("Quote je Gebiet: 'richtig/gesamt' und Balken, wo geantwortet wurde, sonst 'noch offen' ohne Balken", async () => {
    const n = nutzer();
    legeStand({ statistik: { M01: { richtig: 3, gesamt: 4 }, "T:M01:Netzplan & Puffer": { richtig: 3, gesamt: 4 } } });
    render(<Buehne />);
    await mehr(n);
    const erwartet = quoteJeGebiet(JSON.parse(localStorage.getItem(LS_SCHLUESSEL)!) as Lernstand);
    expect(erwartet.some((g) => g.quote !== null) && erwartet.some((g) => g.quote === null), "Ausgangslage").toBe(true);
    for (const g of erwartet) {
      const zeile = screen.getByTitle(g.name).parentElement!;
      const zellen = zeile.children;
      expect(zellen[1]!.textContent).toBe(g.gesamt ? `${g.richtig}/${g.gesamt}` : "noch offen");
      const balken = zellen[2]!.querySelector('[data-slot="progress-indicator"]') as HTMLElement | null;
      if (g.quote === null) expect(balken).toBeNull();
      else expect(balken!.style.transform).toBe(`translateX(-${100 - g.quote}%)`);
    }
  });

  it("Pool-Zeile: Zahlen aus dem Bestand; mit poolDa=false fehlt sie", async () => {
    const n = nutzer();
    const p = poolZahlen(FRAGEN);
    render(<Buehne />);
    await mehr(n);
    expect(screen.getByText(`Pool: ${p.gesamt} Fragen (${p.ap1} AP1 · ${p.ap2} AP2-Zusatz)`)).toBeTruthy();
    cleanup();
    render(<Buehne poolDa={false} />);
    await mehr(n);
    expect(screen.queryByText(/^Pool:/)).toBeNull();
  });
});

describe("'Dein Stand' klappt und merkt es", () => {
  it("startet offen; Zuklappen speichert nur die Abweichung (false), Aufklappen loescht sie wieder, andere Panels bleiben", async () => {
    const n = nutzer();
    legeStand({ panelOffen: { rechner: true } });
    render(<Buehne />);
    expect(stat()).toBeTruthy();
    await n.click(screen.getByText("Dein Stand"));
    expect(gespeichert().panelOffen).toEqual({ rechner: true, "stat-start": false });
    expect(document.querySelector('[data-teil="stand-zeile"]')).toBeNull();
    await n.click(screen.getByText("Dein Stand"));
    expect(gespeichert().panelOffen).toEqual({ rechner: true });
    expect(stat()).toBeTruthy();
  });

  it("ein gemerktes 'zu' wird beim Laden beachtet", () => {
    legeStand({ panelOffen: { "stat-start": false } });
    render(<Buehne />);
    expect(document.querySelector('[data-teil="stand-zeile"]')).toBeNull();
  });

  it("Zuklappen ohne bisherige Panel-Liste legt sie an", async () => {
    const n = nutzer();
    const roh = { ...leererStand() } as Record<string, unknown>;
    delete roh.panelOffen;
    localStorage.setItem(LS_SCHLUESSEL, JSON.stringify(roh));
    render(<Buehne />);
    await n.click(screen.getByText("Dein Stand"));
    expect(gespeichert().panelOffen).toEqual({ "stat-start": false });
  });
});
