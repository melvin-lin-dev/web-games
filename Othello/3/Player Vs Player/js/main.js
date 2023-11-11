let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let length = 8;
let size = cvs.width / length;

let gameOver = false;
let gameGrid = [];

let turn = 'black';

let directions = [[1, -0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1]];

let checking = {status: false, valid: false};

window.onload = () => {
    start();
};

function start() {
    generateGrid();

    update();
}

function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        drawObjects();
        drawGrid();

        requestAnimationFrame(update);
    } else {
        drawObjects();
        alert("gameover");
    }
}

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}