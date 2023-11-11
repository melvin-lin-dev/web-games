let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let s = 9;
let game_grid = [];
let score = 0;
let timer = 30;

let over = false;

let speedX, speedY;

let powerUp = [];
let powerUpActived = false;

let insEl = document.querySelector('.instruction');
let btn = document.getElementById('btn-start');
let count = document.querySelector('.count');
let scoreEl = document.getElementById('score');
let nameEl = document.getElementById('nameEl');

window.onload = () => {
    insEl.style.transform = 'rotateY(0)';
}

function start(){
    over = false;

    scoreEl.innerHTML = score;
    count.innerHTML = 3;
    count.style.opacity = '1';

    let countInterval = setInterval(()=>{
        if(count.innerHTML == 0){
            count.style.opacity = '0';
            clearInterval(countInterval);
            setTimeout(()=>{
                drawBoard();
                update();

                let timerInterval = setInterval(()=>{
                    timer--;
                    document.getElementById('timer').innerHTML = timer;

                    if(!timer){
                        over = true;
                        clearInterval(timerInterval);
                    }
                }, 1000)
            },520);
        }else{
            count.innerHTML--;
        }
    }, 1000);
}

function update(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    if(!over){
        updateGems();
        if(!filling) check();
        scoreEl.innerHTML = score;
        requestAnimationFrame(update);
    }else{
        document.querySelector('.gameover').style.transform = 'scale(1)';
        document.querySelector('.gameover .score').innerHTML = score;
    }
}

function rand(min, max){
    return Math.floor(Math.random() * max) + min;
}

function checkButton(){
    if(btn.className == 'ripple'){
        start();
        nameEl.innerHTML = document.getElementById('name').value;
        insEl.style.transform = 'scale(0) rotateY(0)';
    }
}

function checkInput(val){
    if(val){
        btn.className = 'ripple';
    }else{
        btn.className = 'disabled';
    }
}
function clearHighlight() {
    gem1 = '';
    gem2 = '';
}

function fixed(num){
    return parseFloat(num.toFixed(9));
}

function ranking(cmd){
    if(cmd == 'show'){
        document.querySelector('.scoreboard').style.transform = 'scale(1) rotate(0deg)';
    }else{
        document.querySelector('.scoreboard').style.transform = 'scale(0) rotate(90deg)';
    }
}

function restart(){
    document.querySelector('.gameover').style.transform = 'scale(0)';
    setTimeout(()=>{
        insEl.style.transform = 'rotateY(0)';
    },500);

    game_grid = [];
    score = 0;
    timer = 30;

    powerUp = [];
    powerUpActived = false;

    lines = [];

    changeCancel = false;
    pass = false;
    filling = false;

    gem1, gem2;
    changing = false;
    gridGem1, gridGem2;

    document.getElementById('name').value = '';
}