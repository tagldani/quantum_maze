let audioCtx = null;

export async function resumeAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }

    return audioCtx;
}

export async function playCollectSound(fragment) {
    const ctx = await resumeAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";

    // choose frequency by fragment type
    let freq = 440;
    if (fragment && fragment.type === "unstable") freq = 660;
    if (fragment && fragment.type === "echo") freq = 520;
    if (fragment && fragment.type === "visible") freq = 340;

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    // quick decay
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.26);
    osc.stop(ctx.currentTime + 0.28);
}
