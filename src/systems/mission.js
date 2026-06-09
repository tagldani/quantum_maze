import { triggerObserverEmergence } from "../entities/observer.js";

export function checkCycleComplete(fragments, state, observer, spawnFragments) {
    const allCollected = fragments.every(fragment => fragment.collected);
    if (!allCollected || state.cycleTransitioning) return;

    state.cycleTransitioning = true;

    if (state.cycleCount < state.maxCycles) {
        state.cycleCount++;

        if (state.cycleCount === 2) {
            triggerObserverEmergence(observer);
        }

        state.protocolMessage = `CYCLE ${state.cycleCount} INITIALIZED`;

        setTimeout(() => {
            state.cycleTransitioning = false;
            state.protocolMessage = "";
            spawnFragments(fragments, window.innerWidth, window.innerHeight);
        }, 700);
    } else {
        state.protocolMessage = "PATTERN RECOGNITION: STABLE";
        setTimeout(() => {
            state.protocolMessage = "TRANSFER DENIED";
            state.protocolMessageTimer = 75;
        }, 1200);
    }
}
