import { render, screen } from '@testing-library/react';

import { Gameboard } from '../components/Gameboard';

describe('Gameboard', () => {
    it('should render a button for each value in the board prop - 5 values', () => {
        const mock = jest.fn();
        const mockFunc = new mock();

        const board = [[1, 2, 3, 4], [5]];

        render(<Gameboard board={board} onUpdate={mockFunc} />);

        let gameButtons = screen.queryAllByRole('button');
        expect(gameButtons.length).toEqual(5);
    });

    it('should render a button for each value in the board prop - 8 values', () => {
        const mock = jest.fn();
        const mockFunc = new mock();

        const board = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ];

        render(<Gameboard board={board} onUpdate={mockFunc} />);

        let gameButtons = screen.queryAllByRole('button');
        expect(gameButtons.length).toEqual(8);
    });

    it('should render a button for each value in the board prop - 9 values', () => {
        const mock = jest.fn();
        const mockFunc = new mock();

        const board = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ];

        render(<Gameboard board={board} onUpdate={mockFunc} />);

        let gameButtons = screen.queryAllByRole('button');
        expect(gameButtons.length).toEqual(9);
    });

    it('should render buttons with the correct label - 9 values', () => {
        const mock = jest.fn();
        const mockFunc = new mock();

        const board = [
            [0, 1, 2],
            [1, 2, 0],
            [1, 2, 2],
        ];

        render(<Gameboard board={board} onUpdate={mockFunc} />);

        let xMarks = screen.queryAllByRole('button', { name: 'x-mark' });
        let oMarks = screen.queryAllByRole('button', { name: 'o-mark' });
        expect(xMarks.length).toEqual(3);
        expect(oMarks.length).toEqual(4);
    });
});
