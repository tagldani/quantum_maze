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

  return status;
}

function hasAlignedCycle(state, cycleNumber) {
  if (!state.ritualPatternResults) return false;

  return state.ritualPatternResults.some(result => {
    return result.cycle === cycleNumber && result.status === "aligned";
  });
}

function shouldDetectThreshold(state) {
  return hasAlignedCycle(state, 1) && hasAlignedCycle(state, 2);
}

function triggerThresholdDetected(state, observer) {
  state.thresholdDetected = true;
  state.thresholdSignalShown = true;
  state.protocolMessage = "THRESHOLD DETECTED";
  state.protocolMessageTimer = 180;
  state.objectiveText = "APPROACH THE SIGNAL";

  if (observer) {
    triggerObserverSignal(observer, ">>>", 220);
  }

  console.log("THRESHOLD DETECTED — Cycle 1 and Cycle 2 aligned");
}

function startNextCycle(fragments, state, observer, spawnFragments, nextCycle) {
  state.cycleCount = nextCycle;
  state.protocolMessage = `CYCLE ${state.cycleCount} INITIALIZED`;
  state.protocolMessageTimer = 120;
  state.objectiveText = "COLLECT 5 FRAGMENTS";

  fragments.forEach(fragment => {
    fragment.collected = true;
  });

  spawnFragments(fragments);

  /*
   * Threshold Detection v1.
   *
   * If Cycle 1 and Cycle 2 were both aligned, then Cycle 3 is no
   * longer initialized as a normal cycle. It becomes the first
   * detected Threshold moment.
   */
  if (state.cycleCount === 3 && shouldDetectThreshold(state)) {
    triggerThresholdDetected(state, observer);
  }

  state.cycleTransitioning = false;
}

function triggerFailedTransferLoop(fragments, state, observer, spawnFragments) {
  if (observer) {
    triggerObserverSignal(observer, ">-. .", 160);
  }

  console.log("TRANSFER DENIED - ritual loop restarted");

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
       * For now, ritual memory is preserved in ritualPatternResults
       * and completedCycleSequences.
       */
      state.thresholdDetected = false;
      state.thresholdSignalShown = false;

      startNextCycle(fragments, state, observer, spawnFragments, 1);
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
      startNextCycle(fragments, state, observer, spawnFragments, nextCycle);
    }, 900);

    return;
  }

  /*
   * Cycle 3/3 completed.
   *
   * Until Threshold Entry exists, every full run still ends in
   * a failed transfer and loops back to Cycle 1.
   *
   * Important:
   * Threshold Detection v1 only detects the threshold at the start
   * of Cycle 3. It does not yet let Q enter it.
   */
  triggerFailedTransferLoop(fragments, state, observer, spawnFragments);
}