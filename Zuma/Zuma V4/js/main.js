let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let gameOverContainer = document.querySelector('.game-over-container');
let scoreEl = document.querySelector('.score-container span');

let svg = document.querySelector('svg');
svg.setAttribute('width', cvs.width = window.innerWidth);
svg.setAttribute('height', cvs.height = window.innerHeight);
let path = document.querySelector('path');
let pathLength;

let player;
let frogImage = new Image();
frogImage.src = 'images/frog.png';

let ball = {
    r: 18,
    speed: .8, // ----- % -----
    startSpeed: 11,
    reverseSpeed: 3.85,
    gameOverSpeed: 20, // ----- % -----
    shootSpeed: 15,
    margin: 0,
    startMargin: 0,
    setBackMultiplier: 1
};
let fastPhaseTime = 25;
let startingPhase = true;
let resetTimer = false;

let colors = ['red', 'blue', 'green', 'yellow', 'orange'];

let shootBalls = [], balls = [], particles = [], scores = [];
let lightTrails = [];

let color = 'gold';

let end = {
    el: document.querySelector('.end'),
    r: 50,
    range: 20,
    value: 100,
    milliseconds: 0
};
let scale = 5000;

let milliseconds = 0;

let lightTrail = {
    quantity: 10,
    r: 8,
    speed: 45,
    margin: ball.startSpeed,
    color: 'yellow',
    sound: new Tone.Buffer(`sounds/effect/lighttrail2.ogg`),
    pitch: {
        value: 0,
        shiftSpeed: .1,
        min: -10,
        default: -.5
    },
    playbackRate: {
        value: 0.9,
        shiftSpeed: .002,
        max: 1.3
    },
    interval: null,
    milliseconds: 0
};

let paths = [
    {
        type: 'M',
        locations: ['40,-20']
    },
    {
        type: 'C',
        locations: ['50,150', '-10,100', '220,300']
    },
    {
        type: 'S',
        locations: ['275.5,75', '505.5,99']
    },
    {
        type: 'S',
        locations: ['505,300.334', '900,120.334']
    },
    {
        type: 'C',
        locations: ['1200,0', '1200,700', '800,600']
    },
    {
        type: 'C',
        locations: ['600,550', '500,750', '200,500']
    }
];

paths = [
    {
        type: 'M',
        locations: ['0,0']
    },
    {
        type: 'L',
        locations: ['123,500']
    }
];

let gameOver = false, gameStart = false;
let render = true;
let gameInterval;

let reverseBallIndexes = [];

let savedLocation = {};

// let score = {
//     value: 0,
//     target: 0
// };

let scoreMultiplier = 0;

let breakSound = new Tone.Buffer(`sounds/effect/chime1.ogg`);
let toneSound = {
    lightTrail: {
        pitchShift: new Tone.PitchShift().toDestination(),
        tone: null
    },
    break: {
        pitchShift: new Tone.PitchShift().toDestination(),
        tone: null
    }
};

function starting() {
    // sound('title', 'music');
    generateLightTrail();

    player = new Player(cvs.width / 2, cvs.height / 2);
    // player = new Player(200, 0);

    generatePath();

    path.style.strokeWidth = ball.r * 2;

    let clonePath1 = path.cloneNode(true);
    svg.insertBefore(clonePath1, path);
    clonePath1.style.strokeWidth = +clonePath1.style.strokeWidth + 12;
    //
    // let clonePath2 = path.cloneNode(true);
    // svg.insertBefore(clonePath2,clonePath1);
    // clonePath2.style.strokeWidth = +clonePath2.style.strokeWidth + 27;

    pathLength = path.getTotalLength();

    ball.speed = convert(ball.speed); // ----- % -----
    ball.startSpeed = convert(ball.startSpeed);
    ball.reverseSpeed = convert(ball.reverseSpeed);
    ball.gameOverSpeed = convert(ball.gameOverSpeed); // ----- % -----
    fastPhaseTime = fastPhaseTime * pathLength / 100 / ball.startSpeed / pathLength * 18.688033854166665;

    let lastPosition = paths[paths.length - 1].locations;
    let position = lastPosition[lastPosition.length - 1].split(',');
    end.el.style.left = position[0] - end.r * 1.2 + 'px';
    end.el.style.top = position[1] - end.r * 1.2 + 'px';
    end.el.style.padding = end.r + 'px';

    end.range = convert(end.range);
    // ball.margin = ball.margin / 100;

    checkSpace();

    // sound('light-trail');

    lightTrail.interval = setInterval(() => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        player.draw();

        if (lightTrails.length && !gameStart) {
            // updateLightTrail();

            if (!lightTrails.length) {
                sound('start');
            }
        } else {
            start();
        }
    }, 20);
}

function start() {
    clearInterval(lightTrail.interval);

    // toneSound.lightTrail.tone.disconnect();

    gameStart = true;

    setTimeout(() => {
        sound('rolling');

        animate();

        setTimeout(() => {
            player.loadBall();
        }, 300);

        // setTimeout(() => { // DEBUG
        //     turnColor();
        // }, 1000);
    }, 500);
}

function animate() {
    if (render) {
        generateBall();

        gameInterval = setInterval(() => {
            milliseconds += 20;

            startingPhase = milliseconds < fastPhaseTime && !resetTimer;
            // if (!startingPhase && !resetTimer) {
            //     milliseconds = 0;
            //     resetTimer = true;
            //
            //     // setTimeout(() => {
            //     //     generateBall();
            //     // }, 480);
            // }

            update();
            check();

            // generateBall();

            // if ((milliseconds > fastPhaseTime && milliseconds % 990 === 0) || (startingPhase && milliseconds % 15 === 0)) {
            // if (!gameOver && balls[balls.length - 1].percent > ball.margin) {
            //     generateBall();
            // }
            if (!gameOver && balls[balls.length - 1].percent > (startingPhase ? ball.startMargin : ball.margin)) {
                generateBall();
            }
            // }

            if (gameOver) {
                generateGameOverParticles();
            }

            if (!render) {
                update();
                clearInterval(gameInterval);
            }
        }, 20);

        // requestAnimationFrame(animate);
    }
}

function restart() {
    location.reload();
}

