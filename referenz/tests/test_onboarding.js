"use strict";
/* Test (FB-R3 Punkt 7, 2026-07-23): Onboarding-Tour. Prüft Schrittzahl und -inhalte (inkl. dem
   neuen Schritt „Werkzeuge & Handy-App": Fokus-Modus, Selbstabfrage, Handy-App/offline), den
   Overlay-Aufbau samt a11y (role=dialog/aria-modal/aria-label), Weiter/Zurück/Überspringen und die
   Reaktivierung über starteOnboarding (S.onboardingDone). */
const { t: check, boot, report } = require("./_harness.js");

function clearOv(w){ [...w.document.querySelectorAll(".onb-overlay")].forEach(o => o.parentNode && o.parentNode.removeChild(o)); }

(async () => {
  const w = await boot();
  const S = w.S;
  const ONB = w.ONB_SCHRITTE;

  // ── 1) Struktur ────────────────────────────────────────────────────────────
  check("ONB_SCHRITTE ist Liste", Array.isArray(ONB));
  check("Tour hat 7 Schritte", ONB.length === 7);
  check("jeder Schritt hat Titel + Text", ONB.every(s => s.t && s.d && s.t.length > 0 && s.d.length > 10));
  const titel = ONB.map(s => s.t);
  check("enthält Willkommen/Üben/Simulation/Statistik",
    ["Willkommen", "Üben", "Prüfungssimulation", "Statistik & Fehler-Deck"].every(x => titel.indexOf(x) >= 0));

  // ── 2) neuer „Werkzeuge & Handy-App"-Schritt ───────────────────────────────
  const werk = ONB.find(s => /Werkzeuge/.test(s.t));
  check("neuer Schritt Werkzeuge und Handy-App existiert", !!werk);
  check("erwähnt den Fokus-Modus", !!werk && /Fokus-Modus/.test(werk.d));
  check("erklärt die Selbstabfrage (Optionen selbst aufdecken)",
    !!werk && /Optionen/.test(werk.d) && /(überlegst|[Ee]rinnern)/.test(werk.d));
  check("nennt die Abschaltbarkeit in den Einstellungen", !!werk && /Einstellungen abschaltbar/.test(werk.d));
  check("erwähnt Handy-App + offline",
    !!werk && /(Handy|Startbildschirm)/.test(werk.d) && /offline/.test(werk.d));
  check("Werkzeuge-Schritt steht vor „Nachschlagen & Einstellungen",
    titel.indexOf(werk.t) < titel.indexOf("Nachschlagen & Einstellungen"));

  // ── 3) Overlay-Aufbau + a11y ───────────────────────────────────────────────
  clearOv(w); S.onboardingDone = false;
  w.starteOnboarding();
  let ov = w.document.querySelector(".onb-overlay");
  check("starteOnboarding erzeugt Overlay", !!ov);
  check("Overlay ist role=dialog", ov.getAttribute("role") === "dialog");
  check("Overlay ist aria-modal=true", ov.getAttribute("aria-modal") === "true");
  check("Overlay hat aria-label", !!ov.getAttribute("aria-label"));
  check("Schrittzähler zeigt 'Schritt 1 / 7'", /Schritt 1 \/ 7/.test(ov.textContent));
  check("erster Schritt: kein Zurück-Knopf", ![...ov.querySelectorAll("button")].some(b => /zurück/i.test(b.textContent)));
  check("erster Schritt zeigt den Willkommen-Titel", ov.textContent.indexOf("Willkommen") >= 0);

  // ── 4) Weiter blättert vorwärts ────────────────────────────────────────────
  const vor = [...ov.querySelectorAll("button")].find(b => /weiter/i.test(b.textContent));
  check("Schritt 1 hat einen Weiter-Knopf", !!vor);
  vor.click();
  ov = w.document.querySelector(".onb-overlay");
  check("nach Weiter: 'Schritt 2 / 7'", /Schritt 2 \/ 7/.test(ov.textContent));
  check("ab Schritt 2: Zurück-Knopf vorhanden", [...ov.querySelectorAll("button")].some(b => /zurück/i.test(b.textContent)));

  // ── 5) Bis zum letzten Schritt -> „Los geht's" schließt + setzt onboardingDone ─
  clearOv(w); S.onboardingDone = false; w.starteOnboarding();
  for (let i = 0; i < ONB.length - 1; i++) {
    ov = w.document.querySelector(".onb-overlay");
    [...ov.querySelectorAll("button")].find(b => /weiter/i.test(b.textContent) || /los geht/i.test(b.textContent)).click();
  }
  // letzter Schritt: der Knopf heißt „Los geht's"
  ov = w.document.querySelector(".onb-overlay");
  check("letzter Schritt: Knopf 'Los geht's'", !!ov && [...ov.querySelectorAll("button")].some(b => /los geht/i.test(b.textContent)));
  [...ov.querySelectorAll("button")].find(b => /los geht/i.test(b.textContent)).click();
  check("Los-geht's-Knopf schließt das Overlay", !w.document.querySelector(".onb-overlay"));
  check("Tour-Ende setzt onboardingDone = true", S.onboardingDone === true);

  // ── 6) Überspringen schließt + setzt onboardingDone ────────────────────────
  clearOv(w); S.onboardingDone = false; w.starteOnboarding();
  ov = w.document.querySelector(".onb-overlay");
  [...ov.querySelectorAll("button")].find(b => /überspringen/i.test(b.textContent)).click();
  check("Überspringen schließt das Overlay", !w.document.querySelector(".onb-overlay"));
  check("Überspringen setzt onboardingDone = true", S.onboardingDone === true);

  // ── 7) Reaktivierung: nach done erneut startbar ────────────────────────────
  clearOv(w); S.onboardingDone = true;
  w.starteOnboarding();
  check("Reaktivierung: Overlay lässt sich erneut öffnen", !!w.document.querySelector(".onb-overlay"));
  clearOv(w);

  process.exit(report());
})().catch(e => { console.log("ABBRUCH:", e); process.exit(1); });
