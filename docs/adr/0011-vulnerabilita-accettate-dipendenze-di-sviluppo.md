# ADR-0011: Vulnerabilità accettate nelle dipendenze di sviluppo

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 1A

## Contesto

Il 13/10/2026 `npm audit` riporta 27 vulnerabilità (2 low, 4 moderate, 21 high), tutte in dipendenze di **sviluppo**. `npm audit --omit=dev`, che la CI esegue con `--audit-level=high`, ne riporta zero: nessuna arriva nel sito pubblicato.

Le vulnerabilità vengono da due catene:

1. **`@lhci/cli` 0.15.1** (Lighthouse CI): `tmp` (symlink e path traversal), `extract-zip`, `basic-ftp`, `get-uri`, `pac-proxy-agent`, `proxy-agent`, `puppeteer-core`, `lighthouse`, `uuid`, `sprintf-js`, `argparse`, `js-yaml`, `inquirer`, `external-editor`. `npm audit fix --force` proporrebbe di scendere a `@lhci/cli` 0.1.0, una versione inutilizzabile.
2. **Stylelint** (`braces`, `micromatch`, `fast-glob`, `globby`): rischio già accettato in ADR-0009.

Le dipendenze aggiunte in Fase 1A (Storybook 10.6.2, subset-font, fontkit, rollup-plugin-visualizer) non introducono vulnerabilità.

## Decisione

- Si accetta il rischio della catena `@lhci/cli`. Lighthouse CI gira solo in locale e in CI, su URL locali (`http://localhost:4173`) serviti da `scripts/preview.mjs`, senza input esterni: `tmp` ed `extract-zip` non ricevono archivi o percorsi controllati da terzi, e i moduli proxy e FTP non vengono usati.
- Il cancello resta `npm audit --omit=dev --audit-level=high` in CI: qualsiasi vulnerabilità alta in una dipendenza di produzione blocca la fase.
- Dependabot aggiorna `@lhci/cli` nel gruppo `quality`; a ogni chiusura di fase il security-auditor ricontrolla `npm audit` e aggiorna questo ADR se le catene cambiano.

## Alternative considerate

| Alternativa                                  | Pro                                | Contro                                                           | Perché scartata                                          |
| -------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| `npm audit fix --force`                      | Audit pulito                       | Scende a `@lhci/cli` 0.1.0, Lighthouse CI non funziona           | Toglierebbe il controllo Lighthouse 100                  |
| `overrides` npm sulle dipendenze transitive  | Versioni corrette di `tmp` e altri | Combinazioni non supportate da Lighthouse CI, rischio di rotture | Da rivalutare se il manutentore non aggiorna entro la F5 |
| Togliere Lighthouse CI e usare solo l'action | Meno dipendenze locali             | Niente verifica in locale prima del push                         | Il flusso di fase richiede Lighthouse in locale          |

## Conseguenze

- Positive: Lighthouse CI resta disponibile in locale e in CI; il sito pubblicato non è toccato.
- Negative e rischi: `npm audit` senza `--omit=dev` resta "rosso"; serve leggere il dettaglio per distinguere le nuove vulnerabilità da quelle accettate qui.
- Cosa va verificato e quando rivalutare: a ogni chiusura di fase (`close-phase`, security-auditor) e alla Fase 6 (revisione di sicurezza prima della release).

## Riferimenti

ADR-0009, `SECURITY.md`, `.github/dependabot.yml`, `docs/TESTING.md` §1.
