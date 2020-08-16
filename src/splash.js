import * as PIXI from 'pixi.js';
import Scene from './scene';

export default class SplashScreen extends Scene {
    constructor({
        app,
        width,
        height
    }) {
        super();

        let ctx = new PIXI.Graphics();
        this.ticker = new PIXI.Ticker();
        this.ticker.autoStart = false;
        this.ticker.add(() => {
            app.render();
        });

        this.title = new PIXI.Text('Rabbit\nSweeper', new PIXI.TextStyle({
            fontFamily: 'Bungee',
            fontSize: 90,
            fontStyle: 'normal',
            fontWeight: 'bold',
            align: 'center',
            fill: ['#ffffff', '#f9e104'],
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        }));
        this.title.anchor.set(0.5);
        this.title.position.set(width / 2, height / 2 - 100);

        this.progress = new PIXI.Text('Loading 0%', new PIXI.TextStyle({
            fontFamily: 'Bungee',
            fontSize: 25,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: 0x424242
        }));
        this.progress.anchor.set(0.5);
        this.progress.position.set(width / 2, height / 2 + 100);

        this.playBtn = new PIXI.Container();
        let btnText = new PIXI.Text('PLAY', new PIXI.TextStyle({
            fontFamily: 'Bungee',
            fontSize: 35,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: 0xffffff
        }));
        ctx.beginFill(0x2196f3);
        let btn = ctx.drawRoundedRect(0, 0, 200, 100, 10);
        ctx.endFill();
        this.playBtn.addChild(btn, btnText);
        btnText.position.set(
            this.playBtn.width / 2 - btnText.width / 2,
            this.playBtn.height / 2 - btnText.height / 2
        );
        this.playBtn.position.set(
            width / 2 - this.playBtn.width / 2,
            height / 2 - this.playBtn.height / 2 + 100
        )
        this.playBtn.visible = false;
        this.playBtn.buttonMode = true;
        this.playBtn.interactive = true;

        this.addChild(this.title, this.progress, this.playBtn);
        this.ticker.start();
    }
}