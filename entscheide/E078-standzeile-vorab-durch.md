# E078 – Standzeile vorab „PUSH DURCH“, Push-Fehlschlag setzt OFFEN
**Status:** angenommen (12.10.2026, Nutzer, AskUserQuestion) · **Quelle:** BUILD_LOG 148

## Kontext
N51 A4: die Standzeile brauchte nach jedem Push mit Wirkung einen eigenen Commit „PUSH DURCH" oder wurde zu frueh umgestellt
(BUILD_LOG 144: einer von vier roten Laeufen). Ohne Extra-Commit stimmt die Zeile nur, wenn sie schon im Commit steht.

## Entscheid
Die Zeile steht vor `check.sh` auf „LIVE = committet · PUSH DURCH" (`tools/standzeile.py vorab`, `release.sh`); ein Commit mit
Wirkung wird sofort gepusht. Scheitert der Push, setzt `tools/gitc.sh` die Zeile per Folge-Commit auf „PUSH OFFEN".

## Folgen
Zwischen Commit und Push stimmt die Zeile nicht – darum kein `check.sh` dazwischen und sofort pushen. Gegenprobe mit
ablehnendem Remote in BUILD_LOG 148. Eine rote CI faengt weiter Waechter 4e2b2c beim naechsten Lauf.
