/* Aus app_state.js beim Bauen eingesetzt (appversion.config.ts, N20b). */
// oxlint-disable-next-line eslint/no-underscore-dangle -- Vite-`define`-Global, in vite.config.ts und mehreren Dateien festgelegt
declare const __APP_VERSION__: string;

/* N25 P0: `dom-accessibility-api` (dieselbe Bibliothek, mit der Testing Library
   `getByRole(…, { name })` rechnet) bringt Typen mit, aber ihr `exports`-Feld
   verweist nicht darauf – TypeScript findet sie unter "bundler" nicht. Hier nur
   die zwei Funktionen, die huelle/bedeutungsbaum.ts benutzt. */
declare module "dom-accessibility-api" {
  export function computeAccessibleName(root: Element): string;
  export function getRole(element: Element): string | null;
}
