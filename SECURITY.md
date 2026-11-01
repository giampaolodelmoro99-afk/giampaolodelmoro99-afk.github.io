# Sicurezza

## Versioni supportate

È supportata solo la versione pubblicata su [gianpaolodelmoro.it](https://gianpaolodelmoro.it), cioè l'ultimo tag `v*` di `main`. La v1 (`v1.0.0-legacy`) non riceve correzioni.

## Come segnalare una vulnerabilità

Scrivi a **giampaolo.delmoro99@gmail.com** con oggetto `[security] gianpaolodelmoro.it`. Non aprire issue pubbliche per le vulnerabilità. Indica:

- cosa hai trovato e dove (URL, file, commit)
- come riprodurlo
- l'impatto che ti aspetti

## Tempi di risposta

- Conferma di ricezione: entro 7 giorni.
- Valutazione e piano di correzione: entro 30 giorni.
- Riconoscimento pubblico nel CHANGELOG, se lo desideri.

## Perimetro

- Sito statico su GitHub Pages: nessun backend, nessun database, nessun account utente.
- Unica richiesta verso terze parti: l'invio del form contatti a Web3Forms (dalla Fase 3).
- Fuori perimetro: infrastruttura di GitHub e di Web3Forms, attacchi DoS, ingegneria sociale.

## Misure in atto

- Content Security Policy via meta tag con hash degli script inline, senza `unsafe-inline` (vedi `docs/PERFORMANCE_SEO.md` e ADR-0006).
- Nessuna risorsa da CDN o terze parti al caricamento della pagina, verificato dai test e2e.
- Dependabot mensile (una PR per ecosistema, aggiornamenti di sicurezza immediati) e `npm audit --omit=dev` in CI.
- Permessi minimi nei workflow GitHub Actions.

Debolezze note e accettate sono elencate nelle retrospettive di fase (`docs/phases/`).
