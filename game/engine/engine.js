class Entity {
    constructor(x, y, animations) {
        this.pos = { "x": x, "y": y };
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
    constructor(x, y, animations) {
        super(x, y, animations);
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