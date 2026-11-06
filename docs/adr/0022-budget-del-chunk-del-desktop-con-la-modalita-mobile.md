# ADR-0022: Budget del chunk del desktop con la modalità mobile

- **Stato**: Accettata
- **Data**: 2026-11-06
- **Fase**: 2B

## Contesto

Il budget del chunk del desktop è 77 kB gzip (ADR-0014, ADR-0020: misura della 2A più il 5%). Alla fine della 2B-1 il chunk misurava 75,93 kB. La modalità mobile della 2B-2 (ADR-0007) porta nello stesso chunk il calcolo della modalità, la finestra a schermo intero con la barra del titolo mobile, la home a griglia, il pulsante «App aperte», la rilettura del layout al cambio di modalità e la gestione del focus e della history in mobile. Con questo codice il chunk misura **78,11 kB**: il budget è superato di 1,11 kB.

Il proprietario ha deciso (01/11/2026) l'ordine delle mosse:

1. dividere il codice solo mobile in un chunk caricato solo in modalità mobile;
2. se dopo la divisione il budget è ancora superato, ADR con il budget alla misura reale più il 5%, purché il job delle prestazioni resti verde.

## Decisione

1. **Divisione fatta.** «App aperte» è un chunk su richiesta (`mobile/AppSwitcher`) e, con la sua logica (chiudi una riga, chiudi tutte, annunci), un host (`mobile/OpenApps`) caricato con lui, precaricato nel tempo libero solo in mobile. La divisione vale 0,06 kB sul chunk del desktop: il resto del codice mobile è dentro componenti condivisi.
   - La barra del titolo mobile è la stessa `Window` con altre props.
   - La home a griglia è `DesktopIcons` con altre props e regole CSS.
   - Il pannello di Start è lo stesso menu con regole CSS.
   - Separarli duplicherebbe i componenti, quindi ci sarebbe più codice, non meno.
2. **Budget del chunk del desktop: da 77 a 82 kB** (78,11 × 1,05 = 82,0). Gli altri budget non cambiano.
3. **Condizione verificata**: il job delle prestazioni (`tests/e2e/performance.spec.ts`, Pixel 7, CPU 4×) è verde con il codice misurato.

| Misura                                      | Valore                       | Soglia       |
| ------------------------------------------- | ---------------------------- | ------------ |
| Task più lunga dopo `load`                  | 143 ms                       | 200 ms       |
| Desktop interattivo dopo `load`             | 887 ms su `/`, 927 su `/en/` | 1 s          |
| INP dei tocchi (Chiudi About e prima icona) | 120 ms su `/`, 112 su `/en/` | 200 ms       |
| CLS dal caricamento allo swap               | 0,00003                      | 0,001 (test) |
| JS iniziale della home                      | 120,49 kB                    | 124 kB       |

Trovato e corretto per ottenere la condizione: la regola del padding della finestra mobile in `Desktop.module.css` aveva la stessa specificità di `Window.module.css`, e l'ordine di caricamento dei fogli spostava la barra del titolo di 3 px (CLS 0,004, oltre il 0,001 del test). La regola ora è più specifica (`.workspace > .window`).

## Alternative considerate

| Alternativa                                    | Pro                                    | Contro                                                                                                                                                 | Perché scartata                                                                                                      |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Restare a 77 kB togliendo codice               | Budget invariato                       | Il codice mobile è dentro componenti condivisi; per risparmiare 1,1 kB servirebbe duplicarli o togliere funzioni (memoria del focus, annunci)          | Costo in qualità e a11y senza un guadagno per l'utente                                                               |
| Un chunk separato per l'intera modalità mobile | Il desktop non scarica nulla di mobile | `DesktopApp` e `DesktopWindow` condividono la logica, e due alberi di rendering sono da tenere allineati (stesso rischio del guscio statico, ADR-0014) | Complessità maggiore del risparmio, e il cambio di modalità al volo (ruotare) caricherebbe codice dopo l'interazione |
| Budget con un margine più largo (es. +10%)     | Meno ADR in futuro                     | Un budget largo nasconde le crescite                                                                                                                   | Il proprietario ha chiesto la misura più il 5%                                                                       |

## Conseguenze

- Positive: la modalità mobile entra senza toccare il JS iniziale né le soglie di Lighthouse; i numeri sono nell'ADR.
- Negative e rischi: il chunk del desktop passa a 82 kB; chi usa il desktop scarica anche il codice mobile condiviso (circa 2,2 kB). Il margine residuo è di 3,9 kB per il resto della 2B-2 (rinvii di ADR-0016 e memoria del focus).
- Da verificare: `npm run size` a ogni commit; il job delle prestazioni a fine tappa e in CI. Si rivaluta alla F3A, quando entrano i contenuti delle app.

## Riferimenti

- ADR-0007, ADR-0014, ADR-0020, ADR-0021
- `docs/phases/phase-02b-plan.md` §8
- `.size-limit.js`, `docs/PERFORMANCE_SEO.md` §1, `tests/e2e/performance.spec.ts`
