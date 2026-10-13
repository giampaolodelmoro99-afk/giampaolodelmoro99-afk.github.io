# Retrospettiva Fase 1A: fondamenta del design system GDM 95

- **Branch**: `phase/01a-foundation-ds`
- **Periodo**: 2026-10-13
- **Piano**: [phase-01-plan.md](phase-01-plan.md) (§1–§10 e "Scostamenti dall'implementazione")
- **Ultima CI del branch**: **da verificare dopo il push** (il branch non è ancora stato pushato). È il cancello finale per il merge (`close-phase` §6).

## 1. Obiettivi e risultato

| Obiettivo del piano                                          | Stato    | Note                                                                                                  |
| ------------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------- |
| Pacchetto GDM 95 committato e analizzato                     | fatto    | 33 SHA-256 delle icone verificati; Prettier e Stylelint ignorano il pacchetto                         |
| Token del pacchetto in `src/` più token per i letterali (D6) | fatto    | test che verifica tutti i valori del pacchetto; forced-colors esteso ai sottoalberi con tema (review) |
| Stylelint esteso                                             | fatto    | proprietà private `--_`, sei proprietà in più sotto controllo, test sulle regole                      |
| Focus a doppio anello su desktop e 404 (nota 4 della F0)     | fatto    | e2e su anello, alto contrasto e forced-colors                                                         |
| Font Pixel Operator e IBM Plex Sans                          | fatto    | Plex con i subset ufficiali di IBM (nome riservato), preload dei due pesi di Pixel Operator           |
| Icone, Icon e Glyph                                          | fatto    | dati generati dagli SVG con test di allineamento                                                      |
| Favicon col monogramma GDM (D3)                              | fatto    | PNG rinviate a F5                                                                                     |
| Test di integrità di ASSETS.md                               | fatto    | anche in negativo                                                                                     |
| Storybook 10 pubblicato in `/storybook/` con CSP dedicata    | fatto    | `font-src data:` in più rispetto al piano (pagine Docs)                                               |
| Test visivi e axe delle story                                | fatto    | 4 combinazioni tema × input, target 44 px in touch e 24 px con il mouse                               |
| Analisi del bundle (nota 1)                                  | fatto    | non riducibile in modo significativo, motivato in PERFORMANCE_SEO §1                                  |
| JS dopo load (nota 2)                                        | fatto    | e2e con CPU 4×; misura per F2A documentata                                                            |
| Filtro dei tag del deploy (nota 3) e runner fissato (nota 5) | fatto    | test sui workflow                                                                                     |
| Preview `--host` e QA su Android reale                       | parziale | opzione pronta e verificata; **la QA sul telefono la fa Gianpaolo** (QA_CHECKLIST §7)                 |
| Documenti                                                    | fatto    | ADR-0010 aggiornata, ADR-0011 nuova                                                                   |

## 2. Cosa è andato bene

- Il pacchetto di Claude Design era preciso: i token sono entrati senza cambiare un valore, e un test lo garantisce nel tempo.
- I test "in negativo" hanno trovato due problemi veri: il test axe in alto contrasto **passava** con il testo nero su nero (axe lo considera "incompleto"), quindi serve un controllo esplicito del contrasto; il test di sincronizzazione delle icone fallisce davvero se si modifica a mano un file generato.
- Lighthouse 100 su mobile e desktop con i nuovi font, CLS 0.
- Le quattro review hanno trovato problemi reali senza bloccanti: un URL malformato faceva cadere la preview (grave con `--host`), forced-colors non copriva i sottoalberi, il controllo dei target touch non avrebbe retto gli input nascosti di React Aria.

## 3. Cosa non è andato bene, e come è stato corretto

- **Fonte ufficiale di Pixel Operator scomparsa** (notabug.org 404, nessun mirror): usato il pacchetto DaFont dell'autore, con licenza CC0 nel file e nei metadati del font (D2).
- **Licenza di Plex**: il piano prevedeva un subset fatto da noi, ma con il Reserved Font Name "Plex" sarebbe stata una versione modificata. Verificata la FAQ ufficiale OFL e usati i subset Latin1 di IBM, identici alla release.
- **Il titolo della home è in grassetto**: il preload del solo regular non bastava; precaricati entrambi i pesi (6,3 kB).
- **Firefox e `boundingBox()`**: 43,99997 px per un link di 44 px dopo il cambio di font. La causa è la conversione di Playwright, non il layout; il test ora misura con `getBoundingClientRect()`, soglia invariata.
- **Vite 8 e il visualizzatore del bundle**: il plugin catturava la build del prerender; limitato all'environment `client`.
- **L'addon a11y di Storybook** eseguiva axe insieme ai nostri test ("Axe is already running"): messo in modalità manuale dall'URL.
- **Claude in Chrome**: la lettura della pagina funziona, ma la cattura degli screenshot va in timeout e il ridimensionamento non ha effetto (come in F0). La resa a 320/1440 px è stata controllata con screenshot Playwright e sulle baseline del container.
- **Limite di sessione** durante la review: security-auditor e a11y-auditor sono stati rilanciati dopo il ripristino.

## 4. Metriche

| Metrica                                      | Valore                                                  | Fase 0                        |
| -------------------------------------------- | ------------------------------------------------------- | ----------------------------- |
| Test unitari (numero)                        | 101 in 16 file                                          | 27                            |
| Coverage righe / rami / funzioni / statement | 99,13% / 88,18% / 98,86% / 98,51%                       | 98,76 / 92,85 / 97,22 / 98,88 |
| Test prerender (numero)                      | 24                                                      | 16                            |
| Test e2e (numero, progetti)                  | 196 su 10 progetti (in più `performance` e `storybook`) | 95 su 8                       |
| Screenshot di riferimento                    | 39 (15 pagine + 24 story)                               | 15                            |
| Lighthouse mobile `/` e `/en/`               | 100 / 100 / 100 / 100, LCP 0,9–1,1 s, CLS 0, TBT 0      | 100 (LCP 0,9 s)               |
| Lighthouse desktop `/` e `/en/`              | 100 / 100 / 100 / 100                                   | 100                           |
| JS iniziale gzip                             | 112,25 kB (budget 115)                                  | 112,16 kB                     |
| CSS iniziale gzip                            | 3,6 kB (budget 12)                                      | 1,31 kB                       |
| Font in preload                              | 6,26 kB (budget 25)                                     | –                             |
| Idratazione dopo load (Pixel 7, CPU 4×)      | ≈ 260 ms, una long task ≈ 60 ms                         | –                             |
| Violazioni axe                               | 0 (pagine e story, due temi, mouse e touch)             | 0                             |
| `npm audit --omit=dev`                       | 0 vulnerabilità                                         | 0                             |

## 5. QA manuale

- 2026-10-13, Chrome con Claude in Chrome su `npm run preview`: idratazione, cambio lingua senza ricaricare (`window.__qa` conservato), Pixel Operator 400 e 700 caricati, CSP presente, nessuna richiesta esterna, nessun overflow, console pulita. Storybook: noindex, tema alto contrasto dall'URL, nessun errore CSP e nessuna richiesta esterna.
- Viewport 320 e 1440 px nei due temi con focus da tastiera: screenshot Playwright e baseline del container riviste a mano.
- a11y-auditor: forced-colors emulato, spaziatura del testo (1.4.12) e zoom simulato al 400% senza perdite.
- **Da fare (Gianpaolo)**: telefono Android reale con `npm run preview -- --host` (QA_CHECKLIST §7); NVDA e VoiceOver; zoom reale al 200/400%.

## 6. Decisioni e ADR

- D1–D6 del piano (divisione 1A/1B, DaFont, favicon, autore delle icone, slider rinviato, token senza eccezioni).
- ADR-0010 aggiornata (fonti, subset ufficiali di Plex, preload, fallback); **ADR-0011** nuova (vulnerabilità di sviluppo di `@lhci/cli` accettate).
- Scostamenti dal piano elencati in `phase-01-plan.md`.

## 7. Debito tecnico e rischi aperti

- **React Aria e la CSP del sito**: React Aria inserisce a runtime uno `<style id="react-aria-pressable-style">` (visto nel manager di Storybook). La CSP del sito (`style-src 'self'`, senza `unsafe-inline`) lo bloccherebbe. **Da risolvere all'inizio della 1B**, prima del primo componente nelle pagine (per esempio con un hash dello stile o un foglio equivalente nel CSS globale).
- **Barra del titolo inattiva `#6a6a6a`**: 2,97:1 sul telaio `#c0c0c0`, appena sotto 3:1 (a11y-auditor, WCAG 1.4.11). È un valore approvato del pacchetto: decidere se passare a `#696969` (3,02:1). In F2A serve comunque un segnale non cromatico della finestra attiva.
- **Leggibilità di Pixel Operator a 16 px**: rende come un Arial di circa 12,5 px (maiuscole circa 10 px). Conforme ad AA, ma piccolo per le frasi (la tagline della home va su tre righe) e sfocato a zoom non interi. Proposta dell'a11y-auditor: font documento per le frasi, pixel per titoli ed etichette brevi.
- **Disabilitato in alto contrasto**: `#3ff23f` si distingue dal bianco solo per tinta; in 1B serve un secondo segnale.
- **Icone in un unico modulo**: circa 11 kB gzip, non riducibili con il tree shaking; da misurare quando entrano nella home (F2A).
- **Icona Campo minato**: "caselle d'erba con fiore" (content-reviewer) richiama il motivo della versione italiana del gioco Microsoft; il disegno è originale e approvato, ma conviene una tua conferma.
- **Deploy manuale**: `workflow_dispatch` parte da qualsiasi ref; conviene limitare branch e tag nelle regole dell'environment `github-pages` (Settings → Environments, a cura del proprietario).
- Restano dalla F0: trasformazione del bootstrap legata al markup di React Router 8.4; versione di Playwright legata all'immagine Docker; slash finale da verificare in produzione.

## 8. Lezioni per AI_WORKFLOW.md

Riportate in AI_WORKFLOW.md §5 (Fase 1A).

## 9. Azioni per la fase successiva

1. Push del branch e verifica della CI su GitHub (primo run con Storybook, i progetti `performance` e `storybook` e i runner `ubuntu-24.04`).
2. QA su Android reale (QA_CHECKLIST §7) e risposte ai punti aperti di §7 (barra inattiva, font delle frasi, icona Campo minato).
3. Merge `--no-ff` e tag `phase-01a`, poi branch `phase/01b-components` da `main` e plan mode partendo dall'appendice B del piano, con al primo punto la CSP per lo stile di React Aria.
