# ADR-0003: Nessun cookie banner, solo storage tecnico

- **Stato**: Accettata
- **Data**: 2026-10-13
- **Fase**: 0

## Contesto

Un cookie banner peggiora l'esperienza (soprattutto su mobile), può diventare l'elemento LCP e introduce CLS. La normativa (art. 122 del Codice privacy, che recepisce l'art. 5.3 della direttiva ePrivacy; linee guida del Garante del 10 giugno 2021) non richiede consenso né banner per gli strumenti **tecnici**, strettamente necessari a fornire un servizio richiesto dall'utente.

## Decisione

- Nessun cookie.
- Solo localStorage o sessionStorage **tecnico**, per preferenze e funzioni richieste dal visitatore. Nessun identificativo, profilazione, analytics o dato inviato a terzi.
- Chiavi ammesse (fonte di verità: LEGAL.md §2):

| Chiave                                           | Scopo                                                                |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| `locale`                                         | lingua preferita                                                     |
| `audio`                                          | suoni sì/no                                                          |
| `theme`                                          | tema, alto contrasto, dimensione testo, riduzione animazioni, sfondo |
| `windows`                                        | posizione e dimensione delle finestre                                |
| `boot.seen`                                      | boot già visto                                                       |
| `contact.lastSubmitAt`                           | pausa minima tra due invii del form (anti-abuso)                     |
| `react-router-scroll-positions` (sessionStorage) | ripristino dello scroll, gestito da React Router                     |

- La pagina /privacy elenca chiavi e scopi nella sezione "Cookie e storage".
- **Qualsiasi aggiunta** va inserita qui e in LEGAL.md prima del merge. Qualsiasi strumento non tecnico (analytics, embed, captcha) **viola questa decisione** e va segnalato: richiederebbe consenso e quindi un banner, cioè un nuovo ADR.
- Lo storage è sempre letto con try/catch: in navigazione privata o con storage bloccato il sito funziona con i valori predefiniti.

## Alternative considerate

| Alternativa                        | Perché scartata                                                     |
| ---------------------------------- | ------------------------------------------------------------------- |
| Analytics con consenso e banner    | Peggiora UX e metriche; non necessario per un portfolio             |
| Analytics "cookieless" self-hosted | Richiede un backend; valutazione legale non banale; fuori perimetro |

## Conseguenze

- Nessuna metrica di traffico, salvo quelle di Google Search Console (lato Google, nessun codice sul sito).
- Il security-auditor verifica che lo storage usato corrisponda all'elenco.

## Riferimenti

LEGAL.md §2, garanteprivacy.it (linee guida cookie e altri strumenti di tracciamento, 10/06/2021).
