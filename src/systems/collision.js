import { fragmentProtocolMessages } from "../core/state.js";
import {
    triggerObserverDesync,
    triggerObserverSignal,
    startMemoryTrace
} from "../entities/observer.js";
import { playCollectSound } from "../systems/audio.js";

function getFragmentMessage(fragment) {
    if (fragment.type === "normal") return "TRACE STABLE";
    if (fragment.type === "unstable") return "PATTERN NOTED";
    if (fragment.type === "hidden") return "TRACE EXPOSED";
    if (fragment.type === "echo") return "MEMORY TRACE DETECTED";

    const randomIndex = Math.floor(Math.random() * fragmentProtocolMessages.length);
    return fragmentProtocolMessages[randomIndex];
}

function getFragmentObserverSignal(fragment) {
    if (fragment.type === "normal") return ">...";
    if (fragment.type === "unstable") return ">. .";
    if (fragment.type === "hidden") return ">-. .";
    if (fragment.type === "echo") return ">>.";

    return ">...";
}

export function checkCollection(q, fragments, state, observer) {
    fragments.forEach(fragment => {
        if (fragment.collected) return;

        const dx = q.x - fragment.x;
        const dy = q.y - fragment.y;
        const distance = Math.hypot(dx, dy);

        if (distance < q.radius + 8) {
            fragment.collected = true;

            if (state.currentCycleSequence) {
                state.currentCycleSequence.push(fragment.type);

                console.log(
                    `Cycle ${state.cycleCount} sequence:`,
                    state.currentCycleSequence.join(" -> ")
                );
            }

            state.quantumScore += fragment.score;
            state.protocolMessage = getFragmentMessage(fragment);
            state.protocolMessageTimer = 120;
            state.resonanceTimer = 18;
            state.resonanceX = fragment.x;
            state.resonanceY = fragment.y;

            triggerObserverSignal(observer, getFragmentObserverSignal(fragment), 80);

            try {
                playCollectSound(fragment);
            } catch (e) {
                /* ignore if audio fails */
            }

            if (fragment.effect === "desync") {
                triggerObserverDesync(observer, state);
                triggerObserverSignal(observer, getFragmentObserverSignal(fragment), 90);
            }

            if (fragment.effect === "echo") {
                startMemoryTrace(state);
                state.protocolMessage = "MEMORY TRACE ACTIVE";
                state.protocolMessageTimer = 140;
                triggerObserverSignal(observer, getFragmentObserverSignal(fragment), 90);
            }
        }
    });
}