type GameboardSpaceProps = {
    children: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
    onMouseOver?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
    highlight?: string;
};

export const GameboardSpace = ({
    children,
    onClick,
    onKeyDown,
    onMouseOver,
    onMouseLeave,
    highlight,
}: GameboardSpaceProps) => {
    const highlightSpace = () => {
        if (highlight === 'light-yellow') {
            return `bg-light-yellow box-shadow-light-yellow`;
        } else if (highlight === 'light-blue') {
            return `bg-light-blue box-shadow-light-blue`;
        } else {
            return `bg-semi-dark-navy box-shadow-semi-dark-navy`;
        }
    };

    return (
        <button
            className={`gameboard-space ${highlightSpace()} border-radius-15`}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </button>
    );
};
