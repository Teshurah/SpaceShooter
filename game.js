const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// ---------------- IMAGES (FIXED PATHS) ----------------
const shipImg = new Image();
shipImg.src = "./images/ship.png";

const rockImg = new Image();
rockImg.src = "./images/rock.png";

const starImg = new Image();
starImg.src = "./images/star.png";

// ---------------- PLAYER ----------------
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 80,
  width: 50,
  height: 50,
  speed: 7
};

// ---------------- GAME VARIABLES ----------------
let rocks = [];
let stars = [];
let score = 0;
let keys = {};

// ---------------- CONTROLS ----------------
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// ---------------- COLLISION ----------------
function collide(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ---------------- SPAWN OBJECTS ----------------
function spawnRock() {
  rocks.push({
    x: Math.random() * (canvas.width - 40),
    y: -50,
    width: 40,
    height: 40,
    speed: 2 + Math.random() * 3
  });
}

function spawnStar() {
  stars.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 25,
    height: 25,
    speed: 3
  });
}

// ---------------- UPDATE GAME ----------------
function update() {
  // movement
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }

  if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }

  // rocks
  rocks.forEach((rock, i) => {
    rock.y += rock.speed;

    if (rock.y > canvas.height) {
      rocks.splice(i, 1);
    }

    if (collide(player, rock)) {
      alert("💥 Game Over! Score: " + score);
      location.reload();
    }
  });

  // stars
  stars.forEach((star, i) => {
    star.y += star.speed;

    if (star.y > canvas.height) {
      stars.splice(i, 1);
    }

    if (collide(player, star)) {
      score += 10;
      stars.splice(i, 1);
    }
  });

  // spawn rate
  if (Math.random() < 0.02) spawnRock();
  if (Math.random() < 0.01) spawnStar();
}

// ---------------- DRAW ----------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // player
  ctx.drawImage(shipImg, player.x, player.y, player.width, player.height);

  // rocks
  rocks.forEach(r => {
    ctx.drawImage(rockImg, r.x, r.y, r.width, r.height);
  });

  // stars
  stars.forEach(s => {
    ctx.drawImage(starImg, s.x, s.y, s.width, s.height);
  });

  // score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// ---------------- GAME LOOP ----------------
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
