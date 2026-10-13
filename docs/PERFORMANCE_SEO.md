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

`npm run size` misura anche i componenti di `src/components/` con `@size-limit/esbuild`, nelle condizioni della build del sito: import per sottopercorso da React Aria, `optimize-locales` su it-IT ed en-US, `NODE_ENV` di produzione, React, React DOM e React Router esclusi (stanno nel chunk `framework`). Voci: totale JS, totale CSS, guscio del desktop della F2A (`Window`, `Taskbar`, `TaskbarButton`, `StartButton`, `DesktopIcons`) e ogni componente da solo. I componenti non entrano nella home fino alla F2A.

Regola della 1B: se un componente aggiunge più di 10 kB gzip al totale, il lavoro si ferma e si analizza il metafile prima di proseguire. I budget si fissano alla chiusura della fase.

| Componente aggiunto | Da solo (JS) | Incremento sul totale | Totale JS | Totale CSS | Guscio F2A | Home   |
| ------------------- | ------------ | --------------------- | --------- | ---------- | ---------- | ------ |
| Icon e Glyph (base) | 12,28 / 1,03 | –                     | 12,79     | 0,26       | –          | 110,81 |

Valori in kB gzip.
