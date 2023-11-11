let right = false, left = false;

window.onkeydown = function(e){
	let key = e.keyCode;
	if(key == 37) left = true;
	if(key == 39) right = true;
}

window.onkeyup = function(e){
	let key = e.keyCode;
	if(key == 37) left = false;
	if(key == 39) right = false;
}

function key(){
	let speed = 5;

	if(right && racket.x + racket.width <= cvs.width) racket.x+=speed;
	if(left && racket.x >= 0) racket.x-=speed;
}