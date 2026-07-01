window.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");
    const startBtn = document.getElementById("startBtn");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameStarted = false;

    let keys = {};

    const player = {
        x: canvas.width / 2,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 6
    };

    window.addEventListener("keydown", (e) => {
        keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });

    startBtn.addEventListener("click", () => {
        startScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        gameStarted = true;
    });

    function update() {

        if (keys["ArrowLeft"] || keys["a"]) {
            player.x -= player.speed;
        }

        if (keys["ArrowRight"] || keys["d"]) {
            player.x += player.speed;
        }

        if (player.x < 20) player.x = 20;
        if (player.x > canvas.width - 20) {
            player.x = canvas.width - 20;
        }
    }

    function draw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) return;

        // spaceship
        ctx.fillStyle = "cyan";

        ctx.beginPath();
        ctx.moveTo(player.x, player.y - 20);
        ctx.lineTo(player.x - 20, player.y + 20);
        ctx.lineTo(player.x + 20, player.y + 20);
        ctx.closePath();
        ctx.fill();
    }

    function gameLoop() {

        if (gameStarted) {
            update();
        }

        draw();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();

});
