# Performance e SEO

## 1. Budget

| Metrica               | Budget             | Misura Fase 0 | Come si verifica |
| --------------------- | ------------------ | ------------- | ---------------- |
| JS iniziale (gzip)    | ≤ 115 kB           | 112 kB        | `npm run size`   |
| CSS iniziale (gzip)   | ≤ 12 kB            | 1,3 kB        | `npm run size`   |
| Font in preload       | ≤ 25 kB (dalla F1) | 6,3 kB (F1A)  | `npm run size`   |
| LCP (mobile simulato) | ≤ 1,2 s            | 0,9 s         | Lighthouse CI    |
| FCP (mobile simulato) | ≤ 1,0 s            | 0,9 s         | Lighthouse CI    |
| TBT (mobile simulato) | ≤ 50 ms            | 0 ms          | Lighthouse CI    |
| CLS                   | ≤ 0,01             | 0             | Lighthouse CI    |

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
- Il budget resta 115 kB. Dalla Fase 1B React Aria entra solo nei chunk delle app, con `@react-aria/optimize-locales-plugin` limitato a italiano e inglese; size-limit avrà una voce per i chunk dei componenti.

## 2. Lighthouse CI

- Configurazioni: `lighthouserc.mobile.json` (preset mobile, default di Lighthouse) e `lighthouserc.desktop.json` (`preset: desktop`).
- Server: `scripts/preview.mjs`, lo stesso comportamento di GitHub Pages.
- URL: `/` e `/en/`, poi tutte le route principali IT ed EN man mano che nascono. Storybook è escluso.
- 3 esecuzioni per URL, `aggregationMethod: median-run`, `minScore: 1` su Performance, Accessibility, Best Practices e SEO.
- Report in `.lighthouseci/<preset>/` (artifact in CI).

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
