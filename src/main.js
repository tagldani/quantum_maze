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

spawnFragments();

let quantumScore = 0;
let cycleCount = 1;
const maxCycles = 3;
let protocolMessage = "";
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

        protocolMessage = `CYCLE ${cycleCount} INITIALIZED`;

        setTimeout(() => {
            protocolMessage = "";
            spawnFragments();
        }, 700);

    } else {

        protocolMessage = "PATTERN RECOGNITION: STABLE";
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateQ();
    checkCollection();
checkCycleComplete();
   drawFragments();
    drawResonance();

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(
        `Q ${quantumScore}`,
        20,
        40
    );

ctx.font = "16px Arial";
ctx.fillStyle = "#ffaa33";

ctx.fillText(
    `CYCLE ${cycleCount}/${maxCycles}`,
    20,
    70
);

if (protocolMessage) {

    ctx.font = "18px Arial";
    ctx.fillStyle = "#ffaa33";

    ctx.fillText(
        protocolMessage,
        20,
        110
    );

}






    drawQ();

    requestAnimationFrame(draw);
}

draw();