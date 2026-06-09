import { triggerObserverEmergence } from "../entities/observer.js";

export function checkCycleComplete(fragments, state, observer, spawnFragments) {
  if (!state.started || state.paused) return;
  if (state.cycleTransitioning) return;

  const REQUIRED_FRAGMENTS_PER_CYCLE = 5;

  const collectedCount = fragments.filter(fragment => fragment.collected).length;

  if (collectedCount < REQUIRED_FRAGMENTS_PER_CYCLE) return;

  state.cycleTransitioning = true;

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