# tools/klausur_k2/auswahl_b.py – K2 Etappe B (PLAN_KLAUSUR2 §9 K2-E19/E20/E22): kuerzt die Themen mit mehr als ~20
# Kandidaten auf eine von Hand gewaehlte Auswahl. Aufruf aus der Repo-Wurzel, NACH set_bauen.py.
# Regeln: ueberwiegend gebundene Typen (Ankreuzen-Klausur), Stufenmix nahe AP1 (1:14 % 2:36 % 3:42 % 4:8 %),
# keine ID in zwei Themen, nur Fragen, die das Klausurthema wirklich treffen (lieber weniger als Fuellfragen).
# Thema 6 seit K2 §11 (BUILD_LOG 200) ebenfalls hier. Etappe F (BUILD_LOG 192): Thema 1 aufgenommen, Tausch je Zugang (PLAN_KLAUSUR2 §10).
import glob
import json
import sys

AUSWAHL = {
    1: [  # Topologie – F1: +strukturierte Verkabelung (M03-990, M03-056), raus M03-019 (Router ans Internet, keine
        # Topologie) und M03-961 (doppelt zu M03-706/M03-030)
        "M03-029", "M03-030", "M03-031", "M03-032", "M03-033", "M03-034", "M03-035", "M03-036", "M03-037", "M03-038",
        "M03-039", "M03-040", "M03-041", "M03-309", "M03-483", "M03-562", "M03-702", "M03-706", "M03-990", "M03-056",
        # K2 §12 G2 (BUILD_LOG 209): +6 neue St4 (Vollvermaschung 8 Router mit Kosten, Baum-Ausfaelle, Hub gegen Switch physisch/logisch,
        # Primaer-/Sekundaer-/Tertiaerbereich, Switch als Single Point of Failure mit Ausfallrechnung, Ring/Doppelring bei Kabelbruch);
        # keine Frage raus (K2-E31)
        "M03-082", "M03-083", "M03-084", "M03-085", "M03-086", "M03-087",
    ],
    2: [  # Subnetting / IP-Adressierung (+ Generator)
        "M04-002", "M04-003", "M04-101", "M04-102", "M04-103", "M04-104", "M04-105", "M04-121", "M04-401",
        "M04-462", "M04-506", "M04-515", "M04-538", "M04-904", "M04-905", "M04-925", "M04-926", "M04-927",
        # BUILD_LOG 195: Netzadresse und Subnetzvergleich neu (Pool hatte keine freie Frage mehr)
        "M04-036", "M04-037",
        # K2 §12 G2 (Agent D): +6 neue St4 (5 Abteilungen/40 Geraete aus /24, /28-Eckwerte, 12 Filialen, 8 Standorte /27,
        # Wachstum 20 %, DHCP-Bereich aus Maske); keine Frage raus (K2-E31)
        "M04-056", "M04-057", "M04-058", "M04-059", "M04-060", "M04-061",
    ],
    3: [  # Switch & Routing – Pool duenn (gemessen: 17 Treffer Switch/Router/Gateway/VLAN in M03/M04)
        "M03-003", "M03-471", "M03-933", "M06-970", "M03-992", "M03-205", "M03-401", "M03-964",
        "M04-999", "M03-052",
        # Etappe C2 (BUILD_LOG 188): neue Fragen zu MAC-Adresstabelle, Routingtabelle, Standardgateway, Domaenen, VLAN
        "M03-042", "M03-043", "M03-044", "M03-045", "M03-046", "M03-047", "M03-048",
        # F2: ARP und NAT/PAT neu (AP2); raus M03-025 (doppelt zu M03-003), M03-109 (Medien, kein Switch/Routing)
        "M03-049", "M03-057",
        # BUILD_LOG 195 (Nutzer: auf 22 wachsen): ARP zum Standardgateway, Portweiterleitung bei PAT
        "M03-060", "M03-061",
        # K2 §11 Teil 2+3 (BUILD_LOG 200): raus M04-977 (nbtstat/getmac, nicht im Katalog); neu Bridge, VLAN-Tagging 802.1Q,
        # Spanning Tree (Katalog Teil 2 Z. 1377/1391/2006; Nutzer: auf 24 wachsen)
        "M03-062", "M03-063", "M03-064",
        # K2 §12 G2 (BUILD_LOG 205): +8 neue St4 (ARP-Broadcast ueber Router, VLAN-Ports, Access/Trunk, Longest Prefix /25,
        # Gateway ausserhalb des Netzes, Layer-3-Switch, MAC-Tabelle lernen/fluten, Frame-Adressen); keine Frage raus (K2-E31)
        "M03-066", "M03-067", "M03-068", "M03-069", "M03-070", "M03-071", "M03-072", "M03-073",
    ],
    4: [  # OSI-Modell
        "M03-027", "M03-028", "M03-001", "M03-461", "M03-703", "M03-561", "M03-436", "M03-501", "M03-930",
        "M03-932", "M03-934", "M03-960", "M03-002", "M03-017", "M03-502", "M03-963", "M03-970", "M03-053", "M03-051",
        "M03-971",  # BUILD_LOG 195: Hotspot Schicht 4 (TCP/UDP, Ports)
        "M03-065",  # K2 §11 (BUILD_LOG 200): PDU-Namen Bit/Frame/Paket/Segment (neu)
        # K2 §12 G2 (Agent D): +4 St4 (Fehlerort Port 443, Weg ueber Switch/Router/Switch, TCP-Segmentverlust, Reihenfolge
        # DHCP/ARP/DNS/TCP/TLS) und +2 St3 (Beobachtung -> Schicht, Webaufruf-Schichten); keine Frage raus (K2-E31)
        "M03-088", "M03-089", "M03-090", "M03-091", "M03-092", "M03-093",
    ],
    5: [  # Hardware-Auswahl & Beschaffung
        "M03-018", "M02-021",
        "M02-211", "M03-225", "M03-222",
        "M02-103", "M02-105", "M02-303", "M03-004", "M03-770",
        "M02-113", "M03-907",
        # F1 Kauf/Leasing/Miete (K2-E7): +M07-716, M07-717, M07-003, M03-941; raus M02-022, M03-962, M03-931, M02-301
        "M07-716", "M07-717", "M07-003", "M03-941",
        # Amortisation (BUILD_LOG 194, Buch LF2 S. 253 f.): +M03-058, M03-059 neu; raus M03-712 (fix/variabel, kein Klausurthema), M02-102 (vierte Bezugskalkulation)
        "M03-058", "M03-059",
        # K2 §11 (BUILD_LOG 200): +Thin Client M03-227, +Gütesiegel M03-008; raus M02-213 (wie M02-211), M03-772 (wie M03-770)
        "M03-227", "M03-008",
        # K2 §12 G2 (BUILD_LOG 206): +8 neue St4 (Nutzwertanalyse mit neuer Gewichtung, Bezugspreis zweier Lieferanten, TCO zweier
        # Arbeitsplatzrechner, Amortisationszeit, Kauf/Operating-/Finanzierungsleasing, Leasingvertrag, Geraeteklassen, Netzteil-
        # Wirkungsgrad); keine Frage raus (K2-E31)
        "M02-029", "M02-030", "M03-074", "M03-075", "M03-076", "M07-046", "M03-077", "M03-078",
    ],
    6: [  # RAID – K2 §11 (BUILD_LOG 200): raus M03-533 (Backup-Rechnung, schwache Passung), neu M06-074 RAID-10-Minimum
        "M06-025", "M06-026", "M06-027", "M06-028", "M06-029", "M06-031", "M06-032", "M06-033", "M06-034", "M06-035",
        "M06-044", "M06-045", "M06-046", "M06-047", "M06-048", "M06-056", "M06-057", "M06-058", "M06-059", "M06-074",
        # K2 §12 G2 (Agent D): +6 neue St4 (10 TB und zwei Ausfaelle, Hot Spare, Kapazitaetszuordnung, zwei Ausfaelle je Level,
        # Plattenzahl RAID 5 gegen 10 mit Kosten, degraded-Massnahmen); keine Frage raus (K2-E31)
        "M06-088", "M06-089", "M06-090", "M06-091", "M06-092", "M06-093",
    ],
    7: [  # Netzwerksicherheit (ohne IDS – eigenes Thema 8)
        "M06-021", "M06-022", "M06-214",
        "M04-224", "M06-116", "M06-115", "M06-215", "M03-977",
        "M04-007", "M04-314", "M04-315", "M06-502", "M06-971", "M06-752",
        "M06-064",  # C2: Stufe 4, Regelreihenfolge der Firewall
        # F2 Firewall-Arten und DMZ (AP2); raus M04-313 (doppelt zu M04-007), M04-225/M04-226 (RDP dreifach)
        "M06-065", "M06-066", "M06-067", "M06-068", "M06-069",
        # BUILD_LOG 195 (Nutzer: auf 22 wachsen): WLAN-Enterprise sperrt einzeln, RADIUS als AAA (Buch LF3 S. 376)
        "M04-034", "M04-035",
        # K2 §12 G2 (BUILD_LOG 204): +9 neue St4 (VPN-Architektur, Zero-Trust, WLAN Enterprise, Tunnel/Kapselung,
        # zustandsloser Paketfilter, DMZ-Regelwerk, Proxy-Firewall, Personal Firewall, Zugang/Zugriff); keine Frage raus (K2-E31)
        "M04-040", "M04-041", "M04-042", "M04-043", "M06-075", "M06-076", "M06-077", "M06-078", "M06-079",
    ],
    8: [  # IDS/IPS – A2-Saat enthielt 4 Stichwort-Treffer ohne IDS-Bezug (M04-006, M04-321, M04-914, M06-502): raus
        "M06-036", "M06-037", "M06-038", "M06-039", "M06-040", "M06-041", "M06-042", "M06-043", "M06-049",
        "M06-050", "M06-054", "M06-055", "M06-060", "M06-061", "M06-062", "M06-063",
        "M06-070", "M06-071", "M06-072", "M06-073",  # F2: Platzierung im Netzplan
        # K2 §12 G2 (BUILD_LOG 207): +8 neue St4 (IDS/IPS-Wahl mit Fehlalarm-Rechnung, Alarmaufwand vor/hinter Firewall, Signatur/Anomalie,
        # HTTPS/TLS, HIDS-Pruefsummen zweier Server, Schutzschichten, NGFW, False Positive/Negative); keine Frage raus (K2-E31)
        "M06-080", "M06-081", "M06-082", "M06-083", "M06-084", "M06-085", "M06-086", "M06-087",
    ],
    9: [  # Lasten-/Pflichtenheft – Saat ohne den Freitext M04-303 (K2-E20, BUILD_LOG 186)
        "M04-001", "M04-017", "M04-027", "M04-028", "M04-029", "M04-030", "M04-031", "M04-032", "M04-033",
        "M04-117", "M04-201", "M04-202", "M04-301", "M04-302", "M04-304", "M04-305", "M04-461", "M04-928",
        "M04-038",  # BUILD_LOG 195: funktionale Anforderungen (neu)
        "M04-039",  # K2 §11 (BUILD_LOG 200): messbare nichtfunktionale Anforderung; raus M06-733 (Security by Design)
        # K2 §12 G2 (Agent D): +4 neue St4 (Angebotswahl Muss/Kann, Pflichtenheft-Pruefung vor Freigabe, Abnahmebewertung,
        # Budgetkuerzung 15 %); keine Frage raus (K2-E31)
        "M04-062", "M04-063", "M04-064", "M04-065",
    ],
    10: [  # Fehleranalyse im Netzwerk
        "M04-320",
        "M03-980", "M03-982", "M04-504", "M04-997",
        "M03-773", "M03-774", "M03-775", "M03-981", "M04-006", "M04-203", "M04-438", "M04-998",
        "M04-052", "M04-053",
        # F1 WLAN-Stoerungen: +M03-201, M03-615, M03-614; raus M04-204 (doppelt zu M04-006), M04-513 (zu M04-504), M04-321
        "M03-201", "M03-615", "M03-614",
        # K2 §11 (BUILD_LOG 200): arp -a (M04-912) und ip a/ip r (M04-914) statt M04-911/M04-975 (beide ipconfig /all + ping)
        "M04-912", "M04-914",
        # K2 §12 G2 (BUILD_LOG 208): +8 neue St4 (APIPA bei erloschener Link-LED, manueller DNS-Eintrag, sporadische Aussetzer/Dauer-Ping,
        # Ausfall des Hallen-Switch, netstat/Port 80, Routerausfall im Stern, WLAN Reichweite/Kapazitaet/SSID, falsches VLAN am Port);
        # keine Frage raus (K2-E31)
        "M04-044", "M04-045", "M04-046", "M04-047", "M04-048", "M03-079", "M03-080", "M03-081",
    ],
}

pool = {}
for f in glob.glob("pool/pool_m*.json"):
    with open(f, encoding="utf-8") as fh:
        for x in json.load(fh):
            pool[x["id"]] = x
PFAD = "pool/sets/klausur_k2.json"
with open(PFAD, encoding="utf-8") as fh:
    s = json.load(fh)
fehler = [i for ids in AUSWAHL.values() for i in ids if i not in pool]
for nr, ids in AUSWAHL.items():
    if len(ids) != len(set(ids)):
        fehler.append(f"Thema {nr}: doppelte ID")
for t in s["themen"]:
    if t["nr"] in AUSWAHL:
        t["ids"] = sorted(AUSWAHL[t["nr"]])
alle = [i for t in s["themen"] for i in t["ids"]]
doppelt = sorted({i for i in alle if alle.count(i) > 1})
if doppelt:
    fehler.append(f"in zwei Themen: {doppelt}")
if fehler:
    sys.exit(f"FEHLER: {fehler}")
with open(PFAD, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(s, fh, ensure_ascii=False, indent=1)
    fh.write("\n")
for t in s["themen"]:
    st = {k: sum(1 for i in t["ids"] if pool[i]["schwierigkeit"] == k) for k in (1, 2, 3, 4)}
    print(t["nr"], t["titel"], len(t["ids"]), st)
