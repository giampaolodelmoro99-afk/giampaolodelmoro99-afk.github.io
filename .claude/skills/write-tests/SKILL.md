---
name: write-tests
description: Indica e scrive i test necessari per un file o una modifica (componente, feature, hook, store, util, modulo route, script di build, CSS), con viewport e strumenti giusti, secondo docs/TESTING.md. Da usare ogni volta che si aggiunge o cambia codice.
---

# Scrivere i test

## Tabella per tipo di file

| Tipo            | Dove                        | Cosa                                                                                               |
| --------------- | --------------------------- | -------------------------------------------------------------------------------------------------- |
| Componente      | `X.test.tsx` accanto        | render per ruolo e nome; `userEvent` per mouse e tastiera; stati `data-*`; `expectNoAxeViolations` |
| Feature / app   | test accanto + `tests/e2e/` | come sopra + IT ed EN; e2e deep link, navigazione senza reload, viewport, touch, `@visual`         |
| Hook            | `useX.test.ts`              | `renderHook`, casi limite, cleanup                                                                 |
| Store Zustand   | `x.store.test.ts`           | azioni pure e selettori; sincronizzazione URL in e2e                                               |
| Util / lib      | `x.test.ts`                 | casi limite ed errori                                                                              |
| Modulo route    | `src/app/routes/*.test.tsx` | `createRoutesStub` + `renderToString` con `Layout`: meta e contenuto                               |
| Script di build | `scripts/lib/x.test.mjs`    | funzioni pure; effetto sul build in `tests/prerender/`                                             |
| CSS             | e2e                         | overflow a 320 px, target ≥ 44 px, screenshot                                                      |

## Regole

- Query per ruolo e nome (`getByRole("button", { name: … })`). Niente selettori per classe.
- In e2e apri le pagine con `openPage(page, path)` da `tests/e2e/fixtures.ts`: attende l'idratazione. Le fixture fanno già fallire il test per errori in console e richieste a terze parti.
- Test per un solo tipo di input in `keyboard.spec.ts` o `touch.spec.ts`. Mai `if` sul progetto, mai `test.skip` o `test.fail` condizionali.
- Niente `waitForTimeout`: usa asserzioni con attesa.
- Servizi esterni sempre simulati con `page.route` (TESTING.md §8).
- Coverage ≥ 80% con test che verificano comportamento, non righe. Niente test senza `expect` (Oxlint `expect-expect`).
- **Vietato**: `skip`, `only`, `todo`, test commentati, soglie abbassate, asserzioni indebolite per far passare un test. Un test che fallisce indica un bug da correggere, oppure un requisito cambiato da discutere.

## Comandi

```bash
npm run test:coverage
npm run build:site && npm run test:prerender:site   # durante il lavoro (build completo se cambiano le story)
npm run test:e2e:chromium                          # durante il lavoro: solo Chromium, nel container
npm run test:e2e                                   # matrice completa: in CI e a fine fase (ADR-0019)
```

## Riferimenti

docs/TESTING.md, tests/setup/, tests/e2e/fixtures.ts.
