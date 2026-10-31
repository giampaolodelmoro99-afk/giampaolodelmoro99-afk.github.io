# ADR-0018: Soglie di Lighthouse sulle metriche "buone" di Google

- **Stato**: Accettata
- **Data**: 2026-10-31
- **Fase**: 2A
- **Sostituisce in parte**: ADR-0013, per le soglie e il numero di esecuzioni. Restano validi la preview compressa come GitHub Pages e i due livelli (commit e chiusura).

## Contesto

ADR-0013 chiedeva Performance ≥ 95 a ogni commit e 100 su mobile e desktop a chiusura di fase, con budget stretti su LCP e FCP mobile (1350 e 1050 ms, cioè la mediana più uno "scatto" di 150 ms della simulazione).

Nella F2A la home è diventata un desktop con icone, finestra e taskbar. Le misure (28–31/10/2026) mostrano che la simulazione mobile oscilla tra due valori, 1202 e 1352 ms di LCP, a seconda dell'ordine degli URL e dei tempi osservati. Con la preview in HTTP/1.1, Lantern modella 6 connessioni: documento, due font, due fogli di stile e lo sprite le occupano tutte, e un settimo file (Pixel Operator regular) a volte cade prima dell'LCP e aggiunge un viaggio. GitHub Pages serve in HTTP/2, dove il limite non esiste. Il budget di 1350 ms finiva sul bordo dello scatto e faceva fallire la CI senza un peggioramento reale del sito, e inseguire queste oscillazioni costava molto tempo.

## Decisione

1. **Categorie**: Accessibility, Best Practices e SEO a 100, mobile e desktop, a ogni push e a chiusura.
2. **Performance**:
   - a ogni push in CI: almeno **90**, mobile e desktop;
   - a chiusura di fase e alla release: **desktop 100**, **mobile almeno 90**.
3. **Metriche**, alle soglie "buone" di Google (Core Web Vitals), uguali nei due livelli e nei due preset:
   - LCP ≤ 2500 ms;
   - TBT ≤ 200 ms (al posto dell'INP, che Lighthouse non misura al caricamento);
   - CLS ≤ 0,1.

   Tolti i limiti stretti su FCP e su LCP mobile.

4. **Esecuzioni**: 3, con la mediana, in entrambi i livelli.
5. **Lighthouse in locale**: non si lancia durante il lavoro, basta la CI. A fine fase si fa una sola misura locale (3 esecuzioni, mediana), e non si indagano le differenze che restano dentro le soglie.
6. **URL**: `/`, `/en/`, `/profilo/` ed `/en/projects/` (home e una route di app per lingua).

## Esiti delle rimisure della F2A (le correzioni elencate in ADR-0013)

| Correzione di ADR-0013           | Misura (mobile, mediana)                                                                                          | Esito                                                                                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Idratazione rinviata dopo `load` | Senza rinvio: Performance 99, LCP 1,95–2,10 s, FCP 1,36 s. Con il rinvio: Performance 100, LCP 1,20 s, FCP 0,90 s | **Resta**. I `modulepreload` restano nell'HTML con `media="not all"`: il browser non li scarica e React non li reinserisce all'idratazione, cosa che in WebKit produceva avvisi di preload non usati |
| Preload di Pixel Operator bold   | Con anche Pixel regular in preload: CLS 0 ma LCP 1,35 s (27,2 kB di font, oltre il budget di 25)                  | **Resta** (Pixel bold e IBM Plex Sans regular). Sotto i 768 px le celle delle icone hanno altezza fissa, così il cambio di font non sposta la finestra (CLS da 0,011 a 0,0001)                       |
| IBM Plex Sans bold sulla home    | Con il sottotitolo in grassetto: LCP 1,35 s e FCP 1,05 s (21 kB in più nel percorso critico)                      | Sottotitolo di About in peso normale: LCP 1,20 s, FCP 0,90 s                                                                                                                                         |

## Alternative considerate

| Alternativa                         | Pro                                   | Contro                                                                      | Perché scartata                             |
| ----------------------------------- | ------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------- |
| Tenere ADR-0013                     | Massima severità                      | Falsi rossi sullo scatto della simulazione; tempo speso a inseguire Lantern | Il costo supera il valore                   |
| Preview in HTTP/2 (TLS locale)      | Simulazione più vicina a GitHub Pages | Certificati di sviluppo, una preview diversa per gli e2e, più manutenzione  | Non serve con soglie sulle metriche "buone" |
| Alzare solo il budget di LCP mobile | Cambio minimo                         | Resta un budget sul bordo dello scatto e resta FCP                          | Non risolve la causa                        |

## Conseguenze

- Positive: la CI fallisce per peggioramenti reali (fuori dalle soglie di Google), non per l'oscillazione della simulazione; meno tempo speso in misure locali.
- Negative: una regressione di 150–300 ms su mobile passa la CI se resta dentro le soglie. Mitigazioni: size-limit sul JS e sul CSS a ogni commit, e2e di prestazioni (long task, CLS, INP alla prima interazione), misura locale a fine fase riportata nella retrospettiva.
- Verifica: `scripts/lib/lighthouse.test.mjs` controlla le quattro configurazioni e i workflow.

## Riferimenti

- `lighthouserc.{mobile,desktop}{,.strict}.json`, `scripts/lib/lighthouse.test.mjs`, `.github/workflows/ci.yml`, `.claude/skills/close-phase/SKILL.md`
- ADR-0006, ADR-0013, ADR-0014, PERFORMANCE_SEO.md §1–2
- web.dev/articles/vitals (soglie "buone": LCP 2,5 s, CLS 0,1; INP 200 ms)
