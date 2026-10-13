# Roadmap

Ogni fase:

- si svolge sul branch `phase/NN-nome`
- parte in plan mode, con il piano salvato in `docs/phases/phase-NN-plan.md`
- si chiude con la skill `close-phase` e con la retrospettiva `phase-NN-retro.md`

Il proprietario esegue merge `--no-ff` e tag `phase-NN`. Criterio di uscita comune a tutte le fasi: **tutti i test verdi in locale e nella CI del branch**, Lighthouse 100 mobile e desktop, nessuna violazione axe.

Le fasi 2, 3 e 4 sono divise in due sotto-fasi (A e B) perché troppo grandi per una sola review.

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

## 1. Design system

- [ ] Token completi: colori, bevel, spaziature, tipografia, breakpoint, z-index, durate
- [ ] Temi classico e alto contrasto, `forced-colors`, "dimensione testo"
- [ ] Font: Pixel Operator e IBM Plex Sans con subset, preload, fallback metrico; licenze e SHA-256 in ASSETS.md
- [ ] Componenti base responsive su React Aria Components (catalogo in DESIGN_SYSTEM.md §6)
- [ ] Storybook 10, pubblicato in `/storybook/` con `noindex`, `Disallow` in robots.txt, fuori da sitemap, llms e Lighthouse CI
- [ ] Icone originali iniziali (Claude Design), registrate in ASSETS.md

## 2A. Window manager desktop

- [ ] Desktop con icone (selezione, apertura con mouse, tastiera e tap)
- [ ] Finestre: drag, resize, focus, z-index, minimizza, massimizza, chiudi, animazioni
- [ ] Taskbar con orologio, menu Start, menu contestuale (anche senza tasto destro), "Esegui…"
- [ ] Scorciatoie da tastiera e annunci per screen reader

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

- [ ] Verifica di privacy policy e DPA di Web3Forms; ADR-0002 accettata o piano B
- [ ] Form contatti: `replyto`, nessuna email automatica, access key da variabile di build, validazione, honeypot, tempo minimo, pausa tra invii, stati accessibili
- [ ] Gestione degli errori di invio con canale alternativo sempre funzionante (email offuscata, GitHub, LinkedIn solo se in CONTENT.md)
- [ ] Email mai in chiaro in HTML prerenderizzato, JSON-LD, llms e sitemap (test sul build)
- [ ] e2e con risposte di errore simulate: 500, quota esaurita, rete assente, risposta non valida, timeout
- [ ] Restrizione al dominio nel pannello di Web3Forms (DEPLOYMENT.md)
- [ ] Pagina /privacy IT/EN (incluso l'eventuale antispam di terzi), link nel footer e vicino al pulsante del form
- [ ] Disclaimer di non affiliazione a Microsoft
- [ ] Vista semplice; Making of (da AI_WORKFLOW.md)

## 4A. Esperienza di sistema

- [ ] Boot: solo prima visita, saltabile, mai elemento LCP, nessun cloaking
- [ ] Suoni originali con mute
- [ ] Pannello di controllo: tema, alto contrasto, dimensione testo, riduzione animazioni, audio, lingua, sfondo
- [ ] Error boundary a tema, 404 in stile schermata blu, schermata di spegnimento

## 4B. Svago

- [ ] Prompt MS-DOS
- [ ] Prato fiorito (accessibile da tastiera)
- [ ] Cestino con la v1 (screenshot e link al tag)
- [ ] Screensaver (rispetta reduced motion)
- [ ] Easter egg registrati in EASTER_EGGS.md

## 5. Qualità

- [ ] Audit di accessibilità completo (a11y-auditor + manuale con screen reader)
- [ ] SEO e crawler AI: sitemap con hreflang, robots.txt, llms.txt e llms-full.txt IT/EN, Open Graph generate in build
- [ ] Lighthouse 100 mobile e desktop su tutte le route IT/EN
- [ ] size-limit con budget per chunk di ogni app
- [ ] i18n completo e rivisto (content-reviewer)
- [ ] Rivalutazione di TypeScript 7

## 6. Sicurezza, revisione legale e deploy

- [ ] CSP finale (`connect-src` per Web3Forms)
- [ ] security.txt, humans.txt, robots.txt definitivo
- [ ] Verifica completa di LEGAL.md e ASSETS.md (security-auditor)
- [ ] Valutazione dell'alias email sul dominio

## 7. Release 1.0

- [ ] Verifica della mappatura degli URL della v1 in produzione (`curl -I`), sitemap, Google Search Console
- [ ] Prima pubblicazione della v2 con tag `v1.0.0` (deploy)
- [ ] Verifiche dopo il deploy (DEPLOYMENT.md)
