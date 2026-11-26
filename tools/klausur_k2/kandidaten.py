# tools/klausur_k2/kandidaten.py – Etappe 0a K2 (PLAN_KLAUSUR2.md). Aufruf aus der Repo-Wurzel: python3 tools/klausur_k2/kandidaten.py
# Etappe 0a K2: Kandidaten je Klausurthema aus dem Pool (nur lesen, Ausgabe nach _to_delete/helfer/)
import collections
import glob
import json
import re

T={
 "01 Topologie":({},r"topolog|vermascht|stern-?struktur|bus-?struktur|ring-?struktur"),
 "02 Subnetting":({"Subnetting","IP-Adressierung"},r"subnet|cidr|netzmaske|broadcastadress|präfix ?/\d"),
 "03 Switch/Routing":({"Netzwerkkomponenten & Medien"},r"switch|router|routing|vlan|mac-adress|mac-tabelle|default.?gateway|\barp\b"),
 "04 OSI":({"OSI-Modell & Protokolle"},r"osi|schicht ?[1-7]|layer ?[1-7]"),
 "05 Hardware/Beschaffung":({"Hardware-Komponenten","Netzwerk- und Arbeitsplatz-Ausstattung","Nutzwertanalyse","Wirtschaftlichkeit & TCO","Bezugskalkulation & Skonto"},r"angebotsvergleich|leasing|beschaff|nutzwert"),
 "06 RAID":({},r"raid"),
 "07 Netzwerksicherheit":({"WLAN & VPN","Härtung & Zugriffskontrolle"},r"firewall|\bvpn\b|\bdmz\b|802\.1x|radius|wpa[23]|port.?security|paketfilter"),
 "08 IDS":({},r"\bids\b|\bips\b|intrusion"),
 "09 Lasten-/Pflichtenheft":({"Lastenheft & Pflichtenheft"},r"lastenheft|pflichtenheft"),
 "10 Fehleranalyse Netz":({"Konsolenbefehle & Fehlersuche"},r"\bping\b|tracert|traceroute|nslookup|ipconfig|ifconfig|pathping"),
}
fr=[]
for f in sorted(glob.glob("pool/pool_*.json")):
  with open(f,encoding="utf-8") as fh:
    for q in json.load(fh): q["_datei"]=f[5:]; fr.append(q)
ap1=[q for q in fr if q.get("pruefungsteil")!="AP2" and q.get("schwierigkeit")]
gs=collections.Counter(q["schwierigkeit"] for q in ap1); n=sum(gs.values())
print("AP1-Stufenmix gesamt:",{k:f"{v/n:.0%}" for k,v in sorted(gs.items())})
aus={}
for name,(themen,rx) in T.items():
  L=[]
  for q in fr:
    txt=" ".join(str(q.get(k,"")) for k in ("titel","frage","thema","erklaerungKurz")).lower()
    if q.get("thema") in themen or re.search(rx,txt): L.append(q)
  st=collections.Counter(q.get("schwierigkeit") for q in L); ty=collections.Counter(q.get("typ") for q in L)
  pt=collections.Counter(q.get("pruefungsteil") for q in L)
  print(f"{name}: {len(L)} | Stufen {dict(sorted((str(k),v) for k,v in st.items()))} | Teil {dict(pt)} | Typen {len(ty)}: {', '.join(f'{k}{v}' for k,v in ty.most_common(6))}")
  aus[name]=[{"id":q["id"],"datei":q["_datei"],"thema":q.get("thema"),"typ":q.get("typ"),"stufe":q.get("schwierigkeit"),"teil":q.get("pruefungsteil")} for q in L]
with open("_to_delete/helfer/k2_kandidaten.json","w",encoding="utf-8",newline="\n") as fh:
  json.dump(aus,fh,ensure_ascii=False,indent=1)
