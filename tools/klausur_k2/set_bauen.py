# tools/klausur_k2/set_bauen.py – K2 Etappe A: legt pool/sets/klausur_k2.json aus den Kandidaten an (Aufruf aus der Repo-Wurzel).
# Etappe A sät das Set mit ALLEN Kandidaten (kandidaten.py); Etappe B kürzt auf ~20 je Thema (PLAN_KLAUSUR2 §9 K2-E19).
import json

TITEL = {
    "01 Topologie": ("Topologie", None),
    "02 Subnetting": ("Subnetting", "subnetting"),
    "03 Switch/Routing": ("Switch & Routing", None),
    "04 OSI": ("OSI-Modell", None),
    "05 Hardware/Beschaffung": ("Hardware-Auswahl & Beschaffung", None),
    "06 RAID": ("RAID 1/5/10", "raid"),
    "07 Netzwerksicherheit": ("Netzwerksicherheit", None),
    "08 IDS": ("IDS/IPS", None),
    "09 Lasten-/Pflichtenheft": ("Lasten- & Pflichtenheft", None),
    "10 Fehleranalyse Netz": ("Fehleranalyse im Netzwerk", None),
}
with open("_to_delete/helfer/k2_kandidaten.json", encoding="utf-8") as fh:
    kand = json.load(fh)
themen = []
for schluessel, (titel, gen) in TITEL.items():
    ids = sorted({k["id"] for k in kand[schluessel] if k["datei"].startswith("pool_m")})  # Faelle (pool_faelle) sind keine Fragen
    themen.append({"nr": int(schluessel[:2]), "titel": titel, "generator": gen, "ids": ids})
out = {
    "_kommentar": "Klausur-Set K2 (docs/plaene/PLAN_KLAUSUR2.md). Nur Verweise auf Pool-IDs, keine Kopien (K2-E3). Gelesen von neu/src/kern/klausur.ts.",
    "name": "Klausur 2 – Netzwerk & Beschaffung",
    "datum": "2026-10-20",
    "themen": themen,
}
with open("pool/sets/klausur_k2.json", "w", encoding="utf-8", newline="\n") as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)
    fh.write("\n")
print({t["nr"]: len(t["ids"]) for t in themen})
