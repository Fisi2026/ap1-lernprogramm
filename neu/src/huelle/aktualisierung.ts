/* ============================================================================
   N33 (E33): WANN EINE NEUE FASSUNG BEREITSTEHT – und wer umschaltet.

   ►► Der Service Worker (`neu/sw/vorlage.js`) wartet nach dem Installieren, bis
      die Seite SKIP_WAITING schickt. Geschickt wird NUR auf Knopfdruck im
      Update-Hinweis – und der ist waehrend einer Simulation oder Tagesserie
      unsichtbar (`Updatehinweis.tsx`). So wird nie mitten im Lauf umgeschaltet.
   ►► Neu geladen wird nur der Tab, der geklickt hat. Ein ANDERER Tab bekommt
      „aktiv" und zeigt den Hinweis selbst – sein laufender Code bleibt, bis
      der Lerner dort klickt (alles Noetige ist beim Start geladen).
   ⚠️ Die ERSTE Installation loest auch `controllerchange` aus (clients.claim);
      das ist keine neue Fassung und wird uebergangen.
   ►► BEIM START (Nutzer-Entscheid 25.11.2026, BUILD_LOG 277): wartet schon beim Laden der Seite eine
      Fassung, schaltet die Seite selbst um und laedt einmal neu – noch hat der Lerner nichts begonnen.
      Nur wenn KEIN anderes Fenster der App offen ist (der SW zaehlt, `SKIP_WAITING_ALLEIN`); sonst und
      wenn die Antwort ausbleibt, bleibt es beim Hinweis. Kommt die Fassung erst WAEHREND des Uebens,
      bleibt es ebenfalls beim Hinweis.
   ============================================================================ */
import { swAdresse } from "@/lib/vertrauen"

export type Stufe = "keine" | "bereit" | "aktiv"

export interface SwUmgebung {
  container: ServiceWorkerContainer
  neuLaden(): void
  /** meldet „Seite wieder sichtbar" – Anlass, nach einer neuen Fassung zu fragen */
  beiSichtbar(cb: () => void): void
  /** Beim Start: den wartenden SW bitten umzuschalten, wenn kein anderes Fenster offen ist.
      true = er schaltet um (dann folgt `controllerchange`). Fehlt es, bleibt es beim Hinweis. */
  umschaltenWennAllein?(w: ServiceWorker): Promise<boolean>
}

export function erzeugeAktualisierung(u: SwUmgebung | null) {
  let stufe: Stufe = "keine"
  let wartend: ServiceWorker | null = null
  let angefordert = false
  const abos = new Set<() => void>()
  const setze = (s: Stufe) => { if (s !== stufe) { stufe = s; for (const cb of [...abos]) cb() } }

  function bereit(w: ServiceWorker) { wartend = w; setze("bereit") }

  async function registriere(url: string, scope: string): Promise<void> {
    if (!u) return
    const c = u.container
    let hatteSteuerung = !!c.controller
    c.addEventListener("controllerchange", () => {
      if (angefordert) { u.neuLaden(); return }
      if (!hatteSteuerung) { hatteSteuerung = true; return }
      wartend = null
      setze("aktiv")
    })
    const reg = await c.register(swAdresse(url), { scope })
    if (reg.waiting && c.controller) {
      const w = reg.waiting
      let selbst = false
      if (u.umschaltenWennAllein) {
        angefordert = true
        selbst = await u.umschaltenWennAllein(w).catch(() => false)
        if (!selbst) angefordert = false
      }
      if (!selbst) bereit(w)
    }
    reg.addEventListener("updatefound", () => {
      const neu = reg.installing
      if (!neu) return
      neu.addEventListener("statechange", () => {
        if (neu.state === "installed" && c.controller) bereit(neu)
      })
    })
    u.beiSichtbar(() => { void reg.update().catch(() => undefined) })
  }

  /** Der Knopf „Neu laden". */
  function jetzt(): void {
    if (!u) return
    if (wartend) { angefordert = true; wartend.postMessage({ type: "SKIP_WAITING" }); return }
    if (stufe === "aktiv") u.neuLaden()
  }

  return {
    zustand: (): Stufe => stufe,
    abonniere: (cb: () => void) => { abos.add(cb); return () => { abos.delete(cb) } },
    registriere,
    jetzt,
  }
}

export type Aktualisierung = ReturnType<typeof erzeugeAktualisierung>

function browserUmgebung(): SwUmgebung | null {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null
  if (location.protocol.indexOf("http") !== 0) return null
  return {
    container: navigator.serviceWorker,
    neuLaden: () => location.reload(),
    beiSichtbar: (cb) => document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") cb()
    }),
    umschaltenWennAllein: (w) => new Promise<boolean>((fertig) => {
      const kanal = new MessageChannel()
      const uhr = setTimeout(() => fertig(false), 3000)
      kanal.port1.onmessage = (e: MessageEvent<{ allein?: unknown }>) => { clearTimeout(uhr); fertig(e.data?.allein === true) }
      w.postMessage({ type: "SKIP_WAITING_ALLEIN" }, [kanal.port2])
    }),
  }
}

/** Die eine Instanz des Programms (registriert in `main.tsx`, nur im Bau). */
export const aktualisierung = erzeugeAktualisierung(browserUmgebung())
