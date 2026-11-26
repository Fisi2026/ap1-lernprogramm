/* N43 M3 Rest (17.10.2026): gebaute Grenzfaelle fuer `freitext.ts`, die die Gleichheit gegen `app_util.js`
   (`freitext.gleichheit.test.ts`) nicht trifft – je Fall die Regel, die er festhaelt. */
import { describe, expect, it } from "vitest";

import { autoCheckText, gradeTeilpunkte, normFreitext } from "./freitext.ts";

describe("normFreitext", () => {
  it("null und undefined werden zum leeren Text", () => {
    expect(normFreitext(undefined)).toBe("");
    expect(normFreitext(null)).toBe("");
  });
});

describe("gradeTeilpunkte – Grenzfaelle", () => {
  it("ein Begriff, der normalisiert leer ist, trifft nie", () => {
    const b = gradeTeilpunkte("irgendwas langes ???", { schluesselbegriffe: { pflicht: ["???"], kuer: ["irgendwas"] } });
    expect(b.pflichtTreffer).toBe(0);
    expect(b.fehlendPflicht).toEqual(["???"]);
    expect(b.stufe).toBe("unvollständig");
  });
  it("pflicht ohne Liste zaehlt als keine Pflicht", () => {
    const b = gradeTeilpunkte("irgendwas langes", { schluesselbegriffe: { pflicht: "x" as never, kuer: ["irgendwas"] } });
    expect(b.pflichtGesamt).toBe(0);
    expect(b.prozent).toBe(100);
    expect(b.stufe).toBe("richtig");
  });
  it("Token-Fallback: ein Bestandteil trifft ueber seine Synonym-Gruppe", () => {
    const sb = { pflicht: ["paketfilter konfigurieren"] };
    expect(gradeTeilpunkte("die firewall konfigurieren", { schluesselbegriffe: sb }).pflichtTreffer).toBe(1);
    expect(gradeTeilpunkte("die firewall einschalten", { schluesselbegriffe: sb }).pflichtTreffer).toBe(0);
  });
});

describe("autoCheckText – Zahlen in der Musterloesung", () => {
  it("nur reine Ziffernfolgen ab 2 Zeichen sind Zahl-Begriffe, gemischte Kurz-Tokens nicht", () => {
    const b = autoCheckText("egal", "4k k4 77");
    expect(b.anzahl).toBe(1);
    expect(b.fehlend).toEqual(["77"]);
  });
});
