import * as PIXI from 'pixi.js';
import Sound from 'pixi-sound';
import PixiUI from './pixiui';

export default class Slider extends PixiUI {
    /**
     * 
     * @param {Object} arg
     * @param {number} arg.value
     * @param {Object} arg.frames
     * @param {PIXI.Texture} arg.frames.rail
     * @param {PIXI.Texture} arg.frames.grip
     * @param {PIXI.Texture} arg.frames.railDisabled
     * @param {PIXI.Texture} arg.frames.gripDisabled
     * @param {Object} arg.sounds
     * @param {Sound} arg.sounds.pointerdown
     * @param {Sound} arg.sounds.pointerup
     * @param {Sound} arg.sounds.pointermove
     * @param {Function} arg.pointerUpCallback
     * @param {Function} arg.pointerDownCallback
     */
    constructor({
        value,
        width,
        min = 0,
        max = 1,
        frames,
        sounds,
        pointerUpCallback,
        pointerDownCallback
    }) {
        super({
            frames,
            sounds,
            pointerUpCallback,
            pointerDownCallback,
            pointerUpOutsideCallback: pointerUpCallback
        });

        this.grip = new PIXI.Sprite(this.frames.grip);
        this.rail = new PIXI.Sprite(this.frames.rail);
        this.rail.width = width;
        this.value = value;
        this.min = min;
        this.max = max;
        this._minX = 0;
        this._maxX = this.rail.width;

        this.interactive = true;
        this.grip.interactive = true;
        this.grip.buttonMode = true;
        this.grip.anchor.set(0.5);
        this.grip.position.set((this.value / this.max) * this._maxX, 0);
        this.addChild(this.rail, this.grip);

        this.grip.on('pointerdown', e => {
            if (this.disabled) return;
            this.grip.data = e.data;
            this.grip.dragging = true;
            this.grip.cursor = 'move';
            if (this.hasFrame('pointerdown'))
                this.grip.texture = this.frames.pointerdown;
            if (this.hasSound('pointerdown'))
                this.sounds.pointerdown.play();
        }).on('pointerup', () => {
            this.grip.dragging = false;
            this.grip.data = null;
            this.grip.cursor = 'pointer';
            if (this.hasFrame('pointerup'))
                this.grip.texture = this.frames.pointerup;
            if (this.hasSound('pointerup'))
                this.sounds.pointerup.play();
        }).on('pointerupoutside', () => {
            this.grip.dragging = false;
            this.grip.data = null;
            this.grip.cursor = 'pointer';
        }).on('pointermove', () => {
            if (!this.grip.dragging) return;
            if (this.hasSound('pointermove'))
                this.sounds.pointermove.play();
            const pos = this.grip.data
                .getLocalPosition(this.grip.parent);
            if (pos.x > this._minX && pos.x < this._maxX) {
                this.grip.x = pos.x;
                this.value = (
                    (pos.x / this._maxX) *
                    (this.max - this.min) +
                    this.min
                ).toFixed(1);
            }
        });
    }

    setValue(value) {
        this.value = value;
        this.grip.position.set((this.value / this.max) * this._maxX, 0);
        return this;
    }

    enable() {
        this.disabled = false;
        this.rail.texture = this.frames.rail;
        this.grip.texture = this.frames.grip;
        return this;
    }

    disable() {
        this.disabled = true;
        if (this.hasFrame('railDisabled'))
            this.rail.texture = this.frames.railDisabled;
        if (this.hasFrame('gripDisabled'))
            this.grip.texture = this.frames.gripDisabled;
        return this;
    }
}