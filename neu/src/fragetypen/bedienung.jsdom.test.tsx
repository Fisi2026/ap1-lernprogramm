// @vitest-environment jsdom
/* N25 P3: Verhalten, das mit den shadcn-Bausteinen NEU entschieden werden musste.
   `eingabe.test.tsx` bedient jeden Typ nur RICHTIG und einmal – was bei einem
   zweiten Klick passiert, sieht er nicht. Genau das haben die Bausteine geaendert:

   * mtf ist eine ToggleGroup type="single". Radix liefert auf einen zweiten Klick
     auf die gewaehlte Seite "" (abwaehlen). Vor P3 blieb die Wahl stehen – und so
     soll es bleiben (Einfach.tsx: `if (w) setze(…)`).
   * mehrfach ist eine Checkbox je Option. Abwaehlen muss die Option aus dem Feld
     nehmen, nicht nur das Haekchen. */
import { describe, it, expect, afterEach } from "vitest";
import { useState, type ReactNode } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mtf } from "./Einfach";
import { Mehrfach } from "./Auswahl";
import type { EingabeProps } from "./vertrag";
import type { FrageVon, Fragetyp } from "@/daten/typen";

afterEach(cleanup);

function Stand<T extends Fragetyp>({ Eingabe, frage, meldungen }: {
  Eingabe: (p: EingabeProps<T>) => ReactNode; frage: EingabeProps<T>["frage"]; meldungen: unknown[];
}) {
  const [antwort, setAntwort] = useState<unknown>(undefined);
  return <Eingabe frage={frage} antwort={antwort} gesperrt={false}
                  aufAntwort={(a) => { setAntwort(a); meldungen.push(a); }} />;
}

describe("Bedienung jenseits des ersten Klicks (N25 P3)", () => {
  it("mtf: ein zweiter Klick auf die gewählte Seite lässt die Wahl stehen", async () => {
    const nutzer = userEvent.setup();
    const frage = { id: "T-MTF", typ: "mtf",
      aussagen: [{ text: "Eins", wahr: true }, { text: "Zwei", wahr: false }] } as unknown as FrageVon<"mtf">;
    const meldungen: unknown[] = [];
    render(<Stand Eingabe={Mtf} frage={frage} meldungen={meldungen} />);
    const wahr = screen.getByRole("radio", { name: "Aussage 1: wahr" });
    await nutzer.click(wahr);
    await nutzer.click(wahr);
    expect(wahr.getAttribute("aria-checked")).toBe("true");
    expect(meldungen.at(-1)).toEqual([true, null]);
    await nutzer.click(screen.getByRole("radio", { name: "Aussage 1: falsch" }));
    expect(meldungen.at(-1)).toEqual([false, null]);
  });

  it("mehrfach: Abwählen nimmt die Option aus der Antwort", async () => {
    const nutzer = userEvent.setup();
    const frage = { id: "T-MF", typ: "mehrfach", optionen: ["Alpha", "Beta", "Gamma"] } as unknown as FrageVon<"mehrfach">;
    const meldungen: unknown[] = [];
    render(<Stand Eingabe={Mehrfach} frage={frage} meldungen={meldungen} />);
    await nutzer.click(screen.getByRole("checkbox", { name: "Alpha" }));
    await nutzer.click(screen.getByRole("checkbox", { name: "Gamma" }));
    expect(meldungen.at(-1)).toEqual([0, 2]);
    await nutzer.click(screen.getByRole("checkbox", { name: "Alpha" }));
    expect(meldungen.at(-1)).toEqual([2]);
    expect(screen.getByRole("checkbox", { name: "Alpha" }).getAttribute("aria-checked")).toBe("false");
  });
});
