let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');

let blockLength = 20;
let blockSize = cvs.width / blockLength;

let textures = {
	grass: 'grass.jpg',
	water: 'water.jpg',
	stone: 'stone.jpg',
};

let stepOn = ['grass','stone'];

let blocks = [];

window.onload = ()=>{
	start();
}

function start(){
	loadGrid();
	renderMap();

	update();
}

function update(){
	checkKey();

	updateObject();

	requestAnimationFrame(update);
}