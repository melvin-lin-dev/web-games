let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let gameOver = false;

let gameGrid = [];

let length = 8;
let size = cvs.width/length;

let turn = 'black';

let directions = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];

let score = {
	white: 0,
	black: 0
}

window.onload = () => {
	start();
}

function start(){
	generateGrid();
	generateTile();
	update();
}

function update(){
	if(!gameOver){
		ctx.clearRect(0,0,cvs.width, cvs.height);
		drawLine();
		updateObject();
		countScore();
		requestAnimationFrame(update);
	}else{

	}
}

function updateObject(){
	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			gameGrid[row][col].draw();
		}
	}
}

function checkOutOfBound(x,y){
	return x >= 0 && y >= 0 && x < length && y < length;
}