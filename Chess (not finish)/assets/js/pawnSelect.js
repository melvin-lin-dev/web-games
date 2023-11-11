class PawnSelect{
	constructor(x, type){
		this.s = chessPiecesImg.width / 6;
		this.x = x * this.s;
		this.y = 0;
		this.sx = type * this.s;

		this.type = type;

		this.hover = false;
		this.r = tileSize / 5;
	}

	draw(){
		if(this.hover){
			pawnSelectCtx.save();
			pawnSelectCtx.beginPath();
			pawnSelectCtx.fillStyle = 'rgb(0,130,230)';
			pawnSelectCtx.fillRect(this.x, this.y, this.s, this.s);
			// pawnSelectCtx.closePath();
			pawnSelectCtx.restore();
		}
		
		let sy = turn === 'white' ? 0 : 1;

		// pawnSelectCtx.drawImage(chessPiecesImg, this.sx, sy * this.s, this.s, this.s, this.x, this.y, this.s, this.s);
	}
}
