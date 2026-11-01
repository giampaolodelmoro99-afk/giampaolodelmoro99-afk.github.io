# Accessibilità

## 1. Obiettivo

**WCAG 2.2 livello AA** come minimo, su tutte le route, in tutte le modalità (desktop e mobile), con tutti i temi. Se l'estetica 95 confligge con un criterio, vince il criterio.

## 2. Tastiera

- Tutto ciò che si fa con il mouse si fa anche da tastiera, e viceversa con il touch.
- Ordine del focus (F2A, ADR-0016): skip link «Salta al contenuto» › icone del desktop (un solo punto di Tab, frecce dentro) › finestra attiva › Start › Finestre › pulsanti delle finestre (`Toolbar`, un solo punto di Tab). Lo skip link è un'ancora, funziona anche prima dell'idratazione, e porta al corpo della finestra attiva o alle icone.
- Focus sempre visibile: **doppio anello** del design system GDM 95, tratteggio `--color-focus` di 2 px sopra un alone pieno `--color-focus-halo` (6 px in tutto). Il tratteggio fa 11,5:1 sul grigio, l'alone bianco 16:1 sul blu della barra del titolo; in alto contrasto il tratteggio è bianco (21:1 sul nero). Vale anche per i link delle pagine (`:focus-visible` in `global.css`, verificato da `keyboard.spec.ts`).
- Scorciatoie (F2A, ADR-0016 §9):
  - `Alt+W` e `Maiusc+Alt+W`: selettore delle finestre, che si conferma rilasciando Alt (alternativa: pulsante Finestre nella taskbar);
  - `Alt+Spazio` e `Alt+trattino`: menu della finestra attiva (alternativa: pulsante icona nella barra del titolo);
  - `Maiusc+F10` e tasto Menu: menu contestuale del desktop o dell'icona con il focus;
  - nel menu della finestra, Sposta e Ridimensiona: frecce di 8 px, `Maiusc`+frecce di 32 px, `Invio` conferma, `Esc` ripristina;
  - `Esc` chiude menu e dialog, mai le finestre; frecce nei menu e nelle icone; `Invio` apre l'elemento selezionato;
  - niente scorciatoie con AltGr, nei campi di testo o dentro `[data-shortcuts="off"]`; su Mac le etichette usano ⌥.
- Focus dopo le azioni sulle finestre: apertura e riattivazione sul corpo della finestra, chiusura sulla finestra successiva o sulle icone, riduzione sul pulsante della taskbar (ADR-0016 §4).
- Indietro e Avanti del browser (F2B, ADR-0021): il focus va al corpo della finestra della voce, o alle icone se nessuna è attiva; una finestra riaperta si annuncia. Il cambio di lingua lascia il focus sul suo link. Nessuna voce nasce senza un gesto, e chiudere una finestra non lascia voci doppie.
- Nessuna trappola del focus, salvo dialog modali (React Aria gestisce cattura e ripristino).

## 3. Screen reader

- Landmark: `main` contiene il desktop (icone e finestre); la taskbar è un `Toolbar` etichettato; `nav` per le icone nel guscio statico prima dell'idratazione.
- Finestre: `section` con `aria-labelledby` sul titolo (region), non `dialog`; il corpo delle finestre inattive è `inert`. Il titolo della barra non è un heading; il contenuto parte da `h1` nella finestra della route e da `h2` nelle altre (ADR-0016 §1–3).
- Voci di menu che aprono un dialog (Esegui…, Spegni…) con `aria-haspopup="dialog"`.
- Annunci live (`aria-live="polite"`, una sola regione) per apertura, chiusura e riduzione delle finestre, Sposta e Ridimensiona da tastiera e, in F3B, gli esiti del form.
- Icone decorative con `aria-hidden`; controlli icona con nome accessibile.
- `lang` sul documento e su ogni frammento in un'altra lingua (es. link "English version").

## 4. Movimento ridotto

- `prefers-reduced-motion: reduce` azzera le durate dei token (`tokens.css`).
- Il Pannello di controllo (F4A) ha un'opzione "Riduci animazioni" con lo stesso effetto, indipendente dal sistema.
- Niente lampeggi oltre 3 volte al secondo. Cursori lampeggianti e screensaver si fermano con reduced motion.
- Il boot si salta automaticamente con reduced motion.
- Animazioni delle finestre (F2A) solo con `transform` e `opacity`; con durata 0 chiusura e riduzione sono immediate. Lo schermo nero del riavvio dura `--restart-delay` (600 ms), 0 con movimento ridotto.

## 5. Alto contrasto

- Tema `high-contrast` (`data-theme`, F1A): nero con testo bianco, barra del titolo gialla, selezione ciano, testo ≥ 7:1, bordi pieni al posto dei bevel.
- Font dell'interfaccia **indipendente dal tema** (`data-font`): IBM Plex Sans è il predefinito in alto contrasto e si può scegliere anche nel classico (`readable`); `pixel` forza il font pixel anche in alto contrasto. La dimensione del testo (`--font-size-root`) non cambia il font.
- `forced-colors: active`: i token passano ai colori di sistema (`CanvasText`, `ButtonFace`, `Highlight`), il focus usa `Highlight` e i controlli hanno bordi `ButtonText` di 2 px al posto dei bevel.
- Verifica: e2e axe in alto contrasto su ogni pagina, con un controllo esplicito del contrasto del titolo (axe considera "incompleto" un testo dello stesso colore dello sfondo); story in Storybook nei due temi con axe e contrasto.

## 6. Touch, zoom e reflow

- Target ≥ 44×44 px in modalità touch (`--touch-target-min`); in modalità desktop almeno 24×24 px (WCAG 2.5.8).
- Nessuna funzione raggiungibile solo con hover o tasto destro: il menu contestuale (da 768 px) si apre anche con la pressione lunga di 500 ms, Maiusc+F10 e il tasto Menu, e ogni sua voce ha un'altra strada (icone, menu Start).
- Gesti di trascinamento sempre con un'alternativa a puntatore singolo (WCAG 2.5.7): Sposta e Ridimensiona dal menu della finestra, con le frecce `MoveControls` da 44 px al tocco; Ingrandisci e Ripristina sempre disponibili. Le maniglie di ridimensionamento hanno una zona di presa di 44 px al tocco.
- Reflow a 320 px senza scroll orizzontale; zoom del browser fino al 400% senza perdita di contenuto; `viewport` senza `maximum-scale`.
- Safe-area rispettata con `env(safe-area-inset-*)`.

## 7. Contenuti

- Contrasto del testo ≥ 4,5:1 (≥ 3:1 per testo grande e componenti dell'interfaccia).
- Testi alternativi per tutte le immagini informative, in IT ed EN.
- Errori dei form associati al campo (`aria-describedby`), annunciati, con istruzioni per correggerli.
- **Verifica anti-abuso del form contatti** (hCaptcha su consenso, ADR-0017, F3B). WCAG 2.2, criterio 3.3.8 (Accessible Authentication, Minimum), chiede di non imporre un test cognitivo come unica strada:
  - l'**email offuscata** (e GitHub) è sempre visibile accanto al form, come alternativa per chi non attiva o non completa la verifica;
  - si usa e si documenta nell'informativa l'**opzione accessibile di hCaptcha** (sfida alternativa o accesso senza sfida per chi usa tecnologie assistive);
  - pulsante «Attiva la verifica», riga informativa e stato della verifica sono raggiungibili da tastiera e annunciati.
- Nessuna informazione trasmessa solo dal colore.

## 8. Test

| Tipo                     | Strumento                                                                                                                    | Quando                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Automatico, struttura    | vitest-axe (jsdom, senza contrasto)                                                                                          | ogni componente                   |
| Automatico, pagina reale | @axe-core/playwright con tag WCAG 2.0/2.1/2.2 A e AA                                                                         | ogni route, ogni viewport         |
| Automatico, componenti   | @axe-core/playwright sulle story, temi classico e alto contrasto, input mouse e touch, con contrasto e target 44 px in touch | ogni story (progetto `storybook`) |
| Tastiera                 | e2e `keyboard.spec.ts`, `context-menu.spec.ts`, `desktop.spec.ts`                                                            | ogni interazione nuova            |
| Touch                    | e2e `touch.spec.ts` (target 44 px), `touch-drag.spec.ts` (trascinamento e pressione lunga)                                   | ogni controllo nuovo              |
| Lighthouse Accessibility | LHCI, soglia in PERFORMANCE_SEO.md §2                                                                                        | ogni build                        |
| Manuale                  | NVDA + Firefox, VoiceOver + Safari iOS, zoom 200/400%, `forced-colors`                                                       | a fine fase (QA_CHECKLIST.md)     |

## 9. Eccezioni documentate

Nessuna. Ogni eccezione futura richiede un ADR con criterio WCAG, motivazione e mitigazione.

Nota (non è un'eccezione): il testo dei controlli disabilitati resta `#808080` su `#c0c0c0` con l'incisione bianca del 95 (2,17:1). WCAG 1.4.3 esclude i componenti inattivi dall'obbligo di contrasto; il controllo resta comunque visibile.
