Schede con linguette a rilievo: la selezionata è più alta, in grassetto, e si fonde con il pannello.

## Cosa fornisce chi lo usa
- `tabs`: `[{ id, label, content, isDisabled? }]`.
- `label` per il nome accessibile della lista; `selectedKey` / `defaultSelectedKey`, `onSelectionChange`.

## Stati
Normale (`--bevel-tab`), hover (`--color-surface-hover`), selezionata (`[data-selected]`: 2 px più alta, sovrapposta al pannello, testo in grassetto), focus con anello interno, disabilitata incisa.

## Note
Le frecce cambiano scheda. Su schermi stretti le linguette vanno a capo invece di scorrere in orizzontale.
