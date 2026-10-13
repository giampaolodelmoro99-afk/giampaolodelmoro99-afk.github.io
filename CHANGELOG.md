# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/it/1.1.0/). Le voci sono in italiano.

Ogni fase si chiude con un tag `phase-NN` (che non fa partire il deploy). Le release pubblicate usano tag `vX.Y.Z` secondo [SemVer](https://semver.org/lang/it/) e fanno partire il deploy: la prima sarà `v1.0.0`.

## [Unreleased]

## [phase-00] - Fase 0: Foundation

### Aggiunto

- Progetto React 19 + React Router 8 (framework mode, `ssr: false` + prerender) + Vite 8 + TypeScript 6 strict.
- Route `/` e `/en/` prerenderizzate con metadati completi (title, description, canonical, hreflang, Open Graph, Twitter card) e JSON-LD con `Person`, `WebSite` e `ProfilePage`.
- Pagina 404 prerenderizzata, servita da `404.html` con status 404.
- Token CSS iniziali e desktop vuoto responsive da 320 px.
- Post-build: CSP via meta tag con hash degli script inline, idratazione rinviata a dopo il `load`, controllo delle route prerenderizzate.
- Test: Vitest + Testing Library + vitest-axe (coverage minima 80%), test sull'HTML prerenderizzato, Playwright su 5 viewport + touch + Firefox con axe e regressione visiva, size-limit, Lighthouse CI mobile e desktop con soglia 100.
- Qualità: Oxlint (type-aware), Stylelint, Prettier, Husky (pre-commit, commit-msg, pre-push), commitlint.
- CI su `main` e `phase/*`, deploy manuale o su tag, Dependabot.
- Documentazione in `docs/`, ADR 0000–0010, configurazione di Claude Code (skill, agenti, hook).

### Rimosso

- Il codice della v1 (MUI, JavaScript), consultabile solo dal tag `v1.0.0-legacy`.

[Unreleased]: https://github.com/giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io/compare/phase-00...HEAD
[phase-00]: https://github.com/giampaolodelmoro99-afk/giampaolodelmoro99-afk.github.io/compare/v1.0.0-legacy...phase-00
