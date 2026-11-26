// @vitest-environment jsdom
/* Melden: Vorbelegung aus einer vorhandenen Meldung, Vormerken mit Ersatzgrund und getrimmtem Text, Statuszeile,
   Versandstand nach dem Senden, Entfernen leert die Felder. Stand und Ablage sind echt, das Netz ist `sende`. */
import { describe, it, expect, afterEach, vi } from "vitest";
import { act, render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { leererStand, type Lernstand } from "@/kern/stand";
import { S_SCHLANGE, schlange } from "@/kern/meldeversand";
import type { Ablage, Sende } from "@/kern/meldeversand";
import { Melden } from "./Melden";

afterEach(cleanup);
const ID = "M05-950";
const DATUM = new Date(2026, 9, 1, 12).getTime();
const nutzer = () => userEvent.setup({ delay: null });

function speicher(): Ablage & { daten: Map<string, string> } {
  const daten = new Map<string, string>();
  return { daten, getItem: (k) => daten.get(k) ?? null, setItem: (k, v) => { daten.set(k, v); } };
}
function Huelle({ start, ablage, sende }: { start: Lernstand; ablage: Ablage; sende: Sende }) {
  const [stand, setStand] = useState(start);
  return <Melden id={ID} merk={{ stand, aendere: (fn) => setStand((s) => fn(s)) }} ablage={ablage} sende={sende} />;
}
const mitMeldung = (m: Record<string, unknown>) => ({ ...leererStand(), meldungen: { [ID]: m } });
const offen = async () => { await nutzer().click(screen.getByText("⚑ Frage melden")); };
const status = () => document.querySelector('[data-teil="meldestatus"]')?.textContent ?? null;
const versand = () => document.querySelector('[data-teil="versand"]')?.textContent ?? null;
const details = () => screen.getByLabelText("Details zur Meldung") as HTMLTextAreaElement;
const nie = vi.fn<Sende>(() => new Promise(() => {}));

describe("Vorbelegung und Statuszeile", () => {
  it("eine vorhandene Meldung ist offen, wählt ihren Grund, füllt den Text und steht in der Statuszeile", () => {
    render(<Huelle start={mitMeldung({ grund: "Tippfehler", text: "dort", datum: DATUM })} ablage={speicher()} sende={nie} />);
    expect(screen.getByRole("radio", { name: "Tippfehler" }).getAttribute("aria-checked")).toBe("true");
    expect(details().value).toBe("dort");
    expect(status()).toContain(`Gemeldet am ${new Date(DATUM).toLocaleDateString("de-DE")} – Tippfehler: dort`);
  });

  it("ohne Text kein Doppelpunkt; ohne Grund ein Fragezeichen", () => {
    render(<Huelle start={mitMeldung({ grund: "", text: "", datum: DATUM })} ablage={speicher()} sende={nie} />);
    expect(status()).toContain("– ?");
    expect(status()).not.toContain(":");
  });

  it("ohne Meldung ist der Bereich zu, ohne Statuszeile und ohne Entfernen-Knopf", async () => {
    render(<Huelle start={leererStand()} ablage={speicher()} sende={nie} />);
    expect(status()).toBeNull();
    await offen();
    expect(screen.queryByRole("button", { name: "Meldung entfernen" })).toBeNull();
    expect(screen.getByRole("button", { name: "Melden" })).toBeTruthy();
  });

  it("der gewählte Grund bleibt stehen, wenn man ihn noch einmal antippt", async () => {
    render(<Huelle start={leererStand()} ablage={speicher()} sende={nie} />);
    await offen();
    const n = nutzer();
    await n.click(screen.getByRole("radio", { name: "Veraltet" }));
    await n.click(screen.getByRole("radio", { name: "Veraltet" }));
    expect(screen.getByRole("radio", { name: "Veraltet" }).getAttribute("aria-checked")).toBe("true");
  });
});

describe("Melden", () => {
  it("ohne Grund wird „Sonstiges“ vorgemerkt, der Text getrimmt; Stand und Schlange bekommen die Meldung", async () => {
    const ablage = speicher();
    render(<Huelle start={leererStand()} ablage={ablage} sende={nie} />);
    await offen();
    fireEvent.change(details(), { target: { value: "  Hallo Welt \n" } });
    await nutzer().click(screen.getByRole("button", { name: "Melden" }));
    const q = schlange(ablage);
    expect(q).toHaveLength(1);
    expect(q[0]).toMatchObject({ frageId: ID, grund: "Sonstiges", text: "Hallo Welt" });
    expect(status()).toContain("Sonstiges: Hallo Welt");
  });

  it("zeigt „wartet“, solange der Server nicht antwortet, danach „übermittelt“ samt Hinweis zum Entfernen", async () => {
    const ablage = speicher();
    let antwortet!: (r: Response) => void;
    const sende = vi.fn<Sende>(() => new Promise<Response>((res) => { antwortet = res; }));
    render(<Huelle start={leererStand()} ablage={ablage} sende={sende} />);
    await offen();
    await nutzer().click(screen.getByRole("radio", { name: "Veraltet" }));
    await nutzer().click(screen.getByRole("button", { name: "Melden" }));
    await waitFor(() => expect(sende).toHaveBeenCalledTimes(1));
    expect(versand()).toBe("wartet auf Verbindung – wird automatisch nachgeschickt");
    expect(screen.queryByText(/löscht sie nur auf diesem Gerät/)).toBeNull();
    await act(async () => { antwortet(new Response("{}", { status: 201 })); await Promise.resolve(); });
    await waitFor(() => expect(versand()).toBe("an den Betreiber übermittelt"));
    expect(screen.getByText(/„Entfernen“ löscht sie nur auf diesem Gerät\./)).toBeTruthy();
    expect(JSON.parse(String(sende.mock.calls[0]![1].body))).toMatchObject({ frageId: ID, grund: "Veraltet" });
  });

  it("vom Server abgewiesen: eigener Satz", async () => {
    const sende = vi.fn<Sende>(() => Promise.resolve(new Response("{}", { status: 400 })));
    render(<Huelle start={leererStand()} ablage={speicher()} sende={sende} />);
    await offen();
    await nutzer().click(screen.getByRole("button", { name: "Melden" }));
    await waitFor(() => expect(versand()).toBe("vom Server abgewiesen – bitte über den Export melden"));
  });
});

describe("Entfernen", () => {
  it("nimmt die Meldung aus Stand und Schlange und leert Grund und Text; der Bereich bleibt offen", async () => {
    const ablage = speicher();
    render(<Huelle start={leererStand()} ablage={ablage} sende={nie} />);
    await offen();
    const n = nutzer();
    await n.click(screen.getByRole("radio", { name: "Tippfehler" }));
    fireEvent.change(details(), { target: { value: "x" } });
    await n.click(screen.getByRole("button", { name: "Melden" }));
    expect(schlange(ablage)).toHaveLength(1);
    await n.click(screen.getByRole("button", { name: "Meldung entfernen" }));
    expect(schlange(ablage)).toEqual([]);
    expect(ablage.daten.get(S_SCHLANGE)).toBe("[]");
    expect(status()).toBeNull();
    expect(details().value).toBe("");
    for (const r of screen.getAllByRole("radio")) expect(r.getAttribute("aria-checked")).toBe("false");
    expect(screen.getByRole("button", { name: "Melden" })).toBeTruthy();
  });
});
