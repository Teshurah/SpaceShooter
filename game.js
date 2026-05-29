const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// =====================
// UI
// =====================
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");

// =====================
// GAME STATE
// =====================
let gameStarted = false;

let asteroids = [];
let stars = [];
let particles = [];

let difficulty = 1;
let difficultyIncrease = 0.002;

// =====================
// IMAGES (FIXED PATHS)
// =====================
const shipImg = new Image();
const rockImg = new Image();
const starImg = new Image();

shipImg.src = "images/ship.png";
rockImg.src = "images/rock.png";
starImg.src = "images/star.png";

let assetsLoaded = 0;
let assetsReady = false;

function onAssetLoad() {
    assetsLoaded++;
    if (assetsLoaded === 3) {
        assetsReady = true;
        console.log("All assets loaded");
    }
}

shipImg.onload = onAssetLoad;
rockImg.onload = onAssetLoad;
starImg.onload = onAssetLoad;

// =====================
// PLAYER
// =====================
const player = {
    x: canvas.width / 2,
    y: canvas.height - 120,
    size: 60
};

// =====================
// START GAME (FIXED)
// =====================
startBtn.addEventListener("click", () => {
    if (gameStarted) return;

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    gameStarted = true;

    stars = [];
    createStars();

    requestAnimationFrame(gameLoop);
});

// =====================
// STARS
// =====================
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.6 + 0.1;
    }

    update() {
        this.y += this.speed;

        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.drawImage(starImg, this.x, this.y, this.size * 4, this.size * 4);
    }
}

function createStars() {
    for (let i = 0; i < 120; i++) {
        stars.push(new Star());
    }
}

// =====================
// PARTICLES
// =====================
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;

        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;

        const colors = ["orange", "yellow", "red"];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function createExplosion(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y));
    }
}

// =====================
// ASTEROIDS
// =====================
class Asteroid {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -60;

        this.size = Math.random() * 40 + 20;
        this.speed = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.y += this.speed * difficulty;
    }

    draw() {
        ctx.drawImage(rockImg, this.x, this.y, this.size, this.size);
    }
}

function spawnAsteroid() {
    asteroids.push(new Asteroid());
}

// spawn loop (safe)
setInterval(() => {
    if (!gameStarted) return;
    spawnAsteroid();
}, 900);

// =====================
// UPDATE
// =====================
function update() {
    difficulty += difficultyIncrease;
    difficulty = Math.min(difficulty, 5);

    stars.forEach(s => s.update());
    asteroids.forEach(a => a.update());
    particles.forEach(p => p.update());

    particles = particles.filter(p => p.life > 0);
    asteroids = asteroids.filter(a => a.y < canvas.height + 100);

    // demo explosions (replace later with real collision)
    for (let i = asteroids.length - 1; i >= 0; i--) {
        if (Math.random() < 0.002) {
            createExplosion(asteroids[i].x, asteroids[i].y);
            asteroids.splice(i, 1);
        }
    }
}

// =====================
// DRAW
// =====================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // stars
    stars.forEach(s => s.draw());

    // asteroids
    asteroids.forEach(a => a.draw());

    // particles
    particles.forEach(p => p.draw());

    // player ship
    ctx.drawImage(
        shipImg,
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}

// =====================
// GAME LOOP (FIXED)
// =====================
function gameLoop() {
    if (!gameStarted) return;

    if (!assetsReady) {
        requestAnimationFrame(gameLoop);
        return;
    }

    update();
    draw();

    requestAnimationFrame(gameLoop);
}
