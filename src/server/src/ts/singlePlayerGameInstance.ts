import { GameInstance } from './gameInstance';
import { Player } from './player';
import { TicTacToeBoard } from './ticTacToeBoard';

import { Mark, GameStatus } from './enums';

export class SinglePlayerGameInstance extends GameInstance {
    constructor(gameId: string, player: Player) {
        super(gameId, player);
        this.players.push({
            name: 'CPU',
            mark: player.mark === Mark.ONE ? Mark.TWO : Mark.ONE,
            gameId: this.gameId,
        });

        /*  If the human player is not going first, the computer
            should immediately take their turn after game creation */
        if (player.mark !== Mark.ONE) {
            this.placeComputerMark();
            this.playerTurn = Mark.TWO;
        }
    }

    // Wanted to call super.resetGame(), but wasn't able so I copy and pasted
    resetGame = () => {
        this.firstTurn = this.firstTurn === 1 ? 2 : 1;
        this.playerTurn = this.firstTurn;

        this.game = new TicTacToeBoard();
        this.setVictoryPosition(new Array<{ i: number; j: number }>());

        /*  If the human player is not going first, the computer
            should immediately take their turn after game creation */
        if (this.players[0].mark !== this.firstTurn) {
            this.placeComputerMark();
            this.playerTurn = this.players[0].mark;
        }
    };

    takeTurn = (row: number, col: number, playerNumber: number) => {
        if (this.playerTurn !== -1) {
            if (this.game.placeMark(row, col, playerNumber)) {
                if (this.victoryConditionFound(playerNumber)) {
                    /*  Prevent players from taking additional turns until
                    game is reset */
                    this.playerTurn = -1;
                    return playerNumber;
                } else {
                    if (this.drawConditionFound()) {
                        /*  Prevent players from taking additional turns until
                         game is reset */
                        this.playerTurn = -1;
                        return 3;
                    }
                    /*  In a singleplayer game, the computer will always be
                    the second player in the player's array */
                    if (this.placeComputerMark()) {
                        if (this.victoryConditionFound(this.players[1].mark)) {
                            /*  Prevent players from taking additional turns until
                        game is reset */
                            this.playerTurn = -1;
                            return this.players[1].mark;
                        } else if (this.drawConditionFound()) {
                            /*  Prevent players from taking additional turns until
                            game is reset */
                            this.playerTurn = -1;
                            return 3;
                        } else {
                            return 0;
                        }
                    }
                }
            }

            return -1;
        } else {
            return -1;
        }
    };

    /*  Find first available space on gameboard and place mark
        TODO: Replace this logic with more game-friendly logic */
    placeComputerMark = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.game.getBoard()[i][j] === 0) {
                    /*  In a singleplayer game, the computer will always be
                    the second player in the player's array */
                    return this.game.placeMark(i, j, this.players[1].mark);
                }
            }
        }

        return false;
    };
}
