# ADR-0021: URL, history e persistenza del desktop

- **Stato**: Proposta
- **Data**: 2026-11-01
- **Fase**: 2B

## Contesto

Fino alla 2A l'URL non seguiva le finestre. Aprire un'app non cambiava indirizzo, i link di About erano intercettati e cambiare lingua rimontava il desktop da zero. ADR-0005 e ARCHITECTURE §5 chiedevano l'URL come fonte di verità della finestra attiva, il primo render dipendente solo dall'URL e la persistenza del layout senza CLS.

Vincoli:

- prerender identico e CSP invariata (ADR-0006, ADR-0012, ADR-0015);
- prima dell'idratazione tutto funziona come link (ADR-0014);
- Lighthouse e CLS nelle soglie di ADR-0018;
- WCAG 2.2 AA, con focus prevedibile e nessuna trappola nella history;
- solo storage tecnico elencato (LEGAL.md §2, ADR-0003);
- JS iniziale ≤ 124 kB.

Le scelte del proprietario sono nel piano della fase (`docs/phases/phase-02b-plan.md` §8, D2, D4, D5).

## Decisione

### 1. Route di layout

Le 28 pagine sono figlie di `routes/desktop-layout.tsx`, che monta il desktop una volta sola. Le figlie (`routes/app.tsx`) danno solo i meta. Lo store sopravvive a ogni navigazione, cambio di lingua compreso. L'HTML prerenderizzato è rimasto identico: confrontate le 30 pagine, a parte i `modulepreload`.

### 2. URL della finestra attiva

- L'URL è quello della finestra attiva; con nessuna finestra attiva è la home della lingua.
- Non si naviga se la route corrente rappresenta già la finestra attiva: su `/` con About in primo piano l'URL resta `/`.
- Title, description, canonical, hreflang e JSON-LD seguono la route con il `<Meta/>` di React Router.
- L'`h1` è nella finestra della route, mentre le altre finestre partono da `h2`. Resta un solo `h1` per pagina (ADR-0016 §2).

### 3. History (`src/features/desktop/app/useUrlSync.ts`)

- **Push**: aprire o portare in primo piano una finestra (icone, Start, Esegui, taskbar, selettore, clic su una finestra, link nei contenuti). La voce porta in `state.back` il percorso di partenza.
- **Assestamento**: chiudere, ridurre, Riavvia, Riaccendi. Se la voce precedente, creata dal sito, rappresenta già la nuova finestra attiva (`/` rappresenta About), si torna indietro con `navigate(-1)`; altrimenti si sostituisce la voce corrente. Così non nascono voci doppie e Indietro non sembra mai «non fare nulla».
- **Nessuna navigazione** per Sposta, Ridimensiona, Ingrandisci e il ripristino del layout.
- **Indietro e Avanti** (e i link): la finestra della voce va in primo piano, riaperta se era chiusa, senza chiudere le altre (D2).
  - Su `/` va in primo piano About se è aperta; altrimenti nessuna finestra è attiva e le finestre restano al loro posto.
  - Il focus va al corpo della finestra o alle icone; una finestra riaperta si annuncia.
  - Le navigazioni partite dal sito non si riapplicano.

### 4. Persistenza (`src/stores/desktop/persist.ts`)

- **Chiave e contenuto**: `windows.v1` in localStorage, con finestre aperte, geometria, ingrandite, ridotte, `stack` e `recent`.
- **Lettura**: avviene nell'inizializzatore dello store del desktop interattivo, che nasce sul client e nascosto, prima dello swap. Il desktop compare già ripristinato, in un solo commit.
- **Validazione**: valori non validi o di un'altra versione si ignorano e si cancellano. Gli errori di storage si ignorano.
- **Regole del ripristino** (`restore` in `state.ts`):
  - la finestra dell'URL è in primo piano e nella posizione del prerender;
  - le altre tornano dietro senza animazione (D5);
  - sulla home About c'è sempre, anche se era stata chiusa (D4).
- **Spegni e riavvio**: Riaccendi, dopo Spegni, ripristina il layout salvato; Riavvia salva un desktop vuoto.
- **Scrittura**: raggruppata dopo 200 ms dall'ultimo cambio e al `pagehide`, solo se il contenuto serializzato cambia.

### 5. React Router 8.5.1 nel budget

- `<ScrollRestoration/>` è stata tolta: il documento non scorre, e con lei sparisce la chiave sessionStorage `react-router-scroll-positions`.
- Nella build del client il runtime di `future.unstable_customRouteDiscovery` diventa uno stub (`scripts/lib/route-discovery-stub.mjs`): il sito non usa il flag, e lo stub fallisce in modo esplicito se lo si attiva.
- Lo store resta fuori dal JS iniziale: il guscio importa solo `stores/desktop/home.ts`.
- Numeri in PERFORMANCE_SEO.md §1.

## Alternative considerate

| Alternativa                                             | Pro                                   | Contro                                                            | Perché scartata                             |
| ------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------- |
| Indietro chiude la finestra aperta dalla voce (R2)      | Vicino a «annulla»                    | Chiudere perde stato e scorrimento; Avanti dovrebbe riaprire      | Scelta del proprietario (D2)                |
| Sempre replace, history piatta                          | Nessuna voce in più                   | Indietro esce dal sito invece di tornare alla finestra precedente | Contro l'aspettativa del browser            |
| Assestamento sempre con replace                         | Più semplice                          | Voci doppie (`/`, `/profilo/`): Indietro senza effetto visibile   | Trappola percepita nella history            |
| Persistenza con il middleware `persist` di Zustand      | Pronto                                | ~1 kB in più; reidratazione asincrona dopo il primo render        | Serve leggere prima dello swap              |
| Ripristinare anche la geometria della finestra dell'URL | Layout identico                       | Lo swap sposterebbe la finestra: salto visibile e rischio CLS     | Il primo disegno resta quello del prerender |
| Ricordare la chiusura di About sulla home               | Rispetta l'ultima scelta              | About sparirebbe dopo lo swap (lampo, soprattutto in mobile)      | D4                                          |
| Restare su React Router 8.4.0                           | Nessun lavoro                         | Aggiornamenti futuri bloccati                                     | Il budget si rispetta con i due interventi  |
| Minificazione con terser                                | Nessun codice di React Router toccato | Dipendenza in più                                                 | Non è servita (D6)                          |

## Conseguenze

- **Positive**:
  - ogni finestra ha un URL condivisibile e i metadati giusti;
  - Indietro e Avanti funzionano come in un sito normale;
  - il layout sopravvive alla ricarica senza CLS;
  - cambiare lingua non perde nulla;
  - il JS iniziale scende a 120,06 kB con React Router 8.5.1.
- **Negative e rischi**:
  - cliccare su finestre diverse crea molte voci nella history;
  - lo stub dipende dalla struttura interna di React Router: la build si ferma se gli export del modulo cambiano, e lo stub va rivisto a ogni aggiornamento minore;
  - lo store nel chunk del desktop lascia 1,25 kB di margine sul budget di 77 kB per la 2B-2.
- **Cosa va verificato**:
  - test unitari: `url.test.ts`, `useUrlSync.test.tsx`, `state.test.ts`, `persist.test.ts`, `DesktopApp.test.tsx`;
  - e2e: `history.spec.ts`, `persistence.spec.ts`, `storage.spec.ts`, `window-drag.spec.ts`;
  - `route-discovery-stub.test.mjs` a ogni aggiornamento di React Router;
  - rivalutare con la modalità mobile (2B-2) e con le sottopagine dei progetti (F3A, «Indietro» nella barra mobile).

## Riferimenti

- ADR-0003, ADR-0005, ADR-0006, ADR-0014, ADR-0016, ADR-0018
- ARCHITECTURE.md §5, LEGAL.md §2, PERFORMANCE_SEO.md §1
- `docs/phases/phase-02b-plan.md`
- `src/app/routes.ts`, `src/features/desktop/url.ts`, `src/features/desktop/app/useUrlSync.ts`, `src/stores/desktop/persist.ts`, `scripts/lib/route-discovery-stub.mjs`
