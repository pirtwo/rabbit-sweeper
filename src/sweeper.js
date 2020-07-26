import Grid2D from "./grid2d";
import Particle from "../src/lib/particle";
import * as utils from "./lib/utils";
import {
  Sprite,
  Container,
  Text,
  TextStyle,
  ParticleContainer
} from "pixi.js";

export default class Sweeper extends Container {
  constructor({
    state = 1,
    textures,
    cellLeftClicked,
    cellRightClicked
  }) {
    super();
    this.state = state;
    this.cellSize = 50;
    this.grid = new Grid2D(10, 10);
    this.container = new Container();
    this.textures = textures;
    this.particle = new Particle();
    this.particleCnt = new ParticleContainer(1500, {
      alpha: true,
      scale: true,
      rotation: true,
      uvs: true
    });
    this.particleCnt.position.set(0, 0);
    this.cellLeftClicked = cellLeftClicked;
    this.cellRightClicked = cellRightClicked;
    this.addChild(this.container, this.particleCnt);

    this.sfRabbit = () => {
      let sp = new Sprite(utils.getRandomElement([this.textures.rabbit, this.textures.carrot]));
      sp.width = sp.height = 30;
      sp.anchor.set(0.5, 0.5);
      return sp;
    }

    this.sfCell = () => {
      let sp = new Sprite(this.textures.ground);
      sp.width = sp.height = 20;
      sp.anchor.set(0.5, 0.5);
      return sp;
    }
  }

  create(rows, cols, rabbits) {
    let cells = [],
      emptyCellNum = rows * cols - rabbits;

    cells = new Array(rows * cols)
      .fill().map((v, i) => new Cell(i < emptyCellNum ? 0 : 1, this.textures));
    this.grid = new Grid2D(rows, cols, utils.shuffle(cells));

    for (const item of this.grid) {
      const cell = item.value;
      const neighbours = this.grid.getNeighbours(item.row, item.col);

      cell.row = item.row;
      cell.col = item.col;
      cell.setNumber(neighbours.filter((n) => n.value.isRabbit()).length);

      // change color for chess board effect
      cell.ground.tint = this.grid.getIndex(item.row, item.col) % 2 === 0 ?
        0xf2f2f2 : 0xffffff;

      cell.interactive = true;
      cell.on("click", () => this.cellLeftClicked(cell));
      cell.on("rightclick", () => this.cellRightClicked(cell));
      cell.position.set(item.col * this.cellSize, item.row * this.cellSize);
      this.container.addChild(cell);
    }

    return this;
  }

  flood(row, col) {
    let
      list = [],
      cell = null,
      floodCount = 0;

    list.push(this.grid.getCell(row, col));    

    while (list.length > 0) {
      floodCount++;
      cell = list.pop();
      cell.reveal();
      this.createParticle({
        row: cell.row,
        col: cell.col,
        sprite: this.sfCell
      });

      if (cell.neighbourRabbits === 0) {
        list.push(...this.grid
          .getNeighbours(cell.row, cell.col)
          .map(i => i.value)
          .filter(i => i.isEmpty() && !i.revealed && !i.flaged)          
        );
      }
    }

    return floodCount;
  }

  checkWin() {
    let allRabitsFlaged = [...this.grid]
      .filter(i => i.value.isRabbit()).every(i => i.value.flaged === true);
    let allEmptyRevealed = [...this.grid]
      .filter(i => i.value.isEmpty()).every(i => i.value.revealed === true);

    return allRabitsFlaged && allEmptyRevealed;
  }

  popRabbits() {
    return new Promise(resolve => {
      let animations = [],
        count = 0;
      [...this.grid].filter(i => i.value.isRabbit() && !i.value.revealed && !i.value.flaged)
        .forEach(item => {
          animations.push(utils.wait(count * Math.random() * 100).then(() => {
            item.value.reveal();
            this.createParticle({
              number: 4,
              gravity: 0,
              row: item.row,
              col: item.col,
              sprite: this.sfRabbit
            });
          }));
          count++;
        });

      Promise.all(animations).then(resolve);
    });
  }

  showInccoretFlags() {
    [...this.grid].filter(i => i.value.flaged && i.value.isEmpty()).forEach(i => i.value.showCross());
  }

  createParticle({
    row,
    col,
    sprite,
    number = 2,
    gravity = 0.1
  }) {
    this.particle.create({
      x: col * this.cellSize + this.cellSize / 2,
      y: row * this.cellSize + this.cellSize / 2,
      number: number,
      minSpeed: 0.5,
      maxSpeed: 2,
      gravity: gravity,
      container: this.particleCnt,
      sprite: sprite
    });
  }

  update(delta) {
    this.particle.update(delta);
  }
}

class Cell extends Container {
  constructor(value, textures) {
    super();

    this.row = 0;
    this.col = 0;
    this.value = value; // zero = empty, one = rabbit
    this.flaged = false;
    this.revealed = false;
    this.neighbourRabbits = 0;
    this.textures = textures;

    // sprites
    this.flag = new Sprite(textures.flag);
    this.cross = new Sprite(textures.cross);
    this.rabbit = new Sprite(textures.rabbit);
    this.ground = new Sprite(textures.ground);
    this.number = new Text(`${this.neighbourRabbits}`);

    this.flag.width = this.ground.width / 2;
    this.flag.height = this.ground.width / 2;
    this.flag.anchor.set(0.5, 0.5);
    this.flag.position.set(this.ground.width / 2, this.ground.width / 2);

    this.cross.width = this.ground.width / 2;
    this.cross.height = this.ground.width / 2;
    this.cross.anchor.set(0.5, 0.5);
    this.cross.position.set(this.ground.width / 2, this.ground.width / 2);

    this.rabbit.width = this.ground.width / 2;
    this.rabbit.height = this.ground.width / 2;
    this.rabbit.anchor.set(0.5, 0.5);
    this.rabbit.position.set(this.ground.width / 2, this.ground.width / 2);

    this.number.anchor.set(0.5, 0.5);
    this.number.position.set(this.ground.width / 2, this.ground.width / 2);

    this.flag.visible = false;
    this.rabbit.visible = false;
    this.number.visible = false;
    this.cross.visible = false;
    this.addChild(this.ground, this.flag, this.cross, this.rabbit, this.number);
  }

  isEmpty() {
    return this.value === 0;
  }

  isRabbit() {
    return this.value === 1;
  }

  toggleFlag() {
    this.flaged = !this.flaged;
    this.flag.visible = this.flaged;
  }

  setNumber(value) {
    let textColor = 0xffffff;

    if (value === 1) textColor = 0x4287f5;
    if (value === 2) textColor = 0x26c726;
    if (value === 3) textColor = 0xdb1b18;
    if (value >= 4) textColor = 0x5f1270;

    this.number.text = `${value}`;
    this.number.style = new TextStyle({
      fill: textColor,
    });

    this.neighbourRabbits = value;
    return this;
  }

  reveal() {
    this.revealed = true;
    if (this.isEmpty() && this.neighbourRabbits === 0) {
      this.ground.texture = this.textures.groundRevealed;
    } else if (this.isEmpty() && this.neighbourRabbits > 0) {
      this.number.visible = true;
      this.ground.texture = this.textures.groundRevealed;
    } else if (this.isRabbit() && !this.flaged) {
      this.rabbit.visible = this.value === 1;
      this.ground.texture = this.textures.groundRevealed;
    }
  }

  showCross() {
    this.flag.visible = false;
    this.cross.visible = true;
  }
}