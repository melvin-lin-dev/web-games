let selectedPawn;
let promotedSoldier;

function pawnSelect(e) {
    let mouse = {
        x: e.offsetX,
        y: e.offsetY,
    };

    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            let pawn = pawns[y][x];
            let tile = gameBoard[y][x];

            if (mouse.x < tile.x + tileSize && mouse.x >= tile.x &&
                mouse.y < tile.y + tileSize && mouse.y >= tile.y) {
                if (pawn && pawn.color === turn) {
                    refreshBoard();

                    checkMove(pawn);

                    tile.color = 'yellow';
                    selectedPawn = {pawn, tile};
                } else if (tile.dot || (tile.eatable && pawn.color !== turn)) {
                    if (selectedPawn.pawn.type !== 'soldier' && tile.dot) {
                        consecutiveMoves++;

                        isDraw();
                    } else {
                        consecutiveMoves = 0;
                    }

                    // checkKingMove();
                    pawns[selectedPawn.tile.y / tileSize][selectedPawn.tile.x / tileSize] = '';

                    selectedPawn.pawn.x = x * tileSize;
                    selectedPawn.pawn.y = y * tileSize;

                    pawns[y][x] = selectedPawn.pawn;
                    pawns[y][x].moved = true;

                    if (selectedPawn.pawn.type === 'soldier' && (y - 1 < 0 || y + 1 > tileLength - 1)) {
                        promotedSoldier = selectedPawn.pawn;

                        document.querySelector('.chess-pawn-select').classList.add('active');
                    }

                    if (selectedPawn.pawn.type === 'king') {
                        let changePositionBoard = gameBoard[y][x];

                        if (changePositionBoard.changePosition === 'right') {
                            pawns[y][x - 1] = new Pawn((x - 1) * tileSize, y * tileSize, 2, turn === 'white');
                            pawns[y][x - 1].moved = true;
                            pawns[y][7] = '';
                            changePositionBoard.changePosition = '';
                        } else if (changePositionBoard.changePosition === 'left') {
                            pawns[y][x + 1] = new Pawn((x + 1) * tileSize, y * tileSize, 2, turn === 'white');
                            pawns[y][x + 1].moved = true;
                            pawns[y][0] = '';
                            changePositionBoard.changePosition = '';
                        }
                    }

                    refreshBoard();

                    turn = turn === 'white' ? 'black' : 'white';

                    // checkMove(pawns[y][x]);
                    clearBoard();
                    clearBoard(true);
                    checkKingMoves(true);
                    
                    isCheckMate();
                }

                return false;
            }
        }
    }
}

function checkMove(pawn) {
    // alert('b');
    pawn.direction.forEach((direction) => {
        let dir = {
            x: direction[0],
            y: direction[1],
        };

        let next = {
            x: pawn.x / tileSize + dir.x,
            y: pawn.y / tileSize + dir.y,
        };

        let nextPawn;

        let checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

        if (checkWall) {
            nextPawn = pawns[next.y][next.x];

            if (pawn.type !== 'horse') {
                if (pawn.type !== 'soldier') {
                    if (nextPawn && pawn.color !== nextPawn.color) {
                        check(nextPawn);

                        setTile('eatable', pawn, next);

                        if (pawn.type === 'king') {
                            checkKingMoves();
                        }
                    } else if (!nextPawn) {
                        setTile('dot', pawn, next);

                        if (pawn.type === 'king') {
                            checkKingMoves();
                        }

                        while (pawn.type !== 'king') {
                            let nextNext = {
                                x: next.x + dir.x,
                                y: next.y + dir.y,
                            };

                            if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                                let nextNextPawn = pawns[nextNext.y][nextNext.x];

                                if (!nextNextPawn) {
                                    setTile('dot', pawn, nextNext);

                                    next.x = nextNext.x;
                                    next.y = nextNext.y;
                                } else if (pawn.color !== nextNextPawn.color) {
                                    check(nextNextPawn);
                                    
                                    // gameBoard[nextNext.y][nextNext.x].eatable = true;
                                    setTile('eatable', pawn, nextNext);

                                    break;
                                } else {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                } else {
                    if (!nextPawn) {
                        setTile('dot', pawn, next);

                        const newNext = {
                            y: next.y + dir.y,
                            x: next.x
                        }

                        if (!pawn.moved && !pawns[newNext.y][newNext.x]) {
                            setTile('dot', pawn, newNext);
                        }
                    }

                    horizontalDirection.forEach((horizontalDir) => {
                        let nextNext = {
                            x: horizontalDir[0] + next.x,
                            y: horizontalDir[1] + next.y,
                        };

                        let nextNextPawn = pawns[nextNext.y][nextNext.x];

                        if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength && nextNextPawn && pawn.color !== nextNextPawn.color) {
                            check(nextNextPawn);

                            setTile('eatable', pawn, nextNext);
                            // gameBoard[nextNext.y][nextNext.x].eatable = true;
                        }
                    })
                }
            } else if (pawn.type === 'horse') {
                next.x += dir.x;
                next.y += dir.y;

                checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

                if (checkWall) {
                    nextPawn = pawns[next.y][next.x];

                    if (dir.y) {
                        horizontalDirection.forEach((horizontalDir) => {
                            let nextNext = {
                                x: horizontalDir[0] + next.x,
                                y: horizontalDir[1] + next.y,
                            };

                            horseMove(nextNext, pawn);
                        })
                    } else if (dir.x) {
                        verticalDirection.forEach((verticalDir) => {
                            let nextNext = {
                                x: verticalDir[0] + next.x,
                                y: verticalDir[1] + next.y,
                            };

                            horseMove(nextNext, pawn);
                        })
                    }
                }
            }
        }
    });

    if (pawn.type === 'king') {
        checkChangePosition(pawn);
    }

    // checkKingMoves(true);
}

function setTile(type, pawn, obj) {
    const ORIGINAL_PAWN_POS = {
        x: pawn.x / tileSize,
        y: pawn.y / tileSize
    };
    const CAN_ORIGINAL_PAWN_MOVE = canPawnMove(ORIGINAL_PAWN_POS);

    const CAN_PAWN_MOVE = !canPawnMove(obj, ORIGINAL_PAWN_POS);

    if (CAN_ORIGINAL_PAWN_MOVE || CAN_PAWN_MOVE) {
        if ((isKingCheck() && gameBoard[obj.y][obj.x].needProtection === turn && pawn.type !== 'king') || 
            !isKingCheck() || (pawn.type === 'king' && !gameBoard[obj.y][obj.x].friendProtection)
        ) {
            gameBoard[obj.y][obj.x][type] = true;
        }
    }
}

function horseMove(nextNext, pawn, checkType = '', checkCheck = false) {
    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
        let nextNextPawn = pawns[nextNext.y][nextNext.x];

        if (checkType !== 'can_move') {
            if (nextNextPawn && nextNextPawn.color !== pawn.color) {
                // check(nextNextPawn);
    
                if (checkType === 'check' && nextNextPawn.type === 'king') {
                    // alert('line: 257');
                    gameBoard[nextNext.y][nextNext.x].addCheck(nextNext.y, nextNext.x, pawn);
                    gameBoard[pawn.y / tileSize][pawn.x / tileSize].needProtection = turn;
                } else if (checkType === 'protection'){
                    // gameBoard[pawn.y / tileSize][pawn.x / tileSize].needProtection = true;
                } else if (!checkCheck) {
                    setTile('eatable', pawn, nextNext);
                    // gameBoard[nextNext.y][nextNext.x].eatable = true;
                }
            } else if (nextNextPawn.color === pawn.color) {
                gameBoard[nextNext.y][nextNext.x].friendProtection = true;
            } else if (!nextNextPawn && !checkCheck) {
                if (checkType !== 'check') {
                    setTile('dot', pawn, nextNext);
                } else {
                    clearKingMove(nextNext);
                    // gameBoard[nextNext.y][nextNext.x].dot = false;
                    // gameBoard[nextNext.y][nextNext.x].eatable = false;
                }
            }
        } else {
            if(nextNextPawn.color === turn && nextNextPawn.type === 'king'){
                return false;
            }
            
            return true;
        }
    }
}

function pawnSelectClick(type) {
    pawns[promotedSoldier.y / tileSize][promotedSoldier.x / tileSize] = new Pawn(promotedSoldier.x, promotedSoldier.y, type, turn === 'white' ? 0 : 1);
    document.querySelector('.chess-pawn-select').classList.remove("active");
}

function clearKingMove(obj) {
    gameBoard[obj.y][obj.x].dot = false;
    gameBoard[obj.y][obj.x].eatable = false;
}

function clearBoard(clearCheck = false) {
    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            let tile = gameBoard[y][x];

            if (clearCheck) {
                tile.check = new Set();
                tile.needProtection = '';
            } else {
                tile.dot = false;
                tile.eatable = false;
                tile.friendProtection = false;
            }
        }
    }
}

function check(pawn) {
    if (pawn.type === 'king') {
        const y = pawn.y / tileSize;
        const x = pawn.x / tileSize;
        gameBoard[y][x].addCheck(y, x, pawn);
    }
}

function checkKingMoves(checkCheck = false) {
    if (checkCheck) {
        clearBoard(checkCheck);
    }

    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            if (pawns[y][x]) {
                if (pawns[y][x].color !== turn || checkCheck) {
                    checkKingMove(pawns[y][x], checkCheck);
                }
            }
        }
    }
}

function checkKingMove(pawn, checkCheck) {
    pawn.direction.forEach((direction) => {
        let dir = {
            x: direction[0],
            y: direction[1],
        };

        let next = {
            x: pawn.x / tileSize + dir.x,
            y: pawn.y / tileSize + dir.y,
        };

        let nextPawn;

        let checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

        if (checkWall) {
            nextPawn = pawns[next.y][next.x];

            if (pawn.type !== 'horse') {
                if (pawn.type !== 'soldier') {
                    if (nextPawn && pawn.color !== nextPawn.color && nextPawn.type === 'king') {
                        gameBoard[next.y][next.x].addCheck(next.y, next.x, pawn);
                        needProtection(nextPawn, pawn, dir);
                    } else if (pawn.color === nextPawn.color) {
                        gameBoard[next.y][next.x].friendProtection = true;
                    } else if (!nextPawn || (nextPawn.type === 'king' && pawn.color !== nextPawn.color)) {
                        if (!checkCheck) {
                            clearKingMove(next);
                        }

                        while (pawn.type !== 'king') {
                            let nextNext = {
                                x: next.x + dir.x,
                                y: next.y + dir.y,
                            };

                            if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                                let nextNextPawn = pawns[nextNext.y][nextNext.x];

                                if ((!nextNextPawn || (nextNextPawn.type === 'king' && pawn.color !== nextNextPawn.color)) && !checkCheck) {
                                    clearKingMove(nextNext);
                                } else if (pawn.color !== nextNextPawn.color && nextNextPawn.type === 'king') {
                                    gameBoard[nextNext.y][nextNext.x].addCheck(nextNext.y, nextNext.x, pawn);
                                    needProtection(nextNextPawn, pawn, dir);

                                    break;
                                } else if (pawn.color === nextNextPawn.color) {
                                    gameBoard[nextNext.y][nextNext.x].friendProtection = true;

                                    break;
                                } else if (nextNextPawn) {
                                    break;
                                }

                                next.x = nextNext.x;
                                next.y = nextNext.y;
                            } else {
                                break;
                            }
                        }
                    }
                } else {
                    if (!nextPawn || (nextPawn.type === 'king' && pawn.color !== nextPawn.color)) {
                        clearKingMove(next);

                        if (!pawn.moved && !pawns[next.y + dir.y][next.x] && !checkCheck) {
                            clearKingMove({...next, y: next.y + dir.y});
                        }
                    }

                    horizontalDirection.forEach((horizontalDir) => {
                        let nextNext = {
                            x: horizontalDir[0] + next.x,
                            y: horizontalDir[1] + next.y,
                        };

                        if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                            let nextNextPawn = pawns[nextNext.y][nextNext.x];

                            if (nextNextPawn && pawn.color !== nextNextPawn.color && pawn.type === 'king') {
                                gameBoard[nextNext.y][nextNext.x].addCheck(nextNext.y, nextNext.x, pawn);
                                needProtection(nextNextPawn, pawn, dir);
                            } else if (pawn.color === nextNextPawn.color) {
                                gameBoard[nextNext.y][nextNext.x].friendProtection = true;
                            }
                        }
                    })
                }
            } else if (pawn.type === 'horse') {
                next.x += dir.x;
                next.y += dir.y;

                checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

                if (checkWall) {
                    if (dir.y) {
                        horizontalDirection.forEach((horizontalDir) => {
                            let nextNext = {
                                x: horizontalDir[0] + next.x,
                                y: horizontalDir[1] + next.y,
                            };

                            horseMove(nextNext, pawn, 'check', checkCheck);
                        })
                    } else if (dir.x) {
                        verticalDirection.forEach((verticalDir) => {
                            let nextNext = {
                                x: verticalDir[0] + next.x,
                                y: verticalDir[1] + next.y,
                            };

                            horseMove(nextNext, pawn, 'check', checkCheck);
                        })
                    }
                }
            }
        }
    })
}

function checkChangePosition(king) {
    let kingOriginalPosition = 4;
    let y;

    if (!king.moved) {
        if (king.color === 'white') y = pawns.length - 1;
        else if (king.color === 'black') y = 0;

        if (!pawns[y][7].moved && pawns[y][7]) {
            if (checkAllowChangePosition(kingOriginalPosition + 1, 6, y) && gameBoard[y][kingOriginalPosition + 1].dot) {
                gameBoard[y][kingOriginalPosition + 2].changePosition = 'right';
                gameBoard[y][kingOriginalPosition + 2].dot = true;
            }
        } else {
            gameBoard[y][kingOriginalPosition + 2].dot = false;
        }

        if (!pawns[y][0].moved && pawns[y][0]) {
            if (checkAllowChangePosition(1, kingOriginalPosition - 1, y) && gameBoard[y][kingOriginalPosition - 1].dot) {
                gameBoard[y][kingOriginalPosition - 2].changePosition = 'left';
                gameBoard[y][kingOriginalPosition - 2].dot = true;
            }
        } else {
            gameBoard[y][kingOriginalPosition - 2].dot = false;
        }
    } else {
        y = turn === 'black' ? 0 : 7;

        gameBoard[y][kingOriginalPosition + 2].changePosition = '';
        gameBoard[y][kingOriginalPosition - 2].changePosition = '';
    }
}

function checkAllowChangePosition(start, end, y) {
    let pass = true;

    for (let i = start; i <= end; i++) {
        if (pawns[y][i]) {
            pass = false;
        }
    }

    return pass;
}

function isKingCheck() {
    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            if (pawns[y][x].color === turn && pawns[y][x].type === 'king') {
                return gameBoard[y][x].check.size;
            }
        }
    }

    return 0;
}

function needProtection(king, pawn, dir) {
    dir.x *= -1;
    dir.y *= -1;

    let next = {
        x: king.x / tileSize + dir.x,
        y: king.y / tileSize + dir.y,
    };

    let checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

    if (checkWall) {
        if (pawn.type !== 'horse') {
            if (pawn.type !== 'soldier') {
                gameBoard[next.y][next.x].needProtection = king.color;

                while (!pawns[next.y][next.x]) {
                    let nextNext = {
                        x: next.x + dir.x,
                        y: next.y + dir.y,
                    };

                    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                        let nextNextPawn = pawns[nextNext.y][nextNext.x];

                        gameBoard[nextNext.y][nextNext.x].needProtection = king.color;

                        if (nextNextPawn) {
                            break;
                        }

                        next.x = nextNext.x;
                        next.y = nextNext.y;
                    } else {
                        break;
                    }
                }
            } else {
                gameBoard[next.y][next.x].needProtection = king.color;

                if (!pawn.moved && !pawns[next.y + dir.y][next.x] && !checkCheck) {
                    gameBoard[next.y + dir.y][next.x].needProtection = king.color;
                }

                horizontalDirection.forEach((horizontalDir) => {
                    let nextNext = {
                        x: horizontalDir[0] + next.x,
                        y: horizontalDir[1] + next.y,
                    };

                    let nextNextPawn = pawns[nextNext.y][nextNext.x];

                    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength && nextNextPawn && pawn.color !== nextNextPawn.color && pawn.type === 'king') {
                        gameBoard[nextNext.y][nextNext.x].needProtection = king.color;
                    }
                })
            }
        }
    }
}

function canPawnMove(exceptionPos, originalPawnPos = ''){
    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            const pawn = pawns[y][x];
            // if (pawn.color !== turn && pawn.type !== 'queen') continue; // DEBUG
            if (pawn && pawn.color !== turn) {
                for(let j = 0; j < pawn.direction.length; j++){
                    const direction = pawn.direction[j];
                    let pawnExceptionMeet = false;

                    let dir = {
                        x: direction[0],
                        y: direction[1],
                    };
            
                    let next = {
                        x: pawn.x / tileSize + dir.x,
                        y: pawn.y / tileSize + dir.y,
                    };
            
                    let nextPawn;
            
                    let checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

                    if (checkWall) {
                        nextPawn = pawns[next.y][next.x];
            
                        if (pawn.type !== 'horse') {
                            if (pawn.type !== 'soldier') {
                                if(next.x === exceptionPos.x && next.y === exceptionPos.y){
                                    pawnExceptionMeet = true;
                                }

                                if (nextPawn && nextPawn.color === turn && nextPawn.type === 'king') {
                                    if(originalPawnPos){
                                        gameBoard[pawn.y / tileSize][pawn.x / tileSize].eatable = true;
                                    }

                                    return false;
                                } else if (!nextPawn) {
                                    while (pawn.type !== 'king') {
                                        let nextNext = {
                                            x: next.x + dir.x,
                                            y: next.y + dir.y,
                                        };
            
                                        if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                                            let nextNextPawn = pawns[nextNext.y][nextNext.x];

                                            if(nextNext.x === exceptionPos.x && nextNext.y === exceptionPos.y){
                                                pawnExceptionMeet = true;
                                            }

                                            if (!nextNextPawn || (nextNext.x === exceptionPos.x && nextNext.y === exceptionPos.y) || (nextNext.x === originalPawnPos.x && nextNext.y === originalPawnPos.y)) {
                                                next.x = nextNext.x;
                                                next.y = nextNext.y;
                                            } else if (nextNextPawn.color === turn && nextNextPawn.type === 'king' && pawnExceptionMeet) {
                                                if(originalPawnPos){
                                                    gameBoard[pawn.y / tileSize][pawn.x / tileSize].eatable = true;
                                                }

                                                return false;
                                            } else {
                                                break;
                                            }
                                        } else {
                                            break;
                                        }
                                    }
                                }
                            } else {
                                horizontalDirection.forEach((horizontalDir) => {
                                    let nextNext = {
                                        x: horizontalDir[0] + next.x,
                                        y: horizontalDir[1] + next.y,
                                    };
            
                                    let nextNextPawn = pawns[nextNext.y][nextNext.x];
            
                                    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength && nextNextPawn && nextNextPawn.color === turn && nextNextPawn.type === 'king') {
                                        return false;
                                    }
                                })
                            }
                        } else if (pawn.type === 'horse') {
                            next.x += dir.x;
                            next.y += dir.y;
            
                            checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;
            
                            if (checkWall) {
                                nextPawn = pawns[next.y][next.x];
            
                                if (dir.y) {
                                    horizontalDirection.forEach((horizontalDir) => {
                                        let nextNext = {
                                            x: horizontalDir[0] + next.x,
                                            y: horizontalDir[1] + next.y,
                                        };
            
                                        return horseMove(nextNext, pawn, 'can_move');
                                    })
                                } else if (dir.x) {
                                    verticalDirection.forEach((verticalDir) => {
                                        let nextNext = {
                                            x: verticalDir[0] + next.x,
                                            y: verticalDir[1] + next.y,
                                        };
            
                                        return horseMove(nextNext, pawn, 'can_move');
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}