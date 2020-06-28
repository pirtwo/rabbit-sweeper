import * as PIXI from 'pixi.js';

export default class PixiUI extends PIXI.Container {
    /**
     * 
     * @param {Object} arg    
     * @param {Object} arg.frames 
     * @param {Object} arg.sounds       
     * @param {Function} arg.pointerTapCallback
     * @param {Function} arg.pointerDownCallback
     * @param {Function} arg.pointerUpCallback
     * @param {Function} arg.pointerOverCallback
     * @param {Function} arg.pointerOutCallback
     * @param {Function} arg.pointerUpOutsideCallback
     */
    constructor({
        frames,
        sounds,
        pointerTapCallback,
        pointerDownCallback,
        pointerUpCallback,
        pointerOverCallback,
        pointerOutCallback,
        pointerUpOutsideCallback
    }) {
        super();
        this.frames = frames;
        this.sounds = sounds;

        // event handlers
        this.pointerTapCallback = pointerTapCallback;
        this.pointerDownCallback = pointerDownCallback;
        this.pointerUpCallback = pointerUpCallback;
        this.pointerOverCallback = pointerOverCallback;
        this.pointerOutCallback = pointerOutCallback;
        this.pointerUpOutsideCallback = pointerUpOutsideCallback;

        this.on('pointertap', e => {
            if (!this.disabled && this.pointerTapCallback)
                this.pointerTapCallback(e);
        }).on('pointerdown', e => {
            if (!this.disabled && this.pointerDownCallback)
                this.pointerDownCallback(e);
        }).on('pointerup', e => {
            if (!this.disabled && this.pointerUpCallback)
                this.pointerUpCallback(e);
        }).on('pointerover', e => {
            if (!this.disabled && this.pointerOverCallback)
                this.pointerOverCallback(e);
        }).on('pointerout', e => {
            if (!this.disabled && this.pointerOutCallback)
                this.pointerOutCallback(e);
        }).on('pointerupoutside', e =>{
            if (!this.disabled && this.pointerUpOutsideCallback)
                this.pointerUpOutsideCallback(e);
        });
    }

    playEffects(item, effect) {
        if (this.hasFrame(effect))
            item.texture = this.frames[`${effect}`];
        if (this.hasSound(effect))
            this.sounds[`${effect}`].play();
    }

    hasFrame(key) {
        return this.frames && this.frames[`${key}`] !== undefined;
    }

    hasSound(key) {
        return this.sounds && this.sounds[`${key}`] !== undefined;
    }

    setPosition(x, y) {
        this.position.set(x, y);
        return this;
    }

    enable() {
        this.disabled = false;
        return this;
    }

    disable() {
        this.disabled = true;
        return this;
    }

    show() {
        this.visible = true;
        return this;
    }

    hide() {
        this.visible = false;
        return this;
    }

    putLeft() {}
    putRight() {}
    putTop() {}
    putUnder() {}

    insetLeft() {}
    insetRight() {}
    insetLeft() {}
    insetDown() {}
    insetCenter() {}
}