import Grid2D from './grid2d';
import {
    Container
} from 'pixi.js';

export default class Board extends Container {
    constructor() {
        this.board = [];
    }

    create(rows, cols, rabbits) {
        // create game board here
    }

    flag(row, col) {
        // put a flag on the cell
    }

    reveal(row, col) {
        // if cell[row, col] == flag
        //      return;
        // if cell[row, col] == rabbit
        //      loseCallback();
        //      return;
        // if cell[row, col] == empty
        //      if all adjuctents == empty
        //          show empty cell;
        //      else
        //          show adjuctent rabbits number;
        // flood(row, col)
    }

    // recursive function
    flood(row, col) {
        // get adjuctents of cell[row, col];
        // if all adjuctents != rabbit
        //      foreach c => adjuctent cells of cell[row,col]
        //          reveal(c.row, c.col)
        //          flood(c.row, c.col)
    }

    checkWin() {}

    showWinScene() {}

    showLoseScene() {}

    update() {
        // update game board
    }
}

class Cell {
    constructor() {
        /** 
         * zero = empty and one = rabbit
         */
        this.value = undefined;
        this.isFlaged = false;
    }

    addFlag() {
        this.isFlaged = true;
        return this;
    }

    removeFlag() {
        this.isFlaged = false;
        return this;
    }

    isEmpty() {
        return this.value === 0;
    }

    isRabbit() {
        return this.value === 1;
    }
}