class Map {

    static SQUARE_SIZE = 40;
    static SQUARES;

    constructor(squareMap, w, h) {
        this.squareMap = squareMap;
        this.dim = { "w": w, "h": h, "pw": w * Map.SQUARE_SIZE, "ph": h * Map.SQUARE_SIZE };
    }

    static cannotPassThrough(sq) {
        return sq == 1 || sq == 2;
    }

    get(x, y) {
        return this.squareMap[x + y * this.dim.w];
    }

    getFromPixels(x, y) {
        x = Math.floor(x / Map.SQUARE_SIZE);
        y = Math.floor(y / Map.SQUARE_SIZE);
        return this.get(x, y);
    }

    replace(x, y, sq) {
        this.squareMap[x + y * this.dim.w] = sq;
    }

    render(x, y, w, h) {

        x /= Map.SQUARE_SIZE;
        y /= Map.SQUARE_SIZE;
        w /= Map.SQUARE_SIZE;
        h /= Map.SQUARE_SIZE;

        let os = { "x": -x, "y": -y };
        if (x + w > this.dim.w) {
            os.x = w - this.dim.w;
            x = -os.x;
        }
        if (y + h > this.dim.h) {
            os.y = h - this.dim.h;
            y = -os.y;
        }
        if (x < 0) {
            os.x = 0;
            x = 0;
        }
        if (y < 0) {
            os.y = 0;
            y = 0;
        }
        
        for (let i = Math.floor(x); i < x + w; i++) {
            for (let j = Math.floor(y); j < y + h; j++) {
                let squareX = Map.SQUARE_SIZE * (i - x);
                let squareY = Map.SQUARE_SIZE * (j - y);
                image(Map.SQUARES[this.get(i, j)], squareX, squareY, Map.SQUARE_SIZE, Map.SQUARE_SIZE);
            }
        }

        os.x *= Map.SQUARE_SIZE;
        os.y *= Map.SQUARE_SIZE;
        return os;
    }
}