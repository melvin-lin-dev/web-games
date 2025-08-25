function cvsMouseDown(e) {
    let dx = e.offsetX - players[playerIndex].hexagon.x;
    let dy = e.offsetY - players[playerIndex].hexagon.y;

    if (Math.hypot(dx, dy) < players[playerIndex].hexagon.r) {
        players[playerIndex].hexagon.mouseDown = true;
    }
}

function cvsMouseMove(e) {
    if (!players[playerIndex]) return false;
    if (players[playerIndex].hexagon.mouseDown) {
        let x = e.offsetX;
        let y = e.offsetY;

        // for(let key in hexagons){
        //     if(ctx.isPointInPath(hexagons[key].hexPath, x, y)){
        //         hexagons[key].collide = true;
        //     }else{
        //         hexagons[key].collide = false;
        //     }
        // }

        let hexagon = players[playerIndex].hexagon.list[0];
        let translate = players[playerIndex].hexagon.translate;
        translate.x = e.offsetX - hexagon.x + players[playerIndex].hexagon.direction.x / 2;
        translate.y = e.offsetY - hexagon.y + players[playerIndex].hexagon.direction.y / 2;
    }
}

function cvsMouseUp(e) {
    if (players[playerIndex].hexagon.mouseDown) {
        let newHexagons = players[playerIndex].hexagon.list;
        let checkHexagons = new Array(newHexagons.length).fill(null);

        let translate = players[playerIndex].hexagon.translate;

        for (let key in hexagons) {
            newHexagons.forEach((newHexagon, index) => {
                if (ctx.isPointInPath(hexagons[key].hexPath, newHexagon.x + translate.x, newHexagon.y + translate.y) && !hexagons[key].value) {
                    checkHexagons[index] = hexagons[key];
                }
            })
        }

        if (!(checkHexagons.indexOf(null) + 1)) { // Not Found / === -1
            checkHexagons.forEach((hexagon, index) => {
                hexagon.value = newHexagons[index].value;
                hexagon.generateDots();
            });

            sort(checkHexagons, 'value').forEach(hexagon => {
                checkSameHexagon(hexagon);
            });

            players[playerIndex].hexagon.list = [];
            players[playerIndex].generateHexagon();
        }

        players[playerIndex].hexagon.translate = {
            x: 0,
            y: 0
        }
    }

    players[playerIndex].hexagon.mouseDown = false;
}
