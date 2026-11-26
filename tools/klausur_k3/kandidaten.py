# tools/klausur_k3/kandidaten.py – Etappe L1 K3 (PLAN_KLAUSUR3.md §5). Aufruf aus der Repo-Wurzel: python3 tools/klausur_k3/kandidaten.py
# Kandidaten je Klausurthema aus dem Pool (nur lesen, Ausgabe nach _to_delete/helfer/k3_kandidaten.json).
# Regexe aus K3-E8/E26 gegen titel+frage (nicht Erklaerung: dort stehen Begriffe nur am Rand, Lehre 10.10. „Kandidatenfilter").
# Vorlage: tools/klausur_k2/kandidaten.py. --titel druckt je Treffer eine Zeile (ID, Typ, Titel) zum Durchsehen von Hand.
import collections
import glob
import json
import re
import sys

T = {
 "1 DHCP": ({"DHCP & Netzwerkdienste"}, r"dhcp|\blease\b|apipa|169\.254|dora\b|ip.?helper|relay|slaac|rogue|snooping|ipconfig /(release|renew)"),
 "2 Redundanz": (set(), r"redundan|single point of failure|\bspof\b|spanning.?tree|\bstp\b|rstp|lacp|link.?aggregat|stacking|vrrp|hsrp|\busv\b|unterbrechungsfrei|broadcast.?sturm"),
 "3 Switching/VLAN": (set(), r"\bvlan|802\.1q|trunk|access.?port|mac.?(adress)?tabelle|\bswitch|\brouter\b|routing|default.?gateway|standardgateway|\barp\b|layer.?3|\bsvi\b|router.on.a.stick"),
 "4 RAID/Backup": ({"RAID-Systeme", "Backup & Verfügbarkeit"}, r"\braid|hot.?spare|rebuild|backup|datensicherung|\brpo\b|\brto\b|3-2-1|generationenprinzip|großvater|snapshot|inkrementell|differenziell"),
 "5 IT-Sicherheit": ({"IDS/IPS", "Verschlüsselung & Signaturen"}, r"firewall|paketfilter|stateful|\bdmz\b|\bvpn\b|\bids\b|\bips\b|intrusion|symmetrisch|asymmetrisch|hybrid|\baes\b|\brsa\b|signatur|zertifikat|\btls\b|\bssh\b|https"),
 "6 HW-Planung": ({"Hardware-Komponenten"}, r"nvme|\bsata\b|\bssd\b|\bhdd\b|netzteil|80 ?plus|engpass|flaschenhals|\bcpu\b|prozessor|arbeitsspeicher|\bddr\d|grafikkarte|\bvram\b|pcie|\bm\.2\b|mainboard"),
 "7 HW-Fehler/Support": ({"Ticketsystem & Support-Level"}, r"\bpost\b|piepton|beep|bluescreen|bsod|memtest|\bsmart\b|überhitz|lüfter|treiber|\besd\b|1st.?level|2nd.?level|first.?level|eskalation|incident|problem.?management|gewährleistung|garantie|fehlerbild"),
}
fr = []
for f in sorted(glob.glob("pool/pool_m*.json")):
    with open(f, encoding="utf-8") as fh:
        for q in json.load(fh):
            q["_datei"] = f[5:]
            fr.append(q)
aus = {}
titel = "--titel" in sys.argv
for name, (themen, rx) in T.items():
    L = []
    for q in fr:
        txt = " ".join(str(q.get(k, "")) for k in ("titel", "frage")).lower()
        if q.get("thema") in themen or re.search(rx, txt):
            L.append(q)
    st = collections.Counter(q.get("schwierigkeit") for q in L)
    ty = collections.Counter(q.get("typ") for q in L)
    print(f"{name}: {len(L)} | Stufen {dict(sorted((str(k), v) for k, v in st.items()))} | Typen: {', '.join(f'{k}{v}' for k, v in ty.most_common(8))}")
    if titel:
        for q in L:
            print(f"   {q['id']:<9} {q.get('typ',''):<11} {q.get('schwierigkeit')} {q.get('pruefungsteil','')[:3]:<3} {str(q.get('titel') or q.get('frage',''))[:80]}")
    aus[name] = [{"id": q["id"], "datei": q["_datei"], "thema": q.get("thema"), "typ": q.get("typ"),
                  "stufe": q.get("schwierigkeit"), "teil": q.get("pruefungsteil")} for q in L]
with open("_to_delete/helfer/k3_kandidaten.json", "w", encoding="utf-8", newline="\n") as fh:
    json.dump(aus, fh, ensure_ascii=False, indent=1)
