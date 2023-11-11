let obj = {
	'water1': {
		0: [0, 3],
		1: [1, 4],
		2: [2, 5],
		3: [3, 7],
		4: [3, 6],
		5: [4, 7],
		6: [5, 8],
		7: [5, 8],
		8: [5, 8],
		9: [5, 8],
		10: [4, 7],
		11: [3, 6],
		12: [4, 6],
		13: [3, 6],
		14: [2, 5],
		15: [1, 4],
		16: [1, 5],
		17: [2, 5],
		18: [2, 5],
		19: [2, 4],
	},
	'stone1': {
		7: [4, 9],
		8: [4, 9]
	}
}

function renderMap(){
	for(let i = 0; i < blockLength; i++){ 
		for(let j = 0; j < blockLength; j++){
			blocks[i][j] = new Block(j, i, textures['grass']);
		}
	}

	for(let key in obj){
		for(let y in obj[key]){
			let col = obj[key][y];
			for(let x = col[0]; x < col[1]; x++){
				for(let textureKey in textures){
					if(key.match(textureKey)){
						let block = blocks[y][x];
						block.texture = textures[textureKey];
						if(!(stepOn.indexOf(textureKey) + 1)) block.pass = false;
						else block.pass = true;
					}
				}
			}
		}
	}
}