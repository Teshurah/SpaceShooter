const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");

let playerX = window.innerWidth / 2;
let bullets = [];

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    playerX -= 20;
  }
  if (e.key === "ArrowRight") {
    playerX += 20;
  }
  if (e.key === " ") {
    shoot();
  }

  player.style.left = playerX + "px";
});

// 🔫 Shoot bullet
function shoot() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.style.left = playerX + "px";
  bullet.style.bottom = "80px";

  gameArea.appendChild(bullet);
  bullets.push(bullet);
}
