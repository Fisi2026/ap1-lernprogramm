"""Fakten-Waechter v2. ENTSCHEIDENDE KORREKTUR gegenueber v1:
   FALSCHE Antwortoptionen und ihre Distraktor-Erklaerungen sind ABSICHTLICH falsch und
   duerfen NICHT geprueft werden. v1 meldete deshalb 14 Fehlalarme (z.B. 'Zertifizierung
   ist 5 Jahre gueltig' - das IST der Distraktor). Geprueft wird nur, was der Pool als WAHR
   behauptet: frage, erklaerungKurz, erklaerungLang, musterloesung, verweis + die RICHTIGEN
   Optionen. Zusaetzlich engere Wertmuster."""
import re

from poolzugang import fragen  # N29 Teil 2 (E40): pool/*.json ueber tools/pool_laden.js

pool = fragen()

def wahre_stellen(q):
    for k in ('frage','erklaerungKurz','erklaerungLang','musterloesung','verweis'):
        v = q.get(k)
        if isinstance(v, str): yield k, v
    opt = q.get('optionen')
    if isinstance(opt, list):
        richtig = set()
        if isinstance(q.get('loesungIndex'), int): richtig.add(q['loesungIndex'])
        if isinstance(q.get('loesungIndizes'), list): richtig.update(q['loesungIndizes'])
        for i in sorted(richtig):
            if 0 <= i < len(opt) and isinstance(opt[i], str): yield f"optionen[{i}]", opt[i]

FAKTEN = [
 ("§ 626 BGB Erklaerungsfrist",     r'626',                             r'(\d+)\s*Wochen\s*ab\s*Kenntnis', {'2'}),
 ("ArbZG Ruhezeit",                 r'Ruhezeit',                        r'Ruhezeit[^.]{0,40}?(\d+)\s*Stunden', {'11'}),
 ("ArbZG Hoechstarbeitszeit",       r'ArbZG|Arbeitszeitgesetz',         r'werkt[aä]gliche\s*Arbeitszeit[^.]{0,30}?(\d+)\s*Stunden', {'8'}),
 ("JArbSchG taeglich",              r'JArbSchG',                        r'(\d+)\s*Stunden\s*t[aä]glich', {'8'}),
 ("JArbSchG woechentlich",          r'JArbSchG',                        r'(\d+)\s*Stunden\s*w[oö]chentlich', {'40'}),
 ("BUrlG Mindesturlaub",            r'BUrlG|Bundesurlaubsgesetz',       r'(\d+)\s*Werktage\s*Mindesturlaub', {'24'}),
 ("DSGVO Art. 33 Meldefrist",       r'Art\.\s*33|33\s*DSGVO',           r'(\d+)\s*Stunden', {'72'}),
 ("ISO 9001 Zertifikatslaufzeit",   r'Zertifik',                        r'(?:f[uü]r|ist|Gültigkeitsdauer)\s*(?:i\.d\.R\.\s*)?(\d+)\s*Jahre\s*g[uü]ltig|Gültigkeitsdauer\s*(\d+)\s*Jahre', {'3'}),
 ("Probezeit BBiG Obergrenze",      r'Probezeit',                       r'h[oö]chstens\s*(?:auf\s*)?(\d+|vier)\s*Monate', {'4','vier'}),
 ("Probezeit BBiG Untergrenze",     r'Probezeit',                       r'mindestens\s*(\d+|einen|ein)\s*Monat', {'1','einen','ein'}),
 ("AP1-Gewichtung",                 r'AP1|Teil 1',                      r'AP1[^.]{0,30}?(\d+)\s*%', {'20'}),
 ("AP2-Gewichtung",                 r'AP2|Teil 2',                      r'AP2[^.]{0,30}?(\d+)\s*%', {'80'}),
]

SATZ = re.compile(r'[^.!?\n]*[.!?\n]?')
gesamt = 0
for name, ausloeser, wertmuster, erlaubt in FAKTEN:
    aus, wert = re.compile(ausloeser, re.IGNORECASE), re.compile(wertmuster, re.IGNORECASE)
    treffer, verstoesse = 0, []
    for q in pool:
        for feld, txt in wahre_stellen(q):
            for satz in SATZ.findall(txt):
                if not satz.strip() or not aus.search(satz): continue
                for m in wert.finditer(satz):
                    v = next(g for g in m.groups() if g)
                    treffer += 1
                    if v.lower() not in {e.lower() for e in erlaubt}:
                        verstoesse.append((q['id'], feld, v, satz.strip()[:150]))
    print(f"{name:32s} erlaubt={sorted(erlaubt)}  belegt={treffer:3d}  {'OK' if not verstoesse else str(len(verstoesse))+' VERDACHT'}")
    for qid, feld, v, s in verstoesse[:5]:
        print(f"      !! {qid}/{feld}: '{v}' in: {s}")
    gesamt += len(verstoesse)
print(f"\nGESAMT: {gesamt} Verdachtsfaelle (nur WAHRE Aussagen geprueft)")
