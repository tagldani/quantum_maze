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
  state.thresholdEntryCharge = 0;
  state.thresholdEntered = false;
  state.nullFieldActive = false;
  state.nullFieldTimer = 0;

  state.protocolMessage = "THRESHOLD DETECTED";
  state.protocolMessageTimer = 180;
  state.objectiveText = "APPROACH THE SIGNAL";

  if (observer) {
    triggerObserverSignal(observer, ">>>", 220);
  }

  console.log("THRESHOLD DETECTED - Cycle 1 and Cycle 2 aligned");
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

function activateNullField(state, observer) {
  if (state.nullFieldActive) return;

  state.nullFieldActive = true;
  state.nullFieldTimer = 1;
  state.protocolMessage = "NULL FIELD";
  state.protocolMessageTimer = 240;
  state.objectiveText = "LISTEN TO THE FIELD";
  state.cycleTransitioning = false;

  if (observer) {
    triggerObserverSignal(observer, "<<<", 260);
  }

  console.log("NULL FIELD ACTIVE");
}

function acceptTransfer(state, observer) {
  state.protocolMessage = "TRANSFER ACCEPTED";
  state.protocolMessageTimer = 220;
  state.objectiveText = "NULL FIELD PENDING";
  state.cycleTransitioning = false;

  if (observer) {
    triggerObserverSignal(observer, ">>>", 220);
  }

  console.log("TRANSFER ACCEPTED - preparing Null Field");

  setTimeout(() => {
    if (!state.thresholdEntered) return;
    activateNullField(state, observer);
  }, 1200);
}

function shouldCancelFailedTransfer(state) {
  return state.thresholdEntered === true;
}

function triggerFailedTransferLoop(fragments, state, observer, spawnFragments) {
  /*
   * Safety guard.
   *
   * If Q stabilizes the Threshold while a failed-transfer timeout
   * is already pending, the failed loop must be cancelled.
   */
  if (shouldCancelFailedTransfer(state)) {
    acceptTransfer(state, observer);
    return;
  }

  if (observer) {
    triggerObserverSignal(observer, ">-. .", 160);
  }

  console.log("TRANSFER DENIED - ritual loop pending");

  state.protocolMessage = "TRANSFER DENIED";
  state.protocolMessageTimer = 150;
  state.objectiveText = "TRACE REPEATED";

  setTimeout(() => {
    if (shouldCancelFailedTransfer(state)) {
      console.log("FAILED TRANSFER CANCELLED - threshold entered");
      acceptTransfer(state, observer);
      return;
    }

    state.protocolMessage = "TRACE REPEATED";
    state.protocolMessageTimer = 120;

    setTimeout(() => {
      if (shouldCancelFailedTransfer(state)) {
        console.log("FAILED TRANSFER CANCELLED - threshold entered");
        acceptTransfer(state, observer);
        return;
      }

      /*
       * Failed Transfer Loop.
       *
       * The player completed Cycle 3/3, but Q did not stabilize
       * the Threshold. The system rejects the transfer and sends
       * Q back to Cycle 1.
       *
       * Ritual memory is preserved in ritualPatternResults and
       * completedCycleSequences for now.
       */
      state.thresholdDetected = false;
      state.thresholdSignalShown = false;
      state.thresholdEntryCharge = 0;
      state.thresholdEntered = false;
      state.nullFieldActive = false;
      state.nullFieldTimer = 0;

      console.log("TRANSFER DENIED - ritual loop restarted");

      startNextCycle(fragments, state, observer, spawnFragments, 1);
    }, 900);
  }, 1000);
}

export function checkCycleComplete(fragments, state, observer, spawnFragments) {
  if (!state.started || state.paused) return;
  if (state.nullFieldActive) return;
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
   * If Q has stabilized the Threshold, the system accepts the
   * transfer and activates the Null Field logical state.
   *
   * Visual Null Field rendering is not implemented in this step.
   */
  if (state.thresholdEntered) {
    acceptTransfer(state, observer);
    return;
  }

  triggerFailedTransferLoop(fragments, state, observer, spawnFragments);
}