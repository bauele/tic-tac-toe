import { GameInstance } from './gameInstance';

/*  WARNING! BAD DESIGN!
    This function implements the abstract function defined in the
    base class, but does not actually make use of the playerTurn
    parameter in its logic. */
export class LocalMultiplayerGameInstance extends GameInstance {
    takeTurn = (row: number, col: number, playerNumber: number) => {
        if (this.placeMark(row, col, this.playerTurn)) {
            if (this.victoryConditionFound(this.playerTurn)) {
                return this.playerTurn;
            } else {
                // If nobody won, flip the player turn variable
                this.playerTurn = this.playerTurn === 1 ? 2 : 1;
                return 0;
            }
        } else {
            return -1;
        }
    };
}
