# S45 – N41 S4/S5: Herkunft und Pins (ENTWURF, Zweig n41-s45, Basis ef65e6b)

Entwurf nach N12: Leitung übernimmt nicht ohne Nutzer-Ja; Wirkung erst im öffentlichen Repo (nach N40 V3). Alles nur auf diesem Zweig.

## Was
| Datei | Änderung |
|---|---|
| `.github/workflows/ci.yml` | (1) harden-runner `egress-policy: audit` als erster Schritt in allen vier Jobs (check, semgrep, release, deploy). (2) Job `deploy`: Rechte `id-token: write` + `attestations: write` (nur dort, übrige Jobs unverändert) und letzter Schritt `actions/attest-build-provenance` mit `subject-path: 'v2/**'` (nur bei gesetztem Token, wie der Rest des Deploys). (3) Semgrep-Install mit `--require-hashes`. |
| `tools/semgrep/requirements.txt` | jetzt gehasht (pip-tools 7.6.2, `pip-compile --generate-hashes --allow-unsafe --strip-extras`), ~60 Pakete transitiv. |
| `tools/semgrep/requirements.in` | neu: die eine direkte Zeile `semgrep==1.180.0` (Quelle für pip-compile). |
| `DEPLOY.md` | Abschnitt „Herkunft prüfen“ mit `gh attestation verify v2/index.html --repo Fisi2026/ap1-lernprogramm --signer-workflow …/ci.yml`. |
| `.tooling` | keine Änderung nötig: CI nutzt schon `npm ci`; das Lockfile (v3) hat für alle 85 Pakete `resolved` + `integrity` (gemessen). |

## Quelle je SHA (alle gemessen 17.10.2026 per `git ls-remote --tags`, Tag ohne `^{}`-Zeile = leichtgewichtig, SHA = Commit)
- `actions/attest-build-provenance` v4.2.2 = `4d101475d8b20a2381f78447822ac1eab6504dd8` (gleich dem beweglichen Tag `v4^{}`).
- `step-security/harden-runner` v2.22.1 = `ccd8616d44fd3846e67624a50d5aad6d37bf2d25` (neuester x.y.z-Tag).
Kein Platzhalter nötig. Nicht gemessen: ob die Tags auf dem offiziellen Zweig liegen/signiert sind (angenommen).

## Gemessen
- `pip install --require-hashes -r tools/semgrep/requirements.txt` in frischem venv (Python 3.13): erfolgreich, `semgrep 1.180.0`.
- ci.yml parst als YAML.

## Offene Punkte / Annahmen
1. **Erlaubnisliste für Actions (S2)** braucht `step-security/harden-runner@ccd8616d44fd3846e67624a50d5aad6d37bf2d25` und `actions/attest-build-provenance@4d101475d8b20a2381f78447822ac1eab6504dd8`; Setzen erst nach N40 V3.
2. Bescheinigungen in **privaten** Repos erfordern GitHub Enterprise Cloud (angenommen, nach Dokumentation; nicht gemessen) – deshalb erst im öffentlichen Repo wirksam. Bis dahin würde der Schritt im privaten Repo scheitern: nicht auf main übernehmen vor N40 V3.
3. `subject-path: 'v2/**'` (36 Dateien, gemessen) – ob die Aktion Verzeichnisse im Glob überspringt, ist angenommen; nicht ausführbar ohne Lauf.
4. Hashes wurden unter Python 3.13/Linux erzeugt; der Runner hat Python 3.12 (angenommen). Umgebungsmarker decken Unterschiede meist ab; erster CI-Lauf entscheidet. Dependabot-Updates für die gehashte Datei: angenommen unterstützt.
5. harden-runner im Audit-Modus: Blockieren (Erlaubnisliste für Ziele) erst nach Auswertung der Audit-Läufe.
6. Dependabot-Konfiguration unverändert.
