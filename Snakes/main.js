let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let length = 30;
let size = cvs.width/length;

let bodies = [];
let directions = [[0,1],[-1,0],[0,-1],[1,0]];
let snakeDirection = {x: 1, y: 0};

let food = {x: 0, y: 0};

window.onload = () => {
	start();
}

function start(){
	generateSnakes();
	generateFood();
	drawObjects();
	update();
}

function update(){
	setInterval(() => {
		ctx.clearRect(0,0,cvs.width,cvs.height);
		updateMovement();
		drawObjects();
		checkCollision();
	},300);
}

function rand(min, max){
	return Math.floor(Math.random() * max) + min;
}

function checkOutOfBound(x,y){
	return x >= 0 && y >= 0 && x < cvs.width && y < cvs.height;
}

// function drawGrid(){
// 	for(let i = 0; i < length; i++){
// 		let tileSize = i * size;

// 		ctx.moveTo(tileSize,0);
// 		ctx.lineTo(tileSize,cvs.height);

// 		ctx.moveTo(tileSize,0);
// 		ctx.lineTo(tileSize,cvs.height);

// 		ctx.stroke();
// 	}
// }

function drawObjects(){
	bodies.forEach(body => {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'rgb(150,211,50)';
		ctx.strokeStyle = 'white';
		ctx.rect(body.x * size, body.y * size, size, size);
		ctx.stroke();
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	});

	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = 'rgb(211,0,67)';
	ctx.fillRect(food.x * size, food.y * size, size, size);
	ctx.closePath();
	ctx.restore();
}

function checkCollision(){
	let head = bodies[0];

	if(head.x == food.x && head.y == food.y){
		generateFood();

		let tail = bodies[bodies.length - 1];
		bodies.push({x: tail.x + snakeDirection * -1, y: tail.y + snakeDirection * -1});

		drawObjects();
	}

	bodies.forEach((body, index) => {
		let head = bodies[0];
		
		if(index && head.x == body.x && head.y == body.y){
			restart();
		}
	})
}

function generateSnakes(){
	for(let i = 0; i < 5; i++){
		console.log(i*snakeDirection.x);
		bodies.push({x: length / 2 + i * snakeDirection.x * -1, y: length / 2});
	}
}

function generateFood(){
	food.x = rand(0,length-1);
	food.y = rand(0,length-1);
}

function restart(){
	alert('GAMEOVER');
	location.reload();
}