# Registro degli asset

Ogni font, icona, suono o immagine del sito è registrato qui **prima** di essere usato (vedi LEGAL.md §6). Gli asset Microsoft sono vietati.

Campi obbligatori: nome, file nel repo, fonte (URL ufficiale), autore, versione, licenza (con link), SHA-256 del file, data di verifica, note.

## Font

| Nome                                                 | File                                                  | Fonte                                                                                                                | Autore                              | Versione                | Licenza                                                       | SHA-256                                                            | Verificato | Note                                                                                                                                                          |
| ---------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pixel Operator Regular (subset)                      | `src/assets/fonts/pixel-operator-400.woff2`           | pacchetto DaFont `pixel_operator` (dafont.com/pixel-operator.font), caricato dall'autore; subset con `npm run fonts` | Jayvee Enaguas (HarvettFox96)       | 2018.10.04-1            | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `bbedded683f436c8353af815449c39c287a0419ae4dc842024e609e27778d5a5` | 13/10/2026 | Subset woff2 di `fonts-src/pixel-operator/PixelOperator.ttf`: 188 glifi (Basic Latin, Latin-1, ‘ ’ “ ”, – —, …, €, •). In preload.                            |
| Pixel Operator Bold (subset)                         | `src/assets/fonts/pixel-operator-700.woff2`           | pacchetto DaFont `pixel_operator` (dafont.com/pixel-operator.font), caricato dall'autore; subset con `npm run fonts` | Jayvee Enaguas (HarvettFox96)       | 2018.10.04-1            | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `a902fdde05831cb91b74fa0db97ba57a2b9f664e29465d58abb74dd123b0a530` | 13/10/2026 | Come il regular, da `PixelOperator-Bold.ttf`. In preload (titolo della home).                                                                                 |
| Pixel Operator Regular (originale)                   | `fonts-src/pixel-operator/PixelOperator.ttf`          | pacchetto DaFont `pixel_operator` (dafont.com/pixel-operator.font), caricato dall'autore                             | Jayvee Enaguas (HarvettFox96)       | 2018.10.04-1            | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `8d805274eaf227855147153182a96a86ff395ddbc7d2d378095af8831b764a3e` | 13/10/2026 | Originale del pacchetto, non servito. Mancano ¤ § ª ¯ ² ³ ¹ º ¼ ½ ¾ e il trattino morbido: li rende il fallback.                                              |
| Pixel Operator Bold (originale)                      | `fonts-src/pixel-operator/PixelOperator-Bold.ttf`     | pacchetto DaFont `pixel_operator` (dafont.com/pixel-operator.font), caricato dall'autore                             | Jayvee Enaguas (HarvettFox96)       | 2018.10.04-1            | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `c1963fa21043a357212e0a9e8ae1986bc375c1759e68bd3533c4f71b164614b0` | 13/10/2026 | Originale del pacchetto, non servito.                                                                                                                         |
| Licenza di Pixel Operator                            | `fonts-src/pixel-operator/LICENSE.txt`                | pacchetto DaFont `pixel_operator` (dafont.com/pixel-operator.font), caricato dall'autore                             | Jayvee Enaguas (HarvettFox96)       | 2018.10.04-1            | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `f4e7f373b9b996950337e8d41a4a2939c2d90b7725e9baf3d5084a22717ad328` | 13/10/2026 | `LICENSE.txt` del pacchetto: testo integrale di CC0 1.0 Universal.                                                                                            |
| Licenza di Pixel Operator (copia servita con i font) | `src/assets/fonts/licenses/PixelOperator-LICENSE.txt` | pacchetto DaFont `pixel_operator` (dafont.com/pixel-operator.font), caricato dall'autore                             | Jayvee Enaguas (HarvettFox96)       | 2018.10.04-1            | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `f4e7f373b9b996950337e8d41a4a2939c2d90b7725e9baf3d5084a22717ad328` | 13/10/2026 | Copia identica di `LICENSE.txt`.                                                                                                                              |
| IBM Plex Sans Regular, Latin1                        | `src/assets/fonts/IBMPlexSans-Regular-Latin1.woff2`   | release `@ibm/plex-sans@1.1.0`, github.com/IBM/plex (`ibm-plex-sans.zip`), `fonts/split/woff2/`                      | IBM Corp., Mike Abbink, Bold Monday | 3.005 (pacchetto 1.1.0) | [SIL OFL 1.1](https://openfontlicense.org/)                   | `b5ad7bd39f996144915f0ad9849a90183b27d8c28ad97ed98af5b1bebc51f6b1` | 13/10/2026 | Subset ufficiale di IBM, **identico alla release** (nessuna modifica: il nome riservato "Plex" resta lecito, OFL-FAQ 2.5-2.6). Copre tutti i glifi richiesti. |
| IBM Plex Sans Bold, Latin1                           | `src/assets/fonts/IBMPlexSans-Bold-Latin1.woff2`      | release `@ibm/plex-sans@1.1.0`, github.com/IBM/plex (`ibm-plex-sans.zip`), `fonts/split/woff2/`                      | IBM Corp., Mike Abbink, Bold Monday | 3.005 (pacchetto 1.1.0) | [SIL OFL 1.1](https://openfontlicense.org/)                   | `914f1400f363e636b6f9cc7965aa807ff01e93586e1437617525cba0a62aa78d` | 13/10/2026 | Come il regular.                                                                                                                                              |
| IBM Plex Sans Italic, Latin1                         | `src/assets/fonts/IBMPlexSans-Italic-Latin1.woff2`    | release `@ibm/plex-sans@1.1.0`, github.com/IBM/plex (`ibm-plex-sans.zip`), `fonts/split/woff2/`                      | IBM Corp., Mike Abbink, Bold Monday | 3.005 (pacchetto 1.1.0) | [SIL OFL 1.1](https://openfontlicense.org/)                   | `0a06b98143f3453b81f3c396241a01c6c4cff84c1a77bf0c75b18bd603018506` | 13/10/2026 | Come il regular.                                                                                                                                              |
| Licenza di IBM Plex Sans                             | `src/assets/fonts/licenses/OFL.txt`                   | release `@ibm/plex-sans@1.1.0`, github.com/IBM/plex (`ibm-plex-sans.zip`), `LICENSE.txt`                             | IBM Corp., Mike Abbink, Bold Monday | pacchetto 1.1.0         | [SIL OFL 1.1](https://openfontlicense.org/)                   | `7e6b2818edbd8f6a01ae80641cc8f16a51080d08fb4e532be3a0b6f74adb07da` | 13/10/2026 | `LICENSE.txt` della release: OFL 1.1 con Reserved Font Name "Plex".                                                                                           |

### Provenienza dei pacchetti

- **Pixel Operator**: la fonte ufficiale `notabug.org/HarvettFox96/ttf-pixeloperator` risponde **404 dal 13/10/2026**. Non esistono copie su GitHub o Codeberg né snapshot su archive.org. La fonte usata è il pacchetto DaFont caricato dall'autore (`https://dl.dafont.com/dl/?f=pixel_operator`, zip del 04/10/2018):
  - SHA-256 dello zip: `95b33667e4884f5714db33d8324472df28f9d5ffed49108824c5819c1a217dad`
  - `LICENSE.txt` del pacchetto: testo integrale di **Creative Commons CC0 1.0 Universal** (copiato in `src/assets/fonts/licenses/PixelOperator-LICENSE.txt`)
  - la tabella `name` dei font dice: "Released by Jayvee Enaguas (HarvettFox96) […], licensed under a Creative Commons Zero (CC0) 1.0 […] (c) 2009-2018"
  - **incoerenza nota**: l'intestazione della pagina DaFont indica "Public domain / GPL / OFL". Fanno fede il file di licenza e i metadati del font, entrambi CC0 1.0.
- **IBM Plex Sans**: release ufficiale `@ibm/plex-sans@1.1.0` (13/11/2024), SHA-256 di `ibm-plex-sans.zip`: `fb365d910566e6d199cc2c15579a7dd9a267128e18431a394ed81f1970c69200`. Il sito usa i file `fonts/split/woff2/*-Latin1.woff2` così come sono, con l'`unicode-range` del CSS ufficiale (`css/ibm-plex-sans-default.css`).
- **DotGothic16**, il sostituto usato nelle anteprime di Claude Design, **non** è incluso nel sito.

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
