window.addEventListener("DOMContentLoaded", () => {

    // ================= CANVAS =================

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (player) {
            player.y = canvas.height - 100;
        }
    }

    window.addEventListener("resize", resizeCanvas);

    // ================= UI =================

    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");
    const startBtn = document.getElementById("startBtn");

    // ================= GAME STATE =================

    let state = "menu";
    let score = 0;

    // ================= INPUT =================

    const keys = {};

    window.addEventListener("keydown", (e) => {

        if (
            e.key === " " ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight"
        ) {
            e.preventDefault();
        }

        keys[e.key] = true;

        // Restart game
        if (state === "gameover" && e.key === "Enter") {
            resetGame();
            state = "playing";
        }
    });

    window.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });

    // ================= PLAYER =================

    const player = {
        x: window.innerWidth / 2,
        y: window.innerHeight - 100,
        width: 40,
        height: 40,
        speed: 7
    };

    // ================= BULLETS =================

    let bullets = [];
    let shootCooldown = 0;

    function shoot() {
        bullets.push({
            x: player.x,
            y: player.y - 20,
            width: 5,
            height: 15,
            speed: 10
        });
    }

    // ================= ASTEROIDS =================

    let asteroids = [];
    let asteroidTimer = 0;

    function spawnAsteroid() {

        let size = Math.random() * 30 + 25;

        asteroids.push({
            x: Math.random() * (canvas.width - size) + size / 2,
            y: -size,
            size: size,
            speed: Math.random() * 3 + 2
        });
    }

    // ================= STARS =================

    let stars = [];

    function createStars() {
        stars = [];

        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 1 + 0.5
            });
        }
    }

    // ================= START GAME =================

    startBtn.addEventListener("click", () => {

        startScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");

        resizeCanvas();
        createStars();
        resetGame();

        state = "playing";
    });

    // ================= RESET =================

    function resetGame() {
        score = 0;
        bullets = [];
        asteroids = [];

        player.x = canvas.width / 2;
        player.y = canvas.height - 100;

        asteroidTimer = 0;
    }

    // ================= UPDATE =================

    function update() {

        // Move player

        if (keys["ArrowLeft"] || keys["a"]) {
            player.x -= player.speed;
        }

        if (keys["ArrowRight"] || keys["d"]) {
            player.x += player.speed;
        }

        player.x = Math.max(
            player.width / 2,
            Math.min(canvas.width - player.width / 2, player.x)
        );

        // Shoot

        shootCooldown--;

        if ((keys[" "] || keys["Space"]) && shootCooldown <= 0) {
            shoot();
            shootCooldown = 12;
        }

        // Bullets

        bullets.forEach(b => b.y -= b.speed);

        bullets = bullets.filter(b => b.y > -20);

        // Asteroids

        asteroidTimer++;

        if (asteroidTimer > 50) {
            spawnAsteroid();
            asteroidTimer = 0;
        }

        asteroids.forEach(a => a.y += a.speed);

        // Stars

        stars.forEach(star => {
            star.y += star.speed;

            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });

        // Bullet collisions

        for (let i = asteroids.length - 1; i >= 0; i--) {

            for (let j = bullets.length - 1; j >= 0; j--) {

                let dx = asteroids[i].x - bullets[j].x;
                let dy = asteroids[i].y - bullets[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < asteroids[i].size / 2) {

                    asteroids.splice(i, 1);
                    bullets.splice(j, 1);

                    score += 10;
                    break;
                }
            }
        }

        // Player collisions

        for (let asteroid of asteroids) {

            let dx = asteroid.x - player.x;
            let dy = asteroid.y - player.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (
                distance <
                asteroid.size / 2 + player.width / 2
            ) {
                state = "gameover";
            }
        }

        // Remove off-screen asteroids

        asteroids = asteroids.filter(
            a => a.y < canvas.height + a.size
        );
    }

    // ================= DRAW =================

    function draw() {

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars

        ctx.fillStyle = "white";

        stars.forEach(star => {
            ctx.fillRect(
                star.x,
                star.y,
                star.size,
                star.size
            );
        });

        // Score

        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText(`Score: ${score}`, 20, 40);

        // Draw player

        ctx.fillStyle = "cyan";

        ctx.beginPath();
        ctx.moveTo(player.x, player.y - 20);
        ctx.lineTo(player.x - 20, player.y + 20);
        ctx.lineTo(player.x + 20, player.y + 20);
        ctx.closePath();
        ctx.fill();

        // Draw bullets

        ctx.fillStyle = "yellow";

        bullets.forEach(b => {
            ctx.fillRect(
                b.x - b.width / 2,
                b.y,
                b.width,
                b.height
            );
        });

        // Draw asteroids

        ctx.fillStyle = "gray";

        asteroids.forEach(a => {
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.size / 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Game Over

        if (state === "gameover") {

            ctx.fillStyle = "red";
            ctx.font = "60px Arial";
            ctx.textAlign = "center";

            ctx.fillText(
                "GAME OVER",
                canvas.width / 2,
                canvas.height / 2
            );

            ctx.fillStyle = "white";
            ctx.font = "24px Arial";

            ctx.fillText(
                "Press ENTER to restart",
                canvas.width / 2,
                canvas.height / 2 + 50
            );

            ctx.textAlign = "left";
        }
    }

    // ================= GAME LOOP =================

    function gameLoop() {

        if (state === "playing") {
            update();
        }

        draw();

        requestAnimationFrame(gameLoop);
    }

    // Start the loop once
    resizeCanvas();
    gameLoop();

});
