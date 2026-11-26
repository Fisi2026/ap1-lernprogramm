import { describe, expect, it } from "vitest";

import { da, unerreichbar } from "./da.ts";

describe("da (N38 Q1)", () => {
  it("gibt einen vorhandenen Wert unveraendert zurueck – auch falsy", () => {
    const o = { a: 1 };
    expect(da(o, "o")).toBe(o);
    expect(da(0, "null")).toBe(0);
    expect(da("", "leer")).toBe("");
    expect(da(null, "null")).toBeNull();
    expect(da(false, "falsch")).toBe(false);
  });
  it("wirft bei undefined laut, mit dem Namen der Stelle", () => {
    expect(() => da(undefined, "Netzplan-Vorgang X")).toThrow("[kern] fehlt: Netzplan-Vorgang X");
  });
  it("unerreichbar wirft laut mit Stelle und Wert (Daten am Typ vorbei)", () => {
    expect(() => unerreichbar("x" as never, "grade")).toThrow(new Error("[kern] unerwartet in grade: x"));
    expect(() => unerreichbar(undefined as never, "switch")).toThrow(new Error("[kern] unerwartet in switch: undefined"));
  });
});
