import { describe, it, expect } from '@jest/globals';

import { TicTacToeBoard } from '../src/ts/ticTacToeBoard';

describe('tic tac toe board', () => {
    it('should initially return a 3 by 3 array of 0s', () => {
        const ticTacToeBoard = new TicTacToeBoard();
        expect(ticTacToeBoard.getBoard()).toEqual([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });

    it('should allow a mark to be placed in an available space', () => {
        const ticTacToeBoard = new TicTacToeBoard();
        expect(ticTacToeBoard.placeMark(0, 0, 1)).toBeTruthy();
        expect(ticTacToeBoard.getBoard()).toEqual([
            [1, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });

    it('should not a mark to be placed in a taken space', () => {
        const ticTacToeBoard = new TicTacToeBoard();
        ticTacToeBoard.placeMark(0, 0, 1);

        expect(ticTacToeBoard.placeMark(0, 0, 2)).toBeFalsy();
        expect(ticTacToeBoard.getBoard()).toEqual([
            [1, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });

    it('should not accept arguments for rows or columns outside its range', () => {
        const ticTacToeBoard = new TicTacToeBoard();

        expect(() => {
            ticTacToeBoard.placeMark(5, 0, 1);
        }).toThrow(RangeError);

        expect(() => {
            ticTacToeBoard.placeMark(2, -1, 1);
        }).toThrow(RangeError);

        expect(() => {
            ticTacToeBoard.placeMark(-1, -3, 1);
        }).toThrow(RangeError);

        expect(() => {
            ticTacToeBoard.placeMark(-2, -2, 1);
        }).toThrow(RangeError);

        expect(ticTacToeBoard.getBoard()).toEqual([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    });
});
