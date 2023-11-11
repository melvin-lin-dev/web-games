class Block{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw(){
		ctx.beginPath();
		ctx.save();
		ctx.fillStyle = 'red';
		ctx.rect(this.x,this.y,this.w,this.h);
		ctx.fill();
		ctx.restore();
		ctx.stroke();
	}
}