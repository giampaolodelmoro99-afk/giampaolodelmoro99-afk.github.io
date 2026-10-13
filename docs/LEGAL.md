# Requisiti legali e privacy

Questo documento è **vincolante**: ogni modifica che lo viola va segnalata e non va unita a `main`. L'agente `security-auditor` lo usa come checklist.

## 1. Nessuna richiesta a terze parti al caricamento

- Font salvati nel progetto, niente CDN, niente analytics, niente embed (YouTube, mappe, social), niente pixel.
- **Unica eccezione**: la chiamata a Web3Forms (`https://api.web3forms.com`) al momento dell'invio del form contatti, su azione esplicita del visitatore.
- I link verso siti esterni (GitHub, LinkedIn) sono semplici `<a>` e non generano richieste finché il visitatore non li segue.
- Verifica automatica: la fixture e2e fallisce per qualsiasi richiesta verso un'origine diversa dal sito.

## 2. Storage tecnico e cookie

Il sito non usa cookie. Usa solo localStorage tecnico, necessario alle funzioni richieste dal visitatore (art. 122 del Codice privacy; linee guida del Garante sui cookie e altri strumenti di tracciamento, 10 giugno 2021). Quindi **nessun cookie banner** (ADR-0003).

| Chiave                 | Contenuto                                                            | Fase |
| ---------------------- | -------------------------------------------------------------------- | ---- |
| `locale`               | lingua preferita                                                     | 4A   |
| `audio`                | suoni attivi o disattivati                                           | 4A   |
| `theme`                | tema, alto contrasto, dimensione testo, riduzione animazioni, sfondo | 4A   |
| `windows`              | posizione e dimensione delle finestre                                | 2B   |
| `boot.seen`            | boot già visto                                                       | 4A   |
| `contact.lastSubmitAt` | data e ora dell'ultimo invio del form (anti-abuso)                   | 3B   |

Più `sessionStorage` `react-router-scroll-positions`, gestito da React Router per ripristinare lo scroll.

**Qualsiasi chiave nuova va aggiunta a questa tabella e ad ADR-0003 prima del merge.** Niente identificativi, niente dati personali, niente tracciamento.

## 3. Informativa privacy (pagina /privacy, IT ed EN, Fase 3B)

Linkata nel footer e accanto al pulsante di invio del form. Contenuti obbligatori (art. 13 GDPR):

1. **Titolare**: Gianpaolo Del Moro, contatto `giampaolo.delmoro99@gmail.com`. L'alias sul dominio si valuta in F6. Nel prerender l'indirizzo compare in forma offuscata non cliccabile, decisione da confermare in F3B (vedi §4).
2. **Dati trattati**:
   - log tecnici di GitHub Pages (indirizzo IP, user agent, data e ora), trattati da GitHub
   - dati del form: nome, email, messaggio
3. **Finalità**: erogazione e sicurezza del sito; risposta ai messaggi.
4. **Basi giuridiche**: legittimo interesse (art. 6.1.f) per i log; misure precontrattuali o richiesta dell'interessato (art. 6.1.b) per il form.
5. **Fornitori**:
   - GitHub, Inc. (hosting)
   - Web3Forms (inoltro dei messaggi). Gestore da verificare: il DPA del 13/07/2026 indica Web3Creative, altre fonti Sacred Media LLC. Va verificato anche l'eventuale controllo antispam tramite servizi terzi.
6. **Trasferimenti extra UE**: GitHub (USA, EU-US Data Privacy Framework e/o clausole contrattuali standard); Web3Forms (AWS, regione non dichiarata, da verificare in F3B).
7. **Conservazione**: log secondo le policy di GitHub; messaggi nella casella email per il tempo necessario a rispondere e comunque non oltre 24 mesi; Web3Forms li conserva 30 giorni sul piano gratuito.
8. **Diritti** (artt. 15-22): accesso, rettifica, cancellazione, limitazione, opposizione, portabilità; come esercitarli.
9. **Reclamo** al Garante per la protezione dei dati personali (garanteprivacy.it).
10. **Cookie e storage**: nessun cookie; elenco delle chiavi di §2 con lo scopo di ciascuna.
11. Data dell'ultimo aggiornamento.

## 4. Form contatti (Fase 3B, ADR-0002)

- Solo i campi necessari: **nome, email, messaggio**.
- Web3Forms inoltra a me, con l'email del visitatore in `replyto`. **Nessuna email automatica al visitatore.**
- Access key da variabile d'ambiente di build, mai nel codice.
- Anti-abuso **senza cookie** e **senza captcha di terze parti**:
  - honeypot
  - tempo minimo di compilazione
  - pausa tra invii (`contact.lastSubmitAt`)
  - pulsante disabilitato durante l'invio
  - restrizione al dominio nel pannello di Web3Forms
- In caso di errore: messaggio accessibile e **canale alternativo sempre funzionante** (email offuscata, GitHub; LinkedIn solo se aggiunto in CONTENT.md).
- **L'email non compare mai in chiaro** nell'HTML prerenderizzato, nel JSON-LD, in llms.txt o nella sitemap; si ricompone dopo l'idratazione. Un test sul build lo verifica.

## 5. Marchi

Disclaimer visibile nel footer, o nella finestra "Informazioni", in IT ed EN:

> Windows è un marchio di Microsoft Corporation. Questo sito non è affiliato, approvato o sponsorizzato da Microsoft.
>
> Windows is a trademark of Microsoft Corporation. This site is not affiliated with, endorsed or sponsored by Microsoft.

## 6. Asset vietati e procedura

- **Vietati**: font Microsoft (MS Sans Serif, Tahoma, Fixedsys e loro ridisegni come W95FA), icone di Windows, suoni di sistema (avvio, "ding", "chord"), logo e bandiera di Windows, Clippy e altri personaggi, schermate originali.
- **Ammessi**: asset originali (creati per il progetto, anche con Claude Design) o con licenza libera verificata (CC0, CC BY, SIL OFL, MIT…).
- **Procedura**: prima di usare un asset lo si registra in `ASSETS.md` (fonte, autore, versione, licenza, link alla licenza, SHA-256, data di verifica). Le licenze che lo richiedono si includono nel repo. Attribuzioni visibili se la licenza le richiede.

## 7. Loghi di terzi

Loghi di aziende, scuole o enti (es. ITS Academy Prodigi, università) **solo con permesso scritto**, registrato in ASSETS.md. Senza permesso si usa solo il nome in testo.

## 8. CV pubblico

- Nessun dato non necessario: niente indirizzo, telefono, data di nascita, foto non scelta, codice fiscale.
- Si toglie la clausola di consenso al trattamento (riferimento superato e inutile in un CV pubblicato dall'interessato).
- PDF generati in build: tagged, metadati minimi (Title, Lang), senza Producer o date di creazione superflue; un test lo verifica.
- Riformulazioni (esperienza ICTS, Giurisprudenza) approvate dal titolare prima della pubblicazione.

## 9. Licenze

- Codice: **MIT** (`LICENSE`).
- Contenuti personali (testi, biografia, CV, immagini, case study): **tutti i diritti riservati**.
- Asset di terzi: licenze proprie, in ASSETS.md.

## 10. Checklist di verifica

- [ ] Nessuna richiesta esterna al caricamento (e2e verde) e nessuna nuova origine nella CSP oltre a Web3Forms.
- [ ] Storage usato = tabella di §2.
- [ ] /privacy completa, aggiornata, linkata nel footer e vicino al form.
- [ ] Form con soli 3 campi, nessuna autorisposta, access key da variabile.
- [ ] Email mai in chiaro nel markup statico (test verde).
- [ ] Disclaimer Microsoft presente in IT ed EN.
- [ ] Ogni asset in ASSETS.md, nessun asset vietato, licenze incluse.
- [ ] CV senza dati non necessari e senza metadati superflui.
