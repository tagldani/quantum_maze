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
         *
         * This prepares the Threshold Sequence logic.
         * It does not punish, reward or alter gameplay yet.
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
         *
         * Example:
         * [
         *   { cycle: 1, status: "drift", sequence: [...] },
         *   { cycle: 2, status: "aligned", sequence: [...] }
         * ]
         */
        ritualPatternResults: []
    };
}

export const fragmentProtocolMessages = [
    "SIGNAL RECEIVED",
    "FRAGMENT ABSORBED",
    "MEMORY TRACE DETECTED",
    "Q IS LEARNING",
    "OBSERVER LINK STABLE"
];