let cvs = document.querySelector('.canvas');
let ctx = cvs.getContext('2d');

let planet = {
    radius: 200
};

let players = [];
let ball;

window.onload = () => {
    start();
};

function start() {
    generatePlayers();

    ball = new Ball();

    update();
}

function update() {
    ctx.clearRect(0, 0, this.width, this.height);

    draw();

    requestAnimationFrame(update);
}
