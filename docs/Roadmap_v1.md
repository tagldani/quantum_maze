## Baseline — Quantum Maze Spark Build v0.1

**Status:** Stable baseline  
**Date:** 2026-06-09  
**Git tag:** `spark-build-v0.1`  
**Commit:** `6d9dc5c`

### Consolidated features

- Core canvas runtime active.
- Initial menu active.
- Quick tutorial overlay active.
- Advanced pause overlay active.
- Q entity restored and functional.
- Q movement redefined as physical, dense, inertial and non-mechanical.
- Fragment runtime restored.
- Fragments spawn correctly.
- Fragment collection loop active.
- Cycle progression active.
- Terrain drift starts at cycle 3.

### Design alignment

This baseline aligns the first playable layer with the Art & Experience Bible, GDD and Lore Bible.

- Q does not move like a generic arcade ball.
- Q behaves like a contained singularity with mass, inertia and subtle instability.
- Fragments are part of the discovery loop.
- The experience remains in the Spark phase: mystery, curiosity, minimal explanation.

### Protected baseline

Do not rewrite or replace this baseline from scratch.

Future development must proceed through small, reversible, testable steps above this version.

### Next planned step

Fragment Resonance v1:

- fragments should not simply disappear when collected;
- collection should feel like resonance between Q and the fragment;
- visual/audio/text feedback should remain minimal and coherent with the Spark phase.



# Quantum Maze — Roadmap

## Prossimo miglioramento proposto

Obiettivo: rendere il gioco più accessibile e professionale con un'introduzione chiara e una pausa avanzata.

### Task da svolgere

1. Menu iniziale
   - Aggiungere un overlay di avvio con titolo, sottotitolo e breve descrizione del gameplay.
   - Mostrare l'obiettivo principale della partita.
   - Inserire un hint rapido per i controlli base.
   - Attivare il gioco solo dopo un click/press su "Start".

2. Tutorial rapido
   - Spiegare il movimento di Q con click/touch.
   - Spiegare il significato di frammenti normali, unstable, echo e hidden.
   - Mostrare come funziona la pausa con Space.

3. Pausa avanzata
   - Sostituire la pausa semplice con un overlay dedicato.
   - Aggiungere opzioni: Riprendi, Ricomincia, Esci al menu.
   - Mantenere il frame visivo leggibile e non interrompere la narrativa del gioco.

4. Micro-feedback UX
   - Evidenziare meglio la transizione tra ciclo e ciclo.
   - Rendere più chiaro quando il giocatore ha raccolto un frammento o attivato un effetto speciale.

5. Preparazione futura
   - Posizionare la base per eventuali salvataggi locali e menu di scelta livello.

### Priorità

- Alta: menu iniziale, pausa avanzata, tutorial rapido
- Media: micro-feedback UX
- Bassa: preparazione per salvataggi e livelli futuri
