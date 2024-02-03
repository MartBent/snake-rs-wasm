import { Game } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/gameoflife_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";

const game = Game.new(32)

const width = game.size()
const height = game.size()

export function getRandomNumber(limit) {
  Math.floor(Math.random() * limit - 1);   
}

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case 'w':
        game.set_direction(0);
        break;
      case 's':
        game.set_direction(1);
        break;
      case 'a':
        game.set_direction(2);
        break;
      case 'd':
        game.set_direction(3);
        break;
    }
});

const ctx = canvas.getContext("2d");

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const drawCells = () => {
  const cellsPtr = game.render();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height * 3);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = game.get_pixel_buffer_index(row, col);

      let red = cells[idx];
      let green = cells[idx + 1];
      let blue = cells[idx + 2];

      let color = `rgb(${red}, ${green}, ${blue})`
      ctx.fillStyle = color;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const renderLoop = async () => {

  await new Promise(r => setTimeout(r, 50));

  game.tick();

  drawGrid();
  drawCells();

  requestAnimationFrame(renderLoop);
};
requestAnimationFrame(renderLoop);