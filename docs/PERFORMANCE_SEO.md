# Performance e SEO

## 1. Budget

| Metrica               | Budget             | Misura Fase 0 | Come si verifica    |
| --------------------- | ------------------ | ------------- | ------------------- |
| JS iniziale (gzip)    | ≤ 115 kB           | 112 kB        | `npm run size`      |
| CSS iniziale (gzip)   | ≤ 12 kB            | 1,3 kB        | `npm run size`      |
| Font in preload       | ≤ 25 kB (dalla F1) | –             | review + Lighthouse |
| LCP (mobile simulato) | ≤ 1,2 s            | 0,9 s         | Lighthouse CI       |
| FCP (mobile simulato) | ≤ 1,0 s            | 0,9 s         | Lighthouse CI       |
| TBT (mobile simulato) | ≤ 50 ms            | 0 ms          | Lighthouse CI       |
| CLS                   | ≤ 0,01             | 0             | Lighthouse CI       |

**Nota sulla Fase 0.** Il piano prevedeva 90 kB di JS iniziale. La misura reale con React 19 + React Router 8 è 112 kB gzip (React DOM da solo ≈ 66 kB), quindi il budget è fissato a 115 kB, la misura più un margine minimo. Ogni app successiva va in lazy loading e non deve far crescere il chunk iniziale.

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
- I suoni si caricano solo dopo un'interazione e mai nel chunk iniziale.

## 11. Trailing slash e canonical su GitHub Pages

GitHub Pages risponde a `/en` con un 301 verso `/en/` (cartella con `index.html`). Per questo:

- canonical, hreflang, sitemap e link interni usano la forma con la slash finale
- `scripts/preview.mjs` riproduce lo stesso 301 in locale
- alla prima pubblicazione si verifica con `curl -I https://gianpaolodelmoro.it/en`

## 12. Storybook

Pubblicato in `/storybook/` dalla F1, escluso dall'indicizzazione: `meta robots noindex`, `Disallow: /storybook/` in robots.txt, fuori da sitemap, llms.txt e Lighthouse CI.
