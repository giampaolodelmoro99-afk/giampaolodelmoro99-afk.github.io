Pulsante a rilievo per le azioni, in due varianti: normale e azione predefinita.

## Quando usarlo
- **Normale** per ogni azione: Annulla, Chiudi, Sfoglia….
- **Predefinito** (`variant="default"`) per l'azione che parte con Invio: una sola per finestra o dialog, di solito OK, Invia, Salva.
- Per una voce che apre un menu usa `MenuButton`; per i pulsanti della barra del titolo usa `Window`, che li crea da sé.

## Cosa fornisce chi lo usa
- `children`: etichetta breve, verbo all'infinito o sostantivo ("Invia", "Annulla"), senza punto finale.
- `icon` (facoltativo): nome di un'icona 16 px, decorativa (`aria-hidden`).
- Tutte le prop di `Button` di React Aria (`onPress`, `isDisabled`, `type`, `autoFocus`…).

## Stati
| Stato | Attributo | Aspetto |
| --- | --- | --- |
| Normale | — | `--bevel-raised` su `--color-surface` |
| Hover | `[data-hovered]` | fondo `--color-surface-hover`, `--bevel-hover` (in alto contrasto bordo ciano) |
| Premuto | `[data-pressed]` | `--bevel-pressed`, contenuto spostato di 1 px |
| Focus | `[data-focus-visible]` | doppio anello esterno a 2 px dal bordo |
| Disabilitato | `[data-disabled]` | testo `--color-text-disabled` con ombra `--color-text-disabled-etch` |
| Predefinito | `data-variant="default"` | `--bevel-default`, premuto `--bevel-default-pressed` |

## Desktop e touch
Altezza `--control-height` (32 px desktop, 44 px touch) e larghezza minima `--button-min-width`. Le misure cambiano da sole con `pointer: coarse` o `data-input="touch"`.

## Da evitare
- Due pulsanti predefiniti nella stessa finestra.
- Etichette solo-icona senza `aria-label`.
- Colori diversi dal grigio: un pulsante si distingue per posizione ed etichetta, non per colore.
