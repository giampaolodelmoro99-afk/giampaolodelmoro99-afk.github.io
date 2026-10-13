Pulsante della barra delle applicazioni, uno per finestra aperta: la finestra attiva appare premuta e retinata.

## Cosa fornisce chi lo usa
- `Taskbar` con `clock` e i figli: `StartButton` e poi i `TaskbarButton`.
- `TaskbarButton` con `icon` (16 px), `children` (titolo della finestra), `isSelected` per la finestra attiva, `onChange`.

## Stati
Normale, hover, premuto, attivo (`[data-selected]`: `--bevel-sunken`, fondo retinato, testo in grassetto), focus, disabilitato. Il titolo si tronca a `--taskbar-button-max-width`.

## Desktop e touch
Taskbar alta `--taskbar-height` (40 / 56 px), pulsanti alti `--control-height`. In fondo rispetta `env(safe-area-inset-bottom)`.
