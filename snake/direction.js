window.onkeyup = (e) => {
	let allowedKeys = [37,38,39,40];

	if(allowedKeys.indexOf(e.keyCode) + 1){
		let dir = directions[e.keyCode % 4];
		if((dir[0] && !snakeDirection.x) || (dir[1] && !snakeDirection.y)){
			snakeDirection.x = dir[0];
			snakeDirection.y = dir[1];
		}
	}
}

function updateMovement(){
	let head = bodies[0];
	let tail = bodies[bodies.length - 1];

	let newHead = {
		x: head.x + snakeDirection.x,
		y: head.y + snakeDirection.y
	}

	if(checkOutOfBound(newHead.x * size, newHead.y * size)){
		bodies.pop();
		bodies.unshift(newHead);	
	}else{
		restart();
	}
}