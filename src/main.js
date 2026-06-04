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

const fragment = {
    x: window.innerWidth / 2 + 120,
    y: window.innerHeight / 2
};

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

function drawFragment() {
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

    ctx.shadowBlur = 0;
}

function drawQ() {
    const time = Date.now() * 0.003;
    const radius = q.radius + Math.sin(time) * 2;

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

    drawFragment();

    drawQ();

    requestAnimationFrame(draw);
}

draw();