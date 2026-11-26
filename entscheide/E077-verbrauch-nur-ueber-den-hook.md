# E077 – Verbrauch nur ueber den Hook; Skill token-wache entfaellt, wache.py nur Notfall
**Status:** angenommen (12.10.2026, Nutzer, AskUserQuestion + Rueckfrage „ohne den Skill, direkt im Plugin") · **Quelle:** BUILD_LOG 150

## Kontext
Seit fisi 1.3.0 liefert der Hook `limits.ts` die echten Werte (Kontext, 5h, 7T) und meldet Schwellen samt Handlung. `tools/wache.py`
schaetzt nur und brauchte Kontoablesungen des Nutzers. Der Skill token-wache stand mit seiner Beschreibung in jedem Chat beider
Konten im Systemtext (~80 Tokens) und kostete geladen ~1200 Tokens.

## Entscheid
Der Verbrauch wird nur noch ueber die `[limits]`-Zeilen des Hooks gemessen; die Handlungsanweisung steht in der Schwellen-Zeile
selbst. Der Skill token-wache entfaellt. `tools/wache.py` bleibt nur als Notfall, wenn keine `[limits]`-Zeile kommt.

## Folgen
Plugin fisi 1.3.2 traegt nur noch fisi-lernapp und agenten-orchestrierung (Nutzer installiert in beiden Konten). `start.sh`
startet kein Kassenbuch mehr. Waechter 4e11 haelt den Selbsttest von wache.py weiter, damit der Notfall funktioniert.
