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

        this.flags = new Text("00:99", new TextStyle({
            fontSize: 25,
            fontWeight: "bold"
        }));

        this.countdown = new Text("00:00", new TextStyle({
            fontSize: 25,
            fontWeight: "bold"
        }));

        this.status.addChild(flagIcon, timerIcon, this.flags, this.countdown);
        flagIcon.position.set(0, 0);
        this.flags.position.set(40, 0);
        timerIcon.position.set(130, 0);
        this.countdown.position.set(170, 0);

        let btnSize = 70;

        this.diffBtn = new Text("Diffculty: Easy", new TextStyle({
            fontSize: 25,
            fontWeight: "bold"
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
        this.status.position.set(300, 40);
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

    update(delta) {}
}