# Deploy

## 1. Architettura

- Hosting: **GitHub Pages**, repo `giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io` (user site, servito dalla radice: niente `base` in Vite).
- Pubblicazione tramite GitHub Actions (`build_type: workflow`) con `actions/upload-pages-artifact` e `actions/deploy-pages`.
- Contenuto pubblicato: `build/client` (HTML prerenderizzato, asset, `404.html`, `robots.txt` e Storybook in `/storybook/`).

## 2. Dominio

- `gianpaolodelmoro.it` è configurato in **Settings → Pages → Custom domain**, con HTTPS forzato e certificato anche per `www`.
- **Non esiste un file `CNAME`** e non va creato. Con il deploy via Actions il dominio vive nelle impostazioni del repo, e un CNAME in conflitto può far cadere il dominio.
- DNS (presso il registrar): record `A`/`AAAA` dell'apex verso gli IP di GitHub Pages, `CNAME` di `www` verso `giampaolodelmoro99-afk.github.io`. Non si toccano.

## 3. Workflow

| Workflow     | Trigger                                                                                      | Cosa fa                                                                                                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ci.yml`     | push su `main` e `phase/**`, pull request, `workflow_call`                                   | quality (format, lint, typecheck, unit con coverage, audit delle dipendenze di produzione), build del sito e di Storybook, prerender + size, e2e nel container (2 shard, compresi i progetti `storybook` e `performance`), Lighthouse mobile e desktop |
| `deploy.yml` | **`workflow_dispatch`** oppure **tag `vMAJOR.MINOR.PATCH`** (filtro `v[0-9]+.[0-9]+.[0-9]+`) | job `tag` che ricontrolla il nome del tag, poi richiama `ci.yml`; se è tutto verde scarica l'artifact `build` e pubblica `build/client`                                                                                                                |

- Permessi minimi: `contents: read` ovunque; `pages: write` e `id-token: write` solo nel job di pubblicazione.
- `concurrency: pages` evita pubblicazioni sovrapposte.
- **Solo i tag di versione `vMAJOR.MINOR.PATCH`** (es. `v1.0.0`, `v1.2.3`) fanno partire il deploy. Non lo fanno:
  - i tag di fase `phase-NN` (e `phase-01a`, `phase-01b`)
  - i tag con suffisso, come `v1.0.0-legacy` (la v1) o `v1.0.0-rc1`
- Doppio controllo: il filtro `tags` di GitHub confronta il nome intero; il job `tag` ripete il controllo con la regex `^v[0-9]+\.[0-9]+\.[0-9]+$` e ferma il workflow prima della CI. `workflow_dispatch` resta libero per il rollback (§8).
- Il test `scripts/lib/workflows.test.mjs` verifica entrambe le regole su tag validi e non validi.

### Runner

Tutti i job usano **`runs-on: ubuntu-24.04`**, mai `ubuntu-latest`: GitHub sposta `ubuntu-latest` su Ubuntu 26.04 dal 19/10/2026, e un cambio di sistema non deve arrivare senza preavviso. 24.04 (Noble) è anche la base dell'immagine Playwright `-noble` usata dagli e2e. Il test `scripts/lib/workflows.test.mjs` fallisce se un workflow usa `ubuntu-latest` o un runner senza versione.

**Aggiornare il runner** (per esempio a `ubuntu-26.04`):

1. Branch dedicato (`chore/runner-ubuntu-26.04`), creato dal proprietario.
2. Sostituire `ubuntu-24.04` in `ci.yml` e `deploy.yml`.
3. Se esiste, passare anche all'immagine Playwright basata sulla nuova Ubuntu (tag `-<nome in codice>`) in `ci.yml` e negli script `test:e2e*`, poi rigenerare gli screenshot nel container (skill `update-visual-snapshots`).
4. CI completa verde prima del merge; alla release la CI usa Lighthouse severo (Performance 100, mediana di 5, ADR-0013).
5. Farlo prima del ritiro di 24.04 annunciato da GitHub (controllare il changelog di GitHub Actions e `actions/runner-images`).

## 4. Prima pubblicazione della v2 e transizione

- Fino alla release resta online l'ultima pubblicazione della v1: GitHub Pages serve l'ultimo deploy finché non ne arriva uno nuovo.
- In Fase 7:
  1. verifica locale completa (`close-phase`)
  2. tag `v1.0.0` su `main` (lo esegue il proprietario), che fa partire `deploy.yml`
  3. verifiche dopo il deploy (§7) e della mappatura degli URL della v1 (SPECS §6)
  4. Google Search Console: invio della sitemap e controllo della copertura

## 5. Variabili di build

| Variabile                   | Dove                                                       | Uso                                                                                                                                 | Dalla fase |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `VITE_WEB3FORMS_ACCESS_KEY` | Settings → Secrets and variables → Actions → **Variables** | access key pubblica di Web3Forms, letta in build. Non è un segreto ma non sta nel codice. La build di produzione fallisce se manca. | 3B         |
| `GITHUB_TOKEN`              | automatico                                                 | script di build dei metadati dei progetti (limite di richieste più alto)                                                            | 3A         |

## 6. Configurazione manuale di Web3Forms (Fase 3B)

1. Creare l'access key su web3forms.com con l'email di destinazione `giampaolo.delmoro99@gmail.com`.
2. Nel pannello, attivare la **restrizione al dominio** `gianpaolodelmoro.it`. Gli invii da altre origini vengono rifiutati.
3. Non attivare autorisposte al mittente.
4. Salvare la chiave come variabile del repo (§5).
5. Annotare qui la data di configurazione e le impostazioni scelte.

## 7. Verifiche dopo il deploy

```bash
curl -I https://gianpaolodelmoro.it/            # 200
curl -I https://gianpaolodelmoro.it/en          # 301 → /en/
curl -I https://gianpaolodelmoro.it/en/         # 200
curl -I https://gianpaolodelmoro.it/inesistente # 404 (pagina 404 servita)
```

Poi nel browser (QA_CHECKLIST.md):

- console senza errori né violazioni CSP
- nessuna richiesta a terze parti
- deep link e cambio lingua funzionanti
- HTTPS valido anche su `www`

## 8. Rollback

- **Rapido**: Actions → "Deploy su GitHub Pages" → _Run workflow_ scegliendo come ref il tag precedente (es. `v1.0.0`). Viene ricostruito e ripubblicato quel commit.
- **Emergenza (v1)**: lanciare il workflow sul ref `v1.0.0-legacy` non funziona, perché la v1 usa un workflow diverso. Serve un branch temporaneo dal tag con il vecchio `deploy.yml`, da creare a mano dal proprietario.

## 9. Limiti di GitHub Pages

- Nessun header HTTP custom: CSP solo via meta tag. Senza `frame-ancestors`, `report-to`, HSTS personalizzato, `X-Frame-Options` e `Referrer-Policy` come header.
- Redirect 301 automatico sulla slash finale delle cartelle.
- Nessun redirect configurabile: i reindirizzamenti della v1 sono pagine statiche con canonical e `meta refresh`.
- Cache gestita da GitHub (circa 10 minuti). Dopo il deploy le verifiche possono richiedere qualche minuto.
