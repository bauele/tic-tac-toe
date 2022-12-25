import { describe, it, expect } from '@jest/globals';

import { LocalMultiplayerGameInstance } from '../src/ts/localMultiplayerGameInstance';

describe('single player game instance', () => {
    it('should initially have an empty board', () => {
        const localMultiplayerGameInstance = new LocalMultiplayerGameInstance(
            'game-id'
        );

        expect(localMultiplayerGameInstance.getBoard()).toEqual([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });

    it('should have player 2 take a turn right after player 1', () => {
        const localMultiplayerGameInstance = new LocalMultiplayerGameInstance(
            'game-id'
        );

        expect(localMultiplayerGameInstance.takeTurn(2, 1, 1)).toEqual(0);
        expect(localMultiplayerGameInstance.getBoard()[2][1]).toEqual(1);

        expect(localMultiplayerGameInstance.takeTurn(1, 0, 2)).toEqual(0);
        expect(localMultiplayerGameInstance.getBoard()[1][0]).toEqual(2);
    });

    it('should detect a horizontal victory from player 1', () => {
        const localMultiplayerGameInstance = new LocalMultiplayerGameInstance(
            'game-id'
        );

        expect(localMultiplayerGameInstance.takeTurn(0, 0, 1)).toEqual(0);
        expect(localMultiplayerGameInstance.takeTurn(1, 0, 2)).toEqual(0);
        expect(localMultiplayerGameInstance.takeTurn(0, 1, 1)).toEqual(0);
        expect(localMultiplayerGameInstance.takeTurn(1, 1, 2)).toEqual(0);
        expect(localMultiplayerGameInstance.takeTurn(0, 2, 1)).toEqual(1);
    });
});
