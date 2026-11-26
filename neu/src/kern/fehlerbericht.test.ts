/* N32 Schritt 2: der Fehlerbericht – was hinausgeht und was nicht (E30). */
import { describe, it, expect, vi } from "vitest";
import { baueBericht, sendeFehlerbericht } from "./fehlerbericht";
import { S_GERAET, type Ablage } from "./meldeversand";
import { FEHLER_GRENZEN, pruefeFehler } from "@/server/fehlerregeln";

function ablage(): Ablage & { daten: Map<string, string> } {
  const daten = new Map<string, string>();
  return { daten, getItem: (k) => daten.get(k) ?? null, setItem: (k, v) => { daten.set(k, v); } };
}
const GERAET = "geraet-aaaaaaaaaaaaaaaa";

describe("baueBericht", () => {
  it("nimmt Name und Meldung, schwärzt Frage-Kennung und Route, kürzt den Stack", () => {
    const e = new TypeError("Frage M03-907 kaputt");
    e.stack = "TypeError: Frage M03-907 kaputt\n" +
      Array.from({ length: 30 }, (_, i) => `    at f${i} (https://h/v2/assets/i.js?v=1#frage=M03-907:1:${i})`).join("\n");
    const b = baueBericht("ueben", e, GERAET, "1.39.0");
    expect(b.meldung).toBe("TypeError: Frage M??-??? kaputt");
    expect(JSON.stringify(b)).not.toMatch(/M\d{2}-\d{3}|v=1|#frage/);
    expect(b.stack.split("\n")).toHaveLength(FEHLER_GRENZEN.stackZeilen);
    expect(Object.keys(b).sort()).toEqual(["bereich", "geraet", "meldung", "stack", "version"]);
    expect(pruefeFehler(b).ok, "der Server nimmt ihn an").toBe(true);
  });

  it("verträgt Würfe, die kein Error sind, und überlange Meldungen", () => {
    expect(baueBericht("stat", "nur Text", GERAET, "1").meldung).toBe("nur Text");
    expect(baueBericht("stat", undefined, GERAET, "1").stack).toBe("");
    const lang = baueBericht("stat", new Error("x".repeat(999)), GERAET, "1");
    expect(lang.meldung).toHaveLength(FEHLER_GRENZEN.meldung);
    expect(pruefeFehler(lang).ok).toBe(true);
  });
});

describe("sendeFehlerbericht", () => {
  it("201 -> gesendet; Körper ohne Lernstand, mit der Gerätekennung der Meldungen", async () => {
    const a = ablage();
    a.setItem("fisi_ap1_stand", JSON.stringify({ geheim: "LERNSTAND" }));
    const sende = vi.fn(async () => new Response("{}", { status: 201 }));
    expect(await sendeFehlerbericht("sim", new Error("weg"), a, sende, "1.39.0")).toBe("gesendet");
    expect(sende).toHaveBeenCalledTimes(1);
    const [url, init] = sende.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/fehler");
    expect(String(init.body)).not.toContain("LERNSTAND");
    expect(JSON.parse(String(init.body)).geraet).toBe(JSON.parse(a.getItem(S_GERAET)!));
  });

  it("kein Netz oder Abweisung -> nicht gesendet, ohne Wurf", async () => {
    const weg = vi.fn(async () => { throw new TypeError("offline"); });
    expect(await sendeFehlerbericht("sim", new Error("x"), ablage(), weg, "1")).toBe("nicht gesendet");
    const voll = vi.fn(async () => new Response("{}", { status: 429 }));
    expect(await sendeFehlerbericht("sim", new Error("x"), ablage(), voll, "1")).toBe("nicht gesendet");
  });
});

describe("Grenzen des Berichts (N43 M3 Rest)", () => {
  it("leere Meldung wird zu „(ohne Meldung)“, Leerraum am Rand wird entfernt", () => {
    expect(baueBericht("stat", "", GERAET, "1").meldung).toBe("(ohne Meldung)");
    expect(baueBericht("stat", "   ", GERAET, "1").meldung).toBe("(ohne Meldung)");
    expect(baueBericht("stat", "  rand  ", GERAET, "1").meldung).toBe("rand");
  });
  it("kürzt die App-Version auf ihre Grenze", () => {
    const v = "9".repeat(FEHLER_GRENZEN.version + 5);
    expect(baueBericht("stat", "x", GERAET, v).version).toBe("9".repeat(FEHLER_GRENZEN.version));
  });
  it("schickt per POST mit JSON-Kopfzeile", async () => {
    const sende = vi.fn(async () => new Response("{}", { status: 201 }));
    await sendeFehlerbericht("sim", new Error("x"), ablage(), sende, "1");
    const [, init] = sende.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "content-type": "application/json" });
  });
});
