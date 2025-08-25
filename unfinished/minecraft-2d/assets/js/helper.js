function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkOutOfBounds(x, y){
    return x < 0 || y < 0 || x >= xBlocks || y >= yBlocks;
}

function convertImageToType(image){
    return image.src.split('/').splice(-1)[0].split('.')[0];
}
