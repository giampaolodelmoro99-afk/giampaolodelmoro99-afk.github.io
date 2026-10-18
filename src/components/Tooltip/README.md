# Tooltip

Suggerimento breve su fondo giallo chiaro, senza freccia, come nell'interfaccia del 95 (pacchetto: `docs/design/gdm95/components/Tooltip/`).

- Compare con l'hover dopo 600 ms (`tooltipDelay`) e subito con il focus da tastiera; Esc lo chiude.
- **Solo hover e focus.** In touch non esiste hover: il tooltip non compare al tocco e **nessun contenuto può stare solo nel tooltip**. Lo stesso testo deve essere anche nell'etichetta visibile, nel nome accessibile (`aria-label`) o in chiaro accanto al controllo. Decisione del 14/10/2026.
- `children` è un solo elemento focalizzabile di React Aria (di solito `Button`).
- Il testo è un'etichetta breve: font dei controlli (Pixel Operator), non una frase da leggere.
