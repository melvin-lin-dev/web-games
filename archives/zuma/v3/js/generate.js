function generateBall() {
    balls.push(new Ball(randomBall()));
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
