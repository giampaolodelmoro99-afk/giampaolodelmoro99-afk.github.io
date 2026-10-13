# ADR-0010: Font Pixel Operator (interfaccia) e IBM Plex Sans (testi lunghi)

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0 (implementazione in Fase 1)

## Contesto

La v1 usava "Pixelated MS Sans Serif", un font Microsoft: vietato. Serve un font pixel con licenza libera verificata per l'estetica 95, e un font leggibile per i testi lunghi, l'alto contrasto e la "dimensione testo". Nessuna richiesta a CDN.

## Decisione

- **Pixel Operator** (Jayvee Enaguas, CC0 1.0, v2.018) per interfaccia e titoli: titlebar, menu, pulsanti, etichette.
  - Glifi verificati con `fc-query` in regular e bold: à è é ì ò ù, maiuscole accentate, virgolette e apostrofo tipografici, €, …, – —, « ».
- **IBM Plex Sans** (IBM, SIL OFL 1.1) per i testi lunghi nelle finestre "documento" stile WordPad (bio, case study, privacy) e per l'interfaccia quando l'utente sceglie alto contrasto o testo grande.
- **Formato e caricamento**:
  - woff2 con **subset** (Latin di base + Latin-1 + i glifi sopra), generato da uno script con `subset-font`
  - file nel repo, nessuna CDN
  - **preload** solo del font necessario al primo paint (Pixel Operator regular, se la UI visibile lo usa)
  - `font-display: swap` e **fallback metrico** (`@font-face` locale con `size-adjust`, `ascent-override`, `descent-override`) perché lo swap non generi CLS
- **Registrazione** in ASSETS.md con fonte, autore, versione, licenza, SHA-256; `OFL.txt` incluso in `src/assets/fonts/licenses/`.

## Alternative considerate

| Alternativa                | Perché scartata                                                           |
| -------------------------- | ------------------------------------------------------------------------- |
| W95FA                      | Ridisegno di MS Sans Serif: rischio legale e di originalità               |
| Px437 / Fixedsys Excelsior | Derivati da font di sistema proprietari                                   |
| Solo Pixel Operator        | Testi lunghi poco leggibili, soprattutto su mobile e con testo ingrandito |
| Solo font di sistema       | Perde l'identità 95; resa diversa per piattaforma                         |

## Conseguenze

- Circa 20-30 kB di font in più in totale, ma solo uno in preload: da misurare nel budget di F1.
- La fonte ufficiale di Pixel Operator (notabug.org) va confermata raggiungibile in F1; la licenza CC0 è nel pacchetto.

## Riferimenti

ASSETS.md, DESIGN_SYSTEM.md §4, LEGAL.md §6.
