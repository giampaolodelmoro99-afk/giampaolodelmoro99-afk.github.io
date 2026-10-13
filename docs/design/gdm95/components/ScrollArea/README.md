Barra di scorrimento retinata con frecce e thumb a rilievo, applicata a qualsiasi contenitore con la classe `g95-scroll`.

## Cosa fornisce chi lo usa
- `ScrollArea` con `label` (diventa una regione focalizzabile, così si scorre anche da tastiera), `style` per le dimensioni, `children`.
- Oppure la sola classe `g95-scroll` su un elemento con `overflow: auto` (TextArea, ListBox, corpo dei documenti).

## Anatomia
- Fondo retinato a 2 px (`--color-highlight` su `--color-surface`); thumb e frecce `--bevel-raised`.
- Freccia in hover `--color-surface-hover`, premuta `--bevel-pressed`.
- Spessore `--scrollbar-size`: 24 px su desktop. In touch 12 px, solo indicatore, senza frecce: si scorre con il dito.

## Browser
Chromium e Safari usano gli pseudo-elementi `::-webkit-scrollbar`. Firefox usa `scrollbar-color` (thumb `--color-shadow`, binario `--color-surface-light`), senza frecce. Non impostare `scrollbar-color` o `scrollbar-width` su questi elementi in Chromium: disattiverebbero lo stile 95.
