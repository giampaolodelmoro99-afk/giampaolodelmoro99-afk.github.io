# Workflow con l'AI

Come uso gli strumenti di Anthropic in questo progetto. È anche la fonte della finestra "Making of" (Fase 3B).

## 1. Ruoli degli strumenti

| Strumento            | Ruolo                                         | Cosa produce                                                                                                              |
| -------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Claude Code**      | Implementazione, test, documentazione, review | Codice, commit convenzionali, ADR, retrospettive. Lavora dentro le regole di CLAUDE.md, con skill e agenti in `.claude/`. |
| **Claude Design**    | Mockup, design system, icone originali        | Mockup delle finestre, varianti dei temi, icone pixel art originali (registrate in ASSETS.md).                            |
| **Claude in Chrome** | QA manuale nel browser                        | Verifiche su viewport reali, tastiera, rete e console, con i prompt di QA_CHECKLIST.md.                                   |

## 2. Ciclo di una fase

1. **Plan mode**: Claude Code analizza e propone un piano; io lo correggo finché non lo approvo; il piano si salva in `docs/phases/phase-NN-plan.md`.
2. **Implementazione** sul branch `phase/NN-nome`, con commit piccoli. Gli hook bloccano lint, tipi e test rotti prima del commit e del push.
3. **Review** con gli agenti `code-reviewer`, `security-auditor`, `a11y-auditor`, `content-reviewer`, che hanno contesto indipendente e lavorano in sola lettura.
4. **QA** nel browser con Claude in Chrome, anche su mobile.
5. **Chiusura** con la skill `close-phase`: verifica della CI, retrospettiva, CHANGELOG, PLAN. Merge e tag li faccio io.

## 3. Skill e agenti

| Nome                                                                    | Tipo   | Quando                              |
| ----------------------------------------------------------------------- | ------ | ----------------------------------- |
| `win95-component`                                                       | skill  | nuovo componente del design system  |
| `window-app`                                                            | skill  | nuova app/finestra del desktop      |
| `write-tests`                                                           | skill  | decidere quali test scrivere        |
| `update-visual-snapshots`                                               | skill  | cambio visivo voluto                |
| `i18n-strings`                                                          | skill  | testi IT/EN                         |
| `add-project`                                                           | skill  | nuovo progetto GitHub nel portfolio |
| `new-adr`                                                               | skill  | nuova decisione architetturale      |
| `close-phase`                                                           | skill  | fine fase                           |
| `code-reviewer`, `security-auditor`, `a11y-auditor`, `content-reviewer` | agenti | review indipendente                 |

## 4. Prompt chiave

- **Avvio di fase**: "Produci solo il piano della Fase N, senza scrivere codice. Non iniziare l'implementazione finché non approvo." Seguono contesto, obiettivi e vincoli.
- **Correzione del piano**: risposte puntuali alle domande aperte più correzioni in elenco ("Integra queste correzioni e ripresentalo completo").
- **Requisito aggiunto in corsa**: messaggio breve con i file da aggiornare ("Aggiunta da integrare in CONTRIBUTING.md, TESTING.md…").
- **QA**: prompt in QA_CHECKLIST.md §7.

## 5. Lezioni imparate

### Fase 0

- **Il piano va scritto prima, ma misurato dopo.** Il budget di 90 kB di JS stimato nel piano era irrealistico con React 19 + React Router 8 (112 kB misurati). È stato corretto a 115 kB con motivazione scritta, non abbassato in silenzio.
- **Lighthouse mobile simula, non misura.** Le metriche osservate in locale erano ottime (LCP 48 ms), ma la simulazione lantern contava i `modulepreload` nel percorso critico (Performance 93). La soluzione l'ha trovata un esperimento sull'output di build: prima varianti separate (CSS inline, JS rinviato), poi una sola modifica mirata (idratazione dopo `load`).
- **Gli hook funzionano.** Pre-commit e commitlint hanno bloccato più volte commit con errori di tipo, asserzioni non sicure e import non assegnati: correzioni fatte prima di arrivare alla CI.
- **Mai condizioni nei test.** Una prima versione usava `test.fail` per i dispositivi touch: è stata sostituita da file dedicati assegnati ai progetti Playwright dalla configurazione.
- **Screenshot solo nel container.** Le baseline generate sull'host differivano del 3% dal container della CI.
- **Requisiti arrivati in corsa** (regola di merge, divieto di aggirare i controlli, pre-push) integrati subito nel piano salvato e nelle regole di Oxlint, con un controllo che le regole scattino davvero su un file di prova.

## 6. Materiale per "Making of"

Dalla Fase 3B la finestra "Making of" racconta:

- il processo a fasi
- i numeri (test, coverage, Lighthouse)
- gli ADR più interessanti
- le lezioni di §5

Fonte: questo file, le retrospettive e il CHANGELOG.
