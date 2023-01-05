import { BoardPosition, Mark } from './enums';
import { Player } from '../ts/player';
import { TicTacToeBoard } from './ticTacToeBoard';
import { EventEmitter } from 'stream';

//  A TurnHandler object is responsible for notifying all players within a
//  Session whenever a player successfully takes their turn
class TurnHandler {
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

interface SessionScoreInfo {
    markOneWins: number;
    markTwoWins: number;
    draws: number;
}

//  A Session object represents a given game, its players, and information
//  about the game's score and turn information
export class Session {
    sessionScore: SessionScoreInfo;
    currentGame: TicTacToeBoard;
    turnHandler: TurnHandler;
    players: Player[];

    constructor() {
        this.sessionScore = {
            markOneWins: 0,
            markTwoWins: 0,
            draws: 0,
        };

        this.currentGame = new TicTacToeBoard();
        this.turnHandler = new TurnHandler();
        this.players = new Array<Player>();
    }

    start = () => {
        this.turnHandler.emitTurn();
    };

    takeTurn = (player: Player, boardPosition: BoardPosition) => {
        this.turnHandler.handle_turn(this.currentGame, player, boardPosition);
    };

    //  TODO: Prevent a player from joining using the same mark as the existing
    //  player
    addPlayer = (player: Player) => {
        //  If player.type is AI, register an event handler to it
        if (this.players.length !== 2) {
            this.turnHandler.attachTurnEmitter(player);
            this.players.push(player);
        } else {
            throw new Error('Game is already full');
        }
    };

    removePlayer = (player: Player) => {};

    getPlayers = () => {
        return this.players;
    };

    getGame = () => {
        return this.currentGame;
    };

    addMarkOneWin = () => {
        this.sessionScore.markOneWins++;
    };

    addMarkTwoWin = () => {
        this.sessionScore.markTwoWins++;
    };

    addDraw = () => {
        this.sessionScore.draws++;
    };
}
