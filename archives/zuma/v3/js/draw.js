function draw() {
    drawPaths();
    drawBalls();

    player.draw();

    drawShootBalls();

    // drawEnd();
}


// draw the current frame based on sliderValue
function drawPaths() {
    ctx.save();
    // redraw path
    ctx.lineWidth = 10;

    ctx.beginPath();
    paths.forEach(path => {
        switch (path.type) {
            case 'start':
                ctx.moveTo(path.x, path.y);
                break;
            case 'line':
                ctx.lineTo(path.x, path.y);
                break;
            case 'quadratic-curve':
                ctx.quadraticCurveTo(path.cpx, path.cpy, path.x, path.y);
                break;
            case 'bezier-curve':
                ctx.bezierCurveTo(path.cp1x, path.cp1y, path.cp2x, path.cp2y, path.x, path.y);
                break;
        }
    });
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
}

// draw tracking rect at xy
function drawBalls() {
    balls.forEach(ball => {
        // draw the tracking rectangle
        let point;

        paths.filter((path, index) => index).forEach((path, index) => {
            let divide = end.value / (paths.length - 1);
            let check = divide * Math.floor((ball.percent + divide) / divide);

            if (ball.percent === end.value) {
                check -= divide;
            }

            if (ball.percent < check + (index === paths.length - 2 ? 1 : 0) && index + 1 === check / divide) {
                let percent = (ball.percent - (index * divide)) / (divide - (index === paths.length - 2 ? 0 : 1));

                let beforePosition = {
                    x: paths[index].x,
                    y: paths[index].y
                };

                switch (path.type) {
                    case 'line':
                        point = getLineXYatPercent(beforePosition, path, percent);
                        break;
                    case 'quadratic-curve':
                        let cp = {
                            x: path.cpx,
                            y: path.cpy
                        };

                        point = getQuadraticCurveXYatPercent(beforePosition, cp, path, percent);
                        break;
                    case 'bezier-curve':
                        let cp1 = {
                            x: path.cp1x,
                            y: path.cp1y
                        };

                        let cp2 = {
                            x: path.cp2x,
                            y: path.cp2y
                        };

                        point = getBezierCurveXYatPercent(beforePosition, cp1, cp2, path, percent);
                        break;
                }
            }
        });

        ball.x = point.x;
        ball.y = point.y;

        ball.update();
        ball.draw();
    })
}

function drawShootBalls() {
    shootBalls.forEach(ball => {
        ball.shootUpdate();
        ball.draw();
    })
}

function drawEnd(){
    let lastPosition = paths[paths.length - 1];
    let r = 30;

    ctx.save();
    ctx.beginPath();

    ctx.lineWidth = 5;
    ctx.fillStyle = 'rgb(255,175,55)';
    ctx.strokeStyle = 'rgb(255,215,0)';
    ctx.arc(lastPosition.x, lastPosition.y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
}
