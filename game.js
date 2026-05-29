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
let particles = [];
let stars = [];

let difficulty = 1;
let difficultyIncrease = 0.002;

// =====================
// LOAD IMAGES (IMPORTANT FIX)
// =====================
const shipImg = new Image();
const rockImg = new Image();
const starImg = new Image();

shipImg.src = "images/ship.png";
rockImg.src = "images/rock.png";
starImg.src = "images/star.png";

let assetsLoaded = false;
let loadedCount = 0;

function checkLoaded() {
    loadedCount++;
    if (loadedCount === 3) {
        assetsLoaded = true;
    }
}

shipImg.onload = checkLoaded;
rockImg.onload = checkLoaded;
starImg.onload = checkLoaded;

// =====================
// PLAYER
// =====================
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    size: 50
};

// =====================
// START GAME
// =====================
startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    createStars();

    gameStarted = true;
    gameLoop();
});

// =====================
// STARS
// =====================
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 2 + 0.3;
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
        ctx.drawImage(starImg, this.x, this.y, this.size * 5, this.size * 5);
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

        ctx.fillStyle = ["orange", "yellow", "red"][Math.floor(Math.random() * 3)];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function createExplosion(x, y, power = 20) {
    for (let i = 0; i < power; i++) {
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

setInterval(() => {
    if (gameStarted) spawnAsteroid();
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

    // demo explosion (replace with real collision later)
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

    // stars first
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
// GAME LOOP
// =====================
function gameLoop() {
    if (!gameStarted) return;

    if (!assetsLoaded) {
        requestAnimationFrame(gameLoop);
        return;
    }

    update();
    draw();

    requestAnimationFrame(gameLoop);
}
