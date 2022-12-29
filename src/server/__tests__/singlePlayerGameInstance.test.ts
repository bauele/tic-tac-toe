import { describe, it, expect } from '@jest/globals';

import { SinglePlayerGameInstance } from '../src/ts/singlePlayerGameInstance';

const findMarkInBoard = (mark: number, board: number[][]) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === mark) {
                return true;
            }
        }
    }

    return false;
};

describe('single player game instance', () => {
    it('should have a blank board for the human player to go first for a new game if they picked X', () => {
        const player = { name: 'player-one', mark: 1 };
        const singlePlayerGameInstance = new SinglePlayerGameInstance(
            'game-id',
            player
        );

        expect(singlePlayerGameInstance.getBoard()).toEqual([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });

    it('should have a non-blank board for the human player to go second for a new game if they picked O', () => {
        const player = { name: 'player-one', mark: 2 };
        const singlePlayerGameInstance = new SinglePlayerGameInstance(
            'game-id',
            player
        );

        expect(
            findMarkInBoard(2, singlePlayerGameInstance.getBoard())
        ).toBeTruthy();
    });

    it('should have the computer take a turn right after the player', () => {
        const player = { name: 'player-one', mark: 1 };
        const singlePlayerGameInstance = new SinglePlayerGameInstance(
            'game-id',
            player
        );

        expect(singlePlayerGameInstance.takeTurn(2, 1, 1)).toEqual(0);

        const board = singlePlayerGameInstance.getBoard();
        expect(board[2][1]).toEqual(1);

        expect(findMarkInBoard(2, board)).toBeTruthy();
    });
});
