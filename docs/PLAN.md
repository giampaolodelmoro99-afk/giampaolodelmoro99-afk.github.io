# Roadmap

Ogni fase:

- si svolge sul branch `phase/NN-nome`
- parte in plan mode, con il piano salvato in `docs/phases/phase-NN-plan.md`
- si chiude con la skill `close-phase` e con la retrospettiva `phase-NN-retro.md`

Il proprietario esegue merge `--no-ff` e tag `phase-NN`. Criterio di uscita comune a tutte le fasi: **tutti i test verdi in locale e nella CI del branch**, Lighthouse nelle soglie di ADR-0018, nessuna violazione axe.

Le fasi 1, 2, 3 e 4 sono divise in due sotto-fasi (A e B) perché troppo grandi per una sola review.

## 0. Foundation

- [x] Analisi della v1 dal tag `v1.0.0-legacy` (ADR-0000)
- [x] Progetto React Router (prerender) + Vite + TypeScript strict
- [x] Oxlint, Stylelint, Prettier, Husky (pre-commit, commit-msg, pre-push), commitlint
- [x] Token CSS iniziali e desktop vuoto responsive da 320 px
- [x] Route `/` e `/en/` prerenderizzate con meta, hreflang e JSON-LD; 404 prerenderizzata
- [x] Post-build: CSP con hash, 404.html, idratazione rinviata
- [x] Vitest + RTL + vitest-axe, test sull'HTML prerenderizzato, Playwright multi-viewport con axe e screenshot
- [x] size-limit, Lighthouse CI mobile e desktop con soglia 100
- [x] CI, deploy manuale o su tag, Dependabot
- [x] Documentazione, ADR 0000–0010, configurazione di Claude Code
- [ ] CI verde su GitHub per `phase/00-foundation`, retrospettiva, merge e tag `phase-00`

## 1A. Design system: fondamenta

Piano: [phase-01-plan.md](phases/phase-01-plan.md) §1–§10.

- [x] Token GDM 95 completi: colori, bevel, misure desktop e touch, focus, tipografia, z-index, durate
- [x] Temi classico e alto contrasto, `forced-colors`, attributi `data-theme`, `data-font`, `data-input`, `data-motion`, dimensione del testo
- [x] Focus a doppio anello sulle pagine esistenti
- [x] Font: Pixel Operator (subset) e IBM Plex Sans (subset Latin1 ufficiali), preload di Pixel Operator, fallback metrico; licenze e SHA-256 in ASSETS.md
- [x] Icone GDM 95 registrate in ASSETS.md, componenti Icon e Glyph, favicon col monogramma GDM
- [x] Storybook 10, pubblicato in `/storybook/` con `noindex`, CSP dedicata, `Disallow` in robots.txt, fuori da sitemap, llms e Lighthouse CI
- [x] Test visivi e axe delle story nel container
- [x] Note dalla Fase 0: analisi del bundle, JS dopo load, filtro dei tag del deploy, runner fissato
- [ ] QA su Android reale, CI verde su GitHub per `phase/01a-foundation-ds`, merge e tag `phase-01a`

## 1B. Design system: componenti

Piano in [phase-01-plan.md](phases/phase-01-plan.md), appendice B (approvato il 14/10/2026).

- [x] Sostituire le icone di Campo minato (16 e 32 px): il disegno attuale (erba e fiori) richiama "Prato fiorito". Nuova versione da Claude Design, SHA-256 in ASSETS.md, `npm run icons`, screenshot
- [x] CSP del sito e stile inserito a runtime da React Aria (`react-aria-pressable-style`), prima del primo componente nelle pagine
- [x] Pagina 404 con il `Link` di React Aria e test e2e con la CSP reale (ADR-0012)
- [x] Peso dei componenti con size-limit: totale, gruppo del desktop per la F2A, incremento per componente
- [x] 18 componenti su React Aria Components (catalogo in DESIGN_SYSTEM.md §6), con test, story, screenshot e axe
- [ ] QA su Android reale, CI verde su GitHub per `phase/01b-components`, merge e tag `phase-01b`

## 2A. Window manager desktop

- [x] Desktop con icone (selezione, apertura con mouse, tastiera e tap)
- [x] Finestre: drag a contorno, resize con otto maniglie, focus, z-index, minimizza, massimizza, chiudi, animazioni; Sposta e Ridimensiona da tastiera e al tocco; cascata dentro l'area visibile (ARCHITECTURE.md §4)
- [x] Taskbar con orologio, pulsante Finestre e selettore, menu Start nell'ordine di D05, menu contestuale (tasto destro, Maiusc+F10, tasto Menu, pressione lunga), "Esegui…"
- [x] Spegni con congedo, Riavvia e Vista semplice, senza ricaricare la pagina
- [x] Scorciatoie da tastiera e annunci per screen reader (ADR-0016)
- [x] Budget del chunk del desktop e del CSS dei componenti provvisori fino a fine 2A-2 (ADR-0020); da fissare alla chiusura
- [x] Attributi `style` nell'HTML prerenderizzato (ADR-0012, tipo C): chiuso da ADR-0015 (guscio statico, Glyph con classi generate); e2e con la CSP reale sulla home per DesktopIcon, menu Start e finestre (2A-1). Radio (Spegni, `VisuallyHidden`) ed Esegui con la CSP reale sulla home (2A-2); Tooltip e AlertDialog quando entrano nella home; Checkbox e Select quando entrano in una pagina (F3B o F4A)
- [x] `I18nProvider` di React Aria con `intlLocales` della lingua della route, nel chunk del desktop invece che nel root: il guscio statico e la 404 non dipendono dalla lingua di React Aria (test), ADR-0014
- [x] **Caricamento separato del codice del desktop dopo il primo disegno** (ADR-0014): guscio statico prerenderizzato e desktop interattivo in un chunk dopo l'idratazione; icone da sprite SVG; indice dei componenti vietato nel sito (Oxlint). JS iniziale 117,8 kB, chunk del desktop 56,08 kB, componenti 85,12 kB (budget in PERFORMANCE_SEO.md)
- [ ] Etichette del desktop con il carattere leggibile (alto contrasto, `data-font="readable"`): una parola più larga della cella va a capo con la sillabazione ("Compe-tenze"); verificare i testi definitivi delle icone a 320 px

- [ ] Note dell'a11y-auditor (1B) da risolvere quando i componenti entrano nelle pagine:
  - ~~livello del titolo della Window, insieme alla scelta `region`/`dialog`~~: risolto in 2A (ADR-0016: region, titolo non heading, contenuto da `h1` o `h2`)
  - corpo `document` della Window scorrevole da tastiera anche in Safari (riusare `ScrollArea`): **parziale** in 2A (focus programmatico e skip link; da verificare su Safari)
  - ~~pulsante attivo della taskbar in alto contrasto distinto non solo dal grassetto~~: risolto in 2A (giallo e bordo di 3 px); cerchio del Radio in `forced-colors`: aperto, ora che il Radio è nella home (Spegni), rinviato alla 2B (ADR-0016)
  - testi troncati (StatusBar, titoli, taskbar, voci di menu larghe a 320 px) leggibili per intero; taskbar con molte finestre a 320 px (ADR-0007, F2B): in 2A i pulsanti scorrono senza coprire lingua e orologio
  - focus iniziale sul pulsante meno distruttivo nei dialog di conferma (in Spegni resta su «Spegni», rinvio motivato in ADR-0016); pulsanti della barra del titolo senza callback non mostrati
  - tooltip uguale all'`aria-label` letto due volte; `ScrollArea` focalizzabile solo quando scorre; segnaposto distinguibile dal testo
  - progetto Storybook a 320 px con controllo dell'overflow; verifiche manuali con NVDA, VoiceOver, zoom 200/400% e `forced-colors`

- [x] Rimisure delle correzioni di ADR-0013 (esiti in ADR-0018): idratazione rinviata confermata, con i `modulepreload` inerti; preload di Pixel Operator bold confermato; soglie di Lighthouse sulle metriche "buone" di Google

## 2B. Routing, persistenza e mobile

- [ ] Deep link per ogni finestra con React Router, sincronizzati con Zustand
- [ ] Persistenza del layout in localStorage senza CLS
- [ ] Modalità mobile: finestre a schermo intero, navigazione touch (ADR-0007 aggiornata)
- [ ] e2e su touch e su tutti i viewport

## 3A. App di contenuto

- [ ] About con la bio (Giurisprudenza come punto di forza, testi approvati)
- [ ] Progetti GitHub: file dati tipizzato, script di build per i metadati (ADR-0004), case study
- [ ] Skills con livello e contesto d'uso (niente percentuali)
- [ ] Timeline
- [ ] CV stampabile IT/EN; PDF generati in build, tagged, senza metadati superflui
- [ ] Chiusura delle domande aperte e approvazione delle bozze in CONTENT.md
- [ ] Slug definitivi e **mappatura degli URL della v1** (SPECS §6), con pagine di reindirizzamento dove serve

## 3B. Contatti, legale e accesso rapido

- [ ] Verifica di privacy policy e DPA di Web3Forms; ADR-0002 accettata o resto del piano B (la parte sul captcha è già decisa in ADR-0017)
- [ ] **hCaptcha su consenso esplicito (ADR-0017)**: pulsante «Attiva la verifica» con riga informativa e link alla privacy, caricamento solo dopo il clic, hCaptcha attivo nel pannello di Web3Forms (DEPLOYMENT.md §6), opzione accessibile di hCaptcha, email offuscata e GitHub sempre visibili
- [ ] CSP per i domini di hCaptcha (script, frame, connect, style) senza `'unsafe-inline'`, tenendo conto che in una SPA vale la CSP della prima pagina caricata: ADR dedicato
- [ ] Informativa: hCaptcha con fornitore, dati, cookie, trasferimento extra UE e base giuridica del consenso
- [ ] e2e hCaptcha: nessuna richiesta a `*.hcaptcha.com` prima del clic, form inviabile solo con la verifica (simulata), alternativa email sempre presente
- [ ] Form contatti: `replyto`, nessuna email automatica, access key da variabile di build, validazione, honeypot, tempo minimo, pausa tra invii, stati accessibili
- [ ] Gestione degli errori di invio con canale alternativo sempre funzionante (email offuscata e GitHub; LinkedIn non compare sul sito)
- [ ] Email mai in chiaro in HTML prerenderizzato, JSON-LD, llms e sitemap (test sul build)
- [ ] e2e con risposte di errore simulate: 500, quota esaurita, rete assente, risposta non valida, timeout
- [ ] Restrizione al dominio nel pannello di Web3Forms (DEPLOYMENT.md)
- [ ] Pagina /privacy IT/EN (incluso l'eventuale antispam di terzi), link nel footer e vicino al pulsante del form
- [ ] Disclaimer di non affiliazione a Microsoft
- [ ] Vista semplice; Making of (da AI_WORKFLOW.md)
- [ ] LEGAL.md §2 e ADR-0003: citare le chiavi `sessionStorage` tecniche di React Router (`react-router-scroll-positions`, `remix-router-transitions`, `react-router-manifest-version`) nell'informativa (security-auditor, 1B)

## 4A. Esperienza di sistema

- [ ] Boot: solo prima visita, saltabile, mai elemento LCP, nessun cloaking
- [ ] Suoni originali con mute
- [ ] Pannello di controllo: tema, alto contrasto, dimensione testo, riduzione animazioni, audio, lingua, sfondo
- [ ] Error boundary a tema, 404 in stile schermata blu, schermata di spegnimento

## 4B. Svago

- [ ] Terminale
- [ ] Campo minato (accessibile da tastiera)
- [ ] Cestino con la v1 (screenshot e link al tag)
- [ ] Screensaver (rispetta reduced motion)
- [ ] Easter egg registrati in EASTER_EGGS.md

## 5. Qualità

- [ ] Audit di accessibilità completo (a11y-auditor + manuale con screen reader)
- [ ] SEO e crawler AI: sitemap con hreflang, robots.txt, llms.txt e llms-full.txt IT/EN, Open Graph generate in build
- [ ] Lighthouse nelle soglie di ADR-0018 su tutte le route IT/EN
- [ ] size-limit con budget per chunk di ogni app
- [ ] i18n completo e rivisto (content-reviewer)
- [ ] Rivalutazione di TypeScript 7

## 6. Sicurezza, revisione legale e deploy

- [ ] CSP finale (`connect-src` per Web3Forms)
- [ ] security.txt, humans.txt, robots.txt definitivo
- [ ] Verifica completa di LEGAL.md e ASSETS.md (security-auditor)
- [ ] Valutazione dell'alias email sul dominio
- [ ] File delle licenze di terze parti (React Aria è Apache-2.0, i bundle minificati non conservano gli header) citato in LEGAL.md §9 (security-auditor, 1B)

## 7. Release 1.0

- [ ] Verifica della mappatura degli URL della v1 in produzione (`curl -I`), sitemap, Google Search Console
- [ ] Prima pubblicazione della v2 con tag `v1.0.0` (deploy)
- [ ] Verifiche dopo il deploy (DEPLOYMENT.md)
