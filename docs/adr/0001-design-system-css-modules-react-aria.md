# ADR-0001: Design system con CSS Modules, token CSS e React Aria Components

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0 (implementazione in Fase 1)

## Contesto

La v1 usava MUI con override pesanti per imitare il 95: bundle grande, CSS iniettato a runtime (che obbligava a `style-src 'unsafe-inline'`) e stili sparsi nella prop `sx`. La v2 deve avere Lighthouse 100 su mobile, CSP senza `unsafe-inline`, accessibilità WCAG 2.2 AA e un'estetica 95 originale.

## Decisione

- **Stili**: CSS Modules, un file per componente. Valori solo da variabili CSS in `src/styles/tokens.css`. Nessuna libreria CSS-in-JS.
- **Comportamento e accessibilità**: React Aria Components (Adobe), senza stili propri. Lo stile si applica tramite gli attributi di stato (`data-pressed`, `data-focus-visible`, `data-selected`…).
- **Controlli**: Stylelint con `stylelint-declaration-strict-value` vieta colori, spaziature, font, z-index e durate letterali nei CSS Modules; `color-no-hex` fuori da `tokens.css`.
- **Unica eccezione agli stili inline**: variabili CSS con valori dinamici (posizione e dimensione delle finestre).

## Alternative considerate

| Alternativa                            | Perché scartata                                                                                                                               |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| MUI / Chakra con tema                  | Bundle e CSS a runtime; estetica da forzare; CSP con `unsafe-inline`                                                                          |
| 98.css / librerie "retro" esistenti    | Riproducono asset e metriche di Windows; poco controllo su a11y e responsive; licenze e originalità da verificare                             |
| Tailwind                               | Classi utility poco leggibili per bevel complessi; i token sarebbero comunque variabili; un livello di tooling in più                         |
| Radix Primitives                       | Valida, ma React Aria copre più pattern (menu, listbox, drag and drop, gestione di touch e penna) e ha un modello di interazione più completo |
| Componenti accessibili scritti da zero | Costo e rischio alti per menu, listbox e dialog                                                                                               |

## Conseguenze

- CSS statico estratto in build: compatibile con la CSP rigorosa e cacheabile.
- React Aria aggiunge peso al chunk delle app che lo usano (da misurare in F1 con size-limit; i componenti si importano singolarmente).
- I token sono il contratto tra design (Claude Design) e codice.

## Riferimenti

DESIGN_SYSTEM.md, `.stylelintrc.json`, react-spectrum.adobe.com/react-aria.
