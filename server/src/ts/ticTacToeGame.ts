import { TicTacToeBoard } from './ticTacToeBoard';

export class TicTacToeGame {
    private gameboard = new TicTacToeBoard();
    private playerTurn = 0;

    /*  Places a mark into the gameboard
        Returns true if successful, otherwise false */
    placeMark = (row: number, col: number, playerNumber: number) => {
        return this.gameboard.placeMark(row, col, playerNumber);
    };

    getBoard = () => {
        return this.gameboard.getBoard();
    };

    setPlayerTurn = (playerNumber: number) => {
        this.playerTurn = playerNumber;
    };

    getPlayerTurn = () => {
        return this.playerTurn;
    };
}
