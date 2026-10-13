# CLAUDE.md

Portfolio v2 di Gianpaolo Del Moro (gianpaolodelmoro.it) in stile Windows 95: React 19, React Router 8 (framework mode, `ssr: false` + prerender), Vite, TypeScript strict, CSS Modules + token. Requisiti in `docs/SPECS.md`, stato e roadmap in `docs/PLAN.md`.

## Comandi

| Comando                                                 | Uso                                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `npm run dev`                                           | dev server: **non** prova CSP, prerender, deep link e 404                               |
| `npm run build && npm run preview`                      | verifica reale, come su GitHub Pages                                                    |
| `npm run lint` · `typecheck` · `test` · `test:coverage` | Oxlint + Stylelint · typegen + tsc · Vitest                                             |
| `npm run test:prerender`                                | HTML statico (dopo `build`)                                                             |
| `npm run test:e2e`                                      | Playwright completo nel container Docker (come la CI); `test:e2e:host` senza screenshot |
| `npm run size` · `lhci:mobile` · `lhci:desktop`         | budget e Lighthouse 100 (dopo `build`)                                                  |

## Lingue

- Codice in inglese: variabili, componenti, file, chiavi JSON e dei dizionari.
- Documentazione e commit in italiano (commit convenzionali: `feat: aggiunge la taskbar`).
- README in inglese e italiano. Testi del sito in IT ed EN (`src/i18n/`, `docs/I18N.md`).

## Regole di codice

- Stili solo in CSS Modules con le variabili dei token (`src/styles/tokens.css`), mai valori hardcoded. Stylelint lo verifica.
- Unici stili inline ammessi: variabili CSS con valori dinamici (es. `style={{ "--window-x": … }}`).
- Elementi interattivi su React Aria Components, stilizzati con `[data-pressed]`, `[data-focus-visible]`… Mai `div` o `span` cliccabili.
- Navigazione solo con React Router (`Link`, `useNavigate`). Mai `window.location` né ricaricamenti di pagina.
- Nessun commento nel codice React (`.tsx`). Le spiegazioni vanno in `docs/` o negli ADR.
- Route e slug solo in `src/routes/routeMap.ts`. Dominio e handle solo in `src/config/site.ts`.
- Testi solo nei dizionari `it`/`en`, mai stringhe visibili nei componenti.
- Ogni valore mostrato ha etichetta e unità.

## Definizione di "fatto"

Un componente o una feature è finito solo se:

1. è responsive da 320 px ai monitor larghi, con target touch ≥ 44 px in modalità touch
2. ha test (`docs/TESTING.md`), una story in Storybook (dalla Fase 1) e zero violazioni axe
3. ogni animazione rispetta `prefers-reduced-motion` e l'impostazione del Pannello di controllo
4. non abbassa Lighthouse sotto 100 (mobile e desktop) e non toglie contenuto dall'HTML prerenderizzato
5. **un lavoro visivo è verificato nel browser, anche su viewport mobile** (`docs/QA_CHECKLIST.md`, Claude in Chrome)

## Integrità dei test

- Mai `test.skip`, `.only`, `.todo`, test commentati o rimossi senza motivo.
- Mai abbassare soglie (coverage 80%, Lighthouse 100, size-limit) né aggiornare screenshot solo per far passare la CI.
- Eccezioni solo con un ADR.
- Una fase si chiude solo con tutti i test verdi in locale e nella CI del branch (`CONTRIBUTING.md`).

## Nome: N e M

- Sul sito il nome è **"Gianpaolo Del Moro"** (con N), come nel dominio e nel CV.
- GitHub ed email usano **"giampaolo"** (con M): `github.com/giampaolodelmoro99-afk`, `giampaolo.delmoro99@gmail.com`.
- La differenza è voluta: **non uniformarla mai** e non scrivere questi valori a memoria (usa `src/config/site.ts`).
- L'email non deve mai comparire in chiaro nell'HTML prerenderizzato, nel JSON-LD, in llms.txt o nella sitemap (`docs/LEGAL.md`).

## Asset e aspetti legali

- **Vietati gli asset Microsoft**: font (MS Sans Serif ecc.), icone, suoni, logo Windows, Clippy.
- Ogni nuovo asset (font, icona, suono, immagine) va registrato in `docs/ASSETS.md` con fonte, autore, versione e licenza.
- Rispettare sempre `docs/LEGAL.md`. Nessuna richiesta a terze parti al caricamento della pagina, solo storage tecnico elencato.

## v1

La v1 si consulta solo dal tag: `git ls-tree -r --name-only v1.0.0-legacy`, `git show v1.0.0-legacy:percorso`. **Mai ripristinare file della v1** nella cartella di lavoro. Lezioni in `docs/adr/0000-lezioni-dalla-v1.md`.

## Flusso di lavoro

- Ogni fase parte in plan mode. Il piano si salva in `docs/phases/`.
- Branch, merge, tag e push li fa solo il proprietario.
- I tag di fase sono `phase-NN`. I tag `v*` fanno partire il deploy.
- Skill in `.claude/skills/`: `win95-component`, `window-app`, `write-tests`, `update-visual-snapshots`, `i18n-strings`, `add-project`, `new-adr`, `close-phase`.
- Agenti di review in `.claude/agents/`: `code-reviewer`, `security-auditor`, `a11y-auditor`, `content-reviewer`.

## Trappole

- `dev` non applica CSP, prerender, `404.html` né l'idratazione rinviata: verifica sempre con `build` + `preview`.
- Nessun file `CNAME` e nessun `base` in Vite: il dominio vive in Settings → Pages (`docs/DEPLOYMENT.md`).
- Gli script inline sono ammessi solo perché il post-build ne calcola l'hash. Non aggiungere script o stili inline a mano (`docs/PERFORMANCE_SEO.md`).
- Gli screenshot si generano solo nel container (`npm run test:e2e:update-snapshots`): quelli generati sull'host differiscono.
- WebKit sull'host richiede `sudo npx playwright install-deps`. Nel container è già pronto.
