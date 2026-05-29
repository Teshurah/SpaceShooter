window.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===================== UI =====================
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");

// ===================== GAME STATE =====================
let state = "menu";
let score = 0;
let gameOver = false;

// ===================== INPUT =====================
let keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// ===================== PLAYER =====================
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    size: 40,
    speed: 6
};

// ===================== BULLETS =====================
let bullets = [];

function shoot() {
    bullets.push({
        x: player.x,
        y: player.y,
        size: 6,
        speed: 10
    });
}

// cooldown
let shootCooldown = 0;

// ===================== ASTEROIDS =====================
let asteroids = [];

function spawnAsteroid() {
    asteroids.push({
        x: Math.random() * canvas.width,
        y: -50,
        size: Math.random() * 30 + 20,
        speed: Math.random() * 2 + 1
    });
}

let asteroidTimer = 0;

// ===================== START GAME =====================
startBtn.addEventListener("click", () => {
    state = "playing";
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    resetGame();
    requestAnimationFrame(gameLoop);
});

// ===================== RESET =====================
function resetGame() {
    score = 0;
    gameOver = false;
    bullets = [];
    asteroids = [];
    player.x = canvas.width / 2;
}

// ===================== UPDATE =====================
function update() {

    // movement
    if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
    if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

    // keep player in bounds
    player.x = Math.max(20, Math.min(canvas.width - 20, player.x));

    // shooting
    shootCooldown--;
    if ((keys[" "] || keys["Spacebar"]) && shootCooldown <= 0) {
        shoot();
        shootCooldown = 15;
    }

    // bullets
    bullets.forEach(b => b.y -= b.speed);
    bullets = bullets.filter(b => b.y > -20);

    // asteroids
    asteroidTimer++;
    if (asteroidTimer > 50) {
        spawnAsteroid();
        asteroidTimer = 0;
    }

    asteroids.forEach(a => a.y += a.speed);

    // COLLISION: bullets vs asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {

            let dx = asteroids[i].x - bullets[j].x;
            let dy = asteroids[i].y - bullets[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < asteroids[i].size / 2) {
                asteroids.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                break;
            }
        }
    }

    // COLLISION: player vs asteroids
    for (let a of asteroids) {
        let dx = a.x - player.x;
        let dy = a.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < a.size / 2 + player.size / 2) {
            gameOver = true;
            state = "gameover";
        }
    }

    // remove off screen asteroids
    asteroids = asteroids.filter(a => a.y < canvas.height + 50);
}

// ===================== DRAW =====================
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    // player
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x - 20, player.y - 20, player.size, player.size);

    // bullets
    ctx.fillStyle = "yellow";
    bullets.forEach(b => {
        ctx.fillRect(b.x - 2, b.y, b.size, b.size * 2);
    });

    // asteroids
    ctx.fillStyle = "gray";
    asteroids.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // GAME OVER SCREEN
    if (state === "gameover") {
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Refresh to restart", canvas.width / 2 - 100, canvas.height / 2 + 40);
    }
}

// ===================== LOOP =====================
function gameLoop() {
    if (state === "playing") {
        update();
    }

    draw();
    requestAnimationFrame(gameLoop);
}

}); // DOMContentLoaded
