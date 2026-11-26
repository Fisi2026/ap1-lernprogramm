// @vitest-environment jsdom
/* N31: `useLernstand` liest nur. ⛔ Lehre N6c: ein Seiteneffekt im State-Updater laeuft in
   StrictMode ZWEIMAL - genau das misst dieser Test (Sabotage: Schreiben zurueck in einen Updater). */
import { describe, it, expect } from "vitest";
import { StrictMode } from "react";
import { renderHook, act } from "@testing-library/react";
import { useLernstand } from "./useLernstand";
import { erzeugeQuelle } from "@/kern/lernstandort";
import { LS_SCHLUESSEL } from "@/kern/stand";

function speicher() {
  const m = new Map<string, string>();
  const schreibe: string[] = [];
  const sp = {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => { schreibe.push(k); m.set(k, v); },
    removeItem: (k: string) => { m.delete(k); },
  } as unknown as Storage;
  return { m, schreibe, sp };
}

describe("useLernstand in StrictMode", () => {
  it("eine Aenderung schreibt genau einmal und ist sofort sichtbar", () => {
    const { m, schreibe, sp } = speicher();
    const q = erzeugeQuelle({ speicher: sp, jetzt: () => 0 });
    const { result } = renderHook(() => useLernstand(q), { wrapper: StrictMode });
    act(() => result.current.aendere((s) => ({ ...s, tagesziel: 7 })));
    expect(schreibe.filter((k) => k === LS_SCHLUESSEL)).toHaveLength(1);
    expect(result.current.stand.tagesziel).toBe(7);
    expect(JSON.parse(m.get(LS_SCHLUESSEL)!).rev).toBe(1);
  });
  it("ohne navigator.locks (jsdom): Rolle ohneSperre, Befunde durchgereicht", () => {
    const { m, sp } = speicher();
    m.set(LS_SCHLUESSEL, "{kaputt");
    const q = erzeugeQuelle({ speicher: sp, jetzt: () => 0 });
    const { result } = renderHook(() => useLernstand(q), { wrapper: StrictMode });
    expect(result.current).toMatchObject({ rolle: "ohneSperre", befund: "unlesbar", gesichert: true, speicherFehler: false });
  });
});
