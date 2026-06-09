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
         * It does not validate, punish, reward or alter gameplay yet.
         */
        currentCycleSequence: [],
        completedCycleSequences: []
    };
}

export const fragmentProtocolMessages = [
    "SIGNAL RECEIVED",
    "FRAGMENT ABSORBED",
    "MEMORY TRACE DETECTED",
    "Q IS LEARNING",
    "OBSERVER LINK STABLE"
];