import Button from './ui/button';
import {
    Sprite,
    Container,
    Text,
    TextStyle,
    ParticleContainer
} from "pixi.js";

export default class Hud extends Container {
    constructor(textures) {
        super();

        this.time = 0;
        this.flags = 0;
        this.totalFlags = 0;
        this.timer = null;

        this.textures = textures;
        this.wrapper = new Container();
        this.background = new Sprite(textures.background);
        this.background.alpha = 0;

        this.status = new Container();

        let flagIcon = new Sprite(textures.flag);
        flagIcon.width = flagIcon.height = 30;
        flagIcon.tint = 0xf44336;
        let timerIcon = new Sprite(textures.stopwatch);
        timerIcon.width = timerIcon.height = 30;
        timerIcon.tint = 0x000000;

        this.flagCounter = new Text("00:99", new TextStyle({
            fontSize: 25,
            fontFamily: ['Bungee', 'cursive']
        }));

        this.timeCounter = new Text("00:00", new TextStyle({
            fontSize: 25,
            fontFamily: ['Bungee', 'cursive']
        }));

        this.status.addChild(flagIcon, timerIcon, this.flagCounter, this.timeCounter);
        flagIcon.position.set(0, 0);
        this.flagCounter.position.set(35, 0);
        timerIcon.position.set(140, 0);
        this.timeCounter.position.set(175, 0);

        let btnSize = 70;

        this.diffBtn = new Text("Mode: Easy", new TextStyle({
            fontSize: 25,
            fontFamily: ['Bungee', 'cursive']
        }));
        this.diffBtn.buttonMode = true;
        this.diffBtn.interactive = true;

        this.audioBtn = new Button({
            width: btnSize,
            height: btnSize,
            frames: {
                button: textures.audioOn
            }
        });
        this.audioBtn.btn.tint = 0x424242;

        this.resetBtn = new Button({
            width: btnSize,
            height: btnSize,
            frames: {
                button: textures.reset
            }
        });
        this.resetBtn.btn.tint = 0x424242;

        this.trophyBtn = new Button({
            width: btnSize,
            height: btnSize,
            frames: {
                button: textures.trophy
            }
        });
        this.trophyBtn.btn.tint = 0x424242;

        this.diffBtn.position.set(0, 40);
        this.status.position.set(270, 40);
        this.trophyBtn.position.set(600, 15);
        this.audioBtn.position.set(670, 15);
        this.resetBtn.position.set(740, 15);

        this.wrapper.addChild(
            this.diffBtn,
            this.status,
            this.audioBtn,
            this.resetBtn,
            this.trophyBtn
        );
        this.addChild(this.background, this.wrapper);
        this.wrapper.position.set(this.width / 2 - this.wrapper.width / 2, 0);

    }

    startTimer() {        
        this.timer = setInterval(() => {
            this.time++;
            let mins = Math.floor(this.time / 60);
            let secs = this.time % 60;
            this.timeCounter.text = `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
        }, 1000);
        return this;
    }

    stopTimer() {
        clearInterval(this.timer);
        return this;
    }

    resetTimer() {
        this.time = 0;
        this.timeCounter.text = "00:00";
        clearInterval(this.timer);   
        return this;     
    }

    setFlagCounter(curr, total = null) {
        this.flags = curr;
        if (total) this.totalFlags = total;
        this.flagCounter.text =
            `${this.flags < 10 ? `0${this.flags}` : this.flags}:${this.totalFlags < 10 ? `0${this.totalFlags}`:this.totalFlags}`;
    }

    update(delta) {}
}