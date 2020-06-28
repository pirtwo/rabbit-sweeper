import * as PIXI from 'pixi.js';
import Sound from 'pixi-sound';
import PixiUI from './pixiui';

export default class Raido extends PixiUI {
    /**
     * 
     * @param {Object} arg
     * @param {boolean} arg.value
     * @param {Object} arg.frames
     * @param {PIXI.Texture} arg.frames.box
     * @param {PIXI.Texture} arg.frames.checkmark
     * @param {PIXI.Texture} arg.frames.boxDisabled
     * @param {PIXI.Texture} arg.frames.checkmarkDisabled
     * @param {Object} arg.sounds
     * @param {Sound} arg.sounds.pointertap
     * @param {Sound} arg.sounds.pointerdown
     * @param {Sound} arg.sounds.pointerup
     * @param {Sound} arg.sounds.pointerout
     * @param {Function} arg.pointerTapCallback
     */
    constructor({
        width,
        height,
        value = false,
        frames,
        sounds,
        pointerTapCallback
    }) {
        super({
            frames,
            sounds,
            pointerTapCallback
        });

        this.box = new PIXI.Sprite(this.frames.box);
        this.checkmark = new PIXI.Sprite(this.frames.checkmark);
        this.value = value;
        this.buttonMode = true;
        this.interactive = true;
        this.checkmark.anchor.set(0.5);
        this.checkmark.visible = this.value;
        this.addChild(this.box, this.checkmark);
        this.checkmark.position.set(this.box.width / 2, this.box.height / 2);
        this.width = width;
        this.height = height;

        this.on('pointertap', () => {
            if (this.disabled) return;
            if (this.hasSound('pointertap'))
                this.sounds.pointertap.play();
        }).on('pointerup', () => {
            if (this.disabled) return;
            if (this.hasFrame('pointerup'))
                this.box.texture = this.frames.pointerup;
            if (this.hasSound('pointerup'))
                this.sounds.pointerup.play();
        }).on('pointerdown', () => {
            if (this.disabled) return;
            if (this.hasFrame('pointerdown'))
                this.box.texture = this.frames.pointerdown;
            if (this.hasSound('pointerdown'))
                this.sounds.pointerdown.play();
        }).on('pointerover', () => {
            if (this.disabled) return;
            if (this.hasFrame('pointerover'))
                this.box.texture = this.frames.pointerover;
            if (this.hasSound('pointerover'))
                this.sounds.pointerover.play();
        }).on('pointerout', () => {
            if (this.disabled) return;
            if (this.hasFrame('pointerout'))
                this.box.texture = this.frames.pointerout;
            if (this.hasSound('pointerout'))
                this.sounds.pointerout.play();
        });
    }

    setValue(value) {
        this.value = value;
        this.checkmark.visible = this.value;
        return this;
    }

    enable() {
        this.disabled = false;
        this.box.texture = this.frames.box;
        this.checkmark.texture = this.frames.checkmark;
        return this;
    }

    disable() {
        this.disabled = true;
        if (this.hasFrame('boxDisabled'))
            this.box.texture = this.frames.boxDisabled;
        if (this.hasFrame('checkmarkDisabled'))
            this.checkmark.texture = this.frames.checkmarkDisabled;
        return this;
    }
}