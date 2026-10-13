# Fase 0 — Foundation: piano

## Contesto

La v1 di gianpaolodelmoro.it (React 19, MUI, JavaScript) è stata rimossa da `main` (commit `e7aa4ed`). Resta consultabile solo dal tag `v1.0.0-legacy` (`9f50b1d`). La v2 viene riscritta da zero, sempre in stile Windows 95, con TypeScript strict, un design system proprio, prerender, i18n IT/EN, Lighthouse 100 su mobile e desktop, test completi e un processo documentato a fasi.

La Fase 0 non porta feature. Prepara struttura, tooling, documentazione, CI, configurazione di Claude Code e uno scheletro minimo che dimostri che la pipeline funziona dall'inizio alla fine.

Decisioni già prese con te durante la pianificazione:
- **Deploy manuale.** Il deploy parte solo con `workflow_dispatch` o con un tag `v*`. La v1 resta online fino alla release della v2. La CI gira su `main` e `phase/*`.
- **Mappatura degli URL della v1.** `/profilo`, `/stack`, `/progetti` e `/contatti` vanno mappati sulle route della v2. Dove possibile si tengono gli stessi percorsi italiani; dove cambiano, si generano pagine di reindirizzamento con canonical. Pianificata in Fase 3, verificata in Fase 7 insieme a sitemap e Google Search Console. Va in SPECS.md e in PLAN.md.
- **Slug tradotti.** Per esempio `/progetti` ↔ `/en/projects`, gestiti con una mappa tipizzata delle route.
- **Due font.** Pixel Operator (CC0) per interfaccia e titoli. IBM Plex Sans (OFL) in subset per i testi lunghi, nelle finestre di tipo "documento" (stile WordPad). I vincoli che hai dato (subset, preload, font-display, metriche di fallback, licenze, tema ad alto contrasto e opzione "dimensione testo") sono riportati in ASSETS.md, DESIGN_SYSTEM.md e ADR-0010.
- **CV pubblico.**
  - Si toglie la clausola di consenso privacy.
  - Si tiene la patente AM, B.
  - Giurisprudenza resta come "Studi in Giurisprudenza (2020–2023), interrotti per dedicarmi allo sviluppo software" ed è valorizzata in bio e Timeline come punto di forza: attenzione a privacy, GDPR e aspetti legali dei progetti.
  - ICTS diventa "addetto ai controlli di sicurezza aeroportuali", con le competenze trasferibili: procedure rigorose, responsabilità, attenzione al dettaglio, lavoro sotto pressione e su turni.
  - Il CV esiste in italiano e in inglese, generato dagli stessi dati.
  - Ogni riformulazione è una **bozza da rivedere**: le scrivi e le approvi tu.
- **Skill**: le percentuali sono sostituite da livello e contesto d'uso. Java, Spring Boot, Python e l'indirizzo del liceo restano domande aperte in CONTENT.md, da chiudere in Fase 3.
- **Web3Forms.** ADR-0002 resta in stato **Proposta** finché in F3 non verifichi privacy policy e DPA ufficiali. Il piano B è un'alternativa con sede e dati in UE. Le regole del form e le protezioni anti-abuso sono in §1.7.
- **Email del titolare**: `giampaolo.delmoro99@gmail.com`. L'alias sul dominio si valuta in F6.
- **Licenza**: MIT per il codice, contenuti personali con tutti i diritti riservati.
- **Boot senza cloaking.** Nessun rilevamento dei crawler via user agent e nessun contenuto diverso tra bot e utenti. Il boot deve essere compatibile con Lighthouse 100 nello stesso modo per tutti: overlay che non diventa l'elemento LCP, solo alla prima visita, saltabile. Si progetta in F4 ed è annotato in PERFORMANCE_SEO.md.
- **Storybook in `/storybook/`**: escluso da sitemap e llms.txt, con `meta robots noindex` e `Disallow: /storybook/` in robots.txt, fuori da Lighthouse CI.

---

## 1. Riepilogo dell'analisi della v1 (tag `v1.0.0-legacy`)

### 1.1 Soluzioni da riportare

| Soluzione v1 | Come funzionava | Cosa diventa nella v2 |
|---|---|---|
| **CSP via meta tag** | `<meta http-equiv>` in `index.html`, subito dopo `viewport` e prima di qualsiasi risorsa. Policy: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-src 'none'`. Le due aperture erano necessarie: `'unsafe-inline'` per emotion/MUI e `data:` per le frecce SVG della scrollbar. | Resta nel meta tag: GitHub Pages non permette header HTTP custom. Senza CSS-in-JS **si può togliere `'unsafe-inline'` da `style-src`**. React Router in modalità framework però inserisce `<script>` inline nell'HTML prerenderizzato (contesto e manifest). La soluzione è uno script post-build che calcola lo **sha256 di ogni script inline** e lo scrive nel meta CSP di ogni pagina. Lo stesso meccanismo copre lo script inline che applica tema e lingua prima del paint. `connect-src` si aprirà a `https://api.web3forms.com` e `form-action` resterà `'none'` (il form usa fetch), entrambi in Fase 3. Restano documentati i limiti del meta: niente `frame-ancestors`, `report-to`, HSTS, `X-Frame-Options`. |
| **Pagine statiche per route** (`scripts/write-route-pages.mjs`) | Dopo la build copiava la *shell vuota* `index.html` in `dist/<rotta>/index.html` leggendo i `<loc>` di `public/sitemap.xml`, così GitHub Pages rispondeva 200 invece di 404. Lo script falliva se la sitemap era vuota o un path non era valido. `404.html` era una copia della shell. | Viene sostituito dal **prerender vero** di React Router (`ssr: false` + `prerender`), che scrive HTML completo per route. Si conservano tre idee: (1) **una fonte unica delle route**, che nella v2 è il file tipizzato `src/routes/routeMap.ts` da cui derivano router, prerender, sitemap, hreflang e llms.txt (la sitemap diventa un *output*, non più l'input); (2) **la build fallisce** se l'elenco delle route è vuoto o non valido; (3) `404.html` resta per gli URL non previsti e mantiene lo status 404 per i crawler. |
| **JSON-LD** | Un solo `Person` statico in `index.html`, con `jobTitle`, `address` (Pisa), `knowsAbout`, `alumniOf` (ITS Academy Prodigi) e `sameAs` GitHub. | Generato per route dai dati tipizzati: `Person` + `WebSite` + `ProfilePage` su tutte le route, `SoftwareSourceCode` per i progetti. In Fase 0 c'è un `WebSite` + `Person` minimo, solo per verificare la pipeline e il test sull'HTML. |
| **SEO** | Title, description, canonical, OG, Twitter in `index.html`. `PageMeta.jsx` aggiornava title, description e canonical **solo lato client**, quindi i crawler senza JS vedevano i meta della home su ogni route. Il dominio era hardcoded in tre posti. `og:locale it_IT`, `theme-color #008080`. | I meta vengono dall'export `meta` di React Router e finiscono **nell'HTML prerenderizzato** di ogni route, con `lang`, hreflang IT/EN/x-default e `og:locale`/`og:locale:alternate`. Il dominio sta in un'unica costante (`src/config/site.ts`). |

Altre lezioni dal CLAUDE.md della v1 che vanno nell'ADR-0000:
- Deep link, asset con path assoluto e CSP si verificano **solo** con `build` + `preview`, mai con `dev`.
- **Proporzioni del 95, non pixel del 95.** La v1 usava `uiScale = 15/11` per scalare controlli pensati per 640×480. Nella v2 diventa un token di scala nel design system.
- Esiste **una sola fonte** per la palette e per gli stili condivisi. Nella v1 copie divergenti degli stessi stili avevano creato bug.
- `alignItems: flex-start` nelle finestre, altrimenti le titlebar finiscono a quote diverse da una pagina all'altra.
- Un controllo disabilitato non si nasconde: resta visibile con testo grigio e ombra chiara.
- La scrollbar 95 ha due implementazioni: `::-webkit-scrollbar` e, sotto `@supports not selector(::-webkit-scrollbar)`, il fallback `scrollbar-color`. Senza quel guard Chrome dalla 121 ignora lo stile webkit.
- L'email nel codice era offuscata (`["giampaolo.delmoro99","gmail.com"].join("@")`).
- I sotto-step di Stack e Progetti erano `useState` senza URL. Nella v2 ogni finestra ha un deep link.
- Nella v1 non c'erano test, TypeScript né CI: tutto si verificava a mano.

### 1.2 Deploy e dominio nella v1

- Il repo è `giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io`, uno *user site* servito dalla root, quindi niente `base` in Vite.
- Il dominio `gianpaolodelmoro.it` è configurato in **Settings → Pages** (`build_type: workflow`, HTTPS forzato, certificato anche per `www`). **Non c'è un file CNAME.** Con `actions/deploy-pages` il CNAME nell'artifact viene ignorato e il dominio vive nelle impostazioni del repo.
- **Decisione: non ricreo il CNAME.** Il CLAUDE.md della v1 avvertiva che un CNAME in conflitto può far cadere il dominio.
- Il vecchio `deploy.yml` faceva: push su `main` → Node 20 → `npm ci` → `npm run build` → `upload-pages-artifact` (`dist`) → `deploy-pages`. Non aveva test né concurrency.

**Adattamento di `deploy.yml` alla v2:**
- trigger `workflow_dispatch` e `push: tags: ['v*']`, niente più push su `main`
- primo job: chiama `ci.yml` tramite `workflow_call`, così si pubblica solo un commit verde
- Node letto da `.nvmrc` (`node-version-file`)
- artifact da `build/client`, l'output di React Router, al posto di `dist`
- `concurrency: { group: pages, cancel-in-progress: false }`
- permessi minimi per job: `contents: read` nel build; `pages: write` e `id-token: write` solo nel deploy
- action aggiornate all'ultima major, mantenute poi da Dependabot
- rollback: rilancio manuale su un tag precedente, documentato in DEPLOYMENT.md

### 1.3 Contenuti da portare in `docs/CONTENT.md`

Tutti i testi sono **solo in italiano**: la versione inglese manca per intero.

- **Home**: titolo "Gianpaolo Del Moro"; terminale `while(true) { sudo apt install -y coffee; code(); }`; "Studente ITS Full Stack Developer / in cerca di una prima esperienza lavorativa"; schermata di spegnimento "Please wait while your computer shuts down... (clicca ovunque per riaccendere)".
- **Profilo (bio)**: i due paragrafi (Liceo Buonarroti, Scienze Applicate, ITS Full Stack Developer di Pisa; "La programmazione web è il mio ambiente…") più il paragrafo backend che compare solo in `llms.txt` (PHP, Laravel, Node.js/Express, database relazionali, API REST). Link "Scarica CV".
- **Stack**: Frontend HTML (Avanzato, 90%), CSS, JavaScript, React (Intermedio, 65%); Backend PHP, SQL, Node.js, Laravel (Intermedio, 65%). Da `llms.txt` anche: Database MySQL e MariaDB; Strumenti Git, GitHub, Docker, Postman, VS Code; Sistemi Linux (Ubuntu).
- **Progetti** (6, con nome in stile `.exe`, descrizione, tecnologie e URL GitHub):
  - task-manager-node
  - progetto-node-rubrica
  - gestione-spese-node
  - laravel-library-management-system-backend
  - laravel-store-backend
  - laravel-task-manager
- **Contatti**: email, GitHub `giampaolodelmoro99-afk`, Località "Pisa, Toscana", Disponibilità "Full-time".
- **404**: testo in stile BSOD "GIANPAOLO_DEL_MORO.EXE / Errore irreversibile 404…".
- **Meta**: title e description di ogni pagina (5 + 404), descrizioni OG e Twitter.
- **Formazione** (da llms.txt e CV): ITS Academy Prodigi 10/2025–in corso (EQF 5); Liceo Buonarroti 2013–2019 (EQF 4).
- **CV, presente solo lì**: esperienza ICTS Italia 06–10/2023 (controllo imbarchi, aeroporto di Pisa); Giurisprudenza 2020–2023 non terminata; lingue (italiano madrelingua, inglese B1); hobby pianoforte.

**Incongruenze tra sito e CV da risolvere in CONTENT.md:**
- Il CV cita Java, Spring Boot e Python, che sul sito non compaiono.
- L'indirizzo del liceo è "Scienze Applicate" sul sito e "indirizzo informatico" nel CV.
- I livelli in percentuale (65% per tutto) vengono **sostituiti con livello e contesto d'uso**.
- Java, Spring Boot, Python e l'indirizzo del liceo restano **domande aperte** in CONTENT.md, da chiudere in F3.

**Mancante per la versione inglese:** bio, payoff, descrizioni dei 6 progetti, etichette delle skill, meta di ogni route, testo 404, **CV in inglese** (confermato), testi della privacy, alt e aria-label.

### 1.4 File pubblici della v1

| File | Stato | Nella v2 |
|---|---|---|
| `llms.txt` | Solo IT, scritto a mano, dice "una SPA che i crawler non leggono" (non sarà più vero) | **Generato in build** dai dati (`llms.txt` IT+EN, più `llms-full.txt`). Fase 5 |
| `robots.txt` | `Allow: /` + sitemap + 13 crawler AI espliciti | **Da riportare quasi uguale**, aggiornando l'elenco dei bot. Generato in build dalla costante del dominio. Fase 5, verifica in Fase 6 |
| `sitemap.xml` | 5 URL senza hreflang, input dello script route | **Output della build** da `routeMap.ts`, con `xhtml:link` hreflang. Fase 5 |
| `og-image.png` | 1200×630, **renderizzata con il font MS Sans Serif** e con glifi mancanti (quadrati vuoti) tra le tecnologie | **Non si riporta.** Immagini OG per route/lingua generate in build con i font liberi. Fase 5 |
| `favicon.svg` | Pixel art originale 16×16 (finestra su teal), nessun asset Microsoft | **Riutilizzabile**, registrata in ASSETS.md come asset originale. Va aggiunta la variante per il tema ad alto contrasto/apple-touch-icon PNG. Fase 1 |

### 1.5 CV in PDF (`public/cv-gianpaolo-del-moro.pdf`)

- **Dati personali**: non ci sono indirizzo, telefono né data di nascita. Ci sono città (Pisa), email e GitHub, che sono necessari. Interventi decisi:
  - **togliere** la clausola di consenso, che cita un riferimento superato (art. 13 del D.Lgs. 196/2003)
  - **tenere** la patente AM, B
  - **riformulare** l'esperienza ICTS in modo generico, con le competenze trasferibili
  - **riformulare** Giurisprudenza come studi interrotti per lo sviluppo software, valorizzandola
  - tutte le riformulazioni sono bozze in CONTENT.md, da approvare
- **Metadati**:
  - Title "Gianpaolo Del Moro — Full Stack Developer", Subject "Curriculum Vitae" e Author, che sono accettabili
  - Producer "ReportLab PDF Library", CreationDate e ModDate (04/08/2026), da ripulire
  - non ci sono XMP né JavaScript
  - **non è tagged**, quindi non è accessibile agli screen reader
- **Proposta (Fase 3, "CV stampabile")**:
  - il CV diventa una pagina HTML stampabile in IT ed EN, generata dagli stessi dati tipizzati
  - i due PDF pubblici vengono rigenerati in build, tagged, con metadati minimi (Title e Lang soltanto) e date di creazione azzerate
  - un test verifica l'assenza di Producer, date e XMP superflui
  - il PDF della v1 non viene riportato

### 1.7 Form contatti e anti-abuso (F3B; va in SPECS, LEGAL, ADR-0002, PLAN e DEPLOYMENT)

- **Inoltro**: Web3Forms inoltra i messaggi alla mia email, con l'email del visitatore impostata come indirizzo di risposta (`replyto`). Al visitatore non parte nessuna email automatica.
- **Campi**: solo nome, email e messaggio.
- **Access key**: si legge da una variabile d'ambiente di build (`VITE_WEB3FORMS_ACCESS_KEY`, impostata come variabile del repo in GitHub Actions). Non è un segreto, ma non sta nel codice. La build fallisce se manca in produzione.
- **Validazione lato client**: campi obbligatori, formato email, lunghezza massima per campo (es. nome 100, email 254, messaggio 5000 caratteri, da confermare in F3).
- **Anti-abuso senza cookie**:
  - campo honeypot
  - tempo minimo di compilazione
  - pausa minima tra due invii dallo stesso browser, salvata in localStorage con la chiave `contact.lastSubmitAt`, aggiunta all'elenco delle chiavi consentite in LEGAL.md e ADR-0003
  - pulsante disabilitato durante l'invio
  - messaggi di errore e di conferma accessibili (regione live, focus sul messaggio)
- **Restrizione al dominio**: si configura a mano nel pannello di Web3Forms, documentata in DEPLOYMENT.md con i passi.
- **Limiti** (in ADR-0002):
  - sito statico con chiave pubblica: le protezioni lato client si aggirano chiamando l'API direttamente
  - la quota mensile del piano gratuito può esaurirsi
- **Piano B**:
  - captcha caricato solo dopo consenso, oppure backend proprio con rate limit per IP
  - fornitore alternativo con sede e dati in UE, se la verifica del DPA va male
- **Email del mittente non verificabile.** Su un sito statico si controlla solo il formato. La verifica reale avviene quando rispondo (in ADR-0002).
- **Invio fallito.** Casi: quota esaurita, servizio non raggiungibile, errore di rete, risposta non valida o inattesa, timeout. In tutti il form:
  - mostra un messaggio chiaro e accessibile (regione live `assertive`, focus sul messaggio, testo IT/EN che distingue "riprova più tardi" da "servizio non disponibile")
  - conserva i dati già inseriti
  - mostra **un canale alternativo sempre funzionante**:
    - email offuscata contro i bot, come nella v1 (ricomposta lato client)
    - link al profilo GitHub
    - link LinkedIn solo se lo aggiungi tu in CONTENT.md
  - Il recruiter deve potermi contattare anche con il servizio giù. Il canale alternativo è visibile anche nella finestra Contatti, non solo in caso di errore.
- **Email mai in chiaro nel markup statico.**
  - Non compare né nell'HTML prerenderizzato né nel JSON-LD (niente proprietà `email` in `Person`), e nemmeno in `llms.txt`, `llms-full.txt` e sitemap.
  - Nell'HTML statico c'è un segnaposto accessibile; l'indirizzo e il link `mailto:` si compongono solo dopo l'idratazione.
  - Il link GitHub invece è in chiaro ovunque, JSON-LD `sameAs` incluso.
  - **Da confermare.** La pagina /privacy deve indicare il contatto del titolare. Propongo la stessa regola: nel prerender una forma testuale non cliccabile ("giampaolo.delmoro99 [chiocciola] gmail [punto] com"), completata dopo l'idratazione. Dimmi se va bene.
- **Test e2e** (Playwright, `page.route` sull'endpoint di Web3Forms). Simulano:
  - errore del server (500)
  - quota esaurita (429, oppure 200 con `success:false` e messaggio di quota, a seconda di cosa restituisce davvero l'API, da verificare in F3)
  - rete assente (`route.abort('internetdisconnected')`)
  - risposta non valida (JSON malformato)
  - timeout

  Per ogni caso verificano il messaggio, la presenza e il funzionamento del canale alternativo, i dati conservati e axe pulito, su desktop e su 320 px touch.
- **Test sull'HTML prerenderizzato**: l'indirizzo email non compare in chiaro in nessun file di `build/client` (HTML, JSON-LD, txt, xml). Il link GitHub è presente.
- **Privacy**: l'informativa cita l'eventuale controllo antispam di Web3Forms tramite servizi terzi, da verificare sulla loro privacy policy in F3.
- **CSP**: `connect-src` aperto solo a `https://api.web3forms.com`.

### 1.6 Cosa non riportare

- `src/assets/fonts/ms_sans_serif*.woff2`: **font Microsoft, vietati**. Anche `og-image.png`, che li contiene renderizzati.
- MUI, emotion, `sx`, `theme.js`, `PageMeta.jsx` (meta solo lato client), il wizard lineare, `DesktopIcons` decorative.
- La shell vuota copiata per route.
- Il blink del cursore senza `prefers-reduced-motion`.
- Il 404 "premi un tasto qualsiasi" con `div` cliccabile e `cursor: pointer`.
- La schermata di spegnimento che copre tutta la pagina con `div` cliccabile.
- `docs/screenshot.png`.

**Font sostitutivi (verificati):**
- **Pixel Operator** di Jayvee Enaguas (HarvettFox96), licenza **CC0 1.0**.
  - Il pacchetto scaricato contiene `LICENSE.txt` CC0, versione 2.018 (2018).
  - L'ho verificato con `fc-query`: **contiene tutti i glifi richiesti**, sia regular sia bold (à è é ì ò ù, À È É Ì Ò Ù, ' ' " ", €, …, – —, « »).
  - Fonte ufficiale dichiarata: notabug.org/HarvettFox96/ttf-pixeloperator. In Fase 1 si conferma che il sito ufficiale è raggiungibile e si registra lo SHA-256 del file.
  - Scartato **W95FA**, perché è un ridisegno di MS Sans Serif.
- **IBM Plex Sans**, licenza **SIL OFL 1.1**, da github.com/IBM/plex. In Fase 1 si verificano versione e licenza e si copia `OFL.txt` in `src/assets/fonts/licenses/`.

---

## 2. Passi in ordine e commit previsti

Ogni commit è convenzionale con descrizione in italiano e finisce con il trailer `Co-Authored-By`. Branch, merge e tag li fai tu.

| # | Passo | Commit |
|---|---|---|
| 1 | Salvo questo piano in `docs/phases/phase-00-plan.md` | `docs: salva il piano della fase 0` |
| 2 | `.gitignore` aggiornato (aggiunge `build/`, `.react-router/`, `coverage/`, `playwright-report/`, `test-results/`, `.lighthouseci/`, `storybook-static/`, `*.tsbuildinfo`, `.claude/settings.local.json` esplicito); `.editorconfig`; `.nvmrc` = `24` (LTS Krypton, 24.21.0 oggi) | `chore: aggiorna gitignore, aggiunge editorconfig e nvmrc` |
| 3 | `package.json` (`engines.node >=24`, `type: module`), Vite + React Router framework mode (`react-router.config.ts` con `ssr:false`, `prerender` da `routeMap`), `tsconfig.json` strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`) | `chore: inizializza progetto con Vite, React Router e TypeScript strict` |
| 4 | Oxlint (aggiorno `.oxlintrc.json`) + type-aware con `oxlint-tsgolint`, Stylelint per i CSS Modules (vieta valori fuori dai token), Prettier, Husky (`pre-commit` → lint-staged, `commit-msg` → commitlint) | `chore: configura oxlint, stylelint, prettier, husky e commitlint` |
| 5 | `src/styles/tokens.css` (colori, bevel, spaziature, tipografia, breakpoint, z-index, durate, safe-area), `global.css` minimo | `feat: aggiunge i token css iniziali` |
| 6 | `routeMap.ts` (`/` it, `/en` en), `root.tsx` con `<html lang>` dinamico, export `meta` con title, description, canonical, hreflang, OG, Twitter e JSON-LD minimo. Desktop vuoto (`<main>` con `<h1>` "Gianpaolo Del Moro" come elemento LCP e link lingua via `<Link>`), sfondo dai token, responsive da 320 px, `100dvh` + safe-area | `feat: aggiunge desktop vuoto con route it ed en prerenderizzate` |
| 7 | `scripts/postbuild.mjs`: hash CSP degli script inline nel meta di ogni HTML, `404.html` dal fallback SPA, controllo che ogni route di `routeMap` abbia il suo `index.html` (la build fallisce se ne manca uno) | `build: aggiunge csp con hash e controlli post-build` |
| 8 | Vitest (jsdom), RTL, user-event, jest-dom, vitest-axe, coverage v8 ≥ 80%: un test unitario (il desktop rende `h1` e link lingua) e un test axe | `test: configura vitest con testing library, axe e coverage` |
| 9 | Test sull'HTML prerenderizzato (progetto Vitest `prerender` che legge `build/client/**/index.html` con jsdom: `lang`, title, description, canonical, hreflang, OG, JSON-LD valido, `h1` presente senza JS) | `test: verifica l'html prerenderizzato di ogni route` |
| 10 | Playwright: progetti 320/375/768/1024/1440 (chromium), touch emulato (`hasTouch`, `isMobile`, Chromium Pixel 7 e WebKit iPhone), Firefox 1440. Test e2e `/` → `/en` → `/` senza reload (marcatore su `window` che deve sopravvivere), axe con `@axe-core/playwright`, nessun errore in console, nessuno scroll orizzontale, screenshot di riferimento | `test: aggiunge e2e playwright multi-viewport con axe e screenshot` |
| 11 | `size-limit` (JS iniziale e CSS iniziale), Lighthouse CI con preset mobile e desktop, 3 run (mediana), `minScore: 1` su tutte le categorie, URL `/` e `/en/` | `ci: aggiunge size-limit e lighthouse ci mobile e desktop` |
| 12 | `.github/workflows/ci.yml`, `deploy.yml` adattato, `dependabot.yml` | `ci: aggiunge workflow ci, deploy manuale e dependabot` |
| 13 | README (EN+IT), LICENSE, SECURITY, CONTRIBUTING, CHANGELOG | `docs: aggiunge readme, licenza, security, contributing e changelog` |
| 14 | `CLAUDE.md` | `docs: aggiunge claude.md con le convenzioni del progetto` |
| 15 | `docs/*.md` (tutti tranne CONTENT) | `docs: aggiunge la documentazione di progetto` |
| 16 | `docs/CONTENT.md` | `docs: raccoglie i contenuti della v1 in content.md` |
| 17 | `docs/adr/` (TEMPLATE + 0000–0010) | `docs: aggiunge template e adr iniziali` |
| 18 | `docs/phases/phase-NN-retro.md` (modello) | `docs: aggiunge il modello di retrospettiva` |
| 19 | `.claude/settings.json` + `.claude/hooks/format.mjs` | `chore: configura hook e permessi di claude code` |
| 20 | `.claude/skills/*` (8) e `.claude/agents/*` (4) | `chore: aggiunge skill e agenti di claude code` |
| 21 | Verifica finale (vedi §Verifica), CHANGELOG `[0.1.0]`, checkbox della Fase 0 in PLAN.md, `phase-00-retro.md` | `docs: chiude la fase 0 con retrospettiva e changelog` |

**Struttura delle cartelle dopo la Fase 0:**
```
src/
  app/root.tsx  app/routes.ts  app/routes/desktop.tsx
  config/site.ts         # dominio, nome, handle (gianpaolo/giampaolo)
  routes/routeMap.ts     # fonte unica delle route per lingua (slug tradotti)
  i18n/                  # dizionari tipizzati it.ts / en.ts + useT()
  seo/                   # buildMeta(), jsonLd()
  styles/tokens.css global.css
  features/desktop/Desktop.tsx Desktop.module.css Desktop.test.tsx
scripts/postbuild.mjs
tests/e2e/  tests/prerender/
```
(`app/` non esiste in radice: `appDirectory` punta a `src/app`.)

### Scelte tecniche motivate (andranno negli ADR)

- **ADR-0006, React Router framework mode con `ssr:false` + `prerender`.**
  - Perché sì:
    - fa ufficialmente quello che serve: HTML completo per ogni route e navigazione SPA dopo l'idratazione
    - genera i file `.data` e il fallback SPA
    - è lo stesso router già usato nella v1
  - Alternative scartate:
    - `vite-react-ssg`: dipende da un unico maintainer
    - script `renderToString` artigianale: da mantenere a mano
    - Astro: cambia paradigma e complica lo stato condiviso del window manager
  - Costi:
    - script inline, gestiti con gli hash CSP
    - il window manager deve rendere in modo deterministico dall'URL, per non avere mismatch di idratazione
- **ADR-0008, i18n con dizionari tipizzati invece di react-i18next.**
  - Ogni app lazy porta i propri `it.ts`/`en.ts`. `en` deve soddisfare `typeof it`, quindi una chiave mancante è un errore di compilazione.
  - Plurali e date passano da `Intl`. La lingua viene dal segmento URL, non dal detector.
  - Runtime circa 1 KB contro circa 15–18 KB gzip di i18next + react-i18next. Pesa sul budget del JS iniziale per Lighthouse mobile.
  - Rivaluto se servisse ICU.
- **ADR-0009, solo Oxlint.**
  - Copre i plugin `react` (incluse `rules-of-hooks` ed `exhaustive-deps`), `jsx-a11y`, `typescript`, `import`, `vitest`, `oxc` e `unicorn`, più regole type-aware con `oxlint-tsgolint`.
  - È già nella v1 ed è molto veloce in lint-staged e CI.
  - ESLint scartato:
    - `typescript-eslint` 8.71 richiede TypeScript < 6.1
    - doppia configurazione da mantenere
  - Si affianca **Stylelint**, che fa un lavoro diverso: vieta colori, px e durate hardcoded nei `.module.css` con `stylelint-declaration-strict-value`.
  - Le regole non esprimibili (niente commenti inline nel React, niente stili inline tranne le variabili CSS) le controlla l'agente code-reviewer. Se Oxlint espone `no-inline-comments` o `no-restricted-syntax` la attivo.
  - `no-restricted-globals` su `location` e `no-restricted-properties` su `window.location` sono già disponibili.
- **TypeScript 6.0.3**, l'ultima versione con API JS. TS 7.0 (nativa) è appena uscita: alcuni strumenti usano ancora l'API JS di TypeScript. L'aggiornamento è pianificato via Dependabot quando l'ecosistema è allineato.
- **ADR-0010, font**: Pixel Operator + IBM Plex Sans (vedi §1.6). Requisiti:
  - subset con `subset-font` in uno script di Fase 1
  - preload del solo font della UI
  - `font-display: swap` con fallback metrico (`size-adjust`, `ascent-override`) per avere CLS 0
  - il font leggibile è selezionabile per tutta l'interfaccia (alto contrasto e "dimensione testo")

---

## 3. File `.md`: scopo e indice

### Radice
- **CLAUDE.md** (≤ 100 righe). Scopo: istruzioni operative per Claude, con rimandi a `docs/`. Indice:
  1. Progetto in breve e link a SPECS
  2. Comandi (`dev`, `build`, `preview`, `test`, `test:e2e`, `test:prerender`, `lint`, `typecheck`, `size`, `lhci`)
  3. Lingue: codice in inglese, docs e commit in italiano, README bilingue
  4. Stili: solo CSS Modules + token; inline solo variabili CSS dinamiche
  5. Interattività: React Aria Components, mai div cliccabili
  6. Navigazione solo con React Router
  7. Niente commenti inline nel React
  8. Definizione di "fatto": responsive, test, story, axe pulito, reduced motion e Pannello di controllo, verifica nel browser anche mobile (QA_CHECKLIST)
  9. Invarianti: Lighthouse 100 e contenuto prerenderizzato
  10. Valori con etichetta e unità
  11. Nome con N sul sito, M in GitHub ed email, da non uniformare
  12. Asset: vietati quelli Microsoft, registro in ASSETS.md
  13. v1 solo da `v1.0.0-legacy`, mai ripristinare file
  14. LEGAL.md vincolante
  15. Flusso di fase e skill disponibili
  16. Trappole (`dev` non prova CSP/deep link; niente CNAME; niente `base`)
- **README.md**. Scopo: vetrina per i tech lead. Indice: 🇬🇧 English (What it is, Highlights, Stack, Getting started, Scripts, Quality gates, Docs, License) · 🇮🇹 Italiano (stesse sezioni).
- **SECURITY.md**. Indice: Versioni supportate · Come segnalare (email, niente issue pubbliche) · Tempi di risposta · Perimetro (sito statico, form Web3Forms) · Misure in atto (CSP, nessuna terza parte, Dependabot).
- **CONTRIBUTING.md**. Indice:
  1. Prerequisiti (Node da `.nvmrc`)
  2. Flusso a fasi (plan mode → piano in `docs/phases/` → branch `phase/NN-nome` da `main` → commit convenzionali in italiano → close-phase → merge `--no-ff` e tag fatti dal proprietario)
  3. Convenzioni di commit (tipi ed esempi)
  4. Quality gate locali (hook)
  5. Aggiungere un ADR
  6. Aggiornare gli screenshot
- **CHANGELOG.md**. Formato Keep a Changelog + SemVer; sezioni `Unreleased`, `0.1.0 – Fase 0`; voci in italiano. `1.0.0-legacy` citata come riferimento storico.
- **LICENSE**. MIT per il codice, più la sezione "Contenuti personali – Tutti i diritti riservati" per testi, immagini, CV e dati in `src/content/`. Gli asset di terzi restano con le rispettive licenze, elencate in ASSETS.md.

### docs/
- **SPECS.md**
  1. Visione
  2. Tipi di visitatore (recruiter frettoloso: CV e contatti in ≤ 2 interazioni, anche con la "Vista semplice"; tech lead: codice, case study, qualità; curioso: esperienza 95, easter egg)
  3. Requisiti funzionali per app
  4. Requisiti non funzionali (Lighthouse, a11y, responsive, privacy, i18n, performance)
  5. Route e deep link per lingua
  6. **Mappatura degli URL della v1** (`/profilo`, `/stack`, `/progetti`, `/contatti` verso la v2: stesso percorso se possibile, altrimenti pagina di redirect con canonical; implementata in F3, verificata in F7 con sitemap e Search Console)
  7. **Form contatti**: inoltro, campi, validazione (solo formato email, esistenza non verificabile), anti-abuso, stati di invio, **gestione degli errori con canale alternativo sempre funzionante** (email offuscata, GitHub, LinkedIn solo se presente in CONTENT.md), email mai in chiaro nel markup statico (§1.7). Criterio di accettazione: "il recruiter può contattarmi anche con Web3Forms giù".
  8. Criteri di accettazione per requisito
  9. Fuori perimetro
- **ARCHITECTURE.md**
  1. Panoramica e diagramma
  2. Struttura delle cartelle
  3. Routing e prerender (routeMap, slug tradotti, `.data`, fallback, `404.html`)
  4. Window manager (pointer events, focus/z-index, stato)
  5. Stato con Zustand e sincronizzazione con l'URL (l'URL è la fonte della finestra attiva; il layout viene da localStorage dopo l'idratazione senza CLS)
  6. Modalità mobile
  7. i18n
  8. Dati a build time (GitHub)
  9. Post-build (CSP, sitemap, llms, OG)
  10. Confini dei moduli e dipendenze ammesse
- **DESIGN_SYSTEM.md**
  1. Principi (proporzioni 95, scala UI)
  2. Token: colori (classico e alto contrasto), bevel raised/sunken/field, spaziature, tipografia (Pixel Operator UI, IBM Plex Sans documenti, scale testo), breakpoint (320, 480, 768, 1024, 1440 con soglia della modalità mobile da definire in F2), z-index, durate e easing, target touch 44 px, safe-area
  3. Temi
  4. Convenzioni CSS Modules e attributi data-* di React Aria
  5. Componenti (catalogo, da completare in F1)
  6. Icone
- **PLAN.md**: roadmap con checkbox (vedi §3.1).
- **TESTING.md**
  1. Strategia (piramide)
  2. Strumenti e versioni
  3. Soglie (coverage 80% su linee, rami, funzioni e statement; Lighthouse 100×4×2; size-limit)
  4. Viewport (320, 375, 768, 1024, 1440, touch)
  5. Cosa testare per tipo di file (componente, hook, store, util, route/app, script di build, CSS)
  6. Regressione visiva (Docker Playwright per baseline coerenti con la CI)
  7. Test sull'HTML prerenderizzato, incluso il controllo che nessun file di `build/client` contenga l'email in chiaro
  8. Servizi esterni simulati: `page.route` per Web3Forms (500, quota esaurita, rete assente, JSON malformato, timeout). Si verificano messaggio, canale alternativo, dati conservati e axe. In CI non partono mai chiamate reali a Web3Forms
  9. Comandi
  10. Flakiness
- **CODE_REVIEW.md**: checklist per l'agente, divisa in correttezza, TypeScript, React (niente commenti inline, niente div cliccabili, React Router), stili (token, inline solo variabili), a11y, responsive e touch, i18n (IT ed EN allineati), SEO/prerender, performance (lazy, bundle), legale (terze parti, asset), test, documentazione e ADR. Formato del report: bloccante, da sistemare, suggerimento.
- **ACCESSIBILITY.md**
  1. Obiettivo WCAG 2.2 AA
  2. Tastiera (scorciatoie stile 95, ordine del focus, focus visibile, trappola nelle finestre modali, Esc)
  3. Screen reader (landmark, annunci live per apertura e chiusura finestre, nomi accessibili)
  4. Reduced motion (media query + Pannello di controllo)
  5. Alto contrasto (tema e `forced-colors`)
  6. Target touch e zoom fino al 400%, reflow a 320 px
  7. Test automatici e manuali
  8. Eccezioni documentate
- **PERFORMANCE_SEO.md**
  1. Budget (JS iniziale ≤ 90 KB gzip, da stringere dopo la misura della F0; CSS iniziale ≤ 12 KB; font in preload ≤ 25 KB; LCP ≤ 1,2 s, TBT ≤ 50 ms, CLS ≤ 0,01, FCP ≤ 1,0 s con mobile simulato)
  2. Lighthouse CI (preset, run, URL, soglie)
  3. Prerender e contenuto senza JS
  4. Meta per route
  5. JSON-LD (Person, WebSite, ProfilePage, SoftwareSourceCode)
  6. Sitemap e hreflang
  7. robots.txt e crawler AI
  8. llms.txt e llms-full.txt
  9. Open Graph generate
  10. Boot, animazioni e suoni senza impatto su LCP, CLS e TBT (**niente cloaking**: nessun rilevamento dei bot, stessa esperienza per tutti; overlay che non diventa LCP, solo alla prima visita, saltabile)
  11. Trailing slash e canonical su GitHub Pages
  12. Storybook escluso dall'indicizzazione (noindex, Disallow, fuori da sitemap, llms e LHCI)
- **CONTENT.md**
  1. Fonte e regole (nome N/M, tono)
  2. Testi della v1 per pagina (§1.3)
  3. Domande aperte per la F3 (Java, Spring Boot, Python; indirizzo del liceo)
  4. **Bozze da approvare**, marcate `BOZZA – da rivedere`: Giurisprudenza come punto di forza (bio e Timeline), esperienza ICTS generica con competenze trasferibili, skill con livello e contesto d'uso
  5. Mancanti per l'inglese (checklist)
  6. Template della scheda progetto (repo, nome, descrizione IT/EN, stack, contesto, ruolo, demo, immagini con alt IT/EN, in evidenza sì/no)
  7. Template del case study (problema, scelte tecniche, difficoltà, risultato, IT/EN)
  8. CV pubblico IT/EN (sezioni e dati da includere ed escludere: niente clausola di consenso, patente sì)
- **DEPLOYMENT.md**
  1. Architettura (GitHub Pages, user site, root)
  2. Dominio (Settings → Pages, niente CNAME, HTTPS, www, DNS)
  3. Workflow (CI riutilizzabile, deploy manuale o su tag)
  4. Prima pubblicazione della v2 e transizione dalla v1
  5. Variabili di build (`VITE_WEB3FORMS_ACCESS_KEY` come variabile del repo)
  6. Configurazione manuale di Web3Forms (restrizione al dominio, email di destinazione)
  7. Verifiche dopo il deploy (`curl -I` sulle route, status 404 su URL ignoti, CSP in console)
  8. Rollback (rilancio su tag precedente)
  9. Limiti di GitHub Pages (niente header custom, redirect sulla trailing slash)
- **I18N.md**
  1. Lingue e default
  2. URL per lingua con slug tradotti (`routeMap`)
  3. Struttura dei dizionari tipizzati per app
  4. hreflang e x-default
  5. Cambio lingua (mantiene la finestra corrispondente)
  6. Persistenza in localStorage (solo preferenza, l'URL vince)
  7. Formati (date, numeri, plurali con Intl)
  8. Checklist per nuovi testi
- **LEGAL.md**
  1. Nessuna richiesta a terze parti al caricamento (unica eccezione Web3Forms all'invio)
  2. Storage tecnico ammesso e niente cookie banner. Chiavi: lingua, audio, tema, posizione finestre, boot già visto, `contact.lastSubmitAt`
  3. Informativa privacy art. 13 GDPR. Contenuti obbligatori:
     - titolare (Gianpaolo Del Moro) e contatto `giampaolo.delmoro99@gmail.com`
     - dati trattati: log di GitHub Pages e dati del form
     - finalità e basi giuridiche
     - fornitori: GitHub, Web3Forms ed eventuale antispam di terzi, da verificare
     - trasferimenti extra UE
     - conservazione
     - diritti e reclamo al Garante
     - cookie e storage
  4. Form (§1.7): solo nome, email e messaggio; risposta al visitatore via `replyto` senza email automatiche; protezioni anti-abuso senza cookie; niente captcha di terze parti
  5. Disclaimer di non affiliazione a Microsoft
  6. Asset vietati e procedura per i nuovi asset
  7. Loghi solo con permesso
  8. CV pubblico (niente dati non necessari, niente metadati)
  9. Licenze (codice MIT, contenuti riservati)
  10. Checklist di verifica (usata da security-auditor e in F6)
- **ASSETS.md**: regole (fonte, autore, versione, licenza, link alla licenza, SHA-256, data di verifica, file nel repo) e tabelle per font (Pixel Operator CC0, IBM Plex Sans OFL con `OFL.txt` nel repo), icone, suoni, immagini (favicon originale). Più l'elenco degli asset vietati.
- **QA_CHECKLIST.md**
  1. Prima di iniziare (build + preview, mai dev)
  2. Checklist desktop
  3. Checklist mobile (320/375 verticale e orizzontale, touch, safe-area, zoom 200%)
  4. Tastiera e screen reader
  5. Reduced motion e alto contrasto
  6. Console e rete (nessuna richiesta esterna)
  7. Prompt pronti per Claude in Chrome (smoke test, viewport mobile, tastiera, rete e console, confronto visivo con il mockup di Claude Design)
- **AI_WORKFLOW.md**
  1. Ruoli degli strumenti (Claude Code, Claude Design, Claude in Chrome)
  2. Ciclo di fase (plan mode → piano → implementazione → agenti → QA → retro)
  3. Skill e agenti
  4. Prompt chiave
  5. Lezioni imparate per fase
  6. Materiale per la finestra "Making of"
- **EASTER_EGGS.md**: regole (accessibili, senza asset Microsoft, senza impatto su Lighthouse, disattivabili) e registro (nome, trigger, fase, file, test).

### docs/phases/
- **phase-00-plan.md**: questo piano.
- **phase-NN-retro.md** (modello): Obiettivi e risultato · Cosa è andato bene · Cosa no · Metriche (coverage, Lighthouse mobile e desktop per route, size-limit, numero di test) · Decisioni e ADR · Debito tecnico · Lezioni per AI_WORKFLOW · Azioni per la fase successiva.

### docs/adr/
TEMPLATE.md (Stato · Contesto · Decisione · Alternative · Conseguenze · Riferimenti) e:
- **0000-lezioni-dalla-v1**: contenuto di §1
- **0001-design-system-css-modules-react-aria**
- **0002-form-contatti-web3forms-honeypot**: stato **Proposta** fino alla verifica in F3 di privacy policy e DPA. Contiene:
  - le misure di §1.7
  - i limiti: chiave pubblica, protezioni aggirabili, quota del piano gratuito, **esistenza dell'email del mittente non verificabile** (solo formato; la verifica reale avviene quando rispondo)
  - il comportamento in caso di errore: messaggio accessibile e canale alternativo sempre funzionante, email offuscata fuori dal markup statico
  - il piano B: captcha solo dopo consenso, backend con rate limit per IP, fornitore UE
- **0003-nessun-cookie-banner-solo-storage-tecnico**: art. 122 del Codice privacy e linee guida del Garante del 2021 sui cookie tecnici; elenco delle chiavi, incluso `contact.lastSubmitAt`
- **0004-dati-progetti-github-a-build-time**
- **0005-window-manager-custom-zustand**
- **0006-spa-react-router-con-prerender**
- **0007-modalita-mobile-del-window-manager**: decisione di principio, dettagli in F2
- Aggiunte da me:
  - **0008-i18n-dizionari-tipizzati**
  - **0009-oxlint-e-stylelint**
  - **0010-font-pixel-operator-ibm-plex-sans**

### 3.1 Roadmap in PLAN.md (con le fasi grandi divise)

- [ ] **0 Foundation**
- [ ] **1 Design system**
  - token, breakpoint
  - temi classico e alto contrasto
  - font con subset e licenze
  - componenti base responsive su React Aria
  - Storybook pubblicato in `/storybook/` con noindex e Disallow, fuori da sitemap, llms e LHCI
- [ ] **2A Window manager desktop**
  - desktop, icone, taskbar con orologio, menu Start, menu contestuale
  - finestre: drag, resize, focus, minimizza, massimizza, animazioni
  - "Esegui…"
- [ ] **2B Routing e mobile**
  - deep link sincronizzati con Zustand
  - persistenza del layout senza CLS
  - modalità mobile
- [ ] **3A App di contenuto**
  - About
  - Progetti GitHub con lo script di build e i case study
  - Skills con livello e contesto d'uso, Timeline con Giurisprudenza valorizzata
  - CV stampabile IT/EN con i PDF ripuliti
  - chiusura delle domande aperte di CONTENT.md e approvazione delle bozze
- [ ] **3B Contatti, legale e accesso rapido**
  - verifica di privacy policy e DPA di Web3Forms, ADR-0002 Accettata oppure piano B
  - Contatti con Web3Forms: `replyto`, access key da variabile di build, validazione, honeypot, tempo minimo, pausa tra invii, stati accessibili
  - gestione degli errori di invio con messaggio accessibile e canale alternativo sempre funzionante (email offuscata, GitHub, LinkedIn solo se presente in CONTENT.md)
  - email mai in chiaro in HTML prerenderizzato, JSON-LD, llms e sitemap; test sul build
  - e2e Playwright con risposte di errore simulate (500, quota, rete assente, risposta non valida, timeout)
  - restrizione al dominio nel pannello di Web3Forms
  - pagina privacy (incluso l'antispam di terzi)
  - Making of, Vista semplice
  - **redirect degli URL della v1**
- [ ] **4A Esperienza di sistema**
  - boot senza cloaking (prima visita, saltabile, non LCP), suoni con mute
  - Pannello di controllo
  - error boundary, 404 BSOD
  - spegnimento
- [ ] **4B Svago**
  - Prompt MS-DOS, Prato fiorito
  - Cestino con la v1, screensaver
  - easter egg
- [ ] **5 Qualità**
  - a11y completa
  - SEO e crawler AI (sitemap, hreflang, llms, OG generate)
  - Lighthouse 100 su tutte le route
  - size-limit, i18n completo
- [ ] **6 Sicurezza, legale, deploy**
  - CSP finale con `connect-src` Web3Forms
  - security.txt, humans.txt, robots.txt
  - audit di LEGAL.md e ASSETS.md
  - valutazione dell'alias email sul dominio
- [ ] **7 Release 1.0**
  - **verifica della mappatura degli URL della v1**, sitemap e Google Search Console
  - primo deploy della v2, tag `v1.0.0`

Ogni fase ha sotto-checkbox per i deliverable e un "criterio di uscita" (close-phase verde).

---

## 4. Skill e agenti

Formato comune delle skill: frontmatter `name` e `description`; corpo con **Quando usarla**, **Passi**, **Checklist di uscita** e **Riferimenti** ai file in `docs/`. Le skill sono brevi (≤ 80 righe) e non duplicano le regole: rimandano ai docs.

| Skill | `description` | Contenuto |
|---|---|---|
| `win95-component` | Crea o modifica un componente del design system Win95 su React Aria Components con CSS Modules e token, responsive, con test, story e controllo axe. | Passi: (1) componente RAC giusto o composizione; (2) `Name.tsx` + `Name.module.css` (solo `var(--…)`, stati via `[data-pressed]`, `[data-focus-visible]`…); (3) responsive mobile-first e target 44 px nella modalità touch; (4) reduced motion; (5) `Name.test.tsx` (render, interazione con user-event, tastiera, axe); (6) `Name.stories.tsx` con varianti e temi; (7) export dall'indice; (8) verifica in Storybook e nel browser a 320 e 1440. Checklist con Stylelint e Oxlint puliti, coverage, niente commenti inline. |
| `window-app` | Aggiunge una nuova app/finestra al desktop: route IT/EN, deep link, contenuto prerenderizzato, icona, voce nel menu Start, versione mobile, i18n e test. | Passi: voce in `routeMap` (slug IT/EN), modulo lazy in `features/<app>`, `meta` + JSON-LD, contenuto semantico renderizzato senza effetti (prerender), dizionari `it`/`en`, icona originale registrata in ASSETS, voce Start e icona desktop, comportamento mobile, test (unit, axe, e2e deep link, prerender), aggiornamento di sitemap e llms (automatico) e SPECS. |
| `write-tests` | Indica quali test scrivere per un file (componente, hook, store, util, app/route, script di build) e su quali viewport, secondo docs/TESTING.md. | Tabella tipo di file → test obbligatori; pattern RTL (query per ruolo); user-event; axe; e2e con i 5 viewport + touch; prerender; come raggiungere l'80% senza test vuoti; anti-pattern. |
| `update-visual-snapshots` | Aggiorna gli screenshot di riferimento di Playwright solo dopo un cambiamento visivo voluto e verificato. | Precondizioni (cambio voluto, motivazione nel commit); comando nel container Docker della CI; revisione delle differenze una per una; mai aggiornare per "far passare" la CI; commit dedicato `test: aggiorna gli screenshot di riferimento per …`. |
| `i18n-strings` | Aggiunge o modifica testi dell'interfaccia in italiano e inglese nei dizionari tipizzati, con le stesse chiavi e il tono di docs/CONTENT.md. | Dove stanno i dizionari, naming delle chiavi, plurali e date con Intl, `en satisfies` lo shape di `it`, alt e aria-label inclusi, nome N/M, aggiornare CONTENT.md, test e content-reviewer. |
| `add-project` | Aggiunge un progetto GitHub al portfolio: dati tipizzati, testi IT/EN, immagini, case study e metadati a build time. | Passi: voce in `src/content/projects.ts` secondo il template di CONTENT.md, verifica dell'URL con "giampaolo", immagini AVIF/WebP con dimensioni e alt IT/EN registrate in ASSETS, case study opzionale, script `fetch-github` per i metadati, JSON-LD `SoftwareSourceCode`, test. |
| `new-adr` | Scrive una nuova decisione architetturale numerata a partire da docs/adr/TEMPLATE.md. | Numero progressivo, nome kebab in italiano, sezioni del template, stato Proposta/Accettata/Sostituita, link dagli altri docs e dalla eventuale ADR sostituita. |
| `close-phase` | Prepara la chiusura di una fase: test, coverage, regressione visiva, Lighthouse mobile e desktop, agenti di review, QA nel browser, retrospettiva, CHANGELOG e PLAN. Non esegue merge né tag. | Passi: `lint`, `typecheck`, `test --coverage`, `build`, `test:prerender`, `test:e2e`, `size`, `lhci` mobile e desktop; lancio dei 4 agenti e correzione dei bloccanti; QA_CHECKLIST con Claude in Chrome (anche mobile); `phase-NN-retro.md`; CHANGELOG; checkbox in PLAN; riepilogo finale con i comandi di merge e tag **da far eseguire all'utente**. |

| Agente | `description` | Contenuto |
|---|---|---|
| `code-reviewer` | Review indipendente delle modifiche del branch secondo docs/CODE_REVIEW.md. Da usare a fine task o fase. | Strumenti in sola lettura (Read, Grep, Glob, Bash in sola lettura come `git diff main...`); applica la checklist; report ordinato per gravità con file:riga; non modifica codice. |
| `security-auditor` | Verifica sicurezza, CSP, dipendenze, requisiti di docs/LEGAL.md, richieste verso terze parti e registro docs/ASSETS.md. | Controlli: CSP e hash, `npm audit`, URL esterni nel codice e nel build, storage usato rispetto all'elenco consentito, form (campi, honeypot, tempo minimo, pausa tra invii, access key solo da variabile d'ambiente, nessuna email automatica al visitatore), Storybook con noindex, asset non registrati o di origine Microsoft, metadati del PDF, segreti, permessi dei workflow. Solo lettura. |
| `a11y-auditor` | Audita accessibilità (WCAG 2.2 AA) e comportamento responsive/touch secondo docs/ACCESSIBILITY.md. | Rilegge componenti e CSS: ruoli e nomi, tastiera, focus, reduced motion, alto contrasto, contrasto dei token, target 44 px, assenza di funzioni solo hover o solo tasto destro, 320 px senza scroll orizzontale, safe-area. Può lanciare i test axe e Playwright. Solo lettura. |
| `content-reviewer` | Rivede i testi IT/EN: tono, correttezza, traduzioni allineate, nome con N sul sito e M in GitHub ed email. | Confronta i dizionari `it` ed `en` e CONTENT.md: chiavi allineate, niente testo hardcoded nei componenti, terminologia coerente, grafia del nome, meta di lunghezza adeguata (title ≤ 60, description ≤ 160). **Segnala come bloccante** ogni testo marcato `BOZZA – da rivedere` che finisce nel sito senza la tua approvazione. Solo lettura. |

**`.claude/settings.json`:**
- **Hook `PostToolUse`** su `Edit|Write|MultiEdit`: `node .claude/hooks/format.mjs`, che legge il JSON da stdin e lancia `prettier --write --ignore-unknown` sul file modificato. Non serve `jq`.
- **`permissions.allow`**:
  - `npm run *`, `npx playwright *`, `npx prettier *`, `npx oxlint *`
  - `git status|diff|log|show|add|commit`
  - lettura di `node_modules`
- **`permissions.deny`**:
  - `git push`, `git merge`, `git tag`, `git checkout main`, `git rebase`, `git reset --hard`
  - `rm -rf`
  - scrittura in `.claude/settings.local.json`
- **`permissions.ask`**: `npm install *`

---

## 5. Dipendenze (versioni verificate oggi su npm)

**Runtime:**

| Pacchetto | Versione |
|---|---|
| `react`, `react-dom` | 19.3.0 |
| `react-router` | 8.4.0 |
| `@react-router/node` | 8.4.0 (serve al prerender) |

`react-aria-components` 1.22.1 e `zustand` 5.0.15 si installano in F1 e F2.

**Dev:**

| Area | Pacchetti |
|---|---|
| Build e tipi | `@react-router/dev` 8.4.0 · `vite` 8.3.4 · `@vitejs/plugin-react` 6.1.2 · `typescript` 6.0.3 · `@types/react` e `@types/react-dom` 19.3.0 · `@types/node` 24.x (allineato a Node 24) |
| Test | `vitest` 5.0.4 · `@vitest/coverage-v8` 5.0.4 · `jsdom` 30.1.2 · `@testing-library/react` 16.3.3 · `@testing-library/user-event` 14.6.8 · `@testing-library/jest-dom` 7.0.1 · `vitest-axe` 0.1.0 · `axe-core` 4.14.0 · `@playwright/test` 1.64.0 · `@axe-core/playwright` 4.13.0 |
| Budget e Lighthouse | `@lhci/cli` 0.15.1 · `size-limit` 14.2.0 · `@size-limit/file` 14.2.0 |
| Lint e formattazione | `oxlint` 1.88.0 · `oxlint-tsgolint` 7.0.2004 · `stylelint` 17.16.0 · `stylelint-config-standard` 40.0.0 · `stylelint-config-css-modules` 4.6.0 · `stylelint-declaration-strict-value` 1.12.1 · `prettier` 3.9.10 |
| Hook e commit | `husky` 9.1.7 · `lint-staged` 17.6.0 · `@commitlint/cli` 21.2.3 · `@commitlint/config-conventional` 21.2.3 (`subject-case` disattivata per le descrizioni in italiano) |

**Fasi successive (non installate in F0):**
- `storybook` e `@storybook/react-vite` 10.6.2 (F1)
- `subset-font` 2.9.0 (F1)
- un generatore OG e PDF da scegliere in F3 e F5

**Node:** `.nvmrc` = `24`. È la LTS attiva (Krypton, 24.21.0). Node 26 diventa LTS a fine ottobre: lo aggiornerà Dependabot o una ADR.

Le versioni sono fissate con `^` e con `package-lock.json`. Dependabot lavora a gruppi settimanali (react, test, lint, build) più le GitHub Actions.

---

## 6. Rischi e domande aperte

**Rischi:**
1. **Hash CSP vs script inline di React Router.** Se una release cambia il markup inline, gli hash vanno ricalcolati. Lo fa il post-build, e un test verifica che ogni `<script>` inline abbia il suo hash nel meta.
2. **Trailing slash su GitHub Pages.** `/en` con `en/index.html` riceve un 301 verso `/en/`. Proposta: canonical, hreflang e sitemap **con la slash finale**, e link interni coerenti. Lo verifico con `curl -I` alla prima pubblicazione. Nel frattempo LHCI testa `/en/`.
3. **Idratazione e layout persistito.** Leggere la posizione delle finestre da localStorage dopo l'idratazione può causare CLS. Mitigazione da progettare in F2: tema e prima applicazione tramite lo script inline con hash, variabili CSS impostate prima del paint, niente spostamenti visibili.
4. **Lighthouse 100 su mobile con la schermata di boot e i suoni (F4).** Niente rilevamento dei bot via user agent e niente contenuti diversi per i crawler: sarebbe cloaking. Il boot è uguale per tutti:
   - overlay che non diventa l'elemento LCP e non sposta il layout
   - solo alla prima visita (chiave "boot già visto")
   - saltabile da tastiera e touch
   - disattivato con reduced motion

   LHCI lo misura come un visitatore nuovo. Il progetto è della F4, il vincolo è già in PERFORMANCE_SEO.md.
5. **Screenshot locali vs CI** (font rendering diverso). Baseline generate solo nel container Docker di Playwright, documentato nella skill.
6. **`vitest-axe` è fermo dal 2022.** Funziona come wrapper di `axe-core`. Se si rompe con Vitest 5 lo sostituisco con un matcher locale di 20 righe.
7. **TypeScript 6 vs 7.** Scelta conservativa; il passaggio va rivalutato in F5.
8. **Durata della CI** (5 viewport + touch + Firefox + LHCI 2×2×3 run). Uso sharding Playwright e cache dei browser. La regressione visiva gira solo su Chromium.
9. **Pixel Operator.** La fonte ufficiale (notabug) potrebbe non essere raggiungibile. Io ho verificato il pacchetto via DaFont, che contiene il CC0 dell'autore. In F1 confermo la fonte e registro lo SHA-256.

10. **Il form è aggirabile.** Con la chiave pubblica su un sito statico, le protezioni lato client non fermano chi chiama l'API direttamente. Mitigazioni: restrizione al dominio nel pannello e piano B (ADR-0002).

**Domande aperte rimaste** (nessuna blocca la Fase 0; sono tracciate nei documenti):
- Java, Spring Boot, Python e l'indirizzo del liceo: in CONTENT.md, da chiudere in F3.
- Le bozze di riformulazione per CV, bio e Timeline: in CONTENT.md, da approvare tu.
- Web3Forms: gestore (Web3Creative o Sacred Media LLC), regione AWS e antispam di terzi. ADR-0002 resta "Proposta" fino alla verifica in F3.
- L'alias email sul dominio: in F6.
- Contatto del titolare nella pagina /privacy: va bene la forma testuale offuscata nel prerender, completata dopo l'idratazione (§1.7)? Si decide al più tardi in F3B.

---

## Verifica (fine Fase 0)

1. `npm ci && npm run lint && npm run typecheck && npm run test -- --coverage`: tutto verde, coverage ≥ 80%.
2. `npm run build`:
   - esistono `build/client/index.html`, `build/client/en/index.html`, `404.html`
   - lo script post-build stampa le route e gli hash CSP
3. `npm run test:prerender`: per `/` e `/en/`, l'HTML statico ha `lang`, title, description, canonical, hreflang, OG, JSON-LD valido e `h1` senza JS.
4. `npm run test:e2e`:
   - navigazione `/` ↔ `/en` senza reload sui 5 viewport, touch, WebKit e Firefox
   - axe pulito, console senza errori, niente scroll orizzontale a 320 px
5. `npm run size` entro budget; `npm run lhci:mobile` e `npm run lhci:desktop` con 100 in tutte e quattro le categorie su `/` e `/en/`.
6. Push su `phase/00-foundation`: `ci.yml` verde su GitHub Actions. `deploy.yml` **non** parte, perché è solo manuale o su tag.
7. QA nel browser con Claude in Chrome su `npm run preview`: 320 px verticale e orizzontale e 1440 px, tastiera, console e rete senza richieste esterne, CSP senza violazioni.
8. Chiusura con la skill `close-phase`, retrospettiva e CHANGELOG. Merge e tag li esegui tu.

---

## Integrazione: regola di merge e integrità dei controlli

Richiesta durante l'implementazione, vale per CONTRIBUTING.md, TESTING.md, CODE_REVIEW.md, la skill `close-phase` e l'agente `code-reviewer`.

- **Regola di merge.** Una fase si chiude solo se passano tutti i test, sia i nuovi sia quelli di tutte le fasi precedenti. Devono essere verdi in locale e nella CI di GitHub per il branch della fase. `close-phase` termina leggendo lo stato dell'ultima run CI del branch (`gh run list --branch phase/NN-nome --limit 1`). Se non è verde (o non c'è), **non propone i comandi di merge** e riporta cosa manca.
- **Vietato aggirare i controlli.** Sono vietati:
  - `test.skip`, `test.only`, `describe.skip`, `describe.only` e `test.todo`
  - test commentati, oppure rimossi senza motivazione
  - soglie di coverage, Lighthouse o size-limit abbassate
  - snapshot aggiornati solo per far passare la CI

  Le eventuali eccezioni vanno motivate in un ADR.
- **Oxlint** (in `.oxlintrc.json`, tutte come errore): `vitest/no-disabled-tests`, `vitest/no-focused-tests`, `vitest/no-commented-out-tests`, `vitest/no-conditional-tests`, `vitest/expect-expect`, `vitest/warn-todo`. Le regole valgono anche per i file Playwright.
- **Hook `pre-push`** (Husky): `npm run lint && npm run typecheck && npm run test`. Un push con errori evidenti si blocca prima della CI.
- **code-reviewer**: segnala come **bloccante** ogni test disattivato, rimosso o indebolito rispetto a `main` (asserzioni tolte, `expect` più permissivi, viewport o progetti Playwright rimossi, soglie in `vitest.config.ts`, `lighthouserc.*`, `.size-limit.*` abbassate, snapshot cambiati senza un cambio visivo motivato). Usa `git diff main...HEAD` sui file di test e di configurazione.
