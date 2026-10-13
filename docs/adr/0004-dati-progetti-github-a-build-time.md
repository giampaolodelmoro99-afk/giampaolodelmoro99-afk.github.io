# ADR-0004: Dati dei progetti GitHub scaricati a build time

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0 (implementazione in Fase 3A)

## Contesto

La finestra Progetti mostra i repository GitHub con stelle, linguaggi e ultimo aggiornamento. Chiamare l'API GitHub dal browser violerebbe LEGAL.md (richiesta a terze parti al caricamento), sarebbe soggetto a rate limit per IP, aggiungerebbe JS e stati di caricamento e renderebbe il contenuto invisibile ai crawler.

## Decisione

- **Elenco curato** in un file tipizzato (`src/content/projects.ts`) secondo il template di CONTENT.md §6: repo, slug, testi IT/EN, stack, contesto, ruolo, demo, immagini, in evidenza, case study.
- **Script di build** (`scripts/fetch-github.mjs`) che, prima di `react-router build`, scarica dall'API GitHub REST i metadati dei repo elencati (stelle, linguaggi con percentuali, `pushed_at`, licenza, topic) e li salva in `src/content/github.generated.json`.
- In CI usa `GITHUB_TOKEN` per un limite di richieste più alto.
- Se l'API non risponde, la build usa l'ultimo JSON committato e stampa un avviso. Se manca un repo elencato, la build fallisce.
- **Il browser del visitatore non chiama mai l'API di GitHub.** I dati sono nell'HTML prerenderizzato e nel JSON-LD `SoftwareSourceCode`.
- La data dei dati è mostrata con etichetta ("Dati aggiornati al …").

## Alternative considerate

| Alternativa          | Perché scartata                                                       |
| -------------------- | --------------------------------------------------------------------- |
| Chiamata dal browser | Terze parti al caricamento, rate limit, contenuto non prerenderizzato |
| Dati scritti a mano  | Si disallineano subito (stelle, linguaggi)                            |
| GraphQL API          | Richiede sempre un token; la REST basta                               |

## Conseguenze

- I dati si aggiornano a ogni build. Un deploy periodico non è previsto (si aggiornano alla release o a richiesta).
- Lo script ha unit test sulle funzioni pure (trasformazione della risposta) con risposte registrate, senza chiamate reali in CI.

## Riferimenti

ARCHITECTURE.md §8, CONTENT.md §6, skill `add-project`.
