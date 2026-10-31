# ADR-0019: Verifiche proporzionate durante la fase

- **Stato**: Accettata
- **Data**: 2026-10-31
- **Fase**: 2A

## Contesto

Fino alla 1B ogni passo ripeteva quasi tutta la verifica: screenshot di ogni story in quattro combinazioni (tema × input, 232 baseline), e2e su dieci progetti in locale, tabella dei pesi aggiornata a ogni componente, quattro agenti di review a ogni chiusura. Nella F2A questo ha fatto crescere molto i tempi, senza trovare difetti in più rispetto a una verifica mirata più la CI completa. Il proprietario ha deciso di alleggerire le regole il 31/10/2026.

## Decisione

1. **Screenshot dei componenti**:
   - solo due combinazioni: classico con il mouse e alto contrasto con il touch (`visualVariants` in `tests/storybook/stories.ts`);
   - solo gli stati principali: il tag `visual` resta su 30 story (stati, default, aperto, focus dove è una decisione di design) più le tre pagine dei token, cioè 66 baseline invece di 232;
   - le baseline in più sono state eliminate.

   axe e la misura dei target touch restano su tutte le story e su tutte e quattro le combinazioni.

2. **e2e in locale**: durante il lavoro solo Chromium (`npm run test:e2e:chromium`: 1440, 375 e Pixel 7). La matrice completa (Chromium a cinque larghezze, Firefox, WebKit, touch, performance, Storybook) gira in CI a ogni push e nella verifica di fine fase (`npm run test:e2e`).
3. **Peso dei componenti**: size-limit resta in CI a ogni push. La tabella "Peso dei componenti" di PERFORMANCE_SEO.md si aggiorna solo a fine fase.
4. **Review di fine fase**:
   - `code-reviewer` e `a11y-auditor` sempre;
   - `security-auditor` solo se cambiano dipendenze, CSP, form o asset;
   - `content-reviewer` solo se cambiano testi.

Restano invariati: test unitari, lint, typecheck, coverage 80%, axe, CSP, divieto di test disattivati, regole legali, Lighthouse in CI (ADR-0018).

## Alternative considerate

| Alternativa                            | Pro                           | Contro                                                               | Perché scartata                                  |
| -------------------------------------- | ----------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| Lasciare tutto com'era                 | Massima copertura locale      | Ore per fase spese in controlli che la CI ripete                     | Il costo supera il valore                        |
| Togliere gli screenshot dei componenti | Nessuna baseline da mantenere | Le deroghe visive (alto contrasto, focus) non sarebbero più protette | Due combinazioni bastano a coprire i due estremi |

## Conseguenze

- Positive: meno tempo per ogni passo; baseline più facili da rivedere.
- Negative: una regressione visiva che compare solo in classico con il touch o in alto contrasto con il mouse non è fotografata. Mitigazioni: axe e target touch su tutte le combinazioni, QA a fine fase.
- Un problema solo di Firefox o WebKit si vede in CI e non durante il lavoro.

## Riferimenti

- `tests/storybook/stories.ts`, `tests/storybook/components.visual.spec.ts`, `package.json` (`test:e2e:chromium`)
- TESTING.md §4 e §6, PERFORMANCE_SEO.md §1, skill `close-phase`, `win95-component`, `write-tests`, `update-visual-snapshots`
- ADR-0018
