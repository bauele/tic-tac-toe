import { TicTacToeBoard } from './ticTacToeBoard';

import { Player } from './player';

export abstract class GameInstance {
    protected readonly gameId: string;
    protected game = new TicTacToeBoard();
    protected readonly players = new Array<Player>();
    protected readonly chatMessages = new Array<string>();
    protected victoryPosition = new Array<{ i: number; j: number }>();

    // Variable indicating which mark will take the first turn
    protected firstTurn: number;

    // Variable indicating which player must take their turn next
    protected playerTurn: number;

    constructor(gameId: string, player: Player) {
        this.gameId = gameId;

        this.players.push(player);

        /*  When a new game is created, the X mark will always go first.
            On subsequent game resets, the mark going first will alternate */
        this.firstTurn = 1;
        this.playerTurn = 1;
    }

    /*  This function must be overidden to indicate how sub game types
        handle a turn.
        RETURNS -   -1 if turn was not taken successfully
                     0 if turn was taken successfully
                     playerNumber if said player's turn caused them to win */
    abstract takeTurn(row: number, col: number, playerNumber: number): number;

    addPlayer = (player: Player) => {
        this.players.push(player);
    };

    getId = () => {
        return this.gameId;
    };

    placeMark = (row: number, col: number, playerNumber: number) => {
        return this.game.placeMark(row, col, playerNumber);
    };

    getBoard = () => {
        return this.game.getBoard();
    };

    getPlayerTurn = () => {
        return this.playerTurn;
    };

    getVictoryPosition = () => {
        return this.victoryPosition;
    };

    setVictoryPosition = (victoryPosition: { i: number; j: number }[]) => {
        this.victoryPosition = victoryPosition;
    };

    resetGame = () => {
        // The other player will go first upon game reset
        this.firstTurn = this.firstTurn === 1 ? 2 : 1;
        this.playerTurn = this.firstTurn;

        this.setVictoryPosition(new Array<{ i: number; j: number }>());
        this.game = new TicTacToeBoard();
    };

    victoryConditionFound = (playerNumber: number) => {
        const board = this.getBoard();
        const rows = board.length;
        const cols = board[0].length;

        // Check horizontal victories
        for (let i = 0; i < rows; i++) {
            if (
                board[i][0] == playerNumber &&
                board[i][1] == playerNumber &&
                board[i][2] == playerNumber
            ) {
                this.setVictoryPosition([
                    { i: i, j: 0 },
                    { i: i, j: 1 },
                    { i: i, j: 2 },
                ]);
                return true;
            }
        }

        // Check vertical victories
        for (let j = 0; j < cols; j++) {
            if (
                board[0][j] == playerNumber &&
                board[1][j] == playerNumber &&
                board[2][j] == playerNumber
            ) {
                this.setVictoryPosition([
                    { i: 0, j: j },
                    { i: 1, j: j },
                    { i: 2, j: j },
                ]);
                return true;
            }
        }

        // Check diagonal victories
        if (
            board[0][0] == playerNumber &&
            board[1][1] == playerNumber &&
            board[2][2] == playerNumber
        ) {
            this.setVictoryPosition([
                { i: 0, j: 0 },
                { i: 1, j: 1 },
                { i: 2, j: 2 },
            ]);
            return true;
        }

        if (
            board[2][0] == playerNumber &&
            board[1][1] == playerNumber &&
            board[0][2] == playerNumber
        ) {
            this.setVictoryPosition([
                { i: 2, j: 0 },
                { i: 1, j: 1 },
                { i: 0, j: 2 },
            ]);
            return true;
        }

        return false;
    };

    drawConditionFound = () => {
        const board = this.getBoard();
        const rows = board.length;
        const cols = board[0].length;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === 0) {
                    return false;
                }
            }
        }

        return true;
    };
}
