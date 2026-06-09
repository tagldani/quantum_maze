

# Quantum Maze — Narrative Direction

## Baseline stabile

Questo documento descrive la direzione narrativa e di feeling di Quantum Maze dopo il consolidamento della baseline stabile.

Stato tecnico consolidato:
- il gioco è funzionante;
- i cicli avanzano correttamente: 1/3 → 2/3 → 3/3;
- ogni ciclo usa 5 frammenti;
- `game.js` è stato riparato dopo una schermata nera causata da duplicazione/rottura della funzione `draw()`;
- il tremore del mondo/pavimento al ciclo 3/3 è attivo e accettato;
- l’Observer non si muove ancora come desiderato, ma questo stato è accettato per ora;
- da questa baseline si procede solo con modifiche piccole, testabili e reversibili.

Commit di riferimento:
- `Milestone: stable 3-cycle gameplay baseline`

---

## Identità generale

Quantum Maze non deve essere un classico maze game o un arcade basato solo su raccolta oggetti.

Direzione corretta:

> Quantum Maze è un rituale interattivo di raccolta, memoria e collasso.

Q non è solo un personaggio.
Q è una presenza fragile, controllabile ma non del tutto spiegabile.

Il mondo non è un semplice pavimento.
È uno spazio quantico/mentale che reagisce alla raccolta dei frammenti.

I frammenti non sono solo collectible.
Sono tracce, memoria, segnale, anomalie.

L’Observer non è un nemico tradizionale.
È una presenza che osserva e un sistema che interferisce.

Arco emotivo principale:

> curiosità → instabilità → inquietudine → rivelazione

Regola narrativa:

> criptico sì, casuale no.

Il giocatore non deve capire tutto subito, ma deve percepire che esiste una logica interna.

---

## Struttura dei 3 cicli

### Ciclo 1/3 — Scoperta / controllo / stabilità

Feeling:
- calma;
- scoperta;
- controllo;
- familiarità iniziale.

Funzione narrativa:
- introdurre Q;
- far capire la raccolta frammenti;
- far percepire che c’è qualcosa che osserva;
- non spiegare troppo.

L’Observer può rimanere quasi fermo.
In questa fase funziona come presenza remota, non come minaccia.

Messaggi coerenti:
- `CYCLE 1 INITIALIZED`
- `TRACE STABLE`
- `PATTERN RECOGNITION: STABLE`
- `OBSERVER SIGNAL: DISTANT`

---

### Ciclo 2/3 — Disturbo / memoria / ripetizione

Feeling:
- qualcosa non torna;
- déjà-vu;
- memoria disturbata;
- instabilità crescente.

Funzione narrativa:
- far capire che la raccolta non è neutra;
- suggerire che il giocatore è già passato da lì;
- rendere l’Observer più presente;
- introdurre l’idea di memoria / trace / repetition.

L’Observer non deve inseguire come un mostro.
Deve reagire, apparire, interferire, cambiare stato.

Messaggi coerenti:
- `MEMORY TRACE DETECTED`
- `PATTERN REPEATING`
- `YOU HAVE BEEN HERE BEFORE`
- `OBSERVER PROXIMITY INCREASED`
- `TRACE STATUS: UNSTABLE`

---

### Ciclo 3/3 — Collasso / rottura / possibile avvertimento

Feeling:
- il sistema sta cedendo;
- il mondo non regge;
- completare il ciclo potrebbe essere sbagliato.

Il tremore del pavimento/mondo è accettato come segnale narrativo.
Non è solo un effetto visivo: è foreshadowing.

Idea chiave:

> il giocatore non sta semplicemente completando un livello;
> sta rompendo qualcosa.

Messaggi coerenti:
- `CYCLE 3 UNSTABLE`
- `THE FLOOR IS NOT A FLOOR`
- `TRANSFER DENIED`
- `DO NOT COMPLETE THE CYCLE`
- `SIGNAL COLLAPSE`

---

## Q — Identità del protagonista

Q deve restare una presenza controllabile ma misteriosa.

Direzione visiva:
- marmo pulsante;
- materia quantica contenuta;
- presenza luminosa instabile;
- non una lettera “Q” giocosa o cartoon.

Q deve comunicare:
- fragilità;
- densità;
- instabilità interna;
- controllo imperfetto;
- identità misteriosa.

Evoluzione possibile:
- ciclo 1: Q stabile;
- ciclo 2: Q leggermente alterato;
- ciclo 3: Q più instabile, ma ancora leggibile.

Priorità:
- mantenere Q leggibile;
- non fonderlo visivamente con l’Observer;
- non trasformarlo in una semplice icona testuale.

---

## Observer — Direzione narrativa

Direzione scelta:

> B + C

Significato:
- B = presenza che osserva;
- C = sistema che interferisce.

L’Observer non deve essere un nemico classico.
Non deve inseguire Q come un mostro.
Non deve essere spiegato con tutorial.

Deve sembrare:
- qualcosa che registra;
- qualcosa che riconosce la ripetizione;
- qualcosa che interferisce quando il sistema viene forzato;
- qualcosa che forse era già lì prima.

Frase guida:

> L’Observer non ti uccide. Ti riconosce.

Questo è più interessante di un nemico tradizionale.

---

## Linguaggio simbolico dell’Observer

L’Observer deve usare simboli criptici, compatti e coerenti.

Il giocatore non deve capirli subito, ma deve percepire che cambiano nei momenti giusti.

Grammatica proposta:

```text
>...     osservazione stabile
>. .     segnale disturbato
>-. .    desync / errore
>>.      interferenza attiva
>>>      presenza piena / collasso