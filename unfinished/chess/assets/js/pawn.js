let chessPiecesImg = new Image();
chessPiecesImg.src = 'assets/image/chessPieces.png';

let horizontalDirection = [[1,0],[-1,0]];
let verticalDirection = [[0,1],[0,-1]];

let plusDir = [...horizontalDirection, ...verticalDirection];
let crossDir = [[1,1],[1,-1],[-1,1],[-1,-1]];
let allDir = [...plusDir, ...crossDir];

let pawnCommanderData = {
	0: {
		type: 'queen',
		dir: allDir,
	},
	1: {
		type: 'king',
		dir: allDir,
	},
	2: {
		type: 'rook',
		dir: plusDir,
	},
	3: {
		type: 'horse',
		dir: plusDir,
	},
	4: {
		type: 'bishop',
		dir: crossDir,
	},
};

class Pawn{
	constructor(x,y,typeNumber,color){
		this.s = chessPiecesImg.width / 6;
		this.x = x;
		this.y = y;
		//
		// if(color === 0 && typeNumber === 1) {
		// 	typeNumber = 0;
		// }else if(color === 0 && typeNumber === 0){
		// 	typeNumber = 1;
		// }
		//

		this.color = color ? 'white' : 'black';

		let pawnData = {
			...pawnCommanderData,
			5: {
				type: 'soldier',
				dir: [this.color === 'white' ? [0,-1] : [0,1]],
			},
		};
		
		this.type = pawnData[typeNumber].type;
		this.direction = pawnData[typeNumber].dir;

		this.sx = this.s * typeNumber;
		this.sy = this.s * color;

		this.moved = false;
	}

	draw(){
		ctx.drawImage(chessPiecesImg, this.sx, this.sy, this.s, this.s, this.x + ((tileSize - this.s) / 2), this.y + ((tileSize - this.s) / 2), this.s, this.s);
	}
}
