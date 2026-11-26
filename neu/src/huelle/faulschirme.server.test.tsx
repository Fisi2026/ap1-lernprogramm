// @ts-nocheck
// @vitest-environment node
/* Mutationstest huelle/faulschirme: der Weg OHNE vorgeladenen Schirm. Die Umgebung "node" laesst
   `pruefstand.ts` die Schirme nicht vorab laden (nur mit Document) - `fertig` ist also leer und
   `Geladen` muss ueber `lazy` gehen. Der Serverdurchlauf wartet, bis der Chunk da ist, und
   liefert dann den echten Schirm. Kein `vi.resetModules` (siehe vitest.stryker.config.ts). */
import { describe, it, expect } from "vitest"
import { Suspense } from "react"
import { prerender } from "react-dom/static"
import { leererStand } from "@/kern/stand"
import { Glossar } from "./faulschirme"

async function html(element: unknown): Promise<string> {
  const { prelude } = await prerender(element)
  const leser = prelude.getReader()
  const teile: string[] = []
  const dec = new TextDecoder()
  for (;;) {
    const { done, value } = await leser.read()
    if (done) break
    teile.push(dec.decode(value))
  }
  return teile.join("")
}

describe("faule Schirme ohne Vorabladen", () => {
  it("zeichnet den echten Schirm statt des Rueckfalls, sobald der Chunk geladen ist", async () => {
    const seite = await html(<Suspense fallback={<p>Wird geladen …</p>}><Glossar stand={leererStand()} /></Suspense>)
    expect(seite).toContain("Begriffe (")
    expect(seite).not.toContain("Wird geladen")
  }, 60000)
})
