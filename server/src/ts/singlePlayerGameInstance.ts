import { GameInstance } from './gameInstance';

export class SinglePlayerGameInstance extends GameInstance {
    takeTurn = (row: number, col: number, playerNumber: number) => {
        if (this.game.placeMark(row, col, playerNumber)) {
            console.log('Computer is going for player 2...');
            if (this.placeComputerMark()) {
                return true;
            }

            return false;
        } else {
            return false;
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
