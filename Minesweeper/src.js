let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');


let cell = {};
let size = 10;
let bee = 15;

let cellSize = cvs.width/size;

let gameOver = null;

window.onload = function(){
  start();
}

function start(){
  generateBee();
  generateNumber();
  updateNumber();
  updateZero();
  generateLine();
  update();
}

function update(){
  ctx.clearRect(0,0,cvs.width,cvs.height);
  if(!gameOver){
    updateObject();
    drawGrid();
    checkWin();
    requestAnimationFrame(update);
  }else{
    updateObject();
    drawGrid();
    setTimeout(() => {
      alert('Game Over! You ' + gameOver + '!');
      location.reload();
    })
  }
}

function updateObject(){
  for(let key in cell){
    if(gameOver) cell[key].reveal = true;
    cell[key].draw();
  }
}

function generateBee(){
  let count = 0;
  for(let i = 0; i < size; i++){
    for(let j = 0; j < size; j++){
      let chance = Math.random();
      if(chance > 0.8 && i > 1){
        if(count == bee) return false;
        let x = j*cellSize;
        let y = i*cellSize;
        cell[j + "|" + i] = new Cell(x,y,'bee');
        count++;
      }
    }
  }
}

function generateNumber(){
  for(let i = 0; i < size; i++){
    for(let j = 0; j < size; j++){
      let x = j*cellSize;
      let y = i*cellSize;
      let theCell = cell[j + "|" + i];
      if(!theCell){
        cell[j + "|" + i] = new Cell(x,y,'number');
      }
    }
  }
}

function updateNumber(){
  for(let i = 0; i < size; i++){
    for(let j = 0; j < size; j++){
      let theCell = cell[j + "|" + i];
      if(theCell.type == 'bee'){
        for(let k = 0; k < 3; k++){
          for(let l = 0; l < 3; l++){
            let newX = j-1+l;
            let newY = i-1+k;
            if(newY < 0 || newX < 0 || newY > size-1 || newX > size-1) continue;
            let newCell = cell[newX + "|" + newY];
            if(newCell.type == 'number') newCell.value++;
          }
        }
      }
    }
  }
}

function updateZero(){
  for(let key in cell){
    let theCell = cell[key];
    if(theCell.value == 0){
      theCell.value = '';
    }
  }
}

function generateLine(){
  for(let key in cell){
    if(cell[key].type != 'bee') if(!cell[key].value) cell[key].generateLine();
  }
}

function checkWin(){
  let countReveal = 0;
  let countBee = 0;
  for(let key in cell){
    if(cell[key].type === 'number' && cell[key].reveal) countReveal++;
    if(cell[key].type === 'bee') countBee++;
  }

  if(countReveal === size * size - countBee) gameOver = 'Win';
}