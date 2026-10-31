---
name: update-visual-snapshots
description: Aggiorna gli screenshot di riferimento di Playwright solo dopo un cambiamento visivo voluto e verificato nel browser, generandoli nel container Docker della CI. Mai per far passare la CI.
---

# Aggiornare gli screenshot di riferimento

## Precondizioni (tutte)

1. Il cambiamento visivo è **voluto** e fa parte del piano o della richiesta in corso.
2. È stato **verificato nel browser** (`npm run build:site && npm run preview`, QA_CHECKLIST.md) a 320 e 1440 px.
3. Il test visivo fallisce **solo** per quel cambiamento: gli altri test sono verdi.

Se il fallimento è inatteso, **non aggiornare**: è una regressione da correggere.

## Passi

1. `npm run build` (completo: gli screenshot delle story leggono `build/client/storybook/`)
2. `npm run test:e2e:update-snapshots`: gira nel container `mcr.microsoft.com/playwright:<versione>-noble`, perché le baseline generate sull'host differiscono.
3. Le story si fotografano solo negli stati principali e in due combinazioni (classico con il mouse, alto contrasto con il touch, ADR-0019): una baseline che non corrisponde più a una story `visual` o a una combinazione prevista va eliminata.
4. Rivedi **ogni** immagine cambiata in `tests/e2e/__screenshots__/` (`git diff --stat` e apertura dei PNG): devono cambiare solo le aree attese.
5. `npm run test:e2e` per confermare che la suite completa è verde.
6. Commit dedicato, con il motivo:
   `test: aggiorna gli screenshot di riferimento per <cambiamento>`

## Vietato

- Aggiornare gli screenshot per far passare la CI senza capire la differenza.
- Alzare `maxDiffPixelRatio` o togliere progetti o pagine dai test visivi.
- Generare baseline sull'host.

Il code-reviewer segnala come bloccante ogni screenshot cambiato senza motivazione.

## Riferimenti

docs/TESTING.md §6, playwright.config.ts, CONTRIBUTING.md.
