let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

cvs.width = window.innerWidth * .8;
cvs.height = window.innerHeight * .8;

let player;
let enemies = [];

let move = {
    left: false,
    right: false,
    up: false,
    down: false,
};

let gameOver = false;
let score = 0;

let enemyInterval;

function start() {
    generateEnemies();
    update();
}

function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        movement();
        draw();
        check();

        requestAnimationFrame(update);
    } else {
        clearInterval(enemyInterval);

        drawGameOver();
    }
}

function movement() {
    if (move.left) player.x -= player.x - player.speed < 0 ? player.x : player.speed;
    if (move.right) player.x += player.x + player.w + player.speed >= cvs.width ? cvs.width - player.x - player.w : player.speed;
    if (move.up) player.y -= player.y - player.speed < 0 ? player.y : player.speed;
    if (move.down) player.y += player.y + player.h + player.speed >= cvs.height ? cvs.height - player.y - player.h : player.speed;
}

function setMovement(key, boolean) {
    switch (key) {
        case 37:
            move.left = boolean;
            break;
        case 38:
            move.up = boolean;
            break;
        case 39:
            move.right = boolean;
            break;
        case 40:
            move.down = boolean;
            break;
    }
}
