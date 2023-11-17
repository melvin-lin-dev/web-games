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
                if (pawn && pawn.color === turn && canPawnMove(pawn)) {
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
                    // console.log('debug s', pawn.type);
                    if (nextPawn && pawn.color !== nextPawn.color) {
                        check(nextPawn);

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
                        // console.log(next)

                        if (!pawn.moved && !pawns[next.y + dir.y][next.x]) {
                            // console.log(next, dir.y)
                            setTile('dot', pawn, {...next, y: next.y + dir.y});
                        }
                    }

                    // console.log('debug z', pawn.type);

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
    // console.log(isKingCheck(), gameBoard[obj.y][obj.x].needProtection, gameBoard[obj.y][obj.x].friendProtection)
    if ((isKingCheck() && gameBoard[obj.y][obj.x].needProtection === turn && pawn.type !== 'king') || 
        !isKingCheck() || (pawn.type === 'king' && !gameBoard[obj.y][obj.x].friendProtection)
    ) {
        // console.log(isKingCheck());
        // console.log(isKingCheck(), gameBoard[obj.y][obj.x].friendProtection)
        gameBoard[obj.y][obj.x][type] = true;
    }
}

// function setEatable(obj) {
//     if ((isKingCheck() && gameBoard[obj.y][obj.x].needProtection === turn) || !isKingCheck()) {
//         // console.log(isKingCheck());
//         gameBoard[obj.y][obj.x].eatable = true;
//     }
// }

function horseMove(nextNext, pawn, checkType = '', checkCheck) {
    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
        let nextNextPawn = pawns[nextNext.y][nextNext.x];

        if (checkType !== 'can_move') {
            if (nextNextPawn && nextNextPawn.color !== pawn.color) {
                check(nextNextPawn);
    
                if (checkType === 'check' && pawn.type === 'king') {
                    gameBoard[nextNext.y][nextNext.x].addCheck(nextNext.y, nextNext.x, pawn);
                } else if (checkType === 'protection'){
                    gameBoard[nextNext.y][nextNext.x].needProtection = true;
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
                tile.needProtection = false;
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

                                if ((!nextNextPawn || (nextNextPawn.type === 'king' && pawn.color !== nextNextPawn.color)) && !checkCheck) {
                                    // gameBoard[nextNext.y][nextNext.x].dot = false;
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
                        // gameBoard[next.y][next.x].dot = false;
                        clearKingMove(next);

                        if (!pawn.moved && !pawns[next.y + dir.y][next.x] && !checkCheck) {
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
                                gameBoard[nextNext.y][nextNext.x]++;
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
    // console.log('debug', pawn.type, pawn.y / tileSize, pawn.x / tileSize)
    // gameBoard[pawn.y / tileSize][pawn.x / tileSize].needProtection = true;
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
                // console.log(next.y, next.x)
                gameBoard[next.y][next.x].needProtection = king.color;

                while (true) {
                    let nextNext = {
                        x: next.x + dir.x,
                        y: next.y + dir.y,
                    };

                    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                        let nextNextPawn = pawns[nextNext.y][nextNext.x];

                        // console.log('debug', nextNext.y, nextNext.x)

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

                        horseMove(nextNext, pawn, 'protection', checkCheck);
                    })
                } else if (dir.x) {
                    verticalDirection.forEach((verticalDir) => {
                        let nextNext = {
                            x: verticalDir[0] + next.x,
                            y: verticalDir[1] + next.y,
                        };

                        horseMove(nextNext, pawn, 'protection', checkCheck);
                    })
                }
            }
        }
    }
}

function canPawnMove(pawnException){
    if (pawnException.color !== turn) return true;

    for (let y = 0; y < tileLength; y++) {
        for (let x = 0; x < tileLength; x++) {
            const pawn = pawns[y][x];
            // if (pawn.color !== turn && pawn.type !== 'queen') continue; //debug
            if (pawn && pawn.color !== turn) {
                for(let j = 0; j < pawn.direction.length; j++){
                    const direction = pawn.direction[j];

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
                                if (nextPawn && nextPawn.color === turn && nextPawn.type === 'king') {
                                    return false;
                                    // check(nextPawn);
            
                                    // setTile('eatable', pawn, next);
            
                                    // if (pawn.type === 'king') {
                                    //     checkKingMoves();
                                    // }
                                    // gameBoard[next.y][next.x].eatable = true;
                                } else if (!nextPawn) {
                                    // setTile('dot', pawn, next);
            
                                    // if (nextPawn.type === 'king') {
                                    //     checkKingMoves();
                                    // }
            
                                    while (pawn.type !== 'king') {
                                        let nextNext = {
                                            x: next.x + dir.x,
                                            y: next.y + dir.y,
                                        };
            
                                        if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
                                            let nextNextPawn = pawns[nextNext.y][nextNext.x];

                                            console.log('abc')


                                            if (!nextNextPawn || nextNextPawn === pawnException) {
                                                // setTile('dot', pawn, nextNext);
            
                                                next.x = nextNext.x;
                                                next.y = nextNext.y;
                                            } else if (nextNextPawn.color === turn && nextNextPawn.type === 'king') {

                                                console.log('bbb', next.y, next.x)
                                                // check(nextNextPawn);
                                                
                                                // gameBoard[nextNext.y][nextNext.x].eatable = true;
                                                // setTile('eatable', pawn, nextNext);

                                                return false;
                                            } else {
                                                console.log('zzz', next.y, next.x)
                                                break;
                                            }
                                        } else {
                                            break;
                                        }
                                    }
                                }
                            } else {
                                // if (!nextPawn) {
                                //     setTile('dot', pawn, next);
                                //     // console.log(next)
            
                                //     if (!pawn.moved && !pawns[next.y + dir.y][next.x]) {
                                //         // console.log(next, dir.y)
                                //         setTile('dot', pawn, {...next, y: next.y + dir.y});
                                //     }
                                // }
            
                                horizontalDirection.forEach((horizontalDir) => {
                                    let nextNext = {
                                        x: horizontalDir[0] + next.x,
                                        y: horizontalDir[1] + next.y,
                                    };
            
                                    let nextNextPawn = pawns[nextNext.y][nextNext.x];
            
                                    if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength && nextNextPawn && nextNextPawn.color === turn && nextNextPawn.type === 'king') {
                                        // check(nextNextPawn);
            
                                        // setTile('eatable', pawn, nextNext);
                                        return false;
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
    console.log('tes')
    return true;
}

// function checkAvailableProtection(){
//     for (let y = 0; y < tileLength; y++) {
//         for (let x = 0; x < tileLength; x++) {
//             let pawn = pawns[y][x];
//             pawn.direction.forEach((direction) => {
//                 checkProtection(pawn);
//             });
//         }
//     }
// }

// function checkProtection(pawn, dir) {
//     dir.x *= -1;
//     dir.y *= -1;

//     let next = {
//         x: king.x / tileSize + dir.x,
//         y: king.y / tileSize + dir.y,
//     };

//     let nextPawn;

//     let checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

//     if (checkWall) {
//         nextPawn = pawns[next.y][next.x];

//         if (pawn.type !== 'horse') {
//             if (pawn.type !== 'soldier') {
//                 // console.log(next.y, next.x)
//                 gameBoard[next.y][next.x].needProtection = king.color;

//                 while (true) {
//                     let nextNext = {
//                         x: next.x + dir.x,
//                         y: next.y + dir.y,
//                     };

//                     if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength) {
//                         let nextNextPawn = pawns[nextNext.y][nextNext.x];

//                         // console.log('debug', nextNext.y, nextNext.x)

//                         gameBoard[nextNext.y][nextNext.x].needProtection = king.color;

//                         if (nextNextPawn) {
//                             break;
//                         }

//                         next.x = nextNext.x;
//                         next.y = nextNext.y;
//                     } else {
//                         break;
//                     }
//                 }
//             } else {
//                 gameBoard[next.y][next.x].needProtection = king.color;

//                 if (!pawn.moved && !pawns[next.y + dir.y][next.x] && !checkCheck) {
//                     gameBoard[next.y + dir.y][next.x].needProtection = king.color;
//                 }

//                 horizontalDirection.forEach((horizontalDir) => {
//                     let nextNext = {
//                         x: horizontalDir[0] + next.x,
//                         y: horizontalDir[1] + next.y,
//                     };

//                     let nextNextPawn = pawns[nextNext.y][nextNext.x];

//                     if (nextNext.x >= 0 && nextNext.x < tileLength && nextNext.y >= 0 && nextNext.y < tileLength && nextNextPawn && pawn.color !== nextNextPawn.color && pawn.type === 'king') {
//                         // console.log('c');
//                         gameBoard[nextNext.y][nextNext.x].needProtection = king.color;
//                     }
//                 })
//             }
//         } else if (pawn.type === 'horse') {
//             next.x += dir.x;
//             next.y += dir.y;

//             checkWall = next.x >= 0 && next.x < tileLength && next.y >= 0 && next.y < tileLength;

//             if (checkWall) {
//                 if (dir.y) {
//                     horizontalDirection.forEach((horizontalDir) => {
//                         let nextNext = {
//                             x: horizontalDir[0] + next.x,
//                             y: horizontalDir[1] + next.y,
//                         };

//                         horseMove(nextNext, pawn, 'protection', checkCheck);
//                     })
//                 } else if (dir.x) {
//                     verticalDirection.forEach((verticalDir) => {
//                         let nextNext = {
//                             x: verticalDir[0] + next.x,
//                             y: verticalDir[1] + next.y,
//                         };

//                         horseMove(nextNext, pawn, 'protection', checkCheck);
//                     })
//                 }
//             }
//         }
//     }
// }
