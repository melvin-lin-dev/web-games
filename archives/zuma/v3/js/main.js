let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let gameOverContainer = document.querySelector('.game-over-container');

let svg = document.querySelector('svg');
svg.setAttribute('width', cvs.width = window.innerWidth);
svg.setAttribute('height', cvs.height = window.innerHeight);
let path = document.querySelector('path');
let pathLength;

let player;
let frogImage = new Image();
frogImage.src = 'images/frog.png';

let ball = {
    r: 24,
    speed: .8,
    reverseSpeed: 5,
    gameOverSpeed: 50,
    startSpeed: 28,
    shootSpeed: 10,
    margin: 2
};
let fastPhaseTime = 41;
let startingPhase = true;
let resetTimer = false;

let colors = ['red', 'blue', 'green', 'yellow', 'orange'];

let shootBalls = [], balls = [];

let color = 'gold';

let end = {
    el: document.querySelector('.end'),
    r: 50,
    range: 10,
    value: 100
};
let scale = 5000;

let miliseconds = 0;

let paths = [
    {
        type: 'M',
        locations: ['40,0']
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

let gameOver = false;
let render = true;
let gameInterval;

let reverseBallIndexes = [];

function start() {
    player = new Player(cvs.width / 2, cvs.height / 2);

    generatePath();

    pathLength = path.getTotalLength();
    fastPhaseTime = fastPhaseTime * pathLength / 100;

    let lastPosition = paths[paths.length - 1].locations;
    let position = lastPosition[lastPosition.length - 1].split(',');
    end.el.style.left = position[0] - end.r * 1.2 + 'px';
    end.el.style.top = position[1] - end.r * 1.2 + 'px';
    end.el.style.padding = end.r + 'px';

    end.range = end.range / 100 * pathLength;
    ball.margin = ball.margin / 100 * pathLength;

    animate();
}

function animate() {
    if (render) {
        generateBall();

        gameInterval = setInterval(() => {
            miliseconds += 20;

            ctx.clearRect(0, 0, cvs.width, cvs.height);

            startingPhase = miliseconds < fastPhaseTime && !resetTimer;
            if(!startingPhase && !resetTimer){
                miliseconds = 0;
                resetTimer = true;
            }

            update();
            check();

            if((miliseconds > fastPhaseTime && miliseconds % 990 === 0) || (startingPhase && miliseconds % 15 === 0)){
                if (!gameOver) {
                    generateBall();
                } else {
                    clearInterval(gameInterval);
                }
            }
        }, 20);

        // requestAnimationFrame(animate);
    }
}

function restart() {
    location.reload();
}
