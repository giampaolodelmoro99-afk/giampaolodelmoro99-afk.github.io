Icona del desktop: immagine 32 px ed etichetta, con selezione blu e focus a doppio anello sull'etichetta.

## Cosa fornisce chi lo usa
- `DesktopIcons` con `items: [{ id, icon, label }]` e `onAction(id)` per aprire la finestra.
- `DesktopIcon` statica solo per illustrazioni.

## Interazione
- Desktop: clic seleziona, doppio clic o Invio apre; le frecce si muovono nella griglia (GridList di React Aria).
- Touch: un tocco apre. Ogni cella è larga `--desktop-icon-cell` e alta almeno `--touch-target-min`.

## Stati
Normale, hover (etichetta sottolineata), selezionata (`[data-selected]`: etichetta `--color-selection`, icona velata da un retino blu), focus (doppio anello sull'etichetta), selezionata con focus.

## Etichette
Fino a due righe, a capo libero. Testo `--color-desktop-text` su `--color-desktop`: 4,77:1 nel classico.
