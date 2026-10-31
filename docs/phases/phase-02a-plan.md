# Fase 2A — Window manager desktop

Branch `phase/02a-window-manager`, da `main` dopo il tag `phase-01b`. Piano approvato dal proprietario il 28/10/2026.

## Contesto

La home oggi è una pagina con h1 e frase. In 2A diventa il desktop GDM 95: icone, taskbar, menu, finestre. Ci sono quattro vincoli:

- il JS iniziale resta sotto i 115 kB, mentre il guscio della 1B da solo pesa 75 kB;
- la CSP resta senza `'unsafe-inline'`, mentre i componenti producono attributi `style`;
- Lighthouse resta a 100;
- l'architettura deve reggere la 2B (deep link, persistenza, modalità mobile).

Le decisioni prese con il proprietario il 28/10/2026:

- **Home**: la finestra About è aperta all'avvio, già nell'HTML prerenderizzato, con h1, titolo e bio approvati. CLS 0. Se e come ricordare la chiusura si decide in 2B.
- **Route delle app già in 2A**, solo nella direzione URL → finestra aperta. Sono gli slug della v1 dove l'app corrisponde a una pagina v1 (verificati da `git show v1.0.0-legacy:src/App.jsx` e `public/sitemap.xml`): `/profilo`, `/stack`, `/progetti`, `/contatti`. Gli altri sono provvisori fino alla 3A. Ogni route ha title, description e canonical propri.
- **`<title>`** di `/` e `/en/`: "Gianpaolo Del Moro · Full Stack Developer" (41 caratteri). Il titolo approvato completo va in `og:title`, `twitter:title` e `jobTitle` del JSON-LD.
- **Due tappe sullo stesso branch.** Alla fine della 2A-1 mi fermo: tu fai il push, poi servono la CI verde, Lighthouse strict a 100 su mobile e desktop e un riepilogo con i numeri. Dopo inizia la 2A-2. Spegni e il congedo sono in 2A, nella seconda tappa.

---

## 1. Analisi del pacchetto `docs/design/f2a-window-manager/`

**Struttura.** È già corretta: lo zip non ha creato cartelle in più. Contiene `HANDOFF.md`, `NOTES.md`, `tavole/` (39 PNG) e `icone/` (4 SVG e `ASSETS-righe.md`). Si committa così com'è, come riferimento, come `docs/design/gdm95/`.

**Icone.** Ho calcolato `sha256sum`: i quattro valori coincidono con `ASSETS-righe.md`. Il formato è identico a `src/assets/icons/*.svg`: viewBox 16 o 32, `crispEdges`, un `<path fill>` per colore, primo `#000000` usato come contorno. Quindi `npm run icons` genera i ruoli di colore senza cambiamenti.

**Decisioni del HANDOFF**, in sintesi:

- pulsante «Finestre» e selettore (Alt+W e Maiusc+Alt+W, si attiva al rilascio di Alt);
- menu della finestra (Alt+Spazio, riserva Alt+trattino) con Sposta e Ridimensiona da tastiera e da touch;
- trascinamento a contorno, con Esc che annulla;
- finestre inattive `inert`;
- Esc chiude menu e dialog, mai le finestre;
- Spegni… con tre scelte, congedo e riavvio di 600 ms (0 con movimento ridotto), senza ricaricare la pagina;
- Vista semplice sul desktop: le icone diventano 11. Pannello di controllo, Privacy ed Esegui… restano solo nel menu Start;
- Esegui… solo da Start, con una combobox.

**Componenti nuovi**: WindowMenu, WindowSwitcher, DragOutline, ResizeHandles, RunDialog, ShutdownDialog, FarewellScreen, TaskbarIconButton, SkipLink. MobileHome, AppSwitcher e la barra del titolo mobile sono della 2B.

**Modifiche alla 1B**:

- pulsante attivo e premuto in alto contrasto giallo, con bordo di 3 px;
- focus interno a −4 px nei controlli della taskbar;
- «Finestre» con `aria-disabled`;
- l'icona della barra del titolo diventa il pulsante del menu della finestra.

### Incoerenze e come le risolvo

| #   | Incoerenza                                                                                                                   | Risoluzione proposta                                                                                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | D01 non ha né h1 né testo; la home ha h1 ed elemento LCP                                                                     | About aperta all'avvio (decisa)                                                                                                                                                                                   |
| 2   | Icone come link prima dell'idratazione, ma le route sono previste in 2B                                                      | Route in 2A (decisa)                                                                                                                                                                                              |
| 3   | Il title con il nome arriva a 72 caratteri, oltre 60                                                                         | Nome e ruolo breve (decisa). Description: 147 e 147 caratteri, sotto 160                                                                                                                                          |
| 4   | Ordine di Tab: NOTES dice icone › finestra › taskbar, ACCESSIBILITY.md §2 dice finestra › taskbar › desktop                  | Vale NOTES, che è più recente e approvato. Si aggiorna ACCESSIBILITY.md. Lo skip link porta comunque al corpo della finestra attiva                                                                               |
| 5   | NOTES elenca Start › Finestre › pulsanti come tappe di Tab, ma `Taskbar` è un `Toolbar` con un solo punto di Tab e le frecce | Start e Finestre restano tappe di Tab separate. I pulsanti delle finestre restano nel `Toolbar`, con un solo punto di Tab e le frecce. Si annota nel piano e in ACCESSIBILITY.md                                  |
| 6   | NOTES dice «aria-current» per la finestra attiva, ma TaskbarButton è un `ToggleButton` con `aria-pressed`                    | Resta `aria-pressed`: il pulsante attiva o riduce, quindi è un interruttore. `aria-current` sarebbe un secondo stato contraddittorio                                                                              |
| 7   | Focus interno: HANDOFF mette il bevel prima dell'alone, DESIGN_SYSTEM §5 dice «alone sempre per primo»                       | Deroga voluta (un alone interno coprirebbe il bevel), registrata in §9                                                                                                                                            |
| 8   | La regola HC del HANDOFF usa `[data-theme="high-contrast"]` dentro il modulo                                                 | Nuovi token alias `--taskbar-active-bg`, `--taskbar-active-text`, `--taskbar-active-bevel`, ridefiniti nel tema HC. I componenti non leggono il tema                                                              |
| 9   | HANDOFF: «aggiungere U+2325 al subset», ma Pixel Operator non ha né ⌥ né le frecce                                           | Verificato con fontkit su `fonts-src/`: assenti nei due pesi. Si usa un nuovo glifo `option` in `Glyph` (§4.6)                                                                                                    |
| 10  | «Minimo 240 px» per la finestra                                                                                              | Si usa `--window-min-width` (15rem), che segue la dimensione del testo                                                                                                                                            |
| 11  | e2e con la CSP reale sulla home per Checkbox e Select: in 2A non entrano nella home                                          | Il caso `VisuallyHidden` è coperto dal Radio di Spegni, che usa lo stesso codice della Checkbox. Il `HiddenSelect` del Select si prova quando il Select entra in una pagina (F3B o F4A). La voce resta in PLAN.md |
| 12  | Nomi di prodotto Microsoft negli slug EN («Minesweeper», «Recycle Bin»)                                                      | `/en/minefield/` e `/en/trash/` (DESIGN_SYSTEM §1)                                                                                                                                                                |
| 13  | A 320 px il desktop con finestre sovrapposte non è usabile, ma la modalità mobile è della 2B                                 | In 2A, sotto `--bp-md`, le finestre si aprono a tutta area, senza trascinamento né maniglie: un ripiego responsive, così la "definizione di fatto" resta rispettata. MobileHome e App aperte arrivano in 2B       |

**Da non prendere dai mockup**:

- il link a Google Fonts;
- ruoli, selettori e `aria-*` scritti nell'HTML delle tavole: vale NOTES, implementato con React Aria;
- i contenuti segnaposto: le app sono gusci, About ha la bio approvata.

---

## 2. Architettura

### 2.1 Guscio statico prerenderizzato e desktop interattivo dopo

```
prerender / primo render client          dopo l'idratazione (chunk desktop)
┌──────────────────────────────┐        ┌──────────────────────────────────┐
│ DesktopShell (HTML + CSS)    │  swap  │ DesktopApp (React Aria, Zustand) │
│ · icone = <Link href>        │ ─────▶ │ · DesktopIcons (GridList)        │
│ · finestra della route       │        │ · Window + WM, menu, selettore   │
│   (About su /) con contenuto │        │ · Taskbar, Start, orologio       │
│ · taskbar disegnata          │        │ · Esegui, Spegni: chunk a parte  │
└──────────────────────────────┘        └──────────────────────────────────┘
```

- `src/features/desktop/shell/DesktopShell.tsx` usa solo elementi HTML, il `Link` di React Router, `Icon` e i **CSS Modules dei componenti** (`Window.module.css`, `DesktopIcons.module.css`, `TaskbarButton.module.css`). Importa i fogli di stile, non il JS. Il risultato: niente React Aria nel JS iniziale, niente attributi `style`, gli stessi pixel del desktop interattivo.
- Prima dell'idratazione le icone, i link della finestra e il link della lingua sono `<a href>` e fanno una navigazione completa. Start, Finestre e i pulsanti della barra del titolo sono disegnati con `aria-hidden` e fuori dal Tab finché il chunk non arriva: sono controlli che richiedono JS, e restano riconoscibili con `html:not([data-hydrated])`, come prevede ADR-0006.
- Il modulo della route avvia `import("…/DesktopApp")` già alla valutazione sul client (con `import.meta.env.SSR` come guardia), così lo scaricamento va in parallelo all'idratazione. Un effetto fa lo swap in un solo commit quando il chunk è pronto. Lo swap ha tre garanzie:
  - **CLS 0**: stessi moduli CSS. La geometria resta «non impostata» finché l'utente non sposta la finestra: la posizione iniziale viene dal CSS, non da numeri nello store;
  - **focus conservato**: `data-shell-key` sull'elemento con il focus, poi lo stesso focus sull'elemento corrispondente;
  - nessun cambiamento del testo letto dallo screen reader.
- Esegui, Spegni con il congedo e il selettore vanno in chunk caricati all'apertura, oppure in prefetch nel tempo libero (`requestIdleCallback`).

### 2.2 Route delle app (`src/routes/routeMap.ts`)

| App                   | IT                        | EN                   |
| --------------------- | ------------------------- | -------------------- |
| About                 | `/profilo/` (v1)          | `/en/about/`         |
| Progetti              | `/progetti/` (v1)         | `/en/projects/`      |
| Skills                | `/stack/` (v1)            | `/en/skills/`        |
| Contatti              | `/contatti/` (v1)         | `/en/contact/`       |
| CV                    | `/cv/`                    | `/en/cv/`            |
| Vista semplice        | `/vista-semplice/`        | `/en/simple-view/`   |
| Timeline              | `/timeline/`              | `/en/timeline/`      |
| Making of             | `/making-of/`             | `/en/making-of/`     |
| Terminale             | `/terminale/`             | `/en/terminal/`      |
| Campo minato          | `/campo-minato/`          | `/en/minefield/`     |
| Pannello di controllo | `/pannello-di-controllo/` | `/en/control-panel/` |
| Privacy               | `/privacy/`               | `/en/privacy/`       |
| Cestino               | `/cestino/`               | `/en/trash/`         |

- Gli slug non della v1 sono provvisori fino alla 3A: si annotano in CONTENT.md come bozze.
- Un solo modulo route, `routes/desktop.tsx`, riceve la chiave dell'app dall'id della route. Lo stato iniziale si costruisce con `initialStateFor(routeKey)`: `/` apre About, `/progetti/` apre Progetti.
- Ogni route ha `meta` con title e description provvisori dai dizionari, marcati come bozze (il sito non è online prima di `v1.0.0`), canonical e hreflang.
- `prerenderPaths()` cresce da 3 a 27 HTML. Il post-build e il test prerender coprono tutte le route.
- La v1 usava URL senza slash finale: GitHub Pages risponde a `/profilo` con un 301 verso `/profilo/`, quindi la mappatura di SPECS §6 è rispettata senza pagine di reindirizzamento.
- In 2A, dopo l'idratazione, aprire una finestra **non** cambia l'URL. La sincronizzazione nei due sensi è della 2B: la direzione URL → stato c'è già, e la 2B aggiunge stato → URL e la history.

### 2.3 Store (`src/stores/desktop/`)

```ts
type AppId = RouteKey extends "desktop" ? never : …;          // le 13 app, da routeMap
type Geometry = { x: number; y: number; width: number; height: number };
type WindowState = {
  id: AppId;
  status: "normal" | "minimized" | "maximized";
  geometry: Geometry | null;        // null = posizione predefinita dal CSS
  restore: Geometry | null;         // geometria prima di ingrandire
};
type DesktopState = {
  version: 1;
  windows: Partial<Record<AppId, WindowState>>;
  stack: AppId[];                   // ordine z, l'ultima è in cima
  recent: AppId[];                  // ultimo uso, per il selettore
  activeId: AppId | null;
  layoutMode: "desktop" | "mobile"; // la 2B lo calcola; in 2A sempre "desktop"
  bounds: { width: number; height: number } | null; // area utile senza taskbar
};
```

- `reducers.ts`: funzioni pure, testate senza React. Le azioni sono `open`, `close`, `focus`, `minimize`, `toggleMaximize`, `move`, `resize`, `setBounds` e `clamp`; quest'ultima tiene almeno la barra del titolo dentro l'area visibile e la dimensione minima.
- `createDesktopStore(initial)` è una factory, così test e route hanno istanze separate. Nessun accesso a `window` o `document` nello store.
- `serialize` e `deserialize` versionati e validati (JSON puro) servono alla persistenza della 2B. Il primo render dipende solo dall'URL (ADR-0005).
- `src/components` non importa lo store (confini di ARCHITECTURE.md). Il collegamento sta in `src/features/desktop/`.

### 2.4 Window manager (`src/features/desktop/wm/`)

- **Trascinamento a contorno**:
  - `pointerdown` sulla barra del titolo, `setPointerCapture`, poi soglia di 4 px;
  - durante il gesto si muove solo il `DragOutline`, con `transform: translate()` e un aggiornamento per frame (`requestAnimationFrame`): niente reflow;
  - al rilascio un solo `move` nello store, con `clamp`; Esc o `pointercancel` annullano;
  - `touch-action: none` solo su barra del titolo e maniglie.
- **Ridimensionamento**: otto `ResizeHandles` con lo stesso schema e il contorno. Zona di presa di 8 px con il mouse, 44 px con `data-input="touch"`.
- **Geometria applicata**: `--window-x/y/w/h` dopo il montaggio. Il desktop interattivo è solo client, quindi la prop `style` di React passa dal CSSOM, ammesso dalla CSP. Il CSS usa `translate` e `inline-size`.
- **Area utile**: un `ResizeObserver` sul desktop chiama `setBounds` e `clamp` al cambio di viewport o di zoom.
- **Animazioni** di apertura, chiusura, riduzione e ripristino: solo `transform` e `opacity`, con le durate dei token. `prefers-reduced-motion` e `data-motion="reduce"` le azzerano tramite i token stessi.

### 2.5 Predisposizione per la 2B

- Lo stato è serializzabile e versionato.
- `layoutMode` è già nello store, e i componenti mobile leggono lo stesso store.
- L'URL fa già da stato iniziale.
- Nessuna geometria nel prerender.
- I mockup M11–M15 confermano le scelte: finestra a tutto schermo = `status: "maximized"` con `layoutMode: "mobile"`, App aperte = lo stesso `recent` del selettore, Indietro = la history della 2B.

---

## 3. Requisiti 1, 2 e 3: alternative e numeri

### 3.1 Caricamento separato (nuovo ADR-0014)

| Alternativa                                  | JS iniziale stimato | Link prima dell'idratazione | Tipo C nel prerender                 | Esito            |
| -------------------------------------------- | ------------------- | --------------------------- | ------------------------------------ | ---------------- |
| Tutto nel chunk della route                  | ≈ 186 kB            | no (GridList)               | sì, bloccati                         | scartata         |
| `React.lazy` con Suspense nel prerender      | ≈ 112 kB            | no                          | sì: markup di React Aria con `style` | scartata         |
| Idratazione immediata e chunk lazy           | ≈ 112 kB            | sì                          | no                                   | dipende dal §3.2 |
| **Guscio statico e swap dopo l'idratazione** | **≈ 112–113 kB**    | **sì**                      | **no**                               | **proposta**     |

- **Stime da confermare con `npm run size` e `analyze`**:
  - home: 110,8 kB, più il guscio (≈ 1 kB), `I18nProvider` (≈ 0,5–1 kB) e i dizionari con titoli e meta delle 13 app (≈ 0,8 kB);
  - chunk del desktop: guscio della 1B (75 kB), più store e WM (≈ 6 kB), Zustand (≈ 0,5 kB), WindowMenu e selettore (≈ 3 kB): circa 85–90 kB;
  - Esegui (ComboBox) ≈ +5 kB e Spegni (Radio) ≈ +4 kB, in chunk a parte;
  - CSS iniziale ≈ 5–6 kB, budget 12.
- **Nuove voci in `.size-limit.js`**: "Chunk del desktop (gzip)", "Chunk di Esegui" e "Chunk di Spegni". Il chunk si trova seguendo gli `import()` dinamici dal modulo della route. I budget sono la misura arrotondata per eccesso al kB, più il 5%. La voce "guscio del desktop F2A" resta come misura dei componenti.
- **Indice dei componenti**: le feature importano dalle cartelle (`../components/Window`). Una regola Oxlint (`no-restricted-imports`) vieta l'indice fuori da Storybook e dai test. Si toglie così il +0,6 kB, verificato con la voce già presente.

### 3.2 Correzioni di ADR-0013 da rimisurare

Si misurano a inizio fase, con il guscio statico già in pagina e la preview compressa: 5 esecuzioni per URL e preset, su `/` e `/profilo/`. Le prove si fanno con varianti locali del post-build, non committate. Si committa solo la decisione con i numeri, nell'aggiornamento di ADR-0013 (e di ADR-0006 se cambia).

| Variante                                                                                | Ipotesi                                                                    | Si tiene se                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Idratazione rinviata dopo `load` (oggi)                                              | LCP mobile ≈ 1,20 s                                                        | riferimento                                                                                                                                                                                     |
| B. Bootstrap standard con `modulepreload` (≈ 112 kB gzip nel percorso critico simulato) | LCP mobile ≈ 1,5–1,9 s                                                     | Performance ≥ 95 a ogni commit **e** 100 in strict, con LCP ≤ 1,35 s e FCP ≤ 1,05 s. Se passa, si toglie il rinvio: meno dipendenza dal markup di React Router 8.4 e prima interazione migliore |
| C. Bootstrap standard senza `modulepreload`                                             | intermedia                                                                 | come B                                                                                                                                                                                          |
| Preload: Plex regular più Pixel bold (oggi)                                             | —                                                                          | riferimento                                                                                                                                                                                     |
| Preload: solo Plex regular (la bio è l'elemento LCP)                                    | stesso LCP; Pixel bold (h1, titoli) arriva dal CSS con il fallback metrico | LCP uguale e CLS 0 nelle 5 esecuzioni                                                                                                                                                           |

Mi aspetto che B fallisca il budget di LCP e che il rinvio resti, ma decidono i numeri. Si misurano anche, in `performance.spec.ts` con CPU 4×:

- tempo da `load` all'idratazione e allo swap;
- long task dell'idratazione e della valutazione del chunk;
- INP del primo clic su un'icona (Event Timing, `interactionId`), in due momenti: dopo lo swap (soglia ≤ 200 ms) e tra idratazione e swap (lì il clic è una navigazione del `Link`).

Se la valutazione del chunk supera i 200 ms di long task, il chunk si divide (WM e menu prima, il resto nel tempo libero), invece di alzare la soglia.

### 3.3 Attributi `style` nel prerender (tipo C, nuovo ADR-0015)

| Opzione                                                       | Pro                                   | Contro                                                                                                           | Esito                                                                                                                    |
| ------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `style-src-attr 'unsafe-hashes'` con hash                     | standard CSP3                         | allarga la CSP; hash da ricalcolare per ogni combinazione di glifi e geometrie; supporto in Safari da verificare | scartata                                                                                                                 |
| Classi e custom property via CSSOM dopo il montaggio          | CSP invariata                         | serve solo dove il valore è davvero dinamico                                                                     | **sì**, per la geometria delle finestre                                                                                  |
| Rendere dopo l'idratazione le parti di React Aria con `style` | CSP invariata, nessun contenuto tolto | —                                                                                                                | **sì**: nel prerender c'è solo il guscio statico; React Aria monta solo sul client, dove la prop `style` passa dal CSSOM |
| Glyph senza variabili inline                                  | toglie il caso più comune             | piccolo cambio al generatore                                                                                     | **sì**                                                                                                                   |

- **Glyph**: `npm run icons` genera anche `glyphSizes.module.css`, con una classe per glifo (`--glyph-width` e `--glyph-height` come custom property private ammesse da Stylelint). `Glyph` usa la classe al posto della prop `style`. Nell'inventario di `prerenderStyles.test.ts` il caso Glyph sparisce, e lo stesso test fallirebbe se tornasse.
- **VisuallyHidden, `display:contents`, ProgressBar, popover**: mai nel guscio statico. Un nuovo test unit rende `DesktopShell` di ogni route con `renderToString` e richiede zero attributi `style`. Il test prerender «nessun attributo style=» resta, esteso alle 27 pagine.
- **e2e con la CSP reale sulla home** (`tests/e2e/csp.spec.ts`, Chromium, Firefox e WebKit). Il percorso è uno solo, con zero `securitypolicyviolation` dall'inizio alla fine:
  1. caricamento e swap;
  2. DesktopIcon: selezione e `display:contents` calcolato sulle celle;
  3. Tooltip sul pulsante Finestre: posizionamento;
  4. Start con il popover;
  5. apertura e trascinamento di una finestra;
  6. Esegui con un comando sconosciuto: errore;
  7. AlertDialog di conferma di «Chiudi tutte» nel selettore, se lo usiamo; altrimenti un AlertDialog di Esegui per un'app non disponibile;
  8. Spegni: Radio con `VisuallyHidden`, con l'input nascosto verificato con `getComputedStyle`.

  Più il controllo in negativo già esistente.

---

## 4. Accessibilità (nuovo ADR-0016, ACCESSIBILITY.md aggiornato)

1. **Finestre: `section` con `aria-labelledby` (region), non `dialog` non modale.** I contenuti sono documenti da leggere: NVDA e VoiceOver restano in modalità lettura dentro una region, mentre un `dialog` non modale porta NVDA in modalità focus e i lettori lo annunciano come modale in modo incoerente. Il landmark `main` contiene il desktop, cioè icone e finestre. La taskbar è un `footer` con il `Toolbar` etichettato.
2. **Titoli**: il titolo della barra non è un heading, perché dà il nome alla region. Il contenuto della finestra della route parte da `h1` (About su `/`: "Gianpaolo Del Moro"). Le altre finestre aperte dopo partono da `h2`, con un livello passato dal contesto. Così ogni pagina ha un solo h1, e si chiude la nota dell'a11y-auditor sul titolo `h2` con contenuto da `h3`.
3. **Menu**:
   - menu Start e menu della finestra: `Menu` di React Aria;
   - menu contestuale: `Menu` aperto da `contextmenu` (tasto destro, Maiusc+F10, tasto Menu) e dalla pressione lunga di 500 ms in touch, ancorato a un elemento posizionato via CSSOM;
   - menu delle app (quando ci saranno): `MenuBar` della 1B, che è un `Toolbar`, non un `menubar`. Si tiene, perché `menubar` richiede regole di tastiera che i lettori gestiscono male.
4. **Focus**:
   - apertura: va al primo elemento del corpo o al corpo con `tabindex=-1`; riattivando una finestra torna all'ultimo elemento che aveva il focus (memorizzato per finestra);
   - chiusura: va alla finestra successiva in `recent`, altrimenti all'icona dell'app;
   - riduzione: va al pulsante della finestra nella taskbar;
   - finestre inattive `inert`;
   - menu e dialog: React Aria cattura e restituisce il focus;
   - Esc non chiude mai le finestre.
5. **Annunci**: una regione `aria-live="polite"` sola, nel desktop (`Announcer`), che annuncia:
   - «Progetti aperta», «Progetti chiusa», «Progetti ridotta a icona»;
   - lo spostamento («Spostamento: usa le frecce, Invio per confermare», poi la posizione finale);
   - il nome scelto nel selettore.

   I testi vengono dai dizionari. Il cambio di focus non si annuncia: lo annuncia già il lettore.

6. **Alternative al trascinamento** (WCAG 2.5.7 e 2.1.1):
   - Sposta e Ridimensiona dal menu della finestra: frecce di 8 px, Maiusc+frecce di 32 px, Invio conferma, Esc ripristina;
   - in touch, quattro frecce da 44 px con OK e Annulla;
   - Ingrandisci e Ripristina sempre disponibili;
   - doppio clic sulla barra come scorciatoia, non come unico accesso.
7. **Skip link** «Salta al contenuto»: primo elemento nel DOM, visibile solo con il focus. Porta al corpo della finestra attiva, altrimenti al gruppo di icone. È nel guscio statico, quindi funziona anche prima dell'idratazione: è un'ancora `#`.
8. **Ordine di Tab**: skip link › icone (un solo punto di Tab) › finestra attiva › Start › Finestre › pulsanti delle finestre (`Toolbar`). Corrisponde all'ordine visivo di NOTES.

### 4.6 Scorciatoie

`src/features/desktop/shortcuts.ts` contiene una funzione pura `matchShortcut(event, platform)`, testata.

- **Combinazioni**:
  - Alt+W e Maiusc+Alt+W: selettore;
  - Alt+Spazio e Alt+trattino: menu della finestra attiva.

  Si richiedono `altKey` senza `ctrlKey`, `metaKey` e AltGr (`getModifierState("AltGraph")`): AltGr su Windows è Ctrl+Alt e scrive caratteri sui layout italiano, tedesco e francese.

- **Riconoscimento del tasto**:
  - prima `event.key` (in minuscolo), che segue il layout: su AZERTY «w» sta dove QWERTY ha «z», su QWERTZ resta «w»; il trattino italiano ha `code` `Slash`;
  - `event.code` (`KeyW`, `Space`, `Minus`) solo come riserva, quando `key` non è un carattere previsto: con Option su Mac (`∑`, `–`, spazio non separabile), con i tasti morti o con layout non latini (russo «ц», greco «ς»);
  - Spazio si riconosce anche da `code === "Space"`.
- **Rilascio di Alt** (`keyup`, `key === "Alt"`) conferma la scelta del selettore. Con `blur` della finestra del browser il selettore si annulla.
- **Campi di testo**: le scorciatoie non scattano con il focus in `input`, `textarea`, `select` o `[contenteditable]`, né dentro `[data-shortcuts="off"]` (il Terminale).
- **Alternative con un pulsante**: «Finestre» in taskbar per il selettore, il pulsante icona della barra del titolo per il menu della finestra.
- **Etichette**: «Alt+W», e «⌥W» su Mac (piattaforma letta dopo l'idratazione da `navigator.userAgentData?.platform ?? navigator.platform`; nessun mismatch, perché i menu non sono nel prerender). `aria-keyshortcuts="Alt+W"` sul pulsante.
- **⌥**: nuovo glifo `option` in `glyphs.json` e `glyphData`, disegnato a pixel da noi e registrato in ASSETS.md. Ha `aria-hidden`; il nome accessibile della scorciatoia è «Option+W» dai dizionari.
- **Su Windows** la riserva Alt+trattino copre il caso in cui il sistema intercetta Alt+Spazio. Si verifica a mano su Chrome, Edge e Firefox, ed è un punto della QA.

---

## 5. Passi e commit

### Tappa 2A-1: infrastruttura e scheletro funzionante

| #   | Commit                                                               | Contenuto                                                                                                                                                             |
| --- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `docs: approva titolo, bio e meta description`                       | CONTENT.md: i testi approvati con la data, title delle pagine e nota sugli slug v1                                                                                    |
| 2   | `docs: aggiunge il pacchetto di design della F2A e il piano`         | `docs/design/f2a-window-manager/`, `docs/phases/phase-02a-plan.md`                                                                                                    |
| 2b  | `docs: attiva il piano B del form contatti con hCaptcha su consenso` | Solo documenti, implementazione in F3B (§9): nuovo ADR-0017, ADR-0002 «Sostituita in parte», ADR-0003, SPECS, LEGAL, PLAN, PERFORMANCE_SEO, ACCESSIBILITY, DEPLOYMENT |
| 3   | `feat: aggiorna title, description e jobTitle della home`            | Dizionari, `buildMeta` (og e twitter title con il titolo completo), test unit e prerender (title ≤ 60, description ≤ 160)                                             |
| 4   | `feat: aggiunge le icone windows e power`                            | SVG, `npm run icons`, ASSETS.md, test                                                                                                                                 |
| 5   | `refactor: Glyph senza variabili inline`                             | Classi generate, inventario del tipo C aggiornato, glifo `option`                                                                                                     |
| 6   | `refactor: import dei componenti dalle cartelle`                     | Regola Oxlint, voce size-limit                                                                                                                                        |
| 7   | `feat: I18nProvider di React Aria nel root`                          | `intlLocales` della route, test sulla lingua di `useUiStrings`                                                                                                        |
| 8   | `feat: route delle app con slug v1 e provvisori`                     | routeMap, routes.ts, meta, prerender di 27 pagine, test di routeMap e prerender                                                                                       |
| 9   | `feat: guscio statico del desktop`                                   | `DesktopShell`: icone come link, About aperta, taskbar disegnata, skip link; test "zero style", screenshot                                                            |
| 10  | `feat: store del desktop con Zustand`                                | Reducer e factory, unit (apertura, chiusura, focus, ordine, serializzazione)                                                                                          |
| 11  | `feat: carica il desktop in un chunk separato`                       | `DesktopApp` con DesktopIcons, Window, Taskbar e Start, swap senza CLS, size-limit, e2e prima e dopo l'idratazione                                                    |
| 12  | `feat: TaskbarButton e StartButton attivi in alto contrasto`         | Token alias, focus interno, DESIGN_SYSTEM §9, test, story, screenshot nel container                                                                                   |
| 13  | `docs: rimisura idratazione e preload`                               | ADR-0013 aggiornato (ed eventualmente ADR-0006), più l'eventuale commit `perf:` con la variante scelta                                                                |
| 14  | `docs: adr 0014 e 0015`                                              | Caricamento separato e tipo C, con i numeri misurati                                                                                                                  |
| 15  | `test: csp reale e prestazioni sulla home`                           | `csp.spec.ts` sulla home, `performance.spec.ts` con INP e swap                                                                                                        |

**Fermata.** Eseguo test, lint, typecheck, coverage, build, prerender, e2e nel container, size e `lhci:*:strict`. Poi scrivo un riepilogo con i numeri: home, chunk del desktop, CSS, LCP, FCP, TBT, CLS, INP, long task. Tu fai il push, e la 2A-2 inizia solo con la CI verde su GitHub.

### Tappa 2A-2: window manager e componenti nuovi

| #   | Commit                                                  | Contenuto                                                                                                                                                          |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 16  | `feat: riduci, ingrandisci e limiti dell'area visibile` | Reducer e `clamp`, `ResizeObserver`, unit                                                                                                                          |
| 17  | `feat: trascinamento a contorno`                        | `DragOutline` (componente), pointer events, Esc, e2e con mouse e touch emulato                                                                                     |
| 18  | `feat: maniglie di ridimensionamento`                   | `ResizeHandles`, minimo, touch a 44 px, e2e                                                                                                                        |
| 19  | `feat: menu della finestra con sposta e ridimensiona`   | `WindowMenu`, pulsante icona nella `Window` (modifica 1B), modalità tastiera e touch, `Announcer`                                                                  |
| 20  | `feat: scorciatoie da tastiera`                         | `matchShortcut` e unit per layout e piattaforme, hook globale, `keyboard.spec.ts`                                                                                  |
| 21  | `feat: selettore delle finestre e pulsante Finestre`    | `WindowSwitcher`, `TaskbarIconButton` con `aria-disabled`                                                                                                          |
| 22  | `feat: menu Start completo e orologio`                  | Voci, gruppo Esegui e Spegni, orologio con `<time>` e formato `Intl` della lingua                                                                                  |
| 23  | `feat: menu contestuale del desktop`                    | Tasto destro, Maiusc+F10, pressione lunga, «Disponi icone», «Aggiorna», «Proprietà»                                                                                |
| 24  | `feat: dialog Esegui`                                   | `RunDialog` (ComboBox), chunk a parte, errore con `aria-describedby`                                                                                               |
| 25  | `feat: Spegni, congedo e riavvio`                       | `ShutdownDialog`, `FarewellScreen`, title della scheda, riavvio, chunk a parte                                                                                     |
| 26  | `feat: animazioni delle finestre`                       | Apertura, chiusura, riduzione; movimento ridotto                                                                                                                   |
| 27  | `test: e2e e regressione visiva del desktop`            | Schermate D01–D12 nei due temi, a 1440, 1024 e 768, più il ripiego a 375 e 320                                                                                     |
| 28  | `docs: adr 0016 e documenti`                            | ACCESSIBILITY, ARCHITECTURE §4, PERFORMANCE_SEO, QA_CHECKLIST (sezione desktop), README di GDM 95 annotato nel nostro DESIGN_SYSTEM (il pacchetto non si modifica) |
| 29  | `close-phase`                                           | Quattro agenti, QA, retrospettiva, CHANGELOG, PLAN                                                                                                                 |

Ogni commit si fa dopo `npm run test` e lint verdi, mettendo in stage tutta la cartella `src` (lezione della 1B). I numeri nei messaggi dei commit vengono da una build appena fatta.

---

## 6. Componenti nuovi e modificati

Si segue la skill `win95-component`: React Aria, CSS Modules con soli alias dei token, test con user-event, story con tag `visual`, axe nelle quattro combinazioni tema × input, target di 44 px in touch.

| Componente                                  | Base React Aria                                                                                                                                                                                       | Test principali                                                                                           | Story                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `TaskbarIconButton` (nuovo)                 | `Button` con `aria-disabled` manuale                                                                                                                                                                  | Raggiungibile da disabilitato, nessuna azione, nome «Finestre aperte: nessuna»                            | Normale, premuto, disabilitato, focus                    |
| `WindowMenu` (nuovo)                        | `MenuTrigger`, `Menu`                                                                                                                                                                                 | Ripristina disattivata se la finestra non è ingrandita; focus su Sposta; Esc riporta il focus al pulsante | Aperto, con ingrandita                                   |
| `WindowSwitcher` (nuovo)                    | `Dialog` modale, `ListBox` con `aria-activedescendant`                                                                                                                                                | ←/→, Home/Fine, Invio, Esc, annuncio                                                                      | 1, 3 e 8 finestre                                        |
| `DragOutline` (nuovo)                       | nessuna (`aria-hidden`)                                                                                                                                                                               | Posizione da prop, nessun attributo `style` nel rendering lato server                                     | Statica                                                  |
| `ResizeHandles` (nuovo)                     | nessuna (puntatore); tastiera dal menu                                                                                                                                                                | Cursori, zone di presa desktop e touch                                                                    | Hover sul bordo                                          |
| `RunDialog` (nuovo)                         | `Dialog`, `ComboBox`                                                                                                                                                                                  | Filtro, Invio = OK, Esc in due tempi, errore                                                              | Vuoto, suggerimenti, errore                              |
| `ShutdownDialog` (nuovo)                    | `ModalOverlay`, `RadioGroup`                                                                                                                                                                          | Focus sul radio scelto, Invio = OK, Annulla torna su Start                                                | Tre scelte, mobile a 343 px                              |
| `FarewellScreen` (nuovo)                    | `Button`                                                                                                                                                                                              | Focus su Riaccendi, title della scheda                                                                    | Classico e HC                                            |
| `SkipLink` (nuovo)                          | `<a>` nativo (funziona prima dell'idratazione)                                                                                                                                                        | Visibile solo con il focus, destinazione                                                                  | Con focus                                                |
| `Glyph` (modificato)                        | —                                                                                                                                                                                                     | Classe al posto di `style`; glifo `option`                                                                | Glifi                                                    |
| `Window` (modificato)                       | Pulsante del menu al posto dell'icona; livello di titolo dal contesto; `data-active` con segnale non cromatico (titolo in grassetto e pulsanti attivi già differenziati, più il bordo della finestra) | Nomi, livelli                                                                                             | Esistenti più il menu                                    |
| `TaskbarButton`, `StartButton` (modificati) | Token alias HC, focus interno                                                                                                                                                                         | Stati                                                                                                     | Screenshot aggiornati nel container, con commit dedicato |
| `Icon` (dati)                               | Icone `windows` e `power`                                                                                                                                                                             | `icons.test.mjs`, ASSETS                                                                                  | Tutte                                                    |

---

## 7. Dipendenze nuove

- **`zustand` 5.0.15**, runtime, versione esatta nel lock. Pubblicata il 13/08/2026; la 5.0.16 è del 22/10/2026, troppo recente: la proporrà Dependabot. Pesa circa 0,5–1 kB gzip, nel chunk del desktop. È già prevista da ADR-0005 e ARCHITECTURE §10. Peer: `react >= 18`; `use-sync-external-store` serve solo per l'API `zustand/traditional`, che non si usa.
- Nessun'altra dipendenza. ComboBox, Dialog, ListBox, Toolbar e `I18nProvider` sono già in `react-aria-components` 1.22.1, importati per sottopercorso.

---

## 8. Rischi

1. **Swap tra guscio statico e desktop interattivo.** Rischi: CLS, focus perso, lettore di schermo che riparte dall'inizio. Mitigazioni:
   - stessi CSS Modules e geometria non impostata;
   - focus conservato con una chiave;
   - e2e con `PerformanceObserver` sul `layout-shift` e sul focus.

   Se la mitigazione non basta, il ripiego è idratare il guscio e montare solo le parti interattive accanto, con più codice.

2. **Long task alla valutazione del chunk** (≈ 90 kB gzip, CPU 4×), vicina ai 200 ms. Mitigazione: chunk divisi e caricamento nel tempo libero.
3. **27 pagine prerenderizzate con contenuto segnaposto.** Il sito non è online prima di `v1.0.0`, ma `/` e `/profilo/` mostrano la stessa bio (canonical distinti). In F3A i contenuti diventano reali.
4. **Alt+Spazio intercettato** da Windows e GNOME: c'è la riserva Alt+trattino; da verificare a mano. **Alt+W** non è usato da Chrome, Edge o Firefox su Windows e Linux; si verifica nella QA.
5. **Lighthouse su `/` con una finestra aperta e una taskbar**: elemento LCP diverso (la bio). Le rimisure del §3.2 lo dicono subito, alla fermata della 2A-1.
6. **Sentinella di React Aria e markup di React Router**: già protetti da test. Si ricontrollano con la ComboBox, che usa un nuovo percorso di popover.
7. **WebKit sull'host** richiede `install-deps`: gli e2e completi girano nel container.

---

## 9. Form Contatti: piano B di ADR-0002 (solo documenti in 2A)

Decisione del proprietario del 28/10/2026: il piano B si attiva subito e si implementa in F3B. In 2A c'è un solo commit `docs:` nella tappa 2A-1 (il 2b del §5). Non tocca né il codice né la CSP, quindi Lighthouse non cambia: hCaptcha non si carica all'apertura della pagina.

**Cosa entra nei documenti:**

- **hCaptcha solo nel form Contatti**:
  - si carica solo dopo un clic esplicito su «Attiva la verifica», accanto a una riga informativa con il link alla privacy;
  - mai al caricamento della pagina, nessun banner sul sito;
  - il consenso è il clic stesso, dato nel contesto del form.
- **Verifica lato server**: hCaptcha va attivato anche nel pannello di Web3Forms, così Web3Forms rifiuta gli invii senza un token valido. Si documenta in DEPLOYMENT.md §6, con i passi manuali e la sitekey come variabile di build pubblica accanto a `VITE_WEB3FORMS_ACCESS_KEY`.
- **Alternativa sempre visibile** per chi non attiva la verifica: email offuscata e GitHub.
- **Protezioni che restano**: honeypot, tempo minimo, pausa tra gli invii, limiti di lunghezza, restrizione al dominio.
- **CSP (da valutare in F3B)**: bisogna ammettere i domini di hCaptcha in `script-src`, `frame-src`, `connect-src` e `style-src`, senza `'unsafe-inline'`. In una SPA vale la CSP della prima pagina caricata: chi entra da `/` e apre Contatti usa la CSP di `/`. Le opzioni sono queste, la scelta va in un ADR della F3B:
  - stessi domini in tutte le pagine;
  - Contatti in una finestra che forza una navigazione completa verso `/contatti/` prima di attivare la verifica;
  - verifica in un iframe dedicato.
- **Informativa privacy**:
  - fornitore (Intuition Machines, Inc., da verificare in F3B) e dati trattati;
  - cookie e storage di hCaptcha, che non sono storage tecnico del sito e arrivano solo dopo il consenso;
  - trasferimento extra UE;
  - base giuridica: consenso (art. 6.1.a GDPR e art. 122 del Codice privacy), revocabile non attivando la verifica e usando l'email.
- **Test e2e in F3B**:
  - nessuna richiesta a `*.hcaptcha.com` prima del clic (estende la fixture «nessuna terza parte», con un'eccezione solo dopo il consenso);
  - il form si invia solo con la verifica completata (hCaptcha simulato con `page.route`);
  - l'alternativa email è sempre presente, anche con la verifica rifiutata o in errore.

**Documenti da aggiornare** (decisioni del proprietario del 28/10/2026):

- **ADR-0017** (nuovo): captcha hCaptcha su consenso esplicito nel form Contatti. Sostituisce la parte di ADR-0002 sul captcha e contiene la motivazione del cambio.
- **ADR-0002**: resta invariato, comprese le alternative scartate. Cambiano solo lo stato («Sostituita in parte da ADR-0017») e un rimando.
- **ADR-0003**: una riga. I cookie di hCaptcha arrivano solo dopo un consenso esplicito dato nel form, quindi il banner resta inutile.
- **SPECS.md**: §7 (form) e §9 (captcha solo su consenso, ADR-0017).
- **LEGAL.md**: §1 (eccezione dopo il clic), §2 (storage), §3 (informativa), §4 (anti-abuso), checklist.
- **PLAN.md**: voci della 3B.
- **PERFORMANCE_SEO.md**: nessuno script di terzi al caricamento.
- **ACCESSIBILITY.md**: WCAG 2.2 criterio 3.3.8, email offuscata come alternativa, opzione accessibile di hCaptcha.
- **DEPLOYMENT.md**: hCaptcha nel pannello di Web3Forms e variabile della sitekey.

---

## Verifica

- **A ogni commit**: `npm run lint`, `typecheck`, `test`.
- **Prima della fermata e della chiusura**:
  - `npm run test:coverage` (≥ 80%);
  - `npm run build && npm run test:prerender`;
  - `npm run test:e2e` nel container: tutti i progetti, CSP, prima dell'idratazione, touch, tastiera, prestazioni, screenshot;
  - `npm run size`;
  - `npm run lhci:mobile:strict && npm run lhci:desktop:strict` su `/`, `/en/`, `/profilo/` e `/en/about/`.
- **QA nel browser** su `npm run build && npm run preview`, con Claude in Chrome (se non è connesso, Playwright, e lo segnalo):
  - 1440, 1024, 768, 375 e 320 px, nei due temi;
  - trascinamento, ridimensionamento, menu, selettore, scorciatoie, Spegni.
- **QA su Android** con `preview -- --host`, seguendo la nuova sezione desktop di QA_CHECKLIST: trascinamento al tocco, pressione lunga, menu, selettore, tastiera Bluetooth se disponibile. La fai tu.
- **Chiusura** con `close-phase`: code-reviewer, security-auditor, a11y-auditor e content-reviewer, poi retrospettiva, CHANGELOG e PLAN. Merge, tag e push li fai tu.

## Note aperte della 2A-2

- `aria-haspopup="dialog"` sulle voci Esegui… e Spegni… del menu Start (NOTES della tavola D05): da fare entro la chiusura della 2A e da annotare nell'ADR-0016.
- Budget del chunk del desktop: 80 kB provvisorio, da fissare a fine tappa secondo ADR-0020.
