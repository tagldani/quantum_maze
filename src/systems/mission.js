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