/* AUD-C8: die eine Trusted-Types-Politik – was sie durchlaesst und was nicht. */
import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

function mitTrustedTypes() {
  const angelegt: string[] = [];
  vi.stubGlobal("location", { href: "https://app.example/#ueben", origin: "https://app.example" });
  vi.stubGlobal("trustedTypes", {
    createPolicy: (name: string, r: { createHTML(s: string): string; createScriptURL(s: string): string }) => {
      angelegt.push(name);
      return { createHTML: (s: string) => ({ html: r.createHTML(s) }), createScriptURL: (s: string) => ({ url: r.createScriptURL(s) }) };
    },
  });
  return angelegt;
}

describe("Trusted Types", () => {
  it("ohne Trusted Types (jsdom, ältere Browser): einfacher Text", async () => {
    const v = await import("./vertrauen");
    expect(v.svgInhalt("<svg/>")).toEqual({ __html: "<svg/>" });
    expect(v.swAdresse("/app-sw.js")).toBe("/app-sw.js");
  });
  it("mit Trusted Types: GENAU EINE Politik „ap1“, SVG geht durch sie", async () => {
    const angelegt = mitTrustedTypes();
    const v = await import("./vertrauen");
    // oxlint-disable-next-line eslint/no-underscore-dangle -- `__html` ist der feste React-Name (dangerouslySetInnerHTML), nicht umbenennbar
    expect(v.svgInhalt("<svg/>").__html).toEqual({ html: "<svg/>" });
    v.svgInhalt("<svg/>");
    v.swAdresse("/app-sw.js");
    expect(angelegt).toEqual([v.POLITIK]);
  });
  it("⛔ als Skript-Adresse NUR der eigene Service Worker", async () => {
    mitTrustedTypes();
    const v = await import("./vertrauen");
    expect(v.swAdresse("/app-sw.js")).toEqual({ url: "/app-sw.js" });
    for (const boese of ["/sw.js", "https://boese.example/app-sw.js", "/app-sw.js.evil", "data:text/javascript,1"]) {
      expect(() => v.swAdresse(boese), boese).toThrow(/nicht erlaubt/);
    }
  });
});
