/* ============================================================================
   N25 P0: DER BEDEUTUNGSBAUM — was ein Screenreader von einem Schirm erfährt

   ⛔ Festgehalten wird die BEDEUTUNG, nicht das Aussehen: Rolle, zugänglicher
      Name, Zustand, Reihenfolge. Eine geänderte Tailwind-Klasse ist unsichtbar,
      ein verlorener Name oder eine verschwundene Schaltfläche nicht. Genau das
      braucht der Umbau auf shadcn-Bausteine (E16): das Aussehen SOLL sich
      ändern, die Bedienung nicht still.
   ⚠️ Nur für Tests. Kein Schirm importiert diese Datei; sie geht nicht ins Bündel.
   ⚠️ `dom-accessibility-api` ist dieselbe Bibliothek, mit der Testing Library
      `getByRole(…, { name })` auswertet – Schnappschuss und Tests messen also
      mit demselben Maß.
   ============================================================================ */
import { computeAccessibleName, getRole } from "dom-accessibility-api";
import { istObjekt } from "@/kern/pruefe";

/** Rollen, die in den Baum kommen. Alles andere (generic, paragraph …) wird
    durchlaufen, aber nicht als eigene Zeile geschrieben. */
const ROLLEN = new Set([
  "alert", "alertdialog", "banner", "button", "cell", "checkbox", "columnheader", "combobox",
  "complementary", "contentinfo", "dialog", "figure", "form", "group", "heading", "img", "link",
  "list", "listbox", "listitem", "main", "menu", "menuitem", "navigation", "option", "progressbar",
  "radio", "radiogroup", "region", "row", "rowheader", "search", "searchbox", "separator", "slider",
  "spinbutton", "status", "switch", "tab", "table", "tablist", "tabpanel", "textbox", "toolbar",
  "tooltip",
]);

function knapp(s: string, max = 70): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

/* N38 Q1: DOM-Eigenschaften werden als `unknown` gelesen und dann geprueft – vorher behauptete
   `el as HTMLInputElement` usw. den Elementtyp. `Reflect.get` ist genau der Zugriff `el[k]`. */
function eigenschaft(el: Element, k: string): unknown {
  return Reflect.get(el, k);
}

function verborgen(el: Element): boolean {
  if (el.getAttribute("aria-hidden") === "true" || el.hasAttribute("hidden")) return true;
  const st = eigenschaft(el, "style");
  return istObjekt(st) && (st.display === "none" || st.visibility === "hidden");
}

function ebene(el: Element, rolle: string): string[] {
  if (rolle !== "heading") return [];
  const m = /^H([1-6])$/.exec(el.tagName);
  return ["Ebene " + (el.getAttribute("aria-level") ?? (m ? m[1] : "?"))];
}

function checkedZustand(el: Element): string[] {
  const typ = eigenschaft(el, "type");
  const checked = el.getAttribute("aria-checked") ?? (el.tagName === "INPUT" && (typ === "checkbox" || typ === "radio")
    ? String(eigenschaft(el, "checked")) : null);
  return checked !== null ? ["checked=" + checked] : [];
}

function ariaZustaende(el: Element): string[] {
  const z: string[] = [];
  for (const n of ["aria-pressed", "aria-expanded", "aria-selected", "aria-current", "aria-invalid"]) {
    const v = el.getAttribute(n);
    if (v !== null && v !== "false") z.push(n.replace("aria-", "") + "=" + v);
  }
  return z;
}

function zustand(el: Element, rolle: string): string[] {
  const z = [...ebene(el, rolle), ...checkedZustand(el), ...ariaZustaende(el)];
  if (el.tagName === "DETAILS") z.push(eigenschaft(el, "open") ? "offen" : "zu");
  if (el.getAttribute("aria-disabled") === "true" || eigenschaft(el, "disabled")) z.push("gesperrt");
  return z;
}

function rolleVon(el: Element): string {
  if (el.tagName === "DETAILS") return "group";
  const rolle = el.getAttribute("role") || getRole(el) || "";
  /* Felder ohne ARIA-Rolle (date, time, color …) haetten sonst keine Zeile – sie
     sind aber Bedienung. Sie bekommen ihren Typ als Rolle. */
  const typ = eigenschaft(el, "type");
  if (!rolle && el.tagName === "INPUT" && typ !== "hidden") return "eingabe:" + String(typ);
  return rolle;
}

/** Die Zeile eines Elements – oder null, wenn es keine eigene Zeile trägt. */
function zeile(el: Element, rolle: string, tiefe: number): string | null {
  if (!(ROLLEN.has(rolle) || rolle.startsWith("eingabe:"))) return null;
  const name = knapp(computeAccessibleName(el));
  /* Unbenannte Gruppen tragen keine Bedeutung – nur ihr Inhalt zählt. */
  if ((rolle === "group" || rolle === "region") && !name && el.tagName !== "DETAILS") return null;
  const z = zustand(el, rolle);
  return "  ".repeat(tiefe) + rolle + (name ? ' "' + name + '"' : "") + (z.length ? " [" + z.join(", ") + "]" : "");
}

/** Ein zugeklapptes <details> zeigt nur seine Zusammenfassung – der Rest ist
    auch fuer den Screenreader nicht da. */
function sichtbareKinder(el: Element): Element[] {
  return el.tagName === "DETAILS" && !eigenschaft(el, "open")
    ? Array.from(el.children).filter((k) => k.tagName === "SUMMARY")
    : Array.from(el.children);
}

/** Der Baum als Text, eine Zeile je bedeutungstragendem Element, eingerückt nach Tiefe. */
export function bedeutungsbaum(wurzel: Element): string {
  const zeilen: string[] = [];
  function geh(el: Element, tiefe: number) {
    if (verborgen(el)) return;
    const z = zeile(el, rolleVon(el), tiefe);
    if (z !== null) zeilen.push(z);
    for (const k of sichtbareKinder(el)) geh(k, z !== null ? tiefe + 1 : tiefe);
  }
  geh(wurzel, 0);
  return zeilen.join("\n") + "\n";
}
