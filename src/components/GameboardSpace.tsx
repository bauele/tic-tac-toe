type GameboardSpaceProps = {
    children: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
};

export const GameboardSpace = ({
    children,
    onClick,
    onKeyDown,
}: GameboardSpaceProps) => {
    return (
        <button
            className="gameboard-space bg-semi-dark-navy box-shadow-semi-dark-navy border-radius-15"
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            {children}
        </button>
    );
};
