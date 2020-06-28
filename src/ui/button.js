import * as PIXI from 'pixi.js';
import Sound from 'pixi-sound';
import PixiUI from './pixiui';

export default class Button extends PixiUI {
    /**
     * 
     * @param {Object} arg
     * @param {PIXI.Text} arg.text
     * @param {Object} arg.frames
     * @param {PIXI.Texture} arg.frames.button
     * @param {PIXI.Texture} arg.frames.buttonDisabled
     * @param {PIXI.Texture} arg.frames.pointerdown
     * @param {PIXI.Texture} arg.frames.pointerup
     * @param {PIXI.Texture} arg.frames.pointerover
     * @param {PIXI.Texture} arg.frames.pointerout
     * @param {Object} arg.sounds
     * @param {Sound} arg.sounds.pointertap
     * @param {Sound} arg.sounds.pointerdown
     * @param {Sound} arg.sounds.pointerup
     * @param {Sound} arg.sounds.pointerout
     * @param {Function} arg.pointerTapCallback
     */
    constructor({
        text,
        width,
        height,
        frames,
        sounds,
        pointerTapCallback
    }) {
        super({
            frames,
            sounds,
            pointerTapCallback
        });

        this.btn = new PIXI.Sprite(this.frames.button);
        this.btn.width = width;
        this.btn.height = height;
        this.text = text;
        this.buttonMode = true;
        this.interactive = true;
        this.addChild(this.btn);
        if (this.text) this.addChild(this.text);

        this.on('pointerup', () => {
            if (this.disabled) return;
            if (this.hasFrame('pointerup'))
                this.btn.texture = this.frames.pointerup;
            if (this.hasSound('pointerup'))
                this.sounds.pointerup.play();
        }).on('pointerdown', () => {
            if (this.disabled) return;
            if (this.hasFrame('pointerdown'))
                this.btn.texture = this.frames.pointerdown;
            if (this.hasSound('pointerdown'))
                this.sounds.pointerdown.play();
        }).on('pointerover', () => {
            if (this.disabled) return;
            if (this.hasFrame('pointerover'))
                this.btn.texture = this.frames.pointerover;
            if (this.hasSound('pointerover'))
                this.sounds.pointerover.play();
        }).on('pointerout', () => {
            if (this.disabled) return;
            if (this.hasFrame('pointerout'))
                this.btn.texture = this.frames.pointerout;
            if (this.hasSound('pointerout'))
                this.sounds.pointerout.play();
        });
    }

    enable() {
        this.disabled = false;
        this.btn.texture = this.frames.button;
        return this;
    }

    disable() {
        this.disabled = true;
        if (this.hasFrame('buttonDisabled'))
            this.btn.texture = this.frames.buttonDisabled;
        return this;
    }
}