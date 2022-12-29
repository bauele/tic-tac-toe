import { GameInstance } from './gameInstance';
import { Player } from './player';

export class SinglePlayerGameInstance extends GameInstance {
    constructor(gameId: string, player: Player) {
        super(gameId, player);
        this.players.push({
            name: 'CPU',
            mark: player.mark === 1 ? 2 : 1,
            gameId: this.gameId,
        });

        /*  If the human player is not going first, the computer
            should immediately take their turn after game creation */
        if (player.mark !== 1) {
            this.placeComputerMark();
        }
    }

    takeTurn = (row: number, col: number, playerNumber: number) => {
        if (this.game.placeMark(row, col, playerNumber)) {
            if (this.victoryConditionFound(playerNumber)) {
                return playerNumber;
            } else if (this.placeComputerMark()) {
                /*  In a singleplayer game, the computer will always be
                    the second player in the player's array */
                if (this.victoryConditionFound(this.players[1].mark)) {
                    return this.players[1].mark;
                } else {
                    return 0;
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
