class Camera {
    constructor(map, w, h) {
        this.map = map;
        this.dim = { "w": w, "h": h, "hw": w/2, "hh": h/2 };
        this.entity = null;
    }

    attachTo(e) {
        this.entity = e;
    }

    render() {
        if (this.entity == null) {
            return this._render(0, 0);
        }
        return this._render(this.entity.pos.x - this.dim.hw, this.entity.pos.y - this.dim.hh);
    }

    _render(x, y) {
        return this.map.render(x, y, this.dim.w, this.dim.h);
    }
}