/* Test #45: Klausur-Timer in der Prüfungssimulation (jsdom).
   Prüft: Budget aus TYP_META (Auto) bzw. simDauerMin-Override, Timer-Element,
   Leak-Abbruch bei Seitenwechsel, Auto-Abgabe mit zeitSek in Historie + Auswertung. */
const { t: check, boot, report, sleep } = require("./_harness.js");

(async () => {
  const w = await boot();

  // TYP_META im Browser-Kontext verfügbar
  check("L.metaFuer vorhanden", typeof w.L.metaFuer === "function");

  // Einstellungen-Route rendert Simulationsdauer-Feld
  w.seite = "einst"; w.render();
  check("Einstellungen: Simulationsdauer-Feld", /Simulationsdauer/.test(w.document.getElementById("main").innerHTML));

  // Auto-Budget: simDauerMin=0 -> Dauer aus TYP_META-Summe der gezogenen Fragen
  w.S.simDauerMin = 0; w.seite = "sim"; w.render();
  const startBtn = [].slice.call(w.document.querySelectorAll("button")).find(function (b) { return /Prüfung starten/.test(b.textContent); });
  check("Start-Button vorhanden", !!startBtn);
  if (startBtn) startBtn.click();
  check("Simulation läuft", w.simLaeuft === true);
  check("Auto-Dauer aus TYP_META (>0)", w.sim && w.sim.dauerMin > 0);
  check("restSek == dauerMin*60", w.sim && w.sim.restSek === w.sim.dauerMin * 60);
  check("#simTimer-Element gerendert", !!w.document.getElementById("simTimer"));

  // Leak-Test: Seitenwechsel bricht laufende Simulation + Timer ab
  w.seite = "start"; w.render();
  check("Seitenwechsel stoppt Timer (simLaeuft false)", w.simLaeuft === false);
  check("Seitenwechsel: sim === null", w.sim === null);

  // Override: simDauerMin erzwingt feste Dauer
  w.S.simDauerMin = 45; w.seite = "sim"; w.render();
  const sb2 = [].slice.call(w.document.querySelectorAll("button")).find(function (b) { return /Prüfung starten/.test(b.textContent); });
  if (sb2) sb2.click();
  check("Override: dauerMin === 45", w.sim && w.sim.dauerMin === 45);
  check("Override: restSek === 45*60", w.sim && w.sim.restSek === 45 * 60);

  // Auto-Abgabe bei restSek 0 -> Historie-Eintrag mit zeitSek, Auswertung zeigt Zeit
  const before = w.S.simHistorie.length;
  w.sim.restSek = 0; w.simAbgeben();
  check("Historie +1 nach Abgabe", w.S.simHistorie.length === before + 1);
  const last = w.S.simHistorie[w.S.simHistorie.length - 1];
  check("Historie-Eintrag hat numerisches zeitSek", last && typeof last.zeitSek === "number");
  check("zeitSek == 45*60 bei vollem Ablauf", last && last.zeitSek === 45 * 60);
  check("Auswertung zeigt 'Benötigte Zeit'", /Benötigte Zeit/.test(w.document.getElementById("main").innerHTML));

  // R3: Countdown folgt der Wanduhr (Date.now()-startTs), nicht der Tick-Anzahl.
  // Simuliert gedrosselte Hintergrund-Tabs: Date.now() im window-Kontext wird gemockt/vorgespult,
  // während echte setInterval-Ticks (1000ms) weiterlaufen.
  const echtesDateNow = w.Date.now;
  w.S.simDauerMin = 20; w.seite = "sim"; w.render();
  const sb3 = [].slice.call(w.document.querySelectorAll("button")).find(function (b) { return /Prüfung starten/.test(b.textContent); });
  if (sb3) sb3.click();
  const simStart = w.sim.startTs;
  const startRestSek = w.sim.restSek;

  // Wanduhr springt 5s vor, danach feuert mindestens 1 echter Tick -> restSek soll um genau 5 sinken
  w.Date.now = function () { return simStart + 5000; };
  await sleep(1200);
  check("R3: Wanduhr +5s / 1 Tick -> restSek um 5 gesunken (nicht um 1 pro Tick)", w.sim && w.sim.restSek === startRestSek - 5);

  // Viele weitere Ticks OHNE Zeitfortschritt (Date.now bleibt eingefroren) -> restSek unverändert
  const restNachSprung = w.sim.restSek;
  await sleep(3200); // ca. 3 weitere echte Ticks bei gleichbleibender gemockter Wanduhr
  check("R3: mehrere Ticks ohne Zeitfortschritt ändern restSek nicht", w.sim && w.sim.restSek === restNachSprung);

  // Erneuter, größerer Wanduhr-Sprung bestätigt die Formel exakt (nicht nur zufällig konsistent)
  w.Date.now = function () { return simStart + 12000; };
  await sleep(1200);
  check("R3: restSek = dauerMin*60 - floor((Date.now()-startTs)/1000)", w.sim && w.sim.restSek === w.sim.dauerMin * 60 - 12);

  w.Date.now = echtesDateNow;
  w.simAbbrechen();

  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
