# GDM 95: consegna per l'implementazione

Questo pacchetto è il riferimento per implementare il design system GDM 95, approvato il 13/10/2026, nel sito gianpaolodelmoro.it. Va messo in `docs/design/gdm95/`. È documentazione: nessun file qui dentro viene importato dal codice così com'è. I file vanno copiati e adattati in `src/`.

## Contenuto

| Percorso | Cosa |
| --- | --- |
| `tokens.css` | Token completi: tema classico e alto contrasto, alias desktop/touch, `data-theme`, `data-font`, `data-input`, `data-motion`, movimento ridotto, `forced-colors`. Sostituisce `src/styles/tokens.css`. |
| `base.css` | Base globale minima (`box-sizing`, `body`), da importare subito dopo `tokens.css`. |
| `tokens.json` | Gli stessi token con le descrizioni in italiano (fonte del design system). |
| `README.md` | Linee guida generali: principi, colori, bevel, focus, tipografia, misure, icone, testi. |
| `components/<Nome>/README.md` | Linee guida del componente: cosa fornisce chi lo usa, stati, desktop e touch. |
| `components/<Nome>/<Nome>.module.css` | CSS di riferimento in formato CSS Modules, con gli stati sugli attributi `data-*` di React Aria. |
| `components/index.d.ts` | Le props dei componenti, come documentazione. |
| `components/Icon/glyphs.json` | Glifi in pixel art (spunta, frecce, riduci, ingrandisci, ripristina, chiudi) e cerchio del radio. |
| `examples/*.png` | Pagine di esempio a 1440 e 375 px, tema classico e alto contrasto, più mobile classico con font leggibile. |
| `icons/Icone`, `icons/Monogramma`, `icons/Dialoghi` | 33 SVG originali con il README del gruppo e gli SHA-256. |
| `icons/ASSETS-righe.md` | Righe pronte da incollare nella tabella Icone di `ASSETS.md`. |

I file dei font non sono inclusi: Pixel Operator e IBM Plex Sans vanno aggiunti al repo dalle fonti ufficiali (vedi "Provvisorio").

## Come si usa

1. Sostituisci `src/styles/tokens.css` con `tokens.css` e importa `base.css` subito dopo.
2. Imposta `data-theme` e `data-font` sullo **stesso** elemento `<html>`. `data-input` e `data-motion` vanno messi solo quando l'utente forza la modalità dal Pannello di controllo.
3. Per ogni componente crea `Componente.tsx` con il componente React Aria Components indicato nel README e copia `Componente.module.css` accanto. Le dipendenze tra moduli usano `composes`:
   - `TextArea` → `TextField` (`.input`)
   - `Window`, `TaskbarButton`, `StartButton` → `Button` (`.root`)
4. Gli stati vengono solo dagli attributi di React Aria: `[data-hovered]`, `[data-pressed]`, `[data-focus-visible]`, `[data-focused]`, `[data-selected]`, `[data-disabled]`, `[data-open]`, `[data-invalid]`.
5. Le anteprime del design system usavano React Aria Components **1.21.1** con React 18.3.1.

## Differenze rispetto al tokens.css attuale del repo

Il confronto è fatto variabile per variabile con il `tokens.css` di Fase 0.

**Rimossi:** nessun token.

**Invariati:** colori del tema classico già esistenti, `--bevel-raised` e `--bevel-sunken`, tutte le spaziature e le safe-area, `--font-family-mono`, le dimensioni del testo già esistenti, pesi e interlinee, breakpoint, `--touch-target-min`, z-index esistenti, durate, `--easing-standard`, `--radius-none`, il blocco `prefers-reduced-motion`.

**Cambiati:**

| Token | Prima | Ora | Note |
| --- | --- | --- | --- |
| `--font-family-ui` | pila di sistema | `var(--font-family-ui-pixel)` | Ora è un alias: vale pixel o leggibile secondo tema e `data-font`. I componenti leggono solo questo. |
| `--font-family-document` | `var(--font-family-ui)` | `"IBM Plex Sans", system-ui, …` | Le finestre documento usano Plex. |
| `--color-highlight`, `--color-text`, `--color-text-inverse`, `--color-focus` | `#fff`, `#000` | `#ffffff`, `#000000` | Solo la scrittura: il valore è identico. |

**Comportamento che cambia** (da aggiornare anche nei documenti del repo):

- **Focus.** `DESIGN_SYSTEM.md` §5 e `ACCESSIBILITY.md` §2 parlano di "contorno tratteggiato 1 px". Ora è un doppio anello: tratteggio `--color-focus` di 2 px sopra l'alone pieno `--color-focus-halo`. Si scrive come `outline` più `box-shadow: var(--focus-halo), …`; per voci di menu, opzioni e schede si usano `--focus-offset-inset` e `--focus-halo-inset`.
- **Font in alto contrasto.** `DESIGN_SYSTEM.md` §3 e `ACCESSIBILITY.md` §5: IBM Plex Sans è il predefinito del tema `high-contrast` ed è attivabile anche nel classico con `data-font="readable"`. `data-font="pixel"` forza il font pixel anche in alto contrasto.
- **Modalità touch.** Decide `@media (pointer: coarse)`. `data-input="touch"` e `data-input="mouse"` la forzano.

**Aggiunti (114 variabili):**

- **Colori** (40):
  - `--color-desktop-text`, `--color-text-disabled-etch`, `--color-text-muted`, `--color-surface-hover`
  - `--color-field`, `--color-field-disabled`, `--color-document`
  - barra del titolo attiva e inattiva (5)
  - `--color-selection`, `--color-selection-text`
  - `--color-link`, `--color-link-visited`, `--color-error`, `--color-success`
  - `--color-tooltip`, `--color-tooltip-border`, `--color-focus-halo`, `--color-overlay`
  - tavolozza delle icone `--color-pixel-*` (18)
- **Bevel** (10): `--bevel-field`, `--bevel-window`, `--bevel-pressed`, `--bevel-default`, `--bevel-default-pressed`, `--bevel-status`, `--bevel-groove`, `--bevel-hover`, `--bevel-tab`, `--bevel-none`.
- **Misure**: coppie `*-desktop` / `*-touch` (altezza dei controlli, barra del titolo e suoi pulsanti, checkbox e radio, voci di menu, barra di scorrimento, taskbar), più `--glyph-pixel`, barra di avanzamento, icone, `--window-min-width`, `--tooltip-max-width`, `--bevel-width`, `--border-width-hairline`.
- **Focus**: `--focus-width`, `--focus-halo-width`, `--focus-offset`, `--focus-offset-inset`, `--focus-style`, più i composti `--focus-ring-spread`, `--focus-halo`, `--focus-halo-inset`.
- **Tipografia**: `--font-family-ui-pixel`, `--font-family-ui-readable`, `--font-size-xl`, `--font-size-2xl`, `--measure-document`.
- **Livelli**: `--z-tooltip` (1200).
- **Alias di modalità** (usati dai componenti): `--control-height`, `--button-min-width`, `--titlebar-height`, `--titlebar-button-width`, `--titlebar-button-height`, `--choice-box`, `--choice-row`, `--menu-item-height`, `--scrollbar-size`, `--scrollbar-buttons`, `--taskbar-height`, `--target-min`, `--desktop-icon-size`.
- **Altro**: `--no-shadow`, `--dither` (retino a 2 px), `--forced-border-width`, `--forced-border-width-pressed` (questi ultimi due solo dentro `forced-colors`).

**Regole nuove:**

- Il blocco `[data-theme="high-contrast"]`: colori, bevel come bordi pieni e font leggibile.
- `[data-font]`, `[data-input]` con la media query `pointer: coarse`, e `[data-motion="reduce"]`.
- `@media (forced-colors: active)`: mappa i token sui colori di sistema e rende sempre visibile il focus.
- `--focus-halo`, `--focus-halo-inset` e `--dither` sono dichiarati su `:root, [data-theme]`. Così si ricalcolano anche dentro un contenitore con un tema diverso, come nelle pagine di esempio.

## Cosa è definitivo e cosa è provvisorio

### Definitivo (approvato)

- Nomi e valori dei token, tema classico e tema ad alto contrasto, contrasti verificati:
  - ogni testo ≥ 4,5:1 nel classico e ≥ 7:1 in alto contrasto
  - bordi e focus ≥ 3:1
- Le quattro scelte rispetto al 95:
  - barra inattiva `#6a6a6a` con testo bianco
  - pulsanti della barra del titolo 24×24 px su desktop
  - testo disabilitato del 95, esente da WCAG 1.4.3
  - focus a doppio anello di 2 px
- Misure desktop e touch, con target di almeno 24 px su desktop e 44 px in touch.
- Font dell'interfaccia come impostazione indipendente dal tema (`data-font`).
- Icone, monogramma GDM e icone dei dialoghi, compreso il **nuovo Cestino**: secchio blu con coperchio e pedale, senza simboli di riciclo. Sostituisce la prima versione grigia a righe, che ricordava il Cestino di Windows.
- Etichette delle icone in italiano e inglese, con "Terminale / Terminal" e "Campo minato / Minefield".

### Provvisorio

- **DotGothic16 al posto di Pixel Operator.** Da qui non si raggiunge la fonte ufficiale di Pixel Operator, quindi le anteprime e le immagini di esempio usano DotGothic16 (SIL OFL 1.1, Fontworks, pacchetto `@fontsource/dotgothic16` 5.3.1). È un pixel font pensato per i 16 px, con tutti i glifi italiani; ha un solo peso e il grassetto lo sintetizza il browser.
  - **Non aggiungerlo al repo e non registrarlo in `ASSETS.md`.** In `--font-family-ui-pixel` resta solo come secondo nome della pila.
  - Quando Pixel Operator è nel repo:
    1. Crea il subset woff2 regular e bold in `src/assets/fonts/` con `@font-face { font-family: "Pixel Operator"; … }`.
    2. Imposta `font-display: swap` e il fallback metrico.
    3. Registra lo SHA-256 in `ASSETS.md`.
    4. Togli `DotGothic16` dalla pila.
    5. Ricontrolla larghezze e altezze dei controlli: Pixel Operator è più largo, e le etichette lunghe (taskbar, menu) potrebbero troncarsi prima.
  - Pixel Operator è disegnato per i 16 px come DotGothic16, quindi la scala tipografica non cambia.
- **IBM Plex Sans.** I woff2 vanno presi da github.com/IBM/plex con `OFL.txt`, con lo stesso subset di glifi (regular, bold, corsivo regular).
- **CSS di riferimento dei componenti.** È ricavato dal foglio usato per le anteprime ed è stato verificato visivamente, ma non è ancora passato da Stylelint. Da sistemare:
  - Valori letterali rimasti: offset di 1, 2 e 3 px (contenuto premuto, padding della barra del titolo, stacco prima di Chiudi), opacità 0,5 e 0,75, larghezze di menu (11rem, 15rem), dialog (28rem), lista dei select (20rem / 60vh), anatomia statica della barra di scorrimento (10rem). Vanno trasformati in token oppure ammessi con un'eccezione documentata.
  - Le proprietà private `--_bevel` e `--_halo` potrebbero richiedere di adattare `custom-property-pattern`.
  - Le classi `.sb*` in `ScrollArea.module.css` sono l'anatomia statica per storie e test visivi, non per il sito.
  - Nei selettori verso altri componenti ho messo `svg` e `[role="menuitem"]` al posto delle classi: si possono sostituire con classi esplicite.
- **Pagine di esempio.** Sono immagini con il font sostitutivo: la resa definitiva arriverà con Pixel Operator.

## Decisioni rimandate

| Tema | Fase | Note |
| --- | --- | --- |
| Ruolo accessibile delle finestre: `role="dialog"` non modale o `region` con nome dalla barra del titolo | F2A | Da decidere con test su NVDA + Firefox e VoiceOver + Safari iOS. Per ora `section` con `aria-labelledby`. |
| Barra dei menu: `Toolbar` con `MenuTrigger` di React Aria (come ora) oppure pattern `menubar` ARIA | F2A | Da verificare insieme al ruolo delle finestre e alle scorciatoie. |
| Scorciatoie da tastiera (cambio finestra, Esc, frecce, Invio), skip link "Vai al contenuto" | F2A | Come da `ACCESSIBILITY.md` §2. |
| Annunci `aria-live` per apertura, chiusura e riduzione delle finestre ed esito del form | F2A | La barra di stato non annuncia nulla da sola. |
| Alternative ai trascinamenti (sposta, ridimensiona) e al menu contestuale | F2A | WCAG 2.5.7: voci di menu o pulsanti equivalenti. |
| Pannello di controllo: tema, font leggibile, modalità touch/desktop, Riduci animazioni, dimensione del testo, e il loro salvataggio | F4A | I token e gli attributi sono già pronti. |
| Varianti PNG della favicon (apple-touch-icon, alto contrasto) | F1 | Come previsto in `ASSETS.md`; il monogramma GDM è in `icons/Monogramma`. |
| Immagini Open Graph | F5 | Da generare in build con i font registrati. |
| Suoni | F4A | Nessuno previsto per ora. |

## Form Contatti degli esempi: solo dimostrativo

La finestra Contatti nelle pagine di esempio serve solo a mostrare i componenti insieme: campi, errore, schede, barra di avanzamento e pulsante predefinito. **Non è la specifica del form del sito.** Per il form vero valgono queste regole:

- **Ha solo tre campi: nome, email e messaggio.**
- **Niente** campo "Argomento", **niente** scelta "Rispondimi via" e **niente** casella di consenso privacy.
- **LinkedIn non deve comparire da nessuna parte del sito**: né nel form, né nei link, né nelle icone o nei testi. Dove serve un canale alternativo nei testi d'esempio si usa **GitHub**.
- Anche le schede "Altri canali" e "Agenda", la barra "Invio in corso" e la finestra "Messaggio inviato" sono dimostrative.
- Gli errori seguono `ACCESSIBILITY.md` §7: collegati al campo con `aria-describedby`, annunciati, e con l'istruzione per correggerli.
