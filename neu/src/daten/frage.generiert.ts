/* ERZEUGT von tools/build_schema.js aus tools/schema/frage.schema.json (N37 U3, E60).
   NICHT von Hand aendern – dort aendern und `node tools/build_schema.js` laufen lassen; check.sh prueft es. */
/* oxlint-disable */
export type FrageRoh = ({
id: string
pruefungsteil: ("AP1" | "AP2")
modul: string
thema: string
gebiet: ("A1" | "A2" | "A3" | "A4" | "A5" | "B1" | "B2" | "B3" | "M9")
typ: ("mc" | "freitext" | "lueckentext" | "zuordnung" | "bild" | "erklaeren" | "mehrfach" | "mtf" | "kreuztabelle" | "szenario2" | "reihenfolge" | "dropdown" | "hotspot" | "fehlersuche" | "rechenassistent" | "matrix" | "beschriftung" | "trace" | "konsole" | "kalkulation" | "baukasten")
schwierigkeit: (1 | 2 | 3 | 4)
frage: string
erklaerungKurz: string
erklaerungLang?: string
verweis?: string
rechner?: boolean
varianten?: {

}[]
} & ({
typ: "mc"
/**
 * @minItems 4
 * @maxItems 4
 */
optionen: string[]
loesungIndex: number
/**
 * @minItems 4
 * @maxItems 4
 */
distraktorErklaerungen: string[]
} | {
typ: "mehrfach"
/**
 * @minItems 3
 */
optionen: string[]
/**
 * @minItems 1
 */
loesungIndizes: number[]
distraktorErklaerungen?: string[]
} | {
typ: "mtf"
/**
 * @minItems 3
 */
aussagen: {
text: string
wahr: boolean
}[]
} | {
typ: "kreuztabelle"
/**
 * @minItems 2
 */
zeilen: string[]
/**
 * @minItems 2
 */
spalten: string[]
/**
 * @minItems 2
 */
loesung: boolean[][]
} | {
typ: "szenario2"
schritt1: {
frage: string
/**
 * @minItems 2
 */
optionen: string[]
loesungIndex: number
}
schritt2: {
frage: string
/**
 * @minItems 2
 */
optionen: string[]
loesungIndex: number
}
/**
 * @minItems 2
 */
feedback1: string[]
} | {
typ: "reihenfolge"
/**
 * @minItems 3
 */
schritte: string[]
} | {
typ: "dropdown"
/**
 * @minItems 1
 */
luecken: {
/**
 * @minItems 2
 */
optionen: string[]
loesung: number
akzeptiert?: string[]
}[]
freitext?: boolean
} | {
typ: "lueckentext"
/**
 * @minItems 1
 */
luecken: string[][]
} | {
typ: "zuordnung"
/**
 * @minItems 3
 */
paare: string[][]
/**
 * @minItems 1
 */
extra?: string[]
} | {
typ: "hotspot"
svg: string
/**
 * @minItems 2
 */
zonen: {
x: number
y: number
w: number
h: number
richtig?: boolean
label?: string
}[]
} | {
typ: "fehlersuche"
/**
 * @minItems 2
 */
zeilen: string[]
fehlerZeile: number
} | ({
schritte?: {
[k: string]: unknown
}[]
} & {
typ: "rechenassistent"
/**
 * @minItems 2
 */
schritte: {
text: string
/**
 * @minItems 1
 */
loesung?: unknown[]
formel?: string
dezimalen?: number
}[]
variablen?: {
[k: string]: {
min: number
max: number
schritt?: number
}
}
}) | {
typ: "matrix"
/**
 * @minItems 4
 * @maxItems 4
 */
quadranten: string[]
/**
 * @minItems 2
 */
elemente: {
text: string
quadrant: number
}[]
xAchse?: string
yAchse?: string
} | {
typ: "beschriftung"
svg: string
/**
 * @minItems 2
 */
ziele: {
loesung: string
}[]
/**
 * @minItems 2
 */
labels: string[]
} | {
typ: "trace"
/**
 * @minItems 1
 */
code: string[]
/**
 * @minItems 1
 */
spalten: string[]
/**
 * @minItems 1
 */
zeilen: unknown[][]
} | {
typ: "konsole"
/**
 * @minItems 1
 */
aufgaben: {
prompt: string
/**
 * @minItems 1
 */
akzeptiert: string[]
}[]
} | {
typ: "kalkulation"
/**
 * @minItems 1
 */
kopf: unknown[]
/**
 * @minItems 1
 */
zeilen: unknown[][]
} | {
typ: "baukasten"
/**
 * @minItems 1
 */
geruest: string[]
/**
 * @minItems 2
 */
ziele: {
loesung: string
}[]
/**
 * @minItems 2
 */
bausteine: string[]
} | {
typ: "freitext"
musterloesung: string
schluesselbegriffe?: {
/**
 * @minItems 1
 */
pflicht: (string | string[])[]
kuer?: (string | string[])[]
}
} | {
typ: "erklaeren"
musterloesung: string
schluesselbegriffe?: {
/**
 * @minItems 1
 */
pflicht: (string | string[])[]
kuer?: (string | string[])[]
}
} | {
typ: "bild"
svg: string
unterTyp: "mc"
/**
 * @minItems 4
 * @maxItems 4
 */
optionen: string[]
loesungIndex: number
/**
 * @minItems 4
 * @maxItems 4
 */
distraktorErklaerungen?: string[]
} | {
typ: "bild"
svg: string
unterTyp: "dropdown"
/**
 * @minItems 1
 */
luecken: {
/**
 * @minItems 2
 */
optionen: string[]
loesung: number
akzeptiert?: string[]
}[]
} | {
typ: "bild"
svg: string
unterTyp: "lueckentext"
/**
 * @minItems 1
 */
luecken: string[][]
}))
