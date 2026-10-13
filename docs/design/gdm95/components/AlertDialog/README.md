Finestra di dialogo modale di avviso, errore o informazione, con icona 32 px, messaggio e pulsanti.

## Cosa fornisce chi lo usa
- `title`, `kind` (`warning`, `error`, `info`), `message`.
- `primaryLabel` (pulsante predefinito, riceve il focus all'apertura) e, se serve una scelta, `secondaryLabel`.
- `isOpen` / `onOpenChange`, `onPrimary`.
- `AlertDialogFrame` con `isStatic` solo per illustrazioni e test visivi.

## Regole
- `role="alertdialog"`, titolo collegato, focus intrappolato e restituito al pulsante d'origine (React Aria).
- Esc chiude come il pulsante secondario; un clic fuori non chiude.
- L'icona ha un nome accessibile ("Avviso", "Errore", "Informazione"), e il testo spiega cosa fare.
- Velo `--color-overlay`, `--z-overlay`.
