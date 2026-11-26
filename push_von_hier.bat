@echo off
chcp 65001 >nul
setlocal

REM ============================================================
REM  push_von_hier.bat - Release von DIESEM Rechner pushen
REM
REM  Gedacht fuer den Fall, dass die Sandbox den Proxy sperrt.
REM  Bewusst OHNE "git add -A": es wird NUR gepusht, was bereits
REM  committet ist. Unversionierte Arbeitsdateien bleiben liegen.
REM  Einfach doppelklicken.
REM ============================================================

cd /d "%~dp0"

echo.
echo ==== 1. Wo stehen wir? ====
git rev-parse --abbrev-ref HEAD
echo.
git log --oneline -3
echo.

echo ==== 2. Was ist NICHT committet? (wird nicht mitgepusht) ====
git status --short
if errorlevel 1 goto :fehler
echo.

echo ==== 3. Ist GitHub von hier aus erreichbar? ====
git ls-remote origin >nul 2>&1
if errorlevel 1 (
  echo.
  echo   FEHLER: GitHub ist auch von diesem Rechner nicht erreichbar.
  echo   Pruefe die Internetverbindung, dann erneut versuchen.
  echo.
  goto :ende
)
echo   OK - Remote antwortet.
echo.

echo ==== 4. Push ====
git push origin main
if errorlevel 1 (
  echo.
  echo   FEHLER beim Push. Ausgabe oben lesen.
  echo   Haeufigste Ursachen: Token abgelaufen, oder jemand hat
  echo   zwischenzeitlich auf main gepusht ^(dann erst git pull --rebase^).
  echo.
  goto :ende
)
echo.
echo   Gepusht.
echo.

echo ==== 5. Hat die Release-Action den Tag gesetzt? ====
echo   Die Action laeuft erst und legt den Tag NUR bei gruener CI an.
echo   Kurz warten, dann pruefen:
echo.
timeout /t 45 >nul
git ls-remote --tags origin
echo.
echo   Steht v1.3.0 oben NICHT dabei, ist die CI noch am Laufen
echo   oder eine Suite ist rot. Dann auf GitHub unter "Actions" nachsehen.
echo.
goto :ende

:fehler
echo   Kein Git-Repository gefunden oder git nicht im PATH.

:ende
echo.
pause
endlocal
