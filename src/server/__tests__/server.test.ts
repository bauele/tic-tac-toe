import { describe, it, expect } from '@jest/globals';

import { SinglePlayerGameInstance } from '../src/ts/singlePlayerGameInstance';
import { createGame } from '../src/ts/server';
import { GameInstance } from '../src/ts/gameInstance';

describe('server', () => {
    it('should create a new singleplayer game and return the object', () => {
        const game = createGame({ mark: 1, mode: 'singlePlayer' });
        expect(game).toBeTruthy();
        expect(game).toBeInstanceOf(SinglePlayerGameInstance);
    });

    it('should throw an error when attempting to create a game with invalid mark value', () => {
        expect((game: GameInstance) =>
            createGame({ mark: 0, mode: 'singlePlayer' })
        ).toThrow(new RangeError('mark argument must be either 1 or 2'));
    });

    it('should throw an error when attempting to create a game with invalid mode value', () => {
        expect(() => createGame({ mark: 1, mode: 'unsupportedMode' })).toThrow(
            new Error('mode argument is not a valid game mode')
        );
    });
});
