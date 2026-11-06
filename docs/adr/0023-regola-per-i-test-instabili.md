# ADR-0023: Regola per i test instabili

- **Stato**: Accettata
- **Data**: 2026-11-06
- **Fase**: 2B

## Contesto

CLAUDE.md vieta di indebolire i test («Integrità dei test») e TESTING.md §10 diceva che un test che passa solo al retry va corretto, non ignorato. Nella 2B un test instabile (`desktop.spec.ts:46`) ha richiesto ore: da solo non falliva mai in 320 esecuzioni, e la causa (un `ResizeObserver` che aggiornava lo store) è comparsa solo con 24 worker. Un altro caso (la rotazione in mobile) falliva 15 volte su 50 e nascondeva un difetto reale. Serve un criterio che separi i due casi, senza permettere di spegnere i test e senza indagare all'infinito.

## Decisione

Per ogni test instabile:

1. **Si ripete in locale al massimo 50 volte**, nel container e senza retry (`--repeat-each=50 --retries=0`), con la traccia dei fallimenti (`--trace=retain-on-failure`).
2. **Se in 50 ripetizioni non fallisce, o fallisce senza una causa riproducibile**, il caso si annota nella retrospettiva della fase con la traccia disponibile e si va avanti. La CI, con 1 retry, lo segnala come «flaky» senza far fallire il job.
3. **Si indaga oltre solo se**:
   - fallisce più spesso di 1 volta su 50, oppure
   - il difetto è visibile anche a una persona reale (in quel caso si corregge il codice, non il test).
4. **Resta vietato** `skip`, `only`, `todo`, attese fisse (`waitForTimeout`) e asserzioni indebolite per far passare un caso instabile. La regola limita lo sforzo di indagine, non la severità dei test.

Questa non è un'eccezione alle soglie né ai test: nessun test viene disattivato o abbassato.

## Alternative considerate

| Alternativa                                                  | Pro              | Contro                                                   | Perché scartata                                   |
| ------------------------------------------------------------ | ---------------- | -------------------------------------------------------- | ------------------------------------------------- |
| Correggere sempre ogni test instabile (regola precedente)    | Massima severità | Costo senza limite per casi non riproducibili            | Ore spese su un caso su 2800                      |
| Retry in locale e in CI senza limite                         | Nessun lavoro    | Nasconde i difetti reali (la rotazione falliva 15 su 50) | Un retry non distingue un difetto da un caso raro |
| Mettere in quarantena i test instabili (`skip` con scadenza) | CI sempre verde  | Il test non protegge più nulla; vietato da CLAUDE.md     | Indebolisce l'integrità dei test                  |

## Conseguenze

- Positive: un criterio misurabile (1 su 50) per decidere quando fermarsi; i difetti reali emergono con numeri, non per impressione.
- Negative e rischi: un difetto raro (meno di 1 su 50) può restare nascosto; lo mitigano la CI con i retry, che lo segnala come «flaky», e la retrospettiva, che lo elenca.
- Da verificare: a ogni chiusura di fase, la retrospettiva elenca i casi annotati; se lo stesso test compare in due fasi, si indaga anche sotto la soglia.

## Riferimenti

- TESTING.md §10, skill `write-tests`, CLAUDE.md («Integrità dei test»)
- ADR-0019, `docs/phases/phase-02b-retro.md`
