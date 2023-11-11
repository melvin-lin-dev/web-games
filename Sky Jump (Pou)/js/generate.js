let platformSize = {
    width: 100,
    height: 15
};

function generatePlatform() {
    let platformX = random(0, cvs.width - platformSize.width);
    let platformY = platforms[platforms.length - 1].y - space - platformSize.height;

    platforms.push(new Platform(platformX, platformY));
}

function generateStartingPlatforms() {
    let startingPlatformY = cvs.height - platformSize.height - 100;

    for (let i = 0; i < startingPlatform; i++) {
        let platformX = random(0, cvs.width - platformSize.width);
        let platformY = startingPlatformY - i * (space + platformSize.height);

        platforms.push(new Platform(platformX, platformY));
    }
}
