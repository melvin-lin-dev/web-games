function onClick(e) {
    let x = e.offsetX;
    let y = e.offsetY;

    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            let tileX = col * size;
            let tileY = row * size;

            if (x >= tileX && y >= tileY && x < tileX + size && y < tileY + size && !gameOver) {
                let num = gameGrid[row][col];
                if (num == 9) num = 1;
                else num++;
                gameGrid[row][col] = num;
            }
        }
    }
}

function validation() {
    for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
            if (checkDuplicate(row, col)) {
                return false;
            }
        }
    }

    gameOver = true;
}

function checkDuplicate(y, x) {
    let currentNumber = gameGrid[y][x];

    for (let i = 0; i < length; i++) {
        if (x != i && gameGrid[y][i] == currentNumber) {
            return true;
        }

        if (y != i && gameGrid[i][x] == currentNumber) {
            return true;
        }
    }

    let startRow = y >= 0 && y < 3 ? 0 : y >= 3 && y < 6 ? 3 : 6;
    let startCol = x >= 0 && x < 3 ? 0 : x >= 3 && x < 6 ? 3 : 6;

    for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
            if (gameGrid[row][col] === currentNumber && row !== y && col !== x) {
                return true;
            }
        }
    }
}

function generateNumber() { //Masih Belum Dapat
    for (let row = 0; row < length; row++) {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let col = 0; col < length; col++) {
            while (true) {
                let index = random(0, numbers.length - 1);

                if (!checkDuplicate(row, col)) {
                    numbers.splice(index, 1);
                    break;
                } else {
                    let randNum = numbers[index];
                    gameGrid[row][col] = randNum;
                    break;
                }
            }
        }
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}