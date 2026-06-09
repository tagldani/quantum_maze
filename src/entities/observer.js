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
        driftRadius: 0
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

        const cycle = state.cycleCount || 1;

        let desiredX;
        let desiredY;
        let strength;
        let minDistance;

        if (cycle <= 1) {
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

    const alpha = 0.45 + Math.sin(observer.pulse) * 0.25;
    const cycle = state.cycleCount || 1;

    ctx.save();

    ctx.shadowBlur = cycle >= 3 ? 22 : 14;

    const mergeMoment = state.memoryTraceActive && state.memoryTraceStep >= 3;

    if (observer.desyncTimer > 0) {
        ctx.fillStyle = `rgba(255, 80, 80, ${alpha})`;
        ctx.shadowColor = "#ff5050";
    } else if (mergeMoment) {
        ctx.fillStyle = `rgba(255, 220, 160, ${alpha})`;
        ctx.shadowColor = "#ffdca0";
    } else if (cycle >= 3) {
        ctx.fillStyle = `rgba(255, 120, 40, ${alpha})`;
        ctx.shadowColor = "#ff7828";
    } else {
        ctx.fillStyle = `rgba(255, 170, 51, ${alpha})`;
        ctx.shadowColor = "#ffaa33";
    }

    ctx.font = cycle >= 3 ? "28px monospace" : "26px monospace";

    let displayText;

    if (state.memoryTraceActive) {
        const states = [">...", ">..", ">.", ">>", ">>>"];
        displayText = states[Math.min(state.memoryTraceStep, states.length - 1)];
    } else if (observer.desyncTimer > 0) {
        displayText = ">-. . .";
    } else {
        const distanceFromQ = Math.hypot(q.x - observer.x, q.y - observer.y);

        if (cycle >= 3) {
            displayText = distanceFromQ < 180 ? ">>>": ">>.";
        } else {
            displayText = distanceFromQ < 160 ? ">.." : ">...";
        }
    }

    ctx.fillText(displayText, observer.x, observer.y);

    ctx.restore();
}