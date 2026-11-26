// @vitest-environment jsdom
/* N47 (10.10.2026): Mischen der Anzeige und Loesung nach dem Pruefen – an den Fragen der
   Lerner-Meldungen 2–5 (M04-001 mc, M01-206 dropdown, M04-023 zuordnung, M01-486 bild/dropdown). */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAGEN } from "@/daten/laden";
import { eingabeFuer } from "./register";
import { neuerMischer } from "@/kern/anzeige";
import { MischKontext } from "./mischung";
import type { Frage } from "@/daten/typen";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function frage(id: string): Frage {
  const f = FRAGEN.find((x) => x.id === id);
  if (!f) throw new Error("fehlt: " + id);
  return f;
}

function zeichne(f: Frage, antwort: unknown, gesperrt: boolean, aufAntwort: (a: unknown) => void = () => {}) {
  const E = eingabeFuer(f)!;
  return createElement(E, { frage: f, antwort, gesperrt, aufAntwort });
}

function optionsTexte(): string[] {
  return screen.getAllByRole("radio").map((r) => r.getAttribute("aria-labelledby") ?? "")
    .map((id) => document.getElementById(id)?.textContent ?? "");
}

describe("mc (Meldung 3, M04-001)", () => {
  const f = frage("M04-001");
  const opts = "optionen" in f && Array.isArray(f.optionen) ? f.optionen : [];
  const loesung = "loesungIndex" in f && typeof f.loesungIndex === "number" ? f.loesungIndex : -1;

  it("steht nicht mehr in Pool-Reihenfolge, wenn der Zufall es so will", () => {
    /* Zufall immer 0 → Fisher-Yates tauscht jede Stelle mit der ersten: 1,2,3,0 statt 0,1,2,3. */
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(zeichne(f, undefined, false));
    expect(optionsTexte()).not.toEqual(opts);
    expect([...optionsTexte()].sort()).toEqual([...opts].sort());
  });

  it("liefert nach dem Mischen weiter den URSPRUNGS-Index", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    let a: unknown;
    render(zeichne(f, undefined, false, (x) => { a = x; }));
    await userEvent.click(screen.getByRole("radio", { name: opts[loesung] }));
    expect(a).toBe(loesung);
  });

  it("markiert nach dem Pruefen die richtige Option und die eigene falsche – Reihenfolge bleibt", () => {
    const m = neuerMischer();
    const falsch = loesung === 0 ? 1 : 0;
    const { rerender } = render(createElement(MischKontext.Provider, { value: m }, zeichne(f, falsch, false)));
    const vorher = optionsTexte();
    rerender(createElement(MischKontext.Provider, { value: m }, zeichne(f, falsch, true)));
    expect(optionsTexte()).toEqual(vorher);
    const richtigeKarte = document.querySelector('[data-urteil="richtig"]');
    const falscheKarte = document.querySelector('[data-urteil="falsch"]');
    expect(richtigeKarte?.textContent).toContain(opts[loesung]);
    expect(richtigeKarte?.textContent).toContain("richtig");
    expect(falscheKarte?.textContent).toContain(opts[falsch]);
  });

  it("markiert auch ohne Antwort (Aufgeben) die richtige Option", () => {
    render(zeichne(f, undefined, true));
    expect(document.querySelectorAll('[data-urteil="richtig"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-urteil="falsch"]')).toHaveLength(0);
  });
});

describe("dropdown mit Bild (Meldung 5, M01-486)", () => {
  it("zeigt nach falscher Antwort „Richtig wäre“ mit beiden Werten", () => {
    render(zeichne(frage("M01-486"), [0, 0], true));
    const k = document.querySelector('[data-teil="richtig-waere"]');
    expect(k?.textContent).toContain("Lücke 1: 20");
    expect(k?.textContent).toContain("Lücke 2: 24");
  });

  it("ordnet Zahlen-Listen aufsteigend statt sie zu mischen", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(zeichne(frage("M01-486"), undefined, false));
    const werte = [...screen.getByRole("combobox", { name: "Lücke 1" }).querySelectorAll("option")]
      .map((o) => o.textContent).filter((t) => t && !t.startsWith("—"));
    expect(werte).toEqual(["18", "19", "20", "22"]);
  });
});

describe("dropdown mit Text (Meldung 4, M01-206)", () => {
  it("mischt die Optionen, der Wert bleibt der Ursprungs-Index", () => {
    const f = frage("M01-206");
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(zeichne(f, undefined, false));
    const erste = "luecken" in f && Array.isArray(f.luecken) ? f.luecken[0] : undefined;
    const l0 = erste && !Array.isArray(erste) && typeof erste === "object" ? erste : null;
    const sel = screen.getAllByRole("combobox")[0]!;
    const angezeigt = [...sel.querySelectorAll("option")].filter((o) => o.value !== "");
    expect(angezeigt.map((o) => o.textContent)).not.toEqual(l0?.optionen);
    for (const o of angezeigt) expect(l0?.optionen[Number(o.value)]).toBe(o.textContent);
  });
});

describe("zuordnung (Meldung 2, M04-023)", () => {
  it("zeigt nach dem Pruefen die richtige Zuordnung je Aussage", () => {
    const f = frage("M04-023");
    render(zeichne(f, {}, true));
    const k = document.querySelector('[data-teil="richtig-waere"]');
    const paare = "paare" in f && Array.isArray(f.paare) ? f.paare : [];
    for (const p of paare) {
      if (Array.isArray(p)) expect(k?.textContent).toContain(`${p[0]} → ${p[1]}`);
    }
  });
});

/* N48 P1 (10.10.2026): die Messung `messung/rundlauf.messung.tsx` fand vier Typen ohne Loesung in der
   gesperrten Eingabe (fehlersuche 28, hotspot 39, mtf 14, reihenfolge 25). Je ein Vertreter: */
describe("Loesung nach dem Pruefen auch bei fehlersuche, hotspot, mtf, reihenfolge (N48 P1)", () => {
  for (const typ of ["fehlersuche", "hotspot", "mtf", "reihenfolge"] as const) {
    it(typ, () => {
      const f = FRAGEN.find((x) => x.typ === typ)!;
      render(zeichne(f, undefined, true));
      const da = document.querySelector('[data-urteil="richtig"], [data-teil="richtig-waere"]')
        ?? (typ === "mtf" ? [...document.querySelectorAll("span")].find((e) => e.textContent?.startsWith("richtig:")) : null);
      expect(da).toBeTruthy();
    });
  }
});
