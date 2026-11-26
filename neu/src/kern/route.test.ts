/* N22: Adressen — dasselbe Format wie die alte App (app_ui.js hashLesen/hashSchreiben). */
import { describe, it, expect } from "vitest";
import { BEREICHE, lies, schreibe, gleich, START } from "./route";

describe("lies", () => {
  it("leer und unbekannt: Startseite", () => {
    for (const h of ["", "#", null, undefined, "#quatsch", "#frage", "#frage=", "#frage=  ", "#%E0%A4%A"]) {
      expect(lies(h), String(h)).toEqual(START);
    }
  });
  it("jeder Bereich hin und zurück", () => {
    for (const b of BEREICHE) {
      const r = b === "frage" ? { bereich: b, frageId: "M03-907" } : { bereich: b, frageId: null };
      expect(lies(schreibe(r)), b).toEqual(r);
    }
  });
  it("Kennung wird ent- und verschlüsselt, auch mit = und Leerzeichen", () => {
    expect(lies("#frage=M03-907")).toEqual({ bereich: "frage", frageId: "M03-907" });
    expect(lies("frage=M03-907")).toEqual({ bereich: "frage", frageId: "M03-907" });
    const r = { bereich: "frage" as const, frageId: "A B=C/ä" };
    expect(schreibe(r)).toBe("#frage=A%20B%3DC%2F%C3%A4");
    expect(lies(schreibe(r))).toEqual(r);
    expect(lies("#frage=a=b")).toEqual({ bereich: "frage", frageId: "a=b" });
  });
  it("die Adressen der alten App tragen", () => {
    for (const b of ["ueben", "fd", "markiert", "gen", "netzplan", "gantt", "sim", "glossar", "spickzettel", "serie", "stat", "einst"]) {
      expect(lies("#" + b).bereich).toBe(b);
    }
  });
});

describe("schreibe / gleich", () => {
  it("frage ohne Kennung wird zur Startseite", () => {
    expect(schreibe({ bereich: "frage", frageId: null })).toBe("#start");
  });
  it("gleich vergleicht Bereich und Kennung", () => {
    expect(gleich({ bereich: "frage", frageId: "X" }, { bereich: "frage", frageId: "X" })).toBe(true);
    expect(gleich({ bereich: "frage", frageId: "X" }, { bereich: "frage", frageId: "Y" })).toBe(false);
    expect(gleich({ bereich: "stat", frageId: null }, START)).toBe(false);
  });
});
