# tools/klausur_k2/abdeckung.py – K2 Etappe F (PLAN_KLAUSUR2 §10, BUILD_LOG 190): misst je Klausurthema, wie viele
# Set-Fragen jedes Unterthema treffen, gegen Buch-Volltext und Katalog-OCR (Stichwort-Regex, fachlich UNGEPRUEFT).
# Aufruf aus der Repo-Wurzel:  PYTHONIOENCODING=utf-8 python3 tools/klausur_k2/abdeckung.py [--kandidaten]
# --kandidaten schreibt die freien Pool-Fragen je Luecke nach _to_delete/helfer/k2_f1_kandidaten.md (Eingabe F1).
import collections
import glob
import json
import re
import sys

BUCH = "../Buch/_aufbereitung/buch_volltext.txt"
KATALOG = "../Buch/katalog/pruefungskatalog_ocr.txt"
SET = "pool/sets/klausur_k2.json"
AUS = "_to_delete/helfer/k2_f1_kandidaten.md"

UNTER = {
    1: {"Bus": r"\bbus", "Ring": r"\bring", "Stern": r"stern", "Masche": r"masch|vermasch", "Baum": r"\bbaum",
        "LAN/WAN/MAN/GAN": r"\b(man|gan|wan)\b",
        "strukt. Verkabelung": r"primär|sekundär|tertiär|strukturierte verkabelung",
        "physisch/logisch": r"logische topolog|physisch"},
    2: {"Maske/CIDR": r"subnetzmaske|/\d\d", "Netz-/Broadcastadresse": r"broadcast",
        "Hostanzahl": r"hosts?\b|2\^|2\s*hoch", "privat/öffentlich": r"privat", "IPv6-Präfix": r"ipv6",
        "VLSM": r"vlsm|unterschiedlich gro"},
    3: {"MAC-Tabelle": r"mac-adresstabelle|mac-tabelle|cam", "Routingtabelle": r"routingtabelle",
        "Gateway": r"gateway", "VLAN": r"vlan", "Kollisions-/Broadcastdomäne": r"kollisionsdom|broadcastdom",
        "ARP": r"\barp\b", "NAT": r"\bnat\b", "Layer-3-Switch": r"layer-3|layer 3", "Hub": r"\bhub",
        "STP": r"spanning|\bstp\b"},
    4: {"Schichten": r"schicht", "TCP/IP-Modell": r"tcp/ip-modell|dod|4 schichten|vier schichten",
        "Kapselung/PDU": r"kapsel|frame|segment|paket", "TCP vs UDP": r"\budp\b", "Ports": r"\bport",
        "Protokolle": r"http|dns|dhcp|smtp"},
    5: {"Angebotsvergleich": r"angebotsvergleich|bezugspreis|skonto|rabatt", "Nutzwertanalyse": r"nutzwert",
        "Kauf/Leasing/Miete": r"leasing|miete", "TCO": r"tco|gesamtkosten|betriebskosten",
        "Anforderungen HW": r"\bram\b|ssd|cpu|prozessor", "Gewährleistung/Garantie": r"gewährleistung|garantie",
        "Amortisation": r"amortis", "Energie": r"energie|green|leistungsaufnahme|watt"},
    6: {"RAID 0": r"raid 0|raid-0", "RAID 1": r"raid 1\b|raid-1\b", "RAID 5": r"raid 5|raid-5",
        "RAID 6": r"raid 6|raid-6", "RAID 10": r"raid 10|raid-10|raid 1\+0", "Kapazität": r"kapazität|nutzbar",
        "Parität": r"parität|xor", "Hot-Spare/Rebuild": r"hot.?spare|rebuild|wiederherstell",
        "RAID ist kein Backup": r"backup|datensicherung"},
    7: {"Firewall-Arten": r"paketfilter|stateful|zustandsorient|application|proxy", "DMZ": r"\bdmz",
        "VPN": r"\bvpn", "WPA": r"wpa", "802.1X/RADIUS": r"802\.1x|radius", "Verschlüsselung": r"verschlüssel",
        "Port-/MAC-Sicherheit": r"port-security|mac-filter", "Regelwerk": r"regel"},
    8: {"IDS vs IPS": r"\bips\b", "NIDS/HIDS": r"nids|hids", "Signatur/Anomalie": r"signatur|anomal",
        "Fehlalarm": r"false|fehlalarm", "Honeypot/SIEM": r"honeypot|siem", "NGFW": r"ngfw|next.generation"},
    9: {"Lastenheft": r"lastenheft", "Pflichtenheft": r"pflichtenheft", "Abnahme": r"abnahme",
        "funktional": r"funktional", "Vertrag": r"vertrag"},
    10: {"ping": r"\bping", "traceroute": r"trace", "ipconfig": r"ipconfig|ifconfig", "nslookup": r"nslookup",
         "arp -a": r"\barp", "netstat": r"netstat", "APIPA/DHCP": r"169\.254|apipa|dhcp",
         "Vorgehen": r"bottom|schicht 1|systematisch|vorgehen", "WLAN": r"wlan", "Kabel/Link": r"kabel|link"},
}
LUECKEN = {"5 Leasing/Miete": r"leasing|miete", "5 Amortisation": r"amortis", "10 WLAN": r"wlan",
           "1 strukt. Verkabelung": r"primär|sekundär|tertiär|strukturierte verkabelung", "3 ARP": r"\barp\b",
           "3 NAT": r"\bnat\b", "7 DMZ": r"\bdmz", "7 WPA": r"wpa"}


def text(o):
    if isinstance(o, str):
        return o
    if isinstance(o, dict):
        return " ".join(text(v) for v in o.values())
    if isinstance(o, list):
        return " ".join(text(v) for v in o)
    return ""


def lies(pfad):
    with open(pfad, encoding="utf-8", errors="ignore") as f:
        return f.read()


def pool_laden():
    pool = {}
    for p in glob.glob("pool/pool_*.json"):
        d = json.loads(lies(p))
        for q in d if isinstance(d, list) else d.get("fragen", []):
            if isinstance(q, dict) and "id" in q:
                pool[q["id"]] = q
    return pool


def thema_zeigen(t, pool, buch, kat):
    qs = [pool[i] for i in t["ids"] if i in pool]
    st = collections.Counter(str(q.get("schwierigkeit", "?")) for q in qs)
    ap = collections.Counter(q.get("pruefungsteil", "AP1") for q in qs)
    print(f"\n## {t['nr']} {t['titel']} · {len(t['ids'])} · St {dict(sorted(st.items()))} · {dict(ap)}")
    texte = [text(q).lower() for q in qs]
    for name, rx in UNTER[t["nr"]].items():
        n = sum(1 for x in texte if re.search(rx, x))
        marke = "  <<" if n == 0 else (" <" if n == 1 else "")
        print(f"  {name:28s} Set {n:2d} · Buch {len(re.findall(rx, buch)):4d} · Kat {len(re.findall(rx, kat)):3d}{marke}")
    return st


def kandidaten(pool, setids):
    zeilen = ["# K2 F1 – freie Pool-Kandidaten je Luecke (Stichwort, fachlich UNGEPRUEFT)"]
    for name, rx in LUECKEN.items():
        treffer = sorted(i for i, q in pool.items() if i not in setids and re.search(rx, text(q).lower()))
        zeilen.append(f"\n## {name} ({len(treffer)})")
        for i in treffer:
            q = pool[i]
            frage = re.sub(r"\s+", " ", str(q.get("frage", "")))[:140]
            zeilen.append(f"- {i} · St{q.get('schwierigkeit', '?')} · {q.get('typ')} · {q.get('thema')} · {frage}")
    with open(AUS, "w", encoding="utf-8") as f:
        f.write("\n".join(zeilen) + "\n")
    print(f"\n{AUS} geschrieben")


def main():
    pool = pool_laden()
    s = json.loads(lies(SET))
    buch, kat = lies(BUCH).lower(), lies(KATALOG).lower()
    gesamt = collections.Counter()
    for t in s["themen"]:
        gesamt.update(thema_zeigen(t, pool, buch, kat))
    print("\nGESAMT", sum(len(t["ids"]) for t in s["themen"]), dict(sorted(gesamt.items())))
    if "--kandidaten" in sys.argv:
        kandidaten(pool, {i for t in s["themen"] for i in t["ids"]})


if __name__ == "__main__":
    main()
