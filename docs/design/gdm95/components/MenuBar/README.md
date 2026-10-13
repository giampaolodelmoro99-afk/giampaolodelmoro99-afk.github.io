Barra dei menu della finestra con menu a comparsa, voci con spunta, icona, scorciatoia e sottomenu.

## Cosa fornisce chi lo usa
- `MenuBar` con `label` (predefinito "Menu").
- Un `MenuButton` per menu, con `label` ("File", "Visualizza", "Aiuto").
- Dentro, `MenuItem` (`id`, `children`, `shortcut`, `icon`, `onAction`, `isDisabled`) e `MenuSeparator`. Per voci con spunta usa `selectionMode` sul menu di React Aria.

## Tastiera
Tab entra nella barra, le frecce sinistra/destra passano da un menu all'altro (Toolbar di React Aria), Invio o freccia giù apre, Esc chiude e riporta il focus al pulsante.

## Stati
- **Pulsante della barra**: hover con rilievo sottile di 1 px, aperto o premuto in `--color-selection`, focus con anello interno, disabilitato inciso.
- **Voce**: evidenziata (`[data-focused]` o `[data-hovered]`) in `--color-selection`, spunta nella colonna sinistra (`[data-selected]`), sottomenu aperto (`[data-open]`), focus da tastiera con anello interno, disabilitata incisa.

## Desktop e touch
Voci alte `--menu-item-height`; i pulsanti della barra almeno `--target-min`. Non mettere funzioni raggiungibili solo da tasto destro: ogni menu contestuale ha una voce equivalente qui.
