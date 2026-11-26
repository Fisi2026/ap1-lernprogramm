// @vitest-environment jsdom
/* N38 Q1 (30.09.2026): BEKANNTE ANTWORT fuer die Zweige von `bedeutungsbaum`, die die Schnappschuesse
   nicht beruehren (gemessen per Sabotage: `checked` einer echten Checkbox, `style`, `<details open>`).
   Anlass: die Umwandlungen `el as HTMLInputElement` usw. wichen `eigenschaft(el, k)`. */
import { describe, expect, it } from "vitest";
import { bedeutungsbaum } from "./bedeutungsbaum";

function baum(html: string): string {
  const w = document.createElement("div");
  w.innerHTML = html;
  return bedeutungsbaum(w);
}

describe("bedeutungsbaum – Zweige ohne Schnappschuss", () => {
  it("echte Checkbox ohne aria-checked: checked aus der Eigenschaft", () => {
    expect(baum('<label><input type="checkbox" checked> A</label>')).toContain("checked=true");
    expect(baum('<label><input type="checkbox"> A</label>')).toContain("checked=false");
  });
  it("style display:none / visibility:hidden blendet aus", () => {
    expect(baum('<button style="display:none">X</button><button>Y</button>')).toBe('button "Y"\n');
    expect(baum('<button style="visibility:hidden">X</button>')).toBe("\n");
  });
  it("<details>: offen zeigt Inhalt, zu nur die Zusammenfassung", () => {
    const offen = baum("<details open><summary>S</summary><button>B</button></details>");
    expect(offen).toContain("[offen]");
    expect(offen).toContain('button "B"');
    const zu = baum("<details><summary>S</summary><button>B</button></details>");
    expect(zu).toContain("[zu]");
    expect(zu).not.toContain('button "B"');
  });
});
