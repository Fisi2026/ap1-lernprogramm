/* ============================================================================
   DER SPICKZETTEL AM ECHTEN BESTAND

   ⛔⛔ DIE ZUSICHERUNG IST EINE ZWEITE ZAEHLUNG, NICHT DIESELBE. Der Leser in
      `spickzettel.ts` faengt jede Zeile, die kein Blocktyp nimmt, als Absatz —
      eine Liste "unbekannter" Zeilen koennte also nie etwas enthalten und waere
      ein Waechter ohne Messstelle. Stattdessen wird hier ueber den ROHTEXT
      nachgezaehlt: so viele Zitate wie `>`-Zeilen, so viele Listenpunkte wie
      `-`-Zeilen, und **die Summe aller aufgenommenen Zeilen = alle Zeilen ohne
      Leerzeile und Trennstrich.** Verschluckt der Leser eine Zeile oder macht er
      aus einer Liste einen Absatz, geht die Rechnung nicht auf.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { SPICKZETTEL } from "./tabellen/spickzettel.ts";
import { sektionen, gefiltert, bloecke, teile } from "./spickzettel";

const ALLE = sektionen();

describe("Die Abschnitte des Bestands", () => {
  it("zerfaellt in mehrere Abschnitte, jeder mit Titel", () => {
    expect(ALLE.length).toBeGreaterThanOrEqual(5);
    for (const s of ALLE) {
      expect(s.titel.trim().length).toBeGreaterThan(0);
      expect(s.titel.startsWith("#")).toBe(false);
    }
  });

  it("trennt genau an den Zeilen mit einer oder zwei Rauten", () => {
    /* Zweite Zaehlung ueber den Rohtext - nicht ueber die Funktion. */
    const marken = SPICKZETTEL.split("\n").filter((z) => /^#{1,2}\s/.test(z)).length;
    expect(ALLE.length).toBe(marken);
  });

  it("nimmt die Ueberschriftszeile aus dem Koerper heraus", () => {
    for (const s of ALLE) expect(s.koerper.split("\n")[0].startsWith("# ")).toBe(false);
  });
});

describe("Die Suche", () => {
  it("laesst bei leerer Eingabe alles stehen", () => {
    expect(gefiltert(ALLE, "").length).toBe(ALLE.length);
    expect(gefiltert(ALLE, "   ").length).toBe(ALLE.length);
  });

  it("findet ein Wort, das nur in der UEBERSCHRIFT steht", () => {
    const wort = ALLE[1].titel.split(/\s+/).find((w) => w.length > 5 && /^[A-Za-zÄÖÜäöü]+$/.test(w));
    expect(wort, "kein brauchbares Titelwort - Test waere leer").toBeTruthy();
    const treffer = gefiltert(ALLE, wort!.toLowerCase());
    expect(treffer.map((s) => s.titel)).toContain(ALLE[1].titel);
  });

  it("achtet nicht auf Gross- und Kleinschreibung", () => {
    const w = "netzplan";
    expect(gefiltert(ALLE, w).length).toBe(gefiltert(ALLE, w.toUpperCase()).length);
  });

  it("gibt bei einem Wort, das nirgends steht, nichts zurueck", () => {
    expect(gefiltert(ALLE, "xyzqwertznichtvorhanden")).toEqual([]);
  });
});

describe("Die Bloecke - nachgezaehlt gegen den Rohtext", () => {
  /** Alle Koerper-Zeilen des Bestands, einmal roh. */
  const zeilen = ALLE.flatMap((s) => s.koerper.split("\n"));
  const zaehle = (re: RegExp) => zeilen.filter((z) => re.test(z)).length;
  const alleBloecke = ALLE.flatMap((s) => bloecke(s.koerper));

  it("nimmt JEDE Zeile auf - Leerzeilen und Trennstriche ausgenommen", () => {
    const traegt = zeilen.filter((z) => !/^\s*$/.test(z) && !/^-{3,}\s*$/.test(z)).length;
    const aufgenommen = alleBloecke.reduce((n, b) => {
      if (b.art === "liste") return n + b.punkte.length;
      if (b.art === "tabelle") return n + 2 + b.zeilen.length; // Kopf + Trennstrich + Inhalt
      return n + 1;
    }, 0);
    expect(aufgenommen).toBe(traegt);
  });

  it("macht aus jeder Zitatzeile ein Zitat", () => {
    expect(alleBloecke.filter((b) => b.art === "zitat").length).toBe(zaehle(/^>\s/));
  });

  it("macht aus jeder Listenzeile genau einen Punkt", () => {
    const punkte = alleBloecke.reduce((n, b) => (b.art === "liste" && !b.geordnet ? n + b.punkte.length : n), 0);
    expect(punkte).toBe(zaehle(/^\s*[-*]\s/));
    const nummern = alleBloecke.reduce((n, b) => (b.art === "liste" && b.geordnet ? n + b.punkte.length : n), 0);
    expect(nummern).toBe(zaehle(/^\s*\d+\.\s/));
  });

  it("liest die Tabellen mit Kopf und ohne Trennstrich", () => {
    const tabellen = alleBloecke.filter((b) => b.art === "tabelle");
    expect(tabellen.length).toBeGreaterThan(0);
    for (const t of tabellen) {
      expect(t.kopf.length).toBeGreaterThan(1);
      for (const z of t.zeilen) {
        /* Der Trennstrich bestuende nur aus Strichen - er darf nicht als Zeile ankommen. */
        const text = z.map((zelle) => zelle.map((x) => x.text).join("")).join("");
        expect(/^[-\s:]*$/.test(text)).toBe(false);
      }
    }
  });

  it("der Bestand benutzt vier der fuenf Blockarten", () => {
    const arten = new Set(alleBloecke.map((b) => b.art));
    for (const a of ["zitat", "liste", "tabelle", "absatz"]) {
      expect(arten.has(a as never), `Blockart ${a} kommt im Bestand nicht vor - der Zweig ist ungemessen`).toBe(true);
    }
  });

  /* ⛔⛔ GEMESSEN AM 15.09.2026: der Spickzettel hat KEINE Zeile mit drei
     Rauten - die Abschnitte werden ja an einer und zwei Rauten getrennt, und die
     Titelzeile nimmt `sektionen` heraus. Die Blockart `ueberschrift` ist damit ein
     Zweig, den der Bestand nie erreicht. **Stehen bleibt er trotzdem** (`mdToHtml`
     kennt ihn, und eine Unter-Ueberschrift im Spickzettel waere morgen moeglich) -
     aber dann gemessen an einem GEBAUTEN Fall, nicht an einer Hoffnung. */
  it("liest eine Unter-Ueberschrift als Ueberschrift - im Bestand kommt keine vor", () => {
    expect(alleBloecke.some((b) => b.art === "ueberschrift")).toBe(false);
    const gebaut = bloecke("### Merksatz" + String.fromCharCode(10) + "Darunter steht Text.");
    expect(gebaut[0]).toEqual({ art: "ueberschrift", teile: [{ art: "text", text: "Merksatz" }] });
    expect(gebaut[1].art).toBe("absatz");
  });
});

describe("Die Auszeichnung im Fliesstext", () => {
  it("trennt fett, kursiv und code heraus", () => {
    expect(teile("a **b** c")).toEqual([
      { art: "text", text: "a " }, { art: "fett", text: "b" }, { art: "text", text: " c" },
    ]);
    expect(teile("`x`")).toEqual([{ art: "code", text: "x" }]);
    expect(teile("*schraeg*")).toEqual([{ art: "kursiv", text: "schraeg" }]);
  });

  it("laesst gewoehnlichen Text in einem Stueck", () => {
    expect(teile("nichts besonderes")).toEqual([{ art: "text", text: "nichts besonderes" }]);
  });

  it("verliert kein Zeichen - der Bestand zusammengesetzt ist der Bestand", () => {
    for (const s of ALLE.slice(0, 3)) {
      for (const z of s.koerper.split("\n").filter((x) => x.trim() && !/^\s*\|/.test(x))) {
        const zurueck = teile(z).map((t) =>
          t.art === "fett" ? "**" + t.text + "**"
          : t.art === "kursiv" ? "*" + t.text + "*"
          : t.art === "code" ? "`" + t.text + "`" : t.text,
        ).join("");
        expect(zurueck).toBe(z);
      }
    }
  });
});
