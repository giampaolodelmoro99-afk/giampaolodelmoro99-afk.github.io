# Fase 1 — Design system GDM 95: piano

La Fase 1 è divisa in due sotto-fasi:

- **1A — Fondamenta** (`phase/01a-foundation-ds`, tag `phase-01a`): piano approvato il 13/10/2026, §1–§10.
- **1B — Componenti** (`phase/01b-components`, tag `phase-01b`): piano approvato il 14/10/2026, appendice B.

Branch, merge e tag li esegue il proprietario. La 1B parte da `main` dopo il merge della 1A.

## Contesto

La Fase 0 ha lasciato token minimi, font di sistema, focus di 1 px e nessun componente. Il design system "GDM 95" è stato approvato in Claude Design e il pacchetto è in `docs/design/gdm95/` (committato al passo 0). La 1A porta in `src/` token, temi, font, icone, Icon e Glyph, e Storybook pubblicato con i test visivi. Chiude anche le 5 note rimaste dalla Fase 0. I 18 componenti restanti sono la 1B.

## Decisioni prese (D1–D6)

|     | Decisione                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | La fase si divide in 1A e 1B, con due branch e due tag. PLAN.md viene diviso di conseguenza. `docs/phases/phase-01-plan.md` contiene l'intero piano: la 1A più la bozza della 1B, segnata "da riconfermare in plan mode". |
| D2  | Pixel Operator si prende dal pacchetto DaFont. In ASSETS.md registro: notabug.org 404 dal 13/10/2026, SHA-256 dello zip, testo di `LICENSE.txt` (CC0 1.0) e intestazione DaFont incoerente ("Public domain / GPL / OFL"). |
| D3  | Il monogramma GDM diventa subito la favicon. Le PNG si fanno in F5 con le immagini Open Graph.                                                                                                                            |
| D4  | Autore delle icone: "Claude (Claude Design) per Gianpaolo Del Moro".                                                                                                                                                      |
| D5  | Lo slider è rimandato alla F4A. Il pulsante con sola icona diventa una variante di Button (1B).                                                                                                                           |
| D6  | Per i valori letterali del CSS si creano token, senza eccezioni Stylelint.                                                                                                                                                |

## Scostamenti dall'implementazione (1A)

Scelte prese durante il lavoro, documentate in ADR-0010, DESIGN_SYSTEM.md e PERFORMANCE_SEO.md:

| Piano                                                             | Implementazione                                                                          | Motivo                                                                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Subset di IBM Plex Sans con `subset-font`, file `ibm-plex-sans-*` | Subset **Latin1 ufficiali di IBM**, identici alla release (`IBMPlexSans-*-Latin1.woff2`) | La licenza riserva il nome "Plex": un subset nostro sarebbe una versione modificata (OFL-FAQ 2.5-2.6)            |
| Originali di Plex in `fonts-src/`                                 | Solo Pixel Operator in `fonts-src/`                                                      | Plex non si modifica, quindi non serve l'originale                                                               |
| Preload solo di `pixel-operator-400`                              | Preload di 400 e **700** (6,3 kB)                                                        | Il titolo della home, al primo disegno, è in grassetto                                                           |
| Fallback su `local("DejaVu Sans")`                                | `local("Arial")`, `local("Liberation Sans")`, `local("Arimo")`                           | DejaVu non è compatibile con le metriche di Arial su cui sono calcolati gli override                             |
| CSP di Storybook con `font-src 'self'`                            | `font-src 'self' data:`                                                                  | Le pagine Docs di Storybook usano font incorporati in `data:` (nessuna richiesta esterna)                        |
| `glyphs.json` letto dal pacchetto                                 | Copiato in `src/components/Icon/glyphs.json`                                             | Il codice non dipende dalla documentazione (review)                                                              |
| Due commit separati per tag e runner                              | Un solo commit `ci:`                                                                     | Stesse righe di `deploy.yml`                                                                                     |
| Screenshot del focus rigenerati al passo 4                        | Rigenerati dopo il passo 5 (font)                                                        | Gli screenshot non mostrano il focus: cambiavano per interlinea e font, meglio una sola rigenerazione verificata |

## 1. Analisi del pacchetto (riepilogo)

- **Struttura**: corretta, senza cartelle annidate. 88 file e 33 SVG; **tutti i 33 SHA-256 corrispondono**.
- **Token**:
  - Fase 0 invariata, cambia solo la scrittura degli esadecimali.
  - Cambiano `--font-family-ui`, che diventa un alias, e `--font-family-document`, che passa a Plex.
  - 114 variabili aggiunte.
  - Regole nuove: `data-theme`, `data-font`, `data-input` con `pointer: coarse`, `data-motion` e `forced-colors`.
  - tokens.json e tokens.css sono coerenti.
- **Incoerenze da sistemare in 1A**:
  - Focus da 1 px descritto in DESIGN_SYSTEM §5 e ACCESSIBILITY §2.
  - Plex legato al "testo grande" in ADR-0010 e DESIGN_SYSTEM §4.
  - Lo slider nel catalogo §6.
  - "Prompt MS-DOS" e "Prato fiorito" in SPECS, PLAN, EASTER_EGGS e CONTRIBUTING.
  - LinkedIn in SPECS §7, PLAN 3B, LEGAL §1 e §4, CONTENT §3 e ADR-0002.
  - **Bug latente**: `Desktop.module.css` usa `--color-text-inverse`, quindi in alto contrasto il testo sarebbe nero su nero. Si passa a `--color-desktop-text`, e `::selection` passa a `--color-selection`.
  - Fonte notabug di Pixel Operator 404.
  - Autore delle icone.
  - Ambiguità `#000000` negli SVG: il primo path è il contorno, gli altri sono neri.
- **Incoerenze da sistemare in 1B**:
  - `Taskbar` e `Glyph` senza cartella.
  - `DesktopIcons` dichiarato, ma la cartella si chiama `DesktopIcon`.
  - La classe `g95-scroll` va sostituita con `composes`.
  - I letterali nel CSS dei componenti (i loro token però nascono in 1A).

## 2. Passi e commit

| #   | Passo                                                                                                                                                                                                                                                                                                                                                                                                                                 | Commit                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Salvo l'intero piano (1A più la bozza della 1B) in `docs/phases/phase-01-plan.md`. Divido la Fase 1 di PLAN.md in 1A e 1B. Committo il pacchetto.                                                                                                                                                                                                                                                                                     | `docs: aggiunge il piano della fase 1` · `docs: divide la fase 1 in 1A e 1B` · `docs: aggiunge il pacchetto di consegna GDM 95` |
| 1   | **Token**: `src/styles/tokens.css` prende il pacchetto (formattato con Prettier, senza DotGothic16 nella pila). `base.css` si fonde in `global.css`.                                                                                                                                                                                                                                                                                  | `feat: adotta i token del design system GDM 95`                                                                                 |
| 2   | **Token aggiuntivi** (D6): `--text-etch`, `--offset-pressed`, `--underline-offset`, `--underline-thickness`, `--opacity-disabled`, `--opacity-dither`, `--z-raised`, `--menu-min-width`, `--start-menu-min-width`, `--dialog-width`, `--listbox-max-height`, `--statusbar-field-height`, più la geometria delle frecce della scrollbar calcolata da `--glyph-pixel`. Il pacchetto resta com'è: le aggiunte vanno in DESIGN_SYSTEM §2. | `feat: aggiunge i token per bordi, sottolineature e opacità`                                                                    |
| 3   | **Stylelint**: `custom-property-pattern` diventa `^_?[a-z][a-z0-9-]*$` (le proprietà `--_nome` sono private del modulo). Estendo `declaration-strict-value` a `text-shadow`, `opacity`, `translate`, `outline-offset`, `text-underline-offset` e `text-decoration-thickness`. Aggiungo un test con un fixture che deve fallire.                                                                                                       | `chore: estende stylelint ai nuovi token`                                                                                       |
| 4   | **Focus a doppio anello** (nota 4 della Fase 0): `:focus-visible` globale con outline tratteggiato e `--focus-halo`. Tolgo l'override in Desktop.module.css e uso `--color-desktop-text`. Screenshot rigenerati nel container.                                                                                                                                                                                                        | `fix: usa il focus a doppio anello e i colori del desktop` · `test: aggiorna gli screenshot per il nuovo focus`                 |
| 5   | **Font** (§3)                                                                                                                                                                                                                                                                                                                                                                                                                         | `feat: aggiunge Pixel Operator e IBM Plex Sans con subset`                                                                      |
| 6   | **Icone, Icon e Glyph** (§4)                                                                                                                                                                                                                                                                                                                                                                                                          | `feat: aggiunge le icone GDM 95 e i componenti Icon e Glyph`                                                                    |
| 7   | **Favicon**: `public/favicon.svg` diventa il monogramma GDM (`gdm-32.svg`), e la riga del "monitor" in ASSETS.md si sposta tra i dismessi.                                                                                                                                                                                                                                                                                            | `feat: usa il monogramma GDM come favicon`                                                                                      |
| 8   | **Integrità degli asset**: `scripts/lib/assets.mjs` legge le tabelle di ASSETS.md e verifica che ogni file in `src/assets/`, `public/` e `fonts-src/` sia registrato con lo SHA-256 corretto, e viceversa.                                                                                                                                                                                                                            | `test: verifica gli asset registrati in ASSETS.md`                                                                              |
| 9   | **Storybook** (§5): configurazione, comandi, pagine "Introduzione" e "Token", story di Icon e Glyph.                                                                                                                                                                                                                                                                                                                                  | `chore: configura storybook 10`                                                                                                 |
| 10  | **Pubblicazione** in `/storybook/` con CSP dedicata, noindex e `public/robots.txt`.                                                                                                                                                                                                                                                                                                                                                   | `feat: pubblica storybook in /storybook/ fuori dall'indicizzazione`                                                             |
| 11  | **Test visivi e axe** su Storybook (§5.4)                                                                                                                                                                                                                                                                                                                                                                                             | `test: aggiunge i test visivi e axe delle story`                                                                                |
| 12  | **Analisi del bundle** (§6.1)                                                                                                                                                                                                                                                                                                                                                                                                         | `perf: …` (secondo l'esito) · `docs: documenta l'analisi del bundle`                                                            |
| 13  | **JS dopo load**: test di riferimento (§6.2)                                                                                                                                                                                                                                                                                                                                                                                          | `test: misura idratazione e long task dopo load`                                                                                |
| 14  | **CI**: filtro dei tag del deploy, runner `ubuntu-24.04` (§6.3, §6.5)                                                                                                                                                                                                                                                                                                                                                                 | `ci: limita il deploy ai tag di versione` · `ci: fissa la versione di ubuntu nei runner`                                        |
| 15  | **Preview in LAN**: `scripts/preview.mjs` ascolta di default su `127.0.0.1` (oggi ascolta su tutte le interfacce). Con `--host` ascolta su `0.0.0.0` e stampa l'indirizzo LAN. Così funziona `npm run preview -- --host`.                                                                                                                                                                                                             | `feat: aggiunge l'opzione --host alla preview`                                                                                  |
| 16  | **Documenti** (§7)                                                                                                                                                                                                                                                                                                                                                                                                                    | `docs: aggiorna i documenti al design system GDM 95` · `docs: toglie LinkedIn e i nomi Microsoft dai documenti`                 |
| 17  | **Chiusura** con `close-phase`: quattro review (code, security, a11y, content), QA in Chrome, QA su Android reale, retrospettiva, CHANGELOG, CI del branch verde                                                                                                                                                                                                                                                                      | `docs: chiude la fase 1A`                                                                                                       |

## 3. Font

| Font                                        | Fonte                                                 | Licenza     | File serviti                                                                                                                         |
| ------------------------------------------- | ----------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Pixel Operator 2.018, regular e bold        | Pacchetto DaFont `pixel_operator` dell'autore (D2)    | CC0 1.0     | `src/assets/fonts/pixel-operator-400.woff2`, `-700.woff2`                                                                            |
| IBM Plex Sans 1.1.0: regular, bold, corsivo | Release `@ibm/plex-sans@1.1.0` su github.com/IBM/plex | SIL OFL 1.1 | `src/assets/fonts/ibm-plex-sans-400.woff2`, `-700`, `-400-italic`; `src/assets/fonts/licenses/OFL.txt` e `PixelOperator-LICENSE.txt` |

- **Originali**: i TTF stanno in `fonts-src/`, che non viene servito. Ogni file ha il suo SHA-256, più quello dello zip DaFont. Gli zip si scaricano in una cartella temporanea isolata, senza eseguire nulla.
- **Subset**: `scripts/fonts.mjs`, con `subset-font`, produce woff2 committati (`npm run fonts`, fuori dal build). Copre:
  - U+0020–007E
  - U+00A0–00FF: accentate e « »
  - U+2018–201D: virgolette e apostrofo tipografici
  - U+2013–2014: – e —
  - U+2026: …
  - U+20AC: €
  - • e ×
- **Test** (`fontkit`): ogni woff2 contiene tutti i glifi richiesti.
- **@font-face** in `src/styles/fonts.css`:
  - `font-display: swap`.
  - Facce di fallback metrico `"Pixel Operator Fallback"` e `"IBM Plex Sans Fallback"` su `local("Arial")`, `local("Liberation Sans")`, `local("DejaVu Sans")`.
  - `size-adjust` e gli override di ascent, descent e line-gap li calcola lo script.
- **Preload** solo di `pixel-operator-400.woff2` da `links()` in root.tsx. Un test prerender verifica che il post-build non lo tolga. Aggiungo a size-limit la voce "font in preload ≤ 25 kB".
- **ASSETS.md**: una riga per ogni woff2 e per ogni originale, più le note di D2. DotGothic16 non viene registrato.

## 4. Icone, Icon e Glyph

- **File**: i 33 SVG vanno in `src/assets/icons/`, copiati byte per byte. In ASSETS.md aggiungo le 33 righe del pacchetto, con l'autore indicato in D4.
- **Generazione**: `scripts/icons.mjs` genera `src/components/Icon/iconData.ts` e `glyphData.ts`.
  - Ogni icona è una lista di path con un ruolo di colore.
  - Il primo `#000000` è il contorno, gli altri sono neri.
  - Un test confronta i file generati con gli SVG e con `glyphs.json`.
- **Icon**:
  - Rende un `<svg>` con `shape-rendering="crispEdges"` e classi `pixel*` che leggono `--color-pixel-*`, quindi il contorno diventa bianco in alto contrasto.
  - Usa `forced-color-adjust: none`.
  - Senza `label` ha `aria-hidden` e `focusable="false"`. Con `label` ha `role="img"` e `aria-label`.
  - Accetta `size` 16 o 32 e `scale` solo intera.
- **Glyph**: pixel art a `--glyph-pixel` in `currentColor`.
- **Test**: unitari (aria, dimensioni, classi dei colori), story con tutte le icone in entrambi i temi, screenshot.

## 5. Storybook

### 5.1 Struttura

- `.storybook/main.ts`:
  - `@storybook/react-vite`, con le story in `src/**/*.stories.tsx`.
  - Addon `a11y` e `docs`.
  - `disableTelemetry`.
  - `viteFinal` toglie i plugin `react-router*`.
- `.storybook/preview.tsx` importa `global.css` e definisce il decoratore.
- `manager-head.html` e `preview-head.html` contengono `<meta name="robots" content="noindex, nofollow">`.
- Le pagine MDX sono "Introduzione" e "Token" (colori dei due temi, bevel, tipografia, misure).

### 5.2 Comandi (`globalTypes` → attributi sull'`<html>` dell'iframe)

- Tema: classico o alto contrasto (`data-theme`).
- Font: predefinito, pixel o leggibile (`data-font`).
- Input: automatico, mouse o touch (`data-input`).
- Movimento: normale o ridotto (`data-motion`).
- Testo: 100%, 112,5% o 125% (`--font-size-root`).
- Lingua: IT o EN.
- I comandi si possono pilotare anche dall'URL con `&globals=…`. Quando un valore torna al predefinito, il decoratore toglie l'attributo.

### 5.3 Pubblicazione e CSP

- **Script di build**:
  - `npm run build` diventa `react-router build && node scripts/postbuild.mjs && npm run build:storybook`, così build più preview è uguale alla produzione.
  - `build:site` costruisce solo il sito, per iterare più in fretta.
- **Post-build del sito**: `postbuild.mjs` esclude `storybook/` da `listHtml`, quindi la CSP del sito non cambia.
- **Post-build di Storybook**: `scripts/postbuild-storybook.mjs`, con le funzioni pure e i test in `scripts/lib/storybook.mjs`, lavora su `index.html` e `iframe.html`.
  - Verifica che ci sia il meta noindex.
  - Inserisce una CSP dedicata: `default-src 'self'; script-src 'self' <hash>; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`.
  - Fa fallire la build se trova script o URL esterni.
  - Se Storybook richiedesse `unsafe-eval`, il lavoro si ferma e la scelta passa al proprietario.
- **robots.txt**: `public/robots.txt` minimo con `User-agent: *`, `Allow: /` e `Disallow: /storybook/`. La versione completa arriva in F5.
- **Lighthouse CI**: resta fuori, perché gli URL sono espliciti. Sitemap e llms.txt nascono in F5 da `routeMap`.
- **Storage**: lo storage tecnico di Storybook sotto `/storybook/` va in LEGAL §2 e in ADR-0003. Aggiungo anche una nota in LEGAL §3: l'informativa della F3B dovrà citarlo.
- **Test prerender**: noindex e CSP dedicata nei due HTML di Storybook, CSP del sito invariata, `Disallow` presente in robots.txt.

### 5.4 Test visivi e axe

- **Progetto Playwright**: nuovo progetto `storybook` (Chromium, 1024×768) su `tests/storybook/*.spec.ts`. Usa lo stesso `preview.mjs`; gli altri progetti ignorano questi file.
- **`components.visual.spec.ts`** (`@visual`):
  - Legge `storybook/index.json`.
  - Per ogni story con tag `visual` fotografa tema (classico, alto contrasto) × input (mouse, touch), dopo `document.fonts.ready`.
  - Nella 1A riguarda Icon, Glyph e la pagina Token. La 1B aggiunge i componenti senza toccare il test.
- **`components.a11y.spec.ts`**: axe WCAG 2.2 AA con controllo del contrasto in tutte e quattro le combinazioni. In touch verifica che ogni elemento interattivo misuri almeno 44×44 px.
- Valgono le fixture esistenti: console pulita e nessuna terza parte.
- Gli screenshot si generano solo nel container. In CI girano nello stesso job e2e.

## 6. Note dalla Fase 0

1. **Bundle** (oggi 112 kB gzip: React DOM 66,3, React con React Router 39,1, `routeMap` con i due dizionari 4,1).
   - **Analisi**: `rollup-plugin-visualizer` attivo con `ANALYZE=1` scrive `build/stats.html`.
   - **Riduzioni proposte**:
     - dizionari in chunk separati per lingua
     - verifica col visualizer delle parti di React Router inutili con `ssr:false`
     - `@react-aria/optimize-locales-plugin` limitato a it-IT ed en-US, già pronto per la 1B
   - **Non riducibile**: React DOM, motivato in PERFORMANCE_SEO §1. Il budget non si alza; se scende, lo abbasso.
2. **JS dopo load**:
   - **Ora**: un test e2e su Chromium con CPU rallentata 4× via CDP misura il tempo da `load` a `data-hydrated` e le long task. Serve come riferimento documentato.
   - **In F2A**: INP del primo clic su un'icona (Event Timing), TBT ≤ 50 ms e Lighthouse "timespan" sul flusso apri-finestra. Lo documento in PERFORMANCE_SEO §10.
3. **Tag del deploy**:
   - Il filtro diventa `tags: ["v[0-9]+.[0-9]+.[0-9]+"]`.
   - Aggiungo una guardia con la regex `^v[0-9]+\.[0-9]+\.[0-9]+$` su `push`.
   - `workflow_dispatch` resta libero, per il rollback.
   - Aggiorno CONTRIBUTING e DEPLOYMENT.
4. **Focus**: passo 4, verificato con screenshot e con un test in `keyboard.spec.ts` (outline `2px dashed` più alone).
5. **Runner**:
   - Uso `ubuntu-24.04` in `ci.yml` e `deploy.yml`, la stessa base Noble dell'immagine Playwright.
   - In DEPLOYMENT.md aggiungo la sezione "Aggiornare il runner" (passaggio a 26.04 con la nuova immagine Playwright, in un branch dedicato).
   - Un test sui workflow fallisce se trova `ubuntu-latest`.

## 7. Documenti

- **DESIGN_SYSTEM.md**: token (con le aggiunte di D6), temi e attributi, font, focus, catalogo senza slider (D5) e con la nota "il form Contatti degli esempi è solo dimostrativo".
- **ACCESSIBILITY.md**:
  - §2: focus a doppio anello
  - §5: `data-font` indipendente dal tema
  - §9: nota sul testo disabilitato, esente da WCAG 1.4.3
- **ADR-0010**: fonte DaFont, Plex 1.1.0, `data-font`, `fonts-src/`.
- **ASSETS.md**: font, icone e favicon.
- **LEGAL.md**:
  - LinkedIn tolto da §1 e §4
  - storage di Storybook in §2
  - nota per l'informativa in §3
- **SPECS.md e CONTENT.md**: regola "LinkedIn non compare in nessuna parte del sito". La domanda aperta di CONTENT §3 si chiude.
- **Nomi Microsoft**: "Terminale" e "Campo minato" in SPECS, PLAN, EASTER_EGGS e CONTRIBUTING.
- **ADR-0002**: canale alternativo con email offuscata e GitHub.
- **Altri documenti**:
  - PERFORMANCE_SEO: bundle, font, Storybook, JS dopo load
  - TESTING: progetto `storybook`, test degli asset e dei font
  - DEPLOYMENT: tag e runner
  - ARCHITECTURE: `src/assets/`, `fonts-src/`, `src/components/`
- **QA_CHECKLIST.md**: nuova sezione "Telefono Android reale" (vedi §8).

## 8. Verifica

- **In locale**:
  - `lint`, `typecheck` e `test:coverage` (≥ 80%)
  - `build`, `test:prerender` e `size`: JS ≤ 115 kB, CSS ≤ 12 kB, font in preload ≤ 25 kB
  - `test:e2e` nel container, sul sito e su Storybook
  - `lhci:mobile` e `lhci:desktop` a 100 su `/` e `/en/`
- **Claude in Chrome**, su `npm run preview`:
  - desktop e 404 a 320, 375 e 1440 px, con focus da tastiera
  - alto contrasto e `forced-colors` emulati
  - Storybook con i comandi, senza errori CSP né richieste esterne
- **Telefono Android reale**, con `npm run build && npm run preview -- --host` sulla stessa rete Wi-Fi. Checklist in QA_CHECKLIST.md:
  - [ ] Pixel Operator caricato: il testo del desktop è in pixel font, non nel fallback
  - [ ] focus visibile a doppio anello, con tastiera Bluetooth o con la navigazione di TalkBack
  - [ ] nessuno scroll orizzontale, sia con il telefono in verticale sia in orizzontale
  - [ ] Storybook navigabile al touch: barra laterale, toolbar dei comandi, cambio tema e input
- **Chiusura**: CI del branch verde su GitHub, review di code-reviewer, security-auditor, a11y-auditor e content-reviewer, retrospettiva e CHANGELOG.
- Nessun test disattivato e nessuna soglia abbassata. Gli screenshot si aggiornano solo nel container, con commit dedicati.

## 9. Dipendenze nuove (1A)

| Pacchetto                                                                              | Versione | Tipo |
| -------------------------------------------------------------------------------------- | -------- | ---- |
| `storybook`, `@storybook/react-vite`, `@storybook/addon-a11y`, `@storybook/addon-docs` | 10.6.2   | dev  |
| `subset-font`                                                                          | ^2.9.0   | dev  |
| `fontkit`                                                                              | ^2.0.4   | dev  |
| `rollup-plugin-visualizer`                                                             | ^7.1.1   | dev  |

`react-aria-components` (^1.22.1) e `@react-aria/optimize-locales-plugin` (^2.1.0) entrano in 1B, perché Icon e Glyph non ne hanno bisogno.

## 10. Rischi

1. **LCP con `swap`**: se Lighthouse scende sotto 100, il piano B è `font-display: optional` per Pixel Operator, con un ADR.
2. **Storybook e `unsafe-eval` o script esterni**: se servissero, il lavoro si ferma e la scelta passa al proprietario.
3. **CI più lenta**: il job di build si allunga di circa 1-2 minuti.
4. **React Router in Storybook**: se Storybook non parte, uso una configurazione Vite separata.
5. **Preview su `127.0.0.1`**: cambia il binding predefinito. Verifico che e2e nel container e LHCI funzionino ancora.

---

## Appendice B: Fase 1B, piano approvato il 14/10/2026

Sostituisce la bozza riconfermata in plan mode. I riferimenti §N in questa appendice rimandano alle sezioni B.N.

### Contesto

La 1A (tag `phase-01a`) ha portato token, temi, font, icone, Icon e Glyph e Storybook pubblicato con test visivi e axe. La 1B costruisce i 18 componenti dell'appendice B di `docs/phases/phase-01-plan.md`. Prima, però, va risolto il debito più grave lasciato dalla 1A (retro §7): React Aria inserisce a runtime uno `<style>` che la CSP del sito blocca. Poi si sostituiscono le icone di Campo minato, già arrivate in `docs/design/gdm95-updates/`. Branch `phase/01b-components`, tag `phase-01b` a cura del proprietario.

Decisioni prese con il proprietario in plan mode:

- il test della CSP usa la **404**: i suoi due link diventano `Link` di React Aria (uso reale in produzione, chunk solo della route 404);
- il peso dei componenti si misura **dopo ogni componente**, nelle condizioni della build del sito, con soglia di arresto a +10 kB gzip per componente e con i gruppi della F2A.

---

### B.1 Cosa cambia rispetto alla bozza

| Bozza                                                         | Ora                                                                                                                                                                                                                                                                  | Motivo                                                            |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Primo passo: Button                                           | Primi passi: dipendenze, CSP di React Aria, 404 con Link, Campo minato, misura del peso                                                                                                                                                                              | Retro 1A §7 e §9.4                                                |
| Import da `react-aria-components`                             | Import **per sottopercorso** (`react-aria-components/Button`), imposto da una regola Oxlint `no-restricted-imports`                                                                                                                                                  | Misura realistica e chunk più piccoli (il pacchetto espone `./*`) |
| Nessun controllo del peso dei componenti                      | size-limit con `@size-limit/esbuild` e optimize-locales attivo: totale, gruppi F2A, incremento per commit                                                                                                                                                            | Tua richiesta                                                     |
| Font non indicato                                             | Pixel Operator per titoli, etichette, controlli e testo nei campi; **Plex (`--font-family-prose`)** per descrizioni ed errori dei campi, messaggio di AlertDialog, Window `variant="document"`                                                                       | Decisione 1A sul font delle frasi                                 |
| Disabilitato come nel pacchetto                               | In alto contrasto il disabilitato ha un **secondo segnale** oltre al colore (decisione 2 in B.6)                                                                                                                                                                     | Retro 1A §7                                                       |
| Window: barra inattiva `#6a6a6a` (README del pacchetto)       | Token `#666666` già in `tokens.css`                                                                                                                                                                                                                                  | Deroga in DESIGN_SYSTEM §9                                        |
| StartButton: fascia "gianpaolodelmoro" scritta nel componente | Letta da `src/config/site.ts`                                                                                                                                                                                                                                        | CLAUDE.md: handle solo in `site.ts`                               |
| `I18nProvider` non previsto                                   | `I18nProvider` di React Aria (it-IT / en-US) nel decoratore di Storybook; nel root solo in F2A                                                                                                                                                                       | Testi interni di React Aria (es. DismissButton) localizzati       |
| Esempio di form Contatti                                      | Solo una story "Esempio di form" con nome, email e messaggio, **senza LinkedIn** e senza invio                                                                                                                                                                       | Il form vero è F3B                                                |
| Restano invariati                                             | ordine dei 18 componenti, un commit per componente, "Da sistemare in 1B" (Taskbar dentro TaskbarButton, export `DesktopIcons` da `DesktopIcon/`, `composes` al posto di `g95-scroll`, classi al posto dei selettori `svg` e `[role=menuitem]`, troncamenti a 320 px) |                                                                   |

La bozza precedente resta nella storia di git.

---

### B.2 CSP e stili di React Aria

#### B.2.1 Inventario (analisi di `react-aria-components@1.22.1` e `react-aria@3.53.1`)

Ho cercato in tutto il codice distribuito `createElement('style')`, `setAttribute('style')`, `cssText`, `insertRule`, `adoptedStyleSheets`, `.style.*`, `setProperty` e le prop `style`. Tre tipi di intervento, con effetti diversi sulla CSP (`style-src 'self'`, via meta):

| Tipo                                                                                         | Dove                                                                                                                                                                                                                                                                                                                                                      | Componenti 1B coinvolti                                                                                                                                                                                                  | La CSP lo blocca?                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Elemento `<style>`**                                                                    | **solo** `usePress` (`dist/private/interactions/usePress.mjs`): al primo montaggio di un elemento premibile, se `document.getElementById("react-aria-pressable-style")` non esiste, inserisce in `<head>` `@layer { [data-react-aria-pressable] { touch-action: pan-x pan-y pinch-zoom; } }`. Saltato con `NODE_ENV=test` (per questo Vitest non lo vede) | tutti quelli che si premono: Button, Link, ToggleButton (TaskbarButton), Checkbox, Radio, Tab, trigger di Select, MenuTrigger/MenuItem, StartButton, GridListItem, pulsanti di Window e AlertDialog, ScrollArea (frecce) | **Sì**: violazione in console, regola non applicata                                                                                                                                                                    |
| **B. Scritture CSSOM** (`el.style.x = …`, `style.setProperty`, `Object.assign(el.style, …)`) | `textSelection` (user-select durante la pressione), `usePreventScroll` (Modal), `useOverlayPosition` (Popover, Tooltip), `LiveAnnouncer`, `useDescription`, `useSafelyMouseToSubmenu` (sottomenu), `domHelpers`                                                                                                                                           | Button e tutti i premibili, Tooltip, Select, MenuBar, StartButton, AlertDialog, DesktopIcon                                                                                                                              | **No**: la CSP non governa il CSSOM. Nessun `setAttribute('style')` né `cssText` nel codice                                                                                                                            |
| **C. Prop `style` di React**                                                                 | `VisuallyHidden` (input di Checkbox e Radio, `HiddenSelect` di Select, `DismissButton` di Popover e Modal, parti di GridList); posizionamento di Popover, Tooltip, OverlayArrow; `--visual-viewport-*` di ModalOverlay; nostre variabili `style={{"--…"}}` (ProgressBar, Window in F2A)                                                                   | Checkbox, Radio, Select, Tooltip, MenuBar, StartButton, AlertDialog, DesktopIcon, ProgressBar                                                                                                                            | **Dopo l'idratazione no** (React le applica via CSSOM). **Nell'HTML prerenderizzato sì**: diventano attributi `style="…"`, bloccati, e l'idratazione non li riapplica (es. l'input della checkbox resterebbe visibile) |

In 1B nessun componente con stili di tipo C finisce in una pagina prerenderizzata (la 404 usa solo `Link`, che non ne ha). Il tipo C diventa reale in F2A, quando i componenti arrivano sulla home.

#### B.2.2 Alternative per il tipo A

| Opzione                                                                              | Pro                                                                                                                                                                                                                                                                                              | Contro                                                                                                                                                            | Esito                                       |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Hash** dello stile in `style-src`                                                  | Meccanismo standard, nessun accoppiamento al DOM                                                                                                                                                                                                                                                 | Il testo dipende dalla versione di React Aria (spazi compresi): il post-build dovrebbe estrarlo da `node_modules`; allarga comunque la CSP; non risolve il tipo C | Scartata                                    |
| **Nonce**                                                                            | —                                                                                                                                                                                                                                                                                                | Sito statico su GitHub Pages: il nonce sarebbe fisso, quindi inutile. React Aria non accetta un nonce per questo elemento                                         | Esclusa                                     |
| `'unsafe-inline'`                                                                    | —                                                                                                                                                                                                                                                                                                | Vietata dai vincoli                                                                                                                                               | Esclusa                                     |
| **Patch del pacchetto** (patch-package) o trasformazione Vite che toglie l'iniezione | Nessuno stile inline                                                                                                                                                                                                                                                                             | Nuova dipendenza o regex su codice di terzi, fragili a ogni aggiornamento                                                                                         | Scartata                                    |
| **Stile statico più "sentinella"** (consigliata)                                     | La CSP non cambia di un carattere. Usa il controllo che React Aria fa già: se trova un elemento con id `react-aria-pressable-style`, non inserisce nulla. La regola identica va in `global.css` (già caricato, nessuna richiesta in più) e l'id va sul `<link rel="stylesheet">` di `global.css` | Dipende da un id interno, non da un'API pubblica                                                                                                                  | **Scelta**, con test che rilevano la deriva |

#### B.2.3 Soluzione

- `src/styles/global.css`: `@layer { [data-react-aria-pressable] { touch-action: pan-x pan-y pinch-zoom; } }`, identica a quella di React Aria (layer anonimo, quindi i nostri moduli possono sovrascriverla, per esempio `touch-action: none` per il trascinamento in F2A).
- `src/app/root.tsx`, in `links()`: `{ rel: "stylesheet", href: globalHref, id: "react-aria-pressable-style" }`. Se `<Links />` non passasse `id`, ripiego su un `<link>` reso in `Layout` (da verificare al passo 2).
- Storybook resta com'è: la sua CSP dedicata ha già `'unsafe-inline'` negli stili, e la sentinella lì non serve.
- **Tipo B**: nessuna azione, coperto per costruzione; i test e2e lo confermano su Chromium, Firefox e WebKit.
- **Tipo C**: guardia subito e decisione in F2A:
  - test prerender: **nessun attributo `style=` nell'HTML prerenderizzato del sito**. Oggi passa; fallirà al primo componente di tipo C sulla home, obbligando a decidere;
  - test di inventario (Vitest, `renderToString` sulle story con `composeStories`): elenca gli attributi `style` che ogni componente produce nel prerender e li confronta con una lista attesa nel test e nell'ADR. Un attributo nuovo, non dichiarato, fa fallire il test;
  - opzioni da valutare in F2A con un ADR: post-build che calcola gli hash degli attributi (`style-src-attr 'unsafe-hashes' 'sha256-…'`, CSP3, da verificare su Safari), oppure resa dopo l'idratazione delle sole parti nascoste (`VisuallyHidden`), senza togliere contenuto dall'HTML. In PLAN.md, in F2A, aggiungo la voce "e2e con la CSP reale sulla home per Checkbox, Select, Tooltip, AlertDialog, DesktopIcon".

#### B.2.4 Test

- **Unit (deriva)**: legge `node_modules/react-aria/dist/private/interactions/usePress.mjs` e verifica che contenga l'id `react-aria-pressable-style` e la stessa regola di `global.css`. Un aggiornamento di React Aria (Dependabot) che cambia id o regola fa fallire il test prima dell'e2e.
- **Prerender**: in tutti gli HTML del sito (`/`, `/en/`, 404) il link di `global.css` ha l'id sentinella; la CSP non contiene `unsafe-inline` né `unsafe-eval` (oggi verificato solo in parte, lo rendo esplicito); nessun attributo `style=`; nella 404 i link sono `<a href="/">` e `<a href="/en/">`.
- **e2e `tests/e2e/csp.spec.ts`** sulla 404, con la CSP reale della build:
  - uno script iniziale registra gli eventi `securitypolicyviolation`; dopo l'idratazione e un clic, la lista è vuota (più la fixture `consoleErrors`, già attiva);
  - `getElementById("react-aria-pressable-style")` è un `LINK` e il `touch-action` calcolato del link è `pan-x pan-y pinch-zoom`;
  - il clic naviga lato client verso il desktop, senza ricaricare (marcatore su `window`, come nei test di navigazione);
  - **in negativo**: con `page.route` tolgo l'id sentinella dall'HTML e verifico che la violazione venga registrata. Dimostra che il test non passa a vuoto;
  - progetti: Chromium (viewport), `firefox-1440`, `touch-iphone-14` (WebKit), `touch-pixel-7`.
- **e2e senza JavaScript**: contesto con `javaScriptEnabled: false`, dalla 404 il clic su "Torna al desktop" apre il desktop prerenderizzato.
- **Screenshot della 404**: non devono cambiare. Il `Link` di React Aria rende lo stesso `<a>` con le stesse classi, più attributi `data-*`. Se un pixel cambia, mi fermo e lo motivo prima di aggiornare.

#### B.2.5 ADR

**ADR-0012 "Stile di React Aria e CSP del sito"**: inventario A/B/C, alternative, scelta, test di deriva, guardia del tipo C e opzioni rimandate alla F2A. Aggiorno anche PERFORMANCE_SEO.md (sezione CSP) e ARCHITECTURE.md.

---

### B.3 Passi e commit

Ogni commit passa `lint`, `typecheck` e `test`. Gli screenshot si fanno solo nel container.

| #    | Passo                                                                                                                                                                                                                                                                                                                             | Commit                                                                                                    |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 0    | Piano approvato al posto dell'appendice B di `phase-01-plan.md`; PLAN.md 1B aggiornata (voce F2A per il tipo C)                                                                                                                                                                                                                   | `docs: aggiorna il piano della fase 1B`                                                                   |
| 1    | Dipendenze (§5); `optimizeLocales.vite({ locales: ["it-IT", "en-US"] })` in `vite.config.ts` e nel `viteFinal` di Storybook; regola Oxlint che vieta l'import dalla radice di `react-aria-components`; `I18nProvider` nel decoratore di Storybook, legato al comando Lingua                                                       | `chore: aggiunge react-aria-components e optimize-locales`                                                |
| 2    | Sentinella e regola in `global.css`, id nel link, test di deriva e prerender (§2.4)                                                                                                                                                                                                                                               | `fix: evita lo stile inline di React Aria con la CSP del sito`                                            |
| 3    | 404 con `Link` di React Aria e `RouterProvider` locale (`useNavigate`, `useHref`) solo in `NotFound`; e2e CSP, positivo e negativo, e senza JS; controllo che `JS iniziale della home` resti 112,25 kB                                                                                                                            | `feat: usa il link di React Aria nella pagina 404` · `test: verifica la CSP con un componente React Aria` |
| 4    | ADR-0012, PERFORMANCE_SEO, ARCHITECTURE                                                                                                                                                                                                                                                                                           | `docs: aggiunge l'ADR-0012 su React Aria e la CSP`                                                        |
| 5    | Campo minato: copia byte per byte in `src/assets/icons/`, `npm run icons` (`iconData.ts`), ASSETS.md (nuovi SHA-256, nota "sostituita il 14/10/2026: erba e fiori richiamavano un gioco Microsoft", vecchi hash tra i dismessi); PLAN.md spuntato. La cartella `gdm95-updates/` si committa come riferimento (decisione 4 in B.6) | `docs: aggiunge gli aggiornamenti del pacchetto GDM 95` · `feat: sostituisce le icone di Campo minato`    |
| 6    | Screenshot delle story di Icon nel container, con la skill `update-visual-snapshots` dopo verifica visiva                                                                                                                                                                                                                         | `test: aggiorna gli screenshot delle icone di Campo minato`                                               |
| 7    | size-limit dei componenti (§3.1) con Icon e Glyph come base                                                                                                                                                                                                                                                                       | `chore: misura il peso dei componenti con size-limit`                                                     |
| 8–25 | I 18 componenti (§4), uno per commit, con skill `win95-component`, `i18n-strings` e `write-tests`. Nel corpo del commit: `Peso: +x,x kB gzip (totale y,y kB; home invariata)`                                                                                                                                                     | `feat: aggiunge il componente <Nome>`                                                                     |
| 26   | DESIGN_SYSTEM §6 aggiornato man mano; QA_CHECKLIST con la nuova sezione "Componenti in Storybook su Android" (§3.2)                                                                                                                                                                                                               | `docs: aggiunge la QA dei componenti su Android`                                                          |
| 27   | Chiusura con `close-phase` (§3.3)                                                                                                                                                                                                                                                                                                 | `docs: chiude la fase 1B`                                                                                 |

#### B.3.1 Peso dei componenti

- `.size-limit.js`: nuove voci con `@size-limit/esbuild`, `ignore: ["react", "react-dom", "react/jsx-runtime"]`, `modifyEsbuildConfig` che aggiunge `optimizeLocales.esbuild({ locales: ["it-IT", "en-US"] })` e minificazione come Vite. Import per sottopercorso già imposto da Oxlint.
- Voci (JS gzip; il CSS dei moduli in una voce a parte):
  - **Totale componenti**: `import { … tutti … } from "src/components"`;
  - **Gruppo F2A, guscio del desktop**: `{ Window, Taskbar, TaskbarButton, StartButton, DesktopIcons }`, cioè il peso che entrerà nella home;
  - **singolo componente**, uno per voce, per l'analisi.
- Dopo ogni componente: riga nella tabella "Peso dei componenti" di PERFORMANCE_SEO.md (componente, peso isolato, incremento sul totale, totale, gruppo F2A) e nel messaggio di commit.
- **Arresto**: se un componente aggiunge più di 10 kB gzip al totale, il lavoro si ferma e il proprietario riceve il treemap (esbuild metafile) con cosa pesa. Candidati probabili: il primo componente con overlay (Tooltip: posizionamento), Select (ListBox, collezioni, Popover), MenuBar (Menu e sottomenu), DesktopIcon (GridList).
- Budget finale: il totale e il gruppo F2A misurati a fine fase, arrotondati per eccesso al kB; da lì non si alzano senza ADR.
- **Home**: `JS iniziale della home` deve restare 112,25 kB a ogni commit (i componenti non sono importati dalle route della home in 1B).

#### B.3.2 QA_CHECKLIST, nuova sezione (Android con `npm run build && npm run preview -- --host`, `/storybook/`)

- [ ] Button: tocco, stato premuto visibile, nessun doppio tocco per lo zoom
- [ ] MenuBar e StartButton: il tocco apre il menu, la voce si sceglie, un tocco fuori chiude
- [ ] Select: la lista si apre sopra la tastiera virtuale e si sceglie al tocco
- [ ] Tabs: cambio scheda al tocco, a capo a 320 px
- [ ] Window: pulsanti della barra del titolo da 44 px, nessuno scroll orizzontale
- [ ] DesktopIcon: un tocco apre (`onAction` nel pannello Actions)
- [ ] AlertDialog: si apre, il focus va sul pulsante primario, Chiudi funziona
- [ ] Checkbox, Radio, TextField: l'area di tocco comprende l'etichetta; nessuno zoom al focus (font ≥ 16 px)
- [ ] Ogni punto anche con tema alto contrasto e input touch dalla toolbar

#### B.3.3 Chiusura (`close-phase`)

`lint`, `typecheck`, `test:coverage` ≥ 80%, `build`, `test:prerender`, `size`, `test:e2e` nel container, `lhci:mobile` e `lhci:desktop` a 100 su `/` e `/en/`; i quattro agenti (code-reviewer, security-auditor, a11y-auditor, content-reviewer); QA con Claude in Chrome su `/storybook/` (tutte le story, temi, input, tastiera, console e rete) e sulla 404; retrospettiva `phase-01b-retro.md`, CHANGELOG, PLAN; CI del branch verde. Merge e tag li esegue il proprietario.

---

### B.4 Componenti

**Comune a tutti.** CSS Module ricavato da quello del pacchetto, ripulito con soli token (Stylelint), stati con `[data-*]`; touch ≥ `--touch-target-min`; testi e nomi accessibili in `ui.<componente>.*` di it/en. Test: ruolo e nome, mouse e tastiera con user-event, attributi `data-*` per stato, `expectNoAxeViolations`, inventario degli attributi `style` (§2.3). Story `Default` e `AllStates` (tag `visual`), con `play` dove serve; screenshot e axe in classico/alto contrasto × mouse/touch (test esistenti in `tests/storybook/`, non si toccano). Il movimento usa solo `transform`/`opacity` con durate dai token, quindi `data-motion="reduce"` e `prefers-reduced-motion` lo azzerano.

| #   | Componente                | React Aria                                                                  | Stati                                                                                 | Test specifici                                                                                                                                                          | Story oltre Default/AllStates                                       |
| --- | ------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Button (anche solo icona) | `Button`                                                                    | normale, hover, premuto, focus, disabilitato, predefinito (anche premuto), solo icona | `onPress` con clic, Invio e Spazio; disabilitato non chiama; icona `aria-hidden`; solo icona richiede `aria-label` (test di tipo); `data-react-aria-pressable` presente | SoloIcona                                                           |
| 2   | TextField                 | `TextField`, `Label`, `Input`, `Text`, `FieldError`                         | normale, focus, non valido, disabilitato, sola lettura                                | `aria-describedby` collega descrizione ed errore; `type="email"` e `isRequired`; font ≥ 16 px in touch (e2e su Storybook); descrizione ed errore in Plex                | EsempioForm (nome, email, messaggio; nessun invio, nessun LinkedIn) |
| 3   | TextArea                  | `TextField`, `TextArea`                                                     | come TextField, più la scrollbar                                                      | `rows` (predefinito 5); resize solo verticale; classe di scorrimento con `composes`                                                                                     | —                                                                   |
| 4   | Checkbox                  | `Checkbox`                                                                  | selezionata, indeterminata, hover, premuta, focus, disabilitata, non valida           | clic sull'etichetta, Spazio, `aria-checked="mixed"`; inventario: `style` di VisuallyHidden atteso                                                                       | —                                                                   |
| 5   | Radio                     | `RadioGroup`, `Radio`                                                       | come Checkbox; verticale e orizzontale                                                | le frecce spostano la selezione; Tab entra ed esce dal gruppo                                                                                                           | Orizzontale                                                         |
| 6   | GroupBox                  | `fieldset`/`legend` nativi                                                  | normale, alto contrasto                                                               | ruolo `group` con nome dalla legenda                                                                                                                                    | —                                                                   |
| 7   | ProgressBar               | `ProgressBar`, `Label`                                                      | determinata, indeterminata, movimento ridotto                                         | `aria-valuenow`, `valueLabel` con unità; con `data-motion="reduce"` nessuna animazione e testo "In corso…"                                                              | Indeterminata                                                       |
| 8   | StatusBar                 | contenitore `role="group"`                                                  | campi, `grow`, testo troncato                                                         | nome del gruppo; nessun `aria-live` implicito                                                                                                                           | —                                                                   |
| 9   | ScrollArea                | `div role="region" tabIndex=0`, frecce con `Button`                         | desktop con frecce, touch, focus                                                      | regione con nome; le frecce della tastiera scorrono (e2e su Storybook); `g95-scroll` sostituita da `composes`                                                           | —                                                                   |
| 10  | Tooltip                   | `TooltipTrigger`, `Tooltip`                                                 | hover dopo 600 ms, focus, Esc                                                         | compare al focus, Esc chiude; nessuna informazione disponibile solo nel tooltip (documentato)                                                                           | Aperto (`defaultOpen`) per lo screenshot                            |
| 11  | Tabs                      | `Tabs`, `TabList`, `Tab`, `TabPanel`                                        | normale, hover, selezionata, focus, disabilitata, a capo a 320 px                     | le frecce cambiano scheda, `aria-selected`, pannello collegato                                                                                                          | Stretta (320 px)                                                    |
| 12  | Select                    | `Select`, `Button`, `SelectValue`, `Popover`, `ListBox`, `ListBoxItem`      | campo e opzioni in tutti gli stati                                                    | apertura con Invio e frecce, scelta, Esc; lista larga `--trigger-width`; HiddenSelect nell'inventario                                                                   | Aperta                                                              |
| 13  | MenuBar                   | `Toolbar`, `MenuTrigger`, `Menu`, `MenuItem`, `Separator`, `SubmenuTrigger` | pulsante e voce in tutti gli stati, spunta, sottomenu                                 | frecce tra i menu; Invio o freccia giù apre; Esc chiude e restituisce il focus; `selectionMode`; selettori `svg` e `[role=menuitem]` sostituiti da classi               | Aperto, ConSottomenu                                                |
| 14  | Window                    | `section` + `aria-labelledby`; `Button` per i comandi                       | attiva, inattiva, ingrandita, documento (Plex), solo Chiudi                           | nome dalla barra del titolo; nomi i18n dei pulsanti; callback; pulsanti 24×24 con mouse e 44×44 in touch (e2e su Storybook). Niente trascinamento (F2A)                 | Documento, SoloChiudi, ConMenuEStatusBar                            |
| 15  | TaskbarButton + Taskbar   | `ToggleButton`; `Toolbar`                                                   | normale, hover, premuto, attivo retinato, focus, troncato                             | `aria-pressed`; frecce nella Toolbar; safe-area; `Taskbar` dentro `TaskbarButton/`                                                                                      | Taskbar                                                             |
| 16  | StartButton               | `MenuTrigger`, `Button`, `Popover`, `Menu`                                  | chiuso, hover, aperto, focus                                                          | `aria-expanded`; fascia `aria-hidden` con l'handle da `site.ts`; monogramma GDM                                                                                         | Aperto                                                              |
| 17  | DesktopIcon               | `GridList`, `GridListItem`                                                  | normale, hover, selezionata, focus, due righe                                         | frecce nella griglia; Invio e doppio clic chiamano `onAction`; in touch un tocco apre (e2e su Storybook); export `DesktopIcons` dalla cartella `DesktopIcon/`           | DueRighe                                                            |
| 18  | AlertDialog               | `ModalOverlay`, `Modal`, `Dialog role="alertdialog"`                        | avviso, errore, info; uno o due pulsanti                                              | focus sul primario, intrappolato e restituito; Esc = secondario; clic fuori non chiude; icona con nome accessibile; messaggio in Plex                                   | Errore, Info, UnPulsante                                            |

**Complessità**: se MenuBar, Window o DesktopIcon si rivelano più complessi del previsto (sottomenu e Toolbar insieme, ruolo della finestra, GridList in touch con un tocco che apre), il lavoro si ferma e si segnala al proprietario prima di semplificare.

---

### B.5 Dipendenze nuove

| Pacchetto                             | Versione                                                     | Tipo    |
| ------------------------------------- | ------------------------------------------------------------ | ------- |
| `react-aria-components`               | ^1.22.1 (porta `react-aria` 3.53.1 e `react-stately` 3.51.0) | runtime |
| `@react-aria/optimize-locales-plugin` | ^2.1.0                                                       | dev     |
| `@size-limit/esbuild`                 | ^14.2.0                                                      | dev     |

Dopo l'installazione: `npm audit --omit=dev` a 0 e licenze (Apache-2.0 per React Aria) annotate nella review di sicurezza.

---

### B.6 Rischi e decisioni

**Rischi**

1. **Sentinella su un id interno**: se React Aria lo cambia, l'iniezione riprende. Coperto dal test di deriva (unit) e dall'e2e (violazione in console).
2. **Tipo C in F2A**: sulla home, checkbox, select, dialog e posizioni delle finestre produrranno attributi `style` bloccati. La guardia prerender lo fa emergere subito; la soluzione va decisa con un ADR in F2A.
3. **Peso**: un componente con overlay o collezioni potrebbe superare +10 kB. È previsto l'arresto con analisi.
4. **Screenshot**: 18 componenti × 4 combinazioni aumentano molto le baseline e il tempo della CI (stima +2-4 minuti).
5. **Testi in Pixel Operator a 320 px**: troncamenti nella Taskbar e nelle Tabs da verificare a ogni componente.
6. **Claude in Chrome**: in 1A gli screenshot andavano in timeout; se si ripete, la QA visiva usa Playwright e le baseline del container, come in 1A.

**Decisioni del proprietario (14/10/2026)**

1. Sentinella con la regola in `global.css`, CSP invariata.
2. **Disabilitato in alto contrasto**: bordo **punteggiato (`dotted`) di 1 px**, per non confonderlo con il focus a doppio anello (`dashed` di 2 px). Nuovi token se servono (D6). Una story `AllStates` affianca un controllo disabilitato e uno con focus: negli screenshot in alto contrasto i due devono essere distinguibili. Documentato in DESIGN_SYSTEM.md §9. Si applica dal Button (passo 8) a tutti i controlli che hanno lo stato disabilitato.
3. **Tooltip** solo al focus e all'hover; nessun contenuto disponibile solo nel tooltip. Regola scritta nel README del componente (`src/components/Tooltip/` o DESIGN_SYSTEM §6) e nella skill `win95-component` (commit del Tooltip).
4. `docs/design/gdm95-updates/` si committa come riferimento accanto al pacchetto (passo 5).
