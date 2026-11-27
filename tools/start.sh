#!/usr/bin/env bash
# tools/start.sh - der ganze Chat-Start in EINEM Aufruf (BUILD_LOG 26, Nachtrag 9a, 21.09.2026).
# Ersetzt die drei Pflichtbefehle aus START_PROMPT Abschnitt 1 plus Push-Stand, CI-URTEIL,
# Token-Wache und die "Damit offen"-Zeile. Das Waermen laeuft im HINTERGRUND (Marke
# _to_delete/helfer/waermen.fertig) - der Aufruf bleibt so unter dem 60-s-Deckel.
# Benutzung: bash tools/start.sh --neuer-chat <gmail|web.de>
# ⛔ OHNE --neuer-chat wird die Wache NICHT neu gestartet. Grund (21.09.): ein Probelauf mitten im
#    Chat legte das Kassenbuch neu an - die Zaehlung begann bei 0, die Kontoablesungen waren weg.
#    Ein Chat kann sich selbst nicht erkennen; deshalb muss der Start es AUSDRUECKLICH sagen.
H=_to_delete/helfer; mkdir -p "$H"; rm -f "$H/waermen.fertig"
nohup bash -c "bash tools/suite.sh --waermen > $H/waermen.txt 2>&1; echo rc=\$? > $H/waermen.fertig" >/dev/null 2>&1 &
# 13.10.2026 (BUILD_LOG 153): ci2.sh (gh, ~16 s) laeuft parallel zu umgebung.sh (~18 s) statt danach - gemessen
#   warm 43 s fuer den ganzen Start, davon diese zwei nacheinander. Abgeholt wird im Abschnitt CI.
rm -f "$H/start_ci.fertig"
nohup bash -c "bash ci2.sh > $H/start_ci.txt 2>&1; echo rc=\$? > $H/start_ci.fertig" >/dev/null 2>&1 &
echo "== UMGEBUNG (nur Warnungen)"; bash tools/umgebung.sh 2>&1 | grep -E '⚠️|FEHLT|fehlt|NEIN|Lock|lock|BLOCK|Budget|Byte \(|Zeilen' | head -12
echo "== BAUM";  git status --porcelain; echo "(Ende Baum)"
echo "== LOG";   git log --oneline -3
bash tools/alt_klon_weiche.sh   # Umzug Schritt 6.1 (BUILD_LOG 284): alter Klon -> origin weg
echo "== REMOTE"; bash tools/gitc.sh fetch -q origin 2>&1 | tail -2; git log --oneline -1 origin/main
# 14.10.2026 (BUILD_LOG 176): reiner Rueckstand bei sauberem Baum -> selbst vorspulen. Seit Paket 1 (27.11.2026,
#   BUILD_LOG 316) per `gitc.sh nachziehen`: das zieht main auch nach einem SQUASH-Merge nach (gleicher Baum, andere SHA)
#   und bricht laut ab, wenn Inhalte verschieden sind oder der Baum nicht sauber ist.
git branch -q --set-upstream-to=origin/main main 2>/dev/null || true
bash tools/gitc.sh nachziehen 2>&1 | sed 's/^/[start] /'
python3 tools/ungepusht.py 2>&1 | head -1
echo "== CI"
# ⛔ 26.09.2026: hier stand nur `grep -i URTEIL` - ci2.sh bricht ohne gh-Anmeldung mit
#    "ABBRUCH" ab, und der Abschnitt blieb LEER statt zu warnen (frischer PC). Leer heisst jetzt laut.
for _i in $(seq 1 60); do [ -f "$H/start_ci.fertig" ] && break; sleep 0.5; done
if [ -f "$H/start_ci.fertig" ]; then CI="$(grep -iE 'URTEIL|ABBRUCH' "$H/start_ci.txt")"
else CI="⚠️ ci2.sh nach 30 s nicht fertig - Ausgabe folgt in $H/start_ci.txt"; fi
[ -n "$CI" ] && echo "$CI" || echo "⚠️ kein URTEIL - ci2.sh stumm; bash ci2.sh von Hand lesen"
echo "== WACHE"
# N51 A6 (12.10.2026, Nutzer-Entscheid BUILD_LOG 147): wache.py STILLGELEGT als Regelweg. Massgeblich sind die
#   [limits]-Zeilen des Plugin-Hooks (fisi >= 1.3.0: Kontext, 5h, 7T - echte Werte statt Schaetzung).
#   wache.py bleibt NOTFALL (Selbsttest haelt 4e11), wenn im Chat keine [limits]-Zeile ankommt.
echo "Verbrauch: [limits]-Zeilen des Plugin-Hooks (E077). Kommt KEINE Zeile: Notfall"
echo "  python3 tools/wache.py start --konto ${2:-<gmail|web.de>}"
[ "$1" = "--neuer-chat" ] && [ -z "$2" ] && echo "Konto fehlt - Nutzer fragen (gmail|web.de); es steuert den Plugin-Abgleich unten"
echo "== PLUGIN (Konto/PC-Wechsel)"; bash tools/plugin/soll.sh "${2:-}" 2>&1 | head -6
echo "== DAMIT OFFEN (letzter BUILD_LOG-Eintrag)"; awk '/^## /{b=""} {b=b $0 "\n"} END{printf "%s", b}' BUILD_LOG.md | sed -n '/Damit offen/,$p' | head -30
