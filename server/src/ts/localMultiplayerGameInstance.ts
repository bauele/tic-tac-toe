import { GameInstance } from './gameInstance';

export class LocalMultiplayerGameInstance extends GameInstance {
    takeTurn = (row: number, col: number, playerNumber: number) => {
        return this.placeMark(row, col, playerNumber);
    };
}
