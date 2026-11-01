# ADR-0020: Budget del chunk del desktop e del CSS dei componenti nella 2A-2

- **Stato**: Accettata
- **Data**: 2026-10-31
- **Fase**: 2A

## Contesto

Il budget del chunk del desktop (59 kB gzip, ADR-0014) è stato fissato alla fermata della 2A-1, sulla misura di allora (56,08 kB) più il 5%. Allora il chunk conteneva solo icone, finestre, taskbar e Start. La 2A-2 aggiunge il window manager (riduzione, ingrandimento, trascinamento, maniglie, menu della finestra, spostamento da tastiera), le scorciatoie, il selettore delle finestre e il menu contestuale. Il piano della fase stimava il chunk completo in 85–90 kB.

Al commit `37b3706` il chunk misura 72,72 kB: il budget è superato di 13,7 kB e `npm run size` fallisce in CI. Il budget era già superato da alcuni commit della 2A-2 senza che fosse segnalato. Esegui, Spegni e il congedo non pesano sul chunk: stanno in chunk caricati solo all'apertura.

Al passo 26 anche il **totale CSS dei componenti** (`Componenti: totale CSS`, budget di 5 kB fissato alla chiusura della 1B) risulta superato: 5,69 kB, cioè 692 B in più, per i fogli dei componenti nuovi della 2A-2 (DragOutline, ResizeHandles, WindowMenu, MoveControls, WindowSwitcher, TaskbarIconButton, ContextMenu, RunDialog, ShutdownDialog, FarewellScreen). Anche questo superamento non era stato segnalato nei commit precedenti. Una ricerca dei duplicati evidenti, limitata a 20 minuti, ha trovato solo le regole di overlay, modal, dialog e window ripetute da AlertDialog in RunDialog e ShutdownDialog: con `composes` il totale scendeva di 36 B, perché gzip comprime già le ripetizioni. Il cambio avrebbe anche richiesto di mettere AlertDialog nel layer `gdm-base` (DESIGN_SYSTEM.md), quindi non è stato tenuto.

Il chunk arriva dopo l'idratazione, quindi non pesa sul JS iniziale (120,24 kB su 124) né su LCP e FCP. Il rischio vero è la valutazione del chunk sul thread principale: task lunghe e reattività del primo clic.

## Decisione

1. **Fino alla fine della tappa 2A-2** il budget del chunk del desktop è **80 kB** gzip, in `.size-limit.js`. È un tetto provvisorio, non la misura più il 5%.
2. **A fine tappa** il budget diventa la misura reale più il 5%, arrotondata per eccesso al kB, a una condizione: il job «E2E prestazioni» (`tests/e2e/performance.spec.ts`, CPU 4×) resta verde, cioè
   - la task più lunga tra idratazione e swap resta sotto i 200 ms;
   - l'INP del primo clic su un'icona resta entro i 200 ms.
3. **Se una delle due supera i 200 ms**, le soglie non si alzano: il chunk si divide. Il window manager e i menu restano nel chunk del desktop; selettore e menu contestuale passano in un chunk caricato nel tempo libero (`requestIdleCallback`) o alla prima apertura.
4. **Totale CSS dei componenti**: tetto provvisorio di **7 kB** gzip fino alla fine della 2A-2; a fine tappa diventa la misura reale più il 5%, arrotondata per eccesso al kB.
5. Da ora `npm run size` si esegue prima di ogni commit; se un budget è superato il lavoro si ferma e decide il proprietario.

Decisioni del proprietario del 31/10/2026.

## Alternative considerate

| Alternativa                                           | Pro                     | Contro                                                                                                               | Perché scartata                                      |
| ----------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Lasciare 59 kB e dividere subito il chunk             | Budget invariato        | Lavoro di struttura prima di sapere se serve; selettore e menu contestuale arriverebbero con un ritardo al primo uso | Si divide solo se le prestazioni lo richiedono       |
| Alzare subito il budget alla misura attuale più il 5% | Budget stretto          | Ogni commit della tappa lo supererebbe di nuovo; animazioni e test devono ancora arrivare                            | Il valore finale si fissa sulla misura di fine tappa |
| Togliere la voce dal size-limit                       | Nessun fallimento in CI | Perde il controllo sulla crescita                                                                                    | Contro le regole sulle soglie                        |

## Esito alla chiusura della F2A (01/11/2026)

Il job «E2E prestazioni» è verde, con CPU rallentata 4×: task più lunga tra idratazione e swap 102 ms su `/` e 106 ms su `/en/`; INP del primo clic su un'icona 120 ms su `/` e su `/en/`. La condizione del punto 2 è soddisfatta, quindi il chunk non si divide e i budget passano alla misura reale più il 5%, arrotondata per eccesso al kB:

| Voce (gzip)                          | Misura   | Budget                      |
| ------------------------------------ | -------- | --------------------------- |
| Chunk del desktop dopo l'idratazione | 73,14 kB | 77 kB (73,14 × 1,05 = 76,8) |
| Componenti, totale CSS               | 5,69 kB  | 6 kB (5,69 × 1,05 = 5,97)   |
| Chunk di Esegui all'apertura         | 4,67 kB  | 5 kB                        |
| Chunk di Spegni all'apertura         | 7,09 kB  | 8 kB                        |
| Chunk del congedo all'apertura       | 0,51 kB  | 1 kB                        |

I tre chunk aperti su richiesta mancavano in `.size-limit.js` (li chiedeva il piano, §3.1; segnalato dalla code review di chiusura): ora sono misurati seguendo gli import dinamici del chunk del desktop, con la stessa regola. Dopo le correzioni della review il chunk del desktop misura 73,50 kB e il JS iniziale 120,59 kB, dentro i budget.

## Conseguenze

- Positive: la CI della 2A-2 resta verde senza perdere il controllo; il budget finale si basa sul peso reale e su metriche di reattività, non su una stima.
- Negative e rischi: il CSS dei componenti cresce con ogni componente nuovo; a fine tappa va riletto per cercare regole che possano passare ai componenti esistenti.
- Negative e rischi: fino a fine tappa il margine è largo (circa 7 kB sopra la misura attuale); una crescita inattesa si vede solo con `npm run size` a ogni commit.
- Cosa va verificato: a fine tappa, `npm run size` e il job «E2E prestazioni» nella CI del branch. Poi si aggiorna questo ADR con le misure e il budget definitivo (o con la divisione del chunk), insieme a PERFORMANCE_SEO.md e TESTING.md.

## Riferimenti

- ADR-0014 (caricamento separato del desktop), ADR-0018 (soglie Lighthouse), ADR-0019 (verifiche proporzionate)
- `.size-limit.js`, `tests/e2e/performance.spec.ts`
- `docs/PERFORMANCE_SEO.md` §1, `docs/TESTING.md` §3
- `docs/phases/phase-02a-plan.md` §3.1 (stima del chunk) e §8 rischio 2
