# ADR-0014: Guscio statico del desktop e codice interattivo in un chunk separato

- **Stato**: Accettata
- **Data**: 2026-10-28
- **Fase**: 2A

## Contesto

Requisito della F2A (PLAN.md, decisione del 14/10/2026): il codice del desktop arriva in un chunk separato dopo il primo disegno, senza togliere contenuto dall'HTML prerenderizzato, e prima dell'idratazione le icone funzionano come link normali. A fine 1B la home pesava 110,81 kB gzip di JS iniziale (budget 115) e il guscio del desktop (Window, Taskbar, TaskbarButton, StartButton, DesktopIcons) 75 kB: insieme circa 186 kB.

Vincoli:

- CSP senza `'unsafe-inline'`: nessun attributo `style` nell'HTML prerenderizzato (ADR-0012, tipo C);
- Lighthouse 100 e budget di LCP, FCP, TBT e CLS (ADR-0013);
- primo render uguale al prerender (ADR-0005, ADR-0006);
- predisposizione per la 2B: stato serializzabile, modalità di layout, URL come stato iniziale.

## Decisione

1. **Guscio statico** (`src/features/desktop/shell/`). Ogni route prerenderizza il desktop in solo HTML e CSS:
   - icone come `<a href>` (il `Link` di React Router) verso le route delle app;
   - la finestra della route aperta (About sulla home), con il contenuto vero;
   - taskbar disegnata, con Start, Finestre e i pulsanti delle finestre `aria-hidden` finché non arriva il codice;
   - link della lingua e skip link funzionanti.

   Il guscio usa i CSS Modules dei componenti (stessi pixel) ma nessun componente React Aria, quindi niente attributi `style`.

2. **Desktop interattivo** (`src/features/desktop/app/DesktopApp.tsx`) in un chunk caricato con `import()`. L'import parte quando il modulo della route viene valutato sul client, cioè in parallelo all'idratazione. Contiene i componenti React Aria, lo store Zustand e l'`I18nProvider`.
3. **Swap**:
   - il desktop interattivo si monta **nascosto** accanto al guscio, dentro una transizione di React (`startTransition`), così il lavoro di rendering si spezza in pezzi interrompibili;
   - quando la griglia delle icone ha le sue righe, guscio e desktop si scambiano in un solo commit. La `GridList` di React Aria costruisce la collezione in due passaggi, e senza questa attesa a 375 px la finestra saltava di 59 px (CLS 0,069);
   - il focus passa all'elemento corrispondente (`data-focus-key`: skip link, icona, corpo della finestra, link della lingua).
4. **Icone da uno sprite SVG** (`src/components/Icon/iconSprite.svg`, generato da `npm run icons`): `Icon` disegna `<use href="…/iconSprite-<hash>.svg#nome-misura">`.
   - I dati delle icone escono dal JavaScript ovunque: nel guscio e nel desktop interattivo.
   - Il contorno usa `currentColor`, che `Icon` lega a `--color-pixel-outline`: bianco in alto contrasto, `CanvasText` in forced-colors.
   - Gli altri colori sono quelli della tavolozza, uguali nei due temi. Un test confronta lo sprite con i token.
   - Lo sprite non ha né `<style>` né attributi `style`: la CSP non entra in gioco.
5. **`I18nProvider` nel chunk del desktop, non nel root.** Il guscio statico non usa React Aria. La 404 usa il `Link` di React Aria, che non ha testi propri: un test dimostra che il suo HTML è identico con qualunque lingua di React Aria, e anche senza `I18nProvider`.
6. **Meta delle app nel bundle iniziale.** Valgono circa 1,2 kB. Toglierli richiederebbe un `loader` della route e quindi una richiesta `.data` a ogni navigazione lato client: un effetto sulla navigazione che il requisito esclude.
7. **`build.modulePreload: false`** in Vite. L'aiuto di Vite per gli import dinamici precaricherebbe di nuovo i moduli già caricati dal bootstrap rinviato, che non sono nell'HTML come `<link>`. Il chunk del desktop importa da sé le sue dipendenze.
8. **Sotto i 768 px**, fino alla modalità mobile della 2B, le icone stanno sopra la finestra, in uno spazio che scorre.

## Numeri (gzip, 28/10/2026, `npm run size`)

| Misura                               | Fine 1B   | Prima dello sprite | Decisione                       |
| ------------------------------------ | --------- | ------------------ | ------------------------------- |
| JS iniziale della home               | 110,81 kB | 132,58 kB          | **117,8 kB**                    |
| Chunk del desktop dopo l'idratazione | –         | –                  | **56,08 kB**                    |
| Sprite delle icone                   | –         | –                  | **12,64 kB** (file SVG, non JS) |
| Componenti, totale JS                | 98,13 kB  | 99,43 kB           | **85,12 kB**                    |
| Guscio del desktop F2A (componenti)  | 74,92 kB  | –                  | **61,3 kB**                     |
| CSS iniziale della home              | 3,96 kB   | 3,56 kB            | **3,57 kB**                     |

**Ripartizione del JS iniziale (117,8 kB)**, e perché i kB oltre i 115 restano:

| Parte                                        | kB     | Perché resta                                                                        |
| -------------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| `framework` (React, React DOM, React Router) | 107,45 | prezzo della modalità framework con prerender e idratazione (PERFORMANCE_SEO.md §1) |
| runtime di Rolldown, manifest, root, entry   | 2,16   | servono all'idratazione                                                             |
| `routeMap`                                   | 0,48   | route e slug delle 29 pagine                                                        |
| modulo della route del desktop               | 2,0    | guscio, swap, focus                                                                 |
| chunk condiviso con il desktop               | 3,3    | `Icon` (senza dati), glifi (0,86), contenuto delle finestre, registro delle app     |
| dizionari IT ed EN                           | 2,47   | testi del guscio (bio, etichette); i meta delle app (1,2) restano per il punto 6    |

**Long task** con CPU 4× (Pixel 7): prima della transizione, una long task di 262–346 ms, sopra la soglia di 200. Con `startTransition`, 99–109 ms.

## Budget (si alzano solo con un ADR)

- **JS iniziale della home: da 115 a 124 kB** (117,8 più il 5%).
- **Chunk del desktop: 59 kB** (56,08 più il 5%).
- **Sprite delle icone: 14 kB** (12,64 più il 5%).
- Componenti: invariati (JS 99 kB, CSS 5 kB, guscio 75 kB), con margine ampio grazie allo sprite.

## Alternative considerate

| Alternativa                                   | Pro                             | Contro                                                                                                                            | Perché scartata                                                 |
| --------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Tutto il desktop nel chunk della route        | Nessuno swap                    | JS iniziale circa 186 kB; le icone (GridList) non sono link prima dell'idratazione; attributi `style` di React Aria nel prerender | Viola il requisito e la CSP                                     |
| `React.lazy` con Suspense nel prerender       | Codice separato                 | Il prerender conterrebbe il markup di React Aria con attributi `style` bloccati dalla CSP, e niente link prima dell'idratazione   | Viola la CSP e il requisito sui link                            |
| Guscio con `Icon` e i dati delle icone nel JS | Nessun asset nuovo              | +13,7 kB nel JS iniziale (132,58 kB)                                                                                              | Peso; con lo sprite i dati escono anche dal desktop interattivo |
| `I18nProvider` nel root                       | Lingua di React Aria già pronta | +1,43 kB (I18nProvider e SSRProvider) nel JS iniziale, senza un componente che ne abbia bisogno prima dello swap                  | Non serve: lo dimostra il test sulla 404                        |
| Meta delle app caricati con un `loader`       | −1,2 kB                         | Richiesta `.data` a ogni navigazione, dipendenza da single fetch                                                                  | Effetto sulla navigazione                                       |
| Swap senza attesa delle righe della griglia   | Più semplice                    | CLS 0,069 a 375 px                                                                                                                | Viola CLS 0                                                     |

## Conseguenze

- Positive:
  - il contenuto prerenderizzato è visibile e leggibile subito, e prima dell'idratazione funzionano link e skip link;
  - nessun attributo `style` nel prerender;
  - i dati delle icone non sono più nel JavaScript (−14 kB sui componenti).
- Negative e rischi:
  - due rappresentazioni del desktop (guscio e interattivo) da tenere allineate. Mitigazioni: stessi CSS Modules, e2e che confronta le posizioni prima e dopo lo swap, CLS misurato;
  - una richiesta in più (lo sprite, 12,6 kB), che non blocca il rendering e non è l'elemento LCP;
  - prima dello swap Start e Finestre non rispondono (poche centinaia di ms dopo `load`);
  - il budget del JS iniziale sale di 9 kB.
- Cosa va verificato e quando rivalutare:
  - `tests/e2e/desktop.spec.ts` (swap con le stesse posizioni, apertura senza ricaricare, lingua di React Aria), `performance.spec.ts` (CLS, long task, INP), `no-javascript.spec.ts` (link prima dell'idratazione);
  - rivalutare in 2B (modalità mobile, persistenza) e se React Router offrirà un'idratazione parziale.

## Riferimenti

- `src/features/desktop/`, `src/components/Icon/`, `scripts/lib/icons.mjs`, `.size-limit.js`, `vite.config.ts`
- PERFORMANCE_SEO.md §1, ARCHITECTURE.md §4, ADR-0005, ADR-0006, ADR-0012, ADR-0013
