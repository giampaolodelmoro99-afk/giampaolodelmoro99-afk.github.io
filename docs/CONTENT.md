# Contenuti

Raccolta dei contenuti del sito. Fonte per i dizionari i18n, i dati tipizzati (`src/content/`, dalla Fase 3), llms.txt e il CV. I contenuti personali sono coperti da "tutti i diritti riservati" (`LICENSE`).

## 1. Regole

- **Nome**: sul sito sempre "Gianpaolo Del Moro" (con N). GitHub ed email usano "giampaolo" (con M): `github.com/giampaolodelmoro99-afk`, `giampaolo.delmoro99@gmail.com`. La differenza è voluta, non va uniformata.
- **Email**: mai in chiaro nel markup statico (LEGAL.md §4).
- **LinkedIn non compare in nessuna parte del sito**: né in link, icone, testi o form, né in JSON-LD, llms.txt o CV pubblico. Il proprietario non ha un profilo LinkedIn (decisione del 13/10/2026). Il canale alternativo del form è l'email offuscata più GitHub.
- **Tono**: diretto, concreto, in prima persona; niente superlativi vuoti. In inglese: stesso contenuto, non traduzione letterale.
- **Bozze**: ogni testo marcato `BOZZA – da rivedere` è scritto da Claude e **non va online** finché Gianpaolo non lo approva. Dopo l'approvazione si toglie il marcatore e si annota la data.

## 2. Testi approvati

Approvati da Gianpaolo il 28/10/2026 (titolo) e aggiornati il 01/11/2026 (bio e meta description, con WordPress): non sono più bozze e possono andare online. Non indicano stage né azienda.

| Testo                                             | IT                                                                                                                                                                                                                                                   | EN                                                                                                                                                                                                                                                   |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Titolo                                            | Full Stack Developer · Studente ITS Academy Prodigi                                                                                                                                                                                                  | Full Stack Developer · ITS Academy Prodigi student                                                                                                                                                                                                   |
| Bio                                               | Sono Gianpaolo, Full Stack Developer e studente all'ITS Academy Prodigi di Pisa. Costruisco applicazioni web dal database all'interfaccia con Laravel e React, e siti con WordPress. Continuo a studiare per crescere ogni giorno come sviluppatore. | I'm Gianpaolo, a Full Stack Developer and student at ITS Academy Prodigi in Pisa. I build web applications from the database to the interface with Laravel and React, and websites with WordPress. I keep studying to grow as a developer every day. |
| Meta description della home (158 e 158 caratteri) | Portfolio in stile Windows 95 di Gianpaolo Del Moro, Full Stack Developer e studente all'ITS Academy Prodigi di Pisa. Progetti con Laravel, React e WordPress.                                                                                       | Windows 95-style portfolio of Gianpaolo Del Moro, Full Stack Developer and student at ITS Academy Prodigi in Pisa. Projects with Laravel, React and WordPress.                                                                                       |

Uso sul sito (Fase 2A):

- `<title>` di `/` e `/en/`: "Gianpaolo Del Moro · Full Stack Developer" (41 caratteri). Con il titolo completo il nome supererebbe i 60 caratteri (PERFORMANCE_SEO.md §4).
- Il titolo completo è in `og:title`, `twitter:title` e nel `jobTitle` del JSON-LD.
- La bio è nella finestra About, aperta all'avvio nella home e su `/profilo/` (`/en/about/`).
- **WordPress** (01/11/2026): compare nella bio e nella meta description, quindi va anche nell'app Skills in F3A (§5) e, con i suoi progetti, nell'app Progetti (§5, progetti candidati). Le description provvisorie di About e Skills lo includono già; quella di Progetti si riscrive in F3A con l'elenco definitivo dei progetti.
- Slug delle app: dove l'app corrisponde a una pagina della v1 vale lo slug della v1, definitivo (SPECS.md §6): `/profilo/`, `/stack/`, `/progetti/`, `/contatti/`. Gli altri slug, con i title e le description delle app, sono **bozze fino alla Fase 3A**: il sito non è online prima di `v1.0.0`.

## 3. Testi della v1 (tag `v1.0.0-legacy`)

Riportati come fonte, solo in italiano. Non tutti verranno riusati.

### Home (`src/pages/Home.jsx`)

- Titolo della finestra: "Benvenuto"
- H1: "Gianpaolo Del Moro"
- Terminale: `while(true) { sudo apt install -y coffee; code(); }` (cursore lampeggiante)
- Payoff: "Studente ITS Full Stack Developer / in cerca di una prima esperienza lavorativa"
- Pulsante: "Vai a Profilo >"
- Schermata di spegnimento: "Please wait while your computer shuts down..." / "(clicca ovunque per riaccendere)"

### Profilo (`src/pages/Profilo.jsx`)

- Bio, primo paragrafo: "Diplomato al Liceo Scientifico Buonarroti di Pisa con indirizzo Scienze Applicate, ho trasformato la mia passione per l'informatica in un percorso concreto, frequentando il corso ITS Full Stack Developer di Pisa."
- Bio, secondo paragrafo: "La programmazione web è il mio ambiente: amo la complessità che sta dietro ogni riga di codice. Sono in costante evoluzione, sempre alla ricerca di nuove tecnologie da padroneggiare."
- Solo in `llms.txt`: "Ho una forte vocazione per lo sviluppo backend con PHP, Laravel e Node.js (Express), con basi solide nella gestione di database relazionali e nella progettazione di API REST."
- Pulsanti: "< Torna alla Home", "Scarica CV", "Vai a Stack >"

### Stack (`src/pages/Stack.jsx`)

- Legend: "Installazione competenze frontend in corso..." / "Installazione competenze backend in corso..."
- Frontend: HTML (Avanzato, 90%), CSS, JavaScript, React (Intermedio, 65%)
- Backend: PHP, SQL, Node.js, Laravel (Intermedio, 65%)
- Solo in `llms.txt`: Database MySQL, MariaDB; Strumenti Git, GitHub, Docker, Postman, VS Code; Sistemi Linux (Ubuntu)

### Progetti (`src/pages/Progetti.jsx`)

| Nome v1            | Repo                                        | Descrizione v1                                                                                                                                        | Tecnologie                                  |
| ------------------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| task-manager.exe   | `task-manager-node`                         | API RESTful per gestire task, note e utenti, con autenticazione JWT, OpenWeather e assistente IA basato su Google Gemini.                             | Node.js, Express, MariaDB, JWT, Gemini AI   |
| rubrica.exe        | `progetto-node-rubrica`                     | API per una rubrica telefonica protetta: autenticazione JWT, isolamento dei dati tra utenti, integrità referenziale con ON DELETE CASCADE.            | Node.js, Express, MariaDB, JWT              |
| gestione-spese.exe | `gestione-spese-node`                       | Expense tracker con categorie personalizzate di entrate e uscite, calcolo del bilancio ed eliminazione a cascata per mantenere il database pulito.    | Node.js, Express, MariaDB, JWT              |
| biblioteca.exe     | `laravel-library-management-system-backend` | Sistema di gestione per biblioteche e cataloghi di libri, con relazioni many-to-many tra libri, autori e categorie tramite tabelle pivot ottimizzate. | Laravel, PHP, MySQL                         |
| store-manager.exe  | `laravel-store-backend`                     | Backend per la gestione di un negozio: clienti, ordini e prodotti, con carrelli multi-prodotto gestiti tramite tabella pivot order_product.           | Laravel, PHP, MySQL                         |
| task-notes.exe     | `laravel-task-manager`                      | Sistema full stack di gestione attività e note: API RESTful in Laravel con autenticazione Sanctum e frontend in JavaScript vanilla.                   | Laravel, Sanctum, JavaScript, MySQL, Docker |

URL: `https://github.com/giampaolodelmoro99-afk/<repo>`.

### Contatti (`src/pages/Contatti.jsx`)

- Email (offuscata nel codice)
- GitHub: `giampaolodelmoro99-afk`
- Località: Pisa, Toscana
- Disponibilità: Full-time

### 404 (`src/pages/NotFound.jsx`)

"GIANPAOLO_DEL_MORO.EXE" / "Errore irreversibile 404: la pagina richiesta non è stata trovata." / "* È possibile che la pagina sia stata spostata, eliminata o non sia mai esistita." / "* Premere un tasto qualsiasi per tornare alla Home." / "Premere un tasto qualsiasi per continuare"

### Metadati

| Pagina   | Title                                                 | Description                                                                                                                                            |
| -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home     | Gianpaolo Del Moro \| Full Stack Developer            | Portfolio di Gianpaolo Del Moro, studente ITS Full Stack Developer a Pisa. Progetti in Node.js, Laravel, React, in un'interfaccia in stile Windows 95. |
| Profilo  | Profilo — chi sono \| Gianpaolo Del Moro              | Diplomato al Liceo Scientifico Buonarroti di Pisa, indirizzo Scienze Applicate, oggi studente del corso ITS Full Stack Developer di Pisa.              |
| Stack    | Stack — tecnologie e competenze \| Gianpaolo Del Moro | Le tecnologie che uso: HTML, CSS, JavaScript e React lato frontend; PHP, SQL, Node.js e Laravel lato backend, con il livello raggiunto su ognuna.      |
| Progetti | Progetti — Node.js e Laravel \| Gianpaolo Del Moro    | Progetti backend in Node.js/Express e Laravel: API RESTful, autenticazione JWT e Sanctum, database MariaDB e MySQL. Codice sorgente su GitHub.         |
| Contatti | Contatti \| Gianpaolo Del Moro                        | Contattami via email o su GitHub. Full Stack Developer in formazione a Pisa, disponibile full-time per una prima esperienza lavorativa.                |
| 404      | Pagina non trovata \| Gianpaolo Del Moro              | La pagina richiesta non esiste. Torna alla home del portfolio di Gianpaolo Del Moro.                                                                   |

OG description: "Portfolio in stile Windows 95: progetti in Node.js, Laravel, React e PHP. Studente ITS Full Stack Developer in cerca di prima esperienza."

### Formazione ed esperienza (CV v1 e llms.txt)

- 10/2025 – in corso: Diploma di Tecnico Superiore, Full Stack Developer, ITS Academy Prodigi, Pisa (EQF 5).
- 2020 – 2023: Laurea in Giurisprudenza, Università di Pisa (non terminata).
- 2013 – 2019: Diploma di Liceo Scientifico, Liceo Scientifico Statale Filippo Buonarroti, Pisa (EQF 4).
- 15/06/2023 – 28/10/2023: Controllo imbarchi, aeroporto Galileo Galilei, ICTS Italia s.r.l., Pisa.
- Lingue: italiano madrelingua; inglese B1 (ascolto, lettura, scrittura, produzione e interazione orale B1).
- Patente: AM, B.
- Hobby: pianoforte, praticato da 5 anni.
- Competenze nel CV, non sul sito: Java (OOP), Spring Boot, Python.

## 4. Domande aperte (da chiudere in Fase 3)

- [ ] **Java, Spring Boot, Python**: vanno sul sito (Skills, llms.txt) o restano solo nel CV? Con quale livello e contesto d'uso?
- [ ] **Indirizzo del liceo**: "Scienze Applicate" (sito v1) o "indirizzo informatico" (CV v1)?
- [x] **LinkedIn**: chiusa il 13/10/2026, non compare sul sito (vedi §1).
- [ ] **Disponibilità**: "Full-time", stage, località (Pisa, remoto, trasferimento)?
- [ ] **WordPress**: livello e contesto d'uso nell'app Skills (§5).
- [ ] **qbitsoft.it**: ruolo svolto, link e dettagli del progetto (permesso confermato il 01/11/2026, §5).

## 5. Bozze da approvare

> **BOZZA – da rivedere.** Giurisprudenza come punto di forza (bio e Timeline)
>
> IT: "Prima dello sviluppo software ho studiato Giurisprudenza all'Università di Pisa (2020–2023). Ho interrotto gli studi per dedicarmi alla programmazione, ma quegli anni mi hanno lasciato un'attenzione concreta a privacy, GDPR e aspetti legali dei progetti: un sito o un'API trattano dati di persone, e lo tengo presente dalla prima riga."
>
> EN: "Before software development I studied Law at the University of Pisa (2020–2023). I left to focus on programming, but those years gave me a practical eye for privacy, GDPR and the legal side of projects: a website or an API handles people's data, and I keep that in mind from the first line of code."
>
> CV: "Studi in Giurisprudenza (2020–2023), interrotti per dedicarmi allo sviluppo software" / "Law studies (2020–2023), discontinued to focus on software development"

> **BOZZA – da rivedere.** Esperienza ICTS (CV e Timeline)
>
> IT: "Addetto ai controlli di sicurezza aeroportuali, ICTS Italia, aeroporto di Pisa (06/2023 – 10/2023). Applicazione rigorosa di procedure di sicurezza, responsabilità diretta sui controlli, attenzione al dettaglio, lavoro sotto pressione e su turni."
>
> EN: "Airport security screening officer, ICTS Italia, Pisa airport (06/2023 – 10/2023). Strict application of security procedures, direct responsibility for checks, attention to detail, working under pressure and in shifts."

> **BOZZA – da rivedere.** Skills con livello e contesto d'uso (al posto delle percentuali)
>
> Formato: `Tecnologia — Livello (base / intermedio / avanzato) — Contesto d'uso`. Esempi:
>
> - "HTML — Avanzato — markup semantico e accessibile in tutti i progetti, incluso questo sito"
> - "Node.js / Express — Intermedio — tre API REST con autenticazione JWT (task-manager, rubrica, gestione-spese)"
> - "Laravel — Intermedio — tre backend con relazioni many-to-many e Sanctum (biblioteca, store, task-notes)"
>
> Gruppi: Frontend, Backend, Database, **CMS e siti web**, Strumenti, Sistemi. Nel gruppo CMS e siti web:
>
> - "WordPress — livello da confermare — contesto d'uso da confermare (per esempio il rifacimento di qbitsoft.it, vedi i progetti candidati)"
>
> Livelli e contesti vanno confermati uno per uno.

> **BOZZA – da rivedere.** Progetti candidati per l'app Progetti (F3A), oltre ai sei repository della v1 (§3)
>
> - "Rifacimento del sito qbitsoft.it in WordPress". Permesso dell'azienda a mostrarlo nel portfolio: **confermato** (01/11/2026). Da confermare: ruolo svolto. Link e dettagli arrivano prima della F3A. Non è un repository GitHub: la scheda non avrà i metadati scaricati a build time e userà il link al sito.

## 6. Mancante per l'inglese

- [x] Payoff e bio (approvati il 28/10/2026, §2)
- [ ] Descrizioni dei 6 progetti
- [ ] Etichette e contesti delle skill
- [ ] Metadati (title, description) di ogni route (home approvata il 28/10/2026)
- [ ] Testo della 404 (BSOD)
- [ ] CV in inglese (confermato), generato dagli stessi dati del CV italiano
- [ ] Informativa privacy
- [ ] Alt, aria-label, titoli delle finestre, messaggi del form

## 7. Template: scheda progetto GitHub

```yaml
repo: giampaolodelmoro99-afk/<nome-repo> # verificare "giampaolo" con M
slug: <kebab-case> # usato nell'URL della scheda
name: { it: "", en: "" }
description: { it: "", en: "" } # 1-2 frasi, ≤ 160 caratteri
stack: [] # es. Node.js, Express, MariaDB
context: { it: "", en: "" } # corso ITS, progetto personale, lavoro di gruppo…
role: { it: "", en: "" } # cosa ho fatto io
demo: null # URL o null
images: # AVIF/WebP, con dimensioni; registrate in ASSETS.md
  - { file: "", width: 0, height: 0, alt: { it: "", en: "" } }
featured: false # in evidenza sì/no
caseStudy: false # se esiste un case study (§8)
```

I metadati (stelle, linguaggi, ultimo aggiornamento) li scarica lo script di build (ADR-0004), non si scrivono a mano.

## 8. Template: case study

```markdown
## <Nome progetto> (IT ed EN)

### Problema

Che cosa doveva risolvere, per chi, con quali vincoli.

### Scelte tecniche

Stack, architettura, alternative scartate e perché.

### Difficoltà

Il problema più duro incontrato e come l'ho affrontato.

### Risultato

Che cosa funziona, numeri se esistono (test, prestazioni), che cosa farei diversamente.
```

## 9. CV pubblico (IT ed EN)

**Sezioni**: intestazione (nome, ruolo, città, link al sito e a GitHub; email solo nel PDF e nella versione stampabile, mai nel markup prerenderizzato), profilo, competenze (livello e contesto), esperienza, istruzione e formazione, lingue, patente, interessi.

**Inclusi**: città (Pisa), email nel PDF, GitHub, sito, patente AM, B.

**Esclusi**: indirizzo, telefono, data di nascita, codice fiscale, clausola di consenso al trattamento dei dati.

**Formato**: pagina HTML stampabile più PDF generato in build, tagged, con metadati minimi (LEGAL.md §8).
