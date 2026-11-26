/* TRUSTED TYPES (Audit 26.09.2026, AUD-C8).
   Die CSP verlangt `require-trusted-types-for 'script'`: der Browser nimmt an HTML- und
   Skript-Senken (innerHTML, serviceWorker.register …) nur noch Werte, die durch eine
   benannte Politik gegangen sind. Diese Datei IST die einzige Politik („ap1").
   ⛔ `createHTML` reicht den Text durch – die Pruefung des Inhalts macht `daten/svg.test.ts`
      (Pool-SVG ist reine Zeichnung). Wer hier etwas anderes als Pool-SVG durchschickt, braucht
      zuerst eine eigene Pruefung.
   ⛔ `createScriptURL` laesst NUR den eigenen Service Worker durch.
   ⚠️ Browser ohne Trusted Types (und jsdom): es bleibt beim einfachen Text. */
type Politik = { createHTML(s: string): unknown; createScriptURL(s: string): unknown };
type TT = { createPolicy(name: string, regeln: { createHTML(s: string): string; createScriptURL(s: string): string }): Politik };

export const POLITIK = "ap1";
const SW_ERLAUBT = /^\/app-sw\.js$/;

/* N38 Q1: BEGRUENDET STEHEN GELASSEN (3 Umwandlungen): `trustedTypes` fehlt in der DOM-Bibliothek
   von TS, und die Senken (`__html`, `register`) sind dort als `string` getippt, nehmen im Browser
   aber TrustedHTML/TrustedScriptURL. Die Umwandlung IST hier der Zweck der Datei. */
let politik: Politik | null | undefined;

function hole(): Politik | null {
  if (politik !== undefined) return politik;
  const tt = (globalThis as { trustedTypes?: TT }).trustedTypes;
  politik = tt
    ? tt.createPolicy(POLITIK, {
        createHTML: (s) => s,
        createScriptURL: (s) => {
          const pfad = new URL(s, location.href);
          if (pfad.origin !== location.origin || !SW_ERLAUBT.test(pfad.pathname)) throw new TypeError("Skript-Adresse nicht erlaubt: " + s);
          return s;
        },
      })
    : null;
  return politik;
}

/** Fuer `dangerouslySetInnerHTML` mit Pool-SVG. */
export function svgInhalt(svg: string): { __html: string } {
  const p = hole();
  return { __html: (p ? p.createHTML(svg) : svg) as string };
}

/** Fuer `serviceWorker.register`. */
export function swAdresse(url: string): string {
  const p = hole();
  return (p ? p.createScriptURL(url) : url) as string;
}
