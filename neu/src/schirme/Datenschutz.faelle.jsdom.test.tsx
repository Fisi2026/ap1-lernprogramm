// @vitest-environment jsdom
/* Datenschutzhinweis: der Verantwortliche steht als „Name, Adresse“ mit einem Mail-Link. */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DatenschutzHinweis } from "./Datenschutz";
import { VERANTWORTLICH } from "@/kern/datenschutz";

afterEach(cleanup);

describe("DatenschutzHinweis", () => {
  it("nennt den Verantwortlichen mit Komma und Leerzeichen vor der verlinkten Adresse", () => {
    render(<DatenschutzHinweis />);
    const link = screen.getByRole("link", { name: VERANTWORTLICH.mail });
    expect(link.getAttribute("href")).toBe(`mailto:${VERANTWORTLICH.mail}`);
    expect(link.parentElement?.textContent).toBe(`${VERANTWORTLICH.name}, ${VERANTWORTLICH.mail}`);
  });
});
