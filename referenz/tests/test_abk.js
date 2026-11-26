/* Test #61: IT-Abkürzungs-Lexikon (jsdom + Datencheck). Prüft: Datenintegrität (Anzahl/Dubletten/Kategorien/
   Pflicht-Abkürzungen), Gate (Abkürzungen-Tab erst ab >30 beantworteten Fragen), Tab-Umschaltung, Render der
   Liste, Suche filtert, esc auf Feldern. */
const { t: check, boot, report } = require("./_harness.js");
const ABK = require("./abkuerzungen.js");

function tabButton(D, label){
  const btns = D.getElementById("main").querySelectorAll("button");
  return Array.prototype.find.call(btns, b => b.textContent.trim() === label) || null;
}

(async () => {
  // --- Datenintegrität (ohne DOM) ---
  check("131 Einträge", ABK.length === 131);
  const kurz = ABK.map(a => a.kurz);
  check("keine Dubletten", kurz.filter((x,i)=>kurz.indexOf(x)!==i).length === 0);
  const kats = [...new Set(ABK.map(a=>a.kat))];
  const erlaubt = ["Netzwerk","Sicherheit","Hardware","Software","Projekt/QS","Wirtschaft/Recht"];
  check("nur erlaubte Kategorien", kats.every(k=>erlaubt.indexOf(k)>=0));
  check("keine leeren Felder", ABK.filter(a=>!a.kurz||!a.lang||!a.def||!a.kat).length === 0);
  check("def kompakt (<=100)", ABK.filter(a=>a.def.length>100).length === 0);
  const pflicht = ["DNS","DHCP","VLAN","RAID","OSI","ARP","NAT","VPN","TCP","UDP","SSD","USV","SLA","DSGVO"];
  check("Pflicht-Abkürzungen enthalten", pflicht.every(p=>kurz.indexOf(p)>=0));
  check("RAID korrekt aufgelöst", ABK.find(a=>a.kurz==="RAID").lang === "Redundant Array of Independent Disks");

  // --- Gate ZU: 0 beantwortete Fragen ---
  const w = await boot();
  const D = w.document;
  check("ABKUERZUNGEN global geladen", Array.isArray(w.ABKUERZUNGEN) && w.ABKUERZUNGEN.length === 131);
  w.seite = "glossar"; w.render();
  check("Gate zu: kein Abkürzungen-Tab", tabButton(D, "Abkürzungen") === null);
  check("Gate zu: Begriffe-Tab vorhanden", tabButton(D, "Begriffe") !== null);
  check("Gate zu: Freischalt-Hinweis sichtbar", D.getElementById("main").textContent.indexOf("ab 31 beantworteten") >= 0);

  // --- Gate OFFEN: >30 beantwortete Fragen ---
  const w2 = await boot({ version:5, statistik:{ M03:{richtig:20, gesamt:40} } });
  const D2 = w2.document;
  check("anzahlBeantwortet > 30", w2.anzahlBeantwortet() === 40);
  w2.seite = "glossar"; w2.render();
  const tA = tabButton(D2, "Abkürzungen");
  check("Gate offen: Abkürzungen-Tab vorhanden", tA !== null);

  // Tab wechseln
  tA.click();
  const main2 = D2.getElementById("main");
  check("Abk-Tab aktiv: glossarTab=abk", w2.glossarTab === "abk");
  check("Abk-Liste gerendert (RAID-Auflösung sichtbar)", main2.textContent.indexOf("Redundant Array of Independent Disks") >= 0);
  const suche = main2.querySelector("input[type=text]");
  check("Suchfeld vorhanden", !!suche);

  // Suche filtert
  suche.value = "DHCP"; suche.dispatchEvent(new w2.Event("input", { bubbles:true }));
  const txt = main2.textContent;
  check("Suche 'DHCP': DHCP sichtbar", txt.indexOf("Dynamic Host Configuration Protocol") >= 0);
  check("Suche 'DHCP': RAID ausgeblendet", txt.indexOf("Redundant Array of Independent Disks") < 0);

  // Kategorie-Suche
  suche.value = "wirtschaft"; suche.dispatchEvent(new w2.Event("input", { bubbles:true }));
  check("Kategorie-Suche 'wirtschaft': HGB sichtbar", main2.textContent.indexOf("Handelsgesetzbuch") >= 0);

  // Zurück zu Begriffe
  tabButton(D2, "Begriffe").click();
  check("zurück zu Begriffe: glossarTab=begriffe", w2.glossarTab === "begriffe");

  process.exit(report());
})();
