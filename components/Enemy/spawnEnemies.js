import { canvas } from "../context.js";
import { Enemy } from "./Enemy.js";
import { enemies } from "../../index.js";
const start = () => setInterval(() => {
  const radius = Math.random() * (30 - 4) + 4;

  let x;
  let y;
  if(Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    y = Math.random() * canvas.height;
  } else {
    x = Math.random() * canvas.width;
    y = Math.random() > 0.5 ? 0 - radius : canvas.height + radius;
  }

  const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
  const angle = Math.atan2(
    canvas.height / 2 - y,
    canvas.width / 2 - x,
  )

  const valocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  }
  enemies.push(new Enemy(
    x, y, radius, color, valocity
  ))
  console.log(enemies)
}, 1000);

const stop = () => clearInterval(start)


export function spawnEnemies() {
  start()
}
export function stopSpawningEnemies() {
  stop()
}
