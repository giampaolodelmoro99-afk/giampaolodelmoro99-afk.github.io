# ADR-0016: Accessibilità del desktop a finestre

- **Stato**: Accettata
- **Data**: 2026-11-01
- **Fase**: 2A

## Contesto

Nella F2A la home diventa un desktop GDM 95: icone, finestre sovrapposte, taskbar, menu Start, menu della finestra e menu contestuale, selettore delle finestre, Esegui, Spegni. Un'interfaccia a finestre non ha un modello ARIA standard, e i lettori di schermo trattano male i pattern più vicini (`dialog` non modale, `menubar`, `application`). Vincoli: WCAG 2.2 AA in tutte le modalità (ACCESSIBILITY.md §1), Lighthouse Accessibility a 100 (ADR-0018), elementi interattivi su React Aria (CLAUDE.md), contenuto leggibile anche senza JavaScript (ADR-0014). Il piano della fase (§4) elencava le decisioni da prendere; qui sono registrate come implementate, con le differenze dal piano.

## Decisione

1. **Finestre come `region`, non `dialog`.** Ogni finestra è una `section` con `aria-labelledby` sul titolo. I contenuti sono documenti da leggere: dentro una region NVDA e VoiceOver restano in modalità lettura, mentre un `dialog` non modale porta NVDA in modalità focus e viene annunciato come modale in modo incoerente. Il landmark `main` contiene tutto il desktop (icone e finestre); la taskbar è un `Toolbar` etichettato fuori da `main`.
2. **Titoli.** Il titolo della barra non è un heading: dà il nome alla region. Il contenuto della finestra della route parte da `h1` (About su `/`: «Gianpaolo Del Moro»); le finestre aperte dopo partono da `h2`. Ogni pagina ha un solo `h1`. Il congedo di Spegni è un `main` con il suo `h1`.
3. **Finestre inattive `inert`.** Il corpo delle finestre non attive è `inert`; la barra del titolo resta cliccabile per attivarle. Durante l'animazione di chiusura o riduzione anche il corpo della finestra che esce è `inert`.
4. **Focus.**
   - Apertura e riattivazione di una finestra: il focus va sul corpo (`tabindex=-1`).
   - Chiusura: sul corpo della nuova finestra attiva, altrimenti sulle icone del desktop.
   - Riduzione: sul pulsante della finestra nella taskbar.
   - Esc chiude menu e dialog, **mai le finestre**.
   - Menu della finestra aperto con la scorciatoia: con Esc il focus torna dove era prima, non sul pulsante del menu.
   - Esegui e Spegni annullati: il focus torna su Start. Esegui con un comando riuscito: sulla finestra aperta.
   - Spegni › congedo: il focus va su «Riaccendi», l'unico elemento interattivo. Riaccendi e Riavvia: il focus va sulle icone del desktop vuoto.
   - **Differenza dal piano**: riattivando una finestra il focus va al corpo, non all'ultimo elemento che aveva il focus. La memoria per finestra si rivaluta in 2B, con i contenuti reali delle app.
5. **Annunci.** Una sola regione `aria-live="polite"` (`Announcer`) annuncia apertura, chiusura e riduzione delle finestre, inizio e fine di Sposta e Ridimensiona da tastiera e l'annullamento. I testi vengono dai dizionari. Il cambio di focus non si annuncia: lo fa già il lettore.
6. **Alternative al trascinamento** (WCAG 2.1.1 e 2.5.7):
   - menu della finestra (pulsante icona nella barra del titolo, Alt+Spazio, Alt+trattino) con Sposta e Ridimensiona: frecce di 8 px, Maiusc+frecce di 32 px, Invio conferma, Esc ripristina;
   - in touch, `MoveControls` con quattro frecce da 44 px, OK e Annulla;
   - Ingrandisci e Ripristina sempre disponibili; il doppio clic sulla barra è solo una scorciatoia.
7. **Menu.**
   - Start, menu della finestra e menu contestuale sono `Menu` di React Aria. Le voci Esegui… e Spegni… hanno `aria-haspopup="dialog"` (prop `opensDialog` di `MenuItem`).
   - Il menu contestuale si apre con il tasto destro sullo sfondo o su un'icona, con Maiusc+F10 e con il tasto Menu sull'elemento con il focus, e con la pressione lunga di 500 ms al tocco; solo con il desktop largo (da 768 px). Maiusc+F10 e il tasto Menu sono gestiti direttamente, perché Firefox non genera sempre l'evento `contextmenu` da tastiera. Dentro le finestre resta il menu del browser. Ogni voce ha un'altra strada (icone, menu Start), quindi nessuna funzione dipende dal tasto destro.
8. **Selettore delle finestre.** Dialog modale con una `ListBox` orizzontale e **focus reale** sulle voci. **Differenza dal piano**, che prevedeva `aria-activedescendant`: con il focus reale VoiceOver e NVDA leggono la voce in modo affidabile, e React Aria gestisce le frecce. Si apre con il pulsante Finestre (sempre raggiungibile; con `aria-disabled` quando non ci sono finestre, nome «Finestre aperte: nessuna») o con Alt+W e Maiusc+Alt+W; con la scorciatoia il rilascio di Alt attiva la voce scelta.
9. **Scorciatoie** (`src/features/desktop/shortcuts.ts`):
   - Alt+W e Maiusc+Alt+W (selettore), Alt+Spazio e Alt+trattino (menu della finestra attiva);
   - richiedono Alt senza Ctrl, Meta né AltGr (`getModifierState("AltGraph")`), che sui layout italiano, tedesco e francese scrive caratteri;
   - il tasto si riconosce da `event.key`, e da `event.code` solo quando `key` non è un carattere ASCII previsto (Option su Mac, tasti morti, layout non latini);
   - non scattano nei campi di testo né dentro `[data-shortcuts="off"]` (il Terminale);
   - su Mac le etichette usano il glifo ⌥ (disegnato a pixel, `aria-hidden`); il nome accessibile del pulsante Finestre contiene la scorciatoia per esteso, perché il `Button` di React Aria non inoltra `aria-keyshortcuts`.
10. **Esegui.** Campo con `Autocomplete` di React Aria: il focus resta nel campo e le frecce scorrono i suggerimenti con `aria-activedescendant`. La lista compare solo se c'è almeno un suggerimento (lo stato vuoto di React Aria sarebbe un `option` senza nome). Un nome sconosciuto rende il campo `aria-invalid` con l'errore collegato da `aria-describedby`.
11. **Skip link e ordine di Tab.** Lo skip link «Salta al contenuto» è il primo elemento, è un'ancora (funziona prima dell'idratazione) e porta al corpo della finestra attiva, altrimenti alle icone. Ordine: skip link › icone (un solo punto di Tab, frecce dentro) › finestra attiva › Start › Finestre › pulsanti delle finestre (`Toolbar`, un solo punto di Tab).
12. **Movimento.** Animazioni di finestre e riavvio solo con le durate dei token, azzerate da `prefers-reduced-motion` e da `data-motion="reduce"`; con durata 0 chiusura e riduzione sono immediate.

## Alternative considerate

| Alternativa                           | Pro                             | Contro                                                                   | Perché scartata                       |
| ------------------------------------- | ------------------------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| Finestre come `dialog` non modale     | Semantica di «finestra»         | NVDA passa in modalità focus; annunci di modalità incoerenti tra lettori | I contenuti sono documenti da leggere |
| `role="application"` sul desktop      | Controllo completo dei tasti    | Disattiva la navigazione del lettore su tutto il contenuto               | Sproporzionato, rischioso             |
| Selettore con `aria-activedescendant` | Focus fermo su un solo elemento | Supporto meno affidabile in VoiceOver; frecce da gestire a mano          | Il focus reale funziona ovunque       |
| Scorciatoie su Alt+Tab                | Familiare                       | Intercettata dal sistema operativo                                       | Impossibile in un browser             |
| Titolo della finestra come heading    | Navigazione per titoli          | Doppio nome (region e heading) e livelli incoerenti con il contenuto     | Il nome della region basta            |

## Conseguenze

- Positive: il desktop si usa per intero da tastiera, mouse e touch; i lettori restano in modalità lettura nei contenuti; ogni gesto ha un'alternativa a puntatore singolo e da tastiera.
- Negative e rischi: il modello «region + `inert`» non dice al lettore quante finestre ci sono dietro; lo compensano il pulsante Finestre e il selettore. Le scorciatoie con Alt possono essere intercettate dal sistema (Alt+Spazio su Windows e GNOME): c'è Alt+trattino come riserva.
- Cosa va verificato: test unitari e e2e (`keyboard.spec.ts`, `context-menu.spec.ts`, `window-drag.spec.ts`, `touch-drag.spec.ts`, `csp.spec.ts`), axe su story e pagine; a fine fase la QA manuale con NVDA + Firefox e VoiceOver + Safari iOS (QA_CHECKLIST.md, sezione Desktop). Si rivaluta in 2B con la modalità mobile (MobileHome, App aperte) e la memoria del focus per finestra.

## Riferimenti

- `docs/phases/phase-02a-plan.md` §4, `docs/design/f2a-window-manager/NOTES.md` e `HANDOFF.md`
- `docs/ACCESSIBILITY.md`, `docs/QA_CHECKLIST.md`
- ADR-0014 (caricamento separato), ADR-0015 (attributi style), ADR-0018 (Lighthouse), ADR-0019 (verifiche proporzionate)
- `src/features/desktop/shortcuts.ts`, `src/features/desktop/app/DesktopApp.tsx`, `src/components/WindowSwitcher/`, `src/components/RunDialog/`
