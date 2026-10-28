# ADR-0017: hCaptcha su consenso esplicito nel form Contatti

- **Stato**: Accettata (implementazione in Fase 3B)
- **Data**: 2026-10-28
- **Fase**: 2A (decisione), 3B (implementazione)
- **Sostituisce in parte**: ADR-0002, solo per la parte sul captcha (anti-abuso senza captcha di terze parti, piano B punto 2). Il resto di ADR-0002 resta valido.

## Contesto

ADR-0002 protegge il form Contatti con sole misure lato client: honeypot, tempo minimo, pausa tra gli invii, restrizione al dominio. Dichiara anche i propri limiti:

- la access key di Web3Forms è pubblica e si legge dal bundle;
- uno script può chiamare l'API direttamente, aggirando tutte le protezioni lato client;
- uno spam massivo può esaurire la quota mensile del piano gratuito.

Il piano B di ADR-0002 prevede, al punto 2, un «captcha caricato solo dopo consenso esplicito al momento dell'invio (mai al caricamento)». Il 28/10/2026 il proprietario ha deciso di attivarlo subito, invece di aspettare che lo spam superi la quota. Le ragioni:

- **la verifica dev'essere lato server**: con hCaptcha attivato nel pannello di Web3Forms, l'API rifiuta gli invii senza un token valido. Una chiamata diretta all'API non basta più;
- **è un caso già previsto**: rientra nel piano B di ADR-0002, senza cambiare servizio né architettura (il browser chiama Web3Forms solo all'invio);
- **non tocca il caricamento della pagina**: hCaptcha arriva solo dopo un clic, quindi Lighthouse, il JS iniziale e la regola «nessuna terza parte al caricamento» (LEGAL.md §1) restano invariati.

Vincoli che restano non negoziabili:

- nessuna richiesta a terze parti al caricamento;
- nessun cookie banner (ADR-0003);
- CSP senza `'unsafe-inline'`;
- un canale di contatto sempre disponibile senza la verifica;
- WCAG 2.2 AA.

## Decisione

1. **hCaptcha solo nel form Contatti, su consenso esplicito.**
   - Il widget non è nell'HTML e non si carica all'apertura della pagina né della finestra Contatti.
   - Si carica solo dopo un clic esplicito su «Attiva la verifica».
   - Accanto al pulsante c'è una riga informativa: chi fornisce la verifica, che invia dati a terzi, link all'informativa `/privacy`.
   - Nessun banner sul sito: il consenso è il clic stesso, dato nel contesto del form.
2. **Verifica lato server.** hCaptcha si attiva anche nel pannello di Web3Forms, che rifiuta gli invii senza un token valido. Configurazione in DEPLOYMENT.md §6. La sitekey è pubblica e arriva da una variabile di build (DEPLOYMENT.md §5).
3. **Alternativa sempre visibile.** Email offuscata e GitHub restano visibili accanto al form, per chi non attiva la verifica, per chi non riesce a completarla e quando il servizio non risponde. È anche l'alternativa richiesta da WCAG 2.2, criterio 3.3.8 (ACCESSIBILITY.md §7).
4. **Restano le altre protezioni di ADR-0002**: honeypot, tempo minimo di compilazione, pausa tra gli invii (`contact.lastSubmitAt`), limiti di lunghezza, pulsante disabilitato durante l'invio, restrizione al dominio.
5. **CSP, da decidere in F3B con un ADR dedicato.** Vanno ammessi i domini di hCaptcha (`hcaptcha.com`, `*.hcaptcha.com`) in `script-src`, `frame-src`, `connect-src` e `style-src`, senza `'unsafe-inline'`. In una SPA vale la CSP della prima pagina caricata: chi entra da `/` e apre Contatti usa la CSP di `/`. Opzioni da confrontare in F3B:
   - gli stessi domini nella CSP di tutte le pagine (la richiesta parte comunque solo dopo il clic);
   - una navigazione completa verso `/contatti/` prima di attivare la verifica, con i domini solo nella CSP di quella pagina;
   - la verifica in un iframe dedicato, servito dal sito con una CSP propria.
6. **Informativa privacy** (LEGAL.md §3), da scrivere in F3B. Contenuti:
   - fornitore: Intuition Machines, Inc., da verificare in F3B;
   - dati trattati: indirizzo IP, dati del browser e del dispositivo, interazione con il widget;
   - cookie e storage che hCaptcha crea dopo il consenso;
   - trasferimento extra UE (USA) e relative garanzie;
   - base giuridica: consenso (art. 6.1.a GDPR; art. 122 del Codice privacy per l'accesso al dispositivo), che si nega semplicemente non attivando la verifica e scrivendo via email.
7. **Test e2e in F3B**:
   - nessuna richiesta verso `*.hcaptcha.com` prima del clic: la fixture «nessuna terza parte» resta attiva fino al consenso;
   - il form si invia solo con la verifica completata (hCaptcha simulato con `page.route`);
   - l'alternativa email è sempre presente, anche con la verifica rifiutata, in errore o non raggiungibile.

## Alternative considerate

| Alternativa                                      | Pro                                  | Contro                                                                                  | Perché scartata                                                            |
| ------------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Restare a ADR-0002 (solo protezioni lato client) | Nessuna terza parte, nessun consenso | Chiave pubblica: l'API si chiama direttamente aggirando le protezioni; quota esauribile | Il rischio è dichiarato in ADR-0002 e la protezione lato server costa poco |
| hCaptcha caricato all'apertura del form          | Nessun clic in più                   | Richiesta a terzi senza consenso; banner o violazione di LEGAL.md §1                    | Viola i vincoli                                                            |
| reCAPTCHA                                        | Diffuso                              | Google, profilazione, consenso più difficile da giustificare                            | hCaptcha è più rispettoso dei dati ed è supportato da Web3Forms            |
| Cloudflare Turnstile                             | Spesso senza sfida                   | Da verificare il supporto lato server di Web3Forms; stesso tema del consenso            | Web3Forms documenta l'integrazione con hCaptcha                            |
| Fornitore UE (piano B, punto 1)                  | Dati in UE                           | Cambia servizio; non risolve la chiave pubblica                                         | Si può rivalutare in F3B se la verifica di Web3Forms non va bene           |
| Backend proprio (piano B, punto 3)               | Rate limit per IP, chiave segreta    | Fuori perimetro (SPECS.md §9), da mantenere                                             | Troppo costoso per un portfolio                                            |

## Conseguenze

- Positive:
  - gli invii senza verifica vengono rifiutati da Web3Forms, non solo dal browser;
  - il caricamento della pagina non cambia: stessa CSP fino al clic, nessun banner, Lighthouse invariato;
  - il canale email resta per tutti.
- Negative e rischi:
  - una terza parte in più nel trattamento, da dichiarare nell'informativa;
  - la sfida di hCaptcha può essere un test cognitivo (WCAG 3.3.8): serve l'alternativa email e va verificata l'opzione accessibile di hCaptcha (cookie di accessibilità, sfida alternativa);
  - la CSP va estesa per i domini di hCaptcha (punto 5), con il vincolo della SPA;
  - dipendenza dall'integrazione hCaptcha di Web3Forms: sitekey propria o condivisa, piano necessario, da verificare in F3B.
- Cosa va verificato (test, metriche) e quando rivalutare:
  - e2e del punto 7 e fixture «nessuna terza parte» al caricamento, in F3B;
  - security-auditor: CSP, informativa, storage elencato;
  - rivalutare se Web3Forms cambia l'integrazione, se la verifica del DPA (ADR-0002) fallisce, o se hCaptcha cambia termini o dati trattati.

## Riferimenti

- ADR-0002 (form contatti, piano B), ADR-0003 (nessun cookie banner)
- SPECS.md §7 e §9, LEGAL.md §1–4, ACCESSIBILITY.md §7, PERFORMANCE_SEO.md §10, DEPLOYMENT.md §5–6, PLAN.md (3B)
- Documentazione di Web3Forms sull'integrazione con hCaptcha; documentazione di hCaptcha su CSP e accessibilità; WCAG 2.2, criterio 3.3.8 (Accessible Authentication, Minimum)
