const uuid = require('uuid');
import { BoardPosition } from './enums';
import { Player } from '../ts/player';
import { GameStatus, TicTacToeBoard } from './ticTacToeBoard';
import { TurnHandler } from './turnHandler';

export interface SessionScoreInfo {
    markOneWins: number;
    markTwoWins: number;
    draws: number;
}

//  A Session object represents a given game, its players, and information
//  about the game's score and turn information
export class Session {
    sessionId: string;
    sessionScore: SessionScoreInfo;
    currentGame: TicTacToeBoard;
    turnHandler: TurnHandler;
    players: Player[];

    constructor() {
        this.sessionId = uuid.v4();

        this.sessionScore = {
            markOneWins: 0,
            markTwoWins: 0,
            draws: 0,
        };

        this.currentGame = new TicTacToeBoard();
        this.turnHandler = new TurnHandler();
        this.players = new Array<Player>();
    }

    getSessionId = () => {
        return this.sessionId;
    };

    getTurnHandler = () => {
        return this.turnHandler;
    };

    start = () => {
        this.turnHandler.emitTurn();
    };

    restartGame = () => {
        this.currentGame = new TicTacToeBoard();
        this.turnHandler.swapCurrentMarkTurn();
        this.start();
    };

    takeTurn = (player: Player, boardPosition: BoardPosition) => {
        this.turnHandler.handle_turn(this.currentGame, player, boardPosition);

        const gameStatus = this.getGame().getGameState().status;
        if (gameStatus === GameStatus.MARK_ONE_VICTORY) {
            this.addMarkOneWin();
        } else if (gameStatus === GameStatus.MARK_TWO_VICTORY) {
            this.addMarkTwoWin();
        } else if (gameStatus === GameStatus.DRAW) {
            this.addDraw();
        }
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

    getSessionScore = () => {
        return this.sessionScore;
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
