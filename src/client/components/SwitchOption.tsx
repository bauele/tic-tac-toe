import { MouseEventHandler } from 'react';

type SwitchOptionProps = {
    className?: string;
    ariaChecked?: boolean;
    children?: React.ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};

export const SwitchOption = ({
    className,
    ariaChecked,
    children,
    onClick,
    onKeyDown,
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
