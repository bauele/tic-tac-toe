import { MouseEventHandler } from 'react';

type SwitchOptionProps = {
    //  Prop indicating the visible element for the SwitchOption
    children: React.ReactNode;

    //  Prop indicating the parent function to call after a click event
    onClick: MouseEventHandler<HTMLDivElement>;

    //  Optional prop indicating the parent function to call after recieving
    //  a keyboard event
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;

    //  Optional prop indicating which classes to set to the div containing
    //  the children
    className?: string;

    //  Optional prop included for accessibility
    ariaChecked?: boolean;
};

export const SwitchOption = ({
    children,
    onClick,
    onKeyDown,
    className,
    ariaChecked,
}: SwitchOptionProps) => {
    return (
        <div
            role="radio"
            tabIndex={0}
            aria-checked={ariaChecked}
            className={className}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            {children}
        </div>
    );
};
