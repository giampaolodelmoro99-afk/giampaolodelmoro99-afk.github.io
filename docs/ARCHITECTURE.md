# Architettura

## 1. Panoramica

```
            build (Node)                                   browser
┌─────────────────────────────────┐         ┌──────────────────────────────────┐
│ react-router build              │         │ HTML prerenderizzato (contenuto, │
│  ├─ client bundle (Vite)        │  Pages  │ meta, JSON-LD, CSP)              │
│  └─ prerender di ogni route ────┼────────▶│   paint immediato                │
│ scripts/postbuild.mjs           │         │   evento load → idratazione      │
│  ├─ controllo route             │         │   → SPA: React Router lato client│
│  ├─ 404.html                    │         │     + Zustand (window manager)   │
│  ├─ idratazione rinviata        │         └──────────────────────────────────┘
│  └─ CSP con hash                │
└─────────────────────────────────┘
```

Il sito è statico. GitHub Pages serve file già pronti, uno per route. Dopo l'idratazione tutto avviene lato client senza ricaricare la pagina.

## 2. Struttura delle cartelle

```
src/
  app/                  appDirectory di React Router
    root.tsx            documento HTML, lang, links, marcatore data-hydrated
    routes.ts           route generate da routeMap (+ splat not-found)
    routes/             moduli route: meta + componente (sottili)
  config/site.ts        dominio, nome, handle GitHub (N/M)
  routes/routeMap.ts    fonte unica di route, slug per lingua, prerender
  i18n/                 dizionari tipizzati it.ts / en.ts, useT, useLocale
  seo/                  buildMeta, jsonLd
  styles/               tokens.css (token GDM 95), fonts.css (@font-face), global.css (base e regola di React Aria, ADR-0012)
  assets/               fonts/ (woff2 e licenze) e icons/ (SVG GDM 95), registrati in docs/ASSETS.md
  types/                dichiarazioni TypeScript (variabili CSS negli stili inline)
  features/<nome>/      componenti e CSS Module di una feature o app
  components/           componenti del design system (Icon e Glyph dalla 1A, gli altri dalla 1B),
                        AriaRouterProvider (React Aria con React Router) e cx (classi dei moduli)
  stores/               store Zustand (dalla Fase 2)
  content/              dati tipizzati dei contenuti (dalla Fase 3)
scripts/
  postbuild.mjs         passi dopo la build del sito
  postbuild-storybook.mjs  CSP dedicata e controlli di Storybook
  fonts.mjs, icons.mjs  generatori manuali (subset dei font, dati delle icone)
  preview.mjs           server statico che imita GitHub Pages (--host per la rete locale)
  lib/                  funzioni pure testate (csp, hydration, fonts, icons, assets, storybook, workflows)
fonts-src/              originali dei font da cui nasce il subset (non serviti)
.storybook/             configurazione di Storybook e pagine "Fondamenta"
tests/
  setup/                setup Vitest, helper axe e render
  prerender/            test sull'HTML statico
  e2e/                  Playwright, fixture, screenshot di riferimento
  storybook/            test visivi e axe delle story
public/                 file serviti dalla radice (favicon, robots.txt)
docs/                   documentazione, ADR, piani e retrospettive
```

**Confini dei moduli:**

- `features/*` può importare da `components`, `i18n`, `routes`, `config`, `stores`, `content`.
- `components/*` non importa da `features` né da `stores`.
- I moduli in `src/app/routes/` contengono solo `meta` e un componente che delega alla feature.
- Gli import ciclici sono vietati da Oxlint.

## 3. Routing e prerender

- **Fonte unica**: `routeMap.ts`. Da lì derivano `routes.ts`, l'elenco dei prerender (`react-router.config.ts`), i metadati (canonical, hreflang), e in Fase 5 sitemap e llms.txt.
- **Modalità**: `ssr: false` + `prerender` (ADR-0006). Ogni path diventa `build/client/<path>/index.html` con il contenuto completo. `routeDiscovery: initial` perché un hosting statico non ha l'endpoint `/__manifest`.
- **URL**: italiano senza prefisso, inglese con `/en/`. Canonical con slash finale, perché GitHub Pages reindirizza `/en` → `/en/` con un 301.
- **404**: la route splat `*` (id `not-found`) è prerenderizzata su `/404`. Il post-build la copia in `404.html`, che GitHub Pages serve con status 404 per ogni URL non previsto. L'idratazione combacia perché la route è la stessa.
- **Idratazione rinviata**: il post-build rende inerti i `modulepreload` (`media="not all"`: il browser non li scarica e React non li reinserisce all'idratazione) e sposta il bootstrap di React Router in uno script inerte, avviato dopo l'evento `load`. La pagina si vede subito; il JS arriva dopo e non pesa su LCP. Un link cliccato prima dell'idratazione è un normale `<a>`, che funziona con una navigazione completa.
- **Post-build** (`scripts/postbuild.mjs`):
  1. verifica che ogni route abbia il suo HTML
  2. crea `404.html`
  3. rinvia l'idratazione
  4. scrive la CSP con gli hash
  5. la build fallisce se il markup di React Router non è quello atteso

## 4. Window manager (Fase 2A)

Scritto da zero (ADR-0005), in `src/features/desktop/` con lo store in `src/stores/desktop/` (ADR-0014 per il caricamento, ADR-0016 per l'accessibilità):

- **Guscio statico e desktop interattivo**: il prerender contiene `shell/` (solo HTML e CSS dei componenti); `app/DesktopApp` arriva in un chunk dopo l'idratazione e sostituisce il guscio con gli stessi CSS Modules, al pixel. Esegui, Spegni e il congedo stanno in chunk caricati all'apertura.
- **Store** (Zustand, una factory per istanza): `windows` con `{ maximized, minimized, geometry, cascade }`, `stack` (ordine z), `recent` (ultimo uso, per il selettore e la taskbar), `activeId`, `viewport` (area utile, non serializzata). Funzioni pure in `state.ts` e `geometry.ts` (`clampGeometry`, `moveBy`, `resizeBy`), testate senza React. `geometry: null` vuol dire posizione predefinita dal CSS: niente numeri nel prerender.
- **Area utile**: `useWorkspaceViewport` misura l'area di lavoro con un `ResizeObserver` e delle sonde CSS (larghezza minima, altezza minima, barra del titolo), così i limiti seguono la dimensione del testo. La barra del titolo resta sempre raggiungibile (`--window-keep-visible`).
- **Puntatore**: `useWindowGestures` usa pointer events con `setPointerCapture`, soglia di 4 px e un aggiornamento per frame; durante il gesto si muove solo il `DragOutline`, e al rilascio c'è un solo `place` nello store. Esc o `pointercancel` annullano; `preventDefault` sul `pointerdown` evita selezione e trascinamento nativo. Trascinamento e maniglie esistono solo da 768 px; sotto, le finestre occupano l'area.
- **Tastiera**: `useKeyboardGesture` per Sposta e Ridimensiona dal menu della finestra; `shortcuts.ts` per le scorciatoie globali (ACCESSIBILITY.md §2).
- **Posizione**: variabili CSS inline (`--window-x`, `--window-y`, `--window-w`, `--window-h`, `--window-z`, `--window-cascade`), l'unico stile inline ammesso. Le finestre non posizionate stanno al centro dell'area con uno spostamento a cascata limitato allo spazio libero (l'area di lavoro è un container CSS).
- **Focus e z-index**: la finestra attiva ha lo z-index più alto dentro `--z-window`; il corpo delle altre è `inert`. Il focus segue le regole di ADR-0016 §4.
- **Animazioni**: apertura, chiusura e riduzione con `transform` e `opacity` e le durate dei token; chiusura e riduzione aspettano la fine dell'animazione di uscita (con un timer di riserva) e sono immediate con durata 0.
- **Accensione**: `DesktopApp` tiene lo stato acceso, spento o in riavvio; Riaccendi e Riavvia montano un desktop nuovo con uno store vuoto, senza ricaricare la pagina.

## 5. Stato e sincronizzazione con l'URL (Fase 2B)

- **Zustand** per lo stato del desktop: finestre aperte, ordine, geometria, minimizzate e massimizzate.
- **L'URL è la fonte di verità della finestra attiva.** Aprire una finestra naviga verso la sua route; la route attiva porta in primo piano la finestra. Il back del browser chiude o torna alla finestra precedente.
- **Determinismo**: il primo render dipende solo dall'URL, uguale al prerender, per evitare mismatch di idratazione.
- **Persistenza**: geometria e preferenze si leggono da localStorage dopo l'idratazione, senza spostamenti visibili (CLS 0). Le chiavi ammesse sono in `LEGAL.md`.

## 6. Modalità mobile (Fase 2B)

Su schermi piccoli o con puntatore grossolano (soglia e criteri definiti in F2, ADR-0007):

- finestre a schermo intero
- navigazione adatta al touch
- target ≥ 44×44 px
- nessuna funzione solo con hover o tasto destro
- rispetto di safe-area e zoom

Le route e l'HTML prerenderizzato sono gli stessi della modalità desktop: cambia solo la presentazione.

## 7. i18n

Dizionari tipizzati per lingua (ADR-0008, `I18N.md`). La lingua viene dal percorso, mai da un rilevamento automatico. `en` deve avere la stessa forma di `it`: una chiave mancante è un errore di compilazione.

## 8. Dati a build time (Fase 3A)

L'elenco curato dei progetti sta in un file tipizzato. Uno script di build scarica dall'API GitHub i metadati (stelle, linguaggi, ultimo aggiornamento) e li salva in JSON statico (ADR-0004). Il browser non chiama mai GitHub.

## 9. Post-build e file generati

- **Fase 0**: `404.html`, idratazione rinviata, CSP.
- **Fase 1A**: Storybook in `build/client/storybook/` con CSP propria (PERFORMANCE_SEO.md §12); `robots.txt` minimo in `public/`.
- **Fase 1B**: la CSP del sito non cambia con React Aria: lo stile di `usePress` viene da `global.css`, segnalato dall'id sul suo link (ADR-0012).
- **Fase 5**: sitemap con hreflang, `robots.txt`, `llms.txt` e `llms-full.txt` IT/EN, immagini Open Graph per route.

Tutti derivano da `routeMap`, dai dizionari e dai dati dei contenuti.

## 10. Dipendenze ammesse

Runtime: React, React DOM, React Router, React Aria Components (F1B, import per sottopercorso), Zustand (F2). Ogni nuova dipendenza di runtime richiede una motivazione (peso, alternativa scritta in casa) nel piano di fase o in un ADR, e non deve violare i budget né `LEGAL.md`.
