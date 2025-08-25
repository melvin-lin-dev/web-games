var cvs = document.querySelector("canvas");
var ctx = cvs.getContext("2d");

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let player;
let frogImage = new Image();
frogImage.src = 'images/frog.png';

let ball = {
    r: 14,
    speed: 2
};

let colors = ['red', 'blue', 'green', 'yellow', 'orange'];

let shootBalls = [], balls = [];

let paths = [
    {
        type: 'start',
        x: 100,
        y: -10
    },
    {
        type: 'line',
        x: 200,
        y: 160
    },
    {
        type: 'quadratic-curve',
        cpx: 230,
        cpy: 200,
        x: 250,
        y: 120
    },
    {
        type: 'bezier-curve',
        cp1x: 290,
        cp1y: -40,
        cp2x: 300,
        cp2y: 200,
        x: 400,
        y: 150
    },
    {
        type: 'line',
        x: 500,
        y: 90
    },
    {
        type: 'line',
        x: 700,
        y: 90
    },
    {
        type: 'bezier-curve',
        cp1x: 820,
        cp1y: 100,
        cp2x: 880,
        cp2y: 200,
        x: 900,
        y: 400
    },
    {
        type: 'quadratic-curve',
        cpx: 900,
        cpy: 800,
        x: 300,
        y: 600
    },
    {
        type: 'quadratic-curve',
        cpx: 100,
        cpy: 500,
        x: 250,
        y: 300
    },
];

let color = 'gold';

let end = {
    el: document.querySelector('.end'),
    r: 50,
    range: 20,
    value: 500
};

function start() {
    let lastPath = paths[paths.length - 1];
    end.el.style.left = lastPath.x - end.r * 1.1 + 'px';
    end.el.style.top = lastPath.y - end.r * 1.1 + 'px';
    end.el.style.padding = end.r + 'px';

    player = new Player(cvs.width / 2, cvs.height / 2);

    animate();
}

// start the animation
function animate() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    checkCollision();
    checkOutOfBounds();
    draw();

    [...end.el.children].forEach(mouth => {
        let currentRange = (end.range - (end.value - balls[0].percent));

        if (currentRange >= 0) {
            mouth.style.margin = `${(currentRange / end.range * 50) + 50}% 0`;
        }
    });

    // console.log(((end.range - (100 - balls[0].percent)) / end.range * 50) + 50);

    requestAnimationFrame(animate);
}
