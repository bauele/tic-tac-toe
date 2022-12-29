import { TicTacToeGame } from './ticTacToeGame';

export interface Player {
    name: string;
    mark: number;
}

export abstract class GameInstance {
    protected readonly gameId: string;
    protected readonly game = new TicTacToeGame();
    protected readonly players = new Array<Player>();
    protected readonly chatMessages = new Array<string>();

    // Variable indicating which mark will take the first turn
    protected readonly firstTurn: number;

    constructor(gameId: string, player: Player) {
        this.gameId = gameId;

        /*  When a new game is created, the X mark will always go first.
            On subsequent game resets, the mark going first will alternate */
        this.firstTurn = 1;
        this.players.push(player);
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
            )
                return true;
        }

        // Check vertical victories
        for (let j = 0; j < cols; j++) {
            if (
                board[0][j] == playerNumber &&
                board[1][j] == playerNumber &&
                board[2][j] == playerNumber
            )
                return true;
        }

        // Check diagonal victories
        if (
            board[0][0] == playerNumber &&
            board[1][1] == playerNumber &&
            board[2][2] == playerNumber
        )
            return true;

        if (
            board[2][0] == playerNumber &&
            board[1][1] == playerNumber &&
            board[0][2] == playerNumber
        )
            return true;

        return false;
    };
}
