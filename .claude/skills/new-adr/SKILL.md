---
name: new-adr
description: Scrive una nuova decisione architetturale (ADR) numerata partendo da docs/adr/TEMPLATE.md, con alternative, conseguenze e collegamenti. Da usare per ogni scelta tecnica o legale rilevante e per ogni eccezione alle regole (test, soglie, accessibilità).
---

# Nuovo ADR

## Passi

1. Trova il numero successivo: `ls docs/adr` (quattro cifre: `0011`, `0012`…).
2. Crea `docs/adr/NNNN-titolo-breve-in-kebab-italiano.md` copiando `docs/adr/TEMPLATE.md`.
3. Compila:
   - **Stato**: Proposta (finché non è approvata da Gianpaolo), poi Accettata.
   - **Contesto**: problema e vincoli, citando i requisiti non negoziabili coinvolti (Lighthouse di ADR-0018, WCAG 2.2 AA, LEGAL.md, budget).
   - **Decisione**: verificabile.
   - **Alternative**: almeno due, con il motivo dello scarto.
   - **Conseguenze**: positive, negative, cosa misurare e quando rivalutare.
   - **Riferimenti**: docs, file, link.
4. Se **sostituisce** un ADR: nel vecchio imposta "Sostituita da ADR-NNNN" (non cancellarlo) e collegali tra loro.
5. Collega l'ADR dai documenti interessati (ARCHITECTURE, TESTING, LEGAL…).
6. Per un'**eccezione** a una regola (test disattivato, soglia, criterio WCAG): spiega perché è inevitabile, la mitigazione e la scadenza per rimuoverla.
7. Commit: `docs: aggiunge l'adr NNNN su <tema>`.

## Riferimenti

docs/adr/TEMPLATE.md, CONTRIBUTING.md.
