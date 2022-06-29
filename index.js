import { canvas, context } from "./components/context.js";
import { Player } from "./components/Player.js"
import {Projectile} from './components/Projectile.js'


canvas.width = innerWidth;
canvas.height = innerHeight;


const x = canvas.width / 2;
const y = canvas.height / 2;


const player = new Player(x, y, 30, 'blue')

const projectiles = []


function animate () {
  requestAnimationFrame(animate); 
  context.clearRect(0, 0, canvas.width, canvas.height)
player.draw();

  projectiles.forEach(projectile => {
    projectile.update()
  });

}

addEventListener('click', (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2,
  )

  const valocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  }
  console.log(angle)
  // Math.atan() - helps to get the angle form the center to the place of users click


  projectiles.push(new Projectile(
    canvas.width / 2, 
    canvas.height /2, 
    5,
    'red',
    valocity,
  ))
})

animate()