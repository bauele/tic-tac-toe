import { fireEvent, render, screen } from '@testing-library/react';
import { NewGameMenu } from '../components/NewGameMenu';

import { Switch } from '../components/Switch';

describe('Switch', () => {
    const mock = jest.fn();
    const mockFunc = new mock();

    it('should contain two elements with radio roles in the document', () => {
        render(
            <Switch
                selectedOption={0}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={mockFunc}
            />
        );

        const radioElements = screen.getAllByRole('radio');
        expect(radioElements.length).toBe(2);
    });

    it('should apply the correct classes to the clicked option', () => {
        let selected = 0;
        const setSelected = (value: number) => {
            selected = value;
        };

        const { rerender } = render(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        const [optionOne, optionTwo] = screen.getAllByRole('radio');
        fireEvent.click(optionTwo);

        rerender(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        expect(optionOne).not.toHaveClass('token-image-filter-dark-navy');
        expect(optionTwo).toHaveClass(
            'switch-option switch-radio-accessibiltiy token-image-filter-dark-navy'
        );
    });

    it('should apply the correct classes to the option if enter is pressed', () => {
        let selected = 0;
        const setSelected = (value: number) => {
            selected = value;
        };

        const { rerender } = render(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        const [optionOne, optionTwo] = screen.getAllByRole('radio');
        fireEvent.keyDown(optionTwo, {
            key: 'Enter',
            code: 'Enter',
            charCode: 13,
        });

        rerender(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        expect(optionOne).not.toHaveClass('token-image-filter-dark-navy');
        expect(optionTwo).toHaveClass(
            'switch-option switch-radio-accessibiltiy token-image-filter-dark-navy'
        );
    });

    it('should apply the correct classes to the option if space is pressed', () => {
        let selected = 0;
        const setSelected = (value: number) => {
            selected = value;
        };

        const { rerender } = render(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        const [optionOne, optionTwo] = screen.getAllByRole('radio');
        fireEvent.keyDown(optionTwo, {
            key: 'Space',
            code: 'Space',
            charCode: 32,
        });

        rerender(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        expect(optionOne).not.toHaveClass('token-image-filter-dark-navy');
        expect(optionTwo).toHaveClass(
            'switch-option switch-radio-accessibiltiy token-image-filter-dark-navy'
        );
    });

    it('should apply the correct classes if optionOne is selected again after optionTwo', () => {
        let selected = 0;
        const setSelected = (value: number) => {
            selected = value;
        };

        const { rerender } = render(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        const [optionOne, optionTwo] = screen.getAllByRole('radio');
        fireEvent.keyDown(optionTwo, {
            key: 'Space',
            code: 'Space',
            charCode: 32,
        });

        rerender(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        fireEvent.click(optionOne);

        rerender(
            <Switch
                selectedOption={selected}
                optionOne={'X'}
                optionTwo={'O'}
                onChange={setSelected}
            />
        );

        expect(optionOne).toHaveClass(
            'switch-option switch-radio-accessibiltiy token-image-filter-dark-navy'
        );
        expect(optionTwo).not.toHaveClass('token-image-filter-dark-navy');
    });
});
