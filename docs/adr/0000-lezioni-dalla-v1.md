# ADR-0000: Lezioni dalla v1

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0

## Contesto

La v1 (React 19, MUI 9, JavaScript, React Router 8 in modalità dichiarativa, GitHub Pages) è stata rimossa da `main` con il commit `e7aa4ed` ed è consultabile solo dal tag `v1.0.0-legacy` (`9f50b1d`). Non aveva test, TypeScript né CI. Questo ADR raccoglie cosa riportare, cosa cambiare e cosa abbandonare. I file della v1 non vanno mai ripristinati nella cartella di lavoro.

## Decisione

### Da riportare (adattato)

| Soluzione v1                                                                                                                                                                                | Nella v2                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CSP via meta tag**, primo tag dopo `viewport`, derivata dall'inventario reale delle origini. Aperture: `style-src 'unsafe-inline'` (emotion) e `img-src data:` (frecce della scrollbar).  | Resta nel meta (GitHub Pages non permette header). Senza CSS-in-JS si toglie `'unsafe-inline'`. Gli script inline di React Router sono ammessi tramite sha256 calcolato in post-build (ADR-0006). `connect-src` si aprirà solo a Web3Forms (F3B).          |
| **Pagine statiche per route** (`scripts/write-route-pages.mjs`): copia della shell in `dist/<rotta>/index.html` per avere status 200; la build falliva con sitemap vuota o path non validi. | Sostituite dal prerender vero (contenuto completo). Si conservano: una **fonte unica delle route** (`routeMap.ts`, da cui la sitemap diventa un output), la **build che fallisce** se manca una route, `404.html` per gli URL non previsti con status 404. |
| **JSON-LD** `Person` statico in `index.html`.                                                                                                                                               | Generato per route: `Person`, `WebSite`, `ProfilePage`, poi `SoftwareSourceCode`. Niente `email`.                                                                                                                                                          |
| **SEO**: meta in `index.html`; `PageMeta.jsx` aggiornava title, description e canonical **solo lato client**. Dominio hardcoded in tre posti.                                               | Meta per route nell'HTML prerenderizzato, con hreflang. Dominio in un'unica costante (`src/config/site.ts`).                                                                                                                                               |
| **robots.txt** con elenco esplicito dei crawler AI.                                                                                                                                         | Riportato in F5 e generato in build.                                                                                                                                                                                                                       |
| **Proporzioni del 95** (`uiScale = 15/11`): i controlli scalano i rapporti, non i pixel.                                                                                                    | Token di scala nel design system (F1).                                                                                                                                                                                                                     |
| **Una sola fonte** di palette e stili condivisi. Copie divergenti avevano generato bug.                                                                                                     | Token in `tokens.css`; Stylelint vieta valori letterali.                                                                                                                                                                                                   |
| **Scrollbar 95** con due implementazioni: webkit + fallback `scrollbar-color` sotto `@supports not selector(::-webkit-scrollbar)`.                                                          | Si riporta in F1 con lo stesso guard.                                                                                                                                                                                                                      |
| **Stato disabilitato** visibile (testo grigio + ombra chiara), mai nascosto.                                                                                                                | Regola del design system.                                                                                                                                                                                                                                  |
| **`alignItems: flex-start`** nelle finestre per allineare le titlebar.                                                                                                                      | Considerato nel window manager.                                                                                                                                                                                                                            |
| **Email offuscata** nel codice.                                                                                                                                                             | Email mai in chiaro nel markup statico, ricomposta dopo l'idratazione (LEGAL.md §4).                                                                                                                                                                       |
| **Due grafie del nome** (N sul sito, M in GitHub ed email).                                                                                                                                 | Regola esplicita in CLAUDE.md e CONTENT.md.                                                                                                                                                                                                                |

### Deploy e dominio

- Repo user site `giampaolodelmoro99-afk.github.io`, servito dalla radice.
- Dominio in **Settings → Pages**, HTTPS forzato, certificato anche per `www`. **Nessun file CNAME**: non si ricrea.
- Il vecchio `deploy.yml` (push su `main`, Node 20, `dist`) è stato adattato: trigger manuale o tag `v*`, CI completa prima del deploy, Node da `.nvmrc`, `build/client`, concurrency, permessi minimi (DEPLOYMENT.md).

### Da non riportare

- **Font `ms_sans_serif.woff2` e `ms_sans_serif_bold.woff2`**: font Microsoft, vietati. Sostituiti da Pixel Operator (CC0) e IBM Plex Sans (OFL) (ADR-0010).
- **`og-image.png`**: renderizzata con il font Microsoft e con glifi mancanti. Sarà generata in build (F5).
- **`favicon.svg` della v1**: non si ripristina (regola sui file della v1). La v2 ha una favicon originale nuova (ASSETS.md).
- **CV PDF della v1**: contiene una clausola di consenso superata, il Producer ReportLab e le date di creazione; non è tagged. Sarà rigenerato in build dai dati (F3A).
- MUI, emotion, prop `sx`, `theme.js`, `PageMeta.jsx`, il wizard lineare tra pagine, gli step interni senza URL (`useState`), `div` cliccabili (404 e spegnimento), cursori lampeggianti senza reduced motion, `docs/screenshot.png`.

### Trappole note dalla v1

- `npm run dev` nasconde i problemi di deep link, asset assoluti e CSP: si verifica sempre con `build` + `preview`.
- `404.html` da solo non basta: serve un file reale per ogni route, altrimenti lo status è 404 e Google non indicizza.
- Una risorsa esterna nuova senza aggiornare la CSP funziona in dev e si rompe in produzione.

## Alternative considerate

Ripartire dalla v1 migrando a TypeScript e rimuovendo MUI: scartata, perché quasi ogni file dipendeva da MUI e dalla prop `sx`. La riscrittura costa meno e permette test e struttura fin dall'inizio.

## Conseguenze

- La v2 parte senza debito tecnico ma senza contenuti: i testi della v1 sono raccolti in `docs/CONTENT.md`.
- La v1 resta online fino alla release della v2 (deploy manuale).
- Gli URL della v1 vanno mappati (SPECS §6) per non perdere l'indicizzazione.

## Riferimenti

`git show v1.0.0-legacy:CLAUDE.md`, `docs/CONTENT.md`, `docs/DEPLOYMENT.md`, `docs/phases/phase-00-plan.md` §1.
