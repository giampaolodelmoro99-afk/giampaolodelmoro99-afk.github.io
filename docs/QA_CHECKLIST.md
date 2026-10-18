# Checklist QA manuale

Un lavoro visivo non è finito finché non è stato verificato nel browser, anche su viewport mobile. Questa checklist si usa a fine task visivo e a fine fase (skill `close-phase`), con Claude in Chrome o a mano.

## 1. Prima di iniziare

```bash
npm run build && npm run preview   # http://localhost:4173
```

**Mai verificare su `npm run dev`**: non applica CSP, prerender, `404.html` né l'idratazione rinviata.

## 2. Desktop (1440 e 1024 px)

- [ ] Ogni route IT ed EN si apre dal deep link, con titolo e contenuto corretti.
- [ ] La navigazione tra route e lingue non ricarica la pagina (la console resta, nessun flash bianco).
- [ ] Indietro e avanti del browser funzionano.
- [ ] Un URL inesistente mostra la pagina 404.
- [ ] Hover, pressione e focus dei controlli coerenti con lo stile 95.
- [ ] Dalla F2: drag, resize, minimizza, massimizza, focus e ordine delle finestre.

## 3. Mobile

- [ ] 320×640 e 375×667 in verticale; 640×320 e 667×375 in orizzontale.
- [ ] Nessuno scroll orizzontale; testi non tagliati; target ≥ 44 px.
- [ ] Tap su tutti i controlli; nessuna funzione solo hover o tasto destro.
- [ ] Safe-area (simulazione iPhone con notch) e tastiera virtuale sui campi.
- [ ] Zoom del browser al 200% e al 400% (reflow) senza perdita di contenuto.

## 4. Tastiera e screen reader

- [ ] Tutto raggiungibile con Tab, Shift+Tab, frecce, Invio, Esc; focus sempre visibile.
- [ ] Ordine del focus logico; nessuna trappola.
- [ ] NVDA + Firefox (o VoiceOver + Safari): titoli, landmark, nomi dei controlli, annunci di finestre e form.

## 5. Movimento e contrasto

- [ ] `prefers-reduced-motion: reduce` (DevTools → Rendering): nessuna animazione.
- [ ] Dalla F4A: opzione "Riduci animazioni" del Pannello di controllo.
- [ ] Tema alto contrasto e `forced-colors: active` (DevTools → Rendering): bordi e testo visibili.

## 6. Console e rete

- [ ] Console senza errori, warning e violazioni CSP (l'unico errore ammesso è il 404 del documento sulla pagina 404).
- [ ] Network: nessuna richiesta verso origini esterne al caricamento.
- [ ] Il font della UI è quello del progetto, non il fallback.
- [ ] HTML sorgente (Ctrl+U): contenuto, meta e JSON-LD presenti; email non in chiaro.

## 7. Telefono Android reale (dalla Fase 1A)

Da fare a fine fase, oltre ai viewport emulati. Sul computer:

```bash
npm run build && npm run preview -- --host
```

Il terminale stampa l'indirizzo in rete locale (`http://192.168.x.x:4173`): aprilo da Chrome per Android sulla stessa rete Wi-Fi.

- [ ] **Font**: il testo del desktop è in Pixel Operator (pixel netti), non nel font di sistema.
- [ ] **Focus**: con una tastiera Bluetooth (Tab) o con la navigazione di TalkBack, il focus è visibile come doppio anello (tratteggio nero su alone bianco).
- [ ] **Layout**: nessuno scroll orizzontale, sia con il telefono in verticale sia in orizzontale; testi non tagliati.
- [ ] **Storybook** (`/storybook/`): si naviga al tocco (barra laterale, story, pannelli), la toolbar cambia tema e input, l'anteprima segue.
- [ ] Annota modello del telefono, versione di Android e di Chrome nella retrospettiva.

### 7.1 Componenti in Storybook (dalla Fase 1B)

Su `/storybook/`, prima con tema classico e input automatico, poi di nuovo con **tema alto contrasto** e **input touch** dalla toolbar. Per ogni voce: il tocco funziona al primo colpo, nessuno zoom involontario, nessuno scroll orizzontale.

- [ ] **Button**: il tocco attiva, lo stato premuto si vede, nessun doppio tocco per lo zoom.
- [ ] **TextField, TextArea, Checkbox, Radio**: l'area di tocco comprende l'etichetta; al focus dei campi la pagina non si ingrandisce (testo ≥ 16 px); la tastiera virtuale non copre il campo.
- [ ] **Select**: la lista si apre, resta visibile sopra la tastiera virtuale, si sceglie al tocco e si chiude.
- [ ] **MenuBar e StartButton**: il tocco apre il menu, si sceglie una voce (anche nel sottomenu), un tocco fuori chiude.
- [ ] **Tabs**: si cambia scheda al tocco; le linguette vanno a capo senza scroll.
- [ ] **Window**: i pulsanti della barra del titolo misurano 44 px e rispondono al tocco.
- [ ] **DesktopIcon** (story "Con Apertura"): un tocco apre l'icona (compare "Aperta: …").
- [ ] **AlertDialog** (story "Interattivo"): si apre, il focus va sul pulsante primario, i pulsanti e Chiudi funzionano, un tocco sul velo non chiude.
- [ ] **Tooltip**: al tocco non compare (nessun contenuto vive solo lì); con tastiera Bluetooth compare al focus.
- [ ] **Alto contrasto**: i controlli disabilitati hanno il bordo punteggiato, distinto dal focus tratteggiato.

## 8. Prompt per Claude in Chrome

Da usare in una sessione con Claude in Chrome, con `npm run preview` avviato.

**Smoke test**

> Apri http://localhost:4173/ in una nuova scheda. Verifica che il titolo della pagina, l'h1 e la lingua (`html[lang]`) siano corretti. Clicca il link della lingua e verifica che l'URL diventi /en/ senza ricaricare la pagina: prima del clic esegui `window.__qa = 1` e dopo controlla che esista ancora. Torna indietro con il browser. Leggi la console e riporta errori e warning. Ripeti per ogni route elencata in src/routes/routeMap.ts.

**Viewport mobile**

> Ridimensiona la finestra a 320×640 e poi a 375×667. Per ogni route fai uno screenshot, verifica che `document.documentElement.scrollWidth <= clientWidth` e che ogni controllo interattivo misuri almeno 44×44 px (usa getBoundingClientRect). Riporta i controlli sotto soglia con il selettore.

**Tastiera**

> Partendo dall'inizio della pagina, premi Tab finché il focus torna all'inizio. Elenca nell'ordine gli elementi che ricevono il focus, con ruolo e nome accessibile, e segnala quelli senza focus visibile. Prova Invio ed Esc sugli elementi interattivi.

**Rete e privacy**

> Ricarica la pagina e leggi le richieste di rete. Elenca tutte le richieste verso origini diverse da localhost:4173: devono essere zero. Controlla che nell'HTML sorgente non compaia un indirizzo email in chiaro.

**Confronto con il mockup**

> Confronta lo screenshot della route a 1440 px con il mockup di Claude Design allegato. Elenca le differenze di spaziature, colori, bevel e tipografia, con priorità.

## 9. Esito

Registra l'esito nella retrospettiva di fase: data, viewport e browser provati, problemi trovati e come sono stati risolti.
