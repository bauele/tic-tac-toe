import { render, screen } from '@testing-library/react';

import { NewGameMenu } from '../components/NewGameMenu';

describe('NewGameMenu', () => {
    const mock = jest.fn();
    const mockFunc = new mock();

    it('should contain relevant text in the document', () => {
        render(<NewGameMenu gameModeButtonOnClick={mockFunc} />);

        const selectPlayerMarkMessage = screen.getByText(
            'Pick Player 1’s Mark'
        );

        const xGoesFirstMessage = screen.getByText('Remember: X Goes First');

        expect(selectPlayerMarkMessage).toBeInTheDocument();
        expect(xGoesFirstMessage).toBeInTheDocument();
    });

    it('should contain two buttons for starting games', () => {
        render(<NewGameMenu gameModeButtonOnClick={mockFunc} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(2);
    });
});
