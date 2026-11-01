# Piano Fase 2B — Routing, persistenza e modalità mobile

Branch `phase/02b-routing-mobile`. Approvato il 01/11/2026 con le decisioni del §8.

## Contesto

La 2A ha consegnato il window manager desktop, ma tre cose restano provvisorie:

- l'URL non segue le finestre: i link di About fanno `preventDefault`, e `Desktop.tsx` rimonta `DesktopApp` con `key={routeKey}`, quindi cambiare lingua azzera il desktop;
- non c'è persistenza (lo store ha già `serialize`/`deserialize` con `version: 1`);
- sotto i 768 px c'è solo il ripiego "icone sopra la finestra" (ADR-0014 §8).

La 2B chiude questi punti, i rinvii di ADR-0016 e tre debiti: il test instabile, i trigger della CI e React Router 8.5.1.

---

## 1. Analisi: stato attuale e punti rinviati

**Codice rilevante**

| File                                           | Stato                                                                                 | Cosa serve in 2B                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/app/routes.ts`                            | 28 route piatte, tutte su `routes/desktop.tsx`                                        | route di layout (§2.1)                                                         |
| `src/features/desktop/Desktop.tsx`             | swap guscio → `DesktopApp` con `key={routeKey}`                                       | togliere il rimontaggio; lo store sopravvive alla navigazione                  |
| `src/stores/desktop/state.ts`                  | azioni pure, `layoutMode` già nel tipo (mai usato), `serialize`/`deserialize` testati | `deactivate`, `restore`, geometria non toccata in mobile                       |
| `src/features/desktop/app/DesktopApp.tsx`      | `isDesktopLayout` con 768 scritto in JS (debito della review)                         | sincronizzazione con l'URL, persistenza, `layoutMode`                          |
| `content/AppContent.tsx` + `openAppContext.ts` | link di About intercettati                                                            | tornano `Link` normali; il contesto si elimina                                 |
| `shell/DesktopShell.tsx`                       | 11 icone, finestra della route                                                        | variante mobile solo CSS, 13 voci (§2.3)                                       |
| `setViewport` in `state.ts`                    | ritaglia (clamp) la geometria salvata a ogni cambio di area                           | in mobile la geometria non va toccata, altrimenti tornando al desktop si perde |

**Misure attuali**

- JS iniziale 120,59 kB su 124, di cui `framework` 106,6 kB.
- Chunk del desktop 73,50 kB su 77.
- CSS dei componenti 5,71 kB su 6.
- JS dei componenti 91,47 kB su 99.
- I margini sono stretti: il chunk del desktop ha 3,5 kB e il CSS dei componenti 0,3 kB.

**Rinvii di ADR-0016 e della retrospettiva 2A**

1. Sotto i 768 px, Sposta, Ridimensiona e Ingrandisci del menu della finestra non hanno effetto.
2. Durante Sposta da tastiera il focus resta sul pulsante del menu, e NVDA in modalità lettura si prende le frecce.
3. In `forced-colors`, la voce scelta nel selettore aperto con il mouse e il cerchio del Radio non hanno un bordo `Highlight`.
4. In Spegni il focus iniziale è su «Spegni», quindi Invio spegne subito.
5. Su Windows, Maiusc+Alt cambia la lingua di input.
6. `touch-action: none` sulla barra del titolo blocca il pinch-zoom iniziato lì.
7. Taskbar con molte finestre a 320 px.
8. Dalla retrospettiva:
   - memoria del focus per finestra;
   - test che confronti il guscio e il desktop interattivo;
   - e2e sullo storage (LEGAL §2);
   - breakpoint scritto due volte (CSS e JS).

**Test instabile `desktop.spec.ts:46`** (Start › Pannello di controllo › Chiudi durante l'apertura). Non ho ancora la causa. Ipotesi da verificare nell'ordine:

- (a) `usePress` annulla la pressione perché il `pointerup` cade fuori dal pulsante, che si sposta con lo `scale` di `window-open`. Sarebbe un bug reale: un clic rapido verrebbe perso anche dalle persone;
- (b) il `FocusScope` del menu Start, chiudendosi, rimette il focus su Start dopo il nostro `setFocusRequest`;
- (c) un `animationend` o il timer di riserva arrivano nell'ordine sbagliato al passaggio da `entering` a `closing`.

---

## 2. Regole proposte

### 2.1 URL e history (nuovo ADR-0021)

**Struttura.** `routes.ts` diventa un `layout("routes/desktop-layout.tsx", [...])`:

- il layout monta `<Desktop/>` una volta sola;
- le 28 route figlie (`routes/app.tsx`) hanno solo `meta` e un componente vuoto.

Così lo store sopravvive alla navigazione e al cambio di lingua. Title, description, canonical, hreflang e JSON-LD seguono già la route con il `<Meta/>` di React Router: seguendo l'URL la finestra attiva, i meta la seguono senza codice nuovo. Un test confronta l'HTML prerenderizzato prima e dopo il cambio: deve essere identico, a parte gli hash degli asset.

**Quale finestra rappresenta l'URL.**

- L'URL è quello della finestra attiva; con nessuna finestra attiva è `/` (o `/en/`).
- Unica eccezione: si naviga solo se la route corrente non corrisponde già alla finestra attiva (`openAppFor(routeKey) !== activeId`). Così su `/` con About in primo piano l'URL resta `/`; attivando About da un'altra finestra diventa `/profilo/`.

**Push o replace.**

| Evento                                                                                                              | History                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Apri o porta in primo piano una finestra (icona, Start, Esegui, taskbar, selettore, App aperte, link nei contenuti) | **push**                                                                                                                     |
| Chiudi, Riduci, Chiudi tutte, Riavvia o Riaccendi (la finestra attiva cambia come conseguenza)                      | **assestamento**: se la voce precedente, creata da noi, ha già l'URL di destinazione, `navigate(-1)`, altrimenti **replace** |
| Sposta, Ridimensiona, Ingrandisci, cambio di modalità, ripristino del layout salvato                                | nessuna navigazione                                                                                                          |
| Link della lingua                                                                                                   | push (lo store resta)                                                                                                        |

L'assestamento evita due voci uguali di fila, cioè un Indietro che sembra non fare nulla. Per capire se la voce precedente è nostra si usa `location.state.back`, la route da cui è partito il push, senza dipendere dall'`idx` interno di React Router.

**Back e forward (POP).** Una route di app porta in primo piano la sua finestra: la riapre se era chiusa, la ripristina se era ridotta.

- `/` sul desktop: nessuna finestra attiva. Le finestre restano dove sono, inattive, con il focus sulle icone, come un clic sullo sfondo in Win95. Serve l'azione nuova `deactivate`.
- `/` in mobile: torna la home a griglia, e le app restano in «App aperte».

**Alternativa R2** («Indietro annulla»): Indietro chiude la finestra aperta dalla voce che si lascia, e Avanti la riapre. È più vicina alla frase di ARCHITECTURE §5 («il back chiude o torna»), ma chiudere perde lo scorrimento e lo stato. **Raccomando R1**: Indietro torna alla finestra precedente e non chiude mai.

**Focus e annunci nei cambi di URL.**

- Su POP il focus va al corpo della finestra (desktop) o all'`h1` (mobile), altrimenti alle icone o alla griglia.
- Il cambio di focus non si annuncia (ADR-0016 §5). Si annuncia solo una finestra riaperta da Avanti o Indietro, con «Progetti aperta».
- Il link della lingua tiene il focus (`data-focus-key="language"`).
- Nessuna trappola: ogni push nasce da un gesto, mai da un effetto. Il ripristino non scrive history.

**Chiusura dell'ultima finestra.** Assestamento verso `/`: desktop vuoto, o griglia in mobile. Ricaricando `/` torna About, perché il primo render dipende solo dall'URL (ADR-0005).

**Prima dell'idratazione** nulla cambia: icone, voci della home mobile e link della lingua sono `<a href>` con navigazione completa (`no-javascript.spec.ts` esteso al mobile).

### 2.2 Persistenza del layout

**Chiave e contenuto.**

- Chiave `windows.v1` in localStorage. Sostituisce `windows` in LEGAL §2 e in ADR-0003.
- Contiene finestre aperte, geometria, ingrandite e ridotte, `stack` e `recent`. Non contiene `activeId`, `viewport` né `layoutMode`.
- Una versione diversa o un JSON non valido si ignorano e la chiave si cancella.
- Scrittura con `store.subscribe`, raggruppata in `requestIdleCallback`. Gli errori di storage (navigazione privata, quota) si ignorano.
- Niente middleware `persist` di Zustand: circa 1 kB contro i circa 0,4 kB di un adattatore nostro, che usa `serialize` e `deserialize` già testati.

**Quando si ripristina, senza CLS.** `DesktopApp` non viene mai prerenderizzato né idratato: nasce sul client, nascosto, prima dello swap. Lo stato salvato si legge nell'inizializzatore dello store e lo swap mostra già il layout ripristinato, in un solo commit. Non c'è un fotogramma intermedio e non c'è mismatch di idratazione.

**Regole del ripristino, per non confondere chi arriva da un link diretto.**

1. La finestra dell'URL è sempre in primo piano e attiva.
2. La finestra dell'URL resta nella posizione del prerender, così lo swap non la sposta. La geometria salvata vale per le altre finestre, che ricompaiono dietro senza animazione.
3. Chi arriva da un link per la prima volta non ha nulla di salvato e vede esattamente il prerender.
4. **Chiusura di About sulla home: raccomando di non ricordarla.** Su `/` About c'è sempre: è l'`h1` e l'LCP, e toglierla dopo lo swap sarebbe un lampo visibile, soprattutto in mobile dove occupa tutto lo schermo. Le altre finestre salvate si ripristinano dietro About.
5. Riavvia salva un desktop vuoto. Riaccendi, dopo Spegni, ripristina il layout salvato: Spegni non perde più nulla, e questo chiude il rinvio n. 4 (§2.4).

**Alternative.**

- Ripristinare solo su `/`: è più semplice, ma chi torna da un link perde la sessione.
- Ripristinare anche la geometria della finestra dell'URL: lo swap la sposterebbe, il test «stesse posizioni» fallirebbe e il rischio di CLS sarebbe reale.

**Dopo il merge della 2B** non serve migrazione: il formato `version: 1` nasce adesso.

### 2.3 `layoutMode` (aggiorna ADR-0007)

**Regola.** Mobile se `(width < 768px) or ((pointer: coarse) and (height < 540px))`, altrimenti desktop.

- La larghezza decide quasi sempre.
- La seconda condizione prende i telefoni in orizzontale: Pixel 7 915×412 e iPhone 14 Pro Max 932×430 sarebbero desktop con 400 px d'altezza.
- I tablet restano desktop: la tavola D06 prevede la pressione lunga sul desktop del tablet.
- `data-input` **non** decide la modalità. Regola solo i target dei controlli: un desktop stretto usato con il mouse è comunque mobile, con le misure delle tavole (barra da 48 px, Chiudi da 44).

**Una sola fonte.**

- `src/features/desktop/layoutMode.ts` esporta la stringa della media query, usata da `matchMedia`.
- La stessa stringa compare letterale nel CSS, perché serve al primo disegno del prerender (ADR-0007), e un test unitario verifica che le due coincidano.
- Sparisce il 768 duplicato.

**Cambio di modalità** (resize, rotazione, zoom).

- `matchMedia(...).addEventListener("change")` aggiorna `layoutMode` nello store. Nulla si chiude e nulla si perde.
- In mobile `setViewport` non ritaglia la geometria salvata.
- Il focus resta dov'è se l'elemento è ancora visibile. Altrimenti va all'equivalente: corpo della finestra ↔ `h1` dell'app attiva, icona ↔ voce della griglia, con la mappa di `ids.ts` estesa.
- Durante un trascinamento o Sposta, il gesto si annulla come con Esc.

**Alternative.**

- Solo la larghezza (`< 768`): i telefoni in orizzontale finiscono nel desktop con finestre inutilizzabili.
- `pointer: coarse` da solo: i tablet diventerebbero mobile, contro le tavole.
- Usare `data-input`: legherebbe il layout a una preferenza che riguarda i target (Pannello di controllo, 4A).

**Presentazione mobile** (tavole M11–M15, NOTES.md):

- **Home**: griglia a 3 colonne con 13 voci, perché in mobile si aggiungono Pannello di controllo e Privacy. Icone da 64 px da 360 px in su, da 32 px sotto. Un solo punto di Tab con le frecce in 2D, e l'intera cella come area di tocco.
- Le 13 voci sono nel prerender anche su desktop, dove Pannello di controllo e Privacy si nascondono con CSS. L'HTML resta unico (ADR-0007).
- **App a schermo intero**: si vede solo la finestra attiva. Barra del titolo da 48 px con titolo, «Chiudi» da 44×44 («Chiudi Progetti») ed eventualmente «Indietro» (domanda D3). Niente menu della finestra, Riduci, Ingrandisci, maniglie né trascinamento. Il contenuto scorre nella finestra. All'apertura il focus va all'`h1` (`tabindex=-1`), e Esc non chiude.
- **Taskbar**: Start, «App aperte (n)» e area di notifica. Sotto i 360 px «App aperte» diventa icona più numero (`aria-label` «App aperte: n»). Con 0 app è `aria-disabled`.
- **App aperte (M13)**: elenco a tutta pagina, righe da 64 px con Chiudi da 44 e «Chiudi tutte» in fondo. Tastiera: ↑/↓, Invio, Canc, Esc; Alt+W lo apre. Il focus si apre sull'app corrente, dopo una chiusura passa alla riga successiva e uscendo torna sul pulsante. Lo swipe è rimandato: il pulsante c'è sempre (WCAG 2.5.7).
- **Start (M14 e M15-start)**: pannello a tutta larghezza sopra la taskbar, con voci da 44 px. A 320×568 le app scorrono e il gruppo di sistema resta fisso.
- **Niente menu contestuale.**
- **Safe area**: `env(safe-area-inset-*)` su taskbar e barra del titolo, già permesso da `viewport-fit=cover`.

**`/` in mobile (domanda D1).** Raccomando che `/` mostri About a schermo intero, come il desktop mostra About aperta: l'`h1` e la bio restano visibili, l'LCP non cambia e il prerender è uno solo. La griglia M11 si vede chiudendo About, da Indietro e da ogni altra app.

### 2.4 Rinvii di ADR-0016

| Punto                            | Proposta                                                                                                                                                                                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Menu della finestra sotto 768 | In mobile non c'è menu, e Alt+Spazio e Alt+trattino non fanno nulla. Sopra i 768 px resta tutto com'è                                                                                                                                           |
| 2. Focus durante Sposta          | Il focus va sul gruppo di `MoveControls` (`role="application"` limitato al gruppo, con nome «Sposta Progetti»), così NVDA lascia le frecce alla pagina. L'annuncio iniziale cita frecce, Invio, Esc e i pulsanti. Da verificare a mano con NVDA |
| 3. `forced-colors`               | `outline: 2px solid Highlight` sulla voce scelta del `WindowSwitcher` e bordo `CanvasText`/`Highlight` sul cerchio del Radio, con story `forced-colors` ed e2e con `forcedColors: "active"`                                                     |
| 4. Focus iniziale di Spegni      | Resta sul radio, come nella tavola. Con la persistenza Riaccendi ripristina il layout, quindi Spegni non è più distruttivo; lo si annota in ADR-0016 (alternativa: focus su Annulla)                                                            |
| 5. Maiusc+Alt su Windows         | Si documenta in ACCESSIBILITY §2: a selettore aperto ← e → fanno lo stesso, e il pulsante Finestre resta. Nessun codice                                                                                                                         |
| 6. `touch-action` sulla barra    | In mobile la barra non ha gesti, quindi `touch-action: auto`. Sul tablet in modalità desktop resta e si documenta                                                                                                                               |
| 7. Taskbar stretta               | Risolta da «App aperte» in mobile                                                                                                                                                                                                               |
| Memoria del focus                | `Map<AppId, string>` non persistita con l'id o il `data-focus-key` dell'ultimo elemento con il focus. Riattivando la finestra si torna lì, se esiste ancora; altrimenti al corpo. Costo stimato 0,3 kB                                          |
| Confronto guscio e desktop       | Il test «stesse posizioni» si estende a 375 e 320 px e alla home mobile                                                                                                                                                                         |
| e2e sullo storage                | Dopo aver aperto, spostato, ricaricato e cambiato lingua, le chiavi di localStorage e sessionStorage stanno tutte nell'elenco di LEGAL §2                                                                                                       |

---

## 3. Passi e commit, in due tappe

### Tappa 2B-1: routing, persistenza e debiti

1. `docs: piano della fase 2B` (`docs/phases/phase-02b-plan.md`).
2. `ci: avvia la CI anche sui branch chore/** e fix/**` (`.github/workflows/ci.yml` › `on.push.branches`; `scripts/lib/workflows.test.mjs` se verifica i trigger).
3. `fix: chiusura di una finestra durante l'animazione di apertura` (test `desktop.spec.ts:46`):
   - riprodurre nel container con `--repeat-each=40 --trace=retain-on-failure` su `chromium-1440`, `chromium-375` e `touch-pixel-7`;
   - leggere la traccia e correggere il codice se la causa è reale (es. per l'ipotesi a: animazione solo su `opacity` e `transform` della cornice con un `transform-origin` che non sposta i pulsanti, oppure azione su `pointerdown` per Chiudi);
   - aggiungere un test unitario che riproduca la sequenza;
   - niente `retries`, attese fisse o rimozioni.
4. React Router 8.5.1 con recupero del JS iniziale (§5), un commit per leva più l'aggiornamento:
   - `perf: …`;
   - `build: aggiorna react-router a 8.5.1`.
5. `refactor: route di layout del desktop`:
   - `routes.ts`, `routes/desktop-layout.tsx` e `routes/app.tsx`;
   - via `key={routeKey}`;
   - test sull'HTML prerenderizzato invariato;
   - aggiornamento di `routes.test.tsx` e del test di `routes.ts`.
6. `feat: sincronizza le finestre con l'URL`:
   - `useUrlSync` nel chunk del desktop;
   - azione `deactivate` nello store;
   - i link di About tornano normali e si elimina `OpenAppContext`;
   - il test e2e «senza cambiare URL» diventa «cambia URL senza ricaricare» (cambia il comportamento, non si indebolisce il test).
7. `feat: salva e ripristina il layout delle finestre`:
   - `src/stores/desktop/persist.ts`;
   - LEGAL §2 e ADR-0003 con `windows.v1`;
   - e2e sullo storage.
8. `docs: ADR-0021 URL, history e persistenza del desktop`:
   - ARCHITECTURE §5 e ADR-0005 (rimando);
   - ACCESSIBILITY §2, per il focus nei cambi di URL.

**Fermata 2B-1** (come in 2A, dalla lezione della retrospettiva):

- `npm run build`, matrice e2e completa, `test:coverage`, `test:prerender`, `npm run size` letto per intero;
- `code-reviewer` sul diff della tappa;
- QA in Chrome a 1440 px: back e forward, ricarica, lingua.

### Tappa 2B-2: modalità mobile e rinvii

9. `feat: modalità di layout desktop o mobile`:
   - `layoutMode.ts` e il test di coerenza tra CSS e JS;
   - listener `change`;
   - geometria intatta in mobile;
   - annullamento dei gesti.
10. `feat: guscio statico in modalità mobile`:
    - CSS del guscio con la stessa media query;
    - 13 voci;
    - finestra a schermo intero;
    - corretto senza JS a 320, 375 e 667×375.
11. `feat: barra del titolo mobile della finestra` (variante di `Window`): 48 px, Chiudi, Indietro opzionale, focus sull'`h1`.
12. `feat: home mobile a griglia` (variante di `DesktopIcons`): icone 64/32, frecce in 2D, celle ≥ 44.
13. `feat: taskbar mobile e App aperte`:
    - `AppSwitcher` in un chunk caricato all'apertura e precaricato nel tempo libero, come Esegui;
    - `TaskbarIconButton` con contatore e variante compatta.
14. `feat: menu Start a pannello in mobile`.
15. `fix: rinvii di ADR-0016` (punti 1–6, un commit per punto se tocca componenti diversi).
16. `feat: memoria del focus per finestra`.
17. `test: e2e mobile e schermate`:
    - home, app, App aperte, Start, rotazione e Indietro su Pixel 7, iPhone 14, 320 e 375;
    - `update-visual-snapshots` nel container, solo dopo la verifica nel browser.
18. `docs: modalità mobile`:
    - ADR-0007 da «accettata nel principio» a definita;
    - ADR-0016 (rinvii chiusi);
    - ARCHITECTURE §6;
    - QA_CHECKLIST con la sezione mobile (home, app a schermo intero, Indietro, App aperte, rotazione, preview `--host` su Android);
    - PERFORMANCE_SEO con le misure.

**Chiusura** con la skill `close-phase`: quattro agenti di review, Lighthouse strict una volta (ADR-0018) e retrospettiva. La QA su Android reale la fai tu.

---

## 4. Componenti nuovi e modificati

| Componente o modulo                                   | Tipo                                                                                | Test                                                                         | Story                                |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------ |
| `stores/desktop/state.ts`                             | mod.: `deactivate`, `restore(saved, routeKey)`, `setViewport` senza clamp in mobile | unit (azioni pure, casi del ripristino §2.2)                                 | –                                    |
| `stores/desktop/persist.ts`                           | nuovo: lettura e scrittura con versione                                             | unit (versione errata, JSON rotto, storage che lancia)                       | –                                    |
| `features/desktop/app/useUrlSync.ts`                  | nuovo: push, assestamento, POP                                                      | unit con `createMemoryRouter` (sequenze di history) ed e2e `history.spec.ts` | –                                    |
| `features/desktop/layoutMode.ts` + `useLayoutMode`    | nuovo                                                                               | unit (coerenza con il CSS, `change`)                                         | –                                    |
| `app/routes/desktop-layout.tsx`, `app/routes/app.tsx` | nuovi, al posto di `desktop.tsx`                                                    | `routes.test.tsx`, prerender                                                 | –                                    |
| `Window`                                              | mod.: variante `mobile` (barra da 48, Indietro, Chiudi)                             | unit e axe                                                                   | «Mobile», «Mobile con Indietro», 320 |
| `DesktopIcons`                                        | mod.: variante `home` (3 colonne, 64/32)                                            | unit (frecce in 2D) e axe                                                    | «Home mobile» 375/320                |
| `AppSwitcher` (nuovo, `components/`)                  | `GridList` con azioni per riga                                                      | unit (↑/↓, Invio, Canc, focus dopo la chiusura) e axe                        | 0, 1 e 5 app, 320                    |
| `TaskbarIconButton`                                   | mod.: etichetta con contatore e variante compatta                                   | unit                                                                         | «App aperte», «compatto»             |
| `StartButton`                                         | mod.: pannello mobile a tutta larghezza                                             | unit                                                                         | «Mobile 375 e 320»                   |
| `MoveControls`, `WindowSwitcher`, `Radio`             | mod.: focus, `forced-colors`                                                        | unit ed e2e `forced-colors`                                                  | story esistenti in alto contrasto    |
| `DesktopShell`, `ShellWindow`                         | mod.: markup mobile solo CSS                                                        | prerender, `no-javascript` mobile                                            | –                                    |
| `DesktopApp`                                          | mod.: integra tutto                                                                 | `DesktopApp.test.tsx` ampliato                                               | –                                    |

Ogni componente segue la definizione di «fatto» di CLAUDE.md, cioè skill `win95-component`, `write-tests` e QA nel browser anche in mobile. Gli screenshot delle story sono in due combinazioni (ADR-0019).

---

## 5. React Router 8.5.1: piano e numeri attesi

**Obiettivo**: JS iniziale ≤ 124 kB con 8.5.1 e con il codice della 2B. Base 120,59 kB; 8.5.1 aggiunge 3,55 kB e la 2B circa 0,3 kB nel JS iniziale (route di layout, markup mobile del guscio), quindi senza interventi si arriva a circa 124,4 kB.

**Primo passo: misurare.** `npm run analyze` su 8.4.0 e su 8.5.1 e confronto della treemap del chunk `framework` modulo per modulo, per sapere da dove vengono i 3,55 kB. Se vengono da una funzione nuova disattivabile (flag `future` o import evitabile), è la leva migliore e costa 0.

**Leve**, nell'ordine dalla meno invasiva:

| Leva                                                                                                                                                                      | Risparmio atteso (gzip)             | Costo                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Funzione nuova di 8.5.1 evitabile (dalla treemap)                                                                                                                      | 0–3,5 kB                            | da capire                                                                                                                                                             |
| B. Togliere `<ScrollRestoration/>` dal root: il documento non scorre (finestre e app scorrono dentro)                                                                     | 0,5–1 kB                            | sparisce anche la chiave sessionStorage `react-router-scroll-positions` (LEGAL §2 si semplifica). Va verificato che nessuna pagina, 404 compresa, scorra il documento |
| C. Minificazione con `terser` (`passes: 2`) invece di Oxc, solo per il client                                                                                             | 1,5–2,5 kB (circa 1,5–2% di 120 kB) | dipendenza di sviluppo, build più lenta di qualche secondo; ADR-0022                                                                                                  |
| D. Solo il dizionario della lingua della route nel JS iniziale; l'altro precaricato nel tempo libero, con `reloadDocument` sul link della lingua se non è ancora arrivato | circa 1,2 kB                        | più codice, un ramo di caricamento in più da testare                                                                                                                  |

**Atteso**: B + C, circa 2–3,5 kB, più A se c'è. D solo se servisse.

**Se non bastasse**, alternative con i numeri al momento della misura:

1. restare su 8.4.0 con l'esclusione in Dependabot;
2. un ADR che alzi il budget, che non propongo perché hai chiesto di non farlo.

---

## 6. Dipendenze nuove

- **Runtime**: nessuna.
- **Sviluppo**: `terser` ^5.51.2, solo se la leva C viene adottata (ADR-0022).
- **Aggiornamento**: `react-router`, `@react-router/dev` e `@react-router/node` 8.5.1.

## 7. Rischi

- **Budget del chunk del desktop** (3,5 kB di margine). URL, persistenza, modalità e memoria del focus valgono circa 2–3 kB. `AppSwitcher` e il pannello Start mobile vanno in chunk su richiesta. Se si supera, mi fermo e ti porto i numeri (nessun ADR senza il tuo via libera).
- **CSS dei componenti** (0,3 kB di margine): le varianti mobile di `Window`, `DesktopIcons` e `StartButton` lo superano quasi certamente. Opzione: le regole di layout mobile nel `Desktop.module.css` della feature, nei componenti solo ciò che serve alle story. Altrimenti decidi tu (ADR-0020).
- **Schermate a 320 e 375**: tutte quelle esistenti delle pagine cambiano, perché finisce il ripiego. Si rigenerano con motivo nel commit, dopo la verifica nel browser.
- **Lighthouse mobile**: `/` in mobile diventa About a schermo intero. L'LCP resta il testo di About, ma va guardato in CI.
- **History**: comportamenti diversi tra Safari iOS (swipe indietro) e Chrome Android. Li coprono gli e2e WebKit della matrice di fine tappa e la QA reale.
- **Lettori di schermo**: `role="application"` su `MoveControls` e focus sull'`h1` in mobile vanno provati con NVDA e VoiceOver. Li fai tu.

## 8. Decisioni del proprietario (01/11/2026, piano approvato)

- **D1**: `/` in mobile mostra About a schermo intero.
- **D2**: R1. Indietro torna alla finestra precedente e non chiude.
- **D3**: «Indietro» si costruisce (componente, story, test) ma non si mostra fino alla F3A.
- **D4**: la chiusura di About sulla home non si ricorda.
- **D5**: le finestre salvate si ripristinano dietro la finestra dell'URL.
- **D6**: `terser` si adotta come dipendenza di sviluppo solo se le leve A e B non bastano.
- **CSS dei componenti**: le regole di layout mobile vanno in `Desktop.module.css` della feature.
- **Budget**: se uno si supera, mi fermo e porto i numeri.
- **Esecuzione**: dopo la tappa 2B-1 mi fermo.

---

## Verifica

- **A ogni commit**:
  - `npm run lint`, `typecheck`, `test` e `npm run size` letto per intero;
  - `test:coverage` quando entra un hook;
  - `build:site` + `test:prerender:site` quando cambia il guscio o le route.
- **Durante il lavoro**:
  - `npm run test:e2e:chromium`;
  - `build:site && preview` con Claude in Chrome, da 1440 px al mobile: back e forward, ricarica, lingua, rotazione con Playwright 667×375 nel container.
- **A ogni fermata di tappa**: `npm run build` completo, `npm run test:e2e` (matrice completa) e `test:prerender`.
- **e2e nuovi**:
  - `history.spec.ts`: push, assestamento, POP, focus, nessun doppione;
  - `persistence.spec.ts`: ricarica, link diretto, versione errata;
  - `mobile.spec.ts`: home, app, Chiudi, App aperte, Start, Alt+W, rotazione senza perdita di stato;
  - `storage.spec.ts`: chiavi ammesse;
  - `no-javascript.spec.ts` esteso al mobile;
  - `forced-colors`.
- **Fine fase**: `close-phase`, Lighthouse strict una volta, CI verde sul branch, QA su Android reale con `preview -- --host` (tua).
