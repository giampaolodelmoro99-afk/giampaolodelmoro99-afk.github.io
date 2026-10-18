# Performance e SEO

## 1. Budget

| Metrica                | Budget              | Ultima misura                           | Come si verifica |
| ---------------------- | ------------------- | --------------------------------------- | ---------------- |
| JS iniziale (gzip)     | ≤ 115 kB            | 112 kB                                  | `npm run size`   |
| CSS iniziale (gzip)    | ≤ 12 kB             | 1,3 kB                                  | `npm run size`   |
| Font in preload        | ≤ 25 kB (dalla F1)  | 24,1 kB (F1A)                           | `npm run size`   |
| Componenti, JS (gzip)  | ≤ 99 kB (dalla F1B) | 98,1 kB (F1B, fuori dalla home)         | `npm run size`   |
| Guscio del desktop F2A | ≤ 75 kB (dalla F1B) | 74,9 kB (F1B)                           | `npm run size`   |
| LCP (mobile simulato)  | ≤ 1,35 s (ADR-0013) | 1,20 s mediana (F1B, preview compressa) | Lighthouse CI    |
| FCP (mobile simulato)  | ≤ 1,05 s (ADR-0013) | 0,91 s mediana (F1B)                    | Lighthouse CI    |
| LCP / FCP desktop      | ≤ 0,5 s / ≤ 0,425 s | 0,32 / 0,27 s mediana (F1B)             | Lighthouse CI    |
| TBT (mobile simulato)  | ≤ 50 ms             | 0 ms                                    | Lighthouse CI    |
| CLS                    | ≤ 0,01              | 0                                       | Lighthouse CI    |

**Nota sulla Fase 0.** Il piano prevedeva 90 kB di JS iniziale. La misura reale con React 19 + React Router 8 è 112 kB gzip (React DOM da solo ≈ 66 kB), quindi il budget è fissato a 115 kB, la misura più un margine minimo. Ogni app successiva va in lazy loading e non deve far crescere il chunk iniziale.

### Analisi del bundle (Fase 1A)

`npm run analyze` costruisce il sito con `rollup-plugin-visualizer` (solo l'environment `client`) e scrive la treemap in `build/stats.html`, fuori da `build/client`. Misura del 13/10/2026, JS iniziale della home 112,2 kB gzip:

| Chunk                   | gzip    | Contenuto                                                                |
| ----------------------- | ------- | ------------------------------------------------------------------------ |
| `entry.client`          | 66,3 kB | React DOM (client e riconciliatore), scheduler                           |
| `jsx-runtime`           | 39,1 kB | React e il router di React Router (data router, single fetch, hydration) |
| `routeMap`              | 4,1 kB  | parte DOM di React Router (`Link`, `NavLink`), più `routeMap.ts`         |
| route, root e dizionari | ≈ 3 kB  | codice del sito; i due dizionari valgono 0,9 kB gzip in tutto            |

**Conclusione: non riducibile in modo significativo.**

- React DOM e il nucleo di React Router sono il prezzo della modalità framework con prerender e idratazione (ADR-0006). Le alternative (Preact, un router scritto in casa) rompono React Aria Components o l'idratazione del prerender.
- Dividere i dizionari per lingua farebbe risparmiare circa 0,4 kB gzip al costo di un caricamento asincrono dei testi: non vale la complessità.
- Il JS parte dopo l'evento `load`, quindi non pesa su LCP né su TBT (Lighthouse mobile 100).
- Il budget resta 115 kB. Dalla Fase 1B React Aria entra solo nei chunk delle app, con `@react-aria/optimize-locales-plugin` limitato a italiano e inglese; size-limit ha voci dedicate ai componenti (vedi «Peso dei componenti»).

### Chunk `framework` (Fase 1B)

Con il `Link` di React Aria nella 404, Rolldown divideva React DOM e React Router in più chunk condivisi tra la home e la route 404: stessi moduli, ma la home passava da 112,27 a 114,04 kB gzip per il solo costo della divisione. Dal 14/10/2026 un gruppo `codeSplitting` in `vite.config.ts` tiene React, React DOM, React Router e scheduler in un unico chunk (ADR-0012). JS iniziale della home: **110,81 kB**.

| Chunk                        | gzip     | Contenuto                                        |
| ---------------------------- | -------- | ------------------------------------------------ |
| `framework`                  | 107,3 kB | React, React DOM, scheduler, React Router        |
| route, root, manifest, rest  | ≈ 3,5 kB | codice del sito, dizionari, runtime di Rolldown  |
| `not-found` (solo sulla 404) | 11,6 kB  | React Aria: `Link`, `usePress`, `RouterProvider` |

Gli import da React Aria vanno sempre per sottopercorso (`react-aria-components/Button`): Oxlint vieta l'import dalla radice, con un'unica eccezione per `RouterProvider` (ADR-0012).

### Peso dei componenti (Fase 1B)

`npm run size` misura anche i componenti di `src/components/` con `@size-limit/esbuild`, nelle condizioni della build del sito: import per sottopercorso da React Aria, `optimize-locales` su it-IT ed en-US, `NODE_ENV` di produzione, React, React DOM e React Router esclusi (stanno nel chunk `framework`). Voci: totale JS, totale CSS, guscio del desktop della F2A (`Window`, `Taskbar`, `TaskbarButton`, `StartButton`, `DesktopIcons`), base di React Aria, Icon importato dall'indice e ogni componente dalla sua cartella. I componenti non entrano nella home fino alla F2A.

In esbuild `optimize-locales` 2.1.0 (con unplugin 2.3) risolve le traduzioni escluse verso `empty.js` in un namespace che non sa caricare; `.size-limit.js` aggiunge un piccolo loader per quel namespace, così la misura resta con le sole lingue it-IT ed en-US (verificato: nel bundle restano solo le stringhe inglesi e italiane). In Vite il plugin funziona senza correzioni.

**Base di React Aria.** Il primo componente React Aria paga una volta sola la base condivisa: `usePress`, focus da tastiera, hover, utilità DOM, SSR, LiveAnnouncer. Il `Button` di React Aria da solo pesa **13,02 kB** gzip (voce "Base React Aria"); il nostro codice del Button è sotto 1 kB. La stessa base è già nel chunk della 404, con il `Link` di React Aria (11,6 kB). Accettata il 14/10/2026 come costo una tantum: i componenti successivi la riusano.

**Base delle collezioni di React Aria.** Il primo componente con una collezione (Tabs: `TabList`, `Tab`, `TabPanel`) paga una volta sola selezione e collezioni di React Stately, `Document` e `BaseCollection`, `useSelectableCollection` e `useSelectableItem`, `CollectionBuilder` e navigazione da tastiera: **+17,48 kB** gzip sul totale, con il codice delle nostre Tabs sotto 1 kB. La riusano Select (ListBox), MenuBar e StartButton (Menu) e DesktopIcon (GridList). Accettata il 14/10/2026 come seconda base una tantum.

**Base degli overlay di React Aria.** Il Select aggiunge **+16,90 kB** gzip. Misurato il 14/10/2026 aggiungendo i pezzi uno alla volta sopra il totale: base degli overlay (Popover, FocusScope, chiusura con clic esterno, `ariaHideOutside`, blocco dello scroll) ≈ 8,9 kB; navigazione delle liste condivisa con Menu (`ListKeyboardDelegate`, `useMenuTrigger`, `useSelectableList`) ≈ 5,4 kB; **parte specifica del Select** (Select, `useSelect`, `HiddenSelect`, ListBox, stato) **5,78 kB**, sotto la soglia. Accettata come terza base una tantum: MenuBar, StartButton e AlertDialog riusano overlay e navigazione.

**Regola della 1B.** Ogni componente si misura come incremento sul totale. Se un componente aggiunge più di 10 kB gzip, il lavoro si ferma e si analizza il metafile prima di proseguire. Budget fissati alla chiusura della 1B (18/10/2026), misura arrotondata per eccesso al kB: **totale JS ≤ 99 kB**, **totale CSS ≤ 5 kB**, **guscio del desktop F2A ≤ 75 kB**; si alzano solo con un ADR.

**Indice dei componenti.** Importare anche solo Icon da `src/components/index.ts` costa circa 0,6 kB in più che dalla sua cartella: l'indice trascina codice di React Aria eseguito al caricamento del modulo. La voce "Icon importato dall'indice" lo tiene d'occhio fino alla decisione della F2A (`sideEffects` o import dalle cartelle).

| Componente aggiunto                                             | Da solo (JS)                        | Incremento sul totale                                       | Totale JS | Totale CSS | Icon dall'indice | Guscio F2A                                                                             | Home   |
| --------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------- | --------- | ---------- | ---------------- | -------------------------------------------------------------------------------------- | ------ |
| Icon e Glyph                                                    | 12,28 / 1,03                        | –                                                           | 12,79     | 0,26       | –                | –                                                                                      | 110,81 |
| Button                                                          | 26,95 (Icon compresa)               | +14,58 (base React Aria 13,02)                              | 27,37     | 0,86       | 12,89            | –                                                                                      | 110,81 |
| TextField                                                       | 13,24                               | +4,45                                                       | 31,82     | 1,16       | 13,20            | –                                                                                      | 110,81 |
| TextArea                                                        | 13,64                               | +0,45                                                       | 32,27     | 1,53       | 13,58            | –                                                                                      | 110,81 |
| Checkbox                                                        | 16,54                               | +2,17                                                       | 34,44     | 1,75       | 13,80            | –                                                                                      | 110,81 |
| RadioGroup e Radio                                              | 13,24 / 15,14                       | +4,22                                                       | 38,66     | 1,93       | 14,18            | –                                                                                      | 110,81 |
| GroupBox                                                        | 0,39                                | +0,17                                                       | 38,83     | 2,00       | 14,26            | –                                                                                      | 110,81 |
| ProgressBar                                                     | 6,43                                | +2,43                                                       | 41,26     | 2,35       | 14,71            | –                                                                                      | 110,81 |
| StatusBar                                                       | 5,96                                | +0,34                                                       | 41,60     | 2,44       | 14,80            | –                                                                                      | 110,81 |
| ScrollArea                                                      | 0,78                                | +0,09                                                       | 41,69     | 2,49       | 14,85            | –                                                                                      | 110,81 |
| Tooltip                                                         | 14,21                               | +6,19 (primo overlay: posizionamento)                       | 47,88     | 2,60       | 14,97            | –                                                                                      | 110,81 |
| Tabs                                                            | 32,13                               | +17,48 (base collezioni)                                    | 65,36     | 2,85       | 15,22            | –                                                                                      | 110,81 |
| Select                                                          | 55,74                               | +16,90 (base overlay ≈ 8,9; navigazione ≈ 5,4; Select 5,78) | 82,26     | 3,27       | 15,64            | –                                                                                      | 110,81 |
| MenuBar (MenuBar, MenuButton, MenuItem, MenuSeparator, Submenu) | 9,30 / 46,19 / 32,68 / 5,63 / 60,23 | +6,11                                                       | 88,37     | 3,53       | 15,92            | –                                                                                      | 110,81 |
| Window                                                          | 29,55                               | +0,93                                                       | 89,30     | 3,92       | 16,31            | 32,33 (Window)                                                                         | 110,81 |
| Taskbar e TaskbarButton                                         | 9,33 / 26,23                        | +0,75                                                       | 90,05     | 4,11       | 16,50            | 36,23 (Window, Taskbar, TaskbarButton)                                                 | 110,81 |
| StartButton                                                     | 59,99                               | +0,49                                                       | 90,54     | 4,26       | 16,77            | 66,43 (+ StartButton: entra la base di overlay e menu)                                 | 110,81 |
| DesktopIcons                                                    | 53,36                               | +5,95                                                       | 96,49     | 4,52       | 17,03            | **75,03** (guscio completo: Window, Taskbar, TaskbarButton, StartButton, DesktopIcons) | 110,81 |
| AlertDialog e AlertDialogFrame                                  | 41,18 / 31,06                       | +1,64                                                       | 98,13     | 4,63       | 17,16            | 74,92                                                                                  | 110,81 |

Valori in kB gzip. Il guscio F2A scende da 75,03 a 74,92 kB con l'AlertDialog, che non ne fa parte, perché i testi dei componenti sono passati da `it.ts`/`en.ts` a `src/i18n/ui.ts` (commit c97ce15).

## 2. Lighthouse CI

- Configurazioni: `lighthouserc.mobile.json` (preset mobile, default di Lighthouse) e `lighthouserc.desktop.json` (`preset: desktop`).
- Server: `scripts/preview.mjs`, lo stesso comportamento di GitHub Pages, compressione gzip compresa (ADR-0013).
- URL: `/` e `/en/`, poi tutte le route principali IT ed EN man mano che nascono. Storybook è escluso.
- **Due livelli (ADR-0013)**:
  - a ogni commit (`lhci:mobile`, `lhci:desktop`): 3 esecuzioni per URL, mediana; Accessibility, Best Practices e SEO a 100, Performance ≥ 95;
  - a chiusura di fase e alla release (`lhci:mobile:strict`, `lhci:desktop:strict`; nel deploy `ci.yml` riceve `strict-lighthouse: true`): 5 esecuzioni, mediana, **Performance 100**.
- In entrambi i livelli LCP, FCP, TBT e CLS hanno budget fissi (§1), verificati da `scripts/lib/lighthouse.test.mjs` insieme alla regola.
- Report in `.lighthouseci/<preset>/` e `.lighthouseci/<preset>-strict/` (artifact in CI).

## 3. Prerender e contenuto senza JavaScript

- Ogni route è prerenderizzata da React Router (`ssr: false` + `prerender`, ADR-0006). L'HTML contiene il contenuto completo della finestra in HTML semantico (`main`, `h1`, liste, link).
- **Idratazione rinviata**: il post-build toglie i `modulepreload` e avvia il bootstrap dopo `load`. Il contenuto prerenderizzato viene dipinto senza attendere il bundle. È la scelta che porta Performance a 100 su mobile: senza, la simulazione mobile di Lighthouse conta i 112 kB di JS nel percorso critico dell'LCP (Performance 93).
- **Vincolo**: nessuna modifica può togliere contenuto dall'HTML prerenderizzato. Lo verifica `npm run test:prerender`.

## 4. Metadati per route

Generati da `src/seo/buildMeta.ts` con i dizionari della lingua:

- `<html lang>`, `title` (≤ 60 caratteri), `meta description` (≤ 160)
- `link rel=canonical` assoluto, con slash finale tranne la radice
- `link rel=alternate hreflang` per `it`, `en` e `x-default` (→ italiano)
- Open Graph: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:locale`, `og:locale:alternate`; `og:image` dalla F5
- Twitter: `twitter:card` (`summary`, poi `summary_large_image` in F5), title, description
- `theme-color`, `author`
- la 404 ha `robots: noindex`

## 5. JSON-LD

Un solo `<script type="application/ld+json">` per pagina, con `@graph`:

- `Person` (`@id` `/#person`): nome, `jobTitle`, `url`, `sameAs` (GitHub). **Nessuna proprietà `email`.**
- `WebSite` (`@id` `/#website`): nome, URL, lingue, autore.
- `ProfilePage`: URL della route, lingua, `mainEntity` → Person.
- Dalla F3: `SoftwareSourceCode` per ogni progetto (nome, descrizione, `codeRepository`, `programmingLanguage`, autore).

Il JSON-LD non è soggetto alla CSP degli script (tipo non eseguibile), ma resta nell'HTML statico.

## 6. Sitemap e hreflang (Fase 5)

`sitemap.xml` generata in build da `routeMap`, con un `<url>` per URL canonico e `xhtml:link rel="alternate" hreflang` per ogni lingua e x-default. Esclusi: 404, pagine di reindirizzamento della v1, Storybook.

## 7. robots.txt e crawler AI (Fase 5, verifica in Fase 6)

Dalla Fase 1A esiste un `public/robots.txt` minimo (`User-agent: *`, `Allow: /`, `Disallow: /storybook/`), verificato dal test prerender. In F5 diventa il file completo:

- `User-agent: *` + `Allow: /`.
- Accesso esplicito ai crawler di ricerca e AI, come nella v1: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, meta-externalagent, Amazonbot, CCBot. L'elenco si aggiorna in F5.
- `Disallow: /storybook/`.
- `Sitemap: https://gianpaolodelmoro.it/sitemap.xml`.

## 8. llms.txt e llms-full.txt (Fase 5)

Generati in build dai dizionari e dai dati dei contenuti, in italiano e inglese (sezioni per lingua o file separati, da decidere in F5). Contengono bio, competenze, progetti, formazione e link a GitHub e al sito. **Mai l'email in chiaro.** Il vecchio `llms.txt` della v1 era scritto a mano e diceva che la SPA non era leggibile dai crawler: con il prerender non è più vero.

## 9. Open Graph (Fase 5)

Immagini 1200×630 per route e lingua, generate in build con i font liberi del progetto. L'`og-image.png` della v1 non si riporta: era renderizzata con un font Microsoft e aveva glifi mancanti.

## 10. Boot, animazioni e suoni

- **Nessun cloaking**: nessun rilevamento dei crawler tramite user agent, nessun contenuto diverso tra bot e persone.
- Il boot (F4A) è un overlay che non diventa l'elemento LCP, non sposta il layout, compare solo alla prima visita (chiave di storage "boot già visto"), si salta da tastiera e touch e viene saltato con reduced motion. Lighthouse lo misura come un visitatore nuovo, e deve comunque dare 100.
- Animazioni solo con `transform` e `opacity`, durate dai token.

### JavaScript dopo l'evento load

L'idratazione parte dopo `load` (§3), quindi non pesa su LCP. Resta da controllare che non ritardi in modo percepibile la prima interazione.

- **Misura attuale** (`tests/e2e/performance.spec.ts`, progetto Playwright `performance`: Pixel 7, CPU rallentata 4× via CDP): tempo da `load` a `html[data-hydrated]` e long task. Fase 1A: idratazione circa 260 ms dopo `load`, una long task di circa 60 ms. Soglie del test, **bloccanti come gli altri budget**: idratazione entro 1 s e nessuna long task oltre 200 ms. Sono circa 4 volte la misura di riferimento, per assorbire la variabilità dei runner; la misura di ogni esecuzione è nell'annotazione `misura` del report Playwright. Se una fase le supera va ottimizzato il codice: alzarle richiede un ADR.
- **In Fase 2A**, con il window manager:
  1. la stessa misura, con la home che contiene desktop, icone e taskbar
  2. INP del primo clic su un'icona subito dopo l'idratazione (Event Timing API, `interactionId`), con soglia ≤ 200 ms su CPU 4×
  3. TBT di Lighthouse ≤ 50 ms (budget di §1) e un flusso Lighthouse "timespan" apri-finestra
  4. un clic prima dell'idratazione resta una navigazione completa verso il deep link (comportamento voluto, ADR-0006)
- I suoni si caricano solo dopo un'interazione e mai nel chunk iniziale.

## 11. Trailing slash e canonical su GitHub Pages

GitHub Pages risponde a `/en` con un 301 verso `/en/` (cartella con `index.html`). Per questo:

- canonical, hreflang, sitemap e link interni usano la forma con la slash finale
- `scripts/preview.mjs` riproduce lo stesso 301 in locale
- alla prima pubblicazione si verifica con `curl -I https://gianpaolodelmoro.it/en`

## 12. Storybook

Pubblicato in `/storybook/` dalla F1A, escluso dall'indicizzazione: `meta robots noindex, nofollow` nel manager e nell'anteprima, `Disallow: /storybook/` in robots.txt, fuori da sitemap, llms.txt e Lighthouse CI (gli URL di `lighthouserc` sono espliciti).

- **Build**: `npm run build` costruisce il sito e poi Storybook in `build/client/storybook/`; `build:site` costruisce solo il sito.
- **CSP**: `scripts/postbuild.mjs` ignora la cartella `storybook`, quindi la CSP del sito non cambia. `scripts/postbuild-storybook.mjs` inserisce in `index.html` e `iframe.html` una **CSP dedicata** come primo elemento di `<head>`: script solo dal sito e con hash, `style-src 'self' 'unsafe-inline'` (Storybook inserisce stili a runtime), `font-src 'self' data:` (font incorporati delle pagine Docs), `frame-src 'self'`, niente `unsafe-eval`. La build fallisce se mancano i meta noindex o se compaiono risorse esterne.
- `project.json`, che Storybook genera per la telemetria, viene tolto: elencherebbe le dipendenze di sviluppo. La telemetria è disattivata.
- Test: prerender (noindex, CSP dedicata, `project.json` assente, robots.txt, nessun riferimento a Storybook nelle pagine del sito) ed e2e (manager senza errori né richieste esterne).

## 13. React Aria e CSP

React Aria inserisce a runtime uno `<style id="react-aria-pressable-style">` che la CSP del sito bloccherebbe. L'id sta sul link di `global.css`, che contiene la stessa regola: React Aria trova l'elemento e non inserisce nulla, e la CSP resta `style-src 'self'` (ADR-0012). Gli attributi `style` nell'HTML prerenderizzato restano vietati da un test: la soluzione per i componenti che li producono si decide in F2A.

- Test: deriva sul sorgente di `usePress` (unit), sentinella, CSP e assenza di attributi `style` (prerender), nessuna violazione sulla 404 più un controllo in negativo (`tests/e2e/csp.spec.ts`), 404 senza JavaScript (`tests/e2e/no-javascript.spec.ts`).
