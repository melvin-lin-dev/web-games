let gem1, gem2;
let changing = false;
let gridGem1, gridGem2;

function cvsClick(ev) {
    ev.stopPropagation();

    let x = ev.offsetX;
    let y = ev.offsetY;

    for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
            let gem = game_grid[i][j];

            // if(i ==  && j == 5) console.log(x >= gem.x)
            if (x >= gem.x && x <= gem.x + gem.rw && y >= gem.y && y <= gem.y + gem.h && !changing) {
                if(gem.type >= 7){
                    if(gem.type == 7){
                        let range = 5;
                        for(let k = 0; k < range; k++){
                            for(let l = 0; l < range; l++){
                                let newX = l + j - 2;
                                let newY = k + i - 2;
                                if(newX >= 0 && newX < s && newY >= 0 && newY < s){
                                    let powerUpGem = game_grid[newY][newX];

                                    if(powerUpGem){
                                        powerUpActived = true;

                                        powerUpGem.score = 3;
                                        powerUpGem.destroyed = true;

                                        let animationInterval = setInterval(() => {
                                            if (powerUpGem.w > 0 || powerUpGem.h > 0) {
                                                powerUpGem.w--;
                                                powerUpGem.h--;
                                            } else {
                                                clearInterval(animationInterval);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }else if(gem.type >= 8){
                        for(let k = 0; k < s; k++){
                            let powerUpGem;

                            if(gem.type == 8) powerUpGem = game_grid[k][j];
                            else powerUpGem = game_grid[i][k];

                            if(powerUpGem){
                                powerUpActived = true;

                                powerUpGem.score = 3;
                                powerUpGem.destroyed = true;

                                let animationInterval = setInterval(() => {
                                    if (powerUpGem.w > 0 || powerUpGem.h > 0) {
                                        powerUpGem.w--;
                                        powerUpGem.h--;
                                    } else {
                                        clearInterval(animationInterval);
                                    }
                                });
                            }
                        }
                    }
                    return false;
                }

                if (!gem1 || !gem2) {
                    if (!gem1) {
                        gem1 = gem;
                        gridGem1 = [i, j];
                    }
                    else {
                        let row = gridGem1[0];
                        let col = gridGem1[1];
                        if (
                            (row - 1 == i && col == j) ||
                            (row + 1 == i && col == j) ||
                            (row == i && col - 1 == j) ||
                            (row == i && col + 1 == j)
                        ){
                            gem2 = gem;
                            gridGem2 = [i, j];
                            change(gem1.x, gem1.y, gem2.x, gem2.y);
                        }else{
                            gem1 = gem;
                            gridGem1 = [i, j];
                        }
                    }
                }
            }
        }
    }
}