const g = { "x": 0, "y": 2 }; // gravity
const bk = 0.99; // air resistance
const mk = 0.55 // friction

class Entity {
    constructor(x, y, animations, width, height) {
        this.pos = { "x": x, "y": y };
        this.shape = { "width": width, "height": height };
        this.animations = animations;
        this.currentAnimation = this.animations["init"];
    }

    update(map) {
        this.currentAnimation.next();
        if (this.currentAnimation.isComplete) {
            this.currentAnimation = this.animations["init"];
        }
    }

    startAnimation(name) {
        this.currentAnimation = this.animations[name];
        this.currentAnimation.reset();
    }
     
    isRemovable() {
        return false;
    }

    render(os) {
        this.currentAnimation.renderFrame(this.pos.x + os.x, this.pos.y + os.y);
    }
}

class Avatar extends Entity {
    constructor(x, y, animations, width, height) {
        super(x, y, animations, width, height);
        this.isOnGround = false;
        this.net = { "x": 0, "y": 0 };
        this.acc = { "x": 0, "y": 0 }
    }

    addForce(f) {
        this.acc.x += f.x;
        this.acc.y += f.y;
    }  

    moveRight(step) {
        if (this.isOnGround) {
            if (this.currentAnimation != this.animations["runRight"]) {
                this.startAnimation("runRight");
            }
            this.addForce({"x": step, "y": 0});
        }
    }

    moveLeft(step) {
        if (this.isOnGround) {
            if (this.currentAnimation != this.animations["runLeft"]) {
                this.startAnimation("runLeft");
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

    moveDown(step) {

    }

    doNormForce(map) {
        this.isOnGround = map.getFromPixels(this.pos.x, this.pos.y + this.shape.height + this.net.y) != 0;
        if (this.isOnGround) {
            this.addForce({ "x": -g.x, "y": -g.y });
            this.pos.y -= (this.pos.y + this.shape.height + this.net.y) % Map.SQUARE_SIZE;
            this.net.x *= mk;
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

    update(map) {
        super.update(map);
        this.doNormForce(map);
        this.addForce(g);
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

    updateAndRender(os) {
        for (let i = 0; i < this.gameEntities.length; i++) {
            let e = this.gameEntities[i];
            e.update(this.map);
            e.render(os);
        }
        fill(255);
        stroke(255);
        rect(this.cameraWidth, 0, canvas.width, canvas.height);
        rect(0, this.cameraHeight, canvas.width, canvas.height);
    }
}