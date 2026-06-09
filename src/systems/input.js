import { resumeAudio } from "./audio.js";

export function setupInput(canvas, q, state) {
    canvas.addEventListener("click", event => {
        if (state.paused) return;

        q.targetX = event.clientX;
        q.targetY = event.clientY;
        state.started = true;
        void resumeAudio();
    });

    canvas.addEventListener("touchstart", event => {
        if (state.paused) return;

        const touch = event.touches[0];
        q.targetX = touch.clientX;
        q.targetY = touch.clientY;
        state.started = true;
        void resumeAudio();
    });

    window.addEventListener("keydown", event => {
        if (event.code === "Space") {
            if (!state.started) {
                state.started = true;
            } else {
                state.paused = !state.paused;
            }
            event.preventDefault();
            return;
        }

        const step = 40;
        if (event.code === "ArrowLeft") q.targetX -= step;
        else if (event.code === "ArrowRight") q.targetX += step;
        else if (event.code === "ArrowUp") q.targetY -= step;
        else if (event.code === "ArrowDown") q.targetY += step;
    });
}
