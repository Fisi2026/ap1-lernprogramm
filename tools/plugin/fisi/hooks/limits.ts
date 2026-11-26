/* fisi/hooks/limits.ts - Messung von Kontext und Kontolimits fuer das Modell (BUILD_LOG 137).
   Gemessen 11.10.2026: In Cloud-Chats der Desktop-App zeichnet die App weder $.ui.status noch Toast
   noch den Balken ueber dem Prompt - darum nur Text fuer das Modell, keine Anzeige.
   - Jeder Nutzer-Prompt bekommt eine Zeile "[limits] ..." als unsichtbaren Kontext.
   - Nach Tool-Ergebnissen nur, wenn sich ein Wert um >= SCHRITT bewegt hat (haengt hinten an,
     der Prompt-Cache bleibt).
   - Erreicht ein Wert eine Schwelle, kommt eine Zeile "[limits] SCHWELLE ..." - nur dann zeigt der
     Chat dem Nutzer die Werte (Nutzer-Entscheid 11.10.2026).
   E077 (12.10.2026): der Skill token-wache entfaellt - was zu tun ist, steht in der SCHWELLE-Zeile selbst. Sie kommt
   hoechstens 9x je Chat; eine Skill-Beschreibung stand dagegen in JEDEM Chat beider Konten im Systemtext. */
import type { Register, SessionUsage, SessionRateLimit } from 'claude-code'

/* Was der Hook von $ braucht (strukturell, damit die Probe ohne Engine laeuft). */
type Hof = {
  session: { usage: () => Promise<SessionUsage> }
  store: { get: (k: string) => Promise<unknown>; set: (k: string, v: unknown) => Promise<void>; delete: (k: string) => Promise<void>; keys: () => Promise<string[]> }
  clock: { now: () => Promise<number> }
}

/* 14.10.2026 (BUILD_LOG 176): Kontext-Schwellen 60/75/85 -> 25/40/60. Doku costs.md: „a one-line question in a session
   that has been open all day still draws usage for the whole conversation“ - am 14.10. lief EIN Chat ueber zehn Etappen
   bis 54 % (535k Tokens), jeder Aufruf trug diesen Ballast. */
/* 17.10.2026 (BUILD_LOG 213): Kontext-Schwellen in Tokens UEBER dem Startwert statt in Prozent. Gemessen 17.10.: die
   erste [limits]-Zeile eines frischen Chats stand bei 138k von 1000k (14 %) - Systemtext, Skills, Werkzeuge. 25 % hiess
   damit nur ~110k eigene Arbeit, und der Sockel schwankt je Konto und Werkzeugliste. Startwert = erste Messung mit Tokens. */
const SCHWELLEN: Record<string, number[]> = { '5h': [70, 85, 95], '7T': [70, 85, 95] }
const KONTEXT_K = [150, 250, 400]
let startK: number | undefined
/* 17.10.2026 (BUILD_LOG 215): Startwert und gemeldete Stufen liegen in $.store je Sitzung (Schluessel = startedAt).
   Gemessen 17.10. (BUILD_LOG 214, Mess-Mods zustandprobe/zustandprobe2): ein Container-Neustart - schon nach ~7 min
   Leerlauf - leert Modulvariablen UND $.state; $.store (Datei ~/.claude/plugins/store/fisi_synced-<hash>.json) bleibt,
   auch ueber eine Neuinstallation unter dem Namen fisi. startedAt bleibt bei Resume gleich (erster Start).
   ⚠️ Den Plugin-Namen „fisi" nie aendern: ein anderer Name bekommt einen leeren Store (gemessen). */
/* 17.10.2026 (BUILD_LOG 217): auch die noch NICHT zugestellten SCHWELLE-Zeilen (offen) liegen im Store. Gemessen 17.10.:
   7T 95 % fiel nach dem letzten Werkzeugaufruf einer Runde, `ueber` war gesichert, die Zeile nur im Speicher - der
   Container-Neustart 17:54 verschluckte sie. Jetzt: sichern bei jeder Aenderung, leeren erst nach der Zustellung. */
type Sitzung = { startK: number; ueber: string[]; unsicher?: boolean; offen?: string[] }
const PREFIX = 'sitzung:'
const ALT_MS = 7 * 24 * 3600 * 1000
/* Kein Eintrag, aber schon mehr als UNSICHER_K Tokens: Plugin mitten im Chat installiert - der Startwert ist dann nur
   der erste gesehene Wert und die Zeile sagt es (gesetzt, nicht gemessen). */
const UNSICHER_K = 200
let schluessel: string | undefined
let unsicher = false
let geladen: Promise<void> | undefined
const kNow = (u: SessionUsage) => (u.context.tokens ? Math.round(u.context.tokens / 1000) : undefined)
const SCHRITT = 5
/* 14.10.2026 (BUILD_LOG 174): ab ENG Prozent meldet ein Tool-Ergebnis schon bei 1 Punkt Bewegung. Gemessen:
   zwischen 84 und 87 % kam keine Zeile (SCHRITT 5), der Chat nannte dem Nutzer einen veralteten Wert. */
const ENG = 80
const schritt = (v: number) => (v >= ENG ? 1 : SCHRITT)
/* Was „sichern" heisst (frueher Skill token-wache, Abschnitt „Alarm"). */
const SICHERN = 'sichern (BUILD_LOG-Eintrag mit „Damit offen: …", Entscheide in entscheide/, voller check.sh, nur bei Gruen Commit + Push, dann dem Nutzer Stand und naechsten Griff melden)'

let letzte: SessionUsage | undefined
let gemeldet: Record<string, number> = {}
const ueber = new Set<string>()
let offen: string[] = []

const fenster = (u: SessionUsage, k: string): SessionRateLimit | undefined => u.rateLimits.find((r) => r.kind === k)
const werte = (u: SessionUsage): Record<string, number | undefined> => ({
  Kontext: u.context.percent,
  '5h': fenster(u, 'five_hour')?.percentUsed,
  '7T': fenster(u, 'seven_day')?.percentUsed,
})
const zeit = (iso?: string) => {
  if (!iso) return ''
  try {
    return ` (Reset ${new Date(iso).toLocaleString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })})`
  } catch {
    return ` (Reset ${iso.slice(5, 16).replace('T', ' ')} UTC)`
  }
}
const lade = ($: Hof) =>
  (geladen ??= (async () => {
    const u = await $.session.usage()
    schluessel = PREFIX + u.startedAt
    const r = (await $.store.get(schluessel)) as Sitzung | undefined
    if (r && typeof r.startK === 'number') {
      startK ??= r.startK
      unsicher = r.unsicher === true
      for (const x of r.ueber ?? []) ueber.add(x)
      for (const x of r.offen ?? []) if (!offen.includes(x)) offen.push(x)
    }
    const jetzt = await $.clock.now()
    for (const key of await $.store.keys()) {
      if (key.startsWith(PREFIX) && Number(key.slice(PREFIX.length)) + ALT_MS < jetzt) await $.store.delete(key)
    }
  })().catch(() => undefined))
const sichere = async ($: Hof) => {
  if (!schluessel || startK === undefined) return
  const s: Sitzung = { startK, ueber: [...ueber], unsicher, offen }
  await $.store.set(schluessel, s).catch(() => undefined)
}
const zeile = (u: SessionUsage) => {
  const c = u.context, h5 = fenster(u, 'five_hour'), t7 = fenster(u, 'seven_day')
  return [
    `Kontext ${c.percent ?? '?'}%` + (c.tokens ? ` (${Math.round(c.tokens / 1000)}k/${Math.round(c.window / 1000)}k, Start+${Math.round(c.tokens / 1000) - (startK ?? Math.round(c.tokens / 1000))}k${unsicher ? ', Start unsicher' : ''})` : ''),
    h5 ? `5h ${h5.percentUsed}%${zeit(h5.resetsAt)}` : '5h ?',
    t7 ? `7T ${t7.percentUsed}%${zeit(t7.resetsAt)}` : '7T ?',
  ].join(' · ')
}
/* Gibt true zurueck, wenn sich Startwert oder gemeldete Stufen geaendert haben (dann sichern). */
const pruefe = (u: SessionUsage): boolean => {
  let neu = false
  const k = kNow(u)
  if (k !== undefined) {
    if (startK === undefined) {
      startK = k
      unsicher = k > UNSICHER_K
      neu = true
    }
    KONTEXT_K.forEach((s, i) => {
      if (k - (startK ?? k) < s || ueber.has('K' + s)) return
      ueber.add('K' + s)
      neu = true
      const was = i === 2 ? `JETZT ${SICHERN}, dann den Chatwechsel vorschlagen.` : i === 1 ? `Keine neue Etappe beginnen: laufende abschliessen, ${SICHERN}, Chatwechsel vorschlagen.` : 'Nach der laufenden Etappe (Commit + Push) den Chatwechsel vorschlagen.'
      offen.push(`[limits] SCHWELLE Kontext Start+${s}k erreicht (jetzt ${k}k, Start ${startK}k) - dem Nutzer die Werte zeigen. ${was}`)
    })
  }
  const w = werte(u)
  for (const [name, stufen] of Object.entries(SCHWELLEN)) {
    const v = w[name]
    if (v === undefined) continue
    for (const s of stufen) {
      if (v < s || ueber.has(name + s)) continue
      ueber.add(name + s)
      neu = true
      const was = (s >= 95 ? `SOFORT ${SICHERN}; keine neue Aufgabe - ein neuer Chat hilft nicht (gleiches Konto).` : s >= 85 ? `An sicherem Punkt ${SICHERN}; Aufgabe teilen oder bis zum Reset warten.` : 'Nur melden.')
      offen.push(`[limits] SCHWELLE ${name} ${s}% erreicht (jetzt ${v}%) - dem Nutzer die Werte zeigen. ${was}`)
    }
  }
  return neu
}
const merke = (u: SessionUsage) => {
  const w = werte(u)
  gemeldet = Object.fromEntries(Object.entries(w).map(([k, v]) => [k, v ?? -100]))
}

export const register: Register = (on) => {
  on('session.measure', async ($, e, next) => {
    letzte = { startedAt: 0, context: e.context, rateLimits: e.rateLimits, cost: e.cost }
    await lade($)
    if (pruefe(letzte)) await sichere($)
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    const u = letzte ?? (await $.session.usage().catch(() => undefined))
    if (!u) return next(e)
    await lade($)
    if (pruefe(u)) await sichere($)
    merke(u)
    const extra = [`[limits] ${zeile(u)}`, ...offen]
    if (offen.length > 0) {
      offen = []
      await sichere($)
    }
    return next({ ...e, context: [...(e.context ?? []), extra.join('\n')] })
  }).catch(($, e, next) => next(e))

  on('tool.call', async ($, e, next) => {
    const r = await next(e)
    /* 14.10.2026 (BUILD_LOG 174): Werkzeugaufrufe eines Hilfsagenten (agentId gesetzt) bekommen KEINE Zeile -
       sonst landet eine SCHWELLE im Kontext des Agenten, wird dort verbraucht und erreicht den Hauptchat nie
       (gemessen: SCHWELLE 7T 85 % kam am 14.10. nicht an, waehrend ein Sonnet-Agent lief). */
    if (e.agentId !== undefined) return r
    if (!letzte || r.deny !== undefined) return r
    await lade($)
    const w = werte(letzte)
    const bewegt = Object.entries(w).some(([k, v]) => v !== undefined && v - (gemeldet[k] ?? -100) >= schritt(v))
    if (!bewegt && offen.length === 0) return r
    merke(letzte)
    const extra = [`[limits] ${zeile(letzte)}`, ...offen]
    if (offen.length > 0) {
      offen = []
      await sichere($)
    }
    return { ...r, context: [...(r.context ?? []), extra.join('\n')] } as typeof r
  }).catch(($, e, next) => next(e))
}
