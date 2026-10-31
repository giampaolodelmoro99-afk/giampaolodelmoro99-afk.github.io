# Specifiche

## 1. Visione

Un portfolio che si presenta come un desktop Windows 95 e funziona come un sito moderno. Deve essere veloce (Lighthouse e budget in PERFORMANCE_SEO.md), accessibile (WCAG 2.2 AA), leggibile da motori di ricerca e assistenti AI senza eseguire JavaScript, rispettoso della privacy (nessuna terza parte al caricamento) e usabile da 320 px in su, con il dito come con mouse e tastiera.

Il tema 95 è un'interfaccia, non un ostacolo: chi ha fretta trova CV e contatti in pochi secondi.

## 2. Tipi di visitatore

| Visitatore               | Cosa vuole                                                                               | Requisiti che ne derivano                                                                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Recruiter frettoloso** | Capire chi sono, scaricare il CV, contattarmi. Spesso da telefono, in meno di un minuto. | CV e contatti raggiungibili in **≤ 2 interazioni** da qualsiasi route; "Vista semplice" senza metafora desktop; contatto possibile **anche se il form è giù**; testi brevi in apertura.            |
| **Tech lead**            | Valutare il codice e il modo di lavorare.                                                | Link al repo e ai progetti GitHub; case study (problema, scelte, difficoltà, risultato); finestra "Making of" con processo, test, ADR e uso dell'AI; qualità verificabile (Lighthouse, test, CSP). |
| **Curioso**              | Divertirsi con il desktop 95.                                                            | Window manager credibile, Campo minato, Terminale, easter egg; tutto disattivabile, accessibile e senza impatto sulle metriche.                                                                    |

## 3. Requisiti funzionali

Il dettaglio di ogni app si definisce nel piano della fase che la realizza.

| Area           | Requisito                                                                                                                                                                                | Fase  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Desktop        | Sfondo, icone, selezione, apertura con doppio clic / Invio / tap                                                                                                                         | 2A    |
| Finestre       | Drag, resize, focus, z-index, minimizza, massimizza, chiudi; animazioni rispettose di reduced motion                                                                                     | 2A    |
| Taskbar        | Pulsanti delle finestre aperte, orologio con etichetta accessibile, menu Start                                                                                                           | 2A    |
| Menu           | Start, menu contestuale (sempre raggiungibile anche senza tasto destro), "Esegui…"                                                                                                       | 2A    |
| Routing        | Ogni finestra ha un deep link per lingua; il router è la fonte di verità della finestra attiva                                                                                           | 2B    |
| Persistenza    | Posizione e dimensione delle finestre in localStorage, senza CLS                                                                                                                         | 2B    |
| Mobile         | Modalità dedicata: finestre a schermo intero, navigazione touch                                                                                                                          | 2B    |
| Contenuti      | About, Progetti GitHub (dati a build time), case study, CV stampabile IT/EN, Timeline, Skills (livello e contesto d'uso, niente percentuali)                                             | 3A    |
| Contatti       | Form Web3Forms con anti-abuso e canale alternativo (§7)                                                                                                                                  | 3B    |
| Legale         | Pagina /privacy IT/EN, disclaimer Microsoft nel footer                                                                                                                                   | 3B    |
| Accesso rapido | Vista semplice; Making of                                                                                                                                                                | 3B    |
| Esperienza     | Boot (solo prima visita, saltabile, mai elemento LCP), suoni con mute, Pannello di controllo, Terminale, Campo minato, Cestino con la v1, screensaver, 404 BSOD, spegnimento, easter egg | 4A/4B |

## 4. Requisiti non funzionali

- **Performance**: Lighthouse nelle soglie di PERFORMANCE_SEO.md §2, su tutte le route principali IT ed EN. Budget in `PERFORMANCE_SEO.md`. Nessun errore in console.
- **Leggibilità senza JS**: ogni route prerenderizzata contiene il contenuto completo della sua finestra in HTML semantico, con metadati, hreflang e JSON-LD.
- **Responsive**: da 320 px ai monitor larghi, in verticale e in orizzontale, senza scroll orizzontale. Zoom del browser e safe-area supportati.
- **Accessibilità**: WCAG 2.2 AA, tastiera completa, screen reader, reduced motion, alto contrasto (`ACCESSIBILITY.md`).
- **Privacy**: nessuna richiesta a terze parti al caricamento, solo storage tecnico, nessun cookie banner (`LEGAL.md`).
- **i18n**: italiano di default, inglese, slug tradotti (`I18N.md`).
- **Sicurezza**: CSP senza `unsafe-inline`, dipendenze controllate.
- **Manutenibilità**: TypeScript strict, coverage nella soglia di TESTING.md §3, ADR per ogni decisione rilevante.
- **Originalità e nomi**: nessun asset Microsoft (`ASSETS.md`) e nessun nome di prodotto Microsoft nelle etichette (nomi delle app, icone, menu e titoli delle finestre). Le descrizioni ("in stile Windows 95") e il disclaimer di non affiliazione di `LEGAL.md` possono nominare Windows. Le app si chiamano "Terminale" / "Terminal" e "Campo minato" / "Minefield", mai "MS-DOS", "Prato fiorito" o "Windows" (design system GDM 95, `docs/design/gdm95/README.md`).
- **LinkedIn**: non compare in nessuna parte del sito (`CONTENT.md` §1).

## 5. Route e deep link

La fonte unica è `src/routes/routeMap.ts`. Ogni chiave ha uno slug per lingua. La lingua inglese ha il prefisso `/en/`. Gli URL canonici hanno la slash finale, tranne la radice.

| Chiave    | IT                                                  | EN     | Stato               |
| --------- | --------------------------------------------------- | ------ | ------------------- |
| `desktop` | `/`                                                 | `/en/` | Fase 0              |
| (404)     | qualsiasi URL non previsto → `404.html`, status 404 |        | Fase 0 (BSOD in 4A) |

Le route delle app si aggiungono con la skill `window-app`.

## 6. Mappatura degli URL della v1

La v1 era indicizzata con quattro sottopagine. Non devono diventare 404 alla release.

| URL v1      | Destinazione v2        | Modalità                                                                                                                                                      |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/profilo`  | finestra About (IT)    | stesso percorso se lo slug IT resta `profilo`; altrimenti pagina di reindirizzamento statica con `<link rel="canonical">` e `meta refresh` verso il nuovo URL |
| `/stack`    | finestra Skills (IT)   | come sopra                                                                                                                                                    |
| `/progetti` | finestra Progetti (IT) | stesso percorso (slug IT `progetti` previsto)                                                                                                                 |
| `/contatti` | finestra Contatti (IT) | stesso percorso (slug IT `contatti` previsto)                                                                                                                 |

- **Fase 2A** (28/10/2026): le quattro route esistono già con lo slug della v1, che è definitivo (`/profilo/`, `/stack/`, `/progetti/`, `/contatti/`; in inglese `/en/about/`, `/en/skills/`, `/en/projects/`, `/en/contact/`). GitHub Pages risponde agli URL della v1 senza slash finale con un 301 verso la cartella, quindi non servono pagine di reindirizzamento. Gli slug delle altre app sono provvisori fino alla Fase 3A (`src/routes/routeMap.ts`).
- **Fase 3**: si scelgono gli slug definitivi e si generano le eventuali pagine di reindirizzamento in build, escluse dalla sitemap.
- **Fase 7**: si verificano con `curl -I` in produzione, sitemap aggiornata e Google Search Console (copertura, reindirizzamenti, richiesta di nuova scansione).

## 7. Form contatti

- **Inoltro**: Web3Forms inoltra il messaggio alla mia email. L'email del visitatore è impostata come indirizzo di risposta (`replyto`). Al visitatore non parte nessuna email automatica.
- **Campi**: solo nome, email, messaggio.
- **Validazione lato client**: campi obbligatori, formato email, lunghezza massima per campo (indicativa: nome 100, email 254, messaggio 5000 caratteri; si conferma in F3). L'esistenza dell'email del mittente non è verificabile su un sito statico: si controlla solo il formato.
- **Anti-abuso**:
  - campo honeypot
  - tempo minimo di compilazione
  - pausa minima tra due invii dallo stesso browser (`contact.lastSubmitAt` in localStorage)
  - limiti di lunghezza dei campi
  - pulsante disabilitato durante l'invio
  - restrizione al dominio nel pannello di Web3Forms
  - **hCaptcha su consenso esplicito** (ADR-0017): si carica solo dopo un clic su «Attiva la verifica», con una riga informativa e il link alla privacy, mai al caricamento della pagina; nessun banner. La verifica è controllata anche lato server (hCaptcha attivo nel pannello di Web3Forms)
- **Alternativa alla verifica**: email offuscata e GitHub sempre visibili, per chi non attiva la verifica o non riesce a completarla
- **Stati di invio**: in corso, inviato ed errore, annunciati con una regione live e con il focus spostato sul messaggio.
- **Errore di invio** (quota esaurita, servizio irraggiungibile, rete assente, risposta non valida, timeout):
  - messaggio chiaro e accessibile
  - dati conservati
  - **canale alternativo sempre funzionante**: email offuscata (ricomposta dopo l'idratazione) e link GitHub. **LinkedIn non compare in nessuna parte del sito** (CONTENT.md §1)
- **Email mai in chiaro** nell'HTML prerenderizzato, nel JSON-LD, in llms.txt e nella sitemap.
- **Access key**: variabile d'ambiente di build `VITE_WEB3FORMS_ACCESS_KEY`, mai nel codice.

## 8. Criteri di accettazione

| Requisito       | Criterio verificabile                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Lighthouse      | Nelle soglie di PERFORMANCE_SEO.md §2 (ADR-0018), su tutte le route principali                                                       |
| HTML statico    | `npm run test:prerender` verde: lang, title, description, canonical, hreflang, OG, JSON-LD e contenuto della finestra per ogni route |
| Navigazione SPA | e2e: cambio route senza reload (marcatore su `window` conservato)                                                                    |
| Responsive      | e2e su 320, 375, 768, 1024, 1440 px + touch: nessuno scroll orizzontale, target ≥ 44 px, screenshot stabili                          |
| Accessibilità   | zero violazioni axe (unit ed e2e, WCAG 2.2 AA); checklist manuale in `QA_CHECKLIST.md`                                               |
| Privacy         | e2e: nessuna richiesta verso origini esterne al caricamento; test che nessun file statico contenga l'email                           |
| Console         | e2e: nessun errore o warning in console                                                                                              |
| Recruiter       | e2e: da ogni route, CV e contatti in ≤ 2 interazioni; contatto possibile con Web3Forms simulato giù                                  |
| Peso            | `npm run size` entro i budget                                                                                                        |

## 9. Fuori perimetro

Backend proprio, account utente, CMS, analytics, commenti, newsletter, embed di terze parti, captcha di terze parti, salvo hCaptcha nel form Contatti su consenso esplicito (ADR-0017).
