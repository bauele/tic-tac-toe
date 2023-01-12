import EventEmitter from 'events';
import { Player } from './player';
import { GameStatus, TicTacToeBoard } from './ticTacToeBoard';
import { BoardPosition, Mark } from './enums';

//  A TurnHandler object is responsible for notifying all players within a
//  Session whenever a player successfully takes their turn
export class TurnHandler {
    firstTurn: Mark;
    currentMarkTurn: Mark;
    eventEmitters: EventEmitter[];

    constructor() {
        // The first turn of a new Session is always taken by Mark One
        this.firstTurn = Mark.ONE;
        this.currentMarkTurn = this.firstTurn;
        this.eventEmitters = new Array<EventEmitter>();
    }

    getCurrentMarkTurn = () => {
        return this.currentMarkTurn;
    };

    swapCurrentMarkTurn = () => {
        this.currentMarkTurn =
            this.currentMarkTurn === Mark.ONE ? Mark.TWO : Mark.ONE;
    };

    swapFirstTurn = () => {
        this.firstTurn = this.firstTurn === Mark.ONE ? Mark.TWO : Mark.ONE;
    };

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
        //  Ensure that the game is still in progress, and that the player
        //  attempting to take their turn is actually allowed to do so
        if (
            game.getGameState().status === GameStatus.IN_PROGRESS &&
            player.mark === this.currentMarkTurn
        ) {
            if (
                game.placeMark(
                    boardPosition.row,
                    boardPosition.col,
                    player.mark
                )
            ) {
                //  If a player placed their mark successfully, determine the
                //  who will go next if the game is still in progress
                if (game.getGameState().status === GameStatus.IN_PROGRESS) {
                    this.swapCurrentMarkTurn();
                }

                this.emitTurn();

                return true;
            }
            return false;
        } else {
            console.log('Player blocked from taking turn');
            return false;
        }
    };
}
