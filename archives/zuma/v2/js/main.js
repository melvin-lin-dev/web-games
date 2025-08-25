let player = document.querySelector('.player');
let playerContainer = document.querySelector('.player-container');
let ballContainer = document.querySelector('.ball-container');
let ballCurrent = document.querySelector('.ball-current');
let ballFuture = document.querySelector('.ball-future');
let frogImage = new Image();
frogImage.src = 'images/frog.png';

let ball = {
    r: 14,
    speed: 10,
    shootSpeed: 10,
    margin: 2
};

let colors = ['red', 'blue', 'green', 'yellow', 'orange'];

let shootBalls = [], balls = [];

let color = 'gold';

let ns = 'http://www.w3.org/2000/svg';
let svg = document.querySelector('svg');
svg.setAttribute('width', window.innerWidth);
svg.setAttribute('height', window.innerHeight);
var path = document.querySelector('path');

let end = {
    el: document.querySelector('.end'),
    r: 50,
    range: 10,
    value: 100
};
let scale = 5000;

let paths = [
    {
        type: 'M',
        locations: ['40,50']
    },
    {
        type: 'C',
        locations: ['29,50', '120,700', '220,300']
    },
    {
        type: 'S',
        locations: ['275.5,75', '505.5,99']
    },
    {
        type: 'S',
        locations: ['105,300.334', '1000,220.334']
    },
    {
        type: 'C',
        locations: ['1200,700', '500,800', '400,550']
    }
];

function start() {
    generatePath();
    generateBall();
    setInterval(() => {
        generateBall();
    }, ball.margin * 100);

    playerContainer.style.left = window.innerWidth / 2 + 'px';
    playerContainer.style.top = window.innerHeight / 2 + 'px';
    ballCurrent.style.backgroundColor = randomBall();
    ballFuture.style.backgroundColor = randomBall();
    ballCurrent.style.padding = ballFuture.style.padding = ball.r + 'px';

    let lastPosition = paths[paths.length - 1].locations;
    let position = lastPosition[lastPosition.length - 1].split(',');
    end.el.style.left = position[0] - end.r + 'px';
    end.el.style.top = position[1] - end.r + 'px';
    end.el.style.padding = end.r + 'px';

    end.range = end.range / 100 * path.getTotalLength();
    ball.margin = ball.margin / 100 * path.getTotalLength();

    animate();
}

// start the animation
function animate() {
    update();
    check();

    requestAnimationFrame(animate);
}
