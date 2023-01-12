import { Mark } from './enums';
import { BoardLine, LineOrientation, BoardPosition } from './lib';

export enum GameStatus {
    IN_PROGRESS,
    MARK_ONE_VICTORY,
    MARK_TWO_VICTORY,
    DRAW,
}

enum MoveStatus {
    SUCCESS,
    FAILURE,
}

export interface GameState {
    status: GameStatus;
    victoryPosition: BoardLine | null;
    gameboard: Mark[][];
}

export class TicTacToeBoard {
    private static readonly ROWS = 3;
    private static readonly COLS = 3;
    private gameState: GameState;

    constructor() {
        this.gameState = {
            status: GameStatus.IN_PROGRESS,
            victoryPosition: null,
            gameboard: [
                [Mark.NONE, Mark.NONE, Mark.NONE],
                [Mark.NONE, Mark.NONE, Mark.NONE],
                [Mark.NONE, Mark.NONE, Mark.NONE],
            ],
        };
    }

    getGameState = () => {
        return this.gameState;
    };

    determineBoardState = () => {
        if (this.victoryConditionFound(Mark.ONE)) {
            this.gameState.status = GameStatus.MARK_ONE_VICTORY;
        } else if (this.victoryConditionFound(Mark.TWO)) {
            this.gameState.status = GameStatus.MARK_TWO_VICTORY;
        } else if (this.drawConditionFound()) {
            this.gameState.status = GameStatus.DRAW;
        }
    };

    victoryConditionFound = (mark: Mark) => {
        //  Check for horizontal victories
        for (let i = 0; i < TicTacToeBoard.ROWS; i++) {
            if (
                this.gameState.gameboard[i][0] === mark &&
                this.gameState.gameboard[i][1] === mark &&
                this.gameState.gameboard[i][2] === mark
            ) {
                this.gameState.victoryPosition = {
                    orientation: LineOrientation.HORIZONTAL,
                    startPosition: { x: i, y: 0 },
                };

                return true;
            }
        }

        //  Check for vertical victories
        for (let j = 0; j < TicTacToeBoard.COLS; j++) {
            if (
                this.gameState.gameboard[0][j] === mark &&
                this.gameState.gameboard[1][j] === mark &&
                this.gameState.gameboard[2][j] === mark
            ) {
                this.gameState.victoryPosition = {
                    orientation: LineOrientation.VERITCAL,
                    startPosition: { x: 0, y: j },
                };

                return true;
            }
        }

        //  Check for diagonal victories
        if (
            this.gameState.gameboard[0][0] === mark &&
            this.gameState.gameboard[1][1] === mark &&
            this.gameState.gameboard[2][2] === mark
        ) {
            this.gameState.victoryPosition = {
                orientation: LineOrientation.FOWARD_DIAGONAL,
                startPosition: { x: 0, y: 0 },
            };

            return true;
        }

        if (
            this.gameState.gameboard[2][0] === mark &&
            this.gameState.gameboard[1][1] === mark &&
            this.gameState.gameboard[0][2] === mark
        ) {
            this.gameState.victoryPosition = {
                orientation: LineOrientation.BACKWARD_DIAGONAL,
                startPosition: { x: 2, y: 0 },
            };

            return true;
        }

        return false;
    };

    drawConditionFound = () => {
        const board = this.getBoard();

        const cols = board[0].length;

        for (let i = 0; i < TicTacToeBoard.ROWS; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === 0) {
                    return false;
                }
            }
        }

        return true;
    };

    /*  Places a mark into the gameboard
        Returns true if successful, otherwise false */
    placeMark = (row: number, col: number, value: Mark): boolean => {
        if (
            row < 0 ||
            row >= TicTacToeBoard.ROWS ||
            col < 0 ||
            col >= TicTacToeBoard.COLS
        ) {
            throw new RangeError();
        }

        if (this.canPlaceMark(row, col)) {
            this.gameState.gameboard[row][col] = value;
            this.determineBoardState();
            return true;
        } else {
            return false;
        }
    };

    private canPlaceMark = (row: number, col: number) => {
        if (this.gameState.gameboard[row][col] === Mark.NONE) {
            return true;
        } else {
            return false;
        }
    };

    getBoard = (): number[][] => {
        return this.gameState.gameboard;
    };
}
