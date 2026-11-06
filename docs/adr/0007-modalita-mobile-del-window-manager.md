# ADR-0007: Modalità mobile del window manager

- **Stato**: Accettata; regola e dettagli definiti in Fase 2B (sezione «Decisione della 2B»)
- **Data**: 2026-10-13
- **Fase**: 0

## Contesto

Finestre sovrapposte, drag e resize non sono usabili su un telefono da 320 px con il dito. Il sito deve restare usabile da 320 px, in verticale e in orizzontale, con target ≥ 44 px, senza funzioni solo hover o tasto destro, con safe-area e zoom.

## Decisione (principi)

- Esiste una **modalità mobile dedicata**, attiva su viewport stretti **o** con puntatore grossolano (`pointer: coarse`). Soglia e combinazione esatte si definiscono in F2B con test sui dispositivi.
- In modalità mobile:
  - le finestre sono a **schermo intero**, una alla volta, senza drag né resize
  - la navigazione è adatta al touch: taskbar/dock con target ≥ 44 px, menu Start a pannello, gesto "indietro" del browser coerente con la chiusura della finestra
  - il menu contestuale si apre da un pulsante visibile (ed eventualmente con pressione prolungata), mai solo con il tasto destro
  - safe-area con `env(safe-area-inset-*)`; zoom del browser permesso (`viewport` senza `maximum-scale`)
- **Stesse route e stesso HTML prerenderizzato** in tutte le modalità: cambia la presentazione via CSS e lo store, non il contenuto. Nessun contenuto diverso tra mobile e desktop.
- La modalità si decide in modo deterministico dopo l'idratazione. Il primo paint (dal prerender) dev'essere già corretto in entrambe le modalità grazie a CSS e media query, senza CLS.

## Decisione della 2B (01/11/2026)

**Regola della modalità.** La modalità è **mobile** se `(width < 768px)`, oppure `(height < 540px) and (pointer: coarse)` (anche `none`); altrimenti è **desktop**: `(width >= 768px) and (height >= 540px)`, oppure `(width >= 768px) and (pointer: fine)`.

- La larghezza decide quasi sempre. L'altezza con il puntatore grossolano prende i telefoni in orizzontale (Pixel 7 915×412, iPhone 14 Pro Max 932×430), che sarebbero larghi ma troppo bassi per finestre sovrapposte.
- I tablet restano desktop: la pressione lunga per il menu contestuale è prevista sul desktop del tablet (tavola D06).
- `data-input` **non** decide la modalità: regola i target dei controlli. Un desktop stretto usato con il mouse è comunque mobile, con le misure touch.
- Una sola fonte: `src/features/desktop/layoutMode.ts`. Le due media query compaiono uguali nel CSS (il primo disegno del prerender le richiede) e un test unitario le confronta.
- Il cambio di modalità (rotazione, ridimensionamento, zoom) si legge con `matchMedia` **e** con `resize`: con ridimensionamenti ravvicinati l'evento `change` può perdersi (15 casi su 50 nel test di rotazione, 0 su 50 con `resize`).
- Nel cambio non si perde nulla: la geometria salvata non viene ritagliata in mobile, i gesti in corso si annullano, il focus resta dov'è se l'elemento è ancora visibile.

**Presentazione** (tavole M11–M15):

- Home a griglia di 13 voci su 3 colonne (icone da 64 px da 360 px in su, da 32 sotto); su `/` si apre About a schermo intero (D1).
- App a schermo intero con barra del titolo da 48 px: titolo, «Chiudi {app}» da 44×44 e, costruito ma non mostrato fino alla F3A (D3), «Indietro». Nessun Riduci, Ingrandisci, menu della finestra, maniglie né trascinamento. Focus sull'`h1` all'apertura.
- Taskbar con Start, «App aperte (n)» (icona e numero sotto i 360 px) e area di notifica. Il pannello «App aperte» è un chunk caricato all'apertura (ADR-0022).
- Start a pannello: larghezza meno 12 px, voci da 44 px.
- Niente menu contestuale. «Indietro» del browser torna alla schermata precedente senza chiudere app (ADR-0021).
- Il guscio statico prerenderizza le 13 voci, con Chiudi come ancora: funziona senza JavaScript. Su desktop Pannello di controllo e Privacy si nascondono con CSS.

## Alternative considerate

| Alternativa                            | Perché scartata                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| Stesso window manager ridotto in scala | Target minuscoli, drag impreciso                                                        |
| Sito separato per mobile               | Doppio contenuto, rischio cloaking, SEO peggiore                                        |
| Disattivare il tema 95 su mobile       | Perde l'identità del progetto; la "Vista semplice" copre già chi vuole solo i contenuti |

## Conseguenze

- I componenti nascono responsive dalla F1 (CLAUDE.md, definizione di "fatto").
- I test e2e girano su 320, 375 e touch emulato (Pixel 7, iPhone 14) per ogni funzione.

## Riferimenti

ARCHITECTURE.md §6, ACCESSIBILITY.md §6, ADR-0005.
