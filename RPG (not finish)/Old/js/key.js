let convertKey = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};

let speed = 2;
let move = {
	up: [false, 'y', -1 * speed, 'bottom'], 
	right: [false, 'x', 1 * speed , 'left'], 
	down: [false, 'y', 1 * speed, 'top'], 
	left: [false, 'x', -1 * speed, 'right']
};

window.onkeydown = (e) => {
	let key = e.keyCode;
	if(convertKey[key]) move[convertKey[key]][0] = true;
}

window.onkeyup = (e) => {
	let key = e.keyCode;
	if(convertKey[key]) move[convertKey[key]][0] = false;
}

function checkKey(){
	for(let key in move){
		let dir = move[key];
		if(dir[0]) {
			if(!checkCollision(dir[3], dir[2])) player[dir[1]] = parseInt(player[dir[1]]) + dir[2];
		}
	}
}