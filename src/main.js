const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();

window.addEventListener("resize", resize);

const q = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    vx: 0,
    vy: 0,
    radius: 20
};

const fragments = [];
const observer = {
    x: 80,
    y: window.innerHeight - 60,
    targetX: 80,
    targetY: window.innerHeight - 190,
    pulse: 0,
    emerging: false,
    emerged: false
};
spawnFragments();

let quantumScore = 0;
let cycleCount = 1;
const maxCycles = 3;
let protocolMessage = "";
let protocolMessageTimer = 0;

const fragmentProtocolMessages = [
    "SIGNAL RECEIVED",
    "FRAGMENT ABSORBED",
    "MEMORY TRACE DETECTED",
    "Q IS LEARNING",
    "OBSERVER LINK STABLE"
];
const objectiveText = "STABILIZE 5 FRAGMENTS";
let resonanceTimer = 0;

let resonanceX = 0;
let resonanceY = 0;
canvas.addEventListener("click", (event) => {
    q.targetX = event.clientX;
    q.targetY = event.clientY;
});

canvas.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];

    q.targetX = touch.clientX;
    q.targetY = touch.clientY;
});

function updateQ() {
    const dx = q.targetX - q.x;
    const dy = q.targetY - q.y;

    const acceleration = 0.015;
    const friction = 0.88;

    q.vx += dx * acceleration;
    q.vy += dy * acceleration;

    q.vx *= friction;
    q.vy *= friction;

    q.x += q.vx;
    q.y += q.vy;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        q.vx *= 0.5;
        q.vy *= 0.5;
    }
}
function checkCollection() {

    fragments.forEach(fragment => {

        if (fragment.collected) return;

        const dx = q.x - fragment.x;
        const dy = q.y - fragment.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < q.radius + 8) {

            fragment.collected = true;

            quantumScore++;

const randomIndex = Math.floor(Math.random() * fragmentProtocolMessages.length);
protocolMessage = fragmentProtocolMessages[randomIndex];
protocolMessageTimer = 90;

resonanceTimer = 15;

resonanceX = fragment.x;
resonanceY = fragment.y;

        }

    });

}

function checkCycleComplete() {

    const allCollected = fragments.every(fragment => fragment.collected);

    if (!allCollected) return;

    if (cycleCount < maxCycles) {

        cycleCount++;
if (cycleCount === 2) {
    triggerObserverEmergence();
}
        protocolMessage = `CYCLE ${cycleCount} INITIALIZED`;

        setTimeout(() => {
            protocolMessage = "";
            spawnFragments();
        }, 700);

    } else {

        protocolMessage =
`PATTERN RECOGNITION: STABLE`;
setTimeout(() => {
    protocolMessage = "TRANSFER DENIED";
}, 1200);
    }

}

function drawFragments() {

    fragments.forEach(fragment => {

        if (fragment.collected) return;

        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00d4ff";

        ctx.fillStyle = "#00d4ff";

        ctx.beginPath();

        ctx.arc(
            fragment.x,
            fragment.y,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

    ctx.shadowBlur = 0;
}


function spawnFragments() {

    fragments.length = 0;

    for (let i = 0; i < 5; i++) {

        fragments.push({
            x: Math.random() * (window.innerWidth - 100) + 50,
            y: Math.random() * (window.innerHeight - 100) + 50,
            collected: false
        });

    }

}
function drawResonance() {

    if (resonanceTimer <= 0) return;

    const progress = resonanceTimer / 15;
    const radius = 30 * (1 - progress);

    ctx.strokeStyle = `rgba(0, 212, 255, ${progress})`;
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
        resonanceX,
        resonanceY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();
}
function drawQ() {
    const time = Date.now() * 0.003;
    let radius = q.radius + Math.sin(time) * 2;

if (resonanceTimer > 0) {

    radius += 4;

    resonanceTimer--;
}

    ctx.shadowBlur = 24;
    ctx.shadowColor = "white";

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        q.x,
        q.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;
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

function triggerObserverEmergence() {
    if (observer.emerged || observer.emerging) return;

    observer.x = 80;
    observer.y = window.innerHeight - 60;

    observer.targetX = 80;
    observer.targetY = window.innerHeight - 190;

    observer.emerging = true;
}
function drawObserver() {
    if (!observer.emerged && !observer.emerging) return;

    observer.pulse += 0.04;

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

    const alpha = 0.45 + Math.sin(observer.pulse) * 0.25;

    ctx.font = "26px monospace";
    ctx.fillStyle = `rgba(255, 170, 51, ${alpha})`;
    ctx.shadowBlur = 14;
    ctx.shadowColor = "#ffaa33";

    ctx.fillText(">...", observer.x, observer.y);

    ctx.shadowBlur = 0;
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateQ();
    checkCollection();
    checkCycleComplete();

    drawFragments();
    drawResonance();
drawObserver();
    const blink = Math.floor(Date.now() / 500) % 2 === 0;

    if (protocolMessageTimer > 0) {
    protocolMessageTimer--;
} else if (
    protocolMessage !== `CYCLE ${cycleCount} INITIALIZED` &&
    protocolMessage !== "PATTERN RECOGNITION: STABLE" &&
    protocolMessage !== "TRANSFER DENIED"
) {
    protocolMessage = "";
}

    drawText(`Q ${quantumScore}`, 20, 40, 24, "#bffaff");
    drawDashedLine(20, 58, 150, "#00d4ff");

    drawText(`CYCLE ${cycleCount}/${maxCycles}`, 20, 95, 18, "#ffaa33");
    drawDashedLine(20, 115, 260, "#ffaa33");

    drawText("OBJECTIVE:", 20, 155, 16, "#bffaff");

    drawText(
        `> ${objectiveText}${blink ? "_" : ""}`,
        20,
        190,
        20,
        "#00d4ff"
    );

    if (protocolMessage) {
        drawDashedLine(20, canvas.height - 140, canvas.width - 40, "#ffaa33");

        drawText(
            protocolMessage,
            40,
            canvas.height - 100,
            20,
            "#ffaa33"
        );

       if (!observer.emerged && !observer.emerging) {
    drawText(
        `> ${protocolMessage === "TRANSFER DENIED" ? "TRANSFER DENIED" : "..."}${blink ? "_" : ""}`,
        40,
        canvas.height - 60,
        26,
        "#ffaa33"
    );
}

        drawDashedLine(20, canvas.height - 35, canvas.width - 40, "#ffaa33");
    }

    drawQ();

    requestAnimationFrame(draw);
}

draw();