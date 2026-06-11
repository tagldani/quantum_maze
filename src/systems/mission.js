import { triggerObserverEmergence } from "../entities/observer.js";

const REQUIRED_FRAGMENTS_PER_CYCLE = 5;

function storeCompletedCycleSequence(state) {
  if (!state.currentCycleSequence) return;
  if (!state.completedCycleSequences) return;

  const completedSequence = [...state.currentCycleSequence];

  state.completedCycleSequences.push({
    cycle: state.cycleCount,
    sequence: completedSequence
  });

  console.log(
    `Cycle ${state.cycleCount} completed sequence:`,
    completedSequence.join(" -> ")
  );

  console.log(
    "Completed cycle sequences:",
    state.completedCycleSequences
  );

  state.currentCycleSequence = [];
}

export function checkCycleComplete(fragments, state, observer, spawnFragments) {
  if (!state.started || state.paused) return;
  if (state.cycleTransitioning) return;

  const collectedCount = fragments.filter(fragment => fragment.collected).length;

  if (collectedCount < REQUIRED_FRAGMENTS_PER_CYCLE) return;

  state.cycleTransitioning = true;

  storeCompletedCycleSequence(state);

  if (state.cycleCount < state.maxCycles) {
    const nextCycle = state.cycleCount + 1;

    state.protocolMessage = `CYCLE ${state.cycleCount} COMPLETE`;
    state.protocolMessageTimer = 90;

    setTimeout(() => {
      state.cycleCount = nextCycle;
      state.protocolMessage = `CYCLE ${state.cycleCount} INITIALIZED`;
      state.protocolMessageTimer = 120;
      state.objectiveText = "COLLECT 5 FRAGMENTS";

      fragments.forEach(fragment => {
        fragment.collected = true;
      });

      spawnFragments(fragments);

      state.cycleTransitioning = false;
    }, 900);

    return;
  }

  state.protocolMessage = "ALL CYCLES COMPLETE";
  state.protocolMessageTimer = 180;
  state.objectiveText = "TRACE STABILIZED";
  state.cycleTransitioning = false;
}