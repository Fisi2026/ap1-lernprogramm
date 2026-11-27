# tools/klausur_k3/set_bauen.py – K3 Etappe L1 (docs/plaene/PLAN_KLAUSUR3.md §5): legt pool/sets/klausur_k3.json an. Aufruf aus der Repo-Wurzel.
# Grundlage: python3 tools/klausur_k3/kandidaten.py --titel (Treffer je Thema), von Hand gesichtet am 23.11.2026:
# nur Fragen, die das Klausurthema wirklich treffen (lieber weniger als Fuellfragen, wie K2 auswahl_b.py),
# keine ID in zwei Themen. Neue Fragen der Arbeiter A-D kommen in L4 dazu (Listen unten erweitern, nie Kopien).
# Punkte = Klausurpunkte je Thema (K3-E40, Ziehung gewichtet K3-E54).
import glob
import json
import sys

THEMEN = [
    # nr, Kurztitel (K3-E40), Punkte, Generator (Art aus generatoren.ts oder None), IDs
    (1, "DHCP", 21, "dhcpbereich", [
        "M04-004", "M04-005", "M04-044", "M04-047", "M04-053", "M04-105", "M04-207",
        "M04-300", "M04-317", "M04-318", "M04-319", "M04-402", "M04-437", "M04-514", "M04-920", "M03-774",
    ]),
    (2, "Redundanz & USV", 6, "usv", [
        "M03-064", "M03-086", "M03-107", "M03-704", "M03-702",
    ]),
    (3, "Switching & VLAN", 13, None, [
        "M03-003", "M03-042", "M03-043", "M03-044", "M03-045", "M03-046", "M03-047", "M03-048", "M03-049",
        "M03-052", "M03-060", "M03-062", "M03-063", "M03-066", "M03-067", "M03-068", "M03-069", "M03-070",
        "M03-071", "M03-072", "M03-073", "M03-081", "M03-205", "M03-401", "M03-933", "M03-964", "M04-999",
    ]),
    (4, "RAID & Backup", 8, "raidk3", [
        "M06-009", "M06-010", "M06-018", "M06-025", "M06-026", "M06-027", "M06-028", "M06-029", "M06-031",
        "M06-033", "M06-034", "M06-035", "M06-045", "M06-047", "M06-048", "M06-052", "M06-056", "M06-057",
        "M06-059", "M06-088", "M06-118", "M06-462", "M06-701", "M06-747", "M06-770", "M06-772",
    ]),
    (5, "IT-Sicherheit", 8, None, [
        "M06-005", "M06-014", "M06-036", "M06-037", "M06-043", "M06-054", "M06-063", "M06-064", "M06-065",
        "M06-066", "M06-067", "M06-068", "M06-069", "M06-076", "M06-112", "M06-116", "M06-120", "M06-304",
        "M06-305", "M06-461", "M06-706", "M06-971", "M04-112", "M04-314", "M04-040", "M03-977",
    ]),
    (6, "Hardwareplanung", 12, "netzteil", [
        "M03-004", "M03-005", "M03-018", "M03-054", "M03-078", "M03-104", "M03-105", "M03-106", "M03-112",
        "M03-116", "M03-304", "M03-462", "M03-484", "M03-701", "M03-705", "M03-907", "M03-931", "M03-962",
        "M03-975", "M03-976", "M03-770",
    ]),
    (7, "Hardwarefehler & Support", 10, None, [
        "M01-010", "M01-014", "M01-015", "M01-053", "M01-110", "M01-112", "M01-120", "M01-211", "M01-212",
        "M01-213", "M01-432", "M01-701", "M01-703", "M01-705", "M01-956", "M03-216", "M03-217", "M07-105",
    ]),
]
fr = {}
for f in glob.glob("pool/pool_m*.json"):
    with open(f, encoding="utf-8") as fh:
        for q in json.load(fh):
            fr[q["id"]] = q
# L4 (24.11.2026): neue Fragen der Arbeiter A-D aus pool/pool_m_k3_<a-d>.json, zugeordnet ueber den ID-Bereich
# je Thema aus tools/klausur_k3/auftraege.md (Zielzahlen-Tabelle). Eine ID ausserhalb aller Bereiche ist ein Fehler.
BEREICHE = {1: ("M04", 564, 639), 2: ("M03", 776, 819), 3: ("M03", 840, 879), 4: ("M06", 543, 579),
            5: ("M06", 620, 659), 6: ("M03", 617, 660), 7: ("M01", 773, 819)}
NEU = {nr: [] for nr in BEREICHE}
for f in sorted(glob.glob("pool/pool_m_k3_*.json")):
    with open(f, encoding="utf-8") as fh:
        for q in json.load(fh):
            mod, num = q["id"].split("-")
            treffer = [nr for nr, (m, a, b) in BEREICHE.items() if m == mod and a <= int(num) <= b]
            if len(treffer) != 1:
                print("KEIN Bereich:", q["id"], f); sys.exit(1)
            NEU[treffer[0]].append(q["id"])
THEMEN = [(nr, t, p, g, ids + NEU[nr]) for nr, t, p, g, ids in THEMEN]
gesehen = {}
fehler = 0
for nr, _t, _p, _g, ids in THEMEN:
    for i in ids:
        if i not in fr:
            print("FEHLT im Pool:", i); fehler += 1
        if i in gesehen:
            print(f"DOPPELT: {i} in Thema {gesehen[i]} und {nr}"); fehler += 1
        gesehen[i] = nr
if fehler:
    sys.exit(1)
out = {
    "_kommentar": "Klausur-Set K3 (docs/plaene/PLAN_KLAUSUR3.md). Nur Verweise auf Pool-IDs, keine Kopien. Erzeugt von tools/klausur_k3/set_bauen.py, gelesen von neu/src/kern/klausur.ts.",
    "name": "Klausur 3",
    "datum": "2026-11-27",
    "themen": [{"nr": nr, "titel": t, "punkte": p, "generator": g, "ids": sorted(ids)} for nr, t, p, g, ids in THEMEN],
}
with open("pool/sets/klausur_k3.json", "w", encoding="utf-8", newline="\n") as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)
    fh.write("\n")
print({nr: len(ids) for nr, _t, _p, _g, ids in THEMEN}, "gesamt", len(gesehen))
