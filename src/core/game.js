import { createGameState } from "./state.js";
import { createQ, updateQ, drawQ } from "../entities/q.js";
import { createObserver, updateObserver, drawObserver, triggerObserverEmergence } from "../entities/observer.js";
import { createFragments, drawFragments, spawnFragments } from "../entities/fragment.js";
import { setupInput } from "../systems/input.js";
import { checkCollection } from "../systems/collision.js";
import { checkCycleComplete } from "../systems/mission.js";

export function createGame(canvas) {
    const ctx = canvas.getContext("2d");
    const state = createGameState();
    const q = createQ();
    const observer = createObserver();
    const fragments = createFragments();

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        q.targetX = Math.min(q.targetX, canvas.width);
        q.targetY = Math.min(q.targetY, canvas.height);
        observer.targetX = 80;
        observer.targetY = canvas.height - 190;
    }

    resize();
    spawnFragments(fragments, canvas.width, canvas.height);
    window.addEventListener("resize", resize);
    setupInput(canvas, q, state);

    function resetRun() {
        state.quantumScore = 0;
        state.cycleCount = 1;
        state.cycleTransitioning = false;
        state.protocolMessage = "";
        state.protocolMessageTimer = 0;
        state.resonanceTimer = 0;
        state.resonanceX = 0;
        state.resonanceY = 0;
        state.memoryTraceTriggered = false;
        state.memoryTraceActive = false;
        state.memoryTraceStep = 0;
        state.memoryTraceTimer = 0;
        state.echoTimer = 0;
        state.paused = false;
        state.started = true;

        q.x = canvas.width / 2;
        q.y = canvas.height / 2;
        q.targetX = canvas.width / 2;
        q.targetY = canvas.height / 2;
        q.vx = 0;
        q.vy = 0;

        observer.x = 80;
        observer.y = canvas.height - 60;
        observer.targetX = 80;
        observer.targetY = canvas.height - 190;
        observer.pulse = 0;
        observer.emerging = false;
        observer.emerged = false;
        observer.reactionCooldown = 0;
        observer.desyncTimer = 0;

        spawnFragments(fragments, canvas.width, canvas.height);
    }

    function handlePauseAction(event) {
        if (!state.paused) return;

        const x = event.clientX;
        const y = event.clientY;
        const centerX = canvas.width / 2;
        const startY = canvas.height / 2 - 20;

        const resumeRect = { x: centerX - 110, y: startY + 30, w: 220, h: 44 };
        const restartRect = { x: centerX - 110, y: startY + 90, w: 220, h: 44 };
        const menuRect = { x: centerX - 110, y: startY + 150, w: 220, h: 44 };

        if (x >= resumeRect.x && x <= resumeRect.x + resumeRect.w && y >= resumeRect.y && y <= resumeRect.y + resumeRect.h) {
            state.paused = false;
            return;
        }

        if (x >= restartRect.x && x <= restartRect.x + restartRect.w && y >= restartRect.y && y <= restartRect.y + restartRect.h) {
            resetRun();
            return;
        }

        if (x >= menuRect.x && x <= menuRect.x + menuRect.w && y >= menuRect.y && y <= menuRect.y + menuRect.h) {
            state.started = false;
            state.paused = false;
        }
    }

    canvas.addEventListener("click", handlePauseAction);

    function drawResonance() {
        if (state.resonanceTimer <= 0) return;

        const progress = Math.max(0, Math.min(1, state.resonanceTimer / 15));
        const radius = 30 * (1 - progress);

        ctx.strokeStyle = `rgba(0, 212, 255, ${progress})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(state.resonanceX, state.resonanceY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawText(text, x, y, size = 18, color = "white") {
        ctx.font = `${size}px monospace`;
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
    }

    function drawDashedLine(x, y, length, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length, y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function updateProtocolMessages() {
        if (state.protocolMessageTimer > 0) {
            state.protocolMessageTimer--;
            return;
        }

        const stickyMessages = [
            `CYCLE ${state.cycleCount} INITIALIZED`,
            "PATTERN RECOGNITION: STABLE",
            "TRANSFER DENIED"
        ];

        if (!stickyMessages.includes(state.protocolMessage)) {
            state.protocolMessage = "";
        }
    }

    function drawStartOverlay() {
        ctx.fillStyle = "rgba(2, 6, 23, 0.78)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#bffaff";
        ctx.font = "bold 44px monospace";
        ctx.textAlign = "center";
        ctx.fillText("QUANTUM MAZE", canvas.width / 2, canvas.height / 2 - 80);

        ctx.font = "18px monospace";
        ctx.fillStyle = "#e6fbff";
        ctx.fillText("Collect fragments, stabilize the cycle, and stay in sync.", canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillText("Click or touch to start.", canvas.width / 2, canvas.height / 2 + 10);

        ctx.fillStyle = "#ffaa33";
        ctx.font = "16px monospace";
        ctx.fillText("Quick tutorial:", canvas.width / 2, canvas.height / 2 + 55);
        ctx.fillText("1. Click/touch to move Q", canvas.width / 2, canvas.height / 2 + 85);
        ctx.fillText("2. Collect fragments to trigger effects", canvas.width / 2, canvas.height / 2 + 110);
        ctx.fillText("3. Press Space to pause at any time", canvas.width / 2, canvas.height / 2 + 135);

        ctx.textAlign = "left";
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!state.started) {
            drawStartOverlay();
            requestAnimationFrame(draw);
            return;
        }

        // If paused, still render HUD and overlay but skip game updates
        if (state.paused) {
            drawFragments(ctx, fragments, q);
            drawResonance();
            drawObserver(ctx, observer, q, state);
            drawHUD();

            ctx.fillStyle = "rgba(2, 6, 23, 0.78)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#bffaff";
            ctx.textAlign = "center";
            ctx.font = "bold 48px monospace";
            ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2 - 70);

            ctx.font = "16px monospace";
            ctx.fillStyle = "#e6fbff";
            ctx.fillText("Resume the current cycle or reset the run.", canvas.width / 2, canvas.height / 2 - 20);

            const buttonX = canvas.width / 2 - 110;
            const buttonY = canvas.height / 2 + 30;
            const buttonW = 220;
            const buttonH = 44;

            ctx.fillStyle = "rgba(0, 212, 255, 0.18)";
            ctx.fillRect(buttonX, buttonY, buttonW, buttonH);
            ctx.strokeStyle = "#00d4ff";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);
            ctx.fillStyle = "#bffaff";
            ctx.fillText("Resume", canvas.width / 2, buttonY + 28);

            ctx.fillStyle = "rgba(255, 170, 51, 0.18)";
            ctx.fillRect(buttonX, buttonY + 60, buttonW, buttonH);
            ctx.strokeStyle = "#ffaa33";
            ctx.strokeRect(buttonX, buttonY + 60, buttonW, buttonH);
            ctx.fillStyle = "#ffe0b2";
            ctx.fillText("Restart", canvas.width / 2, buttonY + 88);

            ctx.fillStyle = "rgba(120, 255, 180, 0.18)";
            ctx.fillRect(buttonX, buttonY + 120, buttonW, buttonH);
            ctx.strokeStyle = "#7cffb4";
            ctx.strokeRect(buttonX, buttonY + 120, buttonW, buttonH);
            ctx.fillStyle = "#d6ffe7";
            ctx.fillText("Back to Menu", canvas.width / 2, buttonY + 148);

            ctx.textAlign = "left";
            requestAnimationFrame(draw);
            return;
        }

        updateQ(q);

        if (state.memoryTraceTriggered) {
            if (state.echoTimer <= 0 && Math.random() < 0.0008) {
                state.protocolMessage = "ECHO PRESENT";
                state.protocolMessageTimer = 120;
                state.echoTimer = 600;
            }

            if (state.echoTimer > 0) {
                state.echoTimer--;
            }
        }

        checkCollection(q, fragments, state, observer);
        checkCycleComplete(fragments, state, observer, spawnFragments);

        drawFragments(ctx, fragments, q);
        drawResonance();
        updateObserver(observer, q, state);
        drawObserver(ctx, observer, q, state);

        const blink = Math.floor(Date.now() / 500) % 2 === 0;
        updateProtocolMessages();

        drawText(`Q ${state.quantumScore}`, 20, 40, 24, "#bffaff");
        drawText("R E S O N A N C E", 20, 70, 12, "rgba(191, 250, 255, 0.75)");
        drawDashedLine(20, 58, 150, "#00d4ff");
        drawText(`CYCLE ${state.cycleCount}/${state.maxCycles}`, 20, 95, 18, "#ffaa33");
        drawText("TRACE STATUS: ACTIVE", 20, 125, 12, "rgba(255, 170, 51, 0.8)");
        drawDashedLine(20, 115, 260, "#ffaa33");
        drawText("OBJECTIVE:", 20, 155, 16, "#bffaff");
        drawText(`> ${state.objectiveText}${blink ? "_" : ""}`, 20, 190, 20, "#00d4ff");

        if (state.protocolMessage) {
            drawDashedLine(20, canvas.height - 140, canvas.width - 40, "#ffaa33");
            drawText(state.protocolMessage, 40, canvas.height - 100, 20, "#ffaa33");

            if (!observer.emerged && !observer.emerging) {
                drawText(
                    `> ${state.protocolMessage === "TRANSFER DENIED" ? "TRANSFER DENIED" : "..."}${blink ? "_" : ""}`,
                    40,
                    canvas.height - 60,
                    26,
                    "#ffaa33"
                );
            }

            drawDashedLine(20, canvas.height - 35, canvas.width - 40, "#ffaa33");
        }

        drawQ(ctx, q, state);
        drawHUD();
        requestAnimationFrame(draw);
    }

    function drawHUD() {
        // fragment counts by type
        const counts = fragments.reduce((acc, f) => {
            if (f.collected) return acc;
            acc[f.type] = (acc[f.type] || 0) + 1;
            return acc;
        }, {});

        const startX = canvas.width - 220;
        let y = 40;

        ctx.font = "16px monospace";
        ctx.fillStyle = "#bffaff";
        ctx.fillText("Fragments:", startX, y);
        y += 24;

        const types = ["normal", "unstable", "echo", "hidden"];
        types.forEach(t => {
            const c = counts[t] || 0;
            let color = "#ccc";
            if (t === "normal") color = "#00d4ff";
            if (t === "unstable") color = "#ffae00";
            if (t === "echo") color = "#a4fffb";
            if (t === "hidden") color = "#22ff88";

            ctx.fillStyle = color;
            ctx.fillText(`${t}: ${c}`, startX, y);
            y += 20;
        });

        // show pause hint
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "12px monospace";
        ctx.fillText("Press SPACE to Pause/Resume", startX, canvas.height - 30);
    }

    return {
        start() {
            requestAnimationFrame(draw);
        }
    };
}
