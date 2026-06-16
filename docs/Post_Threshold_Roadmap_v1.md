# Quantum Maze — Post Threshold Roadmap v1

## Stato stabile attuale

Baseline attuale consolidata dopo Step 8B-fix.

Il gioco ora supporta il primo arco rituale completo:

1. Il player raccoglie frammenti nei cicli 1/3, 2/3, 3/3.
2. Il sistema registra la sequenza rituale dei frammenti.
3. Se Cycle 1 e Cycle 2 rispettano la sequenza corretta, nel Cycle 3 appare il Threshold.
4. Il player deve entrare nel Threshold prima di chiudere il Cycle 3.
5. Se resta abbastanza dentro il Threshold, il sistema mostra TRANSFER ACCEPTED.
6. Dopo la raccolta dell’ultimo frammento, il loop non riparte più da Cycle 1.
7. Il sistema entra nello stato NULL FIELD.
8. HUD: LISTEN TO THE FIELD.
9. Observer esterno mostra <<<.
10. Il vecchio Threshold sparisce quando nullFieldActive = true.

Questa baseline è stabile e non va più stravolta.

---

## Principio narrativo guida

Quantum Maze non è un arcade e non deve diventare una sequenza di feature.

La direzione corretta è:

* rituale interattivo;
* raccolta;
* memoria;
* errore;
* ripetizione;
* rottura del loop;
* trasformazione progressiva di Q.

Principio centrale:

> Criptico sì, casuale no.

Il player non deve capire tutto subito, ma deve sentire che esiste una logica interna coerente.

---

## Sequenza rituale canonica

La sequenza attuale resta:

```txt
UNSTABLE → HIDDEN → NORMAL → ECHO → UNSTABLE
```

Traduzione rituale:

```txt
chiamare → vedere → stabilizzare → ricordare → aprire
```

Questa sequenza resta la chiave del Threshold.

UNSTABLE è il primo contatto con l’Observer.

L’ultimo UNSTABLE chiude il circuito e consente l’apertura del Threshold.

---

## Grammatica simbolica Observer

I simboli Observer attuali e futuri:

```txt
>...     osservazione stabile
>. .     segnale disturbato
>-. .    desync / errore
>>.      interferenza attiva
>>>      presenza piena / threshold / passe-partout
<<<      inversione / Null Field / dopo-soglia
```

Observer non è un nemico classico.

Observer è:

* presenza;
* validatore;
* interferenza;
* memoria;
* testimone del rituale.

Nel Null Field, Observer non deve più sembrare aggressivo: deve sembrare invertito, sospeso, in ascolto.

---

## Differenza tra Threshold e Null Field

### Threshold

Il Threshold è la soglia.

Appare solo se il player ha rispettato la logica rituale nei primi due cicli.

È ancora dentro il maze.

Funzione:

* confermare che il sistema ha riconosciuto il pattern;
* offrire una possibilità di rottura del loop;
* generare TRANSFER ACCEPTED se Q resta abbastanza vicino.

Simbolo dominante:

```txt
>>>
```

### Null Field

Il Null Field è il primo stato oltre il loop.

Non è ancora la Null Chamber.

Non è ancora un nuovo livello.

Non è ancora una scelta o un upgrade.

È una sospensione.

Funzione:

* rallentare il ritmo;
* far capire che il loop è stato rotto;
* preparare l’ingresso alla Null Chamber;
* introdurre l’inversione `<<<`.

Messaggi chiave:

```txt
NULL FIELD
LISTEN TO THE FIELD
SIGNAL INVERTED
TRACE NO LONGER RETURNS
```

Simbolo dominante:

```txt
<<<
```

---

## Roadmap prossimi step

### Step 8C — Null Field Atmosphere Light

Obiettivo: dare al Null Field un’identità percettiva minima senza rompere il rendering.

Regole:

* non usare overlay globale pesante;
* non oscurare tutto lo schermo;
* non disegnare un nuovo grande portale;
* non interferire con SIGNAL STABLE;
* non toccare mission.js;
* non toccare observer.js;
* modificare solo game.js;
* Q deve restare visibile;
* Observer <<< deve restare visibile;
* il vecchio Threshold deve restare nascosto quando nullFieldActive = true.

Direzione visuale:

* micro-pulsazione ambientale;
* leggero cambiamento del background;
* piccoli segnali statici o drifting;
* nessun effetto invasivo.

Possibile messaggio:

```txt
FIELD LISTENING
```

Non implementare ancora nuclei.

---

### Step 9 — Null Field Listening State

Obiettivo: trasformare il Null Field da semplice stato logico a stato rituale di attesa/ascolto.

Il player non deve ricevere subito una nuova meccanica.

Deve sentire:

* silenzio;
* sospensione;
* tempo rallentato;
* assenza di ritorno al ciclo 1;
* Q è entrato in un luogo che osserva.

Possibili messaggi:

```txt
LISTEN TO THE FIELD
SIGNAL INVERTED
TRACE NO LONGER RETURNS
FIELD WAITING
```

Possibili comportamenti:

* dopo alcuni secondi nel Null Field, cambia leggermente il messaggio;
* Q può muoversi, ma il mondo non risponde come prima;
* nessun frammento nuovo;
* nessuna raccolta;
* nessun ciclo.

---

### Step 10 — Null Chamber Entry

Obiettivo: passare dal Null Field alla vera Null Chamber.

La Null Chamber non deve sembrare uno shop.

Non deve sembrare una schermata upgrade.

Deve sembrare una stanza rituale, vuota, ovattata, quasi sicura ma non spiegata.

Transizione possibile:

```txt
NULL FIELD
→ FIELD OPEN
→ NULL CHAMBER
```

Regole:

* ingresso lento;
* nessun tutorial esplicito;
* nessun menu;
* nessun testo che spieghi i benefici;
* Q rimane al centro dell’esperienza.

---

### Step 11 — Three Nuclei Preview

Obiettivo: introdurre tre nuclei nel Null Chamber.

Il player può avvicinarsi a ciascun nucleo.

Ogni nucleo genera una preview sensoriale.

Regole:

* avvicinarsi attiva preview;
* allontanarsi attenua o annulla preview;
* restare vicino abbastanza a lungo conferma la scelta;
* nessun testo “scegli upgrade”;
* i benefici restano inizialmente ambigui.

Tre nuclei direzionali:

```txt
PULSE  → corpo / battito / stabilità
TRACE  → memoria / eco / ripetizione
LUMEN  → luce / risonanza / percezione
```

Non definire ancora statistiche numeriche.

---

### Step 12 — First Q Metamorphosis

Obiettivo: Q cambia per la prima volta.

La metamorfosi non deve sembrare “ho preso un potere”.

Deve sembrare:

> Q è diventato leggermente diverso.

Possibili cambiamenti:

* alone;
* trail;
* pulsazione;
* colore secondario;
* micro-suono;
* nuova firma visiva.

Il player deve percepire attaccamento:

```txt
questo è il mio Q
```

---

### Step 13 — Return Changed

Obiettivo: riportare Q nel maze dopo la metamorfosi.

Domande da generare nel player:

* sono tornato nello stesso sistema?
* Q è ancora lo stesso?
* il loop ricorda quello che è successo?
* l’Observer mi riconosce diversamente?

Possibili messaggi:

```txt
RETURN TRACE FOUND
Q SIGNATURE CHANGED
OBSERVER REMEMBERS
```

Il ritorno deve preparare il futuro sistema di identità/rank.

---

### Step 14 — Q Signature / Rank Seed

Obiettivo: introdurre il seme della futura identità di Q.

Non ancora classifica.

Non ancora punteggio.

Non ancora RPG.

Solo una firma.

Esempi:

```txt
Q-TRACE: 001
Q-SIGNATURE: PULSE
Q-ID: Q2000
```

La firma deve dipendere dalla prima metamorfosi.

---

## Regole operative per i prossimi sviluppi

Ogni step deve essere:

* piccolo;
* testabile;
* reversibile;
* committabile separatamente;
* coerente con la narrativa;
* non invasivo sulla baseline.

Non introdurre contemporaneamente:

* nuova grafica;
* nuova logica;
* nuovo stato;
* nuova interazione.

Una modifica per volta.

---

## Roadmap sintetica

```txt
BASELINE ATTUALE
Step 8B-fix — Null Field Transition stabile

PROSSIMI STEP
Step 8C — Null Field Atmosphere Light
Step 9  — Null Field Listening State
Step 10 — Null Chamber Entry
Step 11 — Three Nuclei Preview
Step 12 — First Q Metamorphosis
Step 13 — Return Changed
Step 14 — Q Signature / Rank Seed
```

---

## Nota finale

Il primo arco è chiuso:

```txt
il loop può essere rotto
```

Da qui in poi il rischio principale è trasformare il mistero in feature.

Ogni nuovo elemento deve sembrare scoperto, non spiegato.

