let openList = [];
let closeList = {};
let dir = [[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1]];

function flow(x,y){
	openList = [];

	openList.push([x,y]);

	while(openList.length>0){
		let pos = openList.splice(0,1)[0],
			key = pos[0] + "|" + pos[1],
			block = cell[key];
			
		if(block.value == 'bee') return;

		let lines = block.line;

		lines.forEach((line)=>{
			let mustIndex = (line + 2) % 8,
				nextDir = dir[line],
				nextX = nextDir[0] + pos[0],
				nextY = nextDir[1] + pos[1],
				nextKey = nextX + "|" + nextY;

			if(nextX < 0 || nextY < 0 || nextX > size-1 || nextY > size-1 || nextKey in closeList) return;

			let nextBlock = cell[nextKey];

			if(nextBlock.flag) return;
			if(nextBlock.type == 'bee') return;

			let indexOf = nextBlock.line.indexOf(line) + 1;

			nextBlock.reveal = true;

			closeList[key] = {};
			openList.push([nextX,nextY]);
			// if(indexOf){
			// }
		});
	}
}