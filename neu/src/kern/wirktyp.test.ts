/* N43 M3 Rest (17.10.2026): `wirkTyp` loest bild-Fragen auf ihren unterTyp auf – je Zweig ein Fall. */
import { describe, expect, it } from "vitest";

import type { SimKarte } from "@/daten/typen";
import { wirkTyp } from "./wirktyp.ts";

const karte = (k: Record<string, unknown>): SimKarte => k as unknown as SimKarte;

describe("wirkTyp", () => {
  it("andere Typen bleiben, wie sie sind – auch mit unterTyp", () => {
    expect(wirkTyp(karte({ typ: "mc" }))).toBe("mc");
    expect(wirkTyp(karte({ typ: "zuordnung", unterTyp: "lueckentext" }))).toBe("zuordnung");
  });
  it("bild nimmt den unterTyp", () => {
    expect(wirkTyp(karte({ typ: "bild", unterTyp: "lueckentext" }))).toBe("lueckentext");
  });
  it("bild ohne unterTyp oder mit unterTyp, der kein Text ist, wird mc", () => {
    expect(wirkTyp(karte({ typ: "bild" }))).toBe("mc");
    expect(wirkTyp(karte({ typ: "bild", unterTyp: 3 }))).toBe("mc");
  });
  it("bild mit unterTyp bild wird mc, nicht bild", () => {
    expect(wirkTyp(karte({ typ: "bild", unterTyp: "bild" }))).toBe("mc");
  });
});
