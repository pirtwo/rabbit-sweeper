import * as PIXI from "pixi.js";
import * as utils from './lib/utils';
import Sound from "pixi-sound";
import Stats from "stats.js";
import Charm from './lib/charm';
import scale from './lib/scale';
import Sweeper from './sweeper';
import Hud from './hud';
import PopupScene from './popup';
import loadWebfonts from "./lib/webfont";


const app = new PIXI.Application({
    width: 1920,
    height: 1080,
    antialias: true,
    transparent: true
});
document.body.appendChild(app.view);

const GAME_STATES = {
    "READY": 0,
    "PLAY": 1,
    "SKIP": 2,
    "PAUSE": 3,
}

const GAME_DIFFICULTY = {
    easy: {
        rows: 9,
        cols: 9,
        rabbits: calcRabbitNum(9 * 9, 10)
    },
    medium: {
        rows: 13,
        cols: 19,
        rabbits: calcRabbitNum(13 * 19, 17)
    },
    hard: {
        rows: 17,
        cols: 31,
        rabbits: calcRabbitNum(17 * 31, 20)
    }
}

loadWebfonts(["Aldrich"], init);

function init() {
    app.loader
        .add('tileset', './assets/sprites/tileset.json')
        .add('sounds', './assets/sounds/sounds.mp3')
        .load(setup);
}

function setup(loader, resources) {
    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const charm = new Charm(PIXI);
    const tileset = resources.tileset.textures;
    const sound = resources.sounds.sound;
    sound.addSprites({
        'click': {
            start: 0,
            end: 0.5
        },
        'rabbit': {
            start: 0.5,
            end: 0.8
        },
        'flood': {
            start: 0.8,
            end: 1.5
        },
        'win': {
            start: 1.5,
            end: 4
        },
        'lose': {
            start: 4,
            end: 8
        },
        'music': {
            start: 8,
            end: 22
        },
    });

    let currAnims;
    let plantedFlags = 0;
    let muted = false;
    let gameState = GAME_STATES.PLAY;
    let gameDifficulty = GAME_DIFFICULTY.easy;


    let size = 50;
    let shape1 = new PIXI.Graphics();
    shape1.beginFill(0x56db37);
    shape1.drawRect(0, 0, size, size);
    shape1.endFill();

    let shape2 = new PIXI.Graphics();
    shape2.beginFill(0xf4f5bf);
    shape2.drawRect(0, 0, size, size);
    shape2.endFill();

    let shape3 = new PIXI.Graphics();
    shape3.beginFill(0xffffff);
    shape3.drawRect(0, 0, app.screen.width, 100);
    shape3.endFill();

    let shape4 = new PIXI.Graphics();
    shape4.beginFill(0x03a9f4);
    shape4.drawRoundedRect(0, 0, 200, 100, 10);
    shape4.endFill();

    const hud = new Hud({
        audioOn: tileset["audioOn.png"],
        audioOff: tileset["audioOff.png"],
        reset: tileset["return.png"],
        trophy: tileset["trophy.png"],
        flag: tileset["flag.png"],
        stopwatch: tileset["stopwatch.png"],
        background: app.renderer.generateTexture(shape3)
    });

    const sweeper = new Sweeper({
        cellSize: 80,
        textures: {
            flag: tileset['flag.png'],
            cross: tileset['cross.png'],
            rabbit: tileset['rabbit.png'],
            carrot: tileset['carrot.png'],
            ground: app.renderer.generateTexture(shape1),
            groundRevealed: app.renderer.generateTexture(shape2)
        }
    });

    const popup = new PopupScene({
        width: 500,
        height: 650,
        backdropWidth: 1920,
        backdropHeight: 1080,
        textures: {
            win: tileset['win.png'],
            lose: tileset['lose.png'],
            button: app.renderer.generateTexture(shape4)
        }
    });

    const shakeTween = charm.makeTween([
        [sweeper, "angle", -0.5, 0.5, 5, "smoothstep", true],
        [sweeper, "x", (app.screen.width / 2) - 5, (app.screen.width / 2) + 5, 5, "smoothstep", true]
    ]);

    const playFloodEffects = () => {
        shakeTween.play();
        setTimeout(() => {
            shakeTween.pause();
            sweeper.angle = 0;
            sweeper.position.x = app.screen.width / 2;
        }, 300);
    }

    const palyLoseEffects = () => {
        let anims = [];
        let count = 0;
        [...sweeper.grid].filter(i =>
            i.value.isRabbit() && !i.value.revealed && !i.value.flaged).forEach(cell => {
            let anim = utils.wait(count * 200);
            anim.promise.then(() => {
                sweeper.popRabbit(cell.row, cell.col);
                sound.play('rabbit');
            }).catch(() => {});
            anims.push(anim);
            count++;
        });

        return anims;
    }

    const gameReset = () => {
        plantedFlags = 0;
        Sound.stopAll();
        hud.resetTimer();
        hud.setFlagCounter(plantedFlags, gameDifficulty.rabbits);
        shakeTween.pause();

        if (gameDifficulty === GAME_DIFFICULTY.easy) {
            sweeper.cellSize = 100;
        } else if (gameDifficulty === GAME_DIFFICULTY.medium) {
            sweeper.cellSize = 70;
        } else if (gameDifficulty === GAME_DIFFICULTY.hard) {
            sweeper.cellSize = 55;
        }
        sweeper.create(gameDifficulty.rows, gameDifficulty.cols, gameDifficulty.rabbits);
        sweeper.angle = 0;
        sweeper.position.set(app.screen.width / 2, sweeper.height / 2 + 100);
        sweeper.pivot.set(sweeper.width / 2, sweeper.height / 2);
        gameState = GAME_STATES.READY;
    }

    const gameStart = () => {
        hud.startTimer();
        gameState = GAME_STATES.PLAY
    }

    const gameWin = () => {
        gameState = GAME_STATES.PAUSE;
        hud.stopTimer();
        sound.play('win');
        popup.playerWin().show();
    }

    const gameLose = () => {
        gameState = GAME_STATES.PAUSE;
        hud.stopTimer();
        sweeper.showInccoretFlags();
        currAnims = palyLoseEffects();
        Promise.all(currAnims.map(i => i.promise))
            .catch(() => {
                [...sweeper.grid].filter(i => i.value.isRabbit() && !i.value.revealed)
                    .forEach(cell => {
                        cell.value.reveal();
                    });
            })
            .finally(() => {
                sound.play('lose');
                popup.playerLose().show();
            });
    }

    hud.diffBtn.on("pointertap", () => {
        if (gameDifficulty === GAME_DIFFICULTY.easy) {
            gameDifficulty = GAME_DIFFICULTY.medium;
            hud.diffBtn.text = "Diffculty: Medium";
        } else if (gameDifficulty === GAME_DIFFICULTY.medium) {
            gameDifficulty = GAME_DIFFICULTY.hard;
            hud.diffBtn.text = "Diffculty: Hard";
        } else if (gameDifficulty === GAME_DIFFICULTY.hard) {
            gameDifficulty = GAME_DIFFICULTY.easy;
            hud.diffBtn.text = "Diffculty: Easy";
        }

        gameReset();
    });

    hud.audioBtn.pointerTapCallback = () => {
        if (muted) {
            muted = false;
            Sound.unmuteAll();
            hud.audioBtn.btn.texture = hud.textures.audioOn;
        } else {
            muted = true;
            Sound.muteAll();
            hud.audioBtn.btn.texture = hud.textures.audioOff;
        }
    }

    hud.resetBtn.pointerTapCallback = () => {
        gameReset();
    }

    hud.trophyBtn.pointerTapCallback = () => {
        popup.playerRecords().show();
    }

    sweeper.cellLeftClicked = (cell) => {
        if (gameState === GAME_STATES.READY) gameStart();
        if (gameState === GAME_STATES.PLAY) {
            if (cell.flaged || cell.revealed) return;

            cell.reveal();
            if (cell.isEmpty()) {
                let flood = sweeper.flood(cell.row, cell.col);
                if (flood > 5) {
                    sound.play('flood');
                    playFloodEffects();
                } else {
                    sound.play('click');
                }
                if (sweeper.checkWin()) gameWin();
            } else if (cell.isRabbit()) gameLose();
        } else {
            gameState = GAME_STATES.SKIP;
            currAnims.forEach(i => i.cancel());
        }
    }

    sweeper.cellRightClicked = (cell) => {
        if (gameState === GAME_STATES.READY) gameStart();
        if (gameState === GAME_STATES.PLAY) {
            if (!cell.revealed) {
                if (cell.flaged) {
                    plantedFlags--;
                    cell.toggleFlag();
                    hud.setFlagCounter(plantedFlags);
                } else {
                    if (plantedFlags < gameDifficulty.rabbits) {
                        plantedFlags++;
                        cell.toggleFlag();
                        hud.setFlagCounter(plantedFlags);
                    }
                }
            }
            if (sweeper.checkWin()) gameWin();
        }
    }

    popup.newGameBtn.pointerTapCallback = () => {
        gameReset();
        popup.hide();
    }

    popup.tryAgainBtn.pointerTapCallback = () => {
        gameReset();
        popup.hide();
    }

    popup.closeBtn.pointerTapCallback = () => {
        popup.hide();
    }

    gameReset();
    scale(app.view);
    app.stage.addChild(hud, sweeper, popup);

    // game loop
    app.ticker.add((delta) => {
        stats.begin();
        hud.update(delta);
        sweeper.update(delta);
        charm.update();
        stats.end();
    });
}

function calcRabbitNum(cells, ratio = 20) {
    return Math.floor(cells * ratio / 100);
}

window.addEventListener('resize', () => scale(app.view));
document.addEventListener('contextmenu', event => event.preventDefault());