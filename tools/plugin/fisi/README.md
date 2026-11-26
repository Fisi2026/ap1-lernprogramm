# Plugin „fisi"

Skills und ein Hook fuer die Arbeit an der FISI-2026-Lern-App (Ordner Training):

- **fisi-lernapp** – wie ein Chat anfaengt (Bruecke, Ordner, `tools/start.sh`), liest, prueft, committet und pusht.
- **agenten-orchestrierung** – wann und wie Subagenten eingesetzt werden.
- **hooks/limits.ts** – Kontext, 5h- und 7T-Limit als `[limits]`-Zeile; an Schwellen sagt die Zeile selbst, was zu tun ist
  (E077, ersetzt seit 1.3.2 den Skill token-wache).

Quelle ist dieses Verzeichnis im Repo (N36, E59). Die Training Shell bleibt die eigene `.mcpb`-Erweiterung
(`tools/training-shell/`). Bauen: `python3 tools/plugin/packen.py`.
