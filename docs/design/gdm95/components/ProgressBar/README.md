Barra di avanzamento a blocchi blu dentro un campo incassato, con etichetta e percentuale.

## Cosa fornisce chi lo usa
- `label` sempre visibile, `value` da 0 a 100, oppure `isIndeterminate`.
- `valueLabel` se la percentuale non basta ("3 file su 7").

## Note
- Blocchi `--color-accent` larghi `--progress-block-width` con `--progress-block-gap`.
- Indeterminata: i blocchi scorrono a scatti (`steps`). Con movimento ridotto restano fermi a metà intensità e il testo dice "In corso…".
- Per l'esito finale usa testo con icona ("Messaggio inviato"), non solo la barra piena.
