/* ============================================================================
   DER SPICKZETTEL-LESER AN GEBAUTEN FAELLEN (N43 M3, Survivors aus BUILD_LOG 212)

   Der Bestandstest (`spickzettel.test.ts`) zaehlt ueber den echten Spickzettel
   nach und faengt damit jede VERSCHOBENE Summe, aber nicht, welche Zeichen genau
   eine Regel erkennt. Hier steht je Regel ein Fall mit bekannter Antwort -
   Eingabe als Zeilenliste, Erwartung als ganzer Wert. Zeilenumbruch ohne
   Backslash (`String.fromCharCode`), damit die Bruecke nichts verschluckt.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { sektionen, gefiltert, bloecke, teile } from "./spickzettel";
import type { Sektion, Teil } from "./spickzettel";

const NL = String.fromCharCode(10);
const zeilen = (...z: string[]): string => z.join(NL);
const text = (s: string): Teil => ({ art: "text", text: s });

describe("sektionen - gebaute Faelle", () => {
  it("trennt an einer und zwei Rauten und liest Titel, Koerper, Suchtext", () => {
    const s = sektionen(zeilen("# Eins", "text eins", "## Zwei", "text zwei"));
    expect(s.map((x) => x.titel)).toEqual(["Eins", "Zwei"]);
    expect(s.map((x) => x.koerper)).toEqual(["text eins", "text zwei"]);
    expect(s[0]!.suchtext).toBe(zeilen("# eins", "text eins"));
  });

  it("trennt NICHT vor einer dritten Raute", () => {
    const s = sektionen(zeilen("# A", "### B", "x"));
    expect(s.length).toBe(1);
    expect(s[0]!.koerper).toBe(zeilen("### B", "x"));
  });

  it("verwirft leere und rein weisse Teile", () => {
    expect(sektionen(NL + "# A" + NL + "x").length).toBe(1);
    expect(sektionen("   " + NL + "# A" + NL + "x").length).toBe(1);
  });

  it("ohne Titelzeile heisst der Abschnitt Abschnitt und behaelt alle Zeilen", () => {
    const q = zeilen("Vorwort ohne Raute", "### Unter", "rest");
    const s = sektionen(q);
    expect(s.length).toBe(1);
    expect(s[0]!.titel).toBe("Abschnitt");
    expect(s[0]!.koerper).toBe(q);
  });

  it("schneidet Raute und alle Leerzeichen vom Titel", () => {
    expect(sektionen("#   Drei Leerzeichen" + NL + "x")[0]!.titel).toBe("Drei Leerzeichen");
  });

  it("ein Abschnitt nur aus der Titelzeile hat einen leeren Koerper", () => {
    expect(sektionen("# Nur Titel")).toEqual([{ titel: "Nur Titel", koerper: "", suchtext: "# nur titel" }]);
  });
});

describe("gefiltert - gebaute Sektionen", () => {
  const gebaut: Sektion[] = [
    { titel: "A", koerper: "x", suchtext: "abc def" },
    { titel: "B", koerper: "y", suchtext: "xyz" },
  ];

  it("findet auch einen Treffer ganz am Anfang des Suchtexts", () => {
    expect(gefiltert(gebaut, "abc")).toEqual([gebaut[0]]);
  });

  it("schneidet Weisses ab und achtet nicht auf Gross und Klein", () => {
    expect(gefiltert(gebaut, "  DEF ")).toEqual([gebaut[0]]);
  });

  it("gibt bei leerer Suche alle zurueck - als neue Liste", () => {
    const r = gefiltert(gebaut, "");
    expect(r).toEqual(gebaut);
    expect(r).not.toBe(gebaut);
  });
});

describe("teile - Grenzfaelle der Auszeichnung", () => {
  it("liest fett, kursiv und code nebeneinander", () => {
    expect(teile("**f** und *k* und `c`")).toEqual([
      { art: "fett", text: "f" }, text(" und "), { art: "kursiv", text: "k" },
      text(" und "), { art: "code", text: "c" },
    ]);
  });

  it("fett braucht beide Paare - ein offenes Paar bleibt Text", () => {
    expect(teile("**offen")).toEqual([text("**offen")]);
    expect(teile("offen**")).toEqual([text("offen**")]);
    expect(teile("**ab**")).toEqual([{ art: "fett", text: "ab" }]);
  });

  it("code braucht beide Rueckstriche und mehr als zwei Zeichen", () => {
    expect(teile("`offen")).toEqual([text("`offen")]);
    expect(teile("offen`")).toEqual([text("offen`")]);
    expect(teile("``")).toEqual([text("``")]);
    expect(teile("`ab`")).toEqual([{ art: "code", text: "ab" }]);
  });

  it("kursiv braucht beide Sterne und mehr als zwei Zeichen", () => {
    expect(teile("*offen")).toEqual([text("*offen")]);
    expect(teile("offen*")).toEqual([text("offen*")]);
    expect(teile("**")).toEqual([text("**")]);
    expect(teile("*ab*")).toEqual([{ art: "kursiv", text: "ab" }]);
  });

  it("vier Sterne am Stueck sind (heute) kursiv mit zwei Sternen, nicht fett", () => {
    /* Ist-Verhalten, kein Wunsch: Laenge 4 ist die Grenze zu fett (> 4). */
    expect(teile("****")).toEqual([{ art: "kursiv", text: "**" }]);
  });
});

describe("bloecke - gebaute Faelle", () => {
  it("ueberspringt Leerzeilen, Weisses und Trennstriche", () => {
    expect(bloecke(zeilen("a", "", "   ", "---", "b", "----   "))).toEqual([
      { art: "absatz", teile: [text("a")] },
      { art: "absatz", teile: [text("b")] },
    ]);
  });

  it("haelt Zeilen, die nur AUSSEHEN wie Trennstriche, als Absatz", () => {
    expect(bloecke(zeilen("ab---", "---x", "-", "--"))).toEqual([
      { art: "absatz", teile: [text("ab---")] },
      { art: "absatz", teile: [text("---x")] },
      { art: "absatz", teile: [text("-")] },
      { art: "absatz", teile: [text("--")] },
    ]);
  });

  it("liest Ueberschriften mit einer bis sechs Rauten, nur am Zeilenanfang", () => {
    expect(bloecke(zeilen("# Eins", "###### Sechs", "a # b"))).toEqual([
      { art: "ueberschrift", teile: [text("Eins")] },
      { art: "ueberschrift", teile: [text("Sechs")] },
      { art: "absatz", teile: [text("a # b")] },
    ]);
  });

  it("liest Zitate nur mit Leerzeichen nach dem Zeichen, am Zeilenanfang", () => {
    expect(bloecke(zeilen("> Zitat **fett**", "a > b", ">x"))).toEqual([
      { art: "zitat", teile: [text("Zitat "), { art: "fett", text: "fett" }] },
      { art: "absatz", teile: [text("a > b")] },
      { art: "absatz", teile: [text(">x")] },
    ]);
  });

  it("sammelt Aufzaehlungspunkte, auch eingerueckt, und endet an der ersten Nicht-Zeile", () => {
    expect(bloecke(zeilen("- a", "* b", "  - c", "ab- d"))).toEqual([
      { art: "liste", geordnet: false, punkte: [[text("a")], [text("b")], [text("c")]] },
      { art: "absatz", teile: [text("ab- d")] },
    ]);
  });

  it("ein Strich mitten in der Zeile macht keine Liste", () => {
    expect(bloecke("ab- d")).toEqual([{ art: "absatz", teile: [text("ab- d")] }]);
  });

  it("sammelt nummerierte Punkte, auch mehrstellig und eingerueckt", () => {
    expect(bloecke(zeilen("12. a", "  2. b", "3. c", "ab3. d"))).toEqual([
      { art: "liste", geordnet: true, punkte: [[text("a")], [text("b")], [text("c")]] },
      { art: "absatz", teile: [text("ab3. d")] },
    ]);
  });

  it("eine Zahl mitten in der Zeile macht keine Nummerierung", () => {
    expect(bloecke("ab3. d")).toEqual([{ art: "absatz", teile: [text("ab3. d")] }]);
  });

  it("liest eine Tabelle: Kopf, Trennstrich wird uebersprungen, danach Absatz", () => {
    const b = bloecke(zeilen("| Kopf A | Kopf B |", "|---|---|", "| 1 | **zwei** |", "Absatz | mit Strich", "x|y"));
    expect(b).toEqual([
      {
        art: "tabelle",
        kopf: [[text("Kopf A")], [text("Kopf B")]],
        zeilen: [[[text("1")], [{ art: "fett", text: "zwei" }]]],
      },
      { art: "absatz", teile: [text("Absatz | mit Strich")] },
      { art: "absatz", teile: [text("x|y")] },
    ]);
  });

  it("liest eingerueckte Tabellenzeilen mit Weissraum am Rand", () => {
    expect(bloecke(zeilen("  | K |  ", "|-|", "  | v |  "))).toEqual([
      { art: "tabelle", kopf: [[text("K")]], zeilen: [[[text("v")]]] },
    ]);
  });

  it("ein senkrechter Strich mitten in der Zeile macht keine Tabelle", () => {
    expect(bloecke(zeilen("a | b", "x|y"))).toEqual([
      { art: "absatz", teile: [text("a | b")] },
      { art: "absatz", teile: [text("x|y")] },
    ]);
  });

  it("alles andere ist ein Absatz, Zeile fuer Zeile", () => {
    expect(bloecke(zeilen("eins", "zwei"))).toEqual([
      { art: "absatz", teile: [text("eins")] },
      { art: "absatz", teile: [text("zwei")] },
    ]);
  });
});
