# Fase 1 — Design system GDM 95: piano

La Fase 1 è divisa in due sotto-fasi:

- **1A — Fondamenta** (`phase/01a-foundation-ds`, tag `phase-01a`): piano approvato il 13/10/2026, §1–§10.
- **1B — Componenti** (`phase/01b-components`, tag `phase-01b`): bozza in appendice B, **da riconfermare in plan mode all'inizio della sotto-fase**.

Branch, merge e tag li esegue il proprietario. La 1B parte da `main` dopo il merge della 1A.

## Contesto

La Fase 0 ha lasciato token minimi, font di sistema, focus di 1 px e nessun componente. Il design system "GDM 95" è stato approvato in Claude Design e il pacchetto è in `docs/design/gdm95/`, non ancora committato. La 1A porta in `src/` token, temi, font, icone, Icon e Glyph, e Storybook pubblicato con i test visivi. Chiude anche le 5 note rimaste dalla Fase 0. I 18 componenti restanti sono la 1B.

## Decisioni prese (D1–D6)

|     | Decisione                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | La fase si divide in 1A e 1B, con due branch e due tag. PLAN.md viene diviso di conseguenza. `docs/phases/phase-01-plan.md` contiene l'intero piano: la 1A più la bozza della 1B, segnata "da riconfermare in plan mode". |
| D2  | Pixel Operator si prende dal pacchetto DaFont. In ASSETS.md registro: notabug.org 404 dal 13/10/2026, SHA-256 dello zip, testo di `LICENSE.txt` (CC0 1.0) e intestazione DaFont incoerente ("Public domain / GPL / OFL"). |
| D3  | Il monogramma GDM diventa subito la favicon. Le PNG si fanno in F5 con le immagini Open Graph.                                                                                                                            |
| D4  | Autore delle icone: "Claude (Claude Design) per Gianpaolo Del Moro".                                                                                                                                                      |
| D5  | Lo slider è rimandato alla F4A. Il pulsante con sola icona diventa una variante di Button (1B).                                                                                                                           |
| D6  | Per i valori letterali del CSS si creano token, senza eccezioni Stylelint.                                                                                                                                                |

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
| 17  | **Chiusura** con `close-phase`: tre review, QA in Chrome, QA su Android reale, retrospettiva, CHANGELOG, CI del branch verde                                                                                                                                                                                                                                                                                                          | `docs: chiude la fase 1A`                                                                                                       |

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
  - [ ] nessuno scroll orizzontale, in verticale e in orizzontale
  - [ ] Storybook navigabile al touch: barra laterale, toolbar dei comandi, cambio tema e input
- **Chiusura**: CI del branch verde su GitHub, review di code-reviewer, security-auditor e a11y-auditor, retrospettiva e CHANGELOG.
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

## Appendice B: bozza della Fase 1B (da riconfermare in plan mode)

**Ordine**: Button (con la variante a sola icona) → TextField → TextArea → Checkbox → Radio → GroupBox → ProgressBar → StatusBar → ScrollArea → Tooltip → Tabs → Select → MenuBar → Window → TaskbarButton + Taskbar → StartButton → DesktopIcon → AlertDialog. Ogni componente ha un commit con test, story e screenshot, e i testi in `ui.*` di it/en.

| Componente              | React Aria Components                                                       | Stati                                                                                 |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Button                  | `Button`                                                                    | normale, hover, premuto, focus, disabilitato, predefinito (anche premuto), solo icona |
| TextField               | `TextField`, `Label`, `Input`, `Text`, `FieldError`                         | normale, focus, non valido, disabilitato, sola lettura                                |
| TextArea                | `TextField`, `TextArea`…                                                    | come TextField, più la scrollbar                                                      |
| Checkbox                | `Checkbox`                                                                  | selezionata, indeterminata, hover, premuta, focus, disabilitata, non valida           |
| Radio                   | `RadioGroup`, `Radio`                                                       | come Checkbox, verticale e orizzontale                                                |
| GroupBox                | `fieldset`/`legend` nativi                                                  | normale, alto contrasto                                                               |
| ProgressBar             | `ProgressBar`, `Label`                                                      | determinata, indeterminata, movimento ridotto                                         |
| StatusBar               | contenitore `role="group"`                                                  | campi, `grow`, testo troncato                                                         |
| ScrollArea              | `div role="region" tabIndex=0`                                              | desktop con frecce, touch, focus                                                      |
| Tooltip                 | `TooltipTrigger`, `Tooltip`                                                 | hover dopo 600 ms, focus, Esc                                                         |
| Tabs                    | `Tabs`, `TabList`, `Tab`, `TabPanel`                                        | normale, hover, selezionata, focus, disabilitata, a capo a 320 px                     |
| Select                  | `Select`, `Button`, `SelectValue`, `Popover`, `ListBox`, `ListBoxItem`      | campo e opzioni: tutti gli stati                                                      |
| MenuBar                 | `Toolbar`, `MenuTrigger`, `Menu`, `MenuItem`, `Separator`, `SubmenuTrigger` | pulsante e voce: tutti gli stati, spunta, sottomenu                                   |
| Window                  | `section` + `aria-labelledby`; `Button` per i comandi                       | attiva, inattiva, ingrandita, documento, solo Chiudi                                  |
| TaskbarButton + Taskbar | `ToggleButton`; `Toolbar`                                                   | normale, hover, premuto, attivo retinato, focus, troncato                             |
| StartButton             | `MenuTrigger`, `Button`, `Popover`, `Menu`                                  | chiuso, hover, aperto, focus                                                          |
| DesktopIcon             | `GridList`, `GridListItem`                                                  | normale, hover, selezionata, focus, due righe                                         |
| AlertDialog             | `ModalOverlay`, `Modal`, `Dialog role="alertdialog"`                        | avviso, errore, info; uno o due pulsanti                                              |

**Da sistemare in 1B**:

- `Taskbar` dentro TaskbarButton.
- Export `DesktopIcons` dalla cartella `DesktopIcon/`.
- `composes` al posto di `g95-scroll`.
- Selettori `svg` e `[role=menuitem]` sostituiti da classi.
- Verifica dei troncamenti con Pixel Operator a 320 px.
- Peso delle icone (circa 11 kB gzip) da misurare quando entrano nella home in F2A.

### Test previsti per componente (bozza)

Test comuni a tutti: ruolo e nome accessibile, interazione mouse e tastiera con user-event, attributi `data-*` per ogni stato, `expectNoAxeViolations`. Story comuni: `Default` e `AllStates` (tag `visual`), con `play` dove serve. Screenshot e axe reale in tema classico e alto contrasto, desktop e touch (§5.4).

| Componente              | Test specifici                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Button                  | `onPress` con clic, Invio e Spazio; disabilitato non chiama; icona `aria-hidden`; solo icona richiede `aria-label` (tipo)   |
| TextField               | `aria-describedby` collega descrizione ed errore; validazione `type="email"` e `isRequired`; font 16 px in touch            |
| TextArea                | `rows`, resize solo verticale, classe di scorrimento applicata                                                              |
| Checkbox                | clic sull'etichetta, Spazio, `aria-checked="mixed"`                                                                         |
| Radio                   | le frecce spostano la selezione, Tab entra ed esce dal gruppo                                                               |
| GroupBox                | ruolo `group` con nome dalla legenda                                                                                        |
| ProgressBar             | `aria-valuenow`, `valueLabel`; con `data-motion="reduce"` nessuna animazione e testo "In corso…"                            |
| StatusBar               | nome del gruppo; nessun `aria-live` implicito                                                                               |
| ScrollArea              | regione con nome; frecce della tastiera scorrono (e2e)                                                                      |
| Tooltip                 | compare al focus, Esc chiude                                                                                                |
| Tabs                    | frecce cambiano scheda, `aria-selected`, pannello collegato                                                                 |
| Select                  | apertura con Invio e frecce, scelta, Esc, lista larga `--trigger-width`                                                     |
| MenuBar                 | frecce tra i menu, Invio o freccia giù apre, Esc chiude e restituisce il focus, `selectionMode`                             |
| Window                  | nome dalla barra del titolo, nomi accessibili dei pulsanti (i18n), callback; pulsanti 24×24 desktop e 44×44 touch (e2e)     |
| TaskbarButton + Taskbar | `aria-pressed`, frecce nella Toolbar, safe-area                                                                             |
| StartButton             | `aria-expanded`, fascia `aria-hidden`, monogramma GDM                                                                       |
| DesktopIcon             | frecce nella griglia, Invio e doppio clic chiamano `onAction`; in touch un tocco apre (e2e)                                 |
| AlertDialog             | focus sul pulsante primario, intrappolato e restituito, Esc = secondario, clic fuori non chiude, icona con nome accessibile |

I componenti senza React Aria (GroupBox, StatusBar, ScrollArea, cornice di Window) non sono cliccabili: tutto ciò che si preme dentro di loro è React Aria.
