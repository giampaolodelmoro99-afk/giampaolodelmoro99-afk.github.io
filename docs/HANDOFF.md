# Stato del progetto (HANDOFF)

Aggiornato il 06/11/2026, alla chiusura della Fase 2B. Si aggiorna a ogni chiusura di fase (skill `close-phase`). Per i dettagli: [PLAN.md](PLAN.md), le retrospettive in `docs/phases/` e gli ADR in `docs/adr/`.

## Dove siamo

- **Fase corrente**: 2B (routing, persistenza e mobile) **chiusa nei commit**, in attesa che Gianpaolo faccia push, controlli la CI del branch `phase/02b-routing-mobile`, poi merge e tag `phase-02b`.
- **Fase successiva**: 3A (app di contenuto: About, Progetti, Skills, Timeline, CV; slug definitivi e mappatura degli URL della v1). Parte in plan mode, con il piano in `docs/phases/phase-03a-plan.md`.
- Tag fatti: `phase-00`, `phase-01a`, `phase-01b`, `phase-02a`.

## Cosa è fatto

- **Fondamenta** (0, 1A, 1B): React Router 8 con prerender, token GDM 95, 18 componenti su React Aria, Storybook, Lighthouse CI, CI su GitHub.
- **Window manager** (2A): guscio statico prerenderizzato e desktop interattivo in un chunk dopo l'idratazione; finestre, taskbar, Start, Esegui, Spegni, scorciatoie.
- **Routing e persistenza** (2B): l'URL è la finestra attiva (history con push e assestamento), layout salvato in `windows.v1`, cambio di lingua senza perdere le finestre.
- **Modalità mobile** (2B): home a griglia, app a schermo intero, «App aperte», Start a pannello; rotazione senza perdere lo stato.
- Numeri di chiusura: 657 test unitari, 985 e2e più 6 di prestazioni, Lighthouse 100 ovunque, JS iniziale 120,55 kB (budget 124), chunk del desktop 78,57 kB (budget 82).

## Decisioni da conoscere

- Il primo render dipende solo dall'URL (ADR-0005, ADR-0014): il layout salvato si legge prima dello swap (ADR-0021).
- Modalità mobile se larghezza < 768 px, oppure altezza < 540 px con puntatore grossolano; una sola fonte in `src/features/desktop/layoutMode.ts` (ADR-0007).
- Sulla home About c'è sempre; Indietro non chiude mai una finestra (ADR-0021).
- Il budget del chunk del desktop è 82 kB (ADR-0022); si rivaluta alla 3A.
- Test: i `@desktop` non si duplicano per il mobile, bastano i `@mobile` (ADR-0019); test instabili al massimo 50 ripetizioni (ADR-0023).
- Regole fisse in CLAUDE.md: nessun commento nei `.tsx`, testi solo nei dizionari, nome «Gianpaolo» con N sul sito e «giampaolo» con M solo in GitHub ed email, nessun asset Microsoft.
- Branch, merge, tag e push li fa solo il proprietario. Mai tag `v*` prima del rilascio.

## Prossimi passi

1. Gianpaolo: push del branch, CI verde senza instabili, merge `--no-ff` e tag `phase-02b`.
2. Fase 3A: piano in plan mode; approvare le bozze di testo (CONTENT.md §5, compresi quelli di «App aperte»); «Indietro» nella barra mobile con le sottopagine dei progetti; rimisurare il budget del chunk del desktop.
3. Fase 3B (poi): form Contatti con hCaptcha su consenso, informativa, disclaimer Microsoft prima di qualunque tag `v*`.

## Problemi aperti

- **QA a mano non fatta**: Android reale con `preview --host` (QA_CHECKLIST §3.1 e §7). NVDA, VoiceOver, tastiera Bluetooth, testo al 200% e notch in orizzontale sono rinviati alla Fase 5 (audit di accessibilità).
- **Testi del desktop in bozza** (CONTENT.md §5), tranne il congedo: si approvano alla 3A.
- **Margine del chunk del desktop**: 3,4 kB su 82 kB; le app della 3A vanno in chunk loro.
- **Suggerimenti non applicati** dalle review della 2B (retrospettiva §3): altezza dell'overlay di «App aperte» su iPhone con home indicator, `line-clamp` delle etichette con testo ingrandito, feedback di pressione sulle icone al tocco.
- **Casi instabili annotati** (retrospettiva §3): un clic su «Ingrandisci» perso una volta su circa 2800; un test di contrasto fallito una volta su 100; un doppio clic perso subito dopo il caricamento in Chrome. Nessuno riproducibile.
- **Dipendenze**: 20 vulnerabilità solo di sviluppo, accettate (ADR-0011); `npm audit --omit=dev` a 0. Lo stub di React Router (`scripts/lib/route-discovery-stub.mjs`) va riverificato a ogni aggiornamento minore.
- **README**: lo stato in testa dice ancora «Fase 0 – Foundation» (IT ed EN); da aggiornare, non fatto in 2B.
- **Lint**: 11 warning `no-await-in-loop` negli e2e (sequenze volute).

## Dove guardare

| Cosa                | Dove                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| Requisiti e roadmap | `docs/SPECS.md`, `docs/PLAN.md`                                             |
| Architettura        | `docs/ARCHITECTURE.md` (§4 window manager, §5 URL e persistenza, §6 mobile) |
| Test e soglie       | `docs/TESTING.md`, `docs/PERFORMANCE_SEO.md`                                |
| Accessibilità e QA  | `docs/ACCESSIBILITY.md`, `docs/QA_CHECKLIST.md`                             |
| Legale e storage    | `docs/LEGAL.md` (§2: chiavi ammesse)                                        |
| Comandi e flusso    | `CLAUDE.md`                                                                 |
