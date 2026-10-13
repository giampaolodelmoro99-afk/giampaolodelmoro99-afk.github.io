# ADR-0010: Font Pixel Operator (interfaccia) e IBM Plex Sans (testi lunghi)

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0 (implementazione in Fase 1A, 13/10/2026)

## Contesto

La v1 usava "Pixelated MS Sans Serif", un font Microsoft: vietato. Serve un font pixel con licenza libera verificata per l'estetica 95, e un font leggibile per i testi lunghi, l'alto contrasto e la "dimensione testo". Nessuna richiesta a CDN.

## Decisione

- **Pixel Operator** (Jayvee Enaguas, CC0 1.0, versione 2018.10.04-1) per interfaccia e titoli: titlebar, menu, pulsanti, etichette.
  - Fonte: la pagina ufficiale su notabug.org risponde 404 dal 13/10/2026; si usa il pacchetto DaFont caricato dall'autore, con `LICENSE.txt` CC0 1.0 e la licenza scritta anche nei metadati del font (dettagli e SHA-256 in ASSETS.md).
  - Glifi: à è é ì ò ù, maiuscole accentate, virgolette e apostrofo tipografici, €, …, – —, « », •. Mancano solo simboli rari di Latin-1 (§ ª º ² ³ ¹ ¼ ½ ¾ ¤ ¯ e il trattino morbido), resi dal fallback.
  - Subset woff2 generato da `npm run fonts` (`scripts/fonts.mjs`, `subset-font`) dagli originali in `fonts-src/`. Il risultato è deterministico e committato.
- **IBM Plex Sans** (IBM, SIL OFL 1.1, release `@ibm/plex-sans@1.1.0`, font 3.005) per i testi lunghi nelle finestre "documento" (bio, case study, privacy), per il tema `high-contrast` e per chi sceglie `data-font="readable"`. La dimensione del testo non cambia il font.
  - Si usano i **subset Latin1 ufficiali di IBM** (`fonts/split/woff2/`), identici alla release, con l'`unicode-range` del CSS ufficiale. Coprono tutti i glifi richiesti.
  - Motivo: la licenza ha il Reserved Font Name "Plex". Un subset fatto da noi sarebbe una versione modificata (OFL-FAQ 2.5-2.6) e non potrebbe chiamarsi "IBM Plex Sans". I file ufficiali non sono modificati.
- **Caricamento**:
  - file nel repo, nessuna CDN e nessun `local()` per i webfont
  - **regola d'uso** (decisione del 13/10/2026): Pixel Operator solo per titoli, etichette e controlli; frasi e paragrafi in IBM Plex Sans tramite il token `--font-family-prose`, in ogni tema
  - **preload** di Pixel Operator bold (titolo della home) e IBM Plex Sans regular (frase della home, elemento LCP): 24,1 kB. Pixel Operator regular arriva dal CSS. Tre varianti misurate con Lighthouse mobile: solo Pixel Operator (LCP 1,35 s, CLS 0,006), solo Plex (LCP 1,2 s, CLS 0,0003), Pixel bold più Plex (LCP 1,2 s, CLS 0): scelta l'ultima
  - `font-display: swap` con **fallback metrico**: facce `"Pixel Operator Fallback"` e `"IBM Plex Sans Fallback"` su `local("Arial")`, `local("Liberation Sans")` o `local("Arimo")`, con `size-adjust`, `ascent-override`, `descent-override` e `line-gap-override` calcolati da `npm run fonts`.
  - misura del 13/10/2026: Lighthouse mobile e desktop 100, CLS 0, LCP mobile 1,2 s (al limite del budget di PERFORMANCE_SEO.md).
- **Registrazione** in ASSETS.md con fonte, autore, versione, licenza, SHA-256. Licenze in `src/assets/fonts/licenses/` (`OFL.txt`, `PixelOperator-LICENSE.txt`).

## Alternative considerate

| Alternativa                | Perché scartata                                                           |
| -------------------------- | ------------------------------------------------------------------------- |
| W95FA                      | Ridisegno di MS Sans Serif: rischio legale e di originalità               |
| Px437 / Fixedsys Excelsior | Derivati da font di sistema proprietari                                   |
| Solo Pixel Operator        | Testi lunghi poco leggibili, soprattutto su mobile e con testo ingrandito |
| Solo font di sistema       | Perde l'identità 95; resa diversa per piattaforma                         |

## Conseguenze

- Font in preload: 24,1 kB (budget 25 kB in `.size-limit.js`). Gli altri stili di Plex (bold, corsivo, circa 21 kB ciascuno) e Pixel Operator regular si scaricano dal CSS quando servono.
- LCP mobile simulato a 1,2 s: i 21 kB di Plex sono nel percorso critico della frase della home. Se una pagina supera il budget, il piano B è `font-display: optional` per Plex, con un ADR.
- Su sistemi senza Arial o font compatibili (per esempio Android, che ha Roboto) il fallback non è metrico: lo swap può causare un piccolo spostamento. Il preload lo rende raro.
- Aggiornare Plex significa sostituire i file ufficiali e i loro SHA-256; aggiornare Pixel Operator significa sostituire gli originali in `fonts-src/` ed eseguire `npm run fonts`.

## Riferimenti

ASSETS.md, DESIGN_SYSTEM.md §4, LEGAL.md §6.
