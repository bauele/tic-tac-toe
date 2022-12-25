import { GameInstance } from './gameInstance';

export class SinglePlayerGameInstance extends GameInstance {
    takeTurn = (row: number, col: number, playerNumber: number) => {
        if (this.game.placeMark(row, col, playerNumber)) {
            if (this.victoryConditionFound(playerNumber)) {
                return playerNumber;
            } else if (this.placeComputerMark()) {
                // TODO: Don't hardcode computer's player number
                if (this.victoryConditionFound(2)) {
                    return 2;
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
                    return this.game.placeMark(i, j, 2);
                }
            }
        }

        return false;
    };
}
