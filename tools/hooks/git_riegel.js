#!/usr/bin/env node
// git_riegel.js – PreToolUse-Hook (Claude Code) fuer Bash, PowerShell und die Training Shell.
// Neu 26.11.2026 (BUILD_LOG 296, Nutzer-Entscheid „Riegel als Hook“): die Regeln „committen nur ueber
// tools/gitc.sh“ und „nie --force“ standen bisher nur als Text in START_PROMPT/Skill. Laut Claude-Code-Doku
// (features-overview) ist eine Anweisung „a request, not a guarantee“ – dieser Hook macht sie deterministisch.
// Eingabe: JSON auf stdin ({tool_name, tool_input:{command}}). Sperre: rc 2 + Grund auf stderr.
// Force-Push auf main sperrt zusaetzlich der Ruleset „main“ auf GitHub (BUILD_LOG 285).
// Selbsttest: node tools/hooks/git_riegel.js --probe   (regeln/messen.md: --probe vor dem Einsatz)
"use strict";

// Liefert den Sperrgrund oder "" (frei).
/** @param {unknown} befehl @returns {string} */
function pruefe(befehl) {
  if (typeof befehl !== "string" || !befehl.trim()) return "";
  // Heredoc-Inhalte (cat > datei <<'EOF' … EOF) und Zeichenketten in Anfuehrungszeichen (Commit-Texte, echo)
  // nicht als Befehl lesen. Fehlalarm 26.11. ohne die Heredoc-Regel: eine Commit-NACHRICHT wurde gesperrt.
  const ohneText = befehl
    .replace(/<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\1[^\n]*\n[\s\S]*?\n[ \t]*\2[ \t]*(?=\n|$)/g, "<<HEREDOC")
    .replace(/'[^']*'/g, "''").replace(/"(?:\\.|[^"\\])*"/g, '""');
  // Einzelbefehle an ; && || | und Zeilenumbruch trennen.
  for (const teil of ohneText.split(/;|&&|\|\||\||\n/)) {
    const t = teil.trim();
    // git [-C pfad] [-c k=v]… commit  (nicht commit-tree, nicht gitc.sh)
    if (/(^|[\s(])git(\.exe)?(\s+-[Cc]\s+\S+)*\s+commit(\s|$)/.test(t))
      return "git commit direkt ist gesperrt – committen nur ueber `bash tools/gitc.sh commit -F <datei>` (Stempel nach gruenem check.sh).";
    // Force-Push in jeder Form, auch ueber gitc.sh
    if (/(^|[\s(])(git(\.exe)?(\s+-[Cc]\s+\S+)*|bash\s+\S*gitc\.sh|\S*gitc\.sh)\s+push\b/.test(t)) {
      if (/\s(--force(-with-lease|-if-includes)?(=\S*)?|-[a-zA-Z]*f[a-zA-Z]*)(\s|$)/.test(t) || /\s\+\S+/.test(t))
        return "Force-Push ist gesperrt (Nutzer-Entscheid: nie --force; Ruleset main sperrt ihn auch auf GitHub).";
    }
  }
  return "";
}

function probe() {
  const faelle = [
    ["bash tools/gitc.sh commit -F _to_delete/helfer/m.txt", ""],
    ["git commit -m 'x'", "commit"],
    ["cd /x && git -C neu commit -am fix", "commit"],
    ["git commit-tree abc", ""],
    ["echo 'git commit -m x' > notiz.txt", ""],
    ["git log --oneline -3; git status", ""],
    ["bash tools/gitc.sh push origin main", ""],
    ["git push origin main", ""],
    ["git push --force origin main", "Force"],
    ["git push -f origin main", "Force"],
    ["bash tools/gitc.sh push --force-with-lease origin main", "Force"],
    ["git push origin +main", "Force"],
    ["git push origin --delete probe/x", ""],
    ["git push -u origin feature", ""],
    ["", ""],
    ["cat > m.txt <<'EOF'\nsperrt git commit an gitc.sh vorbei\nEOF\ngit status", ""],
    ["cat > m.txt <<EOF\ngit push --force\nEOF", ""],
    ["cat > m.txt <<'EOF'\nText\nEOF\ngit commit -F m.txt", "commit"],
  ];
  let fehler = 0;
  for (const [cmd, soll] of faelle) {
    const ist = pruefe(cmd);
    const gut = soll === "" ? ist === "" : ist.includes(soll);
    if (!gut) { fehler++; console.log(`[git_riegel] FALSCH: ${JSON.stringify(cmd)} -> ${ist || "frei"} (soll ${soll || "frei"})`); }
  }
  const rot = faelle.filter(f => f[1]).length;
  console.log(`[git_riegel] ${faelle.length - fehler}/${faelle.length} Faelle richtig (${rot} gesperrt erwartet)`);
  process.exit(fehler ? 1 : 0);
}

if (process.argv.includes("--probe")) probe();
else {
  let roh = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", d => { roh += d; });
  process.stdin.on("end", () => {
    let ein;
    try { ein = JSON.parse(roh); } catch { process.exit(0); } // kein JSON: nicht sperren
    const grund = pruefe(ein && ein.tool_input && ein.tool_input.command);
    if (grund) { process.stderr.write(`[git_riegel] ${grund}\n`); process.exit(2); }
    process.exit(0);
  });
}
