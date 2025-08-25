function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function degreeToRadian(degree) {
    return degree * Math.PI / 180;
}

function sort(array, key) {
    return array.sort((a, b) => a[key] > b[key] ? 1 : a[key] !== b[key] ? -1 : 0);
}

function getOpponent(index) {
    return players[!index * 1];
}
