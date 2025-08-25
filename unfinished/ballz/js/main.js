let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let r = 10;
let ball = {x: Math.floor(cvs.width/2), y: Math.floor(cvs.height - r), r: r};

let s = 71;
let grid = [];

window.onload = function(){
	start();
}

function start(){
	drawGrid();
	addBox();
	update();
}

function update(){
	ctx.clearRect(0,0,cvs.width,cvs.height);
	drawBox();
	drawLine();
	drawBall();
	requestAnimationFrame(update);
}

function drawBall(){
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
	ctx.fill();
	ctx.restore();
}

function drawGrid(){
	for(let i = 0; i < cvs.height/s; i++){
		grid.push([]);
		for(let j = 0; j < cvs.width/s; j++){
			grid[i].push(new Box(j,i,s));
		}
	}
}

function addBox(){
	for(let i = 0; i < grid[0].length; i++){
		let rand = Math.random();
		if(rand > 0.7){
			grid[0][i].value = 50;
		}
	}
}

function drawBox(){
	for(let i = 0; i < cvs.height/s; i++){
		for(let j = 0; j < cvs.width/s; j++){
			let box = grid[i][j];
			box.draw();
		}
	}
}

function drawLine(){
	ctx.beginPath();
	ctx.strokeStyle = 'grey';
	for(let i = 0; i < grid.length; i++){
		ctx.moveTo(0,i*s);
		ctx.lineTo(cvs.width,i*s);
	}

	for(let j = 0; j < grid[0].length; j++){
		ctx.moveTo(j*s,0);
		ctx.lineTo(j*s,cvs.height);
	}
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function shoot(e){
	let cvsRect = cvs.getBoundingClientRect();
	let x = e.pageX - cvsRect.left;
	let y = e.pageY - cvsRect.top;

	// for(let i = 0; i < cvs.height/s; i++){
	// 	for(let j = 0; j < cvs.width/s; j++){
	// 		let box = grid[i][j];
	// 		i
	// 	}
	// }

	move(Math.floor(x),Math.floor(y));
}

function move(x,y){
	let moveInterval = setInterval(function(){
		if(ball.x != x || ball.y != y){
			if(ball.x != x){
				if(x > ball.x) ball.x++;
				else ball.x--;
			}

			if(ball.y != y){
				if(y > ball.y) ball.y++;
				else ball.y--;
			}

		}else{
			clearInterval(moveInterval);
		}
	},5);
}