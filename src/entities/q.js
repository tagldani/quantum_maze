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

export function drawQ(ctx, q) {
    ctx.save();
    ctx.translate(q.x, q.y);

    ctx.shadowBlur = 16;
    ctx.shadowColor = "#00d4ff";
    ctx.fillStyle = "#bffaff";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Q", 0, 6);
    ctx.restore();
}
