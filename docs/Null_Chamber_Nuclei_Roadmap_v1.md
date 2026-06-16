# Quantum Maze — Null Chamber / Nuclei Roadmap

## Baseline consolidata

Stato attuale del progetto dopo gli ultimi step post-threshold.

### Sequenza attuale funzionante

```txt
Cycle 1/3
Cycle 2/3
Cycle 3/3
Threshold
TRANSFER ACCEPTED
Null Field Listening
NULL CHAMBER AVAILABLE
Still Point invisibile
NULL CHAMBER ENTERED
Q viene richiamata al centro
CENTER HOLDS
FORMING
THREE SIGNALS FORM
Tre nuclei visibili
Nuclei Proximity Preview attiva
```

### Step già consolidati

```txt
Step 10B — Still Point Interaction v1
Step 10C — Null Chamber Arrival Visual v1
Step 10D — Null Chamber Stabilization HUD v1
Step 10E — Null Chamber label cleanup v1
Step 10F — Null Chamber Stillness Lock v1
Step 10G — Null Chamber Hold Response v1
Step 10H — Null Chamber Forming Breath v1
Step 10H.1 — Forming Protocol Signal v1
Step 11A — Three Nuclei Appearance v1
Step 11B — Nuclei Proximity Preview v1
```

### Principi da preservare

```txt
Quantum Maze non è arcade.
È un interactive ritual.

Curiosity → instability → unease → revelation.

Criptico sì, casuale no.
Ogni nuova meccanica deve sembrare una risposta del campo, non una UI di gioco.
```

---

# Roadmap operativa successiva

## Step 11C — Nuclei Presence Upgrade v1

### Obiettivo narrativo

Dare più peso visivo ai tre nuclei. 
I nuclei devono iniziare a sembrare entità significative, non semplici pallini luminosi.

Devono apparire come:

```txt
tre possibilità nate dalla camera
tre forme di risposta del campo
tre origini identitarie per Q
```

### Obiettivo tecnico

Intervenire solo su:

```txt
drawNullChamberNuclei()
```

Non introdurre nuovi stati. 
Non introdurre nuova logica. 
Non introdurre osmosi. 
Non introdurre selezione.

### Modifiche previste

Rendere i nuclei leggermente più importanti:

```txt
- radius base leggermente più grande
- aura esterna più leggibile
- linee centro/nucleo più visibili
- previewBoost più evidente quando Q si avvicina
- differenziazione maggiore della pulsazione tra i tre nuclei
```

### Regole

```txt
NO scelta definitiva
NO click
NO lock
NO upgrade
NO designation Q
NO nuovi messaggi rituali
```

### Criterio di accettazione

```txt
Dopo THREE SIGNALS FORM:
- i tre nuclei sono chiaramente leggibili
- non coprono Q
- restano eleganti e rituali
- il preview è più percepibile
- il movimento resta contrastato dalla forza centripeta residua
```

### Commit suggerito

```powershell
git add src/core/game.js
git commit -m "Step 11C - upgrade nuclei presence"
git tag step-11c-nuclei-presence-upgrade-v1
git push
git push origin step-11c-nuclei-presence-upgrade-v1
```

---

## Step 11D — Nuclei Identity Preview v1

### Obiettivo narrativo

Dare identità rituale ai tre nuclei.

Messaggi definitivi:

```txt
Ambra → AMBER BREATHES
Ciano → FIELD BALANCE
Verde → TRACE REMEMBER
```

### Significato

```txt
AMBER BREATHES
= instabilità viva, respiro disturbato, prossimità all’Observer

FIELD BALANCE
= equilibrio, campo, asse, sospensione

TRACE REMEMBER
= memoria, ritorno, continuità
```

Nota: `TRACE REMEMBER` è volutamente non standard. 
Funziona come protocollo rituale / codice oracolare.

### Obiettivo tecnico

Aggiornare la logica di preview già esistente:

```txt
updateNullChamberNucleusPreview()
```

Sostituire i messaggi attuali:

```txt
UNSTABLE NEAR
FIELD NEAR
TRACE NEAR
```

con:

```txt
AMBER BREATHES
FIELD BALANCE
TRACE REMEMBER
```

### Possibile micro-upgrade visuale

Solo se non fatto in 11C:

```txt
- ambra: tremore / pulsazione irregolare
- ciano: pulsazione più simmetrica
- verde: scia più morbida / memoria
```

### Regole

```txt
NO osmosi
NO selezione
NO charge
NO designation
```

### Criterio di accettazione

```txt
Avvicinandosi ai nuclei:
- ambra mostra AMBER BREATHES
- ciano mostra FIELD BALANCE
- verde mostra TRACE REMEMBER
- allontanandosi ritorna THREE SIGNALS FORM
```

### Commit suggerito

```powershell
git add src/core/game.js
git commit -m "Step 11D - add nuclei identity preview"
git tag step-11d-nuclei-identity-preview-v1
git push
git push origin step-11d-nuclei-identity-preview-v1
```

---

## Step 11E — Nuclei Sonic Preview v1

### Obiettivo narrativo

Ogni nucleo deve avere una firma sonora.

L’audio non deve spiegare. 
Deve aumentare l’ambiguità sensoriale e il legame con Q.

### Identità sonore

```txt
Ambra:
- basso disturbato
- pulsazione irregolare
- vibrazione quasi Observer-like

Ciano:
- tono cristallino
- armonico stabile
- respiro ordinato

Verde:
- eco morbida
- memoria / aftertone
- scia sonora organica
```

### Obiettivo tecnico

Creare un sistema audio minimo, probabilmente con Web Audio API.

Possibili funzioni:

```js
initNullChamberAudio()
updateNucleusAudioPreview()
stopNucleusAudioPreview()
```

### Regole

```txt
NO file audio esterni inizialmente
NO musica piena
NO loop invasivi
NO scelta ancora
NO osmosi ancora
```

### Criterio di accettazione

```txt
Avvicinandosi a un nucleo:
- parte una texture sonora tenue
- cresce con la prossimità
- svanisce allontanandosi
- ogni nucleo suona diverso
```

### Commit suggerito

```powershell
git add src/core/game.js
git commit -m "Step 11E - add nuclei sonic preview"
git tag step-11e-nuclei-sonic-preview-v1
git push
git push origin step-11e-nuclei-sonic-preview-v1
```

---

## Step 11F — Osmosis Charge v1

### Obiettivo narrativo

La scelta non avviene tramite click. 
Avviene tramite permanenza.

Q non sceglie un nucleo. 
Q entra in osmosi con un nucleo.

Messaggio definitivo:

```txt
OSMOSIS
```

### Meccanica

```txt
- Q entra nel raggio di preview di un nucleo
- se resta vicino per circa 3 secondi, parte/avanza OSMOSIS
- se Q si allontana, la carica scende o si resetta
- non si usa click
- non si usa tasto
```

### Obiettivo tecnico

Aggiungere stati:

```js
nullChamberOsmosisTarget: null
nullChamberOsmosisCharge: 0
nullChamberOsmosisComplete: false
```

Possibile costante:

```js
const requiredOsmosisCharge = 180; // circa 3 secondi a 60 fps
```

### Visuale

Durante OSMOSIS:

```txt
- anello di carica attorno al nucleo
- intensità crescente
- linea nucleo/Q più visibile
- Q leggermente attratta dal nucleo, ma ancora contrastata dalla camera
```

### Messaggi

Durante la carica:

```txt
OSMOSIS
```

Non mostrare percentuali o UI numerica.

### Regole

```txt
NO scelta immediata
NO click
NO reward arcade
NO spiegazione
```

### Criterio di accettazione

```txt
Restando vicino a un nucleo:
- appare OSMOSIS
- il nucleo carica visivamente
- dopo circa 3 secondi la carica è completa
- se Q si allontana prima, la carica non completa
```

### Commit suggerito

```powershell
git add src/core/state.js src/core/game.js
git commit -m "Step 11F - add osmosis charge"
git tag step-11f-osmosis-charge-v1
git push
git push origin step-11f-osmosis-charge-v1
```

---

## Step 12A — First Nucleus Selection v1

### Obiettivo narrativo

Quando l’osmosi arriva a completamento, uno dei tre nuclei risponde.

Messaggio definitivo:

```txt
ONE ANSWER
```

Interpretazione:

```txt
non “hai scelto”
non “selezione completata”
ma “uno ha risposto”
```

### Obiettivo tecnico

Quando `nullChamberOsmosisCharge >= requiredOsmosisCharge`:

```js
state.nullChamberChosenNucleus = state.nullChamberOsmosisTarget;
state.nullChamberSelectionComplete = true;
state.protocolMessage = "ONE ANSWER";
state.objectiveText = "REMAIN";
```

### Regole

```txt
Una sola risposta.
Dopo ONE ANSWER non cambiare più target.
Gli altri nuclei devono attenuarsi o diventare silenziosi.
```

### Visuale

```txt
- nucleo scelto cresce o si stabilizza
- nuclei non scelti si attenuano
- Q resta attratta / sospesa
- niente esplosione arcade
```

### Criterio di accettazione

```txt
Dopo 3 secondi di OSMOSIS:
- appare ONE ANSWER
- il nucleo scelto resta dominante
- gli altri nuclei perdono presenza
- non si può scegliere un altro nucleo
```

### Commit suggerito

```powershell
git add src/core/state.js src/core/game.js
git commit -m "Step 12A - complete first nucleus answer"
git tag step-12a-first-nucleus-answer-v1
git push
git push origin step-12a-first-nucleus-answer-v1
```

---

## Step 12B — Q Metamorphosis v1

### Obiettivo narrativo

Q cambia forma in base al nucleo che ha risposto.

Non è un power-up. 
È una nascita identitaria.

### Mappa metamorfosi

```txt
Ambra:
- Q diventa più viva/instabile
- bordo intermittente
- micro tremore
- alone amber
- energia “breath”

Ciano:
- Q diventa più ordinata/simmetrica
- campo pulito
- glow freddo
- movimento più centrato
- energia “balance”

Verde:
- Q acquisisce memoria/eco
- scia morbida
- afterimage leggero
- alone verde
- energia “trace”
```

### Obiettivo tecnico

Aggiungere uno stato:

```js
qForm: null
```

oppure:

```js
state.qDesignation = null
state.qMetamorphosisType = null
```

Da usare in `drawQ()` o in un wrapper visuale intorno a Q.

### Regole

```txt
NO cambio gameplay forte
NO power-up
NO nuove abilità ancora
Sì cambio percettivo/identitario
```

### Criterio di accettazione

```txt
Dopo ONE ANSWER:
- Q cambia visivamente
- il cambio dipende dal nucleo scelto
- il player percepisce una trasformazione
- non appare come upgrade arcade
```

### Commit suggerito

```powershell
git add src/core/state.js src/core/game.js src/entities/q.js
git commit -m "Step 12B - add first Q metamorphosis"
git tag step-12b-q-metamorphosis-v1
git push
git push origin step-12b-q-metamorphosis-v1
```

---

## Step 12C — Q Designation v1

### Obiettivo narrativo

La scelta del nucleo assegna a Q una nuova identità.

Designation definitive:

```txt
Ambra → Q-Breath
Ciano → Q-Balance
Verde → Q-Trace
```

### Significato

```txt
Q-Breath
= Q nata dal respiro amber, instabile, viva, disturbata

Q-Balance
= Q nata dall’equilibrio del field, centrata, simmetrica, stabile

Q-Trace
= Q nata dalla memoria, continuità, eco, afterimage
```

### Obiettivo tecnico

Dopo la metamorfosi:

```js
state.qDesignation = "Q-Breath";
// oppure "Q-Balance" / "Q-Trace"
```

Aggiornare HUD Null Chamber:

```txt
Q-Breath
Q-Balance
Q-Trace
```

al posto o accanto a:

```txt
Q score
```

### Messaggi possibili

```txt
Q-BREATH
Q-BALANCE
Q-TRACE
```

oppure:

```txt
Q: Q-Breath
Q: Q-Balance
Q: Q-Trace
```

Scelta consigliata a video:

```txt
Q: Q-Breath
Q: Q-Balance
Q: Q-Trace
```

### Criterio di accettazione

```txt
Dopo ONE ANSWER e metamorfosi:
- appare la designation corretta
- la designation dipende dal nucleo
- il player capisce che è iniziato un percorso
```

### Commit suggerito

```powershell
git add src/core/state.js src/core/game.js
git commit -m "Step 12C - add Q designation"
git tag step-12c-q-designation-v1
git push
git push origin step-12c-q-designation-v1
```

---

## Step 13A — Path Begins v1

### Obiettivo narrativo

Dopo la designation, la Null Chamber non è più un luogo di scelta. 
Diventa origine del percorso successivo.

Messaggio possibile:

```txt
PATH BEGINS
```

Alternative:

```txt
THE PATH BEGINS
Q DOES NOT RETURN
FIELD-BORN TRACE INITIALIZED
```

Consigliato:

```txt
PATH BEGINS
```

### Obiettivo tecnico

Decidere cosa succede dopo la nascita identitaria.

Possibili direzioni:

```txt
A. apertura di una nuova area
B. ritorno al maze trasformato
C. nuovo ciclo con Q designation attiva
D. Observer cambia ruolo
E. nuova grammatica rituale
```

### Decisione ancora aperta

Non implementare subito. 
Prima consolidare 11C → 12C.

### Commit futuro

```powershell
git add .
git commit -m "Step 13A - begin post-designation path"
git tag step-13a-path-begins-v1
git push
git push origin step-13a-path-begins-v1
```

---

# Roadmap breve di esecuzione

```txt
11C — dare più presenza visiva ai nuclei
11D — assegnare messaggi identitari:
AMBER BREATHES / FIELD BALANCE / TRACE REMEMBER
11E — preview sonora dei tre nuclei
11F — OSMOSIS: permanenza 3 secondi
12A — ONE ANSWER: un nucleo risponde
12B — metamorfosi visiva di Q
12C — designation:
Ambra => Q-Breath
Ciano => Q-Balance
Verde => Q-Trace
13A — PATH BEGINS / uscita o transizione post-designation
```

---

# Regola operativa per tutti gli step

Ogni step deve essere:

```txt
piccolo
testabile
committabile
taggabile
reversibile
```

Prima di ogni step:

```powershell
git status
```

Dopo ogni step funzionante:

```powershell
git add ...
git commit -m "Step XX - ..."
git tag step-xx-...
git push
git push origin step-xx-...
```

