Cornice di finestra con barra del titolo attiva o inattiva, pulsanti riduci, ingrandisci/ripristina e chiudi, menu e barra di stato facoltativi.

## Cosa fornisce chi lo usa
- `title` (diventa il nome accessibile della finestra tramite `aria-labelledby`), `icon` (16 px).
- `isActive`: una sola finestra attiva alla volta; le altre `false`.
- `onMinimize`, `onToggleMaximize`, `onClose`; `controls` per togliere pulsanti (un dialog ha solo Chiudi).
- `menu` (di solito `MenuBar`), `statusBar` (di solito `StatusBar`), `children`.
- `variant="document"` per bio, case study e privacy: corpo bianco incassato, IBM Plex Sans (`--font-family-document`), interlinea `--line-height-body`, righe lunghe al massimo `--measure-document`.

## Barra del titolo
| | Classico | Alto contrasto |
| --- | --- | --- |
| Attiva | `--color-titlebar-active` #000080, titolo bianco in grassetto | giallo, titolo nero |
| Inattiva | `--color-titlebar-inactive` #6a6a6a, titolo bianco normale (5,4:1) | nero con bordo bianco |

## Pulsanti della barra
- 24×24 px su desktop (`--titlebar-button-*-desktop`, contro i 16×14 del 95, per WCAG 2.5.8), 44×44 in touch.
- Glifi in pixel art a `--glyph-pixel`, 2 px di stacco prima di Chiudi.
- Nomi accessibili: "Riduci a icona", "Ingrandisci" / "Ripristina", "Chiudi".
- Il focus a doppio anello si vede anche sul blu: l'alone bianco fa 16:1 con #000080.

## Accessibilità
- Ogni gesto di trascinamento (spostare, ridimensionare) deve avere un'alternativa nel menu della finestra o nei pulsanti (WCAG 2.5.7).
- Il ruolo della finestra (`region` o `dialog` non modale) si decide in F2A; il componente usa `section` con `aria-labelledby`.
