Casella di controllo con spunta in pixel art; l'area cliccabile è tutta la riga, etichetta compresa.

## Cosa fornisce chi lo usa
- `children`: l'etichetta, scritta in positivo ("Mostra i secondi nell'orologio").
- `isSelected` / `defaultSelected`, `isIndeterminate` per un "seleziona tutto" parziale, `isDisabled`, `isInvalid`.

## Stati
| Stato | Attributo | Aspetto |
| --- | --- | --- |
| Selezionata | `[data-selected]` | glifo `check` 7×7 a `--glyph-pixel` |
| Indeterminata | `[data-indeterminate]` | glifo `dash` |
| Hover | `[data-hovered]` | etichetta sottolineata |
| Premuta | `[data-pressed]` | fondo del quadrato `--color-surface`, come nel 95 |
| Focus | `[data-focus-visible]` | doppio anello attorno all'etichetta |
| Disabilitata | `[data-disabled]` | quadrato grigio, glifo ed etichetta incisi |
| Non valida | `[data-invalid]` | bordo interno `--color-error`; serve anche un messaggio |

## Desktop e touch
Riga alta `--choice-row` (24 px / 44 px), quadrato `--choice-box` (20 px / 28 px).
