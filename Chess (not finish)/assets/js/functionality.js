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
                        checkMate(nextPawn);

                        setTile('eatable', pawn, next);

                        if (pawn.type === 'king') {
                            console.log('eatable cok');
                            console.log(pawn);
                            checkKingMoves();
                        }
                        // gameBoard[next.y][next.x].eatable = true;
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
                                    checkMate(nextNextPawn);

                                    setTile('eatable', pawn, nextNext);
                                    // gameBoard[nextNext.y][nextNext.x].eatable = true;

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
                        // console.log(next)

                        if (!pawn.moved && !pawns[next.y + dir.y][next.x]) {
                            // console.log(next, dir.y)
                            setTile('dot', pawn, {...next, y: next.y + dir.y});
                        }
                    }

                    horizontalDirection.forEach((horizontalDir) => {
                        let nextNext = {
                            x: horizontalDir[0] + next.x,
                            y: horizontalDir[1] + next.y,
                        };

                        let nextNextPawn = pawns[nextNext.y][nextNext.x];

                        if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength && nextNextPawn && pawn.color !== nextNextPawn.color) {
                            checkMate(nextNextPawn);

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
    if ((isKingCheckMate() && gameBoard[obj.y][obj.x].needProtection === turn && !gameBoard[obj.y][obj.x].friendProtection) || !isKingCheckMate() || (pawn.type === 'king' && !gameBoard[obj.y][obj.x].friendProtection)) {
        // console.log(isKingCheckMate());
        // console.log(isKingCheckMate(), gameBoard[obj.y][obj.x].friendProtection)
        gameBoard[obj.y][obj.x][type] = true;
    }
}

// function setEatable(obj) {
//     if ((isKingCheckMate() && gameBoard[obj.y][obj.x].needProtection === turn) || !isKingCheckMate()) {
//         // console.log(isKingCheckMate());
//         gameBoard[obj.y][obj.x].eatable = true;
//     }
// }

function horseMove(nextNext, pawn, checkType = '', checkCheckMate) {
    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
        let nextNextPawn = pawns[nextNext.y][nextNext.x];

        if (nextNextPawn && nextNextPawn.color !== pawn.color) {
            checkMate(nextNextPawn);

            if (checkType === 'checkMate' && pawn.type === 'king') {
                gameBoard[nextNext.y][nextNext.x].checkMate = true;
            } else if(checkType === 'protection'){
                gameBoard[nextNext.y][nextNext.x].needProtection = true;
            } else if (!checkCheckMate) {
                setTile('eatable', pawn, nextNext);
                // gameBoard[nextNext.y][nextNext.x].eatable = true;
            }
        } else if (nextNextPawn.color === pawn.color) {
            gameBoard[nextNext.y][nextNext.x].friendProtection = true;
        } else if (!nextNextPawn && !checkCheckMate) {
            if (checkType !== 'checkMate') {
                setTile('dot', pawn, nextNext);
            } else {
                clearKingMove(nextNext);
                // gameBoard[nextNext.y][nextNext.x].dot = false;
                // gameBoard[nextNext.y][nextNext.x].eatable = false;
            }
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

function clearBoard(clearCheckMate = false) {
    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            let tile = gameBoard[y][x];

            if (clearCheckMate) {
                tile.checkMate = false;
                tile.needProtection = false;
            } else {
                tile.dot = false;
                tile.eatable = false;
                tile.friendProtection = false;
            }
        }
    }
}

function checkMate(pawn) {
    if (pawn.type === 'king') {
        gameBoard[pawn.y / tileSize][pawn.x / tileSize].checkMate = true;
    }
}

function checkKingMoves(checkCheckMate = false) {
    if (checkCheckMate) {
        clearBoard(checkCheckMate);
    }

    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            if (pawns[y][x]) {
                if (pawns[y][x].color !== turn || checkCheckMate) {
                    checkKingMove(pawns[y][x], checkCheckMate);
                }
            }
        }
    }
}

function checkKingMove(pawn, checkCheckMate) {
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
                        gameBoard[next.y][next.x].checkMate = true;
                        needProtection(nextPawn, pawn, dir);
                    } else if (pawn.color === nextPawn.color) {
                        gameBoard[next.y][next.x].friendProtection = true;
                    } else if (!nextPawn || (nextPawn.type === 'king' && pawn.color !== nextPawn.color)) {
                        if (!checkCheckMate) {
                            // gameBoard[next.y][next.x].dot = false;
                            clearKingMove(next);
                        }

                        while (pawn.type !== 'king') {
                            let nextNext = {
                                x: next.x + dir.x,
                                y: next.y + dir.y,
                            };

                            if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                                let nextNextPawn = pawns[nextNext.y][nextNext.x];

                                if ((!nextNextPawn || (nextNextPawn.type === 'king' && pawn.color !== nextNextPawn.color)) && !checkCheckMate) {
                                    // gameBoard[nextNext.y][nextNext.x].dot = false;
                                    clearKingMove(nextNext);
                                } else if (pawn.color !== nextNextPawn.color && nextNextPawn.type === 'king') {
                                    gameBoard[nextNext.y][nextNext.x].checkMate = true;
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
                        // gameBoard[next.y][next.x].dot = false;
                        clearKingMove(next);

                        if (!pawn.moved && !pawns[next.y + dir.y][next.x] && !checkCheckMate) {
                            // gameBoard[next.y + dir.y][next.x].dot = false;
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
                                gameBoard[nextNext.y][nextNext.x].checkMate = true;
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

                            horseMove(nextNext, pawn, 'checkMate', checkCheckMate);
                        })
                    } else if (dir.x) {
                        verticalDirection.forEach((verticalDir) => {
                            let nextNext = {
                                x: verticalDir[0] + next.x,
                                y: verticalDir[1] + next.y,
                            };

                            horseMove(nextNext, pawn, 'checkMate', checkCheckMate);
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

function isKingCheckMate() {
    let kingGotCheckMate = false;

    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            if (gameBoard[y][x].checkMate && pawns[y][x].color === turn && pawns[y][x].type === 'king') {
                // console.log('a');
                kingGotCheckMate = true;
            }
        }
    }

    return kingGotCheckMate;
}

function needProtection(king, pawn, dir) {
    dir.x *= -1;
    dir.y *= -1;

    let next = {
        x: king.x / tileSize + dir.x,
        y: king.y / tileSize + dir.y,
    };

    let nextPawn;

    let checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

    if (checkWall) {
        nextPawn = pawns[next.y][next.x];

        if (pawn.type !== 'horse') {
            if (pawn.type !== 'soldier') {
                gameBoard[next.y][next.x].needProtection = king.color;

                while (true) {
                    let nextNext = {
                        x: next.x + dir.x,
                        y: next.y + dir.y,
                    };

                    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                        let nextNextPawn = pawns[nextNext.y][nextNext.x];

                        if(!nextNextPawn && !nextPawn){
                            gameBoard[nextNext.y][nextNext.x].needProtection = king.color;
                        }else if (nextNextPawn) {
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

                if (!pawn.moved && !pawns[next.y + dir.y][next.x] && !checkCheckMate) {
                    gameBoard[next.y + dir.y][next.x].needProtection = king.color;
                }

                horizontalDirection.forEach((horizontalDir) => {
                    let nextNext = {
                        x: horizontalDir[0] + next.x,
                        y: horizontalDir[1] + next.y,
                    };

                    let nextNextPawn = pawns[nextNext.y][nextNext.x];

                    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength && nextNextPawn && pawn.color !== nextNextPawn.color && pawn.type === 'king') {
                        // console.log('c');
                        gameBoard[nextNext.y][nextNext.x].needProtection = king.color;
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

                        horseMove(nextNext, pawn, 'protection', checkCheckMate);
                    })
                } else if (dir.x) {
                    verticalDirection.forEach((verticalDir) => {
                        let nextNext = {
                            x: verticalDir[0] + next.x,
                            y: verticalDir[1] + next.y,
                        };

                        horseMove(nextNext, pawn, 'protection', checkCheckMate);
                    })
                }
            }
        }
    }
}
