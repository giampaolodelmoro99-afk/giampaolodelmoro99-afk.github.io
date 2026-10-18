# Retrospettiva Fase 1B: componenti del design system GDM 95

- **Branch**: `phase/01b-components`
- **Periodo**: 2026-10-14 → 2026-10-18
- **Piano**: [phase-01-plan.md](phase-01-plan.md), appendice B (scostamenti in B.7)
- **Ultima CI del branch**: **da verificare dopo il push** (il branch non è ancora stato pushato). È il cancello finale per il merge (`close-phase` §6).

## 1. Obiettivi e risultato

| Obiettivo del piano                                | Stato    | Note                                                                                                              |
| -------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| CSP del sito e stile di React Aria                 | fatto    | sentinella sul link di `global.css`, CSP invariata (ADR-0012); test di deriva, prerender ed e2e anche in negativo |
| 404 con il `Link` di React Aria                    | fatto    | screenshot invariati, funziona senza JavaScript, focus anche prima dell'idratazione                               |
| Icone di Campo minato                              | fatto    | nuove icone dal pacchetto di aggiornamento, ASSETS.md e screenshot                                                |
| Peso dei componenti con size-limit                 | fatto    | incremento per componente, gruppo F2A, budget fissati: JS ≤ 99 kB, CSS ≤ 5 kB, guscio F2A ≤ 75 kB                 |
| 18 componenti su React Aria Components             | fatto    | test, story, screenshot nel container, axe e target nelle 4 combinazioni tema × input                             |
| Disabilitato in alto contrasto con secondo segnale | fatto    | bordo punteggiato di 1 px, distinto dal focus tratteggiato                                                        |
| QA_CHECKLIST per i componenti su Android           | fatto    | §7.1; **la QA sul telefono la fa Gianpaolo**                                                                      |
| QA con Claude in Chrome                            | parziale | estensione non connessa: QA fatta con Playwright (sotto)                                                          |

## 2. Cosa è andato bene

- **La sentinella**: React Aria controlla già se l'elemento `react-aria-pressable-style` esiste. Mettere quell'id sul foglio globale ha lasciato la CSP identica, con un test che si accorge se React Aria cambia.
- **Fermarsi sul peso ha pagato**: Button, Tabs e Select hanno superato i 10 kB. L'analisi del metafile ha separato tre basi una tantum di React Aria (base 13,0 kB, collezioni 17,5 kB, overlay ≈ 8,9 kB) dalla parte specifica dei componenti, sempre sotto la soglia. Le decisioni sono state prese con i numeri.
- **Le basi si riusano davvero**: dopo il Select, MenuBar (+6,1 kB), Window (+0,9), Taskbar (+0,8), StartButton (+0,5), DesktopIcon (+6,0) e AlertDialog (+1,6) sono rimasti piccoli.
- **Le misure hanno trovato problemi veri**: il chunk `framework` ha evitato +1,8 kB nella home, e il confronto con il bundle ha scoperto i testi dei componenti finiti nel JS iniziale (+0,2 kB, corretto).
- **I controlli in negativo** (sentinella tolta, riga stretta del DesktopIcon) dimostrano che i test non passano a vuoto.
- **Le quattro review hanno trovato cose diverse**, come in 1A (§3).

## 3. Cosa non è andato bene, e come è stato corretto

- **Documento troncato da uno script.** Nel commit 4aab190 uno script Python ha inserito una sottosezione in PERFORMANCE_SEO.md senza riattaccare il resto: si erano perse le sezioni da 2 a 13. L'hanno trovato il content-reviewer e il code-reviewer; ripristinate in 01c0608.
- **Hover sintetici annullati** in modo intermittente: il mouse reale di Playwright, fermo in (0, 0), generava un `pointerover` reale quando spariva l'overlay di Storybook. Aiuti in `.storybook/interactions.ts` che aspettano un layout stabile.
- **Cache dei moduli di Vitest 5**: `import.meta.glob` nell'inventario degli stili non vedeva le story nuove, e l'inventario ne controllava 32 su 70. Ora cerca i file sul disco. Nel correggerlo ho committato un test rosso (c013451), rimediato subito (44cb78d): da allora eseguo il test prima di ogni commit.
- **Controllo dei target touch da adattare a React Aria**: input nascosti in uno span `VisuallyHidden`, `HiddenSelect` con l'etichetta nascosta, celle `display: contents`. La prima versione era troppo permissiva (qualunque `clip-path`) e non misurava le righe della griglia: corretto dopo il code-reviewer e verificato in negativo.
- **Un commit ha lasciato fuori `tokens.css`** (Tooltip, `--opacity-hidden`): corretto subito con 4a81239. Da allora metto in stage tutta la cartella `src`.
- **"Home invariata a 110,81 kB" nei messaggi dei commit dei componenti non era sempre vero.** A fine fase la home misurava 111,01 kB, perché i testi dei componenti erano finiti nei dizionari globali (dal ProgressBar in poi). Non ho ricontrollato commit per commit quando il numero è cambiato. Corretto in c97ce15; la lezione è misurare dopo una build completa e confrontare con il valore di partenza, non riportarlo a memoria.
- **`optimize-locales` in esbuild** non caricava le traduzioni escluse (bug con unplugin): loader aggiunto solo nella misura, plugin sempre attivo.
- **Claude in Chrome** non connesso alla chiusura: QA con Playwright.

## 4. Metriche

| Metrica                                      | Valore                                                      | Fase 1A                       |
| -------------------------------------------- | ----------------------------------------------------------- | ----------------------------- |
| Test unitari (numero)                        | 311 in 40 file                                              | 136 in 17 file                |
| Coverage statement / rami / funzioni / righe | 98,63% / 91,4% / 98,63% / 99,05%                            | 98,51 / 88,18 / 98,86 / 99,13 |
| Test prerender (numero)                      | 40                                                          | 24                            |
| Test e2e (numero, progetti)                  | 709 su 10 progetti                                          | 196                           |
| Screenshot di riferimento                    | 247 (15 pagine + 232 story)                                 | 39                            |
| Lighthouse mobile `/` e `/en/`               | 100 / 100 / 100 / 100; LCP 1,35 s, FCP 1,05 s, CLS 0, TBT 0 | 100; LCP 1,2 s                |
| Lighthouse desktop `/` e `/en/`              | 100 / 100 / 100 / 100; LCP 0,33 s                           | 100                           |
| JS iniziale della home gzip                  | 110,81 kB (budget 115)                                      | 112,27 kB                     |
| CSS iniziale della home gzip                 | 3,96 kB (budget 12)                                         | 3,6 kB                        |
| Componenti JS / CSS gzip                     | 98,13 / 4,63 kB (budget 99 / 5)                             | –                             |
| Guscio del desktop F2A gzip                  | 74,92 kB (budget 75)                                        | –                             |
| Violazioni axe                               | 0 (story, temi, mouse e touch; pagine)                      | 0                             |
| `npm audit --omit=dev`                       | 0 vulnerabilità                                             | 0                             |

**LCP mobile**: 1,35 s contro 1,20 s su `main` misurato nelle stesse condizioni (FCP 1,05 contro 0,90). Lighthouse resta 100, ma i budget documentati di LCP (1,2 s) e FCP (1,0 s), che Lighthouse CI non verifica, sono superati di un passo simulato di 150 ms. L'ipotesi più probabile: `global.css` non compresso è passato da 14 140 a 15 171 byte, oltre la finestra TCP iniziale (circa 14,6 kB). La preview locale non comprime, GitHub Pages sì (3,5 kB gzip). Una prova con i token di `main` dà valori misti (1,2 s su `/`, 1,35 su `/en/`). **Decisione aperta (§9).**

## 5. QA manuale

- 2026-10-18, Playwright su `npm run preview` (Claude in Chrome non connesso):
  - 404 e otto story (Window, MenuBar, Select, Taskbar, DesktopIcon, AlertDialog, Tabs, StartButton) a 320×640, 375×667, 667×375 e 1440×900, tema classico e alto contrasto;
  - nessun overflow orizzontale, nessuna richiesta esterna;
  - console pulita salvo il 404 atteso del documento.
- Da segnalare:
  - a 320 px la taskbar con quattro finestre riduce i titoli all'iniziale;
  - in alto contrasto i titoli delle finestre si troncano molto;
  - con il telefono in orizzontale il menu Start copre quasi tutto il pulsante.
- Screenshot di tutte le story rivisti a mano, nei due temi, con mouse e touch.
- **Da fare (Gianpaolo)**: QA_CHECKLIST §7 e §7.1 su Android reale; NVDA e VoiceOver; zoom reale al 200/400%; `forced-colors` (elenco dell'a11y-auditor in PLAN.md, F2A).

## 6. Decisioni e ADR

- **ADR-0012** (nuovo): stile di React Aria e CSP del sito. Sentinella, inventario dei tre tipi di intervento (`<style>`, CSSOM, prop `style`), chunk `framework`, eccezioni Oxlint di `AriaRouterProvider`.
- Decisioni del 14/10/2026:
  - disabilitato in alto contrasto con bordo punteggiato di 1 px;
  - tooltip solo con hover e focus, mai unico portatore di contenuto;
  - `gdm95-updates/` committata come riferimento;
  - basi di React Aria accettate come costi una tantum (base, collezioni, overlay), con la soglia di 10 kB per la parte specifica.
- **Requisito della F2A**: il codice del desktop arriva in un chunk separato dopo il primo disegno (home 110,8 + guscio 75 ≈ 186 kB contro 115).
- ADR-0011 aggiornata con la verifica della 1B.

## 7. Debito tecnico e rischi aperti

- **Tipo C dell'ADR-0012** in F2A: attributi `style` nel prerender (Glyph, ProgressBar, `VisuallyHidden`, `display:contents`) da risolvere prima che i componenti entrino nella home.
- **`I18nProvider` nel root** in F2A, altrimenti React Aria usa la lingua del browser.
- **Indice `src/components/index.ts`**: +0,6 kB per chi importa anche solo Icon (`sideEffects` o import dalle cartelle).
- **Sentinella su un id interno di React Aria**: protetta dal test di deriva.
- **Note dell'a11y-auditor rimandate alla F2A** (PLAN.md): livello del titolo della Window, corpo documento scorrevole in Safari, taskbar attiva in alto contrasto, Radio in `forced-colors`, testi troncati, focus nei dialog distruttivi.
- **Link dentro le frasi** e target di 44 px: esenti per WCAG 2.5.8 ma non per la nostra regola; da decidere in F3 con un ADR, quando arrivano i testi lunghi.
- Test Storybook intermittenti all'avvio a freddo, visti una volta dall'a11y-auditor (Button "Focus accanto a disabilitato", Checkbox "Default"): da tenere d'occhio in CI.
- Restano dalla 1A: segnale non cromatico della finestra attiva, deploy manuale da qualsiasi ref, trasformazione del bootstrap legata a React Router 8.4.

## 8. Lezioni per AI_WORKFLOW.md

Riportate in AI_WORKFLOW.md §5 (Fase 1B).

## 9. Azioni per la fase successiva

1. Push del branch e verifica della CI su GitHub (primo run con i 247 screenshot e il progetto storybook senza `--hide-scrollbars`).
2. **Decidere sull'LCP mobile (§4)**: preview con compressione come GitHub Pages, oppure `global.css` sotto i 14,6 kB, oppure budget LCP e FCP aggiornati con un ADR.
3. QA su Android reale (QA_CHECKLIST §7 e §7.1).
4. Merge `--no-ff` e tag `phase-01b`, poi piano della F2A in plan mode, a partire dal caricamento separato del desktop e dal tipo C.
