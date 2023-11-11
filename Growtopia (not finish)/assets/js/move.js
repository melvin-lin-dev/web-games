let move = {left: false, right: false};
let moveSpeed = 4;

window.onkeydown = (e) => {
	checkKey(e.keyCode, true);
}

window.onkeyup = (e) => {
	checkKey(e.keyCode, false);
}

function checkKey(key, command = ''){
	switch(key){
		case 68:
			move.right = command;
			break;
		case 65:
			move.left = command;
			break;
	}
}

function moving(){
	if(move.right){
		objectMove(-1);
	}else if(move.left){
		objectMove(1);
	}
}

function objectMove(direction){
	for(let row = 0; row < game.height; row++){
		for(let col = 0; col < game.width; col++){
			gameBoard[row][col].x += moveSpeed * direction;
		}
	}
}