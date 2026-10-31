# ADR-0013: Lighthouse a due livelli e preview compressa come GitHub Pages

- **Stato**: Sostituita in parte da [ADR-0018](0018-soglie-lighthouse-buone-di-google.md) (31/10/2026) per le soglie e il numero di esecuzioni; restano valide la preview compressa e i due livelli
- **Data**: 2026-10-18
- **Fase**: 1B

## Contesto

Fino alla Fase 1B Lighthouse CI chiedeva 100 in tutte le categorie a ogni commit, con 3 esecuzioni per URL. Controllava solo i punteggi, non LCP e FCP. I budget di PERFORMANCE_SEO.md (LCP ≤ 1,2 s, FCP ≤ 1,0 s su mobile) erano scritti ma nessun test li verificava.

Alla chiusura della 1B il punteggio era 100, ma l'LCP mobile era 1,35 s e l'FCP 1,05 s, uno "scatto" simulato di 150 ms oltre i budget. La causa era la misura, non il sito: `scripts/preview.mjs` serviva i file senza compressione, mentre GitHub Pages comprime con gzip. `global.css` non compresso era passato da 14 140 a 15 171 byte, oltre la finestra TCP iniziale (circa 14,6 kB): la simulazione di Lighthouse aggiungeva un viaggio di andata e ritorno. In produzione lo stesso file pesa 3,5 kB.

Il punteggio Performance di Lighthouse oscilla di qualche punto tra un'esecuzione e l'altra (scatti di 150 ms su mobile, circa 120 ms su desktop). Chiedere 100 a ogni commit ha spinto in passato a correggere il sito per stabilizzare la misura (vedi sotto), invece di misurare meglio.

## Decisione

1. **Preview come GitHub Pages**: `scripts/preview.mjs` comprime con gzip HTML, CSS, JS, JSON, XML, testo e SVG quando il client lo accetta (`scripts/lib/preview.mjs`, con test), e manda `Vary: Accept-Encoding`. Font, immagini e PDF passano invariati. Le misure locali e della CI corrispondono così alla produzione.
2. **Lighthouse a due livelli**, in `lighthouserc.{mobile,desktop}.json` e `lighthouserc.{mobile,desktop}.strict.json`:

   | Livello                                              | Quando                                                                                                    | Esecuzioni | Performance | Accessibility, Best Practices, SEO | LCP, FCP, TBT, CLS |
   | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------- | ----------- | ---------------------------------- | ------------------ |
   | Commit (`lhci:mobile`, `lhci:desktop`)               | ogni push e PR (`ci.yml`)                                                                                 | 3, mediana | ≥ 95        | 100                                | budget fissi       |
   | Severo (`lhci:mobile:strict`, `lhci:desktop:strict`) | chiusura di ogni fase (`close-phase`) e release (`deploy.yml` passa `strict-lighthouse: true` a `ci.yml`) | 5, mediana | **100**     | 100                                | gli stessi budget  |

   Insieme ai budget di peso di size-limit, già verificati a ogni commit.

3. **Budget delle metriche**, fissati sulle misure con compressione più uno scatto simulato:

   | Preset  | LCP       | FCP       | TBT     | CLS    |
   | ------- | --------- | --------- | ------- | ------ |
   | Mobile  | ≤ 1350 ms | ≤ 1050 ms | ≤ 50 ms | ≤ 0,01 |
   | Desktop | ≤ 500 ms  | ≤ 425 ms  | ≤ 50 ms | ≤ 0,01 |

   `scripts/lib/lighthouse.test.mjs` verifica che le quattro configurazioni rispettino questa regola e che i workflow usino il livello giusto.

### Misure del 18/10/2026 (preview compressa, 5 esecuzioni per URL, stessa macchina)

|                                | `main` (phase-01a)         | `phase/01b-components`     |
| ------------------------------ | -------------------------- | -------------------------- |
| Mobile, Performance            | 100 in 10 esecuzioni su 10 | 100 in 10 esecuzioni su 10 |
| Mobile, LCP mediana (massimo)  | 1,20 s (1,20)              | 1,20 s (1,35)              |
| Mobile, FCP mediana (massimo)  | 0,91 s (0,91)              | 0,91 s (0,98)              |
| Desktop, Performance           | 100 in 10 esecuzioni su 10 | 100 in 10 esecuzioni su 10 |
| Desktop, LCP mediana (massimo) | 0,32–0,37 s (0,41)         | 0,32 s (0,49)              |
| Desktop, FCP mediana (massimo) | 0,27–0,30 s (0,31)         | 0,27 s (0,34)              |

TBT 0 e CLS 0 ovunque. Con la compressione `main` e branch coincidono: il +150 ms della chiusura veniva dalla preview.

### Perché i budget superano 1,2 s e 1,0 s

I vecchi budget mobile (LCP 1,2 s, FCP 1,0 s) coincidevano con la mediana misurata, senza margine: un solo scatto simulato di 150 ms bastava a superarli. La mediana resta 1,20 s e 0,91 s; il margine di uno scatto (150 ms) assorbe l'oscillazione della simulazione, non un peggioramento del sito. Un peggioramento reale di uno scatto in più (oltre 1,35 s e 1,05 s di mediana) fa fallire la CI. Su desktop lo scatto osservato è di circa 120 ms (da 0,32 a 0,44 s).

## Correzioni fatte finora per l'oscillazione o per la preview non compressa

| Fase     | Correzione                                                                                                      | Motivo di allora                                                                                                   | Proposta per la F2A                                                                                                                                                                                                                                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F0       | **Idratazione rinviata a dopo `load`** (ADR-0006): via i `modulepreload`, bootstrap trasformato in `text/plain` | Performance mobile 93: la simulazione metteva i 112 kB di JS nel percorso critico, misurati **senza compressione** | **Da togliere se la misura lo consente.** Rimisurare la build standard con la preview compressa: se resta ≥ 95 con LCP e FCP nei budget, tornare al bootstrap di React Router. Toglie la dipendenza dal markup di React Router 8.4 e migliora la prima interazione (INP), che conta di più quando la home avrà icone e finestre |
| F1A      | **Font in preload: Pixel Operator bold più IBM Plex Sans regular** (ADR-0010)                                   | Tre varianti misurate: 1,35 s contro 1,2 s, cioè uno scatto, sulla preview non compressa                           | **Rimisurare** con la compressione le tre varianti. Se il solo Plex (elemento LCP) dà lo stesso LCP con CLS 0, togliere il preload di Pixel bold (6 kB)                                                                                                                                                                         |
| F0 e F1A | **Budget LCP 1,2 s e FCP 1,0 s**, senza margine                                                                 | Fissati sulla mediana misurata                                                                                     | Sostituiti da questo ADR                                                                                                                                                                                                                                                                                                        |

Non rientrano nell'elenco, perché hanno motivi di peso o di contenuto, non di oscillazione: il chunk `framework` (ADR-0012), i subset dei font, il fallback metrico (CLS reale).

## Alternative considerate

| Alternativa                                        | Pro                           | Contro                                                                                          | Perché scartata                                                         |
| -------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Performance 100 a ogni commit, come prima          | Massima severità              | Falsi rossi per l'oscillazione della simulazione; spinge a correggere la misura invece del sito | Il 100 resta obbligatorio dove conta (fase e release), con 5 esecuzioni |
| Preview senza compressione e budget rilassati      | Nessuna modifica alla preview | Misura diversa dalla produzione: si ottimizza per un server che non esiste                      | La preview deve imitare GitHub Pages (`docs/DEPLOYMENT.md`)             |
| Riportare `global.css` sotto 14,6 kB non compressi | Budget invariati              | Vincolo artificiale su un file che in produzione pesa 3,5 kB; cede al primo token nuovo         | Corregge il sintomo, non la misura                                      |
| Budget LCP e FCP sulla misura senza margine        | Più stretto                   | Uno scatto simulato fa fallire la CI senza un cambiamento reale                                 | Il margine di uno scatto è il minimo che separa rumore e regressione    |

## Conseguenze

- Positive:
  - le misure locali e della CI corrispondono alla produzione;
  - LCP, FCP, TBT e CLS sono verificati a ogni commit;
  - la CI di ogni commit non fallisce per l'oscillazione;
  - il 100 resta obbligatorio a chiusura di fase e release.
- Negative e rischi:
  - un calo da 100 a 95–99 di Performance passa la CI di un commit e si vede solo alla chiusura della fase. Mitigazione: le metriche hanno budget fissi a ogni commit, e i report restano negli artefatti della CI;
  - la chiusura di fase costa due esecuzioni in più per URL.
- Cosa va verificato e quando rivalutare:
  - in F2A, con il codice del desktop in un chunk separato, rimisurare e rivedere i budget (in giù se il margine resta ampio);
  - rimisurare le due correzioni dell'elenco;
  - ogni aumento dei budget richiede un nuovo ADR.

## Riferimenti

- `scripts/preview.mjs`, `scripts/lib/preview.mjs`, `lighthouserc.*.json`, `scripts/lib/lighthouse.test.mjs`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
- PERFORMANCE_SEO.md §1 e §2, TESTING.md §3, `.claude/skills/close-phase/SKILL.md`
- ADR-0006 (idratazione rinviata), ADR-0010 (font e preload), ADR-0012 (chunk `framework`)
- Retrospettiva della 1B, §4
