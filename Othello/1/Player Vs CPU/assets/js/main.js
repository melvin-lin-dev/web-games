let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let computer = 'white';
let player = 'black';

let gameGrid = [];

let length = 8;
let size = cvs.height/length;

let turn = 'black';

let score = {
	black: 0,
	white: 0
}

let directions = [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];

let botCollected = [];

let gameOver = false;

let move = false;

window.onload = () => {
	start();
}

function start(){
	generateGrid();
	generatePlayer();

	updateBoard();

	update();
}

function update(){
	ctx.clearRect(0,0,cvs.width,cvs.height);

	if(!gameOver){
		drawBoard();
		drawPlayer();
		drawLine();
		
		requestAnimationFrame(update);
	}else{
		ctx.beginPath();
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = '40px segoe ui';
		ctx.fillStyle = 'white';
		let rectHeight = 200;
		let rectWidth = 400;
		ctx.fillRect(cvs.width/2 - rectWidth/2, cvs.height/2-rectHeight/2,rectWidth,rectHeight);
		ctx.fillStyle = 'black';
		ctx.fillText((score.black > score.white ? 'Black' : 'White') + ' Won!', cvs.width/2,cvs.height/2);
	}
}