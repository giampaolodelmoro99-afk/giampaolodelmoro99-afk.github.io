Design system di **gianpaolodelmoro.it**: l'atmosfera di Windows 95 (grigi, bevel a due livelli, barre del titolo blu, pixel art) ricostruita da zero per il web di oggi. Copre da 320 a 1440 px, mouse, touch e tastiera, con contrasto WCAG 2.2 AA in ogni tema. Si implementa in React con CSS Modules, variabili CSS come token e React Aria Components.

## Principi

- **Proporzioni del 95, non pixel del 95.** Mantieni i rapporti (pulsante alto circa il doppio del testo, bevel a due livelli, spazi stretti) con testo a 16 px. Non copiare le misure del 1995.
- **Una sola fonte.** Colori, bevel, misure, tipografia, z-index e durate esistono solo come token. Nei CSS Modules usa solo `var(--…)`; un nuovo valore nasce prima come token.
- **Accessibile prima che fedele.** Quando l'estetica 95 contrasta con WCAG 2.2 AA, vince WCAG. Le deroghe applicate sono elencate in fondo, sotto "Scelte rispetto al 95".
- **Originale.** Nessun asset Microsoft: niente logo o bandierina, niente icone, font, suoni o personaggi originali. Il pulsante Start usa il monogramma GDM. Ogni asset nuovo va registrato in `ASSETS.md` prima di essere usato.

## Impostazioni sull'elemento `<html>`

| Attributo | Valori | Effetto |
| --- | --- | --- |
| `data-theme` | `classic` (predefinito), `high-contrast` | Ridefinisce i token colore e i bevel. |
| `data-font` | assente, `pixel`, `readable` | Font dell'interfaccia, **indipendente dal tema**. Se manca vale il predefinito del tema: `pixel` nel classico, `readable` in alto contrasto. `readable` usa IBM Plex Sans anche per menu, pulsanti ed etichette. |
| `data-input` | assente, `mouse`, `touch` | Modalità dei controlli. Se manca decide `@media (pointer: coarse)`; il Pannello di controllo può forzarla. Si può applicare anche a un singolo contenitore. |
| `data-motion` | assente, `reduce` | "Riduci animazioni": azzera `--duration-*` come fa `prefers-reduced-motion`. |
| `--font-size-root` | 100%, 112,5%, 125% | Dimensione del testo. Tutte le misure in rem seguono. |

Imposta `data-theme` e `data-font` sullo **stesso** elemento: così `data-font` vince sempre sul predefinito del tema. L'alias `--font-family-ui` si risolve in `--font-family-ui-pixel` o `--font-family-ui-readable`. I componenti leggono solo `--font-family-ui`.

## Colori

- Usa `--color-surface` per finestre, pulsanti, menu e taskbar, e `--color-text` sopra (11,5:1).
- Usa `--color-field` per campi, liste, checkbox e radio, e `--color-document` per le finestre documento. Il testo `--color-text` arriva a 21:1.
- Barra del titolo attiva: `--color-titlebar-active` con `--color-titlebar-active-text` (16:1). Inattiva: `--color-titlebar-inactive` #6a6a6a con `--color-titlebar-inactive-text` (5,4:1). Una sola finestra attiva alla volta.
- Selezione (liste, menu, select, etichette delle icone): `--color-selection` con `--color-selection-text`.
- Link sempre sottolineati: `--color-link`, e `--color-link-visited` per i visitati.
- Errore `--color-error` e successo `--color-success` sempre con una parola o un'icona, mai solo colore. Il successo è petrolio, non verde: si distingue dal rosso anche per chi non distingue rosso e verde.
- Desktop: `--color-desktop` con etichette `--color-desktop-text` (4,77:1).
- Usa `--color-pixel-*` (tavolozza a 16 colori) solo dentro le icone.
- Il tema `high-contrast` è nero, con testo bianco, barra attiva gialla, selezione ciano e link gialli. Ogni testo supera 7:1 e i bevel diventano bordi pieni bianchi.

## Bevel

I bevel sono `box-shadow` inset a due livelli. Nel tema ad alto contrasto diventano bordi pieni.

| Token | Dove |
| --- | --- |
| `--bevel-raised` | pulsanti, thumb e frecce di scorrimento, pannello delle schede |
| `--bevel-hover` | pulsanti in hover: uguale al rilievo nel classico, bordo ciano in alto contrasto |
| `--bevel-pressed` | pulsante premuto, con il contenuto spostato di 1 px |
| `--bevel-default`, `--bevel-default-pressed` | pulsante d'azione predefinita |
| `--bevel-sunken` | pulsante della taskbar della finestra attiva |
| `--bevel-field` | campi, select, checkbox, liste, corpo del documento |
| `--bevel-window` | finestre, menu a comparsa, dialog |
| `--bevel-status` | campi della barra di stato, orologio, barra di avanzamento |
| `--bevel-groove` | separatori e linee incise |
| `--bevel-tab` | linguette delle schede |

Per combinare un bevel con il focus scrivi `box-shadow: var(--focus-halo), var(--bevel-raised)`. L'alone va sempre per primo.

## Focus

Ogni elemento interattivo ha un **doppio anello**: un tratteggio `--color-focus` di `--focus-width` (2 px) sopra un alone pieno `--color-focus-halo` (`--focus-halo`, 6 px in tutto).

- Fuori dal controllo: `outline: var(--focus-width) var(--focus-style) var(--color-focus); outline-offset: var(--focus-offset); box-shadow: var(--focus-halo), …`.
- Dentro contenitori con overflow (voci di menu, opzioni, schede): `outline-offset: var(--focus-offset-inset)` e `box-shadow: var(--focus-halo-inset)`.
- Il nero sul grigio fa 11,5:1; l'alone bianco sul blu della barra del titolo fa 16:1. In alto contrasto il tratteggio è bianco con alone nero.
- I pulsanti, i select e le icone usano `[data-focus-visible]` (solo tastiera). I campi di testo usano `[data-focused]`, cioè sempre.

## Tipografia

| Ruolo | Token | Font |
| --- | --- | --- |
| Interfaccia e titoli (pixel) | `--font-family-ui-pixel` | Pixel Operator → **sostituto attuale: DotGothic16** |
| Interfaccia leggibile | `--font-family-ui-readable` | IBM Plex Sans |
| Testi lunghi | `--font-family-document` | IBM Plex Sans 400, 700, 400 corsivo |
| Codice e Terminale | `--font-family-mono` | monospace di sistema |

- **Pixel Operator non è ancora incluso.** Da questo ambiente non si raggiunge la fonte ufficiale, quindi l'interfaccia usa **DotGothic16** (SIL OFL 1.1, Fontworks), un pixel font progettato per i 16 px. Ha tutte le lettere accentate italiane, € … – — « » e le virgolette tipografiche. Ha un solo peso e il grassetto è sintetizzato dal browser. Pixel Operator è già il primo della pila: quando i suoi woff2 sono in `src/assets/fonts/` con `@font-face`, prende il posto del sostituto senza altre modifiche.
- Stili dell'interfaccia: `ui-label` (16/1,2), `ui-strong` (16/1,2 grassetto), `ui-heading` (24), `ui-display` (`--font-size-title`). Con il font leggibile: `ui-label-readable` e `ui-strong-readable`.
- Stili del documento: `doc-h1` 32, `doc-h2` 24, `doc-h3` 20, `doc-body` 16/1,5, `doc-small` 14. Le righe sono lunghe al massimo `--measure-document` (68ch).
- Il font pixel non scende mai sotto i 16 px (`--font-size-md`); `--font-size-sm` vale solo per IBM Plex Sans.
- Per avere CLS 0 servono font-display swap e un fallback metrico (`size-adjust`, `ascent-override`, `descent-override`). Si definiscono in `@font-face` nel repo, non nei token.

## Misure, desktop e touch

- Le coppie `*-desktop` / `*-touch` alimentano gli alias `--control-height`, `--titlebar-height`, `--titlebar-button-width`, `--choice-box`, `--choice-row`, `--menu-item-height`, `--scrollbar-size`, `--taskbar-height` e `--target-min`. Gli alias sono definiti in `tokens.css` e i componenti usano solo questi.
- Desktop: controlli alti 32 px e target di almeno 24×24 (WCAG 2.5.8). Touch: target di almeno 44×44 px (`--touch-target-min`, in px perché non deve ridursi).
- Spaziature `--space-1` … `--space-6` in rem. `--space-gutter`, `--space-safe-top` e `--space-safe-bottom` includono `env(safe-area-inset-*)`.
- Raggi: sempre `--radius-none`. Il radio è un cerchio disegnato a pixel in SVG, non un `border-radius`.
- Breakpoint `--bp-xs` 320, `--bp-sm` 480, `--bp-md` 768, `--bp-lg` 1024, `--bp-xl` 1440. Sono documentativi: nelle `@media` scrivi gli stessi valori in px, con approccio mobile-first.
- Z-index: `--z-desktop` 0, `--z-icons` 10, `--z-window` 100 (+ ordine della finestra), `--z-taskbar` 1000, `--z-menu` 1100, `--z-tooltip` 1200, `--z-overlay` 2000.

## Movimento

`--duration-instant/fast/base/slow` con `--easing-standard` (`steps(4, end)`): il movimento è a scatti, come sui PC dell'epoca. `prefers-reduced-motion` e `data-motion="reduce"` azzerano le durate. La barra indeterminata si ferma. Nessun lampeggio oltre 3 volte al secondo.

## Stati dei componenti

Gli stati vengono dagli attributi di React Aria, mai da classi aggiunte a mano: `[data-hovered]`, `[data-pressed]`, `[data-focus-visible]`, `[data-focused]`, `[data-selected]`, `[data-disabled]`, `[data-open]`, `[data-invalid]`.

- **Hover**: fondo `--color-surface-hover` sui pulsanti, etichetta sottolineata su checkbox, radio e icone, `--color-selection` su voci e opzioni.
- **Premuto**: `--bevel-pressed` e contenuto spostato di 1 px.
- **Disabilitato**: `--color-text-disabled` con ombra `--color-text-disabled-etch` di 1 px. Il controllo resta visibile.

Esempio di CSS Module:

```css
.root {
  min-block-size: var(--control-height);
  background: var(--color-surface);
  box-shadow: var(--bevel-raised);
  font-family: var(--font-family-ui);
}
.root[data-pressed] { box-shadow: var(--bevel-pressed); }
.root[data-focus-visible] {
  outline: var(--focus-width) var(--focus-style) var(--color-focus);
  outline-offset: var(--focus-offset);
  box-shadow: var(--focus-halo), var(--bevel-raised);
}
```

## Iconografia

- Le icone sono pixel art originale a 32 e 16 px, con la tavolozza a 16 colori, la luce in alto a sinistra e un contorno di 1 px (`--color-pixel-outline`, bianco in alto contrasto).
- Nell'interfaccia usa il componente `Icon`, che legge i colori dai token. Gli SVG del gruppo **Icone** hanno i colori del tema classico scritti dentro: usali per favicon, immagini Open Graph e documentazione.
- Scala solo per interi (32 → 64). Usa `shape-rendering="crispEdges"`.
- Le icone decorative hanno `aria-hidden`; i controlli con sola icona hanno un nome accessibile.
- Glifi dei controlli (spunta, frecce, riduci, ingrandisci, ripristina, chiudi): `Glyph`, pixel art a `--glyph-pixel` (2 px) in `currentColor`.

## Testi

- Interfaccia in italiano, versione inglese con `lang="en"`. Etichette brevi, con iniziale maiuscola e senza punto finale.
- Usa queste etichette delle icone:

| Icona | Italiano | English |
| --- | --- | --- |
| `about` | About | About |
| `projects` | Progetti | Projects |
| `cv` | CV | CV |
| `contacts` | Contatti | Contacts |
| `skills` | Skills | Skills |
| `timeline` | Timeline | Timeline |
| `makingof` | Making of | Making of |
| `controlpanel` | Pannello di controllo | Control Panel |
| `terminal` | Terminale | Terminal |
| `minefield` | Campo minato | Minefield |
| `trash` | Cestino | Trash |
| `privacy` | Privacy | Privacy |
| `simpleview` | Vista semplice | Simple view |
| `run` | Esegui | Run |

- Non usare nomi di prodotti Microsoft nelle etichette, quindi niente "MS-DOS", "Prato fiorito" o "Windows".
- I messaggi d'errore spiegano come correggere ("Manca il dominio, per esempio nome@dominio.it").

## Scelte rispetto al 95

- **Barra del titolo inattiva**: #6a6a6a con testo bianco (5,4:1) al posto di #808080 con #c0c0c0 (2,17:1).
- **Pulsanti della barra del titolo**: 24×24 px su desktop (erano 16×14), per WCAG 2.5.8.
- **Testo disabilitato**: resta #808080 su #c0c0c0 (2,17:1), con l'incisione bianca del 95. È esente da WCAG 1.4.3 perché i componenti inattivi non hanno obbligo di contrasto.
- **Focus**: doppio anello di 2 px al posto del rettangolo punteggiato di 1 px, perché sia visibile anche sul blu.
- **Hover**: il 95 non lo aveva. Qui c'è un fondo leggermente più chiaro (`--color-surface-hover`).
- **Alto contrasto sul desktop nero**: l'alone del focus è nero sul nero, e la visibilità la garantisce il tratteggio bianco (21:1).
- **Firefox** non permette di stilizzare le frecce della barra di scorrimento: mostra thumb e binario con i colori dei token.
- **Colori forzati** (`forced-colors: active`): i bevel spariscono e vengono sostituiti da bordi `ButtonText` di 2 px; selezione e barra del titolo usano `Highlight`.
