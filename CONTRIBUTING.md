# Contribuire

Il progetto è personale e segue un processo a fasi documentato. Queste regole valgono per chiunque ci lavori, umani e agenti (Claude Code).

## Prerequisiti

- Node.js nella versione di `.nvmrc` (`nvm use`).
- Docker, per la suite e2e completa e per gli screenshot di riferimento (`npm run test:e2e`).
- `npm ci` installa anche gli hook Husky.

## Flusso a fasi

1. Ogni fase parte in **plan mode**. Il piano approvato si salva in `docs/phases/phase-NN-plan.md`.
2. Il proprietario crea il branch `phase/NN-nome` da `main`.
3. Il lavoro procede con commit piccoli e convenzionali (sotto).
4. A fine fase si usa la skill `close-phase`: test, review con gli agenti, QA nel browser, retrospettiva, CHANGELOG e PLAN.
5. **Il proprietario** esegue merge e tag:
   ```bash
   git switch main
   git merge --no-ff phase/NN-nome
   git tag -a phase-NN -m "Fase NN: nome"
   ```
   I tag di fase usano il prefisso `phase-`. **Mai `v*`**: i tag `v*` fanno partire il deploy in produzione e sono riservati alle release.

Branch, merge, tag e push li fa solo il proprietario. Claude Code non li esegue (permessi negati in `.claude/settings.json`).

## Regola di merge

Una fase si chiude **solo se passano tutti i test**: quelli nuovi e quelli di tutte le fasi precedenti. Devono essere verdi:

- in locale: `npm run lint`, `npm run typecheck`, `npm run test:coverage`, `npm run build`, `npm run test:prerender`, `npm run size`, `npm run test:e2e`, `npm run lhci:mobile`, `npm run lhci:desktop`
- nella CI di GitHub, sull'ultimo commit del branch della fase

`close-phase` controlla lo stato dell'ultima CI del branch. Se non è verde, non propone i comandi di merge.

## Vietato aggirare i controlli

Non si fa passare un controllo indebolendolo. Sono vietati:

- `test.skip`, `test.only`, `describe.skip`, `describe.only`, `it.todo` (Oxlint li segnala come errore)
- test commentati, oppure rimossi senza motivazione
- soglie di coverage, Lighthouse o size-limit abbassate
- screenshot di riferimento aggiornati solo per far passare la CI
- `--no-verify` su commit o push

Un'eccezione richiede un ADR che la motivi (skill `new-adr`). Il code-reviewer segnala come bloccante ogni test disattivato, rimosso o indebolito rispetto a `main`.

## Commit convenzionali

Formato `tipo: descrizione in italiano`, all'imperativo presente o alla terza persona, minuscolo. Verificato da commitlint.

| Tipo           | Uso                                           | Esempio                                          |
| -------------- | --------------------------------------------- | ------------------------------------------------ |
| `feat`         | nuova funzionalità                            | `feat: aggiunge la taskbar`                      |
| `fix`          | correzione                                    | `fix: corregge il focus del menu Start`          |
| `test`         | solo test                                     | `test: verifica il drag delle finestre su touch` |
| `docs`         | documentazione                                | `docs: aggiunge l'adr sulla modalità mobile`     |
| `style`        | formattazione, nessun cambio di logica        | `style: riformatta i token`                      |
| `refactor`     | ristrutturazione senza cambi di comportamento | `refactor: estrae il calcolo dello z-index`      |
| `perf`         | prestazioni                                   | `perf: carica Prato fiorito in lazy`             |
| `build` / `ci` | build e workflow                              | `ci: aggiunge lo shard e2e`                      |
| `chore`        | manutenzione                                  | `chore: aggiorna le dipendenze`                  |

## Hook locali

| Hook         | Cosa esegue                                                 |
| ------------ | ----------------------------------------------------------- |
| `pre-commit` | lint-staged: Oxlint, Stylelint e Prettier sui file in stage |
| `commit-msg` | commitlint                                                  |
| `pre-push`   | `npm run lint`, `npm run typecheck`, `npm run test`         |

## Aggiungere un ADR

Copia `docs/adr/TEMPLATE.md` nel numero successivo (`NNNN-titolo-in-kebab.md`), oppure usa la skill `new-adr`. Un ADR sostituito non si cancella: si segna come "Sostituito da ADR-XXXX".

## Aggiornare gli screenshot

Solo per un cambio visivo voluto e verificato nel browser: `npm run test:e2e:update-snapshots` (gira nel container Playwright), poi revisione delle differenze e commit dedicato. Dettagli nella skill `update-visual-snapshots` e in `docs/TESTING.md`.
