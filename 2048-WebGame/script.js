// Basic definitions after all the code
const body = document.body;
const sides = 4;
var themebtn = document.getElementById("theme");
var insbtn = document.getElementById("instructions");
var okbtn = document.getElementById("ok");
var boardEmt = document.getElementById("board");
var popup = document.getElementById("popupins");
var reset = document.getElementById("reset");
var gameover = document.getElementById("gameover");
const gameboard = new board();
var score = 0;

gameboard.draw();

// Functionality of 'reset' button
reset.onclick = function() {
    gameboard.reset();
    document.getElementById("score").innerHTML = gameboard.score;
};

// Adding the open information button
insbtn.onclick = async function() {
    if(popupins.style == "display:block;") return;
    popupins.style = "display: block;";

    for(let i = -50; i < 100; i++) {
        popupins.style = "transform: translate(-50%, " + (i - 150) + "%)";
        await sleep(0.01); // sleep func
    }
}

// Close instructions button
okbtn.onclick = async function() {
    for(let i = 100; i > -60; i--) {
        popupins.style = "transform: translate(-50%, " + (i - 150) + "%)";
        await sleep(1); // sleep func
    }

    okbtn.parentElement.parentElement.style = "display:none;";
}

// Adding the change theme option
themebtn.onclick = function() {
    if(body.className == "lighttheme") body.className = "darktheme";
    else body.className = "lighttheme";
};

// Input
document.addEventListener('keyup', (e) => {
    if(gameboard.divtext == "flex") return;

    gameboard.checkForGameOver();
    if(e.code == "ArrowLeft") gameboard.slide('leftwards');
    if(e.code == "ArrowRight") gameboard.slide('rightwards');
    if(e.code == "ArrowUp") gameboard.slide('upwards');
    if(e.code == "ArrowDown") gameboard.slide('downwards');
    document.getElementById("score").innerHTML = gameboard.score;
})