Campo di testo a una riga con etichetta, descrizione e messaggio d'errore collegati.

## Cosa fornisce chi lo usa
- `label` (obbligatoria, sempre visibile: niente segnaposto al posto dell'etichetta).
- `description` (facoltativa): suggerimento collegato con `aria-describedby`.
- `errorMessage` con `isInvalid`, oppure la validazione nativa di React Aria (`validate`, `isRequired`, `type="email"`). Il messaggio dice come correggere ("Manca il dominio, per esempio nome@dominio.it").
- Le altre prop di `TextField` di React Aria (`value`, `onChange`, `name`, `autoComplete`…).

## Stati
- **Normale**: `--color-field` con `--bevel-field`.
- **Focus** (`[data-focused]`, anche con il mouse, perché il cursore da solo non basta): doppio anello.
- **Errore** (`[data-invalid]`): bordo interno `--color-error` di `--bevel-width` più il messaggio con glifo ×, in `--color-error`. L'errore non dipende solo dal colore.
- **Disabilitato** (`[data-disabled]`): fondo `--color-field-disabled`, testo inciso.
- **Sola lettura** (`readOnly`): fondo `--color-field-disabled`, testo pieno e selezionabile.
- Nessuno stato hover o premuto: il 95 non li aveva e il cursore testo basta.

## Desktop e touch
Altezza `--control-height`. In touch il testo resta a 16 px, così iOS non ingrandisce la pagina al focus.
