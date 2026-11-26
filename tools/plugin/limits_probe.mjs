// tools/plugin/limits_probe.mjs - Selbsttest des Hook-Moduls fisi/hooks/limits.ts (BUILD_LOG 218).
// Warum: limits.ts wurde am 17.10.2026 dreimal geaendert (1.3.10/1.3.11/1.3.13) und dreimal mit Wegwerf-Proben
// in _to_delete/ (gitignored) von Auge geprueft; der Fehler "SCHWELLE geht beim Neustart verloren" fiel erst im
// Betrieb auf. Laeuft ueber Waechter 4e15 in check.sh (doku + voll + CI), ~0,25 s.
// Grenze: $ ist nachgebaut (Store als Map, frische Modulkopie = Container-Neustart). Engine-Verhalten
// (Dateiname im Store, Ueberleben des Neustarts) ist in BUILD_LOG 214 von Hand gemessen, nicht hier.
// Aufruf: node tools/plugin/limits_probe.mjs   (rc 0 = alle Faelle ok, rc 1 = Liste der Abweichungen)
import { pathToFileURL, fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ziel = pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), 'fisi', 'hooks', 'limits.ts')).href
const fehler = []
let faelle = 0
const pruefe = (name, bed, info) => {
  faelle++
  if (!bed) fehler.push(`${name}${info ? ' - ' + String(info).slice(0, 160) : ''}`)
}
const machStore = (kaputt = false) => {
  const m = new Map()
  const tu = (f) => async (...a) => {
    if (kaputt) throw new Error('store kaputt')
    return f(...a)
  }
  return {
    m,
    api: {
      get: tu(async (k) => m.get(k)),
      set: tu(async (k, v) => { m.set(k, JSON.parse(JSON.stringify(v))) }),
      delete: tu(async (k) => { m.delete(k) }),
      keys: tu(async () => [...m.keys()]),
    },
  }
}
const JETZT = 1792240000000
const dollar = (sa, store) => ({
  session: { usage: async () => ({ startedAt: sa, context: { window: 1e6 }, rateLimits: [] }) },
  store: store.api,
  clock: { now: async () => JETZT },
})
const mess = (t, p7) => ({
  context: { percent: Math.round(t / 10), tokens: t * 1000, window: 1e6 },
  rateLimits: [{ kind: 'seven_day', percentUsed: p7 }],
  changed: ['context'],
})
let n = 0
// frische Modulkopie = Container-Neustart (Modulvariablen leer, Store bleibt)
const lade = async () => {
  const m = await import(ziel + '?v=' + n++)
  const h = {}
  m.register((ev, f) => { h[ev] = f; return { catch() {} } })
  return h
}
const id = (e) => e
const prompt = async (h, $) => (await h['prompt.submit']($, { context: [] }, id)).context.join('\n')
const schritt = async (h, $, t, p) => { await h['session.measure']($, mess(t, p), id); return prompt(h, $) }
const erste = (z) => z.split('\n')[0]

// A: Schwellen ab Startwert; F: alte Eintraege werden geloescht
const S = machStore()
S.m.set('sitzung:1', { startK: 1, ueber: [] })
const SA = 1792228259798
let h = await lade()
let z = await schritt(h, dollar(SA, S), 138, 50)
pruefe('A Start', z.includes('(138k/1000k, Start+0k)'), erste(z))
z = await schritt(h, dollar(SA, S), 290, 71)
pruefe('A Start+150k', z.includes('SCHWELLE Kontext Start+150k'), z)
pruefe('A 7T 70', z.includes('SCHWELLE 7T 70%'), z)
pruefe('F alter Eintrag geloescht', !S.m.has('sitzung:1'))
// B: Neustart mit demselben Store - Start bleibt, keine Wiederholung
h = await lade()
z = await schritt(h, dollar(SA, S), 300, 72)
pruefe('B Start nach Neustart', z.includes('Start+162k') && !z.includes('unsicher'), erste(z))
pruefe('B keine Wiederholung', !z.includes('SCHWELLE'), z)
z = await schritt(h, dollar(SA, S), 390, 86)
pruefe('B Start+250k', z.includes('SCHWELLE Kontext Start+250k'), z)
pruefe('B 7T 85', z.includes('SCHWELLE 7T 85%'), z)
// E: Schwelle faellt nach der letzten Zustellung, dann Neustart (Befund BUILD_LOG 216)
await h['session.measure'](dollar(SA, S), mess(400, 95), id)
pruefe('E offen im Store', (S.m.get('sitzung:' + SA)?.offen ?? []).some((x) => x.includes('7T 95%')))
h = await lade()
z = await prompt(h, dollar(SA, S))
pruefe('E nach Neustart zugestellt', z.includes('SCHWELLE 7T 95%'), z)
pruefe('E offen geleert', (S.m.get('sitzung:' + SA)?.offen ?? []).length === 0)
h = await lade()
z = await prompt(h, dollar(SA, S))
pruefe('E keine zweite Zustellung', !z.includes('SCHWELLE'), z)
// C: andere Sitzung - eigener Start, eigene Stufen
h = await lade()
z = await schritt(h, dollar(1792299999999, S), 140, 86)
pruefe('C eigener Start', z.includes('(140k/1000k, Start+0k)'), erste(z))
pruefe('C eigene Stufen', z.includes('SCHWELLE 7T 70%') && z.includes('SCHWELLE 7T 85%'), z)
// D: Einbau mitten im Chat (> 200k ohne Eintrag)
h = await lade()
z = await schritt(h, dollar(1792300000001, S), 320, 50)
pruefe('D Start unsicher', z.includes('Start unsicher'), erste(z))
// G: Store wirft - der Hook arbeitet im Speicher weiter
const K = machStore(true)
h = await lade()
z = await schritt(h, dollar(SA, K), 138, 50)
pruefe('G Store kaputt: Zeile kommt', z.includes('[limits] Kontext'), z)
z = await schritt(h, dollar(SA, K), 290, 71)
pruefe('G Store kaputt: Schwelle kommt', z.includes('SCHWELLE Kontext Start+150k'), z)
// H: Werkzeugaufruf eines Hilfsagenten bekommt keine Zeile (BUILD_LOG 174)
h = await lade()
await h['session.measure'](dollar(SA, machStore()), mess(500, 99), id)
const r = await h['tool.call'](dollar(SA, machStore()), { agentId: 'a1' }, async () => ({}))
pruefe('H Hilfsagent ohne Zeile', r.context === undefined, JSON.stringify(r))

if (fehler.length) {
  console.log(`[limits_probe] ${fehler.length} von ${faelle} Faellen falsch:`)
  for (const f of fehler) console.log('  - ' + f)
  process.exit(1)
}
console.log(`[limits_probe] ${faelle} Faelle ok`)
