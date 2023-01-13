import { describe, it, expect } from '@jest/globals';
import { eventNames } from 'process';
import { Mark } from '../src/ts/enums';
import { Player, PlayerType } from '../src/ts/player';
import { Session } from '../src/ts/session';
import { playerAIStrategy } from '../src/ts/player';
var events = require('events');

it('should create a new session', () => {
    const session = new Session();
    expect(session).toBeTruthy();
});

describe('adding players to a session', () => {
    it('should add a player to the session', () => {
        const session = new Session();
        const playerOne: Player = {
            name: 'player-one',
            type: PlayerType.HUMAN,
            mark: Mark.ONE,
            eventListener: new events.EventEmitter(),
        };

        session.addPlayer(playerOne);

        expect(session.getPlayers().length).toEqual(1);
    });

    it('should let a second player join the session', () => {
        const session = new Session();
        const playerOne = {
            name: 'player-one',
            type: PlayerType.HUMAN,
            mark: Mark.ONE,
            eventListener: new events.EventEmitter(),
        };

        const playerTwo = {
            name: 'player-one',
            type: PlayerType.HUMAN,
            mark: Mark.TWO,
            eventListener: new events.EventEmitter(),
        };

        session.addPlayer(playerOne);
        session.addPlayer(playerTwo);

        expect(session.getPlayers().length).toEqual(2);
    });

    it('should not let a third player join the session', () => {
        const session = new Session();
        const playerOne = {
            name: 'player-one',
            type: PlayerType.HUMAN,
            mark: Mark.ONE,
            eventListener: new events.EventEmitter(),
        };

        const playerTwo = {
            name: 'player-one',
            type: PlayerType.AI,
            mark: Mark.TWO,
            eventListener: new events.EventEmitter(),
        };

        const playerThree = {
            name: 'player-one',
            type: PlayerType.HUMAN,
            mark: Mark.ONE,
            eventListener: new events.EventEmitter(),
        };

        session.addPlayer(playerOne);
        session.addPlayer(playerTwo);

        expect(() => session.addPlayer(playerThree)).toThrow(
            'Game is already full'
        );
        expect(session.getPlayers().length).toEqual(2);
    });
});

describe('taking turns', () => {
    //  For the purpose of this test, it does not matter how the game was set
    //  up, nor does it matter if the game is being played by humans or AI. It
    //  Simply expects that given a session with assigned players, a turn
    //  should be able to be taken.

    it('should let the AI take the first turn if they are using Mark One', () => {
        const session = new Session();
        const playerOne = {
            name: 'player-one',
            type: PlayerType.AI,
            mark: Mark.ONE,
            eventListener: new events.EventEmitter(),
        };

        const playerTwo = {
            name: 'player-one',
            type: PlayerType.HUMAN,
            mark: Mark.TWO,
            eventListener: new events.EventEmitter(),
        };

        playerOne.eventListener.on('new-turn', (mark: Mark) => {
            if (mark === playerOne.mark) {
                //  Look at board and determine where to go next
                let boardPosition = playerAIStrategy(session.getGame());
                //console.log(boardPosition);

                //  If a valid position was found
                if (boardPosition) {
                    session.takeTurn(playerOne, boardPosition);
                }
            }
        });

        session.addPlayer(playerOne);
        session.addPlayer(playerTwo);
        session.start();
        expect(session.getGame().getBoard()).toEqual([
            [Mark.ONE, Mark.NONE, Mark.NONE],
            [Mark.NONE, Mark.NONE, Mark.NONE],
            [Mark.NONE, Mark.NONE, Mark.NONE],
        ]);
    });

    it('should let two AI players continously take turns', () => {
        const session = new Session();
        const playerOne = {
            name: 'player-one',
            type: PlayerType.AI,
            mark: Mark.ONE,
            eventListener: new events.EventEmitter(),
        };

        session.addPlayer(playerOne);

        playerOne.eventListener.on('new-turn', (mark: Mark) => {
            //console.log('playerOne heard event with mark: ', mark);

            if (mark === playerOne.mark) {
                // console.log('Player 1 is going');
                //  Look at board and determine where to go next
                let boardPosition = playerAIStrategy(session.getGame());

                //  If a valid position was found
                if (boardPosition) {
                    session.takeTurn(playerOne, boardPosition);
                }
            }
        });

        const playerTwo = {
            name: 'player-two',
            type: PlayerType.AI,
            mark: Mark.TWO,
            eventListener: new events.EventEmitter(),
        };

        session.addPlayer(playerTwo);

        playerTwo.eventListener.on('new-turn', (mark: Mark) => {
            //console.log('playerTwo heard event with mark ', mark);

            if (mark === playerTwo.mark) {
                //console.log('Player 2 is going');
                //  Look at board and determine where to go next
                let boardPosition = playerAIStrategy(session.getGame());
                //console.log(boardPosition);

                //  If a valid position was found
                if (boardPosition) {
                    session.takeTurn(playerTwo, boardPosition);
                }
            }
        });

        session.start();
        expect(session.getGame().getBoard()).toEqual([
            [Mark.ONE, Mark.TWO, Mark.ONE],
            [Mark.TWO, Mark.ONE, Mark.TWO],
            [Mark.ONE, Mark.NONE, Mark.NONE],
        ]);
    });

    it('should let an AI and Human player alternate their turns', () => {
        const session = new Session();
        const playerOne = {
            name: 'player-one',
            type: PlayerType.HUMAN,
            mark: Mark.ONE,
            eventListener: new events.EventEmitter(),
        };

        const playerTwo = {
            name: 'player-one',
            type: PlayerType.AI,
            mark: Mark.TWO,
            eventListener: new events.EventEmitter(),
        };

        session.addPlayer(playerOne);
        session.addPlayer(playerTwo);

        playerTwo.eventListener.on('new-turn', (mark: Mark) => {
            if (mark === playerTwo.mark) {
                //  Look at board and determine where to go next
                let boardPosition = playerAIStrategy(session.getGame());

                //  If a valid position was found
                if (boardPosition) {
                    session.takeTurn(playerTwo, boardPosition);
                }
            }
        });

        session.takeTurn(playerOne, { row: 1, col: 1 });
        session.takeTurn(playerOne, { row: 2, col: 2 });
        session.takeTurn(playerOne, { row: 0, col: 2 });

        expect(session.getGame().getBoard()).toEqual([
            [Mark.TWO, Mark.TWO, Mark.ONE],
            [Mark.TWO, Mark.ONE, Mark.NONE],
            [Mark.NONE, Mark.NONE, Mark.ONE],
        ]);
    });
});
