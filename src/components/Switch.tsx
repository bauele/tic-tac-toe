import { SwitchOption } from './SwitchOption';

type SwitchProps = {
    className?: string;
    selected: number;
    optionOne: any;
    optionTwo: any;
    switchOptionClassName: { default: string; selected: string };
    onChange: (value: number) => void;
};

export const Switch = ({
    className,
    selected,
    optionOne,
    optionTwo,
    switchOptionClassName,
    onChange,
}: SwitchProps) => {
    const switchOptions = [optionOne, optionTwo];

    const setValue = (value: number) => {
        onChange(value);
        animateToggle(value);
    };

    /*  Animate the switch by manually adding a CSS class that specifies an
        animation and removing any previously applied animations */
    const animateToggle = (value: number) => {
        const switchOptionSelected = document.querySelector('.switch-toggled');

        if (value === 0) {
            switchOptionSelected?.classList.remove('switch-toggled-move-right');
            switchOptionSelected?.classList.add('switch-toggled-move-left');
        } else if (value === 1) {
            switchOptionSelected?.classList.remove('switch-toggled-move-left');
            switchOptionSelected?.classList.add('switch-toggled-move-right');
        }
    };

    return (
        <div className={className}>
            <div className="switch-toggled bg-color-silver border-radius-10"></div>

            {switchOptions.map((value: any, index: number) => {
                return (
                    <SwitchOption
                        key={index}
                        className={
                            index === selected
                                ? switchOptionClassName.selected
                                : switchOptionClassName.default
                        }
                        ariaChecked={index === selected ? true : false}
                        onClick={() => setValue(index)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.code == 'Space') {
                                setValue(index);
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
