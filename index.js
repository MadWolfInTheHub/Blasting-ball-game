import { canvas, context } from "./components/context.js";
import { Player } from "./components/Player.js"
import { Projectile, projectiles } from './components/Projectile.js'
import { spawnEnemies, enemies } from "./components/Enemy/spawnEnemies.js";
import { Partycle, particles } from "./components/Partycle/Partycle.js";
console.log(particles)

canvas.width = innerWidth;
canvas.height = innerHeight;

const x = canvas.width / 2;
const y = canvas.height / 2;


const player = new Player(x, y, 15, 'white')

let animationId

function animate () {
  animationId = requestAnimationFrame(animate);
  context.fillStyle = 'rgb(0, 0, 0, 0.1)'
  context.fillRect(0, 0, canvas.width, canvas.height)
  player.draw();

  particles.forEach(particle => {
    particle.update()
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
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // when projectile touch enemy

      if(dist - enemy.radius - projectile.radius < 1) {

        for (let i = 0; i < 8; i++) {
          particles.push(new Partycle(
            projectile.x, 
            projectile.y,
            3, 
            enemy.color,
            {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            }
          ))
        }

        if(enemy.radius - 10 > 5) {
          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1)
          }, 0)
        } else {
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

animate()
spawnEnemies()


// first learn about Math methods (sinc, cos atan@, hypot)
// secondly learn about Canvas functions such as cancelAnimationFrame(), requestAnimationFrame()
// third learn about fillStyle, fillRect methods
// forth learn zbout library animation Gsap - greenSock (gsap cloudFlare)
