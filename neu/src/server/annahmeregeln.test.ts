/* N44 C1: Grenzen, Typen und Schwärzung der beiden Annahmeregeln (Fehlerbericht, Meldung). */
import { describe, it, expect } from "vitest";
import { FEHLER_GRENZEN, pruefeFehler, schwaerze } from "./fehlerregeln";
import { GRENZEN, gleicherSchluessel, pruefeEingang } from "./regeln";
import { FRAGE_IDS } from "./fragen-ids";

const GERAET = "geraet-aaaaaaaaaaaaaaaa";
const fehler = { bereich: "ueben", meldung: "kaputt", stack: "a\nb", geraet: GERAET, version: "1.0" };
const eingang = { frageId: FRAGE_IDS[0] as string, grund: "Tippfehler", text: " hallo ", geraet: GERAET, version: "1.0" };
const grund = (r: ReturnType<typeof pruefeFehler>) => (r.ok ? "ok" : r.fehler);

describe("pruefeFehler", () => {
  it("liefert den geprüften Wert: Meldung gestutzt und geschwärzt, Stack gekürzt", () => {
    expect(pruefeFehler({ ...fehler, meldung: "  Frage M03-907 kaputt  ", stack: "x M03-907" })).toEqual({
      ok: true,
      wert: { bereich: "ueben", meldung: "Frage M??-??? kaputt", stack: "x M??-???", geraet: GERAET, version: "1.0" },
    });
  });
  it("Stack und Version sind frei wählbar (fehlen → leer)", () => {
    expect(pruefeFehler({ bereich: "ueben", meldung: "m", geraet: GERAET })).toEqual({
      ok: true, wert: { bereich: "ueben", meldung: "m", stack: "", geraet: GERAET, version: "" },
    });
  });
  it("falsche Typen und Fehlendes, jeweils mit der richtigen Meldung", () => {
    expect(grund(pruefeFehler({ ...fehler, bereich: 5 }))).toBe("unbekannter Bereich");
    expect(grund(pruefeFehler({ ...fehler, bereich: "" }))).toBe("unbekannter Bereich");
    expect(grund(pruefeFehler({ ...fehler, bereich: "gibtsnicht" }))).toBe("unbekannter Bereich");
    expect(grund(pruefeFehler({ ...fehler, meldung: 5 }))).toBe("Meldung fehlt");
    expect(grund(pruefeFehler({ ...fehler, meldung: "   " }))).toBe("Meldung fehlt");
    expect(grund(pruefeFehler({ ...fehler, stack: 5 }))).toBe("Stack ist kein Text");
    expect(grund(pruefeFehler({ ...fehler, geraet: 5 }))).toBe("Gerätekennung ungültig");
    expect(grund(pruefeFehler({ ...fehler, geraet: "kurz" }))).toBe("Gerätekennung ungültig");
    expect(grund(pruefeFehler({ ...fehler, version: 5 }))).toBe("ok");
    expect(grund(pruefeFehler("text"))).toBe("kein Objekt");
  });
  it("Grenzen: genau die Grenze gilt, eins darüber nicht", () => {
    expect(grund(pruefeFehler({ ...fehler, meldung: "m".repeat(FEHLER_GRENZEN.meldung) }))).toBe("ok");
    expect(grund(pruefeFehler({ ...fehler, meldung: "m".repeat(FEHLER_GRENZEN.meldung + 1) }))).toBe("Meldung zu lang");
    expect(grund(pruefeFehler({ ...fehler, stack: "s".repeat(FEHLER_GRENZEN.stack) }))).toBe("ok");
    expect(grund(pruefeFehler({ ...fehler, stack: "s".repeat(FEHLER_GRENZEN.stack + 1) }))).toBe("Stack zu lang");
    expect(grund(pruefeFehler({ ...fehler, version: "v".repeat(FEHLER_GRENZEN.version) }))).toBe("ok");
    expect(grund(pruefeFehler({ ...fehler, version: "v".repeat(FEHLER_GRENZEN.version + 1) }))).toBe("Version zu lang");
  });
});

describe("schwaerze", () => {
  it("kappt Query und Hash an http und https, lässt den Rest stehen", () => {
    expect(schwaerze("at http://h/a.js?v=1 (x)")).toBe("at http://h/a.js (x)");
    expect(schwaerze("at https://h/a.js#x=1:2")).toBe("at https://h/a.js");
  });
  it("ersetzt #frage=… bis Leerzeichen oder Klammer, nicht darüber hinaus", () => {
    expect(schwaerze("a #frage=abc def")).toBe("a #frage=… def");
    expect(schwaerze("(#frage=abc) x")).toBe("(#frage=…) x");
    expect(schwaerze("#frage=")).toBe("#frage=…");
  });
});

describe("pruefeEingang", () => {
  it("liefert den geprüften Wert mit gestutztem Text", () => {
    expect(pruefeEingang(eingang)).toEqual({
      ok: true,
      wert: { frageId: eingang.frageId, grund: "Tippfehler", text: "hallo", geraet: GERAET, fassung: "neu", version: "1.0" },
    });
    expect(pruefeEingang({ ...eingang, text: undefined, version: undefined })).toMatchObject({ ok: true, wert: { text: "", version: "" } });
  });
  it("falsche Typen und Fehlendes", () => {
    const f = (o: object) => { const r = pruefeEingang({ ...eingang, ...o }); return r.ok ? "ok" : r.fehler; };
    expect(f({ frageId: 5 })).toBe("unbekannte Frage");
    expect(f({ frageId: "X99-999" })).toBe("unbekannte Frage");
    expect(f({ grund: 5 })).toBe("unbekannter Grund");
    expect(f({ grund: "Wetter" })).toBe("unbekannter Grund");
    expect(f({ text: 5 })).toBe("Text ist kein Text");
    expect(f({ geraet: 5 })).toBe("Gerätekennung ungültig");
    expect(f({ geraet: "kurz" })).toBe("Gerätekennung ungültig");
    expect(f({ version: 5 })).toBe("ok");
    expect(pruefeEingang(null)).toEqual({ ok: false, fehler: "kein Objekt" });
  });
  it("Grenzen: genau die Grenze gilt, eins darüber nicht", () => {
    const f = (o: object) => { const r = pruefeEingang({ ...eingang, ...o }); return r.ok ? "ok" : r.fehler; };
    expect(f({ text: "t".repeat(GRENZEN.text) })).toBe("ok");
    expect(f({ text: "t".repeat(GRENZEN.text + 1) })).toBe("Text zu lang");
    expect(f({ version: "v".repeat(GRENZEN.version) })).toBe("ok");
    expect(f({ version: "v".repeat(GRENZEN.version + 1) })).toBe("Version zu lang");
  });
});

describe("gleicherSchluessel", () => {
  it("gleich nur bei gleichem Text; leer nie", async () => {
    expect(await gleicherSchluessel("abc", "abc")).toBe(true);
    expect(await gleicherSchluessel("abc", "abd")).toBe(false);
    expect(await gleicherSchluessel("abc", "abcd")).toBe(false);
    expect(await gleicherSchluessel("", "")).toBe(false);
    expect(await gleicherSchluessel("abc", "")).toBe(false);
    expect(await gleicherSchluessel("", "abc")).toBe(false);
  });
});
