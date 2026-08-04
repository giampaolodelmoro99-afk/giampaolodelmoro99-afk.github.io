# CLAUDE.md

## Panoramica

SPA portfolio personale, testi in italiano, estetica Windows 95.
Stack: React 19 + MUI 9 + Vite 8 + react-router 8, JavaScript puro (nessun TypeScript, anche se `@types/react` è installato).
Produzione: https://gianpaolodelmoro.it

## Comandi

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Dev server Vite |
| `npm run build` | `vite build` **+ `cp dist/index.html dist/404.html`** (fallback SPA) |
| `npm run preview` | Serve `dist/` come in produzione |
| `npm run lint` | oxlint (config in `.oxlintrc.json`) |

Il workflow CI usa Node 20: allinea la versione locale per evitare differenze tra build locale e build in Actions.

Nessun test nel progetto.

Verifica deep link (`/profilo`, `/stack`, …) e asset con path assoluto (`/cv-gianpaolo-del-moro.pdf`, `/og-image.png`) solo con `npm run build && npm run preview`. Il dev server risolve entrambi con regole proprie e nasconde le rotture: `dev` non prova nulla su questi due fronti.

## Struttura

```
src/
  main.jsx           BrowserRouter > ThemeProvider > CssBaseline > App
  App.jsx            rotte + lazy loading
  theme/theme.js     tema MUI + token w95 + font-face (unica fonte della palette)
  components/        Layout, Navbar, Window, DesktopIcons, Loading
  pages/             Home, Profilo, Stack, Progetti, Contatti, NotFound
  assets/fonts/      woff2 importati da theme.js, non referenziati da CSS
public/              servito da root assoluta: cv PDF, og-image, robots.txt, sitemap.xml
.github/workflows/deploy.yml
```

## Design system Windows 95

**Palette — fonte unica.** `src/theme/theme.js` è l'unico posto dove vivono i colori. Nei componenti importa i token, mai hex letterali:

```js
import { w95, raised, sunken } from "../theme/theme";
```

`w95` è un export nominale del modulo, **non** è dentro `theme.palette`: `theme.palette.w95` non esiste. Colori nuovi si aggiungono a `w95` in `theme.js`, non inline.

```
silver #c0c0c0 · lightest #ffffff · light #dfdfdf · dark #808080
darkest #0a0a0a · navy #000080 · teal #008080 (sfondo desktop)
```

Restano fuori palette solo i colori delle schermate speciali già esistenti: BSOD `#0000aa` (NotFound), shutdown `#ffa500` (Home), terminale `#000000`/`#c0c0c0` (Home).

**Bordi 3D.** Due stringhe di `boxShadow` a 4 inset, una l'inverso dell'altra:

```js
raised = inset -1px -1px darkest, inset 1px 1px lightest, inset -2px -2px dark, inset 2px 2px light
sunken = inset -1px -1px lightest, inset 1px 1px darkest, inset -2px -2px light, inset 2px 2px dark
```

`raised` = superfici in rilievo (Paper, Button, navbar, titlebar container). `sunken` = premuto, `NavLink` attivo, campi dati, barre skill e client area della `Window` (il Box interno, con `margin: "2px"` che lo stacca dal frame raised).

**Scala dei controlli.** Windows 95 girava a 640x480: font dei controlli 11px e pulsanti 23px erano misure giuste **lì**, su un viewport moderno sono fuori scala. Quello che si conserva sono le proporzioni, non i pixel: `uiScale` in `theme.js` (`15 / 11`) è l'unica costante da cui derivano tutte le misure dei controlli, tramite `scaleUi(valore95)` che scala e arrotonda una misura originale. `controlMetrics` la applica alle proporzioni del 95 — rapporto altezza/font `controlRatio = 2.1` (23 su 11 nel 95) — e produce `fontSize: 15`, `minHeight: 32`, `minWidth: 102`, `paddingX: 16`, `pressOffset: 3`. Per riscalare tutti i controlli si cambia `uiScale` e basta: non si toccano i numeri derivati e non si scrivono px assoluti nei componenti. Chi ha bisogno di scalare una misura non di controllo (padding e font della navbar) importa `scaleUi` e la applica al valore originale. `navbarHeight` va poi rimisurato in browser, non ricalcolato a mano.

**Oggetti di stile condivisi.** Oltre a `raised`/`sunken`/`focusStyle`, `theme.js` esporta gli oggetti che più di un file deve applicare identici: `titlebarStyle` e `titlebarGlyphStyle` (titlebar), `navButtonStyle` (pulsanti di navigazione delle pagine), `progressBarStyle` e `progressFillStyle` (barra segmentata). Vanno riusati via spread nell'`sx`, mai riscritti a mano nel componente: sono nati proprio da copie divergenti negli stessi punti.

**Titlebar.** `titlebarStyle` (`height: scaleUi(19)` = 26, `padding: "3px 4px"`, `fontSize` dei controlli = 15 bold, fondo `navy` su testo `lightest`) è la geometria unica della barra del titolo, usata da `Window`, dalla `ProjectCard` di `Progetti.jsx` e dal `Drawer` di `Navbar.jsx`. Anche qui le basi sono le misure del 95 (caption 19, glifo 16×14, icona 8) passate per `scaleUi`, non numeri scritti a mano. I glifi vivono in un box `titlebarGlyphStyle` (22×19 scalati, `raised`, icona `titlebarGlyphIconSize`): `_` e `□` sono SVG pixel-art inline (`viewBox="0 0 16 16"` + `shapeRendering="crispEdges"`, `fill` dai token `w95`), non caratteri di testo — il `□` ha la barra superiore spessa del "massimizza" reale. Il solo ✕ è ancora un carattere.

**Pulsanti di navigazione.** `navButtonStyle` è l'unico stile dei pulsanti wizard di Home, Profilo, Stack, Progetti e Contatti: porta solo `flex` e `whiteSpace`, tutto il resto (font, altezza, padding, pressione) arriva da `MuiButton`, che li prende da `controlMetrics`. Sovrascrivere `padding` o `fontSize` in `sx` rompe la scala e l'effetto pressione, perché il `:active` del tema sposta il testo partendo da `controlMetrics.paddingX`. Il `NavLink` della navbar non è un `MuiButton` e replica lo stesso stato premuto a mano, sempre da `controlMetrics` e con i valori in px (`paddingTop: "3px"`, `paddingLeft: "19px"`): in `sx` un numero passa dal sistema spacing MUI e diventa 8×.

**Focus.** `focusStyle` è un export nominale di `theme.js` (`&:focus-visible` → `outline: 1px dotted #000000`, `outlineOffset: -3`), stesso stile del `:focus-visible` di `MuiButton`. Ogni controllo interattivo che non è un `MuiButton` (hamburger e ✕ del drawer in `Navbar`, ✕ della `Window`, `NavLink` della navbar) deve applicarlo via spread nell'`sx`, così il rettangolo tratteggiato è identico ovunque.

**Stato disabilitato.** Un controllo inattivo non si nasconde: resta al suo posto in rilievo con il testo in `w95.dark` e una copia offset di 1px in `w95.lightest` sotto (`textShadow: 1px 1px 0 lightest`). È il caso del ✕ della `Window` senza `onClose`, reso come `span` con `aria-hidden` invece che come `button`.

**Tipografia.** `"Pixelated MS Sans Serif", Arial, sans-serif`, `fontSize: 11`, `button.textTransform: none`. I due `@font-face` (normal + bold) e `-webkit-font-smoothing: none` stanno in `MuiCssBaseline.styleOverrides`: senza quel blocco il font pixel non si carica e perde la resa a pixel netti.

**Override globali.** `shape.borderRadius: 0`, `MuiButtonBase.disableRipple: true`, `MuiButton` con `minWidth` / `minHeight` / `padding` presi da `controlMetrics` (102 / 32 / `"0 16px"`) e `:active` che applica `sunken` + `paddingTop: pressOffset, paddingLeft: paddingX + pressOffset` (effetto pressione), `MuiPaper` con `backgroundImage: "none"`.

**Scrollbar e selezione testo.** Fanno parte del tema, non delle pagine: vivono entrambe in `MuiCssBaseline.styleOverrides` di `theme.js`, sui colori `w95`. `::selection` è `navy` su `lightest`. La scrollbar è ridisegnata in stile 95 con i pseudo-elementi `::-webkit-scrollbar*` (larghezza 16px, track `silver` a puntinato ottenuto con due `linear-gradient` a scacchiera, thumb e frecce `raised`, `sunken` su `:active`); le quattro frecce sono SVG pixel inline come data URI, senza asset esterni — l'`#` dei colori va scritto `%23`.

Le implementazioni sono **due** e vanno tenute allineate come palette: quella webkit sopra e il fallback standard per Firefox (`scrollbar-color: silver dark` + `scrollbar-width: auto` su `html`), che non replica né frecce né bordi 3D ma tiene la scrollbar dentro la palette invece che su quella di sistema. Il fallback sta dentro `@supports not selector(::-webkit-scrollbar)`: senza quel guard, Chrome — che dalla 121 supporta `scrollbar-color` — passa alla scrollbar standard e butta via tutte le regole `::-webkit-scrollbar*`. Verificato in Chrome; il fallback Firefox va controllato a mano.

**Breakpoint.** Default MUI non sovrascritti: `xs 0 / sm 600 / md 900`. `sm` è il taglio mobile→desktop (navbar links vs drawer, dimensioni font). `md` si usa solo per la griglia progetti a 2 colonne e per mostrare `DesktopIcons`.

**Altezza pagina.** `navbarHeight` (`{ xs: 64, sm: 65 }`) e `pageMinHeight` sono export nominali di `theme.js`, accanto a `raised`/`sunken`. `navbarHeight` è l'altezza reale misurata della navbar ai due breakpoint; `pageMinHeight` è `calc(100vh - navbarHeight)`, cioè lo spazio che resta sotto la navbar. È l'unico `minHeight` ammesso sul wrapper di pagina: non scrivere `calc()` a mano (le versioni precedenti usavano `- 80px` e `- 100px`, entrambe scorrelate dalla navbar vera). Se cambia il padding o il font della navbar, si aggiorna `navbarHeight` e tutte le pagine seguono.

**Pattern visivi non nel tema.** Pannello `fieldset` + `legend` centrata (`border: 1px solid w95.dark` + `boxShadow: 1px 1px 0 lightest inset, -1px -1px 0 lightest`), titoli di pagina `clamp(26px, 8vw, 33px)` su xs e `77` da sm.

## Convenzioni di codice

- Importa MUI dagli entry point diretti (`@mui/material/Box`), mai dal barrel `@mui/material`. Solo `createTheme`/`ThemeProvider` da `@mui/material/styles`.
- Usa `react-router` (v8). Non installare né importare `react-router-dom`.
- Stile esclusivamente via prop `sx`. Nessun `styled()`, nessun file CSS, nessun CSS module.
- Non introdurre `borderRadius`, ombre diffuse, transizioni o ripple: rompono l'estetica 95.
- Gli oggetti di stile condivisi sono `const` a livello di modulo sopra il componente (`navButtonStyle`, `linkStyle`, `fieldStyle`, `glyphStyle`).
- I dati di pagina sono array di oggetti a livello di modulo (`links`, `contacts`, `icons`, `nodeProjects`, `frontendSkills`), mappati nel JSX.
- Un file esporta di default un solo componente, nome uguale al file; i sotto-componenti (`ProjectCard`, `SkillBar`, icone SVG) stanno nello stesso file, non esportati.
- Niente PropTypes, niente commenti dentro i componenti: il codice esistente ne è privo, mantieni la stessa densità.
- Responsive con oggetti breakpoint inline (`fontSize: { xs: 12, sm: 14 }`), mai media query scritte a mano.
- Testi UI in italiano; titoli finestra e legend in stile filename (`chi-sono.txt`, `rubrica.exe`, `task-manager.exe`).

## Pattern architetturali

- **Routing**: tutte le pagine in `lazy()`, un solo `<Suspense fallback={<Loading/>}>` che avvolge `<Routes>`. Le rotte stanno dentro `<Route element={<Layout />}>`, con `path="*"` → `NotFound` sempre per ultima. `BrowserRouter` senza `basename`.
- **Layout**: `Navbar` sticky + `DesktopIcons` fixed + `<Outlet/>` in `<Box component="main">`.
- **Window**: contenitore di ogni pagina (titlebar navy, glifi `_ □ ✕`, prop `sx` per width/maxWidth, `onClose` opzionale — usato solo da Home per la schermata di shutdown).
- **Wrapper di pagina**: tutte e cinque le pagine usano lo stesso schema, ed è quello che una pagina nuova deve seguire. Box esterno `display: flex` + `justifyContent: "center"` + `alignItems: "flex-start"` + `minHeight: pageMinHeight` + `padding: { xs: "12px", sm: "32px" }`; dentro, `<Window sx={{ width: "100%", maxWidth: 1000 }}>`; dentro la Window, un Box con `padding: { xs: "4px", sm: "16px" }`. `alignItems: "flex-start"` non è cosmetico: con `center` ogni finestra si centra sulla propria altezza e titlebar e titolo cadono a quote diverse da pagina a pagina.
- **Navigazione a wizard**: percorso lineare Home → Profilo → Stack → Progetti → Contatti tramite `<Button component={NavLink} to="…">`. Gli step interni alle pagine (Stack frontend/backend, Progetti Node/Laravel) sono `useState`, non rotte: non hanno URL propri.
- **Link esterni**: `component="a"` + `target="_blank"` + `rel="noopener noreferrer"`.
- **Icone**: SVG inline pixel-art, `viewBox="0 0 16 16"` + `shapeRendering="crispEdges"`, `fill` preso dai token `w95`.
- **Accessibilità**: `aria-label` sui button-icona, `aria-hidden="true"` sul decorativo (glifi della titlebar), `role="progressbar"` con `aria-valuenow` nelle `SkillBar`. `DesktopIcons` non è più decorativo: ogni icona è un `button` selezionabile con `aria-label` e `aria-pressed`, raggiungibile da tastiera e con `focusStyle`, quindi il contenitore non porta più `aria-hidden`.

## Deploy (attivo — documentato, non modificare)

`.github/workflows/deploy.yml`: push su `main` → Node 20 → `npm ci` → `npm run build` → `actions/upload-pages-artifact` (path `dist`) → `actions/deploy-pages`.

Repo `giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io`: user site, servito da root. Dominio `gianpaolodelmoro.it` configurato in Settings → Pages (`build_type: workflow`, HTTPS forzato, certificato anche per `www`), **non** da un file `CNAME` nel repo.

## Content Security Policy

La CSP vive in un `<meta http-equiv="Content-Security-Policy">` in `index.html`, primo tag dopo `viewport` e **prima** di qualsiasi tag che carica risorse (favicon, script iniettati da Vite): il browser applica solo le direttive che legge prima di iniziare a caricare. È nel meta e non in un header HTTP perché GitHub Pages serve file statici e non permette header custom: non c'è nessun altro posto dove metterla.

La policy attuale, derivata dall'inventario reale delle origini (nessun CDN, nessun font remoto, nessun `fetch`):

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
font-src 'self'; img-src 'self' data:; connect-src 'self';
object-src 'none'; base-uri 'self'; form-action 'none'; frame-src 'none'
```

Le due aperture non sono arbitrarie e non vanno strette senza cambiare architettura:

- **`style-src 'unsafe-inline'` è obbligatorio.** MUI/emotion inietta il CSS a runtime in `<style>` generati dal JS; senza `'unsafe-inline'` il sito si carica ma appare completamente senza stile. L'alternativa (nonce o hash) richiede di generare il valore a ogni risposta lato server, cosa che un hosting statico non può fare.
- **`img-src data:` serve alla scrollbar.** Le quattro frecce in `theme.js` sono SVG inline come data URI dentro `background-image`, e `background-image` ricade sotto `img-src`. Toglierlo lascia la scrollbar senza frecce.

Tutto il resto è chiuso: gli script sono solo i bundle propri (nessun inline, nessun `eval` — la build di produzione non ne genera), i due woff2 sono asset emessi da Vite sullo stesso dominio, non esiste nessuna chiamata di rete.

**Cosa resta scoperto.** Nel meta tag il browser **ignora** `frame-ancestors`, `report-uri` / `report-to` e `sandbox`: sono direttive che esistono solo come header HTTP. In pratica il sito non ha protezione anti-framing dalla CSP (nessuno può impedire che venga incorporato in un iframe altrui) e non arriva nessun report delle violazioni. Su GitHub Pages non c'è modo di rimediare: servirebbero header, quindi un hosting che li permetta (Netlify/Cloudflare Pages via `_headers`) o un proxy davanti. Per lo stesso motivo mancano `X-Frame-Options`, `Strict-Transport-Security`, `X-Content-Type-Options` e `Referrer-Policy`, che sono header e basta — nessuno dei due si può mettere in un meta.

**Regola.** Aggiungere una risorsa esterna — CDN di script o CSS, Google Fonts, analytics, iframe di YouTube, una chiamata a un'API — richiede di aprire la direttiva corrispondente nel meta tag. Se te ne dimentichi, **in `npm run dev` funziona tutto e in produzione la risorsa viene bloccata**: il dev server non serve `index.html` con lo stesso trattamento e i falsi negativi sono la norma.

**La CSP si testa solo con `npm run build && npm run preview`**, mai con `npm run dev`. In preview: console senza violazioni su tutte e cinque le pagine, stili MUI applicati (se la policy blocca emotion il sito è leggibile ma nudo, senza errori evidenti), font pixel caricato e non il fallback Arial, download del CV funzionante.

## Vincoli e trappole

- **Non rimuovere `cp dist/index.html dist/404.html` dallo script `build`.** È l'unico fallback per i deep link: senza, GitHub Pages risponde 404 a tutto ciò che non è `/`.
- **Non aggiungere `base` in `vite.config.js`.** Il sito è servito da root; un base path romperebbe tutti gli asset in produzione.
- **Non creare `public/CNAME`.** Il dominio vive nelle impostazioni Pages; un file in conflitto può far cadere il custom domain al deploy successivo.
- Il dominio è hardcoded in tre punti da tenere allineati: `index.html` (canonical + OG + Twitter), `public/robots.txt`, `public/sitemap.xml`.
- Ogni risorsa esterna nuova va aggiunta alla CSP in `index.html`, altrimenti passa in `dev` e viene bloccata in produzione. Vedi *Content Security Policy*.
- Una rotta nuova va aggiunta in tre posti: `App.jsx` (prima di `path="*"`), array `links` in `Navbar.jsx`, `public/sitemap.xml`.
- L'email in `Contatti.jsx` è spezzata e ricomposta con `["giampaolo.delmoro99", "gmail.com"].join("@")`: offuscamento anti-bot voluto, non riscriverla come stringa letterale.
- `Profilo.jsx` referenzia `/cv-gianpaolo-del-moro.pdf` con path assoluto: rinominare o spostare il file in `public/` rompe il download in produzione.
- **Due grafie del nome, entrambe corrette.** GitHub ed email usano `giampaolo` (repo, username, URL progetti in `Progetti.jsx`, email in `Contatti.jsx`); dominio e CV usano `gianpaolo` (`gianpaolodelmoro.it`, `/cv-gianpaolo-del-moro.pdf`, canonical/OG in `index.html`, sitemap, robots). Non uniformare e non scrivere questi path a memoria: verificali sempre nel file.
