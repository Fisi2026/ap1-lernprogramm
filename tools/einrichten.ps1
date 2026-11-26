# tools/einrichten.ps1 - richtet einen Windows-Rechner fuer dieses Projekt ein.
# Aufruf im Repo-Klon (PowerShell, einmal je Rechner):
#   powershell -ExecutionPolicy Bypass -File tools\einrichten.ps1
# Vorher (frischer PC, noch kein Klon) - steht auch im claude.ai-Projekt "Training":
#   winget install -e --id Git.Git ; winget install -e --id GitHub.cli
#   (PowerShell neu oeffnen) ; gh auth login -h github.com -p https -w
#   gh repo clone Fisi2026/ap1-lernprogramm "$env:USERPROFILE\Claude\Projects\Training"
#
# WARUM (26.09.2026): der Umzug auf einen frischen PC stand nirgends; alles wurde im Chat
# zusammengesucht. Dieses Skript macht den Teil, der Windows-Rechte braucht (winget), und
# uebergibt dann an tools/einrichten.sh (Git Bash), das den Rest einrichtet und prueft.
# Nur ASCII in dieser Datei: Windows PowerShell 5.1 liest .ps1 ohne BOM als ANSI.
$ErrorActionPreference = 'Continue'
$repo = Split-Path -Parent $PSScriptRoot

function Frisch-Path {
  $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
}

Write-Host '==== 1. Programme (winget) ===='
$pakete = [ordered]@{ git='Git.Git'; gh='GitHub.cli'; python='Python.Python.3.12'; node='OpenJS.NodeJS.LTS'; jq='jqlang.jq' }
foreach ($p in $pakete.Keys) {
  # python: AUSFUEHREN statt finden - der Store-Platzhalter unter WindowsApps heisst auch python.exe.
  if ($p -eq 'python') { $global:LASTEXITCODE = 1; python -c 'import sys' *> $null; $da = ($LASTEXITCODE -eq 0) }
  else { $da = [bool](Get-Command $p -ErrorAction SilentlyContinue) }
  if ($da) { Write-Host "  OK       $p" }
  else {
    Write-Host "  INSTALL  $p ($($pakete[$p]))"
    winget install -e --id $pakete[$p] --accept-package-agreements --accept-source-agreements --silent
  }
}
Frisch-Path

Write-Host '==== 2. GitHub-Anmeldung ===='
gh auth status *> $null
if ($LASTEXITCODE -ne 0) { gh auth login -h github.com -p https -w } else { Write-Host '  OK       gh angemeldet' }

Write-Host '==== 3. Einrichten und Pruefen (Git Bash: tools/einrichten.sh) ===='
$bash = @("$env:ProgramFiles\Git\bin\bash.exe", "${env:ProgramFiles(x86)}\Git\bin\bash.exe",
          "$env:LOCALAPPDATA\Programs\Git\bin\bash.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $bash) { Write-Host '  FEHLT    Git Bash - Git neu installieren, PowerShell neu oeffnen, Skript erneut starten'; exit 1 }
Push-Location $repo
& $bash -lc 'bash tools/einrichten.sh'
$offen = $LASTEXITCODE
Pop-Location

Write-Host '==== 4. Training Shell ===='
# Die App legt Erweiterungen unter %APPDATA%\Claude ODER %LOCALAPPDATA%\Claude-Data\claude_<kennung> ab
# (19.10.2026: auf dem PC des Nutzers nur dort) - beide absuchen.
$basen = @(Join-Path $env:APPDATA 'Claude') + @(Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Claude-Data') -Directory -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName })
$erw = $basen | ForEach-Object { Join-Path $_ 'Claude Extensions\local.mcpb.winterberg.training-shell\server\index.js' } |
  Where-Object { Test-Path $_ } | Select-Object -First 1
$mcpb = Join-Path $repo 'tools\training-shell\training-shell.mcpb'
if (-not $erw -and (Test-Path $mcpb)) {
  # Kein Start-Process: ein Doppelklick/Oeffnen der .mcpb oeffnet nur einen neuen Chat (gemessen 26.09.2026).
  Write-Host "  $mcpb MANUELL in der Claude-Desktop-App installieren, danach die App NEU STARTEN."
  explorer.exe "/select,$mcpb"
} elseif ($erw) { Write-Host '  OK       installiert' }

Write-Host "==== Ende: $offen offene(r) Punkt(e) laut einrichten.sh (Training Shell/Buch ggf. oben) ===="
