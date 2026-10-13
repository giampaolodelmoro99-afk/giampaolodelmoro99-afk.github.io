# ADR-0007: Modalità mobile del window manager

- **Stato**: Accettata nel principio; dettagli da definire in Fase 2B (questo ADR sarà aggiornato)
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
