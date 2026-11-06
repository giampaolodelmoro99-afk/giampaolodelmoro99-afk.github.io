# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/it/1.1.0/). Le voci sono in italiano.

Ogni fase si chiude con un tag `phase-NN` (che non fa partire il deploy). Le release pubblicate usano tag `vX.Y.Z` secondo [SemVer](https://semver.org/lang/it/) e fanno partire il deploy: la prima sarà `v1.0.0`.

## [Unreleased]

## [phase-02b] - Fase 2B: routing, persistenza e modalità mobile

### Aggiunto

- Deep link per ogni finestra: route di layout che monta il desktop una volta sola; l'URL è quello della finestra attiva, con title, description e canonical che la seguono. Aprire o attivare una finestra aggiunge una voce alla history; chiudere o ridurre la assesta senza voci doppie. Indietro e Avanti portano in primo piano la finestra della voce senza chiudere le altre. Il cambio di lingua tiene le finestre (ADR-0021).
- Persistenza del layout in `windows.v1` (finestre, posizione, dimensione, stato, ordine), ripristinata prima dello swap senza CLS: la finestra dell'URL resta davanti e nella posizione del prerender, le altre tornano dietro; sulla home About c'è sempre; Riaccendi ripristina, Riavvia azzera.
- Modalità mobile (ADR-0007, ADR-0022): regola larghezza < 768 px, oppure altezza < 540 px con puntatore grossolano; home a griglia di 13 voci, app a schermo intero con barra del titolo da 48 px e focus sull'`h1`, pulsante e pannello «App aperte (n)» (compatto sotto i 360 px), Start a pannello; il passaggio tra le modalità non perde lo stato. «Indietro» nella barra è costruito ma non mostrato fino alla F3A.
- Memoria del focus per finestra nel desktop; focus sul contenitore dei controlli durante Sposta e Ridimensiona da tastiera.
- Componenti: varianti mobile di Window, TaskbarIconButton, DesktopIcons e StartButton; AppSwitcher e OpenApps (chunk su richiesta); token `--mobile-home-cell-height`, `--space-safe-top-edge`, `--popover-edge`, `--radius-round`.
- ADR-0021 (URL, history e persistenza) e ADR-0022 (budget del chunk del desktop con la modalità mobile); sezione mobile in QA_CHECKLIST (§3.1 e §7).
- Test: e2e di history, persistenza, storage ammesso, forced-colors e modalità mobile (tag `@desktop` e `@mobile` nei progetti di Playwright); test unitari di useUrlSync, persist, layoutMode, AppSwitcher, OpenApps e della modalità mobile di DesktopApp; regola dei test instabili in TESTING.md §10.

### Modificato

- React Router 8.5.1 senza alzare il budget del JS iniziale (120,56 kB su 124): `ScrollRestoration` tolta (nessuna chiave sessionStorage) e stub di build per il runtime della custom route discovery.
- Budget del chunk del desktop da 77 a 82 kB (ADR-0022; misura 78,36 kB), con il job delle prestazioni verde (task 143 ms, INP 120 ms, CLS 0,00003).
- L'`h1` sta nella finestra della route; i link di About sono link normali e cambiano l'URL.
- La CI parte anche sui branch `chore/**` e `fix/**`.
- Le pagine a 320 e 375 px passano alla modalità mobile (finisce il ripiego della 2A); riferimenti visivi rigenerati nel container.

### Corretto

- Test instabile `desktop.spec.ts:46`: la misura dell'area di lavoro aggiornava lo store dentro la callback del ResizeObserver («loop completed with undelivered notifications» in WebKit sotto carico); ora si misura al frame dopo, una volta sola.
- La modalità di layout si rilegge anche su `resize`: con ridimensionamenti ravvicinati l'evento `change` della media query si perdeva (15 casi su 50 nel test di rotazione, 0 su 50 dopo).
- Salvare il layout non sovrascrive più quello salvato aprendo un link diretto; con lo storage bloccato Riaccendi usa l'ultimo layout in memoria.
- Rinvii di ADR-0016: Sposta e Ridimensiona senza menu in mobile, contorno e bordo in `forced-colors` per il selettore e il Radio, `touch-action` solo da 768 px.

## [phase-02a] - Fase 2A: window manager desktop

### Aggiunto

- Desktop GDM 95 nella home e in 26 route delle app (slug della v1 per About, Skills, Progetti e Contatti; gli altri provvisori fino alla F3A): guscio statico prerenderizzato in solo HTML e CSS, desktop interattivo in un chunk caricato dopo l'idratazione, senza spostamenti allo swap (ADR-0014, ADR-0015).
- Window manager con Zustand: apertura, attivazione, riduzione, ingrandimento, trascinamento a contorno, otto maniglie di ridimensionamento, cascata dentro l'area visibile, Sposta e Ridimensiona da tastiera e con le frecce al tocco, animazioni con movimento ridotto.
- Taskbar con pulsante Finestre e selettore (Alt+W), menu Start nell'ordine della tavola D05, orologio, collegamento alla lingua; menu della finestra (Alt+Spazio, Alt+trattino); menu contestuale del desktop (tasto destro, Maiusc+F10, tasto Menu, pressione lunga).
- Esegui (suggerimenti, errore annunciato), Spegni con congedo, Riavvia e Vista semplice, senza ricaricare la pagina; i loro chunk si caricano all'apertura e si precaricano nel tempo libero.
- Componenti: TaskbarIconButton, WindowMenu, MoveControls, DragOutline, ResizeHandles, WindowSwitcher, ContextMenu, RunDialog, ShutdownDialog, FarewellScreen; icone `windows` e `power`, glifo `option`.
- ADR-0014, 0015, 0016, 0017, 0018, 0019, 0020; QA_CHECKLIST con la sezione del desktop a finestre.
- Test: e2e di trascinamento, ridimensionamento, tocco, menu contestuale, animazioni, chunk non caricati, CSP reale con Esegui e Spegni, prestazioni con CPU 4× (task lunghe e INP); budget di size-limit per il chunk del desktop e per i chunk di Esegui, Spegni e congedo.

### Modificato

- Title della home «Gianpaolo Del Moro · Full Stack Developer»; bio e meta description approvate, con WordPress (01/11/2026).
- Soglie Lighthouse sulle metriche buone di Google, con una sola misura locale a fine fase (ADR-0018); verifiche proporzionate durante la fase (ADR-0019).
- JS iniziale della home a 120,59 kB (budget 124, ADR-0014); CSS dei componenti con budget di 6 kB (ADR-0020).
- Window: il titolo della barra non è più un heading; i pulsanti delle finestre inattive escono dall'ordine di Tab.
- Glyph senza attributi `style`; componenti importati dalle cartelle (Oxlint).

### Corretto

- Dalla review di chiusura: focus all'attivazione con il puntatore, link di About che cambiavano pagina, errore di Esegui non annunciato, nome del collegamento della lingua (WCAG 2.5.3), taskbar a 320 px, seconda regione live nel selettore.

## [phase-01b] - Fase 1B: componenti del design system GDM 95

### Aggiunto

- 18 componenti su React Aria Components in `src/components/`: Button, TextField, TextArea, Checkbox, RadioGroup e Radio, GroupBox, ProgressBar, StatusBar, ScrollArea, Tooltip, Tabs, Select, MenuBar (con Menu, MenuItem, Submenu), Window, Taskbar e TaskbarButton, StartButton, DesktopIcons, AlertDialog. Ognuno ha test, story, screenshot nelle quattro combinazioni tema × input e axe.
- ADR-0012: stile di React Aria e CSP del sito. Id sentinella sul link di `global.css`, CSP invariata, test di deriva, prerender ed e2e (anche in negativo).
- 404 con il `Link` di React Aria e `AriaRouterProvider`; test senza JavaScript.
- Misura del peso dei componenti con `@size-limit/esbuild` e budget: JS ≤ 99 kB, CSS ≤ 5 kB, guscio del desktop F2A ≤ 75 kB.
- Test: inventario degli attributi `style` nel prerender, spec di comportamento dei componenti nel browser, aiuti per gli stati nelle `play` di Storybook.
- Testi dei componenti in `src/i18n/ui.ts` con `useUiStrings()`; `siteHandle()` in `site.ts`.
- QA_CHECKLIST §7.1: componenti in Storybook su Android.

### Modificato

- Icone di Campo minato ridisegnate (il primo disegno richiamava un gioco Microsoft).
- Chunk `framework` con React, React DOM e React Router: JS iniziale della home da 112,27 a 110,81 kB.
- Disabilitato in alto contrasto con bordo punteggiato di 1 px, distinto dal focus.
- La regola globale `:focus-visible` esclude gli elementi React Aria, che usano `[data-focus-visible]`.
- Controllo dei target touch adattato a `VisuallyHidden`, `HiddenSelect` e `display: contents`; misurate anche le righe delle griglie e le voci di menu con spunta.
- Storybook nei test con le barre di scorrimento visibili; `openStory` attende la fine della `play`.
- Import da `react-aria-components` solo per sottopercorso (Oxlint).

## [phase-01a] - Fase 1A: fondamenta del design system GDM 95

### Aggiunto

- Pacchetto di consegna del design system GDM 95 in `docs/design/gdm95/` (riferimento approvato).
- Token GDM 95: temi classico e alto contrasto, attributi `data-theme`, `data-font`, `data-input`, `data-motion`, alias desktop e touch, focus a doppio anello, `forced-colors`; token in più per i valori letterali del CSS di riferimento.
- Font Pixel Operator (subset, CC0) e IBM Plex Sans (subset Latin1 ufficiali, OFL) con fallback metrici; Pixel Operator per titoli, etichette e controlli, IBM Plex Sans per frasi e paragrafi (`--font-family-prose`); preload di Pixel Operator bold e Plex regular.
- 33 icone originali GDM 95, componenti `Icon` e `Glyph` con colori dai token; favicon col monogramma GDM.
- Storybook 10 in `/storybook/` con CSP dedicata, noindex e `Disallow` in `robots.txt`; pagine Token e story di Icon e Glyph.
- Test: token e Stylelint, registro degli asset con SHA-256, glifi dei font, dati delle icone, workflow; story fotografate e controllate con axe nei due temi, con mouse e touch; idratazione dopo `load` con CPU 4×; focus in alto contrasto e forced-colors.
- `npm run analyze` (treemap del bundle), `npm run fonts`, `npm run icons`, `npm run preview -- --host`.
- ADR-0011 sulle vulnerabilità accettate nelle dipendenze di sviluppo.

### Modificato

- Focus da tastiera: doppio anello al posto del contorno di 1 px; testo del desktop su `--color-desktop-text`.
- Barra del titolo inattiva `#666666` (3,16:1 sul telaio) al posto di `#6a6a6a` del pacchetto.
- Agenti di review di sola lettura: niente strumenti di scrittura, hook che blocca i comandi Bash non di lettura, regole `deny` più larghe per git.
- Deploy solo con tag `vMAJOR.MINOR.PATCH`, con job di guardia; runner fissati a `ubuntu-24.04`.
- La preview ascolta solo in loopback (127.0.0.1 e ::1) salvo `--host`, e risponde 400 agli URL malformati.
- Documenti: LinkedIn non compare sul sito; app "Terminale" e "Campo minato" al posto dei nomi Microsoft.

## [phase-00] - Fase 0: Foundation

### Aggiunto

- Progetto React 19 + React Router 8 (framework mode, `ssr: false` + prerender) + Vite 8 + TypeScript 6 strict.
- Route `/` e `/en/` prerenderizzate con metadati completi (title, description, canonical, hreflang, Open Graph, Twitter card) e JSON-LD con `Person`, `WebSite` e `ProfilePage`.
- Pagina 404 prerenderizzata, servita da `404.html` con status 404.
- Token CSS iniziali e desktop vuoto responsive da 320 px.
- Post-build: CSP via meta tag con hash degli script inline, idratazione rinviata a dopo il `load`, controllo delle route prerenderizzate.
- Test: Vitest + Testing Library + vitest-axe (coverage minima 80%), test sull'HTML prerenderizzato, Playwright su 5 viewport + touch + Firefox con axe e regressione visiva, size-limit, Lighthouse CI mobile e desktop con soglia 100.
- Qualità: Oxlint (type-aware), Stylelint, Prettier, Husky (pre-commit, commit-msg, pre-push), commitlint.
- CI su `main` e `phase/*`, deploy manuale o su tag, Dependabot.
- Documentazione in `docs/`, ADR 0000–0010, configurazione di Claude Code (skill, agenti, hook).

### Rimosso

- Il codice della v1 (MUI, JavaScript), consultabile solo dal tag `v1.0.0-legacy`.

[Unreleased]: https://github.com/giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io/compare/phase-01a...HEAD
[phase-01a]: https://github.com/giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io/compare/phase-00...phase-01a
[phase-00]: https://github.com/giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io/compare/v1.0.0-legacy...phase-00
