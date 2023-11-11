let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

cvs.width = 500;
cvs.height = window.innerHeight;

let player = {
    x: 0,
    y: 0,
    s: 25,
    moveSpeed: 10,
    fallSpeed: 0,
    jumpSpeed: 13,
};
let gravity = .4;

let space = 150;

let platforms = [];

let distance = 0;
let startingPlatform = 5;

let gameOver = false;

let score = 0;

window.onload = () => {
    // start();
    document.querySelector('.start-container').classList.add('active');
};

function start() {
    document.querySelector('.start-container').classList.remove('active');

    setTimeout(() => {
        generateStartingPlatforms();
        player.x = cvs.width / 2 - player.s / 2;
        player.y = cvs.height / 2 - player.s / 2;
        // player.x = platforms[0].x + platforms[0].w / 2 - player.s / 2;
        // player.y = platforms[0].y - player.s;
        platforms[0].scored = true;
        platforms[1].scored = true;
        platforms[2].scored = true;

        update();
    }, 400);
}

function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        distance++;

        draw();

        requestAnimationFrame(update);
    } else {
        document.querySelector('.game-over-container').classList.add('active');

        document.getElementById('score').innerHTML = score;
    }
}

function playerJump() {
    player.fallSpeed -= player.jumpSpeed;

    platforms.forEach(platform => {
        platform.update(-player.jumpSpeed);
    })
}

function restart() {
    location.reload();
}
