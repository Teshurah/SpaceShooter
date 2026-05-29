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
        this.speed = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.y += this.speed;

        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.globalAlpha = Math.random() * 0.7 + 0.3;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
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

        const colors = ["orange", "yellow", "red", "white"];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function createExplosion(x, y, power = 18) {
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
        this.y = -50;

        // ⭐ RANDOM SIZE (important upgrade)
        this.size = Math.random() * 35 + 15;

        this.speed = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.y += this.speed * difficulty;
    }

    draw() {
        ctx.fillStyle = "gray";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
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

    // ⭐ background stars first
    stars.forEach(s => s.draw());

    // game objects
    asteroids.forEach(a => a.draw());
    particles.forEach(p => p.draw());
}

// =====================
// LOOP
// =====================
function gameLoop() {
    if (!gameStarted) return;

    update();
    draw();

    requestAnimationFrame(gameLoop);
}
