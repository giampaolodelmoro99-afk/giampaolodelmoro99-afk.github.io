# Registro degli asset

Ogni font, icona, suono o immagine del sito è registrato qui **prima** di essere usato (vedi LEGAL.md §6). Gli asset Microsoft sono vietati.

Campi obbligatori: nome, file nel repo, fonte (URL ufficiale), autore, versione, licenza (con link), SHA-256 del file, data di verifica, note.

## Font

| Nome                           | File                                                                                               | Fonte                                                                                                          | Autore                              | Versione            | Licenza                                                       | SHA-256             | Verificato                   | Note                                                                                                                                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------- | ------------------------------------------------------------- | ------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pixel Operator (regular, bold) | da aggiungere in F1: `src/assets/fonts/pixel-operator*.woff2`                                      | notabug.org/HarvettFox96/ttf-pixeloperator (ufficiale); copia verificata dal pacchetto DaFont `pixel_operator` | Jayvee Enaguas (HarvettFox96)       | 2.018 (2018)        | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | da registrare in F1 | 13/10/2026 (licenza e glifi) | `LICENSE.txt` del pacchetto = CC0 1.0. Glifi verificati con `fc-query`: à è é ì ò ù, À È É Ì Ò Ù, ' ' " ", €, …, – —, « » presenti in regular e bold. In F1: confermare la fonte ufficiale, subset woff2, SHA-256. |
| IBM Plex Sans                  | da aggiungere in F1: `src/assets/fonts/ibm-plex-sans*.woff2` + `src/assets/fonts/licenses/OFL.txt` | github.com/IBM/plex                                                                                            | IBM Corp., Mike Abbink, Bold Monday | da registrare in F1 | [SIL OFL 1.1](https://openfontlicense.org/)                   | da registrare in F1 | da verificare in F1          | Il file OFL va incluso nel repo. Subset con gli stessi glifi di Pixel Operator.                                                                                                                                    |

**Scartati:**

- _Pixelated MS Sans Serif_, il font della v1: font Microsoft.
- _W95FA_: ridisegno di MS Sans Serif.
- _Px437 / Fixedsys Excelsior_: derivati da font di sistema proprietari.

## Icone

| Nome              | File                 | Fonte                       | Autore                             | Licenza                                           | SHA-256                                                            | Verificato | Note                                                                                                                                                                                  |
| ----------------- | -------------------- | --------------------------- | ---------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Favicon "monitor" | `public/favicon.svg` | originale, creata per la v2 | Claude Code per Gianpaolo Del Moro | contenuto del progetto, tutti i diritti riservati | `d4ba53a7304ffef9bfff2203131235b95d7891c3d5ab767a13a9a5d44b672565` | 13/10/2026 | Pixel art 16×16: monitor grigio con schermo teal. Non deriva da icone Microsoft né dalla favicon della v1. In F1 si aggiungono le varianti PNG per apple-touch-icon e alto contrasto. |

## Suoni

Nessuno (Fase 4A).

## Immagini

Nessuna. Le immagini Open Graph saranno generate in build (Fase 5) con i font di questo registro.

## Asset vietati (promemoria)

Font Microsoft e loro ridisegni, icone di Windows, suoni di sistema di Windows, logo e bandiera di Windows, Clippy e altri assistenti, screenshot originali di Windows, loghi di terzi senza permesso.
