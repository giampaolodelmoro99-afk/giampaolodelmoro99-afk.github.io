# F2A · Window manager — note per tavola

Comportamento di mouse, touch e tastiera e gestione del focus per ognuna delle 39 tavole. Il nome del PNG corrispondente è indicato sotto ogni titolo, nella cartella `tavole/`. Le tavole ad alto contrasto e quelle a 320 px riportano prima le differenze, poi per intero la nota della tavola di riferimento: dove le due note divergono (per esempio la misura delle icone a 320 px) valgono le differenze.

## Note generali

- Font: Pixel Operator 400/700 (i woff2 del sito) per titoli, etichette e controlli; IBM Plex Sans per frasi e paragrafi. In alto contrasto vale il predefinito del DS: IBM Plex Sans anche per l'interfaccia.
- Il subset Latin-1 di Pixel Operator non ha ⌥ né le frecce (← → ↑ ↓ ▸): frecce e chevron sono glifi SVG; «⌥W» nelle note e nei suggerimenti cade sul font di sistema.
- Icone: quelle approvate di GDM 95, montate con il componente Gdm95.Icon (gruppi Icone, Monogramma; Cestino blu e nuovo Campo minato). In alto contrasto è lo stesso disegno: il componente legge --color-pixel-outline, che nel tema HC è bianco. Misure: 16 menu e taskbar, 32 desktop e 320 px, 64 (32 ×2) home mobile a 375.
- Glifi della barra del titolo, frecce e chevron: componente Gdm95.Glyph.
- Icone nuove, non presenti in GDM 95 (vedi tavola «Icone nuove» qui sotto): windows-16, windows-32 (pulsante Finestre / App aperte), power-16, power-32 (Spegni…). Stesse classi g95-pixel-* del componente, quindi stesso contorno da token. Da aggiungere al gruppo Icone e ad ASSETS.md.
- Pulsante Start: monogramma GDM, nessun logo di terzi.
- Focus: doppio anello (tratteggio 2 px + alone, 6 px in tutto) su ogni elemento interattivo; dentro menu ed elenchi l'anello è interno (offset −4 px).
- Alto contrasto: il pulsante della finestra attiva in taskbar e lo Start premuto diventano gialli (accent) con bordo da 3 px, perché bevel-sunken e bevel-raised in HC sono identici.
- Pulsante «Finestre» in taskbar (accanto a Start): apre il selettore, alternativa al mouse di Alt+W. È aria-disabled quando non ci sono finestre.
- Desktop: 11 icone in colonna (Vista semplice dopo Contatti); Pannello di controllo, Privacy ed Esegui… sono nel menu Start.
- Contenuti: bio, progetti, CV e testi delle app sono segnaposto tra [parentesi quadre] in grigio (.ph); restano veri solo il nome e le etichette dell'interfaccia.

## Desktop · tema classico · 1440 × 900

### Desktop · 1 · Desktop vuoto

`tavole/D01-desktop-vuoto-classico.png` · 1440 × 900 · sorgente nella tela: `Main.dc.html`

Mouse: clic su un'icona = selezione, doppio clic = apre. Clic sul desktop vuoto toglie la selezione.

Touch (tablet in vista desktop): un tocco apre.

Tastiera: ordine di Tab = Salta al contenuto › icone (un solo punto di Tab, frecce per muoversi, Invio apre) › Start › Finestre › pulsanti delle finestre. L'orologio non è interattivo.

Focus: al caricamento resta sul documento; il primo Tab mostra «Salta al contenuto» (schermata 10). «Finestre» è aria-disabled: resta raggiungibile e annuncia «nessuna».

### Desktop · 2 · Tre finestre sovrapposte

`tavole/D02-finestre-classico.png` · 1440 × 900 · sorgente nella tela: `D02-finestre.dc.html`

Una sola finestra attiva (barra blu, in primo piano); il suo pulsante in taskbar è premuto (bevel-sunken + aria-current).

Mouse: clic in una finestra inattiva la porta davanti e la attiva; si trascina dalla barra del titolo; doppio clic sulla barra = Ingrandisci/Ripristina. Clic sul pulsante in taskbar: se la finestra è attiva la riduce, altrimenti la attiva.

Touch: tocco = clic; pulsanti della barra a 44 px con data-input=touch.

Tastiera: Tab scorre icone › finestra attiva › taskbar; le finestre inattive escono dal Tab (inert) e si raggiungono da taskbar o con Alt+W. Esc chiude menu e dialog, mai le finestre.

Focus: attivando una finestra il focus torna all'ultimo elemento che aveva, altrimenti al primo.

### Desktop · 3 · Finestra ingrandita

`tavole/D03-ingrandita-classico.png` · 1440 × 900 · sorgente nella tela: `D03-ingrandita.dc.html`

Copre tutto tranne la taskbar; niente bordo né maniglie, la barra del titolo non si trascina. Il pulsante centrale diventa «Ripristina»: cambiano glifo e aria-label, l'elemento è lo stesso.

Mouse/touch: Ripristina, oppure doppio clic/doppio tocco sulla barra, tornano a dimensione e posizione precedenti.

Tastiera: Invio/Spazio su Ripristina; Icone/Dettagli sono pulsanti con aria-pressed.

Focus: resta sul pulsante dopo il clic, così un secondo Invio torna a Ingrandisci.

### Desktop · 4 · Finestra ridotta a icona

`tavole/D04-ridotta-classico.png` · 1440 × 900 · sorgente nella tela: `D04-ridotta.dc.html`

Progetti è ridotta: non si vede e il suo pulsante in taskbar resta in rilievo (non premuto). Diventa attiva la finestra successiva (Contatti).

Mouse/touch: clic sul pulsante in taskbar la ripristina dov'era e la rende attiva.

Tastiera: Tab fino al pulsante e Invio, oppure Alt+W.

Focus: riducendo con «Riduci» il focus va al pulsante della finestra in taskbar (qui con il doppio anello) e non si perde; al ripristino torna all'ultimo elemento che aveva nella finestra. aria-label del pulsante: «Progetti, ridotta a icona».

### Desktop · 5 · Menu Start

`tavole/D05-start-classico.png` · 1440 × 900 · sorgente nella tela: `D05-start.dc.html`

Mouse: clic su Start apre e chiude; il passaggio evidenzia la voce; clic su una voce apre l'app e chiude il menu; clic fuori chiude.

Touch: tocco su Start; voci da 28 px su desktop, 44 con data-input=touch.

Tastiera: Invio, Spazio o ↓ su Start aprono con il focus sulla prima voce; ↑/↓ girano in tondo, Home/Fine, l'iniziale salta alla voce; Invio attiva; Esc o Tab chiudono e riportano il focus su Start.

Focus: anello interno (offset −4 px) sopra la selezione. Start ha aria-expanded e aria-haspopup=menu; la fascia «gianpaolodelmoro» è decorativa (aria-hidden). Esegui… e Spegni… aprono un dialog (aria-haspopup=dialog).

### Desktop · 6 · Menu contestuale del desktop

`tavole/D06-menu-contestuale-classico.png` · 1440 × 900 · sorgente nella tela: `D06-contestuale.dc.html`

Mouse: tasto destro sul desktop vuoto apre il menu nel punto del clic, spostato se uscirebbe dallo schermo. «Disponi icone» apre il sottomenu al passaggio o al clic.

Touch: pressione lunga (500 ms) sul desktop del tablet; su mobile non esiste.

Tastiera: Maiusc+F10 o tasto Menu con il focus sul desktop o su un'icona (evento contextmenu); il menu si apre accanto all'elemento. ↑/↓, → apre il sottomenu, ← lo chiude, Esc chiude tutto.

Focus: prima voce all'apertura; alla chiusura torna dov'era. Aggiorna ridispone le icone senza ricaricare; Proprietà apre Pannello di controllo › Schermo.

### Desktop · 7 · Esegui…

`tavole/D07-esegui-classico.png` · 1440 × 900 · sorgente nella tela: `D07-esegui.dc.html`

Si apre da Start › Esegui…: nessuna scorciatoia globale (Win+R appartiene al sistema).

Mouse/touch: clic su un suggerimento lo inserisce ed esegue; OK apre; Annulla o X chiudono.

Tastiera: il campo è una combobox; scrivendo appare l'elenco filtrato; ↑/↓ scorrono i suggerimenti con aria-activedescendant (il focus resta nel campo); Invio = OK; Esc chiude prima l'elenco, poi il dialog.

Focus: all'apertura nel campo (sui campi l'anello è sempre visibile, data-focused). Comando sconosciuto: messaggio sotto il campo «Non trovo "xyz". Prova con progetti, cv o contatti», collegato con aria-describedby. Alla chiusura il focus torna su Start.

### Desktop · 8 · Trascinamento e maniglie

`tavole/D08-trascinamento-classico.png` · 1440 × 900 · sorgente nella tela: `D08-trascinamento.dc.html`

Mouse: premi sulla barra del titolo e trascina: si muove solo il rettangolo tratteggiato, la finestra si sposta al rilascio; Esc durante il trascinamento annulla. Bordi (8 px) e angoli ridimensionano con il cursore adatto, minimo 240 px. Le maniglie compaiono sulla finestra attiva al passaggio sul bordo e durante il trascinamento; il grip d'angolo nella barra di stato è sempre visibile.

Touch: stesso gesto; con data-input=touch le zone di presa salgono a 44 px.

Tastiera e WCAG 2.5.7: il menu della finestra (tavola 8b, pulsante icona o Alt+Spazio) offre Sposta e Ridimensiona, da usare con le frecce.

Focus: resta nella finestra; un aria-live annuncia lo spostamento.

### Desktop · 8b · Menu della finestra

`tavole/D08b-menu-finestra-classico.png` · 1440 × 900 · sorgente nella tela: `D08b-menu-finestra.dc.html`

Si apre con un clic (o tocco) sul pulsante icona della barra del titolo, oppure da tastiera con Alt+Spazio (⌥Spazio su Mac) o, come riserva, Alt+trattino (⌥- su Mac), quando il focus è nella finestra. Le due scorciatoie non si attivano con il focus in un campo di testo (input, textarea, contenteditable, Terminale). Il pulsante icona resta sempre disponibile, anche da Tab, come accesso garantito. Voci: Ripristina (disattivata se la finestra non è ingrandita), Sposta, Ridimensiona, Riduci a icona, Ingrandisci, Chiudi (azione predefinita, in grassetto).

Sposta e Ridimensiona sono l'alternativa al trascinamento (WCAG 2.1.1 e 2.5.7): dopo averle scelte la finestra si muove o cambia misura con le frecce della tastiera, 8 px per pressione, 32 px con Maiusc; Invio conferma, Esc riporta la finestra dov'era. Su touch compaiono quattro frecce da 44 px sopra la finestra, con OK e Annulla.

Scorciatoie: Alt+Spazio / ⌥Spazio, riserva Alt+trattino / ⌥-.

Tastiera nel menu: ↑/↓ (le voci disattivate si saltano), Invio attiva, Esc chiude e riporta il focus sul pulsante icona.

Focus: sulla prima voce attiva (Sposta), con l'anello interno. Un aria-live annuncia «Spostamento: usa le frecce, Invio per confermare».

Perché la riserva: su Windows Alt+Spazio può essere intercettato dal sistema (menu della finestra del browser) e la pagina non lo riceve; Alt+trattino arriva sempre alla pagina. Su Mac si legge event.code (Space, Minus) perché ⌥ produce caratteri speciali.

### Desktop · 9a · Focus su un'icona

`tavole/D09a-focus-icona-classico.png` · 1440 × 900 · sorgente nella tela: `D09a-focus-icona.dc.html`

Tastiera: le icone sono un gruppo con un solo punto di Tab (roving tabindex): ↑/↓ tra le icone, Home/Fine, iniziale; Invio apre; Maiusc+F10 apre il menu contestuale dell'icona.

Focus: doppio anello attorno a icona ed etichetta; da tastiera focus e selezione coincidono (etichetta blu). Col mouse c'è solo la selezione, senza anello.

Mouse/touch: come nella schermata 1.

### Desktop · 9b · Selettore delle finestre

`tavole/D09b-selettore-finestre-classico.png` · 1440 × 900 · sorgente nella tela: `D09b-selettore.dc.html`

Scorciatoie: Alt+W (⌥W su Mac) apre il selettore sulla finestra successiva; Alt+W di nuovo avanza, Maiusc+Alt+W (Maiusc+⌥W) torna indietro; rilasciando Alt/⌥ si attiva la finestra scelta. Invio attiva subito, Esc annulla; ←/→ e Home/Fine funzionano a selettore aperto. Su Mac si legge event.code = KeyW, perché ⌥W scrive «∑».

La scorciatoia non si attiva con il focus in un campo di testo (input, textarea, contenteditable, Terminale).

Mouse/touch: si apre anche dal pulsante «Finestre» in taskbar (premuto, aria-expanded); così resta aperto finché scegli con un clic o premi Esc; clic fuori chiude.

Focus: anello sull'icona scelta (listbox con aria-activedescendant), nome sotto annunciato con aria-live. Alla chiusura il focus va nella finestra attivata; con Esc torna dov'era.

### Desktop · 10 · Salta al contenuto

`tavole/D10-salta-al-contenuto-classico.png` · 1440 × 900 · sorgente nella tela: `D10-salta.dc.html`

Primo Tab della pagina: compare in alto a sinistra sopra tutto (z-overlay) con il doppio anello. Invio porta il focus al contenuto principale: con il desktop vuoto il gruppo di icone, con finestre aperte il corpo della finestra attiva (tabindex=-1).

Mouse/touch: invisibile finché non ha il focus; non intercetta i clic.

Focus: sparisce quando il focus esce.

## Desktop · alto contrasto · 1440 × 900

### Desktop · 2 · Tre finestre — alto contrasto

`tavole/D02-finestre-alto-contrasto.png` · 1440 × 900 · sorgente nella tela: `HC02-finestre.dc.html`

Stesso comportamento della 2. Barra attiva gialla con testo nero; inattive nere con bordo bianco da 1 px. Il pulsante attivo in taskbar è giallo con bordo da 3 px: in HC rilievo e incavo sono entrambi bordi bianchi, quindi serve il colore per distinguerli. Interfaccia in IBM Plex Sans (predefinito HC).

**Comportamento ereditato — 2 · Tre finestre sovrapposte**

Una sola finestra attiva (barra blu, in primo piano); il suo pulsante in taskbar è premuto (bevel-sunken + aria-current).

Mouse: clic in una finestra inattiva la porta davanti e la attiva; si trascina dalla barra del titolo; doppio clic sulla barra = Ingrandisci/Ripristina. Clic sul pulsante in taskbar: se la finestra è attiva la riduce, altrimenti la attiva.

Touch: tocco = clic; pulsanti della barra a 44 px con data-input=touch.

Tastiera: Tab scorre icone › finestra attiva › taskbar; le finestre inattive escono dal Tab (inert) e si raggiungono da taskbar o con Alt+W. Esc chiude menu e dialog, mai le finestre.

Focus: attivando una finestra il focus torna all'ultimo elemento che aveva, altrimenti al primo.

### Desktop · 5 · Menu Start — alto contrasto

`tavole/D05-start-alto-contrasto.png` · 1440 × 900 · sorgente nella tela: `HC05-start.dc.html`

Stesso comportamento della 5. Selezione ciano con testo nero, fascia laterale gialla, Start premuto giallo, icone con contorno bianco.

**Comportamento ereditato — 5 · Menu Start**

Mouse: clic su Start apre e chiude; il passaggio evidenzia la voce; clic su una voce apre l'app e chiude il menu; clic fuori chiude.

Touch: tocco su Start; voci da 28 px su desktop, 44 con data-input=touch.

Tastiera: Invio, Spazio o ↓ su Start aprono con il focus sulla prima voce; ↑/↓ girano in tondo, Home/Fine, l'iniziale salta alla voce; Invio attiva; Esc o Tab chiudono e riportano il focus su Start.

Focus: anello interno (offset −4 px) sopra la selezione. Start ha aria-expanded e aria-haspopup=menu; la fascia «gianpaolodelmoro» è decorativa (aria-hidden). Esegui… e Spegni… aprono un dialog (aria-haspopup=dialog).

## Spegni… · desktop e mobile, due temi

### Desktop · Spegni… · dialog

`tavole/D11-spegni-dialog-classico.png` · 1440 × 900 · sorgente nella tela: `D11-spegni.dc.html`

Si apre da Start › Spegni…. Dialog modale (aria-modal), sfondo velato, desktop e taskbar inert. Scelte: Spegni (predefinita), Riavvia, Passa alla Vista semplice; pulsanti OK (azione predefinita) e Annulla, niente Aiuto.

Mouse/touch: clic o tocco su tutta la riga del radio; OK conferma; Annulla o X chiudono.

Tastiera: il gruppo radio ha un solo punto di Tab, ↑/↓ cambiano scelta; Invio = OK da qualunque punto; Esc = Annulla; Tab gira dentro il dialog.

Focus: all'apertura sul radio selezionato (anello sull'etichetta); con Annulla torna su Start.

Nessuna scelta ricarica la pagina: Spegni › congedo; Riavvia › schermo nero breve (circa 600 ms, 0 con Riduci animazioni) e desktop pulito con il focus sul gruppo di icone; Vista semplice › la vista semplice del sito.

### Desktop · Spegni… · congedo

`tavole/D12-spegni-congedo-classico.png` · 1440 × 900 · sorgente nella tela: `D12-congedo.dc.html`

Testo originale, nessuna frase del 95. Il desktop è smontato e resta solo questa schermata (main con h1); il titolo della scheda diventa «Spento · Gianpaolo Del Moro».

Focus: all'apertura su «Riaccendi», con l'anello visibile; è l'unico elemento interattivo, quindi Tab resta lì.

Mouse/touch/tastiera: clic, tocco, Invio o Spazio riaccendono: desktop vuoto (schermata 1) con il focus sul gruppo di icone, senza ricaricare.

### Desktop · Spegni… · dialog — alto contrasto

`tavole/D11-spegni-dialog-alto-contrasto.png` · 1440 × 900 · sorgente nella tela: `HC11-spegni.dc.html`

Stesso comportamento. Bordo bianco da 3 px, radio bianchi su nero, OK con il bordo triplo dell'azione predefinita.

**Comportamento ereditato — Spegni… · dialog**

Si apre da Start › Spegni…. Dialog modale (aria-modal), sfondo velato, desktop e taskbar inert. Scelte: Spegni (predefinita), Riavvia, Passa alla Vista semplice; pulsanti OK (azione predefinita) e Annulla, niente Aiuto.

Mouse/touch: clic o tocco su tutta la riga del radio; OK conferma; Annulla o X chiudono.

Tastiera: il gruppo radio ha un solo punto di Tab, ↑/↓ cambiano scelta; Invio = OK da qualunque punto; Esc = Annulla; Tab gira dentro il dialog.

Focus: all'apertura sul radio selezionato (anello sull'etichetta); con Annulla torna su Start.

Nessuna scelta ricarica la pagina: Spegni › congedo; Riavvia › schermo nero breve (circa 600 ms, 0 con Riduci animazioni) e desktop pulito con il focus sul gruppo di icone; Vista semplice › la vista semplice del sito.

### Desktop · Spegni… · congedo — alto contrasto

`tavole/D12-spegni-congedo-alto-contrasto.png` · 1440 × 900 · sorgente nella tela: `HC12-congedo.dc.html`

Nero con testo bianco; l'anello di focus è un tratteggio bianco con alone nero.

**Comportamento ereditato — Spegni… · congedo**

Testo originale, nessuna frase del 95. Il desktop è smontato e resta solo questa schermata (main con h1); il titolo della scheda diventa «Spento · Gianpaolo Del Moro».

Focus: all'apertura su «Riaccendi», con l'anello visibile; è l'unico elemento interattivo, quindi Tab resta lì.

Mouse/touch/tastiera: clic, tocco, Invio o Spazio riaccendono: desktop vuoto (schermata 1) con il focus sul gruppo di icone, senza ricaricare.

### Mobile 375 · Spegni… · dialog

`tavole/M-spegni-dialog-375-classico.png` · 375 × 812 · sorgente nella tela: `M-spegni.dc.html`

Dialog largo 343 px (margini 16), righe radio da 44 px, OK e Annulla affiancati a metà larghezza. Comportamento identico al desktop.

**Comportamento ereditato — Spegni… · dialog**

Si apre da Start › Spegni…. Dialog modale (aria-modal), sfondo velato, desktop e taskbar inert. Scelte: Spegni (predefinita), Riavvia, Passa alla Vista semplice; pulsanti OK (azione predefinita) e Annulla, niente Aiuto.

Mouse/touch: clic o tocco su tutta la riga del radio; OK conferma; Annulla o X chiudono.

Tastiera: il gruppo radio ha un solo punto di Tab, ↑/↓ cambiano scelta; Invio = OK da qualunque punto; Esc = Annulla; Tab gira dentro il dialog.

Focus: all'apertura sul radio selezionato (anello sull'etichetta); con Annulla torna su Start.

Nessuna scelta ricarica la pagina: Spegni › congedo; Riavvia › schermo nero breve (circa 600 ms, 0 con Riduci animazioni) e desktop pulito con il focus sul gruppo di icone; Vista semplice › la vista semplice del sito.

### Mobile 375 · Spegni… · congedo

`tavole/M-spegni-congedo-375-classico.png` · 375 × 812 · sorgente nella tela: `M-congedo.dc.html`

«Riaccendi» alto 44 px, con il focus all'apertura. Il titolo va su due righe senza troncare.

**Comportamento ereditato — Spegni… · congedo**

Testo originale, nessuna frase del 95. Il desktop è smontato e resta solo questa schermata (main con h1); il titolo della scheda diventa «Spento · Gianpaolo Del Moro».

Focus: all'apertura su «Riaccendi», con l'anello visibile; è l'unico elemento interattivo, quindi Tab resta lì.

Mouse/touch/tastiera: clic, tocco, Invio o Spazio riaccendono: desktop vuoto (schermata 1) con il focus sul gruppo di icone, senza ricaricare.

### Mobile 375 · Spegni… · dialog — alto contrasto

`tavole/M-spegni-dialog-375-alto-contrasto.png` · 375 × 812 · sorgente nella tela: `MHC-spegni.dc.html`

Come il classico, con i colori dell'alto contrasto.

**Comportamento ereditato — Spegni… mobile**

Dialog largo 343 px (margini 16), righe radio da 44 px, OK e Annulla affiancati a metà larghezza. Comportamento identico al desktop.

**Comportamento ereditato — Spegni… · dialog**

Si apre da Start › Spegni…. Dialog modale (aria-modal), sfondo velato, desktop e taskbar inert. Scelte: Spegni (predefinita), Riavvia, Passa alla Vista semplice; pulsanti OK (azione predefinita) e Annulla, niente Aiuto.

Mouse/touch: clic o tocco su tutta la riga del radio; OK conferma; Annulla o X chiudono.

Tastiera: il gruppo radio ha un solo punto di Tab, ↑/↓ cambiano scelta; Invio = OK da qualunque punto; Esc = Annulla; Tab gira dentro il dialog.

Focus: all'apertura sul radio selezionato (anello sull'etichetta); con Annulla torna su Start.

Nessuna scelta ricarica la pagina: Spegni › congedo; Riavvia › schermo nero breve (circa 600 ms, 0 con Riduci animazioni) e desktop pulito con il focus sul gruppo di icone; Vista semplice › la vista semplice del sito.

### Mobile 375 · Spegni… · congedo — alto contrasto

`tavole/M-spegni-congedo-375-alto-contrasto.png` · 375 × 812 · sorgente nella tela: `MHC-congedo.dc.html`

Come il classico.

**Comportamento ereditato — Congedo mobile**

«Riaccendi» alto 44 px, con il focus all'apertura. Il titolo va su due righe senza troncare.

**Comportamento ereditato — Spegni… · congedo**

Testo originale, nessuna frase del 95. Il desktop è smontato e resta solo questa schermata (main con h1); il titolo della scheda diventa «Spento · Gianpaolo Del Moro».

Focus: all'apertura su «Riaccendi», con l'anello visibile; è l'unico elemento interattivo, quindi Tab resta lì.

Mouse/touch/tastiera: clic, tocco, Invio o Spazio riaccendono: desktop vuoto (schermata 1) con il focus sul gruppo di icone, senza ricaricare.

## Mobile · 375 × 812

### Mobile 375 · 11 · Home

`tavole/M11-home-375-classico.png` · 375 × 812 · sorgente nella tela: `M11-home.dc.html`

13 icone (Vista semplice dopo Contatti) a 64 px (32 ×2, la misura touch del DS). Touch: un tocco apre l'app a schermo intero. Niente doppio tocco né pressione lunga: su mobile non c'è menu contestuale. Celle alte almeno 96 px.

Tastiera esterna / screen reader: griglia con un solo punto di Tab, frecce in 2D, Invio apre.

Mouse: un clic apre.

Focus: Salta al contenuto › griglia › Start › App aperte. Con 0 app «App aperte (0)» è aria-disabled.

### Mobile 375 · 12 · App a schermo intero

`tavole/M12-app-375-classico.png` · 375 × 812 · sorgente nella tela: `M12-app.dc.html`

Barra del titolo da 48 px: «Indietro» (44 px, solo nelle sottopagine: torna alla lista Progetti, come il tasto Indietro del browser via history), titolo, «Chiudi» 44 × 44 (aria-label «Chiudi Progetti»).

Il contenuto scorre dentro la finestra; barra del titolo e taskbar restano fisse. Barra di scorrimento sottile (12 px), solo indicativa.

Tastiera: Esc non chiude l'app; Alt+W apre App aperte.

Focus: all'apertura sull'h1 (tabindex=-1), così lo screen reader legge il titolo. Indietro riporta il focus sulla voce della lista da cui eri entrato; Chiudi lo porta all'icona dell'app nella home.

### Mobile 375 · 13 · App aperte

`tavole/M13-app-aperte-375-classico.png` · 375 × 812 · sorgente nella tela: `M13-selettore.dc.html`

Si apre da «App aperte (n)», che resta premuto. Ogni riga (64 px) apre l'app e ha il suo Chiudi da 44 px; in fondo «Chiudi tutte».

Touch: tocco sulla riga apre. Lo swipe per chiudere è solo una scorciatoia: il pulsante c'è sempre (WCAG 2.5.7).

Tastiera: ↑/↓ tra le righe, Invio apre, Canc chiude la riga, Esc chiude il selettore; Alt+W lo apre anche qui.

Focus: all'apertura sull'app corrente; chiudendo un'app passa alla riga successiva; uscendo torna su App aperte.

### Mobile 375 · 14 · Menu Start

`tavole/M14-start-375-classico.png` · 375 × 812 · sorgente nella tela: `M14-start.dc.html`

Si apre sopra la taskbar a tutta larghezza; Start resta premuto. Voci da 44 px con icone 16 px, fascia verticale da 32 px.

Touch: tocco su una voce apre l'app a schermo intero e chiude il menu; tocco fuori chiude.

Tastiera: come su desktop (↑/↓, Home/Fine, Esc).

Focus: sulla prima voce all'apertura; alla chiusura torna su Start.

### Mobile 375 · 11 · Home — alto contrasto

`tavole/M11-home-375-alto-contrasto.png` · 375 × 812 · sorgente nella tela: `MHC11-home.dc.html`

Icone con contorno bianco su nero, etichette bianche, interfaccia in IBM Plex Sans.

**Comportamento ereditato — 11 · Home mobile**

13 icone (Vista semplice dopo Contatti) a 64 px (32 ×2, la misura touch del DS). Touch: un tocco apre l'app a schermo intero. Niente doppio tocco né pressione lunga: su mobile non c'è menu contestuale. Celle alte almeno 96 px.

Tastiera esterna / screen reader: griglia con un solo punto di Tab, frecce in 2D, Invio apre.

Mouse: un clic apre.

Focus: Salta al contenuto › griglia › Start › App aperte. Con 0 app «App aperte (0)» è aria-disabled.

### Mobile 375 · 12 · App a schermo intero — alto contrasto

`tavole/M12-app-375-alto-contrasto.png` · 375 × 812 · sorgente nella tela: `MHC12-app.dc.html`

Barra del titolo gialla; Indietro e Chiudi neri con bordo bianco; link gialli sottolineati.

**Comportamento ereditato — 12 · App a schermo intero**

Barra del titolo da 48 px: «Indietro» (44 px, solo nelle sottopagine: torna alla lista Progetti, come il tasto Indietro del browser via history), titolo, «Chiudi» 44 × 44 (aria-label «Chiudi Progetti»).

Il contenuto scorre dentro la finestra; barra del titolo e taskbar restano fisse. Barra di scorrimento sottile (12 px), solo indicativa.

Tastiera: Esc non chiude l'app; Alt+W apre App aperte.

Focus: all'apertura sull'h1 (tabindex=-1), così lo screen reader legge il titolo. Indietro riporta il focus sulla voce della lista da cui eri entrato; Chiudi lo porta all'icona dell'app nella home.

### Mobile 375 · 13 · App aperte — alto contrasto

`tavole/M13-app-aperte-375-alto-contrasto.png` · 375 × 812 · sorgente nella tela: `MHC13-selettore.dc.html`

Riga corrente con bordo giallo da 3 px; «App aperte» premuto in giallo.

**Comportamento ereditato — 13 · App aperte**

Si apre da «App aperte (n)», che resta premuto. Ogni riga (64 px) apre l'app e ha il suo Chiudi da 44 px; in fondo «Chiudi tutte».

Touch: tocco sulla riga apre. Lo swipe per chiudere è solo una scorciatoia: il pulsante c'è sempre (WCAG 2.5.7).

Tastiera: ↑/↓ tra le righe, Invio apre, Canc chiude la riga, Esc chiude il selettore; Alt+W lo apre anche qui.

Focus: all'apertura sull'app corrente; chiudendo un'app passa alla riga successiva; uscendo torna su App aperte.

### Mobile 375 · 14 · Menu Start — alto contrasto

`tavole/M14-start-375-alto-contrasto.png` · 375 × 812 · sorgente nella tela: `MHC14-start.dc.html`

Fascia gialla, Start premuto giallo, selezione ciano.

**Comportamento ereditato — 14 · Menu Start mobile**

Si apre sopra la taskbar a tutta larghezza; Start resta premuto. Voci da 44 px con icone 16 px, fascia verticale da 32 px.

Touch: tocco su una voce apre l'app a schermo intero e chiude il menu; tocco fuori chiude.

Tastiera: come su desktop (↑/↓, Home/Fine, Esc).

Focus: sulla prima voce all'apertura; alla chiusura torna su Start.

## Mobile · 320 × 568 (schermata 15)

### Mobile 320 · 15 · Home

`tavole/M15-home-320-classico.png` · 320 × 568 · sorgente nella tela: `S11-home.dc.html`

Sempre 3 colonne, icone a 32 px: con 64 px le 5 righe da 13 icone non entrerebbero sopra la taskbar. L'area di tocco resta l'intera cella (icona + etichetta, un solo pulsante): almeno 101 × 76 px, 101 × 90 con l'etichetta su due righe, quindi sempre oltre i 44 × 44 px. «Pannello di controllo» va su due righe. Sotto i 360 px «App aperte (n)» diventa icona + numero (aria-label «App aperte: n»): con il testo al 125% la versione lunga non entrerebbe.

**Comportamento ereditato — 11 · Home mobile**

13 icone (Vista semplice dopo Contatti) a 64 px (32 ×2, la misura touch del DS). Touch: un tocco apre l'app a schermo intero. Niente doppio tocco né pressione lunga: su mobile non c'è menu contestuale. Celle alte almeno 96 px.

Tastiera esterna / screen reader: griglia con un solo punto di Tab, frecce in 2D, Invio apre.

Mouse: un clic apre.

Focus: Salta al contenuto › griglia › Start › App aperte. Con 0 app «App aperte (0)» è aria-disabled.

### Mobile 320 · 15 · App a schermo intero

`tavole/M15-app-320-classico.png` · 320 × 568 · sorgente nella tela: `S12-app.dc.html`

h1 a 24 px. Indietro, titolo e Chiudi entrano; un titolo più lungo va in ellissi nella barra, mai i pulsanti.

**Comportamento ereditato — 12 · App a schermo intero**

Barra del titolo da 48 px: «Indietro» (44 px, solo nelle sottopagine: torna alla lista Progetti, come il tasto Indietro del browser via history), titolo, «Chiudi» 44 × 44 (aria-label «Chiudi Progetti»).

Il contenuto scorre dentro la finestra; barra del titolo e taskbar restano fisse. Barra di scorrimento sottile (12 px), solo indicativa.

Tastiera: Esc non chiude l'app; Alt+W apre App aperte.

Focus: all'apertura sull'h1 (tabindex=-1), così lo screen reader legge il titolo. Indietro riporta il focus sulla voce della lista da cui eri entrato; Chiudi lo porta all'icona dell'app nella home.

### Mobile 320 · 15 · App aperte

`tavole/M15-app-aperte-320-classico.png` · 320 × 568 · sorgente nella tela: `S13-selettore.dc.html`

Il sottotitolo della riga va in ellissi; nome e Chiudi restano interi.

**Comportamento ereditato — 13 · App aperte**

Si apre da «App aperte (n)», che resta premuto. Ogni riga (64 px) apre l'app e ha il suo Chiudi da 44 px; in fondo «Chiudi tutte».

Touch: tocco sulla riga apre. Lo swipe per chiudere è solo una scorciatoia: il pulsante c'è sempre (WCAG 2.5.7).

Tastiera: ↑/↓ tra le righe, Invio apre, Canc chiude la riga, Esc chiude il selettore; Alt+W lo apre anche qui.

Focus: all'apertura sull'app corrente; chiudendo un'app passa alla riga successiva; uscendo torna su App aperte.

### Mobile 320 · 15 · Menu Start

`tavole/M15-start-320-classico.png` · 320 × 568 · sorgente nella tela: `S14-start.dc.html`

Non entra tutto: le app scorrono (barra sottile), mentre Pannello di controllo, Esegui…, Vista semplice e Spegni… restano fissi in fondo.

**Comportamento ereditato — 14 · Menu Start mobile**

Si apre sopra la taskbar a tutta larghezza; Start resta premuto. Voci da 44 px con icone 16 px, fascia verticale da 32 px.

Touch: tocco su una voce apre l'app a schermo intero e chiude il menu; tocco fuori chiude.

Tastiera: come su desktop (↑/↓, Home/Fine, Esc).

Focus: sulla prima voce all'apertura; alla chiusura torna su Start.

### Mobile 320 · 15 · Home — alto contrasto

`tavole/M15-home-320-alto-contrasto.png` · 320 × 568 · sorgente nella tela: `SHC11-home.dc.html`

Con IBM Plex Sans «App aperte (0)» occuperebbe circa 310 px su 320: la versione compatta vale in entrambi i temi. Celle di tocco come nel classico: almeno 101 × 76 px.

**Comportamento ereditato — 15 · Home 320**

Sempre 3 colonne, icone a 32 px: con 64 px le 5 righe da 13 icone non entrerebbero sopra la taskbar. L'area di tocco resta l'intera cella (icona + etichetta, un solo pulsante): almeno 101 × 76 px, 101 × 90 con l'etichetta su due righe, quindi sempre oltre i 44 × 44 px. «Pannello di controllo» va su due righe. Sotto i 360 px «App aperte (n)» diventa icona + numero (aria-label «App aperte: n»): con il testo al 125% la versione lunga non entrerebbe.

**Comportamento ereditato — 11 · Home mobile**

13 icone (Vista semplice dopo Contatti) a 64 px (32 ×2, la misura touch del DS). Touch: un tocco apre l'app a schermo intero. Niente doppio tocco né pressione lunga: su mobile non c'è menu contestuale. Celle alte almeno 96 px.

Tastiera esterna / screen reader: griglia con un solo punto di Tab, frecce in 2D, Invio apre.

Mouse: un clic apre.

Focus: Salta al contenuto › griglia › Start › App aperte. Con 0 app «App aperte (0)» è aria-disabled.

### Mobile 320 · 15 · App a schermo intero — alto contrasto

`tavole/M15-app-320-alto-contrasto.png` · 320 × 568 · sorgente nella tela: `SHC12-app.dc.html`

Come il classico.

**Comportamento ereditato — 15 · App 320**

h1 a 24 px. Indietro, titolo e Chiudi entrano; un titolo più lungo va in ellissi nella barra, mai i pulsanti.

**Comportamento ereditato — 12 · App a schermo intero**

Barra del titolo da 48 px: «Indietro» (44 px, solo nelle sottopagine: torna alla lista Progetti, come il tasto Indietro del browser via history), titolo, «Chiudi» 44 × 44 (aria-label «Chiudi Progetti»).

Il contenuto scorre dentro la finestra; barra del titolo e taskbar restano fisse. Barra di scorrimento sottile (12 px), solo indicativa.

Tastiera: Esc non chiude l'app; Alt+W apre App aperte.

Focus: all'apertura sull'h1 (tabindex=-1), così lo screen reader legge il titolo. Indietro riporta il focus sulla voce della lista da cui eri entrato; Chiudi lo porta all'icona dell'app nella home.

### Mobile 320 · 15 · App aperte — alto contrasto

`tavole/M15-app-aperte-320-alto-contrasto.png` · 320 × 568 · sorgente nella tela: `SHC13-selettore.dc.html`

Come il classico.

**Comportamento ereditato — 15 · App aperte 320**

Il sottotitolo della riga va in ellissi; nome e Chiudi restano interi.

**Comportamento ereditato — 13 · App aperte**

Si apre da «App aperte (n)», che resta premuto. Ogni riga (64 px) apre l'app e ha il suo Chiudi da 44 px; in fondo «Chiudi tutte».

Touch: tocco sulla riga apre. Lo swipe per chiudere è solo una scorciatoia: il pulsante c'è sempre (WCAG 2.5.7).

Tastiera: ↑/↓ tra le righe, Invio apre, Canc chiude la riga, Esc chiude il selettore; Alt+W lo apre anche qui.

Focus: all'apertura sull'app corrente; chiudendo un'app passa alla riga successiva; uscendo torna su App aperte.

### Mobile 320 · 15 · Menu Start — alto contrasto

`tavole/M15-start-320-alto-contrasto.png` · 320 × 568 · sorgente nella tela: `SHC14-start.dc.html`

Come il classico: app scorrevoli, gruppo in basso fisso.

**Comportamento ereditato — 15 · Start 320**

Non entra tutto: le app scorrono (barra sottile), mentre Pannello di controllo, Esegui…, Vista semplice e Spegni… restano fissi in fondo.

**Comportamento ereditato — 14 · Menu Start mobile**

Si apre sopra la taskbar a tutta larghezza; Start resta premuto. Voci da 44 px con icone 16 px, fascia verticale da 32 px.

Touch: tocco su una voce apre l'app a schermo intero e chiude il menu; tocco fuori chiude.

Tastiera: come su desktop (↑/↓, Home/Fine, Esc).

Focus: sulla prima voce all'apertura; alla chiusura torna su Start.

## Icone nuove

### Icone nuove · Finestre e Spegni (due temi)

`tavole/I01-icone-nuove-classico-e-alto-contrasto.png` · 960 × 600 · sorgente nella tela: `Icone-nuove.dc.html`

windows-16, windows-32: due finestre sovrapposte, barra blu davanti e grigia dietro. power-16, power-32: pulsante tondo grigio con il simbolo di accensione generico (cerchio aperto e barra). Disegno originale, nessun computer con la luna.

Tavolozza a 16 colori, luce in alto a sinistra, contorno di 1 px su --color-pixel-outline. 64 px solo come anteprima (×2).
