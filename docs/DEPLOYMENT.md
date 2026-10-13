# Deploy

## 1. Architettura

- Hosting: **GitHub Pages**, repo `giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io` (user site, servito dalla radice: niente `base` in Vite).
- Pubblicazione tramite GitHub Actions (`build_type: workflow`) con `actions/upload-pages-artifact` e `actions/deploy-pages`.
- Contenuto pubblicato: `build/client` (HTML prerenderizzato, asset, `404.html`).

## 2. Dominio

- `gianpaolodelmoro.it` è configurato in **Settings → Pages → Custom domain**, con HTTPS forzato e certificato anche per `www`.
- **Non esiste un file `CNAME`** e non va creato. Con il deploy via Actions il dominio vive nelle impostazioni del repo, e un CNAME in conflitto può far cadere il dominio.
- DNS (presso il registrar): record `A`/`AAAA` dell'apex verso gli IP di GitHub Pages, `CNAME` di `www` verso `giampaolodelmoro99-afk.github.io`. Non si toccano.

## 3. Workflow

| Workflow     | Trigger                                                    | Cosa fa                                                                                                                                                                       |
| ------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`     | push su `main` e `phase/**`, pull request, `workflow_call` | quality (format, lint, typecheck, unit con coverage, audit delle dipendenze di produzione), build, prerender + size, e2e nel container (2 shard), Lighthouse mobile e desktop |
| `deploy.yml` | **`workflow_dispatch`** oppure **tag `v*`**                | richiama `ci.yml`; se è tutto verde scarica l'artifact `build` e pubblica `build/client`                                                                                      |

- Permessi minimi: `contents: read` ovunque; `pages: write` e `id-token: write` solo nel job di pubblicazione.
- `concurrency: pages` evita pubblicazioni sovrapposte.
- I tag di fase sono `phase-NN` e **non** fanno partire il deploy. Solo i tag `v*` lo fanno.

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
