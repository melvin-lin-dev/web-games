function generateBall() {
    let newBall = createBall();
    svg.appendChild(newBall);
    balls.push(new Ball(newBall));
}

function generatePath() {
    let d = '';

    paths.forEach(path => {
        d += path.type;

        path.locations.forEach(location => {
            d += location + ' ';
        });
    });

    path.setAttribute('d', d);
}
