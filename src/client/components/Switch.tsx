import { useEffect, useRef } from 'react';

import { SwitchOption } from './SwitchOption';

type SwitchProps = {
    //  Prop indicating which option in the Switch is currently active. A
    //  value of 0 refers to optionOne, likewise a value of 1 refers to
    //  optionTwo
    selectedOption: number;

    // Prop indicating the visual representation of each SwitchOption. This
    // can be anything from a div, an image, a string, or more
    optionOne: any;
    optionTwo: any;

    //  Prop indicating a function provided by parent that is called whenever
    //  value of the Switch is changed
    onChange: (value: number) => void;

    //  Optional prop that would allow for overiding the default css rules
    //  applied to a particular Switch. See below for more information on
    //  what classes are applied to the Switch and SwitchOption components
    //  by default and after interaction has occured
    id?: string;
};

export const Switch = ({
    selectedOption,
    optionOne,
    optionTwo,
    onChange,
    id,
}: SwitchProps) => {
    //  An array maintaing both options so that they can be easily mapped later
    const switchOptions = [optionOne, optionTwo];

    //  Refers to the div element responsible for visually indicating which
    //  SwitchOption is selected and performing an animation when said value
    //  is changed
    const selectedOptionIndicator = useRef<HTMLDivElement>(null);

    //  Refers to the value of selectedOption before its most recent change.
    //  This is used to assist in animating the Switch correctly. Initially
    //  this will be null, which prevents the Switch from running an
    //  animation before any interaction has happened to the Switch
    const previouslySelectedOption = usePrevious(selectedOption);
    function usePrevious(value: number) {
        const ref = useRef<number | null>(null);
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    //  Whenever selectedOption has been changed, the Switch will play an
    //  animation showing the value changing
    useEffect(() => {
        if (
            previouslySelectedOption !== null &&
            previouslySelectedOption !== selectedOption
        ) {
            animateToggle(selectedOption);
        }
    }, [selectedOption]);

    //  These classes are applied to SwitchOptions when they are unselected
    //  or selected
    const unselectedClasses =
        'switch-option switch-radio-accessibiltiy token-image-filter-silver';
    const selectedClasses =
        'switch-option switch-radio-accessibiltiy token-image-filter-dark-navy';

    /*  Animate the switch by manually adding a CSS class that specifies an
        animation and removing any previously applied animation rules */
    const animateToggle = (value: number) => {
        if (value === 0) {
            selectedOptionIndicator.current?.classList.remove(
                'switch-option-indicator-move-right'
            );
            selectedOptionIndicator.current?.classList.add(
                'switch-option-indicator-move-left'
            );
        } else if (value === 1) {
            selectedOptionIndicator.current?.classList.remove(
                'switch-option-indicator-move-left'
            );
            selectedOptionIndicator.current?.classList.add(
                'switch-option-indicator-move-right'
            );
        }
    };

    return (
        <div id={id} className="new-game-switch-box-inner border-radius-10">
            <div
                ref={selectedOptionIndicator}
                className="switch-option-indicator bg-color-silver border-radius-10"
            ></div>

            {switchOptions.map((value: any, index: number) => {
                return (
                    <SwitchOption
                        key={index}
                        className={
                            index === selectedOption
                                ? selectedClasses
                                : unselectedClasses
                        }
                        ariaChecked={index === selectedOption ? true : false}
                        onClick={() => onChange(index)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.code === 'Space') {
                                onChange(index);
                            }
                        }}
                    >
                        {value}
                    </SwitchOption>
                );
            })}
        </div>
    );
};
