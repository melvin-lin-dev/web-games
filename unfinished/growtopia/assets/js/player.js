class Player{
	constructor(){
		this.x = Math.floor(cvs.width / 2 / blockSize) * blockSize;
		this.y = Math.floor(cvs.height / 2 / blockSize) * blockSize;
		this.w = blockSize - 10;
		this.h = blockSize;
		this.view = {
			x: -blockSize,
			y: -blockSize,
			radiusX: cvs.width + blockSize * 2,
			radiusY: cvs.height + blockSize * 2
		}
	}

	draw(){
		let playerImageSrc = 'assets/images/player.png';
		let playerImage = new Image();
		playerImage.src = playerImageSrc;

		ctx.save();
		// ctx.beginPath();
		// ctx.scale(-1, 1);
		ctx.drawImage(playerImage,this.x,this.y,this.w,this.h);
		ctx.restore();
	}
}