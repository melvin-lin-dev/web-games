let socket = io();

let canvas = document.querySelector('canvas');
let context = {};
let cvs = {};

let container = document.querySelector('.container');
let mainContainer = document.querySelector('.main-container');
let gameOverContainer = document.querySelector('.game-over-container');
let scoreEl = document.querySelector('.score-container span');

let svg = document.querySelector('svg');
// svg.setAttribute('width', canvas.width = screen.width / 2);
// svg.setAttribute('height', canvas.height = screen.height);
svg.setAttribute('width', canvas.width = cvs.width = window.innerWidth / 2);
svg.setAttribute('height', canvas.height = cvs.height = window.innerHeight);
let path = document.querySelector('path');
let pathLength;

let players = {}, player, playerIndex;
let frogImage = new Image();
frogImage.src = 'images/frog.png';

let ball = {
    r: 18,
    speed: .8,
    reverseSpeed: 5,
    gameOverSpeed: 70,
    startSpeed: 20,
    shootSpeed: 15,
    margin: 2.4,
    setBackMultiplier: 1
};
let fastPhaseTime = 41;
let startingPhase = true;
let resetTimer = false;

let colors = ['red', 'blue', 'green', 'yellow', 'orange'];

let shootBalls = {
    0: [],
    1: []
}, balls = {
    0: [],
    1: [],
}, particles = {
    0: [],
    1: [],
}, scores = {
    0: [],
    1: [],
}, lightTrails = {
    0: [],
    1: [],
}, scoreMultiplier = {
    0: 0,
    1: 0
};

let color = 'gold';

let endProp = {
    r: 50,
    range: 50,
    value: 100
};

let end = {
    0: {
        el: document.querySelector('.end'),
        milliseconds: 0
    },
    1: {
        el: null,
        milliseconds: 0
    }
};
let scale = 5000;

let milliseconds = 0;

let lightTrail = {
    quantity: 10,
    r: 8,
    speed: 65,
    margin: ball.startSpeed / scale * 0.2,
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
        locations: ['40,60', '40,60', '400,60']
    },
    {
        type: 'C',
        locations: ['500,60', '500,60', '500,200']
    },
    {
        type: 'L',
        locations: ['500,200', '500,600']
    },
    { //TEMP
        type: 'L',
        locations: ['500,600', '500,800']
    },
    // {
    //     type: 'C',
    //     locations: ['500,650', '500,650', '100,650']
    // },
];

let gameOver = false, gameStart = false;
let render = true;
let gameInterval;

let reverseBallIndexes = {
    0: [],
    1: []
};

let savedLocation = {};

// let score = {
//     value: 0,
//     target: 0
// };

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
    // player = players[socket.id] = new Player(canvas.width / 2 - 100 + Object.keys(players).length * 30, canvas.height / 2);

    // sound('title', 'music');
    // generateLightTrail();

    // players[socket.id] = new Player(canvas.width / 2, canvas.height / 2);
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
    fastPhaseTime = fastPhaseTime * pathLength / 100;

    let lastPosition = paths[paths.length - 1].locations;
    let position = lastPosition[lastPosition.length - 1].split(',');
    end[0].el.style.left = position[0] - endProp.r * 1.2 + 'px';
    end[0].el.style.top = position[1] - endProp.r * 1.2 + 'px';
    end[0].el.style.padding = endProp.r + 'px';

    mainContainer.appendChild(container.cloneNode(true));
    canvas = document.querySelectorAll('canvas');

    end[1].el = document.querySelectorAll('.end')[1];

    context[0] = canvas[0].getContext('2d');
    context[1] = canvas[1].getContext('2d');

    end.range = end.range / 100 * pathLength;
    ball.margin = ball.margin / 100;

    // sound('light-trail');

    lightTrail.interval = setInterval(() => {
        clearScreen();

        updatePlayers();

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

        // setTimeout(() => {
        //     player.loadBall();
        // }, 300);

        // setTimeout(() => { // DEBUG
        //     turnColor();
        // }, 1000);
    }, 500);
}

function animate() {
    if (render) {
        // for(let id in players){
        // if(!playerIndex){
        generateBall();
        // }
        // }

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
            // if(balls[playerIndex].length){
            // (startingPhase ? ball.startSpeed : ball.speed)
            if (!gameOver && balls[playerIndex][balls[playerIndex].length - 1].percent > ball.margin) {
                generateBall();
            }
            // checkLastBallMargin();
            // }
            // }

            if (gameOver) {
                // generateGameOverParticles();
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

