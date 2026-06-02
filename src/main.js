const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();

window.addEventListener("resize", resize);

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();

    requestAnimationFrame(draw);
}

draw();