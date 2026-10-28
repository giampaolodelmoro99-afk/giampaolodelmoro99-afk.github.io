# F2A · Window manager — handoff per l'implementazione

Riferimento di progetto per il window manager di gianpaolodelmoro.it (v2), approvato il 18/10/2026. Nasce dalla tela Claude Design «GDM 95 · Window manager», costruita sul design system GDM 95 (versione copiata nella tela: `1791930028-46f7`).

Questa cartella è un riferimento visivo e comportamentale, non codice da copiare: le tavole sono mockup statici. L'implementazione segue le regole di GDM 95 (CSS Modules, solo `var(--…)`, stati dagli attributi di React Aria, nomi in inglese nel codice).

## Contenuto della cartella

| Percorso | Cosa contiene |
| --- | --- |
| `HANDOFF.md` | Questo documento: decisioni, modifiche a GDM 95, componenti nuovi, punti aperti |
| `NOTES.md` | Per ognuna delle 39 tavole: mouse, touch, tastiera e focus |
| `tavole/*.png` | Le 39 tavole a dimensione reale: 1440 × 900 (desktop), 375 × 812 e 320 × 568 (mobile), 960 × 600 (icone nuove) |
| `icone/*.svg` | Icone nuove `windows-16`, `windows-32`, `power-16`, `power-32`, nel formato del gruppo Icone di GDM 95 |
| `icone/ASSETS-righe.md` | Righe pronte per `ASSETS.md` (fonte, autore, licenza, SHA-256) |

Convenzione dei nomi PNG: `D` desktop, `M` mobile (`M15-*` è la schermata 15, cioè le 11–14 a 320 px), `I` icone; poi numero, schermata, larghezza per il mobile e tema (`classico` o `alto-contrasto`).

## Come sono state costruite le tavole

- Icone: componente `Gdm95.Icon` del bundle GDM 95, senza modifiche. In alto contrasto il disegno è lo stesso; cambia solo `--color-pixel-outline` (bianco).
- Glifi della barra del titolo, frecce e chevron: `Gdm95.Glyph` (`minimize`, `maximize`, `restore`, `close`, `up`, `down`, `left`, `right`).
- Il resto (finestre, taskbar, menu, dialog) è markup con i valori dei token GDM 95 copiati in un foglio di stile della tela. Nel sito vanno usati i componenti esistenti (`Window`, `TaskbarButton`, `StartButton`, `MenuItem`, `RadioGroup`, `TextField`, `DesktopIcons`…) dove ci sono, più i componenti nuovi elencati sotto.
- Misure delle icone: 16 px in menu, taskbar e barre del titolo; 32 px sul desktop e nella home a 320 px; 64 px (32 × 2) nella home mobile a 375 px.

## Decisioni prese

### Pulsante «Finestre» e selettore delle finestre (tavole D09b, M13)

- Nella taskbar, subito dopo Start, c'è il pulsante icona «Finestre» (icona `windows-16`, `aria-label` «Finestre aperte (Alt+W)»). Apre il selettore ed è l'alternativa alla scorciatoia per mouse e touch.
- Scorciatoie: Alt+W apre il selettore sulla finestra successiva, Alt+W ripetuto avanza, Maiusc+Alt+W torna indietro. Su Mac si mostrano come ⌥W e Maiusc+⌥W; nel codice si legge `event.code === 'KeyW'`, perché ⌥W scrive «∑».
- Rilasciando Alt/⌥ si attiva la finestra scelta; Invio la attiva subito, Esc annulla; ←/→ e Home/Fine a selettore aperto. Aperto dal pulsante, il selettore resta aperto finché si sceglie o si preme Esc.
- La scorciatoia non si attiva con il focus in un campo di testo (`input`, `textarea`, `contenteditable`, Terminale).
- Alt+Tab e il tasto Windows non si usano: li intercetta il sistema operativo.
- Ordine: finestre per ultimo uso, la corrente per prima; all'apertura è selezionata la successiva. Accessibilità: `listbox` con `aria-activedescendant`, nome della finestra annunciato con `aria-live`.
- Su mobile il selettore diventa «App aperte (n)» nella taskbar (tavole M13 e M15-app-aperte), con un elenco a tutta pagina: righe da 64 px che aprono l'app, «Chiudi» da 44 px per riga, «Chiudi tutte» in fondo.

### Menu della finestra (tavola D08b)

- Si apre dal pulsante icona a sinistra nella barra del titolo (sempre presente e raggiungibile con Tab), oppure con Alt+Spazio (⌥Spazio su Mac). Come riserva c'è Alt+trattino (⌥- su Mac), perché su Windows Alt+Spazio può essere intercettato dal sistema per il menu della finestra del browser. Codici: `Space` e `Minus`.
- Le due scorciatoie non si attivano con il focus in un campo di testo.
- Voci: Ripristina (disattivata se la finestra non è ingrandita), Sposta, Ridimensiona, Riduci a icona, Ingrandisci, separatore, Chiudi (azione predefinita, in grassetto).
- Sposta e Ridimensiona sono l'alternativa al trascinamento (WCAG 2.1.1 e 2.5.7): frecce 8 px, Maiusc+frecce 32 px, Invio conferma, Esc riporta la finestra com'era. Su touch compaiono quattro frecce da 44 px con OK e Annulla. Lo stato è annunciato con `aria-live`.
- Focus all'apertura sulla prima voce attiva (Sposta); alla chiusura torna sul pulsante icona.

### Spegni… (tavole D11, D12, M-spegni-*)

- Voce «Spegni…» in fondo al menu Start (icona `power-16`), che apre un dialog modale «Spegni» (icona `power-32`) con tre radio: Spegni (predefinita), Riavvia, Passa alla Vista semplice. Pulsanti OK (azione predefinita) e Annulla; nessun pulsante Aiuto.
- Il dialog è `aria-modal`, il resto della pagina è `inert`. Il focus va sul radio selezionato; con Annulla torna su Start.
- Spegni porta alla schermata di congedo: «Puoi chiudere questa scheda.», un testo di saluto originale, il pulsante «Riaccendi» con il focus all'apertura, il titolo della scheda «Spento · Gianpaolo Del Moro». Riaccendi riporta al desktop vuoto con il focus sul gruppo di icone.
- Riavvia mostra uno schermo nero breve (circa 600 ms, 0 con Riduci animazioni), poi il desktop pulito.
- Nessuna delle tre azioni ricarica la pagina: avviene tutto nello stato dell'app.

### Vista semplice e contenuto del desktop

- «Vista semplice» (icona `simpleview`) è sul desktop dopo Contatti: le icone del desktop sono 11. È anche nel menu Start e nella home mobile.
- Restano solo nel menu Start: Pannello di controllo, Privacy, Esegui….

### Home mobile e «App aperte» sotto i 360 px (tavole M11, M15-home)

- Home a 3 colonne con 13 icone: About, Progetti, CV, Contatti, Vista semplice, Skills, Timeline, Making of, Terminale, Campo minato, Pannello di controllo, Privacy, Cestino.
- A 375 px le icone sono da 64 px (32 × 2, la misura touch di GDM 95). Sotto i 360 px scendono a 32 px, perché con 64 px le 5 righe non entrerebbero sopra la taskbar.
- L'area di tocco è l'intera cella (icona e etichetta in un solo pulsante): almeno 101 × 76 px a 320 px, quindi sempre sopra i 44 × 44.
- Sotto i 360 px «App aperte (n)» diventa icona più numero, con `aria-label` «App aperte: n». In alto contrasto, con IBM Plex Sans, la versione lunga occuperebbe circa 310 px su 320 e con il testo al 125% non entrerebbe.
- A 320 × 568 il menu Start non entra tutto: le app scorrono (barra sottile) e il gruppo in basso (Pannello di controllo, Esegui…, Vista semplice, Spegni…) resta fisso.

### Altre decisioni di comportamento

- Esegui… si apre solo da Start (Win+R appartiene al sistema). Il campo è una combobox con suggerimenti filtrati; l'elenco occupa spazio nel dialog e non copre OK e Annulla.
- Menu contestuale del desktop: tasto destro, pressione lunga di 500 ms su tablet, Maiusc+F10 o tasto Menu (evento `contextmenu`). Su mobile non esiste.
- Finestre: una sola attiva; le inattive sono fuori dall'ordine di Tab (`inert`) e si raggiungono da taskbar o con Alt+W; Esc chiude menu e dialog, mai le finestre. Riducendo una finestra il focus va al suo pulsante nella taskbar.
- Trascinamento a contorno: si muove solo il rettangolo tratteggiato, la finestra si sposta al rilascio; Esc annulla.
- «Salta al contenuto» al primo Tab, in alto a sinistra sopra tutto; porta al gruppo di icone o al corpo della finestra attiva.
- Su mobile la finestra è a schermo intero: barra del titolo da 48 px con «Indietro» (solo nelle sottopagine, legato alla history) e «Chiudi» da 44 × 44; Esc non chiude l'app; all'apertura il focus va all'`h1` (`tabindex="-1"`).

## Modifiche a componenti GDM 95 esistenti

Da riportare nei CSS Modules dei componenti e, dove serve, nella sezione «Scelte rispetto al 95» del README di GDM 95.

1. **Pulsante attivo e Start premuto in alto contrasto** (`TaskbarButton` selezionato, `StartButton` con menu aperto, pulsanti «Finestre» e «App aperte» aperti). In HC `--bevel-sunken` e `--bevel-raised` sono identici (bordo bianco di 2 px), quindi lo stato premuto non si vede. Regola approvata:
   ```css
   [data-theme="high-contrast"] .root[data-selected],
   [data-theme="high-contrast"] .root[data-pressed] {
     background: var(--color-accent);       /* giallo */
     color: var(--color-text-inverse);      /* nero */
     box-shadow: var(--bevel-pressed);      /* bordo bianco da 3 px */
   }
   ```
2. **Focus interno nei controlli della taskbar** (`StartButton`, `TaskbarButton`, «Finestre», «App aperte»). L'anello esterno veniva tagliato dal bordo inferiore dello schermo e copriva il pulsante accanto. Si usa la variante interna, già prevista da GDM 95 per voci di menu e opzioni:
   ```css
   .root[data-focus-visible] {
     outline: var(--focus-width) var(--focus-style) var(--color-focus);
     outline-offset: var(--focus-offset-inset);                 /* −4 px */
     box-shadow: var(--bevel-raised), var(--focus-halo-inset);  /* bevel-sunken se selezionato */
   }
   ```
   Il bevel va prima dell'alone, così il rilievo resta visibile.
3. **Stato disattivato del pulsante «Finestre»** quando non ci sono finestre aperte: `aria-disabled="true"` (non `disabled`, così resta nell'ordine di Tab e annuncia «Finestre aperte: nessuna»), icona con `filter: grayscale(1)` e `opacity: 0.55`, nessuna azione al clic. Su mobile «App aperte (0)» usa `--color-text-disabled` con l'incisione `--color-text-disabled-etch` (in HC il verde `#3ff23f` del token).

## Componenti nuovi (non presenti in GDM 95)

Nomi proposti per il codice; tutti usano solo token GDM 95.

| Componente | Tavole | Note per l'implementazione |
| --- | --- | --- |
| `WindowMenu` | D08b | Menu di React Aria (`MenuTrigger`) aperto dal pulsante icona della barra del titolo e da Alt+Spazio / Alt+trattino. Voci con glifo a sinistra in una colonna da 20 px; voce disattivata con `--color-text-disabled`; Chiudi in grassetto. Modalità «Sposta» e «Ridimensiona» da tastiera e touch come descritto sopra. |
| `WindowSwitcher` | D09b | Pannello centrato con `--bevel-window`, riga di icone da 32 px in celle da 64, etichetta in un campo `--bevel-status`, suggerimento sulle scorciatoie. `role="dialog"` e `aria-modal`, `listbox` con `aria-activedescendant`, focus a doppio anello sull'icona scelta. Su mobile: `AppSwitcher` a schermo intero (M13). |
| `DragOutline` | D08 | Rettangolo della posizione di arrivo: bordo tratteggiato da 3 px `--color-focus` con filetto `--color-focus-halo` dentro e fuori, sopra le finestre (`--z-window` + 1 rispetto alla finestra trascinata), `aria-hidden`. |
| `ResizeHandles` | D08 | Otto maniglie da 10 × 10 px (angoli e metà dei lati) visibili sulla finestra attiva al passaggio sul bordo e durante il trascinamento; zona di presa da 8 px su desktop, 44 px con `data-input="touch"`; minimo della finestra `--window-min-width`. Il grip nella barra di stato resta sempre visibile. |
| `RunDialog` | D07 | Dialog con icona `run` 32, testo d'aiuto, combobox (`ComboBox` di React Aria) con suggerimenti filtrati, OK predefinito e Annulla. Errore sotto il campo con `aria-describedby`. |
| `ShutdownDialog` | D11, M-spegni | Dialog modale con icona `power-32` e `RadioGroup` a tre opzioni; su mobile largo 343 px con righe da 44. Composto da componenti esistenti più l'icona nuova. |
| `FarewellScreen` | D12, M-spegni-congedo | Schermata a tutta pagina su `--color-desktop` con monogramma GDM a 64 px, `h1` in Pixel Operator, testo in IBM Plex Sans, pulsante «Riaccendi» predefinito con focus all'apertura, dominio in basso. |
| `MobileHome` | M11, M15-home | Griglia a 3 colonne con un solo punto di Tab (roving tabindex, frecce in 2D). Icone 64 px da 360 px in su, 32 px sotto. Celle con area di tocco ≥ 44 × 44. |

Elementi minori nuovi: il pulsante icona «Finestre» in taskbar (`TaskbarIconButton`), il pulsante «App aperte» mobile con la variante compatta, la barra del titolo mobile con «Indietro», il link «Salta al contenuto».

## Contenuti e font

- **Contenuti segnaposto.** Bio, progetti (nomi, descrizioni, tecnologie), CV e testo dei Contatti sono segnaposto tra [parentesi quadre], in `--color-text-muted`. I contenuti veri arrivano in una fase successiva. Sono reali solo il nome «Gianpaolo Del Moro» e le etichette dell'interfaccia.
- **Font.** Nella tela IBM Plex Sans era caricato da Google Fonts solo per comodità della tela stessa. Il sito usa i font locali: Pixel Operator 400/700 (subset Latin-1) e IBM Plex Sans 400, 700 e 400 corsivo da `fonts/`, con `font-display: swap` e fallback metrico per CLS 0. Nessuna richiesta a Google Fonts. I file dei font non sono inclusi in questa cartella.
- Il subset di Pixel Operator non ha ⌥ (U+2325) né le frecce: frecce e chevron sono glifi `Glyph`; nei suggerimenti «⌥W» il carattere ⌥ cade sul font di sistema. Se si vuole uniformarlo, va aggiunto U+2325 al subset.

## Icone nuove

`windows-16`, `windows-32`, `power-16`, `power-32` (vedi `icone/` e la tavola `I01-icone-nuove-classico-e-alto-contrasto.png`). Vanno aggiunte al gruppo Icone di GDM 95 e al componente `Icon` (nomi `windows` e `power`, con le stesse classi `g95-pixel-*`), poi registrate in `ASSETS.md` con le righe di `icone/ASSETS-righe.md`.

## Verifica fatta sulle tavole

Le 39 tavole sono state renderizzate con il runtime della tela e controllate in automatico (testi troncati, elementi fuori area, errori, componenti non montati, focus presente) e poi a vista, con attenzione a 320 px e alto contrasto. Problemi trovati e corretti prima dell'approvazione: colore dei pulsanti della barra del titolo ereditato dalla barra (testo bianco su grigio, X invisibile in HC), anello di focus della taskbar tagliato, pulsante «Finestre» disattivato non grigio, elenco di Esegui sopra OK e Annulla.

## Punti aperti per l'implementazione

- Verificare su Windows (Chrome, Edge, Firefox) se Alt+Spazio arriva alla pagina; la riserva Alt+trattino è già prevista.
- Aggiungere `windows` e `power` al componente `Icon` e al gruppo Icone di GDM 95.
- Aggiornare il README di GDM 95 con le tre modifiche ai componenti esistenti.
