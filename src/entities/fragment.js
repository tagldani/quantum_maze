const FRAGMENT_TYPES = [
  {
    type: "normal",
    score: 1,
    color: "#00d4ff",
    effect: null
  },
  {
    type: "unstable",
    score: 2,
    color: "#ffae00",
    effect: "desync"
  },
  {
    type: "echo",
    score: 2,
    color: "#a4fffb",
    effect: "echo"
  },
  {
    type: "hidden",
    score: 3,
    color: "#22ff88",
    effect: null
  }
];

export function createFragments() {
  return [];
}

export function spawnFragments(fragments, width, height) {
  fragments.length = 0;

  const safeWidth = width || window.innerWidth || 800;
  const safeHeight = height || window.innerHeight || 600;

  const margin = 90;

  // IMPORTANT:
  // The cycle progression logic completes a cycle after 5 collected fragments.
  // Therefore we spawn exactly 5 fragments per cycle.
  const count = 5;

  for (let i = 0; i < count; i++) {
    const template = FRAGMENT_TYPES[i % FRAGMENT_TYPES.length];

    fragments.push({
      id: `${Date.now()}-${i}-${Math.random()}`,
      x: margin + Math.random() * Math.max(1, safeWidth - margin * 2),
      y: margin + Math.random() * Math.max(1, safeHeight - margin * 2),
      radius: 10,
      collected: false,
      pulse: Math.random() * Math.PI * 2,
      type: template.type,
      score: template.score,
      color: template.color,
      effect: template.effect
    });
  }

  console.log("Fragments spawned:", fragments);
}

export function drawFragments(ctx, fragments, q) {
  fragments.forEach(fragment => {
    if (fragment.collected) return;

    fragment.pulse += 0.05;

    const pulse = Math.sin(fragment.pulse) * 2;
    const radius = fragment.radius + pulse;

    let alpha = 1;

    if (fragment.type === "hidden" && q) {
      const distanceFromQ = Math.hypot(q.x - fragment.x, q.y - fragment.y);
      alpha = distanceFromQ < 160 ? 1 : 0.25;
    }

    ctx.save();

    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 20;
    ctx.shadowColor = fragment.color;

    ctx.fillStyle = fragment.color;
    ctx.beginPath();
    ctx.arc(fragment.x, fragment.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(fragment.x, fragment.y, radius + 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  });
}