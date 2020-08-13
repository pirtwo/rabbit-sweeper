import * as PIXI from 'pixi.js';
import Scene from './scene';
import Button from './ui/button';

export default class PopupScene extends Scene {
    constructor({
        width,
        height,
        backdropWidth,
        backdropHeight,
        textures
    }) {
        super();

        // body
        this.body = new PIXI.Container();

        // background
        this.background = new PIXI.Graphics();
        this.background.lineStyle(5, 0xe0e0e0);
        this.background.beginFill(0xf5f5f5);
        this.background.drawRoundedRect(0, 0, width, height, 10);
        this.background.endFill();
        this.background.position.set(0, 0);

        // backdrop
        this.backdrop = new PIXI.Graphics();
        this.backdrop.beginFill(0x000000, 0.001);
        this.backdrop.drawRect(0, 0, backdropWidth, backdropHeight);
        this.backdrop.endFill();
        this.backdrop.interactive = true; // capture tap or clicks

        this.title = new PIXI.Text("title", new PIXI.TextStyle({
            fontSize: 40,
            fontWeight: 'bold',
            fontFamily: ['Bungee', 'cursive'],
            fill: 0x7b1fa2
        }));
        this.records = new PIXI.Text("records", new PIXI.TextStyle({
            fontSize: 35,
            fontFamily: ['Bungee', 'cursive'],
            align: 'center'
        }));
        this.newRecord = new PIXI.Text("WOOW, New Record", new PIXI.TextStyle({
            fontSize: 40,
            fontWeight: 'bold',
            fontFamily: ['Bungee', 'cursive'],
            fill: 0x7b1fa2
        }));

        this.winSprite = new PIXI.Sprite(textures.win);
        this.loseSprite = new PIXI.Sprite(textures.lose);
        this.winSprite.width = this.winSprite.height = 350;
        this.loseSprite.width = this.loseSprite.height = 400;

        this.tryAgainBtn = new Button({
            width: 180,
            height: 80,
            text: new PIXI.Text("Try Again", new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 27,
                fontFamily: ['Bungee', 'cursive']
            })),
            frames: {
                button: textures.button
            }
        });
        this.tryAgainBtn.text.anchor.set(0.5);
        this.tryAgainBtn.text.position.set(90, 40);

        this.newGameBtn = new Button({
            width: 180,
            height: 80,
            text: new PIXI.Text("New Game", new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 27,
                fontFamily: ['Bungee', 'cursive']
            })),
            frames: {
                button: textures.button
            }
        });
        this.newGameBtn.text.anchor.set(0.5);
        this.newGameBtn.text.position.set(90, 40);

        this.closeBtn = new Button({
            width: 180,
            height: 80,
            text: new PIXI.Text("Close", new PIXI.TextStyle({
                fill: 0xffffff,
                fontSize: 27,
                fontFamily: ['Bungee', 'cursive']
            })),
            frames: {
                button: textures.button
            }
        });
        this.closeBtn.text.anchor.set(0.5);
        this.closeBtn.text.position.set(90, 40);


        this.body.addChild(
            this.background,
            this.title,
            this.newRecord,
            this.records,
            this.winSprite,
            this.loseSprite,
            this.tryAgainBtn,
            this.newGameBtn,
            this.closeBtn
        );
        this.addChild(this.backdrop, this.body);

        this.newRecord.position.set(this.body.width / 2 - this.newRecord.width / 2, 50);
        this.winSprite.position.set(this.body.width / 2 - this.winSprite.width / 2, 130);
        this.loseSprite.position.set(this.body.width / 2 - this.loseSprite.width / 2, 100);
        this.tryAgainBtn.position.set(this.body.width / 2 - this.tryAgainBtn.width / 2, 520);
        this.newGameBtn.position.set(this.body.width / 2 - this.newGameBtn.width / 2, 520);
        this.closeBtn.position.set(this.body.width / 2 - this.closeBtn.width / 2, 520);
        this.body.position.set(
            this.width / 2 - this.body.width / 2,
            this.height / 2 - this.body.height / 2
        );
    }

    playerRecords(records) {
        this.title.visible = true;
        this.title.text = "Best Records";
        this.title.position.set(this.body.width / 2 - this.title.width / 2, 50);
        
        this.records.visible = true;
        this.records.text = records;
        this.records.position.set(this.body.width / 2 - this.records.width / 2, 150);

        this.newRecord.visible = false;
        this.winSprite.visible = false;
        this.loseSprite.visible = false;
        this.newGameBtn.visible = false;
        this.tryAgainBtn.visible = false;
        this.closeBtn.visible = true;
        return this;
    }

    playerWin(hasNewRecord = false) {
        this.title.visible = !hasNewRecord;
        this.title.text = "Awsome, You Won";
        this.title.position.set(this.body.width / 2 - this.title.width / 2, 50);

        this.newRecord.visible = hasNewRecord;
        this.records.visible = false;
        this.winSprite.visible = true;
        this.loseSprite.visible = false;
        this.newGameBtn.visible = true;
        this.tryAgainBtn.visible = false;
        this.closeBtn.visible = false;        
        return this;
    }

    playerLose() {
        this.title.visible = true;
        this.title.text = "Ahhh, Rabbits";
        this.title.position.set(this.body.width / 2 - this.title.width / 2, 50);

        this.newRecord.visible = false;
        this.records.visible = false;
        this.winSprite.visible = false;
        this.loseSprite.visible = true;
        this.newGameBtn.visible = false;
        this.tryAgainBtn.visible = true;
        this.closeBtn.visible = false;        
        return this;
    }
}