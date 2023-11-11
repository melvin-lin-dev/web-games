let lines = [[0,1,3],[0,1,2,3],[0,2],[0,3]];

let pipeImage = new Image();
pipeImage.src = 'assets/images/pipe.png';

let sourceDestinationImage = new Image();
sourceDestinationImage.src = 'assets/images/source_and_destination.png';

class Tile{
	constructor(imageType, x,y, type, rotate){
		this.image = imageType === 'pipe' ? pipeImage : sourceDestinationImage;
		this.imageType = imageType;
		
		this.x = x;
		this.y = y;

		this.w = imageType === 'pipe' ? this.image.width / 4 : this.image.width / 2;
		this.h = imageType === 'pipe' ? this.image.height / 2 : this.image.height;

		this.state = 0;
		this.type = type;
		this.lines = imageType === 'pipe' ? lines[type] : [0];

		this.rotate = rotate * 90;
		this.goRotate = rotate * 90;
	}

	update(){
		if(this.rotate != this.goRotate){
			this.rotate += 10;
		}
	}

	draw(){
		ctx.save();
		ctx.translate(this.x + this.w/2, this.y + this.h/2);
		ctx.rotate(this.rotate * Math.PI / 180);
		ctx.translate(-this.w/2, -this.h/2);
		ctx.drawImage(this.image, this.type * this.w, this.state * this.h, this.w, this.h, 0, 0, this.w, this.h);
		ctx.restore();
	}
}