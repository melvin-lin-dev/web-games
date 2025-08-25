window.onload = () => {
    // generateBall();
    // setInterval(() => {
        // generateBall();
    // }, 500);

    start();
};

window.onmousemove = (e) => {
    let playerRect = playerContainer.getBoundingClientRect();
    let playerX = playerRect.left + playerRect.width / 2;
    let playerY = playerRect.top + playerRect.height / 2;

    let front = playerX - e.clientX;
    let side = playerY - e.clientY;
    let degree = Math.atan(Math.abs(front / side)) * 180 / Math.PI;

    if(side < 0 && front < 0){
        degree = 90 + 90 - degree;
    }else if(side < 0 && front >= 0){
        degree += 180;
    }else if(side >= 0 && front >= 0) {
        degree = 270 + 90 - degree;
    }

    playerContainer.style.transform = `rotate(${degree}deg)`;
};

window.onkeydown = (e) => {
    let key = e.keyCode;

    if(key === 32){
        // shoot();
    }
};

window.onclick = () => {
    shoot();
};
