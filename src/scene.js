import {
    Container
} from 'pixi.js';

export default class Scene extends Container {
    constructor() {
        super();
    }

    show() {
        this.visible = true;
        return this;
    }

    hide() {
        this.visible = false;
        return this;
    }

    putCenter() {
        let pivot = this.pivot.clone();

        this.pivot.set(0, 0);
        this.position.set(
            this.parent.width / 2 - this.width / 2,
            this.parent.height / 2 - this.height / 2
        );
        this.pivot = pivot;

        return this;
    }
}