# Retrospettiva Fase 2A: window manager desktop

- **Branch**: `phase/02a-window-manager`
- **Periodo**: 2026-10-28 → 2026-11-01
- **Piano**: [phase-02a-plan.md](phase-02a-plan.md)
- **Ultima CI del branch**: **da verificare dopo il push** (la 2A-1 aveva la CI verde; la 2A-2 non è ancora stata pushata). È il cancello finale per il merge (`close-phase` §6).

## 1. Obiettivi e risultato

| Obiettivo del piano                                                                | Stato          | Note                                                                                                                              |
| ---------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Guscio statico prerenderizzato e desktop in un chunk dopo l'idratazione (ADR-0014) | fatto          | guscio e desktop interattivo coincidono al pixel (corretto in chiusura, §3); CLS 0                                                |
| Route delle app con slug v1 e provvisori, 27 pagine prerenderizzate                | fatto          | title e description delle app provvisori fino alla F3A (CONTENT.md)                                                               |
| Attributi `style` fuori dal prerender (ADR-0015)                                   | fatto          | Glyph con classi generate; CSP reale sulla home con Esegui e Spegni                                                               |
| Store Zustand e window manager                                                     | fatto          | riduci, ingrandisci, trascinamento a contorno, otto maniglie, cascata dentro l'area, Sposta e Ridimensiona da tastiera e al tocco |
| Scorciatoie, selettore, menu Start, menu contestuale                               | fatto          | Alt+W, Alt+Spazio, Alt+trattino; pressione lunga; `aria-haspopup` su Esegui e Spegni                                              |
| Esegui, Spegni, congedo e riavvio                                                  | fatto          | chunk caricati all'apertura e precaricati nel tempo libero; nessuna ricarica della pagina                                         |
| Animazioni delle finestre                                                          | fatto          | `transform` e `opacity`, durate dai token, movimento ridotto                                                                      |
| e2e e regressione visiva                                                           | fatto, ridotto | story `visual` in due combinazioni più le pagine del desktop, come da ADR-0019, invece di D01–D12 nei due temi                    |
| ADR-0016 e documenti                                                               | fatto          | con i rinvii alla 2B dei punti non bloccanti della review                                                                         |
| Form Contatti, piano B (solo documenti)                                            | fatto          | ADR-0017, implementazione in F3B                                                                                                  |
| QA su Android reale                                                                | **da fare**    | la fa Gianpaolo (QA_CHECKLIST §2.1, ultima voce, e §7)                                                                            |

## 2. Cosa è andato bene

- **Il guscio statico ha tenuto le promesse**: Lighthouse a 100 in tutte le categorie su mobile e desktop, CLS 0, con un desktop interattivo di 73,5 kB caricato dopo l'idratazione. Il job «E2E prestazioni» con CPU 4× resta lontano dalle soglie (task più lunga 102–106 ms, INP 120 ms).
- **La regressione visiva ha trovato bug veri**, non solo differenze: lo spostamento di 8 px del titolo allo swap, la cascata che usciva dallo schermo a 768 px.
- **Gli e2e hanno trovato bug che i test unitari non vedevano**: il secondo trascinamento annullato dal doppio clic del browser, la chiusura senza animazione durante l'apertura, l'opzione vuota senza nome in Esegui.
- **Le quattro review hanno trovato cose diverse e complementari** (§3): l'ordine di Tab e i link di About (code-reviewer), l'errore di Esegui non annunciato e il nome del collegamento della lingua (a11y-auditor), le catene di vulnerabilità nuove (security-auditor), lo stato dei metadati e dei testi del desktop (content-reviewer).
- **Le decisioni sulle soglie sono state prese con i numeri**: budget provvisori con una condizione misurabile (ADR-0020), poi fissati alla misura più il 5% perché le prestazioni lo permettevano.

## 3. Cosa non è andato bene, e come è stato corretto

- **Budget superati senza accorgermene.** Il chunk del desktop ha superato i 59 kB per più commit, e il CSS dei componenti i 5 kB, perché leggevo solo le prime righe di `npm run size`. L'ha scoperto il proprietario; ADR-0020 e, da allora, `npm run size` letto per intero prima di ogni commit.
- **Guscio statico non aggiornato** dopo il menu della finestra (aaf4909): l'icona del titolo da 16 px contro il pulsante da 24 px spostava il titolo di 8 px allo swap. Trovato solo rigenerando le schermate (d945112). Lezione: ogni cambiamento della barra del titolo o della taskbar va riportato nel guscio, e conviene un test che confronti guscio e desktop.
- **Test e2e mai eseguiti a 768 e 1024 px durante il lavoro**: in locale giravano solo Chromium a 1440 e 375 px e Pixel 7. Il menu contestuale usava coordinate pensate per 1440 px e il test dell'angolo presupponeva spazio a destra. La matrice completa li ha trovati a fine tappa; corretti con coordinate relative all'area.
- **Coverage dei rami scesa al 75,12%**, scoperta solo alla chiusura: gli hook dei gesti e del menu contestuale avevano solo e2e. Aggiunti i test unitari (82,96%). Lezione: lanciare la coverage almeno a ogni commit che aggiunge un hook.
- **Bug di comportamento trovati dalla review e dalla QA nel browser**:
  - focus perso attivando una finestra con il puntatore;
  - pulsanti delle finestre inattive nell'ordine di Tab, contro ADR-0016;
  - link di About che cambiavano l'URL e azzeravano il desktop;
  - nessuna gestione dei chunk non caricati;
  - tasti persi alla prima apertura di Esegui (chunk non precaricato, come invece prevedeva il piano);
  - Invio vuoto in Esegui con errore `Non trovo ""`;
  - taskbar a 320 px con i pulsanti sopra lingua e orologio già con due finestre.

  Tutti corretti in 1eadcfd con test.

- **Errori miei nella comunicazione**: ho detto al proprietario che il superamento del CSS non veniva dai componenti nuovi, e ho dovuto correggermi dopo aver capito come size-limit misura il CSS (importa l'indice e con lui tutti i fogli).
- **Build parziali durante le verifiche**: `build:site` lanciato mentre giravano gli e2e o gli agenti ha tolto `build/client/storybook` e fatto fallire centinaia di test e2e. Nessun bug nel codice; la regola resta `npm run build` completo prima della matrice.
- **Ambiente**: i comandi che riscrivono o ripristinano file con `git` e alcuni script Python sono stati bloccati dai permessi; ripiegato su Edit. Il confronto tra commit con un worktree non è stato possibile.

## 4. Metriche

| Metrica                                                     | Valore                                                                  | Fase 1B                      |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------- |
| Test unitari (numero)                                       | 572 in 63 file                                                          | 311 in 40 file               |
| Coverage statement / rami / funzioni / righe                | 92,77% / 82,96% / 93,52% / 94,81%                                       | 98,63 / 91,4 / 98,63 / 99,05 |
| Test prerender (numero)                                     | 380 (27 pagine del sito più Storybook)                                  | 40                           |
| Test e2e (numero, progetti)                                 | 873 su 10 progetti, più 6 di prestazioni                                | 709                          |
| Screenshot di riferimento                                   | 104 (pagine e story `visual` in due combinazioni, ADR-0019)             | 247                          |
| Lighthouse mobile `/`, `/en/`, `/profilo/`, `/en/projects/` | 100 / 100 / 100 / 100; LCP 1,35 s, FCP 1,05 s, TBT 34–36 ms, CLS 0      | 100; LCP 1,35 s              |
| Lighthouse desktop, stesse route                            | 100 / 100 / 100 / 100; LCP 0,36–0,37 s, TBT 0, CLS 0                    | 100; LCP 0,33 s              |
| JS iniziale della home gzip                                 | 120,59 kB (budget 124, ADR-0014)                                        | 110,81 kB (budget 115)       |
| Chunk del desktop gzip                                      | 73,50 kB (budget 77, ADR-0020)                                          | –                            |
| Chunk di Esegui / Spegni / congedo gzip                     | 4,67 / 7,09 / 0,51 kB (budget 5 / 8 / 1)                                | –                            |
| CSS iniziale della home gzip                                | 3,84 kB (budget 12)                                                     | 3,96 kB                      |
| Componenti JS / CSS gzip                                    | 86,99 / 5,69 kB (budget 99 / 6); con i componenti F2A 91,39 kB          | 98,13 / 4,63 kB              |
| Prestazioni con CPU 4×                                      | task più lunga 102–106 ms, INP del primo clic 120 ms, swap entro 764 ms | –                            |
| Violazioni axe                                              | 0 (story nelle quattro combinazioni, pagine)                            | 0                            |
| `npm audit --omit=dev`                                      | 0 vulnerabilità (26 di sviluppo, ADR-0011)                              | 0                            |

La coverage scende rispetto alla 1B perché il desktop ha molto codice di interazione (gesti, focus, timer) coperto soprattutto dagli e2e; resta sopra la soglia dell'80%.

## 5. QA manuale

01/11/2026, build completa e `scripts/preview.mjs`:

- **Chrome (Claude in Chrome), 1512×784**: menu contestuale con il tasto destro (il primo clic, prima della fine dello swap, non apre il menu; dopo funziona), selettore con Alt+W, menu Start, Esegui (suggerimenti, frecce, Invio), Spegni › congedo (titolo della scheda «Spento · Gianpaolo Del Moro», focus su Riaccendi), Riaccendi (desktop vuoto, focus sulle icone), `/en/projects/`. Console senza errori, nessuna origine esterna. Trovati e corretti i tasti persi in Esegui e l'Invio vuoto.
- **Playwright nel container** (in Chrome il ridimensionamento della finestra non ha effetto): 320×640, 375×667, 640×320, 667×375 con il touch di Pixel 7 e movimento ridotto: nessuno scroll orizzontale, nessun errore in console, tutti i target ≥ 44 px tranne lo skip link nascosto. Trovata e corretta la taskbar a 320 px.
- **Animazioni**: misurate a 1440 e 375 px (quattro scatti in 200 ms) e con movimento ridotto (nessuna).
- **Da fare a mano** (non possibili qui): NVDA + Firefox, VoiceOver + Safari iOS, `forced-colors` su Windows, zoom al 200% e 400%, Android reale (QA_CHECKLIST §2.1 e §7).

## 6. Decisioni e ADR

- ADR-0014: caricamento separato del desktop (JS iniziale ≤ 124 kB).
- ADR-0015: attributi `style` fuori dal prerender.
- ADR-0016: accessibilità del desktop a finestre, con le differenze dal piano (focus al corpo nella riattivazione, selettore con focus reale) e i rinvii alla 2B.
- ADR-0017: hCaptcha su consenso nel form Contatti (F3B).
- ADR-0018: soglie Lighthouse sulle metriche buone di Google, una misura locale a fine fase.
- ADR-0019: verifiche proporzionate durante la fase.
- ADR-0020: budget del chunk del desktop (77 kB), del CSS dei componenti (6 kB) e dei chunk di Esegui, Spegni e congedo.
- ADR-0011: verifica della 2A sulle vulnerabilità di sviluppo.

## 7. Debito tecnico e rischi aperti

- **Rinvii alla 2B** (ADR-0016): menu della finestra sotto i 768 px, focus su `MoveControls` durante Sposta, voce scelta del selettore e Radio in `forced-colors`, focus iniziale di Spegni, Maiusc+Alt su Windows, taskbar stretta (ADR-0007).
- **Memoria del focus per finestra** (riattivando si va al corpo): da rivalutare con i contenuti reali.
- **Testi del desktop in bozza** (CONTENT.md §5): il saluto del congedo va approvato da Gianpaolo; i suggerimenti del content-reviewer sono per la F3A.
- **Componenti F2A fuori dai totali con budget** di size-limit (JS 91,39 kB se inclusi): da decidere se includerli.
- **Suggerimenti della code review non applicati**: listener ricreati a ogni render (handler inline), pulizia dei listener se una finestra si smonta durante un trascinamento, breakpoint di 768 px scritto anche in JS, rami morti nel guscio, id duplicati per un frame durante lo swap, pressione lunga su un'icona non coperta da e2e.
- **Lint**: restano 5 warning `no-await-in-loop` negli e2e, dove la sequenza è voluta.
- **LEGAL.md §2**: le chiavi sessionStorage che React Router potrebbe usare (`remix-router-transitions`, `react-router-manifest-version`) non sono scritte con la configurazione attuale; da annotare o coprire con un e2e sullo storage in 2B, quando arriva la persistenza.
- **Disclaimer Microsoft** prima del primo tag `v*` (F3B).

## 8. Lezioni sul lavoro con l'AI

- **Leggere tutto l'output dei controlli**, non le prime righe: due budget superati sono passati inosservati per giorni. Da ora `npm run size` per intero prima di ogni commit e stop se un budget è superato (memoria del progetto).
- **Le verifiche ridotte durante la fase (ADR-0019) spostano i problemi alla chiusura**: e2e a 768 e 1024 px, coverage e axe in pagina hanno trovato tutto in fondo. Il costo è stato accettabile, ma conviene lanciare la matrice completa a ogni fine tappa (come alla fermata della 2A-1), non solo a fine fase.
- **Un cambiamento a un componente del guscio va riportato nel guscio statico**: la regola non era scritta e il controllo era solo visivo.
- **Le review indipendenti valgono il loro costo**: tre dei sette punti della code review e i quattro bloccanti dell'a11y-auditor erano promesse di ADR-0016 non mantenute dal codice, che io avevo scritto e ritenevo rispettate.
- **Non affermare la causa di un numero prima di averla verificata** (il CSS dei componenti): meglio dire «non lo so ancora» e misurare.
- **Gli agenti in lettura non devono condividere `build/` con i comandi che lo riscrivono**: fermare le build mentre girano, o dare agli agenti una copia.

## 9. Azioni per la fase successiva

- Push del branch e CI verde, poi merge e tag `phase-02a` (li fa Gianpaolo).
- QA su Android reale e con NVDA e VoiceOver (QA_CHECKLIST §2.1, §4, §7).
- Approvare o riscrivere i testi del desktop in bozza, a partire dal saluto del congedo.
- In 2B: i rinvii di ADR-0016, la taskbar stretta, la memoria del focus, la persistenza con un e2e sullo storage, e un test che confronti guscio statico e desktop interattivo.
- Decidere se i componenti F2A entrano nei totali con budget di size-limit.
