Menu a tendina: campo bianco con pulsante freccia a rilievo e lista a comparsa con bordo nero di 1 px.

## Cosa fornisce chi lo usa
- `label` visibile.
- `options`: `[{ id, label, isDisabled? }]`.
- `selectedKey` / `defaultSelectedKey`, `onSelectionChange`, `isDisabled`, `isRequired`.

## Stati
- **Campo**: hover sul pulsante freccia (`--bevel-hover`), aperto o premuto (`[data-open]`, freccia `--bevel-pressed`), focus (doppio anello e valore evidenziato in `--color-selection`, come nel 95), disabilitato.
- **Opzioni**: evidenziata da puntatore o tastiera (`[data-focused]`, `--color-selection`), scelta corrente in grassetto quando non è evidenziata, focus da tastiera con anello interno (`--focus-offset-inset`), disabilitata incisa.

## Desktop e touch
Opzioni alte `--menu-item-height` (28 px / 44 px). La lista si apre sotto il campo, larga quanto il campo (`--trigger-width`), con altezza massima di 20 rem.
