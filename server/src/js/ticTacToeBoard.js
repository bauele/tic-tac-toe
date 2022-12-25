"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToeBoard = void 0;
class TicTacToeBoard {
    constructor() {
        this.gameboard = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        /*  Places a mark into the gameboard
            Returns true if successful, otherwise false */
        this.placeMark = (row, col, value) => {
            if (row < 0 ||
                row >= TicTacToeBoard.ROWS ||
                col < 0 ||
                col >= TicTacToeBoard.COLS) {
                throw new RangeError();
            }
            if (this.canPlaceMark(row, col)) {
                this.gameboard[row][col] = value;
                return true;
            }
            else {
                return false;
            }
        };
        this.canPlaceMark = (row, col) => {
            if (this.gameboard[row][col] === 0) {
                return true;
            }
            else {
                return false;
            }
        };
        this.getBoard = () => {
            return this.gameboard;
        };
    }
}
exports.TicTacToeBoard = TicTacToeBoard;
TicTacToeBoard.ROWS = 3;
TicTacToeBoard.COLS = 3;
