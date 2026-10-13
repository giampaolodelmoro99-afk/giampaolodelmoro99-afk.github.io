# ADR-0005: Window manager scritto da zero con pointer events e Zustand

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0 (implementazione in Fase 2A/2B)

## Contesto

Il desktop deve gestire più finestre con drag, resize, focus, z-index, minimizza e massimizza, su mouse, penna e touch. Deve essere sincronizzato con React Router (deep link) e restare accessibile, leggero e compatibile con il prerender.

## Decisione

- **Interazioni** scritte da zero con Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `setPointerCapture`, `touch-action: none` solo sulle maniglie): un unico percorso per mouse, penna e touch.
- **Geometria** applicata con variabili CSS inline (`--window-x`, `--window-y`, `--window-w`, `--window-h`) e `transform` durante il drag (nessun reflow), con commit nello store a fine gesto.
- **Stato** in **Zustand**: finestre aperte, ordine (z-index derivato dalla posizione nell'array), geometria, minimizzate e massimizzate. Azioni pure testabili senza React.
- **URL come fonte di verità** della finestra attiva: lo store si sincronizza con React Router in entrambe le direzioni (ARCHITECTURE.md §5).
- **Primo render deterministico** dall'URL, uguale al prerender; la geometria persistita si applica dopo l'idratazione senza CLS.
- **Accessibilità**: comandi della titlebar su React Aria; alternative da tastiera e da menu per spostare e ridimensionare (WCAG 2.5.7); annunci live.

## Alternative considerate

| Alternativa                 | Perché scartata                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| react-rnd / react-draggable | Basate su mouse e touch separati, peso in più, poco controllo su a11y e reduced motion              |
| Redux Toolkit               | Più verboso e pesante per uno stato locale al desktop                                               |
| Solo Context + useReducer   | Re-render di tutto l'albero a ogni movimento; Zustand permette selettori fini                       |
| React Aria `useMove`        | Utile come primitiva; si valuta in F2A per il drag, ma la logica di finestre e z-index resta nostra |

## Conseguenze

- Più codice nostro da testare: unit sullo store, e2e su drag e resize con mouse e touch emulato.
- Zustand pesa circa 1 kB gzip; va nel chunk del desktop.

## Riferimenti

ARCHITECTURE.md §4-5, ADR-0007.
