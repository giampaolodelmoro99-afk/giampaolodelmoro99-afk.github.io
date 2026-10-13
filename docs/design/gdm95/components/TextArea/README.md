Area di testo su più righe, con la stessa anatomia di TextField e la barra di scorrimento del sistema.

## Cosa fornisce chi lo usa
- `label`, `description`, `errorMessage` come in TextField; `rows` (predefinito 5).
- Ridimensionabile solo in verticale.

## Note
- L'interlinea è `--line-height-body` per i testi lunghi; il font resta quello dell'interfaccia.
- La barra di scorrimento usa la classe `g95-scroll` (vedi ScrollArea): frecce e thumb a rilievo su desktop, indicatore sottile senza frecce in touch.
