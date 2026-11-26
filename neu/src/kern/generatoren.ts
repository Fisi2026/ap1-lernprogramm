/* ============================================================================
   N34 T5 (E50, 26.09.2026): DIE RECHENAUFGABEN-GENERATOREN AUS `logik.js`
   Uebernommen aus `referenz/logik.js` (Z. 1322-1745): Uebertragungszeit, RAID, Subnetting,
   Netzplan (Vorwaerts-/Rueckwaertsrechnung), Gantt (frueheste Terminplanung), Zahlensysteme,
   Datenmengen und die Registry `GENERATOREN` – Regeln UND Kommentare wortgleich, typisiert.
   Die Szenarien und Zahlensysteme kommen aus T1 (`tabellen/szenarien.ts`), der Zufall aus
   T3 (`zufall.ts`). Schnitt: Nutzer-Entscheid 26.09. abends (zwei Dateien, Aufrufer in T5).
   ⚠️ Mutation wie in logik.js: `netzplanBerechne` schreibt faz/fez/saz/sez/gp/fp/nachfolger IN
      die uebergebenen Vorgaenge und gibt dieselben Objekte zurueck; `genNetzplan` liest danach
      die Namen ueber `vg` – beides haengt daran. `ganttBerechne` dagegen arbeitet auf Kopien.
   Gehalten von `generatoren.gleichheit.test.ts` gegen `referenz/logik.js`.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49).
   ============================================================================ */
import { GANTT_SZENARIEN, NETZPLAN_SZENARIEN, ZAHLENSYSTEME } from "./tabellen/szenarien.ts";
import { da } from "./da.ts";
import { pick, type Zufall } from "./zufall.ts";

/** Eine gewuerfelte Aufgabe, so wie logik.js sie liefert. */
export interface Generatoraufgabe {
  typ: string; generator: string; frage?: string; hinweis?: string;
  antwort?: string[]; antwort2?: string[][]; einheit?: string; weg?: string[];
  szenario?: unknown; daten?: unknown; [weiteres: string]: unknown;
}
export interface NetzplanEingang { id: string; dauer: number; vorgaenger: string[]; [weiteres: string]: unknown }
export interface NetzplanKnoten extends NetzplanEingang {
  name?: string; faz: number; fez: number; saz: number; sez: number; gp: number; fp: number; nachfolger: string[];
}
export interface GanttEingang { id: string; name: string; dauer: number; vorgaenger: string[] }
export interface GanttKnoten extends GanttEingang { start: number; ende: number; spStart: number; spEnde: number; puffer: number }

/* =====================================================================
   RECHENAUFGABEN-GENERATOREN (immer mit Schritt-für-Schritt-Lösungsweg)
   ===================================================================== */

/* ---- Übertragungszeit ---- */
export function genUebertragung(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  const kombis: Array<{ g: number; r: number; sek: number }> = [];
  const groessenGB = [0.5, 1, 2, 2.5, 4, 5, 8, 10, 20, 25];
  const raten = [8, 10, 16, 20, 25, 40, 50, 80, 100, 200, 250, 400, 500, 1000];
  groessenGB.forEach((g) => {
    raten.forEach((ra) => {
      const sek = g * 8000 / ra;
      if (sek === Math.floor(sek) && sek >= 20 && sek <= 4000) kombis.push({ g, r: ra, sek });
    });
  });
  const k = da(pick(kombis, r), "Datenmengen-Kombination");   /* aus festen Listen gebaut, nie leer */
  const mbit = k.g * 8000;
  const min = Math.floor(k.sek / 60), rest = k.sek % 60;
  const zeitText = k.sek + " s" + (k.sek >= 60 ? " (= " + min + " min" + (rest ? " " + rest + " s" : "") + ")" : "");
  return {
    typ: "generator", generator: "uebertragung",
    frage: "Eine Datei von " + String(k.g).replace(".", ",") + " GB soll über eine Leitung mit " + k.r +
      " Mbit/s übertragen werden (dezimale Einheiten: 1 GB = 1000 MB). Wie lange dauert die Übertragung in Sekunden?",
    antwort: [String(k.sek)],
    einheit: "Sekunden",
    weg: [
      "Datenmenge in Megabit umrechnen: " + String(k.g).replace(".", ",") + " GB × 1000 = " + (k.g * 1000) + " MB; × 8 = " + mbit + " Mbit",
      "Zeit = Datenmenge ÷ Übertragungsrate = " + mbit + " Mbit ÷ " + k.r + " Mbit/s = " + k.sek + " s",
      "Ergebnis: " + zeitText
    ]
  };
}

/* ---- RAID-Nettokapazität ---- */
export function genRaid(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  const s = pick([500, 1000, 2000, 4000], r); // GB je Platte
  const typ = pick(["RAID 0", "RAID 1", "RAID 5", "RAID 10"], r);
  let n: number, netto: number, formel: string;
  if (typ === "RAID 0") { n = pick([2, 3, 4], r); netto = n * s; formel = "n × Kapazität = " + n + " × " + s + " GB"; }
  else if (typ === "RAID 1") { n = 2; netto = s; formel = "Kapazität einer Platte (Spiegelung) = " + s + " GB"; }
  else if (typ === "RAID 5") { n = pick([3, 4, 5, 6], r); netto = (n - 1) * s; formel = "(n − 1) × Kapazität = (" + n + " − 1) × " + s + " GB"; }
  else { n = pick([4, 6, 8], r); netto = n / 2 * s; formel = "(n ÷ 2) × Kapazität = (" + n + " ÷ 2) × " + s + " GB"; }
  const nettoTB = netto / 1000;
  const akz = [String(netto)];
  if (nettoTB === Math.floor(nettoTB)) akz.push(String(nettoTB) + "tb");
  return {
    typ: "generator", generator: "raid",
    hinweis: "RAID-Details sind laut Katalog 2. Auflage AP2-Stoff – hier als Zusatzübung.",
    frage: "Ein " + typ + "-Verbund besteht aus " + n + " Festplatten mit je " + s +
      " GB. Wie groß ist die nutzbare Nettokapazität in GB?",
    antwort: akz,
    einheit: "GB",
    weg: [
      typ + ": " + formel,
      "Nettokapazität = " + netto + " GB" + (nettoTB === Math.floor(nettoTB) ? " (= " + nettoTB + " TB)" : "")
    ]
  };
}

/* ---- Subnetting (bleibt innerhalb eines /24 – IHK-typisch) ---- */
export function genSubnetting(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  const basis = pick(["192.168.10.0", "192.168.50.0", "172.16.5.0", "10.0.3.0"], r);
  const variante = pick(["teilen", "kteSubnetz", "maskeFuerHosts"], r);
  const o = basis.split(".").map(Number);
  if (variante === "maskeFuerHosts") {
    const hosts = pick([10, 14, 20, 25, 30, 50, 60, 100, 120], r);
    let bits = 1; while (Math.pow(2, bits) - 2 < hosts) bits++;
    const prefix = 32 - bits;
    const maskeOktett = 256 - Math.pow(2, bits);
    const maske = "255.255.255." + maskeOktett;
    const nutzbar = Math.pow(2, bits) - 2;
    return {
      typ: "generator", generator: "subnetting",
      frage: "Ein Subnetz soll mindestens " + hosts + " Hosts aufnehmen. Welche Subnetzmaske (dezimal) ist die KLEINSTE passende? Und wie viele Hostadressen sind damit nutzbar? (Antwort 1: Maske, Antwort 2: Anzahl)",
      antwort2: [[maske, "/" + prefix], [String(nutzbar)]],
      weg: [
        "Benötigte Hostbits: 2^h − 2 ≥ " + hosts + " → h = " + bits + " (2^" + bits + " − 2 = " + nutzbar + ")",
        "Präfix = 32 − " + bits + " = /" + prefix,
        "Maske: letztes Oktett = 256 − 2^" + bits + " = " + maskeOktett + " → " + maske,
        "Nutzbare Hosts: 2^" + bits + " − 2 = " + nutzbar
      ]
    };
  }
  if (variante === "teilen") {
    const x = pick([2, 4, 8, 16], r);
    const addBits = Math.log2(x);
    const prefix2 = 24 + addBits;
    const size = 256 / x;
    const maskeOkt = 256 - size;
    const nutzbar2 = size - 2;
    return {
      typ: "generator", generator: "subnetting",
      frage: "Das Netz " + basis + "/24 soll in " + x + " gleich große Subnetze geteilt werden. Wie lautet das neue Präfix (z. B. /26) und wie viele nutzbare Hostadressen hat jedes Subnetz? (Antwort 1: Präfix, Antwort 2: Anzahl)",
      antwort2: [["/" + prefix2, String(prefix2)], [String(nutzbar2)]],
      weg: [
        x + " Subnetze → " + addBits + " zusätzliche Netzbits (2^" + addBits + " = " + x + ")",
        "Neues Präfix: /24 + " + addBits + " = /" + prefix2 + " (Maske 255.255.255." + maskeOkt + ")",
        "Blockgröße: 256 ÷ " + x + " = " + size + " Adressen je Subnetz",
        "Nutzbar: " + size + " − 2 (Netz- und Broadcastadresse) = " + nutzbar2
      ]
    };
  }
  // k-tes Subnetz: Netz- und Broadcastadresse
  const x2 = pick([4, 8], r);
  const addB = Math.log2(x2);
  const size2 = 256 / x2;
  const k = 1 + Math.floor(r() * x2); // 1-basiert
  const netzOkt = (k - 1) * size2;
  const bcOkt = netzOkt + size2 - 1;
  const netz = o[0] + "." + o[1] + "." + o[2] + "." + netzOkt;
  const bc = o[0] + "." + o[1] + "." + o[2] + "." + bcOkt;
  return {
    typ: "generator", generator: "subnetting",
    frage: "Das Netz " + basis + "/24 wird in " + x2 + " gleich große Subnetze geteilt. Bestimmen Sie für das " + k +
      ". Subnetz die Netzadresse und die Broadcastadresse. (Antwort 1: Netzadresse, Antwort 2: Broadcastadresse)",
    antwort2: [[netz], [bc]],
    weg: [
      x2 + " Subnetze → Präfix /" + (24 + addB) + ", Blockgröße 256 ÷ " + x2 + " = " + size2,
      "Subnetz Nr. " + k + " beginnt bei Oktett (" + k + " − 1) × " + size2 + " = " + netzOkt + " → Netzadresse " + netz,
      "Broadcast = Netzadresse + Blockgröße − 1 = ." + bcOkt + " → " + bc,
      "Nutzbare Hosts dazwischen: ." + (netzOkt + 1) + " bis ." + (bcOkt - 1)
    ]
  };
}

/* ---- Netzplan (Vorwärts-/Rückwärtsrechnung) ---- */
export function netzplanBerechne(vorgaenge: NetzplanEingang[]): { vorgaenge: NetzplanKnoten[]; projektdauer: number; kritisch: string[] } {
  // vorgaenge: [{id, dauer, vorgaenger:[ids]}] – topologisch sortierbar
  /* N38 Q1: BEGRUENDET STEHEN GELASSEN (auch `vg` in genNetzplan und `as GanttKnoten` in ganttBerechne):
     die Knoten werden IN PLACE ergaenzt (faz, fez, …) – `genNetzplan` liest danach die Namen an denselben
     Objekten. Ein Umbau auf neue Objekte aendert, was der Gleichheitstest vergleicht; eigener Schritt. */
  const vs = vorgaenge as NetzplanKnoten[];
  const map: Record<string, NetzplanKnoten> = {}; vs.forEach((v) => { map[v.id] = v; });
  const knoten = (id: string): NetzplanKnoten => da(map[id], "Netzplan-Vorgang " + id);
  const offen = vs.slice(); let guard = 0;
  while (offen.length && guard++ < 1000) {          // Vorwärtsrechnung
    for (const [i, v] of offen.entries()) {       /* N38 Q1: nach dem splice folgt sofort break */
      if (v.vorgaenger.every((p) => knoten(p).fez != null)) {
        v.faz = v.vorgaenger.length ? Math.max(...v.vorgaenger.map((p) => knoten(p).fez)) : 0;
        v.fez = v.faz + v.dauer;
        offen.splice(i, 1); break;
      }
    }
  }
  const dauer = Math.max(...vs.map((v) => v.fez));
  vs.forEach((v) => {                  // Nachfolger ermitteln
    v.nachfolger = vs.filter((n) => n.vorgaenger.indexOf(v.id) >= 0).map((n) => n.id);
  });
  const offen2 = vs.slice(); guard = 0;
  while (offen2.length && guard++ < 1000) {         // Rückwärtsrechnung
    for (const [j, w] of offen2.entries()) {
      if (w.nachfolger.every((n) => knoten(n).saz != null)) {
        w.sez = w.nachfolger.length ? Math.min(...w.nachfolger.map((n) => knoten(n).saz)) : dauer;
        w.saz = w.sez - w.dauer;
        offen2.splice(j, 1); break;
      }
    }
  }
  vs.forEach((v) => {
    v.gp = v.saz - v.faz;
    v.fp = v.nachfolger.length ? Math.min(...v.nachfolger.map((n) => knoten(n).faz)) - v.fez : dauer - v.fez;
  });
  const kritisch = vs.filter((v) => v.gp === 0).map((v) => v.id);
  return { vorgaenge: vs, projektdauer: dauer, kritisch };
}

/* N38 Q1: die Rueckgabetypen von genNetzplan/genGantt sind geschaerft – vorher kam `Generatoraufgabe`
   (daten: unknown) heraus, und `netzplan.ts`/`gantt.ts` behaupteten die Form mit `as unknown as`. */
type Szenario = { titel: string; text: string };
type BenannterKnoten = NetzplanKnoten & { name: string };
export type NetzplanGeneratoraufgabe = Generatoraufgabe & {
  szenario: Szenario; weg: string[];
  daten: { vorgaenge: BenannterKnoten[]; projektdauer: number; kritisch: string[] };
};
export type GanttGeneratoraufgabe = Generatoraufgabe & {
  szenario: Szenario; daten: ReturnType<typeof ganttBerechne>;
};
/** Jeder Knoten traegt nach der Benennung einen Namen – geprueft statt behauptet, ohne Kopie. */
function benannt(l: NetzplanKnoten[]): BenannterKnoten[] {
  if (!l.every((v): v is BenannterKnoten => typeof v.name === "string")) throw new Error("[kern] fehlt: Netzplan-Name");
  return l;
}

export function genNetzplan(rng?: Zufall): NetzplanGeneratoraufgabe {
  const r = rng ?? Math.random;
  function d(): number { return 1 + Math.floor(r() * 8); } // 1..8 Tage
  let vg: NetzplanKnoten[], res: ReturnType<typeof netzplanBerechne>, puffer: NetzplanKnoten[], versuche = 0;
  do {                                             // Struktur: A,B parallel -> C(A), D(B) -> E(C,D) -> F(E)
    vg = [
      { id: "A", dauer: d(), vorgaenger: [] },
      { id: "B", dauer: d(), vorgaenger: [] },
      { id: "C", dauer: d(), vorgaenger: ["A"] },
      { id: "D", dauer: d(), vorgaenger: ["B"] },
      { id: "E", dauer: d(), vorgaenger: ["C", "D"] },
      { id: "F", dauer: d(), vorgaenger: ["E"] }
    ] as NetzplanKnoten[];
    res = netzplanBerechne(vg);
    puffer = res.vorgaenge.filter((v) => v.gp > 0);
  } while ((puffer.length === 0 || res.kritisch.length >= 6) && versuche++ < 50);
  const szenario = da(pick(NETZPLAN_SZENARIEN, r), "Netzplan-Szenario");   /* feste, nicht leere Liste */
  const namen = szenario.namen as Record<string, string>;
  res.vorgaenge.forEach((v) => { v.name = namen[v.id] || v.id; });
  const pv = da(puffer.length ? puffer[Math.floor(r() * puffer.length)] : res.vorgaenge[0], "Netzplan-Vorgang mit Puffer");
  const tabelle = vg.map((v) => {
    return v.id + " – " + (v.name || v.id) + " (Dauer " + v.dauer + ", Vorgänger: " + (v.vorgaenger.join(", ") || "–") + ")";
  });
  const weg = ["Vorwärtsrechnung (FAZ = max. FEZ der Vorgänger, FEZ = FAZ + Dauer):"];
  res.vorgaenge.forEach((v) => { weg.push("  " + v.id + ": FAZ " + v.faz + ", FEZ " + v.fez); });
  weg.push("Projektdauer = größter FEZ = " + res.projektdauer + " Tage");
  weg.push("Rückwärtsrechnung (SEZ = min. SAZ der Nachfolger, SAZ = SEZ − Dauer):");
  res.vorgaenge.forEach((v) => { weg.push("  " + v.id + ": SAZ " + v.saz + ", SEZ " + v.sez + ", GP " + v.gp); });
  weg.push("Kritischer Weg (GP = 0): " + res.kritisch.join(" → "));
  weg.push("Gesamtpuffer von " + pv.id + ": GP = SAZ − FAZ = " + pv.saz + " − " + pv.faz + " = " + pv.gp);
  return {
    typ: "generator", generator: "netzplan",
    szenario,
    frage: szenario.text + "\n\n" + tabelle.join("\n") +
      "\n\nBerechnen Sie: (1) die Projektdauer in Tagen, (2) den Gesamtpuffer von Vorgang " + pv.id + ".",
    antwort2: [[String(res.projektdauer)], [String(pv.gp)]],
    daten: { ...res, vorgaenge: benannt(res.vorgaenge) },
    weg
  };
}

/* ---- Gantt / Balkenplan: früheste Terminplanung (Ende-Start-Beziehung, Tag 1 = Projektstart) ---- */
export function ganttBerechne(vg: GanttEingang[]): { vorgaenge: GanttKnoten[]; projektdauer: number; kritisch: string[] } {
  type Arbeit = GanttEingang & Partial<Omit<GanttKnoten, keyof GanttEingang>>;
  const map: Record<string, Arbeit> = {};
  vg.forEach((v) => { map[v.id] = { id: v.id, name: v.name, dauer: v.dauer, vorgaenger: v.vorgaenger.slice() }; });
  const knoten = (id: string): Arbeit => da(map[id], "Gantt-Vorgang " + id);
  // Vorwärts: frühester Start-/End-Tag (Start = 1 wenn kein Vorgänger, sonst max. End-Tag der Vorgänger + 1)
  let offen = vg.map((v) => v.id), guard = 0;
  while (offen.length && guard++ < 300) {
    offen = offen.filter((id) => {
      const v = knoten(id);
      const enden = v.vorgaenger.map((p) => knoten(p).ende);
      if (!enden.every((e): e is number => e != null)) return true;
      let s = 1;
      enden.forEach((e) => { s = Math.max(s, e + 1); });
      v.start = s; v.ende = s + v.dauer - 1;
      return false;
    });
  }
  let projektdauer = 0;
  vg.forEach((v) => { projektdauer = Math.max(projektdauer, knoten(v.id).ende ?? NaN); });   /* wie vorher: ohne Ende NaN */
  // Nachfolger bestimmen
  const nachf: Record<string, string[]> = {}; vg.forEach((v) => { nachf[v.id] = []; });
  vg.forEach((v) => { v.vorgaenger.forEach((p) => { da(nachf[p], "Gantt-Vorgaenger " + p).push(v.id); }); });
  // Rückwärts: spätester Start-/End-Tag und Puffer
  let offen2 = vg.map((v) => v.id); guard = 0;
  while (offen2.length && guard++ < 300) {
    // oxlint-disable-next-line eslint/no-loop-func -- filter laeuft synchron in derselben Runde; projektdauer aendert sich in der Schleife nicht
    offen2 = offen2.filter((id) => {
      const v = knoten(id), starts = da(nachf[id], "Gantt-Nachfolger von " + id).map((s) => knoten(s).spStart);
      if (!starts.every((st): st is number => st != null)) return true;
      let e = projektdauer;
      starts.forEach((st) => { e = Math.min(e, st - 1); });
      v.spEnde = e; v.spStart = e - v.dauer + 1; v.puffer = v.spStart - (v.start ?? NaN);   /* wie vorher: ohne Start NaN */
      return false;
    });
  }
  const vorgaenge = vg.map((v) => {
    const mm = knoten(v.id);
    return { id: mm.id, name: mm.name, dauer: mm.dauer, vorgaenger: mm.vorgaenger, start: mm.start, ende: mm.ende, spStart: mm.spStart, spEnde: mm.spEnde, puffer: mm.puffer } as GanttKnoten;
  });
  const kritisch = vorgaenge.filter((v) => v.puffer === 0).map((v) => v.id);
  return { vorgaenge, projektdauer, kritisch };
}
export function genGantt(rng?: Zufall): GanttGeneratoraufgabe {
  const r = rng ?? Math.random;
  const sz = da(pick(GANTT_SZENARIEN, r), "Gantt-Szenario");
  const res = ganttBerechne(sz.vorgaenge.map((v) => ({ id: v.id, name: v.name, dauer: v.dauer, vorgaenger: v.vorgaenger.slice() })));
  return { typ: "gantt", generator: "gantt", szenario: { titel: sz.titel, text: sz.text }, daten: res };
}

/* ---- Zahlensystem-Umrechnungen (Dez/Bin/Okt/Hex, beide Richtungen) ---- */
export function zahlNach(wert: number, basis: number): string { return wert.toString(basis).toUpperCase(); }
export function genZahlensysteme(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  type System = (typeof ZAHLENSYSTEME)[number];
  const von: System = da(pick(ZAHLENSYSTEME, r), "Zahlensystem");
  let nach: System = da(pick(ZAHLENSYSTEME, r), "Zahlensystem");
  while (nach.basis === von.basis) nach = da(pick(ZAHLENSYSTEME, r), "Zahlensystem");
  const wert = 16 + Math.floor(r() * 240);          // 16..255 – prüfungstypischer Bereich
  const quelle = zahlNach(wert, von.basis);
  const ziel = zahlNach(wert, nach.basis);
  const akzeptiert = [ziel, ziel.toLowerCase()];
  if (nach.basis === 2) akzeptiert.push(ziel.replace(/^(.{4})(.{1,4})$/, "$1 $2")); // mit Nibble-Leerzeichen
  if (nach.basis === 16) { akzeptiert.push("0x" + ziel); akzeptiert.push("0x" + ziel.toLowerCase()); }
  let weg: string[] = [];
  if (von.basis !== 10) weg.push(quelle + " (" + von.name + ") → Dezimal: Stellenwerte aufsummieren = " + wert);
  if (nach.basis !== 10) {
    const schritte: string[] = []; let w = wert;
    while (w > 0) { schritte.push(w + " ÷ " + nach.basis + " = " + Math.floor(w / nach.basis) + " Rest " + zahlNach(w % nach.basis, 16)); w = Math.floor(w / nach.basis); }
    weg.push("Dezimal " + wert + " → " + nach.name + " (fortgesetzte Division, Reste rückwärts lesen):");
    weg = weg.concat(schritte.map((s) => "  " + s));
  }
  weg.push("Ergebnis: " + quelle + " (" + von.name + ") = " + ziel + " (" + nach.name + ")");
  return {
    typ: "generator", generator: "zahlensysteme",
    frage: "Rechnen Sie um: " + quelle + " (" + von.name + ") = ? (" + nach.name + ")",
    antwort: akzeptiert,
    einheit: nach.name,
    weg
  };
}

/* ---- Datenmengen: binäre vs. dezimale Präfixe (GiB/GB, Bit/Byte) ---- */
export function genDatenmengen(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  const variante = pick(["gib2gb", "gb2gib", "mib2kib", "byte2bit", "gbit2gibit"], r);
  if (variante === "gib2gb") {
    const gib = pick([2, 4, 8, 16, 32], r);
    const mb = gib * 1024 * 1024 * 1024 / 1000000;   // in MB
    const gb = Math.round(mb / 10) / 100;             // GB mit 2 Nachkommastellen
    return {
      typ: "generator", generator: "datenmengen",
      frage: "Ein Speichermodul hat " + gib + " GiB (Gibibyte). Wie viel ist das in GB (Gigabyte, dezimal)? Runden Sie auf 2 Nachkommastellen.",
      antwort: [String(gb).replace(".", ","), String(gb)],
      einheit: "GB",
      weg: [
        "1 GiB = 1024³ Byte = 1.073.741.824 Byte; 1 GB = 1000³ Byte = 1.000.000.000 Byte",
        gib + " GiB = " + gib + " × 1.073.741.824 Byte = " + (gib * 1073741824).toLocaleString("de-DE") + " Byte",
        "÷ 1.000.000.000 = " + String(gb).replace(".", ",") + " GB"
      ]
    };
  }
  if (variante === "gb2gib") {
    const gb2 = pick([1, 2, 4, 8], r);
    const gib2 = Math.round(gb2 * 1000000000 / 1073741824 * 100) / 100;
    return {
      typ: "generator", generator: "datenmengen",
      frage: "Eine Festplatte ist mit " + gb2 + " GB (dezimal) beschriftet. Wie viel GiB (binär) zeigt das Betriebssystem ungefähr an? Runden Sie auf 2 Nachkommastellen.",
      antwort: [String(gib2).replace(".", ","), String(gib2)],
      einheit: "GiB",
      weg: [
        gb2 + " GB = " + gb2 + " × 1.000.000.000 Byte",
        "÷ 1024³ (= 1.073.741.824) = " + String(gib2).replace(".", ",") + " GiB",
        "Deshalb zeigt das Betriebssystem weniger an, als auf der Packung steht."
      ]
    };
  }
  if (variante === "mib2kib") {
    const mib = pick([2, 4, 8, 16, 64], r);
    const kib = mib * 1024;
    return {
      typ: "generator", generator: "datenmengen",
      frage: "Rechnen Sie um: " + mib + " MiB = ? KiB (binäre Präfixe).",
      antwort: [String(kib)],
      einheit: "KiB",
      weg: ["Binäre Präfixe: 1 MiB = 1024 KiB", mib + " × 1024 = " + kib + " KiB"]
    };
  }
  if (variante === "byte2bit") {
    const mb2 = pick([5, 10, 25, 50, 125], r);
    const mbit = mb2 * 8;
    return {
      typ: "generator", generator: "datenmengen",
      frage: "Eine Datei ist " + mb2 + " MB groß. Wie viele Mbit sind das? (1 Byte = 8 Bit)",
      antwort: [String(mbit)],
      einheit: "Mbit",
      weg: ["1 Byte = 8 Bit → MB × 8 = Mbit", mb2 + " × 8 = " + mbit + " Mbit"]
    };
  }
  const gbit = pick([1, 2, 4, 8], r);            // gbit2gibit
  const gibit = Math.round(gbit * 1000000000 / 1073741824 * 1000) / 1000;
  return {
    typ: "generator", generator: "datenmengen",
    frage: "Ein Netzwerk-Link überträgt " + gbit + " Gbit/s (dezimal). Wie viel Gibit/s (binär) sind das? Runden Sie auf 3 Nachkommastellen.",
    antwort: [String(gibit).replace(".", ","), String(gibit)],
    einheit: "Gibit/s",
    weg: [
      gbit + " Gbit = " + gbit + " × 10⁹ Bit",
      "÷ 2³⁰ (= 1.073.741.824) = " + String(gibit).replace(".", ",") + " Gibit",
      "Merke: Gbit (dezimal, 10⁹) ≠ Gibit (binär, 2³⁰)."
    ]
  };
}

/* =====================================================================
   K3 (PLAN_KLAUSUR3.md K3-E9/E38/E56, 24.11.2026): VIER NEUE ARTEN – NICHT AUS logik.js.
   ⛔ `genRaid` bleibt wortgleich (Gleichheitstest gegen das eingefrorene `referenz/logik.js`);
      RAID 6 und 0+1 kommen als eigene Art `raidk3`. Die neuen Arten stehen in GENERATOREN HINTER
      den sechs alten; `generatoren.gleichheit.test.ts` prueft die alten als Praefix, `K3_ARTEN` die neuen.
   Alle Zahlen sind so gewuerfelt, dass die Loesung ganzzahlig ist (normAntwort macht aus „1.000" „1").
   ===================================================================== */
const zahlAntwort = (n: number, einheit: string): string[] => [String(n), String(n) + einheit, String(n) + " " + einheit];

/* ---- RAID 0/1/5/6/10/0+1: Kapazitaet, Ausfalltoleranz, Mindestanzahl (K3-E38) ---- */
export const RAID_K3: Record<string, { min: number; n: number[]; netto: (n: number, s: number) => number; formel: string; tol: number; tolText: string }> = {
  "RAID 0": { min: 2, n: [2, 3, 4], netto: (n, s) => n * s, formel: "n × Kapazität", tol: 0, tolText: "keine Redundanz – fällt eine Platte aus, sind alle Daten weg" },
  "RAID 1": { min: 2, n: [2], netto: (_n, s) => s, formel: "Kapazität einer Platte (Spiegelung)", tol: 1, tolText: "eine Platte des Spiegels darf ausfallen" },
  "RAID 5": { min: 3, n: [3, 4, 5, 6], netto: (n, s) => (n - 1) * s, formel: "(n − 1) × Kapazität (eine Platte Parität)", tol: 1, tolText: "eine beliebige Platte darf ausfallen (verteilte Parität)" },
  "RAID 6": { min: 4, n: [4, 5, 6, 8], netto: (n, s) => (n - 2) * s, formel: "(n − 2) × Kapazität (zwei Platten Parität)", tol: 2, tolText: "zwei beliebige Platten dürfen ausfallen (doppelte Parität)" },
  "RAID 10": { min: 4, n: [4, 6, 8], netto: (n, s) => n / 2 * s, formel: "(n ÷ 2) × Kapazität (Stripe über Spiegel)", tol: 1, tolText: "garantiert eine; fällt je Spiegelpaar höchstens eine aus, auch mehr – nur nicht beide Platten EINES Paares" },
  "RAID 0+1": { min: 4, n: [4, 6, 8], netto: (n, s) => n / 2 * s, formel: "(n ÷ 2) × Kapazität (Spiegel über Stripes)", tol: 1, tolText: "garantiert eine; nach dem ersten Ausfall ist der ganze Stripe-Satz weg, jede weitere Platte im ANDEREN Satz zerstört alles – darum ist RAID 10 robuster" },
};
export function genRaidK3(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  const s = pick([1000, 2000, 4000, 8000], r);
  const typ = da(pick(Object.keys(RAID_K3), r), "RAID-Stufe");
  const d = RAID_K3[typ]!;
  const n = da(pick(d.n, r), "Plattenzahl");
  const netto = d.netto(n, s);
  const akz = zahlAntwort(netto, "gb");
  if (netto % 1000 === 0) akz.push(...zahlAntwort(netto / 1000, "tb"));
  return {
    typ: "generator", generator: "raidk3",
    hinweis: "RAID 6 und 0+1 sind laut Katalog AP2-Stoff – hier für die Klausur K3.",
    frage: "Ein " + typ + "-Verbund besteht aus " + n + " Festplatten mit je " + s + " GB. "
      + "(1) Nutzbare Nettokapazität in GB? (2) Wie viele Platten dürfen im ungünstigsten Fall ausfallen, ohne dass Daten verloren gehen? "
      + "(3) Wie viele Platten braucht " + typ + " mindestens?",
    antwort2: [akz, [String(d.tol)], [String(d.min)]],
    einheit: "GB · Platten · Platten",
    weg: [
      typ + ": Nettokapazität = " + d.formel + " = " + netto + " GB" + (netto % 1000 === 0 ? " (= " + netto / 1000 + " TB)" : ""),
      "Ausfalltoleranz: " + d.tol + " – " + d.tolText,
      "Mindestanzahl Platten für " + typ + ": " + d.min,
      "Merke: RAID ersetzt kein Backup – es schützt vor Plattenausfall, nicht vor Löschen, Ransomware oder Brand."
    ]
  };
}

/* ---- USV: Watt-Summe + Reserve, Umrechnung in VA (K3-E7/E37/E38) ---- */
const USV_GERAETE: Array<[string, number[]]> = [
  ["Server", [300, 350, 400, 450, 500]], ["Switch", [60, 80, 100, 120]], ["Firewall", [40, 50, 60]], ["NAS", [60, 80, 100]], ["Router", [20, 30, 40]],
];
export function genUsv(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  for (let versuch = 0; ; versuch++) {
    const anzServer = pick([1, 2], r) ?? 1;
    const teile: Array<[string, number]> = [];
    for (const [name, werte] of USV_GERAETE) {
      const k = name === "Server" ? anzServer : 1;
      for (let i = 0; i < k; i++) teile.push([k > 1 ? name + " " + (i + 1) : name, da(pick(werte, r), "USV-Geraet")]);
    }
    const summe = teile.reduce((a, t) => a + t[1], 0);
    const reserve = da(pick([20, 25, 30], r), "Reserve");
    const pf = da(pick([0.6, 0.7, 0.8], r), "Leistungsfaktor");
    const mitReserve = summe * (100 + reserve) / 100;
    const va = Math.round(mitReserve / pf * 1000) / 1000;
    if ((!Number.isInteger(mitReserve) || !Number.isInteger(va)) && versuch < 200) continue;
    const pfText = String(pf).replace(".", ",");
    return {
      typ: "generator", generator: "usv",
      hinweis: "USV-Arten und Leistungsfaktor gehen über den AP1-Katalog hinaus – hier für die Klausur K3.",
      frage: "Diese Geräte sollen an eine USV: " + teile.map((t) => t[0] + " " + t[1] + " W").join(", ") + ". "
        + "Geplant wird mit " + reserve + " % Reserve, der Leistungsfaktor der USV ist " + pfText + ". "
        + "(1) Benötigte Wirkleistung mit Reserve in W? (2) Mindest-Scheinleistung der USV in VA?",
      antwort2: [zahlAntwort(mitReserve, "w"), zahlAntwort(va, "va")],
      einheit: "W · VA",
      weg: [
        "Summe der Wirkleistung: " + teile.map((t) => t[1]).join(" + ") + " = " + summe + " W",
        "Reserve: " + summe + " W × " + (100 + reserve) / 100 + " = " + mitReserve + " W",
        "Scheinleistung: S = P ÷ cos φ = " + mitReserve + " W ÷ " + pfText + " = " + va + " VA",
        "Merke: USVs werden in VA angegeben; die Watt-Angabe (Wirkleistung) ist kleiner. Die Überbrückungszeit hängt am Akku – sie muss fürs geordnete Herunterfahren reichen."
      ]
    };
  }
}

/* ---- DHCP-Bereich in einem /24 (K3-E38: nur /24, Ausschluesse, Reservierungen; K3-E35 Split-Scope) ---- */
export function genDhcpBereich(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  const netz = pick(["192.168.10", "192.168.20", "192.168.30", "10.0.10", "172.16.5"], r) ?? "192.168.10";
  const start = da(pick([20, 50, 100], r), "Bereichsanfang");
  const ende = start + da(pick([99, 119, 149], r), "Bereichsgroesse");   /* Groesse 100/120/150 – durch 5 teilbar */
  const groesse = ende - start + 1;
  if (pick([0, 1], r) === 1) {
    const s1 = groesse * 80 / 100, s2 = groesse - s1;
    return {
      typ: "generator", generator: "dhcpbereich",
      frage: "Im Netz " + netz + ".0/24 soll der DHCP-Bereich " + netz + "." + start + " bis " + netz + "." + ende
        + " ausfallsicher per Split-Scope 80/20 auf zwei DHCP-Server verteilt werden. "
        + "(1) Wie viele Adressen verteilt Server 1 (80 %)? (2) Wie viele Server 2 (20 %)?",
      antwort2: [[String(s1)], [String(s2)]],
      einheit: "Adressen · Adressen",
      weg: [
        "Bereichsgröße: " + ende + " − " + start + " + 1 = " + groesse + " Adressen (beide Grenzen zählen mit)",
        "Server 1: " + groesse + " × 0,8 = " + s1 + " · Server 2: " + groesse + " × 0,2 = " + s2,
        "Die Teilbereiche dürfen sich NICHT überschneiden – sonst vergeben beide Server dieselbe Adresse.",
        "Fällt Server 1 aus, verlängern seine Clients zuerst bei T1 (50 %), dann bei T2 (87,5 %) per Broadcast – Server 2 hat nur 20 % des Bereichs."
      ]
    };
  }
  const exAnfang = start + da(pick([0, 10, 30], r), "Ausschluss");
  const exAnzahl = da(pick([5, 10, 15], r), "Ausschluss-Groesse");
  const reserv = da(pick([3, 4, 6, 8], r), "Reservierungen");
  const frei = groesse - exAnzahl - reserv;
  return {
    typ: "generator", generator: "dhcpbereich",
    frage: "Ein DHCP-Server vergibt im Netz " + netz + ".0/24 den Bereich " + netz + "." + start + " bis " + netz + "." + ende + ". "
      + "Ausgeschlossen sind " + netz + "." + exAnfang + " bis " + netz + "." + (exAnfang + exAnzahl - 1) + " (statische Drucker und Server). "
      + "Zusätzlich gibt es " + reserv + " Reservierungen (feste IP per MAC-Adresse) innerhalb des Bereichs, aber außerhalb der Ausschlüsse. "
      + "(1) Wie viele Adressen umfasst der Bereich? (2) Wie viele bleiben für die freie dynamische Vergabe an beliebige Clients?",
    antwort2: [[String(groesse)], [String(frei)]],
    einheit: "Adressen · Adressen",
    weg: [
      "Bereichsgröße: " + ende + " − " + start + " + 1 = " + groesse + " Adressen",
      "Ausschluss: " + (exAnfang + exAnzahl - 1) + " − " + exAnfang + " + 1 = " + exAnzahl + " Adressen",
      "Frei dynamisch: " + groesse + " − " + exAnzahl + " (Ausschluss) − " + reserv + " (Reservierungen) = " + frei,
      "Ausschluss = der Server vergibt die Adresse nie · Reservierung = er vergibt sie immer an dieselbe MAC-Adresse."
    ]
  };
}

/* ---- Netzteil: Summe der Komponenten + Reserve -> naechste Netzteilgroesse (K3-E38, Thema 6) ---- */
export const NETZTEIL_GROESSEN = [400, 450, 550, 650, 750, 850, 1000, 1200];
export function genNetzteil(rng?: Zufall): Generatoraufgabe {
  const r = rng ?? Math.random;
  for (let versuch = 0; ; versuch++) {
    const module = da(pick([2, 4], r), "RAM-Module");
    const teile: Array<[string, number]> = [
      ["CPU (TDP)", da(pick([65, 105, 125, 170], r), "CPU")],
      ["Grafikkarte", da(pick([115, 200, 220, 285, 320], r), "GPU")],
      ["Mainboard", da(pick([40, 50, 60], r), "Mainboard")],
      ["RAM (" + module + " Module à 5 W)", module * 5],
      ["NVMe-SSD", da(pick([5, 7, 8], r), "SSD")],
      ["Lüfter und Pumpe", da(pick([10, 15, 20], r), "Luefter")],
    ];
    const summe = teile.reduce((a, t) => a + t[1], 0);
    const reserve = da(pick([20, 30, 40], r), "Reserve");
    const mitReserve = summe * (100 + reserve) / 100;
    if (!Number.isInteger(mitReserve) && versuch < 200) continue;
    const groesse = NETZTEIL_GROESSEN.find((g) => g >= mitReserve) ?? 1200;
    return {
      typ: "generator", generator: "netzteil",
      frage: "Ein CAD-Arbeitsplatz bekommt: " + teile.map((t) => t[0] + " " + t[1] + " W").join(", ") + ". "
        + "Geplant wird mit " + reserve + " % Reserve; lieferbar sind Netzteile mit " + NETZTEIL_GROESSEN.join(", ") + " W. "
        + "(1) Benötigte Leistung mit Reserve in W? (2) Welches Netzteil (W) wählst du?",
      antwort2: [zahlAntwort(mitReserve, "w"), zahlAntwort(groesse, "w")],
      einheit: "W · W",
      weg: [
        "Summe: " + teile.map((t) => t[1]).join(" + ") + " = " + summe + " W",
        "Reserve: " + summe + " W × " + (100 + reserve) / 100 + " = " + mitReserve + " W",
        "Nächstgrößeres lieferbares Netzteil: " + groesse + " W",
        "Merke: Reserve für Lastspitzen (v. a. der Grafikkarte) und Alterung; ein Netzteil mit 80-PLUS-Zertifikat arbeitet bei etwa 50 % Last am effizientesten."
      ]
    };
  }
}

/* ⚠️⚠️ `stufe` JE GENERATOR-ART – NUTZER-ENTSCHEID 09.09.2026.
   BIS DAHIN setzte `genAlsFrage()` `schwierigkeit: S.level`, und S.level bleibt im
   Automatik-Modus DAUERHAFT 1 (geschrieben wird es nur ueber den Regler im manuellen Modus).
   Folge: **jede vierte Aufgabe trug beim Lerner das Tag „Anfaenger"** – auch fuer jemanden,
   der in allen Themen auf Stufe 4 steht. Und die Lernfluss-Probe zaehlte 26 % der Ziehungen
   als Stufe 1, was jeden Stufenanteil am falschen Nenner rechnete (BEFUNDE_LERNFLUSS.md).
   ⛔ Eine Themenstufe koennen die Generatoren NICHT erben: ihre Themen („Zahlensysteme",
   „RAID", „Netzplantechnik", „Datenuebertragung & Uebertragungszeit") stehen gar nicht im
   Pool – `stufeFuer` faellt dort auf S.level zurueck. Deshalb eine feste Stufe je Art.
   ►► DIE WERTE SIND AM POOL ABGELESEN, NICHT GESCHAETZT (09.09., `pool_query.js`):
      „Berechnungen: Daten & Uebertragung"  13 Fragen, Schwerpunkt Stufe 3 (8)  -> uebertragung 3
      „Subnetting"                           8 Fragen, Schwerpunkt Stufe 3 (6)  -> subnetting 3
      „Netzplan & Puffer"                   29 Fragen, Schwerpunkt Stufe 3 (20) -> netzplan 3
      „Datenmengen & Praefixe"              12 Fragen, 6x Stufe 3 / 4x Stufe 2  -> datenmengen 2,
        weil die GENERIERTE Aufgabe eine Einzelumrechnung ohne Szenario ist – die Stufe-3-Fragen
        des Themas tragen einen Anwendungskontext, den der Generator nicht hat.
      zahlensysteme und raid haben kein Pool-Thema: Zahlensysteme ist eine reine Umrechnung (2),
        die RAID-Kapazitaet verlangt die Wahl der richtigen Formel (3).
   ⚠️ Wer eine Generator-Art ergaenzt, setzt `stufe` mit – `test_rechnen` haelt das fest. */
export interface GeneratorEintrag { name: string; modul: string; thema: string; ap2?: boolean; stufe: number; fn: (rng?: Zufall) => Generatoraufgabe }
export const GENERATOREN: Record<string, GeneratorEintrag> = {
  uebertragung: { name: "Übertragungszeit", modul: "M03", thema: "Datenübertragung & Übertragungszeit", stufe: 3, fn: function (rng) { return genUebertragung(rng); } },
  subnetting: { name: "Subnetting", modul: "M04", thema: "Subnetting", ap2: true, stufe: 3, fn: function (rng) { return genSubnetting(rng); } },
  zahlensysteme: { name: "Zahlensysteme", modul: "M03", thema: "Zahlensysteme", stufe: 2, fn: function (rng) { return genZahlensysteme(rng); } },
  datenmengen: { name: "Datenmengen (GiB/GB, Bit/Byte)", modul: "M03", thema: "Datenmengen & Präfixe", stufe: 2, fn: function (rng) { return genDatenmengen(rng); } },
  raid: { name: "RAID-Kapazität (AP2-Zusatz)", modul: "M03", thema: "RAID", ap2: true, stufe: 3, fn: function (rng) { return genRaid(rng); } },
  netzplan: { name: "Netzplan", modul: "M01", thema: "Netzplantechnik", stufe: 3, fn: function (rng) { return genNetzplan(rng); } },
  /* K3 (24.11.2026) – nicht in logik.js; Reihenfolge und Liste haelt K3_ARTEN fest. */
  raidk3: { name: "RAID 0/1/5/6/10/0+1 (AP2-Zusatz)", modul: "M03", thema: "RAID", ap2: true, stufe: 3, fn: function (rng) { return genRaidK3(rng); } },
  usv: { name: "USV-Dimensionierung (AP2-Zusatz)", modul: "M03", thema: "USV", ap2: true, stufe: 3, fn: function (rng) { return genUsv(rng); } },
  dhcpbereich: { name: "DHCP-Bereich /24", modul: "M04", thema: "DHCP", stufe: 3, fn: function (rng) { return genDhcpBereich(rng); } },
  netzteil: { name: "Netzteil-Dimensionierung", modul: "M03", thema: "Netzteil", stufe: 3, fn: function (rng) { return genNetzteil(rng); } }
};
/** Die Arten, die es nur in der neuen App gibt (nicht in `referenz/logik.js`). */
export const K3_ARTEN = ["raidk3", "usv", "dhcpbereich", "netzteil"];
