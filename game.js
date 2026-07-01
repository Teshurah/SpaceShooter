startBtn.addEventListener("click", () => {
    console.log("Start clicked");

    startScreen.classList.add("hidden");
    console.log("Start screen hidden");

    gameScreen.classList.remove("hidden");
    console.log("Game screen shown");

    createStars();
    console.log("Stars created");

    resetGame();
    console.log("Game reset");

    state = "playing";
    console.log("State changed:", state);
});
