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

function getLeaderboards(){
    return localStorage.leaderboards ? JSON.parse(localStorage.leaderboards) : [];
}

function start(){
    over = false;

    count.style.display = 'block';

    setTimeout(() => {
        scoreEl.innerHTML = score;
        count.innerHTML = 3;
        count.style.opacity = '1';
    
        let countInterval = setInterval(()=>{
            if(count.innerHTML == 0){
                count.style.opacity = '0';
                clearInterval(countInterval);
                setTimeout(()=>{
                    count.style.display = 'none';
                    
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
    })
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

        let leaderboards = getLeaderboards();
        leaderboards.push({ name: nameEl.innerHTML, score })
        localStorage.leaderboards = JSON.stringify(leaderboards);
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
    const scoreboardEl = document.querySelector('.scoreboard');

    if(cmd == 'show'){
        scoreboardEl.style.transform = 'scale(1) rotate(0deg)';

        const leaderboards = getLeaderboards().sort((a, b) => b.score - a.score).slice(0,10);
        const tbody = scoreboardEl.querySelector('tbody');
        tbody.innerHTML = '';

        leaderboards.forEach((rank, i) => {
            const tr = document.createElement('tr');
            
            const tdRank = document.createElement('td');
            tdRank.innerHTML = i + 1;

            const tdName = document.createElement('td');
            tdName.innerHTML = rank.name;

            const tdScore = document.createElement('td');
            tdScore.innerHTML = rank.score;

            tr.appendChild(tdRank);
            tr.appendChild(tdName);
            tr.appendChild(tdScore);

            tbody.appendChild(tr);
        });
    }else{
        scoreboardEl.style.transform = 'scale(0) rotate(90deg)';
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
    nameEl.innerHTML = '';
    scoreEl.innerHTML = '';
    document.getElementById('timer').innerHTML = timer;
}