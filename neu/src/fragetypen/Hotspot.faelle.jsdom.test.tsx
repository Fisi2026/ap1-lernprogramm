// @ts-nocheck
// @vitest-environment jsdom
/* hotspot: die Zeichnung ist die Antwortfläche. Geprüft wird, was der Lerner sieht und was an aufAntwort geht. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hotspot } from "./Hotspot";

afterEach(cleanup);

const SVG = '<svg viewBox="0 0 200 100"><circle cx="5" cy="5" r="4"/></svg>';
const ZONEN = [
  { x: 0, y: 0, w: 48, h: 24, label: "Alpha", richtig: true },
  { x: 50, y: 50, w: 100, h: 48, label: "Beta" },
  { x: 60, y: 10, w: 30, h: 30 },
];
const frage = (extra = {}) => ({ id: "T-HS", typ: "hotspot", svg: SVG, zonen: ZONEN, ...extra });

function zeige(props = {}) {
  const aufAntwort = vi.fn();
  const r = render(<Hotspot frage={frage()} antwort={undefined} aufAntwort={aufAntwort} gesperrt={false} {...props} />);
  return { aufAntwort, ...r };
}
const gruppe = () => screen.getByRole("group", { name: "Anklickbare Bereiche" });

describe("Hotspot – Bedienung", () => {
  it("jede Zone ist ein Schalter mit ihrem Namen; ohne Namen heißt sie Zone n", () => {
    zeige();
    expect(screen.getByRole("button", { name: "Alpha" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Beta" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Zone 3" })).toBeTruthy();
  });

  it("ein Klick meldet den Index der Zone", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().click(screen.getByRole("button", { name: "Beta" }));
    expect(aufAntwort).toHaveBeenCalledTimes(1);
    expect(aufAntwort).toHaveBeenCalledWith(1);
  });

  it("Enter und Leertaste wählen, andere Tasten nicht", () => {
    const { aufAntwort } = zeige();
    const zone = screen.getByRole("button", { name: "Alpha" });
    fireEvent.keyDown(zone, { key: "Enter" });
    fireEvent.keyDown(zone, { key: " " });
    expect(aufAntwort.mock.calls).toEqual([[0], [0]]);
    fireEvent.keyDown(zone, { key: "a" });
    fireEvent.keyDown(zone, { key: "Tab" });
    expect(aufAntwort).toHaveBeenCalledTimes(2);
  });

  it("die Tastenwahl hält das Standardverhalten an (kein Scrollen bei Leertaste)", () => {
    zeige();
    const zone = screen.getByRole("button", { name: "Alpha" });
    expect(fireEvent.keyDown(zone, { key: " " })).toBe(false);
    expect(fireEvent.keyDown(zone, { key: "Enter" })).toBe(false);
    expect(fireEvent.keyDown(zone, { key: "x" })).toBe(true);
  });

  it("Zonen sind per Tastatur erreichbar", () => {
    zeige();
    expect(screen.getByRole("button", { name: "Alpha" }).getAttribute("tabindex")).toBe("0");
  });

  it("nach dem Prüfen wählt weder Klick noch Taste, und die Zonen sind aus der Tab-Folge", async () => {
    const { aufAntwort } = zeige({ gesperrt: true });
    const zone = screen.getByRole("button", { name: "Beta" });
    await userEvent.setup().click(zone);
    fireEvent.keyDown(zone, { key: "Enter" });
    fireEvent.keyDown(zone, { key: " " });
    expect(aufAntwort).not.toHaveBeenCalled();
    expect(zone.getAttribute("tabindex")).toBe("-1");
  });
});

describe("Hotspot – Anzeige der Wahl", () => {
  it("ohne Wahl keine Zeile „Gewählt“, keine Zone gedrückt", () => {
    zeige();
    expect(screen.queryByText(/Gewählt/)).toBeNull();
    for (const z of screen.getAllByRole("button", { name: /Alpha|Beta|Zone 3/ })) {
      expect(z.getAttribute("aria-pressed")).toBe("false");
    }
  });

  it("eine Antwort, die keine Zahl ist, gilt als keine Wahl", () => {
    zeige({ antwort: "1" });
    expect(screen.queryByText(/Gewählt/)).toBeNull();
  });

  it("die gewählte Zone ist gedrückt und steht mit Namen da", () => {
    zeige({ antwort: 1 });
    expect(screen.getByRole("button", { name: "Beta" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Alpha" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText("Gewählt:").textContent).toContain("Beta");
  });

  it("Index 0 ist eine gültige Wahl", () => {
    zeige({ antwort: 0 });
    expect(screen.getByText("Gewählt:").textContent).toContain("Alpha");
  });

  it("eine Zone ohne Namen wird als Zone n+1 genannt", () => {
    zeige({ antwort: 2 });
    expect(screen.getByText("Gewählt:").textContent).toContain("Zone 3");
  });

  it("die Wahl ist an Rand und Füllung zu sehen", () => {
    zeige({ antwort: 1 });
    const gewaehlt = screen.getByRole("button", { name: "Beta" });
    const andere = screen.getByRole("button", { name: "Alpha" });
    expect(gewaehlt.getAttribute("fill")).toBe("rgba(20,20,20,0.16)");
    expect(andere.getAttribute("fill")).toBe("rgba(20,20,20,0.04)");
    expect(gewaehlt.getAttribute("stroke-width")).toBe("2.5");
    expect(andere.getAttribute("stroke-width")).toBe("1.5");
    expect(gewaehlt.getAttribute("stroke-dasharray")).toBeNull();
    expect(andere.getAttribute("stroke-dasharray")).toBe("4 3");
    expect(andere.getAttribute("stroke")).toBe("#2A2F39");
  });
});

describe("Hotspot – nach dem Prüfen", () => {
  it("die richtige Zone ist grün, die falsch gewählte rot, die übrigen bleiben neutral", () => {
    zeige({ antwort: 1, gesperrt: true });
    const richtig = screen.getByRole("button", { name: "Alpha" });
    const falsch = screen.getByRole("button", { name: "Beta" });
    const rest = screen.getByRole("button", { name: "Zone 3" });
    expect(richtig.getAttribute("data-urteil")).toBe("richtig");
    expect(falsch.getAttribute("data-urteil")).toBe("falsch");
    expect(rest.getAttribute("data-urteil")).toBeNull();
    expect(richtig.getAttribute("fill")).toBe("rgba(20,160,90,0.22)");
    expect(richtig.getAttribute("stroke")).toBe("#137a4a");
    expect(richtig.getAttribute("stroke-width")).toBe("2.5");
    expect(richtig.getAttribute("stroke-dasharray")).toBeNull();
    expect(falsch.getAttribute("fill")).toBe("rgba(200,40,40,0.18)");
    expect(falsch.getAttribute("stroke")).toBe("#b42318");
    expect(rest.getAttribute("fill")).toBe("rgba(20,20,20,0.04)");
    expect(rest.getAttribute("stroke")).toBe("#2A2F39");
  });

  it("wer die richtige Zone gewählt hat, sieht sie grün und nirgends rot", () => {
    zeige({ antwort: 0, gesperrt: true });
    expect(screen.getByRole("button", { name: "Alpha" }).getAttribute("data-urteil")).toBe("richtig");
    expect(screen.getByRole("button", { name: "Beta" }).getAttribute("data-urteil")).toBeNull();
  });

  it("ohne Wahl wird nichts rot, die richtige Zone ist trotzdem markiert", () => {
    zeige({ gesperrt: true });
    expect(screen.getByRole("button", { name: "Alpha" }).getAttribute("data-urteil")).toBe("richtig");
    expect(screen.getByRole("button", { name: "Beta" }).getAttribute("data-urteil")).toBeNull();
  });

  it("vor dem Prüfen verrät nichts die Lösung", () => {
    zeige({ antwort: 1 });
    expect(screen.queryByText("Richtig wäre")).toBeNull();
    expect(screen.getByRole("button", { name: "Alpha" }).getAttribute("data-urteil")).toBeNull();
    expect(screen.getByRole("button", { name: "Beta" }).getAttribute("data-urteil")).toBeNull();
  });

  it("der Kasten „Richtig wäre“ nennt nur die richtigen Zonen", () => {
    zeige({ gesperrt: true });
    expect(screen.getByText("Richtig wäre")).toBeTruthy();
    expect(screen.getByText("Alpha (in der Zeichnung hervorgehoben)")).toBeTruthy();
    expect(screen.queryByText(/Beta \(/)).toBeNull();
  });

  it("eine richtige Zone ohne Namen heißt dort Zone n+1", () => {
    const f = frage({ zonen: [{ x: 0, y: 0, w: 30, h: 30 }, { x: 40, y: 0, w: 30, h: 30, richtig: true }] });
    render(<Hotspot frage={f} antwort={undefined} aufAntwort={() => {}} gesperrt />);
    expect(screen.getByText("Zone 2 (in der Zeichnung hervorgehoben)")).toBeTruthy();
  });

  it("nur ein ausdrückliches richtig: true zählt", () => {
    const f = frage({ zonen: [{ x: 0, y: 0, w: 30, h: 30, label: "A", richtig: "ja" }] });
    render(<Hotspot frage={f} antwort={undefined} aufAntwort={() => {}} gesperrt />);
    expect(screen.queryByText(/hervorgehoben/)).toBeNull();
    expect(screen.getByRole("button", { name: "A" }).getAttribute("data-urteil")).toBeNull();
  });
});

describe("Hotspot – Zeichnung und Maße", () => {
  it("die Zeichnung steht als Bild mit Beschriftung da, die Zonen liegen darüber", () => {
    zeige();
    const bild = screen.getByRole("img", { name: "Zeichnung zur Frage T-HS" });
    expect(bild.querySelector("circle")).not.toBeNull();
    expect(gruppe().getAttribute("viewBox")).toBe("0 0 200 100");
  });

  it("die übergebene Bildbeschriftung ersetzt die Vorgabe", () => {
    zeige({ bildtext: "Netzplan" });
    expect(screen.getByRole("img", { name: "Netzplan" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Netzplan vergrößern" })).toBeTruthy();
  });

  it("die Zonen tragen Lage und Größe aus der Frage", () => {
    zeige();
    const z = screen.getByRole("button", { name: "Beta" });
    expect([z.getAttribute("x"), z.getAttribute("y"), z.getAttribute("width"), z.getAttribute("height")])
      .toEqual(["50", "50", "100", "48"]);
  });

  it("ohne viewBox im SVG gilt 320 × 185", () => {
    render(<Hotspot frage={frage({ svg: "<svg><rect/></svg>" })} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    expect(gruppe().getAttribute("viewBox")).toBe("0 0 320 185");
  });

  it("die viewBox wird auch in einfachen Anführungszeichen und mit Leerraum um das Gleichheitszeichen erkannt", () => {
    render(<Hotspot frage={frage({ svg: "<svg viewBox = '0 0 640 100'></svg>" })} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    expect(gruppe().getAttribute("viewBox")).toBe("0 0 640 100");
  });

  it("ohne SVG-Text bleibt die Fläche leer und die Zonen liegen auf der Vorgabe", () => {
    render(<Hotspot frage={frage({ svg: undefined })} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    expect(gruppe().getAttribute("viewBox")).toBe("0 0 320 185");
  });

  it("die Zeichnung ist so breit, dass die kleinste Zonenseite 24 px misst", () => {
    zeige();
    // kleinste Seite 24 (Alpha h), viewBox 200 breit -> 200 * 24 / 24
    expect(gruppe().parentElement!.style.minWidth).toBe("200px");
  });

  it("eine kleinere Zone verbreitert die Zeichnung, aufgerundet", () => {
    const f = frage({ zonen: [{ x: 0, y: 0, w: 7, h: 20, label: "klein" }, { x: 20, y: 0, w: 50, h: 50 }] });
    render(<Hotspot frage={f} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    // 200 * 24 / 7 = 685,7 -> 686
    expect(gruppe().parentElement!.style.minWidth).toBe("686px");
  });

  it("Zonen mit Breite 0 zählen für die kleinste Seite nicht", () => {
    const f = frage({ zonen: [{ x: 0, y: 0, w: 0, h: 5 }, { x: 20, y: 0, w: 50, h: 50 }] });
    render(<Hotspot frage={f} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    // kleinste positive Seite: 50 -> 200 * 24 / 50 = 96
    expect(gruppe().parentElement!.style.minWidth).toBe("96px");
  });

  it("ohne Zonen gibt es keine Mindestbreite", () => {
    render(<Hotspot frage={frage({ zonen: [] })} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    expect(gruppe().parentElement!.style.minWidth).toBe("");
  });

  it("die Breite der viewBox darf durch Komma getrennt sein; eine unlesbare Breite fällt auf 320 zurück", () => {
    const a = frage({ svg: '<svg viewBox="0,0,100,50"></svg>', zonen: [{ x: 0, y: 0, w: 24, h: 24 }] });
    const { unmount } = render(<Hotspot frage={a} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    expect(gruppe().parentElement!.style.minWidth).toBe("100px");
    unmount();
    const b = frage({ svg: '<svg viewBox="0 0 x 50"></svg>', zonen: [{ x: 0, y: 0, w: 24, h: 24 }] });
    render(<Hotspot frage={b} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    expect(gruppe().parentElement!.style.minWidth).toBe("320px");
  });

  it("zonen, die keine Liste sind, ergeben keine Schalter", () => {
    render(<Hotspot frage={frage({ zonen: "kaputt" })} antwort={undefined} aufAntwort={() => {}} gesperrt={false} />);
    expect(screen.queryAllByRole("button", { name: /Zone/ })).toHaveLength(0);
  });

  it("die Anleitung steht über der Zeichnung", () => {
    zeige();
    expect(screen.getByText("Klick die richtige Stelle in der Zeichnung an.")).toBeTruthy();
  });

  it("die Lupe vergrößert, ohne eine Zone zu wählen", async () => {
    const { aufAntwort } = zeige();
    await userEvent.setup().click(screen.getByRole("button", { name: "Zeichnung zur Frage T-HS vergrößern" }));
    expect(aufAntwort).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
});
