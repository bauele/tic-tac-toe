import { TicTacToeGame } from './ticTacToeGame';

export abstract class GameInstance {
    protected readonly gameId: string;
    protected readonly game = new TicTacToeGame();
    protected readonly players = new Array<string>();
    protected readonly chatMessages = new Array<string>();

    constructor(gameId: string) {
        this.gameId = gameId;
    }

    abstract takeTurn(row: number, col: number, playerNumber: number): boolean;

    placeMark = (row: number, col: number, playerNumber: number) => {
        return this.game.placeMark(row, col, playerNumber);
    };

    getBoard = () => {
        return this.game.getBoard();
    };
}
