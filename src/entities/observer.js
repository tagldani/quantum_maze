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
        desyncTimer: 0
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

export function triggerObserverDesync(observer, state) {
    if (observer.reactionCooldown > 0) return;

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

        if (distanceFromQ < 70) {
            triggerObserverDesync(observer, state);
        }

        const desiredX = q.x - 90;
        const desiredY = q.y - 70;
        const strength = observer.desyncTimer > 0
            ? observer.followStrength * 0.25
            : observer.followStrength;

        observer.x += (desiredX - observer.x) * strength;
        observer.y += (desiredY - observer.y) * strength;
    }
}

export function drawObserver(ctx, observer, q, state) {
    if (!observer.emerged && !observer.emerging) return;

    const alpha = 0.45 + Math.sin(observer.pulse) * 0.25;
    ctx.shadowBlur = 14;

    const mergeMoment = state.memoryTraceActive && state.memoryTraceStep === 4;

    if (mergeMoment) {
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.shadowColor = "white";
    } else {
        ctx.fillStyle = `rgba(255, 170, 51, ${alpha})`;
        ctx.shadowColor = "#ffaa33";
    }

    ctx.font = "26px monospace";

    const observerText = observer.desyncTimer > 0
        ? ">-. . ."
        : Math.hypot(q.x - observer.x, q.y - observer.y) < 120
            ? ">.."
            : ">...";

    let displayText = observerText;

    if (state.memoryTraceActive) {
        const states = [">...Q", ">..Q.", ">.Q..", ">Q...", ">Q"];
        displayText = states[Math.min(state.memoryTraceStep, states.length - 1)];
    }

    ctx.fillText(displayText, observer.x, observer.y);
    ctx.shadowBlur = 0;
}
