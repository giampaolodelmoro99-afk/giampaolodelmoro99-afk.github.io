# Checklist di code review

La usa l'agente `code-reviewer` (e chiunque faccia review) sul diff `git diff main...HEAD`.

## Formato del report

Ogni punto ha un livello, un riferimento `file:riga` e una spiegazione di una o due frasi.

- **Bloccante**: da correggere prima del merge.
- **Da sistemare**: da correggere in questa fase, non blocca la singola modifica.
- **Suggerimento**: facoltativo.

Il report si chiude con un verdetto: "pronto per il merge" oppure "non pronto", con l'elenco dei bloccanti.

## 1. Integrità dei test (bloccante)

- [ ] Nessun `test.skip`, `.only`, `describe.skip`, `.todo`, nessun test commentato.
- [ ] Nessun test **rimosso o indebolito** rispetto a `main`: asserzioni tolte, `expect` più permissivi, viewport o progetti Playwright rimossi, file aggiunti a `testIgnore` senza motivo.
- [ ] Soglie invariate o più severe: coverage in `vitest.config.ts`, Lighthouse in `lighthouserc.*.json`, budget in `.size-limit.js`.
- [ ] Screenshot cambiati solo con un cambio visivo voluto e motivato nel commit.
- [ ] Ogni eccezione ha un ADR.

Comando utile: `git diff main...HEAD --stat -- tests '**/*.test.*' vitest.config.ts playwright.config.ts lighthouserc.*.json .size-limit.js .oxlintrc.json`.

## 2. Correttezza

- [ ] Il comportamento corrisponde al piano di fase e a SPECS.md.
- [ ] Casi limite gestiti: liste vuote, errori di rete, storage non disponibile (try/catch).
- [ ] Nessun errore o warning in console.

## 3. TypeScript

- [ ] Niente `any`, niente asserzioni non sicure (`as`), niente `@ts-ignore` o `@ts-expect-error` senza motivazione.
- [ ] Tipi derivati dalle fonti uniche (`routeMap`, dizionari), non duplicati.

## 4. React

- [ ] Nessun commento nel codice `.tsx`.
- [ ] Elementi interattivi su React Aria Components; nessun `div` o `span` cliccabile, nessun `onClick` su elementi non interattivi.
- [ ] Navigazione solo con React Router; niente `window.location`.
- [ ] Il primo render dipende solo dall'URL (niente mismatch di idratazione): storage, `window` e `Date.now()` solo negli effetti.
- [ ] Hook con dipendenze complete; nessun effetto superfluo.
- [ ] Nessuna stringa visibile hardcoded: testi dai dizionari.

## 5. Stili

- [ ] Solo CSS Modules con `var(--token)`; nessun valore letterale (Stylelint verde).
- [ ] Stili inline solo per variabili CSS dinamiche.
- [ ] Stati da attributi `data-*` di React Aria.
- [ ] Mobile-first, nessun overflow orizzontale a 320 px.

## 6. Accessibilità e responsive

- [ ] Ruoli, nomi e stati accessibili corretti; focus visibile e ordine logico.
- [ ] Target ≥ 44×44 px in modalità touch; nessuna funzione solo hover o solo tasto destro.
- [ ] Animazioni rispettose di `prefers-reduced-motion` e del Pannello di controllo.
- [ ] axe pulito in unit ed e2e.

## 7. i18n

- [ ] Ogni testo nuovo esiste in `it` ed `en`, con le stesse chiavi.
- [ ] Nome "Gianpaolo" (N) sul sito, "giampaolo" (M) solo in GitHub ed email.

## 8. SEO e prerender

- [ ] La route nuova è in `routeMap` e prerenderizzata; il suo contenuto è nell'HTML statico.
- [ ] Meta, canonical, hreflang e JSON-LD coerenti; test prerender aggiornato.
- [ ] Nessun contenuto tolto dall'HTML prerenderizzato.

## 9. Performance

- [ ] App caricate in lazy loading; nessuna dipendenza pesante nel chunk iniziale.
- [ ] Immagini in formati moderni con `width` e `height`; font in woff2 con subset.
- [ ] `npm run size` e Lighthouse nelle soglie di ADR-0018 (in CI; in locale solo a fine fase).

## 10. Legale, privacy e sicurezza

- [ ] Nessuna richiesta a terze parti al caricamento; nessun nuovo storage fuori dall'elenco di LEGAL.md.
- [ ] Nuovi asset registrati in ASSETS.md; nessun asset Microsoft.
- [ ] Nessuno script o stile inline aggiunto a mano (CSP), nessun attributo `style` nell'HTML prerenderizzato (ADR-0012).
- [ ] Email mai in chiaro nel markup statico.

## 11. Documentazione

- [ ] Docs aggiornati (ARCHITECTURE, DESIGN_SYSTEM, I18N…) se cambia qualcosa che descrivono.
- [ ] Decisioni rilevanti in un ADR; CHANGELOG aggiornato a fine fase.
- [ ] Commit convenzionali in italiano.
