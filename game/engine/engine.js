const g = { "x": 0, "y": 2 }; // gravity
const bk = 0.95; // air resistance
const mk = 0.55 // friction

class Entity {
    static BUFFER = 1;

    constructor(x, y, animations, width, height) {
        this.pos = { "x": x, "y": y };
        this.net = { "x": 0, "y": 0 };
        this.acc = { "x": 0, "y": 0 };
        this.shape = { "width": width, "height": height };
        this.animations = animations;
        this.currentAnimation = this.animations["init"];
        this.canRemove = false;
        this.isOnGround = false;
    }

    intersect(e) {

        let l1 = this.pos;
        let r1 = { "x": this.pos.x + this.shape.width, "y": this.pos.y + this.shape.height };
        let l2 = e.pos;
        let r2 = { "x": e.pos.x + e.shape.width, "y": e.pos.y + e.shape.height };
        
        if (l1.x == r1.x || l1.y == r1.y || l2.x == r2.x || l2.y == r2.y) {
            return false;
        }

        if (l1.x >= r2.x || l2.x >= r1.x) {
            return false;
        }

        if (r1.y <= l2.y || r2.y <= l1.y) {
            return false;
        }

        return true;
    }

    addForce(f) {
        this.acc.x += f.x;
        this.acc.y += f.y;
    }  

    getSquaresBeneath(map, timestep, savePositions=false) {
        let squares = [], positions = [];
        let y = Math.floor((this.pos.y + this.shape.height + timestep * (this.net.y + this.acc.y)) / Map.SQUARE_SIZE);
        let start = (this.pos.x + Entity.BUFFER) / Map.SQUARE_SIZE;
        let stop = (this.pos.x + this.shape.width - Entity.BUFFER) / Map.SQUARE_SIZE;

        for (let x = Math.floor(start); x <= Math.floor(stop); x++) {
            squares.push(map.get(x, y));
            positions.push([x, y]);
        }

        if (savePositions)
            return [ squares, positions ];
        return squares;   
    }

    getSquaresAbove(map, timestep, savePositions=false) {        
        let squares = [], positions = [];
        let y = Math.floor((this.pos.y + timestep * (this.net.y + this.acc.y)) / Map.SQUARE_SIZE);
        let start = (this.pos.x + Entity.BUFFER) / Map.SQUARE_SIZE;
        let stop = (this.pos.x + this.shape.width - Entity.BUFFER) / Map.SQUARE_SIZE;
        
        for (let x = Math.floor(start); x <= Math.floor(stop); x++) {
            squares.push(map.get(x, y));
            positions.push([x, y]);
        }
       
        if (savePositions) {
            return [ squares, positions ];
        }
        return squares;   
    }

    getSquaresOnRight(map, timestep, savePositions=false) {
        let squares = [], positions = [];
        let x = Math.floor((this.pos.x + this.shape.width + timestep * (this.net.x + this.acc.x)) / Map.SQUARE_SIZE);
        let start = (this.pos.y + Entity.BUFFER) / Map.SQUARE_SIZE;
        let stop = (this.pos.y + this.shape.height - Entity.BUFFER) / Map.SQUARE_SIZE;
        
        for (let y = Math.floor(start); y <= Math.floor(stop); y++) {
            squares.push(map.get(x, y));
            positions.push([x, y]);
        }

        if (savePositions)
            return [ squares, positions ];
        return squares;   
    }

    getSquaresOnLeft(map, timestep, savePositions=false) {
        let squares = [], positions = [];
        let x = Math.floor((this.pos.x + timestep * (this.net.x + this.acc.x)) / Map.SQUARE_SIZE);
        let start = (this.pos.y + Entity.BUFFER) / Map.SQUARE_SIZE;
        let stop = (this.pos.y + this.shape.height - Entity.BUFFER) / Map.SQUARE_SIZE;
        
        for (let y = Math.floor(start); y <= Math.floor(stop); y++) {
            squares.push(map.get(x, y));
            positions.push([x, y]);
        }

        if (savePositions)
            return [ squares, positions ];
        return squares;   
    }

    getNormForce(map) {
        let squares, error;
        let normForce = { "x": 0, "y": 0 };

        squares = this.getSquaresBeneath(map, 1);
        this.isOnGround = squares.some((sq) => Map.cannotPassThrough(sq));
        if (this.isOnGround) {
            error = (this.pos.y + this.shape.height + this.net.y + this.acc.y) % Map.SQUARE_SIZE;
            normForce.y -= error;
            this.net.x *= mk;
        }

        squares = this.getSquaresAbove(map, 1);
        if (squares.some((sq) => Map.cannotPassThrough(sq))) {
            error = (this.pos.y + this.net.y + this.acc.y) % Map.SQUARE_SIZE;
            normForce.y += Map.SQUARE_SIZE - error;
        }

        squares = this.getSquaresOnRight(map, 1);
        if (squares.some((sq) => Map.cannotPassThrough(sq))) {
            error = (this.pos.x + this.shape.width + this.net.x + this.acc.x) % Map.SQUARE_SIZE;
            normForce.x -= error;
        }

        squares = this.getSquaresOnLeft(map, 1);
        if (squares.some((sq) => Map.cannotPassThrough(sq))) {
            error = (this.pos.x + this.net.x + this.acc.x) % Map.SQUARE_SIZE;
            normForce.x += Map.SQUARE_SIZE - error;
        }

        return normForce;
    }

    update(map, entities) {
        this.currentAnimation.next();
        if (this.currentAnimation.isComplete) {
            this.currentAnimation = this.animations["init"];
        }
    }

    startAnimation(name) {
        this.currentAnimation = this.animations[name];
        this.currentAnimation.reset();
    }

    render(os, hitboxes=false) {
        this.currentAnimation.renderFrame(this.pos.x + os.x, this.pos.y + os.y);
        if (hitboxes) {
            stroke(255, 0, 0);
            noFill();
            rect(this.pos.x + os.x, this.pos.y + os.y, this.shape.width, this.shape.height);
        }
    }
}

class Enemy extends Entity {

    constructor(x, y, animations, width, height, p) {
        super(x, y, animations, width, height);
        this.facingRight = true;
        this.p = p;
    }

    moveRight(step) {
        if (this.isOnGround) {
            if (this.currentAnimation != this.animations["runRight"]) {
                this.startAnimation("runRight");
                this.animations["init"] = this.animations["right"];
                this.facingRight = true;
            }
            this.addForce({"x": step, "y": 0});
        }
    }

    moveLeft(step) {
        if (this.isOnGround) {
            if (this.currentAnimation != this.animations["runLeft"]) {
                this.startAnimation("runLeft");
                this.animations["init"] = this.animations["left"];
                this.facingRight = false;
            }
            this.addForce({"x": -step, "y": 0});
        }
    }

    updateInstance() {
        this.net.x += this.acc.x;
        this.net.y += this.acc.y
        this.pos.x += this.net.x;
        this.pos.y += this.net.y;
        this.net.x *= bk;
        this.net.y *= bk;
        this.acc = { "x": 0, "y": 0 };
    }

    update(map, entities) {
        super.update(map, entities);

        let step = random(-1, 4);
        if (p.pos.x > this.pos.x) {
            this.moveRight(step);
        } else {
            this.moveLeft(step);
        }

        this.addForce(g);
        this.addForce(this.getNormForce(map));
        this.updateInstance();
    }
} 

class Fireball extends Entity {

    constructor(x, y, animations, width, height, step) {
        super(x, y, animations, width, height);
        this.step = step;
        this.framesToRemove = 20;
    }

    update(map, entities) {
        super.update(map, entities);

        for (let i = 0; i < entities.length; i++) {
            if (entities[i] instanceof Enemy) {
                console.log(this.intersect(entities[i]));
            }
            if (this.intersect(entities[i]) && entities[i] instanceof Enemy) {
                console.log(entities[i]);
                entities[i].canRemove = true;
                this.canRemove = true;
            }
        }

        this.pos.x += this.step;
        if (this.framesToRemove-- == 0) {
            this.canRemove = true;
        }
    }
}

class Avatar extends Entity {
    constructor(x, y, animations, width, height) {
        super(x, y, animations, width, height);
        this.facingRight = true;
        this.health = 1;
        this.hasFlag = false;
    }

    moveRight(step) {
        if (this.isOnGround) {
            if (this.currentAnimation != this.animations["runRight"]) {
                this.startAnimation("runRight");
                this.animations["init"] = this.animations["right"];
                this.facingRight = true;
            }
            this.addForce({"x": step, "y": 0});
        }
    }

    moveLeft(step) {
        if (this.isOnGround) {
            if (this.currentAnimation != this.animations["runLeft"]) {
                this.startAnimation("runLeft");
                this.animations["init"] = this.animations["left"];
                this.facingRight = false;
            }
            this.addForce({"x": -step, "y": 0});
        }
    }

    moveUp(step) {
        if (this.isOnGround) {
            this.net.y = 0;
            this.addForce({"x": 0, "y": -step});
        }
    }

    moveDown(step) {}

    updateInstance() {
        this.net.x += this.acc.x;
        this.net.y += this.acc.y
        this.pos.x += this.net.x;
        this.pos.y += this.net.y;
        this.net.x *= bk;
        this.net.y *= bk;
        this.acc = { "x": 0, "y": 0 };
    }

    update(map, entities) {
        super.update(map, entities);

        for (let i = 0; i < entities.length; i++) {
            if (entities[i] instanceof Enemy && this.intersect(entities[i])) {
                this.health -= 0.005;
            } 
        }

        let squares;
        squares = this.getSquaresBeneath(map, 0);
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] == 3) {
                p.hasFlag = true;
            }
        }

        squares = this.getSquaresAbove(map, 0);
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] == 3) {
                p.hasFlag = true;
            }
        }

        squares = this.getSquaresOnLeft(map, 0);
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] == 3) {
                p.hasFlag = true;
            }
        }

        squares = this.getSquaresOnRight(map, 0);
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] == 3) {
                p.hasFlag = true;
            }
        }

        this.addForce(g);
        this.addForce(this.getNormForce(map));
        this.updateInstance();
    }
}

class Engine {
    
    constructor(map, gameEntities=[], cameraWidth=200, cameraHeight=200) {
        this.map = map;
        this.gameEntities = gameEntities;
        this.cameraWidth = cameraWidth;
        this.cameraHeight = cameraHeight;
        this.camera = new Camera(this.map, cameraWidth, cameraHeight);
    }

    addEntity(e) {
        this.gameEntities.push(e);        
    }

    attachCameraTo(e) {
        this.camera.attachTo(e);
    }

    render() {
        let os = this.camera.render();
        this.updateAndRender(os);
    }

    removeEntities() {
        let temp = [];
        for (let i = 0; i < this.gameEntities.length; i++) {
            let e = this.gameEntities[i];
            if (!e.canRemove) {
                temp.push(e);
            }
        }
        this.gameEntities = temp;
    }

    updateAndRender(os) {
        this.removeEntities();
        for (let i = 0; i < this.gameEntities.length; i++) {
            let e = this.gameEntities[i];
            e.update(this.map, this.gameEntities);
            e.render(os);
        }
        fill(255);
        stroke(255);
        rect(this.cameraWidth, 0, canvas.width, canvas.height);
        rect(0, this.cameraHeight, canvas.width, canvas.height);
    }
}