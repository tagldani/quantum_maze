export function createGameState() {
    return {
        quantumScore: 0,
        cycleCount: 1,
        maxCycles: 3,
        cycleTransitioning: false,
        objectiveText: "STABILIZE 5 FRAGMENTS",
        protocolMessage: "",
        protocolMessageTimer: 0,
        resonanceTimer: 0,
        resonanceX: 0,
        resonanceY: 0,
        memoryTraceTriggered: false,
        memoryTraceActive: false,
        memoryTraceStep: 0,
        memoryTraceTimer: 0,
        echoTimer: 0,
        paused: false,
        started: false,

        /*
         * Ritual tracking.
         *
         * currentCycleSequence records the fragment types collected
         * during the current cycle, in order.
         *
         * Example:
         * ["unstable", "hidden", "normal", "echo", "unstable"]
         */
        currentCycleSequence: [],
        completedCycleSequences: [],

        /*
         * Canonical ritual sequence.
         *
         * Internal design name:
         * Threshold Sequence / Amber Trace Sequence
         *
         * Ritual translation:
         * call -> see -> stabilize -> remember -> open
         */
        thresholdSequence: ["unstable", "hidden", "normal", "echo", "unstable"],

        /*
         * Stores the result of each completed cycle pattern check.
         */
        ritualPatternResults: [],

        /*
         * Threshold Detection v1.
         */
        thresholdDetected: false,
        thresholdSignalShown: false,

        /*
         * Threshold Entry v1.
         */
        thresholdEntryCharge: 0,
        thresholdEntered: false,

        /*
         * Null Field State v1.
         *
         * This prepares the first state beyond the maze loop.
         * It does not change visuals yet.
         * It does not trigger Null Chamber yet.
         */
        nullFieldActive: false,
nullFieldTimer: 0,

/*
 * Null Chamber State v1.
 *
 * The Null Chamber is not visible yet.
 * This only marks that the field has finished listening
 * and a still point can become available.
 */
nullChamberAvailable: false,
nullChamberEntered: false,
stillPointCharge: 0,
nullChamberHoldCharge: 0,
nullChamberHoldConfirmed: false,
nullChamberFormingCharge: 0,
nullChamberFormingShown: false,
nullChamberFormingCharge: 0,
nullChamberFormingShown: false,
nullChamberNucleiCharge: 0,
nullChamberNucleiVisible: false
    };
}

export const fragmentProtocolMessages = [
    "SIGNAL RECEIVED",
    "FRAGMENT ABSORBED",
    "MEMORY TRACE DETECTED",
    "Q IS LEARNING",
    "OBSERVER LINK STABLE"
];