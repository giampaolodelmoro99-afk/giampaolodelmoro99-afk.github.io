# ADR-0012: Stile di React Aria e CSP del sito

- **Stato**: Accettata
- **Data**: 2026-10-14
- **Fase**: 1B

## Contesto

La CSP del sito sta in un meta tag scritto dal post-build (GitHub Pages non permette header) e per gli stili ammette solo `style-src 'self'`: niente `'unsafe-inline'` né `'unsafe-eval'` (requisito non negoziabile, ADR-0000 e PERFORMANCE_SEO.md). Nella Fase 1A si è visto che React Aria inserisce a runtime uno `<style id="react-aria-pressable-style">`: sul sito la CSP lo blocca, con una violazione in console (e la fixture e2e `consoleErrors` fallisce).

Analisi di `react-aria-components` 1.22.1 e `react-aria` 3.53.1: cercati in tutto il codice distribuito `createElement('style')`, `setAttribute('style')`, `cssText`, `insertRule`, `adoptedStyleSheets`, `.style.*`, `setProperty` e le prop `style`. Ne escono tre tipi di intervento:

| Tipo                                                                      | Dove                                                                                                                                                                                                                                                                                                                 | Effetto con la CSP del sito                                                                                                                                                                                         |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Elemento `<style>`**                                                 | Solo `usePress` (`react-aria/dist/private/interactions/usePress.mjs`). Al montaggio del primo elemento premibile, se `document.getElementById("react-aria-pressable-style")` non esiste, inserisce `@layer { [data-react-aria-pressable] { touch-action: pan-x pan-y pinch-zoom; } }`. Con `NODE_ENV=test` non lo fa | **Bloccato**. Riguarda tutto ciò che si preme: Button, Link, ToggleButton, Checkbox, Radio, Tab, Select, Menu, GridList, pulsanti di Window e AlertDialog                                                           |
| **B. Scritture CSSOM** (`el.style.x = …`, `setProperty`, `Object.assign`) | `textSelection`, `usePreventScroll`, `useOverlayPosition`, `LiveAnnouncer`, `useDescription`, `useSafelyMouseToSubmenu`, `domHelpers`                                                                                                                                                                                | **Ammesso**: la CSP non governa il CSSOM. Nel codice non ci sono `setAttribute('style')` né `cssText`                                                                                                               |
| **C. Prop `style` di React**                                              | `VisuallyHidden` (Checkbox, Radio, `HiddenSelect`, `DismissButton` di Popover e Modal, parti di GridList), posizionamento di Popover, Tooltip e OverlayArrow, `--visual-viewport-*` di ModalOverlay, le nostre variabili `style={{ "--…" }}`                                                                         | Dopo l'idratazione **ammesso** (React usa il CSSOM). Nell'HTML prerenderizzato diventa un attributo `style="…"`: **bloccato**, e l'idratazione non lo riapplica (per esempio l'input della checkbox resta visibile) |

Il nonce non è un'opzione: React Aria lo legge da `<meta property="csp-nonce">`, ma su un sito statico sarebbe un valore fisso e pubblico, quindi chiunque potrebbe usarlo.

## Decisione

1. **Tipo A, sentinella.** React Aria non inserisce lo stile se trova già un elemento con id `react-aria-pressable-style`. L'id va sul `<link rel="stylesheet">` di `global.css` (`links()` in `src/app/root.tsx`, costante in `src/styles/reactAriaPressable.ts`), e `global.css` contiene la stessa regola, nello stesso layer anonimo. La CSP non cambia di un carattere e non c'è nessuna richiesta in più.
2. **Tipo B**: nessuna azione.
3. **Tipo C**: in 1B nessun componente con attributi `style` finisce in una pagina prerenderizzata. Un test prerender fallisce se un HTML del sito contiene un attributo `style`. La soluzione si decide in F2A con un nuovo ADR, quando i componenti arrivano sulla home. Opzioni da valutare:
   - il post-build calcola gli hash degli attributi e li aggiunge con `style-src-attr 'unsafe-hashes' 'sha256-…'` (CSP3, da verificare su Safari);
   - le sole parti nascoste (`VisuallyHidden`) si rendono dopo l'idratazione, senza togliere contenuto dall'HTML.
4. **404 come banco di prova.** I link della 404 usano il `Link` di React Aria con `AriaRouterProvider` (`src/components/AriaRouterProvider/`): `RouterProvider` di React Aria con `useNavigate` e `useHref` di React Router. Due eccezioni Oxlint limitate a quel file: import dalla radice di `react-aria-components` (`RouterProvider` non ha un sottopercorso) e `react/hooks` spento (l'API di React Aria vuole l'hook `useHref` passato come valore). `Link` 1.22.1 non inoltra `hrefLang`: si aggiunge con la prop `render`.
5. **Chunk `framework`.** Con React Aria nella 404, Rolldown divideva React DOM e React Router in più chunk condivisi e la home passava da 112,27 a 114,04 kB gzip, senza codice in più (stessi moduli, solo il costo della divisione). Un gruppo `codeSplitting` in `vite.config.ts` tiene React, React DOM, React Router e scheduler in un solo chunk: la home scende a 110,81 kB.

## Alternative considerate

| Alternativa                                               | Pro                                             | Contro                                                                                                                                      | Perché scartata                       |
| --------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Hash dello stile in `style-src`                           | Meccanismo standard, nessuna dipendenza dal DOM | Il testo dipende dalla versione (spazi compresi) e il post-build dovrebbe estrarlo da `node_modules`; allarga la CSP; non risolve il tipo C | Più fragile della sentinella          |
| Nonce (`<meta property="csp-nonce">`)                     | Supportato da React Aria                        | Sito statico: nonce fisso e pubblico, quindi nessuna protezione                                                                             | Inutile                               |
| `'unsafe-inline'` negli stili                             | Nessun lavoro                                   | Vietato dai requisiti                                                                                                                       | Escluso                               |
| Patch del pacchetto (patch-package) o trasformazione Vite | Nessuno stile inserito                          | Nuova dipendenza o regex su codice di terzi, da rifare a ogni aggiornamento                                                                 | Manutenzione alta                     |
| Route di test dedicata al posto della 404                 | Nessun cambiamento alle pagine reali            | Pagina tecnica pubblicata, oppure una seconda build solo per i test                                                                         | Scelta del proprietario: la 404 reale |

## Conseguenze

- Positive: CSP invariata; la regola `touch-action` arriva comunque (niente ritardo del doppio tocco); un uso reale di React Aria in produzione; la home pesa meno di prima.
- Negative e rischi:
  - la sentinella si appoggia a un id interno di React Aria, non a un'API pubblica;
  - il tipo C resta aperto fino alla F2A;
  - le due eccezioni Oxlint di `AriaRouterProvider.tsx`;
  - il chunk `framework` è unico e grande (107 kB gzip): una modifica a React o React Router invalida la cache di tutto il chunk, cosa che accadeva già prima con `entry.client` e `jsx-runtime`.
- Cosa va verificato e quando rivalutare:
  - `src/styles/reactAriaPressable.test.ts` legge `usePress.mjs` e fallisce se cambiano id, attributo o regola (per esempio con un aggiornamento di Dependabot);
  - test prerender: id sentinella su tutte le pagine con stili, CSP degli stili senza `unsafe-*` né nonce, nessun attributo `style`, link `<a href>` normali nella 404;
  - `tests/e2e/csp.spec.ts`: nessun evento `securitypolicyviolation` sulla 404 con la CSP reale, navigazione lato client, e un controllo in negativo che toglie la sentinella e vede la violazione (Chromium, Firefox, WebKit);
  - `tests/e2e/no-javascript.spec.ts`: senza JavaScript i link della 404 funzionano;
  - **rivalutare in F2A** (tipo C, `AriaRouterProvider` nel root) e se React Aria introduce un'API ufficiale per questo stile.

## Riferimenti

- `src/styles/global.css`, `src/styles/reactAriaPressable.ts`, `src/app/root.tsx`, `src/features/not-found/NotFound.tsx`, `src/components/AriaRouterProvider/`, `vite.config.ts`
- PERFORMANCE_SEO.md §1 e §13, ARCHITECTURE.md §9 e §10, `docs/phases/phase-01-plan.md` appendice B.2
- ADR-0000 (lezioni dalla v1, CSP), ADR-0001 (React Aria Components), ADR-0006 (prerender)
- [CSP Level 3, `style-src-attr` e `'unsafe-hashes'`](https://www.w3.org/TR/CSP3/)
