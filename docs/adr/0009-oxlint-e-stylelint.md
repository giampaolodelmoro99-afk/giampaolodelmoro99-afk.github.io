# ADR-0009: Oxlint come linter unico per TypeScript e React, Stylelint per il CSS

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0

## Contesto

La v1 usava Oxlint con due regole React. La v2 richiede regole per React, hooks, accessibilità e TypeScript (anche type-aware), regole contro i test disattivati e contro la navigazione con `window.location`, e un controllo dei valori hardcoded nei CSS.

## Decisione

- **Oxlint 1.x** come unico linter per JS/TS, con i plugin `react` (`rules-of-hooks`, `exhaustive-deps`, `only-export-components`), `jsx-a11y`, `typescript`, `import`, `unicorn`, `oxc`, `vitest`.
- **Type-aware** con `oxlint-tsgolint` (`oxlint --type-aware`): `no-floating-promises`, `no-unsafe-type-assertion` e simili.
- Regole di progetto:
  - `no-restricted-globals` (`location`) e `no-restricted-properties` (`window.location`, `document.location`)
  - `no-inline-comments` sui `.tsx`
  - `vitest/no-disabled-tests`, `no-focused-tests`, `no-commented-out-tests`, `no-conditional-tests`, `expect-expect`, `warn-todo` come errore (valgono anche per i file Playwright)
- **Stylelint** per i CSS: `stylelint-config-standard`, `stylelint-config-css-modules`, `stylelint-declaration-strict-value` (solo token nei CSS Modules), `color-no-hex` fuori da `tokens.css`, niente `!important`.
- Le regole non esprimibili (nessun commento nel React oltre a quelli inline, inline style solo per variabili CSS, niente `div` cliccabili oltre a quanto copre jsx-a11y) le verifica il `code-reviewer` con CODE_REVIEW.md.

## Alternative considerate

| Alternativa                | Perché scartata                                                                                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ESLint + typescript-eslint | `typescript-eslint` 8.71 supporta TypeScript < 6.1 (blocca futuri aggiornamenti); configurazione e manutenzione più pesanti; molto più lento in lint-staged e CI |
| Oxlint + ESLint insieme    | Doppia configurazione e regole duplicate per un guadagno marginale (qualche regola di nicchia)                                                                   |
| Biome                      | Ottimo formatter e linter, ma copertura jsx-a11y e type-aware inferiore a Oxlint al momento della scelta                                                         |

## Conseguenze

- Lint molto veloce, usabile in pre-commit e pre-push.
- Se manca una regola importante, la si aggiunge come check in CODE_REVIEW.md e si rivaluta un affiancamento con ESLint tramite un nuovo ADR.
- `npm audit` segnala una vulnerabilità "high" in `braces` (≤ 3.0.3), dipendenza transitiva di Stylelint tramite `micromatch`: DoS con pattern molto annidati, senza versione corretta disponibile. È solo in sviluppo, con pattern scritti da noi: rischio accettato. La CI controlla `npm audit --omit=dev`, e Dependabot aggiornerà quando esce la correzione.

## Riferimenti

`.oxlintrc.json`, `.stylelintrc.json`, oxc.rs.
