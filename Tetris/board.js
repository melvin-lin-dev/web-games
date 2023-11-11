function drawBoard(){
	ctx.beginPath();
	ctx.fillStyle = '#ccc';
	ctx.fillRect(board.x,0,board.width,board.height);
	ctx.closePath();

	drawBackground();
	drawText();
}

function drawText(){
	ctx.font = '30px SEGOE UI';
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = 'white';
	ctx.fillText('Score: '+score,board.x+board.width/2,board.height/2);
}

function drawBackground(){
	ctx.beginPath();
	ctx.fillStyle = 'black';
	let width = board.width-100;
	let height = 500;
	ctx.fillRect(board.x+((board.width-width)/2),((board.height-height)/2),width,height);
}

function drawGameOver(){
	ctx.font = '40px SEGOE UI';
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = 'red';
	ctx.fillText('GameOver',board.x+board.width/2,board.height/2-45);

	ctx.font = '15px SEGOE UI';
	ctx.fillStyle = '#ccc';
	ctx.fillText('Press space to restart', board.x+board.width/2,board.height/2+35);
}