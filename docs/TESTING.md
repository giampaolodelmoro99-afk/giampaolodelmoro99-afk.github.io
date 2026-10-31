# Test

## 1. Strategia

| Livello              | Strumento                                                        | Cosa garantisce                                                                                       |
| -------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Statico              | TypeScript strict, Oxlint (type-aware), Stylelint, Prettier      | Tipi, regole React/hooks/a11y, token obbligatori, test non disattivati                                |
| Unit e componenti    | Vitest + React Testing Library + user-event + vitest-axe (jsdom) | Logica, rendering, interazione, accessibilità strutturale                                             |
| HTML prerenderizzato | Vitest (node) + jsdom sul build                                  | Contenuto, metadati, JSON-LD, CSP leggibili senza JS                                                  |
| End-to-end           | Playwright + @axe-core/playwright                                | Navigazione reale, viewport, touch, tastiera, console pulita, nessuna terza parte, regressione visiva |
| Budget               | size-limit, Lighthouse CI                                        | Peso del JS e del CSS iniziali, Lighthouse e Web Vitals (ADR-0018)                                    |

## 2. Strumenti e versioni

Vitest 5, @vitest/coverage-v8, jsdom 30, Testing Library (react 16, user-event 14, jest-dom 7), vitest-axe 0.1 (axe-core 4.14), Playwright 1.64, @axe-core/playwright 4.13, @lhci/cli 0.15, size-limit 14. Versioni esatte in `package-lock.json`.

L'immagine Docker `mcr.microsoft.com/playwright:v1.64.0-noble` deve avere **la stessa versione** di `@playwright/test`. Quando Dependabot aggiorna Playwright, si aggiorna il tag dell'immagine in `ci.yml` e negli script `test:e2e*` di `package.json`, poi si rigenerano gli screenshot.

## 3. Soglie

| Controllo       | Soglia                                                                                                                                                                                        | Dove                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Coverage        | ≥ 80% su righe, rami, funzioni e statement                                                                                                                                                    | `vitest.config.ts`    |
| Lighthouse      | Accessibility, Best Practices, SEO 100; Performance ≥ 90 a ogni push; a fine fase e release desktop 100 e mobile ≥ 90; LCP ≤ 2,5 s, TBT ≤ 200 ms, CLS ≤ 0,1; 3 esecuzioni, mediana (ADR-0018) | `lighthouserc.*.json` |
| JS iniziale     | ≤ 124 kB gzip (F2A: 117,8 kB con il guscio statico del desktop, ADR-0014); chunk del desktop ≤ 59 kB, sprite delle icone ≤ 14 kB                                                              | `.size-limit.js`      |
| Componenti      | JS ≤ 99 kB, CSS ≤ 5 kB, guscio del desktop F2A ≤ 75 kB (gzip, fuori dalla home; F1B)                                                                                                          | `.size-limit.js`      |
| CSS iniziale    | ≤ 12 kB gzip                                                                                                                                                                                  | `.size-limit.js`      |
| Font in preload | ≤ 25 kB (woff2)                                                                                                                                                                               | `.size-limit.js`      |
| Idratazione     | ≤ 1 s dopo `load`, long task < 200 ms (CPU 4×): budget bloccanti, misura F1A ≈ 260 ms e 60 ms                                                                                                 | `performance.spec.ts` |
| axe             | 0 violazioni WCAG 2.2 AA                                                                                                                                                                      | unit ed e2e           |
| Console         | 0 errori e warning                                                                                                                                                                            | fixture e2e           |
| Terze parti     | 0 richieste verso altre origini                                                                                                                                                               | fixture e2e           |

**Le soglie non si abbassano.** Un'eccezione richiede un ADR.

## 4. Viewport e progetti Playwright

| Progetto          | Viewport / dispositivo             | Esclude                                                                                                                                                                                                      |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `chromium-320`    | 320×640                            | `touch.spec.ts`                                                                                                                                                                                              |
| `chromium-375`    | 375×667                            | `touch.spec.ts`                                                                                                                                                                                              |
| `chromium-768`    | 768×1024                           | `touch.spec.ts`                                                                                                                                                                                              |
| `chromium-1024`   | 1024×768                           | `touch.spec.ts`                                                                                                                                                                                              |
| `chromium-1440`   | 1440×900                           | `touch.spec.ts`                                                                                                                                                                                              |
| `touch-pixel-7`   | Pixel 7 (Chromium, touch)          | `visual`, `keyboard`                                                                                                                                                                                         |
| `touch-iphone-14` | iPhone 14 (WebKit, touch)          | `visual`, `keyboard`                                                                                                                                                                                         |
| `firefox-1440`    | Firefox 1440×900                   | `visual`, `touch`                                                                                                                                                                                            |
| `performance`     | Pixel 7 (Chromium, CPU 4× via CDP) | esegue solo `performance.spec.ts` (tag `@performance`), **da solo con un worker**: job dedicato in CI, dopo il resto in `npm run test:e2e`; con altri test in parallelo la CPU contesa falsa long task e INP |
| `storybook`       | Chromium 1024×768                  | esegue solo `tests/storybook/`                                                                                                                                                                               |

Il progetto `storybook` avvia Chromium senza `--hide-scrollbars` (l'opzione predefinita di Playwright in headless nasconde le barre), così screenshot e test vedono la barra di scorrimento GDM 95. Apre le story da `build/client/storybook/` (`iframe.html?id=…&globals=…`): screenshot delle story con tag `visual` in due combinazioni, classico con il mouse e alto contrasto con il touch (ADR-0019); axe con contrasto su tutte le story in tutte e quattro le combinazioni (tema × input); in touch ogni controllo deve misurare almeno 44×44 px. Prima di misurare si aspetta la fine delle animazioni non infinite (per esempio l'apertura dei menu). Se l'elemento o un suo antenato è nascosto con lo schema di `VisuallyHidden` (`clip: rect(0 0 0 0)` o `clip-path: inset(50%)`; una `clip-path` decorativa non conta) (gli input di React Aria stanno in uno `<span>` `VisuallyHidden`), si misura l'etichetta che lo contiene, cioè l'area da toccare; se è nascosta anche l'etichetta (il `HiddenSelect` di React Aria per i form), l'elemento non è un bersaglio e non si misura. Gli elementi con `display: contents` (le celle di GridList) non hanno un riquadro proprio: il bersaglio è la riga che li contiene (`role=row`), misurata a sua volta. L'addon a11y di Storybook è in modalità manuale nei test, per non eseguire axe due volte.

**In locale, durante il lavoro**, gli e2e girano solo su Chromium: `npm run test:e2e:chromium` (1440, 375 e Pixel 7, nel container). La matrice completa gira in CI a ogni push e nella verifica di fine fase (`npm run test:e2e`, ADR-0019).

I test specifici di un tipo di input stanno in file dedicati (`keyboard.spec.ts`, `touch.spec.ts`), assegnati ai progetti dalla configurazione. Mai `test.skip` condizionali.

## 5. Cosa testare per tipo di file

| Tipo                            | Test obbligatori                                                                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Componente del design system    | Render con ruolo e nome accessibile; interazione con user-event (mouse e tastiera); stati (`data-*`); axe; story con le varianti                         |
| Feature / app                   | Come sopra + i18n (IT ed EN); deep link e2e; contenuto nel test prerender; screenshot sui viewport                                                       |
| Hook                            | Comportamento con `renderHook`, casi limite, cleanup                                                                                                     |
| Store Zustand                   | Azioni e selettori come funzioni pure; sincronizzazione con l'URL in e2e                                                                                 |
| Util / lib                      | Unit con casi limite ed errori                                                                                                                           |
| Modulo route (`src/app/routes`) | `meta` e render in un documento (`createRoutesStub` + `renderToString`)                                                                                  |
| Script di build                 | Funzioni pure in `scripts/lib` con unit test; effetto sul build nel test prerender                                                                       |
| Asset (font, icone, immagini)   | Riga in ASSETS.md con SHA-256 (`scripts/lib/assets.test.mjs`); glifi dei font (`fonts.test.mjs`); dati delle icone allineati agli SVG (`icons.test.mjs`) |
| Token e Stylelint               | `src/styles/tokens.test.ts` (pacchetto GDM 95 incluso con gli stessi valori, ogni `var()` definita) e `stylelint.test.ts`                                |
| Workflow della CI               | `scripts/lib/workflows.test.mjs`: filtro dei tag del deploy e runner con versione esplicita                                                              |
| CSS                             | Stylelint; effetto visivo con screenshot; target touch e overflow in e2e                                                                                 |

Le query si fanno per ruolo e nome (`getByRole`), non per classe o test id, salvo eccezioni motivate.

## 6. Regressione visiva

- **Solo gli stati principali e due combinazioni** (ADR-0019): il tag `visual` va sugli stati che portano una decisione di design (stati, default, aperto, focus quando è una deroga), non su ogni hover o pressione; le story si fotografano in classico con il mouse e in alto contrasto con il touch. Le altre story restano per la documentazione e per axe.

- `tests/e2e/visual.spec.ts` (pagine) e `tests/storybook/components.visual.spec.ts` (story), tag `@visual`, solo sui progetti Chromium.
- Baseline in `tests/e2e/__screenshots__/<progetto>/` e `tests/storybook/__screenshots__/storybook/`.
- **Si generano solo nel container** (`npm run test:e2e:update-snapshots`): il rendering dei font dell'host differisce da quello della CI.
- Si aggiornano solo per un cambio visivo voluto, verificato nel browser, con commit dedicato (skill `update-visual-snapshots`).
- **Stati nelle story (dalla Fase 1B).** Hover, pressione e focus da tastiera non si forzano con le prop di React Aria: le story li creano nella funzione `play` con gli aiuti di `.storybook/interactions.ts` (`hover`, `press`, `focusWithKeyboard`). Gli aiuti aspettano un layout stabile, perché il mouse reale di Playwright resta in (0, 0) e, quando sparisce l'overlay di caricamento di Storybook, Chrome invia un `pointerover` reale che chiuderebbe hover e pressione. Le story con overlay (tooltip, menu, popover, dialog) usano il decoratore `overlaysInStoryRoot` di `.storybook/decorators.tsx`: React Aria rende l'overlay dentro `#storybook-root`, l'area fotografata. `openStory()` in `tests/storybook/stories.ts` aspetta la fase `finished` del rendering, cioè la fine della `play`, prima di fotografare o eseguire axe.

## 7. Test sull'HTML prerenderizzato

`src/components/prerenderStyles.test.tsx` rende ogni story dei componenti con `renderToString` e confronta gli attributi `style` con l'elenco dei casi noti del tipo C (ADR-0012). Le story si cercano sul disco a ogni esecuzione: con `import.meta.glob` la cache dei moduli di Vitest 5 (`node_modules/.vitest-cache`) non vedeva i file nuovi.

`tests/prerender/html.test.ts` legge `build/client` (serve prima `npm run build`). Per ogni route e lingua verifica:

- `lang`, title, description
- canonical e hreflang (incluso x-default)
- Open Graph, Twitter card
- JSON-LD valido
- contenuto principale senza JS
- CSP come primo meta, con l'hash di ogni script inline e del payload di avvio
- `modulepreload` solo inerti (`media="not all"`)

Verifica anche `404.html` (noindex) e che **nessun file statico contenga l'email in chiaro**.

## 8. Servizi esterni simulati (dalla Fase 3B)

Le chiamate a Web3Forms si intercettano con `page.route`. In CI non partono mai chiamate reali. Casi obbligatori:

- 500
- quota esaurita (risposta reale da verificare in F3)
- rete assente (`route.abort("internetdisconnected")`)
- JSON malformato
- timeout

Per ogni caso si verificano messaggio, canale alternativo, dati conservati e axe, su desktop e a 320 px touch.

## 9. Comandi

```bash
npm run test               # unit (anche nel pre-push)
npm run test:coverage      # unit con soglie
npm run build && npm run test:prerender
npm run test:e2e:chromium  # durante il lavoro: solo Chromium, nel container
npm run test:e2e           # suite completa nel container (come la CI), a fine fase
npm run test:e2e:host      # e2e sull'host senza @visual, per iterare
npm run size
npm run lhci:mobile && npm run lhci:desktop                 # livello commit
npm run lhci:mobile:strict && npm run lhci:desktop:strict   # chiusura di fase e release
```

## 10. Flakiness

- Gli e2e aprono le pagine con `openPage()`, che attende `html[data-hydrated]`. Senza, un clic prima dell'idratazione diventa una navigazione completa.
- Niente `waitForTimeout`: si usano asserzioni con attesa (`toHaveURL`, `toBeVisible`).
- In CI c'è 1 retry. Un test che passa solo al retry va corretto, non ignorato.
