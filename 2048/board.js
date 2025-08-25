function generateGrid(){
	for(let i = 0; i < size; i++){
		gameGrid.push([])
		for(let j = 0; j < size; j++){
			gameGrid[i].push(0);
		}
	}
}

function drawGrid(){
	let s = blockSize;
	ctx.beginPath();
	ctx.strokeStyle = '#bbada0';
	ctx.lineWidth = '10';
	for(let i = 0; i <= size; i++){
		ctx.moveTo(0,i*s);
		ctx.lineTo(cvs.width,i*s);
		for(let j = 0; j <= size; j++){
			ctx.moveTo(j*s,0);
			ctx.lineTo(j*s,cvs.height);
		}
	}
	ctx.stroke();
}

function drawBlock(){
	for(let i = 0; i < size; i++){
		for(let j = 0; j < size; j++){
			let game_grid = gameGrid[i][j];
			if(game_grid != 0){
				let color;
				let s = blockSize;
				let x = j * s;
				let y = i * s;

				let textX = x+s/2;
				let textY = y+s/2;
				let fontSize;
				let fontColor;
				ctx.save();
				switch(game_grid){
					case 2:
						fontSize = '70px';
							color = "#eee4da";
						break;
					case 4:
						fontSize = '70px';
						color = "#ece0c8";
						break;
					case 8:
						fontSize = '70px';
						color = "#f2b179";
						break;
					case 16:
						fontSize = '67.3px';
						color = "#f29663";
						break;
					case 32:
						fontSize = '67.3px';
						color = "#f57c5f";
						break;
					case 64:
						fontSize = '67.3px';
						color = "#f75e3c";
						break;
					case 128:
						fontSize = '65px';
						color = "#edcf6f";
						break;
					case 256:
						fontSize = '65px';
						color = "#ebcc62";
						break;
					case 512:
						fontSize = '65px';
						color = "#edc64d";
						break;
					case 1024:
						fontSize = '62.3px';
						color = "#ecc440";
						break;
					case 2048:
						fontSize = '62.3px';
						color = "#edc12d";
						break;
				}
				ctx.fillStyle = color;
				ctx.fillRect(x,y,s,s);

				ctx.font = 'bold ' + fontSize + ' segoe UI';
				ctx.fillStyle = 'white';
				if(game_grid==2 || game_grid==4) ctx.fillStyle = '#776E65';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(game_grid,textX,textY);

				ctx.restore();

				if(game_grid == 2048) drawGameWin();
			}
		}
	}
}