export function createQ() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;

  return {
    x,
    y,
    targetX: x,
    targetY: y,

    vx: 0,
    vy: 0,

    radius: 17,

    // Movement identity
    mass: 0.92,
    pull: 0.018,
    damping: 0.91,
    maxSpeed: 7.2,

    // Internal instability
    pulse: 0,
    distortion: 0,
    phase: Math.random() * Math.PI * 2,

    // Used only for subtle spatial alteration, not a trail
    lastX: x,
    lastY: y
  };
}

export function updateQ(q) {
  q.lastX = q.x;
  q.lastY = q.y;

  const dx = q.targetX - q.x;
  const dy = q.targetY - q.y;
  const distance = Math.hypot(dx, dy);

  if (distance > 0.01) {
    const nx = dx / distance;
    const ny = dy / distance;

    // Pull grows slightly with distance, but never becomes cartoon-fast.
    const pullStrength = Math.min(distance * q.pull, 1.15);

    q.vx += nx * pullStrength;
    q.vy += ny * pullStrength;
  }

  // Heavy damping: Q has mass, it does not snap to the pointer.
  q.vx *= q.damping * q.mass;
  q.vy *= q.damping * q.mass;

  // Speed cap keeps Q stable and dense.
  const speed = Math.hypot(q.vx, q.vy);
  if (speed > q.maxSpeed) {
    const scale = q.maxSpeed / speed;
    q.vx *= scale;
    q.vy *= scale;
  }

  // Subtle non-mechanical internal drift.
  // This is not cartoon wobble: it should feel like containment instability.
  q.phase += 0.018;
  const instability = Math.min(speed / q.maxSpeed, 1);

  const driftX = Math.sin(q.phase * 1.7) * 0.10 * instability;
  const driftY = Math.cos(q.phase * 1.3) * 0.10 * instability;

  q.x += q.vx + driftX;
  q.y += q.vy + driftY;

  q.pulse += 0.045 + instability * 0.025;
  q.distortion = 0.5 + instability * 1.4;
}

export function drawQ(ctx, q, state) {
  const innerPulse = Math.sin(q.pulse) * 1.5;
  const unstablePulse = Math.sin(q.pulse * 0.43 + q.phase) * 0.9;

  const radius = q.radius + innerPulse + unstablePulse;

  const speed = Math.hypot(q.vx, q.vy);
  const instability = Math.min(speed / q.maxSpeed, 1);

  ctx.save();

  // Spatial alteration field: not energy, not a trail.
  ctx.globalAlpha = 0.18 + instability * 0.12;
  ctx.strokeStyle = "rgba(190, 250, 255, 0.42)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.ellipse(
    q.x,
    q.y,
    radius + 18 + q.distortion * 2,
    radius + 13 + q.distortion,
    Math.atan2(q.vy, q.vx || 0.001),
    0,
    Math.PI * 2
  );
  ctx.stroke();

  ctx.globalAlpha = 1;

  // Body: contained impossible matter.
  const gradient = ctx.createRadialGradient(
    q.x - radius * 0.35,
    q.y - radius * 0.45,
    radius * 0.2,
    q.x,
    q.y,
    radius * 1.4
  );

  gradient.addColorStop(0, "#e8ffff");
  gradient.addColorStop(0.22, "#7adce8");
  gradient.addColorStop(0.58, "#102838");
  gradient.addColorStop(1, "#02070c");

  ctx.fillStyle = gradient;
  ctx.strokeStyle = "rgba(210, 255, 255, 0.9)";
  ctx.lineWidth = 1.6;

  ctx.shadowBlur = 14;
  ctx.shadowColor = "rgba(125, 238, 255, 0.55)";

  ctx.beginPath();
  ctx.arc(q.x, q.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Internal containment fracture: suggests something inside, not a face/icon.
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.42;

  ctx.strokeStyle = "rgba(230, 255, 255, 0.75)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.arc(
    q.x + Math.sin(q.phase) * 2,
    q.y + Math.cos(q.phase * 0.8) * 2,
    radius * 0.42,
    q.phase,
    q.phase + Math.PI * 1.25
  );
  ctx.stroke();

  ctx.globalAlpha = 1;

  // Minimal Q mark: present, but not playful.
  ctx.fillStyle = "rgba(230, 255, 255, 0.88)";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Q", q.x, q.y + 0.5);

  if (state?.memoryTraceActive) {
    ctx.globalAlpha = 0.23;
    ctx.strokeStyle = "rgba(164, 255, 251, 0.7)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(q.x, q.y, radius + 28, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  ctx.restore();

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}