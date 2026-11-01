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

| Chiave                 | Scopo                                                                |
| ---------------------- | -------------------------------------------------------------------- |
| `locale`               | lingua preferita                                                     |
| `audio`                | suoni sì/no                                                          |
| `theme`                | tema, alto contrasto, dimensione testo, riduzione animazioni, sfondo |
| `windows`              | posizione e dimensione delle finestre                                |
| `boot.seen`            | boot già visto                                                       |
| `contact.lastSubmitAt` | pausa minima tra due invii del form (anti-abuso)                     |

- Storybook (`/storybook/`, dalla Fase 1A) usa localStorage e sessionStorage per lo stato della propria interfaccia: storage tecnico di uno strumento di documentazione, creato solo visitando `/storybook/` (LEGAL.md §2).
- La pagina /privacy elenca chiavi e scopi nella sezione "Cookie e storage", compreso lo storage di Storybook.
- **Qualsiasi aggiunta** va inserita qui e in LEGAL.md prima del merge. Qualsiasi strumento non tecnico (analytics, embed, captcha) **viola questa decisione** e va segnalato: richiederebbe consenso e quindi un banner, cioè un nuovo ADR.
- **hCaptcha nel form Contatti** (ADR-0017, dalla Fase 3B): cookie e storage di hCaptcha non sono tecnici, ma arrivano solo dopo un consenso esplicito dato nel form (clic su «Attiva la verifica», con la riga informativa e il link alla privacy). Il consenso è contestuale e non serve per usare il sito, quindi il banner resta inutile e questa decisione non cambia.
- `react-router-scroll-positions` (sessionStorage) non si usa più dalla Fase 2B, perché il sito ha tolto `ScrollRestoration` (LEGAL.md §2).
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
