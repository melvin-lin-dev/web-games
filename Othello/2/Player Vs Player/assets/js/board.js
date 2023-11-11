function drawLine(){
	ctx.beginPath();
	ctx.save();
	for(let i = 0; i < length; i++){
		ctx.moveTo(0,size * i);
		ctx.lineTo(cvs.width, size*i);

		ctx.moveTo(size * i, 0);
		ctx.lineTo(size*i, cvs.height);
	}
	ctx.stroke();
	ctx.restore();
}

function generateTile(){
	let startingTile = [
		['black','white'],
		['white','black']
	];

	for(let row = 0; row < 2; row++){
		for(let col = 0; col < 2; col++){
			gameGrid[row + 3][col + 3].color = startingTile[row][col];
		}
	}
}