export class TicTacToeBoard {
    private static readonly ROWS = 3;
    private static readonly COLS = 3;
    private gameboard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    constructor() {}

    /*  Places a mark into the gameboard
        Returns true if successful, otherwise false */
    placeMark = (row: number, col: number, value: number): boolean => {
        if (
            row < 0 ||
            row >= TicTacToeBoard.ROWS ||
            col < 0 ||
            col >= TicTacToeBoard.COLS
        ) {
            throw new RangeError();
        }

        if (this.canPlaceMark(row, col)) {
            this.gameboard[row][col] = value;
            return true;
        } else {
            return false;
        }
    };

    private canPlaceMark = (row: number, col: number) => {
        if (this.gameboard[row][col] === 0) {
            return true;
        } else {
            return false;
        }
    };

    getBoard = (): number[][] => {
        return this.gameboard;
    };
}
