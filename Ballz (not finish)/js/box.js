class Box{
	constructor(x,y,s){
		this.x = x;
		this.y = y;
		this.s = s;
		this.value = 0;
	}

	draw(){
		if(this.value != 0){
			ctx.beginPath();
			ctx.save();

			ctx.fillStyle = 'rgb(100,100,0)';
			ctx.fillRect(this.x*this.s, this.y*this.s, this.s, this.s);

			ctx.font = '40px segoe ui';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(this.value, this.x*this.s + this.s/2, this.y*this.s + this.s/2);
			ctx.fill();

			ctx.restore();
			ctx.closePath();
		}
	}
}