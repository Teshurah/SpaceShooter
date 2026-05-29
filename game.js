window.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// resize fix
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// UI
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");

// GAME STATE
let state = "menu";
let lastTime = 0;
let spawnTimer = 0;
let spawnInterval = 900;

// GAME OBJECTS
let asteroids = [];
let stars = [];
let particles = [];
let difficulty = 1;

// =====================
// IMAGES (safe fallback)
// =====================
const shipImg = new Image();
const rockImg = new Image();
const starImg = new Image();

shipImg.src = "images/ship.png";
rockImg.src = "images/rock.png";
starImg.src = "images/star.png";

// =====================
// PLAYER
// =====================
const player = {
    x: canvas.width / 2,
    y: canvas.height - 120,
    size: 60
};

// =====================
// START BUTTON FIX
// =====================
startBtn.addEventListener("click", () => {
    console.log("START CLICKED");

    state = "playing";

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    resetGame();

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
});

// =====================
// RESET GAME
// =====================
function resetGame() {
    asteroids = [];
    stars = [];
    particles = [];
    difficulty = 1;

    createStars();
}

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
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function createStars() {
    stars = [];
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
        ctx.globalAlpha = this.life;
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

function explosion(x, y) {
    for (let i = 0; i < 20; i++) {
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
        this.size = Math.random() * 40 + 20;
        this.speed = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.y += this.speed * difficulty;
    }

    draw() {
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function spawnAsteroid() {
    asteroids.push(new Asteroid());
}

// =====================
// SPAWN SYSTEM
// =====================
function handleSpawning(delta) {
    spawnTimer += delta;

    if (spawnTimer > spawnInterval) {
        spawnAsteroid();
        spawnTimer = 0;
    }
}

// =====================
// UPDATE GAME
// =====================
function update() {
    difficulty += 0.002;
    difficulty = Math.min(difficulty, 5);

    stars.forEach(s => s.update());
    asteroids.forEach(a => a.update());
    particles.forEach(p => p.update());

    particles = particles.filter(p => p.life > 0);
    asteroids = asteroids.filter(a => a.y < canvas.height + 100);
}

// =====================
// DRAW GAME
// =====================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background stars
    stars.forEach(s => s.draw());

    // asteroids
    asteroids.forEach(a => a.draw());

    // particles
    particles.forEach(p => p.draw());

    // player (safe fallback shape)
    ctx.fillStyle = "cyan";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}

// =====================
// GAME LOOP (FIXED)
// =====================
function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);

    const delta = timestamp - lastTime;
    lastTime = timestamp;

    // ALWAYS draw something (prevents blank screen bugs)
    if (state !== "playing") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // idle background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return;
    }

    update();
    draw();
    handleSpawning(delta);
}

}); // END DOMContentLoaded
