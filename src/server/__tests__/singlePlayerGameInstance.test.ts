import { describe, it, expect } from '@jest/globals';

import { SinglePlayerGameInstance } from '../src/ts/singlePlayerGameInstance';

describe('single player game instance', () => {
    it('should initially have an empty board', () => {
        const singlePlayerGameInstance = new SinglePlayerGameInstance(
            'game-id'
        );

        expect(singlePlayerGameInstance.getBoard()).toEqual([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });

    it('should have the computer take a turn right after the player', () => {
        const singlePlayerGameInstance = new SinglePlayerGameInstance(
            'game-id'
        );

        expect(singlePlayerGameInstance.takeTurn(2, 1, 1)).toEqual(0);

        const board = singlePlayerGameInstance.getBoard();
        expect(board[2][1]).toEqual(1);

        let expectedMark = 2;
        let foundExpectedMark = false;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === expectedMark) {
                    foundExpectedMark = true;
                    break;
                }
            }
        }

        expect(foundExpectedMark).toBeTruthy();
    });
});
