# Accessibilità

## 1. Obiettivo

**WCAG 2.2 livello AA** come minimo, su tutte le route, in tutte le modalità (desktop e mobile), con tutti i temi. Se l'estetica 95 confligge con un criterio, vince il criterio.

## 2. Tastiera

- Tutto ciò che si fa con il mouse si fa anche da tastiera, e viceversa con il touch.
- Ordine del focus logico: contenuto della finestra attiva → taskbar → desktop. Skip link "Vai al contenuto" come primo elemento focusabile (Fase 2A).
- Focus sempre visibile: contorno tratteggiato 1 px stile 95 (`--color-focus`), contrasto ≥ 3:1 con lo sfondo.
- Scorciatoie stile 95, da definire in F2A e documentare qui. Proposta:
  - `Alt+Tab` non si può intercettare in modo affidabile; si usa invece una scorciatoia di cambio finestra non in conflitto con il browser
  - `Esc` chiude menu e dialog
  - frecce nei menu e nelle icone del desktop
  - `Invio` apre l'elemento selezionato
- Nessuna trappola del focus, salvo dialog modali (React Aria gestisce cattura e ripristino).

## 3. Screen reader

- Landmark: `main` per la finestra attiva, `nav` per menu e lingua, `header`/`footer` dove servono.
- Finestre: `role="dialog"` non modale o `region` con nome dalla titlebar (decisione in F2A, con test NVDA e VoiceOver).
- Annunci live (`aria-live="polite"`) per apertura, chiusura e minimizzazione delle finestre e per gli esiti del form.
- Icone decorative con `aria-hidden`; controlli icona con nome accessibile.
- `lang` sul documento e su ogni frammento in un'altra lingua (es. link "English version").

## 4. Movimento ridotto

- `prefers-reduced-motion: reduce` azzera le durate dei token (`tokens.css`).
- Il Pannello di controllo (F4A) ha un'opzione "Riduci animazioni" con lo stesso effetto, indipendente dal sistema.
- Niente lampeggi oltre 3 volte al secondo. Cursori lampeggianti e screensaver si fermano con reduced motion.
- Il boot si salta automaticamente con reduced motion.

## 5. Alto contrasto

- Tema `high-contrast` (F1): contrasto ≥ 7:1 per il testo dove possibile, bordi netti al posto dei bevel sottili, font leggibile anche per l'interfaccia.
- `forced-colors: active`: si usano i colori di sistema (`CanvasText`, `ButtonFace`, `Highlight`) e si garantiscono bordi visibili sui controlli.

## 6. Touch, zoom e reflow

- Target ≥ 44×44 px in modalità touch (`--touch-target-min`); in modalità desktop almeno 24×24 px (WCAG 2.5.8).
- Nessuna funzione raggiungibile solo con hover o tasto destro: il menu contestuale ha sempre un'alternativa (pulsante o pressione prolungata con equivalente da tastiera).
- Gesti di trascinamento sempre con un'alternativa a puntatore singolo (WCAG 2.5.7): per esempio massimizza o posiziona da menu.
- Reflow a 320 px senza scroll orizzontale; zoom del browser fino al 400% senza perdita di contenuto; `viewport` senza `maximum-scale`.
- Safe-area rispettata con `env(safe-area-inset-*)`.

## 7. Contenuti

- Contrasto del testo ≥ 4,5:1 (≥ 3:1 per testo grande e componenti dell'interfaccia).
- Testi alternativi per tutte le immagini informative, in IT ed EN.
- Errori dei form associati al campo (`aria-describedby`), annunciati, con istruzioni per correggerli.
- Nessuna informazione trasmessa solo dal colore.

## 8. Test

| Tipo                     | Strumento                                                              | Quando                        |
| ------------------------ | ---------------------------------------------------------------------- | ----------------------------- |
| Automatico, struttura    | vitest-axe (jsdom, senza contrasto)                                    | ogni componente               |
| Automatico, pagina reale | @axe-core/playwright con tag WCAG 2.0/2.1/2.2 A e AA                   | ogni route, ogni viewport     |
| Tastiera                 | e2e `keyboard.spec.ts`                                                 | ogni interazione nuova        |
| Touch                    | e2e `touch.spec.ts`, target 44 px                                      | ogni controllo nuovo          |
| Lighthouse Accessibility | LHCI = 100                                                             | ogni build                    |
| Manuale                  | NVDA + Firefox, VoiceOver + Safari iOS, zoom 200/400%, `forced-colors` | a fine fase (QA_CHECKLIST.md) |

## 9. Eccezioni documentate

Nessuna. Ogni eccezione futura richiede un ADR con criterio WCAG, motivazione e mitigazione.
