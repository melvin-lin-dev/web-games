function shoot() {
    let shootBall = ballCurrent.cloneNode(true);
    shootBall.className = '';
    let ballRect = ballCurrent.getBoundingClientRect();
    shootBall.style.left = ballRect.left + 'px';
    shootBall.style.top = ballRect.top + 'px';
    ballContainer.appendChild(shootBall);

    let rotate = parseFloat(playerContainer.style.transform.replace('rotate(','').replace('deg)','')) - 90;
    shootBalls.push({el: shootBall, rotate});

    ballCurrent.style.backgroundColor = ballFuture.style.backgroundColor;
    ballFuture.style.backgroundColor = randomBall();
}
