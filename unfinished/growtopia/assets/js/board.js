let backgroundImageSrc = 'assets/images/background.png';
let sunImageSrc = 'assets/images/sun.png';

function drawBoard(){
	drawBackground();
	drawSun();
}

function drawBackground(){
	let backgroundImage = new Image();
	backgroundImage.src = backgroundImageSrc;
	ctx.beginPath();
	ctx.drawImage(backgroundImage,0,0,cvs.width, cvs.height);
	ctx.closePath();
}

function drawSun(){
	let sunImage = new Image();
	sunImage.src = sunImageSrc;
	ctx.beginPath();
	ctx.drawImage(sunImage,cvs.width-250,40,160,160);
	ctx.closePath();
}

function drawHit(){
	hitBlocks.forEach((block, index) => {
		if(block.time < block.timeLimit){
			let currentBlock = gameBoard[block.row][block.col];

			block.time++;
			
			ctx.beginPath();
			ctx.save();
			ctx.strokeStyle = 'red';
			ctx.moveTo(player.x + player.w / 2, player.y + player.h / 2);
			ctx.lineTo(currentBlock.x + blockSize / 2, currentBlock.y + blockSize / 2);
			ctx.lineWidth = 10;
			ctx.stroke();
			ctx.restore();
			ctx.closePath();
		}else{
			hitBlocks.splice(index, 1);
		}
	});
}