import { triggerObserverSignal } from "../entities/observer.js";

const REQUIRED_FRAGMENTS_PER_CYCLE = 5;

function sequencesMatch(sequence, targetSequence) {
  if (!sequence || !targetSequence) return false;
  if (sequence.length !== targetSequence.length) return false;

  return sequence.every((fragmentType, index) => {
    return fragmentType === targetSequence[index];
  });
}

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

  return completedSequence;
}

function triggerRitualObserverFeedback(observer, isAligned) {
  if (!observer) return;

  if (isAligned) {
    triggerObserverSignal(observer, ">>>", 150);
    return;
  }

  triggerObserverSignal(observer, ">-. .", 110);
}

function evaluateRitualPattern(state, observer, completedSequence) {
  if (!completedSequence) return;
  if (!state.thresholdSequence) return;
  if (!state.ritualPatternResults) return;

  const isAligned = sequencesMatch(completedSequence, state.thresholdSequence);
  const status = isAligned ? "aligned" : "drift";

  state.ritualPatternResults.push({
    cycle: state.cycleCount,
    status,
    sequence: completedSequence
  });

  console.log(
    `Cycle ${state.cycleCount} pattern status:`,
    status
  );

  console.log(
    "Ritual pattern results:",
    state.ritualPatternResults
  );

  triggerRitualObserverFeedback(observer, isAligned);

  if (isAligned) {
    state.protocolMessage = "RITUAL PATTERN ALIGNED";
    state.protocolMessageTimer = 140;
  } else {
    state.protocolMessage = "PATTERN DRIFT";
    state.protocolMessageTimer = 140;
  }
}

function startNextCycle(fragments, state, spawnFragments, nextCycle) {
  state.cycleCount = nextCycle;
  state.protocolMessage = `CYCLE ${state.cycleCount} INITIALIZED`;
  state.protocolMessageTimer = 120;
  state.objectiveText = "COLLECT 5 FRAGMENTS";

  fragments.forEach(fragment => {
    fragment.collected = true;
  });

  spawnFragments(fragments);

  state.cycleTransitioning = false;
}

function triggerFailedTransferLoop(fragments, state, observer, spawnFragments) {
  if (observer) {
    triggerObserverSignal(observer, ">-. .", 160);
  }

  console.log("TRANSFER DENIED — ritual loop restarted");

  state.protocolMessage = "TRANSFER DENIED";
  state.protocolMessageTimer = 150;
  state.objectiveText = "TRACE REPEATED";

  setTimeout(() => {
    state.protocolMessage = "TRACE REPEATED";
    state.protocolMessageTimer = 120;

    setTimeout(() => {
      /*
       * Failed Transfer Loop v1.
       *
       * The player completed Cycle 3/3, but the Threshold
       * is not open yet. The system rejects the transfer and
       * sends Q back to Cycle 1.
       *
       * Ritual memory is preserved in ritualPatternResults and
       * completedCycleSequences for now. We do not wipe them here.
       */
      startNextCycle(fragments, state, spawnFragments, 1);
    }, 900);
  }, 1000);
}

export function checkCycleComplete(fragments, state, observer, spawnFragments) {
  if (!state.started || state.paused) return;
  if (state.cycleTransitioning) return;

  const collectedCount = fragments.filter(fragment => fragment.collected).length;

  if (collectedCount < REQUIRED_FRAGMENTS_PER_CYCLE) return;

  state.cycleTransitioning = true;

  const completedSequence = storeCompletedCycleSequence(state);
  evaluateRitualPattern(state, observer, completedSequence);

  if (state.cycleCount < state.maxCycles) {
    const nextCycle = state.cycleCount + 1;

    setTimeout(() => {
      startNextCycle(fragments, state, spawnFragments, nextCycle);
    }, 900);

    return;
  }

  /*
   * Cycle 3/3 completed.
   *
   * Until Threshold Detection exists, every full run ends in
   * a failed transfer and loops back to Cycle 1.
   */
  triggerFailedTransferLoop(fragments, state, observer, spawnFragments);
}