const fragmentTypes = [
    { type: "normal", color: "#00d4ff", score: 10, effect: "none" },
    { type: "unstable", color: "#ffaa33", score: 18, effect: "desync" },
    { type: "echo", color: "#a4fffb", score: 22, effect: "echo" },
    { type: "hidden", color: "#7cffb4", score: 26, effect: "none" }
];

export function createFragments() {
    return [];
}

export function spawnFragments(fragments, width, height) {
    fragments.length = 0;

    const count = Math.min(10, Math.max(6, Math.floor(width / 180)));

    for (let i = 0; i < count; i++) {
        const preset = fragmentTypes[i % fragmentTypes.length];
        fragments.push({
            x: 80 + Math.random() * (width - 160),
            y: 80 + Math.random() * (height - 160),
            radius: 8 + Math.random() * 4,
            collected: false,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: 0.015 + Math.random() * 0.02,
            type: preset.type,
            color: preset.color,
            score: preset.score,
            effect: preset.effect
        });
    }
}

export function drawFragments(ctx, fragments, state) {
    const now = performance.now();
    const cycle = state ? state.cycleCount || 1 : 1;
    const driftActive = cycle >= 3;

    fragments.forEach(fragment => {
        if (fragment.collected) return;

        const prelude = !driftActive ? Math.sin(now * 0.0012 + fragment.drift) * 0.35 : 0;
        const driftX = driftActive
            ? Math.sin(now * fragment.driftSpeed + fragment.drift) * 3
            : prelude;
        const driftY = driftActive
            ? Math.cos(now * fragment.driftSpeed * 1.15 + fragment.drift) * 2.5
            : Math.cos(now * 0.0011 + fragment.drift) * 0.35;
        const x = fragment.x + driftX;
        const y = fragment.y + driftY;

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = fragment.color;
        ctx.fillStyle = fragment.color;
        ctx.beginPath();
        ctx.arc(x, y, fragment.radius + 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, fragment.radius + 2.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}
