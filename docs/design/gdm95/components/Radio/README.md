Pulsante di opzione in pixel art (cerchio disegnato a pixel, non con border-radius) da usare dentro RadioGroup.

## Cosa fornisce chi lo usa
- `RadioGroup` con `label` visibile e `value` / `defaultValue`; `orientation="horizontal"` per poche opzioni brevi.
- Un `Radio` per opzione con `value` e `children` (l'etichetta).
- Le frecce spostano la selezione dentro il gruppo; Tab entra ed esce dal gruppo.

## Stati
Gli stessi di Checkbox: selezionato (punto `--color-text`), hover (etichetta sottolineata), premuto (fondo grigio), focus (doppio anello sull'etichetta), disabilitato (inciso).

## Note
Il cerchio è un SVG 10×10 a pixel interi: le sue quattro tinte vengono da `--color-shadow`, `--color-shadow-dark`, `--color-highlight` e `--color-surface-light`, quindi il cerchio si adatta da solo all'alto contrasto. Rispetta la regola `--radius-none`.
