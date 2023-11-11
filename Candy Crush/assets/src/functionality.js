let changeCancel = false;
let pass = false;
let filling = false;

function change(x1, y1, x2, y2) {
    if (filling) {
        gem1 = '';
        gem2 = '';
        return false;
    }

    changing = true;

    let changeInterval = setInterval(() => {
        if (fixed(gem1.x) != fixed(x2) && fixed(gem2.x) != fixed(x1)) {
            if (x1 < x2) gem1.x += speedX;
            else gem1.x -= speedX;

            if (x2 < x1) gem2.x += speedX;
            else gem2.x -= speedX;
        } else if (fixed(gem1.y) != fixed(y2) && fixed(gem2.y) != fixed(y1)) {
            if (y1 < y2) gem1.y += speedY;
            else gem1.y -= speedY;

            if (y2 < y1) gem2.y += speedY;
            else gem2.y -= speedY;
        } else {
            if (!changeCancel) {
                game_grid[gridGem1[0]][gridGem1[1]] = gem2;
                game_grid[gridGem2[0]][gridGem2[1]] = gem1;
                changeCancel = true;

                check();

                if (pass) return false;

                game_grid[gridGem1[0]][gridGem1[1]] = gem1;
                game_grid[gridGem2[0]][gridGem2[1]] = gem2;

                change(gem1.x, gem1.y, gem2.x, gem2.y);
            } else {
                changing = false;
                changeCancel = false;
                clearHighlight();
            }
            pass = false;
            clearInterval(changeInterval);
        }
    });
}

let direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
let lines = [];

function check() {
    if (filling) return false;

    for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
            let gem = game_grid[i][j];

            direction.forEach((dir, index) => {
                lines = [[i, j]];

                let x = dir[0] + j;
                let y = dir[1] + i;
                if (x >= 0 && y >= 0 && x < s && y < s) {
                    let nextGem = game_grid[y][x];

                    if (gem.type == nextGem.type) {
                        lines.push([y, x]);

                        while (dir) {
                            x += dir[0];
                            y += dir[1];

                            if (x >= 0 && y >= 0 && x < s && y < s) {
                                let nextGem2 = game_grid[y][x];

                                if (nextGem.type != nextGem2.type && nextGem.type <= 6) break;

                                lines.push([y, x]);
                            } else {
                                break;
                            }
                        }
                    }
                }
                checkLines(dir);
            })
        }
    }

    addGems();
}

function checkLines(dir) {
    if (lines.length >= 3) {
        let called = false;

        lines.forEach((line, i) => {
            let gem = game_grid[line[0]][line[1]];

            if (gem == gem1 || gem == gem2) {
                pass = true;
                setTimeout(() => {
                    pass = false;
                });
            }

            gem.destroyed = true;

            let animationInterval = setInterval(() => {
                if (gem.w > 0 || gem.h > 0) {
                    gem.w--;
                    gem.h--;
                } else {
                    clearInterval(animationInterval);
                }
            });
        });

        if(!powerUpActived){
            if (lines.length == 4) {
                if ((dir[0] == 1 && dir[1] == 0) || (dir[0] == -1 && dir[1] == 0)) powerUp.push('horizontal');
                else powerUp.push('vertical');
            } else if (lines.length >= 5) {
                powerUp.push('bomb');
            }
        }

        lines = [];
    }

    checkEmpty();
}

function checkEmpty() {
    for (let i = s - 1; i >= 0; i--) {
        for (let j = s - 1; j >= 0; j--) {
            let gem = game_grid[i][j];

            let y = i + 1;

            if (y < s && gem) {
                let nextGem = game_grid[y][j];

                if (!nextGem) {
                    let target = y * (cvs.height / 9);

                    game_grid[y][j] = gem;
                    game_grid[i][j] = '';

                    let checkEmptyInterval = setInterval(() => {
                        if (fixed(gem.y) < fixed(target)) {
                            filling = true;
                            gem.y += speedY;
                        } else {
                            filling = false;
                            clearInterval(checkEmptyInterval);
                        }
                    });

                }
            }
        }
    }
}

function addGems() {
    let addGemInterval = setInterval(() => {
        if(!over){
            for (let col = 0; col < s; col++) {
                let row = 0;
                let gem = game_grid[row][col];
                if (!gem) {
                    let w = cvs.width / s;
                    let h = cvs.height / s;
                    let gem;
                    if (powerUp.length) {
                        if (powerUp[0] == 'bomb') gem = 7;
                        if (powerUp[0] == 'vertical') gem = 8;
                        if (powerUp[0] == 'horizontal') gem = 9;
    
                        powerUp.shift();
                    } else {
                        gem = rand(0, 6)
                    }
                    game_grid[row][col] = new Gem(col, row - 1, w, h, gem, 'add');
                }
            }
        }else{
            clearInterval(addGemInterval);
        }
    }, 100);

    if (checkFilled()) clearInterval(addGemInterval);
}

function checkFilled() {
    let allFilled = true;
    for (let i = 0; i < s; i++) {
        for (let x = 0; x < s; x++) {
            let gem = game_grid[i][x];

            if (!gem) allFilled = false;
        }
    }

    return allFilled;
}