window.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("startBtn");

    console.log("JavaScript loaded");
    console.log(startBtn);

    startBtn.addEventListener("click", () => {
        console.log("Button clicked!");
        alert("Button works!");
    });

});
