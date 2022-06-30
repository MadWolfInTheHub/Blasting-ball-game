import { canvas, context } from "./components/context.js";
import { Player } from "./components/Player.js"
import { Projectile } from './components/Projectile.js'
import { spawnEnemies, stopSpawningEnemies } from "./components/Enemy/spawnEnemies.js";
import { Partycle } from "./components/Partycle/Partycle.js";

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#score")
const startGameBtn = document.querySelector('#startGameBtn')
const modulEl = document.querySelector('#modulEl')
const scoreBoard = document.querySelector('#scoreBoard')

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 15, 'white')
let particles = []
let projectiles = []
export let enemies = []

function init() {
  player = new Player(x, y, 15, 'white')
  projectiles = []
  enemies =  []
  particles = []
  score = 0;
  scoreEl.innerHTML = score
  scoreBoard.innerHTML = score
}

let animationId
let score = 0;

function animate () {
  animationId = requestAnimationFrame(animate);
  context.fillStyle = 'rgb(0, 0, 0, 0.1)'
  context.fillRect(0, 0, canvas.width, canvas.height)
  player.draw();

  particles.forEach((particle, index) => {
    if(particle.alpha <= 0 ){
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update()

    if(projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height 
      ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  });

  enemies.forEach((enemy, index )=> {
    enemy.update()

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    
    // end game

    if(dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
      modulEl.style.display = 'flex'
      scoreBoard.innerHTML = score
      stopSpawningEnemies()
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // when projectile touch enemy

      if(dist - enemy.radius - projectile.radius < 1) {

        // create explotins

        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Partycle(
            projectile.x, 
            projectile.y,
            Math.random() * 2, 
            enemy.color,
            {
              x:( Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            }
          ))
        }

        if(enemy.radius - 10 > 5) {

          // increase score
          score += 10
          scoreEl.innerHTML = score

          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1)
          }, 0)
        } else {

            // increase score bunus
            score += 25
            scoreEl.innerHTML = score

          setTimeout(() => {
            enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0)
        }
      }
      
    })
  })
}

// EventListener added to the window allowa you to strike to the specific point on the screen
addEventListener('click', (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2,
  )

  const valocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  }
  console.log(angle)
  // Math.atan() - helps to get the angle form the center to the place of users click


  projectiles.push(new Projectile(
    canvas.width / 2, 
    canvas.height /2, 
    5,
    'white',
    valocity,
  ))
})


startGameBtn.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  modulEl.style.display = 'none'
})
// first learn about Math methods (sinc, cos atan@, hypot)
// secondly learn about Canvas functions such as cancelAnimationFrame(), requestAnimationFrame()
// third learn about fillStyle, fillRect methods
// forth learn zbout library animation Gsap - greenSock (gsap cloudFlare)
