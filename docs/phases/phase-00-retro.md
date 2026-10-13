# Retrospettiva Fase 0: Foundation

- **Branch**: `phase/00-foundation`
- **Periodo**: 2026-10-13
- **Piano**: [phase-00-plan.md](phase-00-plan.md)
- **Ultima CI del branch**: **da verificare dopo il push** (il branch non è ancora stato pushato). È il cancello finale per il merge (`close-phase` §6).

## 1. Obiettivi e risultato

| Obiettivo del piano                                            | Stato | Note                                                                                  |
| -------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------- |
| Analisi della v1 e ADR-0000                                    | fatto |                                                                                       |
| Progetto React Router (prerender) + Vite + TS strict           | fatto | TypeScript 6.0.3; `isbot` aggiunto da React Router per l'entry server del prerender   |
| Lint, formattazione, hook                                      | fatto | anche `pre-push` e regole contro i test disattivati (integrazione richiesta in corsa) |
| Token e desktop vuoto responsive                               | fatto |                                                                                       |
| Route `/` e `/en/` prerenderizzate con meta, hreflang, JSON-LD | fatto | in più: route 404 prerenderizzata                                                     |
| CSP con hash e post-build                                      | fatto | in più: idratazione rinviata (vedi §3)                                                |
| Test unit, axe, e2e, prerender                                 | fatto |                                                                                       |
| size-limit, Lighthouse CI 100                                  | fatto | budget JS corretto da 90 a 115 kB                                                     |
| CI, deploy manuale, Dependabot                                 | fatto | `ci.yml` non ancora eseguito su GitHub                                                |
| Documentazione, ADR, Claude Code                               | fatto | ADR 0000-0010, 8 skill, 4 agenti                                                      |

## 2. Cosa è andato bene

- Lighthouse 100 su mobile e desktop, in tutte le categorie, su `/` e `/en/`, in 3 esecuzioni su 3.
- Gli hook hanno bloccato più volte commit con errori (tipi, asserzioni non sicure, import non assegnati) prima che arrivassero in CI.
- Test sull'HTML statico e sul build (CSP, email non in chiaro) verificati anche "in negativo": il test sull'email fallisce davvero se l'indirizzo compare.

## 3. Cosa non è andato bene, e come è stato corretto

- **Lighthouse mobile a 93** al primo giro: la simulazione contava i `modulepreload` nel percorso critico dell'LCP. Risolto rinviando l'idratazione a dopo `load` (ADR-0006), dopo un esperimento su varianti del build.
- **Budget del JS iniziale sottostimato** nel piano (90 kB). React 19 + React Router 8 pesano 112 kB gzip: budget fissato a 115 kB e motivato in PERFORMANCE_SEO.md.
- **Hydration mismatch sulla 404** con il fallback SPA (React #418): risolto con una route splat prerenderizzata usata come `404.html`.
- **WebKit** sull'host non parte senza dipendenze di sistema (`sudo npx playwright install-deps`); **screenshot** diversi tra host e CI. Risolto eseguendo la suite completa nel container Playwright, lo stesso della CI.
- **QA con Claude in Chrome**: la verifica a 1920 px è riuscita (idratazione, navigazione senza reload, console vuota, nessuna richiesta esterna, link di 142×44 px). Il ridimensionamento della finestra a 375 px invece non ha avuto effetto in questo ambiente. I viewport 320/375 e il touch sono coperti dagli e2e e dagli screenshot, che ho rivisto a mano.

## 4. Metriche

| Metrica                         | Valore                                                                      |
| ------------------------------- | --------------------------------------------------------------------------- |
| Test unitari                    | 27 (coverage: righe 98,76%, rami 92,85%, funzioni 97,22%, statement 98,88%) |
| Test prerender                  | 16                                                                          |
| Test e2e                        | 95 su 8 progetti (5 viewport Chromium, Pixel 7, iPhone 14 WebKit, Firefox)  |
| Screenshot di riferimento       | 15                                                                          |
| Lighthouse mobile `/` e `/en/`  | 100 / 100 / 100 / 100 (LCP 0,9 s, TBT 0 ms, CLS 0)                          |
| Lighthouse desktop `/` e `/en/` | 100 / 100 / 100 / 100                                                       |
| JS iniziale gzip                | 112,16 kB (budget 115)                                                      |
| CSS iniziale gzip               | 1,31 kB (budget 12)                                                         |
| Violazioni axe                  | 0                                                                           |
| `npm audit --omit=dev`          | 0 vulnerabilità                                                             |

## 5. QA manuale

2026-10-13, Chrome con Claude in Chrome, `npm run preview`, 1920 px: idratazione ok, `/` → `/en/` senza reload, `lang` e canonical aggiornati, console senza messaggi, nessuna richiesta esterna, CSP presente. Mobile coperto da e2e e screenshot (vedi §3).

## 6. Decisioni e ADR

ADR 0000-0010. Le più rilevanti: 0006 (prerender + idratazione rinviata), 0008 (i18n tipizzata), 0009 (solo Oxlint + Stylelint), 0010 (font). ADR-0002 resta **Proposta** fino alla verifica di Web3Forms in F3B.

## 7. Debito tecnico e rischi aperti

- La trasformazione del bootstrap dipende dal markup di React Router 8.4. La build fallisce se cambia, ma va ricontrollata a ogni aggiornamento di React Router.
- La versione di `@playwright/test` deve combaciare con il tag dell'immagine Docker in `ci.yml` e `package.json`.
- `braces` ≤ 3.0.3 (dipendenza di sviluppo di Stylelint): vulnerabilità "high" senza correzione disponibile, rischio accettato (ADR-0009).
- Trailing slash in produzione: da verificare con `curl -I` alla prima pubblicazione.
- Fonte ufficiale di Pixel Operator da confermare in F1.

## 8. Lezioni per AI_WORKFLOW.md

Riportate in AI_WORKFLOW.md §5 (Fase 0).

## 9. Azioni per la fase successiva

1. Push del branch e verifica della CI su GitHub (primo run di `ci.yml`: container e2e, Lighthouse sui runner).
2. Merge `--no-ff` e tag `phase-00` (non `v*`).
3. Fase 1: font (subset, fallback metrico, licenze), temi, componenti React Aria, Storybook escluso dall'indicizzazione.
4. Risposte alle domande aperte di CONTENT.md, entro la F3.
