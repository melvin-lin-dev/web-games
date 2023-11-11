function generateGrid(){
	for(let row = 0; row < length; row++){
		gameGrid.push([]);
		for(let col = 0; col < length; col++){
			gameGrid[row].push('');
		}
	}
}

function generatePlayer(){
	for(let row = 0; row < 2; row++){
		for(let col = 0; col < 2; col++){
			let color = [['black','white'],['white','black']];

			gameGrid[row + 3][col + 3] = color[row][col];
		}
	}
}

function drawBoard(){
	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			let x = col * size;
			let y = row * size;
			ctx.beginPath();
			ctx.save();
			ctx.fillStyle = 'rgb(0,150,0)';
			ctx.fillRect(x,y,size,size);
			ctx.stroke();
			ctx.restore();
			ctx.closePath();
		}
	}
}

function drawLine(){
	for(let i = 0; i <= length; i++){
		ctx.beginPath();
		ctx.moveTo(0,i*size);
		ctx.lineTo(cvs.width,i*size);

		ctx.moveTo(i*size,0);
		ctx.lineTo(i*size,cvs.height);

		ctx.stroke();
		ctx.closePath();
	}
}

function drawPlayer(){
	for(let row = 0; row < length; row++){
		for(let col = 0; col < length; col++){
			if(gameGrid[row][col]){
				let x = col * size + size/2;
				let y = row * size + size/2;

				ctx.beginPath();
				ctx.save();
				ctx.fillStyle = gameGrid[row][col];
				ctx.arc(x,y,25,0,2*Math.PI);
				ctx.fill();
				ctx.restore();
				ctx.closePath();
			}
		}
	}
}