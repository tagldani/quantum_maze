import { fragmentProtocolMessages } from "../core/state.js";
import { triggerObserverDesync, startMemoryTrace } from "../entities/observer.js";
import { playCollectSound } from "../systems/audio.js";

function getFragmentMessage(fragment) {
    if (fragment.type === "unstable") return "UNSTABLE FRAGMENT STABILIZED";
    if (fragment.type === "echo") return "ECHO FRAGMENT SYNCED";
    if (fragment.type === "hidden") return "HIDDEN SIGNAL SECURED";

    const randomIndex = Math.floor(Math.random() * fragmentProtocolMessages.length);
    return fragmentProtocolMessages[randomIndex];
}

export function checkCollection(q, fragments, state, observer) {
    fragments.forEach(fragment => {
        if (fragment.collected) return;

        const dx = q.x - fragment.x;
        const dy = q.y - fragment.y;
        const distance = Math.hypot(dx, dy);

        if (distance < q.radius + 8) {
            fragment.collected = true;
            state.quantumScore += fragment.score;
            state.protocolMessage = getFragmentMessage(fragment);
            state.protocolMessageTimer = 120;
            state.resonanceTimer = 18;
            state.resonanceX = fragment.x;
            state.resonanceY = fragment.y;

            // play feedback sound
            try { playCollectSound(fragment); } catch (e) { /* ignore if audio fails */ }

            if (fragment.effect === "desync") {
                triggerObserverDesync(observer, state);
            }

            if (fragment.effect === "echo") {
                startMemoryTrace(state);
                state.protocolMessage = "ECHO TRACE ACTIVE";
            }
        }
    });
}
