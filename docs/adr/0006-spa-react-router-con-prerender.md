# ADR-0006: SPA con React Router in framework mode, prerender e idratazione rinviata

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0

## Contesto

Requisiti:

- navigazione interamente lato client, senza ricaricare la pagina
- deep link per ogni finestra
- HTML statico completo per ogni route (SEO, crawler AI, link diretti su GitHub Pages)
- Lighthouse 100 anche su mobile
- CSP senza `unsafe-inline`
- hosting statico senza header

## Decisione

1. **React Router 8 in framework mode** con `ssr: false` e `prerender` (la lista viene da `routeMap.ts`), `routeDiscovery: { mode: "initial" }` (nessun endpoint `/__manifest` su un hosting statico), `appDirectory: "src/app"`.
2. **404**: route splat `*` prerenderizzata su `/404`, copiata in `404.html` dal post-build. GitHub Pages la serve con status 404 e l'idratazione combacia.
3. **Post-build** (`scripts/postbuild.mjs`, funzioni pure in `scripts/lib/`):
   - verifica che ogni route abbia il suo HTML (altrimenti la build fallisce)
   - crea `404.html`
   - **rinvia l'idratazione**: rende inerti i `<link rel="modulepreload">` (dalla F2A con `media="not all"` invece di toglierli, ADR-0013) e trasforma il bootstrap `<script type="module">` di React Router in uno `<script type="text/plain" id="rr-boot">`, eseguito da un piccolo script inline dopo l'evento `load`. Se il markup atteso non c'è, la build fallisce.
   - **CSP** nel meta tag, subito dopo `charset`, con `script-src 'self'` più lo sha256 di ogni script inline e del payload di avvio. Niente `unsafe-inline`.
4. **Marcatore** `html[data-hydrated="true"]`, impostato da un effetto nel root: lo usano i test e2e (e in futuro il CSS per i controlli che richiedono JS).

### Perché l'idratazione rinviata

In locale le metriche osservate sono ottime (LCP 48 ms), ma la simulazione mobile di Lighthouse (lantern) mette nel percorso critico dell'LCP tutte le richieste partite prima del paint, compresi i 112 kB di JS in `modulepreload`: Performance 93. Esperimento sull'output di build:

| Variante                | Performance mobile | FCP / LCP     |
| ----------------------- | ------------------ | ------------- |
| Build standard          | 93                 | 2,0 s / 3,0 s |
| Solo CSS inline         | 88                 | 3,0 s / 3,2 s |
| Idratazione dopo `load` | 100                | 0,9 s / 0,9 s |

Il contenuto è già nell'HTML: rinviare il JS non toglie nulla al visitatore. Prima dell'idratazione i link sono normali `<a>` e funzionano con una navigazione completa.

## Alternative considerate

| Alternativa                                                  | Perché scartata                                                                                                                                     |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| React Router dichiarativo + copia della shell per route (v1) | Nessun contenuto nell'HTML: crawler e AI vedono una pagina vuota                                                                                    |
| `vite-react-ssg`                                             | Dipende da un unico maintainer; meno integrato con il router                                                                                        |
| Script `renderToString` artigianale                          | Da mantenere a mano: meta, dati, hydration, manifest                                                                                                |
| Astro con isole React                                        | Cambia paradigma; lo stato condiviso del window manager tra isole è complicato; la navigazione client richiede view transitions o un router a parte |
| Next.js `output: export`                                     | Più pesante; un altro router; la CSP con script inline è analoga                                                                                    |
| Idratazione immediata                                        | Performance mobile 93: viola il requisito                                                                                                           |

## Conseguenze

- Gli hash CSP dipendono dal markup inline di React Router e React: li ricalcola il post-build a ogni build. Un test verifica che ogni script inline sia coperto.
- La trasformazione del bootstrap dipende dal markup di React Router 8.4: a ogni aggiornamento di React Router i test prerender ed e2e (console pulita, navigazione senza reload) devono passare. Se il markup cambia, la build fallisce invece di pubblicare una pagina rotta.
- In `npm run dev` non c'è né CSP né idratazione rinviata: si verifica con `build` + `preview`.
- L'interattività arriva dopo `load` (poche centinaia di ms su mobile). Il window manager (F2) deve essere progettato perché i controlli che richiedono JS siano riconoscibili prima dell'idratazione (`html:not([data-hydrated])`).
- Da rivalutare se React Router offrirà un'opzione nativa per il caricamento differito.

## Riferimenti

reactrouter.com/how-to/pre-rendering, ARCHITECTURE.md §3, PERFORMANCE_SEO.md §3, `scripts/lib/hydration.mjs`, `scripts/lib/csp.mjs`.
