let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let game = {width:cvs.width/2, height: 600};
let board = {x:game.width, width:cvs.width/2, height: 600};
let game_grid = [];
let blocks = [];

let size = 30;
let w = game.width/size;
let h = game.height/size;

let gameTime = 0;
let timeLimit = 40;

let gameOver = false;

let score = 0;

window.onload = function(){
	start();
}

function start(){
	drawGrid();
	drawBlock();
	update();
}

function update(){
	if(!gameOver){
		ctx.clearRect(0,0,cvs.width,cvs.height);
		gameTime++;

		key();
		updateBlock();
		drawLine();
		checkLine();
		drawBoard();
		requestAnimationFrame(update);
	}else{
		drawGameOver();
	}
}

function drawGrid(){
	for(let i = 0; i < h; i++){
		game_grid.push([]);
		for(let x = 0; x < w; x++){
			game_grid[i].push(0);
		}
	}
}

function drawLine(){
	for(let i = 0; i < w; i++){
		ctx.moveTo(i*size,0);
		ctx.lineTo(i*size,game.height);
	}

	for(let x = 0; x < h; x++){
		ctx.moveTo(0,x*30);
		ctx.lineTo(game.width,x*30);
	}

	ctx.strokeStyle='#ccc';
	ctx.stroke();
}

function rand(min,max){
	let random = Math.floor(Math.random() * max) + min;
	return random;
}

function drawBlock(){
	let blockX = game_grid[0].length/2-1;
	let blockY = -1;
	blocks.push(new Block(blockX,blockY,size));
}

function updateBlock(){
	blocks.forEach((block)=>{
		if(block.fall == false){
			if(gameTime>=timeLimit){
				block.update();
				gameTime = 0;
			}
			block.draw();
		}else{
			if(block.y == -1){
				gameOver = true;
			}
		}
	});
	drawColor();
}

function drawColor(){
	for(let i = 0; i < game_grid.length; i++){
		for(let x = 	0; x < game_grid[i].length; x++){
			if(game_grid[i][x] == 1){
				let drawX = x * size;
				let drawY = i * size;
				ctx.beginPath();
				ctx.fillStyle = 'rgb(0,185,245)';
				ctx.fillRect(drawX,drawY,size,size);
				ctx.closePath();
			}
		}
	}
}

function checkLine(){
	let line = 0;

	for(let i = 0; i < h; i++){
		let pass = true;
		for(let x = 0; x < w; x++){
			if(game_grid[i][x] == 0){
				pass = false;
			}
		}

		if(pass){
			line++;
			game_grid.splice(i,1);
			game_grid.unshift([]);
			for(let j = 0; j < w; j++){
				game_grid[0].push(0);
			}
		}
	}
	score += line * 5;
}

function reset(){
	game_grid = [];
	blocks = [];

	gameTime = 0;
	timeLimit = 40;

	gameOver = false;

	score = 0;

	ctx.clearRect(0,0,cvs.width,cvs.height);
	start();
}