# ADR-0008: i18n con dizionari tipizzati invece di react-i18next

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0

## Contesto

Due lingue (IT di default, EN), URL per lingua con slug tradotti, prerender, budget del JS iniziale stretto per Lighthouse 100 su mobile. I testi sono pochi, statici e scritti da noi; non servono ICU, caricamento remoto né rilevamento della lingua.

## Decisione

- Dizionari TypeScript per lingua: `it.ts` definisce la forma (`type Dictionary = typeof it`), `en.ts` è tipizzato come `Dictionary`. Una chiave mancante o in più è un **errore di compilazione**.
- La lingua viene **solo dal percorso** (`localeFromPathname`), quindi è deterministica tra prerender e client.
- API minima: `getDictionary(locale)` per meta e JSON-LD, `useT()` e `useLocale()` per i componenti.
- Dalla Fase 2 ogni app lazy ha i propri dizionari accanto al codice, così i testi stanno nel chunk dell'app.
- Formati con `Intl` (date, numeri, plurali).

## Alternative considerate

| Alternativa             | Pro                                          | Contro                                                                                                                                                       |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| react-i18next + i18next | Maturo, plurali, interpolazione, namespace   | ~15-18 kB gzip nel chunk iniziale; chiavi stringa non tipizzate senza configurazione extra; detector da disattivare; init asincrono da gestire nel prerender |
| FormatJS / react-intl   | ICU completo                                 | Ancora più pesante; ICU non serve                                                                                                                            |
| Lingui                  | Compilazione dei messaggi, leggero a runtime | Tooling di estrazione e macro Babel/SWC in più                                                                                                               |

## Conseguenze

- Runtime quasi nullo; tipizzazione completa delle chiavi.
- Interpolazione e plurali si scrivono come funzioni nel dizionario (`(n: number) => string`) con `Intl.PluralRules`.
- Da rivalutare se arrivassero più lingue o traduttori esterni.

## Riferimenti

I18N.md, `src/i18n/`.
