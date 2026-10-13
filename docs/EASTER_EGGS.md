# Easter egg

## Regole

- **Accessibili**: attivabili anche da tastiera o touch, non solo con gesti nascosti del mouse; annunciati agli screen reader se cambiano qualcosa.
- **Innocui**: nessun impatto su Lighthouse (codice in lazy loading), sull'HTML prerenderizzato o sulla navigazione principale.
- **Rispettosi**: nessun lampeggio oltre 3 volte al secondo; reduced motion rispettato; suoni solo se l'audio è attivo.
- **Legali**: nessun asset Microsoft (niente Clippy, suoni o loghi originali), ogni asset in ASSETS.md.
- **Testati**: ognuno ha almeno un test e2e.
- **Disattivabili**: nessun easter egg blocca l'uso del sito; si chiude sempre con Esc o con un pulsante.

## Registro

| Nome        | Trigger | Effetto | Fase | File | Test |
| ----------- | ------- | ------- | ---- | ---- | ---- |
| _(nessuno)_ |         |         |      |      |      |

Gli easter egg previsti (Prompt MS-DOS, Prato fiorito, Cestino con la v1, schermata di spegnimento, ecc.) si progettano e si registrano nelle Fasi 4A e 4B.

Idea dalla v1: il terminale `while(true) { sudo apt install -y coffee; code(); }` della home (vedi CONTENT.md).
