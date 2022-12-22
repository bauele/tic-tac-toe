import { fireEvent, render, screen } from '@testing-library/react';

import { PlayGame } from '../components/PlayGame';

describe('PlayGame', () => {
    it('should render a board with 9 spaces', () => {
        render(<PlayGame />);

        const boardSpaces = screen.getAllByRole('button');
        expect(boardSpaces.length).toEqual(9);
    });

    it('should render a board with -1 as the value for each space', () => {
        render(<PlayGame />);

        const boardSpaces = screen.getAllByRole('button', {
            name: 'empty-space',
        });
        expect(boardSpaces.length).toEqual(9);
    });

    it('should update the board when a space is clicked by player one', () => {
        const { rerender } = render(<PlayGame />);

        const boardSpaces = screen.getAllByRole('button', {
            name: 'empty-space',
        });

        fireEvent.click(boardSpaces[5]);

        rerender(<PlayGame />);

        const playerOneSpace = screen.getByRole('button', { name: 'x-mark' });
        expect(playerOneSpace).toBeTruthy();
    });

    it('should update the board when a space receives an enter key press from player one', () => {
        const { rerender } = render(<PlayGame />);

        const boardSpaces = screen.getAllByRole('button', {
            name: 'empty-space',
        });

        fireEvent.keyDown(boardSpaces[1], {
            key: 'Enter',
            code: 'Enter',
            charCode: 13,
        });

        rerender(<PlayGame />);

        const playerOneSpace = screen.getByRole('button', { name: 'x-mark' });
        expect(playerOneSpace).toBeTruthy();
    });

    it('should update the board when a space receives a space key press from player one', () => {
        const { rerender } = render(<PlayGame />);

        const boardSpaces = screen.getAllByRole('button', {
            name: 'empty-space',
        });

        fireEvent.keyDown(boardSpaces[4], {
            key: 'Space',
            code: 'Space',
            charCode: 32,
        });

        rerender(<PlayGame />);

        const playerOneSpace = screen.getByRole('button', { name: 'x-mark' });
        expect(playerOneSpace).toBeTruthy();
    });

    it("should be player two's turn after player one places their first mark", () => {
        const { rerender } = render(<PlayGame />);

        const boardSpaces = screen.getAllByRole('button', {
            name: 'empty-space',
        });

        fireEvent.click(boardSpaces[0]);

        rerender(<PlayGame />);

        const newBoardSpaces = screen.getAllByRole('button', {
            name: 'empty-space',
        });

        fireEvent.click(newBoardSpaces[0]);

        rerender(<PlayGame />);

        const playerTwoSpace = screen.getByRole('button', { name: 'o-mark' });
        expect(playerTwoSpace).toBeTruthy();
    });
});
