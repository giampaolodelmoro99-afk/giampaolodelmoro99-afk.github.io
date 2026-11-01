# Easter egg

## Regole

- **Accessibili**: attivabili anche da tastiera o touch, non solo con gesti nascosti del mouse; annunciati agli screen reader se cambiano qualcosa.
- **Innocui**: nessun impatto su Lighthouse (codice in lazy loading), sull'HTML prerenderizzato o sulla navigazione principale.
- **Rispettosi**: nessun lampeggio oltre 3 volte al secondo; reduced motion rispettato; suoni solo se l'audio è attivo.
- **Legali**: niente nomi né immagini Microsoft (niente Clippy, suoni, loghi o nomi di prodotto); ogni nuova icona o immagine registrata in ASSETS.md prima dell'uso.
- **Mai unici portatori di informazioni**: nessuna informazione importante sta solo in un easter egg.
- **Animazioni**: azzerate con movimento ridotto (`prefers-reduced-motion` e `data-motion="reduce"`); niente lampeggi oltre 3 al secondo.
- **Testati**: ognuno ha almeno un test (e2e quando cambia l'interfaccia).
- **Disattivabili**: nessun easter egg blocca l'uso del sito; si chiude sempre con Esc o con un pulsante.

## Registro

Approvati da Gianpaolo il 28/10/2026. File e test si compilano quando l'easter egg viene realizzato.

| Nome                           | Trigger                                                                                                                    | Effetto                                                                                                                                                                          | Fase | File | Test |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ---- |
| Codice Konami                  | ↑ ↑ ↓ ↓ ← → ← → B A sul desktop (tastiera; su touch c'è un'alternativa equivalente da definire, per esempio nel Terminale) | lo sfondo del desktop cambia per qualche secondo, oppure compare un messaggio segreto; annunciato agli screen reader                                                             | 4B   |      |      |
| Comandi nascosti del Terminale | `sudo`, `caffè`, `matrix`, `exit`, `avvocato` nel Terminale                                                                | risposte originali; `avvocato` risponde con un «articolo» del codice del portfolio, richiamo agli studi di Giurisprudenza; `matrix` senza lampeggi e fermo con movimento ridotto | 4B   |      |      |
| Orologio della taskbar         | clic ripetuti sull'orologio (anche da tastiera e touch: l'orologio diventa un pulsante, oggi non è interattivo)            | piccolo calendario o messaggio                                                                                                                                                   | 4B   |      |      |
| Svuota cestino                 | tasto destro sul Cestino (anche con Maiusc+F10 o tasto Menu, e con pressione lunga su tablet) → «Svuota cestino»           | dialog ironico: «Non puoi svuotare il passato»                                                                                                                                   | 4B   |      |      |
| Esegui… con parole speciali    | parole speciali nel dialog Esegui…, per esempio `pisa`                                                                     | `pisa` mostra una piccola Torre pendente in pixel art (immagine originale, registrata in ASSETS.md)                                                                              | 4B   |      |      |
| Campo minato vinto             | vittoria a Campo minato                                                                                                    | messaggio di congratulazioni personalizzato                                                                                                                                      | 4B   |      |      |
| Cestino con la v1              | apertura del Cestino                                                                                                       | screenshot della v1 e link al tag `v1.0.0-legacy` (PLAN.md, 4B)                                                                                                                  | 4B   |      |      |
| 404 a schermata blu            | URL inesistente                                                                                                            | pagina 404 in stile schermata blu, con testo originale (PLAN.md, 4A)                                                                                                             | 4A   |      |      |
| Spegni e Riaccendi             | Start › Spegni…                                                                                                            | dialog Spegni, schermata di congedo «Puoi chiudere questa scheda.» e Riaccendi, senza ricaricare la pagina (pacchetto F2A, tavole D11–D12)                                       | 2A   |      |      |

Idea dalla v1: il terminale `while(true) { sudo apt install -y coffee; code(); }` della home (vedi CONTENT.md).
