# ADR-0002: Form contatti con Web3Forms, honeypot e protezioni senza cookie

- **Stato**: **Proposta**. Diventa Accettata solo dopo la verifica in Fase 3B di privacy policy e DPA ufficiali di Web3Forms (gestore, regione dei dati, eventuale antispam di terzi). Altrimenti si applica il piano B.
- **Data**: 2026-10-13
- **Fase**: 0 (implementazione in Fase 3B)

## Contesto

Il sito è statico su GitHub Pages: niente backend. Serve un modo per farsi contattare che:

- non carichi terze parti al caricamento della pagina
- non usi cookie né captcha di terze parti
- tratti il minimo di dati
- funzioni anche quando il servizio non risponde

## Decisione

- **Servizio**: Web3Forms (gratuito, nessun backend). La chiamata a `https://api.web3forms.com` parte **solo all'invio** (`fetch`), quindi la CSP apre `connect-src` solo a quell'origine e `form-action` resta `'none'`.
- **Inoltro**: i messaggi arrivano a `giampaolo.delmoro99@gmail.com`. L'email del visitatore è `replyto`. **Nessuna email automatica al visitatore.**
- **Campi**: solo nome, email, messaggio.
- **Access key**: variabile d'ambiente di build `VITE_WEB3FORMS_ACCESS_KEY` (variabile del repo GitHub). Non è un segreto (finisce nel bundle) ma non sta nel codice; la build di produzione fallisce se manca.
- **Validazione lato client**: campi obbligatori, formato email, lunghezze massime.
- **Anti-abuso senza cookie**:
  - campo honeypot nascosto agli utenti e alle tecnologie assistive
  - tempo minimo di compilazione
  - pausa minima tra due invii dallo stesso browser (`contact.lastSubmitAt` in localStorage, elencata in LEGAL.md e ADR-0003)
  - pulsante disabilitato durante l'invio
  - restrizione al dominio `gianpaolodelmoro.it` nel pannello di Web3Forms (DEPLOYMENT.md §6)
- **Stati accessibili**: in corso, inviato ed errore annunciati in una regione live, con il focus sul messaggio.
- **Invio fallito** (quota esaurita, servizio irraggiungibile, rete assente, risposta non valida, timeout): messaggio chiaro, dati conservati e **canale alternativo sempre funzionante**. Il canale è l'email offuscata (ricomposta dopo l'idratazione, mai in chiaro nell'HTML prerenderizzato né nel JSON-LD) più il link GitHub. LinkedIn non compare sul sito (CONTENT.md §1). Il canale alternativo è visibile anche nella finestra Contatti.
- **Test**: e2e con `page.route` che simulano 500, quota esaurita, rete assente, JSON malformato e timeout. Test sul build che l'email non compaia in chiaro.

## Limiti dichiarati

- **Chiave pubblica su un sito statico**: chiunque può leggerla dal bundle e chiamare l'API direttamente, aggirando honeypot, tempo minimo e pausa. La restrizione al dominio limita l'uso da altri siti ma non da script.
- **Protezioni lato client**: fermano i bot semplici, non un attacco mirato.
- **Quota mensile** del piano gratuito: uno spam massivo può esaurirla. Per questo il canale alternativo è sempre visibile.
- **Esistenza dell'email del mittente non verificabile**: su un sito statico si controlla solo il formato. La verifica reale avviene quando rispondo.
- **Trasferimenti extra UE**: infrastruttura AWS con regione non dichiarata; gestore da confermare (il DPA del 13/07/2026 indica Web3Creative, altre fonti Sacred Media LLC).

## Piano B

Se lo spam supera la quota o la verifica del DPA non è soddisfacente:

1. **Fornitore con sede e dati in UE**, a parità di architettura (solo `fetch` all'invio).
2. **Captcha caricato solo dopo consenso esplicito** al momento dell'invio (mai al caricamento), con aggiornamento di LEGAL.md e della privacy.
3. **Backend proprio** (funzione serverless in UE) con rate limit per IP e chiave segreta lato server.

Ognuna richiede un nuovo ADR che sostituisce questo.

## Alternative considerate

| Alternativa                                             | Perché scartata (per ora)                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Solo link `mailto:`                                     | Nessuna conferma di invio; dipende dal client email del visitatore, spesso assente su desktop |
| Formspree / Getform                                     | Simili, piani gratuiti più limitati; stesse questioni di trasferimento                        |
| Netlify Forms                                           | Richiede di lasciare GitHub Pages                                                             |
| Captcha di terze parti (reCAPTCHA, hCaptcha, Turnstile) | Richieste a terzi, cookie o fingerprinting, cookie banner                                     |

## Riferimenti

SPECS.md §7, LEGAL.md §3-4, DEPLOYMENT.md §5-6, TESTING.md §8, web3forms.com/dpa.
