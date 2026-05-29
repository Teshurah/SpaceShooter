const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// =====================
// GAME STATE
// =====================
let asteroids = [];
let particles = [];

let difficulty = 1;
let difficultyIncrease = 0.002;

// =====================
// PLAYER (basic example)
// =====================
const player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 40,
    height: 40
};

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

// =====================
// EXPLOSION FUNCTION
// =====================
function createExplosion(x, y, power = 15) {
    for (let i = 0; i < power; i++) {
        particles.push(new Particle(x, y));
    }
}

// =====================
// ASTEROID CLASS
// =====================
class Asteroid {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -50;

        this.size = Math.random() * 30 + 20;
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

// =====================
// SPAWN ASTEROIDS
// =====================
function spawnAsteroid() {
    asteroids.push(new Asteroid());
}

// spawn loop
setInterval(spawnAsteroid, 1000);

// =====================
// UPDATE GAME
// =====================
function update() {
    // difficulty grows over time (slow start → harder game)
    difficulty += difficultyIncrease;
    difficulty = Math.min(difficulty, 5);

    // update asteroids
    asteroids.forEach(a => a.update());

    // update particles
    particles.forEach(p => p.update());

    // remove dead particles
    particles = particles.filter(p => p.life > 0);

    // remove off-screen asteroids
    asteroids = asteroids.filter(a => a.y < canvas.height + 100);

    // SIMPLE COLLISION DEMO (replace with your real logic)
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let a = asteroids[i];

        // fake condition (replace with bullet/ship collision)
        if (a.y > canvas.height / 2 && Math.random() < 0.002) {
            createExplosion(a.x, a.y);
            asteroids.splice(i, 1);
        }
    }
}

// =====================
// DRAW GAME
// =====================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // asteroids
    asteroids.forEach(a => a.draw());

    // particles
    particles.forEach(p => p.draw());

    // player (placeholder ship)
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// =====================
// GAME LOOP
// =====================
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
