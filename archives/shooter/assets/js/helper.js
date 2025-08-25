class Helper {
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static isCollide(obj1, obj2) {
        return obj1.x < obj2.x + obj2.w &&
            obj1.x + obj1.w > obj2.x &&
            obj1.y < obj2.y + obj2.h &&
            obj1.y + obj1.h > obj2.y;
    }

    static isOutOfBound(obj) {
        return obj.x + obj.w <= 0 || obj.x >= cvs.width;
    }
}
