import EventEmitter from 'events';
import { Player } from './player';
import { TicTacToeBoard } from './ticTacToeBoard';
import { BoardPosition, Mark } from './enums';

//  A TurnHandler object is responsible for notifying all players within a
//  Session whenever a player successfully takes their turn
export class TurnHandler {
    currentMarkTurn: Mark;
    eventEmitters: EventEmitter[];

    constructor() {
        // The first turn of a new Session is always taken by Mark One
        this.currentMarkTurn = Mark.ONE;
        this.eventEmitters = new Array<EventEmitter>();
    }

    //  Obtains a player's individual EventEmitter for later usage
    attachTurnEmitter = (player: Player) => {
        this.eventEmitters.push(player.eventListener);
    };

    //  Notifies all players that a new turn is in progress
    emitTurn = () => {
        this.eventEmitters.forEach((eventEmitter) => {
            eventEmitter.emit('new-turn', this.currentMarkTurn);
        });
    };

    //  Attempts to process a player's turn request. If successfully, it will
    //  emit the next player's turn and return true. Otherwise, it will return
    //  false
    handle_turn = (
        game: TicTacToeBoard,
        player: Player,
        boardPosition: BoardPosition
    ) => {
        if (game.placeMark(boardPosition.row, boardPosition.col, player.mark)) {
            this.currentMarkTurn =
                player.mark === Mark.ONE ? Mark.TWO : Mark.ONE;

            this.emitTurn();

            return true;
        }

        return false;
    };
}
