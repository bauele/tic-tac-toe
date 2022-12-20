import { fireEvent, render, screen } from '@testing-library/react';
import { NewGameMenu } from '../components/NewGameMenu';

import { Switch } from '../components/Switch';

describe('Switch', () => {
    const mock = jest.fn();
    const mockFunc = new mock();

    it('should contain two elements with radio roles in the document', () => {
        render(
            <Switch
                selected={0}
                optionOne={'X'}
                optionTwo={'O'}
                switchOptionClassName={{
                    default: 'default-class',
                    selected: 'default-class selected-class',
                }}
                onChange={mockFunc}
            />
        );

        const radioElements = screen.getAllByRole('radio');
        expect(radioElements.length).toBe(2);
    });

    it('should apply the selected-class to the clicked option', () => {
        let selected = 0;
        const setSelected = (value: number) => {
            selected = value;
        };

        const { rerender } = render(
            <Switch
                selected={selected}
                optionOne={'X'}
                optionTwo={'O'}
                switchOptionClassName={{
                    default: 'default-class',
                    selected: 'selected-class',
                }}
                onChange={setSelected}
            />
        );

        const [optionOne, optionTwo] = screen.getAllByRole('radio');
        fireEvent.click(optionTwo);

        rerender(
            <Switch
                selected={selected}
                optionOne={'X'}
                optionTwo={'O'}
                switchOptionClassName={{
                    default: 'default-class',
                    selected: 'default-class selected-class',
                }}
                onChange={setSelected}
            />
        );

        expect(optionOne).not.toHaveClass('selected-class');
        expect(optionTwo).toHaveClass('default-class selected-class');
    });

    it('should apply the selected-class to the option if enter is pressed', () => {
        let selected = 0;
        const setSelected = (value: number) => {
            selected = value;
        };

        const { rerender } = render(
            <Switch
                selected={selected}
                optionOne={'X'}
                optionTwo={'O'}
                switchOptionClassName={{
                    default: 'default-class',
                    selected: 'selected-class',
                }}
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
                selected={selected}
                optionOne={'X'}
                optionTwo={'O'}
                switchOptionClassName={{
                    default: 'default-class',
                    selected: 'default-class selected-class',
                }}
                onChange={setSelected}
            />
        );

        expect(optionOne).not.toHaveClass('selected-class');
        expect(optionTwo).toHaveClass('default-class selected-class');
    });

    it('should apply the selected-class to the option if space is pressed', () => {
        let selected = 0;
        const setSelected = (value: number) => {
            selected = value;
        };

        const { rerender } = render(
            <Switch
                selected={selected}
                optionOne={'X'}
                optionTwo={'O'}
                switchOptionClassName={{
                    default: 'default-class',
                    selected: 'selected-class',
                }}
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
                selected={selected}
                optionOne={'X'}
                optionTwo={'O'}
                switchOptionClassName={{
                    default: 'default-class',
                    selected: 'default-class selected-class',
                }}
                onChange={setSelected}
            />
        );

        expect(optionOne).not.toHaveClass('selected-class');
        expect(optionTwo).toHaveClass('default-class selected-class');
    });
});
