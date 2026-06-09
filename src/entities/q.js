export function createQ() {
    return {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        radius: 14,
        speed: 0.18
    };
}

export function updateQ(q) {
    const dx = q.targetX - q.x;
    const dy = q.targetY - q.y;
    const distance = Math.hypot(dx, dy) || 1;

    const moveFactor = Math.min(1, distance / 180);
    q.vx += (dx / distance) * q.speed * 18 * moveFactor;
    q.vy += (dy / distance) * q.speed * 18 * moveFactor;

    q.vx *= 0.86;
    q.vy *= 0.86;

    q.x += q.vx;
    q.y += q.vy;
}

export function drawQ(ctx, q, state) {
    const pulse = 1 + 0.08 * Math.sin((performance.now() * 0.003) + q.x * 0.01);
    const radius = (q.radius || 14) * pulse;

    ctx.save();
    ctx.translate(q.x, q.y);

    ctx.shadowBlur = 18;
    ctx.shadowColor = "rgba(0, 212, 255, 0.75)";
    ctx.fillStyle = "rgba(191, 250, 255, 0.95)";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = state && state.memoryTraceActive ? "rgba(255, 170, 51, 0.9)" : "rgba(0, 212, 255, 0.75)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(2, 6, 23, 0.35)";
    ctx.beginPath();
    ctx.arc(-4, -3, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
