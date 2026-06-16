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
        state.objectiveText = "STABILIZE 5 FRAGMENTS";
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

        state.currentCycleSequence = [];
        state.completedCycleSequences = [];
        state.ritualPatternResults = [];
        state.thresholdDetected = false;
        state.thresholdSignalShown = false;
        state.thresholdEntryCharge = 0;
        state.thresholdEntered = false;
        state.nullFieldActive = false;
state.nullFieldTimer = 0;
state.nullChamberAvailable = false;
state.nullChamberEntered = false;
state.stillPointCharge = 0;
state.nullChamberHoldCharge = 0;
state.nullChamberHoldConfirmed = false;
state.nullChamberFormingCharge = 0;
state.nullChamberFormingShown = false;
state.nullChamberNucleiCharge = 0;
state.nullChamberNucleiVisible = false;
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
        observer.driftAngle = 0;
        observer.driftRadius = 0;
        observer.signalText = null;
        observer.signalTimer = 0;

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
            "TRANSFER DENIED",
            "TRACE REPEATED",
            "THRESHOLD DETECTED",
            "TRANSFER ACCEPTED"
        ];

        if (!stickyMessages.includes(state.protocolMessage)) {
            state.protocolMessage = "";
        }
    }
function updateNullFieldListening() {
    if (!state.nullFieldActive) return;
    if (state.paused) return;

    /*
     * Once the Null Chamber is available, the Null Field stops speaking.
     * From this moment the Still Point interaction owns protocol messages.
     */
    if (state.nullChamberAvailable || state.nullChamberEntered) return;
    /*
     * Null Field Listening State v1.
     *
     * The player has broken the loop.
     * Nothing is explained.
     * The field responds slowly through protocol messages.
     */

    state.nullFieldTimer++;

    if (state.nullFieldTimer >= 1020) {
        if (!state.nullChamberAvailable) {
            console.log("NULL CHAMBER AVAILABLE");
        }

        state.nullChamberAvailable = true;
        state.protocolMessage = "NULL CHAMBER AVAILABLE";
        state.protocolMessageTimer = 999999;
        state.objectiveText = "APPROACH THE STILL POINT";
        return;
    }

    if (state.nullFieldTimer >= 720) {
        state.protocolMessage = "TRACE NO LONGER RETURNS";
        state.protocolMessageTimer = 999999;
        state.objectiveText = "WAIT";
        return;
    }

    if (state.nullFieldTimer >= 420) {
        state.protocolMessage = "SIGNAL INVERTED";
        state.protocolMessageTimer = 999999;
        state.objectiveText = "STAY WITH THE SIGNAL";
        return;
    }

    if (state.nullFieldTimer >= 180) {
        state.protocolMessage = "FIELD LISTENING";
        state.protocolMessageTimer = 999999;
        state.objectiveText = "LISTEN TO THE FIELD";
    }
}
function updateStillPointInteraction() {
    if (!state.nullChamberAvailable) return;
    if (state.nullChamberEntered) return;
    if (state.paused) return;

    /*
     * Still Point Interaction v1.2.
     *
     * Uses the same logical center as the Threshold.
     * The Still Point remains invisible.
     */

    const thresholdX = canvas.width / 2;
    const thresholdY = canvas.height / 2;
    const distanceFromQ = Math.hypot(q.x - thresholdX, q.y - thresholdY);

    const stillPointRadius = 90;
    const maxCharge = 120;

    if (distanceFromQ <= stillPointRadius) {
        state.stillPointCharge = Math.min(
            maxCharge,
            state.stillPointCharge + 1
        );

        if (state.stillPointCharge === 1) {
            state.protocolMessage = "STILL POINT DETECTED";
            state.protocolMessageTimer = 999999;
            state.objectiveText = "HOLD POSITION";
        }

        if (state.stillPointCharge >= 60 && state.stillPointCharge < maxCharge) {
            state.protocolMessage = "FIELD DOES NOT MOVE";
            state.protocolMessageTimer = 999999;
            state.objectiveText = "REMAIN";
        }

        if (state.stillPointCharge >= maxCharge) {
            state.nullChamberEntered = true;
            state.protocolMessage = "NULL CHAMBER ENTERED";
            state.protocolMessageTimer = 999999;
            state.objectiveText = "BE STILL";
            console.log("NULL CHAMBER ENTERED");
        }

        return;
    }

    state.stillPointCharge = Math.max(
        0,
        state.stillPointCharge - 2
    );
}
function updateNullChamberStillness() {
    if (!state.nullChamberEntered) return;
    if (state.paused) return;

    /*
     * Null Chamber Stillness Lock v1.
     *
     * Not a hard movement block.
     * The chamber softly recalls Q toward the center.
     * Movement becomes possible, but narratively irrelevant.
     */

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const pullStrength = 0.012;

    q.targetX += (centerX - q.targetX) * pullStrength;
    q.targetY += (centerY - q.targetY) * pullStrength;

    q.x += (centerX - q.x) * pullStrength * 0.35;
    q.y += (centerY - q.y) * pullStrength * 0.35;
}
function updateNullChamberHoldResponse() {
    if (!state.nullChamberEntered) return;
    if (state.paused) return;
    if (state.nullChamberHoldConfirmed) return;

    /*
     * Null Chamber Hold Response v1.
     *
     * No reward.
     * No explanation.
     * The chamber simply acknowledges sustained stillness.
     */

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distanceFromQ = Math.hypot(q.x - centerX, q.y - centerY);

    const holdRadius = 70;
    const requiredHold = 180;

    if (distanceFromQ <= holdRadius) {
        state.nullChamberHoldCharge++;

        if (state.nullChamberHoldCharge >= requiredHold) {
            state.nullChamberHoldConfirmed = true;
            state.protocolMessage = "CENTER HOLDS";
            state.protocolMessageTimer = 999999;
            state.objectiveText = "BE STILL";
            console.log("CENTER HOLDS");
        }

        return;
    }

    state.nullChamberHoldCharge = Math.max(
        0,
        state.nullChamberHoldCharge - 2
    );
}
function updateNullChamberFormingSignal() {
    if (!state.nullChamberEntered) return;
    if (!state.nullChamberHoldConfirmed) return;
    if (state.nullChamberFormingShown) return;
    if (state.paused) return;

    /*
     * Null Chamber Forming Signal v1.
     *
     * After CENTER HOLDS, the chamber begins to prepare something.
     * No nuclei yet.
     * Only a protocol shift.
     */

    state.nullChamberFormingCharge++;

    if (state.nullChamberFormingCharge >= 150) {
        state.nullChamberFormingShown = true;
        state.protocolMessage = "FORMING";
        state.protocolMessageTimer = 999999;
        state.objectiveText = "BE STILL";
        console.log("FORMING");
    }
}
function updateNullChamberNucleiAppearance() {
    if (!state.nullChamberEntered) return;
    if (!state.nullChamberFormingShown) return;
    if (state.nullChamberNucleiVisible) return;
    if (state.paused) return;

    /*
     * Three Nuclei Appearance v1.
     *
     * No choice.
     * No interaction.
     * The chamber only reveals that three signals have formed.
     */

    state.nullChamberNucleiCharge++;

    if (state.nullChamberNucleiCharge >= 180) {
        state.nullChamberNucleiVisible = true;
        state.protocolMessage = "THREE SIGNALS FORM";
        state.protocolMessageTimer = 999999;
        state.objectiveText = "BE STILL";
        console.log("THREE SIGNALS FORM");
    }
}
  function drawThresholdPresence() {
        if (!state.thresholdDetected) return;
        if (state.nullFieldActive) return;

        const thresholdX = canvas.width / 2;
        const thresholdY = canvas.height / 2;
        const distanceFromQ = Math.hypot(q.x - thresholdX, q.y - thresholdY);

        const time = Date.now() * 0.002;
        const proximity = Math.max(0, 1 - distanceFromQ / 260);
        const entryRatio = Math.min(1, state.thresholdEntryCharge / 120);

        const baseRadius = 42 + Math.sin(time) * 4;
        const outerRadius = 78 + Math.sin(time * 0.7) * 8 + proximity * 18 + entryRatio * 18;

        ctx.save();

        /*
         * Threshold Entry v1.
         *
         * The Threshold is still not a full portal.
         * Q can now stabilize it by remaining close enough.
         */

        ctx.globalAlpha = 0.12 + proximity * 0.18 + entryRatio * 0.16;
        ctx.strokeStyle = "rgba(255, 235, 180, 0.75)";
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 22 + proximity * 18 + entryRatio * 24;
        ctx.shadowColor = "#ffe7b4";

        ctx.beginPath();
        ctx.arc(thresholdX, thresholdY, outerRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.22 + proximity * 0.28 + entryRatio * 0.18;
        ctx.strokeStyle = state.thresholdEntered
            ? "rgba(191, 250, 255, 0.95)"
            : "rgba(255, 170, 51, 0.85)";
        ctx.lineWidth = 1.5 + entryRatio;

        ctx.beginPath();
        ctx.arc(thresholdX, thresholdY, baseRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.45 + proximity * 0.35;
        ctx.fillStyle = state.thresholdEntered
            ? "rgba(191, 250, 255, 0.95)"
            : "rgba(255, 235, 180, 0.95)";
        ctx.shadowBlur = 16 + proximity * 12 + entryRatio * 20;
        ctx.shadowColor = state.thresholdEntered ? "#bffaff" : "#ffe7b4";
        ctx.font = "bold 26px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

    ctx.fillText(
    state.nullFieldActive || state.thresholdEntered ? "<<<" : ">>>",
    thresholdX,
    thresholdY
);

        if (proximity > 0.25) {
            ctx.globalAlpha = proximity * 0.35 + entryRatio * 0.25;
            ctx.strokeStyle = "rgba(191, 250, 255, 0.85)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(q.x, q.y);
            ctx.lineTo(thresholdX, thresholdY);
            ctx.stroke();
        }

        if (!state.thresholdEntered && proximity > 0.65) {
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = "rgba(255, 235, 180, 0.95)";
            ctx.font = "12px monospace";
            ctx.fillText("SIGNAL STABLE", thresholdX, thresholdY + outerRadius + 24);
        }

        if (!state.thresholdEntered && entryRatio > 0.05) {
            ctx.globalAlpha = 0.65;
            ctx.strokeStyle = "rgba(191, 250, 255, 0.85)";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(
                thresholdX,
                thresholdY,
                outerRadius + 14,
                -Math.PI / 2,
                -Math.PI / 2 + Math.PI * 2 * entryRatio
            );
            ctx.stroke();
        }

      if (state.nullFieldActive) {
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = "rgba(191, 250, 255, 0.95)";
    ctx.font = "12px monospace";
    ctx.fillText("NULL FIELD", thresholdX, thresholdY + outerRadius + 24);
} else if (state.thresholdEntered) {
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = "rgba(191, 250, 255, 0.95)";
    ctx.font = "12px monospace";
    ctx.fillText("TRANSFER ACCEPTED", thresholdX, thresholdY + outerRadius + 24);
}

        ctx.restore();

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }

function drawNullFieldAtmosphere() {
    if (!state.nullFieldActive) return;

    const time = Date.now() * 0.0015;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();

    /*
     * Null Field Atmosphere Light v1.
     *
     * No portal.
     * No heavy overlay.
     * No central object.
     * Just a quiet atmospheric response after the loop is broken.
     */

    const pulse = 0.5 + Math.sin(time * 1.4) * 0.5;

    // Very light peripheral breathing lines
    ctx.globalAlpha = 0.08 + pulse * 0.05;
    ctx.strokeStyle = "rgba(191, 250, 255, 0.85)";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#bffaff";

    ctx.beginPath();
    ctx.moveTo(40, centerY - 120);
    ctx.lineTo(40, centerY + 120);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - 40, centerY - 120);
    ctx.lineTo(canvas.width - 40, centerY + 120);
    ctx.stroke();

    // Subtle inverted signal, small and non-portal-like
    ctx.globalAlpha = 0.22 + pulse * 0.12;
    ctx.fillStyle = "rgba(191, 250, 255, 0.95)";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#bffaff";

    ctx.fillText("<<<", centerX, centerY + 92);

    // Tiny field hint.
// Once the Null Chamber is entered, the Field no longer labels itself.
if (!state.nullChamberEntered) {
    ctx.globalAlpha = 0.18 + pulse * 0.08;
    ctx.font = "10px monospace";
    ctx.fillText("FIELD LISTENING", centerX, centerY + 116);
}

    ctx.restore();

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
}
function drawNullChamberArrival() {
    if (!state.nullChamberEntered) return;

    /*
     * Null Chamber Arrival State v1.
     *
     * Not a room yet.
     * Not a portal.
     * A quiet organized void after the Still Point accepts Q.
     */

    const time = Date.now() * 0.001;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const pulse = 0.5 + Math.sin(time * 0.8) * 0.5;
const holdConfirmed = state.nullChamberHoldConfirmed;
const chamberAlphaBoost = holdConfirmed ? 0.08 : 0;
const chamberRadiusBoost = holdConfirmed ? 18 : 0;
    ctx.save();

    // Quiet central field
   
    ctx.strokeStyle = "rgba(191, 250, 255, 0.9)";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#bffaff";

    ctx.beginPath();
    ctx.arc(centerX, centerY, 96 + chamberRadiusBoost + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();

    // Still horizontal axis
    ctx.globalAlpha = 0.10 + pulse * 0.04;
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY);
    ctx.lineTo(centerX + 150, centerY);
    ctx.stroke();

    // Still vertical axis
    ctx.globalAlpha = 0.07 + pulse * 0.03;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 120);
    ctx.lineTo(centerX, centerY + 120);
    ctx.stroke();

    // Minimal chamber signal
    ctx.globalAlpha = 0.34 + pulse * 0.08;
    ctx.fillStyle = "rgba(191, 250, 255, 0.95)";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#bffaff";
    ctx.fillText("STILL", centerX, centerY + 132);
if (holdConfirmed) {
    ctx.globalAlpha = 0.26 + pulse * 0.08;
    ctx.font = "10px monospace";
    ctx.fillText("FORMING", centerX, centerY + 154);
}
    ctx.restore();

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
}
function drawNullChamberNuclei() {
    if (!state.nullChamberNucleiVisible) return;

    /*
     * Three Nuclei Appearance v1.
     *
     * Visible only.
     * No selection state.
     * No benefit.
     */

    const time = Date.now() * 0.001;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const pulse = 0.5 + Math.sin(time * 1.2) * 0.5;

    const nuclei = [
        {
            x: centerX - 135,
            y: centerY - 95,
            radius: 13 + pulse * 2,
            color: "rgba(255, 170, 51, 0.92)",
            shadow: "#ffaa33"
        },
        {
            x: centerX + 135,
            y: centerY - 95,
            radius: 13 + Math.sin(time * 1.4 + 1.7) * 2,
            color: "rgba(191, 250, 255, 0.92)",
            shadow: "#bffaff"
        },
        {
            x: centerX,
            y: centerY + 120,
            radius: 13 + Math.sin(time * 1.1 + 3.1) * 2,
            color: "rgba(180, 255, 210, 0.88)",
            shadow: "#7cffb4"
        }
    ];

    ctx.save();

    nuclei.forEach((nucleus) => {
        ctx.globalAlpha = 0.16;
        ctx.strokeStyle = nucleus.color;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 18;
        ctx.shadowColor = nucleus.shadow;

        ctx.beginPath();
        ctx.arc(nucleus.x, nucleus.y, nucleus.radius + 18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.52 + pulse * 0.18;
        ctx.fillStyle = nucleus.color;
        ctx.shadowBlur = 24;
        ctx.shadowColor = nucleus.shadow;

        ctx.beginPath();
        ctx.arc(nucleus.x, nucleus.y, nucleus.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.20;
        ctx.strokeStyle = nucleus.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nucleus.x, nucleus.y);
        ctx.stroke();
    });

    ctx.restore();
}
    function updateThresholdEntry() {
        if (!state.thresholdDetected) return;
        if (state.thresholdEntered) return;
        if (state.paused) return;

        const thresholdX = canvas.width / 2;
        const thresholdY = canvas.height / 2;
        const distanceFromQ = Math.hypot(q.x - thresholdX, q.y - thresholdY);

        const entryRadius = 82;
        const maxCharge = 120;

        if (distanceFromQ <= entryRadius) {
            state.thresholdEntryCharge = Math.min(
                maxCharge,
                state.thresholdEntryCharge + 1
            );

            if (state.thresholdEntryCharge === 1) {
                state.protocolMessage = "SIGNAL LOCK";
                state.protocolMessageTimer = 80;
            }

            if (state.thresholdEntryCharge >= maxCharge) {
                state.thresholdEntered = true;
                state.protocolMessage = "TRANSFER ACCEPTED";
                state.protocolMessageTimer = 180;
                state.objectiveText = "AWAITING NULL FIELD";

                console.log("THRESHOLD ENTERED - transfer accepted");
            }

            return;
        }

        state.thresholdEntryCharge = Math.max(
            0,
            state.thresholdEntryCharge - 2
        );
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

    function drawWorld() {
        const worldShakeActive =
            state.started &&
            !state.paused &&
            state.cycleCount === state.maxCycles;

        const worldShakeAmount = worldShakeActive ? 3 : 0;

        ctx.save();

        if (worldShakeActive) {
            const shakeX = (Math.random() - 0.5) * worldShakeAmount;
            const shakeY = (Math.random() - 0.5) * worldShakeAmount;
            ctx.translate(shakeX, shakeY);
        }

        drawFragments(ctx, fragments, q);
drawResonance();
drawThresholdPresence();
drawNullFieldAtmosphere();
drawNullChamberArrival();
drawNullChamberNuclei();
drawObserver(ctx, observer, q, state);
drawQ(ctx, q, state);

        ctx.restore();
    }
function drawMainHUD(blink) {
    if (state.nullChamberEntered) {
        drawText(`Q ${state.quantumScore}`, 20, 40, 24, "#bffaff");
        drawText("N U L L   C H A M B E R", 20, 70, 12, "rgba(191, 250, 255, 0.75)");
        drawDashedLine(20, 58, 190, "#00d4ff");

        drawText("CYCLE: NULL", 20, 95, 18, "#ffaa33");
        drawText("TRACE STATUS: SUSPENDED", 20, 125, 12, "rgba(255, 170, 51, 0.8)");
        drawDashedLine(20, 115, 260, "#ffaa33");

        drawText("OBJECTIVE:", 20, 155, 16, "#bffaff");
        drawText(`> ${state.objectiveText || "BE STILL"}${blink ? "_" : ""}`, 20, 190, 20, "#00d4ff");

        if (state.protocolMessage) {
            drawDashedLine(20, canvas.height - 140, canvas.width - 40, "#ffaa33");
            drawText(state.protocolMessage, 40, canvas.height - 100, 20, "#ffaa33");

            drawText(
                `> <<<${blink ? "_" : ""}`,
                40,
                canvas.height - 60,
                26,
                "#ffaa33"
            );

            drawDashedLine(20, canvas.height - 35, canvas.width - 40, "#ffaa33");
        }

        return;
    }

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
}

    function drawPauseOverlay() {
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
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!state.started) {
            drawStartOverlay();
            requestAnimationFrame(draw);
            return;
        }

        if (state.paused) {
            const blink = Math.floor(Date.now() / 500) % 2 === 0;

            drawWorld();
            drawMainHUD(blink);
            drawHUD();
            drawPauseOverlay();

            requestAnimationFrame(draw);
            return;
        }

       updateQ(q);
updateNullChamberStillness();
updateNullChamberHoldResponse();
updateNullChamberFormingSignal();
updateNullChamberNucleiAppearance();

       if (state.memoryTraceTriggered && !state.nullFieldActive) {
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
        updateThresholdEntry();

        if (!observer.emerged && !observer.emerging) {
            triggerObserverEmergence(observer);
        }

     updateObserver(observer, q, state);
updateNullFieldListening();
updateStillPointInteraction();

const blink = Math.floor(Date.now() / 500) % 2 === 0;
updateProtocolMessages();
        drawWorld();
        drawMainHUD(blink);
        drawHUD();

        requestAnimationFrame(draw);
    }

    function drawHUD() {
            if (state.nullChamberEntered) {
        const startX = canvas.width - 220;

        ctx.font = "16px monospace";
        ctx.fillStyle = "#bffaff";
        ctx.fillText("Field:", startX, 40);

        ctx.font = "14px monospace";
        ctx.fillStyle = "rgba(191, 250, 255, 0.75)";
        ctx.fillText("silent", startX, 70);
        ctx.fillText("movement irrelevant", startX, 95);
        ctx.fillText("remain", startX, 120);

        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.font = "12px monospace";
        ctx.fillText("Press SPACE to Pause", startX, canvas.height - 30);

        return;
    }
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