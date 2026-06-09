import { createGame } from "./core/game.js";

const canvas = document.getElementById("gameCanvas");

if (!canvas) {
    throw new Error("Canvas #gameCanvas not found.");
}

const game = createGame(canvas);
game.start();
