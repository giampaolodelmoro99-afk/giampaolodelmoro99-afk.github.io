# Design system

Stato: **iniziale (Fase 0)**. Il catalogo dei componenti, i temi completi e i font si completano in Fase 1.

## 1. Principi

- **Proporzioni del 95, non pixel del 95.** I controlli del 95 erano pensati per 640×480 (font 11 px, pulsanti alti 23 px). Si conservano i rapporti (altezza/font ≈ 2,1, bevel a due livelli, spaziature) scalati per schermi moderni, come faceva `uiScale` nella v1.
- **Una sola fonte.** Colori, bevel, spaziature, tipografia, z-index e durate esistono solo come variabili in `src/styles/tokens.css`. I CSS Modules usano solo `var(--…)`, e Stylelint vieta valori letterali.
- **Accessibile prima che fedele.** Se l'estetica 95 confligge con WCAG 2.2 AA (contrasto, dimensione del testo, target touch), vince l'accessibilità.
- **Originale.** Nessun asset Microsoft: l'estetica si ricrea con CSS, SVG e asset con licenza libera (`ASSETS.md`).

## 2. Token

| Gruppo     | Token (Fase 0)                                                                                                                                                                                                                  | Note                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Colori     | `--color-desktop`, `--color-surface`, `--color-surface-light`, `--color-highlight`, `--color-shadow`, `--color-shadow-dark`, `--color-accent`, `--color-text`, `--color-text-inverse`, `--color-text-disabled`, `--color-focus` | Palette classica. Testo bianco su `#008080` = 4,77:1 (AA per testo normale).                                    |
| Bevel      | `--bevel-raised`, `--bevel-sunken`                                                                                                                                                                                              | Quattro `box-shadow` inset, uno l'inverso dell'altro. In F1: `--bevel-field`, `--bevel-window`.                 |
| Spaziature | `--space-0` … `--space-6`, `--space-gutter`, `--space-safe-top`, `--space-safe-bottom`                                                                                                                                          | In `rem`, così seguono la dimensione del testo. Gutter e safe-area includono `env(safe-area-inset-*)`.          |
| Tipografia | `--font-family-ui`, `--font-family-document`, `--font-family-mono`, `--font-size-root/sm/md/lg/title`, `--font-weight-*`, `--line-height-*`                                                                                     | In F0 font di sistema. In F1: Pixel Operator (UI) e IBM Plex Sans (documenti).                                  |
| Breakpoint | `--bp-xs` 320, `--bp-sm` 480, `--bp-md` 768, `--bp-lg` 1024, `--bp-xl` 1440                                                                                                                                                     | Documentativi. Le `@media` usano gli stessi valori in px, perché le variabili non funzionano nelle media query. |
| Touch      | `--touch-target-min` 44px                                                                                                                                                                                                       | Minimo per ogni controllo in modalità touch.                                                                    |
| Z-index    | `--z-desktop` 0, `--z-icons` 10, `--z-window` 100, `--z-taskbar` 1000, `--z-menu` 1100, `--z-overlay` 2000                                                                                                                      | Le finestre usano offset dentro `--z-window`.                                                                   |
| Movimento  | `--duration-instant/fast/base/slow`, `--easing-standard` (`steps(4, end)`)                                                                                                                                                      | Azzerati da `prefers-reduced-motion`. In F4 anche dal Pannello di controllo.                                    |
| Forma      | `--radius-none`                                                                                                                                                                                                                 | Il 95 non ha angoli arrotondati.                                                                                |

**Regole:**

- Un nuovo valore visivo nasce come token, poi si usa.
- Un token si rinomina solo con un refactor completo.
- I colori esadecimali sono ammessi solo in `tokens.css` (Stylelint `color-no-hex`).

## 3. Temi (Fase 1)

- **Classico**: palette di §2.
- **Alto contrasto**: `[data-theme="high-contrast"]` ridefinisce i token colore (contrasto ≥ 7:1 dove possibile) e usa il font leggibile anche per l'interfaccia. Rispetta anche `forced-colors: active` (colori di sistema, bordi visibili al posto dei bevel).
- **Dimensione del testo**: impostazione del Pannello di controllo che agisce su `--font-size-root`. Tutte le misure in `rem` seguono.

## 4. Font (Fase 1)

| Ruolo                | Font                                           | Licenza     | Uso                                                          |
| -------------------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------ |
| Interfaccia e titoli | Pixel Operator (regular e bold)                | CC0 1.0     | titlebar, menu, pulsanti, etichette                          |
| Testi lunghi         | IBM Plex Sans (regular, bold, italic se serve) | SIL OFL 1.1 | finestre "documento" stile WordPad: bio, case study, privacy |

**Requisiti** (vedi ADR-0010):

- subset woff2 con lettere accentate italiane maiuscole e minuscole, virgolette e apostrofo tipografici, €, … – —
- preload solo del font necessario al primo paint
- `font-display: swap` con fallback metrico (`size-adjust`, `ascent-override`, `descent-override`) per avere CLS 0
- alto contrasto e "dimensione testo" possono usare IBM Plex Sans anche per l'interfaccia

## 5. Convenzioni CSS Modules e React Aria

- Un file `Componente.module.css` accanto a `Componente.tsx`. Classi in camelCase (Stylelint `selector-class-pattern`).
- Gli stati vengono dagli attributi di React Aria Components, non da classi aggiunte a mano: `[data-hovered]`, `[data-pressed]`, `[data-focus-visible]`, `[data-selected]`, `[data-disabled]`, `[data-open]`.
- Mobile-first: lo stile base vale a 320 px, le `@media (min-width: …)` aggiungono.
- Nessun `!important` (Stylelint).
- Focus: contorno tratteggiato 1 px stile 95 (`--color-focus`), sempre visibile con tastiera.
- Stato disabilitato: il controllo resta visibile, testo `--color-text-disabled` con l'ombra chiara di 1 px.

## 6. Componenti (catalogo da completare in Fase 1)

Pulsante, pulsante icona, campo di testo, area di testo, checkbox, radio, select/listbox, slider, tab, menu, finestra (cornice), titlebar, barra di stato, gruppo (fieldset), barra di avanzamento, tooltip, dialog, icona del desktop. Ognuno ha story, test e varianti dei temi.

## 7. Icone

Pixel art originale in SVG (`viewBox="0 0 16 16"` o 32, `shape-rendering="crispEdges"`, colori dai token tramite `currentColor` o variabili). Ogni icona va registrata in `ASSETS.md`. Le icone decorative hanno `aria-hidden`; quelle che sono controlli hanno un nome accessibile sul controllo.
