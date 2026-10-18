---
name: close-phase
description: Prepara la chiusura di una fase del progetto con tutti i controlli (test, coverage, regressione visiva, prerender, size-limit, Lighthouse mobile e desktop), agenti di review, QA nel browser, retrospettiva, CHANGELOG e PLAN, verificando la CI del branch su GitHub. Prepara tutto per il merge ma non esegue né merge né tag né push.
---

# Chiusura di fase

## 1. Controlli locali (tutti, nell'ordine)

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run test:prerender
npm run size
npm run test:e2e          # container, suite completa con screenshot
npm run lhci:mobile:strict   # Performance 100, mediana di 5 (ADR-0013)
npm run lhci:desktop:strict
```

Se un controllo fallisce: correggi la causa. **Mai** skip, only, test rimossi, soglie abbassate o screenshot aggiornati per far passare (CONTRIBUTING.md). Un'eccezione inevitabile richiede un ADR (skill `new-adr`) e l'approvazione di Gianpaolo.

## 2. Integrità rispetto a main

```bash
git diff main...HEAD --stat -- tests '**/*.test.*' '**/*.spec.ts' vitest.config.ts playwright.config.ts lighthouserc.*.json .size-limit.js .oxlintrc.json
```

Nessun test rimosso o indebolito, nessuna soglia abbassata. I test delle fasi precedenti devono passare tutti.

## 3. Review con gli agenti

Lancia `code-reviewer`, `security-auditor`, `a11y-auditor` e `content-reviewer` sul diff della fase. Correggi tutti i **bloccanti**, poi ripeti i controlli di §1 interessati.

## 4. QA nel browser

Con `npm run preview` e Claude in Chrome, esegui `docs/QA_CHECKLIST.md`: desktop, mobile (320/375 in verticale e in orizzontale), tastiera, reduced motion, console e rete. Annota l'esito.

## 5. Documentazione

- `docs/phases/phase-NN-retro.md` dal modello, con metriche reali (numero di test, coverage, Lighthouse per route, size).
- `CHANGELOG.md`: sezione `[phase-NN]`.
- `docs/PLAN.md`: checkbox della fase.
- `docs/AI_WORKFLOW.md` §5: lezioni della fase.
- Altri docs toccati dalla fase.

Commit: `docs: chiude la fase NN con retrospettiva e changelog`.

## 6. CI su GitHub (cancello finale)

Il push lo fa Gianpaolo. Dopo il push, verifica l'ultima run del branch:

```bash
gh run list --branch phase/NN-nome --limit 1 --json status,conclusion,headSha,url
```

- Lo `headSha` deve coincidere con `git rev-parse HEAD`.
- Se `conclusion` non è `success` (o la run è in corso, o non esiste): **non proporre i comandi di merge**. Riporta cosa manca (job falliti con `gh run view <id> --log-failed`) e fermati.
- Solo se è verde, proponi a Gianpaolo i comandi, **senza eseguirli**:

```bash
git switch main
git merge --no-ff phase/NN-nome -m "Merge della fase NN: nome"
git tag -a phase-NN -m "Fase NN: nome"
git push origin main phase-NN
```

I tag di fase sono `phase-NN`. **Mai `v*`**: farebbero partire il deploy in produzione.

## Riepilogo finale per Gianpaolo

Esito di ogni controllo, link alla run CI, bloccanti risolti, rischi aperti, domande per la fase successiva.
