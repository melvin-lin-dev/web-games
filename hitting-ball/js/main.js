let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let racket = {x: cvs.width/2, y: cvs.height-50, width: 100, height: 20};
let ball = {x: rand(20, cvs.width - 30), y: cvs.height/2-150, r: 10, moveX: 5 * (Math.random() <= 0.5 ? -1 : 1), moveY: 5};
let blocks = [];

let over = false;

window.onload = function(){
	start();
}

function rand(min, max){
    return Math.floor(Math.random() * max) + min;
}

function start(){
	createBlocks();
	update();
}

function update(){
	if(!over){
		ctx.clearRect(0,0,cvs.width,cvs.height);
		key();
		checkCollision();
		drawBlocks();
		drawRacket();
		drawBall();
		checkOver();
		requestAnimationFrame(update);
	}
}

function drawBall(){
	ball.x+=ball.moveX;
	ball.y+=ball.moveY;

	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = 'lime';
	ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
	ctx.fill();
	ctx.restore();
}

function drawRacket(){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = 'blue';
	ctx.fillRect(racket.x, racket.y, racket.width, racket.height);
	ctx.fill();
	ctx.restore();
}

function createBlocks(){
	let hBlocks = 10;
	let vBlocks = 6;
	let w = cvs.width/hBlocks;
	let h = 20;

	for(let i = 0; i < vBlocks; i++){
		for(let x = 0; x < hBlocks; x++){
			let blockX = x * w;
			let blockY = i * h;
			blocks.push(new Block(blockX,blockY,w,h));
		}
	}
}

function drawBlocks(){
	blocks.forEach((block)=>{
		block.draw();
	});
}

function checkCollision(){
	blocks.forEach((block, index)=>{
		if(ball.x + ball.r >= block.x && 
		ball.x <= block.x + block.w && 
		ball.y + ball.r >= block.y && 
		ball.y <= block.y + block.h){
			blocks.splice(index,1);

			bounce(ball.x,ball.y,ball.w,ball.h);
		}
	});

	if(!blocks.length){
		over = true;

		drawBlocks();
		
		setTimeout(() => {
			alert("You have won the game!");
			location.reload();
		})
		return false;
	}


	if(ball.x + ball.r >= racket.x && 
	ball.x <= racket.x + racket.width && 
	ball.y + ball.r >= racket.y && 
	ball.y <= racket.y + racket.height){
		bounce(racket.x,racket.y,racket.w,racket.h);
	}

	if(ball.x <= 0 || 
	ball.x + ball.r >= cvs.width || 
	ball.y <= 0 || 
	ball.y + ball.r >= cvs.height){
		if(ball.x <= 0 || ball.x + ball.r >= cvs.width) ball.moveX *= -1;
		if(ball.y <= 0 || ball.y + ball.r >= cvs.height) ball.moveY *= -1;
		// bounce(racket.x,racket.y,racket.w,racket.h);
	}
}

function bounce(x,y,w,h){
	let checkX = ball.x + ball.r >= x || ball.x <= x + w;
	let checkY = ball.y + ball.r >= y || ball.y <= y + h;

	if(checkX && checkY){
		ball.moveY *= -1;
	}
}

function checkOver(){
	if(ball.y > racket.y + racket.height / 10){
		over = true;
		alert('Game Over!');
		location.reload();
	}
}