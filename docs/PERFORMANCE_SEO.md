# Performance e SEO

## 1. Budget

| Metrica               | Budget             | Misura Fase 0                          | Come si verifica |
| --------------------- | ------------------ | -------------------------------------- | ---------------- |
| JS iniziale (gzip)    | ≤ 115 kB           | 112 kB                                 | `npm run size`   |
| CSS iniziale (gzip)   | ≤ 12 kB            | 1,3 kB                                 | `npm run size`   |
| Font in preload       | ≤ 25 kB (dalla F1) | 24,1 kB (F1A)                          | `npm run size`   |
| LCP (mobile simulato) | ≤ 1,2 s            | 0,9 s (F0); 1,2 s (F1A, frase in Plex) | Lighthouse CI    |
| FCP (mobile simulato) | ≤ 1,0 s            | 0,9 s                                  | Lighthouse CI    |
| TBT (mobile simulato) | ≤ 50 ms            | 0 ms                                   | Lighthouse CI    |
| CLS                   | ≤ 0,01             | 0                                      | Lighthouse CI    |

**Nota sulla Fase 0.** Il piano prevedeva 90 kB di JS iniziale. La misura reale con React 19 + React Router 8 è 112 kB gzip (React DOM da solo ≈ 66 kB), quindi il budget è fissato a 115 kB, la misura più un margine minimo. Ogni app successiva va in lazy loading e non deve far crescere il chunk iniziale.

### Analisi del bundle (Fase 1A)

`npm run analyze` costruisce il sito con `rollup-plugin-visualizer` (solo l'environment `client`) e scrive la treemap in `build/stats.html`, fuori da `build/client`. Misura del 13/10/2026, JS iniziale della home 112,2 kB gzip:

| Chunk                   | gzip    | Contenuto                                                                |
| ----------------------- | ------- | ------------------------------------------------------------------------ |
| `entry.client`          | 66,3 kB | React DOM (client e riconciliatore), scheduler                           |
| `jsx-runtime`           | 39,1 kB | React e il router di React Router (data router, single fetch, hydration) |
| `routeMap`              | 4,1 kB  | parte DOM di React Router (`Link`, `NavLink`), più `routeMap.ts`         |
| route, root e dizionari | ≈ 3 kB  | codice del sito; i due dizionari valgono 0,9 kB gzip in tutto            |

**Conclusione: non riducibile in modo significativo.**

- React DOM e il nucleo di React Router sono il prezzo della modalità framework con prerender e idratazione (ADR-0006). Le alternative (Preact, un router scritto in casa) rompono React Aria Components o l'idratazione del prerender.
- Dividere i dizionari per lingua farebbe risparmiare circa 0,4 kB gzip al costo di un caricamento asincrono dei testi: non vale la complessità.
- Il JS parte dopo l'evento `load`, quindi non pesa su LCP né su TBT (Lighthouse mobile 100).
- Il budget resta 115 kB. Dalla Fase 1B React Aria entra solo nei chunk delle app, con `@react-aria/optimize-locales-plugin` limitato a italiano e inglese; size-limit avrà una voce per i chunk dei componenti.

### Chunk `framework` (Fase 1B)

Con il `Link` di React Aria nella 404, Rolldown divideva React DOM e React Router in più chunk condivisi tra la home e la route 404: stessi moduli, ma la home passava da 112,27 a 114,04 kB gzip per il solo costo della divisione. Dal 14/10/2026 un gruppo `codeSplitting` in `vite.config.ts` tiene React, React DOM, React Router e scheduler in un unico chunk (ADR-0012). JS iniziale della home: **110,81 kB**.

| Chunk                        | gzip     | Contenuto                                        |
| ---------------------------- | -------- | ------------------------------------------------ |
| `framework`                  | 107,3 kB | React, React DOM, scheduler, React Router        |
| route, root, manifest, rest  | ≈ 3,5 kB | codice del sito, dizionari, runtime di Rolldown  |
| `not-found` (solo sulla 404) | 11,6 kB  | React Aria: `Link`, `usePress`, `RouterProvider` |

Gli import da React Aria vanno sempre per sottopercorso (`react-aria-components/Button`): Oxlint vieta l'import dalla radice, con un'unica eccezione per `RouterProvider` (ADR-0012).

### Peso dei componenti (Fase 1B)

`npm run size` misura anche i componenti di `src/components/` con `@size-limit/esbuild`, nelle condizioni della build del sito: import per sottopercorso da React Aria, `optimize-locales` su it-IT ed en-US, `NODE_ENV` di produzione, React, React DOM e React Router esclusi (stanno nel chunk `framework`). Voci: totale JS, totale CSS, guscio del desktop della F2A (`Window`, `Taskbar`, `TaskbarButton`, `StartButton`, `DesktopIcons`), base di React Aria, Icon importato dall'indice e ogni componente dalla sua cartella. I componenti non entrano nella home fino alla F2A.

In esbuild `optimize-locales` 2.1.0 (con unplugin 2.3) risolve le traduzioni escluse verso `empty.js` in un namespace che non sa caricare; `.size-limit.js` aggiunge un piccolo loader per quel namespace, così la misura resta con le sole lingue it-IT ed en-US (verificato: nel bundle restano solo le stringhe inglesi e italiane). In Vite il plugin funziona senza correzioni.

**Base di React Aria.** Il primo componente React Aria paga una volta sola la base condivisa: `usePress`, focus da tastiera, hover, utilità DOM, SSR, LiveAnnouncer. Il `Button` di React Aria da solo pesa **13,02 kB** gzip (voce "Base React Aria"); il nostro codice del Button è sotto 1 kB. La stessa base è già nel chunk della 404, con il `Link` di React Aria (11,7 kB). Accettata il 14/10/2026 come costo una tantum: i componenti successivi la riusano.

**Base delle collezioni di React Aria.** Il primo componente con una collezione (Tabs: `TabList`, `Tab`, `TabPanel`) paga una volta sola selezione e collezioni di React Stately, `Document` e `BaseCollection`, `useSelectableCollection` e `useSelectableItem`, `CollectionBuilder` e navigazione da tastiera: **+17,48 kB** gzip sul totale, con il codice delle nostre Tabs sotto 1 kB. La riusano Select (ListBox), MenuBar e StartButton (Menu) e DesktopIcon (GridList). Accettata il 14/10/2026 come seconda base una tantum.

**Base degli overlay (prevista).** Select porterà Popover, posizionamento, FocusScope e chiusura con clic esterno, stimati in circa +16 kB. Si accetta come terza base solo se il metafile conferma che l'eccedenza è codice condiviso e che la parte specifica del Select resta sotto i 10 kB.

**Regola della 1B.** Ogni componente si misura come incremento sul totale. Se un componente aggiunge più di 10 kB gzip, il lavoro si ferma e si analizza il metafile prima di proseguire. I budget si fissano alla chiusura della fase.

**Indice dei componenti.** Importare anche solo Icon da `src/components/index.ts` costa circa 0,6 kB in più che dalla sua cartella: l'indice trascina codice di React Aria eseguito al caricamento del modulo. La voce "Icon importato dall'indice" lo tiene d'occhio fino alla decisione della F2A (`sideEffects` o import dalle cartelle).

| Componente aggiunto | Da solo (JS)          | Incremento sul totale                 | Totale JS | Totale CSS | Icon dall'indice | Guscio F2A | Home   |
| ------------------- | --------------------- | ------------------------------------- | --------- | ---------- | ---------------- | ---------- | ------ |
| Icon e Glyph        | 12,28 / 1,03          | –                                     | 12,79     | 0,26       | –                | –          | 110,81 |
| Button              | 26,95 (Icon compresa) | +14,58 (base React Aria 13,02)        | 27,37     | 0,86       | 12,89            | –          | 110,81 |
| TextField           | 13,24                 | +4,45                                 | 31,82     | 1,16       | 13,20            | –          | 110,81 |
| TextArea            | 13,64                 | +0,45                                 | 32,27     | 1,53       | 13,58            | –          | 110,81 |
| Checkbox            | 16,54                 | +2,17                                 | 34,44     | 1,75       | 13,80            | –          | 110,81 |
| RadioGroup e Radio  | 13,24 / 15,14         | +4,22                                 | 38,66     | 1,93       | 14,18            | –          | 110,81 |
| GroupBox            | 0,39                  | +0,17                                 | 38,83     | 2,00       | 14,26            | –          | 110,81 |
| ProgressBar         | 6,43                  | +2,43                                 | 41,26     | 2,35       | 14,71            | –          | 110,81 |
| StatusBar           | 5,96                  | +0,34                                 | 41,60     | 2,44       | 14,80            | –          | 110,81 |
| ScrollArea          | 0,78                  | +0,09                                 | 41,69     | 2,49       | 14,85            | –          | 110,81 |
| Tooltip             | 14,21                 | +6,19 (primo overlay: posizionamento) | 47,88     | 2,60       | 14,97            | –          | 110,81 |
| Tabs                | 32,13                 | +17,48 (base collezioni)              | 65,36     | 2,85       | 15,22            | –          | 110,81 |

Valori in kB gzip.
