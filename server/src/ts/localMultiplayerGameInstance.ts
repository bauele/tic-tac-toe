import { GameInstance } from './gameInstance';

export class LocalMultiplayerGameInstance extends GameInstance {
    takeTurn = (row: number, col: number, playerNumber: number) => {
        if (this.placeMark(row, col, playerNumber)) {
            if (this.victoryConditionFound(playerNumber)) {
                return playerNumber;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    };
}
