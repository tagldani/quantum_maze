export function createObserver() {
    return {
        x: 80,
        y: window.innerHeight - 60,
        targetX: 80,
        targetY: window.innerHeight - 190,
        pulse: 0,
        emerging: false,
        emerged: false,
        followStrength: 0.012,
        reactionCooldown: 0,
        desyncTimer: 0,
        driftAngle: 0,
        driftRadius: 0,

        // Temporary symbolic reaction used when fragments are collected.
        // This does not change movement or cycle logic.
        signalText: null,
        signalTimer: 0
    };
}

export function triggerObserverEmergence(observer) {
    if (observer.emerged || observer.emerging) return;

    observer.x = 80;
    observer.y = window.innerHeight - 60;
    observer.targetX = 80;
    observer.targetY = window.innerHeight - 190;
    observer.emerging = true;
}

export function triggerObserverSignal(observer, text, duration = 70) {
    observer.signalText = text;
    observer.signalTimer = duration;
}

export function triggerObserverDesync(observer, state) {
    if (observer.reactionCooldown > 0) return;
    if (state.nullFieldActive) return;

    observer.desyncTimer = 45;
    observer.reactionCooldown = 180;

    if (!state.memoryTraceTriggered) {
        startMemoryTrace(state);
    } else {
        state.protocolMessage = "OBSERVER DESYNC";
        state.protocolMessageTimer = 75;
    }

    observer.x += (Math.random() - 0.5) * 120;
    observer.y += (Math.random() - 0.5) * 120;
}

export function startMemoryTrace(state) {
    if (state.memoryTraceTriggered) return;

    state.memoryTraceTriggered = true;
    state.memoryTraceActive = true;
    state.memoryTraceStep = 0;
    state.memoryTraceTimer = 40;
    state.protocolMessage = "MEMORY TRACE:";
    state.protocolMessageTimer = 240;
}

export function updateObserver(observer, q, state) {
    if (!observer.emerged && !observer.emerging) return;

    observer.pulse += 0.04;
    observer.driftAngle += 0.015;

    if (state.memoryTraceActive) {
        state.memoryTraceTimer--;

        if (state.memoryTraceTimer <= 0) {
            state.memoryTraceStep++;
            state.memoryTraceTimer = 40;

            if (state.memoryTraceStep > 4) {
                state.memoryTraceActive = false;
                observer.x -= 120;
                observer.y -= 80;
                state.protocolMessage = "";
            }
        }
    }

    if (observer.reactionCooldown > 0) {
        observer.reactionCooldown--;
    }

    if (observer.desyncTimer > 0) {
        observer.desyncTimer--;
    }

    if (observer.signalTimer > 0) {
        observer.signalTimer--;

        if (observer.signalTimer <= 0) {
            observer.signalText = null;
        }
    }

    if (observer.emerging) {
        const dx = observer.targetX - observer.x;
        const dy = observer.targetY - observer.y;

        observer.x += dx * 0.035;
        observer.y += dy * 0.035;

        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            observer.x = observer.targetX;
            observer.y = observer.targetY;
            observer.emerging = false;
            observer.emerged = true;
        }
    }

    if (observer.emerged) {
        const distanceFromQ = Math.hypot(q.x - observer.x, q.y - observer.y);

        if (!state.nullFieldActive && distanceFromQ < 70) {
            triggerObserverDesync(observer, state);
        }

        const cycle = state.cycleCount || 1;

        let desiredX;
        let desiredY;
        let strength;
        let minDistance;

        if (state.nullFieldActive) {
            desiredX = q.x + 190 + Math.sin(observer.driftAngle * 0.7) * 35;
            desiredY = q.y - 120 + Math.cos(observer.driftAngle * 0.6) * 28;
            strength = 0.01;
            minDistance = 160;
        } else if (cycle <= 1) {
            desiredX = 90 + Math.sin(observer.driftAngle) * 22;
            desiredY = window.innerHeight - 190 + Math.cos(observer.driftAngle * 0.8) * 18;
            strength = 0.012;
            minDistance = 170;
        } else if (cycle === 2) {
            desiredX = q.x - 170 + Math.sin(observer.driftAngle) * 45;
            desiredY = q.y - 115 + Math.cos(observer.driftAngle * 0.9) * 35;
            strength = 0.014;
            minDistance = 140;
        } else {
            desiredX = q.x - 210 + Math.sin(observer.driftAngle * 1.4) * 75;
            desiredY = q.y - 135 + Math.cos(observer.driftAngle * 1.1) * 55;
            strength = 0.018;
            minDistance = 130;
        }

        if (observer.desyncTimer > 0) {
            strength *= 0.35;
        }

        observer.x += (desiredX - observer.x) * strength;
        observer.y += (desiredY - observer.y) * strength;

        const nextDistanceFromQ = Math.hypot(q.x - observer.x, q.y - observer.y);

        if (nextDistanceFromQ < minDistance) {
            const angle = Math.atan2(observer.y - q.y, observer.x - q.x);
            observer.x = q.x + Math.cos(angle) * minDistance;
            observer.y = q.y + Math.sin(angle) * minDistance;
        }
    }
}

export function drawObserver(ctx, observer, q, state) {
    if (!observer.emerged && !observer.emerging) return;

    const cycle = state?.cycleCount || 1;
    const alpha = 0.45 + Math.sin(observer.pulse) * 0.25;
    const distanceFromQ = Math.hypot(q.x - observer.x, q.y - observer.y);

    ctx.save();

    ctx.shadowBlur = cycle >= 3 || state.nullFieldActive ? 22 : 14;

    let displayText = ">...";
    let fillColor = `rgba(255, 170, 51, ${alpha})`;
    let shadowColor = "#ffaa33";

    /*
     * OBSERVER LANGUAGE
     *
     * >...   stable observation
     * >. .   disturbed signal
     * >-. .  desync / error
     * >>.    active interference
     * >>>    full presence / threshold
     * <<<    inverted witness / Null Field
     *
     * Null Field has priority over cycle logic.
     */

    if (
        state.nullFieldActive ||
        state.protocolMessage === "NULL FIELD" ||
        state.objectiveText === "LISTEN TO THE FIELD"
    ) {
        displayText = "<<<";
        fillColor = `rgba(191, 250, 255, ${alpha})`;
        shadowColor = "#bffaff";
    } else if (observer.signalText) {
        displayText = observer.signalText;

        if (observer.signalText === ">-. .") {
            fillColor = `rgba(255, 90, 80, ${alpha})`;
            shadowColor = "#ff5a50";
        } else if (observer.signalText === ">>.") {
            fillColor = `rgba(255, 210, 140, ${alpha})`;
            shadowColor = "#ffd28c";
        } else if (observer.signalText === ">>>") {
            fillColor = `rgba(255, 235, 180, ${alpha})`;
            shadowColor = "#ffe7b4";
        } else if (observer.signalText === "<<<") {
            fillColor = `rgba(191, 250, 255, ${alpha})`;
            shadowColor = "#bffaff";
        } else {
            fillColor = `rgba(255, 170, 51, ${alpha})`;
            shadowColor = "#ffaa33";
        }
    } else if (observer.desyncTimer > 0) {
        displayText = ">-. .";
        fillColor = `rgba(255, 90, 80, ${alpha})`;
        shadowColor = "#ff5a50";
    } else if (state.memoryTraceActive) {
        const memoryStates = [">...", ">. .", ">-. .", ">>.", ">>>"];
        displayText = memoryStates[Math.min(state.memoryTraceStep, memoryStates.length - 1)];
        fillColor = `rgba(255, 210, 140, ${alpha})`;
        shadowColor = "#ffd28c";
    } else if (cycle >= 3) {
        displayText = distanceFromQ < 180 ? ">>>" : ">>.";
        fillColor = `rgba(255, 120, 40, ${alpha})`;
        shadowColor = "#ff7828";
    } else if (cycle === 2) {
        displayText = distanceFromQ < 160 ? ">-. ." : ">. .";
        fillColor = `rgba(255, 170, 51, ${alpha})`;
        shadowColor = "#ffaa33";
    } else {
        displayText = ">...";
        fillColor = `rgba(255, 170, 51, ${alpha})`;
        shadowColor = "#ffaa33";
    }

    ctx.fillStyle = fillColor;
    ctx.shadowColor = shadowColor;
    ctx.font = cycle >= 3 || state.nullFieldActive ? "28px monospace" : "26px monospace";

    ctx.fillText(displayText, observer.x, observer.y);

    ctx.restore();
}