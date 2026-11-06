# Retrospettiva Fase 2B: routing, persistenza e modalità mobile

- **Branch**: `phase/02b-routing-mobile`
- **Periodo**: 2026-11-01 → 2026-11-06
- **Piano**: [phase-02b-plan.md](phase-02b-plan.md)
- **Ultima CI del branch**: **da verificare dopo il push** (la CI della tappa 2B-1 era verde e senza instabili, confermato dal proprietario). È il cancello finale per il merge (`close-phase` §6).

## 1. Obiettivi e risultato

| Obiettivo del piano                                                              | Stato       | Note                                                                                                    |
| -------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| Deep link nei due sensi, history prevedibile, title e canonical che seguono      | fatto       | route di layout; l'URL è la finestra attiva; push, assestamento (ADR-0021); Indietro non chiude (D2)    |
| Persistenza del layout senza CLS                                                 | fatto       | `windows.v1`, letta prima dello swap; finestra dell'URL davanti (D5); About sempre su `/` (D4)          |
| Modalità mobile: home a griglia, app a schermo intero, App aperte, Start, 320 px | fatto       | ADR-0007 con la regola; `/` apre About a schermo intero (D1); «Indietro» costruito ma non mostrato (D3) |
| Passaggio tra desktop e mobile senza perdere stato                               | fatto       | test unitari ed e2e di rotazione; trovato e corretto un difetto reale (evento `change` perso)           |
| Rinvii di ADR-0016 e memoria del focus                                           | fatto       | chiusi in ADR-0016; verifica a mano con NVDA da fare                                                    |
| Test instabile `desktop.spec.ts:46`                                              | fatto       | causa nel codice (ResizeObserver), non riproducibile da solo, trovata con 24 worker                     |
| CI su `chore/**` e `fix/**`                                                      | fatto       |                                                                                                         |
| React Router 8.5.1 senza alzare il budget                                        | fatto       | JS iniziale 120,56 kB su 124 con `ScrollRestoration` tolta e uno stub; terser non serve                 |
| Regola dei test instabili (proprietario, in corso d'opera)                       | fatto       | TESTING.md §10 e skill `write-tests`                                                                    |
| Budget del chunk del desktop                                                     | fatto       | divisione provata (0,06 kB), poi ADR-0022: 82 kB, con il job delle prestazioni verde                    |
| QA su Android reale                                                              | **da fare** | la fa Gianpaolo (QA_CHECKLIST §3.1 e §7); NVDA, VoiceOver e tastiera Bluetooth rinviati alla Fase 5     |

## 2. Cosa è andato bene

- **La modalità mobile è mostrata dal guscio statico fin dal primo disegno**: stessa media query in JS e CSS (un test le confronta), CLS a 0 su mobile, Lighthouse a 100 ovunque.
- **Le regole del proprietario hanno evitato lavoro a vuoto**: «divisione prima, ADR poi» per il budget ha dato i numeri veri (0,06 kB dalla divisione); la regola delle 50 ripetizioni ha dato un criterio chiaro per decidere quando indagare.
- **Misurare prima e dopo ha dato risposte nette**: il test di rotazione falliva 15 volte su 50, con l'ascolto di `resize` 0 su 50; il CLS di 0,004 era il padding di una finestra contro un altro foglio di stile, e dopo la correzione 0,00003.
- **Il job delle prestazioni ha fatto il suo lavoro**: ha trovato un CLS e un'ipotesi del test (tocco su icone coperte da About) che i test di layout non vedevano.
- **Le review indipendenti** della tappa 2B-1 hanno trovato difetti veri nella history (voce sostituita, azioni ravvicinate), corretti con test.

## 3. Cosa non è andato bene, e come è stato corretto

- **Chunk del desktop oltre il budget** (78,17 kB su 77) a fine implementazione. Era previsto dalla stima (rischi del piano), ma ho scoperto la misura solo con `npm run size` letto per intero. Seguita la regola del proprietario: divisione (0,06 kB), poi ADR-0022.
- **Il job delle prestazioni è stato lanciato tardi**: dopo la divisione, non a ogni cambio di layout. Ha trovato due problemi (CLS di 3 px, INP con timeout) che avrei visto prima lanciandolo a ogni cambio di CSS dei guscio.
- **CLS da ordine dei fogli di stile**: `.window` in `Desktop.module.css` e `.root` in `Window.module.css` avevano la stessa specificità. Lezione: le regole che sovrascrivono un componente vanno più specifiche (`.workspace > .window`), mai affidate all'ordine.
- **Guard dello stub troppo largo**: il controllo «il modulo è passato dallo stub» fermava anche la build di Storybook, che non usa `HydratedRouter`. Trovato dalla build completa; limitato alle build con `HydratedRouter` (commit d3fe065).
- **Errori miei nei test**: selettori sbagliati (nome del dialog dopo la chiusura, locator di un Radio nascosto), `I18nProvider` e router mancanti nei test dei componenti nuovi, test e2e scritti senza considerare lo swap (il bloccante dell'ultima review non esisteva: `navigate(-1)` dopo una ricarica non ricarica la pagina in Chrome, Firefox e WebKit; tenuto il test).
- **Scrittura di test che dipendevano dal tempo**: il click sul link della lingua prima del cambio di URL, e i controlli sullo skip link del guscio durante lo swap (forced-colors, doppio anello). Corretti aspettando lo stato.
- **Ambiente**: `git stash` e un `rm -rf` sono stati bloccati dai permessi; lo scratchpad è stato svuotato a metà lavoro e ho dovuto ricreare gli script di traccia.

**Casi instabili annotati** (regola di TESTING.md §10: non indagati oltre, la CI con i retry li segnala come flaky):

- Un test di contrasto in alto contrasto (`accessibility.spec.ts:10`, iPhone 14) ha fallito 1 volta su 100 (50 + 50 ripetizioni): `openPage` legge il contrasto dell'`h1` mentre il guscio si scambia con il desktop; sotto la soglia di 1 su 50 e senza traccia: annotato.
- Un clic su «Ingrandisci» subito dopo l'apertura di una finestra non ha avuto effetto, una volta su circa 2800 esecuzioni della matrice (2B-1), senza traccia disponibile. Non si è ripetuto in tre matrici successive.
- In Chrome (Claude in Chrome, QA del 06/11), il primo doppio clic su un'icona subito dopo il caricamento non ha aperto Progetti; il secondo, a pagina stabile, sì. Non riproducibile; coerente con lo swap dopo `load` (ADR-0014).

**Review di chiusura** (code-reviewer, a11y-auditor, security-auditor, content-reviewer; tutti e quattro, perché cambiano dipendenze, storage, testi e componenti):

- **Bloccante (a11y-auditor, ripreso dal code-reviewer)**: con un'app a schermo intero la griglia della home e, nel guscio, i 13 link restavano nell'ordine di Tab e nell'albero di accessibilità, coperti dalla finestra. Provato con due test che fallivano, poi corretto con `visibility: hidden` in mobile e con `:target` per l'ancora «Chiudi». La suite non lo vedeva perché nessun test controllava l'ordine di Tab con un'app aperta.
- **Corretti**: nome accessibile del pulsante «App aperte» (WCAG 2.5.3: «App aperte: n» anche con 0; con «(n)» axe falliva a 320 px), safe-area orizzontale, soglia della versione compatta in `em` (22,5 em), annunci muti sotto il dialog modale (`data-live-announcer`), focus durante Sposta provato in un browser vero, memoria del focus dimenticata alla chiusura e controllo di focalizzabilità, focus sull'icona dell'app chiusa, chiusura del menu contestuale e annullamento del gesto del puntatore al cambio di modalità, ancora `#desktop-icons` all'avvio (con test), cambio di solo hash che riattivava About, chunk di «App aperte» non caricato (annuncio e focus, con e2e), bordo di riserva in `forced-colors` per le righe del pannello, viewport rimandato al passaggio a desktop, documentazione (CONTENT.md, ADR-0011, ADR-0021, ACCESSIBILITY.md).
- **Non applicati**: suggerimenti sul testo (S1–S4 del content-reviewer: «la finestra {app}», uniformare «Sposta e ridimensiona»), da decidere in F3A con l'approvazione delle bozze; altezza dell'overlay su iPhone con home indicator, `line-clamp` delle etichette con testo ingrandito e feedback di pressione sulle icone al tocco (da vedere su un telefono: QA_CHECKLIST §3.1); animazione di entrata dopo una chiusura dal pannello; guard dello stub fail-open se `hydrated-router.js` si sposta (il test sugli export lo copre); test `@mobile` equivalenti per alcuni `@desktop`.
- **Decisioni del proprietario (06/11/2026)**: nessuna duplicazione dei test `@desktop` per il mobile, bastano i `@mobile` (ADR-0019); ADR breve per la regola dei test instabili (ADR-0023); testi alla F3A.

## 4. Metriche

| Metrica                                              | Valore                                                                                            | Fase precedente                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Test unitari (numero)                                | 657 in 69 file                                                                                    | 572 in 63 file                                  |
| Coverage righe / rami / funzioni / statement         | 95,68% / 85,47% / 93,42% / 93,67%                                                                 | 94,81 / 82,96 / 93,52 / 92,77                   |
| Test prerender (numero)                              | 380                                                                                               | 380                                             |
| Test e2e (numero, progetti)                          | 985 su 10 progetti, più 6 di prestazioni                                                          | 873 su 10 progetti, più 6                       |
| Screenshot di riferimento                            | 110                                                                                               | 104                                             |
| Lighthouse mobile per route (Perf / A11y / BP / SEO) | `/`, `/en/`, `/profilo/`, `/en/projects/`: 100 / 100 / 100 / 100; LCP 1,35 s, TBT 68–75 ms, CLS 0 | 100 / 100 / 100 / 100; LCP 1,35 s, TBT 34–36 ms |
| Lighthouse desktop per route                         | 100 / 100 / 100 / 100; LCP 0,41 s, TBT 0, CLS 0–0,0001                                            | 100 / 100 / 100 / 100; LCP 0,36–0,37 s          |
| JS iniziale gzip                                     | 120,55 kB (budget 124)                                                                            | 120,59 kB                                       |
| Chunk del desktop gzip                               | 78,57 kB (budget 82, ADR-0022)                                                                    | 73,50 kB (budget 77)                            |
| CSS iniziale gzip                                    | 3,89 kB (budget 12)                                                                               | 3,84 kB                                         |
| Componenti JS / CSS gzip                             | 91,77 / 5,82 kB (budget 99 / 6)                                                                   | 91,47 / 5,71 kB                                 |
| Prestazioni con CPU 4× (Pixel 7)                     | task più lunga 143 ms, INP 120 ms, swap entro 927 ms                                              | 102–106 ms, 120 ms, 764 ms                      |
| Violazioni axe                                       | 0 (476 test del progetto Storybook nelle quattro combinazioni; pagine)                            | 0                                               |
| `npm audit --omit=dev`                               | 0 vulnerabilità                                                                                   | 0                                               |
| Warning di lint                                      | 11 `no-await-in-loop` negli e2e (sequenze volute)                                                 | 5                                               |

Il TBT mobile raddoppia (da circa 35 a 70 ms) per il codice del layout e della persistenza eseguito allo swap; resta a un terzo della soglia di 200 ms (ADR-0018). Il chunk del desktop cresce di 5,1 kB rispetto alla 2A. Lighthouse è stato misurato una volta, prima delle correzioni delle review (che toccano solo CSS e logica di focus); la CI lo rimisura sul codice finale.

## 5. QA manuale

06/11/2026, build completa e `npm run preview`.

- **Chrome (Claude in Chrome), 1567×784**: link diretto con le altre finestre ripristinate dietro, Alt+W, Indietro senza ricarica, `/en/cv/` in inglese con le finestre salvate, console senza errori, nessuna origine esterna, storage del sito solo `windows.v1` (le altre chiavi sono di Storybook, visitato dallo stesso profilo).
- **Playwright nel container** (in Chrome il ridimensionamento della finestra non ha effetto): schermate a 320×568, 375×812 e 667×375 con il touch emulato di iPhone 14 e Pixel 7: home a griglia, About a schermo intero, App aperte, Start a pannello, nessuno scroll orizzontale, nessun errore in console; più la rotazione 390→1024→844×390→390 nei test e2e.
- **Da fare a mano** (non possibili qui): Android reale con `preview --host` (QA_CHECKLIST §3.1 e §7, compreso il gesto Indietro di sistema), NVDA + Firefox sul focus durante Sposta (`role="application"`), VoiceOver + Safari iOS, `forced-colors` su Windows, zoom al 200% e 400%.

## 6. Decisioni e ADR

- ADR-0007: modalità mobile, ora con la regola e la presentazione.
- ADR-0016: rinvii chiusi.
- ADR-0021: URL, history e persistenza del desktop (accettata).
- ADR-0022: budget del chunk del desktop a 82 kB con la modalità mobile.
- ADR-0003 e LEGAL.md §2: chiave `windows.v1`; nessuna chiave in sessionStorage.
- ADR-0023 e TESTING.md §10: regola dei test instabili.
- ADR-0019: aggiornamento con i tag `@desktop` e `@mobile`.

## 7. Debito tecnico e rischi aperti

- **QA su Android**: a mano (vedi §5). **NVDA, VoiceOver e tastiera Bluetooth**: rinviati alla fase di accessibilità (Fase 5), decisione del proprietario del 06/11/2026.
- **Chunk del desktop**: 3,4 kB di margine dal budget di 82 kB; la F3A porta contenuti delle app in chunk loro.
- **Più schede**: il layout salvato è l'ultimo che cambia (ADR-0021); accettato.
- **«Indietro» nella barra mobile**: costruito e provato in story, non mostrato fino alle sottopagine dei progetti (F3A).
- **Testi del desktop in bozza** (CONTENT.md §5), compresi i nuovi di App aperte; da approvare in F3A.
- **Lint**: 11 warning `no-await-in-loop` negli e2e (sequenze volute).
- **Disclaimer Microsoft** prima del primo tag `v*` (F3B).
- **Stub di React Router**: da riverificare a ogni aggiornamento (il test controlla gli export, e la build si ferma se il modulo cambia).

## 8. Lezioni sul lavoro con l'AI

- **Misurare prima e dopo, con numeri ripetuti**: l'ipotesi sull'evento `change` era plausibile ma non provata; 15/50 contro 0/50 l'ha confermata. Senza la regola delle 50 ripetizioni avrei o rinunciato (1 volta su 24) o speso ore.
- **Lanciare il job delle prestazioni a ogni cambio che tocca il layout del guscio**, non a fine tappa: il CLS di 3 px si vedeva in pochi secondi.
- **Le regole del proprietario sui budget sono una sequenza, non un divieto**: «prima dividi, poi ADR» ha prodotto un numero (0,06 kB) che ha reso l'ADR onesta.
- **Una review indipendente non va presa per vera senza prova**: il bloccante dell'ultima review della 2B-1 (ricarica dopo `navigate(-1)`) non esisteva; l'ho scritto come test per dimostrarlo invece di discuterne.
- **I test devono aspettare lo stato, non il tempo**: tre test instabili su quattro erano corse con lo swap o con l'URL.
- **Verifica visiva con gli strumenti che ci sono**: in Chrome non si ridimensiona la finestra; il container con Playwright ha prodotto le schermate mobile, e le ho guardate prima di rigenerare i riferimenti.

## 9. Azioni per la fase successiva

- Push del branch e CI verde, poi merge e tag `phase-02b` (li fa Gianpaolo).
- QA su Android reale (§3.1 e §7). NVDA, VoiceOver e tastiera Bluetooth passano alla Fase 5.
- F3A: contenuti delle app, testi da approvare, «Indietro» nelle sottopagine dei progetti, nuovo controllo del budget del desktop.
