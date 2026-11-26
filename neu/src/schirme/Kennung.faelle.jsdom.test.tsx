// @vitest-environment jsdom
/* Kennung: ohne `oeffne` reiner Text, mit `oeffne` ein Knopf – beide behalten ihre Gestaltung (Klassen) und `className`. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Kennung } from "./Kennung";

afterEach(cleanup);

describe("Kennung", () => {
  it("ohne oeffne: Text in Festbreitenschrift, kein Knopf, className wird angehängt", () => {
    render(<Kennung id="M05-950" className="zusatz" />);
    expect(screen.queryByRole("button")).toBeNull();
    const t = screen.getByText("M05-950");
    expect(t.className).toContain("font-mono");
    expect(t.className).toContain("zusatz");
  });

  it("mit oeffne: Knopf mit Beschriftung, gepunktet unterstrichen, ruft oeffne(id) und übernimmt className", async () => {
    const oeffne = vi.fn();
    render(<Kennung id="M05-950" oeffne={oeffne} className="zusatz" />);
    const k = screen.getByRole("button", { name: "Frage M05-950 öffnen" });
    expect(k.className).toContain("font-mono");
    expect(k.className).toContain("underline");
    expect(k.className).toContain("decoration-dotted");
    expect(k.className).toContain("text-inherit");
    expect(k.className).toContain("hover:text-foreground");
    expect(k.className).toContain("zusatz");
    expect(k.getAttribute("type")).toBe("button");
    await userEvent.setup({ delay: null }).click(k);
    expect(oeffne).toHaveBeenCalledExactlyOnceWith("M05-950");
  });
});
