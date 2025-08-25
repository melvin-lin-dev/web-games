let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let gameGrid = [];
let size = 4;
let blockSize = cvs.width/size;

let gameOver = false;

let score = 0;

window.onload = function(){
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	setInterval(function(){
		document.getElementById('score').innerHTML = score;
	})
	start();
}

function start(){
	generateGrid();
	startingBlock();
	update();
}

function update(){
	if(!gameOver){
		ctx.clearRect(0,0,cvs.width,cvs.height);
		drawBlock();
		drawGrid();
		requestAnimationFrame(update);
	}else{
		drawGameOver();
	}
}

function drawGameOver(){
	ctx.font = '80px segoe ui';
	ctx.fillStyle = 'rgb(40,40,40)';
	ctx.fillText('Gameover',cvs.width/2,cvs.height/2-50);

	ctx.font = '55px segoe ui';
	ctx.fillStyle = 'grey';
	ctx.fillText('Final score: '+score,cvs.width/2,cvs.height/2+15);

	ctx.font = '40px segoe ui';
	ctx.fillStyle = 'grey';
	ctx.fillText('Press SPACE to restart',cvs.width/2,cvs.height/2+70);
}

function drawGameWin(){
	ctx.font = '80px segoe ui';
	ctx.fillStyle = '#bbada0';
	ctx.fillText('You reach 2048',cvs.width/2,cvs.height/2-50);

	ctx.font = '55px segoe ui';
	ctx.fillStyle = 'grey';
	ctx.fillText('Final score: '+score,cvs.width/2,cvs.height/2+15);

	ctx.font = '40px segoe ui';
	ctx.fillStyle = 'grey';
	ctx.fillText('Press SPACE to restart',cvs.width/2,cvs.height/2+70);

	gameOver = true;
}

function rand(min,max){
	let random = Math.floor(Math.random() * max) + min;
	return random;
}

function startingBlock(){
	generateBlock();
	generateBlock();
}

function generateBlock(){
	let chance = Math.random();
	let value;
	if(chance < 0.9){
		value = 2;
	}else{
		value = 4;
	}

	let x, y;
	while(true){
		x = rand(0,size);
		y = rand(0,size);
		if(gameGrid[y][x] == 0){
			break;
		}else{
			let pass = false;
			for(let i = 0; i < size; i++){
				for(let j = 0; j < size; j++){
					if(gameGrid[i][j] == 0){
						pass = true;
					}
				}
			}
			if(!pass){
				gameOver = true;
			}
		}
	}
	gameGrid[y][x] = value;
}

function reset(){
	gameGrid = [];
	size = 4;
	blockSize = cvs.width/size;

	gameOver = false;

	score = 0;
	document.getElementById('score').innerHTML = score;

	start();
}