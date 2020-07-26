import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import Stats from "stats.js";
import Sweeper from './sweeper';
import Hud from './hud';

const app = new PIXI.Application({
    antialias: true,
    backgroundColor: 0x1099bb
});
document.body.appendChild(app.view);

const GAME_STATES = {
    "PAUSE": 0,
    "PLAY": 1
}

function init() {
    // load assets and fonts

    app.loader
        .add('tileset', './assets/sprites/tileset.json')
        .add('music', './assets/sounds/music.mp3')
        .add('winSound', './assets/sounds/win.mp3')
        .add('loseSound', './assets/sounds/lose.mp3')
        .add('floodSound', './assets/sounds/flood.mp3')
        .load(setup);
}

function setup(loader, resources) {
    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // board
    let size = 50,
        border = 0;

    const sounds = {
        "music": resources.music.sound,
        "win": resources.winSound.sound,
        "lose": resources.loseSound.sound,
        "flood": resources.floodSound.sound
    }

    let shape1 = new PIXI.Graphics();
    shape1.beginFill(0x56db37);
    shape1.lineStyle(border, 0x000000);
    shape1.drawRect(0, 0, size, size);
    shape1.endFill();

    let shape2 = new PIXI.Graphics();
    shape2.beginFill(0xf4f5bf);
    shape2.lineStyle(border, 0xf4f5bf);
    shape2.drawRect(0, 0, size, size);
    shape2.endFill();


    const tileset = resources.tileset.textures;
    const hud = new Hud();
    const sweeper = new Sweeper({
        textures: {
            flag: tileset['flag.png'],
            cross: tileset['cross.png'],
            rabbit: tileset['rabbit.png'],
            carrot: tileset['carrot.png'],
            ground: app.renderer.generateTexture(shape1),
            groundRevealed: app.renderer.generateTexture(shape2)
        }
    });

    sweeper.cellLeftClicked = (cell) => {
        if (sweeper.state === GAME_STATES.PAUSE || cell.flaged || cell.revealed) return;
        if (cell.isEmpty()) {
            sweeper.flood(cell.row, cell.col);
            if (sweeper.checkWin()) {
                sweeper.state = GAME_STATES.PAUSE;
                sounds.win.play();
            }
        } else if (cell.isRabbit()) {
            sweeper.state = GAME_STATES.PAUSE;
            cell.reveal();
            sweeper.popRabbits();
            sweeper.showInccoretFlags();
            sounds.lose.play();
        }
    }

    sweeper.cellRightClicked = (cell) => {
        if (sweeper.state === GAME_STATES.PAUSE) return;
        cell.toggleFlag();
        if (sweeper.checkWin()) {
            sweeper.state = GAME_STATES.PAUSE;
            sounds.win.play();
        }
    }

    sweeper.create(11, 11, 5);

    app.stage.addChild(sweeper);

    // settings
    // scoreboard

    // game loop
    app.ticker.add((delta) => {
        stats.begin();
        hud.update(delta);
        sweeper.update(delta);
        stats.end();
    });
}

document.addEventListener('contextmenu', event => event.preventDefault());

init();

export default app;